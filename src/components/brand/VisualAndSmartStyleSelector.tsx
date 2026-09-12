import React, { useState } from "react";
import { 
  Palette, 
  Sparkles, 
  Camera, 
  Sun, 
  Layers, 
  Copy, 
  Check, 
  Sliders, 
  Eye, 
  CheckCircle2, 
  Zap, 
  Video, 
  Award, 
  Maximize2,
  RefreshCw,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { SMART_STYLE_PROFILES, getSmartStyleById } from "../../data/smartStylesData";
import { SmartStyleProfile, BrandOS } from "../../types";
import { getSavedBrandOS, saveBrandOS } from "../../utils/brandOSHelper";

interface Props {
  onStyleApplied?: (style: SmartStyleProfile) => void;
  onBrandUpdated?: (brand: BrandOS) => void;
}

export const LIGHTING_PRESETS = [
  { id: "rembrandt", name: "Studio Rembrandt Dourado", desc: "Contraste dramático com iluminação triangular clássica e recorte nobre" },
  { id: "softbox", name: "Softbox Difuso Apple Style", desc: "Luz suave envolvente, sombras imperceptíveis e máxima clareza" },
  { id: "cyber_rim", name: "Cyberpunk Dual Rim Light", desc: "Feixes de luz laser neon (azul e ciano) com partículas no ar" },
  { id: "golden_hour", name: "Golden Hour Solar 45°", desc: "Luz dourada morna de entardecer com atmosfera acolhedora" },
  { id: "high_key", name: "High-Key Direct Response", desc: "Luz branca potente frontal sem sombras para leitura instantânea" },
  { id: "volumetric", name: "Volumetric Cinematic Haze", desc: "Raios de luz volumétricos de cinema com névoa sutil atmosférica" }
];

export const LENS_PRESETS = [
  { id: "85mm", name: "85mm F/1.4 Portrait Bokeh", desc: "Desfoque de fundo cremoso profissional com isolamento total do sujeito" },
  { id: "35mm", name: "35mm F/1.8 Editorial", desc: "Perspectiva humana natural e rica em detalhes do cenário sem distorção" },
  { id: "24mm", name: "24mm Anamorphic Cinema", desc: "Widescreen épico com lens flares horizontais estilo Hollywood" },
  { id: "100mm", name: "100mm F/2.8 Macro Pro", desc: "Textura extrema, microgotas, fibras e materiais em close microscópico" },
  { id: "flatlay", name: "50mm Flat Lay Zenith", desc: "Visão superior perfeita para organização de produtos, livros e elementos" }
];

export const TEXTURE_PRESETS = [
  { id: "onyx_gold", name: "Mármore Negro & Ouro Champanhe", desc: "Superfícies minerais com veios reflexivos dourados" },
  { id: "titanium_glass", name: "Titânio Fosco & Vidro Cristal", desc: "Materiais nobres high-tech com refração limpa" },
  { id: "carbon_neon", name: "Fibra de Carbono & Circuitos LED", desc: "Textura aeroespacial com emissão de luz interna" },
  { id: "wood_linen", name: "Carvalho Nobre & Linho Cru", desc: "Materiais orgânicos táteis que despertam conforto" },
  { id: "tactical_hazard", name: "Tarja Tática & Metal Industrial", desc: "Acabamento de impacto com alto contraste para conversão" }
];

export default function VisualAndSmartStyleSelector({ onStyleApplied, onBrandUpdated }: Props) {
  const currentBrand = getSavedBrandOS();

  // Estados do seletor
  const [selectedStyleId, setSelectedStyleId] = useState<string>("style_editorial_dark_luxury");
  const selectedStyle = getSmartStyleById(selectedStyleId);

  // Customizações finas
  const [selectedLighting, setSelectedLighting] = useState<string>(LIGHTING_PRESETS[0].name);
  const [selectedLens, setSelectedLens] = useState<string>(LENS_PRESETS[0].name);
  const [selectedTexture, setSelectedTexture] = useState<string>(TEXTURE_PRESETS[0].name);
  const [customGrain, setCustomGrain] = useState<"clean" | "analog" | "hdr">("clean");

  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  // Geração do Master Prompt Cinemático dinâmico
  const generatedMasterPrompt = `Ultra photorealistic visual composition in ${selectedStyle.name} style.
Lighting: ${selectedLighting}.
Lens & Framing: ${selectedLens}.
Materials & Textures: ${selectedTexture}.
Color Atmosphere: Dominant ${selectedStyle.primaryColor}, Accent ${selectedStyle.accentColor}, Dark base ${selectedStyle.backgroundColor}.
Mood: ${selectedStyle.mood}.
Render Quality: 8K UHD, Octane Render, Award Winning Editorial Cover, 3D Depth, Crisp Typography in ${selectedStyle.typographyHeading}.
Visual Hook: "${selectedStyle.visualHookPrompt}"`;

  const handleApplyStyleToBrand = () => {
    const updatedBrand: BrandOS = {
      ...currentBrand,
      primaryColor: selectedStyle.primaryColor,
      secondaryColor: selectedStyle.secondaryColor,
      accentColor: selectedStyle.accentColor,
      typographyHeading: selectedStyle.typographyHeading,
      typographyBody: selectedStyle.typographyBody,
    };

    saveBrandOS(updatedBrand);
    if (onBrandUpdated) {
      onBrandUpdated(updatedBrand);
    }
    if (onStyleApplied) {
      onStyleApplied(selectedStyle);
    }

    setAppliedNotification(selectedStyle.name);
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  const handleCopyColor = (colorHex: string) => {
    navigator.clipboard.writeText(colorHex);
    setCopiedColor(colorHex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedMasterPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl space-y-7 font-sans">
      {/* HEADER BANNER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 via-indigo-500/20 to-slate-900 border border-teal-500/30 flex items-center justify-center shadow-lg text-teal-400 font-bold text-2xl shrink-0">
            <Palette className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                SELETOR DE ESTILO VISUAL & BIBLIOTECA INTELIGENTE
              </h2>
              <span className="px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] font-extrabold border border-teal-500/30">
                PROMPT ENGINE 8K INTEGRADO
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Explore 8 estilos de arte de alta conversão, ajuste lentes fotográficas, iluminação de estúdio e texturas táteis. Aplique com 1 clique ao Brand OS e a todos os criativos.
            </p>
          </div>
        </div>

        {/* FEEDBACK DE SUCESSO */}
        {appliedNotification && (
          <div className="bg-teal-500/15 border border-teal-500/40 px-4 py-2.5 rounded-2xl flex items-center gap-2 text-teal-300 text-xs font-bold shadow-lg animate-fadeIn">
            <Check className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Estilo "{appliedNotification}" aplicado globalmente!</span>
          </div>
        )}
      </div>

      {/* SEÇÃO 1: CATÁLOGO DE ESTILOS INTELIGENTES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              1. Escolha o Arquétipo Estético Principal
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Estilo Selecionado: <strong className="text-teal-300">{selectedStyle.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {SMART_STYLE_PROFILES.map((style) => {
            const isSelected = selectedStyleId === style.id;
            return (
              <div
                key={style.id}
                onClick={() => {
                  setSelectedStyleId(style.id);
                  // Ajusta defaults recomendados do estilo
                  setSelectedLighting(style.lighting.split(" com ")[0]);
                  setSelectedLens(style.lens.split(" com ")[0]);
                  setSelectedTexture(style.texture.split(",")[0]);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between group overflow-hidden ${
                  isSelected
                    ? "bg-slate-850 border-teal-500 shadow-xl shadow-teal-500/10 ring-1 ring-teal-500/40"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                {/* GRADIENTE DE PREVIEW */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none bg-gradient-to-br ${style.previewGradient}`} />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full border bg-slate-800/80 text-teal-300 border-slate-700 uppercase tracking-wider font-mono">
                      {style.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {style.tag.split(" • ")[0]}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white group-hover:text-teal-300 transition line-clamp-1">
                    {style.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {style.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                  {/* CORES */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: style.primaryColor }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: style.accentColor }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: style.backgroundColor }} />
                  </div>

                  <span className={`text-[11px] font-bold ${isSelected ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                    {isSelected ? "Ativo ✓" : "Selecionar"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO 2: CONTROLES FINOS DE ESTILO VISUAL & PREVIEW EM TEMPO REAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PARÂMETROS FOTOGRÁFICOS & CINEMATOGRÁFICOS (COLUNA ESQUERDA) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <span className="text-xs font-extrabold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              2. Parâmetros de Iluminação, Lente & Textura
            </span>
            <span className="text-[10px] text-slate-400">Customizável em Tempo Real</span>
          </div>

          {/* SELETOR DE ILUMINAÇÃO */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Iluminação de Estúdio:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LIGHTING_PRESETS.map((light) => {
                const isSelected = selectedLighting.includes(light.name.split(" ")[0]);
                return (
                  <button
                    key={light.id}
                    type="button"
                    onClick={() => setSelectedLighting(light.name)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-500/50 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xs font-bold block">{light.name}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{light.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SELETOR DE LENTES & ENQUADRAMENTO */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-teal-400" />
              Lente & Profundidade de Campo:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LENS_PRESETS.map((lens) => {
                const isSelected = selectedLens.includes(lens.name.split(" ")[0]);
                return (
                  <button
                    key={lens.id}
                    type="button"
                    onClick={() => setSelectedLens(lens.name)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-teal-500/15 border-teal-500/50 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xs font-bold block">{lens.name}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{lens.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SELETOR DE TEXTURAS & SUPERFÍCIES */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Textura Tátil & Superfície:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TEXTURE_PRESETS.map((tex) => {
                const isSelected = selectedTexture.includes(tex.name.split(" ")[0]);
                return (
                  <button
                    key={tex.id}
                    type="button"
                    onClick={() => setSelectedTexture(tex.name)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-indigo-500/15 border-indigo-500/50 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xs font-bold block">{tex.name}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{tex.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* PREVIEW EM TEMPO REAL & SÍNTESE DO ESTILO (COLUNA DIREITA) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* MOCKUP VISUAL INTERATIVO */}
          <div 
            className="rounded-3xl border border-slate-800 p-5 shadow-2xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between min-h-[360px]"
            style={{ 
              backgroundColor: selectedStyle.backgroundColor,
              borderColor: `${selectedStyle.accentColor}40`
            }}
          >
            {/* GLOW DE FUNDO */}
            <div 
              className="absolute -top-16 -right-16 w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-40"
              style={{ backgroundColor: selectedStyle.primaryColor }}
            />
            <div 
              className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-20"
              style={{ backgroundColor: selectedStyle.accentColor }}
            />

            {/* TOP BAR DO PREVIEW */}
            <div className="relative z-10 flex items-center justify-between">
              <span 
                className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm font-mono"
                style={{ 
                  color: selectedStyle.textColor, 
                  backgroundColor: `${selectedStyle.secondaryColor}99`,
                  borderColor: `${selectedStyle.accentColor}50`
                }}
              >
                {selectedStyle.badge}
              </span>

              <span className="text-[10px] text-slate-400 font-mono">
                {selectedLens.split(" ")[0]} • 8K UHD
              </span>
            </div>

            {/* CORPO DO ANÚNCIO / PREVIEW */}
            <div className="relative z-10 my-6 space-y-2.5">
              <div 
                className="text-xs font-extrabold uppercase tracking-wider font-mono flex items-center gap-1.5"
                style={{ color: selectedStyle.accentColor }}
              >
                <Zap className="w-3.5 h-3.5" />
                {selectedStyle.tag}
              </div>

              <h3 
                className="text-xl md:text-2xl font-black leading-tight tracking-tight"
                style={{ 
                  color: selectedStyle.textColor,
                  fontFamily: selectedStyle.typographyHeading 
                }}
              >
                A Fórmula Definitiva para Escalar Seu Negócio Digital
              </h3>

              <p 
                className="text-xs leading-relaxed opacity-85"
                style={{ 
                  color: selectedStyle.textColor,
                  fontFamily: selectedStyle.typographyBody 
                }}
              >
                Arquitetura proprietária com iluminação {selectedLighting.split(" ")[0]}, acabamento em {selectedTexture.split(" ")[0]} e altíssimo valor percebido.
              </p>
            </div>

            {/* BASE DO PREVIEW COM BOTÃO CTA ESTILIZADO */}
            <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                className="px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer transition transform active:scale-95"
                style={{
                  backgroundColor: selectedStyle.accentColor,
                  color: selectedStyle.backgroundColor === "#ffffff" ? "#000000" : "#090d16"
                }}
              >
                <span>ACESSAR AGORA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1.5">
                <span 
                  onClick={() => handleCopyColor(selectedStyle.primaryColor)}
                  className="w-5 h-5 rounded-full border border-white/30 cursor-pointer shadow hover:scale-110 transition"
                  style={{ backgroundColor: selectedStyle.primaryColor }}
                  title={`Copiar Primária: ${selectedStyle.primaryColor}`}
                />
                <span 
                  onClick={() => handleCopyColor(selectedStyle.accentColor)}
                  className="w-5 h-5 rounded-full border border-white/30 cursor-pointer shadow hover:scale-110 transition"
                  style={{ backgroundColor: selectedStyle.accentColor }}
                  title={`Copiar Accent: ${selectedStyle.accentColor}`}
                />
                <span 
                  onClick={() => handleCopyColor(selectedStyle.secondaryColor)}
                  className="w-5 h-5 rounded-full border border-white/30 cursor-pointer shadow hover:scale-110 transition"
                  style={{ backgroundColor: selectedStyle.secondaryColor }}
                  title={`Copiar Secundária: ${selectedStyle.secondaryColor}`}
                />
              </div>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO: APLICAR E COPIAR PROMPT */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={handleApplyStyleToBrand}
              className="w-full sm:flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition cursor-pointer uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Aplicar Estilo ao Brand OS</span>
            </button>

            <button
              type="button"
              onClick={handleCopyPrompt}
              className="w-full sm:w-auto px-4 py-3 bg-slate-950 hover:bg-slate-850 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              {copiedPrompt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPrompt ? "Prompt Copiado!" : "Copiar Master Prompt"}</span>
            </button>
          </div>

          {/* JUSTIFICATIVA DE CONVERSÃO */}
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
            <TrendingUp className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">Por que converte no digital:</strong>
              <p className="text-slate-400">{selectedStyle.conversionReason}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
