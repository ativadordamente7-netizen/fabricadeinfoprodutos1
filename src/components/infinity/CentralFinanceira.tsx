import React, { useState } from "react";
import { DollarSign, TrendingUp, PieChart, ShieldCheck, ArrowUpRight, BarChart3, Target, AlertCircle, Wallet } from "lucide-react";

export default function CentralFinanceira() {
  const [revenue, setRevenue] = useState("5000");
  const [costs, setCosts] = useState("500");
  const [adSpend, setAdSpend] = useState("1500");
  const [capitalAvailable, setCapitalAvailable] = useState("3000");
  const [reserve, setReserve] = useState("1000");
  const [monthlyGoal, setMonthlyGoal] = useState("15000");

  const revNum = parseFloat(revenue) || 0;
  const costNum = parseFloat(costs) || 0;
  const adNum = parseFloat(adSpend) || 0;
  const capNum = parseFloat(capitalAvailable) || 0;
  const goalNum = parseFloat(monthlyGoal) || 10000;

  const totalCosts = costNum + adNum;
  const profit = revNum - totalCosts;
  const marginPercent = revNum > 0 ? ((profit / revNum) * 100).toFixed(1) : "0.0";
  const roiPercent = totalCosts > 0 ? (((revNum - totalCosts) / totalCosts) * 100).toFixed(1) : "0.0";
  const roas = adNum > 0 ? (revNum / adNum).toFixed(2) : "0.00";
  
  // Reinvestment Strategy
  const safeReinvestment = profit > 0 ? (profit * 0.5).toFixed(2) : "0.00";
  const cashFlow = (capNum + profit).toFixed(2);

  // Health Status
  let healthMessage = "Operação Saudável com Lucro Positivo!";
  let healthColor = "text-emerald-400";
  if (profit < 0) {
    healthMessage = "Atenção: A operação está no prejuízo. Reduza custos fixos ou reajuste seus anúncios.";
    healthColor = "text-rose-400";
  } else if (parseFloat(marginPercent) < 20) {
    healthMessage = "Alerta de Margem Baixa. Margem abaixo de 20%. Recomendado aumentar o ticket ou adicionar Order Bump.";
    healthColor = "text-amber-400";
  }

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" />
                Educação Financeira Aplicada ao MKT Digital
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-display">
              CENTRAL FINANCEIRA • INFINITY MILLION
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl">
              Aprenda a gerir o fluxo de caixa do seu infoproduto. Calcule margem de lucro, ROI, ROAS e descubra exatamente quanto reinvestir sem arriscar seu capital.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shrink-0">
            <span className="text-2xl">📊</span>
            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Status da Operação</span>
              <span className={`text-xs font-bold ${healthColor}`}>{healthMessage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* INPUTS & DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* FINANCIAL INPUTS */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-md space-y-4">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block pb-2 border-b border-slate-800">
            1. Dados da Sua Operação:
          </span>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Receita (Faturamento Bruto):</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 font-bold">R$</span>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Custos com Ferramentas / Plataforma:</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 font-bold">R$</span>
                <input
                  type="number"
                  value={costs}
                  onChange={(e) => setCosts(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Investimento em Anúncios (Tráfego Pago):</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 font-bold">R$</span>
                <input
                  type="number"
                  value={adSpend}
                  onChange={(e) => setAdSpend(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Capital Disponível em Caixa:</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 font-bold">R$</span>
                <input
                  type="number"
                  value={capitalAvailable}
                  onChange={(e) => setCapitalAvailable(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Reserva Financeira da Empresa:</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 font-bold">R$</span>
                <input
                  type="number"
                  value={reserve}
                  onChange={(e) => setReserve(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Objetivo Mensal de Faturamento:</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 font-bold">R$</span>
                <input
                  type="number"
                  value={monthlyGoal}
                  onChange={(e) => setMonthlyGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FINANCIAL DASHBOARD METRICS */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Receita Total</span>
              <span className="text-lg font-black text-white">R$ {revNum.toFixed(2)}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Lucro Líquido</span>
              <span className={`text-lg font-black ${profit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                R$ {profit.toFixed(2)}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Margem de Lucro</span>
              <span className="text-lg font-black text-teal-400">{marginPercent}%</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">ROAS do Tráfego</span>
              <span className="text-lg font-black text-amber-400">{roas}x</span>
            </div>
          </div>

          {/* FINANCIAL ANALYSIS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block pb-2 border-b border-slate-800">
              2. Análise Estratégica do Seu Capital
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1">
                <span className="text-emerald-400 font-bold block uppercase text-[10px]">Valor Recomendado para Reinvestir</span>
                <span className="text-lg font-black text-white">R$ {safeReinvestment}</span>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Corresponde a 50% do lucro líquido gerado. Permite acelerar a escala de anúncios mantendo metade do lucro protegido na empresa.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1">
                <span className="text-teal-400 font-bold block uppercase text-[10px]">Fluxo de Caixa Total</span>
                <span className="text-lg font-black text-white">R$ {cashFlow}</span>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Capital disponível somado ao lucro líquido do período.
                </p>
              </div>
            </div>

            {/* METAS PARA 7, 30 E 90 DIAS */}
            <div className="pt-3 border-t border-slate-850 space-y-3">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider block">🎯 Metas de Escala Financeira</span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 font-mono font-bold block text-[10px]">META 7 DIAS</span>
                  <span className="text-sm font-black text-white block mt-0.5">R$ {(goalNum * 0.25).toFixed(2)}</span>
                  <p className="text-[10px] text-slate-400 mt-1">Validação do criativo campeão.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 font-mono font-bold block text-[10px]">META 30 DIAS</span>
                  <span className="text-sm font-black text-white block mt-0.5">R$ {goalNum.toFixed(2)}</span>
                  <p className="text-[10px] text-slate-400 mt-1">Consolidação do objetivo mensal.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 font-mono font-bold block text-[10px]">META 90 DIAS</span>
                  <span className="text-sm font-black text-white block mt-0.5">R$ {(goalNum * 3).toFixed(2)}</span>
                  <p className="text-[10px] text-slate-400 mt-1">Escala para esteira de produtos.</p>
                </div>
              </div>
            </div>

            {/* EVOLUÇÃO VISUAL EM FORMATO DE PAINEL */}
            <div className="pt-3 border-t border-slate-850 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Atingimento da Meta Mensal</span>
                <span className="text-emerald-400">{Math.min(100, Math.round((revNum / goalNum) * 100))}%</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (revNum / goalNum) * 100)}%` }}
                ></div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
