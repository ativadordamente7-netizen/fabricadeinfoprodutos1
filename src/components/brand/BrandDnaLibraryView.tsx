import React, { useState } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  Crown, 
  Check, 
  Copy, 
  ArrowRight, 
  Sliders, 
  Flame, 
  Layers, 
  Zap, 
  Eye, 
  Target, 
  Compass, 
  BookOpen, 
  Award,
  AlertTriangle,
  RefreshCw,
  Search
} from "lucide-react";
import { BRAND_DNA_PROFILES, getBrandDnaById } from "../../data/brandDnaLibrary";
import { BrandDnaProfile, BrandOS } from "../../types";
import { getSavedBrandOS, saveBrandOS } from "../../utils/brandOSHelper";

interface Props {
  onBrandUpdated?: (brand: BrandOS) => void;
  onNavigateToStyles?: () => void;
}

export default function BrandDnaLibraryView({ onBrandUpdated, onNavigateToStyles }: Props) {
  const currentBrand = getSavedBrandOS();
  const [selectedDnaId, setSelectedDnaId] = useState<string>("dna_high_ticket");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedDna: BrandDnaProfile = getBrandDnaById(selectedDnaId);

  const filteredDnaList = BRAND_DNA_PROFILES.filter(dna => {
    const q = searchTerm.toLowerCase();
    return (
      dna.name.toLowerCase().includes(q) ||
      dna.archetype.toLowerCase().includes(q) ||
      dna.description.toLowerCase().includes(q) ||
      dna.badge.toLowerCase().includes(q)
    );
  });

  const handleApplyDnaToBrandOS = (dna: BrandDnaProfile) => {
    const updatedBrand: BrandOS = {
      ...currentBrand,
      archetype: dna.archetype,
      voiceTone: dna.voiceTone,
      personality: dna.personality,
      values: dna.coreValues,
      promise: dna.keyPromise,
      primaryColor: dna.primaryColor,
      secondaryColor: dna.secondaryColor,
      accentColor: dna.accentColor,
      typographyHeading: dna.typographyHeading,
      typographyBody: dna.typographyBody,
      positioning: `${dna.name}: ${dna.slogan}`
    };

    saveBrandOS(updatedBrand);
    if (onBrandUpdated) {
      onBrandUpdated(updatedBrand);
    }

    setAppliedNotification(dna.name);
    setTimeout(() => setAppliedNotification(null), 3500);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl space-y-7 font-sans">
      {/* HEADER BANNER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-slate-900 border border-amber-500/30 flex items-center justify-center shadow-lg text-amber-400 font-bold text-2xl shrink-0">
            🧬
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                BIBLIOTECA DE DNA DE MARCA & ARQUÉTIPOS
              </h2>
              <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-extrabold border border-amber-500/30">
                8 ARQUÉTIPOS DE ELITE
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Escolha uma matriz de DNA validada para sua marca. Cada perfil injeta automaticamente tom de voz, regras inquebráveis, gatilhos mentais e paleta de conversão no seu ecossistema.
            </p>
          </div>
        </div>

        {/* NOTIFICAÇÃO DE SUCESSO AO APLICAR */}
        {appliedNotification && (
          <div className="bg-emerald-500/15 border border-emerald-500/40 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 animate-fadeIn text-emerald-300 text-xs font-bold shadow-lg">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>DNA "{appliedNotification}" aplicado com sucesso ao Brand OS!</span>
          </div>
        )}
      </div>

      {/* SEARCH AND QUICK SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por arquétipo, estilo ou nicho..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="text-xs text-slate-400 font-medium">
          DNA Atual da Marca: <span className="text-amber-400 font-bold">{currentBrand.archetype || "Personalizado"}</span>
        </div>
      </div>

      {/* GRID DE CARDS DE DNA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredDnaList.map((dna) => {
          const isSelected = selectedDnaId === dna.id;
          return (
            <div
              key={dna.id}
              onClick={() => setSelectedDnaId(dna.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between text-left group ${
                isSelected
                  ? "bg-slate-850 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/40"
                  : "bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-2xl">{dna.icon}</span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider font-mono ${
                    isSelected ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}>
                    {dna.badge}
                  </span>
                </div>

                <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition line-clamp-1">
                  {dna.name}
                </h3>
                <p className="text-[11px] font-medium text-amber-400/90 mt-0.5">
                  {dna.archetype}
                </p>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {dna.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: dna.primaryColor }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: dna.accentColor }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: dna.secondaryColor }} />
                </div>

                <span className={`text-[11px] font-bold ${isSelected ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                  {isSelected ? "Selecionado" : "Ver Raio-X →"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* RAIO-X DETALHADO DO DNA SELECIONADO */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-7 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* HEADER DO RAIO-X */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-850 pb-5 gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow-md">
              {selectedDna.icon}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg md:text-xl font-black text-white tracking-tight">
                  {selectedDna.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-extrabold border border-amber-500/30">
                  {selectedDna.archetype}
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-300 mt-1 italic font-medium">
                "{selectedDna.slogan}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleCopyText(JSON.stringify(selectedDna, null, 2), "dna_json")}
              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 transition flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSection === "dna_json" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === "dna_json" ? "Copiado!" : "Copiar DNA"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleApplyDnaToBrandOS(selectedDna)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition cursor-pointer uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Aplicar este DNA à Marca</span>
            </button>
          </div>
        </div>

        {/* CONTEÚDO ESTRUTURADO DO RAIO-X */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {/* BLOCO 1: TOM DE VOZ & PERSONALIDADE */}
          <div className="bg-slate-900/90 border border-slate-800/90 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300 uppercase tracking-wider font-mono">
              <Compass className="w-4 h-4 text-amber-400" />
              Tom de Voz & Postura
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Tom de Comunicação:</span>
                <p className="text-slate-100 font-medium leading-relaxed">{selectedDna.voiceTone}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Personalidade:</span>
                <p className="text-slate-200 font-medium">{selectedDna.personality}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Público-Alvo Ideal:</span>
                <p className="text-slate-300 font-medium leading-relaxed">{selectedDna.targetAudience}</p>
              </div>
            </div>
          </div>

          {/* BLOCO 2: GATILHOS MENTAIS & PALAVRAS PROIBIDAS */}
          <div className="bg-slate-900/90 border border-slate-800/90 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300 uppercase tracking-wider font-mono">
              <Zap className="w-4 h-4 text-emerald-400" />
              Gatilhos & Anti-Padrões
            </div>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">
                  Gatilhos Obrigatórios:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDna.mandatoryTriggers.map((trig, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-md text-[10px] font-semibold">
                      ✓ {trig}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase block mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  Palavras Proibidas (Anti-Regras):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDna.forbiddenWords.map((word, i) => (
                    <span key={i} className="px-2 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-md text-[10px] font-semibold">
                      ✕ {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BLOCO 3: IDENTIDADE VISUAL RECOMENDADA */}
          <div className="bg-slate-900/90 border border-slate-800/90 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-teal-300 uppercase tracking-wider font-mono">
              <Sliders className="w-4 h-4 text-teal-400" />
              Paleta Cromática & Tipografia
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                  Cores de Alta Conversão:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex flex-col items-center gap-1 text-center">
                    <span className="w-5 h-5 rounded-full border border-white/20 shadow" style={{ backgroundColor: selectedDna.primaryColor }} />
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Primária</span>
                    <span className="text-[10px] font-mono text-white font-bold">{selectedDna.primaryColor}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex flex-col items-center gap-1 text-center">
                    <span className="w-5 h-5 rounded-full border border-white/20 shadow" style={{ backgroundColor: selectedDna.accentColor }} />
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Destaque</span>
                    <span className="text-[10px] font-mono text-white font-bold">{selectedDna.accentColor}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex flex-col items-center gap-1 text-center">
                    <span className="w-5 h-5 rounded-full border border-white/20 shadow" style={{ backgroundColor: selectedDna.secondaryColor }} />
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Fundo/Base</span>
                    <span className="text-[10px] font-mono text-white font-bold">{selectedDna.secondaryColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Tipografia Par:</span>
                <p className="text-white font-bold">
                  {selectedDna.typographyHeading} <span className="text-slate-400 font-normal">(Títulos)</span> + {selectedDna.typographyBody} <span className="text-slate-400 font-normal">(Corpo)</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BANNER DE APLICAÇÃO PRÁTICA: PROMESSA, HEADLINE E BIO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-850">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono block">
              Promessa Central do DNA:
            </span>
            <p className="text-xs text-slate-100 font-medium leading-relaxed">
              "{selectedDna.keyPromise}"
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider font-mono block">
              Exemplo de Headline de Conversão:
            </span>
            <p className="text-xs text-white font-bold leading-relaxed">
              "{selectedDna.sampleHeadline}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
