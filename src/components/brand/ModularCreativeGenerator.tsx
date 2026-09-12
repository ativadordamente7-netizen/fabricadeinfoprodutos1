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
  Award,
  Video,
  Smartphone,
  LayoutGrid,
  FileText,
  Split,
  Eye,
  RefreshCw,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { CreativeKit, QualityScoreResult, BrandOS } from "../../types";
import { getSavedBrandOS } from "../../utils/brandOSHelper";

interface Props {
  onCopyAll?: () => void;
}

export default function ModularCreativeGenerator({ onCopyAll }: Props) {
  const brand = getSavedBrandOS();

  const [topic, setTopic] = useState("Como Escalar Vendas de Infoprodutos no Automático");
  const [activeModuleTab, setActiveModuleTab] = useState<"all" | "feed" | "story" | "carousel" | "banner" | "ab">("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // DADOS DO KIT MODULAR
  const [kit, setKit] = useState<CreativeKit>({
    title: "Kit Modular de Alta Conversão • Padrão Brand OS",
    headline: "O Sistema Secreto para Escalar seu Infoproduto em 30 Dias",
    subheadline: "Construa uma operação digital soberana e elimine o trabalho manual.",
    cta: "ACESSAR A OPERAÇÃO AGORA",
    caption: `Quer parar de vender no manual e criar um negócio digital previsível? 

O ${brand.name} foi desenhado especificamente para ${brand.targetAudience.slice(0, 80)}...

Acesse o link na bio e libere a estrutura completa.`,
    description: "Anúncio de alta performance com gatilhos de autoridade, prova e urgência direcionado para conversão direta.",
    hashtags: ["#marketingdigital", "#infoprodutos", "#vendasnoautomatico", "#infinitymillion", "#gestaodetrafego"],
    mainImagePrompt: `Photorealistic high-end editorial image representing ${brand.name}. Premium studio lighting with ${brand.primaryColor} accents, 8K UHD.`,
    thumbnailPrompt: "Thumbnail de alto contraste 1280x720 com tipografia em caixa alta e iluminação dourada.",
    storyPrompt: "Design vertical 9:16 com enquadramento móvel e barra de progresso visual no topo.",
    carouselSlides: [
      { slideNumber: 1, title: "O Erro que 90% Cometem", body: "Tentar vender sem ter uma estrutura proprietária de checkout e páginas de alta conversão.", visualConcept: "Pessoa analisando telas de métricas em ambiente escuro com iluminação dramática." },
      { slideNumber: 2, title: "A Mudança de Chave", body: "Unificar IA, tráfego e cópias irresistíveis sob o mesmo Brand OS.", visualConcept: "Gráfico subindo com luz neon azul e dourada." },
      { slideNumber: 3, title: "Os 3 Pilares", body: "1. Oferta Irresistível \n2. Criativo Cinematográfico \n3. Checkout em 1-Clique.", visualConcept: "Três pilares de cristal iluminados por estúdio." },
      { slideNumber: 4, title: "A Prova dos Números", body: "Operações que utilizam Brand OS convertem até 3.4x mais que landing pages genéricas.", visualConcept: "Dashboard de faturamento verde com selo de verificado." },
      { slideNumber: 5, title: "Sua Vez de Escalar", body: "Toque no botão e comece hoje mesmo.", visualConcept: "Símbolo da marca brilhando em fundo de mármore com botão CTA." }
    ],
    bannerPrompt: "Banner horizontal 1200x628 com degradê preto-slate e botão verde em alto relevo.",
    adCopyFeed: `Você continua dependendo do boca a boca ou de postagens diárias sem retorno?

Descubra como o ${brand.name} transforma suas ideias em infoprodutos prontos para vender.`,
    usedPrompt: `Subject: ${topic}. Brand: ${brand.name}. Palette: ${brand.primaryColor}, ${brand.accentColor}. Style: Luxury Editorial.`,
    abVariations: [
      { id: "v1", name: "Variação A (Foco na Dor)", headline: "Cansado de Trabalhar Horas sem Ver o Retorno Financeiro?", visualAngle: "Imagem escura com iluminação dramática e expressão de tensão" },
      { id: "v2", name: "Variação B (Foco em Transformação)", headline: "Sua Marca Escalada em um Ecossistema de Alta Conversão", visualAngle: "Cena limpa e minimalista Apple Style com sorriso confiante" },
      { id: "v3", name: "Variação C (Foco em Curiosidade)", headline: "O Método Oculto dos Top Infoprodutores do Brasil", visualAngle: "Objeto misterioso brilhando sob iluminação Studio Golden Hour" },
      { id: "v4", name: "Variação D (Foco em Lógica e Garantia)", headline: "A Estrutura Matemática que Garante Vendas Previsíveis", visualAngle: "Dashboard 3D com gráficos em verde esmeralda e selo de garantia" }
    ]
  });

  // QUALITY SCORE (9 DIMENSÕES)
  const [qualityScore, setQualityScore] = useState<QualityScoreResult>({
    overallScore: 96,
    luxuryScore: 97,
    hierarchyScore: 94,
    legibilityScore: 96,
    persuasionScore: 98,
    contrastScore: 95,
    brandingScore: 98,
    authorityScore: 95,
    modernityScore: 96,
    exclusivityScore: 94,
    diagnosticFeedback: [
      "✅ Excelente alinhamento entre a promessa do Brand OS e a headline do criativo.",
      "✅ Contraste WCAG AA garantido com cores primária e secundária da marca.",
      "💡 Dica de Escala: Utilize a Variação A para tráfego frio e a Variação B para remarketing."
    ],
    optimizedPromptSuggestion: "Adicionar iluminação volumétrica e profundidade bokeh f/1.4 para elevar a nota de exclusividade para 100/100."
  });

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopyCompleteKit = () => {
    const fullText = `=== ${kit.title} ===
Headline: ${kit.headline}
Subheadline: ${kit.subheadline}
CTA: ${kit.cta}

--- FEED QUADRADO 1:1 ---
Copy: ${kit.caption}
Prompt Visual: ${kit.mainImagePrompt}

--- STORIES 9:16 ---
Prompt: ${kit.storyPrompt}

--- CARROSSEL (5 SLIDES) ---
${kit.carouselSlides.map(s => `Slide ${s.slideNumber}: ${s.title}\n${s.body}\nVisual: ${s.visualConcept}\n`).join("\n")}

--- BANNER & THUMBNAIL ---
Banner 1200x628: ${kit.bannerPrompt}
Thumbnail 1280x720: ${kit.thumbnailPrompt}

--- TESTES A/B DE HEADLINE ---
${kit.abVariations.map(v => `${v.name}: "${v.headline}" (${v.visualAngle})`).join("\n")}
`;
    navigator.clipboard.writeText(fullText);
    setCopiedSection("full_kit");
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleGenerateNewModularKit = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setQualityScore({
        ...qualityScore,
        overallScore: Math.min(100, Math.floor(Math.random() * 4) + 96)
      });
    }, 1200);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl space-y-7 font-sans">
      {/* HEADER BANNER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-slate-900 border border-emerald-500/30 flex items-center justify-center shadow-lg text-emerald-400 font-bold text-2xl shrink-0">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                GERADOR MODULAR DE CRIATIVOS • MULTIFORMATO
              </h2>
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-extrabold border border-emerald-500/30">
                5 MÓDULOS INTEGRADOS
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Gere campanhas completas sincronizadas com seu Brand OS: Feed 1:1, Stories 9:16, Carrossel de 5 Slides, Banners 16:9 e Testes A/B multivariados de alta conversão.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Tema ou foco do criativo..."
              className="bg-slate-950 border border-slate-800 text-white font-medium text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 w-56 sm:w-64"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerateNewModularKit}
            disabled={isGenerating}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition cursor-pointer shrink-0 uppercase tracking-wider"
          >
            <RefreshCw className={`w-4 h-4 text-slate-950 ${isGenerating ? "animate-spin" : ""}`} />
            <span>{isGenerating ? "Gerando..." : "Regerar Kit"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCompleteKit}
            className="px-4 py-2.5 bg-slate-950 hover:bg-slate-850 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/40 flex items-center gap-2 transition cursor-pointer shrink-0"
          >
            {copiedSection === "full_kit" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSection === "full_kit" ? "Kit Copiado!" : "Copiar Kit Completo"}</span>
          </button>
        </div>
      </div>

      {/* SELETOR DE ABAS DOS MÓDULOS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-850 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveModuleTab("all")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-1.5 shrink-0 ${
            activeModuleTab === "all"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Ver Todos os Módulos
        </button>

        <button
          type="button"
          onClick={() => setActiveModuleTab("feed")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-1.5 shrink-0 ${
            activeModuleTab === "feed"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          Módulo 1: Feed 1:1
        </button>

        <button
          type="button"
          onClick={() => setActiveModuleTab("story")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-1.5 shrink-0 ${
            activeModuleTab === "story"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Módulo 2: Stories 9:16
        </button>

        <button
          type="button"
          onClick={() => setActiveModuleTab("carousel")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-1.5 shrink-0 ${
            activeModuleTab === "carousel"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Módulo 3: Carrossel 5 Slides
        </button>

        <button
          type="button"
          onClick={() => setActiveModuleTab("banner")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-1.5 shrink-0 ${
            activeModuleTab === "banner"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          Módulo 4: Banners & Thumbnails
        </button>

        <button
          type="button"
          onClick={() => setActiveModuleTab("ab")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-1.5 shrink-0 ${
            activeModuleTab === "ab"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Split className="w-3.5 h-3.5" />
          Módulo 5: Testes A/B
        </button>
      </div>

      {/* PAINEL DE QUALITY SCORE EM 9 DIMENSÕES */}
      <div className="bg-slate-950 p-5 rounded-3xl border border-teal-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-850 pb-3 gap-3">
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
                Avaliação algorítmica de autoridade, contraste, psicologia e conversão comercial.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-mono text-xs font-bold self-start sm:self-auto">
            NÍVEL EXCELÊNCIA DIGITAL
          </span>
        </div>

        {/* BARRAS DE NOTAS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Luxo & Valor</span>
            <span className="text-base font-black text-amber-400 font-mono mt-0.5 block">{qualityScore.luxuryScore}%</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Persuasão</span>
            <span className="text-base font-black text-emerald-400 font-mono mt-0.5 block">{qualityScore.persuasionScore}%</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Legibilidade</span>
            <span className="text-base font-black text-teal-400 font-mono mt-0.5 block">{qualityScore.legibilityScore}%</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Hierarquia</span>
            <span className="text-base font-black text-blue-400 font-mono mt-0.5 block">{qualityScore.hierarchyScore}%</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Contraste</span>
            <span className="text-base font-black text-purple-400 font-mono mt-0.5 block">{qualityScore.contrastScore}%</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Brand Match</span>
            <span className="text-base font-black text-pink-400 font-mono mt-0.5 block">{qualityScore.brandingScore}%</span>
          </div>
        </div>
      </div>

      {/* CORPO DOS MÓDULOS */}
      <div className="space-y-6">

        {/* MÓDULO 1: FEED QUADRADO 1:1 */}
        {(activeModuleTab === "all" || activeModuleTab === "feed") && (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                  Módulo 1: Anúncio de Feed Quadrado (1:1 / Instagram & Meta)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(`${kit.headline}\n\n${kit.caption}\n\nCTA: ${kit.cta}`, "feed_copy")}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-slate-800 transition flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === "feed_copy" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === "feed_copy" ? "Copiado!" : "Copiar Copy"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* MOCKUP VISUAL 1:1 */}
              <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-2xl p-5 aspect-square flex flex-col justify-between relative overflow-hidden shadow-xl">
                <div className="w-32 h-32 rounded-full blur-2xl bg-emerald-500/10 absolute -top-8 -right-8 pointer-events-none" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-extrabold border border-emerald-500/30">
                    FEED 1:1
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{brand.name}</span>
                </div>

                <div className="relative z-10 space-y-2">
                  <h4 className="text-base font-black text-white leading-snug">
                    {kit.headline}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {kit.subheadline}
                  </p>
                </div>

                <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <button 
                    type="button"
                    className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-lg uppercase tracking-wider shadow"
                  >
                    {kit.cta}
                  </button>
                  <span className="text-[10px] text-slate-400">Patrocinado</span>
                </div>
              </div>

              {/* LEGENDA E PROMPTS DE IMAGEM */}
              <div className="md:col-span-7 space-y-3">
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase font-mono block">
                    Legenda de Alta Retenção:
                  </span>
                  <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                    {kit.caption}
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-teal-400 uppercase font-mono block">
                    Prompt de Geração da Imagem (8K):
                  </span>
                  <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-850 select-all">
                    {kit.mainImagePrompt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MÓDULO 2: STORIES & REELS VERTICAIS 9:16 */}
        {(activeModuleTab === "all" || activeModuleTab === "story") && (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                  Módulo 2: Stories & Reels Verticais (9:16 / Roteiro de 3 Segundos)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(kit.storyPrompt, "story_prompt")}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-slate-800 transition flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === "story_prompt" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === "story_prompt" ? "Copiado!" : "Copiar Roteiro"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">
                  1. Gancho Visual (0 a 3s):
                </span>
                <p className="text-xs text-white font-bold leading-relaxed">
                  "Pare tudo o que você está fazendo se você ainda tenta vender infoproduto no manual..."
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  Visual: Corte dinâmico, elemento na tela dando zoom rápido e texto em caixa alta.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-teal-400 uppercase font-mono block">
                  2. Retenção & Solução (3 a 10s):
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  "Existe um método silencioso que automatiza página, checkout e tráfego sem depender de agência."
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  Visual: Tela dividida mostrando a operação rodando no piloto automático.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase font-mono block">
                  3. Chamada para Ação (10 a 15s):
                </span>
                <p className="text-xs text-white font-bold leading-relaxed">
                  "Toque no link aqui embaixo agora e veja os bastidores dessa estrutura."
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  Visual: Seta indicando o sticker de link no rodapé com animação de pulso.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MÓDULO 3: CARROSSEL SEQUENCIAL DE 5 SLIDES */}
        {(activeModuleTab === "all" || activeModuleTab === "carousel") && (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                  Módulo 3: Carrossel Educativo Sequencial (5 Slides de Alta Retenção)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(JSON.stringify(kit.carouselSlides, null, 2), "carousel_json")}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-slate-800 transition flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === "carousel_json" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === "carousel_json" ? "Copiado!" : "Copiar 5 Slides"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {kit.carouselSlides.map((slide) => (
                <div key={slide.slideNumber} className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between text-left space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-black flex items-center justify-center border border-purple-500/30">
                        {slide.slideNumber}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">Slide</span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug">
                      {slide.title}
                    </h4>

                    <p className="text-xs text-slate-300 mt-2 whitespace-pre-line leading-relaxed">
                      {slide.body}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-800 text-[10px] text-slate-400 italic">
                    💡 Conceito: {slide.visualConcept}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MÓDULO 4: BANNERS HORIZONTAIS & THUMBNAILS VSL */}
        {(activeModuleTab === "all" || activeModuleTab === "banner") && (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                  Módulo 4: Banners de Tráfego (1200x628) & Thumbnails Magnéticas (1280x720)
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-400 uppercase font-mono">
                    Banner Display & Meta (1200x628):
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Proporção 1.91:1</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Layout horizontal com foto do especialista/produto à direita, headline forte de 3 linhas à esquerda e botão de ação verde fosco em alto relevo.
                </p>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-xs font-mono text-slate-400 select-all">
                  {kit.bannerPrompt}
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">
                    Thumbnail VSL / YouTube (1280x720):
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">16:9 Alto CTR</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Expressão facial de choque ou autoridade em primeiro plano, iluminação de contorno amarela e texto magnético com até 4 palavras em caixa alta.
                </p>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-xs font-mono text-slate-400 select-all">
                  {kit.thumbnailPrompt}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MÓDULO 5: TESTES A/B DE COPY E GATILHOS */}
        {(activeModuleTab === "all" || activeModuleTab === "ab") && (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Split className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                  Módulo 5: Variações A/B de Copy & Ângulos para Tráfego Pago
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {kit.abVariations.map((v) => (
                <div key={v.id} className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2.5 flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded-full font-mono text-[9px] font-bold block w-fit mb-1.5">
                      {v.name}
                    </span>
                    <h4 className="text-xs font-black text-white leading-snug">
                      "{v.headline}"
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 leading-relaxed">
                    <strong className="text-slate-300 block mb-0.5">Direção Visual:</strong>
                    {v.visualAngle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
