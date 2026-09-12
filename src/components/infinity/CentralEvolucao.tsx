import React from "react";
import { Sparkles, Trophy, ArrowRight, Play, CheckCircle2, Clock, Zap, Target, Award, Shield } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  currentLevelName: string;
  progressPercent: number;
  lastMissionCompleted: string;
  nextMissionTitle: string;
  aiRecommendation: string;
  estimatedTimeMinutes: number;
  onContinueJourney: () => void;
  onOpenCentral: (centralId: string) => void;
}

export default function CentralEvolucao({
  currentLevelName,
  progressPercent,
  lastMissionCompleted,
  nextMissionTitle,
  aiRecommendation,
  estimatedTimeMinutes,
  onContinueJourney,
  onOpenCentral
}: Props) {
  // Generate progress bar representation (e.g. ████████░░░░░░░░░)
  const totalBlocks = 20;
  const filledBlocks = Math.round((progressPercent / 100) * totalBlocks);
  const progressBarText = "█".repeat(filledBlocks) + "░".repeat(Math.max(0, totalBlocks - filledBlocks));

  return (
    <div className="w-full flex flex-col gap-6">
      {/* INFINITY MILLION OS HERO BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/80 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 animate-spin" />
                Cérebro do Sistema • Infinity Million OS
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white font-display tracking-tight">
              CENTRAL DE EVOLUÇÃO & RECOMENDAÇÃO
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl leading-relaxed">
              Sua jornada guiada por inteligência artificial. Acompanhamos seu progresso real e sugerimos o exato próximo passo para você faturar mais rápido.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Status do Aluno</span>
              <span className="text-sm font-extrabold text-white">{currentLevelName}</span>
              <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">{progressPercent}% do Mercado Concluído</span>
            </div>
          </div>
        </div>

        {/* HUD EVOLUTION CARD */}
        <div className="mt-8 bg-slate-950/90 border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-inner font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-850 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              INFINITY MILLION OS
            </span>
            <span className="text-slate-500">PAINEL DE EVOLUÇÃO EM TEMPO REAL</span>
          </div>

          <div className="py-4 border-b border-slate-850/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Nível de Execução</span>
              <span className="text-base font-extrabold text-emerald-400 font-sans">{currentLevelName}</span>
            </div>

            <div className="w-full md:w-auto">
              <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Progresso Geral ({progressPercent}%)</span>
              <div className="text-emerald-400 font-mono font-black text-sm tracking-widest bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                {progressBarText} {progressPercent}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="bg-slate-900/60 border border-slate-850 p-3.5 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Última missão concluída</span>
                <span className="text-xs font-bold text-slate-200">{lastMissionCompleted}</span>
              </div>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl flex items-center gap-3">
              <Target className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" />
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Próxima missão no radar</span>
                <span className="text-xs font-bold text-white">{nextMissionTitle}</span>
              </div>
            </div>
          </div>

          {/* AI RECOMMENDATION BOX */}
          <div className="mt-5 bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider font-sans">Recomendação da IA:</span>
              </div>
              <p className="text-slate-200 text-xs font-medium font-sans leading-relaxed">
                "{aiRecommendation}"
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-mono">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>Tempo estimado de execução: <strong className="text-emerald-300">{estimatedTimeMinutes} minutos</strong></span>
              </div>
            </div>

            <button
              type="button"
              onClick={onContinueJourney}
              className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2 shrink-0 cursor-pointer font-sans"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Continuar Jornada</span>
            </button>
          </div>
        </div>
      </div>

      {/* OS SHORTCUT TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => onOpenCentral("central_ia")}
          className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 rounded-2xl text-left transition flex flex-col justify-between gap-3 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm">🤖</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition" />
          </div>
          <div>
            <span className="text-xs font-black text-white group-hover:text-emerald-400 transition block">Central de IA</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">20 Módulos de Prompts e Copy</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenCentral("ferramentas_ia")}
          className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 rounded-2xl text-left transition flex flex-col justify-between gap-3 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">🛠️</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition" />
          </div>
          <div>
            <span className="text-xs font-black text-white group-hover:text-indigo-400 transition block">Ferramentas de IA</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Texto, Imagem, Vídeo e Áudio</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenCentral("exemplos")}
          className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-2xl text-left transition flex flex-col justify-between gap-3 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm">📚</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition" />
          </div>
          <div>
            <span className="text-xs font-black text-white group-hover:text-amber-400 transition block">Biblioteca de Exemplos</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Modelos Reais Editáveis</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenCentral("simulador")}
          className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 rounded-2xl text-left transition flex flex-col justify-between gap-3 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm">📊</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition" />
          </div>
          <div>
            <span className="text-xs font-black text-white group-hover:text-emerald-400 transition block">Simulador de Viabilidade</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Projeção Tráfego & ROI</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenCentral("checklist")}
          className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/50 rounded-2xl text-left transition flex flex-col justify-between gap-3 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-sm">📋</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 transition" />
          </div>
          <div>
            <span className="text-xs font-black text-white group-hover:text-teal-400 transition block">Checklist Lançamento</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">11 Passos de Segurança</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenCentral("diagnostico")}
          className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/50 rounded-2xl text-left transition flex flex-col justify-between gap-3 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-sm">🩺</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 transition" />
          </div>
          <div>
            <span className="text-xs font-black text-white group-hover:text-teal-400 transition block">Diagnóstico</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Identifique gargalos de vendas</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenCentral("missoes")}
          className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-2xl text-left transition flex flex-col justify-between gap-3 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm">🎯</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition" />
          </div>
          <div>
            <span className="text-xs font-black text-white group-hover:text-amber-400 transition block">Central de Missões</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Gamificação & Ranking XP</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenCentral("ceo")}
          className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 rounded-2xl text-left transition flex flex-col justify-between gap-3 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-sm">💼</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition" />
          </div>
          <div>
            <span className="text-xs font-black text-white group-hover:text-purple-400 transition block">Sala do CEO</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Sócio Estratégico AI</span>
          </div>
        </button>
      </div>
    </div>
  );
}

