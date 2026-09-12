import React from "react";
import { Sparkles, Trophy, Stethoscope, Wallet, Shield, Layers, Zap, Wrench, BookOpen, Calculator, CheckSquare, User } from "lucide-react";
import { ExperienceLevel } from "./NivelamentoExperience";

export type InfinityTab =
  | "wizard"
  | "brand_os"
  | "visual_dna"
  | "evolucao"
  | "central_ia"
  | "ferramentas_ia"
  | "exemplos"
  | "simulador"
  | "checklist"
  | "diagnostico"
  | "missoes"
  | "financeiro"
  | "ceo";

interface Props {
  activeTab: InfinityTab;
  setActiveTab: (tab: InfinityTab) => void;
  experienceLevel?: ExperienceLevel;
  onChangeExperienceLevel?: () => void;
}

export default function InfinityOSHeader({
  activeTab,
  setActiveTab,
  experienceLevel = "iniciante",
  onChangeExperienceLevel
}: Props) {
  const tabs = [
    { id: "wizard", label: "⚡ Fábrica", desc: "Criador de E-books" },
    { id: "brand_os", label: "💎 Brand OS", desc: "Direção & Percepção" },
    { id: "visual_dna", label: "🎨 DNA Visual", desc: "Estilos & Estéticas" },
    { id: "evolucao", label: "👑 Evolução", desc: "Painel Central" },
    { id: "central_ia", label: "🤖 Central IA", desc: "20 Módulos" },
    { id: "ferramentas_ia", label: "🛠️ Ferramentas", desc: "Biblioteca IA" },
    { id: "exemplos", label: "📚 Exemplos", desc: "Modelos Editáveis" },
    { id: "simulador", label: "📊 Simulador", desc: "Projeção Tráfego" },
    { id: "checklist", label: "📋 Checklist", desc: "Lançamento Seguro" },
    { id: "diagnostico", label: "🩺 Diagnóstico", desc: "Métricas & Gargalos" },
    { id: "missoes", label: "🎯 Missões", desc: "XP & Conquistas" },
    { id: "financeiro", label: "💰 Financeiro", desc: "Lucro, ROI & ROAS" },
    { id: "ceo", label: "💼 Sala CEO", desc: "Sócio AI" },
  ] as const;

  const experienceLabels: Record<ExperienceLevel, string> = {
    iniciante: "Modo Iniciante",
    intermediario: "Modo Intermediário",
    avancado: "Modo Avançado"
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-2.5 shadow-lg mb-6 flex flex-col gap-2">
      {/* EXPERIENCE BADGE HEADER */}
      {onChangeExperienceLevel && (
        <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">
              INFINITY MILLION OS 3.0 •
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-extrabold border border-emerald-500/30">
              {experienceLabels[experienceLevel]}
            </span>
          </div>

          <button
            type="button"
            onClick={onChangeExperienceLevel}
            className="text-[10px] font-mono font-bold text-slate-400 hover:text-emerald-400 transition cursor-pointer underline flex items-center gap-1"
          >
            <User className="w-3 h-3" />
            <span>Alterar Perfil</span>
          </button>
        </div>
      )}

      {/* TABS SCROLL BAR */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-2 rounded-xl border text-left transition flex flex-col shrink-0 cursor-pointer ${
                isActive
                  ? "bg-emerald-500/15 border-emerald-500 text-white ring-2 ring-emerald-500/20 shadow-md"
                  : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <span className={`text-xs font-black tracking-tight whitespace-nowrap ${isActive ? "text-emerald-400" : "text-slate-300"}`}>
                {t.label}
              </span>
              <span className="text-[9px] text-slate-500 font-mono mt-0.5 truncate max-w-[100px]">{t.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
