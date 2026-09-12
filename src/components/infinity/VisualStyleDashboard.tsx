import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Palette,
  Search,
  Check,
  Copy,
  ArrowRight,
  Zap,
  Eye,
  Layers,
  Camera,
  Sun,
  ShieldCheck,
  TrendingUp,
  Bookmark,
  CheckCircle2,
  Award,
  UtensilsCrossed,
  Coins,
  Cpu,
  Laptop,
  Leaf,
  Flame,
  Film,
  Dumbbell,
  Heart,
  X,
  ChevronRight,
  Maximize2,
  Filter,
  Star,
  RefreshCw,
  LayoutGrid,
  List,
  BookOpen,
  Megaphone,
  SlidersHorizontal,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  VisualDnaStyle,
  VISUAL_DNA_STYLES,
  VisualDnaSwatch
} from "./VisualStyleLibrary";

interface VisualStyleDashboardProps {
  onApplyToCover?: (style: VisualDnaStyle) => void;
  onApplyToCreatives?: (style: VisualDnaStyle) => void;
  onApplyToAll?: (style: VisualDnaStyle) => void;
  onNavigateToTab?: (tab: string, step?: number) => void;
}

export default function VisualStyleDashboard({
  onApplyToCover,
  onApplyToCreatives,
  onApplyToAll,
  onNavigateToTab
}: VisualStyleDashboardProps) {
  // Search and Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [selectedNicheFilter, setSelectedNicheFilter] = useState<string>("Todos");
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");

  // Active Project DNA & Favorites State from localStorage
  const [activeDnaId, setActiveDnaId] = useState<string>("");
  const [activeDnaStyle, setActiveDnaStyle] = useState<VisualDnaStyle | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Interactive Card & Modal State
  const [previewModalStyle, setPreviewModalStyle] = useState<VisualDnaStyle | null>(null);
  const [modalActiveTab, setModalActiveTab] = useState<"preview" | "psychology" | "lighting" | "palette" | "prompts">("preview");
  const [modalMockupType, setModalMockupType] = useState<"book" | "ad_story" | "ad_feed">("book");

  // Card Mini-Preview switchers (styleId -> 'cover' | 'ad' | 'palette')
  const [cardPreviewModes, setCardPreviewModes] = useState<Record<string, "cover" | "ad" | "palette">>({});

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedPromptType, setCopiedPromptType] = useState<string | null>(null);

  // Initialize and load saved settings
  useEffect(() => {
    try {
      const savedActiveId = localStorage.getItem("fabrica_active_visual_dna_id");
      if (savedActiveId) {
        setActiveDnaId(savedActiveId);
        const matched = VISUAL_DNA_STYLES.find((s) => s.id === savedActiveId);
        if (matched) setActiveDnaStyle(matched);
      }

      const savedFavs = localStorage.getItem("fabrica_visual_dna_favorites");
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
    } catch (e) {
      console.warn("Failed to load visual DNA from local storage:", e);
    }
  }, []);

  // Show temporary toast message
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Toggle favorite style
  const toggleFavorite = (styleId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    let updated: string[];
    if (favorites.includes(styleId)) {
      updated = favorites.filter((id) => id !== styleId);
      triggerToast("Removido dos favoritos");
    } else {
      updated = [...favorites, styleId];
      triggerToast("Adicionado aos seus favoritos ⭐");
    }
    setFavorites(updated);
    try {
      localStorage.setItem("fabrica_visual_dna_favorites", JSON.stringify(updated));
    } catch (err) {
      console.warn("Could not persist favorites:", err);
    }
  };

  // Apply style to active project
  const handleApply = (
    style: VisualDnaStyle,
    target: "cover" | "creatives" | "all",
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();

    // 1. Save to local storage for global persistence
    try {
      localStorage.setItem("fabrica_active_visual_dna_id", style.id);
      localStorage.setItem("fabrica_selected_visual_dna", JSON.stringify(style));
      localStorage.setItem("fabrica_cover_custom_prompt", style.promptKit.aiCoverPrompt);
      localStorage.setItem("fabrica_cover_style_preset", style.name);
      localStorage.setItem("fabrica_creative_typography", style.typography.headingFont);
      localStorage.setItem("fabrica_creative_text_color", style.colors.text);
    } catch (err) {
      console.warn("Local storage write error:", err);
    }

    setActiveDnaId(style.id);
    setActiveDnaStyle(style);

    // 2. Trigger parent callbacks
    if (target === "cover") {
      onApplyToCover?.(style);
      triggerToast(`✨ Estilo "${style.name}" aplicado à Capa! Redirecionando para Capa...`);
      setTimeout(() => onNavigateToTab?.("ebook", 1), 600);
    } else if (target === "creatives") {
      onApplyToCreatives?.(style);
      triggerToast(`📢 Estilo "${style.name}" aplicado aos Criativos! Redirecionando para Criativo...`);
      setTimeout(() => onNavigateToTab?.("ads", 4), 600);
    } else {
      onApplyToCover?.(style);
      onApplyToCreatives?.(style);
      onApplyToAll?.(style);
      triggerToast(`🚀 DNA Visual "${style.name}" aplicado a todo o Infoproduto!`);
    }
  };

  // Reset active DNA
  const handleResetActiveDna = () => {
    try {
      localStorage.removeItem("fabrica_active_visual_dna_id");
      localStorage.removeItem("fabrica_selected_visual_dna");
    } catch (err) {
      console.warn("Local storage clear error:", err);
    }
    setActiveDnaId("");
    setActiveDnaStyle(null);
    triggerToast("DNA Visual desvinculado do projeto ativo.");
  };

  // Copy hex color code
  const handleCopyHex = (hex: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    triggerToast(`Hex ${hex} copiado!`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Copy prompt
  const handleCopyPrompt = (prompt: string, type: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptType(type);
    triggerToast(`Prompt copiado com sucesso! Pronto para colar no gerador de imagens.`);
    setTimeout(() => setCopiedPromptType(null), 2500);
  };

  // Categories list
  const categories = useMemo(() => {
    const cats = Array.from(new Set(VISUAL_DNA_STYLES.map((s) => s.category)));
    return ["Todos", ...cats];
  }, []);

  // Filtered styles
  const filteredStyles = useMemo(() => {
    return VISUAL_DNA_STYLES.filter((s) => {
      // Favorites filter
      if (favoritesOnly && !favorites.includes(s.id)) return false;

      // Category filter
      if (selectedCategory !== "Todos" && s.category !== selectedCategory) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesDesc = s.description.toLowerCase().includes(q);
        const matchesTagline = s.tagline.toLowerCase().includes(q);
        const matchesCategory = s.category.toLowerCase().includes(q);
        const matchesNiches = s.targetNiches.some((n) => n.toLowerCase().includes(q));
        const matchesTriggers = s.psychologicalTriggers.some((t) => t.toLowerCase().includes(q));
        const matchesBadge = s.badge.toLowerCase().includes(q);
        if (
          !matchesName &&
          !matchesDesc &&
          !matchesTagline &&
          !matchesCategory &&
          !matchesNiches &&
          !matchesTriggers &&
          !matchesBadge
        ) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, favoritesOnly, favorites]);

  // Helper to render style icon
  const renderStyleIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case "UtensilsCrossed":
        return <UtensilsCrossed className={className} />;
      case "Coins":
        return <Coins className={className} />;
      case "Cpu":
        return <Cpu className={className} />;
      case "Laptop":
        return <Laptop className={className} />;
      case "Leaf":
        return <Leaf className={className} />;
      case "Flame":
        return <Flame className={className} />;
      case "Film":
        return <Film className={className} />;
      case "Dumbbell":
        return <Dumbbell className={className} />;
      case "Heart":
        return <Heart className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 text-slate-100 animate-fade-in pb-16">
      {/* TOAST FEEDBACK FLOATING BANNER */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 bg-slate-900/95 border border-emerald-500/40 text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs md:text-sm font-medium"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DASHBOARD HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                Estética & Identidade Visual de Conversão
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                {VISUAL_DNA_STYLES.length} Estilos Arquitetados
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white mt-1">
              Dashboard de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300">DNA Visual</span> & Branding
            </h1>

            <p className="text-slate-400 text-xs md:text-sm leading-relaxed mt-1">
              Selecione e pré-visualize o DNA estético completo para o seu infoproduto. Ao aplicar um estilo, toda a tipografia, paleta de cores cromáticas, prompts de alta conversão para capas e criativos de anúncios são sincronizados automaticamente.
            </p>
          </div>

          {/* QUICK ACTIVE PROJECT DNA MINI-CARD */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 min-w-[280px] shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                DNA Ativo no Projeto
              </span>
              {activeDnaStyle && (
                <button
                  onClick={handleResetActiveDna}
                  className="text-[10px] text-slate-500 hover:text-rose-400 transition"
                  title="Desvincular do projeto"
                >
                  Desvincular
                </button>
              )}
            </div>

            {activeDnaStyle ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md"
                    style={{
                      backgroundColor: activeDnaStyle.colors.secondary,
                      border: `1px solid ${activeDnaStyle.colors.accent}40`,
                      color: activeDnaStyle.colors.accent
                    }}
                  >
                    {renderStyleIcon(activeDnaStyle.iconName, "w-5 h-5")}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-black text-white truncate">{activeDnaStyle.name}</h4>
                    <span className="text-[10px] text-emerald-400 font-medium block truncate">
                      {activeDnaStyle.badge} • {activeDnaStyle.typography.headingFont}
                    </span>
                  </div>
                </div>

                {/* Swatches preview */}
                <div className="flex items-center gap-1.5 pt-1">
                  {activeDnaStyle.colors.swatches.slice(0, 5).map((sw, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-md border border-slate-700 shadow-sm"
                      style={{ backgroundColor: sw.hex }}
                      title={`${sw.name} (${sw.hex})`}
                    />
                  ))}
                  <span className="text-[10px] text-slate-400 ml-auto font-mono">Sincronizado</span>
                </div>
              </div>
            ) : (
              <div className="py-2 text-center text-xs text-slate-500 flex flex-col items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-slate-600 animate-pulse" />
                <span>Nenhum DNA fixado ainda. Escolha um estilo abaixo para padronizar seu infoproduto!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS & SEARCH BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nicho, estilo, gatilho..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categories scroll / tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
          {/* Favorites Filter */}
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              favoritesOnly
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favoritesOnly ? "fill-slate-950" : "text-amber-400"}`} />
            <span>Favoritos ({favorites.length})</span>
          </button>

          {categories.map((cat) => {
            const isSelected = !favoritesOnly && selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setFavoritesOnly(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg transition ${
              viewMode === "grid" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
            }`}
            title="Grade de Cartões Interativos"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("compact")}
            className={`p-1.5 rounded-lg transition ${
              viewMode === "compact" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
            }`}
            title="Lista Compacta"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RESULTS COUNT & STATUS */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-400">
        <span>
          Exibindo <strong className="text-white">{filteredStyles.length}</strong> de{" "}
          {VISUAL_DNA_STYLES.length} estilos
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-amber-400 hover:underline flex items-center gap-1"
          >
            Limpar busca "{searchQuery}"
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {filteredStyles.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <Filter className="w-8 h-8 text-slate-600" />
          <h3 className="text-base font-bold text-white">Nenhum estilo visual encontrado</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Tente remover os filtros ou buscar por palavras-chave diferentes como "gourmet", "ouro", "minimalismo" ou "tecnologia".
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Todos");
              setFavoritesOnly(false);
            }}
            className="mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
          >
            Resetar Filtros
          </button>
        </div>
      )}

      {/* INTERACTIVE CARDS GRID */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStyles.map((style) => {
            const isFav = favorites.includes(style.id);
            const isActive = activeDnaId === style.id;
            const currentMode = cardPreviewModes[style.id] || "cover";

            return (
              <motion.div
                key={style.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className={`group relative rounded-3xl border transition-all duration-300 flex flex-col overflow-hidden bg-slate-900/95 shadow-xl hover:shadow-2xl ${
                  isActive
                    ? "border-emerald-500/70 shadow-emerald-500/10 ring-2 ring-emerald-500/30"
                    : "border-slate-800/90 hover:border-slate-700"
                }`}
              >
                {/* CARD TOP BAR */}
                <div className="p-5 pb-3 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/40">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: style.colors.accent }}
                    />
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {style.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Badge */}
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider border"
                      style={{
                        backgroundColor: `${style.colors.accent}15`,
                        borderColor: `${style.colors.accent}40`,
                        color: style.colors.accent
                      }}
                    >
                      {style.badge}
                    </span>

                    {/* Favorite toggle */}
                    <button
                      onClick={(e) => toggleFavorite(style.id, e)}
                      className="p-1 rounded-lg text-slate-500 hover:text-amber-400 transition"
                      title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                      <Star
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isFav ? "fill-amber-400 text-amber-400" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* STYLE IDENTITY & TITLE */}
                <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: style.colors.secondary,
                          borderColor: `${style.colors.accent}30`,
                          color: style.colors.accent
                        }}
                      >
                        {renderStyleIcon(style.iconName, "w-4 h-4")}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                          {style.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{style.tagline}</p>
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[9px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1 animate-pulse">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Ativo
                    </span>
                  )}
                </div>

                {/* INTERACTIVE MINI-PREVIEW STAGE */}
                <div className="px-5 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      Pré-visualização Interativa
                    </span>
                    <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                      <button
                        onClick={() =>
                          setCardPreviewModes((prev) => ({ ...prev, [style.id]: "cover" }))
                        }
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                          currentMode === "cover"
                            ? "bg-slate-800 text-white"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        Capa
                      </button>
                      <button
                        onClick={() =>
                          setCardPreviewModes((prev) => ({ ...prev, [style.id]: "ad" }))
                        }
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                          currentMode === "ad"
                            ? "bg-slate-800 text-white"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        Anúncio
                      </button>
                      <button
                        onClick={() =>
                          setCardPreviewModes((prev) => ({ ...prev, [style.id]: "palette" }))
                        }
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                          currentMode === "palette"
                            ? "bg-slate-800 text-white"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        Cores
                      </button>
                    </div>
                  </div>

                  {/* STAGE CONTAINER */}
                  <div
                    className="relative w-full h-44 rounded-2xl overflow-hidden border shadow-inner transition-all flex flex-col justify-between p-4 cursor-pointer"
                    style={{
                      backgroundColor: style.colors.background,
                      borderColor: `${style.colors.accent}30`
                    }}
                    onClick={() => setPreviewModalStyle(style)}
                    title="Clique para inspecionar em tela cheia"
                  >
                    {/* Background gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${style.colors.gradientClass} opacity-80 pointer-events-none`}
                    />
                    {/* Ambient light glow */}
                    <div
                      className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-40 pointer-events-none"
                      style={{ backgroundColor: style.colors.accent }}
                    />

                    {/* CONTENT ACCORDING TO SELECTED PREVIEW MODE */}
                    {currentMode === "cover" && (
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span
                            className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${style.colors.accent}25`,
                              color: style.colors.accent,
                              border: `1px solid ${style.colors.accent}40`
                            }}
                          >
                            {style.sampleMockup.pillTag || style.badge}
                          </span>
                          <span
                            className="text-[9px] font-mono opacity-60"
                            style={{ color: style.colors.mutedText }}
                          >
                            {style.typography.headingFont}
                          </span>
                        </div>

                        <div className="my-auto py-1">
                          <h4
                            className="text-base sm:text-lg font-bold leading-tight line-clamp-2"
                            style={{
                              color: style.colors.text,
                              fontFamily: style.typography.cssFamily
                            }}
                          >
                            {style.sampleMockup.title}
                          </h4>
                          <p
                            className="text-[10px] mt-1 line-clamp-1 opacity-80"
                            style={{ color: style.colors.mutedText }}
                          >
                            {style.sampleMockup.subtitle}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-auto">
                          <span
                            className="text-[9px] font-bold"
                            style={{ color: style.colors.mutedText }}
                          >
                            {style.sampleMockup.author}
                          </span>
                          <span
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: style.colors.accent,
                              color: style.colors.background
                            }}
                          >
                            {style.sampleMockup.ctaText}
                          </span>
                        </div>
                      </div>
                    )}

                    {currentMode === "ad" && (
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-bold"
                            style={{
                              backgroundColor: style.colors.secondary,
                              color: style.colors.accent,
                              borderColor: style.colors.accent
                            }}
                          >
                            A
                          </div>
                          <span
                            className="text-[10px] font-bold truncate"
                            style={{ color: style.colors.text }}
                          >
                            Anúncio Patrocinado
                          </span>
                        </div>

                        <div className="my-auto py-1">
                          <p
                            className="text-xs font-bold leading-snug line-clamp-2"
                            style={{
                              color: style.colors.text,
                              fontFamily: style.typography.cssFamily
                            }}
                          >
                            "{style.psychologicalTriggers[0] || style.tagline}"
                          </p>
                          <span
                            className="text-[10px] font-mono block mt-1 opacity-80"
                            style={{ color: style.colors.accent }}
                          >
                            Ticket Sugerido: {style.averageTicketSuggested}
                          </span>
                        </div>

                        <div className="w-full">
                          <div
                            className="w-full py-1 rounded text-center text-[10px] font-black uppercase tracking-wider shadow"
                            style={{
                              backgroundColor: style.colors.accent,
                              color: style.colors.background
                            }}
                          >
                            Saiba Mais & Liberar Acesso ⚡
                          </div>
                        </div>
                      </div>
                    )}

                    {currentMode === "palette" && (
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: style.colors.text }}
                        >
                          Paleta Cromática & Hex
                        </span>

                        <div className="grid grid-cols-5 gap-1.5 my-auto">
                          {style.colors.swatches.map((swatch, idx) => (
                            <div
                              key={idx}
                              onClick={(e) => handleCopyHex(swatch.hex, e)}
                              className="group/swatch flex flex-col items-center gap-1 cursor-pointer"
                              title={`Clique para copiar ${swatch.hex}`}
                            >
                              <div
                                className="w-full h-10 rounded-lg border border-white/20 shadow group-hover/swatch:scale-105 transition-transform"
                                style={{ backgroundColor: swatch.hex }}
                              />
                              <span
                                className="text-[8px] font-mono truncate max-w-[45px]"
                                style={{ color: style.colors.mutedText }}
                              >
                                {swatch.hex}
                              </span>
                            </div>
                          ))}
                        </div>

                        <span
                          className="text-[9px] text-center italic opacity-80"
                          style={{ color: style.colors.mutedText }}
                        >
                          Clique em uma cor para copiar o Hexadecimal
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* SWATCHES ROW WITH QUICK COPY */}
                <div className="px-5 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {style.colors.swatches.slice(0, 5).map((sw, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => handleCopyHex(sw.hex, e)}
                        className="w-5 h-5 rounded-md border border-slate-700 hover:scale-125 transition-transform shadow relative group/color"
                        style={{ backgroundColor: sw.hex }}
                        title={`${sw.name}: ${sw.hex}`}
                      >
                        <span className="sr-only">{sw.hex}</span>
                      </button>
                    ))}
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    {style.typography.headingFont}
                  </span>
                </div>

                {/* CONVERSION & TICKET INFO */}
                <div className="px-5 py-2.5 bg-slate-950/40 border-y border-slate-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-medium text-slate-300">Ticket Recomendado:</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400">
                    {style.averageTicketSuggested}
                  </span>
                </div>

                {/* PSYCHOLOGICAL TRIGGERS PILLS */}
                <div className="px-5 py-2.5 flex flex-wrap gap-1.5">
                  {style.psychologicalTriggers.slice(0, 2).map((trig, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-300 truncate max-w-[180px]"
                    >
                      {trig}
                    </span>
                  ))}
                </div>

                {/* ACTION BUTTONS */}
                <div className="p-5 pt-3 mt-auto flex items-center gap-2 border-t border-slate-800/80">
                  <button
                    onClick={() => setPreviewModalStyle(style)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Inspecionar</span>
                  </button>

                  <div className="relative group/apply">
                    <button
                      onClick={(e) => handleApply(style, "all", e)}
                      className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-amber-500/20 transition cursor-pointer shrink-0"
                    >
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Aplicar ao Projeto</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* COMPACT LIST VIEW */
        <div className="flex flex-col gap-3">
          {filteredStyles.map((style) => {
            const isFav = favorites.includes(style.id);
            const isActive = activeDnaId === style.id;

            return (
              <div
                key={style.id}
                className={`bg-slate-900 border rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                  isActive
                    ? "border-emerald-500/80 ring-1 ring-emerald-500/40 bg-slate-900/90"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => toggleFavorite(style.id, e)}
                    className="text-slate-500 hover:text-amber-400 p-1"
                  >
                    <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>

                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: style.colors.secondary,
                      borderColor: `${style.colors.accent}40`,
                      color: style.colors.accent
                    }}
                  >
                    {renderStyleIcon(style.iconName, "w-5 h-5")}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">{style.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {style.category}
                      </span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                          Ativo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{style.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-auto w-full md:w-auto justify-between md:justify-end">
                  {/* Swatches */}
                  <div className="flex items-center gap-1">
                    {style.colors.swatches.slice(0, 4).map((sw, idx) => (
                      <div
                        key={idx}
                        className="w-4 h-4 rounded border border-slate-700"
                        style={{ backgroundColor: sw.hex }}
                        title={sw.name}
                      />
                    ))}
                  </div>

                  <span className="text-xs font-mono text-emerald-400 font-bold whitespace-nowrap">
                    {style.averageTicketSuggested}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewModalStyle(style)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
                    >
                      Ver Detalhes
                    </button>
                    <button
                      onClick={(e) => handleApply(style, "all", e)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL PREVIEW & INSPECTION MODAL */}
      <AnimatePresence>
        {previewModalStyle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6"
            >
              {/* MODAL CLOSE BUTTON */}
              <button
                onClick={() => setPreviewModalStyle(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-850 hover:bg-slate-750 text-slate-400 hover:text-white transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* MODAL HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-6 pr-10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg"
                    style={{
                      backgroundColor: previewModalStyle.colors.secondary,
                      borderColor: `${previewModalStyle.colors.accent}40`,
                      color: previewModalStyle.colors.accent
                    }}
                  >
                    {renderStyleIcon(previewModalStyle.iconName, "w-6 h-6")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        {previewModalStyle.category}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono border"
                        style={{
                          backgroundColor: `${previewModalStyle.colors.accent}15`,
                          color: previewModalStyle.colors.accent,
                          borderColor: `${previewModalStyle.colors.accent}30`
                        }}
                      >
                        {previewModalStyle.badge}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {previewModalStyle.name}
                    </h2>
                  </div>
                </div>

                {/* MODAL QUICK APPLY BUTTONS */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={(e) => {
                      handleApply(previewModalStyle, "cover", e);
                      setPreviewModalStyle(null);
                    }}
                    className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-slate-850 hover:bg-slate-750 border border-slate-750 text-white font-bold text-xs transition text-center cursor-pointer"
                  >
                    Aplicar na Capa
                  </button>
                  <button
                    onClick={(e) => {
                      handleApply(previewModalStyle, "creatives", e);
                      setPreviewModalStyle(null);
                    }}
                    className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition text-center cursor-pointer"
                  >
                    Aplicar nos Criativos 🚀
                  </button>
                  <button
                    onClick={(e) => {
                      handleApply(previewModalStyle, "all", e);
                      setPreviewModalStyle(null);
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs transition shadow-md hover:brightness-110 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Aplicar em Tudo</span>
                  </button>
                </div>
              </div>

              {/* MODAL TABS NAVIGATION */}
              <div className="flex items-center gap-1 border-b border-slate-850 pb-2 overflow-x-auto scrollbar-none">
                {[
                  { id: "preview", label: "Pré-visualização 3D", icon: Eye },
                  { id: "psychology", label: "Psicologia & Conversão", icon: TrendingUp },
                  { id: "lighting", label: "Luz & Fotografia Pro", icon: Camera },
                  { id: "palette", label: "Cores & Tipografia", icon: Palette },
                  { id: "prompts", label: "Prompts de IA Prontos", icon: Sparkles }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isCur = modalActiveTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setModalActiveTab(tab.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        isCur
                          ? "bg-slate-800 text-white border border-slate-700"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isCur ? "text-amber-400" : ""}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB CONTENT: PREVIEW */}
              {modalActiveTab === "preview" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Mockup Canvas */}
                  <div className="lg:col-span-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Formato da Arte</span>
                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <button
                          onClick={() => setModalMockupType("book")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            modalMockupType === "book"
                              ? "bg-slate-800 text-white"
                              : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          Capa de E-book (3D)
                        </button>
                        <button
                          onClick={() => setModalMockupType("ad_story")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            modalMockupType === "ad_story"
                              ? "bg-slate-800 text-white"
                              : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          Story (9:16)
                        </button>
                        <button
                          onClick={() => setModalMockupType("ad_feed")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            modalMockupType === "ad_feed"
                              ? "bg-slate-800 text-white"
                              : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          Feed (1:1)
                        </button>
                      </div>
                    </div>

                    {/* RENDER MOCKUP ACCORDING TO TYPE */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex items-center justify-center min-h-[380px] relative overflow-hidden">
                      {modalMockupType === "book" && (
                        <div className="relative flex items-center justify-center">
                          {/* Book Spine 3D illusion */}
                          <div
                            className="w-5 h-[320px] rounded-l-md border-y border-l shadow-2xl transform -skew-y-3 brightness-75"
                            style={{
                              backgroundColor: previewModalStyle.colors.secondary,
                              borderColor: `${previewModalStyle.colors.accent}40`
                            }}
                          />
                          {/* Book Cover Face */}
                          <div
                            className="w-[220px] sm:w-[240px] h-[320px] rounded-r-xl border shadow-2xl p-5 flex flex-col justify-between relative overflow-hidden transform -skew-y-1"
                            style={{
                              backgroundColor: previewModalStyle.colors.background,
                              borderColor: `${previewModalStyle.colors.accent}50`
                            }}
                          >
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${previewModalStyle.colors.gradientClass} opacity-80 pointer-events-none`}
                            />
                            <div
                              className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-30"
                              style={{ backgroundColor: previewModalStyle.colors.accent }}
                            />

                            <div className="relative z-10">
                              <span
                                className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase font-mono tracking-wider"
                                style={{
                                  backgroundColor: `${previewModalStyle.colors.accent}25`,
                                  color: previewModalStyle.colors.accent,
                                  border: `1px solid ${previewModalStyle.colors.accent}40`
                                }}
                              >
                                {previewModalStyle.sampleMockup.pillTag}
                              </span>
                            </div>

                            <div className="relative z-10 my-auto py-2">
                              <h3
                                className="text-xl font-bold leading-tight"
                                style={{
                                  color: previewModalStyle.colors.text,
                                  fontFamily: previewModalStyle.typography.cssFamily
                                }}
                              >
                                {previewModalStyle.sampleMockup.title}
                              </h3>
                              <p
                                className="text-[11px] mt-2 leading-snug"
                                style={{ color: previewModalStyle.colors.mutedText }}
                              >
                                {previewModalStyle.sampleMockup.subtitle}
                              </p>
                            </div>

                            <div className="relative z-10 border-t border-white/10 pt-3 flex items-center justify-between">
                              <span
                                className="text-[10px] font-bold"
                                style={{ color: previewModalStyle.colors.mutedText }}
                              >
                                {previewModalStyle.sampleMockup.author}
                              </span>
                              <span
                                className="px-2.5 py-1 rounded text-[10px] font-bold"
                                style={{
                                  backgroundColor: previewModalStyle.colors.accent,
                                  color: previewModalStyle.colors.background
                                }}
                              >
                                {previewModalStyle.sampleMockup.ctaText}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {modalMockupType === "ad_story" && (
                        <div
                          className="w-[200px] h-[350px] rounded-3xl border-4 border-slate-700 shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden"
                          style={{
                            backgroundColor: previewModalStyle.colors.background
                          }}
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${previewModalStyle.colors.gradientClass} opacity-90 pointer-events-none`}
                          />

                          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
                            <span
                              className="text-[10px] font-bold"
                              style={{ color: previewModalStyle.colors.text }}
                            >
                              Patrocinado
                            </span>
                            <span
                              className="text-[9px] font-mono"
                              style={{ color: previewModalStyle.colors.accent }}
                            >
                              Arraste para cima
                            </span>
                          </div>

                          <div className="relative z-10 my-auto text-center">
                            <span
                              className="px-2 py-0.5 rounded text-[9px] font-bold uppercase inline-block mb-2"
                              style={{
                                backgroundColor: previewModalStyle.colors.accent,
                                color: previewModalStyle.colors.background
                              }}
                            >
                              {previewModalStyle.badge}
                            </span>
                            <h4
                              className="text-base font-black leading-snug"
                              style={{
                                color: previewModalStyle.colors.text,
                                fontFamily: previewModalStyle.typography.cssFamily
                              }}
                            >
                              {previewModalStyle.sampleMockup.title}
                            </h4>
                          </div>

                          <div className="relative z-10 w-full">
                            <div
                              className="w-full py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider shadow-lg"
                              style={{
                                backgroundColor: previewModalStyle.colors.accent,
                                color: previewModalStyle.colors.background
                              }}
                            >
                              Garantir Vaga 🚀
                            </div>
                          </div>
                        </div>
                      )}

                      {modalMockupType === "ad_feed" && (
                        <div
                          className="w-[260px] h-[260px] rounded-2xl border shadow-2xl p-5 flex flex-col justify-between relative overflow-hidden"
                          style={{
                            backgroundColor: previewModalStyle.colors.background,
                            borderColor: `${previewModalStyle.colors.accent}40`
                          }}
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${previewModalStyle.colors.gradientClass} opacity-80 pointer-events-none`}
                          />
                          <div className="relative z-10">
                            <span
                              className="px-2 py-0.5 rounded text-[9px] font-black uppercase"
                              style={{
                                backgroundColor: `${previewModalStyle.colors.accent}20`,
                                color: previewModalStyle.colors.accent
                              }}
                            >
                              {previewModalStyle.category}
                            </span>
                          </div>

                          <div className="relative z-10 text-center">
                            <h4
                              className="text-lg font-black leading-tight"
                              style={{
                                color: previewModalStyle.colors.text,
                                fontFamily: previewModalStyle.typography.cssFamily
                              }}
                            >
                              {previewModalStyle.sampleMockup.title}
                            </h4>
                            <p
                              className="text-[10px] mt-1 line-clamp-2"
                              style={{ color: previewModalStyle.colors.mutedText }}
                            >
                              {previewModalStyle.description}
                            </p>
                          </div>

                          <div className="relative z-10">
                            <div
                              className="w-full py-1.5 rounded-lg text-center text-[10px] font-bold uppercase"
                              style={{
                                backgroundColor: previewModalStyle.colors.accent,
                                color: previewModalStyle.colors.background
                              }}
                            >
                              Comprar Agora ⚡
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side summary breakdown */}
                  <div className="lg:col-span-6 flex flex-col gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
                      <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                        Visão Geral da Estética
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {previewModalStyle.description}
                      </p>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col gap-1">
                        <span className="font-bold text-emerald-400">Por que converte tanto:</span>
                        <span className="text-slate-300 leading-relaxed">
                          {previewModalStyle.conversionRationale}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                        <span className="text-[10px] font-mono text-slate-400 block mb-1">
                          Ticket Médio Ideal
                        </span>
                        <span className="text-sm font-bold font-mono text-emerald-400">
                          {previewModalStyle.averageTicketSuggested}
                        </span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                        <span className="text-[10px] font-mono text-slate-400 block mb-1">
                          Tipografia Principal
                        </span>
                        <span className="text-sm font-bold text-white">
                          {previewModalStyle.typography.headingFont}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2">
                        Nichos Recomendados
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {previewModalStyle.targetNiches.map((niche, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                          >
                            {niche}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: PSYCHOLOGY */}
              {modalActiveTab === "psychology" && (
                <div className="flex flex-col gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 mb-2">
                      Gatilhos Mentais & Psicologia Visual Embutida
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Cada elemento desta estética (iluminação, cores, pesos tipográficos) é calculado para desarmar a resistência do comprador e criar autoridade instantânea.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {previewModalStyle.psychologicalTriggers.map((trigger, i) => (
                        <div
                          key={i}
                          className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-start gap-2.5"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-white font-medium">{trigger}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-sm font-black uppercase tracking-wider text-teal-400 mb-2">
                      Texturas & Acabamentos do DNA
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {previewModalStyle.textures.map((tex, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5"
                        >
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          {tex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: LIGHTING & CAMERA */}
              {modalActiveTab === "lighting" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Sun className="w-5 h-5" />
                      <h4 className="text-sm font-black uppercase tracking-wider">
                        Engenharia de Luz (Lighting Setup)
                      </h4>
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-white block mb-1">
                        {previewModalStyle.lighting.setupName}
                      </strong>
                      <p>{previewModalStyle.lighting.description}</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between text-xs font-mono mt-2">
                      <span className="text-slate-400">Temperatura de Cor:</span>
                      <span className="text-amber-400 font-bold">
                        {previewModalStyle.lighting.colorTemperature}
                      </span>
                    </div>
                    <ul className="space-y-1.5 mt-2">
                      {previewModalStyle.lighting.keyAspects.map((aspect, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{aspect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sky-400">
                      <Camera className="w-5 h-5" />
                      <h4 className="text-sm font-black uppercase tracking-wider">
                        Óptica & Configuração de Câmera
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Lente</span>
                        <span className="text-white font-bold">{previewModalStyle.optics.lens}</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Abertura</span>
                        <span className="text-white font-bold">{previewModalStyle.optics.aperture}</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Ângulo</span>
                        <span className="text-white font-bold">
                          {previewModalStyle.optics.cameraAngle}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Profundidade</span>
                        <span className="text-white font-bold">
                          {previewModalStyle.optics.depthOfField}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 mt-2">
                      <span className="font-bold text-slate-400 block mb-1">
                        Composição & Enquadramento:
                      </span>
                      {previewModalStyle.optics.framingComposition}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: PALETTE & TYPOGRAPHY */}
              {modalActiveTab === "palette" && (
                <div className="flex flex-col gap-6">
                  {/* Swatches Grid */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 mb-4">
                      Paleta Cromática Completa (5 Tons Estratégicos)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      {previewModalStyle.colors.swatches.map((swatch, i) => (
                        <div
                          key={i}
                          onClick={() => handleCopyHex(swatch.hex)}
                          className="group bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-all"
                        >
                          <div
                            className="w-full h-16 rounded-lg border border-white/10 shadow group-hover:scale-105 transition-transform"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <div>
                            <span className="text-xs font-bold text-white block truncate">
                              {swatch.name}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 block">
                              {swatch.hex}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-1 line-clamp-1">
                              {swatch.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Typography Guide */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-sm font-black uppercase tracking-wider text-purple-400 mb-4">
                      Arquitetura Tipográfica
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-mono text-slate-500 block">
                          Fonte para Títulos (Headings)
                        </span>
                        <h4
                          className="text-xl font-bold text-white my-1"
                          style={{ fontFamily: previewModalStyle.typography.cssFamily }}
                        >
                          {previewModalStyle.typography.headingFont}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {previewModalStyle.typography.headingStyle}
                        </p>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-mono text-slate-500 block">
                          Escala & Proporção
                        </span>
                        <h4 className="text-sm font-bold text-white my-1 font-mono">
                          {previewModalStyle.typography.hierarchyRatio}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Garante máxima legibilidade no leitor digital e alto impacto em anúncios de feed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: PROMPTS */}
              {modalActiveTab === "prompts" && (
                <div className="flex flex-col gap-4">
                  {/* Cover Prompt */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-400">
                        <BookOpen className="w-4 h-4" />
                        <h4 className="text-xs font-black uppercase tracking-wider">
                          Prompt Otimizado para Capa de E-book (Imagen 3 / Midjourney)
                        </h4>
                      </div>
                      <button
                        onClick={() =>
                          handleCopyPrompt(previewModalStyle.promptKit.aiCoverPrompt, "cover")
                        }
                        className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Prompt</span>
                      </button>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed select-all">
                      {previewModalStyle.promptKit.aiCoverPrompt}
                    </pre>
                  </div>

                  {/* Creative Ad Prompt */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Megaphone className="w-4 h-4" />
                        <h4 className="text-xs font-black uppercase tracking-wider">
                          Prompt Otimizado para Criativo de Anúncio (Feed & Stories)
                        </h4>
                      </div>
                      <button
                        onClick={() =>
                          handleCopyPrompt(previewModalStyle.promptKit.aiCreativePrompt, "ad")
                        }
                        className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Prompt</span>
                      </button>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed select-all">
                      {previewModalStyle.promptKit.aiCreativePrompt}
                    </pre>
                  </div>

                  {/* Tokens */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-2">
                        Tokens de Qualidade Injetados
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {previewModalStyle.promptKit.visualTokens.map((tok, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-mono border border-emerald-500/20"
                          >
                            +{tok}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                      <span className="text-[10px] font-mono uppercase text-rose-400 block mb-2">
                        Tokens Negativos (Evita Arte Amadora)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {previewModalStyle.promptKit.negativeTokens.map((tok, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[10px] font-mono border border-rose-500/20"
                          >
                            -{tok}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FOOTER OF MODAL */}
              <div className="border-t border-slate-850 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <span>
                  💡 Dica: Você pode testar diferentes DNAs a qualquer momento sem perder o conteúdo de texto do seu e-book.
                </span>
                <button
                  onClick={() => setPreviewModalStyle(null)}
                  className="px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-750 text-white font-bold text-xs transition"
                >
                  Fechar Inspetor
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
