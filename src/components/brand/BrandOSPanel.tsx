import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Sparkles, 
  Save, 
  Check, 
  Palette, 
  Type, 
  MessageSquare, 
  Target, 
  Zap, 
  Award,
  Layers,
  Sliders,
  Globe,
  RefreshCw,
  Eye
} from "lucide-react";
import { BrandOS } from "../../types";
import { getSavedBrandOS, saveBrandOS, DEFAULT_BRAND_OS } from "../../utils/brandOSHelper";

interface Props {
  onBrandUpdated?: (brand: BrandOS) => void;
}

export default function BrandOSPanel({ onBrandUpdated }: Props) {
  const [brand, setBrand] = useState<BrandOS>(getSavedBrandOS());
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"visual" | "identity" | "strategy">("visual");

  const handleSave = () => {
    saveBrandOS(brand);
    if (onBrandUpdated) {
      onBrandUpdated(brand);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    setBrand(DEFAULT_BRAND_OS);
    saveBrandOS(DEFAULT_BRAND_OS);
    if (onBrandUpdated) {
      onBrandUpdated(DEFAULT_BRAND_OS);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl space-y-6 font-sans">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 via-teal-500/20 to-slate-900 border border-amber-500/30 flex items-center justify-center shadow-lg text-amber-400 font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                BRAND OS • SISTEMA OPERACIONAL DE MARCA
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] font-extrabold border border-amber-500/30">
                INJEÇÃO GLOBAL 100% ATIVA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure sua identidade uma única vez. E-books, Páginas, Criativos e VSLs absorvem automaticamente essas diretrizes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="Restaurar Padrão de Fábrica"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resetar</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-2 transition cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Salvo e Sincronizado!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-slate-950" />
                <span>Salvar Brand OS Global</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("visual")}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-2 shrink-0 ${
            activeTab === "visual"
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          1. Identidade Visual & Tipografia
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("identity")}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-2 shrink-0 ${
            activeTab === "identity"
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          2. Voz, Tom & Arquétipo
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("strategy")}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-2 shrink-0 ${
            activeTab === "strategy"
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          3. Promessa, Público & Consciência
        </button>
      </div>

      {/* TAB 1: VISUAL & TYPOGRAPHY */}
      {activeTab === "visual" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Nome da Marca / Produto</label>
              <input
                type="text"
                value={brand.name}
                onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                placeholder="Ex: Infinity Million OS"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Símbolo ou Emblema (Emoji/Símbolo)</label>
              <input
                type="text"
                value={brand.symbol || ""}
                onChange={(e) => setBrand({ ...brand, symbol: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                placeholder="Ex: ⚡ ou 👑"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">URL da Logomarca (Opcional)</label>
              <input
                type="text"
                value={brand.logoUrl || ""}
                onChange={(e) => setBrand({ ...brand, logoUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                placeholder="https://suamarca.com/logo.png"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <label className="text-xs font-bold text-teal-400 uppercase tracking-wide block">Cor Primária (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brand.primaryColor}
                  onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })}
                  className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={brand.primaryColor}
                  onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wide block">Cor de Destaque / Accent (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brand.accentColor}
                  onChange={(e) => setBrand({ ...brand, accentColor: e.target.value })}
                  className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={brand.accentColor}
                  onChange={(e) => setBrand({ ...brand, accentColor: e.target.value })}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">Cor Secundária / Fundo (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brand.secondaryColor}
                  onChange={(e) => setBrand({ ...brand, secondaryColor: e.target.value })}
                  className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={brand.secondaryColor}
                  onChange={(e) => setBrand({ ...brand, secondaryColor: e.target.value })}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono uppercase"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Tipografia de Títulos (Headings)</label>
              <select
                value={brand.typographyHeading}
                onChange={(e) => setBrand({ ...brand, typographyHeading: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold cursor-pointer"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Luxo)</option>
                <option value="Playfair Display">Playfair Display (Editorial Clássico)</option>
                <option value="Space Grotesk">Space Grotesk (Futurista Tech)</option>
                <option value="Inter">Inter (SaaS Ultra Clean)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Tipografia de Corpo (Body)</label>
              <select
                value={brand.typographyBody}
                onChange={(e) => setBrand({ ...brand, typographyBody: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold cursor-pointer"
              >
                <option value="Inter">Inter (Máxima Legibilidade)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Harmonia Elegante)</option>
                <option value="JetBrains Mono">JetBrains Mono (Código & Dados)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VOICE & ARCHETYPE */}
      {activeTab === "identity" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Tom de Voz da Comunicação</label>
              <input
                type="text"
                value={brand.voiceTone}
                onChange={(e) => setBrand({ ...brand, voiceTone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                placeholder="Ex: Autoritário, Direto e Extremamente Persuasivo"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Personalidade da Marca</label>
              <input
                type="text"
                value={brand.personality}
                onChange={(e) => setBrand({ ...brand, personality: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                placeholder="Ex: Visionária, Sofisticada, Inabalável"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Arquétipo Dominante</label>
              <input
                type="text"
                value={brand.archetype}
                onChange={(e) => setBrand({ ...brand, archetype: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                placeholder="Ex: O Mago & O Governante"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Valores Inegociáveis (Separados por vírgula)</label>
              <input
                type="text"
                value={brand.values.join(", ")}
                onChange={(e) => setBrand({ ...brand, values: e.target.value.split(",").map(s => s.trim()) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                placeholder="Ex: Soberania, Excelência, Resultados Comprovados"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STRATEGY & PROMISE */}
      {activeTab === "strategy" && (
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wide block">Promessa Central Irresistível</label>
            <input
              type="text"
              value={brand.promise}
              onChange={(e) => setBrand({ ...brand, promise: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
              placeholder="Ex: Construir um ecossistema digital de alta conversão sem complicação."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Público-Alvo Ideal</label>
              <textarea
                value={brand.targetAudience}
                onChange={(e) => setBrand({ ...brand, targetAudience: e.target.value })}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium resize-none"
                placeholder="Descreva quem é o seu cliente ideal..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Nível de Consciência Dominante do Mercado</label>
              <select
                value={brand.consciousnessLevel}
                onChange={(e) => setBrand({ ...brand, consciousnessLevel: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold cursor-pointer"
              >
                <option value="Inconsciente">Inconsciente (Não sabe que tem dor)</option>
                <option value="Problema">Consciente do Problema (Sente a dor mas busca causa)</option>
                <option value="Solução">Consciente da Solução (Sabe o resultado que quer)</option>
                <option value="Produto">Consciente do Produto (Compara seu produto com concorrentes)</option>
                <option value="Totalmente Consciente">Totalmente Consciente (Pronto para comprar no 1º clique)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Posicionamento de Mercado Unico</label>
            <input
              type="text"
              value={brand.positioning}
              onChange={(e) => setBrand({ ...brand, positioning: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              placeholder="Ex: A plataforma de IA nº 1 para empreendedores que exigem posicionamento de elite."
            />
          </div>
        </div>
      )}

      {/* LIVE PREVIEW BANNER */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md"
            style={{ backgroundColor: brand.primaryColor }}
          >
            {brand.symbol || "⚡"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-white" style={{ fontFamily: brand.typographyHeading }}>
                {brand.name}
              </h4>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-amber-400 font-bold">
                {brand.archetype}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{brand.promise}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.primaryColor }} title="Cor Primária" />
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.accentColor }} title="Cor Accent" />
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.secondaryColor }} title="Cor Secundária" />
          <span className="text-[10px] text-slate-500 ml-1">Synced across 100% of modules</span>
        </div>
      </div>
    </div>
  );
}
