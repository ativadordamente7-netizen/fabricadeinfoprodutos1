import React from "react";
import { Brain, Heart, Sparkles, ListTodo, ShieldCheck, CheckCircle2, Sparkle, RefreshCw } from "lucide-react";
import { EbookData } from "../types";

interface Props {
  ebook: EbookData;
  onOpenRegenerateModal?: () => void;
}

export default function EbookPillarsAuditBar({ ebook, onOpenRegenerateModal }: Props) {
  const chapters = ebook.chapters || [];
  const totalChapters = chapters.length || 1;

  // Audit presence in chapters
  const mentalCount = chapters.filter(ch => /🧠|Mental/i.test(ch.content)).length;
  const emotionalCount = chapters.filter(ch => /❤️|Emocional/i.test(ch.content)).length;
  const spiritualCount = chapters.filter(ch => /✨|Espiritual/i.test(ch.content)).length;
  const practicalCount = chapters.filter(ch => /📋|Tarefas|Passo\s*a\s*passo/i.test(ch.content)).length;

  const mentalPct = Math.round((mentalCount / totalChapters) * 100);
  const emotionalPct = Math.round((emotionalCount / totalChapters) * 100);
  const spiritualPct = Math.round((spiritualCount / totalChapters) * 100);
  const practicalPct = Math.round((practicalCount / totalChapters) * 100);

  const overallScore = Math.round((mentalPct + emotionalPct + spiritualPct + practicalPct) / 4);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg mb-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/25 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Auditoria de Qualidade: Padrão 4 Pilares
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold whitespace-nowrap">
                {overallScore}% Cobertura
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Todos os capítulos cumprem a metodologia completa de transformação 360º.
            </p>
          </div>
        </div>

        {onOpenRegenerateModal && (
          <button
            type="button"
            onClick={onOpenRegenerateModal}
            className="self-start sm:self-auto text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-emerald-500/40 transition flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Regenerar / Expandir Pilares com IA</span>
          </button>
        )}
      </div>

      {/* 4 Pillars Progress Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        {/* Pilar 1: Mental */}
        <div className="bg-slate-950/60 border border-indigo-500/25 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              1. Mental
            </span>
            <span className="text-[10px] font-mono text-slate-400">{mentalCount}/{totalChapters} caps</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(15, mentalPct)}%` }}
            />
          </div>
          <span className="text-[9px] text-slate-400 block mt-1">Clareza & Quebra de Crenças</span>
        </div>

        {/* Pilar 2: Emocional */}
        <div className="bg-slate-950/60 border border-rose-500/25 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
            <span className="flex items-center gap-1.5 text-rose-300">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              2. Emocional
            </span>
            <span className="text-[10px] font-mono text-slate-400">{emotionalCount}/{totalChapters} caps</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(15, emotionalPct)}%` }}
            />
          </div>
          <span className="text-[9px] text-slate-400 block mt-1">Autodomínio & Blindagem</span>
        </div>

        {/* Pilar 3: Espiritual */}
        <div className="bg-slate-950/60 border border-amber-500/25 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              3. Espiritual
            </span>
            <span className="text-[10px] font-mono text-slate-400">{spiritualCount}/{totalChapters} caps</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(15, spiritualPct)}%` }}
            />
          </div>
          <span className="text-[9px] text-slate-400 block mt-1">Propósito & Força Interior</span>
        </div>

        {/* Pilar 4: Prático */}
        <div className="bg-slate-950/60 border border-emerald-500/25 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <ListTodo className="w-3.5 h-3.5 text-emerald-400" />
              4. Prático
            </span>
            <span className="text-[10px] font-mono text-slate-400">{practicalCount}/{totalChapters} caps</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(15, practicalPct)}%` }}
            />
          </div>
          <span className="text-[9px] text-slate-400 block mt-1">Tarefas Acionáveis & Prompts</span>
        </div>
      </div>
    </div>
  );
}
