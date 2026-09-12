import React from "react";
import { Sparkles, Sliders, Volume2, Flame, Shield, Smile, Zap, BookOpen, MessageSquare } from "lucide-react";

export interface AIPersonaConfig {
  preset: string; // 'autoridade' | 'humor' | 'provocativo' | 'empatico' | 'direto' | 'storytelling';
  provocationLevel: number; // 1 to 5
  enthusiasmLevel: number; // 1 to 5
  complexityLevel: number; // 1 to 5 (1 = simples/direto, 5 = técnico/robusto)
  useAnalogies: boolean;
  useEmojiStyle: string; // 'moderado' | 'intenso' | 'minimalista'
  customNotes: string;
}

interface Props {
  persona: AIPersonaConfig;
  onChange: (updated: AIPersonaConfig) => void;
}

export const PRESET_VOICES = [
  {
    id: "autoridade",
    name: "👑 Autoridade Suprema",
    tagline: "Firme, inquestionável e focado em resultados comprovados.",
    icon: Shield,
    color: "text-emerald-400 border-emerald-500/50 bg-emerald-500/10",
    example: "Não existe atalho, existe método. Se você continuar fazendo as mesmas escolhas, colherá os mesmos fracassos.",
    defaults: { provocationLevel: 3, enthusiasmLevel: 4, complexityLevel: 3, useAnalogies: true, useEmojiStyle: "moderado" }
  },
  {
    id: "humor",
    name: "🎭 Humor & Sarcasmo Inteligente",
    tagline: "Descontraído, irônico e incrivelmente magnético.",
    icon: Smile,
    color: "text-emerald-400 border-emerald-500/50 bg-emerald-500/10",
    example: "Se dar desculpas queimasse calorias, você já seria capa de revista. Vamos ao que interessa de verdade?",
    defaults: { provocationLevel: 4, enthusiasmLevel: 5, complexityLevel: 2, useAnalogies: true, useEmojiStyle: "intenso" }
  },
  {
    id: "provocativo",
    name: "🔥 Provocativo & Sem Enrolação",
    tagline: "Desafia o leitor, quebra padrões e causa urgência imediata.",
    icon: Flame,
    color: "text-emerald-400 border-emerald-500/50 bg-emerald-500/10",
    example: "Até quando você vai fingir que seu plano atual está funcionando? A dura realidade é que você está rasgando dinheiro.",
    defaults: { provocationLevel: 5, enthusiasmLevel: 4, complexityLevel: 2, useAnalogies: false, useEmojiStyle: "minimalista" }
  },
  {
    id: "empatico",
    name: "💜 Empático & Acolhedor",
    tagline: "Entende a dor do cliente, gera identificação e segurança.",
    icon: MessageSquare,
    color: "text-emerald-400 border-emerald-500/50 bg-emerald-500/10",
    example: "Eu sei exatamente o quão frustrante é tentar de tudo e não ver resultados. Você não está sozinho nessa jornada.",
    defaults: { provocationLevel: 1, enthusiasmLevel: 3, complexityLevel: 2, useAnalogies: true, useEmojiStyle: "moderado" }
  },
  {
    id: "direto",
    name: "⚡ Direto ao Ponto (Pragmático)",
    tagline: "Zero enrolação, direto nas métricas e passos práticos.",
    icon: Zap,
    color: "text-emerald-400 border-emerald-500/50 bg-emerald-500/10",
    example: "Passo 1: Aplique este checklist. Passo 2: Meça a conversão. Resultados aparecem nas primeiras 24 horas.",
    defaults: { provocationLevel: 2, enthusiasmLevel: 3, complexityLevel: 1, useAnalogies: false, useEmojiStyle: "minimalista" }
  },
  {
    id: "storytelling",
    name: "📖 Storytelling Visceral",
    tagline: "Engaja através de histórias profundas e transformações reais.",
    icon: BookOpen,
    color: "text-emerald-400 border-emerald-500/50 bg-emerald-500/10",
    example: "Era uma terça-feira chuvosa quando percebi que minha vida precisava mudar drasticamente. A decisão foi tomada ali mesmo.",
    defaults: { provocationLevel: 3, enthusiasmLevel: 4, complexityLevel: 3, useAnalogies: true, useEmojiStyle: "moderado" }
  }
];

export default function PersonalizarIA({ persona, onChange }: Props) {
  const activePreset = PRESET_VOICES.find((v) => v.id === persona.preset) || PRESET_VOICES[0];

  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_VOICES.find((v) => v.id === presetId);
    if (!found) return;
    onChange({
      ...persona,
      preset: presetId,
      ...found.defaults
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 relative overflow-hidden shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Personalizar Voz da IA</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-mono border border-purple-500/30">
                Ajuste Fino
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Escolha como a IA vai conversar com seu público em todos os e-books, copys e anúncios.
            </p>
          </div>
        </div>
      </div>

      {/* PRESETS SELECTION */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
          1. Estilo Principal de Voz:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESET_VOICES.map((v) => {
            const isSelected = persona.preset === v.id;
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => handleSelectPreset(v.id)}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                  isSelected
                    ? `${v.color} ring-2 ring-emerald-500/40 font-bold shadow-lg`
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold truncate">{v.name}</span>
                  <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                </div>
                <span className="text-[9px] text-slate-400 line-clamp-1">{v.tagline}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LIVE PREVIEW OF THE AI VOICE */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
        <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
          💬 Amostra de como a IA escreverá para seu público:
        </span>
        <p className="text-xs text-slate-200 font-medium italic leading-relaxed">
          "{activePreset.example}"
        </p>
      </div>

      {/* FINE TUNING SLIDERS & CONTROLS */}
      <div className="pt-2 border-t border-slate-800 space-y-3">
        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
          2. Intensidade & Ajustes de Comportamento:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Provocation Level */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
              <span>Provocação / Desafio</span>
              <span className="text-emerald-400 font-mono">{persona.provocationLevel}/5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={persona.provocationLevel}
              onChange={(e) => onChange({ ...persona, provocationLevel: parseInt(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Enthusiasm Level */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
              <span>Entusiasmo / Energia</span>
              <span className="text-emerald-400 font-mono">{persona.enthusiasmLevel}/5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={persona.enthusiasmLevel}
              onChange={(e) => onChange({ ...persona, enthusiasmLevel: parseInt(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Complexity Level */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
              <span>Profundidade Técnica</span>
              <span className="text-emerald-400 font-mono">{persona.complexityLevel}/5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={persona.complexityLevel}
              onChange={(e) => onChange({ ...persona, complexityLevel: parseInt(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* CUSTOM INSTRUCTION NOTE */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Gírias, Expressões ou Regras Específicas do Seu Negócio (Opcional):
          </label>
          <input
            type="text"
            value={persona.customNotes}
            onChange={(e) => onChange({ ...persona, customNotes: e.target.value })}
            placeholder="Ex: Use expressões como 'Bora pra cima', evite a palavra 'fácil', use termos de marketing."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>
    </div>
  );
}

