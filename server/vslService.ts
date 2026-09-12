import { GeminiCache } from "./geminiCache";
import { SystemContextBuilder, AIPersonaSettings, AvatarContextData } from "./systemContextBuilder";
import { generateTextWithResilience, cleanJsonString } from "./geminiClient";

export interface VslToolRecommendation {
  name: string;
  category: "Voz com IA" | "Edição e Legendas" | "Avatar IA" | "Design de Slides" | "Teleprompter Grátis";
  description: string;
  url: string;
  badge: string;
  isFreeOrFreemium: boolean;
}

export interface VslScene {
  sceneNumber: number;
  phase: "1. GANCHO (0s-30s)" | "2. A DOR & PROBLEMA (30s-2m)" | "3. SOLUÇÃO & REVELAÇÃO (2m-3m)" | "4. O E-BOOK & OFERTA (3m-4m)" | "5. CHAMADA PRA AÇÃO - CTA (4m-5m)";
  spokenText: string;
  visualDirections: string;
  audioNotes: string;
}

export interface VslData {
  headline: string;
  estimatedDuration: string;
  wordCount: number;
  targetTone: string;
  scenes: VslScene[];
  teleprompterText: string;
  recommendedTools: VslToolRecommendation[];
  isFallback?: boolean;
}

function cleanJson(raw: string): string {
  if (!raw) return "{}";
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
  return cleaned.trim();
}

export class VslGenerationService {
  public static async generateVsl(
    productName: string,
    niche: string,
    description: string,
    targetAudience: string,
    price: string = "R$ 47,00",
    chapters?: string[],
    forceRefresh = false,
    aiPersona?: AIPersonaSettings,
    avatar?: AvatarContextData,
    tone?: string,
    customSystemInstruction?: string
  ): Promise<VslData> {
    console.log(`[VslService] Gerando Roteiro de VSL Magnética para: "${productName}" (${niche})`);

    const cacheKey = GeminiCache.generateKey("vsl_script", {
      productName,
      niche,
      description,
      targetAudience,
      price,
      aiPersona,
      avatar,
      tone,
      customSystemInstruction
    });

    if (!forceRefresh) {
      const cached = GeminiCache.get<VslData>(cacheKey);
      if (cached) {
        console.log("[GeminiCache] Retornando Roteiro VSL do cache.");
        return cached;
      }
    }

    const systemInstruction = customSystemInstruction || SystemContextBuilder.build({
      productName,
      niche,
      description,
      targetAudience,
      tone: tone || "Persuasivo e Emocional",
      chapters,
      aiPersona,
      avatar,
      pricing: {
        discountedPrice: price
      }
    }, "vsl");

    const chaptersContext = chapters && chapters.length > 0
      ? `Capítulos do e-book: ${chapters.join(", ")}.`
      : "";

    const prompt = `
      Com base na diretriz de sistema: crie o ROTEIRO COMPLETO DE VSL DE 5 MINUTOS pronto para gravar ou usar em voz sintética.
      - Preço da Oferta: "${price}"
      ${chaptersContext}

      Sua resposta DEVE SER um JSON estrito com o seguinte formato:

      - headline: A frase inicial de impacto do vídeo (Gatilho de atenção em 3 segundos)
      - estimatedDuration: Duração estimada (ex: "4 a 5 minutos")
      - wordCount: Número aproximado de palavras da copy falada (ex: 550)
      - targetTone: O tom ideal da locução (ex: "Empático, urgente e entusiasmado")
      - scenes: Array de objetos representando a sequência lógica do vídeo de vendas:
        - sceneNumber: número ordinal de 1 a 5
        - phase: Uma das 5 fases obrigatórias:
          1. "1. GANCHO (0s-30s)"
          2. "2. A DOR & PROBLEMA (30s-2m)"
          3. "3. SOLUÇÃO & REVELAÇÃO (2m-3m)"
          4. "4. O E-BOOK & OFERTA (3m-4m)"
          5. "5. CHAMADA PRA AÇÃO - CTA (4m-5m)"
        - spokenText: O texto EXATO que a pessoa vai ler ou que será enviado para a IA de voz (ElevenLabs). O texto deve ser natural, pausado e altamente persuasivo.
        - visualDirections: Instruções visuais de tela (ex: "Mostrar texto branco com fundo preto", "Cena B-roll de pessoa frustrada olhando para o computador", "Animação de check-mark no bônus")
        - audioNotes: Instruções de som e tom (ex: "Música de suspense baixa no fundo", "Acelerar levemente o tom", "Pausa dramática de 2 segundos")

      - teleprompterText: Todo o texto falado unificado e formatado em parágrafos limpos com quebras de linha duplas para leitura rápida no Teleprompter.

      - recommendedTools: Array fixo de 5 ferramentas recomendadas (ElevenLabs, CapCut, HeyGen, Canva, Loom) com descrições detalhadas de como usar de forma simples.

      Escreva um roteiro altamente persuasivo, empático e focado na conversão imediata do espectador em comprador do e-book.
    `;

    try {
      const response = await generateTextWithResilience({
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              headline: { type: "STRING" },
              estimatedDuration: { type: "STRING" },
              wordCount: { type: "INTEGER" },
              targetTone: { type: "STRING" },
              scenes: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    sceneNumber: { type: "INTEGER" },
                    phase: { type: "STRING" },
                    spokenText: { type: "STRING" },
                    visualDirections: { type: "STRING" },
                    audioNotes: { type: "STRING" }
                  },
                  required: ["sceneNumber", "phase", "spokenText", "visualDirections", "audioNotes"]
                }
              },
              teleprompterText: { type: "STRING" }
            },
            required: ["headline", "estimatedDuration", "wordCount", "targetTone", "scenes", "teleprompterText"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("O Gemini não retornou resposta para a VSL.");
      }

      const parsed = JSON.parse(cleanJsonString(text));

      const tools: VslToolRecommendation[] = [
        {
          name: "ElevenLabs",
          category: "Voz com IA",
          description: "Gere a locução ultra-realista do roteiro em segundos sem precisar usar sua própria voz. Escolha vozes em português com entonação humana natural.",
          url: "https://elevenlabs.io",
          badge: "Recomendado #1",
          isFreeOrFreemium: true
        },
        {
          name: "CapCut (Desktop / Web / Celular)",
          category: "Edição e Legendas",
          description: "Crie a VSL no estilo 'VSL Dinâmica': adicione legendas automáticas chamativas, cortes rápidos e vídeos de fundo (B-rolls) gratuitos.",
          url: "https://www.capcut.com",
          badge: "Grátis & Fácil",
          isFreeOrFreemium: true
        },
        {
          name: "HeyGen / Vidnoz",
          category: "Avatar IA",
          description: "Transforme o roteiro em um vídeo com um apresentador gerado por IA que fala e gesticula de forma natural se preferir não aparecer.",
          url: "https://www.heygen.com",
          badge: "Apresentador IA",
          isFreeOrFreemium: true
        },
        {
          name: "Canva Pro / Slides",
          category: "Design de Slides",
          description: "Crie os slides de fundo simples (fundo escuro + texto branco/amarelo em destaque) para gravar no formato VSL de alta retenção.",
          url: "https://www.canva.com",
          badge: "Slides Prontos",
          isFreeOrFreemium: true
        },
        {
          name: "CuePrompter / Teleprompter.com",
          category: "Teleprompter Grátis",
          description: "Cole a copy do roteiro para ler na tela do celular ou computador olhando direto para a câmera enquanto grava de primeira.",
          url: "https://www.cueprompter.com",
          badge: "Leitura Fácil",
          isFreeOrFreemium: true
        }
      ];

      const result: VslData = {
        headline: parsed.headline,
        estimatedDuration: parsed.estimatedDuration || "4 a 5 minutos",
        wordCount: parsed.wordCount || 500,
        targetTone: parsed.targetTone || "Confiante e empático",
        scenes: parsed.scenes,
        teleprompterText: parsed.teleprompterText,
        recommendedTools: tools,
        isFallback: false
      };

      GeminiCache.set(cacheKey, result);
      return result;

    } catch (err: any) {
      console.error("[VslService] Erro ao gerar VSL com Gemini:", err);

      // Return structured fallback
      const fallbackTools: VslToolRecommendation[] = [
        {
          name: "ElevenLabs",
          category: "Voz com IA",
          description: "Gere a locução ultra-realista do roteiro em segundos sem precisar usar sua própria voz.",
          url: "https://elevenlabs.io",
          badge: "Recomendado #1",
          isFreeOrFreemium: true
        },
        {
          name: "CapCut",
          category: "Edição e Legendas",
          description: "Crie a VSL com legendas automáticas dinâmicas e efeitos de transição simples.",
          url: "https://www.capcut.com",
          badge: "Grátis & Fácil",
          isFreeOrFreemium: true
        },
        {
          name: "Canva",
          category: "Design de Slides",
          description: "Crie slides em formato 16:9 com frases destacadas em amarelo/branco em fundo preto.",
          url: "https://www.canva.com",
          badge: "Slides Prontos",
          isFreeOrFreemium: true
        }
      ];

      return {
        headline: `Se você quer dominar ${niche || "seu mercado"} sem perder tempo com promessas vazias, pare tudo o que está fazendo e assista a este vídeo de 3 minutos!`,
        estimatedDuration: "4 minutos",
        wordCount: 480,
        targetTone: "Empático, urgente, focado na solução",
        scenes: [
          {
            sceneNumber: 1,
            phase: "1. GANCHO (0s-30s)",
            spokenText: `Se você está cansado de tentar aprender ${niche} e sentir que está estagnado enquanto outras pessoas avançam, este vídeo rápido de 4 minutos vai mudar completamente o seu jogo. O que eu vou te revelar aqui é o passo a passo direto para conquistar resultados sem complicação.`,
            visualDirections: "Texto grande em amarelo sobre fundo preto escuro. Transição rápida com som de 'Whoosh'.",
            audioNotes: "Música de suspense leve ao fundo. Tom de voz firme e curioso."
          },
          {
            sceneNumber: 2,
            phase: "2. A DOR & PROBLEMA (30s-2m)",
            spokenText: `Eu sei exatamente como é estar na sua pele. Você gasta horas pesquisando tutoriais soltos na internet, tenta seguir conselhos desconexos e no final só sente mais ansiedade e perda de tempo. O verdadeiro problema não é a sua falta de capacidade, mas sim a ausência de um método estruturado sem enrolação.`,
            visualDirections: "Imagens rápidas B-roll de alguém pesquisando no computador à noite com ar cansado. Destaque em vermelho nas palavras 'Falta de Método'.",
            audioNotes: "Tom empático e acolhedor. Reduzir levemente a velocidade das palavras."
          },
          {
            sceneNumber: 3,
            phase: "3. SOLUÇÃO & REVELAÇÃO (2m-3m)",
            spokenText: `Foi exatamente para resolver isso que eu estruturei o e-book "${productName}". Ele é o mapa definitivo com tudo o que você precisa aplicar imediatamente, separado capítulo por capítulo para você obter clareza total desde o primeiro dia.`,
            visualDirections: "Animação 3D do e-book em alta resolução girando com brilho verde nas bordas.",
            audioNotes: "Aumentar a energia e o entusiasmo na voz. Trilha sonora muda para algo inspirador."
          },
          {
            sceneNumber: 4,
            phase: "4. O E-BOOK & OFERTA (3m-4m)",
            spokenText: `Ao garantir a sua cópia hoje, você não leva apenas o livro digital completo. Você também garante bônus exclusivos preparados especialmente para acelerar a sua aplicação prática, tudo isso com garantia incondicional de 7 dias!`,
            visualDirections: "Mostrar checklist de bônus na tela com tiques verdes marcando um por um. Mostrar selo de garantia de 7 dias.",
            audioNotes: "Tom de oportunidade imperdível e clareza total."
          },
          {
            sceneNumber: 5,
            phase: "5. CHAMADA PRA AÇÃO - CTA (4m-5m)",
            spokenText: `Não deixe para depois a transformação que você pode começar hoje. Clique no botão verde abaixo desta página, garanta seu acesso imediato ao e-book "${productName}" por apenas ${price} e nos vemos dentro do material!`,
            visualDirections: "Seta vermelha gigante apontando para o botão de compra verde piscando 'Garantir Acesso Com Desconto'.",
            audioNotes: "Tom de encerramento urgente e motivacional. Transição de áudio final."
          }
        ],
        teleprompterText: `Se você está cansado de tentar aprender ${niche} e sentir que está estagnado enquanto outras pessoas avançam, este vídeo rápido de 4 minutos vai mudar completamente o seu jogo.\n\nEu sei exatamente como é estar na sua pele. Você gasta horas pesquisando tutoriais soltos na internet, tenta seguir conselhos desconexos e no final só sente mais ansiedade e perda de tempo.\n\nFoi exatamente para resolver isso que eu estruturei o e-book "${productName}". Ele é o mapa definitivo com tudo o que você precisa aplicar imediatamente.\n\nAo garantir a sua cópia hoje por apenas ${price}, você também garante bônus exclusivos com 7 dias de garantia incondicional.\n\nClique no botão verde abaixo e garanta seu acesso imediato!`,
        recommendedTools: fallbackTools,
        isFallback: true
      };
    }
  }
}
