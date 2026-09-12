import React, { useState } from "react";
import { Sparkles, Copy, Check, ArrowRight, BookOpen, Layers, Zap, MessageSquare, Target, CheckCircle2 } from "lucide-react";
import JornadaAbandonoNotifications from "../JornadaAbandonoNotifications";

export interface AIModuleItem {
  id: number;
  number: string;
  title: string;
  icon: string;
  category: string;
  description: string;
  nextStepRecommended: string;
  nextStepModuleId: number;
  defaultQuestions: {
    niche: string;
    productName: string;
    targetAudience: string;
    mainPromise: string;
    extraContext?: string;
  };
}

export const AI_MODULES_LIST: AIModuleItem[] = [
  {
    id: 1,
    number: "01",
    title: "Criar Produto Digital",
    icon: "📦",
    category: "Criação",
    description: "Estruturação completa de e-book, curso ou mentoria pronto para validação no mercado.",
    nextStepRecommended: "2️⃣ Criar Nome Magnético para o Produto",
    nextStepModuleId: 2,
    defaultQuestions: {
      niche: "Finanças Pessoais / Organização de Dívidas",
      productName: "Manual da Liberdade Financeira",
      targetAudience: "Pessoas endividadas que ganham de 2 a 5 salários mínimos",
      mainPromise: "Sair das dívidas e juntar os primeiros R$ 1.000 em 90 dias sem cortar o cafezinho"
    }
  },
  {
    id: 2,
    number: "02",
    title: "Criar Nome",
    icon: "🏷️",
    category: "Criação",
    description: "Nomes magnéticos, memoráveis e altamente comerciais que vendem sozinhos.",
    nextStepRecommended: "3️⃣ Criar Oferta Irresistível",
    nextStepModuleId: 3,
    defaultQuestions: {
      niche: "Emagrecimento Feminino",
      productName: "E-book de Sucos Detox",
      targetAudience: "Mulheres de 30 a 50 anos sem tempo para academia",
      mainPromise: "Desinchar a barriga em 7 dias com ingredientes simples do supermercado"
    }
  },
  {
    id: 3,
    number: "03",
    title: "Criar Oferta",
    icon: "💎",
    category: "Oferta",
    description: "Empacotamento de valor com ancoragem de preço, bônus e garantia inquebrável.",
    nextStepRecommended: "4️⃣ Criar Página de Vendas de Alta Conversão",
    nextStepModuleId: 4,
    defaultQuestions: {
      niche: "Produtividade com IA",
      productName: "Pack de Prompts Mestre",
      targetAudience: "Profissionais liberais e freelancers",
      mainPromise: "Economizar 20 horas de trabalho por semana usando inteligência artificial"
    }
  },
  {
    id: 4,
    number: "04",
    title: "Criar Página de Vendas",
    icon: "🌐",
    category: "Conversão",
    description: "Estrutura e textos persuasivos de alta conversão para transformar visitantes em compradores.",
    nextStepRecommended: "5️⃣ Criar Checkout de Alta Conversão",
    nextStepModuleId: 5,
    defaultQuestions: {
      niche: "Doces Gourmet",
      productName: "Curso Brigadeiro Perfeito",
      targetAudience: "Mães que querem renda extra trabalhando em casa",
      mainPromise: "Faturar de R$ 2.000 a R$ 5.000 por mês vendendo brigadeiros gourmet"
    }
  },
  {
    id: 5,
    number: "05",
    title: "Criar Checkout",
    icon: "💳",
    category: "Conversão",
    description: "Configuração de checkout, order bumps e escassez no momento do pagamento.",
    nextStepRecommended: "6️⃣ Criar Copy de Vendas Completa",
    nextStepModuleId: 6,
    defaultQuestions: {
      niche: "Cursos Online",
      productName: "Método Infoproduto em 7 Dias",
      targetAudience: "Iniciantes no Marketing Digital",
      mainPromise: "Colocar o primeiro infoproduto no ar em menos de uma semana"
    }
  },
  {
    id: 6,
    number: "06",
    title: "Criar Copy",
    icon: "✍️",
    category: "Copywriting",
    description: "Copywriting persuasivo com gatilhos de dor, prazer e quebra de objeções.",
    nextStepRecommended: "7️⃣ Criar Headlines Impactantes",
    nextStepModuleId: 7,
    defaultQuestions: {
      niche: "Adestramento Canino",
      productName: "Cão Obediente em Casa",
      targetAudience: "Donos de cães que roem móveis e latem demais",
      mainPromise: "Adestrar seu cão em 15 minutos por dia sem maus-tratos"
    }
  },
  {
    id: 7,
    number: "07",
    title: "Criar Headlines",
    icon: "📰",
    category: "Copywriting",
    description: "Titulos com gancho forte para prender a atenção do público nos primeiros 3 segundos.",
    nextStepRecommended: "8️⃣ Criar Criativos para Anúncios",
    nextStepModuleId: 8,
    defaultQuestions: {
      niche: "Skincare Natural",
      productName: "Guia da Pele Perfeita",
      targetAudience: "Mulheres preocupadas com rugas e acnes",
      mainPromise: "Rejuvenascer a pele do rosto usando receitas naturais baratas"
    }
  },
  {
    id: 8,
    number: "08",
    title: "Criar Criativos",
    icon: "🎨",
    category: "Tráfego",
    description: "Roteiros e conceitos visuais para imagens e vídeos que geram cliques baratos.",
    nextStepRecommended: "9️⃣ Criar Anúncios de Alta Performance",
    nextStepModuleId: 9,
    defaultQuestions: {
      niche: "Investimentos em Ações",
      productName: "Guia Primeiros Passos na Bolsa",
      targetAudience: "Jovens adultos que deixam dinheiro parado na poupança",
      mainPromise: "Fazer o dinheiro render 3x mais que a poupança com segurança"
    }
  },
  {
    id: 9,
    number: "09",
    title: "Criar Anúncios",
    icon: "📢",
    category: "Tráfego",
    description: "Textos e ganchos comerciais otimizados para Meta Ads e Google Ads.",
    nextStepRecommended: "🔟 Definir Público Ideal para Anúncios",
    nextStepModuleId: 10,
    defaultQuestions: {
      niche: "Desenvolvimento Pessoal",
      productName: "Manual da Mente Inabalável",
      targetAudience: "Pessoas com ansiedade e procrastinação",
      mainPromise: "Eliminar a procrastinação e ter disciplina diária"
    }
  },
  {
    id: 10,
    number: "10",
    title: "Criar Público Ideal",
    icon: "🎯",
    category: "Segmentação",
    description: "Mapeamento dos interesses, comportamentos e segmentação exata para tráfego pago.",
    nextStepRecommended: "11 Criar Avatar Detalhado",
    nextStepModuleId: 11,
    defaultQuestions: {
      niche: "Aulas de Violão",
      productName: "Violão do Zero em 30 Dias",
      targetAudience: "Iniciantes de 20 a 60 anos que gostam de música sertaneja e pop",
      mainPromise: "Tocar as primeiras 10 músicas no violão sem ler partitura"
    }
  },
  {
    id: 11,
    number: "11",
    title: "Criar Avatar",
    icon: "👤",
    category: "Segmentação",
    description: "Perfil profundo do cliente ideal: dores noturnas, desejos secretos e objeções reais.",
    nextStepRecommended: "12 Criar VSL (Vídeo de Vendas)",
    nextStepModuleId: 12,
    defaultQuestions: {
      niche: "Organização Doméstica",
      productName: "Cozinha Organizada",
      targetAudience: "Donas de casa e mães sobrecarregadas",
      mainPromise: "Manter a casa limpa e organizada gasta apenas 20min por dia"
    }
  },
  {
    id: 12,
    number: "12",
    title: "Criar VSL",
    icon: "🎥",
    category: "Vídeo",
    description: "Roteiro completo de Vídeo de Vendas em formato de carta de vendas narrada.",
    nextStepRecommended: "13 Criar Funil de Vendas",
    nextStepModuleId: 13,
    defaultQuestions: {
      niche: "Nutrição Esportiva",
      productName: "Dieta Flexível sem Sofrimento",
      targetAudience: "Praticantes de musculação",
      mainPromise: "Ganhar massa magra e secar gordura comendo o que gosta"
    }
  },
  {
    id: 13,
    number: "13",
    title: "Criar Funil",
    icon: "⏳",
    category: "Estratégia",
    description: "Arquitetura do funil de vendas (Direto, VSL, Captura ou WhatsApp).",
    nextStepRecommended: "14 Criar Automação de Vendas",
    nextStepModuleId: 14,
    defaultQuestions: {
      niche: "Inglês para Viagens",
      productName: "Inglês de Sobrevivência",
      targetAudience: "Viajantes que vão para o exterior em breve",
      mainPromise: "Se comunicar com confiança no aeroporto, hotel e restaurante"
    }
  },
  {
    id: 14,
    number: "14",
    title: "Criar Automação",
    icon: "🤖",
    category: "Escala",
    description: "Gatilhos de automação de remarketing, abandono de carrinho e recuperação de boletos.",
    nextStepRecommended: "15 Criar Sequência de WhatsApp",
    nextStepModuleId: 15,
    defaultQuestions: {
      niche: "E-commerce de Roupas",
      productName: "Marca Própria de Moda",
      targetAudience: "Empreendedoras de moda feminina",
      mainPromise: "Montar uma loja online de roupas sem estoque inicial"
    }
  },
  {
    id: 15,
    number: "15",
    title: "Criar Sequência WhatsApp",
    icon: "💬",
    category: "Vendas",
    description: "Script de conversão no X1 para fechar vendas pelo WhatsApp.",
    nextStepRecommended: "16 Criar Email Marketing",
    nextStepModuleId: 16,
    defaultQuestions: {
      niche: "Infoprodutos de Alto Ticket",
      productName: "Mentoria de Negócios",
      targetAudience: "Empresários e prestadores de serviço",
      mainPromise: "Aumentar o faturamento em 50% em 90 dias com processos comerciais"
    }
  },
  {
    id: 16,
    number: "16",
    title: "Criar Email Marketing",
    icon: "✉️",
    category: "Copywriting",
    description: "Sequência de e-mails de doutrinação, oferta e encerramento de carrinho.",
    nextStepRecommended: "17 Criar Reels Virais",
    nextStepModuleId: 17,
    defaultQuestions: {
      niche: "Marketing de Conteúdo",
      productName: "Calendário de 365 Dias de Posts",
      targetAudience: "Criadores de conteúdo e profissionais liberais",
      mainPromise: "Nunca mais ficar sem saber o que postar nas redes sociais"
    }
  },
  {
    id: 17,
    number: "17",
    title: "Criar Reels",
    icon: "📱",
    category: "Redes Sociais",
    description: "Roteiros curtos e ganchos virais para atração orgânica no Instagram e TikTok.",
    nextStepRecommended: "18 Criar Carrossel Educativo",
    nextStepModuleId: 18,
    defaultQuestions: {
      niche: "Fotografia com Celular",
      productName: "Fotos Profissionais com Celular",
      targetAudience: "Entusiastas e pequenos lojistas",
      mainPromise: "Tirar fotos incríveis de produtos e retratos usando apenas o celular"
    }
  },
  {
    id: 18,
    number: "18",
    title: "Criar Carrossel",
    icon: "📊",
    category: "Redes Sociais",
    description: "Estrutura de slides para carrosséis educativos de alto salvamento e compartilhamento.",
    nextStepRecommended: "19 Criar Stories que Vendem",
    nextStepModuleId: 19,
    defaultQuestions: {
      niche: "Organização Financeira",
      productName: "Planilha da Riqueza",
      targetAudience: "Casais que querem organizar o orçamento juntos",
      mainPromise: "Organizar as finanças do casal em 30 minutos por semana"
    }
  },
  {
    id: 19,
    number: "19",
    title: "Criar Stories",
    icon: "📸",
    category: "Redes Sociais",
    description: "Sequência diária de Stories para engajar, conectar e vender todos os dias.",
    nextStepRecommended: "20 Criar Estratégia de Escala",
    nextStepModuleId: 20,
    defaultQuestions: {
      niche: "Concursos Públicos",
      productName: "Guia do Concursado",
      targetAudience: "Estudantes para carreiras administrativas",
      mainPromise: "Ser aprovado em concurso público estudando 2h por dia"
    }
  },
  {
    id: 20,
    number: "20",
    title: "Criar Escala",
    icon: "🚀",
    category: "Escala",
    description: "Plano de aumento de orçamento em anúncios e expansão para esteira de produtos.",
    nextStepRecommended: "🎉 Parabéns! Você completou a Central de IA do Infinity Million OS!",
    nextStepModuleId: 1,
    defaultQuestions: {
      niche: "Infoproduto Validados com Vendas",
      productName: "Método Infoproduto Escalável",
      targetAudience: "Produtores que já vendem de R$ 1k a R$ 10k/mês",
      mainPromise: "Escalar de R$ 10k para R$ 100k por mês mantendo o ROAS acima de 2.0"
    }
  }
];

interface CentralIAProps {
  initialModuleId?: number;
}

export default function CentralIA({ initialModuleId = 1 }: CentralIAProps) {
  const [selectedModuleId, setSelectedModuleId] = useState<number>(initialModuleId);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  React.useEffect(() => {
    if (initialModuleId && initialModuleId !== selectedModuleId) {
      handleSelectModule(initialModuleId);
    }
  }, [initialModuleId]);

  // Form Inputs for active module
  const activeModule = AI_MODULES_LIST.find((m) => m.id === selectedModuleId) || AI_MODULES_LIST[0];
  const [niche, setNiche] = useState(activeModule.defaultQuestions.niche);
  const [productName, setProductName] = useState(activeModule.defaultQuestions.productName);
  const [targetAudience, setTargetAudience] = useState(activeModule.defaultQuestions.targetAudience);
  const [mainPromise, setMainPromise] = useState(activeModule.defaultQuestions.mainPromise);
  const [extraDetails, setExtraDetails] = useState("");

  // Update inputs when switching modules
  const handleSelectModule = (id: number) => {
    setSelectedModuleId(id);
    const mod = AI_MODULES_LIST.find((m) => m.id === id) || AI_MODULES_LIST[0];
    setNiche(mod.defaultQuestions.niche);
    setProductName(mod.defaultQuestions.productName);
    setTargetAudience(mod.defaultQuestions.targetAudience);
    setMainPromise(mod.defaultQuestions.mainPromise);
    setExtraDetails("");
  };

  // Generate Prompt content dynamically based on current user inputs
  const generatedPromptText = `[PROMPT PROFISSIONAL - INFINITY MILLION OS]
Atue como um especialista em Marketing Digital e Copywriting de alta conversão.
Estou criando o projeto no módulo "${activeModule.title}".

DADOS DO PROJETO:
- Nicho de Atuação: ${niche || "[Insira o Nicho]"}
- Nome do Produto: ${productName || "[Insira o Nome do Produto]"}
- Público-Alvo: ${targetAudience || "[Insira o Público-Alvo]"}
- Promessa Principal: ${mainPromise || "[Insira a Promessa]"}
${extraDetails ? `- Detalhes Adicionais: ${extraDetails}` : ""}

SUA TAREFA:
Desenvolva o entregável para "${activeModule.title}" de forma extremamente prática, direta e intuitiva para iniciantes.
1. Entregue um passo a passo pronto para ser executado hoje.
2. Forneça o texto final pronto para copiar e colar.
3. Não use jargões complexos sem explicar.
4. Finalize com a exata orientação de qual é o próximo passo prático do projeto.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Módulos de Criação Estratégica
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-display">
              CENTRAL DE IA • INFINITY MILLION
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl">
              Escolha o que deseja criar entre os 20 módulos essenciais. Respondemos tudo de forma simples, prática e intuitiva sem pular etapas.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shrink-0">
            <span className="text-2xl">{activeModule.icon}</span>
            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Módulo Ativo</span>
              <span className="text-xs font-bold text-emerald-400">{activeModule.number} - {activeModule.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 20 MODULES HORIZONTAL GRID / SELECTOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-3">
          Escolha o que deseja criar (20 Módulos de Execução):
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {AI_MODULES_LIST.map((mod) => {
            const isSelected = mod.id === selectedModuleId;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => handleSelectModule(mod.id)}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-500/15 border-emerald-500 text-white ring-2 ring-emerald-500/30"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <span className="text-base shrink-0">{mod.icon}</span>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-mono font-bold text-emerald-400 block">{mod.number}</span>
                  <span className={`text-xs font-bold truncate block ${isSelected ? "text-emerald-300" : "text-slate-300"}`}>
                    {mod.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE MODULE INTERACTIVE WORKSHOP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: MINIMAL QUESTIONNAIRE */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-md flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
              <span className="text-xl">{activeModule.icon}</span>
              <div>
                <h3 className="text-sm font-black text-white">{activeModule.title}</h3>
                <p className="text-[11px] text-slate-400">{activeModule.description}</p>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-3">
              Perguntas Necessárias:
            </span>

            <div className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Nicho do Produto:</label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="Ex: Emagrecimento, Finanças, Doces"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Nome do Produto:</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: Manual do Faturamento Rápido"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Público-Alvo:</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Ex: Mães iniciantes, Homens de 25-40 anos"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Promessa Principal:</label>
                <textarea
                  rows={2}
                  value={mainPromise}
                  onChange={(e) => setMainPromise(e.target.value)}
                  placeholder="Ex: Faturar R$ 3.000 em 30 dias sem aparecer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Detalhes Adicionais (Opcional):</label>
                <input
                  type="text"
                  value={extraDetails}
                  onChange={(e) => setExtraDetails(e.target.value)}
                  placeholder="Ex: Bônus de suporte ou garantia estendida"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-[11px] text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Preencha os campos acima para atualizar o prompt e a estratégia em tempo real!</span>
          </div>
        </div>

        {/* RIGHT COLUMN: DELIVERABLES SUMMARY */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-md flex flex-col gap-5">
          
          {/* 1. ESTRATÉGIA */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <span>✔</span>
              <span>Estratégia do Módulo</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Para o módulo <strong>"{activeModule.title}"</strong> no nicho de <strong>{niche || "seu produto"}</strong>, a estratégia principal consiste em atrair o público ideal de <strong>{targetAudience || "clientes"}</strong> demonstrando clareza total na transformação e reduzindo os riscos de decisão.
            </p>
          </div>

          {/* 2. EXPLICAÇÃO */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <span>✔</span>
              <span>Explicação Didática</span>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p><strong>Para que serve:</strong> Serve para construir o pilar de {activeModule.title.toLowerCase()} com autoridade e alta taxa de conversão.</p>
              <p><strong>Quando usar:</strong> Utilize no início da criação do produto e no ajuste fino do seu funil comercial.</p>
              <p><strong>Por que funciona:</strong> Elimina o achismo do aluno e aplica a estrutura de persuasão testada em milhares de vendas no mercado digital.</p>
            </div>
          </div>

          {/* 3. PROMPT PRONTO */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 relative">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-850">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <span>✔</span>
                <span>Prompt Pronto de Alta Precisão</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? "Copiado!" : "Copiar Prompt"}</span>
              </button>
            </div>

            <pre className="bg-slate-900 border border-slate-850 rounded-lg p-3 text-[11px] font-mono text-emerald-300/90 whitespace-pre-wrap overflow-x-auto leading-relaxed">
              {generatedPromptText}
            </pre>
          </div>

          {/* JORNADA DE NOTIFICAÇÕES INTERATIVA (DISPONÍVEL EM AUTOMAÇÃO, WHATSAPP & EMAIL) */}
          {(activeModule.id === 14 || activeModule.id === 15 || activeModule.id === 16) && (
            <div className="pt-2">
              <JornadaAbandonoNotifications
                productName={productName || "E-book Digital"}
                niche={niche || "Seu Segmento"}
                targetAudience={targetAudience}
              />
            </div>
          )}

          {/* 4. COMO UTILIZAR */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <span>✔</span>
              <span>Como Utilizar na Prática</span>
            </div>
            <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed">
              <li>Clique no botão acima para copiar o prompt customizado.</li>
              <li>Cole no seu assistente de inteligência artificial ou no chat da plataforma.</li>
              <li>Revise a resposta gerada e aplique na sua estrutura de vendas.</li>
            </ol>
          </div>

          {/* 5. PRÓXIMO PASSO RECOMENDADO */}
          <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Sequência Lógica do Infinity Million</span>
              <span className="text-xs font-black text-white block mt-0.5">
                Próxima etapa recomendada: <span className="text-emerald-400">{activeModule.nextStepRecommended}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleSelectModule(activeModule.nextStepModuleId)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] uppercase tracking-wider rounded-lg shadow-md transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Avançar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
