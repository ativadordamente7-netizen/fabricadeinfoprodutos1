export interface EbookData {
  title: string;
  subtitle: string;
  author: string;
  coverColor: string; // Hex or tailwind class name
  coverPattern: string; // Pattern style
  coverStyle?: string; // 'minimalist', 'modern', 'emotional'
  synopsis: string;
  chapters: {
    number: number;
    title: string;
    content: string;
  }[];
  conclusion: string;
  callToAction: string;
  coverImage?: string;
  cover?: {
    imageUrl?: string;
    coverImage?: string;
    concept?: string;
    style?: string;
    useAiArt?: boolean;
    typography?: "Inter" | "Space Grotesk" | "Playfair Display" | "JetBrains Mono";
    titleColor?: string;
    subtitleColor?: string;
    authorColor?: string;
    overlayColor?: "none" | "dark" | "gradient" | "light" | "colored";
    overlayOpacity?: number;
    alignment?: "top" | "center" | "bottom";
    fontSizeTitle?: number;
    showDecorativeBorder?: boolean;
  };
}

export interface SalesPageSection {
  id: string;
  label: string;
}

export interface SalesPageData {
  headline: string;
  subheadline: string;
  videoPlaceholderText: string;
  hookText: string;
  painPoints: string[];
  benefits: {
    title: string;
    description: string;
  }[];
  testimonials: {
    name: string;
    profile: string;
    text: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  pricing: {
    originalPrice: string;
    discountedPrice: string;
    ctaText: string;
  };
  expertName: string;
  expertBio: string;
  guaranteeDays: string; // "7", "15", "30", "0" (sem garantia)
  checkoutLink: string;
  supportWhatsapp: string;
  themeColor: string; // 'emerald', 'indigo', 'rose', 'slate'
  sectionsVisibility: {
    hero: boolean;
    problem: boolean;
    transformation: boolean;
    productIntro: boolean;
    whatYouLearn: boolean;
    benefits: boolean;
    testimonials: boolean;
    offer: boolean;
    guarantee: boolean;
    faq: boolean;
  };
  sectionsOrder: string[]; // List of section IDs to control ordering
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
}

export interface SavedProject {
  id: string;
  step: number;
  niche: string;
  targetAudience: string;
  tone: string;
  description: string;
  extraDetails: string;
  ebook: EbookData | null;
  salesPage: SalesPageData | null;
  checklist: { [key: string]: boolean };
  publishedUrl: string;
  isUsingFallback?: boolean;
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
  version: string; // e.g. "Paráfrases", "Almeida Revista e Corrigida", "NVI", "King James"
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
  duration: number; // in seconds, e.g. 10 or 15
  style: "discrete" | "highlighted";
  color: "gold" | "blue" | "white" | "cyan";
  glowIntensity: "low" | "medium" | "high";
  speed: "slow" | "normal" | "fast";
}

export interface BrandOS {
  name: string;
  logoUrl?: string;
  symbol?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  typographyHeading: string;
  typographyBody: string;
  voiceTone: string;
  personality: string;
  archetype: string;
  values: string[];
  promise: string;
  targetAudience: string;
  consciousnessLevel: "Inconsciente" | "Problema" | "Solução" | "Produto" | "Totalmente Consciente";
  objectives: string;
  positioning: string;
}

export interface CreativeDirectorBrief {
  id?: string;
  objective: string;
  targetAudience: string;
  transformation: string;
  mainEmotion: string;
  consciousnessLevel: string;
  visualStyle: string;
  referenceBrand: string;
  communicationTone: string;
  first3SecFeeling: string;
  directionTitle: string;
  colorMood: string[];
  visualHooks: string[];
  suggestedCopyStructure: string;
  createdAt?: string;
}

export interface CinematicDirection {
  style: "Luxo" | "Apple" | "Tesla" | "Minimalista" | "Editorial" | "Documentário" | "Hollywood" | "Futurista" | "Espiritual" | "Arquitetônico";
  lighting: "Golden Hour" | "Luxury Studio" | "Soft Natural" | "Cinematic Editorial" | "Dramatic Cyber";
  textures: "Vidro Bisotado" | "Metal Escovado" | "Mármore Negro" | "Fibra de Carbono" | "Dourado Polido";
  palette: string;
  typography: string;
  composition: "Regra dos Terços" | "Simetria Central" | "Macro Close-Up" | "Lente 35mm F/1.4" | "Cinematic Bokeh 85mm";
  depth: "Rasa (Background Murcho)" | "Média Elegante" | "Profunda Hiperdetalhada";
  narrativa: string;
}

export interface QualityScoreResult {
  overallScore: number;
  luxuryScore: number;
  hierarchyScore: number;
  legibilityScore: number;
  persuasionScore: number;
  contrastScore: number;
  brandingScore: number;
  authorityScore: number;
  modernityScore: number;
  exclusivityScore: number;
  diagnosticFeedback: string[];
  optimizedPromptSuggestion: string;
}

export type PerceptionTrigger = 
  | "Confiança" 
  | "Autoridade" 
  | "Curiosidade" 
  | "Segurança" 
  | "Luxo" 
  | "Esperança" 
  | "Transformação" 
  | "Exclusividade" 
  | "Clareza" 
  | "Urgência";

export interface CreativeKit {
  title: string;
  headline: string;
  subheadline: string;
  cta: string;
  caption: string;
  description: string;
  hashtags: string[];
  mainImagePrompt: string;
  thumbnailPrompt: string;
  storyPrompt: string;
  carouselSlides: { slideNumber: number; title: string; body: string; visualConcept: string }[];
  bannerPrompt: string;
  adCopyFeed: string;
  usedPrompt: string;
  abVariations: { id: string; name: string; headline: string; visualAngle: string }[];
}

export interface PageAuditReport {
  score: number;
  uxScore: number;
  uiScore: number;
  speedScore: number;
  persuasionScore: number;
  legibilityScore: number;
  responsivenessScore: number;
  hierarchyScore: number;
  brandingScore: number;
  accessibilityScore: number;
  seoScore: number;
  performanceScore: number;
  offerClarityScore: number;
  ctaQualityScore: number;
  priorityActions: {
    title: string;
    impact: "ALTO" | "MÉDIO" | "CRÍTICO";
    justification: string;
    recommendedFix: string;
  }[];
}

export interface VisualPatternData {
  primaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  typographyFamily: "Space Grotesk" | "Playfair Display" | "Inter" | "JetBrains Mono";
  typographyReason: string;
  lightingAndMood: string;
  layoutStructure: string;
  psychologicalTriggers: string[];
}

export interface VisualReferenceModel {
  id: string;
  title: string;
  niche: string;
  category: "receitas" | "financas" | "tech_ia" | "emagrecimento" | "espiritualidade" | "negocios" | "estetica" | "geral";
  archetype: string;
  badge: string;
  previewUrl: string;
  description: string;
  whyItConverts: string;
  patterns: VisualPatternData;
  promptFormula: string;
  recommendedStyle: string;
}

export interface BrandDnaProfile {
  id: string;
  name: string;
  archetype: string;
  slogan: string;
  icon: string;
  badge: string;
  description: string;
  voiceTone: string;
  personality: string;
  targetAudience: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  typographyHeading: string;
  typographyBody: string;
  coreValues: string[];
  mandatoryTriggers: string[];
  forbiddenWords: string[];
  keyPromise: string;
  authorityBioTemplate: string;
  recommendedLighting: string;
  sampleHeadline: string;
}

export interface SmartStyleProfile {
  id: string;
  name: string;
  tag: string;
  badge: string;
  description: string;
  previewGradient: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  typographyHeading: string;
  typographyBody: string;
  lighting: string;
  lens: string;
  texture: string;
  composition: string;
  mood: string;
  bestNiches: string[];
  conversionReason: string;
  visualHookPrompt: string;
}

export interface VisualPatternData {
  primaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  typographyFamily: "Space Grotesk" | "Playfair Display" | "Inter" | "JetBrains Mono";
  typographyReason: string;
  lightingAndMood: string;
  layoutStructure: string;
  psychologicalTriggers: string[];
}

export interface VisualReferenceModel {
  id: string;
  title: string;
  niche: string;
  category: "receitas" | "financas" | "tech_ia" | "emagrecimento" | "espiritualidade" | "negocios" | "estetica" | "geral";
  archetype: string;
  badge: string;
  previewUrl: string;
  description: string;
  whyItConverts: string;
  patterns: VisualPatternData;
  promptFormula: string;
  recommendedStyle: string;
}

export interface VisualAnalysisResult {
  archetype: string;
  nicheIdentified: string;
  confidenceScore: number;
  badge: string;
  patterns: VisualPatternData;
  visualDeconstruction: {
    focalPoint: string;
    contrastRatio: string;
    hierarchy: string;
    commercialAppeal: string;
  };
  synthesizedPrompt: string;
  recommendedStyle: string;
  recommendedCoverParams: {
    typography: "Space Grotesk" | "Playfair Display" | "Inter" | "JetBrains Mono";
    titleColor: string;
    subtitleColor: string;
    authorColor: string;
    overlayColor: "none" | "dark" | "gradient" | "light" | "colored";
    overlayOpacity: number;
    alignment: "top" | "center" | "bottom";
  };
}



