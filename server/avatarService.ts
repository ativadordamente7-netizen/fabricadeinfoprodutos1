import { GeminiCache } from "./geminiCache";
import { SystemContextBuilder, AIPersonaSettings } from "./systemContextBuilder";
import { generateTextWithResilience, cleanJsonString } from "./geminiClient";

export interface AvatarData {
  demographics: {
    name: string;
    age: number;
    gender: string;
    occupation: string;
    income: string;
    maritalStatus: string;
    location: string;
    education: string;
    avatarQuote: string;
  };
  painsAndFrustrations: {
    nighttimeWorry: string;
    mainFrustration: string;
    pastFailedAttempts: string[];
    secretFear: string;
  };
  desiresAndGoals: {
    dreamResult: string;
    statusGoal: string;
    dailyRoutineAfterEbook: string;
  };
  buyingObjections: {
    objection: string;
    salesResponse: string;
  }[];
  marketingChannelsAndTriggers: {
    favoritePlatforms: string[];
    buyingTriggers: string[];
    toneOfVoice: string;
    keywordsThatHook: string[];
  };
  directPitchScript: {
    whatsappHook: string;
    salesPageHeadline: string;
  };
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

export class AvatarGenerationService {
  public static async generateAvatar(
    productName: string,
    niche: string,
    description: string,
    targetAudience: string,
    ebookChapters?: string[],
    forceRefresh = false,
    aiPersona?: AIPersonaSettings,
    tone?: string,
    customSystemInstruction?: string
  ): Promise<AvatarData> {
    console.log(`[AvatarService] Mapeando Avatar Ideal para: "${productName}" (${niche})`);

    const cacheKey = GeminiCache.generateKey("ideal_avatar", {
      productName,
      niche,
      description,
      targetAudience,
      chaptersCount: ebookChapters?.length || 0,
      aiPersona,
      tone,
      customSystemInstruction
    });

    if (!forceRefresh) {
      const cached = GeminiCache.get<AvatarData>(cacheKey);
      if (cached) {
        console.log("[GeminiCache] Retornando Avatar Ideal do cache.");
        return cached;
      }
    }

    const systemInstruction = customSystemInstruction || SystemContextBuilder.build({
      productName,
      niche,
      description,
      targetAudience,
      tone: tone || "Persuasivo e Emocional",
      chapters: ebookChapters,
      aiPersona
    }, "avatar");

    const chaptersText = ebookChapters && ebookChapters.length > 0 
      ? `Capítulos do E-book: ${ebookChapters.join("; ")}`
      : "";

    const prompt = `
      Com base na diretriz de sistema: crie o perfil hiper-detalhado, realista e estratégico do AVATAR IDEAL para o infoproduto.
      ${chaptersText}

      INSTRUÇÕES DE RESPOSTA:
      Gere uma ficha didática, humana, envolvente e extremamente estratégica em português do Brasil no formato JSON estrito com a seguinte estrutura:

      - demographics:
        - name: Um nome realista e brasileiro para a pessoa fictícia (ex: "Juliana Mendes", "Marcos Oliveira")
        - age: Número da idade exata ideal (ex: 34)
        - gender: Gênero predominante (ex: "Feminino", "Masculino" ou "Ambos / Maioria Feminina")
        - occupation: Profissão atual realista
        - income: Faixa salarial / renda mensal estimada (ex: "R$ 3.500 a R$ 7.000 / mês")
        - maritalStatus: Estado civil e família (ex: "Casada(o), 1 filho")
        - location: Onde mora no Brasil (ex: "Cidades de médio a grande porte / Região Sudeste")
        - education: Nível de escolaridade
        - avatarQuote: Uma frase marcante entre aspas que esse avatar diria sobre sua maior angústia (ex: "Tentei de tudo e me sinto estagnado...")

      - painsAndFrustrations:
        - nighttimeWorry: O pensamento específico que tira o sono dele às 2h da manhã
        - mainFrustration: A maior frustração do dia a dia ao tentar resolver o problema sozinho
        - pastFailedAttempts: Array com 3 tentativas anteriores frustradas (ex: cursos genéricos, receitas de bolo, promessas vazias)
        - secretFear: Um medo profundo que ele tem vergonha de confessar para os outros

      - desiresAndGoals:
        - dreamResult: A transformação final desejada que o e-book proporciona
        - statusGoal: Como ele deseja ser reconhecido pelos amigos, família ou colegas
        - dailyRoutineAfterEbook: Descrição inspiradora de como fica a rotina dele após aplicar o e-book

      - buyingObjections: Array de 3 objetos { objection, salesResponse }, mapeando a dúvida de compra e a quebra de objeção matadora
        (Objeções clássicas: "Não tenho tempo", "Será que funciona pra mim?", "Já tentei outras coisas e não deu certo")

      - marketingChannelsAndTriggers:
        - favoritePlatforms: Array de 3 redes/canais que ele mais usa (ex: "Instagram (Reels/Stories)", "WhatsApp", "YouTube")
        - buyingTriggers: Array de 3 gatilhos mentais que o fazem comprar na hora (ex: "Prova social de pessoas como ele", "Escassez de bônus", "Garantia incondicional")
        - toneOfVoice: O tom exato de comunicação que gera conexão imediata
        - keywordsThatHook: Array de 4 palavras-chave/expressões que 'pescam' a atenção dele no primeiro segundo do anúncio

      - directPitchScript:
        - whatsappHook: Script curto e matador de 3 linhas para converter este avatar no WhatsApp ou Direct
        - salesPageHeadline: A headline de página de vendas perfeita desenhada sob medida para este avatar

      Seja extremamente específico e fuja de generalidades.
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
              demographics: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  age: { type: "INTEGER" },
                  gender: { type: "STRING" },
                  occupation: { type: "STRING" },
                  income: { type: "STRING" },
                  maritalStatus: { type: "STRING" },
                  location: { type: "STRING" },
                  education: { type: "STRING" },
                  avatarQuote: { type: "STRING" }
                },
                required: ["name", "age", "gender", "occupation", "income", "maritalStatus", "location", "education", "avatarQuote"]
              },
              painsAndFrustrations: {
                type: "OBJECT",
                properties: {
                  nighttimeWorry: { type: "STRING" },
                  mainFrustration: { type: "STRING" },
                  pastFailedAttempts: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                  },
                  secretFear: { type: "STRING" }
                },
                required: ["nighttimeWorry", "mainFrustration", "pastFailedAttempts", "secretFear"]
              },
              desiresAndGoals: {
                type: "OBJECT",
                properties: {
                  dreamResult: { type: "STRING" },
                  statusGoal: { type: "STRING" },
                  dailyRoutineAfterEbook: { type: "STRING" }
                },
                required: ["dreamResult", "statusGoal", "dailyRoutineAfterEbook"]
              },
              buyingObjections: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    objection: { type: "STRING" },
                    salesResponse: { type: "STRING" }
                  },
                  required: ["objection", "salesResponse"]
                }
              },
              marketingChannelsAndTriggers: {
                type: "OBJECT",
                properties: {
                  favoritePlatforms: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                  },
                  buyingTriggers: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                  },
                  toneOfVoice: { type: "STRING" },
                  keywordsThatHook: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                  }
                },
                required: ["favoritePlatforms", "buyingTriggers", "toneOfVoice", "keywordsThatHook"]
              },
              directPitchScript: {
                type: "OBJECT",
                properties: {
                  whatsappHook: { type: "STRING" },
                  salesPageHeadline: { type: "STRING" }
                },
                required: ["whatsappHook", "salesPageHeadline"]
              }
            },
            required: [
              "demographics",
              "painsAndFrustrations",
              "desiresAndGoals",
              "buyingObjections",
              "marketingChannelsAndTriggers",
              "directPitchScript"
            ]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("O Gemini não retornou conteúdo para o avatar.");
      }

      const avatarData: AvatarData = JSON.parse(cleanJsonString(text));
      avatarData.isFallback = false;

      GeminiCache.set(cacheKey, avatarData);
      return avatarData;

    } catch (err: any) {
      console.error("[AvatarService] Erro ao gerar Avatar com Gemini:", err);

      // Robust fallback avatar
      const fallback: AvatarData = {
        demographics: {
          name: "Camila Fernandes",
          age: 32,
          gender: "Feminino / Geral",
          occupation: "Profissional em Transição / Autônoma",
          income: "R$ 3.500 a R$ 6.500 / mês",
          maritalStatus: "Casada, 1 filho",
          location: "Região Metropolitana",
          education: "Ensino Superior Cursando ou Completo",
          avatarQuote: `Sinto que preciso mudar minha realidade para o ${niche || "meu mercado"}, mas perco horas sem saber por onde começar.`
        },
        painsAndFrustrations: {
          nighttimeWorry: `A sensação de que está ficando para trás enquanto outras pessoas alcançam resultados rapidamente no nicho de ${niche}.`,
          mainFrustration: "Excesso de informações dispersas na internet sem um método passo a passo estruturado.",
          pastFailedAttempts: [
            "Vídeos soltos no YouTube sem sequência lógica",
            "Cursos caros que focavam em teoria e não na prática rápida",
            "Tentar implementar métodos complexos sozinha sem acompanhamento"
          ],
          secretFear: "Investir tempo e dinheiro e descobrir que não leva a lugar nenhum."
        },
        desiresAndGoals: {
          dreamResult: `Conquistar clareza, previsibilidade e resultados práticos usando o e-book "${productName}".`,
          statusGoal: "Ser respeitada pela família e amigos como referência de sucesso e determinação.",
          dailyRoutineAfterEbook: "Acordar com um plano de ação diário claro, executando com confiança e sem ansiedade."
        },
        buyingObjections: [
          {
            objection: "Será que esse e-book realmente funciona para o meu caso?",
            salesResponse: "O método foi desenhado de forma didática com exemplos reais, permitindo aplicação imediata mesmo para quem está começando do zero."
          },
          {
            objection: "Não tenho muito tempo livre no dia.",
            salesResponse: "O e-book é direto ao ponto, sem enrolação. Você pode ler em poucas horas e aplicar em blocos de apenas 20 minutos diários."
          },
          {
            objection: "E se eu não gostar do conteúdo?",
            salesResponse: "Você conta com garantia incondicional de 7 dias: se achar que o material não entregou valor, devolvemos 100% do seu investimento."
          }
        ],
        marketingChannelsAndTriggers: {
          favoritePlatforms: ["Instagram (Stories e Reels)", "WhatsApp", "YouTube"],
          buyingTriggers: [
            "Prova prática e clareza da solução",
            "Sensação de método direto e simples",
            "Garantia de satisfação e preço acessível"
          ],
          toneOfVoice: "Acolhedor, direto, pragmático e focado na ação rápida.",
          keywordsThatHook: ["Passo a Passo", "Sem Enrolação", "Método Prático", "Resultado Real"]
        },
        directPitchScript: {
          whatsappHook: `Oi! Se você quer simplificar o aprendizado em ${niche} e ir direto ao que funciona, o e-book "${productName}" foi feito exatamente pra você. Quer dar uma olhada na amostra?`,
          salesPageHeadline: `Descubra o Caminho Exato para Dominar ${niche} Sem Perder Tempo com Métodos Complicados!`
        },
        isFallback: true
      };

      return fallback;
    }
  }
}
