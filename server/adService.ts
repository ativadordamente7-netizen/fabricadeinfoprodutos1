import { GeminiCache } from "./geminiCache";
import { SystemContextBuilder, AIPersonaSettings, AvatarContextData } from "./systemContextBuilder";
import { generateTextWithResilience, generateImageWithResilience, cleanJsonString } from "./geminiClient";

export interface AdCopyOption {
  type: "recommended" | "emotional" | "direct";
  name: string;
  attention: string;
  interest: string;
  desire: string;
  action: string;
  primaryText: string; // The complete stitched copy for copy-pasting
  // Extended fields for Full Creative Kit (Kit Criativo Completo)
  headline: string;
  subheadline: string;
  legenda: string;
  cta: string;
  hashtags: string;
  isFallback?: boolean;
}

export interface AdImageResponse {
  imageUrl: string;
  concept: string;
  style: "commercial" | "premium" | "customCover";
  isFallback: boolean;
  prompt?: string;
}

// Preset Fallbacks for ads by niche
const AD_FALLBACK_IMAGES = [
  {
    niche: "Emagrecimento & Fitness",
    keywords: ["emagrecimento", "fitness", "saúde", "corpo", "dieta", "treino", "saudável", "academia", "gym", "diet", "weight", "wellness", "saude", "emagrecer", "peso"],
    urls: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop", // gym
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop", // healthy active
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop", // abs trainer
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop"  // healthy salad
    ]
  },
  {
    niche: "Finanças & Investimentos",
    keywords: ["finanças", "investimentos", "dinheiro", "ações", "riqueza", "pobreza", "investir", "cripto", "bitcoin", "ouro", "money", "finance", "wealth", "stock", "crypto", "financas"],
    urls: [
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop", // finance charts dark
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop", // trading graph
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop", // gold blocks
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop"  // dollar bill textures
    ]
  },
  {
    niche: "Marketing Digital & Vendas",
    keywords: ["marketing", "vendas", "negócios", "coprodução", "tráfego", "social media", "seo", "ads", "business", "sales", "digital", "agência", "negocios", "venda"],
    urls: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop", // workspace clean
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop", // teamwork presentation
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop", // dynamic laptop station
      "https://images.unsplash.com/photo-1533750349088-cd871a92f311?q=80&w=800&auto=format&fit=crop"  // digital marketing desk
    ]
  },
  {
    niche: "Tecnologia & IA",
    keywords: ["tecnologia", "ia", "inteligência artificial", "programação", "software", "dev", "python", "computação", "teclado", "robot", "ai", "tech", "cyber", "cybersecurity"],
    urls: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop", // gradient abstract
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop", // blue tech neon
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop", // code matrix cyber
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"  // futuristic circuit
    ]
  },
  {
    niche: "Desenvolvimento Pessoal & Mentalidade",
    keywords: ["desenvolvimento pessoal", "mente", "mentalidade", "produtividade", "hábitos", "habitos", "foco", "mindset", "sucesso", "organização", "autoestima", "psicologia", "comportamento"],
    urls: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop", // meditation rocks sunset
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=800&auto=format&fit=crop", // natural rays sunrise
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=800&auto=format&fit=crop"  // work journal planning
    ]
  },
  {
    niche: "Relacionamentos",
    keywords: ["relacionamento", "conquista", "casamento", "namoro", "amor", "sedução", "dating", "relationship", "love", "couple", "casal", "seducao", "mulher", "homem"],
    urls: [
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop", // couples hand holding
      "https://images.unsplash.com/photo-1511988617408-6beb061fc5e8?q=80&w=800&auto=format&fit=crop", // beautiful ambiance
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop"  // happy expression portrait
    ]
  }
];

function cleanJson(raw: string): string {
  if (!raw) return "{}";
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
  return cleaned.trim();
}

export class AdGenerationService {
  /**
   * Generates three AIDA-structured ad copies
   */
  public static async generateAdCopies(
    niche: string,
    description: string,
    productName: string,
    targetAudience: string,
    tone: string,
    aiPersona?: AIPersonaSettings,
    avatar?: AvatarContextData,
    chapters?: string[],
    customSystemInstruction?: string
  ): Promise<AdCopyOption[]> {
    console.log(`[AdService] Gerando copies de anúncios para: "${productName}"`);
    const cacheKey = GeminiCache.generateKey("ad_copies", {
      niche,
      description,
      productName,
      targetAudience,
      tone,
      aiPersona,
      avatar,
      chaptersCount: chapters?.length || 0,
      customSystemInstruction
    });

    const cachedResult = GeminiCache.get<AdCopyOption[]>(cacheKey);
    if (cachedResult) {
      console.log("[GeminiCache] Retornando copies de anúncios do cache.");
      return cachedResult;
    }

    const systemInstruction = customSystemInstruction || SystemContextBuilder.build({
      productName,
      niche,
      description,
      targetAudience,
      tone,
      aiPersona,
      avatar,
      chapters
    }, "ad_copy");

    try {
      const prompt = `
        Com base na diretriz de sistema: crie 3 opções/direções completas de Kit Criativo para Anúncios (Meta Ads, TikTok e Google Ads).

        REGRAS CRUCIAIS PARA CADA CAMPO:
        1. headline: Título magnético e direto para estampar no BANNER/IMAGEM (máximo de 6 a 12 palavras, claro, impactante, sem aspas e sem prefixos como "Headline:"). Deve despertar desejo imediato ou curiosidade irresistível.
        2. subheadline: Subtítulo complementar persuasivo de apoio (1 a 2 linhas explicando o método ou a promessa).
        3. attention: Frase de gancho poderosa para a primeira linha do post (Attention da fórmula AIDA).
        4. interest: Frase de conexão com a dor/desafio do público (Interest da fórmula AIDA).
        5. desire: Apresentação da transformação e do produto como solução definitiva (Desire da fórmula AIDA).
        6. action: Chamada clara e imperativa para ação (Action da fórmula AIDA).
        7. legenda: Texto completo unificado pronto para publicação no feed, com espaçamento limpo entre os parágrafos e emojis estratégicos.
        8. cta: Chamada para ação final no padrão de botão (ex: "👉 Clique em Saiba Mais e Garanta o Seu Acesso com Desconto!").
        9. hashtags: Bloco com 5 a 8 hashtags relevantes iniciadas com # (ex: #Nicho #MarketingDigital #Sucesso).

        DIRETRIZES DE ESTILO DAS 3 OPÇÕES:
        1. Opção Recomendada (equilibrada, focada nos maiores benefícios, autoridade e transformação do método)
        2. Opção Emocional (focada na dor visceral do lead, cansaço de tentar sem sucesso e superação definitiva)
        3. Opção Direta (focada na oferta, oportunidade urgente, acesso imediato e chamada para ação objetiva)

        Retorne as 3 opções no formato JSON especificado. Use textos persuasivos e naturais em português do Brasil.
      `;

      const response = await generateTextWithResilience({
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              recommended: {
                type: "OBJECT",
                properties: {
                  attention: { type: "STRING" },
                  interest: { type: "STRING" },
                  desire: { type: "STRING" },
                  action: { type: "STRING" },
                  headline: { type: "STRING", description: "Título impactante principal" },
                  subheadline: { type: "STRING", description: "Subtítulo complementar de apoio" },
                  legenda: { type: "STRING", description: "Legenda completa para publicação" },
                  cta: { type: "STRING", description: "Chamada para ação direta" },
                  hashtags: { type: "STRING", description: "Hashtags iniciadas por #" }
                },
                required: ["attention", "interest", "desire", "action", "headline", "subheadline", "legenda", "cta", "hashtags"]
              },
              emotional: {
                type: "OBJECT",
                properties: {
                  attention: { type: "STRING" },
                  interest: { type: "STRING" },
                  desire: { type: "STRING" },
                  action: { type: "STRING" },
                  headline: { type: "STRING", description: "Título impactante principal" },
                  subheadline: { type: "STRING", description: "Subtítulo complementar de apoio" },
                  legenda: { type: "STRING", description: "Legenda completa para publicação" },
                  cta: { type: "STRING", description: "Chamada para ação direta" },
                  hashtags: { type: "STRING", description: "Hashtags iniciadas por #" }
                },
                required: ["attention", "interest", "desire", "action", "headline", "subheadline", "legenda", "cta", "hashtags"]
              },
              direct: {
                type: "OBJECT",
                properties: {
                  attention: { type: "STRING" },
                  interest: { type: "STRING" },
                  desire: { type: "STRING" },
                  action: { type: "STRING" },
                  headline: { type: "STRING", description: "Título impactante principal" },
                  subheadline: { type: "STRING", description: "Subtítulo complementar de apoio" },
                  legenda: { type: "STRING", description: "Legenda completa para publicação" },
                  cta: { type: "STRING", description: "Chamada para ação direta" },
                  hashtags: { type: "STRING", description: "Hashtags iniciadas por #" }
                },
                required: ["attention", "interest", "desire", "action", "headline", "subheadline", "legenda", "cta", "hashtags"]
              }
            },
            required: ["recommended", "emotional", "direct"]
          }
        }
      });

      const data = JSON.parse(cleanJsonString(response.text || "{}"));

      const nicheClean = (niche || "Sucesso").replace(/\s+/g, "");
      const prodClean = (productName || "Ebook").replace(/\s+/g, "");

      const buildCopy = (obj: any, type: "recommended" | "emotional" | "direct", name: string): AdCopyOption => {
        const att = obj?.attention || `Descubra o Método Exclusivo para Dominar ${niche || "seu nicho"}!`;
        const int = obj?.interest || "Aprenda de forma prática sem desperdiçar tempo e dinheiro.";
        const des = obj?.desire || `Com o guia "${productName || "Ebook"}", você alcançará o próximo nível.`;
        const act = obj?.action || "Clique em Saiba Mais para garantir seu acesso com desconto.";

        const headline = obj?.headline || att;
        const subheadline = obj?.subheadline || int;
        const legenda = obj?.legenda || `🚨 ${att}\n\n${int}\n\n👉 ${des}\n\n👇 ${act}`;
        const cta = obj?.cta || act;
        const hashtags = obj?.hashtags || `#${nicheClean} #${prodClean} #MarketingDigital #Transformacao #Sucesso #Ebook`;
        const primaryText = legenda;

        return {
          type,
          name,
          attention: att,
          interest: int,
          desire: des,
          action: act,
          primaryText,
          headline,
          subheadline,
          legenda,
          cta,
          hashtags
        };
      };

      const result = [
        buildCopy(data.recommended, "recommended", "🏆 Recomendado (Equilibrado)"),
        buildCopy(data.emotional, "emotional", "❤️ Emocional (Conexão e Dor)"),
        buildCopy(data.direct, "direct", "⚡ Direto (Oferta e Ação)")
      ];

      GeminiCache.set(cacheKey, result);
      return result;
    } catch (err: any) {
      console.error("[AdService] Erro ao gerar copies com o Gemini:", err);
      // Beautiful local template copy fallbacks
      const nicheClean = (niche || "Sucesso").replace(/\s+/g, "");
      const prodClean = (productName || "Ebook").replace(/\s+/g, "");

      const fallbackRecommended = {
        attention: `Finalmente revelado: O método passo a passo para dominar ${niche || "seu nicho"} sem rodeios!`,
        interest: `Se você está cansado de testar estratégias obsoletas que só queimam seu dinheiro e quer resultados previsíveis para ${targetAudience || "você"}, preste atenção.`,
        desire: `Descubra os pilares práticos no e-book "${productName || "Infoproduto"}" para gerar transformação real a partir de hoje.`,
        action: `Toque em 'Saiba Mais' para acessar o material completo com valor promocional de lançamento!`,
        headline: `REVELADO: O Passo a Passo Definitivo para ${niche || "seu nicho"}!`,
        subheadline: `Aprenda o método prático sem complicação e alcance resultados comprovados.`,
        legenda: `🚨 Finalmente revelado: O método passo a passo para dominar ${niche || "seu nicho"} sem rodeios!\n\nSe você está cansado de testar estratégias obsoletas que só queimam seu dinheiro, este guia foi feito para você.\n\n👉 Descubra os pilares práticos no e-book "${productName || "Infoproduto"}" para gerar transformação real a partir de hoje.\n\n👇 Toque no botão 'Saiba Mais' para garanta sua vaga promocional de lançamento!`,
        cta: `👉 Toque em 'Saiba Mais' e Garanta Seu Acesso Promocional!`,
        hashtags: `#${nicheClean} #${prodClean} #MarketingDigital #Ebook #TráfegoPago #Transformacao #Sucesso`
      };

      const fallbackEmotional = {
        attention: `Até quando você vai adiar a mudança que sabe que precisa fazer em ${niche || "sua vida"}?`,
        interest: `Dói ver tantas pessoas progredindo enquanto você se sente travado, repetindo os mesmos erros e se frustrando todos os dias.`,
        desire: `O e-book "${productName || "Infoproduto"}" foi escrito para quem bateu no limite e decidiu dar um basta. Um guia real para sua virada de chave.`,
        action: `Clique no link e dê o primeiro passo para reescrever sua história hoje mesmo.`,
        headline: `Até Quando Você Vai Adiar a Mudança Que Tanto Precisa?`,
        subheadline: `Deixe a frustração para trás e conquiste a transformação real que você merece.`,
        legenda: `💔 Até quando você vai adiar a mudança que sabe que precisa fazer em ${niche || "sua vida"}?\n\nDói ver tantas pessoas progredindo enquanto você se sente travado, repetindo os mesmos erros e se frustrando todos os dias.\n\n👉 O e-book "${productName || "Infoproduto"}" foi escrito para quem bateu no limite e decidiu dar um basta. Um guia real para sua virada de chave.\n\n👇 Clique no link abaixo e dê o primeiro passo para reescrever sua história hoje mesmo.`,
        cta: `👇 Clique Aqui e Dê o Primeiro Passo Para Sua Mudança!`,
        hashtags: `#${nicheClean} #${prodClean} #Mindset #Superacao #Foco #AutoConhecimento #ViradaDeChave`
      };

      const fallbackDirect = {
        attention: `Atenção: O e-book "${productName || "Infoproduto"}" está com 50% de desconto por tempo limitado!`,
        interest: `Aprenda de forma prática e direto ao ponto as estratégias essenciais para se destacar em ${niche || "sua área"}.`,
        desire: `Acesso imediato ao material completo passo a passo + bônus exclusivos incluídos nesta oferta única.`,
        action: `Clique em 'Obter Oferta' agora e garanta sua cópia antes que o preço suba.`,
        headline: `50% OFF: Acesso Imediato ao E-book "${productName || "Infoproduto"}"!`,
        subheadline: `Aproveite a oferta de lançamento por tempo extremamente limitado.`,
        legenda: `⚡ Atenção: O e-book "${productName || "Infoproduto"}" está com 50% de desconto por tempo limitado!\n\nAprenda de forma prática e direto ao ponto as estratégias essenciais para se destacar em ${niche || "sua área"}.\n\n👉 Acesso imediato ao material completo passo a passo + bônus exclusivos incluídos nesta oferta única.\n\n👇 Clique em 'Obter Oferta' agora e garanta sua cópia antes que o preço suba.`,
        cta: `🔥 Clique em 'Obter Oferta' Agora com 50% de Desconto!`,
        hashtags: `#${nicheClean} #${prodClean} #OfertaUnica #DescontoEspecial #AcessoImediato #VendasOnline`
      };

      const buildCopy = (obj: any, type: "recommended" | "emotional" | "direct", name: string): AdCopyOption => {
        const primaryText = obj.legenda || `🚨 ${obj.attention}\n\n${obj.interest}\n\n👉 ${obj.desire}\n\n👇 ${obj.action}`;
        return {
          type,
          name,
          ...obj,
          primaryText,
          headline: obj.headline || obj.attention,
          subheadline: obj.subheadline || obj.interest,
          legenda: obj.legenda || primaryText,
          cta: obj.cta || obj.action,
          hashtags: obj.hashtags || `#${nicheClean} #${prodClean} #Ebook`,
          isFallback: true
        };
      };

      return [
        buildCopy(fallbackRecommended, "recommended", "🏆 Recomendado (Equilibrado)"),
        buildCopy(fallbackEmotional, "emotional", "❤️ Emocional (Conexão e Dor)"),
        buildCopy(fallbackDirect, "direct", "⚡ Direto (Oferta e Ação)")
      ];
    }
  }

  /**
   * Generates ad background visual prompt and invokes gemini-3.1-flash-lite-image
   */
  public static async generateAdImage(
    niche: string,
    description: string,
    productName: string,
    style: "commercial" | "premium" | "customCover",
    targetAudience: string,
    forceRefresh: boolean = false,
    imageSize: "1K" | "2K" | "4K" = "1K"
  ): Promise<AdImageResponse> {
    console.log(`[AdService] Iniciando geração visual para anúncio: "${niche}", estilo: ${style}, tamanho: ${imageSize} (forceRefresh: ${forceRefresh})`);
    
    const cacheKey = GeminiCache.generateKey("ad_image", {
      niche,
      description,
      productName,
      style,
      targetAudience,
      imageSize,
      forceTag: forceRefresh ? Date.now() : "static"
    });

    if (!forceRefresh) {
      const cachedResult = GeminiCache.get<AdImageResponse>(cacheKey);
      if (cachedResult) {
        console.log("[GeminiCache] Retornando imagem do anúncio do cache.");
        return cachedResult;
      }
    }

    // Dynamic variation modifier so image generation NEVER repeats
    const dynamicSeed = Math.floor(Math.random() * 999999);
    const timeTag = Date.now().toString().slice(-4);

    // Create high converting visual description prompt (no text in prompt!)
    let adPromptText = "";
    if (style === "customCover") {
      adPromptText = `High-impact artistic digital book cover artwork tailored for E-book title "${productName}" in the niche "${niche}". Atmospheric visual themes of ${niche}, professional digital artist studio composition, vibrant illumination, symbolic art representation for "${productName}" [variation seed #${dynamicSeed}-${timeTag}]. Perfect high-converting background for digital advertisement. Strictly zero text, no letters, no labels, no title text written on canvas.`;
    } else if (style === "premium") {
      adPromptText = `Minimalist, highly sophisticated, and elegant studio shot representing themes of ${niche} and "${productName}". Abstract soft forms, luxury lighting, cinematic shadows, deep modern slate and gold tones. A quiet, clean, high-value premium editorial design [variation seed #${dynamicSeed}-${timeTag}]. Strictly zero text, no letters, no labels, no books, no mockups. Only beautiful background art.`;
    } else {
      adPromptText = `High contrast, vibrant, and energetic commercial design concept background representing ${niche} for "${productName}". Dynamic geometric shapes, modern neon or natural lighting highlights, clean professional corporate or workshop aesthetic [variation seed #${dynamicSeed}-${timeTag}]. Perfect background for a high converting digital ad banner. Strictly zero text, no letters, no labels.`;
    }

    // Append extra descriptors
    adPromptText += ", award-winning photorealistic background, crisp detail, 8k, strictly background only, no typography, no words, no titles, no watermarks.";

    try {
      console.log(`[AdService] Prompt visual: "${adPromptText}"`);
      const imageUrl = await generateImageWithResilience({
        prompt: adPromptText,
        aspectRatio: "1:1",
        imageSize: imageSize
      });

      const result = {
        imageUrl,
        concept: style === "premium" ? "Design minimalista, cores sutis e iluminação dramática" : "Cores contrastantes, foco na solução e alto apelo visual",
        style,
        isFallback: false,
        prompt: adPromptText
      };

      GeminiCache.set(cacheKey, result);
      return result;

    } catch (err: any) {
      const errMsg = err.message || String(err);
      const isQuota = errMsg.includes("429") || errMsg.toLowerCase().includes("quota") || errMsg.toLowerCase().includes("exhausted") || errMsg.toLowerCase().includes("billing");
      
      if (isQuota) {
        console.log("[AdService] Aviso: Limite de cota excedido (429) para o modelo de imagem de anúncio. Ativando contingência...");
      } else {
        const cleanMsg = errMsg.length > 120 ? errMsg.slice(0, 120) + "..." : errMsg;
        console.log(`[AdService] Aviso: Geração visual IA falhou (${cleanMsg}). Ativando contingência...`);
      }
      
      // Fallback matching
      const searchStr = `${niche} ${productName} ${description}`.toLowerCase();
      const matchedPreset = AD_FALLBACK_IMAGES.find(p => {
        if (searchStr.includes(p.niche.toLowerCase())) return true;
        return p.keywords.some(kw => searchStr.includes(kw));
      });

      let imageUrl = "";
      if (matchedPreset && matchedPreset.urls.length > 0) {
        const randIdx = Math.floor(Math.random() * matchedPreset.urls.length);
        imageUrl = matchedPreset.urls[randIdx];
      } else {
        // Universal elegant background fallback
        imageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";
      }

      return {
        imageUrl,
        concept: (style === "premium" ? "Minimalista e Elegante" : "Comercial e Solução") + " (Banco de Contingência Ativado)",
        style,
        isFallback: true,
        prompt: `Contingência ativa - Prompt aproximado: ${adPromptText}`
      };
    }
  }
}
