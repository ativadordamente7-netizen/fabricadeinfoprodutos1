import React, { useState } from "react";
import { 
  BookOpen, Edit3, Save, Download, ArrowRight, Check, Eye, Trash2, Palette, Sparkles, FileText,
  Maximize2, Minimize2, ChevronLeft, ChevronRight, X, Moon, Sun, BookOpenText,
  Brain, Heart, ListTodo
} from "lucide-react";
import { EbookData } from "../types";
import { generateEbookPDF } from "../utils/pdfGenerator";
import EbookCoverGenerator from "./EbookCoverGenerator";
import AICoverAssistant from "./AICoverAssistant";
import { ChapterContentRenderer } from "./ChapterContentRenderer";
import EbookPillarsAuditBar from "./EbookPillarsAuditBar";
import EbookGenerationProgress from "./EbookGenerationProgress";
import { AnimatePresence, motion } from "motion/react";

interface Props {
  ebook: EbookData;
  setEbook: (ebook: EbookData) => void;
  onSave: () => void;
  onNextStep: () => void;
  niche?: string;
  description?: string;
  targetAudience?: string;
  sessionToken?: string;
  activeVisualDna?: any;
}

export default function EbookStep({ ebook, setEbook, onSave, onNextStep, niche, description, targetAudience, sessionToken, activeVisualDna }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"cover" | "summary" | "chapters" | "conclusion">("cover");
  const [selectedChapterIdx, setSelectedChapterIdx] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("3d");

  // Distraction-free reading mode states
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [readerTheme, setReaderTheme] = useState<"light" | "sepia" | "dark">("sepia");

  // Interface for unified page pagination
  interface EbookPage {
    id: string;
    title: string;
    type: "cover" | "summary" | "chapter" | "conclusion";
    chapterIdx?: number;
    pageNumber: number;
  }

  // Generate page list dynamically
  const getEbookPages = (): EbookPage[] => {
    const pages: EbookPage[] = [
      { id: "cover", title: "Capa do E-book", type: "cover", pageNumber: 1 },
      { id: "summary", title: "Sumário & Introdução", type: "summary", pageNumber: 2 }
    ];
    
    ebook.chapters.forEach((ch, idx) => {
      pages.push({
        id: `chapter-${idx}`,
        title: `Capítulo 0${ch.number}: ${ch.title}`,
        type: "chapter",
        chapterIdx: idx,
        pageNumber: 3 + idx
      });
    });

    pages.push({
      id: "conclusion",
      title: "Conclusão & Mensagem",
      type: "conclusion",
      pageNumber: 3 + ebook.chapters.length
    });

    return pages;
  };

  const allPages = getEbookPages();

  // Find index of current page based on standard activeTab/chapterIdx
  const getCurrentPageIdx = (): number => {
    if (activeTab === "cover") return 0;
    if (activeTab === "summary") return 1;
    if (activeTab === "chapters") {
      const idx = allPages.findIndex(p => p.type === "chapter" && p.chapterIdx === selectedChapterIdx);
      return idx !== -1 ? idx : 2;
    }
    return allPages.length - 1; // conclusion
  };

  const currentPageIdx = getCurrentPageIdx();

  // Set page structure
  const setCurrentPage = (page: EbookPage) => {
    if (page.type === "cover") {
      setActiveTab("cover");
    } else if (page.type === "summary") {
      setActiveTab("summary");
    } else if (page.type === "chapter") {
      setActiveTab("chapters");
      if (page.chapterIdx !== undefined) {
        setSelectedChapterIdx(page.chapterIdx);
      }
    } else if (page.type === "conclusion") {
      setActiveTab("conclusion");
    }
  };

  const goToNextPage = () => {
    if (currentPageIdx < allPages.length - 1) {
      setCurrentPage(allPages[currentPageIdx + 1]);
    }
  };

  const goToPrevPage = () => {
    if (currentPageIdx > 0) {
      setCurrentPage(allPages[currentPageIdx - 1]);
    }
  };

  // Didactical AI Cover state
  const [aiVision, setAiVision] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiProgressStep, setAiProgressStep] = useState("");

  const handleGenerateAICover = async () => {
    setAiGenerating(true);
    setAiProgressStep("Analisando Nicho...");
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setAiProgressStep("Definindo Paleta de Cores...");
      await new Promise((r) => setTimeout(r, 1000));
      setAiProgressStep("Gerando Arte de Fundo...");

      const response = await fetch("/api/cover/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken || localStorage.getItem("fabrica_session_token") || ""
        },
        body: JSON.stringify({
          title: ebook.title,
          subtitle: ebook.subtitle,
          niche: niche || "Geral",
          description: description || ebook.synopsis || "Ebook completo",
          targetAudience: targetAudience || "Geral",
          author: ebook.author || "Especialista",
          style: aiVision ? "artistic" : "modern"
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Falha na geração com a IA.");
      }

      setAiProgressStep("Diagramando Títulos...");
      await new Promise((r) => setTimeout(r, 1000));
      setAiProgressStep("Renderizando Capa 3D...");

      const data = await response.json();

      const primaryVar = data.variations?.[0] || {
        typography: "Space Grotesk",
        titleColor: "#FFFFFF",
        subtitleColor: "#D1D5DB",
        authorColor: "#10B981",
        overlayColor: "gradient",
        overlayOpacity: 0.55,
        alignment: "top",
        fontSizeTitle: 28,
        showDecorativeBorder: false
      };

      setEbook({
        ...ebook,
        coverImage: data.imageUrl,
        cover: {
          useAiArt: true,
          imageUrl: data.imageUrl,
          coverImage: data.imageUrl,
          concept: data.concept,
          style: data.style,
          typography: primaryVar.typography,
          titleColor: primaryVar.titleColor,
          subtitleColor: primaryVar.subtitleColor,
          authorColor: primaryVar.authorColor,
          overlayColor: primaryVar.overlayColor,
          overlayOpacity: primaryVar.overlayOpacity,
          alignment: primaryVar.alignment,
          fontSizeTitle: primaryVar.fontSizeTitle,
          showDecorativeBorder: primaryVar.showDecorativeBorder
        }
      });
      setViewMode("3d");
    } catch (err: any) {
      alert(err.message || "Erro de conexão ao gerar capa com a IA.");
    } finally {
      setAiGenerating(false);
      setAiProgressStep("");
    }
  };

  const [downloadingCreative, setDownloadingCreative] = useState(false);

  const handleDownloadCreative = () => {
    setDownloadingCreative(true);
    
    const width = 800;
    const height = 1280;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setDownloadingCreative(false);
      return;
    }

    const title = ebook.title || "Sem Título";
    const subtitle = ebook.subtitle || "";
    const author = ebook.author || "Especialista";
    
    // Cover properties
    const isAi = ebook.cover?.useAiArt;
    const cov = ebook.cover || {};
    const titleColor = cov.titleColor || "#FFFFFF";
    const authorColor = cov.authorColor || "#10B981";
    const overlayOpacity = cov.overlayOpacity ?? 0.55;
    const showBorder = cov.showDecorativeBorder;
    const alignment = cov.alignment || "top";
    const typography = cov.typography || "Inter";

    // Typography configuration for Canvas
    let titleFont = "900 44px sans-serif";
    let subtitleFont = "500 22px sans-serif";
    let authorFont = "800 22px sans-serif";
    let tagFont = "bold 16px sans-serif";

    if (typography === "Space Grotesk") {
      titleFont = "900 44px 'Space Grotesk', sans-serif";
      subtitleFont = "500 20px 'Space Grotesk', sans-serif";
      authorFont = "800 20px 'Space Grotesk', sans-serif";
      tagFont = "bold 15px 'Space Grotesk', sans-serif";
    } else if (typography === "Playfair Display") {
      titleFont = "bold 48px 'Playfair Display', Georgia, serif";
      subtitleFont = "500 22px 'Playfair Display', Georgia, serif";
      authorFont = "italic bold 22px 'Playfair Display', Georgia, serif";
      tagFont = "bold 14px 'Playfair Display', Georgia, serif";
    } else if (typography === "JetBrains Mono") {
      titleFont = "900 38px 'JetBrains Mono', monospace";
      subtitleFont = "500 18px 'JetBrains Mono', monospace";
      authorFont = "800 18px 'JetBrains Mono', monospace";
      tagFont = "bold 14px 'JetBrains Mono', monospace";
    } else {
      titleFont = "900 42px 'Inter', sans-serif";
      subtitleFont = "500 20px 'Inter', sans-serif";
      authorFont = "800 20px 'Inter', sans-serif";
      tagFont = "bold 15px 'Inter', sans-serif";
    }

    const drawTextAndElements = () => {
      // 1. Draw Overlay if useAiArt and overlay active
      if (isAi && cov.overlayColor !== "none") {
        ctx.fillStyle = `rgba(15, 23, 42, ${overlayOpacity})`;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw Decorative Border
      if (showBorder) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 4;
        ctx.strokeRect(30, 30, width - 60, height - 60);
      }

      // 3. Helper to wrap and draw text
      const wrapText = (text: string, x: number, startY: number, maxWidth: number, lineHeight: number, isCenterAlign: boolean) => {
        const words = text.split(" ");
        let line = "";
        const lines: string[] = [];

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + " ";
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        let currentY = startY;
        lines.forEach((l) => {
          const trimmed = l.trim();
          let drawX = x;
          if (isCenterAlign) {
            drawX = x + (maxWidth - ctx.measureText(trimmed).width) / 2;
          }
          ctx.fillText(trimmed, drawX, currentY);
          currentY += lineHeight;
        });

        return currentY; // returns ending Y
      };

      // 4. Draw Header/Top Tag if alignment is top or center
      if (alignment !== "bottom") {
        ctx.font = tagFont;
        ctx.fillStyle = authorColor;
        ctx.fillText("● CONTEÚDO PREMIUM EXCLUSIVO", 60, 95);
      }

      // 5. Draw Title and Subtitle
      const contentWidth = width - 120;
      let titleY = 160;
      if (alignment === "center") {
        titleY = height / 2 - 120;
      } else if (alignment === "bottom") {
        titleY = height - 420;
      }

      // Draw Title
      ctx.font = titleFont;
      ctx.fillStyle = titleColor;
      const endTitleY = wrapText(title.toUpperCase(), 60, titleY, contentWidth, 54, false);

      // Draw Subtitle
      ctx.font = subtitleFont;
      ctx.fillStyle = "#D1D5DB"; // slate-300
      wrapText(subtitle, 60, endTitleY + 14, contentWidth, 28, false);

      // 6. Draw Bottom Tag if alignment is bottom
      if (alignment === "bottom") {
        ctx.font = tagFont;
        ctx.fillStyle = authorColor;
        ctx.fillText("● CONTEÚDO PREMIUM EXCLUSIVO", 60, titleY - 40);
      }

      // 7. Draw Footer Brand (Author)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, height - 140);
      ctx.lineTo(width - 60, height - 140);
      ctx.stroke();

      ctx.font = "bold 15px sans-serif";
      ctx.fillStyle = authorColor;
      ctx.fillText("AUTOR DO E-BOOK", 60, height - 100);

      ctx.font = authorFont;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(author, 60, height - 65);

      // 8. Draw realistic laminate shine
      const shineGrad = ctx.createLinearGradient(0, 0, width, height);
      shineGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      shineGrad.addColorStop(0.3, "rgba(255, 255, 255, 0)");
      shineGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.04)");
      shineGrad.addColorStop(0.7, "rgba(255, 255, 255, 0)");
      shineGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = shineGrad;
      ctx.fillRect(0, 0, width, height);

      // 9. Download PNG
      try {
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_capa_criativo.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) {
        console.error("Canvas toDataURL failed. Falling back to direct raw background download.", err);
        if (isAi && cov.imageUrl) {
          const a = document.createElement("a");
          a.href = cov.imageUrl;
          a.target = "_blank";
          a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_fundo.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }
      setDownloadingCreative(false);
    };

    if (isAi && cov.imageUrl) {
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      bgImg.onload = () => {
        const imgAspect = bgImg.width / bgImg.height;
        const canvasAspect = width / height;
        let drawWidth = width;
        let drawHeight = height;
        let offsetX = 0;
        let offsetY = 0;

        if (imgAspect > canvasAspect) {
          drawWidth = height * imgAspect;
          offsetX = (width - drawWidth) / 2;
        } else {
          drawHeight = width / imgAspect;
          offsetY = (height - drawHeight) / 2;
        }

        ctx.drawImage(bgImg, offsetX, offsetY, drawWidth, drawHeight);
        drawTextAndElements();
      };
      bgImg.onerror = (err) => {
        console.error("Failed to load background image for canvas, falling back to gradient background.", err);
        ctx.fillStyle = selectedColorOption?.hex || "#0f172a";
        ctx.fillRect(0, 0, width, height);
        drawTextAndElements();
      };
      bgImg.src = cov.imageUrl;
    } else {
      const baseColor = selectedColorOption?.hex || "#0f172a";
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, baseColor);
      bgGrad.addColorStop(1, "#020617");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
      drawTextAndElements();
    }
  };

  const colors = [
    { id: "emerald", name: "Esmeralda", bg: "bg-emerald-900 border-emerald-500", hex: "#064e3b" },
    { id: "indigo", name: "Índigo", bg: "bg-indigo-900 border-indigo-500", hex: "#1e1b4b" },
    { id: "rose", name: "Rubi Rose", bg: "bg-rose-900 border-rose-500", hex: "#4c0519" },
    { id: "slate", name: "Slate Black", bg: "bg-slate-900 border-slate-600", hex: "#0f172a" },
    { id: "amber", name: "Âmbar Luxo", bg: "bg-amber-900 border-amber-500", hex: "#78350f" },
  ];

  const handleFieldChange = (field: keyof EbookData, value: any) => {
    setEbook({ ...ebook, [field]: value });
  };

  const handleChapterTitleChange = (idx: number, title: string) => {
    const updatedChapters = [...ebook.chapters];
    updatedChapters[idx].title = title;
    setEbook({ ...ebook, chapters: updatedChapters });
  };

  const handleChapterContentChange = (idx: number, content: string) => {
    const updatedChapters = [...ebook.chapters];
    updatedChapters[idx].content = content;
    setEbook({ ...ebook, chapters: updatedChapters });
  };

  const handleLocalSave = () => {
    onSave();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDownloadPDF = async () => {
    setPdfDownloading(true);
    try {
      await generateEbookPDF(ebook);
    } catch (err) {
      console.error(err);
    } finally {
      setPdfDownloading(false);
    }
  };

  // 4 Pillars Deepening & Regeneration States
  const [showPillarsModal, setShowPillarsModal] = useState(false);
  const [isRegeneratingPillars, setIsRegeneratingPillars] = useState(false);

  const handleRegenerateWithPillars = async () => {
    setIsRegeneratingPillars(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken || localStorage.getItem("fabrica_session_token") || ""
        },
        body: JSON.stringify({
          type: "ebook",
          productName: ebook.title,
          niche: niche || ebook.coverPattern || "Geral",
          targetAudience: targetAudience || "Geral",
          tone: "Transformador e Prático",
          description: description || ebook.synopsis || ebook.title,
          extraDetails: "Aprofundar densidade nos 4 pilares: Mental (clareza/crenças), Emocional (autodomínio/medos), Espiritual (propósito maior) e Tarefas Práticas acionáveis para o leitor.",
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.chapters && data.chapters.length > 0) {
          const updated: EbookData = {
            ...ebook,
            synopsis: data.synopsis || ebook.synopsis,
            chapters: data.chapters,
            conclusion: data.conclusion || ebook.conclusion
          };
          setEbook(updated);
          onSave();
        }
      }
    } catch (err) {
      console.error("Failed to regenerate with pillars", err);
    } finally {
      setTimeout(() => {
        setIsRegeneratingPillars(false);
        setTimeout(() => setShowPillarsModal(false), 1200);
      }, 1500);
    }
  };

  const selectedColorOption = colors.find(c => c.id === ebook.coverColor) || colors[3];

  return (
    <div className="flex flex-col gap-4">
      {/* 4 Pillars Quality Audit Bar */}
      <EbookPillarsAuditBar 
        ebook={ebook} 
        onOpenRegenerateModal={() => setShowPillarsModal(true)} 
      />

      {/* Mobile Navigation Anchor / Switcher Bar (screens < 1024px / < 768px mobile) */}
      <div className="lg:hidden flex items-center justify-between p-3 bg-slate-900/95 border border-slate-800 rounded-2xl flex-wrap gap-2 sticky top-2 z-30 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
            Navegação da Etapa 1:
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="#step1-controls-section"
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Controles & Edição</span>
          </a>
          <a
            href="#step1-reader-section"
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Leitor do E-book</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      
      {/* LEFT COLUMN: Controls & Editing Dashboard (5 Cols on desktop, stacked on mobile < 768px) */}
      <div id="step1-controls-section" className="w-full lg:col-span-5 flex flex-col gap-4 order-1 scroll-mt-20">
        
        {/* Visual Guidance Banner to download PDF */}
        <div className="bg-gradient-to-r from-emerald-950/45 to-teal-950/45 border border-emerald-500/25 rounded-2xl p-4 shadow-md flex flex-col sm:flex-row gap-3 items-start animate-fade-in">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1">
              Direcionamento para Baixar Seu Livro:
            </h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Use o botão <strong className="text-emerald-300">"Baixar em PDF"</strong> abaixo para exportar seu livro completo formatado, ou <strong className="text-white">"Baixar Criativo (Capa PNG)"</strong> para obter a imagem promocional de divulgação!
            </p>
          </div>
        </div>

        {/* Toggle Mode Control */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-wrap sm:flex-nowrap gap-2 shadow-md">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              !isEditing ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Visualizar Livro</span>
          </button>
          
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              isEditing ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar Conteúdo</span>
          </button>
        </div>

        {/* Editing controls panel */}
        {isEditing ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-emerald-400" />
                Editor de Metadados & Capa
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                Etapa 1
              </span>
            </div>
            
            {/* Metadata Fields */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Título do E-book</label>
                <input
                  type="text"
                  value={ebook.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Subtítulo Promissor</label>
                <input
                  type="text"
                  value={ebook.subtitle}
                  onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Nome do Autor</label>
                  <input
                    type="text"
                    value={ebook.author}
                    onChange={(e) => handleFieldChange("author", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Intelligent Cover Generator Section */}
            <div className="border-t border-slate-800 pt-4 mt-2 flex flex-col gap-3">
              <EbookCoverGenerator
                ebook={ebook}
                niche={niche || ""}
                description={description || ""}
                targetAudience={targetAudience || ""}
                onUpdate={(coverData) => {
                  const existingCoverImg = ebook.cover?.imageUrl || ebook.cover?.coverImage || ebook.coverImage || "";
                  const finalImg = coverData.imageUrl || coverData.coverImage || existingCoverImg;
                  setEbook({
                    ...ebook,
                    coverImage: finalImg,
                    cover: {
                      ...(ebook.cover || {}),
                      ...coverData,
                      imageUrl: finalImg,
                      coverImage: finalImg,
                      useAiArt: !!finalImg
                    }
                  });
                }}
                onUpdateEbook={(updated) => {
                  setEbook(updated);
                }}
              />
            </div>

            {/* Chapters editing area */}
            <div className="border-t border-slate-800 pt-3 mt-1 flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">Conteúdo dos Capítulos</h4>
                <span className="text-[10px] text-slate-500 font-mono">
                  {ebook.chapters.length} Capítulos
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1.5 pb-1">
                {ebook.chapters.map((ch, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedChapterIdx(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      selectedChapterIdx === i ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm" : "text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800/60"
                    }`}
                  >
                    <span>Ch 0{ch.number}</span>
                  </button>
                ))}
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Título do Capítulo 0{ebook.chapters[selectedChapterIdx].number}</label>
                  <input
                    type="text"
                    value={ebook.chapters[selectedChapterIdx].title}
                    onChange={(e) => handleChapterTitleChange(selectedChapterIdx, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Conteúdo Completo (Padrão 4 Pilares)
                    </label>
                    <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full whitespace-nowrap">
                      Mental • Emocional • Espiritual • Tarefas
                    </span>
                  </div>

                  {/* Chapter 4-Pillars presence status */}
                  {(() => {
                    const content = ebook.chapters[selectedChapterIdx]?.content || "";
                    const hasMental = /🧠|Mental/i.test(content);
                    const hasEmotional = /❤️|Emocional/i.test(content);
                    const hasSpiritual = /✨|Espiritual/i.test(content);
                    const hasPractical = /📋|Tarefas|Passo\s*a\s*passo/i.test(content);

                    return (
                      <div className="flex flex-wrap items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/90 rounded-lg border border-slate-800/80 text-[10px] mb-2">
                        <span className="text-slate-500 font-bold uppercase text-[9px] mr-1 w-full sm:w-auto">
                          Cobertura do Cap {ebook.chapters[selectedChapterIdx]?.number}:
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded font-medium text-[10px] ${hasMental ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-slate-800/80 text-slate-500"}`}>
                            🧠 Mental {hasMental ? "✓" : "—"}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded font-medium text-[10px] ${hasEmotional ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-slate-800/80 text-slate-500"}`}>
                            ❤️ Emocional {hasEmotional ? "✓" : "—"}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded font-medium text-[10px] ${hasSpiritual ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-slate-800/80 text-slate-500"}`}>
                            ✨ Espiritual {hasSpiritual ? "✓" : "—"}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded font-medium text-[10px] ${hasPractical ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-800/80 text-slate-500"}`}>
                            📋 Prático {hasPractical ? "✓" : "—"}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 4 Pillars Quick Insertion Helpers */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2 bg-slate-900/90 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider px-1 w-full sm:w-auto">Inserir:</span>
                    <div className="flex flex-wrap items-center gap-1 flex-1">
                      <button
                        type="button"
                        onClick={() => {
                          const current = ebook.chapters[selectedChapterIdx].content;
                          const template = `\n\n[🧠 Dimensão Mental: Clareza & Reprogramação de Crenças]\nDescreva aqui os modelos mentais e a quebra de crenças limitantes específicas deste capítulo...`;
                          handleChapterContentChange(selectedChapterIdx, current + template);
                        }}
                        className="px-2 py-1 text-[10px] font-bold bg-indigo-950/80 text-indigo-300 hover:bg-indigo-900 border border-indigo-800/60 rounded transition flex items-center gap-1"
                      >
                        <Brain className="w-2.5 h-2.5" /> 🧠 Mental
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const current = ebook.chapters[selectedChapterIdx].content;
                          const template = `\n\n[❤️ Dimensão Emocional: Autodomínio & Gestão de Medos]\nDescreva aqui o autodomínio emocional, superação da ansiedade e foco na constância...`;
                          handleChapterContentChange(selectedChapterIdx, current + template);
                        }}
                        className="px-2 py-1 text-[10px] font-bold bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-800/60 rounded transition flex items-center gap-1"
                      >
                        <Heart className="w-2.5 h-2.5" /> ❤️ Emocional
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const current = ebook.chapters[selectedChapterIdx].content;
                          const template = `\n\n[✨ Dimensão Espiritual: Propósito Maior & Força Interior]\nDescreva aqui a conexão com um propósito transcendente, valores éticos inegociáveis e paz interior...`;
                          handleChapterContentChange(selectedChapterIdx, current + template);
                        }}
                        className="px-2 py-1 text-[10px] font-bold bg-amber-950/80 text-amber-300 hover:bg-amber-900 border border-amber-800/60 rounded transition flex items-center gap-1"
                      >
                        <Sparkles className="w-2.5 h-2.5" /> ✨ Espiritual
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const current = ebook.chapters[selectedChapterIdx].content;
                          const template = `\n\n[📋 Tarefas Práticas & Plano de Ação do Nicho]\n• Tarefa 1: Descreva a primeira ação prática passo a passo...\n• Tarefa 2: Descreva o segundo exercício acionável no nicho...\n• Tarefa 3: Desafio prático para execução no mundo real hoje.`;
                          handleChapterContentChange(selectedChapterIdx, current + template);
                        }}
                        className="px-2 py-1 text-[10px] font-bold bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/60 rounded transition flex items-center gap-1"
                      >
                        <ListTodo className="w-2.5 h-2.5" /> 📋 Tarefas
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={8}
                    value={ebook.chapters[selectedChapterIdx].content}
                    onChange={(e) => handleChapterContentChange(selectedChapterIdx, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Call to action message */}
            <div className="border-t border-slate-800 pt-3">
              <label className="text-xs font-bold text-slate-400 block mb-1">Chamada Final (CTA no PDF)</label>
              <textarea
                rows={2}
                value={ebook.callToAction}
                onChange={(e) => handleFieldChange("callToAction", e.target.value)}
                placeholder="Ex: Gostou deste material? Acesse nosso portal VIP..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition resize-none leading-relaxed"
              />
            </div>

          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Navegar no Livro Digital
            </h3>
            
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setActiveTab("cover")}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition flex items-center justify-between border flex-wrap gap-2 ${
                  activeTab === "cover" ? "bg-slate-800 border-slate-700 text-emerald-400 font-extrabold" : "bg-slate-950/40 border-slate-800/40 text-slate-300 hover:bg-slate-850"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Capa Digital</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Pág 01</span>
              </button>

              {/* Cover Generator & Image Tool Integration for Step 1 */}
              {activeTab === "cover" && (
                <div className="my-2 animate-fade-in">
                  <EbookCoverGenerator
                    ebook={ebook}
                    niche={niche || ""}
                    description={description || ""}
                    targetAudience={targetAudience || ""}
                    onUpdate={(coverData) => {
                      const existingCoverImg = ebook.cover?.imageUrl || ebook.cover?.coverImage || ebook.coverImage || "";
                      const finalImg = coverData.imageUrl || coverData.coverImage || existingCoverImg;
                      setEbook({
                        ...ebook,
                        coverImage: finalImg,
                        cover: {
                          ...(ebook.cover || {}),
                          ...coverData,
                          imageUrl: finalImg,
                          coverImage: finalImg,
                          useAiArt: !!finalImg
                        }
                      });
                    }}
                    onUpdateEbook={(updated) => {
                      setEbook(updated);
                    }}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveTab("summary")}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition flex items-center justify-between border flex-wrap gap-2 ${
                  activeTab === "summary" ? "bg-slate-800 border-slate-700 text-emerald-400 font-extrabold" : "bg-slate-950/40 border-slate-800/40 text-slate-300 hover:bg-slate-850"
                }`}
              >
                <span>Sumário & Introdução</span>
                <span className="text-[10px] font-mono text-slate-500">Pág 02</span>
              </button>

              <div className="bg-slate-950/30 border border-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1.5 pb-1 block border-b border-slate-800/50 mb-1">Capítulos do e-book</span>
                {ebook.chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveTab("chapters");
                      setSelectedChapterIdx(idx);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between gap-2 ${
                      activeTab === "chapters" && selectedChapterIdx === idx
                        ? "bg-emerald-500/10 text-emerald-400 font-bold"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span className="truncate min-w-0 flex-1">Capítulo 0{ch.number}: {ch.title}</span>
                    <span className="text-[9px] font-mono opacity-60 shrink-0">Pág 0{3 + idx}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("conclusion")}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition flex items-center justify-between border flex-wrap gap-2 ${
                  activeTab === "conclusion" ? "bg-slate-800 border-slate-700 text-emerald-400 font-extrabold" : "bg-slate-950/40 border-slate-800/40 text-slate-300 hover:bg-slate-850"
                }`}
              >
                <span>Conclusão & Mensagem</span>
                <span className="text-[10px] font-mono text-slate-500">Pág 07</span>
              </button>
            </div>
          </div>
        )}

        {/* Global Action Utility Buttons */}
        <div className="flex flex-col gap-2.5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          {/* New Prominent AI Cover Generation Button (Imagen) */}
          <button
            type="button"
            onClick={handleGenerateAICover}
            disabled={aiGenerating}
            className="w-full bg-slate-950 hover:bg-slate-900 text-emerald-400 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-500/5 transition-all group disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 group-hover:animate-spin" />
            <span>Gerar Capa Profissional (IA Imagen)</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleLocalSave}
              className="bg-slate-800 hover:bg-slate-750 text-slate-200 py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Projeto Salvo!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Projeto</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={pdfDownloading}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-500/20 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {pdfDownloading ? "Baixando..." : "Baixar em PDF"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadCreative}
            disabled={downloadingCreative}
            className="w-full bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-800 hover:border-emerald-500/30 transition-all disabled:opacity-50 shadow"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            {downloadingCreative ? "Processando..." : "Baixar Criativo (Capa PNG)"}
          </button>

          <button
            type="button"
            onClick={onNextStep}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-emerald-500/15 transition-all flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98]"
          >
            <span>Criar Minha Página de Vendas</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </div>

      </div>

      {/* RIGHT COLUMN: Realistic Book Cover & Reading Page Canvas (7 Cols on desktop, stacked on mobile < 768px) */}
      <div id="step1-reader-section" className="w-full lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center min-h-[500px] order-2 scroll-mt-20">
        
        {/* Preview Container Header Bar (In flow, flex-wrap responsive, no overlap) */}
        <div className="w-full flex items-center justify-between flex-wrap gap-2 pb-3 mb-4 border-b border-slate-800/80 z-20">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Leitor do E-book (Preview Digital)</span>
          </div>
          
          <button
            type="button"
            onClick={() => setIsDistractionFree(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 rounded-xl text-[11px] font-bold transition duration-200 shadow cursor-pointer shrink-0"
            title="Entrar no Modo Leitura Sem Distração"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="whitespace-nowrap">Modo Sem Distração</span>
          </button>
        </div>

        {/* Background ambient light */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05),transparent)] pointer-events-none" />

        {/* AI Imagen Generation Immersive Loader */}
        {aiGenerating && (
          <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm animate-fade-in">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
              <Sparkles className="absolute w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-2">
              Criando Capa Profissional (Imagen 3)
            </h4>
            <p className="text-xs text-emerald-400 font-mono font-bold animate-pulse bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
              {aiProgressStep}
            </p>
            <p className="text-[11px] text-slate-500 mt-4 max-w-xs leading-normal">
              Analisando o título "{ebook.title}" e o nicho "{niche || "Geral"}" para compor uma arte de alta conversão exclusiva.
            </p>
          </div>
        )}

        {/* Dynamic Reader Book View */}
        {activeTab === "cover" ? (
          /* DIGITAL COVER RENDER */
          <div className="flex flex-col items-center gap-4 text-center max-w-sm w-full animate-fade-in">
            <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Capa Comercial do E-book
            </span>

            {/* Quick Toggle in Preview Pane */}
            {true && (
              <div className="flex gap-1.5 bg-slate-900/60 p-1 rounded-lg border border-slate-800/80 mt-1">
                <button
                  type="button"
                  onClick={() => setViewMode("3d")}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition ${viewMode === "3d" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  3D Mockup
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("2d")}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition ${viewMode === "2d" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  Plana (2D)
                </button>
              </div>
            )}

            {(() => {
              const defaultCoverImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80";
              const cov = ebook.cover && ebook.cover.useAiArt ? ebook.cover : {
                useAiArt: true,
                imageUrl: ebook.cover?.imageUrl || defaultCoverImage,
                coverImage: ebook.cover?.imageUrl || defaultCoverImage,
                concept: "Conceito Premium e Moderno",
                style: "modern",
                typography: ebook.cover?.typography || "Space Grotesk",
                titleColor: ebook.cover?.titleColor || "#FFFFFF",
                subtitleColor: ebook.cover?.subtitleColor || "#D1D5DB",
                authorColor: ebook.cover?.authorColor || "#10B981",
                overlayColor: ebook.cover?.overlayColor || "gradient",
                overlayOpacity: ebook.cover?.overlayOpacity ?? 0.55,
                alignment: ebook.cover?.alignment || "top",
                fontSizeTitle: ebook.cover?.fontSizeTitle || 28,
                showDecorativeBorder: ebook.cover?.showDecorativeBorder || false
              };

              const getFontFamily = (typ?: string) => {
                switch (typ) {
                  case "Space Grotesk": return "'Space Grotesk', sans-serif";
                  case "Playfair Display": return "'Playfair Display', Georgia, serif";
                  case "JetBrains Mono": return "'JetBrains Mono', monospace";
                  default: return "'Inter', sans-serif";
                }
              };

              const getAlignmentClass = (align?: string) => {
                switch (align) {
                  case "center": return "justify-center";
                  case "bottom": return "justify-end pb-8";
                  default: return "justify-start pt-8";
                }
              };

              const coverFace = (
                <div
                  className="relative w-full h-full rounded-r-xl overflow-hidden flex flex-col justify-between p-5 select-none text-left"
                  style={{
                    backgroundImage: `url(${cov.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Decorative Border */}
                  {cov.showDecorativeBorder && (
                    <div className="absolute inset-3 border border-white/20 pointer-events-none rounded-lg" />
                  )}

                  {/* Content wrapper with custom alignment */}
                  <div className={`relative z-10 h-full flex flex-col ${getAlignmentClass(cov.alignment)} gap-2.5`}>
                    
                    {/* Top Tag */}
                    {cov.alignment !== "bottom" && (
                      <span 
                        className="text-[7.5px] font-black uppercase tracking-widest block"
                        style={{ color: cov.authorColor || "#10B981", fontFamily: getFontFamily(cov.typography) }}
                      >
                        ● Conteúdo Premium Exclusivo
                      </span>
                    )}

                    {/* Title & Subtitle Group */}
                    <div className="flex flex-col gap-1">
                      <h3 
                        className="font-black leading-tight tracking-tight uppercase"
                        style={{ 
                          color: cov.titleColor || "#FFFFFF", 
                          fontFamily: getFontFamily(cov.typography),
                          fontSize: `${(cov.fontSizeTitle || 28) * 0.5}px` 
                        }}
                      >
                        {ebook.title}
                      </h3>
                      <p 
                        className="text-[8px] leading-relaxed text-slate-300 font-medium"
                        style={{ fontFamily: getFontFamily(cov.typography) }}
                      >
                        {ebook.subtitle}
                      </p>
                    </div>

                    {/* Bottom Tag if alignment is bottom */}
                    {cov.alignment === "bottom" && (
                      <span 
                        className="text-[7.5px] font-black uppercase tracking-widest block mt-1"
                        style={{ color: cov.authorColor || "#10B981", fontFamily: getFontFamily(cov.typography) }}
                      >
                        ● Conteúdo Premium Exclusivo
                      </span>
                    )}
                  </div>

                  {/* Footer Brand */}
                  <div className="relative z-10 border-t border-white/10 pt-2.5 mt-auto flex flex-col gap-0.5 text-left">
                    <span 
                      className="text-[7.5px] font-bold uppercase tracking-wider"
                      style={{ color: cov.authorColor || "#10B981", fontFamily: getFontFamily(cov.typography) }}
                    >
                      Autor
                    </span>
                    <span 
                      className="text-[9px] font-extrabold tracking-tight text-white truncate"
                      style={{ fontFamily: getFontFamily(cov.typography) }}
                    >
                      {ebook.author || "Especialista"}
                    </span>
                  </div>
                </div>
              );

              if (viewMode === "3d") {
                return (
                  <div className="relative my-4 select-none" style={{ perspective: "1000px" }}>
                    {/* 3D Wrapper */}
                    <div 
                      className="relative w-[180px] h-[260px] transition-transform duration-500 hover:scale-[1.03] origin-center"
                      style={{
                        transform: "rotateY(-18deg) rotateX(10deg) rotateZ(-2deg)",
                        transformStyle: "preserve-3d"
                      }}
                    >
                      {/* Spine element (Thickness side) */}
                      <div 
                        className="absolute right-full top-0 w-[12px] h-full origin-right bg-slate-900 border-r border-white/10"
                        style={{
                          transform: "rotateY(-90deg)",
                          transformStyle: "preserve-3d",
                          boxShadow: "inset -4px 0 10px rgba(0,0,0,0.8)"
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center [writing-mode:vertical-rl] text-[6px] font-bold text-slate-500 uppercase tracking-widest truncate max-h-[180px]">
                          {ebook.title}
                        </div>
                      </div>

                      {/* Book Shadow */}
                      <div 
                        className="absolute top-[8%] -left-[10%] w-[110%] h-[95%] bg-black/60 blur-md rounded-xl pointer-events-none z-0"
                        style={{ transform: "translateZ(-20px) rotateY(15deg) rotateZ(3deg)" }}
                      />

                      {/* Front cover */}
                      <div className="absolute inset-0 w-full h-full bg-slate-950 rounded-r-xl shadow-2xl z-10 border-l border-white/10 flex">
                        {coverFace}
                      </div>
                    </div>
                  </div>
                );
              }

              // 2D Card view
              return (
                <div className="w-[180px] h-[260px] bg-slate-950 rounded-r-xl shadow-2xl border border-white/10 flex my-4">
                  {coverFace}
                </div>
              );
            })()}

            <div>
              <h2 className="text-sm md:text-base font-bold text-white mt-1 leading-tight">{ebook.title}</h2>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">{ebook.subtitle}</p>
            </div>

            <button
              type="button"
              onClick={handleDownloadCreative}
              disabled={downloadingCreative}
              className="mt-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 py-2.5 px-6 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-emerald-500/25 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-emerald-400 animate-pulse" />
              {downloadingCreative ? "Processando..." : "Baixar Criativo (Capa PNG)"}
            </button>

            {/* AI COVER ASSISTANT DYNAMIC COMPONENT */}
            <AICoverAssistant
              ebook={ebook}
              niche={niche || ""}
              description={description || ""}
              sessionToken={sessionToken}
              setViewMode={setViewMode}
              onSaveCover={(coverData) => {
                setEbook({
                  ...ebook,
                  coverImage: coverData.imageUrl,
                  cover: {
                    ...coverData,
                    coverImage: coverData.imageUrl
                  }
                });
              }}
            />
          </div>
        ) : activeTab === "summary" ? (
          /* SUMMARY TABLE OF CONTENT VIEW */
          <div className="bg-white text-slate-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-lg leading-relaxed border border-slate-200 flex flex-col min-h-[420px] justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-[10px] font-bold font-mono text-emerald-600 uppercase tracking-widest">Pág 02 • Sumário</span>
                <span className="text-xs text-slate-400">Fábrica de Infoprodutos</span>
              </div>
              
              <h3 className="text-lg font-extrabold text-slate-900 mt-4">Conteúdo Geral</h3>
              
              <div className="mt-5 flex flex-col gap-3">
                <div className="flex justify-between items-baseline text-xs font-semibold text-slate-700">
                  <span>Introdução ao Conteúdo</span>
                  <div className="flex-1 mx-2 border-b border-dashed border-slate-300"></div>
                  <span>Ch 01</span>
                </div>

                {ebook.chapters.map((ch, i) => (
                  <div key={i} className="flex justify-between items-baseline text-xs text-slate-600">
                    <span className="truncate max-w-[280px]">Capítulo 0{ch.number}: {ch.title}</span>
                    <div className="flex-1 mx-2 border-b border-dashed border-slate-300"></div>
                    <span>Ch 0{ch.number}</span>
                  </div>
                ))}

                <div className="flex justify-between items-baseline text-xs font-semibold text-slate-700">
                  <span>Conclusão & Chamada Final</span>
                  <div className="flex-1 mx-2 border-b border-dashed border-slate-300"></div>
                  <span>Pág 07</span>
                </div>
              </div>

              {/* Synopsis Preview */}
              <div className="mt-6 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Sinopse de Entrada</span>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5 italic font-medium">
                  "{ebook.synopsis}"
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 text-center uppercase tracking-wider font-mono">
              Todos os direitos reservados • {ebook.author}
            </div>
          </div>
        ) : activeTab === "chapters" ? (
          /* ACTIVE CHAPTER VIEW */
          <div className="bg-white text-slate-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-lg leading-relaxed border border-slate-200 flex flex-col min-h-[420px] justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <span className="text-[10px] font-bold font-mono text-emerald-600 uppercase tracking-widest">
                  Capítulo 0{ebook.chapters[selectedChapterIdx].number}
                </span>
                <span className="text-xs text-slate-400">Pág 0{3 + selectedChapterIdx}</span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                {ebook.chapters[selectedChapterIdx].title}
              </h3>
              
              <div className="mt-4 max-h-[250px] overflow-y-auto pr-1">
                <ChapterContentRenderer
                  content={ebook.chapters[selectedChapterIdx].content}
                  isReaderMode={false}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 flex justify-between uppercase tracking-wider font-mono">
              <span>{ebook.author}</span>
              <span>{ebook.title.substring(0, 20)}</span>
            </div>
          </div>
        ) : (
          /* CONCLUSION & CALL TO ACTION VIEW */
          <div className="bg-white text-slate-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-lg leading-relaxed border border-slate-200 flex flex-col min-h-[420px] justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <span className="text-[10px] font-bold font-mono text-emerald-600 uppercase tracking-widest">
                  Conclusão
                </span>
                <span className="text-xs text-slate-400">Pág 07</span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                Considerações Finais
              </h3>
              
              <div className="text-xs text-slate-600 mt-4 leading-relaxed whitespace-pre-wrap max-h-[160px] overflow-y-auto pr-1">
                {ebook.conclusion}
              </div>

              {ebook.callToAction && (
                <div className="mt-5 bg-emerald-50 border-l-4 border-emerald-500 p-3.5 rounded-r-xl">
                  <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider font-mono">Chamada Final de Ação</span>
                  <p className="text-[11px] text-emerald-700 leading-relaxed font-semibold mt-1">
                    "{ebook.callToAction}"
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 text-center uppercase tracking-wider font-mono">
              FIM DO LIVRO DIGITAL • {ebook.author}
            </div>
          </div>
        )}

      </div>

      {/* DISTRACTION-FREE FULLSCREEN READING MODE OVERLAY */}
      <AnimatePresence>
        {isDistractionFree && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/98 backdrop-blur-md z-50 flex flex-col justify-between text-slate-200 font-sans"
          >
            {/* Top Navigation & Controls Header */}
            <header className="px-6 py-4 border-b border-slate-900 bg-slate-950/90 flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/25">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-white uppercase tracking-wider line-clamp-1 max-w-[200px] md:max-w-md">{ebook.title}</h2>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Modo Leitura Sem Distração
                  </span>
                </div>
              </div>

              {/* Navigation and Theme Toggles */}
              <div className="flex items-center gap-4">
                {/* Theme Selector Swatches */}
                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setReaderTheme("light")}
                    className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      readerTheme === "light" ? "bg-white text-slate-950 shadow" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    Claro
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderTheme("sepia")}
                    className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      readerTheme === "sepia" ? "bg-[#faf6ef] text-[#433422] shadow" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Sépia
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderTheme("dark")}
                    className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      readerTheme === "dark" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    Escuro
                  </button>
                </div>

                {/* Exit button */}
                <button
                  type="button"
                  onClick={() => setIsDistractionFree(false)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-800 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
                  title="Sair do Modo Leitura"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            </header>

            {/* Main Reading Workspace */}
            <main className={`flex-1 overflow-hidden flex relative ${
              readerTheme === "light" ? "bg-slate-100" : readerTheme === "sepia" ? "bg-[#f4ebd0]/40" : "bg-slate-950"
            }`}>
              {/* Left navigation float control for desktop */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                <button
                  type="button"
                  onClick={goToPrevPage}
                  disabled={currentPageIdx === 0}
                  className="p-3 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-emerald-400 rounded-full border border-slate-800/80 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>

              {/* Central Ebook Page Canvas Container */}
              <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center">
                <div 
                  className={`w-full max-w-2xl flex-1 flex flex-col justify-between p-6 md:p-12 rounded-2xl shadow-xl transition-all duration-300 ${
                    readerTheme === "light" 
                      ? "bg-white text-slate-800 border border-slate-200/80 shadow-slate-200/50" 
                      : readerTheme === "sepia" 
                        ? "bg-[#faf6ef] text-[#3e2e1e] border border-[#ebdcc5] shadow-[#e2d5c3]/50" 
                        : "bg-slate-900 text-slate-200 border border-slate-800 shadow-black/40"
                  }`}
                >
                  {/* Page header */}
                  <div className={`flex justify-between items-center pb-4 border-b ${
                    readerTheme === "light" ? "border-slate-100" : readerTheme === "sepia" ? "border-[#eedec6]" : "border-slate-800"
                  } text-[10px] font-bold font-mono uppercase tracking-widest opacity-60`}>
                    <span>
                      Pág 0{allPages[currentPageIdx]?.pageNumber} • {allPages[currentPageIdx]?.title.split(":")[0]}
                    </span>
                    <span>Fábrica de Infoprodutos</span>
                  </div>

                  {/* Page Content depending on active page */}
                  <div className="flex-1 py-8 flex flex-col justify-center">
                    {allPages[currentPageIdx]?.type === "cover" && (
                      <div className="flex flex-col items-center text-center gap-6 py-4 animate-fade-in">
                        {/* Render cover image preview inside the page in reader mode */}
                        <div className="w-[180px] h-[260px] bg-slate-950 rounded-r-xl shadow-2xl border border-white/10 overflow-hidden flex shrink-0">
                          {(() => {
                            const defaultCoverImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80";
                            const cov = ebook.cover && ebook.cover.useAiArt ? ebook.cover : {
                              useAiArt: true,
                              imageUrl: ebook.cover?.imageUrl || defaultCoverImage,
                              coverImage: ebook.cover?.imageUrl || defaultCoverImage,
                              concept: "Conceito Premium e Moderno",
                              style: "modern",
                              typography: ebook.cover?.typography || "Space Grotesk",
                              titleColor: ebook.cover?.titleColor || "#FFFFFF",
                              subtitleColor: ebook.cover?.subtitleColor || "#D1D5DB",
                              authorColor: ebook.cover?.authorColor || "#10B981",
                              overlayColor: ebook.cover?.overlayColor || "gradient",
                              overlayOpacity: ebook.cover?.overlayOpacity ?? 0.55,
                              alignment: ebook.cover?.alignment || "top",
                              fontSizeTitle: ebook.cover?.fontSizeTitle || 28,
                              showDecorativeBorder: ebook.cover?.showDecorativeBorder || false
                            };

                            const getFontFamily = (typ?: string) => {
                              switch (typ) {
                                case "Space Grotesk": return "'Space Grotesk', sans-serif";
                                case "Playfair Display": return "'Playfair Display', Georgia, serif";
                                case "JetBrains Mono": return "'JetBrains Mono', monospace";
                                default: return "'Inter', sans-serif";
                              }
                            };

                            const getAlignmentClass = (align?: string) => {
                              switch (align) {
                                case "center": return "justify-center";
                                case "bottom": return "justify-end pb-8";
                                default: return "justify-start pt-8";
                              }
                            };

                            return (
                              <div
                                className="relative w-full h-full rounded-r-xl overflow-hidden flex flex-col justify-between p-5 select-none text-left"
                                style={{
                                  backgroundImage: `url(${cov.imageUrl})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                              >
                                {cov.showDecorativeBorder && (
                                  <div className="absolute inset-3 border border-white/20 pointer-events-none rounded-lg" />
                                )}

                                <div className={`relative z-10 h-full flex flex-col ${getAlignmentClass(cov.alignment)} gap-2.5`}>
                                  {cov.alignment !== "bottom" && (
                                    <span 
                                      className="text-[7.5px] font-black uppercase tracking-widest block"
                                      style={{ color: cov.authorColor || "#10B981", fontFamily: getFontFamily(cov.typography) }}
                                    >
                                      ● Conteúdo Premium Exclusivo
                                    </span>
                                  )}

                                  <div className="flex flex-col gap-1">
                                    <h3 
                                      className="font-black leading-tight tracking-tight uppercase"
                                      style={{ 
                                        color: cov.titleColor || "#FFFFFF", 
                                        fontFamily: getFontFamily(cov.typography),
                                        fontSize: `${(cov.fontSizeTitle || 28) * 0.5}px` 
                                      }}
                                    >
                                      {ebook.title}
                                    </h3>
                                    <p 
                                      className="text-[8px] leading-relaxed text-slate-300 font-medium"
                                      style={{ fontFamily: getFontFamily(cov.typography) }}
                                    >
                                      {ebook.subtitle}
                                    </p>
                                  </div>

                                  {cov.alignment === "bottom" && (
                                    <span 
                                      className="text-[7.5px] font-black uppercase tracking-widest block mt-1"
                                      style={{ color: cov.authorColor || "#10B981", fontFamily: getFontFamily(cov.typography) }}
                                    >
                                      ● Conteúdo Premium Exclusivo
                                    </span>
                                  )}
                                </div>

                                <div className="relative z-10 border-t border-white/10 pt-2.5 mt-auto flex flex-col gap-0.5 text-left">
                                  <span 
                                    className="text-[7.5px] font-bold uppercase tracking-wider"
                                    style={{ color: cov.authorColor || "#10B981", fontFamily: getFontFamily(cov.typography) }}
                                  >
                                    Autor
                                  </span>
                                  <span 
                                    className="text-[9px] font-extrabold tracking-tight text-white truncate"
                                    style={{ fontFamily: getFontFamily(cov.typography) }}
                                  >
                                    {ebook.author || "Especialista"}
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                        <div className="mt-4">
                          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight uppercase">
                            {ebook.title}
                          </h1>
                          <p className="text-sm opacity-75 mt-2 max-w-md mx-auto leading-relaxed">
                            {ebook.subtitle}
                          </p>
                          <div className="mt-6 flex flex-col items-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Escrito por</span>
                            <span className="text-sm font-black mt-1">{ebook.author || "Especialista"}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {allPages[currentPageIdx]?.type === "summary" && (
                      <div className="flex flex-col py-2 animate-fade-in">
                        <h2 className="text-xl font-black mb-6 text-slate-900 dark:text-white">Sumário Geral</h2>
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-baseline text-sm font-bold">
                            <span>Introdução & Sinopse</span>
                            <div className={`flex-1 mx-2 border-b border-dashed ${
                              readerTheme === "light" ? "border-slate-300" : readerTheme === "sepia" ? "border-[#eedec6]" : "border-slate-800"
                            }`}></div>
                            <span>Pág 02</span>
                          </div>

                          {ebook.chapters.map((ch, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                const matchedPageIdx = allPages.findIndex(p => p.type === "chapter" && p.chapterIdx === i);
                                if (matchedPageIdx !== -1) {
                                  setCurrentPage(allPages[matchedPageIdx]);
                                }
                              }}
                              className="group text-left flex justify-between items-baseline text-xs md:text-sm text-inherit hover:text-emerald-500 transition-all cursor-pointer"
                            >
                              <span className="group-hover:translate-x-1 transition-transform">Capítulo 0{ch.number}: {ch.title}</span>
                              <div className={`flex-1 mx-2 border-b border-dashed ${
                                readerTheme === "light" ? "border-slate-300" : readerTheme === "sepia" ? "border-[#eedec6]" : "border-slate-800"
                              }`}></div>
                              <span>Pág 0{3 + i}</span>
                            </button>
                          ))}

                          <div className="flex justify-between items-baseline text-sm font-bold">
                            <span>Conclusão & Chamada Final</span>
                            <div className={`flex-1 mx-2 border-b border-dashed ${
                              readerTheme === "light" ? "border-slate-300" : readerTheme === "sepia" ? "border-[#eedec6]" : "border-slate-800"
                            }`}></div>
                            <span>Pág 0{3 + ebook.chapters.length}</span>
                          </div>
                        </div>

                        <div className={`mt-8 p-5 rounded-xl border ${
                          readerTheme === "light" 
                            ? "bg-slate-50 border-slate-100 text-slate-600" 
                            : readerTheme === "sepia" 
                              ? "bg-[#f5ebd2] border-[#eedec6] text-[#5c4934]" 
                              : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}>
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 block mb-1">Sinopse da Obra</span>
                          <p className="text-xs md:text-sm leading-relaxed italic">
                            "{ebook.synopsis}"
                          </p>
                        </div>
                      </div>
                    )}

                    {allPages[currentPageIdx]?.type === "chapter" && (
                      <div className="flex flex-col py-2 animate-fade-in">
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2 block">
                          Capítulo 0{ebook.chapters[allPages[currentPageIdx]?.chapterIdx || 0].number}
                        </span>
                        <h2 className="text-xl md:text-2xl font-black mb-6 leading-tight text-slate-900 dark:text-white">
                          {ebook.chapters[allPages[currentPageIdx]?.chapterIdx || 0].title}
                        </h2>
                        
                        <div className="max-h-[420px] overflow-y-auto pr-1">
                          <ChapterContentRenderer
                            content={ebook.chapters[allPages[currentPageIdx]?.chapterIdx || 0].content}
                            isReaderMode={true}
                          />
                        </div>
                      </div>
                    )}

                    {allPages[currentPageIdx]?.type === "conclusion" && (
                      <div className="flex flex-col py-2 animate-fade-in">
                        <h2 className="text-xl md:text-2xl font-black mb-6 leading-tight text-slate-900 dark:text-white">
                          Considerações Finais
                        </h2>
                        
                        <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-serif tracking-wide max-h-[220px] overflow-y-auto pr-1">
                          {ebook.conclusion}
                        </div>

                        {ebook.callToAction && (
                          <div className={`mt-6 border-l-4 p-4 rounded-r-xl ${
                            readerTheme === "light" 
                              ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm" 
                              : readerTheme === "sepia" 
                                ? "bg-[#e5f4ec] border-emerald-600 text-emerald-900" 
                                : "bg-emerald-950/20 border-emerald-500 text-emerald-300"
                          }`}>
                            <span className="text-[9px] font-bold uppercase tracking-widest opacity-85 block">Chamada Final</span>
                            <p className="text-xs md:text-sm leading-relaxed font-bold mt-1">
                              "{ebook.callToAction}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Page footer */}
                  <div className={`flex justify-between items-center pt-4 border-t ${
                    readerTheme === "light" ? "border-slate-100" : readerTheme === "sepia" ? "border-[#eedec6]" : "border-slate-800"
                  } text-[10px] uppercase font-mono tracking-wider opacity-60`}>
                    <span>Autor: {ebook.author}</span>
                    <span>{allPages[currentPageIdx]?.pageNumber} / {allPages.length}</span>
                  </div>
                </div>
              </div>

              {/* Right navigation float control for desktop */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={currentPageIdx === allPages.length - 1}
                  className="p-3 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-emerald-400 rounded-full border border-slate-800/80 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </main>

            {/* Bottom Menu: Navigation bar / Shortcuts */}
            <footer className="px-6 py-4 border-t border-slate-900 bg-slate-950 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
              {/* Quick Jump Dropdown */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider hidden sm:inline">Ir para:</span>
                <select
                  value={currentPageIdx}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    if (allPages[idx]) {
                      setCurrentPage(allPages[idx]);
                    }
                  }}
                  className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 transition w-full md:w-56"
                >
                  {allPages.map((p, idx) => (
                    <option key={p.id} value={idx}>
                      Pág 0{p.pageNumber}: {p.title.length > 28 ? p.title.substring(0, 28) + "..." : p.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Center navigation controls for mobile/tablet */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={goToPrevPage}
                  disabled={currentPageIdx === 0}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 rounded-xl border border-slate-800 transition disabled:opacity-30 disabled:pointer-events-none text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
                <span className="text-xs font-bold font-mono text-slate-400">
                  0{allPages[currentPageIdx]?.pageNumber} / 0{allPages.length}
                </span>
                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={currentPageIdx === allPages.length - 1}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 rounded-xl border border-slate-800 transition disabled:opacity-30 disabled:pointer-events-none text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick actions download */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={pdfDownloading}
                  className="flex-1 md:flex-none px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF Completo</span>
                </button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      </div>

      {/* Pillars Deepening & Regeneration Modal */}
      {showPillarsModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl relative">
            <button
              type="button"
              onClick={() => !isRegeneratingPillars && setShowPillarsModal(false)}
              disabled={isRegeneratingPillars}
              className="absolute -top-3 -right-3 z-20 bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full border border-slate-700 shadow-xl disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>

            {isRegeneratingPillars ? (
              <EbookGenerationProgress
                productName={ebook.title}
                niche={niche || ebook.coverPattern || "Geral"}
                targetAudience={targetAudience || "Geral"}
                isGenerating={isRegeneratingPillars}
                isRegenerating={true}
              />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    Auditoria & Regenerador 4 Pilares
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Expandir Conteúdo com a Matriz dos 4 Pilares
                </h3>
                <p className="text-xs md:text-sm text-slate-400 mt-1 mb-6 leading-relaxed">
                  Nossa IA irá re-sintetizar e aprofundar todos os capítulos do seu e-book garantindo a máxima densidade cognitiva na <strong className="text-indigo-400">Dimensão Mental</strong>, <strong className="text-rose-400">Dimensão Emocional</strong>, <strong className="text-amber-400">Dimensão Espiritual</strong> e <strong className="text-emerald-400">Tarefas Práticas Acionáveis</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  <div className="p-3 bg-slate-950 border border-indigo-500/20 rounded-xl">
                    <span className="text-xs font-bold text-indigo-400 block mb-1">🧠 1. Mental</span>
                    <p className="text-[11px] text-slate-400">Quebra de crenças limitantes e modelos mentais de alta clareza.</p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-rose-500/20 rounded-xl">
                    <span className="text-xs font-bold text-rose-400 block mb-1">❤️ 2. Emocional</span>
                    <p className="text-[11px] text-slate-400">Autodomínio, superação de medos e blindagem contra ansiedade.</p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-amber-500/20 rounded-xl">
                    <span className="text-xs font-bold text-amber-400 block mb-1">✨ 3. Espiritual</span>
                    <p className="text-[11px] text-slate-400">Propósito maior, ética inegociável e força interior sustentável.</p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-emerald-500/20 rounded-xl">
                    <span className="text-xs font-bold text-emerald-400 block mb-1">📋 4. Prático</span>
                    <p className="text-[11px] text-slate-400">Checklists imediatos, desafios de 15 min e prompts prontos.</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowPillarsModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleRegenerateWithPillars}
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 transition shadow-lg flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Construir em Tempo Real com IA 🚀</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
