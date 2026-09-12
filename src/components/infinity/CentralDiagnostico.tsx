import React, { useState } from "react";
import { Stethoscope, AlertTriangle, CheckCircle2, TrendingUp, HelpCircle, ArrowRight, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";

export default function CentralDiagnostico() {
  // Diagnostic Questions State
  const [currentStep, setCurrentStep] = useState(0);

  const [invested, setInvested] = useState("500");
  const [revenue, setRevenue] = useState("1200");
  const [salesCount, setSalesCount] = useState("12");
  const [ctr, setCtr] = useState("1.8");
  const [cpm, setCpm] = useState("35.00");
  const [cpc, setCpc] = useState("1.90");
  const [cpa, setCpa] = useState("41.60");
  const [roas, setRoas] = useState("2.4");
  const [ticket, setTicket] = useState("97.00");
  const [pageConv, setPageConv] = useState("2.5");
  const [checkoutConv, setCheckoutConv] = useState("12.0");
  const [campaignTime, setCampaignTime] = useState("7 dias");
  const [campaignGoal, setCampaignGoal] = useState("Vendas Diretas no Checkout (Conversão)");

  const [isGenerated, setIsGenerated] = useState(false);

  // Diagnostic questions configuration
  const questions = [
    { label: "Quanto você investiu em anúncios até agora?", value: invested, setter: setInvested, unit: "R$", placeholder: "Ex: 500" },
    { label: "Quanto você faturou com as vendas?", value: revenue, setter: setRevenue, unit: "R$", placeholder: "Ex: 1200" },
    { label: "Quantas vendas foram realizadas?", value: salesCount, setter: setSalesCount, unit: "vendas", placeholder: "Ex: 12" },
    { label: "Qual é o CTR (Taxa de Clique) médio do seu anúncio?", value: ctr, setter: setCtr, unit: "%", placeholder: "Ex: 1.8 (Ideal acima de 1.5%)" },
    { label: "Qual é o CPM (Custo por 1.000 Impressões)?", value: cpm, setter: setCpm, unit: "R$", placeholder: "Ex: 35.00" },
    { label: "Qual é o CPC (Custo por Clique)?", value: cpc, setter: setCpc, unit: "R$", placeholder: "Ex: 1.90" },
    { label: "Qual é o CPA (Custo por Aquisição / Venda)?", value: cpa, setter: setCpa, unit: "R$", placeholder: "Ex: 41.60" },
    { label: "Qual é o seu ROAS (Retorno Sobre o Investimento)?", value: roas, setter: setRoas, unit: "x", placeholder: "Ex: 2.4" },
    { label: "Qual é o Ticket Médio do seu produto?", value: ticket, setter: setTicket, unit: "R$", placeholder: "Ex: 97.00" },
    { label: "Qual é a Conversão estimada da Página de Vendas?", value: pageConv, setter: setPageConv, unit: "%", placeholder: "Ex: 2.5 (Ideal 2% a 5%)" },
    { label: "Qual é a Conversão do Checkout (Initiate Checkout -> Compra)?", value: checkoutConv, setter: setCheckoutConv, unit: "%", placeholder: "Ex: 12.0 (Ideal 10% a 20%)" },
    { label: "Há quanto tempo a campanha está rodando?", value: campaignTime, setter: setCampaignTime, unit: "", placeholder: "Ex: 7 dias" },
    { label: "Qual o objetivo principal da campanha?", value: campaignGoal, setter: setCampaignGoal, unit: "", placeholder: "Ex: Vendas no Checkout, Lead ou WhatsApp" }
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsGenerated(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Perform Diagnostic Calculations
  const invNum = parseFloat(invested) || 0;
  const revNum = parseFloat(revenue) || 0;
  const ctrNum = parseFloat(ctr) || 0;
  const pageConvNum = parseFloat(pageConv) || 0;
  const checkConvNum = parseFloat(checkoutConv) || 0;
  const profit = revNum - invNum;
  const isProfitable = profit >= 0;

  // Determine Bottleneck
  let bottleneck = "Otimização Geral de Tráfego";
  let whyHappened = "As métricas de topo de funil precisam ser ajustadas.";

  if (ctrNum < 1.2) {
    bottleneck = "Gargalo no Anúncio / Criativo (CTR Baixo)";
    whyHappened = "Seu anúncio não está chamando a atenção nos primeiros 3 segundos. O público rola o feed sem clicar.";
  } else if (pageConvNum < 1.5) {
    bottleneck = "Gargalo na Página de Vendas (Baixa Conversão)";
    whyHappened = "As pessoas clicam no anúncio, mas ao chegar na página não encontram uma oferta persuasiva ou o tempo de carregamento está lento.";
  } else if (checkConvNum < 8.0) {
    bottleneck = "Gargalo no Checkout (Abandono de Carrinho)";
    whyHappened = "O cliente se interessa pela oferta, mas trava na hora de preencher os dados de pagamento (falta de parcelamento flexível ou opções Pix).";
  } else if (!isProfitable) {
    bottleneck = "Gargalo na Margem do Produto / Custo de Aquisição (CPA Alto)";
    whyHappened = "O custo por venda está maior que o lucro do produto. Necessário adicionar order bump ou aumentar o ticket médio.";
  }

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5" />
                Diagnóstico Inteligente Antigargalo
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-display">
              CENTRAL DE DIAGNÓSTICO • INFINITY MILLION
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl">
              Descubra exatamente onde você está perdendo dinheiro. Respondemos uma pergunta por vez para mapear seus gargalos de tráfego, página e checkout.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-lg">
              🩺
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Diagnóstico do Aluno</span>
              <span className="text-xs font-bold text-teal-400">Consultoria de Métricas</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUESTIONNAIRE OR REPORT VIEW */}
      {!isGenerated ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl max-w-2xl mx-auto w-full flex flex-col gap-6">
          
          {/* STEP INDICATOR */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest">
              Pergunta {currentStep + 1} de {questions.length}
            </span>
            <div className="w-32 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-teal-500 h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* ACTIVE QUESTION CARD */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-white leading-snug">
              {questions[currentStep].label}
            </h3>

            <div className="relative">
              <input
                type="text"
                value={questions[currentStep].value}
                onChange={(e) => questions[currentStep].setter(e.target.value)}
                placeholder={questions[currentStep].placeholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white font-medium focus:outline-none focus:border-teal-500"
              />
              {questions[currentStep].unit && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 font-bold">
                  {questions[currentStep].unit}
                </span>
              )}
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={handlePrev}
              className="px-4 py-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 text-xs font-bold rounded-xl disabled:opacity-30 cursor-pointer"
            >
              Anterior
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <span>{currentStep === questions.length - 1 ? "Gerar Diagnóstico" : "Próxima Pergunta"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* GENERATED DIAGNOSTIC REPORT */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-teal-400 tracking-wider">Relatório Gerado</span>
              <h3 className="text-xl font-black text-white">DIAGNOSTICO GERAL DE PERFORMANCE</h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsGenerated(false);
                setCurrentStep(0);
              }}
              className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
              <span>Refazer Diagnóstico</span>
            </button>
          </div>

          {/* DIAGNOSTIC SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Investimento</span>
              <span className="text-base font-extrabold text-white">R$ {invested}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Faturamento</span>
              <span className="text-base font-extrabold text-emerald-400">R$ {revenue}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Lucro Estimado</span>
              <span className={`text-base font-extrabold ${profit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                R$ {profit.toFixed(2)}
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">ROAS do Projeto</span>
              <span className="text-base font-extrabold text-teal-400">{roas}x</span>
            </div>
          </div>

          {/* DETAILED CONSULTANT REPORT */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
            
            {/* ONDE ESTÁ O GARGALO */}
            <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-500/40">
              <div className="flex items-center gap-2 text-teal-400 font-extrabold text-sm mb-1 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Onde está o Gargalo Principal</span>
              </div>
              <h4 className="text-base font-black text-white">{bottleneck}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                <strong>Por que aconteceu:</strong> {whyHappened}
              </p>
            </div>

            {/* AÇÕES DE PRIORIDADE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-rose-500/40 p-4 rounded-xl">
                <span className="text-[10px] font-bold font-mono text-rose-400 uppercase tracking-widest block mb-1">🔴 Prioridade Alta</span>
                <p className="text-xs font-bold text-white">Ajustar os 3 primeiros segundos do criativo para elevar o CTR acima de 1.5%.</p>
              </div>

              <div className="bg-slate-900 border border-amber-500/40 p-4 rounded-xl">
                <span className="text-[10px] font-bold font-mono text-amber-400 uppercase tracking-widest block mb-1">🟡 Prioridade Média</span>
                <p className="text-xs font-bold text-white">Adicionar Order Bump no checkout para aumentar o ticket médio.</p>
              </div>

              <div className="bg-slate-900 border border-emerald-500/40 p-4 rounded-xl">
                <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-widest block mb-1">🟢 Prioridade Baixa</span>
                <p className="text-xs font-bold text-white">Testar variações de cores na headline da página de vendas.</p>
              </div>
            </div>

            {/* O QUE FAZER / O QUE NÃO FAZER */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-teal-400 font-bold block mb-2 uppercase">⚡ O que fazer primeiro:</span>
                <p>Gravar ou montar 3 novos criativos de variação focado em dor direta.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-emerald-400 font-bold block mb-2 uppercase">🔜 O que fazer depois:</span>
                <p>Criar sequência de recuperação de boletos e Pix via WhatsApp.</p>
              </div>

              <div className="bg-slate-900 border border-rose-500/30 p-4 rounded-xl space-y-1">
                <span className="text-rose-400 font-bold block mb-2 uppercase">🚫 O que NÃO deve fazer:</span>
                <p>Não aumente o orçamento antes de consertar a taxa de conversão do criativo e do checkout.</p>
              </div>
            </div>

            {/* PLANO DE AÇÃO EM PRAZOS */}
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-xl space-y-3 font-sans">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider block">📋 Plano de Ação Estruturado</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-teal-400 font-bold block text-[10px] uppercase font-mono">HOJE</span>
                  <p className="text-slate-300 mt-1">Trocar a imagem e o título do anúncio principal.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-teal-400 font-bold block text-[10px] uppercase font-mono">ESSA SEMANA</span>
                  <p className="text-slate-300 mt-1">Configurar oferta com bônus surpresa na página de vendas.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-teal-400 font-bold block text-[10px] uppercase font-mono">PRÓXIMOS 30 DIAS</span>
                  <p className="text-slate-300 mt-1">Iniciar escala horizontal duplicando os conjuntos campeões.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
