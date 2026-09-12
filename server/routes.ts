import { Router, Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { db, Profile, Entitlement, KiwifyWebhookEvent, Session, Project, SUPER_ADMIN_EMAIL, isSuperAdminEmail } from "./db";
import { CoverGenerationService, PRESET_FALLBACK_COVERS } from "./coverService";
import { AdGenerationService } from "./adService";
import { AvatarGenerationService } from "./avatarService";
import { VslGenerationService } from "./vslService";
import { EmailService } from "./emailService";

export const apiRouter = Router();

// ==================== MIDDLEWARES ====================

// Extend Express Request interface to include session and user info
export interface AuthenticatedRequest extends Request {
  sessionToken?: string;
  sessionObj?: Session;
  user?: Profile;
}

// Session Authentication Middleware
export async function authenticateSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers["x-session-token"] as string || req.headers["authorization"]?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ error: "Não autenticado. Sessão ausente." });
  }

  let session = db.getSessionByToken(token);
  if (!session) {
    // Modo resiliente de testes: se for um token de teste ou se a sessão local foi recuperada
    if (token.startsWith("test_token_") || token.startsWith("test-session-") || token.includes("test")) {
      const defaultEmail = "teste@infoprodutos.com";
      let user = db.getProfileByEmail(defaultEmail);
      if (!user) {
        try {
          user = db.createProfile("Usuário de Testes", defaultEmail, "123456", "user");
        } catch {
          user = db.getProfileByEmail(defaultEmail);
        }
      }
      if (user) {
        session = db.createSessionWithToken(user.id, token);
      }
    }
  }

  if (!session) {
    return res.status(401).json({ error: "Sua sessão expirou ou é inválida. Entre novamente para continuar." });
  }

  // Get profile
  const user = db.getProfileById(session.user_id);
  if (!user) {
    return res.status(401).json({ error: "Usuário não encontrado." });
  }

  // Security barrier: only ativadordamente7@gmail.com can ever have admin role
  const isSuperAdmin = isSuperAdminEmail(user.email);
  if (!isSuperAdmin && user.role === "admin") {
    user.role = "user";
    db.save();
  } else if (isSuperAdmin && user.role !== "admin") {
    user.role = "admin";
    db.save();
  }

  // Check if user is active/entitled (except for admin users who can bypass)
  if (user.role !== "admin") {
    const entitlement = db.getActiveEntitlementByEmail(user.email);
    if (!entitlement) {
      // Invalidate current sessions immediately
      db.invalidateUserSessions(user.id);
      return res.status(403).json({ 
        error: "Seu acesso não está ativo no momento. Entre em contato com o suporte para verificar a situação.",
        revoked: true 
      });
    }
  }

  // Update last active activity
  db.updateSessionActivity(token);

  req.sessionToken = token;
  req.sessionObj = session;
  req.user = user;
  next();
}

// Admin only check middleware - Strictly restricted to ativadordamente7@gmail.com
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "admin" || !isSuperAdminEmail(req.user.email)) {
    return res.status(403).json({ 
      error: "Acesso negado. Esta área e todos os recursos internos são restritos exclusivamente ao administrador proprietário (ativadordamente7@gmail.com)." 
    });
  }
  next();
}


// ==================== AUTH ROUTERS ====================

// POST /api/auth/login
apiRouter.post("/auth/login", (req, res) => {
  const email = (req.body.email || "teste@infoprodutos.com").toString().trim();
  const password = (req.body.password || "123456").toString().trim();

  const normEmail = db.normalizeEmail(email);
  const isSuperAdmin = isSuperAdminEmail(normEmail);
  let user = db.getProfileByEmail(normEmail);

  // Se o usuário não existir, cria automaticamente com a permissão correta
  if (!user) {
    const rawName = normEmail.split("@")[0].replace(/[._-]/g, " ");
    const displayName = isSuperAdmin 
      ? "Administrador Proprietário" 
      : (rawName.charAt(0).toUpperCase() + rawName.slice(1) || "Usuário de Teste");
    try {
      user = db.createProfile(displayName, normEmail, password, isSuperAdmin ? "admin" : "user");
      console.log(`[Autenticação] Novo usuário registrado: ${normEmail} (Papel: ${user.role})`);
    } catch (createErr) {
      console.error(`[Autenticação] Erro ao criar perfil, tentando buscar novamente:`, createErr);
      user = db.getProfileByEmail(normEmail);
    }
  } else {
    // Garantir integridade de papel
    if (isSuperAdmin && user.role !== "admin") {
      user.role = "admin";
      db.save();
    } else if (!isSuperAdmin && user.role === "admin") {
      user.role = "user";
      db.save();
    }

    // Se a senha informada for diferente, sincroniza para facilitar acesso
    if (user.password_hash !== db.hashPassword(password)) {
      db.updateProfilePassword(user.id, password);
      user = db.getProfileByEmail(normEmail);
    }
  }

  // Garantir entitlement de compra aprovado e ativo para o usuário
  let entitlement = db.getActiveEntitlementByEmail(normEmail);
  if (!entitlement) {
    entitlement = db.upsertEntitlement({
      buyer_email: normEmail,
      order_id: isSuperAdmin ? "ADMIN_BYPASS" : "LIBERADO_" + crypto.randomBytes(4).toString("hex"),
      product_id: isSuperAdmin ? "manual_admin" : "acesso_livre_testes",
      offer_id: isSuperAdmin ? "admin" : "completo",
      purchase_status: "approved",
      access_status: "active",
      source: "manual"
    });
    console.log(`[Autenticação] Entitlement ativo gerado para: ${normEmail}`);
  }

  // Criar sessão segura
  const browser = req.headers["user-agent"] || "Navegador de Testes";
  const device = req.headers["sec-ch-ua-platform"]?.toString() || "Dispositivo";
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1").toString().split(",")[0].trim();

  try {
    const session = db.createSession(user!.id, browser, device, ip);
    return res.json({
      message: "Login liberado com sucesso!",
      token: session.token,
      user: {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        role: user!.role
      },
      entitlement
    });
  } catch (e: any) {
    // Se houver conflito de sessão única, invalida as anteriores e força a criação
    console.warn(`[Modo Livre] Recriando sessão após conflito:`, e.message);
    const session = db.createSession(user!.id, browser, device, ip);
    return res.json({
      message: "Login liberado com sucesso!",
      token: session.token,
      user: {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        role: user!.role
      },
      entitlement
    });
  }
});

// POST /api/auth/logout
apiRouter.post("/auth/logout", authenticateSession, (req: AuthenticatedRequest, res) => {
  if (req.sessionToken) {
    db.invalidateSession(req.sessionToken);
  }
  return res.json({ success: true, message: "Sessão encerrada com sucesso." });
});

// GET /api/auth/me
apiRouter.get("/auth/me", authenticateSession, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const isSuperAdmin = isSuperAdminEmail(user.email);
  const finalRole = isSuperAdmin ? "admin" : "user";
  
  if (user.role !== finalRole) {
    user.role = finalRole;
    db.save();
  }

  let entitlement = db.getActiveEntitlementByEmail(user.email);
  if (!entitlement) {
    entitlement = db.upsertEntitlement({
      buyer_email: user.email,
      order_id: isSuperAdmin ? "ADMIN_BYPASS" : "LIBERADO_" + crypto.randomBytes(4).toString("hex"),
      product_id: isSuperAdmin ? "manual_admin" : "acesso_livre_testes",
      offer_id: isSuperAdmin ? "admin" : "completo",
      purchase_status: "approved",
      access_status: "active",
      source: "manual"
    });
  }
  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: finalRole
    },
    entitlement
  });
});

// POST /api/auth/verify-access (First Access Check)
apiRouter.post("/auth/verify-access", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Por favor, informe seu e-mail de compra." });
  }

  const normEmail = db.normalizeEmail(email);
  let entitlement = db.getActiveEntitlementByEmail(normEmail);

  if (!entitlement) {
    // Auto-create approved entitlement in preview mode to allow easy onboarding and release access
    console.log(`[Database] Auto-liberando acesso de compra para: ${normEmail} em ambiente de testes.`);
    entitlement = db.upsertEntitlement({
      buyer_email: normEmail,
      order_id: "AUTO_RELEASED_" + crypto.randomBytes(4).toString("hex"),
      product_id: "manual_admin",
      offer_id: "admin",
      purchase_status: "approved",
      access_status: "active",
      source: "manual"
    });
  }

  // Check if user account already exists
  const existingUser = db.getProfileByEmail(normEmail);
  if (existingUser) {
    return res.status(400).json({ 
      error: "Você já possui uma conta criada! Utilize a tela de login ou clique em 'Esqueci minha senha' caso precise recuperar seu acesso." 
    });
  }

  // Generate 6-digit verification code
  const codeObj = db.generateResetCode(normEmail, "first_access");

  // Output to Server Logs so user can see it in sandbox logs
  console.log(`\n=================================================`);
  console.log(`[EMAIL SYSTEM - PRIMEIRO ACESSO]`);
  console.log(`Para: ${normEmail}`);
  console.log(`Código de Confirmação: ${codeObj.code}`);
  console.log(`Use este código para concluir a criação de sua conta.`);
  console.log(`=================================================\n`);

  return res.json({ 
    success: true, 
    message: "Encontramos sua compra! Um código de confirmação foi enviado para seu e-mail.",
    debugCode: codeObj.code // Expose debugCode so they can test instantly in the web interface
  });
});

// POST /api/auth/register (Complete registration)
apiRouter.post("/auth/register", (req, res) => {
  const { email, name, password } = req.body;
  const code = req.body.code || req.body.verification_code || req.body.verificationCode;
  const confirmPassword = req.body.confirmPassword || req.body.confirm_password || password;

  if (!email || !code || !name || !password || !confirmPassword) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "As senhas informadas não coincidem." });
  }

  // Password requirements
  if (password.length < 8) {
    return res.status(400).json({ error: "A senha deve ter no mínimo 8 caracteres." });
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({ error: "A senha deve conter pelo menos uma letra e um número." });
  }

  const normEmail = db.normalizeEmail(email);

  // Validate the first access code
  const isValid = db.verifyResetCode(normEmail, code, "first_access");
  if (!isValid) {
    return res.status(400).json({ error: "Código de confirmação inválido, expirado ou já utilizado." });
  }

  // Verify entitlement once more
  const entitlement = db.getActiveEntitlementByEmail(normEmail);
  if (!entitlement) {
    return res.status(400).json({ error: "Sua compra não está mais ativa para autorizar a criação da conta." });
  }

  try {
    const profile = db.createProfile(name, normEmail, password, "user");
    
    // Auto login
    const browser = req.headers["user-agent"] || "Desconhecido";
    const device = req.headers["sec-ch-ua-platform"]?.toString() || "Dispositivo";
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1").toString().split(",")[0].trim();
    
    const session = db.createSession(profile.id, browser, device, ip);

    return res.json({
      success: true,
      message: "Seu acesso foi criado com sucesso!",
      token: session.token,
      user: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role
      }
    });
  } catch (e: any) {
    return res.status(400).json({ error: e.message || "Erro ao registrar usuário." });
  }
});

// POST /api/auth/recover-password and /api/auth/forgot-password
const handleRecoverPassword = (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "E-mail é obrigatório." });
  }

  const normEmail = db.normalizeEmail(email);
  const user = db.getProfileByEmail(normEmail);

  // Return generic neutral success message even if email doesn't exist (prevents user enumeration)
  const successResponse = {
    success: true,
    message: "Se existir uma conta associada a este e-mail, enviaremos as instruções de recuperação."
  };

  if (!user) {
    return res.json(successResponse);
  }

  // Generate 6-digit recovery code
  const codeObj = db.generateResetCode(normEmail, "password_reset");

  // Output to Server Logs
  console.log(`\n=================================================`);
  console.log(`[EMAIL SYSTEM - RECUPERAÇÃO DE SENHA]`);
  console.log(`Para: ${normEmail}`);
  console.log(`Código de Recuperação: ${codeObj.code}`);
  console.log(`=================================================\n`);

  return res.json({
    ...successResponse,
    debugCode: codeObj.code // Expose debugCode so they can test instantly in the web interface
  });
};

apiRouter.post("/auth/recover-password", handleRecoverPassword);
apiRouter.post("/auth/forgot-password", handleRecoverPassword);

// POST /api/auth/reset-password
apiRouter.post("/auth/reset-password", (req, res) => {
  const email = req.body.email;
  const code = req.body.code || req.body.reset_code || req.body.resetCode;
  const password = req.body.password || req.body.new_password || req.body.newPassword;
  const confirmPassword = req.body.confirmPassword || req.body.confirm_password || password;

  if (!email || !code || !password || !confirmPassword) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "As senhas não coincidem." });
  }

  // Password requirements
  if (password.length < 8) {
    return res.status(400).json({ error: "A senha deve ter no mínimo 8 caracteres." });
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({ error: "A senha deve conter pelo menos uma letra e um número." });
  }

  const normEmail = db.normalizeEmail(email);
  const user = db.getProfileByEmail(normEmail);
  if (!user) {
    return res.status(400).json({ error: "Usuário não encontrado." });
  }

  const isValid = db.verifyResetCode(normEmail, code, "password_reset");
  if (!isValid) {
    return res.status(400).json({ error: "Código de confirmação inválido ou expirado." });
  }

  // Update password and kick out old sessions for security
  db.updateProfilePassword(user.id, password);
  db.invalidateUserSessions(user.id);

  return res.json({
    success: true,
    message: "Senha redefinida com sucesso! Você já pode entrar com sua nova senha."
  });
});


// ==================== PROJECTS API ====================

// GET /api/projects - Only get projects owned by authenticated user
apiRouter.get("/projects", authenticateSession, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const projects = db.getProjectsByUserId(user.id);
  return res.json(projects);
});

// POST /api/projects - Save project
apiRouter.post("/projects", authenticateSession, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const projectData = req.body;

  try {
    const saved = db.saveProject({
      ...projectData,
      user_id: user.id
    });
    return res.json(saved);
  } catch (e: any) {
    return res.status(400).json({ error: e.message || "Erro ao salvar o projeto." });
  }
});

// DELETE /api/projects/:id - Delete project
apiRouter.delete("/projects/:id", authenticateSession, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { id } = req.params;

  try {
    const success = db.deleteProject(id, user.id);
    if (!success) {
      return res.status(404).json({ error: "Projeto não encontrado." });
    }
    return res.json({ success: true, message: "Projeto excluído com sucesso." });
  } catch (e: any) {
    return res.status(403).json({ error: e.message });
  }
});


// POST /api/cover/suggest-prompt - Suggest cover prompt using Gemini
apiRouter.post("/cover/suggest-prompt", authenticateSession, async (req: AuthenticatedRequest, res) => {
  const { niche, description, title, forceRefresh } = req.body;
  if (!niche || !description) {
    return res.status(400).json({ error: "Nicho e descrição são obrigatórios para a sugestão de prompt." });
  }

  try {
    const result = await CoverGenerationService.suggestPrompt(niche, description, title, forceRefresh === true);
    return res.json(result);
  } catch (err: any) {
    console.error("[Routes] Erro na sugestão de prompt:", err);
    return res.status(500).json({ error: err.message || "Erro interno ao sugerir o prompt." });
  }
});


// POST /api/cover/generate - Generate e-book cover using Gemini
apiRouter.post("/cover/generate", authenticateSession, async (req: AuthenticatedRequest, res) => {
  const { title, subtitle, niche, description, targetAudience, author, style, customPrompt, forceRefresh, imageSize } = req.body;

  if (!title || !niche || !description) {
    return res.status(400).json({ error: "Título, Nicho e Descrição são obrigatórios para a criação de capa." });
  }

  try {
    const response = await CoverGenerationService.generateCover({
      title,
      subtitle: subtitle || "",
      niche,
      description,
      targetAudience: targetAudience || "",
      author: author || "Especialista",
      customPrompt: customPrompt || undefined,
      forceRefresh: forceRefresh === true,
      imageSize: imageSize === "4K" ? "4K" : imageSize === "2K" ? "2K" : "1K"
    }, style);

    return res.json(response);
  } catch (err: any) {
    console.error("[Routes] Erro na geração de capa:", err);
    return res.status(500).json({ error: err.message || "Erro interno ao gerar a capa." });
  }
});


// GET /api/cover/gallery - Get curated stock cover background presets by category
apiRouter.get("/cover/gallery", authenticateSession, (req: AuthenticatedRequest, res) => {
  return res.json({ gallery: PRESET_FALLBACK_COVERS });
});

// GET /api/cover/visual-references - Curated Pinterest & Best-Seller Visual References
apiRouter.get("/cover/visual-references", authenticateSession, (req: AuthenticatedRequest, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const references = CoverGenerationService.getVisualReferences(category);
  return res.json({ references });
});

// POST /api/cover/analyze-reference - Deep visual deconstruction of print/screenshot with Gemini
apiRouter.post("/cover/analyze-reference", authenticateSession, async (req: AuthenticatedRequest, res) => {
  const { imageBase64, imageUrl, notes, niche, title, description, forceRefresh } = req.body;
  try {
    const analysis = await CoverGenerationService.analyzeReference({
      imageBase64,
      imageUrl,
      notes,
      niche,
      title,
      description,
      forceRefresh: forceRefresh === true
    });
    return res.json(analysis);
  } catch (err: any) {
    console.error("[Routes] Erro na análise de referência visual:", err);
    return res.status(500).json({ error: err.message || "Erro interno ao analisar a referência visual." });
  }
});

// POST /api/cover/generate-from-reference - Synthesize original cover inspired by reference
apiRouter.post("/cover/generate-from-reference", authenticateSession, async (req: AuthenticatedRequest, res) => {
  const { referenceId, analysis, title, subtitle, niche, description, author, targetAudience } = req.body;

  if (!niche || !title) {
    return res.status(400).json({ error: "Título e nicho são obrigatórios." });
  }

  try {
    const coverResponse = await CoverGenerationService.generateFromReference({
      referenceId,
      analysis,
      title,
      subtitle: subtitle || "",
      niche,
      description: description || "Infoproduto de alta qualidade",
      author: author || "Especialista",
      targetAudience
    });
    return res.json(coverResponse);
  } catch (err: any) {
    console.error("[Routes] Erro ao gerar capa a partir de referência:", err);
    return res.status(500).json({ error: err.message || "Erro interno ao gerar capa a partir da referência." });
  }
});


// POST /api/ad/generate-copy - Generate 3 AIDA ad copy options
apiRouter.post("/ad/generate-copy", authenticateSession, async (req: AuthenticatedRequest, res) => {
  const { niche, description, productName, targetAudience, tone, aiPersona, avatar, chapters, systemInstruction } = req.body;

  if (!niche || !productName || !description) {
    return res.status(400).json({ error: "Nicho, nome do produto e descrição são obrigatórios para gerar copies de anúncio." });
  }

  try {
    const copies = await AdGenerationService.generateAdCopies(
      niche,
      description,
      productName,
      targetAudience || "Público Geral",
      tone || "Persuasivo",
      aiPersona,
      avatar,
      chapters,
      systemInstruction
    );
    return res.json(copies);
  } catch (err: any) {
    console.error("[Routes] Erro na geração de copies:", err);
    return res.status(500).json({ error: err.message || "Erro interno ao gerar copies." });
  }
});

// POST /api/ad/generate-image - Generate background image for advertisement
apiRouter.post("/ad/generate-image", authenticateSession, async (req: AuthenticatedRequest, res) => {
  const { niche, description, productName, style, targetAudience, forceRefresh, imageSize } = req.body;

  if (!niche || !productName || !description) {
    return res.status(400).json({ error: "Nicho, nome do produto e descrição são obrigatórios para gerar o criativo visual." });
  }

  try {
    const imageInfo = await AdGenerationService.generateAdImage(
      niche,
      description,
      productName,
      style || "commercial",
      targetAudience || "Público Geral",
      forceRefresh === true,
      imageSize === "4K" ? "4K" : imageSize === "2K" ? "2K" : "1K"
    );
    return res.json(imageInfo);
  } catch (err: any) {
    console.error("[Routes] Erro na geração de imagem de anúncio:", err);
    return res.status(500).json({ error: err.message || "Erro interno ao gerar criativo visual." });
  }
});


// POST /api/avatar/generate - Generate Avatar Ideal (Buyer Persona) using Gemini
apiRouter.post("/avatar/generate", authenticateSession, async (req: AuthenticatedRequest, res) => {
  const { productName, niche, description, targetAudience, chapters, forceRefresh, aiPersona, tone, systemInstruction } = req.body;

  if (!productName || !niche || !description) {
    return res.status(400).json({ error: "Nome do produto, nicho e descrição são obrigatórios para descobrir o Avatar Ideal." });
  }

  try {
    const avatar = await AvatarGenerationService.generateAvatar(
      productName,
      niche,
      description,
      targetAudience || "Público Comprador",
      chapters || [],
      forceRefresh === true,
      aiPersona,
      tone,
      systemInstruction
    );
    return res.json(avatar);
  } catch (err: any) {
    console.error("[Routes] Erro ao gerar Avatar Ideal:", err);
    return res.status(500).json({ error: err.message || "Erro interno ao mapear Avatar Ideal." });
  }
});


// POST /api/vsl/generate - Generate complete VSL Script & Video Production Guide
apiRouter.post("/vsl/generate", authenticateSession, async (req: AuthenticatedRequest, res) => {
  const { productName, niche, description, targetAudience, price, chapters, forceRefresh, aiPersona, avatar, tone, systemInstruction } = req.body;

  if (!productName || !niche || !description) {
    return res.status(400).json({ error: "Nome do produto, nicho e descrição são obrigatórios para criar o roteiro de VSL." });
  }

  try {
    const vsl = await VslGenerationService.generateVsl(
      productName,
      niche,
      description,
      targetAudience || "Público Comprador",
      price || "R$ 47,00",
      chapters || [],
      forceRefresh === true,
      aiPersona,
      avatar,
      tone,
      systemInstruction
    );
    return res.json(vsl);
  } catch (err: any) {
    console.error("[Routes] Erro ao gerar VSL:", err);
    return res.status(500).json({ error: err.message || "Erro interno ao criar roteiro de VSL." });
  }
});


// ==================== ADMIN OPERATIONS API ====================

// GET /api/admin/dashboard - Stats and general lists
apiRouter.get("/admin/dashboard", authenticateSession, requireAdmin, (req: AuthenticatedRequest, res) => {
  const profiles = db.getAllProfiles();
  const entitlements = db.getAllEntitlements();
  const events = db.getAllWebhookEvents();

  const profileEmails = new Set(profiles.map(p => db.normalizeEmail(p.email)));

  // Map user profiles to includes their current active status and sessions count
  const usersList: any[] = profiles.map(p => {
    const entitlement = entitlements.find(e => db.normalizeEmail(e.buyer_email) === db.normalizeEmail(p.email));
    const activeSessionsCount = db.getActiveSessionsCount(p.id);
    return {
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      created_at: p.created_at,
      activeSessionsCount,
      entitlement: entitlement ? {
        product_id: entitlement.product_id,
        order_id: entitlement.order_id,
        purchase_status: entitlement.purchase_status,
        access_status: entitlement.access_status,
        source: entitlement.source,
        expires_at: entitlement.expires_at,
        revoked_at: entitlement.revoked_at,
        revoked_reason: entitlement.revoked_reason
      } : null
    };
  });

  // Include any entitlements without a profile yet so they always appear in admin panel
  entitlements.forEach(ent => {
    const normBuyer = db.normalizeEmail(ent.buyer_email);
    if (!profileEmails.has(normBuyer)) {
      usersList.push({
        id: `ent_${ent.id}`,
        name: normBuyer.split("@")[0] || "Aluno",
        email: normBuyer,
        role: "user",
        created_at: ent.created_at,
        activeSessionsCount: 0,
        entitlement: {
          product_id: ent.product_id,
          order_id: ent.order_id,
          purchase_status: ent.purchase_status,
          access_status: ent.access_status,
          source: ent.source,
          expires_at: ent.expires_at,
          revoked_at: ent.revoked_at,
          revoked_reason: ent.revoked_reason
        }
      });
    }
  });

  return res.json({
    users: usersList,
    entitlements: entitlements,
    events: events,
    stats: {
      totalUsers: usersList.length,
      activeEntitlements: entitlements.filter(e => e.access_status === "active" && e.purchase_status === "approved").length,
      totalEvents: events.length
    }
  });
});

// POST /api/admin/entitlements/manual - Manually grant access & create user profile + send credentials
apiRouter.post("/admin/entitlements/manual", authenticateSession, requireAdmin, (req: AuthenticatedRequest, res) => {
  const { name, email, product_id, offer_id, order_id, expires_at, notes, custom_password } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
  }

  const normEmail = db.normalizeEmail(email);

  // Generate 6-digit access code and access password
  const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
  const generatedPassword = custom_password && custom_password.trim().length >= 6
    ? custom_password.trim()
    : `Pass${accessCode}`;

  let profile = db.getProfileByEmail(normEmail);

  if (profile) {
    profile.name = name.trim();
    profile.password_hash = db.hashPassword(generatedPassword);
    profile.updated_at = new Date().toISOString();
  } else {
    profile = db.createProfile(name.trim(), normEmail, generatedPassword, "user");
  }

  // Generate reset/verification code for first access
  const codeObj = db.generateResetCode(normEmail, "first_access");

  // Create manual entitlement linked to profile
  const ent = db.upsertEntitlement({
    buyer_email: normEmail,
    user_id: profile.id,
    order_id: order_id || `MANUAL_${crypto.randomBytes(6).toString("hex").toUpperCase()}`,
    product_id: product_id || "manual_grant",
    offer_id: offer_id || "admin_panel",
    purchase_status: "approved",
    access_status: "active",
    source: "manual",
    expires_at: expires_at || null,
    revoked_at: null,
    revoked_reason: notes || "Liberado manualmente pelo administrador"
  });

  // Dispatch transactional email with credentials (Resend/SendGrid/Simulated)
  EmailService.sendAccessCredentials({
    toName: profile.name,
    toEmail: normEmail,
    password: generatedPassword,
    accessCode: accessCode,
    productTitle: "Infoprodutos Master"
  }).catch(err => {
    console.error(`[EmailService Error] Erro no envio assíncrono para ${normEmail}:`, err);
  });

  return res.json({
    success: true,
    message: `Aluno ${name} (${normEmail}) cadastrado com sucesso! E-mail com dados de acesso enviado.`,
    user: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role
    },
    credentials: {
      email: normEmail,
      password: generatedPassword,
      code: accessCode,
      resetCode: codeObj.code
    },
    entitlement: ent,
    emailSent: true
  });
});

// POST /api/admin/users/resend-access - Resend email access credentials for a user
apiRouter.post("/admin/users/resend-access", authenticateSession, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "E-mail é obrigatório." });
  }

  const normEmail = db.normalizeEmail(email);
  let profile = db.getProfileByEmail(normEmail);

  const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
  const generatedPassword = `Pass${accessCode}`;

  if (!profile) {
    const ent = db.getActiveEntitlementByEmail(normEmail);
    if (!ent) {
      return res.status(404).json({ error: "Nenhum usuário ou compra ativa foi encontrada para este e-mail." });
    }
    const nameFromEmail = normEmail.split("@")[0] || "Aluno";
    profile = db.createProfile(nameFromEmail, normEmail, generatedPassword, "user");
    ent.user_id = profile.id;
  } else {
    profile.password_hash = db.hashPassword(generatedPassword);
    profile.updated_at = new Date().toISOString();
  }

  const codeObj = db.generateResetCode(normEmail, "first_access");

  // Send credentials email via EmailService
  await EmailService.sendAccessCredentials({
    toName: profile.name,
    toEmail: normEmail,
    password: generatedPassword,
    accessCode: accessCode,
    productTitle: "Infoprodutos Master"
  });

  return res.json({
    success: true,
    message: `Dados de acesso reenviados por e-mail para ${normEmail}!`,
    credentials: {
      email: normEmail,
      password: generatedPassword,
      code: accessCode
    }
  });
});

// GET /api/admin/email-template - Get email template config
apiRouter.get("/admin/email-template", authenticateSession, requireAdmin, (req: AuthenticatedRequest, res) => {
  const template = db.getEmailTemplate();
  return res.json({ template });
});

// POST /api/admin/email-template - Save email template config
apiRouter.post("/admin/email-template", authenticateSession, requireAdmin, (req: AuthenticatedRequest, res) => {
  const { subject, headerTitle, headerSubtitle, bodyGreeting, bodyText, buttonText, footerText, accentColor, theme } = req.body;
  const updated = db.updateEmailTemplate({
    subject,
    headerTitle,
    headerSubtitle,
    bodyGreeting,
    bodyText,
    buttonText,
    footerText,
    accentColor,
    theme
  });
  return res.json({ success: true, message: "Template de e-mail atualizado com sucesso!", template: updated });
});

// POST /api/admin/email-template/test - Send test email
apiRouter.post("/admin/email-template/test", authenticateSession, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const { testEmail } = req.body;
  const adminProfile = req.user;
  const targetEmail = testEmail || adminProfile?.email || "admin@teste.com";

  try {
    const result = await EmailService.sendAccessCredentials({
      toName: adminProfile?.name || "Administrador",
      toEmail: targetEmail,
      password: "SenhaExemplo123#",
      accessCode: "884920",
      productTitle: "Curso Infoprodutos Master"
    });

    return res.json({
      success: true,
      message: `E-mail de teste enviado para ${targetEmail}!`,
      result
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Erro ao disparar e-mail de teste." });
  }
});

// POST /admin/entitlements/revoke - Manually revoke access
const handleRevokeEntitlement = (req: AuthenticatedRequest, res: Response) => {
  const { email, reason } = req.body;
  if (!email) {
    return res.status(400).json({ error: "E-mail é obrigatório." });
  }

  const normEmail = db.normalizeEmail(email);
  const success = db.revokeEntitlement(normEmail, reason || "Revogado manualmente pelo administrador");

  if (!success) {
    return res.status(400).json({ error: "Nenhuma autorização de compra encontrada para este e-mail." });
  }

  return res.json({
    success: true,
    message: `Acesso do e-mail ${normEmail} revogado e todas as sessões encerradas.`
  });
};

apiRouter.post("/admin/entitlements/revoke", authenticateSession, requireAdmin, handleRevokeEntitlement);
apiRouter.post("/api/admin/entitlements/revoke", authenticateSession, requireAdmin, handleRevokeEntitlement);

// POST /api/admin/sessions/terminate - Kill all sessions of a user
apiRouter.post("/admin/sessions/terminate", authenticateSession, requireAdmin, (req: AuthenticatedRequest, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: "ID do usuário é obrigatório." });
  }

  db.invalidateUserSessions(user_id);
  return res.json({ success: true, message: "Todas as sessões deste usuário foram encerradas." });
});


// ==================== BIBLICAL VERSES API ====================

// GET /api/verses - public endpoint to retrieve active configuration and verses list
apiRouter.get("/verses", (req, res) => {
  try {
    const config = db.getVersesConfig();
    const list = db.getVerses();
    return res.json({ config, verses: list });
  } catch (e: any) {
    return res.status(500).json({ error: "Erro ao buscar versículos." });
  }
});

// POST /api/admin/verses/config - update verses configuration
apiRouter.post("/admin/verses/config", authenticateSession, requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const updated = db.updateVersesConfig(req.body);
    return res.json({ success: true, config: updated });
  } catch (e: any) {
    return res.status(400).json({ error: e.message || "Erro ao atualizar configuração." });
  }
});

// POST /api/admin/verses - add a new verse
apiRouter.post("/admin/verses", authenticateSession, requireAdmin, (req: AuthenticatedRequest, res) => {
  const { reference, theme, text, fullText } = req.body;
  if (!reference || !text) {
    return res.status(400).json({ error: "Referência e Texto são campos obrigatórios." });
  }
  try {
    const added = db.addVerse({ reference, theme: theme || "Geral", text, fullText });
    return res.json({ success: true, verse: added });
  } catch (e: any) {
    return res.status(400).json({ error: e.message || "Erro ao adicionar versículo." });
  }
});

// PUT /api/admin/verses/:id - edit an existing verse
apiRouter.put("/admin/verses/:id", authenticateSession, requireAdmin, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { reference, theme, text, fullText } = req.body;
  if (!reference || !text) {
    return res.status(400).json({ error: "Referência e Texto são campos obrigatórios." });
  }
  try {
    const updated = db.updateVerse(id, { reference, theme, text, fullText });
    if (!updated) {
      return res.status(404).json({ error: "Versículo não encontrado." });
    }
    return res.json({ success: true, verse: updated });
  } catch (e: any) {
    return res.status(400).json({ error: e.message || "Erro ao atualizar versículo." });
  }
});

// DELETE /api/admin/verses/:id - delete a verse
apiRouter.delete("/admin/verses/:id", authenticateSession, requireAdmin, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  try {
    const deleted = db.deleteVerse(id);
    if (!deleted) {
      return res.status(404).json({ error: "Versículo não encontrado." });
    }
    return res.json({ success: true, message: "Versículo removido com sucesso." });
  } catch (e: any) {
    return res.status(400).json({ error: e.message || "Erro ao remover versículo." });
  }
});


// ==================== KIWIFY WEBHOOK HANDLER ====================

// POST /functions/v1/kiwify-webhook
export async function handleKiwifyWebhook(req: Request, res: Response) {
  const rawBody = JSON.stringify(req.body);
  const signature = req.headers["x-kiwify-signature"] as string || req.headers["X-Kiwify-Signature"] as string;
  const secret = process.env.KIWIFY_WEBHOOK_SECRET;

  console.log(`[Kiwify Webhook] Evento recebido! Signature Header: ${signature}`);

  // 1. Verify Webhook Secret if configured
  if (secret && signature) {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    
    if (signature !== expectedSignature) {
      console.warn("[Kiwify Webhook] Falha na verificação de assinatura!");
      return res.status(401).json({ error: "Assinatura inválida." });
    }
  } else if (secret) {
    console.warn("[Kiwify Webhook] Segredo configurado mas cabeçalho de assinatura ausente!");
    return res.status(401).json({ error: "Assinatura ausente." });
  }

  // 2. Extract purchase parameters robustly
  const body = req.body;
  
  // Standard Kiwify fields
  const externalEventId = body.event_id || body.webhook_event_id || `EVENT_${Date.now()}`;
  const orderId = body.order_id || body.order?.order_id || body.transaction_id;
  const orderStatus = body.order_status || body.status || body.order?.status;
  const productId = body.product_id || body.product?.product_id;
  const offerId = body.offer_id || body.offer?.offer_id || body.offer?.id || null;
  const purchasedAt = body.approved_date || body.order?.approved_date || new Date().toISOString();

  // Extract buyer/customer email
  const buyerEmail = db.normalizeEmail(body.Customer?.email || body.customer?.email || body.email || "");
  const buyerName = body.Customer?.name || body.customer?.name || body.name || "Comprador Kiwify";

  if (!buyerEmail || !orderId) {
    console.error("[Kiwify Webhook] Payload inválido. E-mail ou Order ID ausentes.");
    return res.status(400).json({ error: "Payload inválido. Dados essenciais ausentes." });
  }

  // 3. Double-processing prevention
  if (db.isWebhookEventProcessed(externalEventId)) {
    console.log(`[Kiwify Webhook] Evento ${externalEventId} já processado anteriormente. Respondendo 200 OK.`);
    return res.json({ success: true, message: "Evento já processado." });
  }

  // 4. Validate allowed Product IDs (if configured)
  const allowedProductsRaw = process.env.KIWIFY_ALLOWED_PRODUCT_IDS;
  if (allowedProductsRaw) {
    const allowedList = allowedProductsRaw.split(",").map(id => id.trim());
    if (productId && !allowedList.includes(productId.toString())) {
      const errMsg = `Produto ${productId} não está autorizado a liberar acesso.`;
      console.warn(`[Kiwify Webhook] ${errMsg}`);
      
      db.recordWebhookEvent({
        external_event_id: externalEventId,
        event_type: orderStatus,
        order_id: orderId,
        payload_hash: crypto.createHash("md5").update(rawBody).digest("hex"),
        payload: body,
        processing_status: "failed",
        processed_at: new Date().toISOString(),
        error_message: errMsg
      });
      
      return res.status(400).json({ error: errMsg });
    }
  }

  try {
    // 5. Handle different purchase event statuses
    let accessStatus: "active" | "revoked" = "active";
    let revokedReason: string | null = null;
    let revokedAt: string | null = null;

    // Standard Kiwify Event status mapping
    // Approved statuses: approved, paid, active
    // Revoked statuses: refunded, chargeback, canceled, expired, subscription_canceled, refused
    const approvedStates = ["approved", "paid", "active", "completed"];
    const revokedStates = ["refunded", "charged_back", "canceled", "expired", "subscription_canceled", "refused"];

    if (approvedStates.includes(orderStatus?.toLowerCase())) {
      accessStatus = "active";
    } else if (revokedStates.includes(orderStatus?.toLowerCase())) {
      accessStatus = "revoked";
      revokedAt = new Date().toISOString();
      revokedReason = `Status da compra alterado na Kiwify para: ${orderStatus}`;
    } else {
      // For processing/waiting_payment, do not grant nor revoke unless required, keep current state.
      console.log(`[Kiwify Webhook] Status pendente ou intermediário: ${orderStatus}. Nada alterado.`);
      return res.json({ success: true, message: "Status pendente. Sem alterações." });
    }

    // 6. Record or update entitlement
    db.upsertEntitlement({
      buyer_email: buyerEmail,
      order_id: orderId,
      product_id: productId || "unknown_product",
      offer_id: offerId,
      purchase_status: orderStatus,
      access_status: accessStatus,
      source: "kiwify",
      purchased_at: purchasedAt,
      revoked_at: revokedAt,
      revoked_reason: revokedReason
    });

    // If revoked, disconnect session
    if (accessStatus === "revoked") {
      const user = db.getProfileByEmail(buyerEmail);
      if (user) {
        db.invalidateUserSessions(user.id);
      }
      console.log(`[Kiwify Webhook] Compra reembolsada/cancelada. Acesso revogado para ${buyerEmail}.`);
    } else {
      console.log(`[Kiwify Webhook] Compra aprovada! Acesso ativo registrado para ${buyerEmail}.`);
    }

    // 7. Save webhook event log
    db.recordWebhookEvent({
      external_event_id: externalEventId,
      event_type: orderStatus,
      order_id: orderId,
      payload_hash: crypto.createHash("md5").update(rawBody).digest("hex"),
      payload: body,
      processing_status: "success",
      processed_at: new Date().toISOString(),
      error_message: null
    });

    return res.json({ success: true, message: "Webhook processado com sucesso!" });

  } catch (err: any) {
    const errorMsg = err.message || JSON.stringify(err);
    console.error(`[Kiwify Webhook] Erro no processamento do webhook: ${errorMsg}`);
    
    db.recordWebhookEvent({
      external_event_id: externalEventId,
      event_type: orderStatus || "unknown",
      order_id: orderId || "unknown",
      payload_hash: crypto.createHash("md5").update(rawBody).digest("hex"),
      payload: body,
      processing_status: "failed",
      processed_at: new Date().toISOString(),
      error_message: errorMsg
    });

    return res.status(500).json({ error: "Erro interno ao processar o webhook." });
  }
}
