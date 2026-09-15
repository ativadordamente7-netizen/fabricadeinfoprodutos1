import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { apiRouter, handleKiwifyWebhook, authenticateSession } from "./server/routes";
import { db } from "./server/db";
import { GeminiCache } from "./server/geminiCache";
import { SystemContextBuilder } from "./server/systemContextBuilder";
import { generateTextWithResilience, cleanJsonString } from "./server/geminiClient";

dotenv.config();

const app = express();
const PORT = 3000;

// Security & Performance Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.json({ limit: "10mb" }));

// Public Kiwify Webhook Endpoint
app.post("/functions/v1/kiwify-webhook", handleKiwifyWebhook);

// Serve the optimized background image via redirection
app.get("/background.webp", (req, res) => {
  res.redirect("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80");
});

// Mount all Auth, Admin and Projects API routes
app.use("/api", apiRouter);
app.use(apiRouter);

// Initialize GoogleGenAI client lazily with server key and telemetry header
let aiInstance: GoogleGenAI | null = null;

function getGoogleGenAIClient(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("[Gemini] GEMINI_API_KEY is missing. High-fidelity local fallback content will be used if Gemini call is attempted.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key || "dummy_key",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

export { cleanJsonString };

// Robust content generation with retries and model fallbacks (handles 503 high demand seamlessly)
async function generateContentWithRetryAndFallback(options: {
  contents: string;
  config: any;
}) {
  return await generateTextWithResilience({
    contents: options.contents,
    config: options.config,
    cacheKeyPrefix: "generate_content",
    cachePayload: { contents: options.contents, config: options.config }
  });
}

// High-fidelity fallback content generator to handle API rate limiting / quota constraints gracefully
function generateLocalFallbackContent(
  type: string,
  productName: string,
  niche: string,
  targetAudience: string,
  tone: string,
  description: string,
  extraDetails: string
) {
  if (type === "ebook") {
    return {
      title: productName,
      subtitle: `O Guia Definitivo: Como dominar ${niche} integrando os pilares mental, emocional e espiritual com tarefas práticas`,
      synopsis: `Bem-vindo a uma jornada de transformação real no nicho de ${niche}. Este e-book foi desenvolvido especificamente para ${targetAudience} que desejam superar barreiras, dominar ${description} e colher conquistas marcantes. Diferente de materiais superficiais, cada capítulo deste livro foi estruturado sobre 4 pilares inegociáveis: a Dimensão Mental (quebrando crenças e trazendo clareza), a Dimensão Emocional (autodomínio e inteligência emocional), a Dimensão Espiritual (propósito maior e força interior) e um Plano de Tarefas Práticas imediatas para execução no mundo real. Prepare-se para vivenciar uma transformação completa.`,
      chapters: [
        {
          number: 1,
          title: `Fundamentos & Mentalidade Transformadora em ${niche}`,
          content: `[Visão Geral do Capítulo]
Para obter sucesso sustentável com o método ${productName}, o primeiro passo essencial é alinhar a sua visão com a realidade prática do nicho de ${niche}. Muitos iniciantes e profissionais de ${targetAudience} falham não por falta de vontade, mas por tentarem aplicar técnicas avançadas sobre alicerces mentais frágeis e desordenados.

[🧠 Dimensão Mental: Clareza & Reprogramação de Crenças]
A maior crença limitante que sabota ${targetAudience} é acreditar que o resultado em ${niche} depende de sorte, genialidade inata ou sacrifício desumano. A reprogramação cognitiva começa ao entender que o método ${productName} simplifica o que outros complicam. Ao focar estrategicamente em ${description}, você substitui a confusão mental por modelos mentais objetivos e comprovados. Estabeleça clareza absoluta sobre suas metas e decida eliminar as distrações que roubam o seu foco diário.

[❤️ Dimensão Emocional: Autodomínio & Gestão de Medos e Ansiedade]
A ansiedade por resultados rápidos e o medo de falhar ou ser julgado são os maiores gatilhos de paralisia em ${niche}. O autodomínio emocional não significa ausência de medo, mas a decisão consciente de agir apesar dele. Cultive a paciência estratégica: compreenda que momentos de instabilidade são temporários e fazem parte do aprendizado. Blinde sua mente contra a comparação tóxica com terceiros e foque na sua própria evolução diária.

[✨ Dimensão Espiritual: Propósito Maior & Força Interior]
Qualquer conquista técnica torna-se vazia se não estiver ancorada em um sentido de vida profundo e em valores éticos inabaláveis. Por que você deseja vencer em ${niche}? Conecte seu objetivo a um propósito transcendente: o bem-estar da sua família, o legado que você deixará e o impacto positivo que seu conhecimento trará a outras vidas. Essa conexão espiritual fornece a força interior necessária para perseverar com fé e dignidade nos dias mais difíceis.

[📋 Tarefas Práticas & Plano de Ação do Nicho]
• Tarefa 1: Diagnóstico de Crenças no Nicho — Escreva em um caderno as 2 maiores dúvidas ou inseguranças que você sente em relação a ${productName} e reescreva-as como compromissos afirmativos de aprendizado.
• Tarefa 2: Auditoria de Hábitos e Eliminação de Distrações — Identifique 1 hábito improdutivo que consome seu tempo em ${niche} e substitua-o por 30 minutos de estudo e aplicação focada de ${description}.
• Tarefa 3: Desafio Prático do Dia — Aplique o conceito central deste capítulo realizando uma primeira ação real no seu projeto de ${niche}, documentando o aprendizado obtido.`
        },
        {
          number: 2,
          title: `A Estratégia Prática de ${productName} em Execução`,
          content: `[Visão Geral do Capítulo]
Com a mente alinhada e as emoções sob controle, avançamos para o núcleo operacional do método ${productName}. Neste capítulo, desdobramos a mecânica exata de ${description} em processos didáticos desenhados sob medida para a rotina de ${targetAudience}.

[🧠 Dimensão Mental: Foco Estratégico & Desconstrução da Complexidade]
A excelência em ${niche} reside na simplificação. Pessoas amadoras tentam fazer dez coisas medianas ao mesmo tempo; mestres dominam poucas etapas essenciais com perfeição cirúrgica. Adote o modelo mental do Princípio de Pareto (80/20): identifique quais 20% das ações práticas geram 80% do retorno em ${niche}. Elimine etapas desnecessárias e concentre toda a sua energia cognitiva na execução impecável do método ${productName}.

[❤️ Dimensão Emocional: Superando a Sobrecarga & Construindo Autoconfiança]
Ao encarar novos desafios operacionais, a sensação de sobrecarga pode tentar se instalar. A autoconfiança não nasce pronta; ela é construída tijolo por tijolo a cada pequena vitória executada. Quando sentir o peso da tarefa, respire fundo, divida o problema em micro-passos e celebre cada avanço. A serenidade na execução transforma o trabalho pesado em fluxo produtivo e prazeroso.

[✨ Dimensão Espiritual: Alinhamento de Valores & Integridade na Execução]
O modo como você executa seu trabalho é um reflexo do seu caráter. No nicho de ${niche}, a tentação de pegar atalhos duvidosos ou fazer promessas exageradas é constante. Mantenha-se fiel à verdade e à honestidade incondicional. Quando suas ações práticas estão alinhadas com princípios de integridade, seu método ganha autoridade natural e respeito duradouro de quem acompanha sua jornada.

[📋 Tarefas Práticas & Plano de Ação do Nicho]
• Tarefa 1: Mapeamento do Fluxo Operacional — Desenhe em um esquema visual o passo a passo exato que você precisa seguir para colocar em prática ${description}.
• Tarefa 2: Aplicação do Pilar Técnico — Execute a primeira fase da estratégia de ${productName} utilizando as recomendações detalhadas deste capítulo (${extraDetails || "entrega de alta qualidade e didática simples"}).
• Tarefa 3: Check-in de Integridade e Qualidade — Revise o trabalho realizado garantindo que ele cumpre rigorosamente os padrões de excelência ética e valor real para o seu público em ${niche}.`
        },
        {
          number: 3,
          title: `Blindagem contra Falhas e Superação de Obstáculos em ${niche}`,
          content: `[Visão Geral do Capítulo]
Em qualquer jornada transformadora, os desafios são inevitáveis. A diferença entre quem atinge o topo e quem desiste pelo caminho não é a ausência de problemas, mas a capacidade de antecipar armadilhas e reagir com maturidade e resiliência estratégica.

[🧠 Dimensão Mental: Resolução Cognitiva de Problemas & Antecipação de Erros]
O erro clássico número um de ${targetAudience} é tentar pular etapas fundamentais de ${description}. O modelo mental da mentalidade analítica ensina a encarar os erros não como fracassos definitivos, mas como dados valiosos de ajuste. Quando algo não sair como esperado em ${niche}, pergunte-se: "O que esse resultado está me ensinando? Qual ajuste de processo evitará que isso ocorra novamente?" Esse filtro mental elimina a frustração e acelera a maestria.

[❤️ Dimensão Emocional: Gestão da Frustração & Blindagem contra a Autossabotagem]
A frustração é um veneno que paralisa quando não é gerida com inteligência emocional. A voz interna da autossabotagem costuma sussurrar: "Você não leva jeito para isso" ou "É tarde demais para começar em ${niche}". Reconheça essas narrativas como ilusões passageiras. Desenvolva autocompaixão ativa: trate a si mesmo como trataria um grande amigo em processo de evolução. Acolha suas limitações momentâneas e volte para o campo de batalha com postura firme.

[✨ Dimensão Espiritual: Resiliência da Alma, Fé no Processo & Paz Interior]
A verdadeira resiliência nasce de uma paz interior que não depende de circunstâncias externas favoráveis. Ter fé no processo significa manter a convicção serena de que cada obstáculo superado em ${niche} está forjando a sua sabedoria e o seu caráter. Nos dias cinzentos, conecte-se com o silêncio, renove sua gratidão pelas oportunidades da vida e lembre-se de que tempestades sempre passam e o sol volta a brilhar para quem permanece de pé.

[📋 Tarefas Práticas & Plano de Ação do Nicho]
• Tarefa 1: Matriz de Antecipação de Riscos — Liste os 3 maiores obstáculos que podem surgir na aplicação de ${productName} e crie com antecedência um plano de contingência para cada um.
• Tarefa 2: Exercício de Regulação Emocional — Pratique 5 minutos de respiração diafragmática consciente e repita mentalmente a sua intenção de perseverança e calma antes de iniciar sua sessão de trabalho em ${niche}.
• Tarefa 3: Desafio de Correção de Rota — Identifique um ponto fraco ou gargalo atual no seu processo e execute um ajuste imediato para restaurar a eficiência.`
        },
        {
          number: 4,
          title: `Plano de Ação de 21 Dias e Consolidação dos Resultados`,
          content: `[Visão Geral do Capítulo]
Chegou o momento decisivo de transformar o conhecimento acumulado em resultados sólidos e sustentáveis. Ter o guia ${productName} em mãos só gerará impacto se for traduzido em rotinas consistentes e disciplina diária aplicada ao nicho de ${niche}.

[🧠 Dimensão Mental: Identidade de Sucesso & Hábitos de Alto Rendimento]
A sua nova identidade mental não é de alguém que "está tentando", mas de um especialista comprometido com ${description}. Desenvolva hábitos de alto rendimento: planejamento na noite anterior, blocos de foco ininterrupto e revisão semanal de metas. O tom (${tone}) que guia este projeto deve refletir sua seriedade e determinação em liderar seu próprio caminho em ${niche}.

[❤️ Dimensão Emocional: Serenidade, Constância Sustentável & Celebração]
O sucesso duradouro é uma maratona, não um tiro de 100 metros. Evite o ciclo vicioso de entusiasmo desenfreado seguido de exaustão profunda. Busque o ritmo sustentável: trabalhe com paixão, mas descanse com respeito ao seu corpo e à sua mente. Aprenda a celebrar cada vitória, por menor que pareça, retroalimentando sua motivação com sentimentos de gratidão e contentamento.

[✨ Dimensão Espiritual: Legado, Contribuição & Transcendência]
Ao atingir suas metas com o método ${productName}, olhe ao redor. Quem mais pode ser beneficiado pelo que você conquistou? O verdadeiro triunfo em qualquer nicho atinge seu apogeu quando transborda para o próximo. Torne-se uma referência de honestidade, bondade e generosidade. Deixe um legado inspirador que prove que é possível vencer com respeito a Deus, à vida e aos semelhantes.

[📋 Tarefas Práticas & Plano de Ação do Nicho]
• Tarefa 1: Estruturação do Cronograma de 21 Dias — Divida as próximas 3 semanas em metas claras: Semana 1 (Fundação e Domínio Teórico de ${productName}), Semana 2 (Aplicação Prática Intensiva de ${description}), Semana 3 (Refinamento e Escala dos Resultados em ${niche}).
• Tarefa 2: Protocolo dos Limites Sagrados — Estabeleça 2 regras inegociáveis para proteger sua saúde mental, emocional e espiritual enquanto executa o plano de ação.
• Tarefa 3: Desafio de Entrega e Compromisso — Compartilhe sua decisão de aplicar o método com alguém de confiança ou firme um contrato consigo mesmo por escrito, comprometendo-se a executar as tarefas diárias até o fim.`
        }
      ],
      conclusion: `Parabéns por completar esta leitura transformadora! Você agora detém não apenas a metodologia técnica de ${productName} para vencer em ${niche}, mas também o equilíbrio essencial entre o mental, o emocional, o espiritual e a ação prática. Lembre-se sempre de que o conhecimento só se torna poder transformador quando colocado em prática no mundo real. Siga o plano de 21 dias com dedicação e colha a vida livre, próspera e significativa que você merece construir. Seu futuro de sucesso começa hoje!`
    };
  } else {
    return {
      headline: `Atenção: Descubra o Método Exclusivo para Dominar ${niche} de Forma Rápida e Segura!`,
      subheadline: `Entenda como o método definitivo de ${productName} auxilia ${targetAudience} a ${description} sem precisar passar por caminhos complicados.`,
      videoPlaceholderText: `Apresentação Comercial em Vídeo (VSL) de 5 minutos detalhando a grande oportunidade e os diferenciais que o método ${productName} entrega.`,
      hookText: `Se você faz parte de ${targetAudience} e se sente frustrado com a falta de direcionamento claro ou cansado de tentar métodos complicados sem sucesso, este convite é para você. Desenvolvemos o método ${productName} com o propósito de guiar você diretamente à solução de ${description}, através de um passo a passo desenhado por especialistas do setor.`,
      painPoints: [
        `Frustração de gastar tempo e dinheiro em métodos confusos que não trazem resultados.`,
        `Falta de tempo para se dedicar a conteúdos longos e extremamente técnicos do mercado.`,
        `Sensação de estar estagnado em ${niche} mesmo se esforçando todos os dias.`
      ],
      benefits: [
        {
          title: `Método 100% Prático e Direto ao Ponto`,
          description: `Sem enrolação ou conceitos puramente teóricos. Você aprende o que realmente importa e aplica no mesmo dia.`
        },
        {
          title: `Resultados em Tempo Recorde`,
          description: `Foque apenas nos pilares essenciais que geram 80% dos retornos práticos. Economize tempo precioso.`
        },
        {
          title: `Suporte Personalizado`,
          description: `Nossa equipe estará ao seu lado para tirar dúvidas e garantir que você execute o método sem erros.`
        }
      ],
      testimonials: [
        {
          name: `Carlos Eduardo`,
          profile: `Profissional Liberal, 34 anos`,
          text: `O método ${productName} mudou totalmente meu jogo. Eu já vinha tentando me destacar em ${niche} há meses sem progresso. Com este passo a passo para ${description}, tudo ficou muito claro e os resultados começaram a aparecer logo nas primeiras semanas!`
        },
        {
          name: `Mariana Souza`,
          profile: `Empreendedora, 29 anos`,
          text: `Eu me sentia muito sobrecarregada com o excesso de informações na internet. Ter um guia estruturado focado na minha rotina me economizou muito tempo e dor de cabeça. Hoje indico para todos os meus parceiros.`
        },
        {
          name: `Roberto Alves`,
          profile: `Estudante, 23 anos`,
          text: `Super recomendo! O material é extremamente didático e o tom (${tone}) torna a aplicação simples e muito amigável, mesmo para quem é iniciante no nicho.`
        }
      ],
      faq: [
        {
          question: `O método funciona para iniciantes?`,
          answer: `Com certeza! Todo o conteúdo foi desenhado do absoluto zero até o nível avançado. Usamos uma linguagem muito simples e exemplos práticos para que qualquer pessoa consiga aplicar.`
        },
        {
          question: `Como receberei o meu material de acesso?`,
          answer: `O envio é 100% automatizado e imediato. Assim que o pagamento for confirmado, você receberá um e-mail com o link direto para download do e-book e todos os bônus.`
        },
        {
          question: `Existe alguma garantia de satisfação?`,
          answer: `Sim, oferecemos uma garantia incondicional de satisfação. Se por qualquer motivo você achar que o método não é ideal para você, basta solicitar o reembolso total dentro do prazo.`
        },
        {
          question: `Em qual formato o produto é entregue?`,
          answer: `O produto principal é entregue como um livro digital completo em formato PDF, de alta resolução e otimizado para leitura em celulares, tablets ou computadores.`
        }
      ],
      pricing: {
        originalPrice: `R$ 197,00`,
        discountedPrice: `R$ 47,00`,
        ctaText: `QUERO GARANTIR MINHA VAGA AGORA`
      }
    };
  }
}

// Endpoint to generate infoproducts (Ebook or Sales Page)
app.post("/api/generate", authenticateSession as any, async (req: any, res) => {
  const { 
    type, 
    productName, 
    niche, 
    targetAudience, 
    tone, 
    description, 
    extraDetails, 
    aiPersona, 
    avatar, 
    synopsis, 
    chapters, 
    pricing,
    systemInstruction: clientSystemInstruction,
    systemContext
  } = req.body;
  try {

    if (!productName || !niche || !targetAudience || !tone || !description) {
      return res.status(400).json({ error: "Por favor, preencha todos os campos obrigatórios." });
    }

    const projectContext = {
      productName,
      niche,
      targetAudience,
      tone,
      description,
      extraDetails,
      aiPersona,
      avatar,
      synopsis,
      chapters,
      pricing
    };

    if (type === "ebook") {
      const systemInstruction = clientSystemInstruction || systemContext || SystemContextBuilder.build(projectContext, "ebook");
      const userPrompt = `
        Com base no contexto do projeto estabelecido na diretriz de sistema:
        Você é um autor best-seller e mentor transformador no nicho de "${niche}".
        Crie o E-book completo, aprofundado, denso e transformador para o produto "${productName}".

        REGRA DE OURO INEGOCIÁVEL PARA O CONTEÚDO DE CADA CAPÍTULO:
        O leitor precisa de uma transformação 360º real. Por isso, CADA UM DOS 4 CAPÍTULOS DEVE OBRIGATORIAMENTE conter conteúdo substancial, detalhado e prático (mínimo de 4 a 6 parágrafos robustos por capítulo) estruturado com os 4 PILARES ESSENCIAIS claramente delimitados no campo "content":

        [Visão Geral do Capítulo]
        Contextualização estratégica e abertura conectando com as dores e ambições reais de ${targetAudience} no nicho de ${niche}.

        [🧠 Dimensão Mental: Clareza & Reprogramação de Crenças]
        Análise profunda das crenças limitantes específicas de ${niche}. Modelos mentais de excelência, foco inabalável e reprogramação cognitiva para pensar como os maiores especialistas da área.

        [❤️ Dimensão Emocional: Autodomínio & Inteligência Emocional]
        Como gerenciar a ansiedade por resultados, o medo de falhar, a síndrome do impostor e a sobrecarga emocional no dia a dia. Estratégias práticas de inteligência emocional e blindagem psicológica para manter a constância.

        [✨ Dimensão Espiritual: Propósito Maior & Força Interior]
        A conexão entre o sucesso em ${niche} e um propósito de vida transcendente, valores éticos inegociáveis, integridade e legado. Como cultivar paz de espírito, serenidade e força interior para não desistir diante dos obstáculos.

        [📋 Tarefas Práticas & Plano de Ação do Nicho]
        Lista com 3 a 4 tarefas práticas numeradas e acionáveis (Ex: "• Tarefa 1: ...", "• Tarefa 2: ...", "• Tarefa 3: ...") para o leitor executar HOJE no mundo real, com ferramentas, passos práticos e resultado esperado no nicho "${niche}".

        O e-book completo deve conter:
        - Título magnético e subtítulo atraente.
        - Sinopse / Introdução envolvente que prenda a atenção do leitor de imediato.
        - 4 capítulos completos, cada um cumprindo rigorosamente os 4 pilares descritos acima.
        - Conclusão inspiradora com um chamado de ação transformador.
      `;

      const response = await generateContentWithRetryAndFallback({
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Título magnético do e-book" },
              subtitle: { type: Type.STRING, description: "Subtítulo atraente e focado em benefícios" },
              synopsis: { type: Type.STRING, description: "Introdução cativante que prende a atenção do leitor" },
              chapters: {
                type: Type.ARRAY,
                description: "Lista de 4 capítulos do e-book com os 4 pilares obrigatórios",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    number: { type: Type.INTEGER, description: "Número sequencial do capítulo (1 a 4)" },
                    title: { type: Type.STRING, description: "Título cativante e específico do capítulo" },
                    content: { type: Type.STRING, description: "Conteúdo completo contendo obrigatoriamente [Visão Geral], [🧠 Dimensão Mental], [❤️ Dimensão Emocional], [✨ Dimensão Espiritual] e [📋 Tarefas Práticas & Plano de Ação do Nicho] com tarefas numeradas acionáveis" }
                  },
                  required: ["number", "title", "content"]
                }
              },
              conclusion: { type: Type.STRING, description: "Conclusão com um chamado de ação inspirador e motivador" }
            },
            required: ["title", "subtitle", "synopsis", "chapters", "conclusion"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Não foi possível obter texto de resposta do Gemini.");
      }

      return res.json(JSON.parse(cleanJsonString(responseText)));

    } else if (type === "salespage") {
      const systemInstruction = clientSystemInstruction || systemContext || SystemContextBuilder.build(projectContext, "salespage");
      const userPrompt = `
        Com base no contexto unificado do projeto estabelecido na diretriz de sistema:
        Crie uma estrutura completa de página de vendas de alta conversão contendo:
        - Headline principal ultra-persuasiva e irresistível.
        - Subheadline poderosa com foco na maior transformação do método.
        - Hook / Gancho inicial conectando com a dor e apresentando a grande solução.
        - 3 a 4 pontos de dor viscerais do público-alvo.
        - 3 a 4 benefícios principais tangíveis.
        - 3 depoimentos autênticos e detalhados de clientes ideais simulados.
        - 4 perguntas e respostas de FAQ quebrando as maiores objeções de compra.
        - Estrutura de precificação com valor original vs. promocional de lançamento.
      `;

      const response = await generateContentWithRetryAndFallback({
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING, description: "Headline principal e magnética" },
              subheadline: { type: Type.STRING, description: "Subheadline complementar com foco no resultado rápido" },
              videoPlaceholderText: { type: Type.STRING, description: "Instrução de script ou descrição do vídeo de vendas ideal" },
              hookText: { type: Type.STRING, description: "Texto persuasivo de introdução conectando com a dor e solução" },
              painPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista de 3 a 4 dores frequentes que o infoproduto resolve"
              },
              benefits: {
                type: Type.ARRAY,
                description: "Lista com 3 a 4 benefícios principais do produto",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Título do benefício" },
                    description: { type: Type.STRING, description: "Explicação detalhada de como o benefício ajuda o cliente" }
                  },
                  required: ["title", "description"]
                }
              },
              testimonials: {
                type: Type.ARRAY,
                description: "Depoimentos altamente convincentes de compradores fictícios satisfeitos",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Nome completo do cliente fictício" },
                    profile: { type: Type.STRING, description: "Ocupação ou perfil do cliente (ex: Empresário, Mãe, Estudante)" },
                    text: { type: Type.STRING, description: "Texto sincero, focado nos resultados alcançados com o produto" }
                  },
                  required: ["name", "profile", "text"]
                }
              },
              faq: {
                type: Type.ARRAY,
                description: "Principais quebras de objeção em formato de FAQ (Perguntas Frequentes)",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING, description: "Pergunta comum sobre o infoproduto" },
                    answer: { type: Type.STRING, description: "Resposta persuasiva do produtor" }
                  },
                  required: ["question", "answer"]
                }
              },
              pricing: {
                type: Type.OBJECT,
                properties: {
                  originalPrice: { type: Type.STRING, description: "Valor cheio do produto (ex: R$ 297,00)" },
                  discountedPrice: { type: Type.STRING, description: "Valor especial promocional (ex: R$ 97,00)" },
                  ctaText: { type: Type.STRING, description: "Texto do botão de compra principal" }
                },
                required: ["originalPrice", "discountedPrice", "ctaText"]
              }
            },
            required: ["headline", "subheadline", "videoPlaceholderText", "hookText", "painPoints", "benefits", "testimonials", "faq", "pricing"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Não foi possível obter texto de resposta do Gemini.");
      }

      return res.json(JSON.parse(cleanJsonString(responseText)));
    } else {
      return res.status(400).json({ error: "Tipo de infoproduto inválido." });
    }

  } catch (error: any) {
    let errorDetail = "indisponibilidade temporária";
    if (error?.message) {
      const msg = String(error.message);
      if (msg.includes("429") || msg.toLowerCase().includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) {
        errorDetail = "Limite de cota temporário atingido nos servidores de IA (429)";
      } else if (msg.includes("503") || msg.toLowerCase().includes("high demand") || msg.includes("UNAVAILABLE")) {
        errorDetail = "Alta demanda momentânea no modelo de IA (503)";
      } else {
        errorDetail = msg.slice(0, 100);
      }
    } else if (error?.status) {
      errorDetail = `Status ${error.status}`;
    }
    console.log(`[Gemini] Ativando gerador de contingência inteligente local (motivo: ${errorDetail})...`);
    try {
      const fallbackData = generateLocalFallbackContent(
        type,
        productName,
        niche,
        targetAudience,
        tone,
        description,
        extraDetails || ""
      );
      return res.json({
        ...fallbackData,
        isFallback: true
      });
    } catch (fallbackError: any) {
      console.error("Erro crítico na contingência:", fallbackError);
      return res.status(500).json({ error: "Erro interno ao fabricar infoproduto." });
    }
  }
});

// Handle unknown /api/* requests with a clean JSON response instead of falling through to SPA HTML
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `Endpoint de API não encontrado: ${req.method} ${req.path}` });
});

// Setup Vite Dev Server / Static Assets Serving
async function startServer() {
  // Antes de tudo, busca os dados salvos permanentemente no Supabase
  // (usuários, compras, sessões) para dentro da memória do servidor.
  // Se o Supabase não estiver configurado, isso simplesmente não faz nada
  // e o servidor segue usando o arquivo local db.json normalmente.
  await db.loadFromSupabase();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      index: false
    }));
    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fábrica de Infoprodutos Server running on port ${PORT}`);
  });
}

startServer();
