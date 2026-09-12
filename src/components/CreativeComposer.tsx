import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  AlertTriangle, 
  Palette, 
  Image as ImageIcon, 
  Eye, 
  Smartphone, 
  Download, 
  Layout, 
  Type, 
  AlignCenter, 
  AlignLeft, 
  AlignRight, 
  Compass, 
  TrendingUp, 
  Coins, 
  BookOpen, 
  RefreshCw,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Copy,
  X
} from "lucide-react";
import { AdCopyOption, AdImageResponse } from "../../server/adService";
import { motion, AnimatePresence } from "motion/react";
import AdKitDownloader from "./AdKitDownloader";
import CreativeKitDisplay from "./CreativeKitDisplay";
import VisualStyleLibrary, { VisualDnaStyle } from "./infinity/VisualStyleLibrary";

interface Props {
  productName: string;
  niche: string;
  targetAudience: string;
  description: string;
  
  // Selected Copy from Step 3
  activeCopy: AdCopyOption | null;

  // Images state and modifiers
  images: {
    commercial: AdImageResponse | null;
    premium: AdImageResponse | null;
    customCover: AdImageResponse | null;
  };
  selectedImageType: "commercial" | "premium" | "customCover";
  loadingImage: boolean;
  onGenerateImage: (style: "commercial" | "premium" | "customCover") => void;
  onGenerateAllImages?: () => void;
  onSelectImageType: (style: "commercial" | "premium" | "customCover") => void;

  // Diagramming styles
  fontFamily: "Inter" | "Space Grotesk" | "Playfair Display" | "JetBrains Mono";
  textColor: string;
  overlayStyle: "none" | "dark" | "gradient" | "light" | "colored";
  overlayOpacity: number;
  textAlignment: "left" | "center" | "right";
  textPlacement: "top" | "center" | "bottom";
  showLogoBadge: boolean;
  textFontSize: number;
  onUpdateStyle: (styleData: any) => void;
  onUpdateCopyPart?: (part: keyof AdCopyOption, value: string) => void;

  onFinishCampaign: () => void;
}

export default function CreativeComposer({
  productName,
  niche,
  targetAudience,
  description,
  activeCopy,
  images,
  selectedImageType,
  loadingImage,
  onGenerateImage,
  onGenerateAllImages,
  onSelectImageType,
  fontFamily,
  textColor,
  overlayStyle,
  overlayOpacity,
  textAlignment,
  textPlacement,
  showLogoBadge,
  textFontSize,
  onUpdateStyle,
  onUpdateCopyPart,
  onFinishCampaign
}: Props) {
  const [previewFormat, setPreviewFormat] = useState<"feed" | "stories" | "carousel">("feed");
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [showFullSetView, setShowFullSetView] = useState(false);
  const [showDnaModal, setShowDnaModal] = useState(false);
  const [activeDnaName, setActiveDnaName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("fabrica_selected_visual_dna");
      if (saved) return JSON.parse(saved)?.name || "";
    } catch (e) {}
    return "";
  });
  const [copiedFullCopy, setCopiedFullCopy] = useState(false);
  const [mobileTab, setMobileTab] = useState<"controls" | "preview">("controls");

  const handleApplyDnaStyle = (style: VisualDnaStyle) => {
    setActiveDnaName(style.name);
    let matchedFont: "Inter" | "Space Grotesk" | "Playfair Display" | "JetBrains Mono" = "Inter";
    if (style.typography.headingFont === "Playfair Display" || style.typography.headingFont === "Cinzel") {
      matchedFont = "Playfair Display";
    } else if (style.typography.headingFont === "Space Grotesk") {
      matchedFont = "Space Grotesk";
    } else if (style.typography.headingFont === "JetBrains Mono") {
      matchedFont = "JetBrains Mono";
    }

    onUpdateStyle({
      fontFamily: matchedFont,
      textColor: style.colors.text,
      overlayStyle: "gradient",
      overlayOpacity: 0.6
    });
    setShowDnaModal(false);
  };
  
  // Initialize with real clean headline or fallback
  const initialHeadline = activeCopy?.headline || activeCopy?.attention || (productName ? `${productName.toUpperCase()}!` : "CONQUISTE SUA TRANSFORMAÇÃO!");
  const [overlayText, setOverlayText] = useState(initialHeadline);
  const [activeTab, setActiveTab] = useState<"visual" | "styles" | "downloads" | "guide">("visual");

  const activeImage = images[selectedImageType];

  // Auto trigger image generation on first mount of the visual view
  React.useEffect(() => {
    if (!activeImage && !loadingImage) {
      onGenerateImage(selectedImageType);
    }
  }, [selectedImageType]);

  // Sync copy change to overlay text if it changes
  React.useEffect(() => {
    if (activeCopy) {
      const cleanHeadline = activeCopy.headline || activeCopy.attention;
      if (cleanHeadline) {
        setOverlayText(cleanHeadline);
      }
    }
  }, [activeCopy?.headline, activeCopy?.attention]);

  // Diagramming Warnings Audit
  const checkDiagrammingQuality = () => {
    const warnings = [];
    if (overlayText.length > 80) {
      warnings.push("O texto sobreposto na imagem está muito longo (mais de 80 caracteres). Banners com muito texto cansam o leitor e reduzem o engajamento.");
    }
    if (overlayStyle === "none" && (textColor === "#FFFFFF" || textColor === "#FBBF24")) {
      warnings.push("Contraste baixo detectado. Sem overlay na imagem de fundo, textos brancos ou amarelos podem ficar ilegíveis. Ative o overlay 'Degradê'.");
    }
    if (textFontSize > 26) {
      warnings.push("Tamanho de fonte muito grande. O texto pode quebrar de forma estranha no feed do celular.");
    }
    return warnings;
  };

  const composerWarnings = checkDiagrammingQuality();

  // Canvas Exporter Engine
  const handleDownloadCreative = async (format: "feed" | "stories" | "carousel") => {
    let width = 1080;
    let height = 1080;
    if (format === "stories") {
      width = 1080;
      height = 1920;
    }
    
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";
    img.src = activeImage?.imageUrl || "";

    img.onload = () => {
      // Scale cover
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;
      ctx.drawImage(img, 0, 0, img.width, img.height,
                    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);

      // Overlays
      if (overlayStyle === "dark") {
        ctx.fillStyle = `rgba(15, 23, 42, ${overlayOpacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (overlayStyle === "colored") {
        ctx.fillStyle = `rgba(6, 78, 59, ${overlayOpacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (overlayStyle === "gradient") {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "rgba(15, 23, 42, 0.1)");
        gradient.addColorStop(0.5, `rgba(15, 23, 42, ${overlayOpacity / 2})`);
        gradient.addColorStop(1, `rgba(15, 23, 42, ${overlayOpacity})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (overlayStyle === "light") {
        ctx.fillStyle = `rgba(255, 255, 255, ${overlayOpacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Border frame
      ctx.strokeStyle = textColor;
      ctx.lineWidth = width * 0.015;
      ctx.strokeRect(width * 0.04, width * 0.04, canvas.width - width * 0.08, canvas.height - width * 0.08);

      // Typography
      let fontName = "sans-serif";
      if (fontFamily === "Space Grotesk") fontName = "'Space Grotesk', sans-serif";
      else if (fontFamily === "Playfair Display") fontName = "'Playfair Display', serif";
      else if (fontFamily === "JetBrains Mono") fontName = "'JetBrains Mono', monospace";
      else if (fontFamily === "Inter") fontName = "'Inter', sans-serif";

      const scaleFactor = canvas.width / 400;
      const fontSize = textFontSize * scaleFactor;
      ctx.font = `bold ${fontSize}px ${fontName}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = textAlignment;

      // Word wrapping
      const words = overlayText.split(" ");
      const lines = [];
      let currentLine = words[0];
      const maxWidth = canvas.width - (width * 0.2);

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testWidth = ctx.measureText(currentLine + " " + word).width;
        if (testWidth < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);

      // Placement
      const lineHeight = fontSize * 1.3;
      const totalHeight = lines.length * lineHeight;
      let startY = canvas.height / 2;

      if (textPlacement === "top") {
        startY = width * 0.15 + lineHeight;
      } else if (textPlacement === "bottom") {
        startY = canvas.height - (width * 0.15) - totalHeight + lineHeight;
      } else {
        startY = (canvas.height - totalHeight) / 2 + lineHeight;
      }

      let startX = canvas.width / 2;
      if (textAlignment === "left") startX = width * 0.12;
      else if (textAlignment === "right") startX = canvas.width - (width * 0.12);

      lines.forEach((line) => {
        ctx.fillText(line, startX, startY);
        startY += lineHeight;
      });

      // Download
      const link = document.createElement("a");
      link.download = `criativo_${format}_${productName.toLowerCase().replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.onerror = () => {
      // Mock / CORS fallback download
      const link = document.createElement("a");
      link.download = `criativo_${format}_${productName.toLowerCase().replace(/\s+/g, "_")}.png`;
      link.href = activeImage?.imageUrl || "";
      link.click();
    };
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in pb-20 lg:pb-8">
      
      {/* Top Header Controls Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-black text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Estúdio de Criativos & Anúncios de Alta Conversão
            </h3>
            {activeDnaName && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                DNA: {activeDnaName}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Crie, teste e exporte artes e copies em formato Feed (1:1) e Stories (9:16) sem perder a capa do seu ebook.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <button
            type="button"
            onClick={() => setShowDnaModal(true)}
            className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>🎨 DNA Visual</span>
          </button>

          <button
            type="button"
            onClick={() => setShowFullSetView(!showFullSetView)}
            className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md ${
              showFullSetView
                ? "bg-emerald-500 text-slate-950 font-black shadow-emerald-500/20"
                : "bg-slate-800 hover:bg-slate-750 text-white border border-slate-700"
            }`}
          >
            {showFullSetView ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Fechar Visão do Conjunto</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>👁️ Visão de Todo o Conjunto (Tela Cheia)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* PANORAMIC SET SHOWCASE: FULL VIEW OF COVER, FEED, STORIES & COPY */}
      {showFullSetView && (
        <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-0.5">
                Visão de Conjunto Integrada • Modo Tela Cheia
              </span>
              <h4 className="text-base font-black text-white flex items-center gap-2">
                Kit Completo da Sua Campanha: Capa + Feed + Stories + Copy AIDA
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Todos os elementos alinhados harmonicamente com a sua identidade visual e a capa do seu e-book preservada.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFullSetView(false)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-end sm:self-auto"
            >
              <X className="w-4 h-4" />
              <span>Voltar ao Editor</span>
            </button>
          </div>

          {/* 3-COLUMN PANORAMIC GRID: COVER + FEED 1:1 + STORIES 9:16 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* 1. Capa do E-book */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-between text-center gap-3">
              <div className="w-full flex items-center justify-between text-left border-b border-slate-850 pb-2">
                <div>
                  <span className="text-[9px] font-black uppercase text-emerald-400">Ativo 1</span>
                  <h5 className="text-xs font-black text-white">Capa do E-book</h5>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
                  Preservada
                </span>
              </div>

              <div className="relative w-full max-w-[200px] aspect-[3/4] bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-800 my-auto flex items-center justify-center">
                {images.customCover?.imageUrl ? (
                  <img
                    src={images.customCover.imageUrl}
                    alt="Capa do Ebook"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : activeImage?.imageUrl ? (
                  <img
                    src={activeImage.imageUrl}
                    alt="Capa do Ebook"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-4 text-slate-500 text-xs font-bold">
                    Capa Pronta no Passo 1
                  </div>
                )}
              </div>

              <p className="text-[10px] text-slate-400 italic">
                Vinculada à biblioteca e protegida contra substituições indesejadas.
              </p>
            </div>

            {/* 2. Criativo Feed Quadrado (1:1) */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-between text-center gap-3">
              <div className="w-full flex items-center justify-between text-left border-b border-slate-850 pb-2">
                <div>
                  <span className="text-[9px] font-black uppercase text-cyan-400">Ativo 2</span>
                  <h5 className="text-xs font-black text-white">Feed Quadrado (1:1)</h5>
                </div>
                <span className="text-[10px] font-mono text-slate-400">1080 × 1080</span>
              </div>

              <div className="relative w-full max-w-[220px] aspect-square bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-800 my-auto">
                {activeImage?.imageUrl ? (
                  <>
                    <img
                      src={activeImage.imageUrl}
                      alt="Feed Criativo"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {overlayStyle === "dark" && <div className="absolute inset-0 bg-slate-950" style={{ opacity: overlayOpacity }} />}
                    {overlayStyle === "colored" && <div className="absolute inset-0 bg-emerald-950" style={{ opacity: overlayOpacity }} />}
                    {overlayStyle === "gradient" && <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" style={{ opacity: overlayOpacity }} />}
                    <div className="absolute inset-2 border pointer-events-none" style={{ borderColor: textColor }} />
                    <div className="absolute inset-4 flex items-center justify-center text-center">
                      <p className="font-bold leading-tight" style={{
                        fontFamily: fontFamily === "Space Grotesk" ? "'Space Grotesk', sans-serif" :
                                    fontFamily === "Playfair Display" ? "'Playfair Display', serif" :
                                    fontFamily === "JetBrains Mono" ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
                        color: textColor,
                        fontSize: "13px"
                      }}>
                        {overlayText}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold p-4">
                    Gere uma arte para visualizar
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleDownloadCreative("feed")}
                className="w-full py-2 bg-slate-850 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-750"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Baixar Feed (1:1)</span>
              </button>
            </div>

            {/* 3. Criativo Stories Vertical (9:16) */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-between text-center gap-3">
              <div className="w-full flex items-center justify-between text-left border-b border-slate-850 pb-2">
                <div>
                  <span className="text-[9px] font-black uppercase text-purple-400">Ativo 3</span>
                  <h5 className="text-xs font-black text-white">Stories Vertical (9:16)</h5>
                </div>
                <span className="text-[10px] font-mono text-slate-400">1080 × 1920</span>
              </div>

              <div className="relative w-full max-w-[150px] aspect-[9/16] bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-800 my-auto">
                {activeImage?.imageUrl ? (
                  <>
                    <img
                      src={activeImage.imageUrl}
                      alt="Stories Criativo"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {overlayStyle === "dark" && <div className="absolute inset-0 bg-slate-950" style={{ opacity: overlayOpacity }} />}
                    {overlayStyle === "colored" && <div className="absolute inset-0 bg-emerald-950" style={{ opacity: overlayOpacity }} />}
                    {overlayStyle === "gradient" && <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" style={{ opacity: overlayOpacity }} />}
                    <div className="absolute inset-2 border pointer-events-none" style={{ borderColor: textColor }} />
                    <div className="absolute inset-4 flex items-center justify-center text-center">
                      <p className="font-bold leading-tight" style={{
                        fontFamily: fontFamily === "Space Grotesk" ? "'Space Grotesk', sans-serif" :
                                    fontFamily === "Playfair Display" ? "'Playfair Display', serif" :
                                    fontFamily === "JetBrains Mono" ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
                        color: textColor,
                        fontSize: "12px"
                      }}>
                        {overlayText}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold p-4">
                    Gere uma arte para visualizar
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleDownloadCreative("stories")}
                className="w-full py-2 bg-slate-850 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-750"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Baixar Stories (9:16)</span>
              </button>
            </div>

          </div>

          {/* 4. LEGENDA PERSUASIVA AIDA UNIFICADA */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4.5 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-850 pb-2">
              <div>
                <span className="text-[9px] font-black uppercase text-amber-400">Texto Principal do Anúncio</span>
                <h5 className="text-xs font-black text-white">Copy de Conversão AIDA</h5>
              </div>
              <button
                type="button"
                onClick={() => {
                  const fullCopyText = `${activeCopy?.headline || ""}\n\n${activeCopy?.attention || ""}\n\n${activeCopy?.interest || ""}\n\n${activeCopy?.desire || ""}\n\n${activeCopy?.action || ""}`;
                  navigator.clipboard.writeText(fullCopyText);
                  setCopiedFullCopy(true);
                  setTimeout(() => setCopiedFullCopy(false), 2500);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedFullCopy ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copiado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Legenda Completa</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900/90 rounded-xl p-3 text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-line border border-slate-800">
              <strong className="text-white block font-bold mb-1">
                {activeCopy?.headline || overlayText}
              </strong>
              {activeCopy?.attention && <p className="mb-2">{activeCopy.attention}</p>}
              {activeCopy?.interest && <p className="mb-2">{activeCopy.interest}</p>}
              {activeCopy?.desire && <p className="mb-2">{activeCopy.desire}</p>}
              {activeCopy?.action && <p className="text-emerald-400 font-semibold">{activeCopy.action}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Visual Identity & Tabs Row */}
      <div className="bg-slate-950/40 border border-slate-850 p-1.5 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("visual")}
          className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
            activeTab === "visual" ? "bg-slate-800 border border-slate-700 text-emerald-400" : "text-slate-400 hover:text-white"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>1. Arte & Estilo</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("styles")}
          className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
            activeTab === "styles" ? "bg-slate-800 border border-slate-700 text-emerald-400" : "text-slate-400 hover:text-white"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>2. Diagramação</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("downloads")}
          className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
            activeTab === "downloads" ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black" : "text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Kit Criativo Completo</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("guide")}
          className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
            activeTab === "guide" ? "bg-slate-800 border border-slate-700 text-emerald-400" : "text-slate-400 hover:text-white"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>4. Roteiro de Tráfego</span>
        </button>
      </div>

      {activeTab === "downloads" ? (
        <div className="w-full flex flex-col gap-6 animate-fade-in">
          <CreativeKitDisplay
            productName={productName}
            niche={niche}
            targetAudience={targetAudience}
            activeImage={activeImage}
            activeCopy={activeCopy}
            loadingImage={loadingImage}
            onGenerateImage={onGenerateImage}
            onUpdateCopyPart={onUpdateCopyPart}
          />

          <AdKitDownloader
            productName={productName}
            activeImage={activeImage}
            overlayText={overlayText}
            overlayStyle={overlayStyle}
            overlayOpacity={overlayOpacity}
            textColor={textColor}
            fontFamily={fontFamily}
            textFontSize={textFontSize}
            textPlacement={textPlacement}
            textAlignment={textAlignment}
            activeCopy={activeCopy}
          />

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onFinishCampaign}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Concluir Campanha e Finalizar 🚀</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* MOBILE TOGGLE BAR */}
          <div className="lg:hidden flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-sm">
            <button
              type="button"
              onClick={() => setMobileTab("controls")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                mobileTab === "controls" ? "bg-slate-800 text-emerald-400 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Editar Controles & Estilo</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                mobileTab === "preview" ? "bg-emerald-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Ver Prévia Mockup</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Tool Configuration Panels (7 Cols) */}
            <div className={`lg:col-span-7 xl:col-span-7 flex flex-col gap-4 ${mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
            
            {activeTab === "visual" && (
            <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  Direção de Arte com IA
                </h4>
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">3 Estilos de Arte</span>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed">
                Escolha o conceito visual do criativo. A Inteligência Artificial do Imagen 3 criará uma arte de fundo abstrata, moderna e de alto padrão baseada nas características e tema do seu e-book.
              </p>

              {/* Quality & Resolution Selector Bar */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px] font-bold border border-purple-500/30 uppercase">
                    Model: gemini-3-pro-image-preview
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Resolução da Imagem:</span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
                  {(["1K", "2K", "4K"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setImageSize(size)}
                      className={`px-3 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                        imageSize === size
                          ? "bg-emerald-500 text-slate-950 shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {size} {size === "1K" ? "(Standard)" : size === "2K" ? "(HD)" : "(Ultra 4K)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botão de Geração de Capas com IA Baseado em Título + Nicho */}
              <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
                <div className="flex flex-col gap-1 text-left w-full sm:w-auto">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black text-white uppercase tracking-wider">Gerador de Capas Profissionais IA</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Envia o Título: <strong className="text-emerald-300">"{productName}"</strong> e o Nicho: <strong className="text-emerald-300">"{niche}"</strong> para a IA criar opções de capa em <strong className="text-emerald-400">{imageSize}</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    disabled={loadingImage}
                    onClick={() => {
                      if (onGenerateAllImages) {
                        (onGenerateAllImages as any)(imageSize);
                      } else {
                        (onGenerateImage as any)("customCover", imageSize);
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${loadingImage ? "animate-spin" : ""}`} />
                    <span>{loadingImage ? "Gerando Capas..." : `✨ Gerar 3 Capas (${imageSize})`}</span>
                  </button>
                </div>
              </div>

              {/* Grid com as 3 Opções de Capa Geradas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                {/* Opção 1: Capa Comercial / Alto Impacto */}
                <div
                  onClick={() => onSelectImageType("commercial")}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 relative transition-all cursor-pointer overflow-hidden ${
                    selectedImageType === "commercial"
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/40"
                      : "bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold uppercase text-emerald-400">Opção 1</span>
                    {selectedImageType === "commercial" && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[8px] font-extrabold uppercase">✓ Selecionada</span>
                    )}
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="w-full h-24 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden relative flex items-center justify-center group">
                    {images.commercial?.imageUrl ? (
                      <img src={images.commercial.imageUrl} alt="Capa Comercial" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-2 text-slate-500 gap-1">
                        <ImageIcon className="w-5 h-5 opacity-40" />
                        <span className="text-[9px]">Comercial Meta Ads</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-white block">⚡ Capa Comercial CTR</span>
                    <span className="text-[10px] text-slate-400 leading-snug block mt-0.5">Alto contraste para anúncios no Facebook & Instagram.</span>
                  </div>

                  <button
                    type="button"
                    disabled={loadingImage}
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateImage("commercial");
                    }}
                    className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-750 text-[10px] font-bold text-emerald-400 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingImage && selectedImageType === "commercial" ? "animate-spin" : ""}`} />
                    <span>{images.commercial ? "Regerar IA" : "Gerar Opção 1"}</span>
                  </button>
                </div>

                {/* Opção 2: Capa Premium / Editorial */}
                <div
                  onClick={() => onSelectImageType("premium")}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 relative transition-all cursor-pointer overflow-hidden ${
                    selectedImageType === "premium"
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/40"
                      : "bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold uppercase text-amber-400">Opção 2</span>
                    {selectedImageType === "premium" && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[8px] font-extrabold uppercase">✓ Selecionada</span>
                    )}
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="w-full h-24 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden relative flex items-center justify-center group">
                    {images.premium?.imageUrl ? (
                      <img src={images.premium.imageUrl} alt="Capa Premium" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-2 text-slate-500 gap-1">
                        <ImageIcon className="w-5 h-5 opacity-40" />
                        <span className="text-[9px]">Premium Estúdio</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-white block">💎 Capa Premium Luxury</span>
                    <span className="text-[10px] text-slate-400 leading-snug block mt-0.5">Estilo sofisticado de estúdio, tons luxuosos e sóbrios.</span>
                  </div>

                  <button
                    type="button"
                    disabled={loadingImage}
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateImage("premium");
                    }}
                    className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-750 text-[10px] font-bold text-emerald-400 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingImage && selectedImageType === "premium" ? "animate-spin" : ""}`} />
                    <span>{images.premium ? "Regerar IA" : "Gerar Opção 2"}</span>
                  </button>
                </div>

                {/* Opção 3: Capa Temática Personalizada (Título + Nicho) */}
                <div
                  onClick={() => onSelectImageType("customCover")}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 relative transition-all cursor-pointer overflow-hidden ${
                    selectedImageType === "customCover"
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/40"
                      : "bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold uppercase text-teal-400">Opção 3</span>
                    {selectedImageType === "customCover" && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[8px] font-extrabold uppercase">✓ Selecionada</span>
                    )}
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="w-full h-24 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden relative flex items-center justify-center group">
                    {images.customCover?.imageUrl ? (
                      <img src={images.customCover.imageUrl} alt="Capa Temática E-book" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-2 text-slate-500 gap-1">
                        <ImageIcon className="w-5 h-5 opacity-40" />
                        <span className="text-[9px]">Arte Temática Título+Nicho</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-white block">🎨 Capa Temática E-book</span>
                    <span className="text-[10px] text-slate-400 leading-snug block mt-0.5">Criada sob medida para "{productName}" e o nicho {niche}.</span>
                  </div>

                  <button
                    type="button"
                    disabled={loadingImage}
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateImage("customCover");
                    }}
                    className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-750 text-[10px] font-bold text-emerald-400 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingImage && selectedImageType === "customCover" ? "animate-spin" : ""}`} />
                    <span>{images.customCover ? "Regerar IA" : "Gerar Opção 3"}</span>
                  </button>
                </div>
              </div>

              {/* 3 Modelos de Capa Prontos Baseados em E-books */}
              <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-slate-850">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider">
                    📚 3 Modelos de Capa Prontos (Estilos de E-book)
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold">Aplicação em 1 Clique</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {/* Modelo 1 */}
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateStyle({
                        fontFamily: "Playfair Display",
                        textColor: "#F59E0B",
                        overlayStyle: "gradient",
                        overlayOpacity: 0.65,
                        textAlignment: "center",
                        textPlacement: "top"
                      });
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all relative overflow-hidden group cursor-pointer ${
                      fontFamily === "Playfair Display" && textColor === "#F59E0B"
                        ? "bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/40 text-amber-300"
                        : "bg-slate-950/50 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[9px] font-mono font-bold uppercase text-amber-400">Modelo 1</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        Editorial
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block leading-snug">🏆 Best-Seller Editorial</span>
                      <span className="text-[10px] text-slate-400 leading-tight block mt-1">
                        Estilo Amazon / Kobo. Tipografia nobre e degradê de autoridade.
                      </span>
                    </div>
                    <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600 rounded-full mt-1"></div>
                  </button>

                  {/* Modelo 2 */}
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateStyle({
                        fontFamily: "Space Grotesk",
                        textColor: "#FACC15",
                        overlayStyle: "dark",
                        overlayOpacity: 0.70,
                        textAlignment: "left",
                        textPlacement: "center"
                      });
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all relative overflow-hidden group cursor-pointer ${
                      fontFamily === "Space Grotesk" && textColor === "#FACC15"
                        ? "bg-emerald-500/10 border-emerald-500/60 ring-1 ring-emerald-500/40 text-yellow-300"
                        : "bg-slate-950/50 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[9px] font-mono font-bold uppercase text-yellow-400">Modelo 2</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-500/30">
                        High-Impact
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block leading-snug">⚡ Tech & Vendas Impacto</span>
                      <span className="text-[10px] text-slate-400 leading-tight block mt-1">
                        Para Meta Ads e tráfego pago. Destaque em amarelo neon com alto CTR.
                      </span>
                    </div>
                    <div className="w-full h-1 bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 rounded-full mt-1"></div>
                  </button>

                  {/* Modelo 3 */}
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateStyle({
                        fontFamily: "Inter",
                        textColor: "#FFFFFF",
                        overlayStyle: "light",
                        overlayOpacity: 0.50,
                        textAlignment: "center",
                        textPlacement: "bottom"
                      });
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all relative overflow-hidden group cursor-pointer ${
                      fontFamily === "Inter" && textColor === "#FFFFFF"
                        ? "bg-teal-500/10 border-teal-500/60 ring-1 ring-teal-500/40 text-teal-300"
                        : "bg-slate-950/50 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[9px] font-mono font-bold uppercase text-teal-400">Modelo 3</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                        Swiss Clean
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block leading-snug">💎 Minimalista Swiss Clean</span>
                      <span className="text-[10px] text-slate-400 leading-tight block mt-1">
                        Estilo sofisticado de estúdio, amplo espaço e alta legibilidade.
                      </span>
                    </div>
                    <div className="w-full h-1 bg-gradient-to-r from-teal-400 via-emerald-200 to-slate-200 rounded-full mt-1"></div>
                  </button>
                </div>
              </div>

              {activeImage && (
                <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-3.5 mt-2 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase font-mono leading-none">Status da Arte</span>
                    <span className="text-xs text-slate-350 mt-1 font-semibold leading-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      {activeImage.isFallback ? "Estilo Pronto em Alta Resolução" : "Arte Customizada Gerada com IA!"}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={loadingImage}
                    onClick={() => onGenerateImage(selectedImageType)}
                    className="text-[10px] font-bold text-emerald-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingImage ? "animate-spin" : ""}`} />
                    <span>Regerar Nova Capa / Arte</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "styles" && (
            <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Layout className="w-4 h-4 text-emerald-400" />
                  Visual & Diagramação
                </h4>
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">Ajustes Finos</span>
              </div>

              {/* Text overlay customisation */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Texto Principal da Imagem (Headline do Banner)
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {overlayText.length} caracteres
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={overlayText}
                  onChange={(e) => setOverlayText(e.target.value)}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold tracking-tight focus:outline-none focus:border-emerald-500 transition-all resize-none leading-relaxed"
                  placeholder="EX: REVELADO: O MÉTODO DEFINITIVO PARA VENDER TODOS OS DIAS"
                />

                {/* Quick Fill Shortcuts */}
                {activeCopy && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {activeCopy.headline && (
                      <button
                        type="button"
                        onClick={() => setOverlayText(activeCopy.headline)}
                        className="text-[9px] px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Aplicar Headline principal da IA"
                      >
                        <span>📌 Usar Headline</span>
                      </button>
                    )}
                    {activeCopy.attention && (
                      <button
                        type="button"
                        onClick={() => setOverlayText(activeCopy.attention)}
                        className="text-[9px] px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Aplicar Gancho de Atenção da IA"
                      >
                        <span>⚡ Usar Gancho</span>
                      </button>
                    )}
                    {activeCopy.subheadline && (
                      <button
                        type="button"
                        onClick={() => setOverlayText(activeCopy.subheadline)}
                        className="text-[9px] px-2 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Aplicar Subtítulo / Promessa"
                      >
                        <span>🎯 Usar Subtítulo</span>
                      </button>
                    )}
                    {productName && (
                      <button
                        type="button"
                        onClick={() => setOverlayText(productName.toUpperCase())}
                        className="text-[9px] px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Aplicar Nome do Ebook"
                      >
                        <span>📚 Usar Nome do Ebook</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Font Family selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Estilo de Fonte (Tipografia do Livro)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Space Grotesk", "Playfair Display", "JetBrains Mono", "Inter"] as const).map((font) => (
                    <button
                      key={font}
                      type="button"
                      onClick={() => onUpdateStyle({ fontFamily: font })}
                      className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
                        fontFamily === font
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                          : "bg-slate-950/20 border-slate-850 text-slate-400 hover:border-slate-800"
                      }`}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text color selector - Liberando todas as cores! */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Cor dos Títulos (Escolha Livre)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => onUpdateStyle({ textColor: e.target.value })}
                      className="w-6 h-6 rounded-md bg-transparent border border-slate-700 cursor-pointer overflow-hidden"
                      title="Seletor livre de cores"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => onUpdateStyle({ textColor: e.target.value })}
                      className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 text-center uppercase focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-2 pt-1">
                  {[
                    { hex: "#FFFFFF", name: "Branco Clássico" },
                    { hex: "#F59E0B", name: "Dourado VIP" },
                    { hex: "#FACC15", name: "Amarelo Neon" },
                    { hex: "#10B981", name: "Verde Esmeralda" },
                    { hex: "#22D3EE", name: "Cyan Ice" },
                    { hex: "#3B82F6", name: "Azul Elétrico" },
                    { hex: "#8B5CF6", name: "Roxo Violeta" },
                    { hex: "#EC4899", name: "Rosa Choque" },
                    { hex: "#EF4444", name: "Vermelho Rubro" },
                    { hex: "#F97316", name: "Laranja Vibrante" },
                    { hex: "#84CC16", name: "Verde Lima" },
                    { hex: "#E2E8F0", name: "Prata Metálico" }
                  ].map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      title={color.name}
                      onClick={() => onUpdateStyle({ textColor: color.hex })}
                      className={`h-7 rounded-lg border-2 transition-all hover:scale-110 flex items-center justify-center cursor-pointer ${
                        textColor.toLowerCase() === color.hex.toLowerCase() ? "border-emerald-400 ring-2 ring-emerald-500/40 scale-105" : "border-slate-800"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {textColor.toLowerCase() === color.hex.toLowerCase() && (
                        <span className="w-2 h-2 rounded-full bg-slate-950"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text alignment and placement */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alinhamento</label>
                  <div className="flex bg-slate-950/60 border border-slate-800 p-1 rounded-xl gap-1">
                    {[
                      { id: "left", icon: AlignLeft },
                      { id: "center", icon: AlignCenter },
                      { id: "right", icon: AlignRight }
                    ].map((align) => {
                      const AlignIcon = align.icon;
                      return (
                        <button
                          key={align.id}
                          type="button"
                          onClick={() => onUpdateStyle({ textAlignment: align.id })}
                          className={`flex-1 py-1.5 rounded-lg flex justify-center transition-all ${
                            textAlignment === align.id ? "bg-slate-800 text-emerald-400" : "text-slate-500 hover:text-white"
                          }`}
                        >
                          <AlignIcon className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Posicionamento</label>
                  <select
                    value={textPlacement}
                    onChange={(e) => onUpdateStyle({ textPlacement: e.target.value })}
                    className="bg-slate-950/60 border border-slate-800 p-2 text-xs text-white rounded-xl focus:outline-none focus:border-emerald-500 transition font-bold"
                  >
                    <option value="top">Superior (Topo)</option>
                    <option value="center">Centralizado</option>
                    <option value="bottom">Inferior (Rodapé)</option>
                  </select>
                </div>
              </div>

              {/* Slider for overlay opacity */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Overlay de Contraste Escuro</span>
                  <span className="font-mono text-emerald-400">{Math.round(overlayOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.85"
                  step="0.05"
                  value={overlayOpacity}
                  onChange={(e) => onUpdateStyle({ overlayOpacity: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          )}

          {activeTab === "guide" && (
            <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4 animate-fade-in max-h-[460px] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  Roteiro de Tráfego Pago (Didático)
                </h4>
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">R$ 6,00/Dia</span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs flex items-center justify-center shrink-0">1</div>
                  <div className="text-left">
                    <h5 className="text-xs font-bold text-white">Pixel de Rastreamento</h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Vá no gerenciador da Kiwify ou da sua plataforma, crie um Pixel do Facebook e cole o ID do pixel. Ele registrará toda visita e compra na sua página de vendas.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs flex items-center justify-center shrink-0">2</div>
                  <div className="text-left">
                    <h5 className="text-xs font-bold text-white">Criar Campanha de Conversão</h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">No Gerenciador de Anúncios do Meta, crie uma campanha com o objetivo de <strong className="text-slate-300">Vendas (Conversão)</strong>. Selecione como meta o evento de pixel de <strong className="text-slate-300">Purchase (Compra)</strong>.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs flex items-center justify-center shrink-0">3</div>
                  <div className="text-left">
                    <h5 className="text-xs font-bold text-white">Configurar Orçamento (Budget)</h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Defina o orçamento para R$ 6,00 por dia (equivalente a 1 dólar, o mínimo da plataforma). Isso é ideal para testar criativos sem gastar quase nada.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs flex items-center justify-center shrink-0">4</div>
                  <div className="text-left">
                    <h5 className="text-xs font-bold text-white">Carregar Criativo & Legenda</h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">No nível do Anúncio, faça o upload da imagem do Feed/Stories que você baixou no passo anterior. Cole a legenda AIDA unificada no campo 'Texto Principal'.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Smartphone Ad Mockup Preview (5 Cols) */}
        <div className={`lg:col-span-5 xl:col-span-5 flex flex-col gap-4 lg:sticky lg:top-4 ${mobileTab === 'controls' ? 'hidden lg:flex' : 'flex'}`}>
          
          {/* Mockup Frame selector */}
          <div className="flex bg-slate-950/40 p-1 rounded-xl border border-slate-850 gap-2">
            <button
              type="button"
              onClick={() => setPreviewFormat("feed")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                previewFormat === "feed" ? "bg-slate-800 text-emerald-400 shadow" : "text-slate-500 hover:text-white"
              }`}
            >
              Feed Quadrado (1:1)
            </button>
            <button
              type="button"
              onClick={() => setPreviewFormat("stories")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                previewFormat === "stories" ? "bg-slate-800 text-emerald-400 shadow" : "text-slate-500 hover:text-white"
              }`}
            >
              Stories Vertical (9:16)
            </button>
          </div>

          {/* Interactive Smartphone Rendering Mockup */}
          <div className="bg-slate-950 border border-slate-850 rounded-[32px] p-3.5 sm:p-4.5 shadow-2xl relative max-w-[320px] sm:max-w-[340px] mx-auto w-full">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-1.5 z-30">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-950"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
            </div>

            <div className="relative bg-slate-900 rounded-[24px] overflow-hidden border border-slate-800/60 flex flex-col justify-between" style={{
              aspectRatio: previewFormat === "stories" ? "9/16" : "1/1"
            }}>
              
              {/* Dynamic visual loader */}
              {loadingImage && (
                <div className="absolute inset-0 bg-slate-950/80 z-25 flex flex-col items-center justify-center text-center p-6 gap-3 animate-fade-in">
                  <div className="w-8 h-8 border-3 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
                  <span className="text-[10px] font-bold text-slate-300">Renderizando Diagramação...</span>
                </div>
              )}

              {/* No active image placeholder */}
              {!activeImage && !loadingImage && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-slate-900">
                  <ImageIcon className="w-8 h-8 text-slate-700 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 mt-2">Clique em 'Gerar Arte'</span>
                </div>
              )}

              {/* Canvas Preview Rendering */}
              {activeImage && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={activeImage.imageUrl}
                    referrerPolicy="no-referrer"
                    alt="AI Visual background"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlays */}
                  {overlayStyle === "dark" && (
                    <div className="absolute inset-0 bg-slate-950" style={{ opacity: overlayOpacity }}></div>
                  )}
                  {overlayStyle === "colored" && (
                    <div className="absolute inset-0 bg-emerald-950" style={{ opacity: overlayOpacity }}></div>
                  )}
                  {overlayStyle === "gradient" && (
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-slate-950/20" style={{ opacity: overlayOpacity }}></div>
                  )}
                  {overlayStyle === "light" && (
                    <div className="absolute inset-0 bg-white" style={{ opacity: overlayOpacity }}></div>
                  )}

                  {/* Decorative frame border */}
                  <div className="absolute inset-3 border-2 pointer-events-none" style={{ borderColor: textColor }}></div>

                  {/* Text Overlay Layer */}
                  <div className={`absolute inset-6 flex flex-col ${
                    textPlacement === "top" ? "justify-start" : textPlacement === "bottom" ? "justify-end" : "justify-center"
                  } ${
                    textAlignment === "left" ? "items-start text-left" : textAlignment === "right" ? "items-end text-right" : "items-center text-center"
                  }`}>
                    <p className={`font-bold tracking-tight select-none leading-tight`} style={{
                      fontFamily: fontFamily === "Space Grotesk" ? "'Space Grotesk', sans-serif" :
                                  fontFamily === "Playfair Display" ? "'Playfair Display', serif" :
                                  fontFamily === "JetBrains Mono" ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
                      color: textColor,
                      fontSize: `${textFontSize}px`
                    }}>
                      {overlayText}
                    </p>
                  </div>
                </div>
              )}

              {/* Top status bar overlay */}
              <div className="absolute top-2 left-0 right-0 p-3 flex justify-between items-center z-10 font-mono text-[9px] text-white/40 pointer-events-none">
                <span>Meta Ads Premium</span>
                <span>LTE 99%</span>
              </div>
            </div>
          </div>

          {/* Bottom actions row */}
          <div className="flex flex-col gap-3 mt-2">
            <button
              type="button"
              disabled={!activeImage}
              onClick={() => handleDownloadCreative(previewFormat === "stories" ? "stories" : "feed")}
              className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Baixar Esta Arte ({previewFormat === "stories" ? "Stories 9:16" : "Feed 1:1"})</span>
            </button>

            <button
              type="button"
              disabled={!activeImage}
              onClick={onFinishCampaign}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Concluir Campanha e Finalizar 🚀</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
    )}

    {/* FLOATING MOBILE BOTTOM BAR FOR QUICK ACCESS */}
    <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2.5 flex items-center justify-between shadow-2xl">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setMobileTab(mobileTab === "controls" ? "preview" : "controls")}
          className="px-3 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
        >
          {mobileTab === "controls" ? (
            <>
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ver Prévia</span>
            </>
          ) : (
            <>
              <Layout className="w-3.5 h-3.5 text-emerald-400" />
              <span>Voltar ao Editor</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setShowFullSetView(true)}
          className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs flex items-center gap-1 border border-slate-700 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Conjunto</span>
        </button>
      </div>

      <button
        type="button"
        disabled={!activeImage}
        onClick={() => handleDownloadCreative(previewFormat === "stories" ? "stories" : "feed")}
        className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Baixar Arte</span>
      </button>
    </div>

    {/* MODAL: BIBLIOTECA DE DNA VISUAL (GOURMET, DARK MONEY, ETC.) */}
    {showDnaModal && (
      <VisualStyleLibrary
        mode="modal"
        isOpen={showDnaModal}
        onClose={() => setShowDnaModal(false)}
        onApplyToCreatives={handleApplyDnaStyle}
      />
    )}

  </div>
);
}
