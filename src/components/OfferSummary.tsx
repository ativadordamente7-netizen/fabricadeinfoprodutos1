import React from "react";
import { Sparkles, ArrowRight, BookOpen, Megaphone, Target, MessageSquare } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  productName: string;
  niche: string;
  targetAudience: string;
  tone: string;
  description: string;
  onUpdate: (data: Partial<{ productName: string; niche: string; targetAudience: string; tone: string; description: string }>) => void;
  onNext: () => void;
}

export default function OfferSummary({
  productName,
  niche,
  targetAudience,
  tone,
  description,
  onUpdate,
  onNext
}: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Intro visual banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl text-center md:text-left flex flex-col md:flex-row items-center gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none"></div>
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <Megaphone className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Etapa 1: Confirme sua Oferta</h3>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed max-w-xl">
            Para que a IA crie anúncios altamente segmentados e persuasivos, vamos confirmar os pilares principais do seu produto. Os dados abaixo foram importados automaticamente do seu E-book e Página de Vendas.
          </p>
        </div>
      </div>

      {/* Main Interactive Form */}
      <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-6 shadow-md flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              Nome do Infoproduto
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => onUpdate({ productName: e.target.value })}
              className="bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-750 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium"
              placeholder="Ex: Do Zero ao Milhão com Tráfego"
            />
          </div>

          {/* Niche Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5 text-emerald-400" />
              Nicho / Subnicho
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => onUpdate({ niche: e.target.value })}
              className="bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-750 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium"
              placeholder="Ex: Finanças e Investimentos"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target Audience */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              Público-Alvo Segmentado
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => onUpdate({ targetAudience: e.target.value })}
              className="bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-750 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium"
              placeholder="Ex: Jovens CLT cansados do trabalho querendo mudar"
            />
          </div>

          {/* Tone of Voice */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              Tom de Voz do Anúncio
            </label>
            <select
              value={tone}
              onChange={(e) => onUpdate({ tone: e.target.value })}
              className="bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
            >
              <option value="Persuasivo e Emocional">Persuasivo e Emocional</option>
              <option value="Direto e Comercial">Direto e Comercial</option>
              <option value="Urgente e Escasso">Urgente e Escasso</option>
              <option value="Científico e Lógico">Científico e Lógico</option>
              <option value="Inspirador e Amigável">Inspirador e Amigável</option>
            </select>
          </div>
        </div>

        {/* Product Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Resumo Curto do Valor do Produto (Benefício Principal)
          </label>
          <textarea
            value={description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={3}
            className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-750 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium resize-none leading-relaxed"
            placeholder="Descreva o que o leitor vai alcançar ao ler o e-book..."
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end border-t border-slate-850 pt-4 mt-1">
          <button
            type="button"
            onClick={onNext}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/10 transition-all flex items-center gap-1.5 hover:scale-[1.01] active:scale-95 cursor-pointer"
          >
            <span>Confirmar e Continuar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
