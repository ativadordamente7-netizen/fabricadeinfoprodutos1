import React, { useState, useEffect } from "react";
import { 
  Download, 
  FileCode, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  Coins, 
  HelpCircle, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  Info,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Palette,
  Check,
  AlertCircle,
  AlertTriangle,
  UploadCloud,
  FileText,
  Link2,
  CheckSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SalesPageData, EbookData } from "../types";
import { getExportedHTML, generateSalesPageZIP } from "../utils/zipGenerator";
import { generateEbookPDF } from "../utils/pdfGenerator";

interface Props {
  salesPage: SalesPageData;
  setSalesPage: (salesPage: SalesPageData) => void;
  ebook: EbookData;
  setEbook: (ebook: EbookData) => void;
  checklist: { [key: string]: boolean };
  setChecklist: (checklist: { [key: string]: boolean }) => void;
  publishedUrl: string;
  setPublishedUrl: (url: string) => void;
  onFinish: () => void;
}

export default function PublishStep({ 
  salesPage, 
  setSalesPage,
  ebook, 
  setEbook,
  checklist, 
  setChecklist, 
  publishedUrl, 
  setPublishedUrl,
  onFinish
}: Props) {
  const [celebrate, setCelebrate] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingHtml, setDownloadingHtml] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  
  // Interactive Ebook Reader state
  const [currentPage, setCurrentPage] = useState(0); // 0: Capa, 1: Sumario/Intro, 2-5: Chapters, 6: Conclusion/CTA
  const [checkoutInput, setCheckoutInput] = useState(salesPage.checkoutLink || "");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string>("kiwify");

  const colors = [
    { id: "emerald", name: "Esmeralda", bg: "bg-emerald-900 border-emerald-500", hex: "#064e3b", accent: "#34d399" },
    { id: "indigo", name: "Índigo", bg: "bg-indigo-900 border-indigo-500", hex: "#1e1b4b", accent: "#818cf8" },
    { id: "rose", name: "Rubi Rose", bg: "bg-rose-900 border-rose-500", hex: "#4c0519", accent: "#fb7185" },
    { id: "slate", name: "Slate Black", bg: "bg-slate-900 border-slate-600", hex: "#0f172a", accent: "#94a3b8" },
    { id: "amber", name: "Âmbar Luxo", bg: "bg-amber-900 border-amber-500", hex: "#78350f", accent: "#fbbf24" },
  ];

  const checklistItems = [
    { id: "ebook_reviewed", label: "E-book revisado e aprovado no visualizador", essential: true },
    { id: "cover_created", label: "Capa do e-book personalizada e configurada", essential: true },
    { id: "pdf_downloaded", label: "PDF do e-book baixado no dispositivo", essential: true },
    { id: "kiwify_registered", label: "Produto cadastrado na plataforma de pagamento (ex: Kiwify)", essential: true },
    { id: "pdf_attached", label: "E-book PDF anexado para entrega automática aos compradores", essential: true },
    { id: "checkout_created", label: "Checkout oficial ativo na plataforma de vendas", essential: true },
    { id: "checkout_linked", label: "Link do checkout inserido e validado no gerador", essential: true },
    { id: "page_reviewed_desktop", label: "Página de vendas revisada e pronta", essential: false },
    { id: "html_zip_downloaded", label: "Arquivo da página exportado (ZIP ou HTML)", essential: true },
    { id: "page_published_netlify", label: "Página de vendas no ar (publicada no Netlify)", essential: true },
    { id: "public_url_tested", label: "Link público acessado e testado com sucesso", essential: true },
    { id: "checkout_buttons_tested", label: "Botões direcionando perfeitamente ao checkout", essential: true },
    { id: "prices_checked", label: "Informações de preço e ofertas conferidas", essential: false },
    { id: "guarantee_checked", label: "Termos de garantia conferidos", essential: false },
    { id: "support_checked", label: "Contato de suporte/WhatsApp conferido", essential: false },
  ];

  // Sync checklist from actions automatically
  const updateChecklistItem = (id: string, value: boolean) => {
    if (checklist[id] !== value) {
      setChecklist({
        ...checklist,
        [id]: value
      });
    }
  };

  const handleToggleCheck = (id: string) => {
    setChecklist({
      ...checklist,
      [id]: !checklist[id]
    });
  };

  // Check if all essential items are checked
  const essentialIds = checklistItems.filter(item => item.essential).map(item => item.id);
  const isReadyToSell = essentialIds.every(id => checklist[id] === true);

  // Validate and Save Checkout URL
  useEffect(() => {
    if (!checkoutInput) {
      setCheckoutError("Insira o link de checkout gerado para atualizar os botões.");
      updateChecklistItem("checkout_linked", false);
      return;
    }

    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?/i;
    const isHttps = checkoutInput.startsWith("https://") || checkoutInput.startsWith("http://");

    if (!urlPattern.test(checkoutInput) || !isHttps) {
      setCheckoutError("O link de checkout deve começar com http:// ou https://");
      updateChecklistItem("checkout_linked", false);
    } else {
      setCheckoutError(null);
      // Propagate the checkout link directly to salesPage state
      if (salesPage.checkoutLink !== checkoutInput) {
        setSalesPage({
          ...salesPage,
          checkoutLink: checkoutInput
        });
      }
      updateChecklistItem("checkout_linked", true);
      updateChecklistItem("checkout_created", true);
    }
  }, [checkoutInput]);

  // Sync Cover styling checks
  useEffect(() => {
    if (ebook.coverStyle || ebook.coverColor) {
      updateChecklistItem("cover_created", true);
    }
  }, [ebook.coverStyle, ebook.coverColor, ebook.title, ebook.subtitle, ebook.author]);

  // Sync published URL checks
  useEffect(() => {
    if (publishedUrl && (publishedUrl.startsWith("http://") || publishedUrl.startsWith("https://"))) {
      updateChecklistItem("page_published_netlify", true);
    } else {
      updateChecklistItem("page_published_netlify", false);
    }
  }, [publishedUrl]);

  const handleDownloadOnlyHTML = () => {
    setDownloadingHtml(true);
    setTimeout(() => {
      const htmlContent = getExportedHTML(salesPage, ebook);
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "index.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadingHtml(false);
      updateChecklistItem("html_zip_downloaded", true);
    }, 1200);
  };

  const handleDownloadZIP = async () => {
    setDownloadingZip(true);
    try {
      await generateSalesPageZIP(salesPage, ebook);
      updateChecklistItem("html_zip_downloaded", true);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleDownloadPDF = () => {
    setPdfDownloading(true);
    setTimeout(() => {
      try {
        generateEbookPDF(ebook);
        updateChecklistItem("pdf_downloaded", true);
        updateChecklistItem("ebook_reviewed", true);
      } catch (err) {
        console.error(err);
      } finally {
        setPdfDownloading(false);
      }
    }, 1500);
  };

  const handleTestPublishedUrl = () => {
    if (publishedUrl) {
      const targetUrl = publishedUrl.startsWith("http") ? publishedUrl : `https://${publishedUrl}`;
      window.open(targetUrl, "_blank", "noopener,noreferrer");
      updateChecklistItem("public_url_tested", true);
      updateChecklistItem("checkout_buttons_tested", true);
    }
  };

  const handleFinalSuccess = () => {
    if (isReadyToSell) {
      setCelebrate(true);
      onFinish();
    }
  };

  const handleFieldChange = (field: keyof EbookData, value: any) => {
    setEbook({ ...ebook, [field]: value });
  };

  const selectedColorOption = colors.find(c => c.id === ebook.coverColor) || colors[3];
  const activeStyle = ebook.coverStyle || "minimalist";

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12 animate-fade-in">
      
      {/* HEADER PRINCIPAL DA ETAPA */}
      <div className="text-center bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          Etapa 3 de 4 • Central de Lançamento
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-3">
          Publique & Comece a Faturar! 🚀
        </h2>
        <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-2xl mx-auto leading-relaxed">
          Tudo o que você produziu foi consolidado nesta central. Siga os passos lógicos e interativos para baixar seu e-book em PDF, conectar seu link de checkout e colocar sua página de vendas profissional no ar.
        </p>
      </div>

      {celebrate && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 p-6 md:p-8 rounded-2xl text-center shadow-2xl animate-fade-in flex flex-col items-center gap-3">
          <Sparkles className="w-16 h-16 animate-bounce" />
          <h3 className="text-2xl font-extrabold">Parabéns! Seu Negócio Digital está No Ar! 🎉</h3>
          <p className="text-sm max-w-xl leading-relaxed font-medium">
            Você acabou de criar e publicar seu infoproduto completo! Você estruturou uma cópia persuasiva de alta conversão, personalizou e compilou o livro digital oficial, integrou um checkout ativo e hospedou gratuitamente a página. Boas vendas e muito sucesso na sua jornada!
          </p>
          <button
            type="button"
            onClick={() => setCelebrate(false)}
            className="mt-3 bg-slate-950 text-emerald-400 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-slate-900 transition shadow-lg active:scale-95"
          >
            Entendido, fechar aviso!
          </button>
        </div>
      )}

      {/* SEÇÃO 1: ACESSO AO E-BOOK E EDITORS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LADO ESQUERDO: CONTROLES DE DESIGN E EDIÇÃO DA CAPA (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
            <Palette className="w-4.5 h-4.5 text-emerald-400" />
            <h3 className="font-extrabold text-sm text-white">Seu E-book está Pronto!</h3>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed">
            Seu conteúdo foi gerado e revisado com IA. Escolha o estilo da capa ideal, ajuste as cores, o título e baixe o arquivo em PDF pronto para venda.
          </p>

          {/* COVER STYLE SELECTOR */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estilo Temático da Capa</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "minimalist", label: "Minimalista", desc: "Clássico & Clean" },
                { id: "modern", label: "Moderno", desc: "Geométrico & Bold" },
                { id: "emotional", label: "Emocionante", desc: "Profundo & Teaser" }
              ].map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleFieldChange("coverStyle", st.id)}
                  className={`py-2 px-1.5 rounded-xl border flex flex-col items-center justify-center text-center gap-0.5 transition ${
                    activeStyle === st.id
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold"
                      : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-750"
                  }`}
                >
                  <span className="text-xs">{st.label}</span>
                  <span className="text-[8px] opacity-70">{st.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* PALETA DE COR */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Paleta de Cores</label>
            <div className="flex gap-2.5 items-center">
              {colors.map(col => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => handleFieldChange("coverColor", col.id)}
                  title={col.name}
                  className={`w-7 h-7 rounded-full border-2 transition ${col.bg} ${
                    ebook.coverColor === col.id ? "ring-2 ring-emerald-400 scale-110" : "scale-100 opacity-80"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* TEXT EDITORS FOR COVER */}
          <div className="flex flex-col gap-3 border-t border-slate-800/60 pt-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Título Oficial</label>
              <input
                type="text"
                value={ebook.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Subtítulo Promissor</label>
              <input
                type="text"
                value={ebook.subtitle}
                onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nome do Autor</label>
              <input
                type="text"
                value={ebook.author}
                onChange={(e) => handleFieldChange("author", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* COMPILAR PDF TRGGER BUTTON */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={pdfDownloading}
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {pdfDownloading ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                <span>Compilando PDF Oficial...</span>
              </>
            ) : (
              <>
                <Download className="w-4.5 h-4.5" />
                <span>Baixar E-book em PDF 📖</span>
              </>
            )}
          </button>
        </div>

        {/* LADO DIREITO: SIMULADOR DIGITAL E LEITOR DO E-BOOK (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[500px]">
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03),transparent)] pointer-events-none" />

          {/* PAGE READER CONTAINER */}
          <div className="flex-1 flex flex-col justify-center items-center py-4">
            <AnimatePresence mode="wait">
              
              {currentPage === 0 && (
                /* CAPA DIGITAL RENDER */
                <motion.div
                  key="cover-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center gap-5 text-center max-w-sm w-full"
                >
                  <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Página 1 de 7 • Capa Ativa
                  </span>

                  {/* Elegant Simulated Cover */}
                  <div className="relative w-[190px] h-[270px] perspective-[1000px] my-3 cursor-pointer group transition-transform duration-500 hover:scale-[1.03]">
                    {/* Thickness spine effect */}
                    <div className="absolute left-0 top-0 w-[14px] h-full bg-black/40 rounded-l-md z-10 transform -rotateY-90 origin-left"></div>
                    
                    {/* Render according to Style */}
                    {activeStyle === "minimalist" ? (
                      <div className="absolute inset-0 w-full h-full bg-[#fcfbf9] text-slate-900 p-5 rounded-r-xl shadow-[10px_15px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between items-center text-center border-l border-white/10 z-20">
                        {/* Fine Border outline */}
                        <div className="absolute inset-2 border-2 border-dashed opacity-25" style={{ borderColor: selectedColorOption.hex }}></div>
                        <div className="absolute inset-1.5 border" style={{ borderColor: selectedColorOption.hex }}></div>
                        
                        <div className="w-full z-30 pt-2 flex flex-col items-center">
                          <div className="w-6 h-0.5 mb-2.5" style={{ backgroundColor: selectedColorOption.hex }}></div>
                          <span className="text-[7px] tracking-[2px] font-bold text-slate-400 uppercase font-mono">CONTEÚDO PREMIUM</span>
                        </div>

                        <div className="w-full z-30 flex flex-col items-center">
                          <h3 className="text-xs font-black tracking-tight leading-tight uppercase line-clamp-3 text-slate-900" style={{ fontFamily: "serif" }}>
                            {ebook.title || "Sem Título"}
                          </h3>
                          <div className="w-8 h-[1px] bg-slate-300 my-2"></div>
                          <p className="text-[8px] text-slate-500 italic max-h-[40px] overflow-hidden leading-tight font-medium">
                            {ebook.subtitle || "Sem Subtítulo"}
                          </p>
                        </div>

                        <div className="w-full z-30 pb-2 flex flex-col items-center">
                          <div className="w-1.5 h-1.5 rounded-full mb-1.5" style={{ backgroundColor: selectedColorOption.accent }}></div>
                          <span className="text-[8px] font-bold text-slate-700 tracking-wide font-mono truncate max-w-[130px]">{ebook.author || "Especialista"}</span>
                        </div>
                      </div>
                    ) : activeStyle === "emotional" ? (
                      <div 
                        style={{ backgroundColor: selectedColorOption.hex }}
                        className="absolute inset-0 w-full h-full text-white p-5 rounded-r-xl shadow-[10px_15px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between items-start text-left border-l border-white/10 z-20 overflow-hidden"
                      >
                        {/* Subtle concentric circles in bg */}
                        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/5 border border-white/5"></div>
                        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/5 border border-white/5"></div>

                        <div className="w-full z-30">
                          <span className="text-[8px] font-bold tracking-[1.5px] uppercase font-mono" style={{ color: selectedColorOption.accent }}>
                            ● MANUAL DE TRANSFORMAÇÃO
                          </span>
                        </div>

                        <div className="w-full z-30">
                          <h3 className="text-sm font-extrabold tracking-tight leading-tight uppercase line-clamp-3">
                            {ebook.title || "Sem Título"}
                          </h3>
                          <p className="text-[8px] opacity-80 italic font-medium leading-tight mt-1.5 border-l border-white/20 pl-2">
                            {ebook.subtitle || "Sem Subtítulo"}
                          </p>
                        </div>

                        {/* Synopsis mini quote badge */}
                        <div className="w-full bg-black/15 border border-white/10 rounded p-2 text-[7px] text-slate-200 leading-snug">
                          "{ebook.synopsis ? ebook.synopsis.substring(0, 75) + "..." : "Uma virada de chave para sua vida..."}"
                        </div>

                        <div className="w-full z-30 mt-auto pt-2 border-t border-white/10 flex flex-col">
                          <span className="text-[6px] uppercase tracking-wider font-mono opacity-60">Criador do Método</span>
                          <span className="text-[9px] font-extrabold truncate max-w-[150px]">{ebook.author || "Especialista"}</span>
                        </div>
                      </div>
                    ) : (
                      /* MODERN */
                      <div 
                        style={{ backgroundColor: selectedColorOption.hex }}
                        className="absolute inset-0 w-full h-full text-white p-5 rounded-r-xl shadow-[10px_15px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between items-start text-left border-l border-white/10 z-20"
                      >
                        {/* Bold stripe design */}
                        <div className="absolute top-0 right-8 w-6 h-full bg-black/20 transform -skew-x-12 z-10"></div>
                        <div className="absolute bottom-12 left-0 w-full h-1" style={{ backgroundColor: selectedColorOption.accent }}></div>
                        
                        <div className="w-full z-30">
                          <span className="text-[7px] font-bold tracking-[2px] uppercase font-mono" style={{ color: selectedColorOption.accent }}>E-BOOK OFICIAL</span>
                        </div>

                        <div className="w-full z-30">
                          <h3 className="text-xs font-black tracking-tight leading-tight uppercase line-clamp-3 mt-1">
                            {ebook.title || "Sem Título"}
                          </h3>
                          <p className="text-[8px] text-slate-300 italic font-medium leading-tight mt-1 max-h-[35px] overflow-hidden">
                            {ebook.subtitle || "Sem Subtítulo"}
                          </p>
                        </div>

                        <div className="w-full z-30 mt-auto pt-2 border-t border-white/10 flex flex-col">
                          <span className="text-[6px] uppercase tracking-wider opacity-60">Escrito Por</span>
                          <span className="text-[9px] font-black truncate max-w-[150px]">{ebook.author || "Especialista"}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-white leading-tight">{ebook.title}</h2>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">{ebook.subtitle}</p>
                  </div>
                </motion.div>
              )}

              {currentPage === 1 && (
                /* SUMARIO & INTRODUCAO PREVIEW */
                <motion.div
                  key="summary-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white text-slate-800 rounded-2xl p-5 md:p-6 max-w-md w-full shadow-lg leading-relaxed border border-slate-200 flex flex-col min-h-[380px] justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                      <span className="text-[9px] font-bold font-mono text-emerald-600 uppercase tracking-widest">Pág 02 • Sumário</span>
                      <span className="text-[10px] text-slate-400">Manual Digital</span>
                    </div>
                    
                    <h3 className="text-base font-extrabold text-slate-900 mt-3.5">Estrutura de Conteúdo</h3>
                    
                    <div className="mt-4 flex flex-col gap-2.5">
                      <div className="flex justify-between items-baseline text-xs font-semibold text-slate-700">
                        <span>Introdução & Sinopse</span>
                        <div className="flex-1 mx-2 border-b border-dashed border-slate-300"></div>
                        <span>Pág 02</span>
                      </div>

                      {ebook.chapters.map((ch, i) => (
                        <div key={i} className="flex justify-between items-baseline text-[11px] text-slate-600">
                          <span className="truncate max-w-[240px]">Capítulo 0{ch.number}: {ch.title}</span>
                          <div className="flex-1 mx-2 border-b border-dashed border-slate-200"></div>
                          <span>Pág 0{3 + i}</span>
                        </div>
                      ))}

                      <div className="flex justify-between items-baseline text-xs font-semibold text-slate-700">
                        <span>Conclusão & Chamada Final</span>
                        <div className="flex-1 mx-2 border-b border-dashed border-slate-300"></div>
                        <span>Pág 07</span>
                      </div>
                    </div>

                    <div className="mt-4 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono">Sinopse do E-book</span>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-1 italic font-medium line-clamp-3">
                        "{ebook.synopsis}"
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2.5 text-[9px] text-slate-400 text-center uppercase tracking-wider font-mono">
                    Todos os direitos reservados • {ebook.author}
                  </div>
                </motion.div>
              )}

              {currentPage >= 2 && currentPage <= 5 && (
                /* CAPITULOS PREVIEW */
                <motion.div
                  key={`chapter-view-${currentPage}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white text-slate-800 rounded-2xl p-5 md:p-6 max-w-md w-full shadow-lg leading-relaxed border border-slate-200 flex flex-col min-h-[380px] justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3.5">
                      <span className="text-[9px] font-bold font-mono text-emerald-600 uppercase tracking-widest">
                        Capítulo 0{ebook.chapters[currentPage - 2]?.number || 1}
                      </span>
                      <span className="text-xs text-slate-400">Pág 0{currentPage + 1}</span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                      {ebook.chapters[currentPage - 2]?.title || "Capítulo"}
                    </h3>
                    
                    <div className="text-[11px] text-slate-600 mt-3 leading-relaxed whitespace-pre-wrap max-h-[190px] overflow-y-auto pr-1">
                      {ebook.chapters[currentPage - 2]?.content || "Conteúdo do capítulo..."}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2.5 text-[9px] text-slate-400 flex justify-between uppercase tracking-wider font-mono">
                    <span>{ebook.author}</span>
                    <span className="truncate max-w-[140px]">{ebook.title}</span>
                  </div>
                </motion.div>
              )}

              {currentPage === 6 && (
                /* CONCLUSAO & CTA PREVIEW */
                <motion.div
                  key="conclusion-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white text-slate-800 rounded-2xl p-5 md:p-6 max-w-md w-full shadow-lg leading-relaxed border border-slate-200 flex flex-col min-h-[380px] justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3.5">
                      <span className="text-[9px] font-bold font-mono text-emerald-600 uppercase tracking-widest">
                        Conclusão
                      </span>
                      <span className="text-xs text-slate-400">Pág 07</span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                      Considerações Finais do Autor
                    </h3>
                    
                    <div className="text-[11px] text-slate-600 mt-2.5 leading-relaxed whitespace-pre-wrap max-h-[120px] overflow-y-auto pr-1">
                      {ebook.conclusion}
                    </div>

                    {ebook.callToAction && (
                      <div className="mt-3.5 bg-emerald-50 border-l-4 border-emerald-500 p-2.5 rounded-r-xl">
                        <span className="text-[8px] font-bold text-emerald-800 uppercase tracking-wider font-mono">Chamada de Ação Final (CTA)</span>
                        <p className="text-[10px] text-emerald-700 leading-relaxed font-semibold mt-0.5">
                          "{ebook.callToAction}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-2.5 text-[9px] text-slate-400 text-center uppercase tracking-wider font-mono">
                    FIM DO LIVRO DIGITAL • {ebook.author}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* READER PAGINATION CONTROLS */}
          <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-2">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                currentPage === 0 
                  ? "text-slate-600 cursor-not-allowed" 
                  : "bg-slate-800 text-slate-200 hover:bg-slate-750"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs font-mono text-slate-400">
              Pág. {currentPage + 1} de 7
            </span>

            <button
              type="button"
              disabled={currentPage === 6}
              onClick={() => setCurrentPage(prev => Math.min(6, prev + 1))}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                currentPage === 6 
                  ? "text-slate-600 cursor-not-allowed" 
                  : "bg-slate-800 text-slate-200 hover:bg-slate-750"
              }`}
            >
              <span>Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* SEÇÃO 2: CENTRAL DE PUBLICAÇÃO & CONFIGURAÇÃO DO CHECKOUT */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col gap-6">
        <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
          <Coins className="w-5 h-5 text-emerald-400" />
          <h3 className="font-extrabold text-sm text-white">Central de Publicação & Checkout</h3>
        </div>

        {/* TIMELINE DE ETAPAS PRÁTICAS */}
        <div className="flex flex-col gap-5">
          
          {/* PASSO 1: KIWIFY */}
          <div className="border border-slate-800 bg-slate-950/40 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveAccordion(activeAccordion === "kiwify" ? "" : "kiwify")}
              className="w-full flex items-center justify-between p-4 bg-slate-900/40 text-left hover:bg-slate-900 transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full flex items-center justify-center font-mono">1</span>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-white">Cadastrar Produto na Kiwify</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Registre seu produto na plataforma de pagamento para ativação automática</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeAccordion === "kiwify" ? "rotate-180" : ""}`} />
            </button>

            {activeAccordion === "kiwify" && (
              <div className="p-4 border-t border-slate-850 bg-slate-950/60 leading-relaxed text-xs text-slate-400 flex flex-col gap-3 animate-slide-down">
                <strong className="text-slate-300">Siga o passo a passo simplificado para cadastrar seu infoproduto:</strong>
                
                <ol className="list-decimal pl-5 flex flex-col gap-2">
                  <li>
                    Acesse o site oficial da <a href="https://www.kiwify.com.br" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-bold inline-flex items-center gap-0.5">Kiwify <ExternalLink className="w-3 h-3" /></a> e faça login (ou registre-se gratuitamente em 1 minuto).
                  </li>
                  <li>
                    Vá no menu superior esquerdo em <strong className="text-slate-200">"Produtos"</strong> &rarr; <strong className="text-slate-200">"Criar Produto"</strong>.
                  </li>
                  <li>
                    Preencha as informações básicas do produto:
                    <ul className="list-disc pl-5 mt-1 text-slate-500 flex flex-col gap-1">
                      <li><strong className="text-slate-400">Nome do produto:</strong> {ebook.title}</li>
                      <li><strong className="text-slate-400">Preço:</strong> Defina o mesmo valor configurado na sua página (ex: {salesPage.pricing.discountedPrice})</li>
                      <li><strong className="text-slate-400">Tipo de entrega:</strong> Selecione "Entrega automática via e-mail ou área de membros".</li>
                    </ul>
                  </li>
                  <li>
                    Na etapa de entrega de conteúdo, clique em <strong className="text-slate-250">"Fazer upload do arquivo"</strong> e selecione o <strong className="text-emerald-400">PDF Oficial do E-book</strong> que você acabou de baixar no seu dispositivo.
                  </li>
                  <li>
                    Clique em salvar. Vá na aba <strong className="text-slate-200">"Links"</strong>, localize a oferta criada e copie o <strong className="text-emerald-400 font-bold">Link de Checkout Oficial</strong> (ex: <code className="bg-slate-900 border border-slate-800 px-1 rounded text-emerald-400">https://pay.kiwify.com.br/...</code>).
                  </li>
                </ol>

                <div className="flex gap-2.5 mt-2">
                  <a
                    href="https://dashboard.kiwify.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 hover:bg-slate-750 text-slate-100 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1 border border-slate-700"
                  >
                    <span>Ir para o Dashboard da Kiwify</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      updateChecklistItem("kiwify_registered", true);
                      updateChecklistItem("pdf_attached", true);
                      setActiveAccordion("checkout");
                    }}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1 border border-emerald-500/20"
                  >
                    <span>Já cadastrei o produto</span>
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PASSO 2: CONFIGURAR CHECKOUT LINK */}
          <div className="border border-slate-800 bg-slate-950/40 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveAccordion(activeAccordion === "checkout" ? "" : "checkout")}
              className="w-full flex items-center justify-between p-4 bg-slate-900/40 text-left hover:bg-slate-900 transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full flex items-center justify-center font-mono">2</span>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-white">Configurar o Link do Checkout no Site</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Insira o link oficial de pagamento para atualizar os botões de compra da página automaticamente</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeAccordion === "checkout" ? "rotate-180" : ""}`} />
            </button>

            {activeAccordion === "checkout" && (
              <div className="p-4 border-t border-slate-850 bg-slate-950/60 flex flex-col gap-3 animate-slide-down">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Insira o link de pagamento que você copiou da Kiwify (ou de outra plataforma, como Hotmart, Monetizze, Eduzz, etc.). O gerador irá injetar esse link dinamicamente em todos os botões de ação do HTML para garantir que o comprador vá para a tela de pagamento segura.
                </p>

                <div className="max-w-xl">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Link de Checkout Oficial</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={checkoutInput}
                        onChange={(e) => setCheckoutInput(e.target.value)}
                        placeholder="https://pay.kiwify.com.br/xxxxx"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-emerald-500 transition"
                      />
                      <Link2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* VALIDATION NOTIFICATIONS */}
                  <div className="mt-2.5">
                    {checkoutError ? (
                      <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex gap-1.5 items-center">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{checkoutError}</span>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex gap-1.5 items-center">
                        <Check className="w-3.5 h-3.5 shrink-0 bg-emerald-500 text-slate-950 rounded-full p-0.5" />
                        <span>Link do checkout injetado e ativo com sucesso nos botões de compra!</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-1">
                  <button
                    type="button"
                    disabled={!!checkoutError}
                    onClick={() => setActiveAccordion("export")}
                    className={`font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1 border ${
                      !checkoutError 
                        ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20" 
                        : "bg-slate-900 text-slate-500 border-slate-850 cursor-not-allowed"
                    }`}
                  >
                    <span>Ir para o próximo passo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PASSO 3: EXPORTAÇÃO DA PAGINA */}
          <div className="border border-slate-800 bg-slate-950/40 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveAccordion(activeAccordion === "export" ? "" : "export")}
              className="w-full flex items-center justify-between p-4 bg-slate-900/40 text-left hover:bg-slate-900 transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full flex items-center justify-center font-mono">3</span>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-white">Exportar e Baixar a Página de Vendas</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Exporte os arquivos HTML finais limpos, rápidos e otimizados para hospedagem gratuita</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeAccordion === "export" ? "rotate-180" : ""}`} />
            </button>

            {activeAccordion === "export" && (
              <div className="p-4 border-t border-slate-850 bg-slate-950/60 flex flex-col gap-3 animate-slide-down">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Baixe a cópia da sua página de vendas. O arquivo gerado é totalmente estático (HTML puro com Tailwind via CDN), ultrarrápido de carregar, 100% responsivo para celular e computador e não possui nenhuma dependência ou chave de API local, garantindo máxima segurança.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mt-1">
                  
                  {/* ZIP BLOCK */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between items-start gap-3">
                    <div>
                      <h5 className="font-bold text-xs text-white flex items-center gap-1">
                        <FileCode className="w-4 h-4 text-emerald-400" />
                        Opção 1: Pacote Completo (ZIP)
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                        Recomendado. Inclui o arquivo <code className="bg-slate-950 px-1 text-slate-300">index.html</code> e um guia impresso de boas práticas de vendas.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadZIP}
                      disabled={downloadingZip}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1 transition active:scale-95 disabled:opacity-50"
                    >
                      {downloadingZip ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Empacotando ZIP...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Baixar ZIP Completo</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* HTML BLOCK */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between items-start gap-3">
                    <div>
                      <h5 className="font-bold text-xs text-white flex items-center gap-1">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        Opção 2: Apenas index.html
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                        Download direto do arquivo único de página para usuários que desejam rápida manipulação ou arrastar único para Netlify.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadOnlyHTML}
                      disabled={downloadingHtml}
                      className="w-full bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition active:scale-95 disabled:opacity-50"
                    >
                      {downloadingHtml ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Compilando HTML...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Baixar index.html</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setActiveAccordion("netlify")}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1 border border-emerald-500/20"
                  >
                    <span>Ir para o Netlify</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PASSO 4: PUBLICAR NO NETLIFY */}
          <div className="border border-slate-800 bg-slate-950/40 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveAccordion(activeAccordion === "netlify" ? "" : "netlify")}
              className="w-full flex items-center justify-between p-4 bg-slate-900/40 text-left hover:bg-slate-900 transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full flex items-center justify-center font-mono">4</span>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-white">Publicação Gratuita na Internet (Netlify)</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Coloque seu site no ar gratuitamente sem pagar hospedagem em menos de 10 segundos</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeAccordion === "netlify" ? "rotate-180" : ""}`} />
            </button>

            {activeAccordion === "netlify" && (
              <div className="p-4 border-t border-slate-850 bg-slate-950/60 leading-relaxed text-xs text-slate-400 flex flex-col gap-3.5 animate-slide-down">
                <strong className="text-slate-300">Como colocar seu site no ar gratuitamente no Netlify por Arrasto e Soltura (Drag & Drop):</strong>
                
                <ol className="list-decimal pl-5 flex flex-col gap-2">
                  <li>
                    Descompacte o arquivo ZIP que você baixou (caso tenha escolhido a Opção 1).
                  </li>
                  <li>
                    Abra o site de deploy manual oficial do <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-bold inline-flex items-center gap-0.5">Netlify Drop <ExternalLink className="w-3 h-3" /></a> no seu navegador.
                  </li>
                  <li>
                    Basta <strong className="text-slate-200">arrastar e soltar a pasta descompactada</strong> (ou diretamente o arquivo <code className="bg-slate-900 border border-slate-800 px-1 rounded text-emerald-400">index.html</code>) na área pontilhada azul indicada pelo Netlify.
                  </li>
                  <li>
                    O Netlify irá hospedar, processar e colocar seu site online em cerca de <strong className="text-slate-200">5 segundos</strong>, fornecendo um link público seguro (ex: <code className="bg-slate-900 border border-slate-800 px-1 rounded text-slate-300">https://seu-infoproduto.netlify.app</code>).
                  </li>
                  <li>
                    Copie esse link gerado no Netlify e cole no campo de texto abaixo para salvar o projeto completo no seu painel.
                  </li>
                </ol>

                <div className="max-w-xl border-t border-slate-800/80 pt-3.5 mt-1 flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Link Público Gerado no Netlify</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={publishedUrl}
                        onChange={(e) => setPublishedUrl(e.target.value)}
                        placeholder="https://meu-infoproduto.netlify.app"
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-emerald-500 transition"
                      />
                      <button
                        type="button"
                        onClick={handleTestPublishedUrl}
                        disabled={!publishedUrl}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                          publishedUrl 
                            ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer" 
                            : "bg-slate-850 text-slate-600 border border-slate-850/50 cursor-not-allowed pointer-events-none"
                        }`}
                      >
                        <span>Testar Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* SEÇÃO 3: CHECKLIST DE LANÇAMENTO COMERCIAL */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
        <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3.5 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Checklist de Lançamento Comercial Ativo
        </h3>

        <p className="text-xs text-slate-400 leading-normal mb-4">
          Alguns itens são marcados como <strong className="text-amber-500 font-bold uppercase">Essenciais para Venda</strong> e são atualizados automaticamente quando você realiza a ação correspondente acima. Complete-os para liberar o encerramento oficial do projeto.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklistItems.map((item) => {
            const isChecked = checklist[item.id] === true;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleToggleCheck(item.id)}
                className={`text-left p-2.5 rounded-xl border flex items-center gap-3 transition ${
                  isChecked
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-medium shadow-[0_2px_10px_rgba(16,185,129,0.02)]"
                    : "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800"
                }`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                  isChecked ? "bg-emerald-500 border-emerald-500 text-slate-950" : "border-slate-700 bg-slate-900"
                }`}>
                  {isChecked && <span className="font-bold text-[10px]">✓</span>}
                </div>
                
                <div className="flex-1 min-w-0">
                  <span className="text-xs leading-snug block truncate">{item.label}</span>
                  {item.essential && (
                    <span className="text-[8px] font-bold font-mono uppercase tracking-wider text-amber-500 mt-0.5 block">Essencial para Venda</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Final Trigger Button with dynamic unlocked status */}
        <div className="border-t border-slate-800/80 pt-5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Complete todas as etapas marcadas como <strong className="text-amber-500 font-bold uppercase">Essenciais</strong> para liberar seu produto.</span>
          </div>

          <button
            type="button"
            disabled={!isReadyToSell}
            onClick={handleFinalSuccess}
            className={`w-full sm:w-auto font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
              isReadyToSell
                ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-emerald-500/20"
                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
            }`}
          >
            <CheckCircle2 className="w-4.5 h-4.5" />
            <span>Meu Produto está Pronto para Vender!</span>
          </button>
        </div>

      </div>

    </div>
  );
}
