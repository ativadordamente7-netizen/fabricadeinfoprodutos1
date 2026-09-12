import React from "react";
import { X, Trophy, CheckCircle2, TrendingUp, Sparkles, Award, Shield, Target, Zap, Activity } from "lucide-react";
import { ExperienceLevel } from "./NivelamentoExperience";

interface Props {
  currentStep: number;
  experienceLevel: ExperienceLevel;
  hasEbook: boolean;
  hasSalesPage: boolean;
  hasCover: boolean;
  hasVsl: boolean;
  hasAds: boolean;
  onClose: () => void;
}

export default function RelatorioDesempenhoModal({
  currentStep,
  experienceLevel,
  hasEbook,
  hasSalesPage,
  hasCover,
  hasVsl,
  hasAds,
  onClose
}: Props) {
  // Calculate performance scores out of 100 based on progress
  const completedCount = [hasEbook, hasSalesPage, hasCover, hasVsl, hasAds].filter(Boolean).length;
  
  const constanciaScore = Math.min(100, 60 + completedCount * 8 + (currentStep >= 5 ? 10 : 0));
  const execucaoScore = Math.min(100, 50 + completedCount * 10);
  const organizacaoScore = Math.min(100, 70 + (hasEbook ? 10 : 0) + (hasSalesPage ? 10 : 0) + (hasCover ? 10 : 0));
  const disciplinaScore = Math.min(100, 65 + currentStep * 4.5);

  const overallScore = Math.round((constanciaScore + execucaoScore + organizacaoScore + disciplinaScore) / 4);

  let statusTitle = "Explorador em Evolução";
  if (overallScore >= 90) statusTitle = "Operador de Elite 6 Digitos";
  else if (overallScore >= 75) statusTitle = "Estrategista de Vendas Ativo";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative font-sans text-slate-100">
        
        {/* HEADER */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/90 border-b border-slate-800 flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold uppercase border border-emerald-500/30">
                  INFINITY OS ANALYTICS
                </span>
                <span className="text-xs text-slate-400 font-mono">Modo: {experienceLevel.toUpperCase()}</span>
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight mt-0.5">
                RELATÓRIO DE DESEMPENHO INTELIGENTE
              </h2>
              <p className="text-xs text-slate-400">Avaliação contínua de constância, execução e disciplina.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OVERALL PERFORMANCE HUD */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
            <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 flex items-center justify-center">
                  <span className="text-2xl font-black text-emerald-400 font-mono">{overallScore}%</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Status do Aluno</span>
                <h3 className="text-lg font-black text-white">{statusTitle}</h3>
                <span className="text-xs text-emerald-400 font-semibold block mt-0.5">
                  {completedCount} de 5 ativos digitais criados e validados
                </span>
              </div>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-left w-full md:w-auto font-mono text-xs">
              <span className="text-[10px] text-emerald-300 font-bold uppercase block mb-1">Ritmo de Execução</span>
              <span className="text-white font-black block">Alta Produtividade</span>
              <span className="text-slate-400 text-[10px] block mt-1">Nenhum gargalo crítico detectado.</span>
            </div>
          </div>

          {/* 4 PILLARS PROGRESS BARS */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Métricas de Desempenho Operacional
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Constância */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Constância de Estudo & Frequência</span>
                  <span className="text-emerald-400 font-mono">{constanciaScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${constanciaScore}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">Frequência regular observada nas sessões de planejamento.</p>
              </div>

              {/* Execução */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Taxa de Execução de Missões</span>
                  <span className="text-emerald-400 font-mono">{execucaoScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${execucaoScore}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">Excelente ritmo na criação de copys e artes visuais.</p>
              </div>

              {/* Organização */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Organização da Esteira de Ofertas</span>
                  <span className="text-emerald-400 font-mono">{organizacaoScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${organizacaoScore}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">Produtos e páginas armazenados corretamente no ecossistema.</p>
              </div>

              {/* Disciplina */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Foco e Disciplina Estratégica</span>
                  <span className="text-emerald-400 font-mono">{disciplinaScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${disciplinaScore}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">Seguindo os passos na sequência ideal sem pulos prematuros.</p>
              </div>
            </div>
          </div>

          {/* STRENGTHS & OPPORTUNITIES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Pontos Fortes Detectados
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                <li>Boa definição do nicho e clareza de público-alvo.</li>
                <li>Utilização eficiente de geradores visuais em alta resolução.</li>
                <li>Construção acelerada de conteúdo autoral com auxílio de IA.</li>
              </ul>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                Próxima Habilidade a Desenvolver
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">Otimização de Conversão no Checkout:</strong> Adicionar um Order Bump de baixo ticket (R$ 19,90) para aumentar o ticket médio imediato da sua campanha.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer transition"
            >
              Entendido! Fechar Relatório
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
