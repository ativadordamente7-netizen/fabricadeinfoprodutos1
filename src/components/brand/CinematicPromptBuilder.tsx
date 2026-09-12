import React, { useState } from "react";
import { 
  Video, 
  Sparkles, 
  Camera, 
  Sun, 
  Layers, 
  Copy, 
  Check, 
  Sliders, 
  Cpu, 
  Maximize2,
  Wand2
} from "lucide-react";
import { CinematicDirection, PerceptionTrigger } from "../../types";
import { buildCinematicPrompt, getSavedBrandOS } from "../../utils/brandOSHelper";

interface Props {
  onPromptGenerated?: (masterPrompt: string) => void;
}

export default function CinematicPromptBuilder({ onPromptGenerated }: Props) {
  const brand = getSavedBrandOS();

  const [promptText, setPromptText] = useState("Empresário de alto padrão analisando métricas financeiras em uma sala de reunião com iluminação dramática");
  const [copied, setCopied] = useState(false);

  const [cinematic, setCinematic] = useState<CinematicDirection>({
    style: "Luxo",
    lighting: "Luxury Studio",
    textures: "Vidro Bisotado",
    palette: `${brand.primaryColor} e Ouro Rosé`,
    typography: brand.typographyHeading,
    composition: "Simetria Central",
    depth: "Rasa (Background Murcho)",
    narrativa: "Sofrer transformação de um amador para um líder absoluto de mercado"
  });

  const [selectedPerception, setSelectedPerception] = useState<PerceptionTrigger>("Luxo");

  const masterPrompt = buildCinematicPrompt(promptText, cinematic, brand, selectedPerception);

  const handleCopy = () => {
    navigator.clipboard.writeText(masterPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onPromptGenerated) {
      onPromptGenerated(masterPrompt);
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl space-y-6 font-sans">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-slate-900 border border-indigo-500/30 flex items-center justify-center shadow-lg text-indigo-400 font-bold">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                DIREÇÃO CINEMATOGRÁFICA & MASTER PROMPT BUILDER
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[9px] font-extrabold border border-indigo-500/30">
                PROMPT ENGINE 8K
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Defina estilo, lente, iluminação e texturas cinematográficas para gerar prompts ultra-realistas com a identidade do seu Brand OS.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition cursor-pointer shrink-0 uppercase tracking-wider"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Prompt Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar Master Prompt 8K</span>
            </>
          )}
        </button>
      </div>

      {/* INPUT MAIN CONCEPT */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-indigo-400 font-mono uppercase flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5" />
          1. Conceito do Objeto ou Cena Principal
        </label>
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          rows={2}
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium resize-none"
          placeholder="Descreva a imagem que deseja gerar..."
        />
      </div>

      {/* CINEMATIC SELECTORS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* ESTILO */}
        <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-850">
          <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Estilo Estético</label>
          <select
            value={cinematic.style}
            onChange={(e) => setCinematic({ ...cinematic, style: e.target.value as any })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold cursor-pointer"
          >
            <option value="Luxo">Luxo & Alta Costura</option>
            <option value="Apple">Apple Minimalist</option>
            <option value="Tesla">Tesla High-Tech</option>
            <option value="Minimalista">Minimalista Absoluto</option>
            <option value="Editorial">Editorial Vogue</option>
            <option value="Documentário">Documentário Netflix</option>
            <option value="Hollywood">Hollywood Blockbuster</option>
            <option value="Futurista">Futurista Cyber</option>
            <option value="Espiritual">Espiritual Transcendental</option>
            <option value="Arquitetônico">Arquitetônico Moderno</option>
          </select>
        </div>

        {/* ILUMINAÇÃO */}
        <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-850">
          <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Iluminação de Estúdio</label>
          <select
            value={cinematic.lighting}
            onChange={(e) => setCinematic({ ...cinematic, lighting: e.target.value as any })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold cursor-pointer"
          >
            <option value="Luxury Studio">Luxury Studio Rim-Lighting</option>
            <option value="Golden Hour">Golden Hour Natural</option>
            <option value="Soft Natural">Soft Window Natural</option>
            <option value="Cinematic Editorial">Cinematic High-Contrast</option>
            <option value="Dramatic Cyber">Dramatic Cyber Neon</option>
          </select>
        </div>

        {/* TEXTURAS */}
        <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-850">
          <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Textura dos Materiais</label>
          <select
            value={cinematic.textures}
            onChange={(e) => setCinematic({ ...cinematic, textures: e.target.value as any })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold cursor-pointer"
          >
            <option value="Vidro Bisotado">Vidro Bisotado & Acrílico</option>
            <option value="Metal Escovado">Metal Escovado Anodizado</option>
            <option value="Mármore Negro">Mármore Negro Nero Marquina</option>
            <option value="Fibra de Carbono">Fibra de Carbono 3D</option>
            <option value="Dourado Polido">Dourado Polido 24K</option>
          </select>
        </div>

        {/* COMPOSIÇÃO DE CÂMERA */}
        <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-850">
          <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Composição & Lente</label>
          <select
            value={cinematic.composition}
            onChange={(e) => setCinematic({ ...cinematic, composition: e.target.value as any })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold cursor-pointer"
          >
            <option value="Simetria Central">Simetria Central Imprenso</option>
            <option value="Regra dos Terços">Regra dos Terços Dinâmica</option>
            <option value="Macro Close-Up">Macro Close-Up Detalhado</option>
            <option value="Lente 35mm F/1.4">Lente 35mm F/1.4 Cinematográfica</option>
            <option value="Cinematic Bokeh 85mm">Portrait Bokeh 85mm F/1.2</option>
          </select>
        </div>
      </div>

      {/* PERCEPTION TRIGGER INTEGRATION */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
        <label className="text-xs font-bold text-amber-400 font-mono uppercase block">
          Modo Percepção Emocional Desejado
        </label>
        <div className="flex flex-wrap gap-2">
          {(["Luxo", "Autoridade", "Confiança", "Exclusividade", "Curiosidade", "Transformação", "Clareza", "Urgência"] as PerceptionTrigger[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedPerception(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer border ${
                selectedPerception === p
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* COMPILED MASTER PROMPT PREVIEW */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 font-mono uppercase block">Master Prompt Gerado (Pronto para Gemini / Flux / Midjourney):</span>
        <pre className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/30 text-xs font-mono text-indigo-300 whitespace-pre-wrap leading-relaxed">
          {masterPrompt}
        </pre>
      </div>
    </div>
  );
}
