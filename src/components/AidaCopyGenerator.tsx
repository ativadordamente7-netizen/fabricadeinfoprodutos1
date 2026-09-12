import React, { useEffect } from "react";
import { Sparkles, ArrowRight, Check, AlertTriangle, MessageSquare, Copy, Edit3, Heart, Zap, RefreshCw } from "lucide-react";
import { AdCopyOption } from "../../server/adService";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  copies: AdCopyOption[];
  selectedType: "recommended" | "emotional" | "direct";
  editedCopies: {
    recommended: AdCopyOption;
    emotional: AdCopyOption;
    direct: AdCopyOption;
  } | null;
  loading: boolean;
  error: string | null;
  onSelectType: (type: "recommended" | "emotional" | "direct") => void;
  onGenerate: () => void;
  onUpdatePart: (part: keyof AdCopyOption, value: string) => void;
  onNext: () => void;
}

export default function AidaCopyGenerator({
  copies,
  selectedType,
  editedCopies,
  loading,
  error,
  onSelectType,
  onGenerate,
  onUpdatePart,
  onNext
}: Props) {
  // If no copies generated yet, auto trigger or show massive generator button
  useEffect(() => {
    if (copies.length === 0 && !loading && !error) {
      onGenerate();
    }
  }, [copies]);

  const activeCopy = editedCopies ? editedCopies[selectedType] : null;

  // Real-time quality audit
  const auditCopy = (copy: AdCopyOption | null) => {
    if (!copy) return { score: 100, warnings: [] };
    const warnings: string[] = [];
    let score = 100;

    const fullText = `${copy.attention} ${copy.interest} ${copy.desire} ${copy.action}`;
    
    // Check 1: Length check (Facebook Ads ideal copy length)
    if (fullText.length > 800) {
      warnings.push("Copy um pouco longa. Textos com mais de 800 caracteres podem ser cortados no feed móvel ('ver mais').");
      score -= 20;
    }

    // Check 2: Exclamations overload
    const exclamationsCount = (fullText.match(/!/g) || []).length;
    if (exclamationsCount > 6) {
      warnings.push("Pontuação excessiva. O excesso de exclamações (!) pode ser lido pelos algoritmos de anúncio como SPAM e diminuir seu alcance.");
      score -= 15;
    }

    // Check 3: Emojis check
    const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}/gu;
    const emojisCount = (fullText.match(emojiRegex) || []).length;
    if (emojisCount > 10) {
      warnings.push("Sobrecarga de Emojis. Mais de 10 emojis no anúncio pode fazer com que o design pareça amador.");
      score -= 15;
    }

    // Check 4: Capital letters (shouting)
    const upperWords = fullText.split(" ").filter(w => w.length > 4 && w === w.toUpperCase() && !w.includes("!")).length;
    if (upperWords > 4) {
      warnings.push("Palavras inteiras em MAIÚSCULA. Evite gritar com seu lead para não ter sua conta de anúncios bloqueada por agressividade.");
      score -= 10;
    }

    return { score: Math.max(score, 10), warnings };
  };

  const { score, warnings } = auditCopy(activeCopy);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copy copiada com sucesso para a área de transferência! 🎉");
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-fade-in">
      
      {/* Dynamic Title Row */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl text-center md:text-left flex flex-col md:flex-row items-center gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none"></div>
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
            Etapa 2: Gerador de Copy com IA
          </h3>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed max-w-2xl">
            Nossa Inteligência Artificial redigiu 3 opções completas baseadas estritamente na estrutura de conversão AIDA. Escolha a direção que mais se adapta ao seu público e edite qualquer trecho em tempo real.
          </p>
        </div>
        {copies.length > 0 && (
          <button
            type="button"
            disabled={loading}
            onClick={onGenerate}
            className="bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-emerald-500/10 px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition hover:scale-[1.02] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Regerar Copies</span>
          </button>
        )}
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-12 text-center flex flex-col justify-center items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
          <h4 className="font-extrabold text-sm text-slate-300">Escrevendo Copia Persuasiva com IA...</h4>
          <p className="text-slate-500 text-[10px] font-mono leading-none">O cérebro digital está formatando a estrutura AIDA com base na sua oferta.</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center flex flex-col items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-rose-400" />
          <h4 className="font-bold text-sm text-white">Falha ao Conectar com o Redator</h4>
          <p className="text-slate-400 text-xs max-w-md">{error}</p>
          <button
            type="button"
            onClick={onGenerate}
            className="bg-rose-500 hover:bg-rose-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {copies.length > 0 && !loading && activeCopy && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Segment Picker & Interactive Editors (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Custom Tab Picker */}
            <div className="bg-slate-950/40 border border-slate-850 p-1.5 rounded-2xl grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onSelectType("recommended")}
                className={`py-2.5 rounded-xl font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                  selectedType === "recommended"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/5"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>🏆</span>
                <span>Recomendado</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectType("emotional")}
                className={`py-2.5 rounded-xl font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                  selectedType === "emotional"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/5"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>❤️</span>
                <span>Emocional</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectType("direct")}
                className={`py-2.5 rounded-xl font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                  selectedType === "direct"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/5"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>⚡</span>
                <span>Direto</span>
              </button>
            </div>

            {/* Segment Editors Card */}
            <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                  Editor Estrutural do Copywriter
                </span>
                <span className="text-[9px] font-mono font-bold uppercase text-slate-500">Headline & AIDA</span>
              </div>

              {/* Headline Principal do Banner */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-extrabold uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                    <span>📌</span> Headline (Título para o Anúncio / Imagem)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopyText(activeCopy.headline || activeCopy.attention)}
                    className="text-[9px] text-slate-400 hover:text-emerald-300 font-bold flex items-center gap-0.5"
                  >
                    <Copy className="w-3 h-3" /> Copiar
                  </button>
                </div>
                <input
                  type="text"
                  value={activeCopy.headline || ""}
                  onChange={(e) => onUpdatePart("headline", e.target.value)}
                  placeholder="Título magnético para o anúncio..."
                  className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 font-bold"
                />
              </div>

              {/* Subheadline */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-extrabold uppercase text-purple-400 tracking-wider flex items-center gap-1">
                  <span>🎯</span> Subheadline (Subtítulo de Apoio)
                </label>
                <input
                  type="text"
                  value={activeCopy.subheadline || ""}
                  onChange={(e) => onUpdatePart("subheadline", e.target.value)}
                  placeholder="Subtítulo persuasivo de apoio..."
                  className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 font-medium"
                />
              </div>

              <div className="w-full h-px bg-slate-800/80 my-1"></div>

              {/* A - Attention */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-extrabold uppercase text-amber-400 tracking-wider flex items-center gap-1">
                  <span>A</span> • Atenção (Attention / Gancho principal)
                </label>
                <textarea
                  value={activeCopy.attention}
                  onChange={(e) => onUpdatePart("attention", e.target.value)}
                  rows={2}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 font-medium resize-none"
                />
              </div>

              {/* I - Interest */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-extrabold uppercase text-sky-400 tracking-wider flex items-center gap-1">
                  <span>I</span> • Interesse (Interest / Conexão com a dor)
                </label>
                <textarea
                  value={activeCopy.interest}
                  onChange={(e) => onUpdatePart("interest", e.target.value)}
                  rows={2.5}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 font-medium resize-none"
                />
              </div>

              {/* D - Desire */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-extrabold uppercase text-rose-400 tracking-wider flex items-center gap-1">
                  <span>D</span> • Desejo (Desire / A transformação)
                </label>
                <textarea
                  value={activeCopy.desire}
                  onChange={(e) => onUpdatePart("desire", e.target.value)}
                  rows={2.5}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 font-medium resize-none"
                />
              </div>

              {/* A - Action */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-extrabold uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                  <span>A</span> • Ação (Action / Chamada de clique)
                </label>
                <textarea
                  value={activeCopy.action}
                  onChange={(e) => onUpdatePart("action", e.target.value)}
                  rows={2}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Real-Time Stitched Feed Copy & character limits audit (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Quality audit ring widget */}
            <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full border-4 border-slate-850 flex items-center justify-center shrink-0">
                  <div className={`absolute inset-0 rounded-full border-4 ${
                    score >= 80 ? "border-emerald-500" : score >= 50 ? "border-amber-500" : "border-rose-500"
                  }`} style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}></div>
                  <span className="text-xs font-extrabold text-white">{score}%</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-200">Pontuação de Conversão</h4>
                  <p className="text-[9px] text-slate-450 mt-0.5">Auditoria heurística de legibilidade do algoritmo.</p>
                </div>
              </div>

              {warnings.length > 0 ? (
                <div className="flex flex-col gap-2 mt-4 border-t border-slate-850 pt-3">
                  {warnings.map((w, idx) => (
                    <div key={idx} className="flex gap-2 items-start text-[10px] text-amber-400 leading-relaxed font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 mt-4 border-t border-slate-850 pt-3 text-[10px] text-emerald-400 items-center font-bold">
                  <Check className="w-4 h-4" />
                  <span>Sua copy está incrivelmente equilibrada e otimizada! Pronto para anunciar.</span>
                </div>
              )}
            </div>

            {/* Stitched unified output feed box */}
            <div className="bg-slate-900/60 border border-slate-850 rounded-2xl overflow-hidden flex flex-col">
              <div className="bg-slate-950/80 p-3 px-4 border-b border-slate-850 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  Legenda Unificada do Feed
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(activeCopy.primaryText)}
                  className="text-[10px] font-bold text-emerald-400 hover:text-white flex items-center gap-1 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Tudo</span>
                </button>
              </div>

              {/* Feed Text Area Preview */}
              <div className="p-4 bg-slate-950/30 flex-1 min-h-[220px]">
                <pre className="text-[11px] text-slate-300 font-sans font-medium whitespace-pre-wrap leading-relaxed">
                  {activeCopy.primaryText}
                </pre>
              </div>

              <div className="p-2.5 px-4 bg-slate-950/80 border-t border-slate-850 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                <span>Estrutura AIDA Unida</span>
                <span>{activeCopy.primaryText.length} caracteres</span>
              </div>
            </div>

            {/* Advance navigation CTA */}
            <button
              type="button"
              onClick={onNext}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Avançar para Criar Arte Visual</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
