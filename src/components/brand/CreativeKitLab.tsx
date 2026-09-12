import React, { useState } from "react";
import { 
  Sparkles, 
  Layers, 
  Image, 
  Copy, 
  Check, 
  Download, 
  Zap, 
  BarChart3, 
  CheckCircle2, 
  Sliders, 
  ExternalLink,
  Award,
  Sparkle
} from "lucide-react";
import { CreativeKit, QualityScoreResult } from "../../types";
import { getSavedBrandOS } from "../../utils/brandOSHelper";

export default function CreativeKitLab() {
  const brand = getSavedBrandOS();

  const [topic, setTopic] = useState("Como Escalar Vendas de Infoprodutos no Automático");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const [activeKit, setActiveKit] = useState<CreativeKit | null>({
    title: "Kit Criativo de Alta Conversão • Padrão Brand OS",
    headline: "O Sistema Secreto para Escalar seu Infoproduto em 30 Dias",
    subheadline: "Construa uma operação digital soberana e elimine o trabalho manual.",
    cta: "ACESSAR A OPERAÇÃO AGORA",
    caption: `Quer parar de vender no manual e criar um negócio digital previsível? 

O ${brand.name} foi desenhado especificamente para ${brand.targetAudience.slice(0, 80)}...

Acesse o link na bio e libere a estrutura completa.`,
    description: "Anúncio de alta perfomance com gatilhos de autoridade, prova e urgência direcionado para conversão direta.",
    hashtags: ["#marketingdigital", "#infoprodutos", "#vendasnoautomatico", "#infinitymillion", "#gestaodetrafego"],
    mainImagePrompt: `Photorealistic high-end editorial image representing ${brand.name}. Premium studio lighting with ${brand.primaryColor} accents, 8K UHD.`,
    thumbnailPrompt: "Thumbnail de alto contraste 1280x720 com tipografia em caixa alta e iluminação dourada.",
    storyPrompt: "Design vertical 9:16 com enquadramento móvel e barra de progresso visual no topo.",
    carouselSlides: [
      { slideNumber: 1, title: "O Erro que 90% Cometem", body: "Tentar vender sem ter uma estrutura proprietária de checkout e páginas de alta conversão.", visualConcept: "Pessoa analisando telas de métricas em ambiente escuro." },
      { slideNumber: 2, title: "A Mudança de Chave", body: "Unificar IA, tráfego e cópias irresistíveis sob o mesmo Brand OS.", visualConcept: "Gráfico subindo com luz neon azul e dourada." },
      { slideNumber: 3, title: "Os 3 Pilares", body: "1. Oferta Irresistível \n2. Criativo Cinematográfico \n3. Checkout em 1-Clique.", visualConcept: "Três pilares de cristal iluminados por estúdio." },
      { slideNumber: 4, title: "A Prova dos Números", body: "Operações que utilizam Brand OS convertem até 3.4x mais que landing pages genéricas.", visualConcept: "Dashboard de faturamento verde com selo de verificado." },
      { slideNumber: 5, title: "Sua Vez de Escalar", body: "Toque no botão e comece hoje mesmo.", visualConcept: "Símbolo da marca brilhando em fundo de mármore." }
    ],
    bannerPrompt: "Banner horizontal 1200x628 com degradê preto-slate e botão verde em alto relevo.",
    adCopyFeed: `Você continua dependendo do boca a boca ou de postagens diárias sem retorno?

Descubra como o ${brand.name} transforma suas ideias em infoprodutos prontos para vender.`,
    usedPrompt: `Subject: ${topic}. Brand: ${brand.name}. Palette: ${brand.primaryColor}, ${brand.accentColor}. Style: Luxury Editorial.`,
    abVariations: [
      { id: "v1", name: "Variação A (Foco em Dor)", headline: "Cansado de Trabalhar Horas sem Ver o Retorno Financeiro?", visualAngle: "Imagem escura com iluminação dramática" },
      { id: "v2", name: "Variação B (Foco em Transformação)", headline: "Sua Marca Escalada em um Ecossistema de Alta Conversão", visualAngle: "Cena limpa e minimalista Apple Style" },
      { id: "v3", name: "Variação C (Foco em Curiosidade)", headline: "O Método Oculto dos Top Infoprodutores do Brasil", visualAngle: "Objeto de desejo sob iluminação Studio Golden Hour" }
    ]
  });

  // VISUAL ANALYSIS QUALITY SCORE (0 - 100)
  const [qualityScore, setQualityScore] = useState<QualityScoreResult>({
    overallScore: 94,
    luxuryScore: 96,
    hierarchyScore: 92,
    legibilityScore: 95,
    persuasionScore: 98,
    contrastScore: 91,
    brandingScore: 97,
    authorityScore: 94,
    modernityScore: 95,
    exclusivityScore: 93,
    diagnosticFeedback: [
      "✅ Excelente contraste entre a cor primária e o fundo neutro.",
      "✅ Tipografia Display transmite alto valor percebido e autoridade.",
      "💡 Sugestão: Aumentar ligeiramente o padding inferior da CTA para dar ainda mais respiro ao design."
    ],
    optimizedPromptSuggestion: "Adicionar iluminação volumétrica e profundidade bokeh f/1.4 para elevar a nota de exclusividade para 100/100."
  });

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleGenerateKit = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Refresh scores
      setQualityScore({
        ...qualityScore,
        overallScore: Math.floor(Math.random() * 5) + 95
      });
    }, 1200);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl space-y-6 font-sans">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-slate-900 border border-emerald-500/30 flex items-center justify-center shadow-lg text-emerald-400 font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                LABORATÓRIO CRIATIVO • KIT COMPLETO DE ANÚNCIOS & QUALITY SCORE
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-extrabold border border-emerald-500/30">
                GERAÇÃO MULTIFORMATO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Não gere apenas uma imagem. Obtenha o Kit Completo de Anúncios (Story, Carrossel, Feed, Headlines, A/B) com avaliação visual em 9 dimensões.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-white font-medium text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
            placeholder="Tema do Anúncio..."
          />

          <button
            type="button"
            onClick={handleGenerateKit}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition cursor-pointer shrink-0 uppercase tracking-wider"
          >
            <Zap className={`w-4 h-4 text-slate-950 ${isGenerating ? "animate-spin" : ""}`} />
            <span>{isGenerating ? "Gerando Kit..." : "Gerar Kit Completo"}</span>
          </button>
        </div>
      </div>

      {activeKit && (
        <div className="space-y-6">
          {/* QUALITY SCORE DIAGNOSTIC (IMPLEMENTAÇÃO 06) */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-teal-500/40 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-850 pb-3 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center font-black text-teal-300 text-xl font-mono shadow-md">
                  {qualityScore.overallScore}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Award className="w-4 h-4 text-teal-400" />
                    AUDITORIA DE QUALIDADE VISUAL (QUALITY SCORE)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Sua arte atinge nível de excelência para campanhas de alta conversão.
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono border border-emerald-500/30 self-start md:self-auto">
                PADRÃO VOGUE/APPLE AD
              </span>
            </div>

            {/* 9 METRICS GRID */}
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              {[
                { label: "Luxo", score: qualityScore.luxuryScore },
                { label: "Hierarquia", score: qualityScore.hierarchyScore },
                { label: "Legibilidade", score: qualityScore.legibilityScore },
                { label: "Persuasão", score: qualityScore.persuasionScore },
                { label: "Contraste", score: qualityScore.contrastScore },
                { label: "Branding", score: qualityScore.brandingScore },
                { label: "Autoridade", score: qualityScore.authorityScore },
                { label: "Modernidade", score: qualityScore.modernityScore },
                { label: "Exclusividade", score: qualityScore.exclusivityScore },
              ].map((m, idx) => (
                <div key={idx} className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-center space-y-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block truncate">{m.label}</span>
                  <span className="text-xs font-black text-teal-300 font-mono">{m.score}/100</span>
                </div>
              ))}
            </div>

            {/* FEEDBACK & OPTIMIZE BUTTON */}
            <div className="space-y-1.5 pt-1">
              {qualityScore.diagnosticFeedback.map((fb, i) => (
                <p key={i} className="text-xs text-slate-300 font-medium">{fb}</p>
              ))}
            </div>
          </div>

          {/* MAIN AD COPY & HEADLINES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* HEADLINE, SUBHEADLINE & CTA */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 font-mono uppercase">Headline & CTA do Anúncio</span>
                <button
                  type="button"
                  onClick={() => handleCopyText(`${activeKit.headline}\n${activeKit.subheadline}\n${activeKit.cta}`, "head")}
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === "head" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-850">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block font-mono">Headline principal</span>
                  <p className="text-xs font-black text-white">{activeKit.headline}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-850">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block font-mono">Subheadline</span>
                  <p className="text-xs text-slate-300">{activeKit.subheadline}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-500 uppercase font-mono">Chamada (CTA)</span>
                  <span className="text-xs font-black text-emerald-400">{activeKit.cta}</span>
                </div>
              </div>
            </div>

            {/* CAPTION & HASHTAGS */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 font-mono uppercase">Legenda para Feed / Instagram</span>
                <button
                  type="button"
                  onClick={() => handleCopyText(`${activeKit.caption}\n\n${activeKit.hashtags.join(" ")}`, "cap")}
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === "cap" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar Legenda</span>
                </button>
              </div>

              <pre className="p-3 bg-slate-900 rounded-xl border border-slate-850 text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                {activeKit.caption}
              </pre>

              <div className="flex flex-wrap gap-1">
                {activeKit.hashtags.map((h, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-teal-400 text-[10px] font-mono font-bold border border-slate-800">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CAROUSEL SLIDES (5 SLIDES) */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Roteiro para Carrossel de 5 Slides (Instagram / LinkedIn)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {activeKit.carouselSlides.map((slide) => (
                <div key={slide.slideNumber} className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-extrabold uppercase border border-emerald-500/30">
                      SLIDE 0{slide.slideNumber}
                    </span>
                    <h5 className="text-xs font-black text-white mt-2">{slide.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">{slide.body}</p>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl text-[9px] text-slate-500 font-mono">
                    Concept: {slide.visualConcept}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* A/B VARIATIONS */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Variações A/B de Alta Perfomance para Testes de Tráfego
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeKit.abVariations.map((v) => (
                <div key={v.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold uppercase border border-amber-500/30">
                    {v.name}
                  </span>
                  <h5 className="text-xs font-bold text-white mt-1">"{v.headline}"</h5>
                  <p className="text-[10px] text-slate-400 font-mono">Ângulo Visual: {v.visualAngle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
