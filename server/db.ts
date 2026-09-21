import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_FILE = path.join(process.cwd(), "db.json");

// ==================== SUPABASE (persistência permanente) ====================
// Lê as credenciais das variáveis de ambiente configuradas no Render.
// Se não estiverem configuradas, o app continua funcionando normalmente
// usando apenas o arquivo local db.json (sem persistência entre reinícios).
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SUPABASE_TABLE = "app_state";
const SUPABASE_ROW_ID = "main";

// Interface definitions matches SQL schemas
export interface Profile {
  id: string; // user UUID
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
}

export interface Entitlement {
  id: string;
  user_id: string | null; // connected when user signs up
  buyer_email: string;
  product_id: string;
  offer_id: string | null;
  order_id: string;
  purchase_status: "approved" | "refunded" | "charged_back" | "canceled" | "waiting_payment" | string;
  access_status: "active" | "revoked";
  source: "kiwify" | "manual";
  purchased_at: string;
  renewed_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  revoked_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface KiwifyWebhookEvent {
  id: string;
  external_event_id: string; // unique event ID from Kiwify
  event_type: string;
  order_id: string;
  payload_hash: string;
  payload: any;
  processing_status: "success" | "failed";
  processed_at: string;
  error_message: string | null;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  browser: string;
  device: string;
  ip: string;
  created_at: string;
  last_active_at: string;
  is_active: boolean;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  step: number;
  niche: string;
  targetAudience: string;
  tone: string;
  description: string;
  extraDetails: string;
  ebook: any | null;
  salesPage: any | null;
  checklist: any;
  publishedUrl: string;
  isUsingFallback: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResetCode {
  id: string;
  email: string;
  code: string;
  expires_at: string;
  used: boolean;
  type: "first_access" | "password_reset";
  created_at: string;
}

export interface Verse {
  id: string;
  reference: string;
  theme: string;
  text: string;
  fullText?: string;
}

export interface VersesConfig {
  enabled: boolean;
  version: string;
  locations: {
    login: boolean;
    loading: boolean;
    dashboard: boolean;
    ebook: boolean;
    sales: boolean;
    publish: boolean;
    success: boolean;
    footer: boolean;
    waiting: boolean;
  };
  duration: number;
  style: "discrete" | "highlighted";
  color: "gold" | "blue" | "white" | "cyan";
  glowIntensity: "low" | "medium" | "high";
  speed: "slow" | "normal" | "fast";
}

const DEFAULT_VERSES_CONFIG: VersesConfig = {
  enabled: true,
  version: "Paráfrases",
  locations: {
    login: true,
    loading: true,
    dashboard: true,
    ebook: true,
    sales: true,
    publish: true,
    success: true,
    footer: true,
    waiting: true,
  },
  duration: 12,
  style: "discrete",
  color: "gold",
  glowIntensity: "medium",
  speed: "normal",
};

const INITIAL_VERSES: Verse[] = [
  { id: "1", reference: "Apocalipse 3:21", theme: "governo e vitória", text: "Ao vencedor será concedido sentar-se com Cristo em seu trono." },
  { id: "2", reference: "Mateus 24:14", theme: "expansão do Reino", text: "O evangelho do Reino será anunciado em todo o mundo." },
  { id: "3", reference: "Josué 1:8", theme: "meditação, obediência e prosperidade", text: "Medite na Palavra e pratique seus princípios; assim seu caminho será próspero." },
  { id: "4", reference: "Salmos 1:1–3", theme: "crescimento e frutificação", text: "Aquele que permanece nos caminhos de Deus é como árvore que produz fruto no tempo certo." },
  { id: "5", reference: "Salmos 23:1", theme: "provisão", text: "O Senhor é meu pastor; nada me faltará." },
  { id: "6", reference: "Salmos 35:27", theme: "prosperidade do servo", text: "Deus se alegra com a prosperidade de seus servos." },
  { id: "7", reference: "Salmos 37:4", theme: "desejos alinhados", text: "Encontre sua alegria no Senhor, e Ele conduzirá os desejos do seu coração." },
  { id: "8", reference: "Salmos 37:5", theme: "direção", text: "Entregue seu caminho ao Senhor, confie nele, e Ele agirá." },
  { id: "9", reference: "Salmos 84:11", theme: "favor e provisão", text: "Deus não retém o bem daqueles que caminham com integridade." },
  { id: "10", reference: "Salmos 90:17", theme: "confirmação do trabalho", text: "Que o favor de Deus confirme a obra de nossas mãos." },
  { id: "11", reference: "Salmos 112:1–3", theme: "temor, família e recursos", text: "Aquele que teme ao Senhor vê sua casa fortalecida e sua justiça permanecer." },
  { id: "12", reference: "Salmos 115:14", theme: "multiplicação", text: "Que o Senhor multiplique vocês e seus filhos." },
  { id: "13", reference: "Salmos 128:2", theme: "fruto do trabalho", text: "Você desfrutará do trabalho de suas mãos e será bem-sucedido." },
  { id: "14", reference: "Provérbios 3:5–6", theme: "direção", text: "Confie no Senhor de todo o coração, e Ele endireitará seus caminhos." },
  { id: "15", reference: "Provérbios 3:9–10", theme: "honra e provisão", text: "Honre ao Senhor com seus recursos, e haverá abundância em sua casa." },
  { id: "16", reference: "Provérbios 8:18", theme: "sabedoria e riqueza duradoura", text: "Com a sabedoria estão riquezas, honra e justiça permanente." },
  { id: "17", reference: "Provérbios 10:4", theme: "diligência", text: "A mão diligente conduz à prosperidade." },
  { id: "18", reference: "Provérbios 10:22", theme: "bênção", text: "A bênção do Senhor enriquece sem acrescentar sofrimento." },
  { id: "19", reference: "Provérbios 11:24–25", theme: "generosidade", text: "Quem reparte com generosidade prospera e também é renovado." },
  { id: "20", reference: "Provérbios 13:4", theme: "desejo e disciplina", text: "O diligente terá seus desejos plenamente satisfeitos." },
  { id: "21", reference: "Provérbios 13:11", theme: "crescimento sustentável", text: "Recursos acumulados pouco a pouco crescem com consistência." },
  { id: "22", reference: "Provérbios 14:23", theme: "ação", text: "Todo trabalho produz resultado, mas somente palavras conduzem à falta." },
  { id: "23", reference: "Provérbios 16:3", theme: "planejamento", text: "Consagre seus projetos ao Senhor, e seus planos serão estabelecidos." },
  { id: "24", reference: "Provérbios 18:16", theme: "dons e oportunidades", text: "O dom de uma pessoa abre caminhos e a coloca diante de grandes líderes." },
  { id: "25", reference: "Provérbios 21:5", theme: "planejamento e abundância", text: "Os planos do diligente conduzem à abundância." },
  { id: "26", reference: "Provérbios 22:4", theme: "humildade e temor", text: "Humildade e temor ao Senhor produzem honra, vida e recursos." },
  { id: "27", reference: "Provérbios 22:29", theme: "excelência", text: "Quem é excelente no que faz será colocado diante de reis." },
  { id: "28", reference: "Eclesiastes 5:19", theme: "capacidade de desfrutar", text: "Recursos e capacidade de desfrutá-los também são dádivas de Deus." },
  { id: "29", reference: "Eclesiastes 9:10", theme: "intensidade no trabalho", text: "Faça com toda a sua força aquilo que estiver em suas mãos." },
  { id: "30", reference: "Deuteronômio 8:18", theme: "capacidade de produzir", text: "Deus é quem concede capacidade para gerar recursos e cumprir seu propósito." },
  { id: "31", reference: "Deuteronômio 28:8", theme: "bênção no trabalho", text: "O Senhor ordenará bênção sobre seus depósitos e sobre tudo o que você fizer." },
  { id: "32", reference: "Deuteronômio 28:12", theme: "abertura e provisão", text: "Deus abrirá seu bom tesouro e abençoará o trabalho das suas mãos." },
  { id: "33", reference: "1 Crônicas 4:10", theme: "expansão", text: "Abençoa-me, amplia meus limites e mantém tua mão sobre mim." },
  { id: "34", reference: "1 Crônicas 29:12", theme: "autoridade e riqueza", text: "De Deus procedem riqueza, honra, força e poder para engrandecer." },
  { id: "35", reference: "2 Crônicas 26:5", theme: "busca e prosperidade", text: "Enquanto buscou ao Senhor, Deus o fez prosperar." },
  { id: "36", reference: "Isaías 48:17", theme: "ensino e direção", text: "Deus ensina o que é melhor e conduz pelo caminho correto." },
  { id: "37", reference: "Isaías 54:2–3", theme: "expansão", text: "Amplie sua tenda, fortaleça suas estacas e prepare-se para crescer." },
  { id: "38", reference: "Isaías 60:1", theme: "despertar", text: "Levante-se e brilhe, porque sua luz chegou." },
  { id: "39", reference: "Jeremias 17:7–8", theme: "confiança e estabilidade", text: "Quem confia no Senhor permanece firme e continua produzindo frutos." },
  { id: "40", reference: "Jeremias 29:11", theme: "futuro e esperança", text: "Deus possui planos de paz, esperança e futuro." },
  { id: "41", reference: "Malaquias 3:10", theme: "fidelidade e provisão", text: "Deus convida seu povo a provar sua fidelidade e sua provisão abundante." },
  { id: "42", reference: "Mateus 5:14", theme: "influência", text: "Vocês são a luz do mundo." },
  { id: "43", reference: "Mateus 6:33", theme: "prioridade do Reino", text: "Busque primeiro o Reino e sua justiça, e o necessário será acrescentado." },
  { id: "44", reference: "Mateus 25:21", theme: "fidelidade e governo", text: "Quem é fiel no pouco será colocado sobre responsabilidades maiores." },
  { id: "45", reference: "Lucas 6:38", theme: "generosidade e medida", text: "Dê, e uma medida generosa retornará a você." },
  { id: "46", reference: "João 10:10", theme: "vida abundante", text: "Cristo veio para que tenhamos vida plena e abundante." },
  { id: "47", reference: "2 Coríntios 9:8", theme: "suficiência e boas obras", text: "Deus pode conceder graça suficiente para que você transborde em boas obras." },
  { id: "48", reference: "2 Coríntios 9:10–11", theme: "sementes e multiplicação", text: "Deus multiplica a semente e amplia os frutos da generosidade." },
  { id: "49", reference: "Filipenses 4:19", theme: "provisão", text: "Deus suprirá cada necessidade segundo suas riquezas em glória." },
  { id: "50", reference: "3 João 1:2", theme: "prosperidade integral", text: "Que você prospere em todas as coisas e tenha saúde, assim como prospera sua alma." }
];

export interface EmailTemplateConfig {
  subject: string;
  headerTitle: string;
  headerSubtitle: string;
  bodyGreeting: string;
  bodyText: string;
  buttonText: string;
  footerText: string;
  accentColor: string;
  theme: "dark" | "light" | "modern";
}

export const DEFAULT_EMAIL_TEMPLATE: EmailTemplateConfig = {
  subject: "🎉 Seu Acesso Foi Liberado: Credenciais de Entrada para {{produto}}",
  headerTitle: "Bem-vindo(a), {{nome}}!",
  headerSubtitle: "Sua conta foi criada e está pronta para uso na plataforma.",
  bodyGreeting: "Olá, {{nome}}!",
  bodyText: "Você recebeu acesso exclusivo à plataforma. Abaixo estão suas credenciais de login para entrar na sua conta com total segurança:",
  buttonText: "🚀 Entrar na Plataforma Agora",
  footerText: "Este é um e-mail automático enviado pelo sistema de membros. Se tiver dúvidas, entre em contato com o suporte.",
  accentColor: "#f59e0b",
  theme: "dark"
};

interface DatabaseSchema {
  profiles: Profile[];
  entitlements: Entitlement[];
  kiwify_webhook_events: KiwifyWebhookEvent[];
  sessions: Session[];
  projects: Project[];
  reset_codes: ResetCode[];
  verses_config?: VersesConfig;
  verses?: Verse[];
  email_template?: EmailTemplateConfig;
}

// Strict Super Administrator Configuration: The ONLY email permitted to hold admin status in the entire platform
export const SUPER_ADMIN_EMAIL = "ativadordamente7@gmail.com";

export function isSuperAdminEmail(email?: string): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

class FileDatabase {
  private data: DatabaseSchema = {
    profiles: [],
    entitlements: [],
    kiwify_webhook_events: [],
    sessions: [],
    projects: [],
    reset_codes: [],
    verses_config: { ...DEFAULT_VERSES_CONFIG },
    verses: [...INITIAL_VERSES],
    email_template: { ...DEFAULT_EMAIL_TEMPLATE }
  };

  constructor() {
    this.load();
    this.seedDefaultAdmin();
  }

  // Load database from file
  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        this.data = {
          profiles: parsed.profiles || [],
          entitlements: parsed.entitlements || [],
          kiwify_webhook_events: parsed.kiwify_webhook_events || [],
          sessions: parsed.sessions || [],
          projects: parsed.projects || [],
          reset_codes: parsed.reset_codes || [],
          verses_config: parsed.verses_config || { ...DEFAULT_VERSES_CONFIG },
          verses: parsed.verses || [...INITIAL_VERSES],
          email_template: parsed.email_template || { ...DEFAULT_EMAIL_TEMPLATE }
        };
        console.log(`[Database] Banco de dados carregado com sucesso (${this.data.profiles.length} usuários).`);
      } else {
        this.save();
      }
    } catch (e) {
      console.error("[Database] Erro ao carregar banco de dados:", e);
    }
  }

  // ==================== SUPABASE SYNC ====================
  // Chamado uma vez na inicialização do servidor (server.ts já faz "await db.loadFromSupabase()").
  // Busca o último estado salvo no Supabase e substitui os dados em memória por ele,
  // garantindo que os dados sobrevivam a reinícios/redeploys no Render.
  public async loadFromSupabase(): Promise<void> {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.log("[Database] Supabase não configurado (faltam SUPABASE_URL / SUPABASE_SERVICE_KEY) — usando apenas o db.json local.");
      return;
    }

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?id=eq.${SUPABASE_ROW_ID}&select=data`,
        {
          headers: {
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            Accept: "application/vnd.pgrst.object+json",
          },
        }
      );

      // 406 = nenhuma linha encontrada ainda (primeira vez rodando) — não é erro
      if (res.status === 406 || res.status === 404) {
        console.log("[Database] Nenhum backup encontrado no Supabase ainda — começando do zero.");
        return;
      }

      if (!res.ok) {
        console.error(`[Database] Erro ao buscar dados do Supabase (${res.status}): ${await res.text()}`);
        return;
      }

      const row: any = await res.json();
      if (row && row.data) {
        this.data = {
          profiles: row.data.profiles || [],
          entitlements: row.data.entitlements || [],
          kiwify_webhook_events: row.data.kiwify_webhook_events || [],
          sessions: row.data.sessions || [],
          projects: row.data.projects || [],
          reset_codes: row.data.reset_codes || [],
          verses_config: row.data.verses_config || { ...DEFAULT_VERSES_CONFIG },
          verses: row.data.verses || [...INITIAL_VERSES],
          email_template: row.data.email_template || { ...DEFAULT_EMAIL_TEMPLATE },
        };
        console.log(`[Database] Dados restaurados do Supabase com sucesso (${this.data.profiles.length} usuários).`);
        this.save(); // mantém o db.json local sincronizado também
      }
    } catch (e) {
      console.error("[Database] Erro de conexão com o Supabase:", e);
    }
  }

  // Envia o estado atual pro Supabase em segundo plano (não trava o app se falhar/demorar)
  private syncToSupabase(): void {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return;

    fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify([
        { id: SUPABASE_ROW_ID, data: this.data, updated_at: new Date().toISOString() },
      ]),
    }).catch((e) => {
      console.error("[Database] Erro ao enviar backup para o Supabase:", e);
    });
  }

  // Save database to file atomically (e sincroniza com o Supabase em segundo plano)
  public save() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), "utf-8");
      fs.renameSync(tempFile, DB_FILE);
    } catch (e) {
      console.error("[Database] Erro ao salvar banco de dados:", e);
    }
    this.syncToSupabase();
  }

  // Hash passwords using standard built-in crypto
  public hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password + "kiwify_salt_2026").digest("hex");
  }

  // Seed default admin based on instructions and user metadata
  private seedDefaultAdmin() {
    const adminEmail = SUPER_ADMIN_EMAIL.toLowerCase();
    const adminPassword = "Eusourico2977";
    const existingAdmin = this.data.profiles.find(p => p.email.toLowerCase() === adminEmail);

    if (existingAdmin) {
      // Force role to admin and password to the one requested by the user
      existingAdmin.role = "admin";
      existingAdmin.name = existingAdmin.name || "Administrador Geral";
      existingAdmin.password_hash = this.hashPassword(adminPassword);
      existingAdmin.updated_at = new Date().toISOString();
      
      // Ensure they have an active entitlement
      const entitlementExists = this.data.entitlements.some(
        e => e.buyer_email.toLowerCase() === adminEmail && e.access_status === "active"
      );
      if (!entitlementExists) {
        const entitlement: Entitlement = {
          id: crypto.randomUUID(),
          user_id: existingAdmin.id,
          buyer_email: adminEmail,
          product_id: "manual_admin",
          offer_id: "admin",
          order_id: "ADMIN_BYPASS",
          purchase_status: "approved",
          access_status: "active",
          source: "manual",
          purchased_at: new Date().toISOString(),
          renewed_at: null,
          expires_at: null,
          revoked_at: null,
          revoked_reason: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        this.data.entitlements.push(entitlement);
      }
      console.log(`[Database] Administrador verificado e configurado: ${adminEmail}`);
    } else {
      const admin: Profile = {
        id: crypto.randomUUID(),
        name: "Administrador Proprietário",
        email: adminEmail,
        password_hash: this.hashPassword(adminPassword),
        role: "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.data.profiles.push(admin);
      
      const entitlement: Entitlement = {
        id: crypto.randomUUID(),
        user_id: admin.id,
        buyer_email: adminEmail,
        product_id: "manual_admin",
        offer_id: "admin",
        order_id: "ADMIN_BYPASS",
        purchase_status: "approved",
        access_status: "active",
        source: "manual",
        purchased_at: new Date().toISOString(),
        renewed_at: null,
        expires_at: null,
        revoked_at: null,
        revoked_reason: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.data.entitlements.push(entitlement);
      
      console.log(`[Database] Administrador proprietário criado: ${adminEmail} (Senha: ${adminPassword})`);
    }

    // STRICT ISOLATION RULE: Demote any other profile to 'user'. No other email is permitted to have 'admin' access.
    let demotedCount = 0;
    for (const p of this.data.profiles) {
      if (this.normalizeEmail(p.email) !== adminEmail && p.role === "admin") {
        p.role = "user";
        p.updated_at = new Date().toISOString();
        demotedCount++;
        console.log(`[Database Security] Perfil rebaixado para usuário regular: ${p.email}`);
      }
    }

    this.save();
    if (demotedCount > 0) {
      console.log(`[Database Security] ${demotedCount} perfil(is) rebaixado(s). O único administrador ativo é ${adminEmail}.`);
    }
  }

  // Helper to normalize emails
  public normalizeEmail(email: string): string {
    if (!email) return "";
    return email.trim().toLowerCase();
  }

  // ==================== PROFILES ====================
  public getProfileByEmail(email: string): Profile | undefined {
    const norm = this.normalizeEmail(email);
    const profile = this.data.profiles.find(p => this.normalizeEmail(p.email) === norm);
    if (profile) {
      // Dynamic integrity check: guarantee only SUPER_ADMIN_EMAIL has admin role
      const expectedRole = isSuperAdminEmail(profile.email) ? "admin" : "user";
      if (profile.role !== expectedRole) {
        profile.role = expectedRole;
        this.save();
      }
    }
    return profile;
  }

  public getProfileById(id: string): Profile | undefined {
    const profile = this.data.profiles.find(p => p.id === id);
    if (profile) {
      const expectedRole = isSuperAdminEmail(profile.email) ? "admin" : "user";
      if (profile.role !== expectedRole) {
        profile.role = expectedRole;
        this.save();
      }
    }
    return profile;
  }

  public getAllProfiles(): Profile[] {
    return [...this.data.profiles];
  }

  public createProfile(name: string, email: string, password_plain: string, role: "admin" | "user" = "user"): Profile {
    const norm = this.normalizeEmail(email);
    if (this.getProfileByEmail(norm)) {
      throw new Error("E-mail já cadastrado.");
    }

    // Strictly enforce: ONLY ativadordamente7@gmail.com can ever receive admin role
    const assignedRole: "admin" | "user" = isSuperAdminEmail(norm) ? "admin" : "user";

    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: norm,
      password_hash: this.hashPassword(password_plain),
      role: assignedRole,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.data.profiles.push(newProfile);
    
    // Link existing entitlements to this new user_id
    this.data.entitlements.forEach(ent => {
      if (this.normalizeEmail(ent.buyer_email) === norm) {
        ent.user_id = newProfile.id;
        ent.updated_at = new Date().toISOString();
      }
    });

    this.save();
    return newProfile;
  }

  public updateProfilePassword(id: string, newPasswordPlain: string): boolean {
    const profile = this.getProfileById(id);
    if (!profile) return false;
    profile.password_hash = this.hashPassword(newPasswordPlain);
    profile.updated_at = new Date().toISOString();
    this.save();
    return true;
  }

  // ==================== ENTITLEMENTS ====================
  public getEntitlementsByEmail(email: string): Entitlement[] {
    const norm = this.normalizeEmail(email);
    return this.data.entitlements.filter(e => this.normalizeEmail(e.buyer_email) === norm);
  }

  public getActiveEntitlementByEmail(email: string): Entitlement | undefined {
    const norm = this.normalizeEmail(email);
    // Return approved & active entitlements
    return this.data.entitlements.find(
      e => this.normalizeEmail(e.buyer_email) === norm && 
           e.purchase_status === "approved" && 
           e.access_status === "active"
    );
  }

  public getAllEntitlements(): Entitlement[] {
    return [...this.data.entitlements];
  }

  public upsertEntitlement(payload: Partial<Entitlement> & { buyer_email: string; order_id: string }): Entitlement {
    const normEmail = this.normalizeEmail(payload.buyer_email);
    const existing = this.data.entitlements.find(
      e => e.order_id === payload.order_id && this.normalizeEmail(e.buyer_email) === normEmail
    );

    const userProfile = this.getProfileByEmail(normEmail);

    if (existing) {
      // Update existing
      Object.assign(existing, {
        ...payload,
        buyer_email: normEmail,
        user_id: userProfile ? userProfile.id : (existing.user_id || null),
        updated_at: new Date().toISOString(),
      });
      this.save();
      return existing;
    } else {
      // Create new
      const newEnt: Entitlement = {
        id: crypto.randomUUID(),
        user_id: userProfile ? userProfile.id : null,
        buyer_email: normEmail,
        product_id: payload.product_id || "unknown",
        offer_id: payload.offer_id || null,
        order_id: payload.order_id,
        purchase_status: payload.purchase_status || "approved",
        access_status: payload.access_status || "active",
        source: payload.source || "kiwify",
        purchased_at: payload.purchased_at || new Date().toISOString(),
        renewed_at: payload.renewed_at || null,
        expires_at: payload.expires_at || null,
        revoked_at: payload.revoked_at || null,
        revoked_reason: payload.revoked_reason || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.data.entitlements.push(newEnt);
      this.save();
      return newEnt;
    }
  }

  public revokeEntitlement(email: string, reason: string): boolean {
    const norm = this.normalizeEmail(email);
    let updated = false;
    this.data.entitlements.forEach(e => {
      if (this.normalizeEmail(e.buyer_email) === norm) {
        e.access_status = "revoked";
        e.revoked_at = new Date().toISOString();
        e.revoked_reason = reason;
        e.updated_at = new Date().toISOString();
        updated = true;
      }
    });

    if (updated) {
      // Also invalidate all sessions of the linked user to kick them out immediately
      const profile = this.getProfileByEmail(norm);
      if (profile) {
        this.invalidateUserSessions(profile.id);
      }
      this.save();
    }
    return updated;
  }

  // ==================== WEBHOOK EVENTS ====================
  public isWebhookEventProcessed(externalEventId: string): boolean {
    return this.data.kiwify_webhook_events.some(e => e.external_event_id === externalEventId && e.processing_status === "success");
  }

  public recordWebhookEvent(event: Omit<KiwifyWebhookEvent, "id" | "created_at">): KiwifyWebhookEvent {
    const newEvent: KiwifyWebhookEvent = {
      id: crypto.randomUUID(),
      ...event,
      created_at: new Date().toISOString(),
    };
    this.data.kiwify_webhook_events.push(newEvent);
    this.save();
    return newEvent;
  }

  public getAllWebhookEvents(): KiwifyWebhookEvent[] {
    return [...this.data.kiwify_webhook_events].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  // ==================== SESSIONS & ANTI-SHARING ====================
  public createSession(user_id: string, browser: string, device: string, ip: string): Session {
    // Retrieve configuration: standard is max 1 active session per user at a time
    // We enforce single-session logic: revoke previous active sessions of this user
    this.invalidateUserSessions(user_id);

    const token = crypto.randomBytes(32).toString("hex");
    const session: Session = {
      id: crypto.randomUUID(),
      user_id,
      token,
      browser,
      device,
      ip,
      created_at: new Date().toISOString(),
      last_active_at: new Date().toISOString(),
      is_active: true,
    };

    this.data.sessions.push(session);
    this.save();
    return session;
  }

  public createSessionWithToken(user_id: string, token: string, browser = "Navegador de Testes", device = "Dispositivo", ip = "127.0.0.1"): Session {
    const existing = this.data.sessions.find(s => s.token === token);
    if (existing) {
      existing.is_active = true;
      existing.last_active_at = new Date().toISOString();
      this.save();
      return existing;
    }

    const session: Session = {
      id: crypto.randomUUID(),
      user_id,
      token,
      browser,
      device,
      ip,
      created_at: new Date().toISOString(),
      last_active_at: new Date().toISOString(),
      is_active: true,
    };

    this.data.sessions.push(session);
    this.save();
    return session;
  }

  public getSessionByToken(token: string): Session | undefined {
    return this.data.sessions.find(s => s.token === token && s.is_active);
  }

  public updateSessionActivity(token: string): void {
    const session = this.getSessionByToken(token);
    if (session) {
      session.last_active_at = new Date().toISOString();
      this.save();
    }
  }

  public invalidateSession(token: string): void {
    const session = this.data.sessions.find(s => s.token === token);
    if (session) {
      session.is_active = false;
      this.save();
    }
  }

  public invalidateUserSessions(user_id: string): void {
    this.data.sessions.forEach(s => {
      if (s.user_id === user_id) {
        s.is_active = false;
      }
    });
    this.save();
  }

  public getActiveSessionsCount(user_id: string): number {
    return this.data.sessions.filter(s => s.user_id === user_id && s.is_active).length;
  }

  // ==================== PROJECTS ====================
  // Ensure that projects are saved per user
  public getProjectsByUserId(user_id: string): Project[] {
    return this.data.projects.filter(p => p.user_id === user_id);
  }

  public getProjectByIdAndUser(id: string, user_id: string): Project | undefined {
    return this.data.projects.find(p => p.id === id && p.user_id === user_id);
  }

  public saveProject(project: Partial<Project> & { user_id: string }): Project {
    const id = project.id || crypto.randomUUID();
    const existingIdx = this.data.projects.findIndex(p => p.id === id);

    const fullProject: Project = {
      id,
      user_id: project.user_id,
      name: project.name || "Sem Nome",
      step: project.step || 1,
      niche: project.niche || "",
      targetAudience: project.targetAudience || "",
      tone: project.tone || "",
      description: project.description || "",
      extraDetails: project.extraDetails || "",
      ebook: project.ebook || null,
      salesPage: project.salesPage || null,
      checklist: project.checklist || {},
      publishedUrl: project.publishedUrl || "",
      isUsingFallback: project.isUsingFallback || false,
      created_at: existingIdx >= 0 ? this.data.projects[existingIdx].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      // Verify Row Level Security! Can only update if it is the owner
      if (this.data.projects[existingIdx].user_id !== project.user_id) {
        throw new Error("Não autorizado: Esse projeto pertence a outro usuário.");
      }
      this.data.projects[existingIdx] = fullProject;
    } else {
      this.data.projects.push(fullProject);
    }

    this.save();
    return fullProject;
  }

  public deleteProject(id: string, user_id: string): boolean {
    const idx = this.data.projects.findIndex(p => p.id === id);
    if (idx >= 0) {
      if (this.data.projects[idx].user_id !== user_id) {
        throw new Error("Não autorizado: Esse projeto pertence a outro usuário.");
      }
      this.data.projects.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  // ==================== RESET / VERIFICATION CODES ====================
  public generateResetCode(email: string, type: "first_access" | "password_reset"): ResetCode {
    const norm = this.normalizeEmail(email);
    // Invalidate existing active codes of this type for this email
    this.data.reset_codes.forEach(c => {
      if (this.normalizeEmail(c.email) === norm && c.type === type) {
        c.used = true;
      }
    });

    // 6-digit numeric verification code (very user friendly, can also be used as a link parameter)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const newCode: ResetCode = {
      id: crypto.randomUUID(),
      email: norm,
      code,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes validity
      used: false,
      type,
      created_at: new Date().toISOString(),
    };

    this.data.reset_codes.push(newCode);
    this.save();
    return newCode;
  }

  public verifyResetCode(email: string, code: string, type: "first_access" | "password_reset"): boolean {
    const norm = this.normalizeEmail(email);
    const found = this.data.reset_codes.find(
      c => this.normalizeEmail(c.email) === norm && 
           c.code === code.trim() && 
           c.type === type && 
           !c.used && 
           new Date(c.expires_at).getTime() > Date.now()
    );

    if (found) {
      found.used = true;
      this.save();
      return true;
    }
    return false;
  }

  // ==================== VERSES & CONFIG ====================
  public getVersesConfig(): VersesConfig {
    if (!this.data.verses_config) {
      this.data.verses_config = { ...DEFAULT_VERSES_CONFIG };
      this.save();
    }
    return this.data.verses_config;
  }

  public updateVersesConfig(config: Partial<VersesConfig>): VersesConfig {
    const current = this.getVersesConfig();
    this.data.verses_config = { ...current, ...config };
    this.save();
    return this.data.verses_config;
  }

  public getVerses(): Verse[] {
    if (!this.data.verses || this.data.verses.length === 0) {
      this.data.verses = [...INITIAL_VERSES];
      this.save();
    }
    return this.data.verses;
  }

  public addVerse(verse: Omit<Verse, "id">): Verse {
    const newVerse: Verse = {
      id: crypto.randomUUID(),
      ...verse,
    };
    this.getVerses(); // Ensure loaded and initialized
    this.data.verses!.push(newVerse);
    this.save();
    return newVerse;
  }

  public updateVerse(id: string, updated: Partial<Omit<Verse, "id">>): Verse | undefined {
    this.getVerses(); // Ensure loaded
    const verse = this.data.verses!.find(v => v.id === id);
    if (!verse) return undefined;
    Object.assign(verse, updated);
    this.save();
    return verse;
  }

  public deleteVerse(id: string): boolean {
    this.getVerses(); // Ensure loaded
    const idx = this.data.verses!.findIndex(v => v.id === id);
    if (idx >= 0) {
      this.data.verses!.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  // ==================== EMAIL TEMPLATES ====================
  public getEmailTemplate(): EmailTemplateConfig {
    if (!this.data.email_template) {
      this.data.email_template = { ...DEFAULT_EMAIL_TEMPLATE };
      this.save();
    }
    return this.data.email_template;
  }

  public updateEmailTemplate(config: Partial<EmailTemplateConfig>): EmailTemplateConfig {
    const current = this.getEmailTemplate();
    this.data.email_template = { ...current, ...config };
    this.save();
    return this.data.email_template;
  }
}

export const db = new FileDatabase();
