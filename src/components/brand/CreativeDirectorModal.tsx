import React, { useState } from "react";
import { 
  Sparkles, 
  Sparkle, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Camera, 
  Palette, 
  Zap, 
  Layers, 
  Compass, 
  Eye, 
  X,
  Sliders,
  Copy,
  Check
} from "lucide-react";
import { CreativeDirectorBrief, BrandOS } from "../../types";
import { getSavedBrandOS } from "../../utils/brandOSHelper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDirectionGenerated?: (brief: CreativeDirectorBrief) => void;
}

export default function CreativeDirectorModal({ isOpen, onClose, onDirectionGenerated }: Props) {
  const brand = getSavedBrandOS();

  // Interview state
  const [step, setStep] = useState(1);
  const [objective, setObjective] = useState("Vendas imediatas de Infoproduto High-Ticket");
  const [audience, setAudience] = useState(brand.targetAudience);
  const [transformation, setTransformation] = useState(brand.promise);
  const [emotion, setEmotion] = useState("Desejo Visceral de Crescimento & Exclusividade");
  const [consciousness, setConsciousness] = useState(brand.consciousnessLevel);
  const [visualStyle, setVisualStyle] = useState("Editorial de Luxo e Minimalismo Tecnológico");
  const [reference, setReference] = useState("Apple, Tesla, Vogue Business");
  const [tone, setTone] = useState(brand.voiceTone);
  const [first3SecFeeling, setFirst3SecFeeling] = useState("Choque de Autoridade e Encantamento Imediato");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<CreativeDirectorBrief | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const brief: CreativeDirectorBrief = {
        id: "cd_brief_" + Date.now(),
        objective,
        targetAudience: audience,
        transformation,
        mainEmotion: emotion,
        consciousnessLevel: consciousness,
        visualStyle,
        referenceBrand: reference,
        communicationTone: tone,
        first3SecFeeling,
        directionTitle: `DIREÇÃO CRIATIVA: ${visualStyle.toUpperCase()} • MODA & LUXO`,
        colorMood: [brand.primaryColor, brand.accentColor, "#0f172a", "#f8fafc", "#1e293b"],
        visualHooks: [
          `Gancho 3s: Abertura cinematográfica em movimento lento com iluminação de estúdio luxuoso em contraste com o texto '${transformation.slice(0, 30)}...'`,
          "Simetria central de produto/pessoa transmitindo autoridade soberana e elegância minimalista",
          "Animações de entrada com tipografia Display em alto contraste e profundidade de campo rasa"
        ],
        suggestedCopyStructure: `
[HEADLINE DE IMPACTO 3s]
"${transformation}"

[SUBHEADLINE DE QUALIFICAÇÃO]
"Desenvolvido especificamente para ${audience.slice(0, 60)}... com o padrão ${brand.name}."

[HOOK EMOCIONAL (${emotion})]
"Enquanto o mercado utiliza métodos ultrapassados, você acessa a arquitetura que gera resultados previsíveis."

[CTA EXCLUSIVO]
"Toque abaixo e acesse a operação agora mesmo."
        `.trim(),
        createdAt: new Date().toLocaleDateString("pt-BR")
      };

      setGeneratedBrief(brief);
      setIsGenerating(false);
      if (onDirectionGenerated) {
        onDirectionGenerated(brief);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl w-full max-w-4xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-slate-950 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold shadow-lg">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                INFINITY CREATIVE DIRECTOR • DIRETOR DE ARTE IA
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[9px] font-extrabold border border-teal-500/30">
                BRIEFING CINEMATOGRÁFICO
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Entrevista estratégica para definir a estética, o tom e a direção visual completa da sua campanha.
            </p>
          </div>
        </div>

        {/* INTERVIEW STEPS OR RESULT */}
        {!generatedBrief ? (
          <div className="space-y-6">
            {/* INTERVIEW FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-400 font-mono uppercase">1. Qual o objetivo principal?</label>
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                  placeholder="Ex: Vendas de checkout, captação de leads VIP"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-400 font-mono uppercase">2. Quem é o público-alvo exato?</label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                  placeholder="Ex: Empreendedores e decisores digitais"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-400 font-mono uppercase">3. Qual a transformação desejada?</label>
                <input
                  type="text"
                  value={transformation}
                  onChange={(e) => setTransformation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                  placeholder="Ex: Virar autoridade de mercado e faturar no automático"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-400 font-mono uppercase">4. Qual a emoção principal a provocar?</label>
                <input
                  type="text"
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                  placeholder="Ex: Desejo, Confiança, Exclusividade, Urgência"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-400 font-mono uppercase">5. Estilo Visual Referência</label>
                <input
                  type="text"
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                  placeholder="Ex: Minimalismo Apple, Luxo Cyber, Editorial Studio"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-400 font-mono uppercase">6. Qual a sensação nos primeiros 3 segundos?</label>
                <input
                  type="text"
                  value={first3SecFeeling}
                  onChange={(e) => setFirst3SecFeeling(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                  placeholder="Ex: Impacto visual imediato e autoridade inquestionável"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black text-xs rounded-2xl shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 transition cursor-pointer uppercase tracking-wider"
              >
                {isGenerating ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Construindo Direção Criativa...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Gerar Direção Criativa & Moodboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* GENERATED CREATIVE DIRECTION BOARD & MOODBOARD */
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 bg-slate-950 rounded-2xl border border-teal-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-teal-300 uppercase font-mono">
                  {generatedBrief.directionTitle}
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Gerado em: {generatedBrief.createdAt}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Objetivo</span>
                  <p className="text-xs font-bold text-white mt-0.5">{generatedBrief.objective}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Emoção Guia</span>
                  <p className="text-xs font-bold text-amber-400 mt-0.5">{generatedBrief.mainEmotion}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Gancho 3s</span>
                  <p className="text-xs font-bold text-teal-300 mt-0.5">{generatedBrief.first3SecFeeling}</p>
                </div>
              </div>
            </div>

            {/* GENERATIVE MOODBOARD */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Palette className="w-4 h-4 text-teal-400" />
                Moodboard Visual Gerativo (Paleta & Ganchos)
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {generatedBrief.colorMood.map((color, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg border border-white/20 shadow-inner" style={{ backgroundColor: color }} />
                    <span className="text-[10px] font-mono font-bold text-white uppercase">{color}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-teal-400 font-mono uppercase block">Direção dos Ganchos Visuais</span>
                <ul className="space-y-2">
                  {generatedBrief.visualHooks.map((hook, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                      <span>{hook}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* COPY & NARRATIVE STRUCTURE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 font-mono uppercase">Estrutura Narrativa & Copy Recomendada</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedBrief.suggestedCopyStructure);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs font-mono text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copiado!" : "Copiar Copy"}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {generatedBrief.suggestedCopyStructure}
              </pre>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setGeneratedBrief(null)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 cursor-pointer"
              >
                Refazer Entrevista
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer uppercase"
              >
                Aplicar Direção Criativa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
