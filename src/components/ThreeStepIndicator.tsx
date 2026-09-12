import React from "react";
import { Check, BookOpen, Megaphone, CheckCircle2, Sparkles, Target, Video, GitFork, ShieldCheck } from "lucide-react";

interface Props {
  currentStep: number;
  setStep: (step: number) => void;
  isEbookReady: boolean;
  isSalesPageReady: boolean;
}

export default function ThreeStepIndicator({ currentStep, setStep, isEbookReady, isSalesPageReady }: Props) {
  const steps = [
    { number: 1, label: "Criar E-book", desc: "Redigir e formatar o livro", icon: BookOpen, ready: isEbookReady },
    { number: 2, label: "Página de Vendas", desc: "Gerar copy e oferta", icon: Megaphone, ready: isSalesPageReady },
    { number: 3, label: "Publicar & Vender", desc: "Hospedar e faturar", icon: CheckCircle2, ready: isSalesPageReady },
    { number: 4, label: "Criar Anúncios", desc: "Criativos com IA", icon: Sparkles, ready: currentStep > 4 },
    { number: 5, label: "Avatar Ideal", desc: "Perfil de comprador", icon: Target, ready: currentStep > 5 },
    { number: 6, label: "Roteiro VSL", desc: "Vídeo de Vendas", icon: Video, ready: currentStep > 6 },
    { number: 7, label: "Funis de Vendas", desc: "Estratégia & Zap", icon: GitFork, ready: currentStep > 7 },
    { number: 8, label: "Orientação do Sócio", desc: "3 Criativos & Kit", icon: ShieldCheck, ready: currentStep >= 8 },
  ];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md mb-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-purple-500/5 pointer-events-none"></div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 relative z-10">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = currentStep === s.number;
          const isDone = s.ready || currentStep > s.number;
          
          let disabled = false;
          if (s.number === 2 && !isEbookReady) disabled = true;
          if (s.number === 3 && !isSalesPageReady) disabled = true;
          if (s.number === 4 && !isSalesPageReady) disabled = true;
          if (s.number === 5 && !isSalesPageReady) disabled = true;
          if (s.number === 6 && !isSalesPageReady) disabled = true;
          if (s.number === 7 && !isSalesPageReady) disabled = true;
          if (s.number === 8 && !isSalesPageReady) disabled = true;

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => setStep(s.number)}
              className={`text-left p-2 rounded-xl border transition-all duration-300 flex items-start gap-2 ${
                isActive
                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/20"
                  : isDone
                  ? "bg-slate-950/60 border-emerald-500/40 text-emerald-500/90 hover:border-emerald-500 cursor-pointer"
                  : disabled
                  ? "bg-slate-950/20 border-slate-800 text-slate-600 cursor-not-allowed opacity-60"
                  : "bg-slate-950/20 border-slate-800 text-slate-500 hover:border-slate-700 cursor-pointer"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-[11px] transition-all ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                    : isDone
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-slate-800 text-slate-600"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.number}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className={`text-[11px] font-bold tracking-tight truncate ${isActive ? "text-white" : isDone ? "text-emerald-400" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                  <Icon className={`w-3 h-3 shrink-0 ${isActive ? "text-emerald-400" : isDone ? "text-emerald-500/70" : "text-slate-600"}`} />
                </div>
                <p className="text-[9px] text-slate-500 mt-0.5 truncate leading-none">{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


