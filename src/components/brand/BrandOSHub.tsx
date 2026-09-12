import React, { useState } from "react";
import { 
  ShieldCheck, 
  Compass, 
  Video, 
  Layers, 
  Eye, 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  Palette,
  Award,
  Crown,
  LayoutGrid
} from "lucide-react";
import BrandOSPanel from "./BrandOSPanel";
import PerceptionModeWidget from "./PerceptionModeWidget";
import CreativeDirectorModal from "./CreativeDirectorModal";
import CinematicPromptBuilder from "./CinematicPromptBuilder";
import BrandDnaLibraryView from "./BrandDnaLibraryView";
import VisualAndSmartStyleSelector from "./VisualAndSmartStyleSelector";
import ModularCreativeGenerator from "./ModularCreativeGenerator";
import PageAuditorModal from "./PageAuditorModal";
import { PerceptionTrigger, BrandOS } from "../../types";
import { getSavedBrandOS } from "../../utils/brandOSHelper";

export default function BrandOSHub() {
  const [brand, setBrand] = useState<BrandOS>(getSavedBrandOS());
  const [currentPerception, setCurrentPerception] = useState<PerceptionTrigger>("Luxo");
  const [isCreativeDirectorOpen, setIsCreativeDirectorOpen] = useState(false);
  const [isPageAuditorOpen, setIsPageAuditorOpen] = useState(false);

  const [activeSubTab, setActiveSubTab] = useState<"dna" | "styles" | "modular_kit" | "brand_os" | "cinematic">("dna");

  return (
    <div className="w-full space-y-6 font-sans animate-fadeIn">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-teal-500/20 to-slate-900 border border-amber-500/40 flex items-center justify-center shadow-xl text-amber-400 font-bold text-2xl">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                  INFINITY BRAND OS • ECOSSISTEMA INTELETO
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-extrabold border border-amber-500/40">
                  ESTÚDIO DE MARCA & CRIATIVOS
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Plataforma de Direção Criativa, Biblioteca de DNA, Seletor de Estilos Inteligentes, Gerador Modular de Anúncios e Direção Cinematográfica 8K.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsCreativeDirectorOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-2 transition cursor-pointer uppercase tracking-wider"
            >
              <Compass className="w-4 h-4 text-slate-950" />
              <span>Diretor Criativo IA</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPageAuditorOpen(true)}
              className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-teal-300 font-bold text-xs rounded-xl border border-teal-500/40 flex items-center gap-2 transition cursor-pointer"
            >
              <Search className="w-4 h-4 text-teal-400" />
              <span>Auditar Página</span>
            </button>
          </div>
        </div>

        {/* ECOSYSTEM STATUS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 relative z-10 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Marca Ativa</span>
            <span className="text-xs font-black text-white truncate block mt-0.5">{brand.name}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">DNA / Arquétipo</span>
            <span className="text-xs font-black text-amber-400 block mt-0.5">{brand.archetype || "O Mago & Governante"}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Modo Percepção</span>
            <span className="text-xs font-black text-teal-400 block mt-0.5">{currentPerception}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Paleta Cromática</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: brand.primaryColor }} />
              <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: brand.accentColor }} />
              <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: brand.secondaryColor }} />
            </div>
          </div>
        </div>
      </div>

      {/* PERCEPTION MODE PSYCHOLOGICAL TRIGGER */}
      <PerceptionModeWidget
        currentPerception={currentPerception}
        onPerceptionChange={setCurrentPerception}
      />

      {/* NAVEGADOR DE ABAS PRINCIPAIS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSubTab("dna")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-2 shrink-0 ${
            activeSubTab === "dna"
              ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Crown className="w-4 h-4 text-amber-400" />
          1. Biblioteca de DNA
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("styles")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-2 shrink-0 ${
            activeSubTab === "styles"
              ? "bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-lg shadow-teal-500/10 ring-1 ring-teal-500/30"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Palette className="w-4 h-4 text-teal-400" />
          2. Seletor de Estilo & Biblioteca Inteligente
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("modular_kit")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-2 shrink-0 ${
            activeSubTab === "modular_kit"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          3. Gerador Modular de Criativos
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("brand_os")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-2 shrink-0 ${
            activeSubTab === "brand_os"
              ? "bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          4. Brand OS & Identidade Global
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("cinematic")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-2 shrink-0 ${
            activeSubTab === "cinematic"
              ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Video className="w-4 h-4 text-indigo-400" />
          5. Direção Cinematográfica 8K
        </button>
      </div>

      {/* ABA 1: BIBLIOTECA DE DNA */}
      {activeSubTab === "dna" && (
        <BrandDnaLibraryView 
          onBrandUpdated={(updated) => setBrand(updated)} 
          onNavigateToStyles={() => setActiveSubTab("styles")}
        />
      )}

      {/* ABA 2: SELETOR DE ESTILO & BIBLIOTECA INTELIGENTE */}
      {activeSubTab === "styles" && (
        <VisualAndSmartStyleSelector 
          onBrandUpdated={(updated) => setBrand(updated)}
        />
      )}

      {/* ABA 3: GERADOR MODULAR DE CRIATIVOS */}
      {activeSubTab === "modular_kit" && (
        <ModularCreativeGenerator />
      )}

      {/* ABA 4: BRAND OS GLOBAL */}
      {activeSubTab === "brand_os" && (
        <BrandOSPanel onBrandUpdated={(updated) => setBrand(updated)} />
      )}

      {/* ABA 5: CINEMATIC PROMPT BUILDER */}
      {activeSubTab === "cinematic" && (
        <CinematicPromptBuilder />
      )}

      {/* MODALS */}
      <CreativeDirectorModal
        isOpen={isCreativeDirectorOpen}
        onClose={() => setIsCreativeDirectorOpen(false)}
      />

      <PageAuditorModal
        isOpen={isPageAuditorOpen}
        onClose={() => setIsPageAuditorOpen(false)}
      />
    </div>
  );
}

