import React, { useState } from "react";
import { 
  TrendingUp, 
  Settings, 
  Smartphone, 
  Monitor, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown, 
  RotateCcw, 
  Check, 
  ArrowRight, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Sparkles,
  DollarSign,
  User,
  ShieldCheck,
  PhoneCall,
  HelpCircle,
  Video,
  VideoOff,
  Tv,
  ExternalLink,
  AlertTriangle,
  Play,
  VolumeX
} from "lucide-react";
import { SalesPageData, EbookData } from "../types";
import { processVideoSource } from "../utils/videoHelper";
import { motion } from "motion/react";
import CopywritingTooltip from "./CopywritingTooltip";
import { SALES_PAGE_COPY_TIPS } from "../utils/copywritingTips";

interface Props {
  salesPage: SalesPageData | null;
  setSalesPage: (salesPage: SalesPageData) => void;
  ebook: EbookData;
  onGenerateSalesPage: (params: {
    originalPrice: string;
    discountedPrice: string;
    expertName: string;
    expertBio: string;
    guaranteeDays: string;
    checkoutLink: string;
    supportWhatsapp: string;
    themeColor: string;
    vslEnabled?: boolean;
    vslPlatform?: "youtube" | "vimeo" | "panda" | "other";
    vslUrl?: string;
    vslEmbedCode?: string;
    vslTitle?: string;
    vslSubtitle?: string;
    vslShowCtaBelow?: boolean;
    vslCtaText?: string;
    vslAutoplayMuted?: boolean;
    vslVisible?: boolean;
  }) => Promise<void>;
  loading: boolean;
  loadingMessage: string;
  onNextStep: () => void;
}

export default function SalesPageStep({ 
  salesPage, 
  setSalesPage, 
  ebook, 
  onGenerateSalesPage, 
  loading, 
  loadingMessage, 
  onNextStep 
}: Props) {
  // Input fields for configuring the page before generation
  const [originalPrice, setOriginalPrice] = useState("R$ 197,00");
  const [discountedPrice, setDiscountedPrice] = useState("R$ 97,00");
  const [expertName, setExpertName] = useState(ebook.author || "Especialista");
  const [expertBio, setExpertBio] = useState("Empresário e especialista focado em destravar resultados práticos para o público.");
  const [guaranteeDays, setGuaranteeDays] = useState("7");
  const [checkoutLink, setCheckoutLink] = useState("");
  const [supportWhatsapp, setSupportWhatsapp] = useState("");
  const [themeColor, setThemeColor] = useState<"emerald" | "indigo" | "rose" | "slate">("emerald");

  // VSL State for pre-generation
  const [vslEnabled, setVslEnabled] = useState(false);
  const [vslPlatform, setVslPlatform] = useState<"youtube" | "vimeo" | "panda" | "other">("youtube");
  const [vslUrl, setVslUrl] = useState("");
  const [vslEmbedCode, setVslEmbedCode] = useState("");
  const [vslTitle, setVslTitle] = useState("Assista ao vídeo e descubra como funciona");
  const [vslSubtitle, setVslSubtitle] = useState("Depois de assistir, clique no botão abaixo para garantir seu acesso.");
  const [vslShowCtaBelow, setVslShowCtaBelow] = useState(true);
  const [vslCtaText, setVslCtaText] = useState("QUERO GARANTIR MINHA VAGA AGORA");
  const [vslAutoplayMuted, setVslAutoplayMuted] = useState(false);
  const [vslError, setVslError] = useState<string | null>(null);

  // Local UX state
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [sidebarTab, setSidebarTab] = useState<"config" | "sections" | "edit_copy" | "vsl">("config");
  const [checkoutWarning, setCheckoutWarning] = useState<string | null>(null);

  // Backup of initial AI copy for restoration feature
  const [aiBackup, setAiBackup] = useState<SalesPageData | null>(null);

  const handleCheckoutChange = (val: string) => {
    setCheckoutLink(val);
    if (val && !val.startsWith("https://") && !val.startsWith("http://")) {
      setCheckoutWarning("O link de checkout deve começar com https:// ou http://");
    } else {
      setCheckoutWarning(null);
    }
    // Auto sync back to state if salespage is active
    if (salesPage) {
      setSalesPage({ ...salesPage, checkoutLink: val });
    }
  };

  const triggerGenerate = async () => {
    if (!checkoutLink) {
      setCheckoutWarning("Insira o link do checkout antes de publicar sua página. É esse link que levará seus clientes até o pagamento.");
    }
    await onGenerateSalesPage({
      originalPrice,
      discountedPrice,
      expertName,
      expertBio,
      guaranteeDays,
      checkoutLink,
      supportWhatsapp,
      themeColor,
      vslEnabled,
      vslPlatform,
      vslUrl,
      vslEmbedCode,
      vslTitle,
      vslSubtitle,
      vslShowCtaBelow,
      vslCtaText,
      vslAutoplayMuted,
      vslVisible: true
    });
  };

  // Section visibility control
  const toggleVisibility = (sectionId: keyof SalesPageData["sectionsVisibility"]) => {
    if (!salesPage) return;
    const visibility = { ...salesPage.sectionsVisibility };
    visibility[sectionId] = !visibility[sectionId];
    setSalesPage({ ...salesPage, sectionsVisibility: visibility });
  };

  // Reordering sections
  const moveSection = (idx: number, direction: "up" | "down") => {
    if (!salesPage) return;
    const order = [...(salesPage.sectionsOrder || [
      "hero",
      "problem",
      "transformation",
      "productIntro",
      "whatYouLearn",
      "benefits",
      "testimonials",
      "offer",
      "guarantee",
      "faq"
    ])];

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= order.length) return;

    // Swap elements
    const temp = order[idx];
    order[idx] = order[targetIdx];
    order[targetIdx] = temp;

    setSalesPage({ ...salesPage, sectionsOrder: order });
  };

  // Restore AI Copy
  const handleRestoreBackup = () => {
    if (aiBackup) {
      setSalesPage({ ...aiBackup });
    }
  };

  // Save AI response backup once generated
  React.useEffect(() => {
    if (salesPage && !aiBackup) {
      setAiBackup(JSON.parse(JSON.stringify(salesPage)));
    }
  }, [salesPage]);

  // Synchronize local configuration inputs once when project loads or salesPage is generated
  React.useEffect(() => {
    if (salesPage) {
      if (salesPage.pricing?.originalPrice) setOriginalPrice(salesPage.pricing.originalPrice);
      if (salesPage.pricing?.discountedPrice) setDiscountedPrice(salesPage.pricing.discountedPrice);
      if (salesPage.expertName) setExpertName(salesPage.expertName);
      if (salesPage.expertBio) setExpertBio(salesPage.expertBio);
      if (salesPage.guaranteeDays) setGuaranteeDays(salesPage.guaranteeDays);
      if (salesPage.checkoutLink) setCheckoutLink(salesPage.checkoutLink);
      if (salesPage.supportWhatsapp) setSupportWhatsapp(salesPage.supportWhatsapp);
      if (salesPage.themeColor) setThemeColor(salesPage.themeColor);
      if (salesPage.vslEnabled !== undefined) setVslEnabled(salesPage.vslEnabled);
      if (salesPage.vslPlatform) setVslPlatform(salesPage.vslPlatform);
      if (salesPage.vslUrl) setVslUrl(salesPage.vslUrl);
      if (salesPage.vslEmbedCode) setVslEmbedCode(salesPage.vslEmbedCode);
      if (salesPage.vslTitle) setVslTitle(salesPage.vslTitle);
      if (salesPage.vslSubtitle) setVslSubtitle(salesPage.vslSubtitle);
    }
  }, [salesPage ? salesPage.checkoutLink : null]);

  // Sync parameters back to salesPage if it changes
  const handleCopyFieldChange = (field: keyof SalesPageData, value: any) => {
    if (!salesPage) return;
    setSalesPage({ ...salesPage, [field]: value });
  };

  const handlePricingChange = (subField: "originalPrice" | "discountedPrice" | "ctaText", val: string) => {
    if (!salesPage) return;
    setSalesPage({
      ...salesPage,
      pricing: {
        ...salesPage.pricing,
        [subField]: val
      }
    });
  };

  // Section List metadata
  const sectionMeta = [
    { id: "hero", label: "Capa & Headline" },
    { id: "problem", label: "Dores do Público" },
    { id: "transformation", label: "A Grande Promessa" },
    { id: "productIntro", label: "Apresentação E-book" },
    { id: "whatYouLearn", label: "Grade do Livro (Capítulos)" },
    { id: "benefits", label: "Diferenciais do Método" },
    { id: "testimonials", label: "Depoimentos Reais" },
    { id: "offer", label: "Oferta & Lançamento" },
    { id: "guarantee", label: "Garantia Segura" },
    { id: "faq", label: "Dúvidas Respondidas" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* LEFT COLUMN: Configuration, Ordering & Editor (5 Cols) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        
        {/* Navigation Tab */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 flex gap-1 shadow">
          <button
            type="button"
            onClick={() => setSidebarTab("config")}
            className={`flex-1 py-2 px-1 rounded-lg text-[11px] font-bold transition-all ${
              sidebarTab === "config" ? "bg-slate-800 text-white border border-slate-700" : "text-slate-400 hover:text-white"
            }`}
          >
            Oferta
          </button>
          <button
            type="button"
            disabled={!salesPage}
            onClick={() => setSidebarTab("vsl")}
            className={`flex-1 py-2 px-1 rounded-lg text-[11px] font-bold transition-all ${
              !salesPage ? "text-slate-600 cursor-not-allowed" : sidebarTab === "vsl" ? "bg-slate-800 text-white border border-slate-700" : "text-slate-400 hover:text-white"
            }`}
          >
            Vídeo (VSL)
          </button>
          <button
            type="button"
            disabled={!salesPage}
            onClick={() => setSidebarTab("sections")}
            className={`flex-1 py-2 px-1 rounded-lg text-[11px] font-bold transition-all ${
              !salesPage ? "text-slate-600 cursor-not-allowed" : sidebarTab === "sections" ? "bg-slate-800 text-white border border-slate-700" : "text-slate-400 hover:text-white"
            }`}
          >
            Seções ({salesPage ? "Ativas" : "0"})
          </button>
          <button
            type="button"
            disabled={!salesPage}
            onClick={() => setSidebarTab("edit_copy")}
            className={`flex-1 py-2 px-1 rounded-lg text-[11px] font-bold transition-all ${
              !salesPage ? "text-slate-600 cursor-not-allowed" : sidebarTab === "edit_copy" ? "bg-slate-800 text-white border border-slate-700" : "text-slate-400 hover:text-white"
            }`}
          >
            Copy
          </button>
        </div>

        {/* Dynamic Sidebar View */}
        {sidebarTab === "config" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <Settings className="w-4 h-4 text-emerald-400" />
              Parâmetros de Lançamento
            </h3>

            <div className="flex flex-col gap-3">
              
              {/* Checkout link parameter */}
              <div>
                <CopywritingTooltip
                  tip={SALES_PAGE_COPY_TIPS.checkoutLink}
                  label="Link do seu Checkout"
                  required
                  onApplyExample={(ex) => handleCheckoutChange(ex)}
                >
                  <input
                    type="text"
                    value={checkoutLink}
                    onChange={(e) => handleCheckoutChange(e.target.value)}
                    placeholder="https://pay.kiwify.com.br/MEU-LINK"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </CopywritingTooltip>
                <span className="text-[10px] text-slate-400 mt-1 block">Cole o link gerado pela Kiwify ou por outra plataforma.</span>
                {checkoutWarning && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] rounded-lg mt-1.5 flex gap-1 items-start">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{checkoutWarning}</span>
                  </div>
                )}
              </div>

              {/* Grupo 1: Preço & Âncora de Valor */}
              <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-3.5 flex flex-col gap-3">
                <span className="text-[11px] font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-emerald-400 font-mono">1.</span> Precificação & Âncora de Valor
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
                  <CopywritingTooltip
                    tip={SALES_PAGE_COPY_TIPS.originalPrice}
                    label="Preço Original (Âncora)"
                    onApplyExample={(ex) => setOriginalPrice(ex)}
                  >
                    <input
                      type="text"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="R$ 197,00"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                    />
                  </CopywritingTooltip>

                  <CopywritingTooltip
                    tip={SALES_PAGE_COPY_TIPS.discountedPrice}
                    label="Preço de Oferta (Conversão)"
                    onApplyExample={(ex) => setDiscountedPrice(ex)}
                  >
                    <input
                      type="text"
                      value={discountedPrice}
                      onChange={(e) => setDiscountedPrice(e.target.value)}
                      placeholder="R$ 97,00"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition font-bold text-emerald-400"
                    />
                  </CopywritingTooltip>
                </div>
              </div>

              {/* Grupo 2: Especialista & Autoridade */}
              <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-3.5 flex flex-col gap-3">
                <span className="text-[11px] font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-emerald-400 font-mono">2.</span> Especialista & Autoridade
                </span>
                <div className="flex flex-col gap-3">
                  <CopywritingTooltip
                    tip={SALES_PAGE_COPY_TIPS.expertName}
                    label="Nome do Especialista"
                    onApplyExample={(ex) => setExpertName(ex)}
                  >
                    <input
                      type="text"
                      value={expertName}
                      onChange={(e) => setExpertName(e.target.value)}
                      placeholder="Nome do Especialista"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                    />
                  </CopywritingTooltip>

                  <CopywritingTooltip
                    tip={SALES_PAGE_COPY_TIPS.expertBio}
                    label="Breve Biografia (Autoridade Rápida)"
                    onApplyExample={(ex) => setExpertBio(ex)}
                  >
                    <textarea
                      rows={2}
                      value={expertBio}
                      onChange={(e) => setExpertBio(e.target.value)}
                      placeholder="Ex: Formado há 10 anos, ajudou mais de 1000 alunos..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition resize-none leading-relaxed"
                    />
                  </CopywritingTooltip>
                </div>
              </div>

              {/* Grupo 3: Garantia e Suporte WhatsApp */}
              <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-3.5 flex flex-col gap-3">
                <span className="text-[11px] font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-emerald-400 font-mono">3.</span> Garantia & Suporte ao Cliente
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
                  <CopywritingTooltip
                    tip={SALES_PAGE_COPY_TIPS.guaranteeDays}
                    label="Garantia Incondicional"
                  >
                    <select
                      value={guaranteeDays}
                      onChange={(e) => setGuaranteeDays(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition font-medium"
                    >
                      <option value="7">7 Dias Garantidos</option>
                      <option value="15">15 Dias Garantidos</option>
                      <option value="30">30 Dias Garantidos</option>
                      <option value="0">Sem Garantia</option>
                    </select>
                  </CopywritingTooltip>

                  <CopywritingTooltip
                    tip={SALES_PAGE_COPY_TIPS.supportWhatsapp}
                    label="WhatsApp de Suporte (Conversão)"
                    onApplyExample={(ex) => setSupportWhatsapp(ex)}
                  >
                    <input
                      type="text"
                      value={supportWhatsapp}
                      onChange={(e) => setSupportWhatsapp(e.target.value)}
                      placeholder="Ex: 11999999999"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition font-mono"
                    />
                  </CopywritingTooltip>
                </div>
              </div>

              {/* Visual theme selection */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">Escolha as cores da página</label>
                <div className="flex gap-2">
                  {(["emerald", "indigo", "rose", "slate"] as const).map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setThemeColor(color);
                        if (salesPage) setSalesPage({ ...salesPage, themeColor: color });
                      }}
                      className={`flex-1 py-2 px-1 text-xs font-bold rounded-lg capitalize border transition ${
                        themeColor === color
                          ? "bg-slate-850 text-white border-emerald-500 font-extrabold shadow"
                          : "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full inline-block mr-1.5 ${
                        color === "emerald" ? "bg-emerald-400" : color === "indigo" ? "bg-indigo-400" : color === "rose" ? "bg-rose-400" : "bg-slate-400"
                      }`} />
                      {color === "emerald" ? "Verde" : color === "indigo" ? "Azul" : color === "rose" ? "Rosa" : "Cinza"}
                    </button>
                  ))}
                </div>
              </div>

              {/* VSL Section inside Pre-Generation parameters */}
              <div className="border-t border-slate-800 pt-3 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
                    <Video className="w-4 h-4 text-emerald-400" />
                    Você deseja adicionar uma VSL à sua página de vendas?
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setVslEnabled(true)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        vslEnabled
                          ? "bg-slate-800 border-emerald-500 text-white shadow"
                          : "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800"
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 text-emerald-400" />
                      Sim, com VSL
                    </button>
                    <button
                      type="button"
                      onClick={() => setVslEnabled(false)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        !vslEnabled
                          ? "bg-slate-800 border-emerald-500 text-white shadow"
                          : "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800"
                      }`}
                    >
                      <VideoOff className="w-3.5 h-3.5 text-slate-500" />
                      Sem VSL
                    </button>
                  </div>
                </div>

                {vslEnabled && (
                  <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-3 flex flex-col gap-3 animate-fade-in">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block border-b border-slate-850 pb-1.5 mb-1">
                      Adicione sua VSL
                    </span>

                    {/* VSL Platform selection */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Onde sua VSL está hospedada?</label>
                      <select
                        value={vslPlatform}
                        onChange={(e) => setVslPlatform(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 mt-1"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="vimeo">Vimeo</option>
                        <option value="panda">Panda Video</option>
                        <option value="other">Outra plataforma</option>
                      </select>
                    </div>

                    {/* VSL Link */}
                    <CopywritingTooltip
                      tip={SALES_PAGE_COPY_TIPS.vslUrl}
                      label="Link da VSL"
                      onApplyExample={(ex) => {
                        setVslUrl(ex);
                        const processed = processVideoSource(ex, vslEmbedCode, vslPlatform);
                        if (processed.platform !== vslPlatform) {
                          setVslPlatform(processed.platform);
                        }
                      }}
                    >
                      <input
                        type="text"
                        value={vslUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          setVslUrl(val);
                          // Auto identify platform
                          const processed = processVideoSource(val, vslEmbedCode, vslPlatform);
                          if (processed.platform !== vslPlatform) {
                            setVslPlatform(processed.platform);
                          }
                          if (processed.error && val.trim() !== "") {
                            setVslError(processed.error);
                          } else {
                            setVslError(null);
                          }
                        }}
                        placeholder="Cole o link do YouTube, Vimeo ou Panda"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-600"
                      />
                    </CopywritingTooltip>

                    {/* VSL Embed Code */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Ou Código de incorporação (iframe)</label>
                      <textarea
                        rows={2}
                        value={vslEmbedCode}
                        onChange={(e) => {
                          const val = e.target.value;
                          setVslEmbedCode(val);
                          const processed = processVideoSource(vslUrl, val, vslPlatform);
                          if (processed.platform !== vslPlatform) {
                            setVslPlatform(processed.platform);
                          }
                          if (processed.error && val.trim() !== "") {
                            setVslError(processed.error);
                          } else {
                            setVslError(null);
                          }
                        }}
                        placeholder="Cole aqui o código <iframe> puro"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 mt-1 resize-none placeholder-slate-600 font-mono text-[10px] leading-relaxed"
                      />
                    </div>

                    {/* Error indicator */}
                    {vslError && (
                      <span className="text-[10px] text-amber-400 flex items-start gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{vslError}</span>
                      </span>
                    )}

                    {/* Quick Config */}
                    <CopywritingTooltip
                      tip={SALES_PAGE_COPY_TIPS.vslTitle}
                      label="Título acima do vídeo"
                      onApplyExample={(ex) => setVslTitle(ex)}
                    >
                      <input
                        type="text"
                        value={vslTitle}
                        onChange={(e) => setVslTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-emerald-500"
                      />
                    </CopywritingTooltip>

                    <CopywritingTooltip
                      tip={SALES_PAGE_COPY_TIPS.vslSubtitle}
                      label="Texto curto abaixo do vídeo"
                      onApplyExample={(ex) => setVslSubtitle(ex)}
                    >
                      <input
                        type="text"
                        value={vslSubtitle}
                        onChange={(e) => setVslSubtitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-emerald-500"
                      />
                    </CopywritingTooltip>
                  </div>
                )}
              </div>

            </div>

            {/* Launch Sales Copy Creator */}
            <button
              type="button"
              onClick={triggerGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 mt-1"
            >
              {loading ? (
                <>
                  <Smartphone className="w-5 h-5 animate-spin" />
                  <span>{loadingMessage}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5" />
                  <span>{salesPage ? "Recriar Copy com IA" : "Gerar Página de Vendas ✨"}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Sections Sorting, visibility & duplicate controller */}
        {sidebarTab === "sections" && salesPage && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <Settings className="w-4 h-4 text-emerald-400" />
              Layout das Seções
            </h3>

            <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
              {(salesPage.sectionsOrder || [
                "hero",
                "problem",
                "transformation",
                "productIntro",
                "whatYouLearn",
                "benefits",
                "testimonials",
                "offer",
                "guarantee",
                "faq"
              ]).map((secId, i) => {
                const meta = sectionMeta.find(m => m.id === secId) || { label: secId };
                const isVisible = salesPage.sectionsVisibility[secId as keyof SalesPageData["sectionsVisibility"]] !== false;

                return (
                  <div key={secId} className="bg-slate-950/60 border border-slate-850 rounded-xl p-3 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-mono">Posição #{i+1}</span>
                      <span className={`text-xs font-bold leading-tight ${isVisible ? "text-slate-200" : "text-slate-500 line-through"}`}>{meta.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Hide/Show Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleVisibility(secId as keyof SalesPageData["sectionsVisibility"])}
                        title={isVisible ? "Ocultar Seção" : "Mostrar Seção"}
                        className={`p-1.5 rounded-lg border transition ${
                          isVisible ? "bg-slate-800 text-emerald-400 border-slate-700" : "bg-slate-900/40 text-slate-600 border-slate-850"
                        }`}
                      >
                        {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Sorting Arrows */}
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => moveSection(i, "up")}
                        className="p-1.5 rounded-lg border bg-slate-900 text-slate-400 border-slate-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={i === (salesPage.sectionsOrder || []).length - 1}
                        onClick={() => moveSection(i, "down")}
                        className="p-1.5 rounded-lg border bg-slate-900 text-slate-400 border-slate-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Mova as setas para ordenar as seções</span>
              <button
                type="button"
                onClick={handleRestoreBackup}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Padrão</span>
              </button>
            </div>
          </div>
        )}

        {/* Copy text Editor dashboard */}
        {sidebarTab === "edit_copy" && salesPage && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4 max-h-[460px] overflow-y-auto">
            <h3 className="font-extrabold text-sm text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-emerald-400" />
                Editor de Cópias (Headline/Textos)
              </span>
              <button
                type="button"
                onClick={handleRestoreBackup}
                title="Restaurar textos originais gerados pela IA"
                className="p-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </h3>

            <div className="flex flex-col gap-3.5">
              <CopywritingTooltip
                tip={SALES_PAGE_COPY_TIPS.headline}
                label="Headline Principal"
                onApplyExample={(ex) => handleCopyFieldChange("headline", ex)}
              >
                <textarea
                  rows={3}
                  value={salesPage.headline || ""}
                  onChange={(e) => handleCopyFieldChange("headline", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </CopywritingTooltip>

              <CopywritingTooltip
                tip={SALES_PAGE_COPY_TIPS.subheadline}
                label="Subheadline"
                onApplyExample={(ex) => handleCopyFieldChange("subheadline", ex)}
              >
                <textarea
                  rows={2}
                  value={salesPage.subheadline || ""}
                  onChange={(e) => handleCopyFieldChange("subheadline", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </CopywritingTooltip>

              <CopywritingTooltip
                tip={SALES_PAGE_COPY_TIPS.videoPlaceholderText}
                label="Apresentação VSL (Descrição)"
                onApplyExample={(ex) => handleCopyFieldChange("videoPlaceholderText", ex)}
              >
                <textarea
                  rows={3}
                  value={salesPage.videoPlaceholderText || ""}
                  onChange={(e) => handleCopyFieldChange("videoPlaceholderText", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </CopywritingTooltip>

              <CopywritingTooltip
                tip={SALES_PAGE_COPY_TIPS.hookText}
                label="Hook Emocional (O Gancho)"
                onApplyExample={(ex) => handleCopyFieldChange("hookText", ex)}
              >
                <textarea
                  rows={3}
                  value={salesPage.hookText || ""}
                  onChange={(e) => handleCopyFieldChange("hookText", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </CopywritingTooltip>

              <CopywritingTooltip
                tip={SALES_PAGE_COPY_TIPS.ctaText}
                label="Texto do Botão CTA"
                onApplyExample={(ex) => handlePricingChange("ctaText", ex)}
              >
                <input
                  type="text"
                  value={salesPage.pricing?.ctaText || ""}
                  onChange={(e) => handlePricingChange("ctaText", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </CopywritingTooltip>
            </div>
          </div>
        )}

        {/* VSL Video configuration panel */}
        {sidebarTab === "vsl" && salesPage && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <Video className="w-4.5 h-4.5 text-emerald-400" />
                Configurar Vídeo (VSL)
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const nextVisible = !(salesPage.vslVisible !== false);
                    setSalesPage({ ...salesPage, vslVisible: nextVisible });
                  }}
                  className={`p-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${
                    salesPage.vslVisible !== false 
                      ? "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
                      : "bg-amber-950/40 border-amber-800/60 text-amber-400"
                  }`}
                  title={salesPage.vslVisible !== false ? "Ocultar Temporariamente" : "Mostrar Novamente"}
                >
                  {salesPage.vslVisible !== false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{salesPage.vslVisible !== false ? "Ocultar" : "Oculto"}</span>
                </button>
              </div>
            </div>

            {/* Enable / Disable State */}
            <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-3.5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Status da VSL</span>
                  <span className="text-[10px] text-slate-500 font-medium">Ative ou desative o vídeo na sua página</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSalesPage({ ...salesPage, vslEnabled: !salesPage.vslEnabled });
                  }}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all border ${
                    salesPage.vslEnabled
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-extrabold shadow"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  {salesPage.vslEnabled ? "ATIVADA" : "DESATIVADA"}
                </button>
              </div>
            </div>

            {salesPage.vslEnabled && (
              <div className="flex flex-col gap-4 animate-fade-in">
                {/* Platform select */}
                <div>
                  <label className="text-xs font-bold text-slate-400">Onde sua VSL está hospedada?</label>
                  <select
                    value={salesPage.vslPlatform || "youtube"}
                    onChange={(e) => {
                      setSalesPage({ ...salesPage, vslPlatform: e.target.value as any });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 mt-1"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="panda">Panda Video</option>
                    <option value="other">Outra plataforma (Link ou iframe direto)</option>
                  </select>
                </div>

                {/* VSL Url */}
                <CopywritingTooltip
                  tip={SALES_PAGE_COPY_TIPS.vslUrl}
                  label="Link de Compartilhamento do Vídeo"
                  onApplyExample={(ex) => {
                    const processed = processVideoSource(ex, salesPage.vslEmbedCode, salesPage.vslPlatform);
                    setSalesPage({
                      ...salesPage,
                      vslUrl: ex,
                      vslPlatform: processed.platform
                    });
                  }}
                >
                  <input
                    type="text"
                    value={salesPage.vslUrl || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const processed = processVideoSource(val, salesPage.vslEmbedCode, salesPage.vslPlatform);
                      setSalesPage({
                        ...salesPage,
                        vslUrl: val,
                        vslPlatform: processed.platform
                      });
                      if (processed.error && val.trim() !== "") {
                        setVslError(processed.error);
                      } else {
                        setVslError(null);
                      }
                    }}
                    placeholder="Cole o link do YouTube, Vimeo ou Panda"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </CopywritingTooltip>

                {/* VSL Embed Code */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block">
                    Ou Código de Incorporação (iframe)
                  </label>
                  <textarea
                    rows={2}
                    value={salesPage.vslEmbedCode || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const processed = processVideoSource(salesPage.vslUrl, val, salesPage.vslPlatform);
                      setSalesPage({
                        ...salesPage,
                        vslEmbedCode: val,
                        vslPlatform: processed.platform
                      });
                      if (processed.error && val.trim() !== "") {
                        setVslError(processed.error);
                      } else {
                        setVslError(null);
                      }
                    }}
                    placeholder="Cole o código iframe completo aqui"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px] mt-1 resize-none"
                  />
                </div>

                {vslError && (
                  <span className="text-xs text-amber-400 flex items-start gap-1">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{vslError}</span>
                  </span>
                )}

                {/* Autoplay toggle */}
                <div className="flex items-center justify-between bg-slate-950/20 border border-slate-850 p-3 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">Autoplay Silenciado</span>
                    <span className="text-[10px] text-slate-500 font-medium">Inicia o vídeo mutado automaticamente</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSalesPage({ ...salesPage, vslAutoplayMuted: !salesPage.vslAutoplayMuted });
                    }}
                    className={`p-1 px-2.5 rounded-lg text-xs font-bold border transition ${
                      salesPage.vslAutoplayMuted
                        ? "bg-emerald-950/40 border-emerald-800 text-emerald-400 font-extrabold shadow"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    {salesPage.vslAutoplayMuted ? "MUTADO" : "NÃO"}
                  </button>
                </div>

                {/* VSL Title */}
                <CopywritingTooltip
                  tip={SALES_PAGE_COPY_TIPS.vslTitle}
                  label="Título acima da VSL"
                  onApplyExample={(ex) => setSalesPage({ ...salesPage, vslTitle: ex })}
                >
                  <input
                    type="text"
                    value={salesPage.vslTitle ?? ""}
                    onChange={(e) => setSalesPage({ ...salesPage, vslTitle: e.target.value })}
                    placeholder="Ex: Assista ao vídeo e descubra como funciona"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </CopywritingTooltip>

                {/* VSL Subtitle */}
                <CopywritingTooltip
                  tip={SALES_PAGE_COPY_TIPS.vslSubtitle}
                  label="Texto de apoio abaixo do vídeo"
                  onApplyExample={(ex) => setSalesPage({ ...salesPage, vslSubtitle: ex })}
                >
                  <textarea
                    rows={2}
                    value={salesPage.vslSubtitle ?? ""}
                    onChange={(e) => setSalesPage({ ...salesPage, vslSubtitle: e.target.value })}
                    placeholder="Ex: Depois de assistir, clique no botão abaixo para garantir seu acesso."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                  />
                </CopywritingTooltip>

                {/* Position / Order of VSL block inside Hero */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">Posição do Vídeo (VSL)</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSalesPage({ ...salesPage, vslPosition: "top" })}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        (salesPage.vslPosition || "top") === "top"
                          ? "bg-slate-850 border-emerald-500 text-white font-extrabold shadow"
                          : "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800"
                      }`}
                    >
                      <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
                      Mover para Cima
                    </button>
                    <button
                      type="button"
                      onClick={() => setSalesPage({ ...salesPage, vslPosition: "bottom" })}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        salesPage.vslPosition === "bottom"
                          ? "bg-slate-850 border-emerald-500 text-white font-extrabold shadow"
                          : "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800"
                      }`}
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                      Mover para Baixo
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1.5 block leading-relaxed">
                    Escolha se o vídeo deve aparecer antes ou depois do mockup tridimensional na primeira dobra da página.
                  </span>
                </div>

                {/* Show/Hide Checkout Button under video */}
                <div className="border-t border-slate-800 pt-3 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">Botão de Compra abaixo do vídeo</span>
                      <span className="text-[10px] text-slate-500 font-medium">Exibe um botão de checkout extra logo abaixo do player</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSalesPage({ ...salesPage, vslShowCtaBelow: !(salesPage.vslShowCtaBelow !== false) });
                      }}
                      className={`py-1 px-2.5 rounded-lg text-xs font-bold border transition ${
                        salesPage.vslShowCtaBelow !== false
                          ? "bg-emerald-950/40 border-emerald-800 text-emerald-400 font-extrabold shadow"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      {salesPage.vslShowCtaBelow !== false ? "EXIBINDO" : "OCULTO"}
                    </button>
                  </div>

                  {salesPage.vslShowCtaBelow !== false && (
                    <CopywritingTooltip
                      tip={SALES_PAGE_COPY_TIPS.vslCtaText}
                      label="Texto do botão abaixo do vídeo"
                      onApplyExample={(ex) => setSalesPage({ ...salesPage, vslCtaText: ex })}
                    >
                      <input
                        type="text"
                        value={salesPage.vslCtaText || "QUERO GARANTIR MINHA VAGA AGORA"}
                        onChange={(e) => setSalesPage({ ...salesPage, vslCtaText: e.target.value })}
                        placeholder="Ex: QUERO APRENDER AGORA"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </CopywritingTooltip>
                  )}
                </div>

                {/* Delete / Clear button */}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Tem certeza que deseja remover o vídeo (VSL) e limpar suas configurações?")) {
                      setSalesPage({
                        ...salesPage,
                        vslEnabled: false,
                        vslUrl: "",
                        vslEmbedCode: "",
                        vslTitle: "Assista ao vídeo e descubra como funciona",
                        vslSubtitle: "Depois de assistir, clique no botão abaixo para garantir seu acesso."
                      });
                    }
                  }}
                  className="w-full mt-2 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-900/60 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir e Limpar Bloco VSL</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Progress Trigger button */}
        {salesPage && (
          <button
            type="button"
            onClick={onNextStep}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:brightness-110"
          >
            <span>Pronto! Ir Para Publicação</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        )}

      </div>

      {/* RIGHT COLUMN: Desktop & Mobile Visual Live Simulator Viewport (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col gap-3 w-full">
        
        {/* Device Switcher Header */}
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800/80 p-3 rounded-2xl shadow">
          <span className="text-xs font-bold text-slate-400 uppercase font-mono pl-1">Live Simulator Canvas</span>
          
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setPreviewMode("desktop")}
              className={`p-1.5 rounded-lg border transition flex items-center gap-1 ${
                previewMode === "desktop" ? "bg-slate-800 text-white border-slate-700" : "text-slate-400 hover:text-white border-transparent"
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="text-[10px] font-bold hidden sm:inline">Computador</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewMode("mobile")}
              className={`p-1.5 rounded-lg border transition flex items-center gap-1 ${
                previewMode === "mobile" ? "bg-slate-800 text-white border-slate-700" : "text-slate-400 hover:text-white border-transparent"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-[10px] font-bold hidden sm:inline">Celular</span>
            </button>
          </div>
        </div>

        {/* Live Simulator viewport */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl relative flex flex-col items-center justify-center min-h-[500px] overflow-hidden">
          
          {!salesPage ? (
            /* Un-generated placeholder status state */
            <div className="flex flex-col items-center text-center gap-4 py-12 max-w-sm">
              <div className="p-3 bg-slate-900 border border-slate-800 text-emerald-400 rounded-full animate-pulse">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Aguardando Geração da Página</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Insira as configurações da sua oferta (preços, biografia, garantia, link de pagamento) e clique em <strong>Gerar Página de Vendas</strong> à esquerda.
              </p>
            </div>
          ) : (
            /* Simulated Website Canvas */
            <div 
              className={`w-full bg-slate-50 text-slate-800 rounded-2xl shadow-xl transition-all duration-300 flex flex-col max-h-[600px] overflow-y-auto ${
                previewMode === "mobile" ? "max-w-[340px] border-[8px] border-slate-900 rounded-[32px] overflow-hidden" : ""
              }`}
            >
              {/* Fake web browser address bar */}
              {previewMode === "desktop" && (
                <div className="bg-slate-900 px-3 py-1.5 flex items-center justify-between border-b border-slate-850">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded px-6 py-0.5 text-[9px] text-slate-400 font-mono">
                    https://meu-produto.netlify.app
                  </div>
                  <div className="w-4" />
                </div>
              )}

              {/* Real Generated Rendered Sales Page */}
              <div className="text-left font-sans">
                
                {/* 1. HERO */}
                {salesPage.sectionsVisibility.hero !== false && (() => {
                  const vslProcessed = (salesPage.vslEnabled && (salesPage.vslUrl || salesPage.vslEmbedCode))
                    ? processVideoSource(salesPage.vslUrl || "", salesPage.vslEmbedCode || "", salesPage.vslPlatform)
                    : null;
                  
                  const showVslTop = salesPage.vslEnabled && (salesPage.vslPosition || "top") === "top" && vslProcessed && vslProcessed.src && salesPage.vslVisible !== false;
                  const showVslBottom = salesPage.vslEnabled && salesPage.vslPosition === "bottom" && vslProcessed && vslProcessed.src && salesPage.vslVisible !== false;

                  return (
                    <div className="bg-slate-900 text-white px-5 py-10 text-center flex flex-col items-center gap-3 relative">
                      <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider uppercase">
                        LIMITADO
                      </div>
                      <h3 className="text-base md:text-xl font-extrabold text-white tracking-tight leading-tight max-w-md">
                        {salesPage.headline}
                      </h3>
                      <p className="text-slate-300 text-[11px] leading-relaxed max-w-sm mb-2">
                        {salesPage.subheadline}
                      </p>

                      {/* VSL TOP POSITION */}
                      {showVslTop && (
                        <div className="w-full max-w-md my-3 flex flex-col gap-1.5 text-center items-center">
                          {salesPage.vslTitle && (
                            <span className="text-[10px] font-bold text-slate-300 block uppercase tracking-wider">
                              {salesPage.vslTitle}
                            </span>
                          )}
                          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-850 bg-slate-950 shadow-xl">
                            <iframe
                              src={
                                salesPage.vslAutoplayMuted
                                  ? (vslProcessed!.src.includes("?") ? `${vslProcessed!.src}&autoplay=1&mute=1&muted=1` : `${vslProcessed!.src}?autoplay=1&mute=1&muted=1`)
                                  : vslProcessed!.src
                              }
                              className="absolute inset-0 w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title="Video Sales Letter"
                            />
                          </div>
                          {salesPage.vslSubtitle && (
                            <p className="text-[9px] text-slate-400 italic max-w-xs leading-normal">
                              {salesPage.vslSubtitle}
                            </p>
                          )}
                          
                          {salesPage.vslShowCtaBelow !== false && (
                            <a
                              href={salesPage.checkoutLink || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-full max-w-xs mt-1.5 px-4 py-2 rounded-lg text-[11px] font-extrabold text-slate-950 shadow transition-all duration-300 hover:brightness-110 uppercase tracking-wider text-center ${
                                themeColor === "emerald" ? "bg-emerald-400" : themeColor === "indigo" ? "bg-indigo-400" : themeColor === "rose" ? "bg-rose-400" : "bg-slate-400"
                              }`}
                            >
                              {salesPage.vslCtaText || "QUERO GARANTIR MINHA VAGA AGORA"} 🚀
                            </a>
                          )}
                        </div>
                      )}

                      {/* VSL Explanation or Cover Image Mockup */}
                      {!salesPage.vslEnabled ? (
                        /* Case: WITHOUT VSL (vslEnabled is false) -> Render beautiful e-book cover mockup instead of explanation */
                        (() => {
                          const hasAiCover = !!(
                            ebook.coverImage ||
                            (ebook.cover && (ebook.cover.imageUrl || ebook.cover.coverImage))
                          );
                          const cov = ebook.cover || {};
                          const coverImgUrl = ebook.coverImage || cov.imageUrl || cov.coverImage || "";
                          
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
                              case "bottom": return "justify-end pb-4";
                              default: return "justify-start pt-4";
                            }
                          };

                          const bookCoverMarkup = hasAiCover ? (
                            <div
                              className="relative w-full h-full p-4 flex flex-col justify-between text-left"
                              style={{
                                backgroundImage: `url(${coverImgUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            >
                              {cov.showDecorativeBorder && (
                                <div className="absolute inset-2 border border-white/20 pointer-events-none rounded" />
                              )}

                              <div className={`relative z-10 h-full flex flex-col ${getAlignmentClass(cov.alignment)} gap-1.5`}>
                                {cov.alignment !== "bottom" && (
                                  <span 
                                    className="text-[6px] font-black uppercase tracking-widest block"
                                    style={{ color: cov.authorColor || "#10B981", fontFamily: getFontFamily(cov.typography) }}
                                  >
                                    ● E-BOOK PREMIUM
                                  </span>
                                )}

                                <div className="flex flex-col gap-0.5">
                                  <h4 
                                    className="text-[10px] font-black leading-tight tracking-tight uppercase"
                                    style={{ color: cov.titleColor || "#FFFFFF", fontFamily: getFontFamily(cov.typography) }}
                                  >
                                    {ebook.title}
                                  </h4>
                                  <p 
                                    className="text-[6px] opacity-90 italic leading-snug line-clamp-2"
                                    style={{ color: cov.subtitleColor || "#D1D5DB", fontFamily: getFontFamily(cov.typography) }}
                                  >
                                    {ebook.subtitle}
                                  </p>
                                </div>

                                <div className="mt-auto pt-1">
                                  <span 
                                    className="text-[6px] font-bold block truncate"
                                    style={{ color: cov.authorColor || "#10B981", fontFamily: getFontFamily(cov.typography) }}
                                  >
                                    Autor: {ebook.author}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className={`w-full h-full p-4 flex flex-col justify-between text-left relative ${
                              themeColor === "emerald" ? "bg-gradient-to-br from-emerald-600 to-teal-950" :
                              themeColor === "indigo" ? "bg-gradient-to-br from-indigo-600 to-slate-950" :
                              themeColor === "rose" ? "bg-gradient-to-br from-rose-600 to-stone-950" :
                              "bg-gradient-to-br from-slate-600 to-slate-950"
                            }`}>
                              <div className="flex flex-col gap-1.5">
                                <span className="text-[7px] font-mono font-bold tracking-widest text-emerald-300 uppercase opacity-90">E-BOOK PREMIUM</span>
                                <h4 className="text-[11px] font-black leading-tight text-white line-clamp-3 tracking-tight">
                                  {ebook.title}
                                </h4>
                                <p className="text-[7px] text-slate-300 font-medium line-clamp-2 leading-snug">
                                  {ebook.subtitle}
                                </p>
                              </div>
                              <div className="border-t border-white/10 pt-1.5">
                                <span className="text-[7px] font-mono text-slate-300 block">Autor</span>
                                <span className="text-[8px] font-bold text-white block truncate">{ebook.author}</span>
                              </div>
                            </div>
                          );

                          return (
                            <div className="flex flex-col items-center justify-center my-4 animate-fade-in w-full">
                              <a 
                                href={salesPage.checkoutLink || "#"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
                              >
                                <motion.div 
                                  className="relative w-36 h-48 rounded-r-xl overflow-hidden shadow-2xl animate-fade-in" 
                                  style={{ perspective: "1000px" }}
                                  animate={{ y: [0, -10, 0] }}
                                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                >
                                  {/* 3D book spine shadow/highlight */}
                                  <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 via-white/10 to-transparent z-10" />
                                  {bookCoverMarkup}
                                </motion.div>
                              </a>
                              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mt-3">Maquete Tridimensional do Produto</span>
                            </div>
                          );
                        })()
                      ) : (
                        /* Case: WITH VSL (vslEnabled is true) */
                        /* Only show the explanation block if NO video is uploaded/configured yet (showVslTop and showVslBottom are both false) */
                        !(showVslTop || showVslBottom) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full max-w-lg mt-4 animate-fade-in">
                            {/* 3D Mockup Container (NOT floating because VSL is enabled) */}
                            <div className="flex flex-col items-center justify-center">
                              <a 
                                href={salesPage.checkoutLink || "#"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
                              >
                                <div className="relative w-28 h-36 rounded-r-xl overflow-hidden shadow-2xl" style={{ perspective: "1000px" }}>
                                  {/* 3D book spine shadow/highlight */}
                                  <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent z-10" />
                                  {/* Render book cover */}
                                  {(() => {
                                    const hasAiCover = !!(
                                      ebook.coverImage ||
                                      (ebook.cover && (ebook.cover.imageUrl || ebook.cover.coverImage))
                                    );
                                    const cov = ebook.cover || {};
                                    const coverImgUrl = ebook.coverImage || cov.imageUrl || cov.coverImage || "";
                                    
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
                                        case "bottom": return "justify-end pb-3";
                                        default: return "justify-start pt-3";
                                      }
                                    };

                                    return hasAiCover ? (
                                      <div
                                        className="relative w-full h-full p-3 flex flex-col justify-between text-left"
                                        style={{
                                          backgroundImage: `url(${coverImgUrl})`,
                                          backgroundSize: "cover",
                                          backgroundPosition: "center",
                                        }}
                                      >
                                        {cov.showDecorativeBorder && (
                                          <div className="absolute inset-1.5 border border-white/20 pointer-events-none rounded" />
                                        )}

                                        <div className={`relative z-10 h-full flex flex-col ${getAlignmentClass(cov.alignment)} gap-1`}>
                                          {cov.alignment !== "bottom" && (
                                            <span 
                                              className="text-[5px] font-black uppercase tracking-widest block"
                                              style={{ color: cov.authorColor || "#10B981", fontFamily: getFontFamily(cov.typography) }}
                                            >
                                              ● E-BOOK PREMIUM
                                            </span>
                                          )}

                                          <div className="flex flex-col gap-0.5">
                                            <h4 
                                              className="text-[8px] font-black leading-tight tracking-tight uppercase"
                                              style={{ color: cov.titleColor || "#FFFFFF", fontFamily: getFontFamily(cov.typography) }}
                                            >
                                              {ebook.title}
                                            </h4>
                                            <p 
                                              className="text-[5px] opacity-90 italic leading-snug line-clamp-2"
                                              style={{ color: cov.subtitleColor || "#D1D5DB", fontFamily: getFontFamily(cov.typography) }}
                                            >
                                              {ebook.subtitle}
                                            </p>
                                          </div>

                                          <div className="mt-auto pt-0.5">
                                            <span 
                                              className="text-[5px] font-bold block truncate"
                                              style={{ color: cov.authorColor || "#10B981", fontFamily: getFontFamily(cov.typography) }}
                                            >
                                              Autor: {ebook.author}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className={`w-full h-full p-3 flex flex-col justify-between text-left relative ${
                                        themeColor === "emerald" ? "bg-gradient-to-br from-emerald-600 to-teal-950" :
                                        themeColor === "indigo" ? "bg-gradient-to-br from-indigo-600 to-slate-950" :
                                        themeColor === "rose" ? "bg-gradient-to-br from-rose-600 to-stone-950" :
                                        "bg-gradient-to-br from-slate-600 to-slate-950"
                                      }`}>
                                        <div className="flex flex-col gap-1">
                                          <span className="text-[6px] font-mono font-bold tracking-widest text-emerald-300 uppercase opacity-90">E-BOOK PREMIUM</span>
                                          <h4 className="text-[9px] font-black leading-tight text-white line-clamp-3 tracking-tight">
                                            {ebook.title}
                                          </h4>
                                          <p className="text-[6px] text-slate-300 font-medium line-clamp-2 leading-snug">
                                            {ebook.subtitle}
                                          </p>
                                        </div>
                                        <div className="border-t border-white/10 pt-1">
                                          <span className="text-[5px] font-mono text-slate-300 block">Autor</span>
                                          <span className="text-[7px] font-bold text-white block truncate">{ebook.author}</span>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </a>
                              <span className="text-[8px] text-slate-400 font-mono font-bold uppercase tracking-wider mt-2">Metodologia 3D Ativa</span>
                            </div>

                            {/* Script Explanation text */}
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left flex flex-col gap-2 shadow-lg h-full justify-center">
                              <span className="text-[8px] text-emerald-400 font-mono font-bold uppercase tracking-wider">ROTEIRO VSL ATIVO</span>
                              <p className="text-[10px] text-slate-400 italic">"{salesPage.videoPlaceholderText}"</p>
                            </div>
                          </div>
                        )
                      )}

                      {/* VSL BOTTOM POSITION */}
                      {showVslBottom && (
                        <div className="w-full max-w-md my-3 flex flex-col gap-1.5 text-center items-center">
                          {salesPage.vslTitle && (
                            <span className="text-[10px] font-bold text-slate-300 block uppercase tracking-wider">
                              {salesPage.vslTitle}
                            </span>
                          )}
                          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-850 bg-slate-950 shadow-xl">
                            <iframe
                              src={
                                salesPage.vslAutoplayMuted
                                  ? (vslProcessed!.src.includes("?") ? `${vslProcessed!.src}&autoplay=1&mute=1&muted=1` : `${vslProcessed!.src}?autoplay=1&mute=1&muted=1`)
                                  : vslProcessed!.src
                              }
                              className="absolute inset-0 w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title="Video Sales Letter"
                            />
                          </div>
                          {salesPage.vslSubtitle && (
                            <p className="text-[9px] text-slate-400 italic max-w-xs leading-normal">
                              {salesPage.vslSubtitle}
                            </p>
                          )}
                          
                          {salesPage.vslShowCtaBelow !== false && (
                            <a
                              href={salesPage.checkoutLink || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-full max-w-xs mt-1.5 px-4 py-2 rounded-lg text-[11px] font-extrabold text-slate-950 shadow transition-all duration-300 hover:brightness-110 uppercase tracking-wider text-center ${
                                themeColor === "emerald" ? "bg-emerald-400" : themeColor === "indigo" ? "bg-indigo-400" : themeColor === "rose" ? "bg-rose-400" : "bg-slate-400"
                              }`}
                            >
                              {salesPage.vslCtaText || "QUERO GARANTIR MINHA VAGA AGORA"} 🚀
                            </a>
                          )}
                        </div>
                      )}

                      <a
                        href={salesPage.checkoutLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-4 px-5 py-2.5 rounded-lg text-xs font-bold text-slate-950 shadow transition-all duration-300 hover:brightness-110 ${
                          themeColor === "emerald" ? "bg-emerald-400" : themeColor === "indigo" ? "bg-indigo-400" : themeColor === "rose" ? "bg-rose-400" : "bg-slate-400"
                        }`}
                      >
                        {salesPage.pricing.ctaText} 🚀
                      </a>
                    </div>
                  );
                })()}

                {/* 2. PROBLEMS */}
                {salesPage.sectionsVisibility.problem !== false && (
                  <div className="bg-slate-100 p-5 border-b border-slate-200">
                    <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">Será que você passa por isso?</h4>
                    <div className="mt-3 flex flex-col gap-2">
                      {salesPage.painPoints.map((p, i) => (
                        <div key={i} className="bg-white p-2.5 rounded-lg border border-red-50 flex gap-2">
                          <span className="text-red-500 font-bold shrink-0 text-xs">✕</span>
                          <span className="text-[11px] text-slate-600 font-medium leading-normal">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. TRANSFORMATION */}
                {salesPage.sectionsVisibility.transformation !== false && (
                  <div className="bg-white p-5 text-center flex flex-col items-center gap-2 border-b border-slate-200">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider font-mono">A Grande Virada</span>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Qual será seu próximo nível?</h4>
                    <p className="text-[11px] text-slate-500 italic mt-1 leading-relaxed">
                      "{salesPage.hookText}"
                    </p>
                  </div>
                )}

                {/* 4. PRODUCT INTRO */}
                {salesPage.sectionsVisibility.productIntro !== false && (
                  <div className="bg-slate-900 text-white p-5 flex flex-col gap-2 border-b border-slate-800">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Conheça o Produto</span>
                    <h4 className="text-xs font-bold uppercase">{ebook.title}</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed italic mt-1">
                      "{ebook.synopsis}"
                    </p>
                  </div>
                )}

                {/* 5. WHAT YOU LEARN */}
                {salesPage.sectionsVisibility.whatYouLearn !== false && (
                  <div className="bg-slate-50 p-5 border-b border-slate-200">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">Estrutura Interna</span>
                    <h4 className="text-xs font-bold uppercase text-slate-900">O que você vai dominar por dentro</h4>
                    <div className="mt-3 flex flex-col gap-2">
                      {ebook.chapters.map(ch => (
                        <div key={ch.number} className="bg-white border border-slate-200 p-3 rounded-lg">
                          <span className="text-[9px] font-bold text-emerald-600 font-mono">Capítulo 0{ch.number}</span>
                          <h5 className="text-[11px] font-bold text-slate-900">{ch.title}</h5>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">{ch.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. BENEFITS */}
                {salesPage.sectionsVisibility.benefits !== false && (
                  <div className="bg-white p-5 border-b border-slate-200">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider font-mono">Sua Transformação</span>
                    <h4 className="text-xs font-bold uppercase text-slate-900">Vantagens de começar agora</h4>
                    <div className="grid grid-cols-1 gap-2.5 mt-3">
                      {salesPage.benefits.map((b, i) => (
                        <div key={i} className="bg-slate-50 p-2.5 rounded-lg">
                          <span className="text-[10px] font-bold text-slate-800 block">✓ {b.title}</span>
                          <span className="text-[9px] text-slate-500 mt-0.5 block leading-normal">{b.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. TESTIMONIALS */}
                {salesPage.sectionsVisibility.testimonials !== false && salesPage.testimonials.length > 0 && (
                  <div className="bg-slate-50 p-5 border-b border-slate-200">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider font-mono">Alunos Satisfeitos</span>
                    <h4 className="text-xs font-bold uppercase text-slate-900">Histórias de Sucesso</h4>
                    <div className="flex flex-col gap-2.5 mt-3">
                      {salesPage.testimonials.map((t, i) => (
                        <div key={i} className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                          <p className="text-[10px] text-slate-500 italic">"{t.text}"</p>
                          <div className="mt-1.5 flex justify-between items-center text-[8px] font-bold text-slate-700">
                            <span>{t.name}</span>
                            <span className="text-slate-400">{t.profile}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. OFFER */}
                {salesPage.sectionsVisibility.offer !== false && (
                  <div className="bg-slate-900 text-white p-5 text-center border-b border-slate-850 flex flex-col items-center">
                    <span className="text-[9px] text-amber-400 font-mono font-bold uppercase tracking-wider">Garanta sua Oferta</span>
                    <h4 className="text-xs font-bold mt-1 uppercase">{ebook.title}</h4>
                    <span className="text-[10px] text-slate-400 line-through mt-2">De {salesPage.pricing.originalPrice}</span>
                    <span className="text-xl font-bold text-emerald-400">Por {salesPage.pricing.discountedPrice}</span>
                    
                    <a
                      href={salesPage.checkoutLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-3 px-5 py-2.5 rounded-lg text-xs font-bold text-slate-950 w-full max-w-[200px] shadow ${
                        themeColor === "emerald" ? "bg-emerald-400" : themeColor === "indigo" ? "bg-indigo-400" : themeColor === "rose" ? "bg-rose-400" : "bg-slate-400"
                      }`}
                    >
                      {salesPage.pricing.ctaText}
                    </a>
                  </div>
                )}

                {/* 9. GUARANTEE */}
                {salesPage.sectionsVisibility.guarantee !== false && salesPage.guaranteeDays !== "0" && (
                  <div className="bg-white p-4 border-b border-slate-200 flex items-center gap-3">
                    <div className="bg-emerald-100 text-emerald-700 font-bold w-10 h-10 rounded-full flex items-center justify-center text-xs shrink-0">
                      {salesPage.guaranteeDays}d
                    </div>
                    <div className="flex-1">
                      <h5 className="text-[10px] font-bold text-slate-900">Garantia Segura de {salesPage.guaranteeDays} Dias</h5>
                      <p className="text-[9px] text-slate-400 leading-normal">Se não gostar do conteúdo, devolvemos 100% do seu dinheiro investido.</p>
                    </div>
                  </div>
                )}

                {/* 10. FAQ */}
                {salesPage.sectionsVisibility.faq !== false && (
                  <div className="bg-slate-50 p-5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">Dúvidas Frequentes</span>
                    <h4 className="text-xs font-bold uppercase text-slate-900 mb-3">FAQ Geral</h4>
                    <div className="flex flex-col gap-2">
                      {salesPage.faq.map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 p-2.5 rounded-lg text-left">
                          <strong className="text-[10px] text-slate-800 block">{item.question}</strong>
                          <span className="text-[9px] text-slate-400 leading-normal mt-1 block">{item.answer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
