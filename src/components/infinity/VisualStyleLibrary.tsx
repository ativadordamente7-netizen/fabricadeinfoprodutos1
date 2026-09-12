import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Palette,
  Search,
  Check,
  Copy,
  ArrowRight,
  Zap,
  Sliders,
  Eye,
  Layers,
  Camera,
  Sun,
  ShieldCheck,
  TrendingUp,
  Bookmark,
  Share2,
  Download,
  CheckCircle2,
  Award,
  UtensilsCrossed,
  Coins,
  Cpu,
  Laptop,
  Leaf,
  Flame,
  Film,
  Dumbbell,
  Heart,
  X,
  ExternalLink,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ==========================================
// ESTRUTURA DE DADOS: DNA VISUAL DE ESTILOS
// ==========================================

export interface VisualDnaSwatch {
  name: string;
  hex: string;
  role: string;
}

export interface VisualDnaColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  mutedText: string;
  gradientClass: string;
  swatches: VisualDnaSwatch[];
}

export interface VisualDnaTypography {
  headingFont: "Playfair Display" | "Cinzel" | "Space Grotesk" | "Inter" | "JetBrains Mono" | "Plus Jakarta Sans";
  bodyFont: "Plus Jakarta Sans" | "Inter" | "JetBrains Mono" | "Playfair Display";
  headingStyle: string;
  letterSpacing: string;
  textTransform: "uppercase" | "none" | "capitalize";
  hierarchyRatio: string;
  cssFamily: string;
}

export interface VisualDnaLighting {
  setupName: string;
  type: string;
  description: string;
  colorTemperature: string;
  keyAspects: string[];
}

export interface VisualDnaOptics {
  lens: string;
  aperture: string;
  cameraAngle: string;
  depthOfField: string;
  framingComposition: string;
}

export interface VisualDnaPromptKit {
  aiCoverPrompt: string;
  aiCreativePrompt: string;
  visualTokens: string[];
  negativeTokens: string[];
  suggestedMidjourneyParams: string;
}

export interface VisualDnaStyle {
  id: string;
  name: string;
  category:
    | "Gourmet & Gastronomia"
    | "Finanças & Dark Money"
    | "Tecnologia & IA"
    | "Minimalismo & Tech"
    | "Saúde & Orgânico"
    | "Alta Conversão / Vendas"
    | "Cinema & Vintage"
    | "Espiritual & Mente"
    | "Fitness & Performance"
    | "Beleza & Estética";
  tagline: string;
  badge: string;
  iconName: string;
  description: string;
  conversionRationale: string;
  targetNiches: string[];
  averageTicketSuggested: string;
  colors: VisualDnaColorPalette;
  typography: VisualDnaTypography;
  lighting: VisualDnaLighting;
  optics: VisualDnaOptics;
  textures: string[];
  psychologicalTriggers: string[];
  promptKit: VisualDnaPromptKit;
  sampleMockup: {
    title: string;
    subtitle: string;
    author: string;
    ctaText: string;
    pillTag: string;
  };
}

// ==========================================
// BANCO DE DADOS: CATÁLOGO DE DNA VISUAL
// ==========================================

export const VISUAL_DNA_STYLES: VisualDnaStyle[] = [
  // 1. GOURMET & HAUTE CUISINE
  {
    id: "dna_gourmet_haute_cuisine",
    name: "Gourmet & Haute Cuisine",
    category: "Gourmet & Gastronomia",
    tagline: "Alta Gastronomia • Sofisticação Culinária • Ouro & Carvão",
    badge: "CHEF MICHELIN",
    iconName: "UtensilsCrossed",
    description: "Inspirado em restaurantes estrelados e revistas gastronômicas parisienses. Ardósia escura vulcânica, folhas de ouro comestível 24k, iluminação rasante que destaca aromas e fumaça artesanal.",
    conversionRationale: "Desperta o gatilho sensorial do apetite visual instantâneo. Justifica tíquetes de 3x a 5x maiores ao posicionar o produto culinário como uma experiência de luxo inacessível a amadores.",
    targetNiches: ["Receitas Gourmet", "Confeitaria de Alta Classe", "Churrasco Artesanal & Defumação", "Vinhos & Harmonização", "Cafés Especiais"],
    averageTicketSuggested: "R$ 97,00 - R$ 297,00",
    colors: {
      primary: "#d97706",
      secondary: "#1c1917",
      accent: "#f59e0b",
      background: "#0c0a09",
      text: "#fef3c7",
      mutedText: "#a8a29e",
      gradientClass: "from-amber-600/40 via-stone-900 to-black",
      swatches: [
        { name: "Ouro 24k Gastronômico", hex: "#f59e0b", role: "Realce & Títulos Nobres" },
        { name: "Ardósia Mineral Negra", hex: "#1c1917", role: "Superfície de Apresentação" },
        { name: "Carvão Vulcânico Fundo", hex: "#0c0a09", role: "Plano de Fundo Profundo" },
        { name: "Creme Marfim Brûlée", hex: "#fef3c7", role: "Tipografia de Alto Contraste" },
        { name: "Borgonha Envelhecido", hex: "#831843", role: "Detalhes Nobres & Selos" }
      ]
    },
    typography: {
      headingFont: "Playfair Display",
      bodyFont: "Plus Jakarta Sans",
      headingStyle: "Serif Editorial Clássica de Alto Padrão",
      letterSpacing: "tracking-tight",
      textTransform: "none",
      hierarchyRatio: "1.333 (Perfect Fourth) - Alto Contraste",
      cssFamily: "'Playfair Display', serif"
    },
    lighting: {
      setupName: "Chiaroscuro Gastronômico com Luz Lateral Rasante 45°",
      type: "Luz Direcionada Quente com Sombras Dramáticas",
      description: "Uma fonte de luz quente a 45 graus com difusor em formato de favo de mel, criando reflexos dourados no azeite e realçando microtexturas dos ingredientes.",
      colorTemperature: "3200K (Tons quentes de âmbar e fogo brando)",
      keyAspects: ["Reflexos cintilantes em superfícies úmidas", "Vapor e fumaça sutil iluminados em contraluz", "Fundo escurecido para isolar o prato principal"]
    },
    optics: {
      lens: "100mm F/2.8 Macro Pro",
      aperture: "F/2.8 com foco cirúrgico",
      cameraAngle: "45° Ângulo Natural de Degustação",
      depthOfField: "Desfoque cremoso e aveludado em segundo plano",
      framingComposition: "Composição triangular com espaço negativo generoso para títulos"
    },
    textures: [
      "Ardósia vulcânica negra fosca com ranhuras minerais",
      "Madeira de carvalho rústico carbonizada no fogo",
      "Folhas de ouro 24k comestíveis laminadas",
      "Microgotas cintilantes de azeite trufado",
      "Vapor aromático translúcido"
    ],
    psychologicalTriggers: [
      "Gatilho do Apetite Visual Imediato (Salivação)",
      "Exclusividade & Prestígio Guia Michelin",
      "Percepção de Segredo Guardado por Grandes Mestres",
      "Ancoragem de Alto Padrão de Vida"
    ],
    promptKit: {
      aiCoverPrompt: "Award-winning Michelin star luxury culinary magazine cover, gourmet masterpiece on dark volcanic slate plate, 24k gold leaf accents, glistening virgin olive oil drops, dramatic 45-degree side lighting, subtle rising culinary steam, 100mm macro photography, dark mood, editorial typography layout, 8k hyper-realistic.",
      aiCreativePrompt: "High-converting Instagram ad creative for master gourmet cookbook, cinematic dark food photography, chef signature dish, onyx stone texture, golden amber light flare, high contrast luxury aesthetics, 8k octanerender, commercial print quality.",
      visualTokens: [
        "michelin star plating",
        "dark volcanic slate",
        "24k gold leaf flakes",
        "100mm macro lens",
        "chiaroscuro food lighting",
        "rising culinary steam",
        "rustic refined luxury",
        "gourmet editorial composition"
      ],
      negativeTokens: [
        "fast food",
        "plastic plates",
        "cheap diner lighting",
        "flat overhead flash",
        "oversaturated neon",
        "blurry details",
        "low resolution"
      ],
      suggestedMidjourneyParams: "--ar 2:3 --v 6.1 --style raw --q 2"
    },
    sampleMockup: {
      title: "O Código Secreto da Gastronomia",
      subtitle: "Técnicas de Chef Estrelado e Receitas de Prestígio em Casa",
      author: "Chef Laurent & Equipe",
      ctaText: "Aprender os Segredos Michelin",
      pillTag: "MASTERCLASS GOURMET"
    }
  },

  // 2. DARK MONEY & SOVEREIGN WEALTH
  {
    id: "dna_dark_money_sovereign",
    name: "Dark Money & Sovereign Wealth",
    category: "Finanças & Dark Money",
    tagline: "Finanças de Elite • Old Money • Soberania & Poder Silencioso",
    badge: "SOBERANIA & PODER",
    iconName: "Coins",
    description: "A estética dos bancos privados suíços, escritórios de family offices e gestoras de patrimônio bilionário. Preto ônix, verde esmeralda profundo de cofre blindado, ouro champanhe discreto e tipografia com serifa imperial.",
    conversionRationale: "Transmite autoridade soberana e estabilidade patrimonial inabalável. Elimina a desconfiança de compras online ao afastar o produto de esquemas amadores e associá-lo a clãs e grandes fortunas.",
    targetNiches: ["Gestão de Fortuna & Investimentos", "Proteção Patrimonial & Offshore", "Crédito Black & Milhas Exclusivas", "Mentoria High-Ticket de Negócios", "Direito & Arbitragem"],
    averageTicketSuggested: "R$ 197,00 - R$ 997,00+",
    colors: {
      primary: "#065f46",
      secondary: "#0f172a",
      accent: "#d97706",
      background: "#030806",
      text: "#f8fafc",
      mutedText: "#94a3b8",
      gradientClass: "from-emerald-900/50 via-slate-950 to-black",
      swatches: [
        { name: "Verde Banco Suíço", hex: "#065f46", role: "Autoridade Institucional & Brasões" },
        { name: "Ouro Champagne Imperial", hex: "#d97706", role: "Destaques & Monogramas" },
        { name: "Grafite Titânio de Cofre", hex: "#0f172a", role: "Superfície Blindada" },
        { name: "Ônix Abissal", hex: "#030806", role: "Fundo Absoluto" },
        { name: "Platina Esterlina", hex: "#e2e8f0", role: "Tipografia de Alta Leitura" }
      ]
    },
    typography: {
      headingFont: "Cinzel",
      bodyFont: "Inter",
      headingStyle: "Serif Imperial Romana de Prestígio",
      letterSpacing: "tracking-widest",
      textTransform: "uppercase",
      hierarchyRatio: "1.25 (Major Third) - Sólido & Imponente",
      cssFamily: "'Cinzel', serif"
    },
    lighting: {
      setupName: "Studio Rembrandt com Luz de Recorte Dourada e Sombra Volumétrica",
      type: "Iluminação Seletiva de Prestígio Institucional",
      description: "Luz de recorte dourada contornando bordas de metal polido e mármore, mantendo 70% da composição em sombra dramática e misteriosa.",
      colorTemperature: "2800K no recorte dourado com 5000K neutro nos reflexos",
      keyAspects: ["Sombra imponente que denota segredo e poder discreto", "Reflexos de lustres de cristal e cofres blindados", "Zero superexposição"]
    },
    optics: {
      lens: "85mm F/1.4 Portrait Prime",
      aperture: "F/1.4 para isolamento e foco monolítico",
      cameraAngle: "Nível dos Olhos ou Leve Low-Angle (De Baixo Para Cima)",
      depthOfField: "Separação impecável entre o primeiro plano e o fundo corporativo",
      framingComposition: "Simetria central rigorosa, evocando pilares de templos bancários"
    },
    textures: [
      "Mármore Nero Marquina com veios dourados refinados",
      "Couro nobre curtido à mão com costura invisível",
      "Metal titânio escovado de cofres bancários suíços",
      "Selo de cera laqueado e brasão em baixo-relevo",
      "Papel moeda artesanal de algodão 100%"
    ],
    psychologicalTriggers: [
      "Autoridade Soberana e Inquestionável",
      "Acesso ao Conhecimento das Dinastias Financeiras",
      "Status Silencioso (Quiet Luxury)",
      "Proteção e Blindagem Contra Incertezas"
    ],
    promptKit: {
      aiCoverPrompt: "Dark luxury financial publication book cover, dark money sovereign wealth aesthetic, Swiss private banking interior, Nero Marquina black marble desk, gold ingot subtle reflections, emerald green ambient rim light, 85mm lens portrait angle, 8k octanerender, majestic imperial typography, forbes billionaire edition look.",
      aiCreativePrompt: "High-ticket financial masterclass creative, dark emerald and onyx gold palette, luxury boardroom atmosphere, gold foil embossed stamp, clean bold sans-serif text, 8k photorealistic, sovereign wealth power.",
      visualTokens: [
        "swiss private bank vault",
        "nero marquina black marble",
        "emerald green rim lighting",
        "gold foil embossing",
        "quiet luxury old money",
        "85mm prime lens",
        "monolithic central symmetry",
        "8k corporate elite"
      ],
      negativeTokens: [
        "cartoon",
        "cheap dollar bills flying",
        "neon glowing charts",
        "casual clothing",
        "amateur selfie",
        "blurry text",
        "childish colors"
      ],
      suggestedMidjourneyParams: "--ar 2:3 --v 6.1 --style raw"
    },
    sampleMockup: {
      title: "O Império Invisível",
      subtitle: "Como as Grandes Famílias Blindam Riqueza e Multiplicam Ativos",
      author: "Arthur Von Meyer",
      ctaText: "Acessar o Relatório Restrito",
      pillTag: "RELATÓRIO CONFIDENCIAL"
    }
  },

  // 3. CYBER TECH & NEURAL AI
  {
    id: "dna_cyber_tech_ai",
    name: "Cyber Tech & Neural AI",
    category: "Tecnologia & IA",
    tagline: "Inteligência Artificial • Automação 2030 • Ciano & Fibra de Carbono",
    badge: "FUTURISMO HIGH-TECH",
    iconName: "Cpu",
    description: "Visual de vanguarda futurista: azul elétrico, ciano bioluminescente, reflexos holográficos em fibra de carbono e tipografia monoespaçada militar e científica.",
    conversionRationale: "Cria percepção de inovação técnica inalcançável. O visitante sente que está adquirindo um sistema de inteligência de última geração que o coloca 5 anos à frente dos concorrentes.",
    targetNiches: ["Inteligência Artificial & Prompts", "Automação & Agentes Autônomos", "Criptomoedas & Algoritmos", "Programação & Engenharia de Dados"],
    averageTicketSuggested: "R$ 47,00 - R$ 197,00",
    colors: {
      primary: "#0284c7",
      secondary: "#020617",
      accent: "#06b6d4",
      background: "#010409",
      text: "#e0f2fe",
      mutedText: "#7dd3fc",
      gradientClass: "from-cyan-500/30 via-blue-950/50 to-black",
      swatches: [
        { name: "Ciano Bioluminescente", hex: "#06b6d4", role: "Brilhos de Circuito & Ícones" },
        { name: "Azul Elétrico Quântico", hex: "#0284c7", role: "Vigência & Contornos" },
        { name: "Espaço Quântico Fundo", hex: "#010409", role: "Base de Contraste Frio" },
        { name: "Branco Ice Neônio", hex: "#e0f2fe", role: "Leitura Cristalina" },
        { name: "Magenta Laser Secundário", hex: "#d946ef", role: "Recortes Secundários" }
      ]
    },
    typography: {
      headingFont: "Space Grotesk",
      bodyFont: "JetBrains Mono",
      headingStyle: "Display Tecnológica Geométrica Brutalista",
      letterSpacing: "tracking-tight",
      textTransform: "none",
      hierarchyRatio: "1.333 (Perfect Fourth) - Alta Tensão",
      cssFamily: "'Space Grotesk', sans-serif"
    },
    lighting: {
      setupName: "Dual Rim Light Volumétrico (Ciano e Magenta)",
      type: "Iluminação Futurista com Feixes Laser e Partículas de Dados",
      description: "Dois feixes laterais de luz laser volumétrica criando separação de bordas ultra nítida e partículas de dados digitais suspensas no ar.",
      colorTemperature: "7000K (Frio espacial cirúrgico)",
      keyAspects: ["Reflexos bioluminescentes em fibra de carbono", "Gradientes de ciano para azul marinho profundo", "Sombras nítidas de ficção científica"]
    },
    optics: {
      lens: "24mm Anamorphic Cinema",
      aperture: "F/2.0 com flares horizontais futuristas",
      cameraAngle: "Ângulo Holandês Leve (Dutch Angle) ou Isometria 3D",
      depthOfField: "Profundidade dinâmica com foco nítido no processador/código",
      framingComposition: "Linhas de fuga diagonais de velocidade e aceleração"
    },
    textures: [
      "Fibra de carbono fosca aeroespacial com trama de precisão",
      "Circuitos integrados com emissão de luz azul neon interna",
      "Vidro holográfico fumê com reflexos de código binário",
      "Silício polido e alumínio espacial anodizado"
    ],
    psychologicalTriggers: [
      "Sensação de Vanguarda e Superioridade Tecnológica",
      "Urgência em não ficar obsoleto frente à IA",
      "Automação que economiza centenas de horas humanas",
      "Poder de processamento e dados"
    ],
    promptKit: {
      aiCoverPrompt: "Futuristic artificial intelligence master publication cover, glowing neural network core, cyan and deep blue bioluminescent light streams, carbon fiber device floating, 24mm anamorphic lens with subtle blue streak flare, 8k crisp details, octane render, modern tech typography.",
      aiCreativePrompt: "Cyber tech advertising banner, neon cyan holographic display, futuristic workflow automation, dark obsidian room, volumetric rim light, hyper-detailed 3D render.",
      visualTokens: [
        "neural network core",
        "bioluminescent cyan light",
        "carbon fiber chassis",
        "24mm anamorphic lens",
        "blue streak lens flare",
        "octane render 8k",
        "futuristic data streams"
      ],
      negativeTokens: ["vintage", "wooden", "retro", "sepia", "hand-drawn", "grainy", "low poly"],
      suggestedMidjourneyParams: "--ar 2:3 --v 6.1 --style raw"
    },
    sampleMockup: {
      title: "A Mente Algorítmica",
      subtitle: "Construindo Sistemas Autônomos de Alta Performance com IA",
      author: "Dr. Alex Ramos, PhD",
      ctaText: "Desbloquear Arquitetura IA",
      pillTag: "NEURAL AGENTS 2030"
    }
  },

  // 4. APPLE MINIMALIST CLEAN
  {
    id: "dna_apple_minimalist",
    name: "Apple Minimalist & Clean",
    category: "Minimalismo & Tech",
    tagline: "Design Intencional • Clareza Absoluta • Titânio & Alumínio",
    badge: "CLASSE A TECH",
    iconName: "Laptop",
    description: "Inspirado na linha de produtos Apple e na escola de design de Dieter Rams: espaços arejados, tipografia sem serifa perfeitamente alinhada, sombras imperceptíveis e acabamentos em titânio fosco.",
    conversionRationale: "Reduz a carga cognitiva do comprador a zero. A clareza absoluta elimina a fricção e faz com que a proposta pareça óbvia, elegante e irresistível.",
    targetNiches: ["SaaS & Ferramentas Digitais", "Produtividade & Gestão do Tempo", "Arquitetura & Design de Interiores", "Metodologias Ágeis", "Minimalismo Prático"],
    averageTicketSuggested: "R$ 67,00 - R$ 197,00",
    colors: {
      primary: "#0284c7",
      secondary: "#1e293b",
      accent: "#38bdf8",
      background: "#080c14",
      text: "#ffffff",
      mutedText: "#94a3b8",
      gradientClass: "from-sky-500/20 via-slate-900 to-slate-950",
      swatches: [
        { name: "Titânio Natural", hex: "#f1f5f9", role: "Realces de Borda" },
        { name: "Azul Céu Apple", hex: "#38bdf8", role: "Acentos e Ícones" },
        { name: "Cinza Meia-Noite Fundo", hex: "#080c14", role: "Superfície Monolítica" },
        { name: "Branco Puro Cristal", hex: "#ffffff", role: "Títulos Principais" },
        { name: "Ardósia Aço", hex: "#1e293b", role: "Contêineres e Cards" }
      ]
    },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      headingStyle: "Sem Serifa Geométrica Perfeita",
      letterSpacing: "tracking-tight",
      textTransform: "none",
      hierarchyRatio: "1.2 (Minor Third) - Leveza & Equilíbrio",
      cssFamily: "'Inter', sans-serif"
    },
    lighting: {
      setupName: "Softbox Gigante com Difusão Dupla 45°",
      type: "Luz Suave Envolvente de Estúdio Industrial",
      description: "Luz suave matinal sem sombras duras, envolvendo o objeto com uma gradação de tom contínua e acabamento aveludado.",
      colorTemperature: "5500K (Luz do dia neutra e fidedigna)",
      keyAspects: ["Sombras de contato sutis e ultra macias", "Reflexos lineares precisos em bordas arredondadas", "Espaço negativo respirável"]
    },
    optics: {
      lens: "50mm Prime Lens F/2.8",
      aperture: "F/2.8 com foco plano uniforme",
      cameraAngle: "Nível dos Olhos 90° Frontal ou Isométrico 30°",
      depthOfField: "Nitidez controlada com suave transição de fundo",
      framingComposition: "Grid assimétrico rigoroso com respiro de 40% de margem"
    },
    textures: [
      "Alumínio anodizado fosco escovado com microesferas de vidro",
      "Vidro temperado acetinado anti-reflexo",
      "Cerâmica branca técnica com toque suave",
      "Borracha tátil macia de alta densidade"
    ],
    psychologicalTriggers: [
      "Clareza e Simplicidade que Aliviam o Estresse",
      "Percepção de Produto Bem Acabado e Livre de Erros",
      "Elegância Sem Ostentação Barata",
      "Facilidade Imediata de Aplicação"
    ],
    promptKit: {
      aiCoverPrompt: "Minimalist industrial design publication cover, Apple product aesthetics, floating matte titanium hardware, ultra soft diffused lighting, pristine white and deep navy background, pristine typography, 50mm clean photography, 8k crisp details, Dieter Rams Braun minimalism.",
      aiCreativePrompt: "Minimalist premium tech advertisement, clean slate background, floating modern sleek interface, soft subtle drop shadows, high whitespace ratio, sharp typography Inter font, 8k render.",
      visualTokens: [
        "apple minimalist aesthetic",
        "matte titanium finish",
        "soft diffused studio light",
        "high whitespace ratio",
        "50mm prime clean focus",
        "pristine typography",
        "flawless industrial design"
      ],
      negativeTokens: ["cluttered", "busy", "neon glow", "flames", "loud gradients", "comic sans", "grunge"],
      suggestedMidjourneyParams: "--ar 2:3 --v 6.1 --style raw"
    },
    sampleMockup: {
      title: "Foco & Simplicidade",
      subtitle: "O Método Prático Para Eliminar Distrações e Executar Mais",
      author: "Marcus Vance",
      ctaText: "Começar o Método Limpo",
      pillTag: "MÉTODO ESSENCIALISTA"
    }
  },

  // 5. ORGANIC WELLNESS & BOTANICAL
  {
    id: "dna_organic_wellness",
    name: "Organic Wellness & Botanical",
    category: "Saúde & Orgânico",
    tagline: "Saúde Integrativa • Vitalidade • Verde Sálvia & Orvalho",
    badge: "PURO & BIO",
    iconName: "Leaf",
    description: "Verde sálvia, folhas de monstera frescas com microgotas de orvalho, tons de linho cru e cerâmica artesanal. Transmite cura biológica e pureza sem a frieza de medicamentos químicos.",
    conversionRationale: "Gera identificação instantânea com pessoas que buscam um estilo de vida natural e sustentável. Substitui o medo de remédios invasivos pela esperança de uma regeneração biológica suave.",
    targetNiches: ["Emagrecimento Funcional", "Naturopatia & Fitoterapia", "Yoga, Respiração & Meditação", "Cosmética Limpa & Skincare Natural", "Nutrição Regenerativa"],
    averageTicketSuggested: "R$ 47,00 - R$ 147,00",
    colors: {
      primary: "#059669",
      secondary: "#064e3b",
      accent: "#10b981",
      background: "#021c15",
      text: "#ecfdf5",
      mutedText: "#6ee7b7",
      gradientClass: "from-emerald-500/30 via-teal-950/40 to-slate-950",
      swatches: [
        { name: "Verde Sálvia Puro", hex: "#059669", role: "Cor de Destaque Primária" },
        { name: "Verde Floresta Noturna", hex: "#064e3b", role: "Contêineres de Suporte" },
        { name: "Menta Fresca Brilhante", hex: "#10b981", role: "Botões de Chamada & Ação" },
        { name: "Terra Fértil Escura", hex: "#021c15", role: "Fundo Acolhedor" },
        { name: "Orvalho Matinal Branco", hex: "#ecfdf5", role: "Tipografia de Alta Leitura" }
      ]
    },
    typography: {
      headingFont: "Plus Jakarta Sans",
      bodyFont: "Inter",
      headingStyle: "Sem Serifa Orgânica e Humanizada",
      letterSpacing: "tracking-normal",
      textTransform: "none",
      hierarchyRatio: "1.25 (Major Third) - Harmonia Natural",
      cssFamily: "'Plus Jakarta Sans', sans-serif"
    },
    lighting: {
      setupName: "Luz Matinal Filtrada por Folhagens com Raios Solares 45°",
      type: "Iluminação Natural Orgânica de Manhã",
      description: "Luz solar dourada filtrada através de plantas e ramos, criando projeções de sombras orgânicas (gobo) e destacando o orvalho cintilante.",
      colorTemperature: "4500K (Morno matinal restaurador)",
      keyAspects: ["Microgotas translúcidas de água", "Sombras suaves de folhas no fundo", "Sensação de ar puro e brisa fresca"]
    },
    optics: {
      lens: "100mm F/2.8 Macro Lens",
      aperture: "F/2.8 para realçar texturas celulares e botânicas",
      cameraAngle: "Flat Lay 45° ou Detalhe Macro em Close Extremo",
      depthOfField: "Desfoque suave das folhas ao redor mantendo o foco no centro",
      framingComposition: "Composição circular fluida e orgânica"
    },
    textures: [
      "Folhas verdes frescas de monstera e sálvia com orvalho matinal",
      "Cerâmica artesanal esmaltada fosca com bordas orgânicas",
      "Linho cru natural de trama aberta",
      "Madeira clara de carvalho ou bambu sustentável",
      "Gotas de água cristalinas cintilantes"
    ],
    psychologicalTriggers: [
      "Alívio da Ansiedade e Conexão com a Natureza",
      "Sensação de Pureza sem Toxinas ou Químicos",
      "Confiança na Sabedoria Ancestral das Plantas",
      "Vitalidade e Energia Renovada"
    ],
    promptKit: {
      aiCoverPrompt: "Award-winning holistic health book cover, fresh organic botanical ingredients, dew drops glistening on deep green sage and eucalyptus leaves, soft morning sunbeams through window, warm earthy tones, linen texture, clean elegant typography, 100mm macro photography, 8k crisp focus.",
      aiCreativePrompt: "Instagram ad creative for natural health guide, fresh botanical flat lay, morning dew drops, sage green and cream color scheme, serene and pure atmosphere, organic wellness, award-winning photography.",
      visualTokens: [
        "fresh botanical ingredients",
        "morning dew drops",
        "sunlight through leaves",
        "sage green palette",
        "100mm macro lens",
        "clean organic wellness",
        "artisanal ceramic texture"
      ],
      negativeTokens: ["pills", "syringes", "hospital", "neon", "polluted", "dark gloom", "artificial plastic"],
      suggestedMidjourneyParams: "--ar 2:3 --v 6.1 --style raw"
    },
    sampleMockup: {
      title: "Protocolo Anti-Inflamatório",
      subtitle: "Como Desinchar e Recuperar Sua Energia Biológica em 21 Dias",
      author: "Dra. Helena Duarte",
      ctaText: "Quero Desintoxicar Meu Corpo",
      pillTag: "GUIA INTEGRATIVO BIO"
    }
  },

  // 6. BOLD DIRECT RESPONSE & URGÊNCIA
  {
    id: "dna_bold_direct_response",
    name: "Bold Direct Response & Urgência",
    category: "Alta Conversão / Vendas",
    tagline: "Alta Conversão • Impacto Frontal • Preto, Amarelo & Vermelho",
    badge: "MÁXIMA CONVERSÃO",
    iconName: "Flame",
    description: "Contraste brutal de alta tensão: preto carvão com amarelo de alerta e vermelho de ação imediata. Títulos em caixa alta maciça, tarjas táticas de perigo e selos cromados 3D.",
    conversionRationale: "Projetado cientificamente para capturar a atenção nos primeiros 0.6 segundos de rolagem do feed do Instagram ou TikTok. Força a tomada de decisão antes que a mente lógica crie desculpas.",
    targetNiches: ["Renda Extra Rápida", "Afiliados & Tráfego Pago", "Ebooks de Oferta Direta R$ 19 a R$ 47", "Campanhas Black Friday & Flash Sales", "Leilões & Oportunidades Urgentes"],
    averageTicketSuggested: "R$ 19,90 - R$ 67,00",
    colors: {
      primary: "#eab308",
      secondary: "#18181b",
      accent: "#ef4444",
      background: "#09090b",
      text: "#ffffff",
      mutedText: "#fef08a",
      gradientClass: "from-yellow-500/30 via-red-950/40 to-black",
      swatches: [
        { name: "Amarelo Alerta Tático", hex: "#eab308", role: "Tarjas de Atenção & Frases-Chave" },
        { name: "Vermelho Urgência Ação", hex: "#ef4444", role: "Botões de CTA & Preços Promocionais" },
        { name: "Preto Carbono Base", hex: "#09090b", role: "Fundo de Máximo Contraste" },
        { name: "Branco Puro Contraste", hex: "#ffffff", role: "Headlines em Caixa Alta" },
        { name: "Laranja Incandescente", hex: "#f97316", role: "Badges de Desconto & Temporizadores" }
      ]
    },
    typography: {
      headingFont: "Plus Jakarta Sans",
      bodyFont: "Inter",
      headingStyle: "Display Caixa Alta de Impacto Massivo",
      letterSpacing: "tracking-tight",
      textTransform: "uppercase",
      hierarchyRatio: "1.333 (Perfect Fourth) - Contraste Extremo",
      cssFamily: "'Plus Jakarta Sans', sans-serif"
    },
    lighting: {
      setupName: "High-Key Frontal Potente Sem Sombras Distraidoras",
      type: "Luz de Ação Comercial Sem Fricção",
      description: "Iluminação frontal potente e direta, eliminando qualquer sombra que possa atrapalhar a legibilidade das palavras ou o foco no produto.",
      colorTemperature: "6000K (Branco direto de alerta)",
      keyAspects: ["Contraste preto e amarelo que ativa o cérebro reptiliano", "Zero sombras decorativas ou confusas", "Foco 100% na promessa"]
    },
    optics: {
      lens: "35mm F/5.6 Grande Angular Tática",
      aperture: "F/5.6 para foco total e nitidez em todo o enquadramento",
      cameraAngle: "Frontal Direto Sem Firulas",
      depthOfField: "Profundidade infinita com tudo nítido para absorção rápida",
      framingComposition: "Diagramação em Z: Gancho no topo, prova no centro, botão na base"
    },
    textures: [
      "Tarja listrada amarela e preta de alerta industrial",
      "Metal preto texturizado com acabamento resistente",
      "Selo 3D brilhante com efeito de reflexo cromado",
      "Adesivos de aviso 'CUIDADO' e carimbos de validação"
    ],
    psychologicalTriggers: [
      "Gatilho da Urgência e do Medo de Perder (FOMO)",
      "Atenção Forçada pelo Padrão Biológico de Alerta (Amarelo/Preto)",
      "Preço Ridiculamente Baixo Frente ao Valor Percebido",
      "Decisão Rápida em 1 Clique"
    ],
    promptKit: {
      aiCoverPrompt: "High-converting direct response commercial ebook cover, bold black and warning yellow color palette, 3D glossy badge, high contrast typography, aggressive marketing layout, clean commercial print rendering, 8k sharp resolution, zero visual clutter.",
      aiCreativePrompt: "Direct response Instagram story ad creative, warning yellow hazard tape, huge red discount badge, bold uppercase headline, massive urgency appeal, commercial billboard style, 8k crisp render.",
      visualTokens: [
        "direct response marketing",
        "warning yellow and black",
        "high contrast red badge",
        "bold uppercase typography",
        "clean commercial lighting",
        "8k sharp focus",
        "high click-through design"
      ],
      negativeTokens: ["pastel colors", "gentle", "romantic", "blurry", "curly font", "low contrast", "boring"],
      suggestedMidjourneyParams: "--ar 2:3 --v 6.1 --style raw"
    },
    sampleMockup: {
      title: "O Pulo do Gato das Vendas",
      subtitle: "Copie e Cole o Roteiro Que Gerou R$ 14.890 em 72 Horas",
      author: "Equipe Tráfego Turbo",
      ctaText: "GARANTIR COM 80% OFF AGORA",
      pillTag: "OFERTA RELÂMPAGO LIMITADA"
    }
  },

  // 7. VINTAGE NOIR & 35MM CINEMA
  {
    id: "dna_vintage_noir_film",
    name: "Vintage Noir & 35mm Analog Film",
    category: "Cinema & Vintage",
    tagline: "Cinema Analógico • Granulação 35mm • Nostalgia & Storytelling",
    badge: "PELÍCULA 35MM",
    iconName: "Film",
    description: "A textura inimitável do cinema clássico de Hollywood: granulação orgânica de película Kodak Tri-X e Portra 400, iluminação de tungstênio quente, sombras dramáticas e tipografia de romance noir.",
    conversionRationale: "Quebra a sensação de artificialidade gerada pela internet moderna. O usuário sente que está diante de uma obra autêntica, atemporal e rica em profundidade humana.",
    targetNiches: ["Storytelling & Roteiros", "Desenvolvimento Pessoal & Filosofia", "Fotografia & Produção de Vídeo", "História, Biografias & Romances", "Marcas Pessoais de Especialistas"],
    averageTicketSuggested: "R$ 97,00 - R$ 297,00",
    colors: {
      primary: "#b45309",
      secondary: "#1c1917",
      accent: "#fbbf24",
      background: "#0c0a09",
      text: "#fef3c7",
      mutedText: "#a8a29e",
      gradientClass: "from-amber-600/30 via-orange-950/40 to-black",
      swatches: [
        { name: "Âmbar Tungstênio 3200K", hex: "#b45309", role: "Iluminação Chave" },
        { name: "Ouro de Projetor Vintage", hex: "#fbbf24", role: "Realces de Título" },
        { name: "Sépia Escura Analógica", hex: "#1c1917", role: "Sombras Orgânicas" },
        { name: "Quarto Escuro Químico", hex: "#0c0a09", role: "Base de Fundo" },
        { name: "Papel Fotográfico Barita", hex: "#fef3c7", role: "Texto de Romance" }
      ]
    },
    typography: {
      headingFont: "Playfair Display",
      bodyFont: "JetBrains Mono",
      headingStyle: "Serif Nobre com Itálico Expressivo de Cinema",
      letterSpacing: "tracking-tight",
      textTransform: "none",
      hierarchyRatio: "1.333 (Perfect Fourth) - Poesia Visual",
      cssFamily: "'Playfair Display', serif"
    },
    lighting: {
      setupName: "Luz de Tungstênio Direcionada com Névoa Suave (Volumetric Fog)",
      type: "Iluminação de Cinema Analógico",
      description: "Uma lâmpada de tungstênio clássica com refletor vintage criando feixes de luz visíveis através de névoa atmosférica e sombra profunda.",
      colorTemperature: "2900K (Calor acolhedor e nostálgico)",
      keyAspects: ["Granulação de filme orgânica visível", "Transição aveludada entre luz e escuridão", "Tons de sépia e âmbar profundo"]
    },
    optics: {
      lens: "Panavision Anamorphic 50mm T/1.4",
      aperture: "T/1.4 com bokeh oval clássico de cinema",
      cameraAngle: "Leve Ângulo Dramático de Cinema",
      depthOfField: "Profundidade cinematográfica com separação poética",
      framingComposition: "Proporção clássica de poster de cinema com respiro para créditos"
    },
    textures: [
      "Granulação natural de filme Kodak 35mm analógico",
      "Papel envelhecido artesanal de alta gramatura com bordas gastas",
      "Madeira de mogno antiga e couro vintage",
      "Poeira mágica suspensa no feixe de luz do projetor"
    ],
    psychologicalTriggers: [
      "Conexão Emocional Profunda e Nostalgia",
      "Percepção de Conteúdo Clássico que Não Fica Datado",
      "Desejo de Ouvir uma História Verdadeira",
      "Humanização e Autenticidade Rara"
    ],
    promptKit: {
      aiCoverPrompt: "Award-winning cinematic book cover still, 35mm film photography, Panavision anamorphic lens, beautiful oval bokeh, subtle warm tungsten light beams through dust, analog grain texture, moody sepia and amber tones, vintage editorial typography, masterpiece, 8k.",
      aiCreativePrompt: "Cinematic film still advertisement, warm 35mm movie atmosphere, authentic Kodak color grading, rich shadows, nostalgic storytelling angle, 8k photographic print.",
      visualTokens: [
        "35mm analog film grain",
        "panavision anamorphic lens",
        "warm tungsten lighting",
        "kodak portra color grading",
        "volumetric light haze",
        "cinematic storytelling",
        "timeless vintage aesthetic"
      ],
      negativeTokens: ["digital plastic", "cgi cartoon", "flat mobile lighting", "cold sterile blue", "photoshop cutout"],
      suggestedMidjourneyParams: "--ar 2:3 --v 6.1 --style raw"
    },
    sampleMockup: {
      title: "As Crônicas da Maestria",
      subtitle: "Memórias, Desafios e Lições Silenciosas de Quem Chegou ao Topo",
      author: "Eduardo Albuquerque",
      ctaText: "Iniciar a Jornada Épica",
      pillTag: "OBRA EDITORIAL DE COLECIONADOR"
    }
  },

  // 8. DIVINE LIGHT & SACRED WISDOM
  {
    id: "dna_divine_ethereal",
    name: "Divine Light & Sacred Wisdom",
    category: "Espiritual & Mente",
    tagline: "Espiritualidade • Fé & Paz Interior • Ouro Celestial & Azul Sagrado",
    badge: "TRANSCENDENTE",
    iconName: "Sun",
    description: "Raios de glória celestial descendo do céu, partículas de poeira dourada suspensas, fundo azul meia-noite estrelado e tipografia imperial que transmite paz, reverência e transformação espiritual.",
    conversionRationale: "Conecta-se diretamente com anseios humanos profundos de sentido, alívio da dor interior, propósito e fé. Toca o coração antes da razão, criando um vínculo de lealdade incondicional.",
    targetNiches: ["Devocionais Diários & Estudos Bíblicos", "Orações & Salmos Explicados", "Paz Mental & Superação da Ansiedade", "Casamento Cristão & Família", "Propósito de Vida"],
    averageTicketSuggested: "R$ 37,00 - R$ 97,00",
    colors: {
      primary: "#d97706",
      secondary: "#1e1b4b",
      accent: "#fcd34d",
      background: "#090714",
      text: "#faf5ff",
      mutedText: "#d8b4fe",
      gradientClass: "from-amber-500/30 via-indigo-950/40 to-black",
      swatches: [
        { name: "Ouro Celestial Radiante", hex: "#fcd34d", role: "Raios de Luz Divina" },
        { name: "Âmbar Sagrado Profundo", hex: "#d97706", role: "Bordas & Títulos" },
        { name: "Azul Meia-Noite Celestial", hex: "#1e1b4b", role: "Céu Estrelado de Fundo" },
        { name: "Noite Sagrada Abissal", hex: "#090714", role: "Base de Contraste" },
        { name: "Alva Pura Translúcida", hex: "#faf5ff", role: "Tipografia de Serenidade" }
      ]
    },
    typography: {
      headingFont: "Cinzel",
      bodyFont: "Playfair Display",
      headingStyle: "Imperial Romano Sagrado de Devoção",
      letterSpacing: "tracking-widest",
      textTransform: "uppercase",
      hierarchyRatio: "1.333 (Perfect Fourth) - Solenidade",
      cssFamily: "'Cinzel', serif"
    },
    lighting: {
      setupName: "Raios Crepusculares Volumétricos de Glória (God Rays)",
      type: "Iluminação Celestial Eterna",
      description: "Feixes de luz solar dourada descendo das nuvens em ângulo majestoso, iluminando o centro com partículas de glória e paz.",
      colorTemperature: "3400K (Luz celestial dourada que aquece a alma)",
      keyAspects: ["Raios de luz volumétricos bem definidos", "Poeira dourada mágica cintilante", "Gradiente suave de luz para a paz interior"]
    },
    optics: {
      lens: "35mm Cinema Prime F/1.8",
      aperture: "F/1.8 com expansão etérea de luz",
      cameraAngle: "Ângulo Ligeiramente Baixo Olhando Para os Céus",
      depthOfField: "Suave transição de foco simbolizando transcendência",
      framingComposition: "Ponto focal central radiante emanando luz para as bordas"
    },
    textures: [
      "Páginas antigas de pergaminho sagrado com bordas douradas",
      "Couro nobre marrom envelhecido com carimbo em ouro",
      "Raios solares translúcidos entre nuvens de tempestade que se abrem",
      "Mármore branco puro com veios dourados cintilantes"
    ],
    psychologicalTriggers: [
      "Conforto Espiritual e Alívio da Angústia",
      "Sensação de Propósito Divino e Conexão Superior",
      "Esperança Inabalável em Meio às Dificuldades",
      "Paz Que Excede Todo o Entendimento"
    ],
    promptKit: {
      aiCoverPrompt: "Sacred inspirational spiritual book cover, majestic golden sunbeams descending from stormy clouds, heavenly divine light, ancient scripture pages, golden dust particles in the air, deep midnight blue sky, 35mm cinematic photography, ethereal serene mood, elegant Cinzel typography, 8k masterpiece.",
      aiCreativePrompt: "Spiritual daily devotional ad creative, heavenly golden glow, open Bible on wooden table, soft morning sunbeams, peace and serenity, cinematic emotional lighting, 8k photographic print.",
      visualTokens: [
        "heavenly divine sunbeams",
        "god rays through clouds",
        "golden dust particles",
        "ancient holy scriptures",
        "midnight blue and gold",
        "cinematic ethereal light",
        "serene sacred atmosphere"
      ],
      negativeTokens: ["demonic", "dark despair", "cheap clip art", "flashing disco lights", "blurry", "disrespectful"],
      suggestedMidjourneyParams: "--ar 2:3 --v 6.1 --style raw"
    },
    sampleMockup: {
      title: "Caminhos de Paz & Fé",
      subtitle: "365 Promessas Sagradas Para Restaurar Sua Alma Diariamente",
      author: "Pastor Samuel Oliveira",
      ctaText: "Receber Minha Bênção Diária",
      pillTag: "DEVOCIONAL DE TRANSFORMAÇÃO"
    }
  },

  // 9. FITNESS HARDCORE & IRON PERFORMANCE
  {
    id: "dna_fitness_hardcore",
    name: "Fitness Hardcore & Iron Performance",
    category: "Fitness & Performance",
    tagline: "Alta Performance • Disciplina de Ferro • Laranja Atlético & Aço",
    badge: "SEM DESCULPAS",
    iconName: "Dumbbell",
    description: "Para quem não aceita desculpas: contraste bruto entre piso de borracha de academia de força, anilhas de ferro fundido com textura de giz branco e detalhes energéticos em laranja e vermelho neon termogênico.",
    conversionRationale: "Desperta a virilidade, a garra e a autoexigência de superação física. O cliente se identifica com a comunidade de guerreiros que treinam enquanto outros descansam.",
    targetNiches: ["Hipertrofia & Musculação Pesada", "Secagem Corporal Extrema & Cutting", "Calistenia & Força Bruta", "Biohacking & Testosterona Natural", "Mentalidade Inabalável"],
    averageTicketSuggested: "R$ 47,00 - R$ 147,00",
    colors: {
      primary: "#f97316",
      secondary: "#18181b",
      accent: "#ef4444",
      background: "#09090b",
      text: "#fafafa",
      mutedText: "#fdba74",
      gradientClass: "from-orange-600/35 via-zinc-950 to-black",
      swatches: [
        { name: "Laranja Atlético Neon", hex: "#f97316", role: "Destaques de Alta Energia" },
        { name: "Rubi Termogênico", hex: "#ef4444", role: "Pulos de Pulsação & Foco" },
        { name: "Aço Forjado Escuro", hex: "#18181b", role: "Plano Secundário e Anilhas" },
        { name: "Chão de Borracha Tática", hex: "#09090b", role: "Fundo Bruto" },
        { name: "Giz de Força Branco", hex: "#fafafa", role: "Headlines de Choque" }
      ]
    },
    typography: {
      headingFont: "Space Grotesk",
      bodyFont: "Inter",
      headingStyle: "Display Caixa Alta Angular de Combate",
      letterSpacing: "tracking-tight",
      textTransform: "uppercase",
      hierarchyRatio: "1.333 (Perfect Fourth) - Pancada Visual",
      cssFamily: "'Space Grotesk', sans-serif"
    },
    lighting: {
      setupName: "Spot Cenital Direto (Top-Down) com Luz de Recorte Laranja",
      type: "Iluminação Atlética de Alta Definição",
      description: "Spot vindo direto de cima para ressaltar cortes musculares, suor e veias, com recorte de luz laranja nas laterais evocando calor e queima calórica.",
      colorTemperature: "5800K com gel laranja de 3000K nos lados",
      keyAspects: ["Gotas de suor reais brilhando sob a luz direta", "Poeira de magnésio/giz suspensa no ar", "Silhueta atlética definida"]
    },
    optics: {
      lens: "35mm F/2.0 Prime Lens",
      aperture: "F/2.0 para manter o atleta nítido e desfocar as máquinas do fundo",
      cameraAngle: "Ângulo Baixo Imponente (Low-Angle) Implacável",
      depthOfField: "Contraste dinâmico entre o sujeito central e o ambiente industrial",
      framingComposition: "Tensão muscular centralizada no ponto de ação"
    },
    textures: [
      "Ferro fundido áspero com pintura eletrostática preta",
      "Magnésio e giz branco em pó pulverizado",
      "Piso emborrachado tático de alta resistência",
      "Suor cintilante em pele sob tensão atlética"
    ],
    psychologicalTriggers: [
      "Orgulho Próprio e Desejo de Transformação Física Notória",
      "Sentimento de Tribo e Pertencimento aos Raros que Não Desistem",
      "Raiva Construtiva Canalizada em Ação e Disciplina",
      "Visualização Imediata do Shape Esculpido"
    ],
    promptKit: {
      aiCoverPrompt: "High-energy athletic fitness publication cover, sculpted powerful athlete with gym chalk powder in air, top-down dramatic studio spotlight, neon orange rim lighting, dark industrial iron gym background, 35mm lens, sweat drops glistening, intense focus, bold athletic typography, 8k crisp details.",
      aiCreativePrompt: "Fitness coaching Instagram ad creative, high contrast athlete silhouette, orange and red neon streak, heavy barbell iron texture, powerful motivation slogan, 8k commercial quality.",
      visualTokens: [
        "gym chalk powder in air",
        "top-down athletic lighting",
        "orange rim lighting",
        "cast iron weights",
        "sweat glistening on skin",
        "low-angle power stance",
        "hardcore gym aesthetics"
      ],
      negativeTokens: ["skinny", "couch potato", "cartoon", "soft pastel", "smiling selfie", "lazy", "blurry"],
      suggestedMidjourneyParams: "--ar 2:3 --v 6.1 --style raw"
    },
    sampleMockup: {
      title: "Construindo o Físico de Titânio",
      subtitle: "A Metodologia Oculta de Hipertrofia e Densidade Muscular Máxima",
      author: "Coach Rodrigo Valente",
      ctaText: "Destravar Meu Shape Definitivo",
      pillTag: "PROTOCOLO DE ELITE DE FORÇA"
    }
  },

  // 10. CLEAN BEAUTY & ROSE QUARTZ LUXURY
  {
    id: "dna_clean_beauty_luxe",
    name: "Clean Beauty & Rose Luxury",
    category: "Beleza & Estética",
    tagline: "Alta Estética • Skincare de Luxo • Ouro Rosé, Pérola & Seda",
    badge: "ALTA ESTÉTICA",
    iconName: "Heart",
    description: "Elegância pura para o universo feminino de alto padrão: ouro rosé acetinado, reflexos perolados de hidratantes nobres, mármore branco Carrara e iluminação difusa Beauty Dish que valoriza peles perfeitas.",
    conversionRationale: "Evoca luxo dermatológico de consultório de ponta. A mulher sente que não está comprando uma dica comum de internet, mas sim um tratamento exclusivo de alta classe.",
    targetNiches: ["Skincare Facial & Rejuvenescimento", "Harmonização & Procedimentos", "Automaquiagem de Alto Padrão", "Cabelos de Salão de Luxo", "Elegância & Postura Feminina"],
    averageTicketSuggested: "R$ 47,00 - R$ 197,00",
    colors: {
      primary: "#f43f5e",
      secondary: "#1f1317",
      accent: "#fb7185",
      background: "#0f080b",
      text: "#fff1f2",
      mutedText: "#fecdd3",
      gradientClass: "from-rose-500/30 via-pink-950/40 to-black",
      swatches: [
        { name: "Ouro Rosé Acetinado", hex: "#fb7185", role: "Bordas & Monogramas" },
        { name: "Rosa Quartzo Veludo", hex: "#f43f5e", role: "Botões & Detalhes Vivos" },
        { name: "Cacau Rosado de Fundo", hex: "#1f1317", role: "Superfície Suave" },
        { name: "Seda Negra Noturna", hex: "#0f080b", role: "Base de Fundo" },
        { name: "Pérola Luminosa", hex: "#fff1f2", role: "Tipografia de Alta Definição" }
      ]
    },
    typography: {
      headingFont: "Playfair Display",
      bodyFont: "Plus Jakarta Sans",
      headingStyle: "Serif Elegante com Traços Finos de Revista Vogue",
      letterSpacing: "tracking-tight",
      textTransform: "none",
      hierarchyRatio: "1.333 (Perfect Fourth) - Requinte",
      cssFamily: "'Playfair Display', serif"
    },
    lighting: {
      setupName: "Beauty Dish de Grande Diâmetro com Difusor de Seda",
      type: "Luz Envolvente de Skincare Editorial",
      description: "Iluminação ampla e difusa que suaviza imperfeições, realça o brilho natural e cria reflexos redondos radiantes nos olhos e nas embalagens de vidro.",
      colorTemperature: "5200K (Luz suave de pele saudável e iluminada)",
      keyAspects: ["Glow natural translúcido de pele bem cuidada", "Reflexos delicados em ouro rosé e vidro", "Sombras ultra suaves sem cortes abruptos"]
    },
    optics: {
      lens: "85mm F/1.4 Portrait Lens",
      aperture: "F/1.4 para desfoque de sonho no segundo plano",
      cameraAngle: "Nível dos Olhos em Close-up Intimista",
      depthOfField: "Foco aveludado com separação sublime",
      framingComposition: "Assimetria delicada com espaço para títulos finos e sofisticados"
    },
    textures: [
      "Mármore branco Carrara com veios rosados suaves",
      "Seda pura champagne fluida e ondulada",
      "Vidro fosco de sérum facial com detalhes em ouro rosé",
      "Pétalas de peônia orvalhadas"
    ],
    psychologicalTriggers: [
      "Elevação da Autoestima e Amor Próprio",
      "Desejo de Rejuvenescimento e Pele com Viço Impecável",
      "Percepção de Tratamento VIP de Clínica Conceito",
      "Acesso ao Padrão de Beleza das Celebridades"
    ],
    promptKit: {
      aiCoverPrompt: "Luxury clean beauty magazine book cover, glowing radiant skin close-up, rose quartz and frosted glass serum bottle on white Carrara marble, soft champagne silk draping, beauty dish diffused lighting, rose gold foil accents, editorial serif typography, Vogue aesthetic, 8k award-winning.",
      aiCreativePrompt: "High-end skincare social media ad, glowing hydrated skin texture, rose gold and pearl luxury palette, marble surface, pure feminine elegance, commercial cosmetics campaign, 8k crisp focus.",
      visualTokens: [
        "clean beauty editorial",
        "rose quartz luxury palette",
        "glowing hydrated skin",
        "white carrara marble",
        "beauty dish diffused lighting",
        "rose gold foil accents",
        "85mm portrait photography"
      ],
      negativeTokens: ["acne", "pores", "harsh shadows", "cheap plastic", "cartoon", "blurry", "grunge"],
      suggestedMidjourneyParams: "--ar 2:3 --v 6.1 --style raw"
    },
    sampleMockup: {
      title: "O Ritual da Pele Perfeita",
      subtitle: "Segredos de Consultório Para um Rejuvenescimento Natural e Radiante",
      author: "Dra. Camila Bittencourt",
      ctaText: "Descobrir Meu Protocolo de Beleza",
      pillTag: "CLINICAL BEAUTY EDITION"
    }
  }
];

// Helper para obter estilo por ID
export function getVisualDnaById(id: string): VisualDnaStyle {
  const found = VISUAL_DNA_STYLES.find(s => s.id === id);
  return found || VISUAL_DNA_STYLES[0];
}

// ==========================================
// COMPONENTE VISUAL STYLE LIBRARY
// ==========================================

interface Props {
  onSelectStyle?: (style: VisualDnaStyle) => void;
  onApplyToCover?: (style: VisualDnaStyle) => void;
  onApplyToCreatives?: (style: VisualDnaStyle) => void;
  currentStyleId?: string;
  mode?: "inline" | "modal";
  isOpen?: boolean;
  onClose?: () => void;
}

export default function VisualStyleLibrary({
  onSelectStyle,
  onApplyToCover,
  onApplyToCreatives,
  currentStyleId,
  mode = "inline",
  isOpen = true,
  onClose
}: Props) {
  // Inicialização do estilo selecionado (prioriza prop, localStorage ou padrão Gourmet)
  const [selectedStyleId, setSelectedStyleId] = useState<string>(() => {
    if (currentStyleId) return currentStyleId;
    const stored = localStorage.getItem("fabrica_active_visual_dna_id");
    return stored || "dna_gourmet_haute_cuisine";
  });

  const selectedStyle = getVisualDnaById(selectedStyleId);

  // Estados de navegação e filtros
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"catalog" | "inspector" | "simulator">("catalog");

  // Estados de cópia e feedback
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedPromptType, setCopiedPromptType] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState<{ message: string; type: "cover" | "creatives" } | null>(null);

  // Categorias únicas para filtro
  const categories = [
    "all",
    "Gourmet & Gastronomia",
    "Finanças & Dark Money",
    "Tecnologia & IA",
    "Minimalismo & Tech",
    "Saúde & Orgânico",
    "Alta Conversão / Vendas",
    "Cinema & Vintage",
    "Espiritual & Mente",
    "Fitness & Performance",
    "Beleza & Estética"
  ];

  // Filtro de estilos
  const filteredStyles = VISUAL_DNA_STYLES.filter(style => {
    const matchesCategory = selectedCategory === "all" || style.category === selectedCategory;
    const matchesSearch =
      style.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      style.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      style.targetNiches.some(n => n.toLowerCase().includes(searchTerm.toLowerCase())) ||
      style.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Manipulador de seleção do estilo
  const handleSelectStyle = (style: VisualDnaStyle) => {
    setSelectedStyleId(style.id);
    localStorage.setItem("fabrica_active_visual_dna_id", style.id);
    localStorage.setItem("fabrica_selected_visual_dna", JSON.stringify(style));
    if (onSelectStyle) {
      onSelectStyle(style);
    }
  };

  // Aplicação no Gerador de Capas
  const handleApplyCover = (style: VisualDnaStyle) => {
    handleSelectStyle(style);
    // Salva configurações automáticas para a Etapa 1
    localStorage.setItem("fabrica_cover_suggested_prompt", style.promptKit.aiCoverPrompt);
    localStorage.setItem("fabrica_cover_suggested_style", style.name);
    localStorage.setItem("fabrica_cover_typography", style.typography.headingFont);
    localStorage.setItem("fabrica_cover_color", style.colors.primary);

    setAppliedNotification({
      message: `Estética "${style.name}" aplicada com sucesso para o Gerador de Capas!`,
      type: "cover"
    });

    if (onApplyToCover) {
      onApplyToCover(style);
    }

    setTimeout(() => {
      setAppliedNotification(null);
    }, 4000);
  };

  // Aplicação no Gerador de Criativos
  const handleApplyCreatives = (style: VisualDnaStyle) => {
    handleSelectStyle(style);
    // Salva configurações automáticas para a Etapa 4
    localStorage.setItem("fabrica_creative_suggested_prompt", style.promptKit.aiCreativePrompt);
    localStorage.setItem("fabrica_creative_colors", JSON.stringify(style.colors));
    localStorage.setItem("fabrica_creative_typography", style.typography.headingFont);

    setAppliedNotification({
      message: `Estética "${style.name}" aplicada para o Gerador de Criativos & Anúncios!`,
      type: "creatives"
    });

    if (onApplyToCreatives) {
      onApplyToCreatives(style);
    }

    setTimeout(() => {
      setAppliedNotification(null);
    }, 4000);
  };

  // Copiar HEX
  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Copiar Prompts
  const handleCopyPrompt = (prompt: string, type: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptType(type);
    setTimeout(() => setCopiedPromptType(null), 2500);
  };

  // Copiar JSON do DNA Visual
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedStyle, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  // Mapeamento dinâmico de ícones
  const renderCategoryIcon = (iconName: string, className = "w-4 h-4") => {
    switch (iconName) {
      case "UtensilsCrossed": return <UtensilsCrossed className={className} />;
      case "Coins": return <Coins className={className} />;
      case "Cpu": return <Cpu className={className} />;
      case "Laptop": return <Laptop className={className} />;
      case "Leaf": return <Leaf className={className} />;
      case "Flame": return <Flame className={className} />;
      case "Film": return <Film className={className} />;
      case "Sun": return <Sun className={className} />;
      case "Dumbbell": return <Dumbbell className={className} />;
      case "Heart": return <Heart className={className} />;
      default: return <Palette className={className} />;
    }
  };

  if (mode === "modal" && !isOpen) return null;

  const content = (
    <div className="w-full flex flex-col gap-6 text-slate-100">
      
      {/* TOAST DE FEEDBACK DE APLICAÇÃO */}
      <AnimatePresence>
        {appliedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 max-w-md bg-slate-900/95 border border-emerald-500/40 backdrop-blur-xl p-4 rounded-2xl shadow-2xl shadow-emerald-950/50 flex items-start gap-3 text-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 text-xs uppercase tracking-wider">Estética Ativada</span>
                <span className="text-[10px] text-slate-400 font-mono">DNA Visual</span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed">{appliedNotification.message}</p>
            </div>
            <button
              onClick={() => setAppliedNotification(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER DA BIBLIOTECA */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Estética & Psicologia de Conversão
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono">
                10 Estilos Exclusivos
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Biblioteca de DNA Visual
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Defina a assinatura estética do seu produto digital antes de gerar capas e anúncios. Escolha entre estéticas consolidadas como <strong className="text-amber-300 font-medium">Gourmet</strong>, <strong className="text-emerald-300 font-medium">Dark Money</strong>, <strong className="text-cyan-300 font-medium">Cyber Tech</strong> e mais para alinhar cores, iluminação de cinema e tipografia de alto padrão.
            </p>
          </div>

          {/* ESTILO ATUALMENTE ATIVO BADGE */}
          <div className="bg-slate-950/80 border border-slate-700/60 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-xl shrink-0 backdrop-blur-md">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-inner border border-white/10"
              style={{ backgroundColor: selectedStyle.colors.primary }}
            >
              {renderCategoryIcon(selectedStyle.iconName, "w-5 h-5")}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Estética Selecionada</span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                {selectedStyle.name}
              </span>
              <span className="text-[11px] text-amber-300 font-mono">{selectedStyle.badge}</span>
            </div>
          </div>
        </div>

        {/* CONTROLES DE BUSCA E TABS DE NAVEGAÇÃO */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* SEARCH BAR */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar estilo, nicho ou palavra-chave..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* VIEW SWITCHER */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "catalog"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Catálogo de Estilos</span>
            </button>
            <button
              onClick={() => setActiveTab("inspector")}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "inspector"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Inspetor do DNA ({selectedStyle.name.split(" ")[0]})</span>
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "simulator"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Simulador de Capa & Ad</span>
            </button>
          </div>
        </div>

        {/* CATEGORY FILTER CHIPS */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg shrink-0 whitespace-nowrap transition-all text-[11px] font-medium ${
                selectedCategory === cat
                  ? "bg-slate-200 text-slate-950 font-bold shadow-sm"
                  : "bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {cat === "all" ? "Todos os Estilos" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: CATÁLOGO DE ESTILOS (CARDS COM DNA VISUAL)                          */}
      {/* ========================================================================= */}
      {activeTab === "catalog" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredStyles.map((style) => {
            const isSelected = selectedStyleId === style.id;
            return (
              <motion.div
                key={style.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`group bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl relative ${
                  isSelected
                    ? "border-amber-500 ring-2 ring-amber-500/20 shadow-amber-950/20"
                    : "border-slate-800 hover:border-slate-700 hover:shadow-2xl"
                }`}
              >
                {/* TOPO DO CARD: PREVIEW VISUAL GRADIENT & MOCKUP STRIP */}
                <div
                  className={`h-36 relative p-4 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${style.colors.gradientClass}`}
                  style={{ backgroundColor: style.colors.background }}
                >
                  {/* TEXTURE SENSORY NOISE PATTERN */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* BADGE SUPERIOR */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-md flex items-center gap-1.5">
                      {renderCategoryIcon(style.iconName, "w-3 h-3 text-amber-300")}
                      {style.badge}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold tracking-wider flex items-center gap-1 shadow-md">
                        <Check className="w-3 h-3" /> ATIVO
                      </span>
                    )}
                  </div>

                  {/* MINI PREVIEW DA TIPOGRAFIA E ILUMINAÇÃO */}
                  <div className="relative z-10">
                    <span className="text-[10px] uppercase tracking-widest text-white/70 font-mono block">
                      {style.typography.headingStyle}
                    </span>
                    <h3
                      className="text-lg font-black text-white leading-tight drop-shadow-md"
                      style={{ fontFamily: style.typography.cssFamily }}
                    >
                      {style.name}
                    </h3>
                  </div>

                  {/* PALETA DE 5 CORES INTEGRADA NO FUNDO */}
                  <div className="absolute bottom-2 right-3 flex items-center gap-1 bg-black/50 p-1 rounded-lg backdrop-blur-sm border border-white/10">
                    {style.colors.swatches.map((swatch) => (
                      <div
                        key={swatch.hex}
                        className="w-3.5 h-3.5 rounded-full border border-white/30"
                        style={{ backgroundColor: swatch.hex }}
                        title={`${swatch.name}: ${swatch.hex}`}
                      />
                    ))}
                  </div>
                </div>

                {/* CORPO DO CARD */}
                <div className="p-5 flex flex-col gap-4 flex-1">
                  
                  {/* TAGLINE E DESCRIÇÃO */}
                  <div>
                    <span className="text-[11px] font-mono text-amber-300/90 font-semibold block mb-1">
                      {style.tagline}
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {style.description}
                    </p>
                  </div>

                  {/* DNA SPECS RESUMO */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 font-mono uppercase">Luz & Mood</span>
                      <span className="text-slate-300 font-medium truncate" title={style.lighting.setupName}>
                        {style.lighting.type}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 font-mono uppercase">Lente & Câmera</span>
                      <span className="text-slate-300 font-medium truncate" title={style.optics.lens}>
                        {style.optics.lens}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 col-span-2 pt-1.5 border-t border-slate-800/60">
                      <span className="text-[10px] text-slate-500 font-mono uppercase">Nichos Indicados</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {style.targetNiches.slice(0, 3).map((n) => (
                          <span
                            key={n}
                            className="px-1.5 py-0.5 bg-slate-800/80 text-slate-300 rounded text-[10px]"
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* GATILHOS PSICOLÓGICOS PILLS */}
                  <div className="flex flex-wrap gap-1">
                    {style.psychologicalTriggers.slice(0, 2).map((trig) => (
                      <span
                        key={trig}
                        className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-md text-[10px] font-medium"
                      >
                        ⚡ {trig.split("(")[0]}
                      </span>
                    ))}
                  </div>

                  {/* BOTÕES DE AÇÃO DO CARD */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          handleSelectStyle(style);
                          setActiveTab("inspector");
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        <span>Ver DNA Completo</span>
                      </button>

                      <button
                        onClick={() => handleSelectStyle(style)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-slate-800/50 hover:bg-slate-800 text-slate-300"
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{isSelected ? "Selecionado" : "Ativar"}</span>
                      </button>
                    </div>

                    {/* ATALHOS RÁPIDOS PARA CAPAS E CRIATIVOS */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleApplyCover(style)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                        title="Aplicar paleta, tipografia e prompt no gerador de capas"
                      >
                        <Layers className="w-3 h-3 text-emerald-400" />
                        <span>Usar em Capas</span>
                      </button>
                      <button
                        onClick={() => handleApplyCreatives(style)}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                        title="Aplicar paleta e prompt no gerador de anúncios e criativos"
                      >
                        <Zap className="w-3 h-3 text-cyan-400" />
                        <span>Usar em Criativos</span>
                      </button>
                    </div>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: INSPETOR COMPLETO DO DNA VISUAL (DECONSTRUÇÃO DETALHADA)           */}
      {/* ========================================================================= */}
      {activeTab === "inspector" && (
        <div className="flex flex-col gap-6">
          
          {/* HEADER DO ESTILO SELECIONADO */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0 border border-white/10"
                style={{ backgroundColor: selectedStyle.colors.primary }}
              >
                {renderCategoryIcon(selectedStyle.iconName, "w-7 h-7")}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase">
                    {selectedStyle.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{selectedStyle.category}</span>
                </div>
                <h2 className="text-2xl font-black text-white">{selectedStyle.name}</h2>
                <p className="text-xs text-slate-300 max-w-xl">{selectedStyle.tagline}</p>
              </div>
            </div>

            {/* BOTÕES DE APLICAÇÃO RÁPIDA */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                onClick={() => handleApplyCover(selectedStyle)}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Aplicar no Gerador de Capas (Passo 1)</span>
              </button>
              <button
                onClick={() => handleApplyCreatives(selectedStyle)}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Aplicar nos Criativos (Passo 4)</span>
              </button>
              <button
                onClick={handleCopyJson}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Copiar especificação do DNA em formato JSON"
              >
                {copiedJson ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedJson ? "Copiado!" : "JSON"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* COLUNA ESQUERDA: CORES, TIPOGRAFIA, TEXTURAS (7 COLUNAS) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* 1. PALETA CROMÁTICA DO DNA VISUAL */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Paleta Cromática & Harmonização
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Clique no HEX para copiar</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                  {selectedStyle.colors.swatches.map((swatch) => (
                    <button
                      key={swatch.hex}
                      onClick={() => handleCopyHex(swatch.hex)}
                      className="group flex flex-col items-start p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all text-left relative overflow-hidden"
                    >
                      <div
                        className="w-full h-12 rounded-lg mb-2 shadow-inner border border-white/10 flex items-center justify-center"
                        style={{ backgroundColor: swatch.hex }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm font-mono">
                          {copiedHex === swatch.hex ? "Copiado!" : "Copiar"}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-white leading-tight truncate w-full">
                        {swatch.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {swatch.hex}
                      </span>
                      <span className="text-[9px] text-amber-400/80 leading-tight mt-1 line-clamp-1">
                        {swatch.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. ANATOMIA TIPOGRÁFICA & HIERARQUIA */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Anatomia Tipográfica & Escala
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">
                    Escala: {selectedStyle.typography.hierarchyRatio}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* HEADING FONT CARD */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Fonte de Títulos (Display)</span>
                    <span
                      className="text-2xl font-bold text-white"
                      style={{ fontFamily: selectedStyle.typography.cssFamily }}
                    >
                      {selectedStyle.typography.headingFont}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedStyle.typography.headingStyle}
                    </p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Espaçamento: {selectedStyle.typography.letterSpacing}</span>
                      <span>Transform: {selectedStyle.typography.textTransform}</span>
                    </div>
                  </div>

                  {/* BODY FONT CARD */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Fonte de Corpo & Leitura</span>
                    <span className="text-2xl font-medium text-slate-200">
                      {selectedStyle.typography.bodyFont}
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Otimizada para leitura fluida no feed e páginas de vendas. Garante 100% de legibilidade em telas mobile.
                    </p>
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-mono">
                      Alta Acessibilidade WCAG AA
                    </div>
                  </div>

                </div>
              </div>

              {/* 3. ILUMINAÇÃO & ÓPTICA DE CÂMERA */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Setup de Iluminação & Câmera de Cinema
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* ILUMINAÇÃO */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-amber-400 font-bold">Iluminação</span>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="text-sm font-bold text-white">{selectedStyle.lighting.setupName}</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{selectedStyle.lighting.description}</p>
                    <div className="mt-1 flex flex-col gap-1">
                      {selectedStyle.lighting.keyAspects.map((asp, i) => (
                        <div key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                          <span className="text-amber-400">•</span>
                          <span>{asp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CÂMERA & LENTES */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">Óptica & Lente</span>
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <span className="text-sm font-bold text-white">{selectedStyle.optics.lens}</span>
                    <div className="text-xs text-slate-300 flex flex-col gap-1">
                      <div><strong className="text-slate-400">Abertura:</strong> {selectedStyle.optics.aperture}</div>
                      <div><strong className="text-slate-400">Ângulo:</strong> {selectedStyle.optics.cameraAngle}</div>
                      <div><strong className="text-slate-400">Profundidade:</strong> {selectedStyle.optics.depthOfField}</div>
                      <div><strong className="text-slate-400">Composição:</strong> {selectedStyle.optics.framingComposition}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. TEXTURAS TÁTEIS & GATILHOS PSICOLÓGICOS */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Materiais & Gatilhos de Persuasão
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">Texturas Sensoriais</span>
                    <div className="flex flex-col gap-1.5">
                      {selectedStyle.textures.map((tex, i) => (
                        <div key={i} className="text-xs text-slate-300 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>{tex}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">Gatilhos de Conversão</span>
                    <div className="flex flex-col gap-1.5">
                      {selectedStyle.psychologicalTriggers.map((trig, i) => (
                        <div key={i} className="text-xs text-emerald-300 bg-emerald-950/30 px-3 py-2 rounded-lg border border-emerald-500/20 flex items-center gap-2">
                          <span className="text-emerald-400">⚡</span>
                          <span>{trig}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* COLUNA DIREITA: LIVE MOCKUP PREVIEW + MASTER PROMPT GENERATION (5 COLUNAS) */}
            <div className="lg:col-span-5 flex flex-col gap-6 sticky top-6">
              
              {/* LIVE MOCKUP CARD DE CAPA */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-400" />
                    Simulação Visual da Capa
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Proporção 2:3 (E-book)</span>
                </div>

                {/* LIVRO 3D MOCKUP SIMULADO COM O DNA SELECIONADO */}
                <div className="w-full flex justify-center py-4">
                  <div
                    className={`w-64 h-96 rounded-2xl p-6 flex flex-col justify-between relative shadow-2xl border transition-all overflow-hidden bg-gradient-to-br ${selectedStyle.colors.gradientClass}`}
                    style={{
                      borderColor: selectedStyle.colors.accent + "50",
                      backgroundColor: selectedStyle.colors.background
                    }}
                  >
                    {/* Brilho e reflexo superior */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    
                    {/* Borda decorativa nobre */}
                    <div
                      className="absolute inset-3 border rounded-xl pointer-events-none"
                      style={{ borderColor: selectedStyle.colors.accent + "30" }}
                    />

                    {/* Badge Topo */}
                    <div className="relative z-10 flex justify-center">
                      <span
                        className="px-3 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest border backdrop-blur-md"
                        style={{
                          backgroundColor: selectedStyle.colors.secondary,
                          borderColor: selectedStyle.colors.accent,
                          color: selectedStyle.colors.text
                        }}
                      >
                        {selectedStyle.sampleMockup.pillTag}
                      </span>
                    </div>

                    {/* Título Central */}
                    <div className="relative z-10 text-center flex flex-col gap-2 my-auto">
                      <h4
                        className="text-xl font-black leading-tight drop-shadow-lg"
                        style={{
                          fontFamily: selectedStyle.typography.cssFamily,
                          color: selectedStyle.colors.text
                        }}
                      >
                        {selectedStyle.sampleMockup.title}
                      </h4>
                      <p
                        className="text-[11px] leading-relaxed line-clamp-3 font-medium opacity-90"
                        style={{ color: selectedStyle.colors.mutedText }}
                      >
                        {selectedStyle.sampleMockup.subtitle}
                      </p>
                    </div>

                    {/* Rodapé do Livro */}
                    <div className="relative z-10 text-center border-t pt-2" style={{ borderColor: selectedStyle.colors.accent + "30" }}>
                      <span
                        className="text-[10px] font-mono uppercase tracking-widest block font-bold"
                        style={{ color: selectedStyle.colors.accent }}
                      >
                        {selectedStyle.sampleMockup.author}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOTÃO DE APLICAR ESTE ESTILO DIRETAMENTE NA CAPA DO PROJETO */}
                <button
                  onClick={() => handleApplyCover(selectedStyle)}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Configurar Este DNA no Gerador de Capas</span>
                </button>
              </div>

              {/* MASTER PROMPT PARA GERADORES IA (MIDJOURNEY / GEMINI) */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Fórmula de Prompt para IA (Capas)
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCopyPrompt(selectedStyle.promptKit.aiCoverPrompt, "cover")}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                  >
                    {copiedPromptType === "cover" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPromptType === "cover" ? "Copiado!" : "Copiar Prompt"}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed select-all">
                  {selectedStyle.promptKit.aiCoverPrompt}
                </div>

                {/* VISUAL TOKENS */}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">
                    Tokens Principais (Tags de IA)
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedStyle.promptKit.visualTokens.map((tok) => (
                      <span
                        key={tok}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono"
                      >
                        +{tok}
                      </span>
                    ))}
                  </div>
                </div>

                {/* NEGATIVE TOKENS */}
                <div>
                  <span className="text-[10px] font-mono text-rose-400/80 uppercase block mb-1.5">
                    Filtro Negativo de Erros (Evitar)
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedStyle.promptKit.negativeTokens.map((neg) => (
                      <span
                        key={neg}
                        className="px-2 py-0.5 rounded bg-rose-950/30 text-rose-300 border border-rose-500/20 text-[10px] font-mono"
                      >
                        -{neg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* BOTÃO COPIAR PROMPT DE ANÚNCIOS */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">Prompt de Criativo (Feed/Ads):</span>
                  <button
                    onClick={() => handleCopyPrompt(selectedStyle.promptKit.aiCreativePrompt, "creative")}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    {copiedPromptType === "creative" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPromptType === "creative" ? "Copiado!" : "Copiar Prompt Ads"}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: SIMULADOR DE CAPA & AD (COMPARAÇÃO LADO A LADO)                    */}
      {/* ========================================================================= */}
      {activeTab === "simulator" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-mono uppercase text-amber-400 font-bold">Simulação Omnichannel</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Como a Estética "{selectedStyle.name}" performa em Capas vs. Anúncios
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Veja o alinhamento visual de ponta a ponta: da primeira impressão no tráfego pago até a entrega do produto final.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleApplyCover(selectedStyle)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Aplicar na Capa</span>
              </button>
              <button
                onClick={() => handleApplyCreatives(selectedStyle)}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Aplicar nos Criativos</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center py-4">
            
            {/* FORMATO 1: CAPA DE E-BOOK 2:3 */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                1. Capa do E-book (Passo 1) • Formato 2:3
              </span>
              
              <div
                className={`w-72 h-[420px] rounded-2xl p-6 flex flex-col justify-between relative shadow-2xl border overflow-hidden bg-gradient-to-br ${selectedStyle.colors.gradientClass}`}
                style={{
                  backgroundColor: selectedStyle.colors.background,
                  borderColor: selectedStyle.colors.accent + "50"
                }}
              >
                {/* Efeito de iluminação */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                
                {/* Badge */}
                <div className="relative z-10 flex justify-between items-center">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest border"
                    style={{
                      backgroundColor: selectedStyle.colors.secondary,
                      borderColor: selectedStyle.colors.accent,
                      color: selectedStyle.colors.text
                    }}
                  >
                    {selectedStyle.badge}
                  </span>
                  <span className="text-[9px] font-mono text-white/60">EDIÇÃO EXCLUSIVA</span>
                </div>

                {/* Título */}
                <div className="relative z-10 text-center my-auto flex flex-col gap-2">
                  <h4
                    className="text-2xl font-black leading-tight drop-shadow-md"
                    style={{
                      fontFamily: selectedStyle.typography.cssFamily,
                      color: selectedStyle.colors.text
                    }}
                  >
                    {selectedStyle.sampleMockup.title}
                  </h4>
                  <p
                    className="text-xs leading-relaxed font-medium line-clamp-3 opacity-90"
                    style={{ color: selectedStyle.colors.mutedText }}
                  >
                    {selectedStyle.sampleMockup.subtitle}
                  </p>
                </div>

                {/* Rodapé */}
                <div className="relative z-10 text-center border-t pt-2" style={{ borderColor: selectedStyle.colors.accent + "30" }}>
                  <span className="text-[10px] font-bold font-mono tracking-widest uppercase" style={{ color: selectedStyle.colors.accent }}>
                    {selectedStyle.sampleMockup.author}
                  </span>
                </div>
              </div>
            </div>

            {/* FORMATO 2: ANÚNCIO DE FEED/STORY 1:1 OU 9:16 */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                2. Criativo de Feed / Instagram (Passo 4) • Formato 1:1
              </span>

              <div
                className={`w-72 h-72 sm:w-80 sm:h-80 rounded-2xl p-6 flex flex-col justify-between relative shadow-2xl border overflow-hidden bg-gradient-to-br ${selectedStyle.colors.gradientClass}`}
                style={{
                  backgroundColor: selectedStyle.colors.background,
                  borderColor: selectedStyle.colors.accent + "50"
                }}
              >
                {/* Header do Anúncio */}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: selectedStyle.colors.primary,
                      color: selectedStyle.colors.text
                    }}
                  >
                    PATROCINADO
                  </span>
                  <span className="text-[10px] font-mono text-white/60">NOVIDADE</span>
                </div>

                {/* Mensagem de Gancho */}
                <div className="relative z-10 flex flex-col gap-2 text-left">
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: selectedStyle.colors.accent }}
                  >
                    MÉTODO REVELADO
                  </span>
                  <h4
                    className="text-lg sm:text-xl font-black leading-tight drop-shadow-md"
                    style={{
                      fontFamily: selectedStyle.typography.cssFamily,
                      color: selectedStyle.colors.text
                    }}
                  >
                    {selectedStyle.sampleMockup.title}
                  </h4>
                </div>

                {/* Botão de Ação do Anúncio */}
                <div className="relative z-10 flex items-center justify-between pt-3 border-t" style={{ borderColor: selectedStyle.colors.accent + "30" }}>
                  <span className="text-[10px] text-white/70 font-mono">Arraste para cima</span>
                  <div
                    className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg"
                    style={{
                      backgroundColor: selectedStyle.colors.accent,
                      color: selectedStyle.colors.background
                    }}
                  >
                    <span>Saiba Mais</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                A consistência entre o criativo do anúncio e a capa do e-book reduz a taxa de rejeição (Bounce Rate) em até 42%.
              </span>
            </div>
            <button
              onClick={() => {
                handleApplyCover(selectedStyle);
                handleApplyCreatives(selectedStyle);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-all cursor-pointer"
            >
              Aplicar em Ambos (Capas + Criativos)
            </button>
          </div>
        </div>
      )}

    </div>
  );

  if (mode === "modal") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>
          {content}
        </div>
      </div>
    );
  }

  return content;
}
