import { BrandOS, CreativeDirectorBrief, CinematicDirection, PerceptionTrigger } from "../types";

export const DEFAULT_BRAND_OS: BrandOS = {
  name: "Infinity Million OS",
  logoUrl: "",
  symbol: "⚡",
  primaryColor: "#0d9488", // Teal/Emerald luxury
  secondaryColor: "#0f172a", // Slate 900
  accentColor: "#f59e0b", // Amber/Gold
  typographyHeading: "Plus Jakarta Sans",
  typographyBody: "Inter",
  voiceTone: "Autoritário, Prático e Extremamente Persuasivo",
  personality: "Visionário, Exclusivo, Alta Performance",
  archetype: "O Mago & O Governante",
  values: ["Inovação de Elite", "Soberania Digital", "Execução Implacável"],
  promise: "Sua marca escalada em um ecossistema inteligente de alta conversão.",
  targetAudience: "Empreendedores, Criadores de Conteúdo, Infoprodutores e Afiliados que buscam posicionamento premium.",
  consciousnessLevel: "Solução",
  objectives: "Escalar vendas no automático, construir autoridade inquestionável e criar ativos digitais proprietários.",
  positioning: "A plataforma líder em Inteligência Artificial para negócios digitais e marketing de alta performance."
};

export function getSavedBrandOS(): BrandOS {
  try {
    const saved = localStorage.getItem("infinity_brand_os");
    if (saved) {
      return { ...DEFAULT_BRAND_OS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Erro ao carregar Brand OS:", e);
  }
  return DEFAULT_BRAND_OS;
}

export function saveBrandOS(brand: BrandOS): void {
  try {
    localStorage.setItem("infinity_brand_os", JSON.stringify(brand));
  } catch (e) {
    console.error("Erro ao salvar Brand OS:", e);
  }
}

export function buildSystemBrandPrompt(brand: BrandOS, perception?: PerceptionTrigger): string {
  return `
[BRAND OS INTEGRATED SYSTEM CONTEXT]
Marca: ${brand.name}
Promessa Central: ${brand.promise}
Tom de Voz: ${brand.voiceTone}
Personalidade da Marca: ${brand.personality}
Público-Alvo: ${brand.targetAudience}
Nível de Consciência: ${brand.consciousnessLevel}
Posicionamento: ${brand.positioning}
Paleta Visual: Primária ${brand.primaryColor}, Accent ${brand.accentColor}
Tipografia de Marca: Headings em ${brand.typographyHeading}, Corpo em ${brand.typographyBody}
${perception ? `MODO PERCEPÇÃO ATIVO: ${perception} (Forçar gatilhos visuais, psicológicos e estéticos para maximizar essa sensação no usuário).` : ""}
[FIM DO CONTEXTO DE MARCA]
`.trim();
}

export function buildCinematicPrompt(
  promptText: string,
  cinematic: CinematicDirection,
  brand?: BrandOS,
  perception?: PerceptionTrigger
): string {
  const brandContext = brand ? `Brand: ${brand.name}, Color Palette Accent: ${brand.accentColor}.` : "";
  const perceptionContext = perception ? `Elicit immediate emotional response: ${perception}.` : "";

  return `
Ultra high resolution masterpiece photorealistic visual composition.
Subject: ${promptText}
Style Directive: ${cinematic.style} luxury aesthetic.
Lighting Setup: ${cinematic.lighting} with raytraced light reflections and soft realistic highlights.
Material Textures: ${cinematic.textures} with macro level surface detail.
Camera Framing & Lens: ${cinematic.composition}, shallow depth of field (${cinematic.depth}).
Visual Narrative: ${cinematic.narrativa}.
Typography Aesthetic: ${cinematic.typography}.
${brandContext}
${perceptionContext}
Resolution: 8K UHD, award-winning editorial design, studio lighting, photorealistic octane rendering.
`.trim();
}
