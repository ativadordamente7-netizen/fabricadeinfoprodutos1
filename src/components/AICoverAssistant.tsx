import React, { useState } from "react";
import { Sparkles, Check, Edit3, Image as ImageIcon, Save, AlertTriangle, RefreshCw, Type, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EbookData } from "../types";

interface AICoverAssistantProps {
  ebook: EbookData;
  niche: string;
  description: string;
  sessionToken?: string;
  onSaveCover: (coverData: any) => void;
  setViewMode: (mode: "2d" | "3d") => void;
}

export default function AICoverAssistant({
  ebook,
  niche,
  description,
  sessionToken,
  onSaveCover,
  setViewMode
}: AICoverAssistantProps) {
  // Generation Workflow States
  const [step, setStep] = useState<"idle" | "prompt_suggested" | "generating_image" | "ready">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [error, setError] = useState("");

  // Prompt suggestions and editing
  const [suggestedPrompt, setSuggestedPrompt] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [suggestedStyle, setSuggestedStyle] = useState("");
  const [designConcept, setDesignConcept] = useState("");

  // Preview generated image and variations
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [tempCoverData, setTempCoverData] = useState<any>(null);

  // 1. Suggest visual prompt with Gemini
  const handleSuggestPrompt = async (forceRefreshParam: boolean | unknown = false) => {
    const isForceRefresh = typeof forceRefreshParam === "boolean" ? forceRefreshParam : false;
    setIsLoading(true);
    setProgressMessage("Analisando nicho e copy para o Gemini...");
    setError("");
    try {
      const response = await fetch("/api/cover/suggest-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken || localStorage.getItem("fabrica_session_token") || ""
        },
        body: JSON.stringify({
          niche: typeof niche === "string" ? niche : "Geral",
          description: typeof description === "string" ? description : (ebook.synopsis || "E-book completo"),
          title: typeof ebook.title === "string" ? ebook.title : "E-book",
          forceRefresh: isForceRefresh
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Falha ao obter sugestão de prompt do Gemini.");
      }

      const data = await response.json();
      setSuggestedPrompt(data.prompt);
      setCustomPrompt(data.prompt);
      setSuggestedStyle(data.style);
      setDesignConcept(data.concept);
      setStep("prompt_suggested");
    } catch (err: any) {
      const msg = typeof err?.message === "string" ? err.message : "Erro de conexão ao obter sugestão do Gemini.";
      setError(msg);
    } finally {
      setIsLoading(false);
      setProgressMessage("");
    }
  };

  // 2. Generate actual cover image using (optional) customPrompt
  const handleGenerateImage = async () => {
    setIsLoading(true);
    setProgressMessage("Enviando prompt ao Imagen 3...");
    setStep("generating_image");
    setError("");
    try {
      // Simulate artistic steps
      await new Promise((r) => setTimeout(r, 600));
      setProgressMessage("Construindo paleta de cores...");
      await new Promise((r) => setTimeout(r, 600));
      setProgressMessage("Renderizando detalhes de fundo em alta definição...");

      const response = await fetch("/api/cover/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken || localStorage.getItem("fabrica_session_token") || ""
        },
        body: JSON.stringify({
          title: ebook.title,
          subtitle: ebook.subtitle,
          niche: niche || "Geral",
          description: description || ebook.synopsis || "E-book completo",
          author: ebook.author || "Especialista",
          style: suggestedStyle || "modern",
          customPrompt: customPrompt,
          forceRefresh: true
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erro ao renderizar a imagem da capa.");
      }

      const data = await response.json();
      
      const primaryVar = data.variations?.[0] || {
        typography: "Space Grotesk",
        titleColor: "#FFFFFF",
        subtitleColor: "#D1D5DB",
        authorColor: "#10B981",
        overlayColor: "gradient",
        overlayOpacity: 0.55,
        alignment: "top",
        fontSizeTitle: 28,
        showDecorativeBorder: false
      };

      const finalCover = {
        useAiArt: true,
        imageUrl: data.imageUrl,
        coverImage: data.imageUrl,
        concept: data.concept,
        style: data.style,
        typography: primaryVar.typography,
        titleColor: primaryVar.titleColor,
        subtitleColor: primaryVar.subtitleColor,
        authorColor: primaryVar.authorColor,
        overlayColor: primaryVar.overlayColor,
        overlayOpacity: primaryVar.overlayOpacity,
        alignment: primaryVar.alignment,
        fontSizeTitle: primaryVar.fontSizeTitle,
        showDecorativeBorder: primaryVar.showDecorativeBorder
      };

      setPreviewImageUrl(data.imageUrl);
      setTempCoverData(finalCover);
      setStep("ready");
    } catch (err: any) {
      setError(err.message || "Falha na geração de imagem com a IA.");
      setStep("prompt_suggested");
    } finally {
      setIsLoading(false);
      setProgressMessage("");
    }
  };

  // 3. Save / Apply to the current e-book
  const handleApplyCover = () => {
    if (tempCoverData) {
      onSaveCover(tempCoverData);
      setViewMode("3d");
    }
  };

  return (
    <div id="ai-cover-assistant" className="w-full max-w-sm mt-6 p-5 rounded-2xl bg-slate-900 border border-slate-800 text-left relative overflow-hidden flex flex-col gap-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-start gap-3">
        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Gerador de Capa Avançado com IA</h4>
          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
            Análise criativa com Gemini-3.5-flash e renderização exclusiva sem poluição de texto.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] rounded-xl flex gap-1.5 items-start">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-col gap-3"
          >
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 text-[11px] text-slate-400 flex flex-col gap-1 leading-relaxed">
              <span className="font-bold text-slate-300">Como funciona:</span>
              <span>1. Nossa IA analisará o nicho (<strong>{niche || "Geral"}</strong>) e as dores do público.</span>
              <span>2. Ela criará um <strong>prompt visual ultra-detalhado</strong>.</span>
              <span>3. Você poderá editar esse prompt livremente antes de gerar a imagem final.</span>
            </div>

            <button
              type="button"
              onClick={() => handleSuggestPrompt(false)}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{progressMessage || "Analisando..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gerar Capa com IA 🚀</span>
                </>
              )}
            </button>
          </motion.div>
        )}

        {(step === "prompt_suggested" || step === "generating_image") && (
          <motion.div
            key="prompt_suggested"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Conceito Proposto pelo Diretor de Arte:</span>
              <p className="text-[11px] text-slate-200 leading-relaxed italic">"{designConcept}"</p>
              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-800/60">
                <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">Estilo sugerido:</span>
                <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold uppercase">{suggestedStyle}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                Prompt Visual Sugerido (Você pode editar em inglês):
              </label>
              <textarea
                rows={4}
                value={customPrompt}
                disabled={isLoading}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-[11px] text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition leading-relaxed resize-none font-mono"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSuggestPrompt(true)}
                disabled={isLoading}
                className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold py-2.5 px-3 rounded-xl text-[11px] transition flex items-center justify-center gap-1 border border-slate-700/60 disabled:opacity-50"
                title="Regerar prompt sugerido"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading && step === "prompt_suggested" ? "animate-spin" : ""}`} />
                <span>Refazer Prompt</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={isLoading}
                className="flex-[2] bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold py-2.5 px-3 rounded-xl text-[11px] transition flex items-center justify-center gap-1.5 hover:brightness-110 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span className="truncate">{progressMessage || "Renderizando..."}</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Renderizar Imagem 🖼️</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === "ready" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-4"
          >
            <div className="relative aspect-[3/4] max-w-[140px] mx-auto rounded-xl overflow-hidden shadow-xl border border-slate-800 bg-slate-950 flex items-center justify-center group">
              <img
                src={previewImageUrl}
                alt="AI Cover Preview"
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-200 flex items-end justify-center p-2">
                <span className="text-[9px] text-slate-300 font-mono">Visualização Prévia</span>
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl flex flex-col gap-1.5 text-[11px] text-slate-300 leading-relaxed">
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <Check className="w-4 h-4 shrink-0" />
                <span>Visualização gerada com sucesso!</span>
              </div>
              <p className="text-slate-400 text-[10px]">
                Você pode salvar esta arte como sua capa principal do e-book ou continuar editando o prompt para testar novas ideias de design.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep("prompt_suggested")}
                className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold py-3 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1 border border-slate-700/60"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Prompt</span>
              </button>

              <button
                type="button"
                onClick={handleApplyCover}
                className="flex-[1.5] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs shadow-lg shadow-emerald-500/10 transition flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar na Capa</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
