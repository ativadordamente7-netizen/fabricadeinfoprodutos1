import React, { useState } from "react";
import { 
  Sparkles, 
  Lightbulb, 
  Copy, 
  Check, 
  X, 
  Zap, 
  TrendingUp,
  Target,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface CopywritingTipData {
  triggerName: string;
  triggerCategory?: "persuasion" | "urgency" | "authority" | "clarity" | "trust" | "conversion";
  concept: string;
  practicalTip: string;
  formula?: string;
  highConvertingExample?: string;
  impactMetric?: string;
}

interface Props {
  tip: CopywritingTipData;
  children: React.ReactNode;
  label?: React.ReactNode;
  required?: boolean;
  onApplyExample?: (example: string) => void;
  className?: string;
}

export default function CopywritingTooltip({
  tip,
  children,
  label,
  required,
  onApplyExample,
  className = ""
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyExample = () => {
    if (tip.highConvertingExample) {
      navigator.clipboard.writeText(tip.highConvertingExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = () => {
    if (tip.highConvertingExample && onApplyExample) {
      onApplyExample(tip.highConvertingExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCategoryTheme = () => {
    switch (tip.triggerCategory) {
      case "urgency":
        return {
          pill: "text-rose-400 bg-rose-500/10 border-rose-500/30",
          cardBorder: "border-rose-500/30",
          accentText: "text-rose-400"
        };
      case "authority":
        return {
          pill: "text-amber-400 bg-amber-500/10 border-amber-500/30",
          cardBorder: "border-amber-500/30",
          accentText: "text-amber-400"
        };
      case "trust":
        return {
          pill: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
          cardBorder: "border-cyan-500/30",
          accentText: "text-cyan-400"
        };
      case "clarity":
        return {
          pill: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
          cardBorder: "border-indigo-500/30",
          accentText: "text-indigo-400"
        };
      case "conversion":
      default:
        return {
          pill: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
          cardBorder: "border-emerald-500/30",
          accentText: "text-emerald-400"
        };
    }
  };

  const theme = getCategoryTheme();

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Label Header com Botãozinho Didático Compacto */}
      {label && (
        <div className="flex items-center justify-between gap-2 mb-1.5 min-w-0">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1 truncate">
            <span className="truncate">{label}</span>
            {required && <span className="text-rose-500 font-bold shrink-0">*</span>}
          </label>

          {/* Botãozinho Didático & Interativo que nunca quebra o layout */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer shrink-0 shadow-sm ${
              isOpen
                ? "bg-amber-400/20 text-amber-300 border-amber-400/60 ring-1 ring-amber-400/40"
                : "bg-slate-850 hover:bg-slate-800 text-amber-300 border-amber-500/30 hover:border-amber-400"
            }`}
            title="Clique para ver a estratégia e explicação didática"
            aria-label={`Dica didática sobre ${tip.triggerName}`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold">O que é isso?</span>
            {isOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-amber-300/80 shrink-0" />
            )}
          </button>
        </div>
      )}

      {/* Input / Select / Textarea Alvo */}
      <div className={`relative transition-all duration-200 ${isOpen ? "ring-2 ring-emerald-500/40 rounded-xl" : ""}`}>
        {children}
      </div>

      {/* Painel Explicativo Didático Integrado no Fluxo (Nunca sobrepõe números ou WhatsApp!) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden z-20 relative"
          >
            <div className={`rounded-xl border ${theme.cardBorder} bg-slate-900 p-4 shadow-2xl backdrop-blur-md text-slate-100 flex flex-col gap-3`}>
              
              {/* Header do Card Didático */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${theme.pill} flex items-center gap-1.5`}>
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Gatilho: {tip.triggerName}
                  </span>
                  {tip.impactMetric && (
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {tip.impactMetric}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-slate-800 transition cursor-pointer"
                  title="Fechar explicação"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Explicação Didática Clara com Alto Contraste */}
              <div className="text-xs text-white leading-relaxed">
                <strong className={`${theme.accentText} font-bold block mb-1 text-xs`}>
                  Como funciona na mente do cliente:
                </strong>
                <p className="text-slate-100 font-medium text-xs leading-relaxed">{tip.concept}</p>
              </div>

              {/* Dica Prática de Alta Conversão */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-100 leading-relaxed">
                  <span className="font-bold text-amber-300 block mb-0.5">Dica prática de conversão:</span>
                  <p className="text-slate-200 font-medium">{tip.practicalTip}</p>
                </div>
              </div>

              {/* Fórmula Recomendada (se houver) */}
              {tip.formula && (
                <div className="bg-slate-950 border border-emerald-500/30 rounded-lg p-2.5 text-xs">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-0.5">
                    Estrutura Recomendada:
                  </span>
                  <span className="text-emerald-300 font-mono font-bold block">{tip.formula}</span>
                </div>
              )}

              {/* Exemplo de Alta Conversão com botão Usar */}
              {tip.highConvertingExample && (
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-slate-300 font-bold uppercase block mb-0.5">
                      Exemplo Pronto:
                    </span>
                    <p className="text-xs text-white font-semibold italic truncate">
                      "{tip.highConvertingExample}"
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {onApplyExample && (
                      <button
                        type="button"
                        onClick={handleApply}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
                        title="Aplicar este exemplo no campo"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Usar</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleCopyExample}
                      className="bg-slate-850 hover:bg-slate-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition border border-slate-700 flex items-center gap-1 cursor-pointer"
                      title="Copiar texto do exemplo"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copied ? "Copiado!" : "Copiar"}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
