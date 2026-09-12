import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  Sparkles,
  Search,
  Upload,
  Image as ImageIcon,
  Check,
  Copy,
  ChevronRight,
  Palette,
  Type,
  Lightbulb,
  Zap,
  Eye,
  Sliders,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Layers,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EbookData, VisualReferenceModel, VisualAnalysisResult } from "../types";
import { CURATED_VISUAL_REFERENCES } from "../data/curatedVisualReferences";

interface VisualReferenceLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  ebook: EbookData;
  niche: string;
  description: string;
  targetAudience?: string;
  sessionToken?: string;
  onApplyCover: (coverData: any) => void;
}

export default function VisualReferenceLibraryModal({
  isOpen,
  onClose,
  ebook,
  niche,
  description,
  targetAudience,
  sessionToken,
  onApplyCover
}: VisualReferenceLibraryModalProps) {
  // Main tabs: 'catalog' | 'upload_analyze'
  const [activeTab, setActiveTab] = useState<"catalog" | "upload_analyze">("catalog");

  // Mobile sub-tab for catalog: 'list' | 'inspector'
  const [mobileCatalogTab, setMobileCatalogTab] = useState<"list" | "inspector">("list");

  // Catalog State
  const [references, setReferences] = useState<VisualReferenceModel[]>(CURATED_VISUAL_REFERENCES);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<VisualReferenceModel | null>(() => {
    // Initial best match
    const matching = CURATED_VISUAL_REFERENCES.find(
      (r) =>
        r.niche.toLowerCase().includes((niche || "").toLowerCase()) ||
        (niche || "").toLowerCase().includes(r.category)
    );
    return matching || CURATED_VISUAL_REFERENCES[0] || null;
  });

  // Upload & Custom Print Analysis State
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string>("");
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [analysisNotes, setAnalysisNotes] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<VisualAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string>("");

  // Generation from Reference State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>("");
  const [generationError, setGenerationError] = useState<string>("");

  // Clipboard helper
  const [copiedHex, setCopiedHex] = useState<string>("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load catalog on open and merge with backend
  useEffect(() => {
    if (isOpen) {
      loadCatalog();
    }
  }, [isOpen]);

  const loadCatalog = async () => {
    setLoadingCatalog(true);
    try {
      const res = await fetch("/api/cover/visual-references", {
        headers: {
          "x-session-token": sessionToken || localStorage.getItem("fabrica_session_token") || ""
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.references) && data.references.length > 0) {
          setReferences(data.references);
          if (!selectedModel) {
            const matching = data.references.find(
              (r: VisualReferenceModel) =>
                r.niche.toLowerCase().includes((niche || "").toLowerCase()) ||
                (niche || "").toLowerCase().includes(r.category)
            );
            setSelectedModel(matching || data.references[0]);
          }
        }
      }
    } catch (err) {
      console.warn("[VisualLibrary] Usando referências locais curadas:", err);
    } finally {
      setLoadingCatalog(false);
    }
  };

  // Handle file drop or selection
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setAnalysisError("Por favor, selecione um arquivo de imagem válido (PNG, JPG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImageBase64(result);
      setAnalysisError("");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Trigger Deep Visual Analysis with Gemini
  const handleAnalyzePrint = async () => {
    if (!uploadedImageBase64 && !imageUrlInput) {
      setAnalysisError("Envie um print/screenshot ou informe a URL de uma imagem para analisar.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError("");
    setAnalysisResult(null);

    setAnalysisProgress("1/4: Processando print com visão computacional...");
    const t1 = setTimeout(() => setAnalysisProgress("2/4: Classificando arquétipo visual e nicho..."), 1200);
    const t2 = setTimeout(() => setAnalysisProgress("3/4: Extraindo paleta cromática e hierarquia tipográfica..."), 2600);
    const t3 = setTimeout(() => setAnalysisProgress("4/4: Sintetizando fórmula de capa inédita para seu e-book..."), 4000);

    try {
      const res = await fetch("/api/cover/analyze-reference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken || localStorage.getItem("fabrica_session_token") || ""
        },
        body: JSON.stringify({
          imageBase64: uploadedImageBase64 || undefined,
          imageUrl: imageUrlInput || undefined,
          notes: analysisNotes,
          niche: niche || "Geral",
          title: ebook.title || "Infoproduto",
          description: description || ebook.synopsis || "Guia definitivo",
          forceRefresh: true
        })
      });

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Falha ao analisar a referência visual com a IA.");
      }

      const result: VisualAnalysisResult = await res.json();
      setAnalysisResult(result);
    } catch (err: any) {
      setAnalysisError(err.message || "Erro de conexão ao analisar o print. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress("");
    }
  };

  // Generate Original Cover from Reference or Custom Analysis
  const handleGenerateOriginalCover = async (
    referenceModel?: VisualReferenceModel,
    customAnalysis?: VisualAnalysisResult
  ) => {
    setIsGenerating(true);
    setGenerationError("");
    setGenerationStatus("Diretor de Arte IA aplicando os padrões visuais...");

    const t1 = setTimeout(() => setGenerationStatus("Renderizando arte exclusiva via Gemini (sem plágio)..."), 2000);
    const t2 = setTimeout(() => setGenerationStatus("Ajustando paleta de cores e tipografia de alta conversão..."), 5000);

    try {
      const res = await fetch("/api/cover/generate-from-reference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken || localStorage.getItem("fabrica_session_token") || ""
        },
        body: JSON.stringify({
          referenceId: referenceModel?.id,
          analysis: customAnalysis,
          title: ebook.title || "Meu E-book",
          subtitle: ebook.subtitle || "",
          niche: niche || "Geral",
          description: description || ebook.synopsis || "Guia prático",
          author: ebook.author || "Especialista",
          targetAudience: targetAudience || ""
        })
      });

      clearTimeout(t1);
      clearTimeout(t2);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Falha ao gerar capa a partir da referência.");
      }

      const coverResponse = await res.json();

      const defaultVar = coverResponse.variations?.[0];
      onApplyCover({
        imageUrl: coverResponse.imageUrl,
        coverImage: coverResponse.imageUrl,
        style: coverResponse.style,
        concept: coverResponse.concept,
        typography: defaultVar?.typography || "Space Grotesk",
        titleColor: defaultVar?.titleColor || "#FFFFFF",
        subtitleColor: defaultVar?.subtitleColor || "#E2E8F0",
        authorColor: defaultVar?.authorColor || "#10B981",
        overlayColor: defaultVar?.overlayColor || "dark",
        overlayOpacity: defaultVar?.overlayOpacity ?? 0.65,
        alignment: defaultVar?.alignment || "top",
        fontSizeTitle: defaultVar?.fontSizeTitle || 32,
        showDecorativeBorder: defaultVar?.showDecorativeBorder ?? true,
        useAiArt: true
      });

      onClose();
    } catch (err: any) {
      setGenerationError(err.message || "Erro ao sintetizar a nova capa. Tente novamente.");
    } finally {
      setIsGenerating(false);
      setGenerationStatus("");
    }
  };

  const copyToClipboard = (text: string, isHex = false) => {
    navigator.clipboard.writeText(text);
    if (isHex) {
      setCopiedHex(text);
      setTimeout(() => setCopiedHex(""), 1800);
    } else {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const categories = [
    { id: "all", label: "Todos os Nichos" },
    { id: "receitas", label: "🍳 Gastronomia" },
    { id: "financas", label: "💰 Finanças" },
    { id: "tech_ia", label: "🤖 Tecnologia & IA" },
    { id: "emagrecimento", label: "🏃 Fitness & Saúde" },
    { id: "espiritualidade", label: "🧘 Espiritualidade" },
    { id: "negocios", label: "📈 Negócios" },
    { id: "estetica", label: "💄 Beleza & Estética" }
  ];

  // Filter references by category and search query
  const filteredReferences = useMemo(() => {
    return references.filter((r) => {
      const matchCat = selectedCategory === "all" || r.category === selectedCategory;
      if (!matchCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.niche.toLowerCase().includes(q) ||
        r.archetype.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    });
  }, [references, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-6xl h-[94vh] sm:h-[90vh] max-h-[900px] flex flex-col overflow-hidden text-slate-100"
      >
        {/* HEADER BAR */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 bg-slate-900/95 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                  Biblioteca Inteligente de Referências Visuais
                </h3>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 whitespace-nowrap">
                  Estilo Pinterest & Best-Sellers
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                Extraia padrões de alta conversão para criar capas originais e inéditas sem plágio.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer shrink-0 ml-2"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-2 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab("catalog");
                setMobileCatalogTab("list");
              }}
              className={`px-3.5 sm:px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === "catalog"
                  ? "border-emerald-500 text-emerald-400 bg-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Modelos Curados por Nicho ({references.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("upload_analyze")}
              className={`px-3.5 sm:px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === "upload_analyze"
                  ? "border-emerald-500 text-emerald-400 bg-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Analisar Meu Próprio Print (Pinterest / Livro)</span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-500/30 font-mono font-bold whitespace-nowrap">
                Visão IA
              </span>
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 bg-slate-950/40">
          {/* TAB 1: CATALOG */}
          {activeTab === "catalog" && (
            <div className="flex flex-col gap-4 h-full">
              {/* SEARCH & NICHE FILTER BAR */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-2.5 sm:p-3 rounded-2xl border border-slate-800">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nicho ou estilo (ex: minimalista, finanças, tech...)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1 text-[10px]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Categories horizontal pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                        selectedCategory === cat.id
                          ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                          : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* MOBILE SUB-VIEW TOGGLE (Visible on small screens only) */}
              <div className="lg:hidden flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-sm">
                <button
                  type="button"
                  onClick={() => setMobileCatalogTab("list")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    mobileCatalogTab === "list"
                      ? "bg-slate-800 text-emerald-400 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Catálogo ({filteredReferences.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileCatalogTab("inspector")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    mobileCatalogTab === "inspector"
                      ? "bg-emerald-500 text-slate-950 font-black shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Raio-X & Gerar Capa</span>
                </button>
              </div>

              {/* MAIN CONTENT SPLIT GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* LEFT COLUMN: CARDS LIST */}
                <div
                  className={`lg:col-span-7 xl:col-span-7 flex flex-col gap-3.5 ${
                    mobileCatalogTab === "inspector" ? "hidden lg:flex" : "flex"
                  }`}
                >
                  {filteredReferences.length === 0 ? (
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-slate-600 mb-2" />
                      <p className="text-sm font-bold text-slate-300">Nenhum modelo encontrado</p>
                      <p className="text-xs text-slate-500 mt-1">Tente buscar por outro termo ou selecione "Todos os Nichos".</p>
                    </div>
                  ) : (
                    filteredReferences.map((refItem) => {
                      const isSelected = selectedModel?.id === refItem.id;
                      return (
                        <div
                          key={refItem.id}
                          onClick={() => {
                            setSelectedModel(refItem);
                            // On mobile, automatically jump to inspector for optimal UX
                            if (window.innerWidth < 1024) {
                              setMobileCatalogTab("inspector");
                            }
                          }}
                          className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-stretch sm:items-start group relative ${
                            isSelected
                              ? "bg-slate-850/95 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/40"
                              : "bg-slate-900/70 hover:bg-slate-850/60 border-slate-800/90 hover:border-slate-700"
                          }`}
                        >
                          {/* Mini Cover Preview Frame (3:4 ratio) */}
                          <div className="relative w-full sm:w-28 h-36 sm:h-36 rounded-xl overflow-hidden shrink-0 border border-slate-700/80 bg-slate-950 shadow-md">
                            <img
                              src={refItem.previewUrl}
                              alt={refItem.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                            
                            {/* Archetype pill over thumbnail */}
                            <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-bold text-white text-center truncate bg-slate-950/80 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/10">
                              {refItem.archetype.split(" ")[0]}
                            </span>

                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                          </div>

                          {/* Card Content & Details (Natural flexible height, no cramming!) */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between gap-2.5">
                            <div>
                              {/* Single-line non-wrapping badge row */}
                              <div className="flex items-center gap-1.5 mb-1.5 overflow-hidden">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono whitespace-nowrap shrink-0">
                                  {refItem.niche}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 whitespace-nowrap truncate">
                                  {refItem.badge}
                                </span>
                              </div>

                              {/* Title */}
                              <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition leading-snug">
                                {refItem.title}
                              </h4>

                              {/* Description */}
                              <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                {refItem.description}
                              </p>
                            </div>

                            {/* Color Palette & Action Button Row */}
                            <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80 gap-2 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-slate-400">Paleta:</span>
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                                    style={{ backgroundColor: refItem.patterns.primaryColor }}
                                    title={`Primária: ${refItem.patterns.primaryColor}`}
                                  />
                                  <span
                                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                                    style={{ backgroundColor: refItem.patterns.accentColor }}
                                    title={`Destaque: ${refItem.patterns.accentColor}`}
                                  />
                                  <span
                                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                                    style={{ backgroundColor: refItem.patterns.backgroundColor }}
                                    title={`Fundo: ${refItem.patterns.backgroundColor}`}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                                <span>Ver Raio-X & Criar</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* RIGHT COLUMN: DEEP INSPECTOR & GENERATION WORKSPACE */}
                <div
                  className={`lg:col-span-5 xl:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-4.5 shadow-2xl lg:sticky lg:top-0 ${
                    mobileCatalogTab === "list" ? "hidden lg:flex" : "flex"
                  }`}
                >
                  {selectedModel ? (
                    <div className="flex flex-col gap-4">
                      {/* Mobile back button */}
                      <div className="lg:hidden flex items-center justify-between border-b border-slate-800 pb-2">
                        <button
                          type="button"
                          onClick={() => setMobileCatalogTab("list")}
                          className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 py-1 px-2 rounded-lg bg-slate-800"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Voltar ao Catálogo</span>
                        </button>
                        <span className="text-[10px] font-mono text-emerald-400">Modelo Selecionado</span>
                      </div>

                      {/* Header with Archetype & Badge */}
                      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                            Arquétipo de Alta Conversão
                          </span>
                          <h4 className="text-base sm:text-lg font-black text-white mt-0.5 leading-snug">
                            {selectedModel.title}
                          </h4>
                          <span className="text-xs text-slate-400 block mt-0.5">
                            {selectedModel.archetype} • {selectedModel.niche}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-lg shrink-0 whitespace-nowrap">
                          {selectedModel.badge}
                        </span>
                      </div>

                      {/* Visual Banner Preview */}
                      <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner group">
                        <img
                          src={selectedModel.previewUrl}
                          alt={selectedModel.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-3.5">
                          <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-xs font-bold text-white">
                              Composição Editorial de Best-Seller
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Why it converts breakdown */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Por que este modelo é sucesso de vendas no Pinterest:</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {selectedModel.whyItConverts}
                        </p>
                      </div>

                      {/* Palette & Typography row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        {/* Palette */}
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 font-mono uppercase">
                            <Palette className="w-3 h-3 text-emerald-400" />
                            Cores Extraídas
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <div
                              onClick={() => copyToClipboard(selectedModel.patterns.primaryColor, true)}
                              className="flex items-center gap-1.5 cursor-pointer group/hex"
                              title="Copiar cor primária"
                            >
                              <span
                                className="w-4 h-4 rounded-full border border-white/20 group-hover/hex:scale-110 transition-transform"
                                style={{ backgroundColor: selectedModel.patterns.primaryColor }}
                              />
                              <span className="font-mono text-[10px] text-slate-300 group-hover/hex:text-emerald-400">
                                {copiedHex === selectedModel.patterns.primaryColor ? "Copiado!" : selectedModel.patterns.primaryColor}
                              </span>
                            </div>

                            <div
                              onClick={() => copyToClipboard(selectedModel.patterns.accentColor, true)}
                              className="flex items-center gap-1.5 cursor-pointer group/hex"
                              title="Copiar cor de destaque"
                            >
                              <span
                                className="w-4 h-4 rounded-full border border-white/20 group-hover/hex:scale-110 transition-transform"
                                style={{ backgroundColor: selectedModel.patterns.accentColor }}
                              />
                              <span className="font-mono text-[10px] text-slate-300 group-hover/hex:text-emerald-400">
                                {copiedHex === selectedModel.patterns.accentColor ? "Copiado!" : selectedModel.patterns.accentColor}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Typography */}
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 font-mono uppercase">
                            <Type className="w-3 h-3 text-cyan-400" />
                            Tipografia
                          </span>
                          <span className="font-bold text-white text-xs mt-1">
                            {selectedModel.patterns.typographyFamily}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">
                            {selectedModel.patterns.typographyReason}
                          </span>
                        </div>
                      </div>

                      {/* Psychological Triggers */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 font-mono uppercase">
                          <Zap className="w-3 h-3 text-amber-400" />
                          Gatilhos Visuais Inclusos
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {selectedModel.patterns.psychologicalTriggers.map((trig, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 font-medium"
                            >
                              ✓ {trig}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2 flex flex-col gap-2">
                        {generationError && (
                          <div className="p-2.5 bg-red-950/60 border border-red-500/30 rounded-xl text-xs text-red-300">
                            {generationError}
                          </div>
                        )}

                        <button
                          type="button"
                          disabled={isGenerating}
                          onClick={() => handleGenerateOriginalCover(selectedModel)}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl transition shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>{generationStatus || "Gerando capa original..."}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>Gerar Capa Inédita com este Estilo</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                          Gera uma arte 100% exclusiva para <strong>"{ebook.title}"</strong> sem plágio ou cópia direta.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
                      <Layers className="w-10 h-10 text-slate-600 mb-2.5" />
                      <p className="text-sm font-bold text-slate-300">Nenhum modelo selecionado</p>
                      <p className="text-xs text-slate-500 mt-1">Selecione uma referência à esquerda para ver a análise completa.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD & DEEP VISUAL ANALYSIS */}
          {activeTab === "upload_analyze" && (
            <div className="flex flex-col gap-5">
              {/* Guidance Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block mb-0.5">
                    Como funciona a Análise de Prints do Pinterest / Livros:
                  </strong>
                  Suba o print de qualquer capa de livro ou infoproduto que você achou incrível. A IA não vai copiar a imagem: ela decompõe a <strong>psicologia das cores, a hierarquia de fontes, a iluminação e o arquétipo</strong> para sintetizar uma capa <strong>100% nova, original e exclusiva para o seu e-book</strong>.
                </div>
              </div>

              {/* Upload & Options Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Drag & Drop Upload Zone */}
                <div className="lg:col-span-6 flex flex-col gap-3">
                  <label className="text-xs font-bold text-slate-300 block">
                    1. Envie o Print ou Foto da Referência
                  </label>

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[220px] ${
                      uploadedImageBase64
                        ? "border-emerald-500/60 bg-emerald-950/15"
                        : "border-slate-800 hover:border-slate-700 bg-slate-950/60"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className="hidden"
                    />

                    {uploadedImageBase64 ? (
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src={uploadedImageBase64}
                          alt="Print enviado"
                          className="max-h-40 max-w-full rounded-xl border border-slate-700 shadow-md object-contain"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            Print carregado com sucesso
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedImageBase64("");
                            }}
                            className="text-[10px] text-red-400 hover:underline cursor-pointer"
                          >
                            Trocar imagem
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2.5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-850 border border-slate-700 flex items-center justify-center text-slate-400 shadow">
                          <Upload className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">
                            Arraste seu print aqui ou clique para selecionar
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Suporta PNG, JPG, WebP (prints do Pinterest, celular ou computador)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* URL Input Fallback */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 whitespace-nowrap">Ou URL:</span>
                    <input
                      type="url"
                      placeholder="https://exemplo.com/print.jpg"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Additional Notes & Action */}
                <div className="lg:col-span-6 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-slate-300 block">
                      2. O que você mais gostou neste modelo? (Opcional)
                    </label>
                    <textarea
                      rows={3}
                      value={analysisNotes}
                      onChange={(e) => setAnalysisNotes(e.target.value)}
                      placeholder="Ex: Gostei do fundo escuro com iluminação dourada e título em fonte imponente. Quero que a capa transmita autoridade máxima."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                    />

                    {/* Target Product Context Pill */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                        Infoproduto Atual:
                      </span>
                      <strong className="text-white text-sm">{ebook.title}</strong>
                      <span className="text-emerald-400 font-mono text-[11px]">Nicho: {niche || "Geral"}</span>
                    </div>
                  </div>

                  {/* Analyze Button */}
                  <div>
                    {analysisError && (
                      <div className="mb-2.5 p-3 bg-red-950/60 border border-red-500/30 rounded-xl text-xs text-red-300">
                        {analysisError}
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={isAnalyzing || (!uploadedImageBase64 && !imageUrlInput)}
                      onClick={handleAnalyzePrint}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl transition shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{analysisProgress || "Analisando com Visão Computacional..."}</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>Analisar Print com IA (Extrair Padrões)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Analysis Result Breakdown */}
              {analysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-2xl"
                >
                  {/* Header of analysis */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">
                          Padrões Extraídos com Sucesso
                        </span>
                        <h4 className="text-base font-bold text-white">
                          Arquétipo: {analysisResult.archetype}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono font-bold">
                        Nicho: {analysisResult.nicheIdentified}
                      </span>
                      <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded-full font-mono">
                        Precisão: {analysisResult.confidenceScore}%
                      </span>
                    </div>
                  </div>

                  {/* 4 Cards: Palette, Typography, Focal Point, Triggers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* Palette */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1">
                        <Palette className="w-3.5 h-3.5 text-amber-400" />
                        Paleta de Cores
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-md border border-white/20 cursor-pointer shadow"
                          style={{ backgroundColor: analysisResult.patterns.primaryColor }}
                          onClick={() => copyToClipboard(analysisResult.patterns.primaryColor, true)}
                          title="Clique para copiar HEX"
                        />
                        <div
                          className="w-6 h-6 rounded-md border border-white/20 cursor-pointer shadow"
                          style={{ backgroundColor: analysisResult.patterns.accentColor }}
                          onClick={() => copyToClipboard(analysisResult.patterns.accentColor, true)}
                          title="Clique para copiar HEX"
                        />
                        <div
                          className="w-6 h-6 rounded-md border border-white/20 cursor-pointer shadow"
                          style={{ backgroundColor: analysisResult.patterns.backgroundColor }}
                          onClick={() => copyToClipboard(analysisResult.patterns.backgroundColor, true)}
                          title="Clique para copiar HEX"
                        />
                        <span className="font-mono text-[10px] text-slate-400 ml-1">
                          {copiedHex ? "Copiado!" : analysisResult.patterns.primaryColor}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 leading-tight">
                        {analysisResult.visualDeconstruction.contrastRatio}
                      </span>
                    </div>

                    {/* Typography */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1">
                        <Type className="w-3.5 h-3.5 text-emerald-400" />
                        Tipografia
                      </span>
                      <strong className="text-white text-sm">
                        {analysisResult.patterns.typographyFamily}
                      </strong>
                      <span className="text-[11px] text-slate-400 leading-tight">
                        {analysisResult.patterns.typographyReason}
                      </span>
                    </div>

                    {/* Focal point & hierarchy */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        Hierarquia Visual
                      </span>
                      <strong className="text-white text-xs">
                        {analysisResult.visualDeconstruction.focalPoint}
                      </strong>
                      <span className="text-[11px] text-slate-400 leading-tight">
                        {analysisResult.visualDeconstruction.hierarchy}
                      </span>
                    </div>

                    {/* Commercial Appeal */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                        Por que Converte
                      </span>
                      <span className="text-xs text-slate-300 leading-tight">
                        {analysisResult.visualDeconstruction.commercialAppeal}
                      </span>
                    </div>
                  </div>

                  {/* Synthesized Prompt for user's ebook */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-300 uppercase font-mono flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Prompt Inédito Sintetizado para seu E-book (Sem Plágio)
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(analysisResult.synthesizedPrompt)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedPrompt ? "Copiado!" : "Copiar Prompt"}</span>
                      </button>
                    </div>

                    <p className="text-xs font-mono text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                      "{analysisResult.synthesizedPrompt}"
                    </p>
                  </div>

                  {/* Final Generation CTA */}
                  <div className="flex items-center justify-between gap-4 pt-1 flex-wrap">
                    <div className="text-xs text-slate-400">
                      Pronto para criar uma capa original e inédita com este padrão visual?
                    </div>

                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={() => handleGenerateOriginalCover(undefined, analysisResult)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 px-6 rounded-xl transition shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-98 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{generationStatus || "Gerando Capa..."}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Gerar Minha Capa Original Baseada neste Padrão</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">
              Motor de Síntese Original: sem plágio visual, seguro para publicação comercial.
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-750 text-slate-200 text-xs font-bold transition cursor-pointer shrink-0 ml-2"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
