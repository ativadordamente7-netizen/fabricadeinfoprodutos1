import React, { useState, useEffect, useCallback } from "react";
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle, 
  TrendingUp, 
  FileText, 
  Copy, 
  Check, 
  ChevronRight, 
  HelpCircle, 
  Play, 
  ArrowRight, 
  Flame, 
  Award, 
  Layers, 
  HeartCrack, 
  ChevronDown, 
  Download, 
  Coins, 
  RotateCw,
  Lightbulb,
  DollarSign,
  Info,
  History,
  AlertTriangle,
  Shield,
  LogOut,
  FolderOpen,
  Plus,
  RefreshCw,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EbookData, SalesPageData, SavedProject } from "./types";
import ThreeStepIndicator from "./components/ThreeStepIndicator";
import EbookStep from "./components/EbookStep";
import SalesPageStep from "./components/SalesPageStep";
import FloatingVerses from "./components/FloatingVerses";
import EbookGenerationProgress from "./components/EbookGenerationProgress";
import { safeJson } from "./utils/apiHelper";
import { DIDACTIC_EBOOK_EXAMPLE } from "./utils/didacticExample";

// Infinity Million OS Suite
import InfinityOSHeader from "./components/infinity/InfinityOSHeader";
import CentralEvolucao from "./components/infinity/CentralEvolucao";
import CentralIA from "./components/infinity/CentralIA";
import CentralDiagnostico from "./components/infinity/CentralDiagnostico";
import CentralMissoes from "./components/infinity/CentralMissoes";
import CentralFinanceira from "./components/infinity/CentralFinanceira";
import SalaCEO from "./components/infinity/SalaCEO";
import PersonalizarIA, { AIPersonaConfig } from "./components/PersonalizarIA";
import OperadorInteligenteWidget from "./components/infinity/OperadorInteligenteWidget";

// Lazy-loaded secondary step modules & administration panels to optimize initial bundle size & Core Web Vitals
const PublishStep = React.lazy(() => import("./components/PublishStep"));
const AdCreativeStep = React.lazy(() => import("./components/AdCreativeStep"));
const IdealAvatarStep = React.lazy(() => import("./components/IdealAvatarStep"));
const VslScriptStep = React.lazy(() => import("./components/VslScriptStep"));
const SalesFunnelStep = React.lazy(() => import("./components/SalesFunnelStep"));
const SocioEstrategicoStep = React.lazy(() => import("./components/SocioEstrategicoStep"));

const CentralFerramentasIA = React.lazy(() => import("./components/infinity/CentralFerramentasIA"));
const BibliotecaExemplos = React.lazy(() => import("./components/infinity/BibliotecaExemplos"));
const SimuladorViabilidade = React.lazy(() => import("./components/infinity/SimuladorViabilidade"));
const ChecklistPublicacao = React.lazy(() => import("./components/infinity/ChecklistPublicacao"));
const NivelamentoExperienceModal = React.lazy(() => import("./components/infinity/NivelamentoExperience"));
const BrandOSHub = React.lazy(() => import("./components/brand/BrandOSHub"));
const VisualStyleLibrary = React.lazy(() => import("./components/infinity/VisualStyleLibrary"));
const VisualStyleDashboard = React.lazy(() => import("./components/infinity/VisualStyleDashboard"));
import { ExperienceLevel } from "./components/infinity/NivelamentoExperience";
import { InfinityTab } from "./components/infinity/InfinityOSHeader";

const dropdownStaggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const dropdownItemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

// Secure Authentication & Administration Modules
import LoginScreen from "./components/LoginScreen";
const BlockedScreen = React.lazy(() => import("./components/BlockedScreen"));
const AdminPanel = React.lazy(() => import("./components/AdminPanel"));
const WelcomeTour = React.lazy(() => import("./components/WelcomeTour"));

export default function App() {
  // Authentication & Session States
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authView, setAuthView] = useState<"login" | "blocked" | "admin" | "app">("login");

  const SUPER_ADMIN_EMAIL = "ativadordamente7@gmail.com";
  const isSuperAdmin = currentUser?.email?.toLowerCase().trim() === SUPER_ADMIN_EMAIL;
  const isAdmin = Boolean(isSuperAdmin && currentUser?.role === "admin");

  // Server Projects Sync States
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);

  // Wizard Stage (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState(1);

  // Infinity Million OS Navigation Tab & User Experience Level
  const [osTab, setOsTab] = useState<InfinityTab>("wizard");
  const [centralIaModuleId, setCentralIaModuleId] = useState<number>(1);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("iniciante");
  const [showNivelamentoModal, setShowNivelamentoModal] = useState(false);

  // Form Inputs
  const [productName, setProductName] = useState("");
  const [niche, setNiche] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("Persuasivo e Emocional");
  const [description, setDescription] = useState("");
  const [extraDetails, setExtraDetails] = useState("");
  const [aiPersona, setAiPersona] = useState<AIPersonaConfig>({
    preset: "autoridade",
    provocationLevel: 3,
    enthusiasmLevel: 4,
    complexityLevel: 3,
    useAnalogies: true,
    useEmojiStyle: "moderado",
    customNotes: ""
  });

  // AI Generated States
  const [generatedEbook, setGeneratedEbook] = useState<EbookData | null>(null);
  const [generatedSalesPage, setGeneratedSalesPage] = useState<SalesPageData | null>(null);
  const [activeVisualDna, setActiveVisualDna] = useState<any>(null);
  const [adCreativeSubStep, setAdCreativeSubStep] = useState<number>(1);

  // App Loading / Error State
  const [loading, setLoading] = useState(false);
  const [isEbookGenerating, setIsEbookGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);

  // Published URLs and Checklist states
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({});
  const [publishedUrl, setPublishedUrl] = useState("");

  // Debounced server auto-saving to prevent network congestion on keystrokes
  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const debouncedSaveProjectToServer = (customEbookState?: EbookData, customSalesPageState?: SalesPageData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      handleSaveProjectToServer(customEbookState, customSalesPageState);
    }, 1200);
  };

  const tones = [
    "Persuasivo e Emocional",
    "Profissional e Corporativo",
    "Amigável e Descontraído",
    "Técnico e Científico",
    "Didático e Passo a Passo",
    "Urgente e Escasso"
  ];

  const niches = [
    "Emagrecimento & Fitness",
    "Finanças & Investimentos",
    "Marketing Digital & Vendas",
    "Relacionamentos & Conquista",
    "Desenvolvimento Pessoal",
    "Tecnologia & IA",
    "Idiomas & Educação",
    "Espiritualidade & Mentalidade"
  ];

  // Priority Loading Strategy for Critical Image Assets (LCP Optimization)
  useEffect(() => {
    const defaultCoverUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80";
    const criticalImageUrls = [
      defaultCoverUrl,
      DIDACTIC_EBOOK_EXAMPLE?.coverImage,
      generatedEbook?.coverImage,
      generatedSalesPage?.heroImage
    ].filter(Boolean) as string[];

    criticalImageUrls.forEach((src) => {
      if (!src) return;
      let existingLink = document.querySelector(`link[rel="preload"][href="${src}"]`);
      if (!existingLink) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = src;
        // @ts-ignore
        link.fetchPriority = "high";
        document.head.appendChild(link);
      }

      const img = new Image();
      img.src = src;
    });
  }, [generatedEbook?.coverImage, generatedSalesPage?.heroImage]);

  // 1. Initial mounting check for session validation
  useEffect(() => {
    const initAuth = async () => {
      // Check localStorage first (keep connected) then fallback to sessionStorage
      const storedToken = localStorage.getItem("fabrica_session_token") || sessionStorage.getItem("fabrica_session_token");
      const storedUserRaw = localStorage.getItem("fabrica_session_user") || sessionStorage.getItem("fabrica_session_user");
      
      if (!storedToken) {
        setIsAuthLoading(false);
        setAuthView("login");
        return;
      }

      let parsedUser = null;
      if (storedUserRaw) {
        try {
          parsedUser = JSON.parse(storedUserRaw);
        } catch (e) {
          console.warn("Erro ao ler dados do usuário salvo localmente:", e);
        }
      }

      // If we have a local session, restore it immediately for a fast, persistent startup
      if (parsedUser) {
        setSessionToken(storedToken);
        setCurrentUser(parsedUser);
        
        // Modo livre de testes: todo usuário logado acessa a ferramenta diretamente
        setAuthView("app");
        
        // Load projects in the background
        fetchUserProjects(storedToken);
        setIsAuthLoading(false);
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { "x-session-token": storedToken }
        });

        if (res.status === 401) {
          // Em ambiente livre de testes, preserva a sessão de teste
          if (storedToken.startsWith("test_token_") || storedToken.startsWith("test-session-") || storedToken.includes("test")) {
            if (parsedUser) {
              setSessionToken(storedToken);
              setCurrentUser(parsedUser);
              setAuthView("app");
            }
            setIsAuthLoading(false);
            return;
          }
          console.warn("A sessão inicial expirou ou é inválida. Limpando credenciais locais.");
          handleLogout();
          setIsAuthLoading(false);
          return;
        }

        const data = await safeJson(res);

        if (data.user) {
          setSessionToken(storedToken);
          setCurrentUser(data.user);

          // Update persisted user profile data
          const isLocal = !!localStorage.getItem("fabrica_session_token");
          if (isLocal) {
            localStorage.setItem("fabrica_session_user", JSON.stringify(data.user));
          } else {
            sessionStorage.setItem("fabrica_session_user", JSON.stringify(data.user));
          }

          // Modo livre de testes: todo usuário autenticado acessa a ferramenta diretamente
          setAuthView("app");
          
          // Load user's projects from server
          fetchUserProjects(storedToken);
        } else {
          // Token is invalid/expired
          handleLogout();
        }
      } catch (err) {
        console.error("Erro na validação inicial de sessão:", err);
        // If we didn't have parsedUser initially, make sure we stop loading and show login
        if (!parsedUser) {
          setAuthView("login");
        }
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  // Show Welcome Tour on first startup
  useEffect(() => {
    if (authView === "app") {
      const tourSeen = localStorage.getItem("fabrica_tour_seen");
      if (!tourSeen) {
        setShowWelcomeTour(true);
      }
    }
  }, [authView]);

  // Security check: If not the designated super administrator, prevent staying in admin view
  useEffect(() => {
    if (authView === "admin" && !isAdmin) {
      setAuthView("app");
    }
  }, [authView, isAdmin]);

  // 2. Periodic polling (Anti-sharing & Liveness check)
  useEffect(() => {
    if (!sessionToken || authView === "login") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { "x-session-token": sessionToken }
        });
        
        if (res.status === 401) {
          if (sessionToken.startsWith("test_token_") || sessionToken.startsWith("test-session-") || sessionToken.includes("test")) {
            return;
          }
          console.warn("Sessão invalidada por outro dispositivo ou expiração.");
          handleLogout();
          return;
        }

        const data = await safeJson(res);
        if (data.user) {
          setCurrentUser(data.user);
        }
      } catch (err) {
        // Silently catch network errors to prevent interrupting user work on brief disconnects
        console.warn("Falha temporária ao pingar validação de sessão:", err);
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [sessionToken, authView]);

  // Fetch projects from server
  const fetchUserProjects = async (tokenToUse: string) => {
    try {
      const res = await fetch("/api/projects", {
        headers: { "x-session-token": tokenToUse }
      });
      
      if (res.status === 401) {
        console.warn("Sessão expirada ou inválida ao buscar projetos. Redirecionando para login.");
        handleLogout();
        return;
      }

      const list = await safeJson(res);
      setProjectsList(list || []);
    } catch (e: any) {
      if (e?.message && (e.message.includes("expirou") || e.message.includes("inválida") || e.message.includes("autenticado"))) {
        console.warn("Sessão expirada ao carregar lista de projetos.");
        handleLogout();
      } else {
        console.error("Falha ao carregar lista de projetos:", e);
      }
    }
  };

  // Save active project to server
  const handleSaveProjectToServer = async (customEbookState?: EbookData, customSalesPageState?: SalesPageData) => {
    if (!sessionToken) return;

    // We need at least niche or generated Ebook to save a meaningful project
    if (!niche && !generatedEbook && !customEbookState) return;

    setIsSavingProject(true);
    try {
      const payload: any = {
        name: customEbookState?.title || generatedEbook?.title || productName || `Infoproduto ${niche || "Rascunho"}`,
        step: currentStep,
        niche,
        target_audience: targetAudience,
        tone,
        description,
        extra_details: extraDetails,
        ebook: customEbookState || generatedEbook,
        sales_page: customSalesPageState || generatedSalesPage,
        checklist,
        published_url: publishedUrl,
        is_using_fallback: isUsingFallback
      };

      if (activeProjectId) {
        payload.id = activeProjectId;
      }

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken
        },
        body: JSON.stringify(payload)
      });

      const saved = await safeJson(res);
      if (saved && saved.id) {
        setActiveProjectId(saved.id);
        // Refresh local list
        fetchUserProjects(sessionToken);
      }
    } catch (e) {
      console.error("Falha ao salvar projeto na nuvem:", e);
    } finally {
      setIsSavingProject(false);
    }
  };

  // Load a selected project
  const handleLoadSelectedProject = (proj: any) => {
    setActiveProjectId(proj.id);
    setCurrentStep(proj.step || 1);
    setNiche(proj.niche || "");
    setTargetAudience(proj.target_audience || "");
    setTone(proj.tone || "Persuasivo e Emocional");
    setDescription(proj.description || "");
    setExtraDetails(proj.extra_details || "");
    
    if (proj.ebook) {
      setProductName(proj.ebook.title);
      setGeneratedEbook(proj.ebook);
    } else {
      setProductName(proj.name || "");
      setGeneratedEbook(null);
    }

    setGeneratedSalesPage(proj.sales_page || null);
    setChecklist(proj.checklist || {});
    setPublishedUrl(proj.published_url || "");
    setIsUsingFallback(proj.is_using_fallback || false);
    setShowProjectsDropdown(false);
  };

  // Start fresh project
  const handleStartNewProject = () => {
    setActiveProjectId(null);
    setCurrentStep(1);
    setProductName("");
    setNiche("");
    setTargetAudience("");
    setTone("Persuasivo e Emocional");
    setDescription("");
    setExtraDetails("");
    setGeneratedEbook(null);
    setGeneratedSalesPage(null);
    setChecklist({});
    setPublishedUrl("");
    setIsUsingFallback(false);
    setShowProjectsDropdown(false);
  };

  // Delete project from server
  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sessionToken) return;
    if (!window.confirm("Deseja realmente deletar permanentemente este projeto do servidor?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { "x-session-token": sessionToken }
      });

      if (res.ok) {
        if (activeProjectId === id) {
          handleStartNewProject();
        }
        fetchUserProjects(sessionToken);
      } else {
        alert("Não foi possível excluir o projeto.");
      }
    } catch (err) {
      console.error("Erro ao deletar projeto:", err);
    }
  };

  // Login Success Callback
  const handleLoginSuccess = (token: string, user: any, keepConnected: boolean) => {
    setSessionToken(token);
    setCurrentUser(user);

    if (keepConnected) {
      localStorage.setItem("fabrica_session_token", token);
      localStorage.setItem("fabrica_session_user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("fabrica_session_token", token);
      sessionStorage.setItem("fabrica_session_user", JSON.stringify(user));
    }

    // Modo livre: todo usuário entra direto na ferramenta
    setAuthView("app");

    // Load projects list
    fetchUserProjects(token);
  };

  // Logout Handler
  const handleLogout = async () => {
    if (sessionToken) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "x-session-token": sessionToken }
        });
      } catch (e) {
        // ignore errors on logout
      }
    }

    // Clean browser state
    setSessionToken(null);
    setCurrentUser(null);
    localStorage.removeItem("fabrica_session_token");
    localStorage.removeItem("fabrica_session_user");
    sessionStorage.removeItem("fabrica_session_token");
    sessionStorage.removeItem("fabrica_session_user");
    
    // Clean local app states
    handleStartNewProject();
    setProjectsList([]);
    setAuthView("login");
  };

  // Pre-fill templates helper
  const prefillTemplate = (type: "fitness" | "money" | "ai") => {
    if (type === "fitness") {
      setProductName("Trincado em 21 Dias");
      setNiche("Emagrecimento & Fitness");
      setTargetAudience("Homens e mulheres de 25 a 40 anos sem tempo de ir à academia");
      setTone("Persuasivo e Emocional");
      setDescription("Um cronograma prático de treinos em casa de 15 minutos e um guia de alimentação inteligente sem passar fome.");
      setExtraDetails("Inclui lista de compras de supermercado barata e dicas para não desistir no final de semana.");
    } else if (type === "money") {
      setProductName("O Segredo da Liberdade Financeira");
      setNiche("Finanças & Investimentos");
      setTargetAudience("Jovens CLT que querem poupar e multiplicar dinheiro começando com R$ 100/mês");
      setTone("Didático e Passo a Passo");
      setDescription("Um método definitivo para sair das dívidas, organizar o orçamento mensal e fazer os primeiros investimentos de renda fixa e fundos imobiliários com segurança.");
      setExtraDetails("Foco em linguagem simples, sem termos técnicos difíceis.");
    } else if (type === "ai") {
      setProductName("Mestre do ChatGPT & IA");
      setNiche("Tecnologia & IA");
      setTargetAudience("Profissionais liberais e freelancers que querem produzir o triplo de conteúdo e economizar tempo");
      setTone("Amigável e Descontraído");
      setDescription("Os prompts secretos e modelos de automação para acelerar o trabalho diário, criar copys, e-mails e posts de redes sociais com inteligência artificial.");
      setExtraDetails("Contém templates prontos de engenharia de prompt práticos.");
    }
  };

  /**
   * Constrói o contexto unificado do sistema (System Context) agregando todas as variáveis de estado
   * do projeto (nicho, público, tom, persona, promessa, e-book, oferta e avatar) em uma string JSON estruturada.
   * Este contexto é injetado como `systemInstruction` em todas as chamadas de IA para garantir coerência profunda.
   */
  const buildSystemContext = (
    taskType: "ebook" | "salespage" | "ad_copy" | "avatar" | "vsl" | "general" = "general",
    overrides?: {
      productName?: string;
      niche?: string;
      targetAudience?: string;
      tone?: string;
      description?: string;
      extraDetails?: string;
      pricing?: { originalPrice?: string; discountedPrice?: string; guaranteeDays?: string };
      expert?: { name?: string; bio?: string };
      customChapters?: string[];
      customSynopsis?: string;
    }
  ): string => {
    const effectiveProductName = overrides?.productName || productName || generatedEbook?.title || "Infoproduto Exclusivo";
    const effectiveNiche = overrides?.niche || niche || "Marketing & Negócios";
    const effectiveTargetAudience = overrides?.targetAudience || targetAudience || "Público Comprador Qualificado";
    const effectiveTone = overrides?.tone || tone || "Persuasivo e Emocional";
    const effectiveDescription = overrides?.description || description || "Método prático e transformador";
    const effectiveExtraDetails = overrides?.extraDetails || extraDetails || "";

    const chaptersList = overrides?.customChapters 
      ? overrides.customChapters.map((c, i) => ({ number: i + 1, title: c }))
      : generatedEbook?.chapters?.map((c, i) => ({
          number: c.number || i + 1,
          title: c.title,
          summary: c.content ? c.content.slice(0, 150) + "..." : undefined
        })) || [];

    const contextPayload = {
      systemHeader: {
        role: "Diretor Estrategista e Master Copywriter da Fábrica de Infoprodutos (Infinity Million OS)",
        mission: "Gerar artefatos de infoprodutos de altíssimo padrão comercial e didático, mantendo coerência absoluta de persona, narrativa, posicionamento e promessa entre todas as etapas da esteira.",
        currentTask: taskType,
        language: "pt-BR",
        generatedAt: new Date().toISOString()
      },
      projectMetadata: {
        productName: effectiveProductName,
        niche: effectiveNiche,
        targetAudience: effectiveTargetAudience,
        corePromise: effectiveDescription,
        toneOfVoice: effectiveTone,
        extraDetails: effectiveExtraDetails || null
      },
      aiPersonaSettings: {
        preset: aiPersona.preset || "autoridade",
        provocationLevel: aiPersona.provocationLevel ?? 3,
        enthusiasmLevel: aiPersona.enthusiasmLevel ?? 4,
        complexityLevel: aiPersona.complexityLevel ?? 3,
        useAnalogies: aiPersona.useAnalogies !== false,
        useEmojiStyle: aiPersona.useEmojiStyle || "moderado",
        customNotes: aiPersona.customNotes || null
      },
      ebookStructure: generatedEbook ? {
        title: generatedEbook.title,
        subtitle: generatedEbook.subtitle,
        synopsis: overrides?.customSynopsis || generatedEbook.synopsis,
        totalChapters: generatedEbook.chapters?.length || 0,
        chapters: chaptersList,
        conclusion: generatedEbook.conclusion
      } : null,
      salesOfferData: (generatedSalesPage || overrides?.pricing) ? {
        originalPrice: overrides?.pricing?.originalPrice || generatedSalesPage?.pricing?.originalPrice || "R$ 197,00",
        discountedPrice: overrides?.pricing?.discountedPrice || generatedSalesPage?.pricing?.discountedPrice || "R$ 47,00",
        expertName: overrides?.expert?.name || generatedSalesPage?.expertName || currentUser?.name || "Especialista",
        expertBio: overrides?.expert?.bio || generatedSalesPage?.expertBio || "",
        guaranteeDays: overrides?.pricing?.guaranteeDays || generatedSalesPage?.guaranteeDays || "7"
      } : null,
      coherenceDirectives: [
        "LEI DA VERDADE ÚNICA: Todas as promessas, termos técnicos e argumentos devem ser 100% fiéis ao nicho e à promessa original do método.",
        "LEI DA HIPER-CONVERSÃO: Foco em clareza, especificidade, ancoragem de valor, quebra de objeções reais e ausência de clichês vazios.",
        "LEI DA PERSONA: O tom de voz e as métricas de provocação da persona devem ser rigorosamente aplicados ao vocabulário e estilo.",
        "LEI DO CONTEÚDO TRANSFORMADOR (PADRÃO DE E-BOOKS): Todo e qualquer e-book e capítulo DEVE entregar conteúdo de alto valor nos 4 pilares: 1) Dimensão Mental (quebra de crenças e clareza cognitiva), 2) Dimensão Emocional (autodomínio e gestão de ansiedade), 3) Dimensão Espiritual (propósito maior, ética e força interior) e 4) Tarefas Práticas acionáveis passo a passo para o nicho."
      ]
    };

    return JSON.stringify(contextPayload, null, 2);
  };

  // Generate Ebook trigger
  const handleGenerateEbook = async () => {
    if (!productName || !niche || !targetAudience || !description) {
      setError("Por favor, preencha todos os campos obrigatórios para que a IA fabrique seu e-book.");
      return;
    }

    setError(null);
    setIsUsingFallback(false);
    setIsEbookGenerating(true);
    setLoading(true);

    const messages = [
      "Escrevendo um título magnético focado na promessa...",
      "Estruturando introdução e sinopse de alto impacto...",
      "Redigindo capítulos profundos: Mental, Emocional e Espiritual...",
      "Criando tarefas práticas acionáveis passo a passo para o nicho...",
      "Revisando texto e formatando plano de ação completo...",
    ];

    let msgIdx = 0;
    setLoadingMessage(messages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingMessage(messages[msgIdx]);
    }, 4000);

    try {
      const systemInstruction = buildSystemContext("ebook");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-session-token": sessionToken || ""
        },
        body: JSON.stringify({
          type: "ebook",
          productName,
          niche,
          targetAudience,
          tone,
          description,
          extraDetails,
          aiPersona,
          systemInstruction
        })
      });

      const data = await safeJson(response);

      if (data.isFallback) {
        setIsUsingFallback(true);
      }

      // Format Ebook structure with fallback default fields, PRESERVING existing cover image & style
      const existingCoverImage = generatedEbook?.cover?.imageUrl || generatedEbook?.coverImage || undefined;
      const formattedEbook: EbookData = {
        title: data.title || productName,
        subtitle: data.subtitle || "A transformação definitiva passo a passo",
        author: currentUser?.name || "Especialista em Sucesso",
        coverColor: generatedEbook?.coverColor || "slate",
        coverPattern: niche,
        synopsis: data.synopsis || "Introdução para prender seu público...",
        chapters: data.chapters || [],
        conclusion: data.conclusion || "Conclusão e encerramento inspirador.",
        callToAction: "Para acessar materiais adicionais, checklists e atualizações exclusivas, fale com nosso suporte ou acesse nossa página oficial.",
        coverImage: existingCoverImage,
        cover: generatedEbook?.cover ? {
          ...generatedEbook.cover,
          imageUrl: existingCoverImage || generatedEbook.cover.imageUrl,
          coverImage: existingCoverImage || generatedEbook.cover.coverImage
        } : undefined
      };

      setGeneratedEbook(formattedEbook);
      setIsEbookGenerating(false);

      // Brief smooth transition to let the 4 pillars visual progress bar celebrate 100% completion
      setTimeout(() => {
        setLoading(false);
        setCurrentStep(1); // Stay on step 1 to read and edit the created book!
        setTimeout(() => handleSaveProjectToServer(formattedEbook), 500);
      }, 1000);
    } catch (err: any) {
      setIsEbookGenerating(false);
      setLoading(false);
      setError(err.message || "Erro inesperado ao falar com o servidor. Tente novamente.");
    } finally {
      clearInterval(interval);
    }
  };

  // Generate Sales Page copy trigger
  const handleGenerateSalesPage = async (params: {
    originalPrice: string;
    discountedPrice: string;
    expertName: string;
    expertBio: string;
    guaranteeDays: string;
    checkoutLink: string;
    supportWhatsapp: string;
    themeColor: string;
    vslEnabled?: boolean;
    vslPlatform?: "youtube" | "vimeo" | "panda" | "other";
    vslUrl?: string;
    vslEmbedCode?: string;
    vslTitle?: string;
    vslSubtitle?: string;
    vslShowCtaBelow?: boolean;
    vslCtaText?: string;
    vslAutoplayMuted?: boolean;
    vslVisible?: boolean;
    vslPosition?: "top" | "bottom";
  }) => {
    if (!generatedEbook) {
      setError("Gere primeiro o e-book na Etapa 1 antes de criar a página de vendas.");
      return;
    }

    setError(null);
    setIsUsingFallback(false);
    setLoading(true);

    const messages = [
      "Analisando conteúdo e promessa do seu e-book...",
      "Redigindo Headline persuasiva com alto poder de conversão...",
      "Estruturando gatilhos emocionais e quebra de objeções...",
      "Convertendo os capítulos do e-book em argumentos comerciais...",
      "Configurando a oferta irresistível e FAQ...",
    ];

    let msgIdx = 0;
    setLoadingMessage(messages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingMessage(messages[msgIdx]);
    }, 4000);

    try {
      const systemInstruction = buildSystemContext("salespage", {
        productName: generatedEbook.title,
        description: `Ebook ensina: ${description}. Resumo: ${generatedEbook.synopsis}`,
        extraDetails: `Especialista: ${params.expertName}. Bio: ${params.expertBio}. Preço: ${params.discountedPrice}`,
        pricing: {
          originalPrice: params.originalPrice,
          discountedPrice: params.discountedPrice,
          guaranteeDays: params.guaranteeDays
        },
        expert: {
          name: params.expertName,
          bio: params.expertBio
        },
        customChapters: generatedEbook.chapters.map(c => c.title)
      });

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-session-token": sessionToken || ""
        },
        body: JSON.stringify({
          type: "salespage",
          productName: generatedEbook.title,
          niche,
          targetAudience,
          tone,
          description: `Ebook ensina: ${description}. Resumo: ${generatedEbook.synopsis}`,
          extraDetails: `Especialista: ${params.expertName}. Bio: ${params.expertBio}. Preço: ${params.discountedPrice}`,
          aiPersona,
          chapters: generatedEbook.chapters.map(c => c.title),
          pricing: {
            originalPrice: params.originalPrice,
            discountedPrice: params.discountedPrice
          },
          expert: {
            name: params.expertName,
            bio: params.expertBio
          },
          systemInstruction
        })
      });

      const data = await safeJson(response);

      if (data.isFallback) {
        setIsUsingFallback(true);
      }

      // Initialize sales page layout state
      const formattedPage: SalesPageData = {
        headline: data.headline || "Headline de alta conversão",
        subheadline: data.subheadline || "Subheadline de alta conversão",
        videoPlaceholderText: data.videoPlaceholderText || "Descrição do vídeo VSL",
        hookText: data.hookText || "Texto persuasivo de entrada",
        painPoints: data.painPoints || [],
        benefits: data.benefits || [],
        testimonials: data.testimonials || [],
        faq: data.faq || [],
        pricing: {
          originalPrice: params.originalPrice,
          discountedPrice: params.discountedPrice,
          ctaText: "QUERO GARANTIR MINHA VAGA AGORA"
        },
        expertName: params.expertName,
        expertBio: params.expertBio,
        guaranteeDays: params.guaranteeDays,
        checkoutLink: params.checkoutLink,
        supportWhatsapp: params.supportWhatsapp,
        themeColor: params.themeColor,
        sectionsVisibility: {
          hero: true,
          problem: true,
          transformation: true,
          productIntro: true,
          whatYouLearn: true,
          benefits: true,
          testimonials: data.testimonials && data.testimonials.length > 0,
          offer: true,
          guarantee: params.guaranteeDays !== "0",
          faq: true
        },
        sectionsOrder: [
          "hero",
          "problem",
          "transformation",
          "productIntro",
          "whatYouLearn",
          "benefits",
          "testimonials",
          "offer",
          "guarantee",
          "faq"
        ],
        vslEnabled: params.vslEnabled ?? false,
        vslPlatform: params.vslPlatform ?? "youtube",
        vslUrl: params.vslUrl ?? "",
        vslEmbedCode: params.vslEmbedCode ?? "",
        vslTitle: params.vslTitle ?? "Assista ao vídeo e descubra como funciona",
        vslSubtitle: params.vslSubtitle ?? "Depois de assistir, clique no botão abaixo para garantir seu acesso.",
        vslShowCtaBelow: params.vslShowCtaBelow ?? true,
        vslCtaText: params.vslCtaText ?? "QUERO GARANTIR MINHA VAGA AGORA",
        vslAutoplayMuted: params.vslAutoplayMuted ?? false,
        vslVisible: params.vslVisible ?? true,
        vslPosition: params.vslPosition ?? "top"
      };

      setGeneratedSalesPage(formattedPage);
      
      // Save immediately to cloud database
      setTimeout(() => handleSaveProjectToServer(generatedEbook, formattedPage), 500);
    } catch (err: any) {
      setError(err.message || "Falha ao gerar copy da página de vendas.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleFinishProject = () => {
    // Scroll smoothly to top on final finish confirmation
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep(4);
    setTimeout(() => handleSaveProjectToServer(), 100);
  };

  // Return Loading Screen while checking initial token validation
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center text-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-850 border-t-emerald-500 animate-spin mb-4" />
        <h4 className="font-extrabold text-sm uppercase tracking-widest text-slate-400">Verificando Chaves de Acesso...</h4>
        <p className="text-slate-600 text-[11px] font-mono mt-1">Garantindo sua segurança e sessão individual ativa.</p>
      </div>
    );
  }

  // View Routing: Blended Client Authentication Screens
  if (authView === "login") {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (authView === "blocked") {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center text-xs font-mono text-emerald-400">Carregando tela...</div>}>
        <BlockedScreen onLogout={handleLogout} email={currentUser?.email} />
      </React.Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      
      {/* Top Main Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 text-slate-950 p-2 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 font-bold animate-pulse" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm md:text-base tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-display">
                FÁBRICA DE INFOPRODUTOS
              </h1>
              <p className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">Criação, Copy & Publicação</p>
            </div>
          </div>

          {/* Controls: Admin Toggle, Project Selector, User Info, Logout */}
          <div className="flex items-center gap-2.5">
            
            {/* Admin toggle */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setAuthView(authView === "admin" ? "app" : "admin")}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition ${authView === "admin" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"}`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{authView === "admin" ? "Acessar Ferramenta" : "Painel do Administrador"}</span>
                <span className="sm:hidden">{authView === "admin" ? "App" : "Painel"}</span>
              </button>
            )}

            {/* Project manager dropdown selector */}
            {authView === "app" && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProjectsDropdown(!showProjectsDropdown)}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline truncate max-w-[120px]">
                    {activeProjectId ? projectsList.find(p => p.id === activeProjectId)?.name || "Projeto Salvo" : "Meus Projetos"}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                <AnimatePresence>
                  {showProjectsDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-2.5 shadow-2xl z-50 flex flex-col gap-1.5"
                    >
                      <div className="flex justify-between items-center px-1.5 pb-1 border-b border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Histórico de Projetos</span>
                        <button
                          type="button"
                          onClick={handleStartNewProject}
                          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <Plus className="w-3 h-3" />
                          Criar Novo
                        </button>
                      </div>

                      <motion.div 
                        variants={dropdownStaggerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-1 max-h-[180px] overflow-y-auto scrollbar-thin"
                      >
                        {projectsList.length === 0 ? (
                          <motion.div 
                            variants={dropdownItemVariants}
                            className="text-center text-slate-500 text-[11px] py-4 italic"
                          >
                            Nenhum projeto salvo na nuvem ainda.
                          </motion.div>
                        ) : (
                          projectsList.map(p => (
                            <motion.div
                              key={p.id}
                              variants={dropdownItemVariants}
                            >
                              <button
                                type="button"
                                onClick={() => handleLoadSelectedProject(p)}
                                className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between gap-2 transition ${activeProjectId === p.id ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "hover:bg-slate-850 text-slate-300"}`}
                              >
                                <span className="truncate flex-1 pr-2 font-medium">{p.name}</span>
                                <span
                                  onClick={(e) => handleDeleteProject(p.id, e)}
                                  className="text-slate-500 hover:text-rose-400 p-0.5"
                                  title="Deletar este projeto do servidor"
                                >
                                  ×
                                </span>
                              </button>
                            </motion.div>
                          ))
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Save indicator / button */}
            {authView === "app" && (niche || generatedEbook) && (
              <button
                type="button"
                onClick={() => handleSaveProjectToServer()}
                disabled={isSavingProject}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white p-1.5 rounded-lg transition shrink-0"
                title="Salvar alterações no servidor agora"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSavingProject ? "animate-spin text-emerald-400" : ""}`} />
              </button>
            )}

            {/* Tour/Tutorial Replay Button */}
            {authView === "app" && (
              <button
                type="button"
                onClick={() => setShowWelcomeTour(true)}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg transition shrink-0"
                title="Ver Tour de Boas-vindas"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            )}

            {/* User profile identifier block & Logout */}
            <div className="flex items-center gap-2 border-l border-slate-800 pl-2.5">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-[11px] font-bold text-white leading-none">{currentUser?.name}</span>
                <span className="text-[9px] text-slate-500 font-mono mt-0.5">{currentUser?.email}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white p-1.5 rounded-lg transition"
                title="Sair da conta"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Primary Layout Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col">
        
        {/* VIEW ROUTER */}
        {authView === "admin" && isAdmin ? (
          <React.Suspense fallback={<div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-xs text-emerald-400 font-mono">Carregando Painel de Administração...</div>}>
            <AdminPanel 
              sessionToken={sessionToken!} 
              onClose={() => setAuthView("app")} 
              currentUser={currentUser}
            />
          </React.Suspense>
        ) : (
          /* STANDARD APP VIEW (INFINITY MILLION OS & WIZARD) */
          <>
            {/* Top Navigation Header for Infinity Million OS Suite */}
            <InfinityOSHeader
              activeTab={osTab}
              setActiveTab={setOsTab}
              experienceLevel={experienceLevel}
              onChangeExperienceLevel={() => setShowNivelamentoModal(true)}
            />

            {/* NIVELAMENTO EXPERIÊNCIA MODAL */}
            {showNivelamentoModal && (
              <div className="mb-6">
                <NivelamentoExperienceModal
                  currentLevel={experienceLevel}
                  onSelectLevel={(lvl) => {
                    setExperienceLevel(lvl);
                    setShowNivelamentoModal(false);
                  }}
                  onClose={() => setShowNivelamentoModal(false)}
                />
              </div>
            )}

            {/* CENTRAL DE EVOLUÇÃO (HUB) */}
            {osTab === "evolucao" && (
              <CentralEvolucao
                currentLevelName={experienceLevel === "iniciante" ? "Explorador Digital" : experienceLevel === "intermediario" ? "Estrategista de Vendas" : "Escalador Múltiplos 6D"}
                progressPercent={42}
                lastMissionCompleted="Produto Digital e Capa Gerados com Sucesso"
                nextMissionTitle="Publicar a Página de Vendas e Configurar Oferta"
                aiRecommendation={experienceLevel === "iniciante" ? "Siga o passo a passo simplificado da Fábrica para ter seu primeiro produto em 24h." : "Antes de criar anúncios, acerte a promessa e adicione um Order Bump no checkout."}
                estimatedTimeMinutes={25}
                onContinueJourney={() => setOsTab("wizard")}
                onOpenCentral={(centralId) => setOsTab(centralId as any)}
              />
            )}

            {/* BRAND OS HUB */}
            {osTab === "brand_os" && (
              <React.Suspense fallback={<div className="p-8 text-center text-xs text-amber-400 font-mono">Carregando Infinity Brand OS...</div>}>
                <BrandOSHub />
              </React.Suspense>
            )}

            {/* BIBLIOTECA & DASHBOARD DE DNA VISUAL (GOURMET, DARK MONEY, ETC.) */}
            {osTab === "visual_dna" && (
              <React.Suspense fallback={<div className="p-8 text-center text-xs text-amber-400 font-mono">Carregando Dashboard de DNA Visual...</div>}>
                <VisualStyleDashboard
                  onApplyToCover={(style) => {
                    setActiveVisualDna(style);
                    if (generatedEbook) {
                      const existingCoverImage = generatedEbook.cover?.imageUrl || generatedEbook.coverImage || "";
                      const updatedCover = {
                        ...(generatedEbook.cover || {}),
                        imageUrl: existingCoverImage,
                        coverImage: existingCoverImage,
                        useAiArt: !!existingCoverImage,
                        typography: style.typography.headingFont,
                        titleColor: style.colors.text,
                        subtitleColor: style.colors.mutedText,
                        authorColor: style.colors.accent,
                        overlayColor: "gradient",
                        overlayOpacity: 0.6,
                        styleName: style.name,
                        appliedDnaId: style.id,
                        appliedDnaName: style.name
                      };
                      const updated: EbookData = {
                        ...generatedEbook,
                        coverImage: existingCoverImage,
                        cover: updatedCover
                      };
                      setGeneratedEbook(updated);
                      setTimeout(() => handleSaveProjectToServer(updated), 200);
                    }
                    setCurrentStep(1);
                    setOsTab("wizard");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onApplyToCreatives={(style) => {
                    setActiveVisualDna(style);
                    setAdCreativeSubStep(4); // Open the Creative Composer right away!
                    setCurrentStep(4);
                    setOsTab("wizard");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onApplyToAll={(style) => {
                    setActiveVisualDna(style);
                    if (generatedEbook) {
                      const existingCoverImage = generatedEbook.cover?.imageUrl || generatedEbook.coverImage || "";
                      const updatedCover = {
                        ...(generatedEbook.cover || {}),
                        imageUrl: existingCoverImage,
                        coverImage: existingCoverImage,
                        useAiArt: !!existingCoverImage,
                        typography: style.typography.headingFont,
                        titleColor: style.colors.text,
                        subtitleColor: style.colors.mutedText,
                        authorColor: style.colors.accent,
                        overlayColor: "gradient",
                        overlayOpacity: 0.6,
                        styleName: style.name,
                        appliedDnaId: style.id,
                        appliedDnaName: style.name
                      };
                      const updated: EbookData = {
                        ...generatedEbook,
                        coverImage: existingCoverImage,
                        cover: updatedCover
                      };
                      setGeneratedEbook(updated);
                      setTimeout(() => handleSaveProjectToServer(updated), 200);
                    }
                    setAdCreativeSubStep(4);
                    setCurrentStep(1);
                    setOsTab("wizard");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onNavigateToTab={(tab, step) => {
                    if (step) {
                      if (step === 4) setAdCreativeSubStep(4);
                      setCurrentStep(step);
                    }
                    setOsTab(tab as any);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </React.Suspense>
            )}

            {/* CENTRAL DE IA (20 MÓDULOS) */}
            {osTab === "central_ia" && <CentralIA initialModuleId={centralIaModuleId} />}

            {/* CENTRAL DE FERRAMENTAS IA */}
            {osTab === "ferramentas_ia" && (
              <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Carregando Central de Ferramentas IA...</div>}>
                <CentralFerramentasIA />
              </React.Suspense>
            )}

            {/* BIBLIOTECA DE EXEMPLOS */}
            {osTab === "exemplos" && (
              <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Carregando Biblioteca de Exemplos...</div>}>
                <BibliotecaExemplos />
              </React.Suspense>
            )}

            {/* SIMULADOR DE VIABILIDADE */}
            {osTab === "simulador" && (
              <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Carregando Simulador Financeiro...</div>}>
                <SimuladorViabilidade />
              </React.Suspense>
            )}

            {/* CHECKLIST DE PUBLICAÇÃO */}
            {osTab === "checklist" && (
              <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Carregando Checklist...</div>}>
                <ChecklistPublicacao />
              </React.Suspense>
            )}

            {/* CENTRAL DE DIAGNÓSTICO */}
            {osTab === "diagnostico" && <CentralDiagnostico />}

            {/* CENTRAL DE MISSÕES */}
            {osTab === "missoes" && <CentralMissoes />}

            {/* CENTRAL FINANCEIRA */}
            {osTab === "financeiro" && <CentralFinanceira />}

            {/* SALA DO CEO */}
            {osTab === "ceo" && (
              <SalaCEO
                onExecuteStep={(target) => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  if (target.type === "central_ia") {
                    setCentralIaModuleId(target.moduleId || 8);
                    setOsTab("central_ia");
                  } else if (target.type === "socio_estrategico" || target.type === "wizard") {
                    setCurrentStep(target.step || 8);
                    setOsTab("wizard");
                  } else {
                    setCurrentStep(8);
                    setOsTab("wizard");
                  }
                }}
                onGoToSocioEstrategico={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setCurrentStep(8);
                  setOsTab("wizard");
                }}
              />
            )}

            {/* FÁBRICA DE INFOPRODUTOS (WIZARD DE 7 ETAPAS) */}
            {osTab === "wizard" && (
              <>
                {/* Wizard 3-Step Indicator Bar */}
                <ThreeStepIndicator 
                  currentStep={currentStep} 
                  setStep={(step) => {
                    setCurrentStep(step);
                    // Save progress
                    setTimeout(() => handleSaveProjectToServer(), 100);
                  }} 
                  isEbookReady={!!generatedEbook}
                  isSalesPageReady={!!generatedSalesPage}
                />

            {/* Contingency Offline/Fallback alert banner */}
            {isUsingFallback && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-2xl p-4 flex gap-3 items-start my-4 animate-fade-in"
              >
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm">
                  <strong className="text-white block mb-0.5">Modo de Contingência Ativo ⚡</strong>
                  <span>
                    Devido à altíssima demanda ou esgotamento de limites nos servidores do Gemini, ativamos o nosso gerador de contingência local inteligente para fabricar seu infoproduto. Você pode ler, editar e exportar o conteúdo completo e a copy normalmente sem qualquer interrupção!
                  </span>
                </div>
              </motion.div>
            )}

            {/* Global Loading / Real-Time 4 Pillars Construction Progress */}
            {loading && (
              currentStep === 1 ? (
                <div className="my-4 animate-fade-in">
                  <EbookGenerationProgress
                    productName={productName}
                    niche={niche}
                    targetAudience={targetAudience}
                    tone={tone}
                    isGenerating={isEbookGenerating}
                  />
                  <div className="w-full max-w-md mx-auto mt-4">
                    <FloatingVerses location="loading" inline={true} />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-center items-center text-center gap-4 min-h-[350px] shadow-2xl my-4 animate-fade-in">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin" />
                    <Sparkles className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Processando Inteligência Artificial...</h4>
                    <p className="text-emerald-400 text-xs font-mono mt-1">{loadingMessage}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed mt-2">
                    Não feche esta página. Nossas redes neurais estão redigindo copys persuasivas e estruturando capítulos profundos.
                  </p>
                  <div className="w-full max-w-md mt-4">
                    <FloatingVerses location="loading" inline={true} />
                  </div>
                </div>
              )
            )}

            {/* Dynamic Display of steps with smooth transitions */}
            {!loading && (
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  
                  {/* ETAPA 1: CRIAÇÃO DO E-BOOK */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full"
                    >
                      <AnimatePresence mode="wait">
                        {!generatedEbook ? (
                          /* Form to request and configure the book generation */
                          <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                          >
                            
                            {/* Form Controls Column (5 Cols) */}
                            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4 relative">
                              
                              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                                  <Layers className="w-4 h-4 text-emerald-400" />
                                  Formular Meu E-book
                                </h3>
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-950 px-2.5 py-1 rounded-full">Passo 1/3</span>
                              </div>

                              {/* Templates Selection helper */}
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                  Ideias Prontas de Exemplo para Testar:
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => prefillTemplate("fitness")}
                                    className="bg-slate-950/40 hover:bg-slate-800/80 text-left p-2 rounded-lg border border-slate-800 hover:border-slate-750 transition text-[11px] flex flex-col gap-0.5"
                                  >
                                    <span className="font-bold text-rose-400">🔥 Fitness</span>
                                    <span className="text-[9px] text-slate-400 line-clamp-1">Treinos em Casa</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => prefillTemplate("money")}
                                    className="bg-slate-950/40 hover:bg-slate-800/80 text-left p-2 rounded-lg border border-slate-800 hover:border-slate-750 transition text-[11px] flex flex-col gap-0.5"
                                  >
                                    <span className="font-bold text-emerald-400">💰 Dinheiro</span>
                                    <span className="text-[9px] text-slate-400 line-clamp-1">Liberdade CLT</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => prefillTemplate("ai")}
                                    className="bg-slate-950/40 hover:bg-slate-800/80 text-left p-2 rounded-lg border border-slate-800 hover:border-slate-750 transition text-[11px] flex flex-col gap-0.5"
                                  >
                                    <span className="font-bold text-indigo-400">🤖 Prompt IA</span>
                                    <span className="text-[9px] text-slate-400 line-clamp-1">Mestre ChatGPT</span>
                                  </button>
                                </div>
                              </div>

                              {/* Input fields */}
                              <div className="flex flex-col gap-3.5">
                                
                                <div>
                                  <label htmlFor="prodName" className="text-xs font-bold text-slate-300 block mb-1">
                                    Nome do Infoproduto <span className="text-emerald-400">*</span>
                                  </label>
                                  <input
                                    id="prodName"
                                    type="text"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="Ex: Guia do Sono Profundo"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label htmlFor="prodNiche" className="text-xs font-bold text-slate-300 block mb-1">
                                      Nicho / Mercado <span className="text-emerald-400">*</span>
                                    </label>
                                    <select
                                      id="prodNiche"
                                      value={niche}
                                      onChange={(e) => setNiche(e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                                    >
                                      <option value="">Selecione...</option>
                                      {niches.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <label htmlFor="prodTone" className="text-xs font-bold text-slate-300 block mb-1">
                                      Tom de Voz da IA <span className="text-emerald-400">*</span>
                                    </label>
                                    <select
                                      id="prodTone"
                                      value={tone}
                                      onChange={(e) => setTone(e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                                    >
                                      {tones.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label htmlFor="prodAudience" className="text-xs font-bold text-slate-300 block mb-1">
                                    Quem é o Público-Alvo? <span className="text-emerald-400">*</span>
                                  </label>
                                  <input
                                    id="prodAudience"
                                    type="text"
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    placeholder="Ex: Mães exaustas com bebês de 0 a 12 meses"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="prodDesc" className="text-xs font-bold text-slate-300 block mb-1">
                                    O que esse material ensina? <span className="text-emerald-400">*</span>
                                  </label>
                                  <textarea
                                    id="prodDesc"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Ex: Rotinas de sono infantil, massagens relaxantes, ambiente perfeito e dicas para desmame noturno."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition resize-none leading-relaxed"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="prodExtra" className="text-xs font-bold text-slate-300 block mb-1">
                                    Bônus ou detalhes adicionais (Opcional)
                                  </label>
                                  <textarea
                                    id="prodExtra"
                                    rows={2}
                                    value={extraDetails}
                                    onChange={(e) => setExtraDetails(e.target.value)}
                                    placeholder="Ex: Adicionar lista com tabela de rotinas e sons relaxantes recomendados."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition resize-none leading-relaxed"
                                  />
                                </div>

                              </div>

                              {error && (
                                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex gap-1.5 items-start mt-1">
                                  <AlertTriangle className="w-4 h-4 shrink-0" />
                                  <span>{error}</span>
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={handleGenerateEbook}
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:brightness-110"
                              >
                                <Sparkles className="w-4.5 h-4.5" />
                                <span>Fabricar Meu E-book com IA 🚀</span>
                              </button>

                            </div>

                            {/* Tutorial / Explanation Column (7 Cols) */}
                            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl min-h-[450px] flex flex-col justify-between gap-6 relative">
                              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03),transparent)] pointer-events-none" />
                              
                              {/* Didactic Premium Example Quick Loader */}
                              <div className="bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-slate-900 border-2 border-indigo-500/35 rounded-2xl p-5 text-left relative overflow-hidden group">
                                <div className="absolute top-0 right-0 bg-indigo-500 text-slate-950 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow">
                                  Pronto para Uso
                                </div>
                                <div className="flex gap-3 items-start">
                                  <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                                    <Sparkles className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-wider mb-1">
                                      Exemplo Didático Prontinho para Venda:
                                    </h4>
                                    <h3 className="text-sm font-black text-white leading-snug">
                                      MESTRE DO CHATGPT & IA: ROMPENDO A MATRIX DO MARKETING DIGITAL
                                    </h3>
                                    <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
                                      Não quer preencher o formulário agora? Carregue este e-book de exemplo real de 4 capítulos profundos com design de capa premium pronto para uso, edição e download!
                                    </p>
                                    
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setProductName("Mestre do ChatGPT & IA: Rompendo a Matrix do Marketing Digital");
                                        setNiche("Tecnologia & IA");
                                        setTargetAudience("Empreendedores e Profissionais de Marketing");
                                        setTone("Amigável e Descontraído");
                                        setDescription("Como usar a inteligência artificial para quebrar crenças limitantes, automatizar suas vendas e construir sua verdadeira liberdade financeira.");
                                        setGeneratedEbook(DIDACTIC_EBOOK_EXAMPLE);
                                        setCurrentStep(1); // Stay on step 1 to view and edit
                                        // Save immediately
                                        setTimeout(() => {
                                          try {
                                            // @ts-ignore
                                            handleSaveProjectToServer(DIDACTIC_EBOOK_EXAMPLE);
                                          } catch (e) {
                                            console.warn("Server save failed on load, local state is ready.", e);
                                          }
                                        }, 400);
                                      }}
                                      className="mt-3.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-extrabold text-[11px] py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-[0.98]"
                                    >
                                      <BookOpen className="w-4 h-4" />
                                      <span>Carregar E-book Didático Pronto ⚡</span>
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Direction / Tutorial on Downloading PDF */}
                              <div className="bg-slate-950/60 rounded-2xl border border-slate-850 p-5 text-left w-full flex flex-col gap-3">
                                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                  <Download className="w-4.5 h-4.5 text-emerald-400" />
                                  COMO BAIXAR SEU LIVRO EM PDF:
                                </h4>
                                
                                <div className="flex flex-col gap-2.5 text-[11px] text-slate-300">
                                  <div className="flex gap-2 items-start">
                                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px] border border-emerald-500/20">1</span>
                                    <p className="leading-relaxed">
                                      Clique em <strong className="text-white">"Carregar E-book Didático"</strong> acima ou digite suas ideias e clique em <strong className="text-white">"Fabricar Meu E-book com IA"</strong>.
                                    </p>
                                  </div>
                                  <div className="flex gap-2 items-start">
                                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px] border border-emerald-500/20">2</span>
                                    <p className="leading-relaxed">
                                      Na tela do leitor digital do livro, use o botão verde <strong className="text-emerald-400">"Baixar em PDF"</strong> para gerar e fazer o download do documento completo formatado.
                                    </p>
                                  </div>
                                  <div className="flex gap-2 items-start">
                                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px] border border-emerald-500/20">3</span>
                                    <p className="leading-relaxed">
                                      Use o botão <strong className="text-white">"Baixar Criativo (Capa PNG)"</strong> para obter a capa do e-book em altíssima qualidade para usar nos seus anúncios de venda!
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-500 border-t border-slate-800/60 pt-3 mt-1">
                                  <div className="flex items-center gap-1">✓ Conversão em PDF Alta Resolução</div>
                                  <div className="flex items-center gap-1">✓ Diagramação Automática</div>
                                </div>
                              </div>

                            </div>

                          </motion.div>
                        ) : (
                          /* Digital book reader view with customizations */
                          <motion.div
                            key="reader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                             <EbookStep
                               ebook={generatedEbook}
                               niche={niche}
                               description={description}
                               targetAudience={targetAudience}
                               sessionToken={sessionToken || undefined}
                               activeVisualDna={activeVisualDna}
                               setEbook={(eb) => {
                                 setGeneratedEbook(eb);
                                 // Auto save state (debounced to prevent cursor jumping/spams)
                                 debouncedSaveProjectToServer(eb);
                               }}
                               onSave={() => handleSaveProjectToServer()}
                               onNextStep={() => {
                                 setCurrentStep(2);
                                 handleSaveProjectToServer();
                               }}
                             />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* ETAPA 2: CRIAÇÃO DA PÁGINA DE VENDAS */}
                  {currentStep === 2 && generatedEbook && (
                    <motion.div
                      key="step-2"
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full"
                    >
                      <SalesPageStep
                        salesPage={generatedSalesPage}
                        setSalesPage={(sp) => {
                          setGeneratedSalesPage(sp);
                          debouncedSaveProjectToServer(generatedEbook, sp);
                        }}
                        ebook={generatedEbook}
                        onGenerateSalesPage={handleGenerateSalesPage}
                        loading={loading}
                        loadingMessage={loadingMessage}
                        onNextStep={() => {
                          setCurrentStep(3);
                          handleSaveProjectToServer();
                        }}
                      />
                    </motion.div>
                  )}

                  {/* ETAPA 3: PUBLICAÇÃO E VENDA */}
                  {currentStep === 3 && generatedEbook && generatedSalesPage && (
                    <motion.div
                      key="step-3"
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full"
                    >
                      <React.Suspense fallback={<div className="p-8 text-center text-xs text-emerald-400 font-mono">Carregando Publicação...</div>}>
                        <PublishStep
                          salesPage={generatedSalesPage}
                          setSalesPage={(sp) => {
                            setGeneratedSalesPage(sp);
                            handleSaveProjectToServer(generatedEbook, sp);
                          }}
                          ebook={generatedEbook}
                          setEbook={(eb) => {
                            setGeneratedEbook(eb);
                            handleSaveProjectToServer(eb, generatedSalesPage);
                          }}
                          checklist={checklist}
                          setChecklist={(chk) => {
                            setChecklist(chk);
                            // Trigger quick save on change
                            setTimeout(() => handleSaveProjectToServer(), 100);
                          }}
                          publishedUrl={publishedUrl}
                          setPublishedUrl={(url) => {
                            setPublishedUrl(url);
                            setTimeout(() => handleSaveProjectToServer(), 100);
                          }}
                          onFinish={handleFinishProject}
                        />
                      </React.Suspense>
                    </motion.div>
                  )}

                  {/* ETAPA 4: CRIADOR DE ANÚNCIOS COM IA */}
                  {currentStep === 4 && (generatedEbook || productName) && (
                    <motion.div
                      key="step-4"
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full"
                    >
                      <React.Suspense fallback={<div className="p-8 text-center text-xs text-emerald-400 font-mono">Carregando Criador de Anúncios...</div>}>
                        <AdCreativeStep
                          projectId={activeProjectId}
                          salesPage={generatedSalesPage || {
                            headline: `Descubra ${generatedEbook?.title || productName || "o Método Definitivo"}`,
                            subheadline: generatedEbook?.subtitle || "A transformação passo a passo que você precisa",
                            story: generatedEbook?.synopsis || description || "",
                            targetAudience: targetAudience || "Público Geral",
                            bullets: [],
                            authorBio: generatedEbook?.author || currentUser?.name || "Especialista",
                            price: "R$ 47,00",
                            guaranteeDays: "7 dias",
                            faq: []
                          }}
                          ebook={generatedEbook || {
                            title: productName || "Meu E-book",
                            subtitle: "Guia Definitivo",
                            author: currentUser?.name || "Autor",
                            coverColor: "slate",
                            coverPattern: niche || "Geral",
                            synopsis: description || "",
                            chapters: [],
                            conclusion: "",
                            callToAction: ""
                          }}
                          sessionToken={sessionToken!}
                          systemInstruction={buildSystemContext("ad_copy")}
                          initialSubStep={adCreativeSubStep}
                          activeVisualDna={activeVisualDna}
                          onBack={() => {
                            setCurrentStep(3);
                            setTimeout(() => handleSaveProjectToServer(), 100);
                          }}
                          onNextToAvatar={() => {
                            setCurrentStep(5);
                            setTimeout(() => handleSaveProjectToServer(), 100);
                          }}
                          productName={productName || generatedEbook?.title}
                          niche={niche || generatedEbook?.coverPattern}
                          targetAudience={targetAudience}
                          description={description || generatedEbook?.synopsis}
                        />
                      </React.Suspense>
                    </motion.div>
                  )}

                  {/* ETAPA 5: DESCOBRIR AVATAR IDEAL */}
                  {currentStep === 5 && generatedEbook && (
                    <motion.div
                      key="step-5"
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full"
                    >
                      <React.Suspense fallback={<div className="p-8 text-center text-xs text-emerald-400 font-mono">Carregando Gerador de Avatar...</div>}>
                        <IdealAvatarStep
                          ebook={generatedEbook}
                          productName={productName}
                          niche={niche}
                          targetAudience={targetAudience}
                          description={description}
                          sessionToken={sessionToken!}
                          systemInstruction={buildSystemContext("avatar")}
                          onBackToAds={() => {
                            setCurrentStep(4);
                            setTimeout(() => handleSaveProjectToServer(), 100);
                          }}
                          onNextToVsl={() => {
                            setCurrentStep(6);
                            setTimeout(() => handleSaveProjectToServer(), 100);
                          }}
                        />
                      </React.Suspense>
                    </motion.div>
                  )}

                  {/* ETAPA 6: ROTEIRO VSL (VÍDEO DE VENDAS) */}
                  {currentStep === 6 && generatedEbook && (
                    <motion.div
                      key="step-6"
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full"
                    >
                      <React.Suspense fallback={<div className="p-8 text-center text-xs text-emerald-400 font-mono">Carregando Roteiro VSL...</div>}>
                        <VslScriptStep
                          ebook={generatedEbook}
                          productName={productName}
                          niche={niche}
                          targetAudience={targetAudience}
                          description={description}
                          price={generatedSalesPage?.price || "R$ 47,00"}
                          sessionToken={sessionToken!}
                          systemInstruction={buildSystemContext("vsl")}
                          onBackToAvatar={() => {
                            setCurrentStep(5);
                            setTimeout(() => handleSaveProjectToServer(), 100);
                          }}
                          onNextToFunnel={() => {
                            setCurrentStep(7);
                            setTimeout(() => handleSaveProjectToServer(), 100);
                          }}
                        />
                      </React.Suspense>
                    </motion.div>
                  )}

                  {/* ETAPA 7: FUNIS DE VENDAS */}
                  {currentStep === 7 && generatedEbook && (
                    <motion.div
                      key="step-7"
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full"
                    >
                      <React.Suspense fallback={<div className="p-8 text-center text-xs text-emerald-400 font-mono">Carregando Funil de Vendas...</div>}>
                        <SalesFunnelStep
                          ebook={generatedEbook}
                          productName={productName}
                          niche={niche}
                          targetAudience={targetAudience}
                          description={description}
                          price={generatedSalesPage?.price || "R$ 47,00"}
                          onBackToVsl={() => {
                            setCurrentStep(6);
                            setTimeout(() => handleSaveProjectToServer(), 100);
                          }}
                          onNextToSocio={() => {
                            setCurrentStep(8);
                            setTimeout(() => handleSaveProjectToServer(), 100);
                          }}
                        />
                      </React.Suspense>
                    </motion.div>
                  )}

                  {/* ETAPA 8: ORIENTAÇÃO DO SÓCIO ESTRATÉGICO */}
                  {currentStep === 8 && (
                    <motion.div
                      key="step-8"
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full"
                    >
                      <React.Suspense fallback={<div className="p-8 text-center text-xs text-purple-400 font-mono">Carregando Orientação do Sócio Estratégico...</div>}>
                        <SocioEstrategicoStep
                          productName={productName}
                          niche={niche}
                          targetAudience={targetAudience}
                          tone={tone}
                          aiPersona={aiPersona}
                          salesPageOffer={generatedSalesPage?.mainOffer}
                          onGoBackToWizard={() => {
                            setCurrentStep(1);
                            setTimeout(() => handleSaveProjectToServer(), 100);
                          }}
                        />
                      </React.Suspense>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            )}
          </>
        )}
          </>
        )}

      </main>

      {/* Footer copyright */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500 mt-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* Footer Verse - Only visible when not in generating/loading state to prevent overlapping */}
          {!loading && (
            <div className="max-w-xl mx-auto w-full">
              <FloatingVerses location="footer" inline={true} />
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Fábrica de Infoprodutos. Todos os direitos reservados.</p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-600">Construído em ambiente seguro e robusto com IA</p>
          </div>
        </div>
      </footer>

      <React.Suspense fallback={null}>
        <WelcomeTour 
          isOpen={showWelcomeTour}
          onClose={() => {
            localStorage.setItem("fabrica_tour_seen", "true");
            setShowWelcomeTour(false);
          }}
          setCurrentStep={setCurrentStep}
        />
      </React.Suspense>

      {/* OPERADOR INTELIGENTE AI ASSISTANT WIDGET */}
      <OperadorInteligenteWidget
        currentStep={currentStep}
        osTab={osTab}
        niche={niche}
        productName={generatedEbook?.title || productName || "Meu Infoproduto"}
        experienceLevel={experienceLevel}
        hasEbook={!!generatedEbook}
        hasSalesPage={!!generatedSalesPage}
        hasCover={!!generatedEbook?.coverImage || !!generatedEbook?.cover?.imageUrl}
        hasVsl={!!generatedSalesPage?.vslEmbedCode || !!generatedSalesPage?.vslUrl}
        hasAds={false}
        onNavigateStep={(step) => {
          setCurrentStep(step);
          setOsTab("wizard");
        }}
        onNavigateTab={(tab) => setOsTab(tab as any)}
      />

    </div>
  );
}
