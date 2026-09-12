import React, { useState } from "react";
import { 
  GitFork, 
  Sparkles, 
  ArrowLeft, 
  Copy, 
  Check, 
  MessageSquare, 
  Megaphone, 
  ShoppingCart, 
  ArrowRight, 
  HelpCircle, 
  Target, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  PhoneCall, 
  Clock, 
  MousePointer, 
  DollarSign, 
  Award,
  Layers,
  ChevronRight,
  BookOpen,
  RefreshCw,
  Palette,
  Video,
  Eye
} from "lucide-react";
import { EbookData } from "../types";
import JornadaAbandonoNotifications from "./JornadaAbandonoNotifications";
import { BellRing } from "lucide-react";

interface Props {
  ebook: EbookData;
  productName: string;
  niche: string;
  targetAudience: string;
  description: string;
  price?: string;
  onBackToVsl: () => void;
  onNextToSocio?: () => void;
}

export default function SalesFunnelStep({
  ebook,
  productName,
  niche,
  targetAudience,
  description,
  price = "R$ 47,00",
  onBackToVsl,
  onNextToSocio
}: Props) {
  const [activeFunnel, setActiveFunnel] = useState<"direct" | "whatsapp" | "abandonment">("direct");
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);

  // State for Greeting Script Generator with Authority
  const [sellerName, setSellerName] = useState<string>("[Seu Nome]");
  const [authorityTone, setAuthorityTone] = useState<"specialist" | "results" | "method">("specialist");
  const [qualifyingQuestion, setQualifyingQuestion] = useState<string>("difficulty");
  const [customGreetingCopied, setCustomGreetingCopied] = useState<boolean>(false);

  // State for Creative Ideas Generator (Tráfego Direto)
  const [creativeTone, setCreativeTone] = useState<"curiosity" | "urgency" | "transformation" | "direct_benefit">("curiosity");
  const [isGeneratingCreatives, setIsGeneratingCreatives] = useState<boolean>(false);
  const [copiedCreativeId, setCopiedCreativeId] = useState<string | null>(null);

  const title = ebook.title || productName || "E-book Digital";

  // Dynamic Creative Ideas Generator function
  const getCreativeIdeas = (tone: "curiosity" | "urgency" | "transformation" | "direct_benefit") => {
    const pTitle = ebook.title || productName || "E-book Digital";
    const pNiche = niche || "seu segmento";
    const pAudience = targetAudience || "pessoas que buscam resultados";

    if (tone === "curiosity") {
      return [
        {
          id: "creative-1",
          number: "Ideia 1 • Curiosidade & Quebra de Padrão",
          hook: `Pare de tentar evoluir em ${pNiche} antes de ver a página 12 deste método! 🛑`,
          visual: `Vídeo em formato selfie gravado no celular (15s): abra o e-book na tela do celular ou tablet, apontando para uma frase destacada. Use legenda grande amarela.`,
          trigger: "Interrompe a rolagem automática do feed despertando o medo de estar perdendo uma solução pronta.",
          copyText: `Gancho: "Pare de tentar evoluir em ${pNiche} antes de ver a página 12 deste método! 🛑"\nVisual: Vídeo selfie de 15s abrindo a página 12 no tablet/celular com legenda amarela.\nProduto: ${pTitle}`
        },
        {
          id: "creative-2",
          number: "Ideia 2 • O Erro Silencioso",
          hook: `O erro nº 1 que ${pAudience} comete ao tentar ter resultados em ${pNiche}... (E quase ninguém percebe).`,
          visual: `Card em modo escuro estilo 'Notas do iPhone' ou 'Tweet' com texto branco e o erro destacado em vermelho neon. Fundo levemente desfocado.`,
          trigger: "Faz o prospecto achar que está cometendo um erro oculta e clicar para descobrir a correção na VSL.",
          copyText: `Gancho: "O erro nº 1 que ${pAudience} comete ao tentar ter resultados em ${pNiche}... (E quase ninguém percebe)."\nVisual: Imagem de Card escuro estilo 'Notas do iPhone' com destaque em vermelho.`
        },
        {
          id: "creative-3",
          number: "Ideia 3 • Segredo Revelado",
          hook: `Eles não querem que você saiba disso, mas existe um atalho simples para masterizar ${pNiche} sem complicação.`,
          visual: `Vídeo dinâmico de 10s mostrando a tela do celular deslizando pelas páginas do e-book "${pTitle}" enquanto uma voz marcante narra o gancho.`,
          trigger: "Explora a curiosidade de encontrar um 'segredo/atalho' simples para aplicar hoje.",
          copyText: `Gancho: "Eles não querem que você saiba disso, mas existe um atalho simples para masterizar ${pNiche} sem complicação."\nVisual: Vídeo de 10s deslizando as páginas do e-book com narração de revelação.`
        }
      ];
    }

    if (tone === "urgency") {
      return [
        {
          id: "creative-1",
          number: "Ideia 1 • Alerta de Oportunidade",
          hook: `ATENÇÃO: Apenas hoje o guia definitivo "${pTitle}" está disponível por apenas ${price}! ⏳`,
          visual: `Imagem com selo vermelho de 'Condição de Lançamento', mostrando a capa 3D do e-book e um cronômetro indicando últimas vagas no valor especial.`,
          trigger: "Gera o gatilho da escassez e da urgência temporal de compra imediata.",
          copyText: `Gancho: "ATENÇÃO: Apenas hoje o guia definitivo "${pTitle}" está disponível por apenas ${price}! ⏳"\nVisual: Imagem da capa 3D do e-book com selo de oferta e cronômetro.`
        },
        {
          id: "creative-2",
          number: "Ideia 2 • Custo da Inação",
          hook: `Quanto custa continuar errando em ${pNiche}? Menos que ${price} por dia para resolver de vez.`,
          visual: `Vídeo comparativo de tela dividida: de um lado a frustração do método antigo e do outro a facilidade de ler o e-book no celular.`,
          trigger: "Contrasta a dor da estagnação com a facilidade da solução por um preço acessível.",
          copyText: `Gancho: "Quanto custa continuar errando em ${pNiche}? Menos que ${price} por dia para resolver de vez."\nVisual: Tela dividida mostrando o 'Antes' frustrado e o 'Depois' com o e-book.`
        },
        {
          id: "creative-3",
          number: "Ideia 3 • Última Chamada para o Desconto",
          hook: `Se você busca resultados em ${pNiche}, essa é a sua última chance de garantir o "${pTitle}" antes do aumento.`,
          visual: `Card clean com fundo verde escuro, texto em destaque branco e botão simulado com seta 'Clique Aqui / Acesse Agora'.`,
          trigger: "Impulsiona compras de impulso em pessoas que já conhecem a dor e precisam do empurrão final.",
          copyText: `Gancho: "Se você busca resultados em ${pNiche}, essa é a sua última chance de garantir o "${pTitle}" antes do aumento."\nVisual: Card em tom verde com botão destacado de 'Acessar Agora'.`
        }
      ];
    }

    if (tone === "transformation") {
      return [
        {
          id: "creative-1",
          number: "Ideia 1 • História de Superação",
          hook: `Eu também achava que era impossível ter sucesso em ${pNiche}... Até descobrir esta virada de chave.`,
          visual: `Vídeo em tom pessoal e humanizado: alguém conversando com a câmera de forma sincera, narrando a própria jornada de superação até conhecer o método.`,
          trigger: "Cria conexão empática profunda e identificação imediata com o problema.",
          copyText: `Gancho: "Eu também achava que era impossível ter sucesso em ${pNiche}... Até descobrir esta virada de chave."\nVisual: Vídeo humanizado e espontâneo contando a história de mudança.`
        },
        {
          id: "creative-2",
          number: "Ideia 2 • O Antes e Depois Simplificado",
          hook: `Como ${pAudience} estão saindo do zero e alcançando autonomia em ${pNiche} em poucos dias.`,
          visual: `Imagem com depoimento recortado em balão de mensagem e a capa do e-book "${pTitle}" ao lado.`,
          trigger: "Prova social aliada à promessa de transformação prática.",
          copyText: `Gancho: "Como ${pAudience} estão saindo do zero e alcançando autonomia em ${pNiche} em poucos dias."\nVisual: Recorte de mensagem de feedback com a capa do produto.`
        },
        {
          id: "creative-3",
          number: "Ideia 3 • O Método Passo a Passo",
          hook: `Você não precisa de teorias difíceis: este mapa de 3 etapas simplifica tudo em ${pNiche}.`,
          visual: `Infográfico simples em 3 blocos numerados na imagem mostrando a jornada simples contida no e-book.`,
          trigger: "Reduz a objeção de que o produto é difícil de aplicar ou demorado.",
          copyText: `Gancho: "Você não precisa de teorias difíceis: este mapa de 3 etapas simplifica tudo em ${pNiche}."\nVisual: Infográfico de 3 passos na imagem do anúncio.`
        }
      ];
    }

    // Default "direct_benefit"
    return [
      {
        id: "creative-1",
        number: "Ideia 1 • Promessa Direta ao Ponto",
        hook: `Aprenda como dominar ${pNiche} com o passo a passo definitivo do "${pTitle}".`,
        visual: `Imagem do e-book em maquete 3D flutuante sobre fundo tecnológico escuro com brilho neon nas bordas.`,
        trigger: "Entrega clareza absoluta da proposta de valor sem floreios.",
        copyText: `Gancho: "Aprenda como dominar ${pNiche} com o passo a passo definitivo do "${pTitle}."\nVisual: Mockup 3D premium do e-book em fundo escuro com iluminação.`
      },
      {
        id: "creative-2",
        number: "Ideia 2 • Solução para a Dor Principal",
        hook: `Cansado(a) de ficar sem saber por onde começar em ${pNiche}? Este guia prático resolve para você.`,
        visual: `Vídeo de demonstração mostrando a leitura fluida do e-book em um celular, destacando checklists e exercícios práticos.`,
        trigger: "Atinge em cheio a dor do alívio imediato e da direção clara.",
        copyText: `Gancho: "Cansado(a) de ficar sem saber por onde começar em ${pNiche}? Este guia prático resolve para você."\nVisual: Vídeo mostrando a usabilidade do e-book no smartphone.`
      },
      {
        id: "creative-3",
        number: "Ideia 3 • Guia de Aplicação Imediata",
        hook: `Baixe agora o e-book "${pTitle}" e comece a aplicar as estratégias ainda hoje.`,
        visual: `Imagem limpa focada na facilidade de download imediato no celular após a compra.`,
        trigger: "Destaca o imediatismo e a praticidade do formato digital.",
        copyText: `Gancho: "Baixe agora o e-book "${pTitle}" e comece a aplicar as estratégias ainda hoje."\nVisual: Card de alta definição ressaltando 'Acesso Imediato no Celular'.`
      }
    ];
  };

  // Dynamic Authority Greeting Generator function
  const getAuthorityGreetingMessage = () => {
    const nameStr = sellerName.trim() || "[Seu Nome]";
    
    let questionText = "Qual é o seu maior desafio ou dificuldade hoje em relação a esse tema?";
    if (qualifyingQuestion === "tried_before") {
      questionText = "Você já tentou resolver isso de alguma outra forma anteriormente?";
    } else if (qualifyingQuestion === "goal") {
      questionText = "Qual é o seu principal objetivo ou resultado desejado nos próximos 30 dias?";
    } else if (qualifyingQuestion === "urgency") {
      questionText = "O quanto essa situação tem atrapalhado a sua rotina no momento?";
    }

    if (authorityTone === "results") {
      return `Olá! Seja muito bem-vindo(a)! Meu nome é ${nameStr} e sou especialista em acelerar resultados em *${niche || "seu segmento"}*. 🎯

Vi que você nos chamou no WhatsApp interessado(a) nas estratégias do *"${title}"*. 

Esse método foi desenvolvido sob medida para ${targetAudience || "quem deseja resultados rápidos e sem complicação"}.

Para que eu possa te orientar com precisão e entender seu momento:
👉 *${questionText}*`;
    }

    if (authorityTone === "method") {
      return `Olá! Que excelente decisão a sua de buscar evolução em *${niche || "sua área"}*! Meu nome é ${nameStr}. 🌟

O *"${title}"* foi estruturado como um passo a passo prático para destravar os seus resultados e eliminar a frustração de ${targetAudience || "tentar sem método"}.

Para te dar o melhor suporte aqui no atendimento:
👉 *${questionText}*`;
    }

    // Default "specialist" tone
    return `Olá! Tudo bem? 🙂 Aqui é o/a ${nameStr}, especialista no método *"${title}"*.

Seja muito bem-vindo(a)! Recebi sua mensagem com interesse em *${niche || "nossas soluções"}*.

Meu compromisso aqui é te dar um direcionamento direto ao ponto e te mostrar como aplicar o e-book na sua rotina.

Antes de te enviar as informações completas, me conta uma coisa:
👉 *${questionText}*`;
  };

  // Pre-formatted custom WhatsApp messages based on product details
  const whatsappScripts = [
    {
      id: "welcome",
      phase: "Fase 1: Boas-Vindas & Conexão",
      purpose: "Primeiro contato acolhedor assim que o cliente clica no link do anúncio.",
      message: `Olá! Tudo bem? 🙂 Vi que você se interessou pelo guia *"${title}"*. 

Seja muito bem-vindo(a)! Meu nome é [Seu Nome] e estou aqui para te ajudar.

Antes de te passar os detalhes, me conta uma coisa: qual é o seu maior desafio hoje em relação a *${niche}*?`
    },
    {
      id: "diagnosis",
      phase: "Fase 2: Diagnóstico & Empatia",
      purpose: "Validar a dor do cliente e mostrar que você entende exatamente o que ele passa.",
      message: `Entendo perfeitamente! A maioria das pessoas que nos procuram passam exatamente por isso. 😔

É super comum tentar várias coisas e sentir que não sai do lugar. Mas a boa notícia é que existe um método simples e estruturado para virar essa chave sem complicação.`
    },
    {
      id: "solution",
      phase: "Fase 3: Apresentação da Solução",
      purpose: "Apresentar o E-book como a ponte prática para resolver o problema rapidamente.",
      message: `Foi exatamente para resolver isso que criamos o *"${title}"*! 📖

Ele foi feito sob medida para ${targetAudience || "quem busca resultados reais"}, e direto ao ponto:
✅ Passo a passo prático para você aplicar hoje mesmo.
✅ Sem enrolação nem teorias difíceis.
✅ Acesso imediato no seu celular ou computador.`
    },
    {
      id: "offer",
      phase: "Fase 4: Oferta Irrecusável & Link",
      purpose: "Apresentar o valor promocional com garantia de satisfação.",
      message: `E o melhor de tudo: hoje estamos com uma condição especial de lançamento!

De ~R$ 97,00~ por apenas *${price}* (ou parcelado no cartão/Pix).
E você ainda conta com *7 Dias de Garantia Incondicional*! Se não gostar, devolvemos 100% do seu dinheiro.

Garanta a sua cópia aqui com desconto: [COLE O SEU LINK DE CHECKOUT AQUI]`
    },
    {
      id: "objection_price",
      phase: "Quebra de Objeção: 'Está caro / Tô sem dinheiro'",
      purpose: "Mostrar o custo do problema x o pequeno investimento no produto.",
      message: `Entendo total! Mas pensa comigo: quanto custa continuar passando por essa mesma frustração todos os dias? 

Por apenas *${price}* (menos que o valor de um lanche), você economiza semanas de tentativas e erros e vai direto ao que funciona. E lembre-se: o risco é todo meu, você tem 7 dias de garantia!`
    },
    {
      id: "reminder",
      phase: "Follow-up / Lembrete (Após 2 horas sem resposta)",
      purpose: "Reengajar o cliente que visualizou mas não finalizou a compra.",
      message: `Ei, tudo bem? Apenas passando para avisar que a condição especial de *${price}* para o *"${title}"* vai se encerrar em breve! ⏳

Ficou com alguma dúvida sobre o conteúdo que eu possa te ajudar a esclarecer?`
    }
  ];

  const handleCopyScript = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId(null), 2000);
  };

  return (
    <div className="w-full text-left space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5" />
                <span>Etapa 7 de 7 • Guia de Funis de Vendas Lucrativos</span>
              </span>
              <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded-full">
                Didático & Prático
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Aprenda a Estruturar Seus <span className="text-emerald-400">Funis de Vendas</span>
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Descubra como transformar visualizações de anúncios em dinheiro no bolso com os 2 modelos de funil mais eficientes para infoprodutos: <strong className="text-white">Tráfego Direto</strong> e <strong className="text-white">Conversão via WhatsApp</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onBackToVsl}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar à VSL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Funnel Type Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Tab 1 Button: Tráfego Direto */}
        <button
          type="button"
          onClick={() => setActiveFunnel("direct")}
          className={`p-6 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeFunnel === "direct"
              ? "bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500"
              : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-2xl ${activeFunnel === "direct" ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              activeFunnel === "direct" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-500"
            }`}>
              Automatizado
            </span>
          </div>

          <h3 className="text-lg font-black text-white">1. Funil de Tráfego Direto</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Criativo ➔ Página de Vendas com VSL ➔ Checkout. Ideal para escalar vendas de forma automática sem precisar falar com o cliente um a um.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs font-bold text-emerald-400">
            <span>Explorar Estrutura e Níveis de Consciência</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Tab 2 Button: WhatsApp */}
        <button
          type="button"
          onClick={() => setActiveFunnel("whatsapp")}
          className={`p-6 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeFunnel === "whatsapp"
              ? "bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500"
              : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-2xl ${activeFunnel === "whatsapp" ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              activeFunnel === "whatsapp" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-500"
            }`}>
              Alta Conversão
            </span>
          </div>

          <h3 className="text-lg font-black text-white">2. Funil de WhatsApp</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Criativo ➔ Conversa no WhatsApp ➔ Script Didático ➔ Fechamento. Ideal para validação rápida, produtos de maior ticket e quebra de objeções em tempo real.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs font-bold text-emerald-400">
            <span>Ver Roteiros de Atendimento Copia e Cola</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Tab 3 Button: Jornada de Abandono & Notificações */}
        <button
          type="button"
          onClick={() => setActiveFunnel("abandonment")}
          className={`p-6 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeFunnel === "abandonment"
              ? "bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/5 ring-1 ring-amber-500"
              : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-2xl ${activeFunnel === "abandonment" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
              <BellRing className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              activeFunnel === "abandonment" ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "bg-slate-900 border-slate-800 text-slate-500"
            }`}>
              +35% de Recuperação
            </span>
          </div>

          <h3 className="text-lg font-black text-white">3. Jornada de Abandono</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Notificações automáticas no WhatsApp, E-mail, SMS e Push acionadas assim que o cliente abandona o checkout ou gera Pix sem pagar.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs font-bold text-amber-400">
            <span>Testar Disparos & Notificações em Tempo Real</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

      </div>

      {/* FUNNEL 3: JORNADA DE ABANDONO & NOTIFICAÇÕES */}
      {activeFunnel === "abandonment" && (
        <div className="animate-fadeIn">
          <JornadaAbandonoNotifications
            productName={title}
            niche={niche}
            price={price}
            targetAudience={targetAudience}
          />
        </div>
      )}

      {/* FUNNEL 1: TRÁFEGO DIRETO */}
      {activeFunnel === "direct" && (
        <div className="space-y-6">
          
          {/* Visual Step-by-Step Diagram */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Fluxo Visual Passo a Passo</span>
              <h3 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                <Layers className="w-5 h-5 text-emerald-400" />
                Como Funciona o Funil de Tráfego Direto
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Neste modelo, todo o processo de persuasão e vendas é 100% automatizado pela combinação do seu Criativo, da sua Página de Vendas e da VSL.
              </p>
            </div>

            {/* Diagram Flow Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              
              {/* Step 1 */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <Megaphone className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Criativo de Impacto (Anúncio)</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Atrai a atenção no feed/stories com uma promessa forte e desperta o desejo do clique (CTR &gt; 2%).
                  </p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono">
                  Métrica Chave: CTR (%) e Custo por Clique (CPC)
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-950 border border-emerald-500/30 p-5 rounded-2xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Página de Vendas & VSL</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    O visitante assiste ao Roteiro de VSL (Etapa 6) e lê a Copy AIDA (Etapa 2). A VSL quebra objeções e apresenta a oferta.
                  </p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] text-emerald-400 font-mono">
                  Métrica Chave: Retenção no Vídeo & Cliques na Oferta
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Checkout & Conversão</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    O cliente escolhe a forma de pagamento (Pix ou Cartão). O e-book é entregue automaticamente no e-mail dele!
                  </p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono">
                  Métrica Chave: Taxa de Conversão do Checkout (%)
                </div>
              </div>

            </div>
          </div>

          {/* GERADOR DE IDEIAS DE CRIATIVOS COM IA PARA TRÁFEGO DIRETO */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-full inline-flex items-center gap-1 mb-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Gerador Inteligente com IA</span>
                </span>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-emerald-400" />
                  Gerador de Ideias de Criativos de Tráfego Direto
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Obtenha 3 variações de ganchos (headlines) e conceitos visuais alinhados com o tom de voz do seu projeto para acelerar seus anúncios.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsGeneratingCreatives(true);
                    setTimeout(() => setIsGeneratingCreatives(false), 600);
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingCreatives ? "animate-spin" : ""}`} />
                  <span>Gerar Novas Ideias</span>
                </button>
              </div>
            </div>

            {/* Tone Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">
                Selecione o Tom de Voz do Anúncio:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreativeTone("curiosity")}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    creativeTone === "curiosity"
                      ? "bg-emerald-500/10 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/30"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <strong className="text-xs font-extrabold block text-white mb-0.5">Curiosidade</strong>
                  <span className="text-[10px] text-slate-400 leading-tight block">Quebra de padrão & mistério</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCreativeTone("urgency")}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    creativeTone === "urgency"
                      ? "bg-emerald-500/10 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/30"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <strong className="text-xs font-extrabold block text-white mb-0.5">Urgência & Escassez</strong>
                  <span className="text-[10px] text-slate-400 leading-tight block">Desconto & oferta limitada</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCreativeTone("transformation")}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    creativeTone === "transformation"
                      ? "bg-emerald-500/10 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/30"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <strong className="text-xs font-extrabold block text-white mb-0.5">Transformação</strong>
                  <span className="text-[10px] text-slate-400 leading-tight block">História & prova social</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCreativeTone("direct_benefit")}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    creativeTone === "direct_benefit"
                      ? "bg-emerald-500/10 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/30"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <strong className="text-xs font-extrabold block text-white mb-0.5">Benefício Direto</strong>
                  <span className="text-[10px] text-slate-400 leading-tight block">Ação imediata & clareza</span>
                </button>
              </div>
            </div>

            {/* Generated 3 Creative Variations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getCreativeIdeas(creativeTone).map((idea) => (
                <div
                  key={idea.id}
                  className="bg-slate-950 border border-slate-800 hover:border-emerald-500/40 p-5 rounded-2xl space-y-3 flex flex-col justify-between transition-all shadow-md group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {idea.number}
                      </span>
                      <Megaphone className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
                    </div>

                    {/* Hook Section */}
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                        🎯 Gancho Impactante (Headline / Hook):
                      </span>
                      <p className="text-xs font-bold text-white bg-slate-900 p-3 rounded-xl border border-slate-800 leading-snug">
                        "{idea.hook}"
                      </p>
                    </div>

                    {/* Visual Concept */}
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                        🎬 Sugestão Visual do Anúncio:
                      </span>
                      <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                        {idea.visual}
                      </p>
                    </div>

                    {/* Psychological Trigger */}
                    <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50 text-[11px]">
                      <strong className="text-emerald-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">
                        ⚡ Por que Funciona:
                      </strong>
                      <span className="text-slate-400 leading-tight block">{idea.trigger}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleCopyScript(idea.copyText, idea.id);
                      setCopiedCreativeId(idea.id);
                      setTimeout(() => setCopiedCreativeId(null), 2000);
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    {copiedCreativeId === idea.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Ideia Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copiar Gancho & Conceito</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* Consciousness Level Educational Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Fundamento de Marketing</span>
              <h3 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                <Target className="w-5 h-5 text-emerald-400" />
                Os Níveis de Consciência do Seu Cliente no Tráfego Direto
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Para que o tráfego direto venda de verdade, a sua comunicação deve conduzir a pessoa do estado de inconsciência até a decisão final de compra.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <h4 className="text-sm font-bold text-white">Inconsciente do Problema</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-8">
                  O prospecto sente a dor, mas não sabe por que passa por isso nem que existe solução. O seu criativo precisa "cutucar" essa dor para fazê-lo parar de rolar o feed.
                </p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h4 className="text-sm font-bold text-white">Consciente do Problema</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-8">
                  Ele sabe qual é a dor (ex: "não consigo emagrecer" ou "não sei fazer anúncios"), mas acha que é difícil de resolver. Na VSL, você valida essa dor e mostra que a culpa não é dele.
                </p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <h4 className="text-sm font-bold text-white">Consciente da Solução</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-8">
                  Ele descobre que existe um método prático em formato de e-book que resolve seu problema sem complicação. É o momento em que a esperança é renovada!
                </p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-black text-xs flex items-center justify-center">
                    4
                  </span>
                  <h4 className="text-sm font-bold text-white">Consciente do Produto & Oferta</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-8">
                  Ele conhece o <strong className="text-emerald-400">"{title}"</strong>, vê o preço especial de <strong className="text-white">{price}</strong>, os bônus exclusivos e a garantia de 7 dias. Ele clica e compra!
                </p>
              </div>

            </div>

            {/* Practical Optimization Tips Card */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-current" />
                Dica de Otimização Prática de Tráfego Direto:
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                Utilize o botão de oferta atrasado (Delay do Botão de Compra): faça o botão de compra aparecer na página de vendas exatamente no momento em que a VSL revela o preço do e-book. Isso aumenta drasticamente a retenção e o desejo antes de mostrar o valor!
              </p>
            </div>

          </div>

        </div>
      )}

      {/* FUNNEL 2: CONVERSÃO VIA WHATSAPP */}
      {activeFunnel === "whatsapp" && (
        <div className="space-y-6">
          
          {/* Visual Step-by-Step Diagram for WhatsApp */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Atendimento Humanizado de Alta Conversão</span>
              <h3 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                Como Funciona o Funil de Vendas no WhatsApp
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                No WhatsApp, você converte até 10x mais pessoas que no tráfego direto porque consegue ouvir as objeções individuais de cada cliente e passar confiança imediata!
              </p>
            </div>

            {/* Diagram Flow Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="text-xs font-bold text-white">Anúncio "Chamar no Whats"</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Anúncio no Instagram com botão direto para abrir conversa no seu WhatsApp Business.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="text-xs font-bold text-white">Boas-Vindas & Pergunta</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Envie a mensagem inicial e faça uma pergunta sobre qual a maior dificuldade dele hoje.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="text-xs font-bold text-white">Áudio / Texto de Solução</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Envie um áudio curto de 30 a 45 segundos explicando como o e-book resolve a dor dele.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  4
                </span>
                <h4 className="text-xs font-bold text-white">Link com Desconto & Pix</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Envie o link de checkout ou a chave Pix direta com o valor especial de {price}.
                </p>
              </div>

            </div>
          </div>

          {/* NOVO: GERADOR INTERATIVO DE SCRIPT DE SAUDAÇÃO COM AUTORIDADE */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-full inline-flex items-center gap-1 mb-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Gerador Inteligente de Atendimento</span>
                </span>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Gerador de Script de Saudação com Autoridade
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Personalize a primeira mensagem enviada ao potencial cliente para garantir uma postura profissional, de especialista e de alta conversão.
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl self-start md:self-auto">
                E-book: <strong className="text-emerald-400">{title}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Controls */}
              <div className="lg:col-span-6 space-y-5">
                
                {/* 1. Nome do Especialista */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-200 uppercase tracking-wider block">
                    1. Seu Nome ou Nome do Atendente
                  </label>
                  <input
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="Ex: Dra. Mariana / Carlos Silva"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white text-xs rounded-xl p-3 outline-none transition"
                  />
                  <span className="text-[10px] text-slate-400 block">Identificar-se pelo nome gera conexão imediata sem perder o tom profissional.</span>
                </div>

                {/* 2. Tom de Autoridade */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-200 uppercase tracking-wider block">
                    2. Tom de Postura e Autoridade
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthorityTone("specialist")}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        authorityTone === "specialist"
                          ? "bg-emerald-500/10 border-emerald-500 text-white shadow"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <strong className="text-xs block text-white font-extrabold mb-0.5">Especialista</strong>
                      <span className="text-[10px] text-slate-400 leading-tight block">Foco no Método e Nicho</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuthorityTone("results")}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        authorityTone === "results"
                          ? "bg-emerald-500/10 border-emerald-500 text-white shadow"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <strong className="text-xs block text-white font-extrabold mb-0.5">Consultor</strong>
                      <span className="text-[10px] text-slate-400 leading-tight block">Aceleração de Resultados</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuthorityTone("method")}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        authorityTone === "method"
                          ? "bg-emerald-500/10 border-emerald-500 text-white shadow"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <strong className="text-xs block text-white font-extrabold mb-0.5">Mentor Exclusivo</strong>
                      <span className="text-[10px] text-slate-400 leading-tight block">Acolhimento Estruturado</span>
                    </button>
                  </div>
                </div>

                {/* 3. Pergunta de Qualificação */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-200 uppercase tracking-wider block">
                    3. Pergunta de Qualificação do Lead
                  </label>
                  <select
                    value={qualifyingQuestion}
                    onChange={(e) => setQualifyingQuestion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white text-xs rounded-xl p-3 outline-none transition cursor-pointer"
                  >
                    <option value="difficulty">Qual o seu maior desafio hoje?</option>
                    <option value="tried_before">Já tentou resolver isso de outra forma?</option>
                    <option value="goal">Qual seu objetivo principal nos próximos 30 dias?</option>
                    <option value="urgency">O quanto essa situação tem atrapalhado sua rotina?</option>
                  </select>
                  <span className="text-[10px] text-slate-400 block">Uma pergunta aberta obriga o cliente a se engajar na conversa antes de perguntar o preço.</span>
                </div>

              </div>

              {/* Simulated WhatsApp Chat Preview Box */}
              <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-4">
                
                {/* Header Simulated WhatsApp Contact */}
                <div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                        {sellerName.substring(0, 2).toUpperCase() || "WA"}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block leading-tight">
                          {sellerName || "Atendente"} • {niche || "Especialista"}
                        </span>
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Atendimento Online com Autoridade
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleCopyScript(getAuthorityGreetingMessage(), "custom-greeting");
                        setCustomGreetingCopied(true);
                        setTimeout(() => setCustomGreetingCopied(false), 2000);
                      }}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      {customGreetingCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Saudação</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Simulated Message Bubble */}
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl space-y-2 relative text-xs text-slate-100 font-mono leading-relaxed whitespace-pre-wrap select-all">
                    {getAuthorityGreetingMessage()}

                    <div className="text-[9px] text-emerald-400/70 text-right mt-1 font-sans flex items-center justify-end gap-1">
                      <span>14:32</span>
                      <Check className="w-3 h-3 text-emerald-400 inline" />
                      <Check className="w-3 h-3 text-emerald-400 -ml-2 inline" />
                    </div>
                  </div>
                </div>

                {/* Didactic Benefits Banner */}
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-[11px] space-y-1.5 text-slate-300">
                  <span className="font-extrabold text-emerald-400 block text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Por que esta Saudação Gera Vendas?
                  </span>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    <strong className="text-white">Sem Postura de Panfletista:</strong> Você não envia um link de cara. Primeiro você ouve a dor do cliente, criando o gancho perfeito para a Venda Consultiva.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Ready-to-use WhatsApp Scripts Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Roteiros Prontos de Atendimento</span>
                <h3 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                  <PhoneCall className="w-5 h-5 text-emerald-400" />
                  Scripts de WhatsApp Copia e Cola
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Mensagens personalizadas com o nome do seu produto <strong className="text-white">"{title}"</strong> e valor <strong className="text-white">{price}</strong>.
                </p>
              </div>
            </div>

            {/* Scripts Grid */}
            <div className="space-y-4">
              {whatsappScripts.map((item) => (
                <div key={item.id} className="bg-slate-950 border border-slate-800 hover:border-slate-700 transition rounded-2xl p-5 space-y-3">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                        {item.phase}
                      </span>
                      <p className="text-xs text-slate-400 leading-snug">{item.purpose}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyScript(item.message, item.id)}
                      className="self-start sm:self-auto px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copiedScriptId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copiar Mensagem</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/90 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-wrap select-all">
                    {item.message}
                  </div>

                </div>
              ))}
            </div>

            {/* Didactic Golden Rules for WhatsApp */}
            <div className="bg-slate-950 border border-emerald-500/20 p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-black text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                3 Regras de Ouro para Vender Infoprodutos no WhatsApp:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <strong className="text-emerald-400 block mb-1">1. Diga o Nome do Cliente</strong>
                  <span>Sempre pergunte e repita o nome do cliente no atendimento. O som do próprio nome gera aproximação e confiança instantânea.</span>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <strong className="text-emerald-400 block mb-1">2. Prefira Áudios Curtos</strong>
                  <span>Áudios de 30 segundos demonstram humanização. Fale em tom calmo, amigável e confiante sobre o resultado do e-book.</span>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <strong className="text-emerald-400 block mb-1">3. Faça Perguntas no Final</strong>
                  <span>Nunca termine uma mensagem com ponto final solto. Sempre termine com uma pergunta (ex: "Faz sentido pra você?").</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* FINAL CONGRATULATIONS FOOTER BANNER */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 p-6 md:p-8 rounded-3xl text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full w-fit mx-auto border border-emerald-500/20">
          <Sparkles className="w-8 h-8 animate-bounce" />
        </div>

        <div>
          <h3 className="text-xl md:text-2xl font-black text-white">
            🎉 Parabéns! Sua Máquina de Infoprodutos Está 100% Pronta para Vender!
          </h3>
          <p className="text-slate-300 text-xs md:text-sm max-w-2xl mx-auto mt-2 leading-relaxed">
            Você passou por todas as 7 Etapas da Fábrica: criou o <strong className="text-white">E-book</strong>, construiu a <strong className="text-white">Página de Vendas</strong>, seguiu o <strong className="text-white">Checklist de Publicação</strong>, gerou os <strong className="text-white">Anúncios</strong>, definiu o <strong className="text-white">Avatar Ideal</strong>, gravou o <strong className="text-white">Roteiro VSL</strong> e agora domina os <strong className="text-white">Funis de Vendas</strong>!
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onBackToVsl}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Roteiro VSL</span>
          </button>

          {onNextToSocio && (
            <button
              type="button"
              onClick={onNextToSocio}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Avançar para 8ª Etapa: Orientação do Sócio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
