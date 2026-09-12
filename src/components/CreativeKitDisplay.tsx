import React, { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  ImageIcon, 
  Type, 
  FileText, 
  Hash, 
  MousePointer, 
  RefreshCw, 
  Share2, 
  CheckCircle2, 
  Layers, 
  ShieldCheck,
  Edit3
} from "lucide-react";
import JSZip from "jszip";
import { AdCopyOption, AdImageResponse } from "../../server/adService";

interface CreativeKitDisplayProps {
  productName: string;
  niche: string;
  targetAudience?: string;
  activeImage: AdImageResponse | null;
  activeCopy: AdCopyOption | null;
  loadingImage?: boolean;
  onGenerateImage?: (style: "commercial" | "premium" | "customCover") => void;
  onUpdateCopyPart?: (part: keyof AdCopyOption, value: string) => void;
}

export default function CreativeKitDisplay({
  productName,
  niche,
  targetAudience,
  activeImage,
  activeCopy,
  loadingImage = false,
  onGenerateImage,
  onUpdateCopyPart
}: CreativeKitDisplayProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [activeFormat, setActiveFormat] = useState<"1:1" | "4:5" | "9:16">("1:1");

  // Fallbacks if activeCopy is missing or partially loaded
  const headline = activeCopy?.headline || activeCopy?.attention || `REVELADO: O Método Passo a Passo para Dominar ${niche || "seu nicho"}!`;
  const subheadline = activeCopy?.subheadline || activeCopy?.interest || `Aprenda de forma simples, prática e direta sem desperdiçar tempo e dinheiro.`;
  const legenda = activeCopy?.legenda || activeCopy?.primaryText || `🚨 ${headline}\n\n${subheadline}\n\n👉 Com o guia "${productName}", você terá em mãos as melhores estratégias de alta conversão.\n\n👇 Clique no botão abaixo e garanta seu acesso com desconto de lançamento!`;
  const cta = activeCopy?.cta || activeCopy?.action || `👉 Clique em 'Saiba Mais' e Garanta Seu Acesso Promocional!`;
  const hashtags = activeCopy?.hashtags || `#${(niche || "Nicho").replace(/\s+/g, "")} #${(productName || "Ebook").replace(/\s+/g, "")} #MarketingDigital #TráfegoPago #Transformacao #Ebook #VendasOnline`;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const downloadTextCard = (filename: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${filename}_${productName.toLowerCase().replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyFullKitToClipboard = () => {
    const fullText = `===================================================
🎁 KIT CRIATIVO COMPLETO - ${productName.toUpperCase()}
===================================================

1. HEADLINE (TÍTULO):
${headline}

2. SUBHEADLINE (SUBTÍTULO):
${subheadline}

3. LEGENDA DA PUBLICAÇÃO:
${legenda}

4. CHAMADA PARA AÇÃO (CTA):
${cta}

5. HASHTAGS ESTRATÉGICAS:
${hashtags}
===================================================`;
    navigator.clipboard.writeText(fullText);
    setCopiedField("fullKit");
    setTimeout(() => setCopiedField(null), 2500);
  };

  const downloadFullKitZip = async () => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();
      const slug = productName.toLowerCase().replace(/\s+/g, "_");

      // Text files for each card
      zip.file(`01_headline.txt`, `HEADLINE / TÍTULO PRINCIPAL:\n\n${headline}`);
      zip.file(`02_subheadline.txt`, `SUBHEADLINE / SUBTÍTULO:\n\n${subheadline}`);
      zip.file(`03_legenda.txt`, `LEGENDA COMPLETA DO ANÚNCIO:\n\n${legenda}`);
      zip.file(`04_cta.txt`, `CHAMADA PARA AÇÃO (CTA):\n\n${cta}`);
      zip.file(`05_hashtags.txt`, `HASHTAGS ESTRATÉGICAS:\n\n${hashtags}`);

      // Complete kit summary
      zip.file(`00_KIT_CRIATIVO_COMPLETO.txt`, `===================================================
KIT CRIATIVO COMPLETO - FABRICA DE INFO-PRODUTOS
===================================================
Produto: ${productName}
Nicho: ${niche}

--- 1. HEADLINE ---
${headline}

--- 2. SUBHEADLINE ---
${subheadline}

--- 3. LEGENDA ---
${legenda}

--- 4. CTA ---
${cta}

--- 5. HASHTAGS ---
${hashtags}
`);

      // If active image exists, try adding image blob
      if (activeImage?.imageUrl) {
        try {
          const res = await fetch(activeImage.imageUrl);
          const blob = await res.blob();
          zip.file(`06_imagem_criativo_${slug}.png`, blob);
        } catch (e) {
          console.warn("Nao foi possivel embutir a imagem diretamente no ZIP due to CORS, mantendo textos.");
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `KIT_CRIATIVO_${slug.toUpperCase()}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao gerar ZIP do Kit Criativo:", err);
      alert("Ocorreu um erro ao compactar o Kit. Tente novamente.");
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn" id="creative-kit-full-container">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                KIT CRIATIVO COMPLETO IA
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-extrabold border border-emerald-500/30">
                6 RECURSOS GERADOS
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Imagem, Headline, Subheadline, Legenda, CTA e Hashtags organizados em cartões individuais prontos para copiar e utilizar nas suas campanhas de tráfego pago.
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={copyFullKitToClipboard}
            className="flex-1 md:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {copiedField === "fullKit" ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Kit Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Kit Completo</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={downloadFullKitZip}
            disabled={downloadingZip}
            className="flex-1 md:flex-none px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
          >
            {downloadingZip ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Baixar Kit (.ZIP)</span>
          </button>
        </div>
      </div>

      {/* GRID OF 6 INDIVIDUAL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* CARD 1: ARTE VISUAL (IMAGEM) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden group shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                <ImageIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-white uppercase tracking-wider">
                1. Imagem do Criativo
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold border border-emerald-500/20">
              HD Arte 8K
            </span>
          </div>

          {/* Image Display Area */}
          <div className="w-full h-56 bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden relative flex items-center justify-center">
            {loadingImage ? (
              <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                <div className="w-8 h-8 border-3 border-slate-800 border-t-emerald-500 rounded-full animate-spin" />
                <span className="text-xs font-bold text-slate-400">Gerando Imagem IA...</span>
              </div>
            ) : activeImage?.imageUrl ? (
              <img
                src={activeImage.imageUrl}
                alt="Criativo Visual"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4 gap-2 text-slate-500">
                <ImageIcon className="w-8 h-8 opacity-40" />
                <span className="text-xs font-medium">Nenhuma imagem gerada ainda</span>
              </div>
            )}
          </div>

          {/* Card Actions */}
          <div className="flex items-center gap-2 pt-1">
            {activeImage?.imageUrl && (
              <a
                href={activeImage.imageUrl}
                download={`criativo_${productName.toLowerCase().replace(/\s+/g, "_")}.png`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-slate-700"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Baixar Imagem</span>
              </a>
            )}
            {onGenerateImage && (
              <button
                type="button"
                disabled={loadingImage}
                onClick={() => onGenerateImage("commercial")}
                className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-emerald-500/40 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingImage ? "animate-spin" : ""}`} />
                <span>Regerar Arte</span>
              </button>
            )}
          </div>
        </div>

        {/* CARD 2: HEADLINE (TÍTULO PRINCIPAL) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden group shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                <Type className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-white uppercase tracking-wider">
                2. Headline Principal
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[9px] font-bold border border-amber-500/20">
              Gancho Parar Scroll
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex-1 flex flex-col justify-between gap-2">
            {onUpdateCopyPart ? (
              <textarea
                value={headline}
                onChange={(e) => onUpdateCopyPart("headline", e.target.value)}
                rows={3}
                className="w-full bg-transparent text-sm font-black text-amber-300 leading-snug focus:outline-none resize-none"
              />
            ) : (
              <p className="text-sm font-black text-amber-300 leading-snug">{headline}</p>
            )}
            <span className="text-[10px] font-mono text-slate-500 self-end">
              {headline.length} caracteres
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard(headline, "headline")}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-amber-500/30 cursor-pointer"
            >
              {copiedField === "headline" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Headline</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => downloadTextCard("01_headline", headline)}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center transition border border-slate-800 cursor-pointer"
              title="Baixar em formato .txt"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 3: SUBHEADLINE (SUBTÍTULO) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden group shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-white uppercase tracking-wider">
                3. Subheadline
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 font-mono text-[9px] font-bold border border-sky-500/20">
              Apoio Persuasivo
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex-1 flex flex-col justify-between gap-2">
            {onUpdateCopyPart ? (
              <textarea
                value={subheadline}
                onChange={(e) => onUpdateCopyPart("subheadline", e.target.value)}
                rows={3}
                className="w-full bg-transparent text-xs font-bold text-sky-200 leading-relaxed focus:outline-none resize-none"
              />
            ) : (
              <p className="text-xs font-bold text-sky-200 leading-relaxed">{subheadline}</p>
            )}
            <span className="text-[10px] font-mono text-slate-500 self-end">
              {subheadline.length} caracteres
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard(subheadline, "subheadline")}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-sky-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-sky-500/30 cursor-pointer"
            >
              {copiedField === "subheadline" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Subheadline</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => downloadTextCard("02_subheadline", subheadline)}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center transition border border-slate-800 cursor-pointer"
              title="Baixar em formato .txt"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 4: LEGENDA (COPY DO ANÚNCIO) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden group shadow-xl hover:border-slate-700 transition-all md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-white uppercase tracking-wider">
                4. Legenda do Anúncio
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold border border-emerald-500/20">
              AIDA Completo
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex-1 flex flex-col justify-between gap-2 min-h-[140px]">
            {onUpdateCopyPart ? (
              <textarea
                value={legenda}
                onChange={(e) => onUpdateCopyPart("legenda", e.target.value)}
                rows={5}
                className="w-full bg-transparent text-xs text-slate-200 font-sans leading-relaxed focus:outline-none resize-none"
              />
            ) : (
              <p className="text-xs text-slate-200 font-sans whitespace-pre-line leading-relaxed">{legenda}</p>
            )}
            <span className="text-[10px] font-mono text-slate-500 self-end">
              {legenda.length} caracteres
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard(legenda, "legenda")}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-emerald-500/30 cursor-pointer"
            >
              {copiedField === "legenda" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Legenda</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => downloadTextCard("03_legenda", legenda)}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center transition border border-slate-800 cursor-pointer"
              title="Baixar em formato .txt"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 5: CALL TO ACTION (CTA) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden group shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                <MousePointer className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-white uppercase tracking-wider">
                5. Call to Action (CTA)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-mono text-[9px] font-bold border border-rose-500/20">
              Gatilho de Ação
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex-1 flex flex-col justify-between gap-2">
            {onUpdateCopyPart ? (
              <textarea
                value={cta}
                onChange={(e) => onUpdateCopyPart("cta", e.target.value)}
                rows={3}
                className="w-full bg-transparent text-xs font-extrabold text-rose-300 leading-snug focus:outline-none resize-none"
              />
            ) : (
              <p className="text-xs font-extrabold text-rose-300 leading-snug">{cta}</p>
            )}
            <span className="text-[10px] font-mono text-slate-500 self-end">
              {cta.length} caracteres
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard(cta, "cta")}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-rose-500/30 cursor-pointer"
            >
              {copiedField === "cta" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar CTA</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => downloadTextCard("04_cta", cta)}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center transition border border-slate-800 cursor-pointer"
              title="Baixar em formato .txt"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 6: HASHTAGS ESTRATÉGICAS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden group shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                <Hash className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-white uppercase tracking-wider">
                6. Hashtags Estratégicas
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-mono text-[9px] font-bold border border-teal-500/20">
              Nicho & Alcance
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex-1 flex flex-col justify-between gap-2">
            {onUpdateCopyPart ? (
              <textarea
                value={hashtags}
                onChange={(e) => onUpdateCopyPart("hashtags", e.target.value)}
                rows={3}
                className="w-full bg-transparent text-xs font-mono font-bold text-teal-300 leading-relaxed focus:outline-none resize-none"
              />
            ) : (
              <p className="text-xs font-mono font-bold text-teal-300 leading-relaxed">{hashtags}</p>
            )}
            <span className="text-[10px] font-mono text-slate-500 self-end">
              {(hashtags.match(/#/g) || []).length} Hashtags
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard(hashtags, "hashtags")}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-teal-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-teal-500/30 cursor-pointer"
            >
              {copiedField === "hashtags" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiadas!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Hashtags</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => downloadTextCard("05_hashtags", hashtags)}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center transition border border-slate-800 cursor-pointer"
              title="Baixar em formato .txt"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
