/**
 * System Context Builder - Fábrica de Infoprodutos & Infinity Million OS
 * 
 * Unifica todas as variáveis do projeto (nicho, avatar, promessa, persona,
 * capítulos, oferta e tom de voz) em um prompt de sistema de alto nível (systemInstruction),
 * garantindo coerência profunda e alinhamento de persona em todas as etapas da esteira.
 */

export interface AIPersonaSettings {
  preset?: string;
  provocationLevel?: number; // 1 to 5
  enthusiasmLevel?: number; // 1 to 5
  complexityLevel?: number; // 1 to 5
  useAnalogies?: boolean;
  useEmojiStyle?: "nenhum" | "moderado" | "intenso" | string;
  customNotes?: string;
}

export interface AvatarContextData {
  name?: string;
  age?: number | string;
  gender?: string;
  occupation?: string;
  income?: string;
  nighttimeWorry?: string;
  mainFrustration?: string;
  pastFailedAttempts?: string[];
  secretFear?: string;
  dreamResult?: string;
  statusGoal?: string;
  buyingObjections?: Array<{ objection: string; salesResponse?: string }>;
}

export interface ChapterSummary {
  number?: number;
  title: string;
  content?: string;
}

export interface ProjectSystemContext {
  productName: string;
  niche: string;
  targetAudience: string;
  description: string; // Grande promessa / O que o produto ensina
  tone?: string;
  extraDetails?: string;
  aiPersona?: AIPersonaSettings;
  avatar?: AvatarContextData;
  synopsis?: string;
  chapters?: Array<ChapterSummary | string>;
  pricing?: {
    originalPrice?: string;
    discountedPrice?: string;
    guaranteeDays?: string;
    expertName?: string;
    expertBio?: string;
  };
}

export type TaskType = 
  | "ebook" 
  | "salespage" 
  | "ad_copy" 
  | "ad_image" 
  | "avatar" 
  | "vsl" 
  | "cover" 
  | "general";

export class SystemContextBuilder {
  /**
   * Constrói a instrução de sistema (systemInstruction) definitiva e de alta fidelidade
   * para o modelo Gemini com base no contexto unificado do projeto.
   */
  public static build(context: Partial<ProjectSystemContext>, taskType: TaskType = "general"): string {
    const {
      productName = "Infoproduto Exclusivo",
      niche = "Marketing & Negócios",
      targetAudience = "Público Comprador Qualificado",
      description = "Método prático e transformador",
      tone = "Persuasivo e Emocional",
      extraDetails = "",
      aiPersona,
      avatar,
      synopsis,
      chapters,
      pricing
    } = context;

    // 1. Definição da Persona da IA
    const personaPreset = aiPersona?.preset || "Autoridade";
    const provocation = aiPersona?.provocationLevel ?? 3;
    const enthusiasm = aiPersona?.enthusiasmLevel ?? 4;
    const complexity = aiPersona?.complexityLevel ?? 3;
    const useAnalogies = aiPersona?.useAnalogies !== false;
    const emojiStyle = aiPersona?.useEmojiStyle || "moderado";
    const customNotes = aiPersona?.customNotes?.trim() || "";

    // 2. Extração de Capítulos / Estrutura
    let chaptersBlock = "";
    if (chapters && chapters.length > 0) {
      const chapterList = chapters.map((c, idx) => {
        if (typeof c === "string") return `  - Capítulo ${idx + 1}: ${c}`;
        return `  - Capítulo ${c.number || idx + 1}: "${c.title}"${c.content ? ` (Resumo: ${c.content.slice(0, 100)}...)` : ""}`;
      }).join("\n");
      chaptersBlock = `\n[ESTRUTURA DE CAPÍTULOS JÁ DEFINIDA]:\n${chapterList}`;
    }

    // 3. Extração de Dados Profundos do Avatar (se disponíveis)
    let avatarDeepBlock = "";
    if (avatar) {
      avatarDeepBlock = `
[AVATAR IDEAL & PERFIL DO COMPRADOR MAPEADO]:
- Nome / Perfil: ${avatar.name || "Avatar Comprador"}, ${avatar.age ? `${avatar.age} anos` : ""}, ${avatar.occupation || ""}
- Preocupação Noturna (2h da manhã): ${avatar.nighttimeWorry || "Falta de direcionamento e medo de fracassar"}
- Maior Frustração: ${avatar.mainFrustration || "Tentar sem método e gastar tempo/dinheiro sem retorno"}
- Tentativas Frustradas Anteriores: ${avatar.pastFailedAttempts?.join(", ") || "Métodos genéricos da internet"}
- Medo Oculto: ${avatar.secretFear || "Ficar para trás e nunca alcançar a independência"}
- Transformação / Desejo Máximo: ${avatar.dreamResult || description}
- Objeções Críticas a Quebrar: ${avatar.buyingObjections?.map(o => o.objection).join(" | ") || "Falta de tempo, medo de ser difícil"}
`;
    }

    // 4. Extração de Oferta & Precificação
    let offerBlock = "";
    if (pricing) {
      offerBlock = `
[DADOS DE OFERTA & PRECIFICAÇÃO]:
- Preço Cheio: ${pricing.originalPrice || "R$ 197,00"} | Preço Promocional: ${pricing.discountedPrice || "R$ 47,00"}
- Garantia: ${pricing.guaranteeDays ? `${pricing.guaranteeDays} dias` : "7 dias incondicionais"}
- Especialista: ${pricing.expertName || "Especialista"} ${pricing.expertBio ? `(${pricing.expertBio})` : ""}
`;
    }

    // 5. Diretrizes Específicas por Tipo de Tarefa
    let taskGuideline = "";
    switch (taskType) {
      case "ebook":
        taskGuideline = `
[DIRETRIZ DA ETAPA ATUAL: ESCRITA DO E-BOOK]:
- Você está redigindo o conteúdo textual didático do e-book.
- Entregue capítulos profundos, práticos e ricos em passo a passo acionável (sem enrolação, mas com substância real).
- Garanta que a introdução prenda a atenção imediatamente e que a conclusão inspire ação.
- Use exemplos realistas aplicados ao nicho "${niche}".`;
        break;

      case "salespage":
        taskGuideline = `
[DIRETRIZ DA ETAPA ATUAL: PÁGINA DE VENDAS DE ALTA CONVERSÃO]:
- Você está criando a copy comercial completa da landing page / página de vendas.
- Foque em copywriting direto (Direct Response), quebra de objeções imediatas, gatilhos de ancoragem, prova social e urgência legítima.
- A Headline deve ser impossível de ignorar e a promessa deve ser clara e irresistível.`;
        break;

      case "ad_copy":
        taskGuideline = `
[DIRETRIZ DA ETAPA ATUAL: CRIATIVOS E COPIES DE ANÚNCIO (AIDA + HEADLINE)]:
- Você está desenvolvendo o Kit Criativo Completo para anúncios (Meta Ads, TikTok e Google).
- Headline para Banner: Curta, magnética (6 a 12 palavras), direta ao ponto, sem aspas nem prefixos.
- Estrutura AIDA: Gancho nos primeiros 3 segundos, conexão visceral com a dor, desejo pelo método e CTA imperativo.`;
        break;

      case "avatar":
        taskGuideline = `
[DIRETRIZ DA ETAPA ATUAL: MAPEAMENTO DO AVATAR IDEAL]:
- Você está mapeando as dores viscerais, rotina, frustrações e gatilhos de compra do cliente mais lucrativo.
- Seja hiper-específico, realista e empático. Evite respostas vagas.`;
        break;

      case "vsl":
        taskGuideline = `
[DIRETRIZ DA ETAPA ATUAL: ROTEIRO DE VSL (VÍDEO DE VENDAS DE 5 MINUTOS)]:
- Você está criando um roteiro cinematográfico e persuasivo em 5 fases (Gancho, Problema, Solução, Oferta, CTA).
- O texto falado deve ser pausado, natural e envolvente, pronto para gravação em vídeo ou narração por IA.`;
        break;

      case "cover":
      case "ad_image":
        taskGuideline = `
[DIRETRIZ DA ETAPA ATUAL: DIREÇÃO DE ARTE VISUAL]:
- Você está definindo o conceito visual de alto valor percebido e estética premium condizente com o nicho "${niche}".`;
        break;

      default:
        taskGuideline = `
[DIRETRIZ GERAL]:
- Gere respostas precisas, altamente persuasivas e alinhadas 100% à proposta de valor do infoproduto.`;
    }

    // 6. Montagem da System Instruction Unificada
    return `Você é o Diretor de Criação & Estrategista Master da Fábrica de Infoprodutos (Infinity Million OS).
Sua responsabilidade máxima é criar artefatos de marketing e infoprodutos de altíssimo padrão, mantendo absoluta coerência narrativa, estratégica e de persona em todas as etapas da esteira.

=============================================================================
MATRIZ FUNDACIONAL UNIFICADA DO PROJETO (CONTEXTO COMPLETO)
=============================================================================
- NOME DO PRODUTO: "${productName}"
- NICHO DE MERCADO: "${niche}"
- PÚBLICO-ALVO DECLARADO: "${targetAudience}"
- GRANDE PROMESSA / CONTEÚDO CENTRAL: "${description}"
- TOM DE VOZ BASE: "${tone}"
${extraDetails ? `- INFORMAÇÕES EXTRAS: "${extraDetails}"` : ""}
${synopsis ? `- SINOPSE ATUAL: "${synopsis}"` : ""}
${chaptersBlock}
${avatarDeepBlock}
${offerBlock}

=============================================================================
CALIBRAGEM DA PERSONA E ESTILO DE ESCRITA DA IA
=============================================================================
- Preset de Posicionamento: ${personaPreset.toUpperCase()}
- Nível de Provocação (1 a 5): ${provocation}/5 ${provocation >= 4 ? "(Forte, desafiador, quebra crenças limitantes sem rodeios)" : "(Equilibrado e encorajador)"}
- Nível de Entusiasmo (1 a 5): ${enthusiasm}/5 ${enthusiasm >= 4 ? "(Alta energia, vibrante, motivador)" : "(Sóbrio, focado em clareza)"}
- Nível de Complexidade Técnica (1 a 5): ${complexity}/5 ${complexity <= 2 ? "(Linguagem extremamente simples e acessível)" : complexity >= 4 ? "(Terminologia avançada e aprofundada)" : "(Didático e equilibrado)"}
- Uso de Analogias do Cotidiano: ${useAnalogies ? "SIM (Use metáforas e analogias práticas para ilustrar conceitos difíceis)" : "NÃO (Seja direto e literal)"}
- Densidade de Emojis: ${emojiStyle.toUpperCase()}
${customNotes ? `- DIRETRIZES PERSONALIZADAS DO USUÁRIO: "${customNotes}"` : ""}

=============================================================================
LEIS INVIOLÁVEIS DE CONSISTÊNCIA MULTI-ETAPAS
=============================================================================
1. LEI DA VERDADE ÚNICA: O que for prometido na copy e no anúncio DEVE ser exatamente o que o e-book entrega e a página de vendas sustenta. Nunca invente dados conflitantes com o nicho "${niche}" ou a promessa "${description}".
2. LEI DA ESPECIFICIDADE: Fale diretamente com o público "${targetAudience}". Use termos, dores e aspirações autênticas desse segmento.
3. LEI DO VALOR ACIONÁVEL: Fuja de clichês genéricos e lugares-comuns. Entregue soluções claras, estruturas lógicas e gatilhos de alta conversão.
4. LEI DO IDIOMA: Todo o conteúdo gerado DEVE ser em Português do Brasil (pt-BR) impecável, natural e persuasivo.
${taskGuideline}
`;
  }
}
