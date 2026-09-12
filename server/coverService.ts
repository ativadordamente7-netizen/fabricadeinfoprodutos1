import { db } from "./db";
import { GeminiCache } from "./geminiCache";
import { SystemContextBuilder, AIPersonaSettings } from "./systemContextBuilder";
import { generateTextWithResilience, generateImageWithResilience, cleanJsonString } from "./geminiClient";
import {
  PINTEREST_VISUAL_REFERENCES,
  VisualReferenceModel,
  VisualAnalysisResult,
  VisualPatternData
} from "./pinterestReferenceData";

export { PINTEREST_VISUAL_REFERENCES };
export type { VisualReferenceModel, VisualAnalysisResult, VisualPatternData };

export interface EbookMetadata {
  title: string;
  subtitle: string;
  niche: string;
  description: string;
  targetAudience?: string;
  author: string;
}

export interface CoverVariation {
  id: string;
  name: string;
  typography: "Inter" | "Space Grotesk" | "Playfair Display" | "JetBrains Mono";
  titleColor: string;
  subtitleColor: string;
  authorColor: string;
  overlayColor: "none" | "dark" | "gradient" | "light" | "colored";
  overlayOpacity: number; // 0 to 1
  alignment: "top" | "center" | "bottom";
  fontSizeTitle: number; // 24 to 48px relative
  showDecorativeBorder: boolean;
}

export interface GeneratedCoverResponse {
  imageUrl: string;
  concept: string;
  style: string;
  variations: CoverVariation[];
  defaultVariationId: string;
}

// Preset Fallbacks for high availability when quota limits or network errors occur
export const PRESET_FALLBACK_COVERS = [
  {
    niche: "Emagrecimento & Fitness",
    keywords: ["emagrecimento", "fitness", "saúde", "corpo", "dieta", "treino", "saudável", "academia", "gym", "diet", "weight", "wellness", "saude", "emagrecer", "peso", "nutrição"],
    urls: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop", // gym barbells
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop", // mountain runner
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop", // yoga meditation
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop", // healthy food
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop", // workout gear
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop", // fitness active
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop"  // fresh fruits bowl
    ]
  },
  {
    niche: "Finanças & Investimentos",
    keywords: ["finanças", "investimentos", "dinheiro", "ações", "riqueza", "pobreza", "investir", "cripto", "bitcoin", "ouro", "money", "finance", "wealth", "stock", "crypto", "financas", "economia", "patrimonio"],
    urls: [
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop", // gold blocks
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop", // stock trading charts
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop", // business suit
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop", // banknotes
      "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop", // crypto 3D art
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop", // financial graph green
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"  // financial skyscrapers
    ]
  },
  {
    niche: "Marketing Digital & Vendas",
    keywords: ["marketing", "vendas", "negócios", "coprodução", "tráfego", "social media", "seo", "ads", "business", "sales", "digital", "agência", "negocios", "venda", "afiliados", "copywriting"],
    urls: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop", // clean code/analytics
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop", // corporate desk
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop", // workstation
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop", // team strategy board
      "https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=800&auto=format&fit=crop", // digital growth chart
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop"  // laptop sales funnel
    ]
  },
  {
    niche: "Tecnologia & IA",
    keywords: ["tecnologia", "ia", "inteligência artificial", "programação", "software", "dev", "python", "computação", "teclado", "robot", "ai", "tech", "cyber", "cybersecurity", "código", "automação"],
    urls: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop", // abstract digital background
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop", // blue AI brain lines
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop", // code lines
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop", // matrix cyber code
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop", // 3D neon shape
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop"  // tech server network
    ]
  },
  {
    niche: "Desenvolvimento Pessoal & Mentalidade",
    keywords: ["desenvolvimento pessoal", "mente", "mentalidade", "produtividade", "hábitos", "habitos", "foco", "mindset", "sucesso", "organização", "autoestima", "psicologia", "comportamento", "disciplina", "propósito"],
    urls: [
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=800&auto=format&fit=crop", // morning forest light
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=800&auto=format&fit=crop", // notebook journal
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop", // pebble stacking
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop", // serene ocean horizon
      "https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?q=80&w=800&auto=format&fit=crop", // sunrise peak
      "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=800&auto=format&fit=crop"  // triumphant silhouette
    ]
  },
  {
    niche: "Relacionamentos & Sedução",
    keywords: ["relacionamento", "conquista", "casamento", "namoro", "amor", "sedução", "dating", "relationship", "love", "couple", "casal", "seducao", "mulher", "homem", "paixão"],
    urls: [
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop", // holding hands
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop", // smiling person
      "https://images.unsplash.com/photo-1511988617408-6beb061fc5e8?q=80&w=800&auto=format&fit=crop", // romantic dinner
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop", // elegant portrait
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop"  // heart candle glow
    ]
  },
  {
    niche: "Idiomas & Educação",
    keywords: ["idiomas", "idioma", "inglês", "espanhol", "estudar", "educação", "falar", "conversação", "aula", "english", "languages", "education", "study", "ingles", "poliglota"],
    urls: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop", // pile of books
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop", // studying desk
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop", // notebook pencil
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"  // globe library
    ]
  },
  {
    niche: "Estética & Beleza",
    keywords: ["estética", "estetica", "beleza", "skincare", "maquiagem", "cabelo", "unhas", "spa", "cosméticos", "beauty", "makeup", "pele", "massagem"],
    urls: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop", // makeup cosmetics
      "https://images.unsplash.com/photo-1512290900673-70020087114e?q=80&w=800&auto=format&fit=crop", // spa stones flowers
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop", // skin care cream
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800&auto=format&fit=crop"  // luxury salon
    ]
  },
  {
    niche: "Gastronomia & Culinária",
    keywords: ["gastronomia", "culinária", "culinaria", "receitas", "cozinha", "chef", "doce", "bolos", "confeitaria", "churrasco", "gourmet", "comida", "marmita"],
    urls: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop", // gourmet restaurant dish
      "https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=800&auto=format&fit=crop", // artisan bread baking
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop", // chocolate cake dessert
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop"  // kitchen cooking herbs
    ]
  },
  {
    niche: "Direito & Negócios Jurídicos",
    keywords: ["direito", "jurídico", "juridico", "advogado", "advocacia", "lei", "justiça", "oab", "concurso público", "contratos"],
    urls: [
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop", // justice scales
      "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?q=80&w=800&auto=format&fit=crop", // legal books hammer
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop"  // handshake deal
    ]
  }
];

export class CoverGenerationService {
  /**
   * Generates only the suggested visual prompt from the niche and description
   */
  public static async suggestPrompt(
    niche: string,
    description: string,
    title?: string,
    forceRefresh = false
  ): Promise<{ prompt: string; style: string; concept: string }> {
    console.log(`[CoverService] Sugerindo prompt para nicho: "${niche}" (forceRefresh: ${forceRefresh})`);
    
    const cacheKey = GeminiCache.generateKey("cover_suggest_prompt", { niche, description, title });
    
    if (!forceRefresh) {
      const cachedResult = GeminiCache.get<{ prompt: string; style: string; concept: string }>(cacheKey);
      if (cachedResult) {
        console.log("[GeminiCache] Retornando sugestão de capa do cache.");
        return cachedResult;
      }
    }

    try {
      const suggestPromptText = `
        Você é um Diretor de Arte sênior especializado em criar capas de infoprodutos de altíssima conversão.
        Com base no nicho e na descrição do produto, crie um prompt visual descritivo otimizado para o gerador de imagens Gemini (como o Imagen 3).
        
        Nicho: ${niche}
        Descrição do Produto: ${description}
        Título (se disponível): ${title || ""}
        Variante aleatória: ${Date.now()}-${Math.random()}
        
        O prompt de imagem deve descrever o cenário ideal, cores, iluminação e elementos de fundo, sem nenhum texto ou letras. O prompt final DEVE ser em INGLÊS.
        O estilo inicial deve ser um dos seguintes: "minimalist", "emotional", "modern", "artistic", "editorial", "dark_luxury", "cyberpunk", "vibrant_fitness", "corporate", "nature_wellness".
        O conceito de design deve ser uma breve explicação em português do porquê essa composição foi escolhida.
      `;

      const response = await generateTextWithResilience({
        contents: suggestPromptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              style: { type: "STRING", description: "Estilo artístico escolhido" },
              concept: { type: "STRING", description: "Breve conceito em português do design" },
              prompt: { type: "STRING", description: "O prompt de imagem detalhado em inglês (sem texto)" }
            },
            required: ["style", "concept", "prompt"]
          }
        }
      });

      const data = JSON.parse(cleanJsonString(response.text || "{}"));
      const result = {
        prompt: data.prompt || `Professional book cover background about ${niche}. Abstract digital art, elegant.`,
        style: data.style || "modern",
        concept: data.concept || "Conceito focado no nicho do produto."
      };
      
      if (!forceRefresh) {
        GeminiCache.set(cacheKey, result);
      }
      return result;
    } catch (err: any) {
      console.log("[CoverService] Erro ao sugerir prompt:", err);
      return {
        prompt: `Professional, high-quality book cover background representing ${niche}. Clean composition, rich textures, abstract design, beautiful lighting. Strictly NO text, NO letters.`,
        style: "modern",
        concept: "Design limpo e moderno gerado por contingência de falhas."
      };
    }
  }

  /**
   * Orchestrates the entire Cover Generation workflow
   */
  public static async generateCover(
    metadata: EbookMetadata & { customPrompt?: string; forceRefresh?: boolean; imageSize?: "1K" | "2K" | "4K" },
    selectedStyle?: string
  ): Promise<GeneratedCoverResponse> {
    const isForceRefresh = metadata.forceRefresh === true;
    const requestedImageSize = metadata.imageSize || "1K";
    console.log(`[CoverService] Iniciando geração de capa para: "${metadata.title}" (forceRefresh: ${isForceRefresh}, size: ${requestedImageSize})`);

    const cacheKey = GeminiCache.generateKey("cover_generate", { metadata, selectedStyle, imageSize: requestedImageSize });
    
    if (!isForceRefresh) {
      const cachedResult = GeminiCache.get<GeneratedCoverResponse>(cacheKey);
      if (cachedResult) {
        console.log("[GeminiCache] Retornando capa do livro do cache.");
        return cachedResult;
      }
    }

    // 1. Analyze ebook content to find styling direction
    let designConcept = "Design moderno e focado no nicho";
    let calculatedStyle = selectedStyle || "modern";
    let visualPrompt = metadata.customPrompt || "";

    if (!visualPrompt) {
      try {
        const analysisPrompt = `
          Você é um Diretor de Arte sênior de uma editora de e-books de alta conversão.
          Analise os metadados do e-book abaixo e defina a direção artística perfeita para a capa.
          
          Título: ${metadata.title}
          Subtítulo: ${metadata.subtitle}
          Nicho: ${metadata.niche}
          Descrição: ${metadata.description}
          Público-Alvo: ${metadata.targetAudience || "Geral"}
          Semente Criativa: ${Date.now()}-${Math.random()}
          
          Escolha o melhor estilo artístico inicial entre:
          - "minimalist" (limpo, sofisticado, cores neutras, muito espaço negativo)
          - "emotional" (dramático, contrastado, cores profundas, focado no sentimento de superação)
          - "modern" (geométrico, corporativo, vetorial, focado em alta tecnologia ou negócios)
          - "artistic" (abstrato, gradientes fluídos, texturas de luxo, chamativo)
          - "editorial" (sofisticado, literário, cores clássicas, estilo revista de alto padrão)
          - "dark_luxury" (fundo preto metálico ou fosco, detalhes em dourado metálico, estética VIP)
          - "cyberpunk" (luzes neon, circuito elétrico, matrizeiro digital)
          - "vibrant_fitness" (cores quentes e energéticas, garra e alta performance)
          
          Crie também um prompt de imagem otimizado para o gerador de imagens Gemini, que descreva a cena de fundo ideal SEM NENHUM TEXTO.
          REQUISITO CRÍTICO: O prompt deve ser detalhado e proibir explicitamente o uso de textos, letras, assinaturas ou palavras. O prompt deve ser em INGLÊS.
        `;

        const systemInstruction = SystemContextBuilder.build({
          productName: metadata.title,
          niche: metadata.niche,
          description: metadata.description,
          targetAudience: metadata.targetAudience
        }, "cover");

        console.log("[CoverService] [Etapa 1] Analisando conteúdo do livro com o Gemini...");
        
        const analysisResponse = await generateTextWithResilience({
          contents: analysisPrompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                style: { type: "STRING", description: "Estilo artístico escolhido" },
                concept: { type: "STRING", description: "Breve conceito em português do design" },
                imagePrompt: { type: "STRING", description: "O prompt de imagem ultra-detalhado em inglês" }
              },
              required: ["style", "concept", "imagePrompt"]
            }
          }
        });

        const parsedAnalysis = JSON.parse(cleanJsonString(analysisResponse.text || "{}"));
        if (parsedAnalysis.style) calculatedStyle = parsedAnalysis.style;
        if (parsedAnalysis.concept) designConcept = parsedAnalysis.concept;
        if (parsedAnalysis.imagePrompt) visualPrompt = parsedAnalysis.imagePrompt;

      } catch (err) {
        console.log("[CoverService] Erro na análise com o Gemini. Usando presets locais de fallback:", err);
      }
    } else {
      designConcept = "Conceito baseado no prompt customizado do usuário";
    }

    // If we couldn't generate a prompt, create a default one
    if (!visualPrompt) {
      visualPrompt = `High quality, professional cover background for a book about ${metadata.niche}, ${metadata.title}. Clean composition, rich textures, abstract design, beautiful illumination. Strictly NO text, NO letters, NO words, NO titles.`;
    }

    // Ensure strict instructions for "No Text" are appended
    if (!visualPrompt.includes("strictly background only")) {
      visualPrompt += `, strictly background only, variation seed ${Date.now()}, award-winning book cover background, photorealistic or digital art style depending on niche, pristine lighting, 8k resolution, absolutely zero text, no letters, no words, no fonts, no labels, no title text.`;
    }

    console.log(`[CoverService] Prompt visual gerado: "${visualPrompt}"`);

    // 2. Call Gemini for generation
    let imageUrl = "";
    let isFallback = false;

    try {
      console.log("[CoverService] [Etapa 2] Invocando o gerador de imagens resiliente...");
      imageUrl = await generateImageWithResilience({
        prompt: visualPrompt,
        aspectRatio: "3:4", // Ideal portrait format for standard ebook covers
        imageSize: requestedImageSize
      });
      console.log("[CoverService] Capa gerada com sucesso pela IA!");

    } catch (imageErr: any) {
      const errMsg = imageErr.message || String(imageErr);
      const isQuota = errMsg.includes("429") || errMsg.toLowerCase().includes("quota") || errMsg.toLowerCase().includes("exhausted") || errMsg.toLowerCase().includes("billing");
      
      if (isQuota) {
        console.log("[CoverService] Aviso: Limite de cota excedido (429) para o modelo de imagem. Ativando banco de imagens de contingência...");
      } else {
        const cleanMsg = errMsg.length > 120 ? errMsg.slice(0, 120) + "..." : errMsg;
        console.log(`[CoverService] Aviso: Geração de capa por IA falhou (${cleanMsg}). Ativando banco de imagens de contingência...`);
      }
      isFallback = true;
      
      // Select a preset background by matching keywords from niche, title, and description
      const searchStr = `${metadata.niche} ${metadata.title} ${metadata.description}`.toLowerCase();
      const matchedPreset = PRESET_FALLBACK_COVERS.find(p => {
        if (searchStr.includes(p.niche.toLowerCase())) return true;
        return p.keywords.some(kw => searchStr.includes(kw));
      });

      if (matchedPreset && matchedPreset.urls.length > 0) {
        // Pick a truly pseudo-random image from the list so repeated clicks yield different images
        const randIdx = Math.floor(Math.random() * matchedPreset.urls.length);
        imageUrl = matchedPreset.urls[randIdx];
      } else {
        // Collect all fallback URLs from all categories and pick one randomly
        const allUrls = PRESET_FALLBACK_COVERS.flatMap(p => p.urls);
        const randIdx = Math.floor(Math.random() * allUrls.length);
        imageUrl = allUrls[randIdx] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";
      }
    }

    // 3. Generate layout variations based on style
    console.log("[CoverService] [Etapa 3] Construindo variações de diagramação...");
    const variations = this.buildVariations(calculatedStyle);

    const result = {
      imageUrl,
      concept: designConcept + (isFallback ? " (Banco de Contingência Ativado)" : ""),
      style: calculatedStyle,
      variations,
      defaultVariationId: variations[0].id
    };

    if (!isForceRefresh) {
      GeminiCache.set(cacheKey, result);
    }
    return result;
  }

  /**
   * Helper to build 4 distinct typography variations for any cover art
   */
  private static buildVariations(style: string): CoverVariation[] {
    const variations: CoverVariation[] = [];

    // Variation 1: Clean/Minimalist
    variations.push({
      id: "var-1",
      name: "Estilo Editorial Premium",
      typography: style === "minimalist" || style === "editorial" ? "Playfair Display" : "Space Grotesk",
      titleColor: "#FFFFFF",
      subtitleColor: "#D1D5DB",
      authorColor: "#10B981", // Emerald accent
      overlayColor: "gradient",
      overlayOpacity: 0.55,
      alignment: "top",
      fontSizeTitle: 28,
      showDecorativeBorder: false
    });

    // Variation 2: Impactful / Center (Perfect for sales conversions)
    variations.push({
      id: "var-2",
      name: "Impacto & Conversão",
      typography: "Space Grotesk",
      titleColor: "#FBBF24", // Gold yellow
      subtitleColor: "#FFFFFF",
      authorColor: "#FFFFFF",
      overlayColor: "dark",
      overlayOpacity: 0.7,
      alignment: "center",
      fontSizeTitle: 32,
      showDecorativeBorder: true
    });

    // Variation 3: Modern/Bold Footer Focus
    variations.push({
      id: "var-3",
      name: "Elegância Clássica",
      typography: "Playfair Display",
      titleColor: "#FFFFFF",
      subtitleColor: "#E5E7EB",
      authorColor: "#F43F5E", // Rose/coral accent
      overlayColor: "gradient",
      overlayOpacity: 0.6,
      alignment: "bottom",
      fontSizeTitle: 30,
      showDecorativeBorder: false
    });

    // Variation 4: Dark Luxury VIP
    variations.push({
      id: "var-4",
      name: "Dark Luxury VIP Gold",
      typography: "Space Grotesk",
      titleColor: "#F59E0B", // Gold Amber
      subtitleColor: "#F3F4F6",
      authorColor: "#FBBF24",
      overlayColor: "dark",
      overlayOpacity: 0.75,
      alignment: "top",
      fontSizeTitle: 34,
      showDecorativeBorder: true
    });

    return variations;
  }

  /**
   * Returns curated visual references inspired by Pinterest & Kindle Best-Sellers
   */
  public static getVisualReferences(category?: string): VisualReferenceModel[] {
    if (!category || category === "all") {
      return PINTEREST_VISUAL_REFERENCES;
    }
    return PINTEREST_VISUAL_REFERENCES.filter(r => r.category === category);
  }

  /**
   * Deep visual deconstruction of user-submitted print / screenshot or reference image
   * using Gemini multimodal analysis to extract design patterns without plagiarism.
   */
  public static async analyzeReference(options: {
    imageBase64?: string;
    imageUrl?: string;
    notes?: string;
    niche?: string;
    title?: string;
    description?: string;
    forceRefresh?: boolean;
  }): Promise<VisualAnalysisResult> {
    const { imageBase64, imageUrl, notes, niche = "Geral", title = "Infoproduto", description = "Guia Prático" } = options;

    console.log(`[CoverService] Analisando referência visual para nicho "${niche}"...`);

    const cacheKey = GeminiCache.generateKey("visual_reference_analysis", {
      hasImage: !!imageBase64,
      imageSample: imageBase64 ? imageBase64.slice(0, 100) : imageUrl,
      notes,
      niche,
      title
    });

    if (!options.forceRefresh) {
      const cached = GeminiCache.get<VisualAnalysisResult>(cacheKey);
      if (cached) {
        console.log("[GeminiCache] Retornando análise visual do cache.");
        return cached;
      }
    }

    // Default fallback deconstruction aligned with the niche
    const matchedRef = PINTEREST_VISUAL_REFERENCES.find(r => 
      r.niche.toLowerCase().includes(niche.toLowerCase()) || 
      niche.toLowerCase().includes(r.category)
    ) || PINTEREST_VISUAL_REFERENCES[2]; // Dark Luxury default

    try {
      const analysisPrompt = `
Você é um Diretor de Arte e Estrategista Visual de Conversão sênior especializado em capas de infoprodutos best-sellers (padrão Pinterest, Hotmart, Kiwify e Amazon Kindle).
Analise a referência visual fornecida (print/screenshot ou conceito visual).

DADOS DO NOVO INFOPRODUTO QUE VAI RECEBER A CAPA:
- Título do E-book: "${title}"
- Nicho de Mercado: "${niche}"
- Proposta de Valor / Descrição: "${description}"
${notes ? `- Observações / Foco do Usuário: "${notes}"` : ""}

SUA TAREFA:
1. Decompor os padrões visuais da referência: paleta cromática de alta conversão (HEX), estilo tipográfico, iluminação e hierarquia.
2. Identificar por que esse modelo converte tanto no Pinterest / mercado.
3. CRIAR UM PROMPT DE IMAGEM TOTALMENTE INÉDITO EM INGLÊS para o gerador de imagens Gemini, adaptado exclusivamente para o infoproduto acima. O prompt NÃO deve copiar elementos protegidos nem textos na imagem, deve criar uma composição original que herde o mesmo nível de prestígio, sofisticação e apelo comercial.

Retorne EXCLUSIVAMENTE um JSON estrito seguindo este formato:
{
  "archetype": "Nome conciso do arquétipo (ex: Dark Luxury VIP Gold, Culinária Sensorial Rústica, etc.)",
  "nicheIdentified": "Nicho identificado",
  "confidenceScore": 98,
  "badge": "Tendência Pinterest 2025",
  "patterns": {
    "primaryColor": "#HEX",
    "accentColor": "#HEX",
    "textColor": "#FFFFFF",
    "backgroundColor": "#HEX",
    "typographyFamily": "Space Grotesk",
    "typographyReason": "Explicação didática do porquê desta tipografia",
    "lightingAndMood": "Descrição da iluminação e clima emocional",
    "layoutStructure": "Estrutura geométrica do design",
    "psychologicalTriggers": ["Gatilho 1", "Gatilho 2", "Gatilho 3"]
  },
  "visualDeconstruction": {
    "focalPoint": "Onde o olho humano bate primeiro",
    "contrastRatio": "Grau de contraste e legibilidade",
    "hierarchy": "Ordem de leitura visual recomendada",
    "commercialAppeal": "Por que desperta desejo imediato de compra"
  },
  "synthesizedPrompt": "Prompt detalhado em inglês para gerar uma imagem de fundo inédita e original, sem textos, focando em iluminação e texturas 8k",
  "recommendedStyle": "modern",
  "recommendedCoverParams": {
    "typography": "Space Grotesk",
    "titleColor": "#HEX",
    "subtitleColor": "#HEX",
    "authorColor": "#HEX",
    "overlayColor": "dark",
    "overlayOpacity": 0.6,
    "alignment": "top"
  }
}
      `;

      let contentsPayload: any = analysisPrompt;

      // Multimodal image processing if base64 provided
      if (imageBase64 && imageBase64.includes("base64,")) {
        const [header, base64Data] = imageBase64.split("base64,");
        const mimeMatch = header.match(/data:([a-zA-Z0-9/+-]+);/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

        contentsPayload = {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Data.trim()
              }
            },
            {
              text: analysisPrompt
            }
          ]
        };
      }

      const response = await generateTextWithResilience({
        contents: contentsPayload,
        config: {
          responseMimeType: "application/json"
        },
        cacheKeyPrefix: "gemini_visual_analysis",
        cachePayload: { niche, title, notes, hasImg: !!imageBase64 }
      });

      if (response && response.text) {
        const parsed = JSON.parse(cleanJsonString(response.text));
        if (parsed.patterns && parsed.synthesizedPrompt) {
          GeminiCache.set(cacheKey, parsed);
          return parsed as VisualAnalysisResult;
        }
      }
    } catch (err: any) {
      console.warn("[CoverService] Erro ao analisar referência visual com Gemini:", err.message || err);
    }

    // High quality intelligent fallback if vision/text call failed
    const fallbackResult: VisualAnalysisResult = {
      archetype: matchedRef.archetype,
      nicheIdentified: matchedRef.niche,
      confidenceScore: 94,
      badge: matchedRef.badge,
      patterns: matchedRef.patterns,
      visualDeconstruction: {
        focalPoint: "Elemento central temático com iluminação volumétrica",
        contrastRatio: "Alto contraste entre texto luminoso e fundo de atmosfera profunda",
        hierarchy: "1. Título de promessa magnética -> 2. Selo de autoridade -> 3. Nome do autor",
        commercialAppeal: matchedRef.whyItConverts
      },
      synthesizedPrompt: matchedRef.promptFormula.replace("{niche}", niche),
      recommendedStyle: matchedRef.recommendedStyle,
      recommendedCoverParams: {
        typography: matchedRef.patterns.typographyFamily,
        titleColor: matchedRef.patterns.primaryColor,
        subtitleColor: "#F3F4F6",
        authorColor: matchedRef.patterns.accentColor,
        overlayColor: "dark",
        overlayOpacity: 0.65,
        alignment: "top"
      }
    };

    return fallbackResult;
  }

  /**
   * Generates a completely new, original cover using an analyzed or chosen reference archetype
   */
  public static async generateFromReference(options: {
    referenceId?: string;
    analysis?: Partial<VisualAnalysisResult>;
    title: string;
    subtitle: string;
    niche: string;
    description: string;
    author: string;
    targetAudience?: string;
  }): Promise<GeneratedCoverResponse> {
    const { referenceId, analysis, title, subtitle, niche, description, author, targetAudience } = options;

    let targetPrompt = "";
    let targetStyle = "modern";
    let targetTypography: "Space Grotesk" | "Playfair Display" | "Inter" | "JetBrains Mono" = "Space Grotesk";
    let titleColor = "#FFFFFF";
    let authorColor = "#10B981";

    if (referenceId) {
      const refModel = PINTEREST_VISUAL_REFERENCES.find(r => r.id === referenceId);
      if (refModel) {
        targetPrompt = refModel.promptFormula
          .replace("{niche}", niche)
          .replace("{title}", title);
        targetStyle = refModel.recommendedStyle;
        targetTypography = refModel.patterns.typographyFamily;
        titleColor = refModel.patterns.primaryColor;
        authorColor = refModel.patterns.accentColor;
      }
    }

    if (analysis?.synthesizedPrompt) {
      targetPrompt = analysis.synthesizedPrompt;
      if (analysis.recommendedStyle) targetStyle = analysis.recommendedStyle;
      if (analysis.recommendedCoverParams?.typography) targetTypography = analysis.recommendedCoverParams.typography;
      if (analysis.recommendedCoverParams?.titleColor) titleColor = analysis.recommendedCoverParams.titleColor;
      if (analysis.recommendedCoverParams?.authorColor) authorColor = analysis.recommendedCoverParams.authorColor;
    }

    if (!targetPrompt) {
      targetPrompt = `High-end commercial book cover artwork for ${niche}, elegant lighting, luxury editorial style, 8k resolution, no text`;
    }

    console.log(`[CoverService] Gerando capa original a partir de referência visual. Estilo: "${targetStyle}"...`);

    const coverResponse = await this.generateCover({
      title,
      subtitle,
      niche,
      description,
      author,
      targetAudience: targetAudience || "",
      customPrompt: targetPrompt,
      forceRefresh: true
    }, targetStyle);

    // Ensure the primary variation matches the reference typography and colors
    if (coverResponse.variations && coverResponse.variations.length > 0) {
      coverResponse.variations[0].typography = targetTypography;
      coverResponse.variations[0].titleColor = titleColor;
      coverResponse.variations[0].authorColor = authorColor;
    }

    return coverResponse;
  }
}

