import React, { useState } from "react";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  PieChart,
  RefreshCw,
  Zap,
  Target
} from "lucide-react";

export default function SimuladorViabilidade() {
  const [budget, setBudget] = useState<number>(500);
  const [cpm, setCpm] = useState<number>(25);
  const [ctr, setCtr] = useState<number>(2.5);
  const [pageConversion, setPageConversion] = useState<number>(3.0);
  const [ticketPrice, setTicketPrice] = useState<number>(47);

  // Math Calculations
  const calculatedImpressions = cpm > 0 ? Math.floor((budget / cpm) * 1000) : 0;
  const calculatedClicks = Math.floor(calculatedImpressions * (ctr / 100));
  const calculatedCpc = calculatedClicks > 0 ? budget / calculatedClicks : 0;
  const calculatedSales = Math.floor(calculatedClicks * (pageConversion / 100));
  const estimatedRevenue = calculatedSales * ticketPrice;
  const estimatedNetProfit = estimatedRevenue - budget;
  const estimatedRoas = budget > 0 ? (estimatedRevenue / budget).toFixed(2) : "0.00";
  const estimatedRoi = budget > 0 ? (((estimatedRevenue - budget) / budget) * 100).toFixed(1) : "0.0";

  return (
    <div className="w-full flex flex-col gap-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/80 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                Simulador Financeiro • Infinity Million OS
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white font-display tracking-tight">
              SIMULADOR DE VIABILIDADE & PROJEÇÃO DE TRÁFEGO
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Projete cenários de retorno financeiro ajustando seu orçamento de tráfego pago, métricas de anúncios e taxas de conversão da página de vendas.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Projeção ROAS</span>
              <span className="text-sm font-black text-emerald-400">{estimatedRoas}x</span>
            </div>
          </div>
        </div>

        {/* DISCLAIMER WARNING */}
        <div className="mt-6 bg-slate-950/90 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-slate-300 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-amber-300">Aviso importante de transparência:</strong> As estimativas apresentadas abaixo são calculadas matematicamente com base nos valores informados por você. Trata-se de uma ferramenta de planejamento e simulação de cenários, e <strong>não representa garantia de resultados financeiros ou de faturamento</strong>.
          </p>
        </div>
      </div>

      {/* INPUTS & RESULTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT CONTROLS PANEL */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <h3 className="text-sm font-black text-white uppercase font-mono tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Zap className="w-4 h-4 text-emerald-400" />
            Parâmetros da Simulação
          </h3>

          {/* BUDGET */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-200">Orçamento de Tráfego (R$)</label>
              <span className="text-emerald-400 font-mono font-bold">R$ {budget}</span>
            </div>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* CPM */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-200">CPM estimado (Custo por 1.000 Impr.)</label>
              <span className="text-emerald-400 font-mono font-bold">R$ {cpm}</span>
            </div>
            <input
              type="number"
              value={cpm}
              onChange={(e) => setCpm(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500 block">Média de mercado no Brasil: R$ 15,00 a R$ 35,00.</span>
          </div>

          {/* CTR */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-200">CTR do Anúncio (% de Cliques)</label>
              <span className="text-emerald-400 font-mono font-bold">{ctr}%</span>
            </div>
            <input
              type="number"
              step="0.1"
              value={ctr}
              onChange={(e) => setCtr(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500 block">CTR recomendado: acima de 2.0%.</span>
          </div>

          {/* PAGE CONVERSION */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-200">Taxa de Conversão da Página (%)</label>
              <span className="text-emerald-400 font-mono font-bold">{pageConversion}%</span>
            </div>
            <input
              type="number"
              step="0.1"
              value={pageConversion}
              onChange={(e) => setPageConversion(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500 block">Média de páginas de vendas diretas: 1.5% a 4.0%.</span>
          </div>

          {/* TICKET PRICE */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-200">Ticket Médio do Produto (R$)</label>
              <span className="text-emerald-400 font-mono font-bold">R$ {ticketPrice}</span>
            </div>
            <input
              type="number"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setBudget(1000);
              setCpm(20);
              setCtr(3.0);
              setPageConversion(3.5);
              setTicketPrice(97);
            }}
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Carregar Cenário Otimizado (R$ 97)</span>
          </button>
        </div>

        {/* SIMULATION RESULTS DISPLAY */}
        <div className="lg:col-span-7 space-y-5">
          {/* TOP SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Faturamento Bruto Projetado</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">
                R$ {estimatedRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {calculatedSales} vendas a R$ {ticketPrice},00
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Lucro Líquido Projetado</span>
              <span className={`text-2xl font-black mt-1 block ${estimatedNetProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                R$ {estimatedNetProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                ROI Líquido de <strong className="text-white">{estimatedRoi}%</strong>
              </span>
            </div>
          </div>

          {/* DETAILED FUNNEL BREAKDOWN */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase font-mono tracking-wider">
              Funil de Projeção Detalhado
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block font-bold">1. Impressões Estimadas (Anúncio)</span>
                  <span className="text-[10px] text-slate-500">Pessoas que viram o anúncio na tela</span>
                </div>
                <span className="text-sm font-black text-white">{calculatedImpressions.toLocaleString("pt-BR")}</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block font-bold">2. Cliques no Anúncio (CTR {ctr}%)</span>
                  <span className="text-[10px] text-slate-500">CPC Calculado: R$ {calculatedCpc.toFixed(2)}</span>
                </div>
                <span className="text-sm font-black text-emerald-400">{calculatedClicks.toLocaleString("pt-BR")}</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block font-bold">3. Vendas Estimadas (Conversão {pageConversion}%)</span>
                  <span className="text-[10px] text-slate-500">Custo por Aquisição (CPA): R$ {calculatedSales > 0 ? (budget / calculatedSales).toFixed(2) : "0.00"}</span>
                </div>
                <span className="text-sm font-black text-amber-400">{calculatedSales} Vendas</span>
              </div>
            </div>

            {/* STRATEGIC INSIGHT */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs space-y-1">
              <span className="text-emerald-400 font-extrabold uppercase text-[10px] font-mono block">
                💡 Diagnóstico Rápido da Simulação:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {estimatedNetProfit > 0
                  ? `Com um investimento de R$ ${budget}, você obtém retorno positivo de R$ ${estimatedNetProfit.toFixed(2)}. Para escalar este resultado, mantenha o CTR acima de ${ctr}% gerando novos criativos na Central de IA.`
                  : "Nesta simulação a operação está em prejuízo. Recomendamos aumentar o ticket médio ou melhorar a conversão da página na Fábrica de Infoprodutos."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
