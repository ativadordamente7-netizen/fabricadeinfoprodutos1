import React, { useState } from "react";
import { Shield, Sparkles, AlertCircle, CheckCircle2, ArrowRight, Zap, Target, RefreshCw, Loader2 } from "lucide-react";

export interface TargetAction {
  type: "central_ia" | "wizard" | "socio_estrategico";
  moduleId?: number;
  step?: number;
  label: string;
}

export interface CEOProblemCase {
  id: string;
  label: string;
  problem: string;
  cause: string;
  impact: string;
  solution: string;
  priority: "Alta" | "Média" | "Crítica";
  nextStep: string;
  targetAction?: TargetAction;
  actionPlan: {
    today: string;
    thisWeek: string;
    next30Days: string;
  };
}

export const CEO_PROBLEMS: CEOProblemCase[] = [
  {
    id: "ctr_low",
    label: "Meu CTR está baixo",
    problem: "A taxa de cliques do anúncio está abaixo do padrão do mercado (inferior a 1.2%).",
    cause: "O gancho visual dos primeiros 3 segundos não gera curiosidade ou o texto da imagem não fala diretamente com a dor do público.",
    impact: "Seu CPC e CPM ficam mais caros porque a plataforma entende que seu anúncio não é relevante para as pessoas.",
    solution: "Troque os primeiros 3 segundos do vídeo por um gancho que faça uma pergunta forte sobre a dor do cliente, ou altere a headline da imagem com cores de alto contraste.",
    priority: "Alta",
    nextStep: "Gere 3 novos conceitos de criativos na Central de IA (Módulo 08).",
    targetAction: { type: "central_ia", moduleId: 8, label: "Central de IA • Módulo 08 (Criativos)" },
    actionPlan: {
      today: "Criar 3 imagens com fundo simples e texto gigante de dor.",
      thisWeek: "Subir os 3 novos criativos em um novo conjunto de anúncios.",
      next30Days: "Pausar criativos antigos com CTR abaixo de 1.0%."
    }
  },
  {
    id: "cpm_high",
    label: "Meu CPM aumentou",
    problem: "O custo por 1.000 impressões subiu repentinamente.",
    cause: "Concorrência do leilão em datas comemorativas ou público excessivamente nichado.",
    impact: "Você gasta mais dinheiro para mostrar seu anúncio para a mesma quantidade de pessoas.",
    solution: "Expanda a segmentação para público aberto (sem interesses) deixando o criativo fazer o trabalho de filtragem.",
    priority: "Média",
    nextStep: "Duplique a campanha testando público aberto sem restrição de interesse.",
    targetAction: { type: "central_ia", moduleId: 10, label: "Central de IA • Módulo 10 (Público Ideal)" },
    actionPlan: {
      today: "Criar um conjunto de anúncios com público aberto.",
      thisWeek: "Avaliar o novo CPM em relação ao público antigo.",
      next30Days: "Manter sempre 1 conjunto aberto ativo para estabilizar os custos."
    }
  },
  {
    id: "cpc_expensive",
    label: "Meu CPC está caro",
    problem: "Você está pagando muito caro por cada clique na página de vendas.",
    cause: "Combinação de CTR baixo com leilão concorrido.",
    impact: "Poucas pessoas visitam a página de vendas com o mesmo orçamento.",
    solution: "Melhore a promessa da imagem e da legenda do anúncio para aumentar a taxa de clique.",
    priority: "Alta",
    nextStep: "Ajuste o texto do anúncio para ser extremamente direto sobre o benefício.",
    targetAction: { type: "central_ia", moduleId: 8, label: "Central de IA • Módulo 08 (Criativos)" },
    actionPlan: {
      today: "Testar headline focada em ganho rápido.",
      thisWeek: "Verificar se o CPC caiu para menos de R$ 1,50.",
      next30Days: "Manter taxa de cliques acima de 2.0%."
    }
  },
  {
    id: "page_no_convert",
    label: "Minha página não converte",
    problem: "As pessoas clicam no anúncio e entram na página, mas não iniciam o pagamento.",
    cause: "Quebra de expectativa entre o anúncio e a página, ou tempo de carregamento acima de 3 segundos.",
    impact: "Perda imediata do orçamento de tráfego sem gerar oportunidades de venda.",
    solution: "Certifique-se de que a promessa do anúncio seja exatamente igual ao título principal da página de vendas.",
    priority: "Crítica",
    nextStep: "Verifique o tempo de carregamento da página e alinhe a Headline principal.",
    targetAction: { type: "wizard", step: 5, label: "Fábrica • Página de Vendas (Etapa 5)" },
    actionPlan: {
      today: "Ajustar o título da página para bater com o anúncio.",
      thisWeek: "Otimizar o tamanho das imagens para carregar rápido.",
      next30Days: "Adicionar depoimentos e prova social visível no topo."
    }
  },
  {
    id: "checkout_low",
    label: "Meu checkout converte pouco",
    problem: "Muitos chegam ao checkout (Initiate Checkout), mas poucos concluem a compra.",
    cause: "Opções de pagamento limitadas, falta de selos de segurança ou frete/taxas surpresa.",
    impact: "Perda de vendas no momento final do funil.",
    solution: "Adicione o Pix com desconto instantâneo de 5% e ative a recuperação automática por e-mail e WhatsApp.",
    priority: "Alta",
    nextStep: "Configure o Order Bump no checkout para aumentar a taxa de aprovação.",
    targetAction: { type: "socio_estrategico", step: 8, label: "Sócio Estratégico • Esteira de Upsell (Etapa 8)" },
    actionPlan: {
      today: "Ativar Pix em 1 clique e destacar o botão de compra.",
      thisWeek: "Testar uma oferta de Order Bump barata (ex: R$ 19,90).",
      next30Days: "Implantar sequência de mensagens de recuperação em 15 minutos."
    }
  },
  {
    id: "offer_no_sell",
    label: "Minha oferta não vende",
    problem: "Ninguém compra o produto nem com tráfego qualificado.",
    cause: "O produto resolve um problema que o cliente não considera urgente ou o preço parece desproporcional ao valor percebido.",
    impact: "Estagnação completa das vendas.",
    solution: "Adicione bônus práticos de implementação imediata para aumentar o valor percebido sem aumentar o preço.",
    priority: "Crítica",
    nextStep: "Reformule a oferta adicionando 3 bônus exclusivos na Central de IA (Módulo 03).",
    targetAction: { type: "central_ia", moduleId: 3, label: "Central de IA • Módulo 03 (Criar Oferta)" },
    actionPlan: {
      today: "Definir 3 bônus de ação rápida (Templates/Checklists).",
      thisWeek: "Atualizar a seção de oferta na página de vendas.",
      next30Days: "Fazer oferta de lançamento com prazo limite de escassez."
    }
  },
  {
    id: "creative_saturated",
    label: "Meu criativo saturou",
    problem: "O anúncio que vendia muito bem parou de dar resultados.",
    cause: "Fadiga do anúncio por repetição para a mesma audiência.",
    impact: "Custo por aquisição sobe e o lucro despenca.",
    solution: "Grave uma nova variação do mesmo anúncio com ângulo diferente ou mude apenas a cor de fundo e a primeira frase.",
    priority: "Alta",
    nextStep: "Gere 3 novos criativos derivados do seu anúncio campeão.",
    targetAction: { type: "central_ia", moduleId: 8, label: "Central de IA • Módulo 08 (Criativos)" },
    actionPlan: {
      today: "Alterar a primeira frase do áudio/vídeo do criativo.",
      thisWeek: "Subir 2 novas variações do anúncio campeão.",
      next30Days: "Manter uma esteira constante de renovação de criativos."
    }
  },
  {
    id: "roas_dropped",
    label: "Meu ROAS diminuiu",
    problem: "O retorno sobre o investimento em anúncios caiu ao longo das semanas.",
    cause: "Custo por clique subiu e a taxa de conversão da oferta diminuiu.",
    impact: "Margem de lucro da empresa fica espremida.",
    solution: "Adicione um Order Bump na entrada do checkout e uma oferta complementar de Upsell imediatamente após a compra.",
    priority: "Alta",
    nextStep: "Configure a esteira de upsell para elevar o ticket médio.",
    targetAction: { type: "socio_estrategico", step: 8, label: "Sócio Estratégico • Esteira de Upsell (Etapa 8)" },
    actionPlan: {
      today: "Criar um Order Bump de valor baixo.",
      thisWeek: "Cadastrar a oferta de Upsell para quem compra o produto principal.",
      next30Days: "Recuperar o ROAS acima de 2.5x."
    }
  }
];

interface SalaCEOProps {
  onExecuteStep?: (target: TargetAction) => void;
  onGoToSocioEstrategico?: () => void;
}

export default function SalaCEO({ onExecuteStep, onGoToSocioEstrategico }: SalaCEOProps) {
  const [selectedProblemId, setSelectedProblemId] = useState<string>("ctr_low");
  const [executing, setExecuting] = useState(false);
  const [executionNotice, setExecutionNotice] = useState("");

  const activeProblem = CEO_PROBLEMS.find((p) => p.id === selectedProblemId) || CEO_PROBLEMS[0];

  const handleExecuteNow = (customTarget?: TargetAction) => {
    const actionToRun = customTarget || activeProblem.targetAction || {
      type: "central_ia",
      moduleId: 8,
      label: "Central de IA • Módulo 08 (Criativos)"
    };

    setExecuting(true);
    setExecutionNotice(`🚀 Executando orientação do Sócio... Redirecionando para ${actionToRun.label}`);

    // Scroll to top immediately
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      setExecuting(false);
      if (onExecuteStep) {
        onExecuteStep(actionToRun);
      } else if (onGoToSocioEstrategico) {
        onGoToSocioEstrategico();
      }
    }, 200);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-purple-500/30 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Sócio Estratégico • Sala do CEO
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-display">
              SALA DO CEO • CONSULTORIA DE ESCALA
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl">
              Análise profunda e tomada de decisão estratégica. Selecione o desafio que está travando o seu resultado e receba o plano de ação de um consultor sênior.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shrink-0">
            <span className="text-2xl">💼</span>
            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Sócio Estratégico</span>
              <span className="text-xs font-bold text-purple-400">Consultor de Vendas</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK PROBLEM SELECTOR BUTTONS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
          Selecione a Dificuldade Atual da Sua Operação:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5">
          {CEO_PROBLEMS.map((prob) => {
            const isSelected = prob.id === selectedProblemId;
            return (
              <button
                key={prob.id}
                type="button"
                onClick={() => setSelectedProblemId(prob.id)}
                className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-purple-500/15 border-purple-500 text-purple-300 ring-2 ring-purple-500/30 font-bold"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <span className="text-xs truncate">{prob.label}</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                  prob.priority === "Crítica" ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
                }`}>
                  {prob.priority}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CEO CONSULTANT ANALYSIS REPORT */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* PROBLEM HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-purple-400 tracking-wider">
              Diagnóstico Estratégico do Sócio
            </span>
            <h3 className="text-xl font-black text-white">{activeProblem.label}</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Prioridade de Ação:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase font-mono border ${
              activeProblem.priority === "Crítica"
                ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                : "bg-amber-500/20 border-amber-500/40 text-amber-400"
            }`}>
              {activeProblem.priority}
            </span>
          </div>
        </div>

        {/* 1. IDENTIFIÇÃO E CAUSA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-1">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">📌 1. Identificação do Problema</span>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">{activeProblem.problem}</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-1">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">🔍 2. Causa Raiz</span>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">{activeProblem.cause}</p>
          </div>
        </div>

        {/* 2. IMPACTO E SOLUÇÃO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-1">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">⚡ 3. Impacto no Faturamento</span>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">{activeProblem.impact}</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">💡 4. Solução Estratégica</span>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">{activeProblem.solution}</p>
          </div>
        </div>

        {/* PLANO DE AÇÃO DO CEO */}
        <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-3 font-sans">
          <span className="text-xs font-extrabold text-white uppercase tracking-wider block">📋 Plano de Ação Executivo</span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="text-purple-400 font-bold block text-[10px] uppercase font-mono">HOJE</span>
              <p className="text-slate-300 mt-1">{activeProblem.actionPlan.today}</p>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="text-purple-400 font-bold block text-[10px] uppercase font-mono">ESSA SEMANA</span>
              <p className="text-slate-300 mt-1">{activeProblem.actionPlan.thisWeek}</p>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="text-purple-400 font-bold block text-[10px] uppercase font-mono">PRÓXIMOS 30 DIAS</span>
              <p className="text-slate-300 mt-1">{activeProblem.actionPlan.next30Days}</p>
            </div>
          </div>
        </div>

        {/* EXECUTION BANNER / NOTICE IF EXECUTING */}
        {executing && (
          <div className="bg-purple-950/90 border border-purple-500/60 p-4 rounded-2xl flex items-center justify-between gap-3 text-purple-200 animate-pulse">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin shrink-0" />
              <span className="text-xs font-bold font-mono">{executionNotice}</span>
            </div>
          </div>
        )}

        {/* PRÓXIMO PASSO DO CEO */}
        <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-purple-950/80 border border-purple-500/40 rounded-2xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px] font-bold uppercase border border-purple-500/30">
                Orientação do Sócio Estratégico
              </span>
              {activeProblem.targetAction && (
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold uppercase border border-emerald-500/30">
                  {activeProblem.targetAction.label}
                </span>
              )}
            </div>
            <span className="text-xs font-black text-white block">
              Próximo passo recomendado: <span className="text-purple-300">{activeProblem.nextStep}</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto shrink-0">
            {/* PRIMARY EXECUTE BUTTON */}
            <button
              type="button"
              disabled={executing}
              onClick={() => handleExecuteNow()}
              className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-purple-500 to-emerald-400 hover:from-purple-400 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current text-slate-950" />
              <span>Executar Agora</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            {/* DIRECT BUTTON TO SOCIO ESTRATEGICO (ETAPA 8) */}
            <button
              type="button"
              disabled={executing}
              onClick={() =>
                handleExecuteNow({
                  type: "socio_estrategico",
                  step: 8,
                  label: "Sócio Estratégico • Etapa 8"
                })
              }
              className="w-full sm:w-auto px-4 py-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Ir para Etapa 8 (Sócio)</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
