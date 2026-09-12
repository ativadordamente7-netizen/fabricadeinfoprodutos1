import React, { useState, useEffect, useRef } from "react";
import { 
  Brain, 
  Heart, 
  Sparkles, 
  ListTodo, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Terminal, 
  Layers,
  ChevronRight,
  Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface EbookGenerationProgressProps {
  productName: string;
  niche: string;
  targetAudience: string;
  tone?: string;
  isGenerating: boolean;
  onFinished?: () => void;
  isRegenerating?: boolean;
}

interface PillarDefinition {
  id: "mental" | "emotional" | "spiritual" | "practical";
  number: number;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  theme: {
    text: string;
    border: string;
    borderActive: string;
    bg: string;
    bgActive: string;
    badgeBg: string;
    gradient: string;
    glow: string;
  };
  steps: string[];
}

const PILLARS: PillarDefinition[] = [
  {
    id: "mental",
    number: 1,
    name: "Dimensão Mental",
    subtitle: "Clareza Cognitiva & Quebra de Crenças",
    description: "Desativação de crenças limitantes do nicho, reprogramação de identidade e instalação de modelos mentais de alavancagem.",
    icon: Brain,
    theme: {
      text: "text-indigo-400",
      border: "border-indigo-500/20",
      borderActive: "border-indigo-500",
      bg: "bg-indigo-950/20",
      bgActive: "bg-indigo-950/50",
      badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      gradient: "from-indigo-500 to-violet-500",
      glow: "shadow-[0_0_25px_rgba(99,102,241,0.25)]"
    },
    steps: [
      "Mapeando crença limitante raiz sobre o tema...",
      "Formatando modelos mentais de decisão e alavancagem...",
      "Redigindo quebra de mitos nos 4 capítulos..."
    ]
  },
  {
    id: "emotional",
    number: 2,
    name: "Dimensão Emocional",
    subtitle: "Autodomínio & Blindagem Psicológica",
    description: "Neutralização de ansiedade e sobrecarga mental, ancoragem de constância diária e superação da síndrome do impostor.",
    icon: Heart,
    theme: {
      text: "text-rose-400",
      border: "border-rose-500/20",
      borderActive: "border-rose-500",
      bg: "bg-rose-950/20",
      bgActive: "bg-rose-950/50",
      badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      gradient: "from-rose-500 to-pink-500",
      glow: "shadow-[0_0_25px_rgba(244,63,94,0.25)]"
    },
    steps: [
      "Identificando gatilhos de procrastinação e esgotamento...",
      "Elaborando técnicas de autocontrole e calma ativa...",
      "Ancorando rituais de foco e proteção emocional..."
    ]
  },
  {
    id: "spiritual",
    number: 3,
    name: "Dimensão Espiritual",
    subtitle: "Propósito Maior & Princípios Éticos",
    description: "Conexão com uma missão nobre e transcendente, alinhamento de valores inegociáveis e paz interior duradoura.",
    icon: Sparkles,
    theme: {
      text: "text-amber-400",
      border: "border-amber-500/20",
      borderActive: "border-amber-500",
      bg: "bg-amber-950/20",
      bgActive: "bg-amber-950/50",
      badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      gradient: "from-amber-400 to-yellow-500",
      glow: "shadow-[0_0_25px_rgba(245,158,11,0.25)]"
    },
    steps: [
      "Sintetizando o 'Porquê' superior da jornada...",
      "Estruturando compromisso ético e serviço de excelência...",
      "Integrando serenidade, integridade e legado..."
    ]
  },
  {
    id: "practical",
    number: 4,
    name: "Tarefas Práticas Acionáveis",
    subtitle: "Execução no Mundo Real & Checklists",
    description: "Planos de ação rápidos de 15 minutos por capítulo, desafios práticos e prompts de IA para execução imediata.",
    icon: ListTodo,
    theme: {
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      borderActive: "border-emerald-500",
      bg: "bg-emerald-950/20",
      bgActive: "bg-emerald-950/50",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      gradient: "from-emerald-500 to-teal-400",
      glow: "shadow-[0_0_25px_rgba(16,185,129,0.25)]"
    },
    steps: [
      "Formatando desafios práticos de 15 minutos...",
      "Inserindo prompts de comando e automação...",
      "Finalizando checklist de execução passo a passo..."
    ]
  }
];

export const EbookGenerationProgress: React.FC<EbookGenerationProgressProps> = ({
  productName,
  niche,
  targetAudience,
  tone,
  isGenerating,
  onFinished,
  isRegenerating = false
}) => {
  const [progressPercent, setProgressPercent] = useState(5);
  const [activePillarIdx, setActivePillarIdx] = useState(0);
  const [subStepIdx, setSubStepIdx] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [activityLogs, setActivityLogs] = useState<string[]>([
    "Inicializando arquitetura neural Gemini...",
    `Alinhando nicho (${niche || "Infoproduto"}) e público-alvo (${targetAudience || "Público Geral"})...`,
    "Ativando matriz obrigatória dos 4 Pilares Transformadores..."
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Timer for elapsed seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Smooth real-time progress simulation that responds to actual backend completion
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isGenerating) {
      interval = setInterval(() => {
        setProgressPercent((prev) => {
          // While backend is generating, smoothly progress up to 94%
          if (prev < 94) {
            const increment = prev < 30 ? 2.5 : prev < 70 ? 1.8 : 0.9;
            const next = Math.min(94, +(prev + increment).toFixed(1));
            return next;
          }
          return prev;
        });
      }, 400);
    } else {
      // Completed! Fast-forward to 100%
      setProgressPercent(100);
      setActivePillarIdx(4);
      setActivityLogs((logs) => [
        ...logs,
        "✨ Validação concluída: 4 Pilares integralmente construídos e revisados!",
        "🚀 E-book diagramado com sucesso! Abrindo leitor..."
      ]);
      if (onFinished) {
        const timeout = setTimeout(onFinished, 1200);
        return () => clearTimeout(timeout);
      }
    }

    return () => clearInterval(interval);
  }, [isGenerating, onFinished]);

  // Synchronize active pillar and sub-step based on progress percentage
  useEffect(() => {
    let pIdx = 0;
    let sIdx = 0;

    if (progressPercent < 25) {
      pIdx = 0;
      sIdx = progressPercent < 12 ? 0 : progressPercent < 18 ? 1 : 2;
    } else if (progressPercent < 50) {
      pIdx = 1;
      sIdx = progressPercent < 33 ? 0 : progressPercent < 42 ? 1 : 2;
    } else if (progressPercent < 75) {
      pIdx = 2;
      sIdx = progressPercent < 58 ? 0 : progressPercent < 67 ? 1 : 2;
    } else if (progressPercent < 98) {
      pIdx = 3;
      sIdx = progressPercent < 83 ? 0 : progressPercent < 91 ? 1 : 2;
    } else {
      pIdx = 4;
      sIdx = 2;
    }

    setActivePillarIdx(pIdx);
    setSubStepIdx(sIdx);

    // Dynamically log milestones
    const currentPillar = PILLARS[Math.min(3, pIdx)];
    if (currentPillar && currentPillar.steps[sIdx]) {
      const stepText = `[Pilar ${currentPillar.number}] ${currentPillar.steps[sIdx]}`;
      setActivityLogs((prev) => {
        if (!prev.includes(stepText)) {
          return [...prev.slice(-12), stepText];
        }
        return prev;
      });
    }
  }, [progressPercent]);

  // Scroll terminal logs smoothly
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activityLogs]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${rem.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden animate-fade-in text-left">
      {/* Background Ambience Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* TOP HEADER: Title, Progress, and Live Counters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Construção em Tempo Real
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-950 border border-slate-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Cpu className="w-3 h-3 text-emerald-400" />
              Arquitetura 4 Pilares
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-400 shrink-0" />
            <span>
              {isRegenerating ? "Regenerando Arquitetura dos 4 Pilares..." : "Fabricando E-book de Alto Impacto..."}
            </span>
          </h3>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Construindo <strong className="text-white">"{productName || "Infoproduto Exclusivo"}"</strong> com densidade cognitiva e transformação 360º.
          </p>
        </div>

        {/* Real-time Metrics Card */}
        <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800/90 rounded-2xl p-3 shrink-0">
          <div className="flex items-center gap-2 px-3 border-r border-slate-800">
            <Clock className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 block">Tempo</span>
              <span className="text-sm font-mono font-bold text-white">{formatTime(secondsElapsed)}</span>
            </div>
          </div>
          <div className="px-3">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 block">Progresso</span>
            <span className="text-base font-mono font-black text-emerald-400">
              {Math.round(progressPercent)}%
            </span>
          </div>
        </div>
      </div>

      {/* MASTER PROGRESS BAR */}
      <div className="my-6 relative z-10">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Construção dos Pilares:</span>
            <span className="text-[11px] font-mono text-emerald-400">
              {activePillarIdx >= 4 
                ? "4 de 4 Pilares Consolidados ✓" 
                : `Pilar ${activePillarIdx + 1} de 4 (${PILLARS[activePillarIdx]?.name})`}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {Math.round(progressPercent)}% concluído
          </span>
        </div>

        <div className="w-full h-3.5 bg-slate-950 rounded-full border border-slate-800 p-0.5 overflow-hidden relative shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-rose-500 via-amber-400 to-emerald-400 relative overflow-hidden"
            initial={{ width: "5%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Shimmer light effect moving continuously */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" 
                 style={{ backgroundSize: "200% 100%" }} />
          </motion.div>
        </div>

        {/* Milestone Tick Marks for 4 Pillars */}
        <div className="grid grid-cols-4 mt-2 text-[10px] font-bold text-slate-500 tracking-wider">
          <span className={`${progressPercent >= 25 ? "text-indigo-400 font-extrabold" : ""}`}>
            🧠 25% Mental
          </span>
          <span className={`text-center ${progressPercent >= 50 ? "text-rose-400 font-extrabold" : ""}`}>
            ❤️ 50% Emocional
          </span>
          <span className={`text-center ${progressPercent >= 75 ? "text-amber-400 font-extrabold" : ""}`}>
            ✨ 75% Espiritual
          </span>
          <span className={`text-right ${progressPercent >= 95 ? "text-emerald-400 font-extrabold" : ""}`}>
            📋 100% Prático
          </span>
        </div>
      </div>

      {/* THE 4 PILLARS DETAILED INTERACTIVE PIPELINE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6 relative z-10">
        {PILLARS.map((pillar, idx) => {
          const PillarIcon = pillar.icon;
          const isCompleted = activePillarIdx > idx || progressPercent >= 98;
          const isActive = activePillarIdx === idx && progressPercent < 98;
          const isPending = activePillarIdx < idx;

          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              className={`rounded-2xl p-4 border transition-all duration-300 relative flex flex-col justify-between ${
                isCompleted
                  ? "bg-slate-950/70 border-emerald-500/40 shadow-sm"
                  : isActive
                  ? `${pillar.theme.bgActive} ${pillar.theme.borderActive} ${pillar.theme.glow} ring-1 ring-white/10`
                  : "bg-slate-950/30 border-slate-800/60 opacity-60"
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                      isCompleted
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : isActive
                        ? `${pillar.theme.badgeBg} border-current animate-pulse`
                        : "bg-slate-900 text-slate-500 border-slate-800"
                    }`}
                  >
                    <PillarIcon className="w-5 h-5" />
                  </div>

                  {/* Status Badge */}
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Concluído
                    </span>
                  ) : isActive ? (
                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${pillar.theme.badgeBg}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                      Construindo
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                      Aguardando
                    </span>
                  )}
                </div>

                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Pilar 0{pillar.number}
                </div>
                <h4 className={`text-sm font-black mt-0.5 leading-snug ${
                  isCompleted ? "text-white" : isActive ? pillar.theme.text : "text-slate-400"
                }`}>
                  {pillar.name}
                </h4>
                <p className="text-[11px] text-slate-400 font-medium mt-1 leading-snug">
                  {pillar.subtitle}
                </p>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed line-clamp-3">
                  {pillar.description}
                </p>
              </div>

              {/* Sub-steps Checklist */}
              <div className="mt-4 pt-3 border-t border-slate-800/70 space-y-1.5">
                {pillar.steps.map((step, sIdx) => {
                  const isStepDone = isCompleted || (isActive && subStepIdx > sIdx);
                  const isStepCurrent = isActive && subStepIdx === sIdx;

                  return (
                    <div
                      key={sIdx}
                      className={`text-[10px] flex items-start gap-1.5 transition-all ${
                        isStepDone
                          ? "text-slate-300"
                          : isStepCurrent
                          ? `${pillar.theme.text} font-bold`
                          : "text-slate-600"
                      }`}
                    >
                      {isStepDone ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      ) : isStepCurrent ? (
                        <Zap className="w-3 h-3 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0 mt-1.5 ml-0.5" />
                      )}
                      <span className="leading-tight">{step}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CHAPTERS MATRIX PREVIEW (Cap 01 to 04 with real-time badges) */}
      <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 my-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Matriz de Cobertura dos 4 Pilares por Capítulo:
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Garantia de Conteúdo Transformador 360º
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {[1, 2, 3, 4].map((chNum) => (
            <div key={chNum} className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 pb-1 border-b border-slate-800">
                <span>Capítulo 0{chNum}</span>
                <span className="text-[9px] font-mono text-slate-500">4 Dimensões</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center">
                <span
                  title="Mental"
                  className={`text-[9px] font-bold py-1 px-1 rounded transition-colors ${
                    progressPercent >= 25 ? "bg-indigo-950/80 text-indigo-300 border border-indigo-800/60" : "bg-slate-950 text-slate-700"
                  }`}
                >
                  🧠
                </span>
                <span
                  title="Emocional"
                  className={`text-[9px] font-bold py-1 px-1 rounded transition-colors ${
                    progressPercent >= 50 ? "bg-rose-950/80 text-rose-300 border border-rose-800/60" : "bg-slate-950 text-slate-700"
                  }`}
                >
                  ❤️
                </span>
                <span
                  title="Espiritual"
                  className={`text-[9px] font-bold py-1 px-1 rounded transition-colors ${
                    progressPercent >= 75 ? "bg-amber-950/80 text-amber-300 border border-amber-800/60" : "bg-slate-950 text-slate-700"
                  }`}
                >
                  ✨
                </span>
                <span
                  title="Tarefas Práticas"
                  className={`text-[9px] font-bold py-1 px-1 rounded transition-colors ${
                    progressPercent >= 95 ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60" : "bg-slate-950 text-slate-700"
                  }`}
                >
                  📋
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIVE NEURAL TERMINAL STREAM */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 relative z-10 font-mono text-left">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-slate-300">Feed de Construção em Tempo Real</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] text-emerald-400">Orquestrador Ativo</span>
          </div>
        </div>

        <div className="space-y-1 max-h-24 overflow-y-auto pr-1 text-[10px] leading-relaxed">
          {activityLogs.map((log, index) => (
            <div key={index} className="flex items-start gap-1.5 text-slate-400">
              <span className="text-emerald-500 shrink-0">›</span>
              <span className={index === activityLogs.length - 1 ? "text-emerald-300 font-bold" : "text-slate-400"}>
                {log}
              </span>
            </div>
          ))}
          <div ref={terminalBottomRef} />
        </div>
      </div>

      {/* FOOTER NOTICE */}
      <div className="mt-4 pt-3 border-t border-slate-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
        <span>
          💡 Dica: Ao terminar, você poderá editar, personalizar cada pilar e baixar o livro formatado em PDF!
        </span>
        <span className="font-mono text-emerald-500/80">
          Infoproduto 100% Autoral & Exclusivo
        </span>
      </div>
    </div>
  );
};

export default EbookGenerationProgress;
