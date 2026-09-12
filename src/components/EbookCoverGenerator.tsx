import React, { useState, useEffect } from "react";
import { 
  Sparkles, RotateCw, FileImage, Layers, HelpCircle, 
  Palette, Check, Download, Image as ImageIcon, Smartphone, 
  Instagram, Layout, ArrowRight, Settings, AlertCircle, Edit3, User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EbookData } from "../types";
import VisualReferenceLibraryModal from "./VisualReferenceLibraryModal";
import VisualStyleLibrary, { VisualDnaStyle } from "./infinity/VisualStyleLibrary";

export interface EbookCoverGeneratorProps {
  ebook: EbookData;
  onUpdate: (coverData: NonNullable<EbookData["cover"]>) => void;
  onUpdateEbook?: (updatedEbook: EbookData) => void;
  niche: string;
  description: string;
  targetAudience: string;
}

type GenerationState = 
  | "idle" 
  | "analyzing" 
  | "buildingConcept" 
  | "generatingImage" 
  | "composingCover" 
  | "creatingVariations" 
  | "readyForReview" 
  | "approved" 
  | "error";

export default function EbookCoverGenerator({ 
  ebook, 
  onUpdate, 
  onUpdateEbook,
  niche, 
  description, 
  targetAudience 
}: EbookCoverGeneratorProps) {
  const [genState, setGenState] = useState<GenerationState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string>("modern");
  const [variationsList, setVariationsList] = useState<any[]>([]);
  const [selectedVarId, setSelectedVarId] = useState<string>("var-1");
  const [viewMode, setViewMode] = useState<"2d" | "3d" | "formats">("3d");
  const [activeFormat, setActiveFormat] = useState<"1:1.6" | "1:1" | "9:16">("1:1.6");
  const [showVisualLibrary, setShowVisualLibrary] = useState<boolean>(false);
  const [showDnaModal, setShowDnaModal] = useState<boolean>(false);
  const [appliedDnaName, setAppliedDnaName] = useState<string>("");

  useEffect(() => {
    const savedPrompt = localStorage.getItem("fabrica_cover_suggested_prompt");
    const savedStyleName = localStorage.getItem("fabrica_cover_suggested_style");
    if (savedPrompt && !customPrompt) {
      setCustomPrompt(savedPrompt);
    }
    if (savedStyleName) {
      setAppliedDnaName(savedStyleName);
    }
  }, []);

  const styles = [
    { id: "modern", name: "Tecnológico / Moderno", desc: "Estruturas abstratas, luzes neon e contrastes digitais" },
    { id: "minimalist", name: "Premium Minimalista", desc: "Sofisticado, foco tipográfico e amplo espaço negativo" },
    { id: "editorial", name: "Editorial Clássico", desc: "Identidade literária limpa, elegante e de alto valor percebido" },
    { id: "emotional", name: "Emocional de Impacto", desc: "Cores profundas, sentimentos latentes e transformações humanas" },
    { id: "artistic", name: "Abstrato / Gradientes", desc: "Texturas luxuosas e gradientes fluidos em ultra-alta definição" },
    { id: "dark_luxury", name: "Dark Luxury VIP Gold", desc: "Fundo metálico escuro com toques dourados metálicos e luxo VIP" },
    { id: "cyberpunk", name: "Cyber / Neon Tech", desc: "Luzes neon, matriz ciberespaço, códigos e circuitos elétricos" },
    { id: "vibrant_fitness", name: "Vibrante & Performance", desc: "Cores energéticas, alta garra, movimento e dinamismo" },
    { id: "corporate", name: "Corporativo Executivo", desc: "Sóbrio, azul de negócios, liderança e autoridade corporativa" },
    { id: "nature_wellness", name: "Orgânico & Saúde", desc: "Tons botânicos, paz, serenidade, equilíbrio e harmonia natural" }
  ];

  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isSuggestingPrompt, setIsSuggestingPrompt] = useState<boolean>(false);
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [galleryCategory, setGalleryCategory] = useState<string>("all");

  const handleSuggestPrompt = async () => {
    setIsSuggestingPrompt(true);
    const token = localStorage.getItem("fabrica_session_token") || sessionStorage.getItem("fabrica_session_token") || "";
    try {
      const res = await fetch("/api/cover/suggest-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": token
        },
        body: JSON.stringify({
          niche: niche || "Geral",
          description: description || ebook.synopsis || "E-book sobre " + ebook.title,
          title: ebook.title,
          forceRefresh: true
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.prompt) {
          setCustomPrompt(data.prompt);
        }
        if (data.style) {
          setSelectedStyle(data.style);
        }
      }
    } catch (err) {
      console.error("Erro ao sugerir prompt:", err);
    } finally {
      setIsSuggestingPrompt(false);
    }
  };

  const triggerGeneration = async () => {
    setGenState("analyzing");
    setErrorMessage("");
    const token = localStorage.getItem("fabrica_session_token") || sessionStorage.getItem("fabrica_session_token") || "";

    try {
      // Smooth transitions for immersive AI feedback
      await new Promise((r) => setTimeout(r, 1000));
      setGenState("buildingConcept");
      await new Promise((r) => setTimeout(r, 1100));
      setGenState("generatingImage");

      const response = await fetch("/api/cover/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": token
        },
        body: JSON.stringify({
          title: ebook.title,
          subtitle: ebook.subtitle,
          author: ebook.author,
          niche,
          description,
          targetAudience,
          style: selectedStyle,
          customPrompt: customPrompt || undefined,
          forceRefresh: true
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Falha na geração de imagem com a IA.");
      }

      const data = await response.json();

      setGenState("composingCover");
      await new Promise((r) => setTimeout(r, 1000));
      setGenState("creatingVariations");
      await new Promise((r) => setTimeout(r, 850));

      setVariationsList(data.variations || []);
      setSelectedVarId(data.defaultVariationId || "var-1");

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

      onUpdate({
        imageUrl: data.imageUrl,
        coverImage: data.imageUrl,
        concept: data.concept,
        style: data.style,
        useAiArt: true,
        ...primaryVar
      });

      setGenState("readyForReview");

    } catch (err: any) {
      console.error("[EbookCoverGenerator] Erro:", err);
      setErrorMessage(err.message || "Erro ao conectar com o serviço de geração de imagens.");
      setGenState("error");
    }
  };

  const handleApplyVariation = (v: any) => {
    setSelectedVarId(v.id);
    onUpdate({
      ...ebook.cover,
      typography: v.typography,
      titleColor: v.titleColor,
      subtitleColor: v.subtitleColor,
      authorColor: v.authorColor,
      overlayColor: v.overlayColor,
      overlayOpacity: v.overlayOpacity,
      alignment: v.alignment,
      fontSizeTitle: v.fontSizeTitle,
      showDecorativeBorder: v.showDecorativeBorder
    });
  };

  const handleUpdateParam = (key: string, val: any) => {
    if (ebook.cover) {
      onUpdate({
        ...ebook.cover,
        [key]: val
      });
    }
  };

  const handleUpdateText = (key: "title" | "subtitle" | "author", val: string) => {
    if (onUpdateEbook) {
      onUpdateEbook({
        ...ebook,
        [key]: val
      });
    }
  };

  const handleSaveApproval = () => {
    setGenState("approved");
  };

  const handleApplyFromVisualLibrary = (coverData: any) => {
    // PRESERVE the existing cover image if coverData doesn't provide a new one
    const existingImg = ebook.cover?.imageUrl || ebook.cover?.coverImage || ebook.coverImage || "";
    const finalImg = coverData.imageUrl || existingImg;
    
    const mergedCover = {
      ...(ebook.cover || {}),
      ...coverData,
      imageUrl: finalImg,
      coverImage: finalImg,
      useAiArt: !!finalImg || coverData.useAiArt !== false
    };

    onUpdate(mergedCover);
    if (onUpdateEbook) {
      onUpdateEbook({
        ...ebook,
        coverImage: finalImg,
        cover: mergedCover
      });
    }
    setGenState("readyForReview");
    setViewMode("3d");
  };

  const handleApplyDnaToCover = (dnaStyle: VisualDnaStyle) => {
    setCustomPrompt(dnaStyle.promptKit.aiCoverPrompt);
    setAppliedDnaName(dnaStyle.name);
    
    // PRESERVE the current cover art completely without destructive resets!
    const existingImg = ebook.cover?.imageUrl || ebook.cover?.coverImage || ebook.coverImage || "";

    const mappedTypography: "Space Grotesk" | "Playfair Display" | "Inter" | "JetBrains Mono" =
      dnaStyle.typography.headingFont === "Cinzel" || dnaStyle.typography.headingFont === "Playfair Display"
        ? "Playfair Display"
        : dnaStyle.typography.headingFont === "JetBrains Mono"
        ? "JetBrains Mono"
        : dnaStyle.typography.headingFont === "Space Grotesk"
        ? "Space Grotesk"
        : "Inter";
    
    const updatedCover = {
      ...(ebook.cover || {}),
      imageUrl: existingImg,
      coverImage: existingImg,
      useAiArt: !!existingImg,
      typography: mappedTypography,
      titleColor: dnaStyle.colors.text,
      subtitleColor: dnaStyle.colors.mutedText,
      authorColor: dnaStyle.colors.accent,
      overlayColor: "gradient" as const,
      overlayOpacity: 0.6,
      styleName: dnaStyle.name,
      appliedDnaId: dnaStyle.id,
      appliedDnaName: dnaStyle.name
    };

    onUpdate(updatedCover);
    if (onUpdateEbook) {
      onUpdateEbook({
        ...ebook,
        coverImage: existingImg,
        cover: updatedCover
      });
    }

    setGenState("readyForReview");
    setViewMode("3d");
    setShowDnaModal(false);
  };

  const hasExistingCoverArt = !!(ebook.cover?.imageUrl || ebook.coverImage);

  return (
    <div id="ebook-cover-generator" className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 flex flex-col gap-5 text-slate-300 backdrop-blur-md">
      
      {/* HEADER BAR */}
      <div className="flex items-center justify-between border-b border-slate-850 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Capa Inteligente com IA</h3>
            <p className="text-[10px] text-slate-400">Design de alta conversão para seu e-book</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* DNA Visual Trigger */}
          <button
            type="button"
            onClick={() => setShowDnaModal(true)}
            className="text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition shadow cursor-pointer"
            title="Escolher e aplicar DNA Visual (Gourmet, Dark Money, etc.) preservando a capa atual"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{appliedDnaName ? `DNA: ${appliedDnaName}` : "🎨 DNA Visual"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowVisualLibrary(true)}
            className="text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-xl border border-slate-700/80 hover:border-emerald-500/50 flex items-center gap-1.5 transition shadow cursor-pointer group"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            <span>Referências do Pinterest</span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full border border-emerald-500/30">
              Novo
            </span>
          </button>

          {ebook.cover?.useAiArt && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
              Ativo
            </span>
          )}
        </div>
      </div>

      {/* REASSURING NON-DESTRUCTIVE DNA BANNER */}
      {appliedDnaName && hasExistingCoverArt && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-emerald-300">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">
              <strong>DNA Visual Vinculado:</strong> A arte da sua capa está <strong>preservada</strong> e harmonizada com a estética <strong>"{appliedDnaName}"</strong>!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowDnaModal(true)}
            className="text-[10px] font-bold text-white bg-emerald-500/20 hover:bg-emerald-500/30 px-2.5 py-1 rounded-lg border border-emerald-500/40 shrink-0 transition"
          >
            Trocar Estilo
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STATE: IDLE */}
        {genState === "idle" && !ebook.cover?.useAiArt && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            {/* Banner de Referências do Pinterest */}
            <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <strong className="text-xs text-white block truncate">
                    Biblioteca de Referências & Prints do Pinterest
                  </strong>
                  <p className="text-[10px] text-slate-400 truncate">
                    Envie prints de capas ou explore modelos por nicho (Receitas, Finanças, IA, Fitness, etc.)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVisualLibrary(true)}
                className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 transition flex items-center gap-1 cursor-pointer"
              >
                <span>Explorar Modelos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-left">1. Seletor Dinâmico de Estilo de Capa (IA)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDnaModal(true)}
                    className="text-[10px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>{appliedDnaName ? `DNA: ${appliedDnaName}` : "🎨 Escolher DNA Visual (Gourmet, Dark Money...)"}</span>
                  </button>
                  <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {styles.length} Estilos
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {styles.map((s) => (
                  <label 
                    key={s.id} 
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer border transition text-left ${
                      selectedStyle === s.id 
                        ? "bg-emerald-500/10 border-emerald-500/50 text-white shadow-sm" 
                        : "border-slate-800/60 bg-slate-900/40 hover:bg-slate-800/40 text-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cover_style"
                      checked={selectedStyle === s.id}
                      onChange={() => setSelectedStyle(s.id)}
                      className="mt-1 accent-emerald-500"
                    />
                    <div>
                      <p className="text-xs font-bold flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-emerald-400" />
                        {s.name}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{s.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* AI Prompt Generator & Custom Prompt Box */}
              <div className="mt-2 border-t border-slate-800/60 pt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">2. Prompt de Imagem Personalizado (Opcional)</span>
                  <button
                    type="button"
                    onClick={handleSuggestPrompt}
                    disabled={isSuggestingPrompt}
                    className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1 transition"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>{isSuggestingPrompt ? "Criando Prompt..." : "Sugerir com IA"}</span>
                  </button>
                </div>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ex: Minimalist dark cover with golden light beams, luxury abstract textures, high contrast 8k resolution"
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition resize-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={triggerGeneration}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>Gerar Capa Inédita com IA (Gemini)</span>
            </button>
          </motion.div>
        )}

        {/* STATE: PROGRESS LOADER */}
        {genState !== "idle" && genState !== "readyForReview" && genState !== "approved" && genState !== "error" && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-5 min-h-[320px]"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
              <Sparkles className="absolute w-6 h-6 text-emerald-400 animate-pulse" />
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                {genState === "analyzing" && "Analisando livro..."}
                {genState === "buildingConcept" && "Definindo conceitos..."}
                {genState === "generatingImage" && "Gerando fundo visual de alta fidelidade..."}
                {genState === "composingCover" && "Vetorizando tipografias..."}
                {genState === "creatingVariations" && "Criando 3 variações..."}
              </h4>
              <p className="text-[11px] text-slate-400">Modelos generativos estruturando a diagramação real e variações comerciais</p>
            </div>

            {/* Steps Track */}
            <div className="w-full max-w-xs flex flex-col gap-2 border-t border-slate-800/60 pt-4 text-left">
              {[
                { id: "analyzing", label: "Extração do nicho, promessa e público" },
                { id: "buildingConcept", label: "Geração de Prompt Visual de alta conversão" },
                { id: "generatingImage", label: "Geração de imagem em proporção de Capa" },
                { id: "composingCover", label: "Formatação de títulos, subtítulos e autor" },
                { id: "creatingVariations", label: "Geração de mockups comerciais de venda" }
              ].map((step, idx) => {
                const statesOrder: GenerationState[] = ["analyzing", "buildingConcept", "generatingImage", "composingCover", "creatingVariations", "readyForReview"];
                const currentIdx = statesOrder.indexOf(genState);
                const stepIdx = statesOrder.indexOf(step.id as any);
                const isDone = stepIdx < currentIdx;
                const isCurrent = step.id === genState;

                return (
                  <div key={step.id} className="flex items-center gap-2.5 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                      isDone ? "bg-emerald-500 text-slate-950" : isCurrent ? "border border-emerald-400 text-emerald-400 animate-pulse" : "border border-slate-800 text-slate-600"
                    }`}>
                      {isDone ? "✓" : idx + 1}
                    </div>
                    <span className={`${isDone ? "text-slate-400" : isCurrent ? "text-white font-bold" : "text-slate-600"}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STATE: READY FOR REVIEW / EDITOR */}
        {((genState === "readyForReview" || genState === "approved" || genState === "idle") && ebook.cover?.useAiArt) && (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            
            {/* Concept summary */}
            {ebook.cover.concept && (
              <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-3 text-left">
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Direção Artística da IA
                </span>
                <p className="text-xs text-slate-300 leading-normal">{ebook.cover.concept}</p>
              </div>
            )}

            {/* Quick Mockup View Select */}
            <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-850 self-center">
              <button
                type="button"
                onClick={() => setViewMode("3d")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "3d" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>3D Mockup</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("2d")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "2d" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <FileImage className="w-3.5 h-3.5" />
                <span>Capa Plana</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("formats")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "formats" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Formatos Canais</span>
              </button>
            </div>

            {/* Format Details if Formats active */}
            {viewMode === "formats" && (
              <div className="bg-slate-950/50 border border-slate-800/50 rounded-xl p-3 flex flex-col gap-2 text-left animate-fade-in">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Adaptar Dimensões</span>
                <div className="flex gap-2">
                  {[
                    { id: "1:1.6", name: "Vertical Ebook (1600x2560)" },
                    { id: "1:1", name: "Quadrado Feed (Instagram)" },
                    { id: "9:16", name: "Stories / Reels" }
                  ].map(form => (
                    <button
                      key={form.id}
                      type="button"
                      onClick={() => setActiveFormat(form.id as any)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[9px] font-bold border transition cursor-pointer ${
                        activeFormat === form.id ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {form.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3 Layout Variations Grid */}
            {variationsList.length > 0 && (
              <div className="flex flex-col gap-1.5 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selecione uma das 3 Variações do Layout</span>
                <div className="grid grid-cols-3 gap-2">
                  {variationsList.map((v, i) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleApplyVariation(v)}
                      className={`p-2 rounded-xl border text-left transition flex flex-col gap-0.5 cursor-pointer ${
                        selectedVarId === v.id 
                          ? "bg-emerald-500/10 border-emerald-500/50 text-white font-bold" 
                          : "bg-slate-950/30 border-slate-850 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="text-[8px] font-bold text-emerald-400/80 uppercase tracking-wider block">Estilo 0{i+1}</span>
                      <span className="text-[10px] truncate leading-tight block">{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* BASIC TEXTS EDITOR (Directly edits Ebook values) */}
            {onUpdateEbook && (
              <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 flex flex-col gap-3 text-left">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-2">
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                  Edição do Conteúdo da Capa
                </h4>
                
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Título do E-book</label>
                  <input
                    type="text"
                    value={ebook.title}
                    onChange={(e) => handleUpdateText("title", e.target.value)}
                    placeholder="Título principal"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Subtítulo / Promessa</label>
                  <textarea
                    value={ebook.subtitle}
                    onChange={(e) => handleUpdateText("subtitle", e.target.value)}
                    placeholder="Subtítulo chamativo de alto impacto"
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 resize-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Nome do Autor</label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={ebook.author}
                      onChange={(e) => handleUpdateText("author", e.target.value)}
                      placeholder="Nome do Especialista"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* QUICK LAYOUT EDITOR CONTROLS */}
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 flex flex-col gap-3 text-left">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-2">
                <Settings className="w-4 h-4 text-emerald-400" />
                Ajustes Visuais e Diagramação
              </h4>

              {/* Typography select */}
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Fonte do Título</label>
                <select
                  value={ebook.cover.typography || "Inter"}
                  onChange={(e) => handleUpdateParam("typography", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="Space Grotesk">Space Grotesk (Tech & Vendas)</option>
                  <option value="Playfair Display">Playfair Display (Premium & Editorial)</option>
                  <option value="Inter">Inter (Swiss & Moderno)</option>
                  <option value="JetBrains Mono">JetBrains Mono (Dados & Tech)</option>
                </select>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Cor do Título</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={ebook.cover.titleColor || "#FFFFFF"}
                      onChange={(e) => handleUpdateParam("titleColor", e.target.value)}
                      className="w-7 h-7 rounded-lg bg-transparent border border-slate-800 cursor-pointer overflow-hidden"
                    />
                    <input
                      type="text"
                      value={ebook.cover.titleColor || "#FFFFFF"}
                      onChange={(e) => handleUpdateParam("titleColor", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Cor do Autor</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={ebook.cover.authorColor || "#10B981"}
                      onChange={(e) => handleUpdateParam("authorColor", e.target.value)}
                      className="w-7 h-7 rounded-lg bg-transparent border border-slate-800 cursor-pointer overflow-hidden"
                    />
                    <input
                      type="text"
                      value={ebook.cover.authorColor || "#10B981"}
                      onChange={(e) => handleUpdateParam("authorColor", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sizes & Opacity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Opacidade Overlay</label>
                  <input
                    type="range"
                    min="0"
                    max="0.9"
                    step="0.05"
                    value={ebook.cover.overlayOpacity ?? 0.55}
                    onChange={(e) => handleUpdateParam("overlayOpacity", parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Alinhamento Texto</label>
                  <div className="grid grid-cols-3 gap-0.5 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    {["top", "center", "bottom"].map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => handleUpdateParam("alignment", align)}
                        className={`py-1 text-[9px] font-bold capitalize rounded-md transition cursor-pointer ${
                          ebook.cover?.alignment === align ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CONTROL ACTIONS */}
            <div className="flex flex-col gap-2">
              {genState === "readyForReview" ? (
                <button
                  type="button"
                  onClick={handleSaveApproval}
                  className="w-full bg-emerald-500 text-slate-950 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:brightness-110 transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Aprovar Capa e Inserir no PDF</span>
                </button>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2 text-left">
                  <Check className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-300 font-semibold">Capa aprovada e vinculada ao livro! Ela será gerada automaticamente na primeira página do PDF.</span>
                </div>
              )}

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={triggerGeneration}
                  className="flex-1 bg-slate-800 hover:bg-slate-750 border border-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Mudar Estilo / Regenerar</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const defaultCoverImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80";
                    onUpdate({
                      useAiArt: true,
                      imageUrl: defaultCoverImage,
                      coverImage: defaultCoverImage,
                      concept: "Conceito Premium e Moderno",
                      style: "modern",
                      typography: "Space Grotesk",
                      titleColor: "#FFFFFF",
                      subtitleColor: "#D1D5DB",
                      authorColor: "#10B981",
                      overlayColor: "gradient",
                      overlayOpacity: 0.55,
                      alignment: "top",
                      fontSizeTitle: 28,
                      showDecorativeBorder: false
                    });
                    setGenState("idle");
                  }}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-400 bg-slate-950 hover:bg-slate-900 border border-slate-800 transition cursor-pointer"
                >
                  Redefinir Capa
                </button>
              </div>
            </div>

          </motion.div>
        )}

        {/* STATE: ERROR */}
        {genState === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-red-950/30 border border-red-900/30 rounded-xl p-5 text-center flex flex-col gap-3"
          >
            <div className="flex items-center justify-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Falha na Geração de Capa</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {errorMessage || "Não foi possível carregar o Gerador Inteligente de Capas. Seu e-book continuará ativo com um template elegante e altamente responsivo para download."}
            </p>
            <button
              type="button"
              onClick={triggerGeneration}
              className="bg-emerald-500 text-slate-950 py-2 px-4 rounded-lg text-xs font-black uppercase tracking-wider self-center hover:scale-[1.02] transition cursor-pointer"
            >
              Tentar Novamente
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: BIBLIOTECA INTELIGENTE DE REFERÊNCIAS VISUAIS (PINTEREST & PRINTS) */}
      <VisualReferenceLibraryModal
        isOpen={showVisualLibrary}
        onClose={() => setShowVisualLibrary(false)}
        ebook={ebook}
        niche={niche}
        description={description}
        targetAudience={targetAudience}
        onApplyCover={handleApplyFromVisualLibrary}
      />

      {/* MODAL: BIBLIOTECA DE DNA VISUAL (GOURMET, DARK MONEY, ETC.) */}
      {showDnaModal && (
        <VisualStyleLibrary
          mode="modal"
          isOpen={showDnaModal}
          onClose={() => setShowDnaModal(false)}
          onApplyToCover={handleApplyDnaToCover}
        />
      )}

    </div>
  );
}
