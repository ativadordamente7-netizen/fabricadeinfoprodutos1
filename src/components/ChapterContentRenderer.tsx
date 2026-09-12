import React, { useState } from "react";
import { Brain, Heart, Sparkles, ListTodo, CheckCircle2, Circle } from "lucide-react";

interface ChapterContentRendererProps {
  content: string;
  isReaderMode?: boolean;
  className?: string;
}

interface ParsedSection {
  type: "intro" | "mental" | "emotional" | "spiritual" | "tasks" | "general";
  title?: string;
  body: string;
  tasks?: string[];
}

export const ChapterContentRenderer: React.FC<ChapterContentRendererProps> = ({
  content,
  isReaderMode = false,
  className = ""
}) => {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (taskKey: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskKey]: !prev[taskKey]
    }));
  };

  // Parser to intelligently decompose content into structured pillars
  const parseContent = (raw: string): ParsedSection[] => {
    if (!raw) return [];

    // Check if the content uses the bracket tags or emojis
    const hasPillars = /\[(🧠|❤️|✨|📋|Visão Geral|Dimensão|Tarefas)/i.test(raw) ||
                       /🧠\s*Dimensão/i.test(raw) ||
                       /❤️\s*Dimensão/i.test(raw) ||
                       /✨\s*Dimensão/i.test(raw) ||
                       /📋\s*Tarefas/i.test(raw);

    if (!hasPillars) {
      // Fallback: regular paragraphs
      const paragraphs = raw.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
      return paragraphs.map((p) => ({
        type: "general",
        body: p.trim()
      }));
    }

    // Split by bracketed section titles like [Visão Geral], [🧠 Dimensão Mental...], etc.
    const chunks = raw.split(/(?=\[(?:Visão Geral|🧠|❤️|✨|📋|Dimensão|Tarefas)[^\]]*\])/i);
    const sections: ParsedSection[] = [];

    chunks.forEach((chunk) => {
      const trimmed = chunk.trim();
      if (!trimmed) return;

      const headerMatch = trimmed.match(/^\[([^\]]+)\]\s*([\s\S]*)$/);

      if (headerMatch) {
        const headerTitle = headerMatch[1].trim();
        const bodyContent = headerMatch[2].trim();

        if (/🧠|Mental/i.test(headerTitle)) {
          sections.push({
            type: "mental",
            title: headerTitle.replace(/^[🧠\s]+/, "").trim(),
            body: bodyContent
          });
        } else if (/❤️|Emocional/i.test(headerTitle)) {
          sections.push({
            type: "emotional",
            title: headerTitle.replace(/^[❤️\s]+/, "").trim(),
            body: bodyContent
          });
        } else if (/✨|Espiritual/i.test(headerTitle)) {
          sections.push({
            type: "spiritual",
            title: headerTitle.replace(/^[✨\s]+/, "").trim(),
            body: bodyContent
          });
        } else if (/📋|Tarefas/i.test(headerTitle)) {
          // Extract tasks
          const taskLines = bodyContent
            .split(/\n+/)
            .map((l) => l.trim())
            .filter((l) => l.length > 0);

          sections.push({
            type: "tasks",
            title: headerTitle.replace(/^[📋\s]+/, "").trim(),
            body: bodyContent,
            tasks: taskLines
          });
        } else {
          sections.push({
            type: "intro",
            title: headerTitle,
            body: bodyContent
          });
        }
      } else {
        // Unbracketed block (e.g. initial paragraphs before the first bracket)
        sections.push({
          type: "intro",
          body: trimmed
        });
      }
    });

    return sections;
  };

  const sections = parseContent(content);

  return (
    <div className={`space-y-4 ${className}`}>
      {sections.map((sec, idx) => {
        if (sec.type === "intro" || sec.type === "general") {
          return (
            <div key={idx} className="space-y-2">
              {sec.title && (
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {sec.title}
                </h4>
              )}
              <p
                className={`${
                  isReaderMode ? "text-slate-700 text-sm md:text-base leading-relaxed" : "text-slate-600 text-xs leading-relaxed"
                }`}
              >
                {sec.body}
              </p>
            </div>
          );
        }

        if (sec.type === "mental") {
          return (
            <div
              key={idx}
              className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 md:p-4 text-left shadow-xs transition hover:border-indigo-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 block">
                    Pilar 1 • Dimensão Mental
                  </span>
                  <h5 className="text-xs font-bold text-slate-900 leading-tight">
                    {sec.title || "Clareza & Reprogramação de Crenças"}
                  </h5>
                </div>
              </div>
              <p
                className={`${
                  isReaderMode ? "text-slate-700 text-sm leading-relaxed" : "text-slate-600 text-xs leading-relaxed"
                }`}
              >
                {sec.body}
              </p>
            </div>
          );
        }

        if (sec.type === "emotional") {
          return (
            <div
              key={idx}
              className="bg-rose-50/70 border border-rose-100 rounded-xl p-3.5 md:p-4 text-left shadow-xs transition hover:border-rose-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-700 block">
                    Pilar 2 • Dimensão Emocional
                  </span>
                  <h5 className="text-xs font-bold text-slate-900 leading-tight">
                    {sec.title || "Autodomínio & Gestão de Medos"}
                  </h5>
                </div>
              </div>
              <p
                className={`${
                  isReaderMode ? "text-slate-700 text-sm leading-relaxed" : "text-slate-600 text-xs leading-relaxed"
                }`}
              >
                {sec.body}
              </p>
            </div>
          );
        }

        if (sec.type === "spiritual") {
          return (
            <div
              key={idx}
              className="bg-amber-50/70 border border-amber-100 rounded-xl p-3.5 md:p-4 text-left shadow-xs transition hover:border-amber-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 block">
                    Pilar 3 • Dimensão Espiritual
                  </span>
                  <h5 className="text-xs font-bold text-slate-900 leading-tight">
                    {sec.title || "Propósito Maior & Força Interior"}
                  </h5>
                </div>
              </div>
              <p
                className={`${
                  isReaderMode ? "text-slate-700 text-sm leading-relaxed" : "text-slate-600 text-xs leading-relaxed"
                }`}
              >
                {sec.body}
              </p>
            </div>
          );
        }

        if (sec.type === "tasks") {
          return (
            <div
              key={idx}
              className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 md:p-4 text-left shadow-xs"
            >
              <div className="flex items-center justify-between mb-2.5 border-b border-emerald-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ListTodo className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 block">
                      Pilar 4 • Ação Prática
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 leading-tight">
                      {sec.title || "Tarefas Práticas & Plano de Ação do Nicho"}
                    </h5>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  Acionável
                </span>
              </div>

              {sec.tasks && sec.tasks.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {sec.tasks.map((task, tIdx) => {
                    const taskKey = `${idx}-${tIdx}`;
                    const isDone = !!completedTasks[taskKey];
                    // Clean prefix like "• Tarefa 1:" or "1."
                    return (
                      <div
                        key={tIdx}
                        onClick={() => toggleTask(taskKey)}
                        className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition border ${
                          isDone
                            ? "bg-emerald-100/50 border-emerald-300 text-emerald-900 line-through opacity-75"
                            : "bg-white/80 border-emerald-100 hover:border-emerald-300 text-slate-800"
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 shrink-0 text-emerald-600 hover:text-emerald-700"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        <span
                          className={`${
                            isReaderMode ? "text-xs md:text-sm" : "text-xs"
                          } leading-snug font-medium`}
                        >
                          {task}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p
                  className={`${
                    isReaderMode ? "text-slate-700 text-sm leading-relaxed" : "text-slate-600 text-xs leading-relaxed"
                  }`}
                >
                  {sec.body}
                </p>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
