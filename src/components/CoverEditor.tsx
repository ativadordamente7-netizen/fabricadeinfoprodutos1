import React, { useState } from "react";
import { Sparkles, Eye, Layout, Settings2, Sliders, Check, RotateCw, FileImage, Layers, HelpCircle, Palette, LayoutGrid, Image as ImageIcon } from "lucide-react";
import { EbookData } from "../types";

interface Props {
  ebook: EbookData;
  onUpdate: (coverData: NonNullable<EbookData["cover"]>) => void;
  niche: string;
  description: string;
  targetAudience: string;
}

type GenerationState = "idle" | "analyzing" | "buildingConcept" | "generatingImage" | "composingCover" | "creatingVariations" | "readyForReview" | "error";

export default function CoverEditor({ ebook, onUpdate, niche, description, targetAudience }: Props) {
  const [genState, setGenState] = useState<GenerationState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string>("modern");
  const [selectedSize, setSelectedSize] = useState<"1K" | "2K" | "4K">("1K");
  const [variationsList, setVariationsList] = useState<any[]>([]);
  const [selectedVarId, setSelectedVarId] = useState<string>("");
  const [viewMode, setViewMode] = useState<"2d" | "3d">("3d");

  const [showGallery, setShowGallery] = useState(false);
  const [galleryCategory, setGalleryCategory] = useState<string>("all");

  const styles = [
    { id: "modern", name: "Tecnológico / Moderno", desc: "Geométrico, cores fortes e contrastes" },
    { id: "minimalist", name: "Premium Minimalista", desc: "Muito espaço, elegância e foco tipográfico" },
    { id: "editorial", name: "Editorial Clássico", desc: "Estilo revista literária de alto luxo" },
    { id: "emotional", name: "Emocional de Impacto", desc: "Cores profundas, drama e superação" },
    { id: "artistic", name: "Abstrato / Gradientes", desc: "Líquido, moderno, gradientes dinâmicos" },
    { id: "dark_luxury", name: "Dark Luxury VIP Gold", desc: "Fundo metálico escuro com toques dourados VIP" },
    { id: "cyberpunk", name: "Cyber / Neon Tech", desc: "Luzes neon, matriz ciberespaço e circuitos" },
    { id: "vibrant_fitness", name: "Vibrante & Performance", desc: "Cores energéticas, alta garra e ação" },
    { id: "corporate", name: "Corporativo Executivo", desc: "Sóbrio, azul de negócios e autoridade" },
    { id: "nature_wellness", name: "Orgânico & Saúde", desc: "Tons botânicos, paz e harmonia natural" }
  ];

  const stockGalleryCategories = [
    {
      niche: "Emagrecimento & Fitness",
      items: [
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop"
      ]
    },
    {
      niche: "Finanças & Investimentos",
      items: [
        "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop"
      ]
    },
    {
      niche: "Marketing & Vendas",
      items: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop"
      ]
    },
    {
      niche: "Tecnologia & IA",
      items: [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop"
      ]
    },
    {
      niche: "Desenvolvimento Pessoal",
      items: [
        "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop"
      ]
    },
    {
      niche: "Relacionamentos",
      items: [
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511988617408-6beb061fc5e8?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop"
      ]
    },
    {
      niche: "Estética & Beleza",
      items: [
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512290900673-70020087114e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop"
      ]
    },
    {
      niche: "Gastronomia",
      items: [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop"
      ]
    }
  ];

  const triggerCoverGeneration = async () => {
    setGenState("analyzing");
    setErrorMessage("");
    
    const token = localStorage.getItem("sessionToken");

    try {
      // Step 1: Simulated flow transitions for perfect UX
      await new Promise(r => setTimeout(r, 800));
      setGenState("buildingConcept");
      await new Promise(r => setTimeout(r, 800));
      setGenState("generatingImage");

      // Step 2: Fire real server request with forceRefresh to NEVER repeat stale cache
      const response = await fetch("/api/cover/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-Session-Token": token || ""
        },
        body: JSON.stringify({
          title: ebook.title,
          subtitle: ebook.subtitle,
          author: ebook.author,
          niche,
          description,
          targetAudience,
          style: selectedStyle,
          imageSize: selectedSize,
          forceRefresh: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro desconhecido na geração.");
      }

      const data = await response.json();

      setGenState("composingCover");
      await new Promise(r => setTimeout(r, 600));
      setGenState("creatingVariations");
      await new Promise(r => setTimeout(r, 600));

      setVariationsList(data.variations || []);
      
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

      setSelectedVarId(data.defaultVariationId || "var-1");

      // Save to main Ebook Object
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
      console.error(err);
      setErrorMessage(err.message || "Erro de conexão ao servidor.");
      setGenState("error");
    }
  };

  const selectStockImage = (url: string) => {
    onUpdate({
      ...ebook.cover,
      useAiArt: true,
      imageUrl: url,
      coverImage: url,
      concept: "Imagem selecionada manualmente da Galeria de Capas Prontas",
      typography: ebook.cover?.typography || "Space Grotesk",
      titleColor: ebook.cover?.titleColor || "#FFFFFF",
      subtitleColor: ebook.cover?.subtitleColor || "#D1D5DB",
      authorColor: ebook.cover?.authorColor || "#10B981",
      overlayColor: ebook.cover?.overlayColor || "gradient",
      overlayOpacity: ebook.cover?.overlayOpacity ?? 0.55,
      alignment: ebook.cover?.alignment || "top",
      fontSizeTitle: ebook.cover?.fontSizeTitle || 28,
      showDecorativeBorder: ebook.cover?.showDecorativeBorder ?? false
    });
    setGenState("readyForReview");
  };

  const applyVariation = (v: any) => {
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

  const updateCoverParam = (key: string, value: any) => {
    if (ebook.cover) {
      onUpdate({
        ...ebook.cover,
        [key]: value
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4 text-slate-300">
      
      {/* 1. STATE INDICATORS & TRIGGER PANEL */}
      {genState === "idle" && !ebook.cover?.useAiArt && (
        <div className="flex flex-col gap-4">
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-2.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Direção Inicial</span>
            <div className="flex flex-col gap-1.5">
              {styles.map(s => (
                <label 
                  key={s.id} 
                  className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer border transition text-left ${
                    selectedStyle === s.id ? "bg-emerald-500/5 border-emerald-500/30 text-white" : "border-transparent hover:bg-slate-800/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="style_direction"
                    checked={selectedStyle === s.id}
                    onChange={() => setSelectedStyle(s.id)}
                    className="mt-1 accent-emerald-500"
                  />
                  <div>
                    <p className="text-xs font-bold">{s.name}</p>
                    <p className="text-[10px] text-slate-400 leading-tight">{s.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Quality Resolution Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Qualidade da Imagem (Gemini 3 Pro)</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                gemini-3-pro-image-preview
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(["1K", "2K", "4K"] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer border ${
                    selectedSize === sz
                      ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                  }`}
                >
                  {sz} {sz === "1K" ? "HD" : sz === "2K" ? "2K HD" : "4K Ultra"}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={triggerCoverGeneration}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98]"
          >
            <Sparkles className="w-4.5 h-4.5 animate-pulse" />
            <span>Gerar Capa ({selectedSize}) com IA</span>
          </button>
        </div>
      )}

      {/* 2. LOADING STATE WITH REALTIME STEPPER PROGRESS */}
      {genState !== "idle" && genState !== "readyForReview" && genState !== "error" && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-5 min-h-[300px]">
          {/* Glowing Animated Spinner */}
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
            <Sparkles className="absolute w-6 h-6 text-emerald-400 animate-pulse" />
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Criando Capa Exclusiva</h4>
            <p className="text-xs text-slate-400">Dividindo em Etapa 1 (Gerar Arte com gemini-3-pro-image-preview) e Etapa 2 (Diagramação)...</p>
          </div>

          {/* Stepper Steps UI */}
          <div className="w-full max-w-xs flex flex-col gap-2 mt-2 border-t border-slate-800/80 pt-4 text-left">
            {[
              { id: "analyzing", label: "Analisando nicho e copy..." },
              { id: "buildingConcept", label: "Definindo cores e direção artística..." },
              { id: "generatingImage", label: `Gerando imagem em ${selectedSize} (gemini-3-pro-image-preview)...` },
              { id: "composingCover", label: "Formatando sobreposição e textos..." },
              { id: "creatingVariations", label: "Calculando 3 variações de layout..." }
            ].map((step, idx) => {
              const states = ["analyzing", "buildingConcept", "generatingImage", "composingCover", "creatingVariations", "readyForReview"];
              const currentIdx = states.indexOf(genState);
              const stepIdx = states.indexOf(step.id);
              const isCompleted = stepIdx < currentIdx;
              const isActive = step.id === genState;

              return (
                <div key={step.id} className="flex items-center gap-2 text-xs">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                    isCompleted ? "bg-emerald-500 text-slate-950" : isActive ? "border border-emerald-400 text-emerald-400 animate-pulse" : "border border-slate-800 text-slate-500"
                  }`}>
                    {isCompleted ? "✓" : idx + 1}
                  </div>
                  <span className={`${isCompleted ? "text-slate-400 font-medium" : isActive ? "text-white font-bold" : "text-slate-600"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. READY FOR REVIEW / APPROVED VIEW */}
      {((genState === "readyForReview" || genState === "idle") && ebook.cover?.useAiArt) && (
        <div className="flex flex-col gap-4">
          
          {/* Concept Banner */}
          {ebook.cover.concept && (
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-1 text-left">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Conceito Criativo da IA
              </span>
              <p className="text-xs text-slate-300 leading-normal">{ebook.cover.concept}</p>
            </div>
          )}

          {/* Quick Mockup View Switch */}
          <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/60 self-center">
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === "3d" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Mockup 3D Comercial</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("2d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === "2d" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <FileImage className="w-3.5 h-3.5" />
              <span>Capa Plana (PDF)</span>
            </button>
          </div>

          {/* 3 VARIATIONS SELECTION */}
          {variationsList.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left block">Opções de Diagramação</span>
              <div className="grid grid-cols-3 gap-2">
                {variationsList.map((v, i) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => applyVariation(v)}
                    className={`py-2 px-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                      selectedVarId === v.id ? "bg-emerald-500/10 border-emerald-500/50 text-white font-bold" : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    <span className="text-[9px] font-bold block opacity-60">Opção 0{i + 1}</span>
                    <span className="text-[10px] truncate leading-tight block">{v.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MANUAL ADJUSTMENTS EDITOR */}
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3.5 text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Settings2 className="w-4 h-4 text-emerald-400" />
              Ajustes Finos de Estilo
            </h4>

            {/* Typography Selector */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Tipografia do Título</label>
              <select
                value={ebook.cover.typography || "Inter"}
                onChange={(e) => updateCoverParam("typography", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="Space Grotesk">Space Grotesk (Tech/Vendas)</option>
                <option value="Playfair Display">Playfair Display (Premium/Editorial)</option>
                <option value="Inter">Inter (Swiss/Moderno)</option>
                <option value="JetBrains Mono">JetBrains Mono (Dados/Mono)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Title Color */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cor do Título (Livre)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={ebook.cover.titleColor || "#FFFFFF"}
                    onChange={(e) => updateCoverParam("titleColor", e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border border-slate-800 cursor-pointer overflow-hidden shrink-0"
                  />
                  <input
                    type="text"
                    value={ebook.cover.titleColor || "#FFFFFF"}
                    onChange={(e) => updateCoverParam("titleColor", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none"
                  />
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {[
                    "#FFFFFF", "#F59E0B", "#FACC15", "#10B981", "#22D3EE", "#3B82F6", "#8B5CF6", "#EC4899", "#EF4444"
                  ].map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => updateCoverParam("titleColor", hex)}
                      className={`w-5 h-5 rounded-md border transition cursor-pointer ${
                        (ebook.cover.titleColor || "#FFFFFF").toLowerCase() === hex.toLowerCase() ? "border-emerald-400 scale-110 ring-1 ring-emerald-400" : "border-slate-800"
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cor do Autor/Marca</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={ebook.cover.authorColor || "#10B981"}
                    onChange={(e) => updateCoverParam("authorColor", e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border border-slate-800 cursor-pointer overflow-hidden shrink-0"
                  />
                  <input
                    type="text"
                    value={ebook.cover.authorColor || "#10B981"}
                    onChange={(e) => updateCoverParam("authorColor", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none"
                  />
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {[
                    "#10B981", "#F59E0B", "#22D3EE", "#3B82F6", "#8B5CF6", "#EC4899", "#FFFFFF"
                  ].map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => updateCoverParam("authorColor", hex)}
                      className={`w-5 h-5 rounded-md border transition cursor-pointer ${
                        (ebook.cover.authorColor || "#10B981").toLowerCase() === hex.toLowerCase() ? "border-emerald-400 scale-110 ring-1 ring-emerald-400" : "border-slate-800"
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Overlay Opacity */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Legibilidade do Texto</label>
                <input
                  type="range"
                  min="0"
                  max="0.9"
                  step="0.05"
                  value={ebook.cover.overlayOpacity ?? 0.5}
                  onChange={(e) => updateCoverParam("overlayOpacity", parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 mt-2"
                />
              </div>

              {/* Alignment Selector */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Alinhamento vertical</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                  {["top", "center", "bottom"].map(pos => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => updateCoverParam("alignment", pos)}
                      className={`py-1 rounded-md text-[9px] font-bold capitalize transition ${
                        ebook.cover?.alignment === pos ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Title Size */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Tamanho do Título</label>
                <input
                  type="range"
                  min="20"
                  max="44"
                  step="1"
                  value={ebook.cover.fontSizeTitle || 28}
                  onChange={(e) => updateCoverParam("fontSizeTitle", parseInt(e.target.value))}
                  className="w-full accent-emerald-500 mt-2"
                />
              </div>

              {/* Decorative Border Toggle */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Borda Decorativa</label>
                <button
                  type="button"
                  onClick={() => updateCoverParam("showDecorativeBorder", !ebook.cover?.showDecorativeBorder)}
                  className={`w-full py-1.5 px-3 rounded-lg text-[10px] font-bold border transition ${
                    ebook.cover?.showDecorativeBorder ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  {ebook.cover?.showDecorativeBorder ? "Ativada" : "Desativada"}
                </button>
              </div>
            </div>
          </div>

          {/* REGENERATE TRIGGER & GALLERY BUTTONS */}
          <div className="flex flex-col gap-2.5">
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={triggerCoverGeneration}
                className="flex-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-500/30 transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Gerar Capa Inédita (IA)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowGallery(!showGallery)}
                className="flex-1 bg-slate-800 hover:bg-slate-750 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-teal-400" />
                <span>{showGallery ? "Ocultar Galeria" : "Galeria de Fundos Prontos"}</span>
              </button>
            </div>

            {/* Custom URL Input toggle */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-teal-400" /> Ou cole a URL da sua própria Imagem de Fundo:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://exemplo.com/imagem-capa.jpg"
                  value={ebook.cover?.imageUrl || ""}
                  onChange={(e) => updateCoverParam("imageUrl", e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (ebook.cover?.imageUrl) {
                      updateCoverParam("coverImage", ebook.cover.imageUrl);
                    }
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  Aplicar
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onUpdate({ ...ebook.cover, useAiArt: false });
                setVariationsList([]);
                setGenState("idle");
              }}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 transition self-center w-full"
            >
              Remover Capa do E-book
            </button>
          </div>

          {/* GALLERY DRAWER */}
          {showGallery && (
            <div className="bg-slate-950 border border-teal-500/30 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl animate-fadeIn text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                  <LayoutGrid className="w-4 h-4" /> Galeria de Imagens de Fundo em Alta Resolução
                </span>
                <button
                  type="button"
                  onClick={() => setShowGallery(false)}
                  className="text-xs text-slate-500 hover:text-white"
                >
                  ✕ Fechar
                </button>
              </div>

              {/* Category selector pill filters */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setGalleryCategory("all")}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition ${
                    galleryCategory === "all" ? "bg-teal-500 text-slate-950" : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  Todas Categorias
                </button>
                {stockGalleryCategories.map(cat => (
                  <button
                    key={cat.niche}
                    type="button"
                    onClick={() => setGalleryCategory(cat.niche)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition ${
                      galleryCategory === cat.niche ? "bg-teal-500 text-slate-950" : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat.niche}
                  </button>
                ))}
              </div>

              {/* Grid of gallery covers */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-1 scrollbar-thin">
                {stockGalleryCategories
                  .filter(cat => galleryCategory === "all" || galleryCategory === cat.niche)
                  .flatMap(cat => cat.items.map(url => ({ url, niche: cat.niche })))
                  .map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        selectStockImage(item.url);
                        setShowGallery(false);
                      }}
                      className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-slate-800 hover:border-teal-400 transition group focus:outline-none"
                    >
                      <img
                        src={item.url}
                        alt={item.niche}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="bg-teal-500 text-slate-950 text-[9px] font-black px-2 py-1 rounded-md shadow">
                          Usar Esta
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 4. ERROR STATE */}
      {genState === "error" && (
        <div className="bg-red-950/30 border border-red-900/30 rounded-xl p-5 text-center flex flex-col gap-3">
          <p className="text-xs text-red-400 leading-relaxed font-semibold">
            {errorMessage || "Não foi possível conectar ao Gerador de Capas. Seu e-book continuará usando um template alternativo sofisticado para download."}
          </p>
          <button
            type="button"
            onClick={triggerCoverGeneration}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs py-2.5 px-4 rounded-xl font-bold transition self-center"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* 5. VISUAL PREVIEW BLOCK EXPORTED VIA PORTALS OR COMPANION REF */}
      {ebook.cover?.useAiArt && (
        <div className="hidden">
          {/* We've embedded the visual previews directly into EbookStep.tsx using the active state of CoverEditor */}
        </div>
      )}

    </div>
  );
}
