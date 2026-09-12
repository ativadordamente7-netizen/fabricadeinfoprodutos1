import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Square,
  CheckCircle2,
  ShieldCheck,
  Zap,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Globe,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  Sparkles,
  Search,
  Save,
  Link2,
  Sliders,
  Database
} from "lucide-react";

export interface ChecklistItem {
  id: string;
  category: "Página" | "Checkout" | "Tráfego" | "Legal & Suporte" | "Tráfego & Integrações";
  title: string;
  description: string;
  critical: boolean;
  guideType?: "meta_pixel" | "tiktok_pixel" | "domain_verification" | "pixel_step";
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // PÁGINA
  {
    id: "page_headline",
    category: "Página",
    title: "Headline Principal e Alinhamento de Promessa",
    description: "A promessa do topo da página é 100% clara e resolve uma dor urgente do cliente ideal?",
    critical: true
  },
  {
    id: "page_speed",
    category: "Página",
    title: "Velocidade de Carregamento & Imagens Otimizadas",
    description: "A página carrega em menos de 2 segundos no celular 4G e as imagens estão comprimidas?",
    critical: true
  },
  {
    id: "page_buttons",
    category: "Página",
    title: "Links dos Botões de Compra (CTAs)",
    description: "Todos os botões direcionam perfeitamente para o seu checkout de vendas?",
    critical: true
  },

  // CHECKOUT
  {
    id: "checkout_pix",
    category: "Checkout",
    title: "Configuração do Pix & Cartão com Aprovação Instantânea",
    description: "O checkout está testado para gerar código Pix e processar cartão de crédito sem erros?",
    critical: true
  },
  {
    id: "checkout_bump",
    category: "Checkout",
    title: "Order Bump Ativado no Checkout",
    description: "Você adicionou um produto complementar de R$ 9,90 a R$ 29,90 para subir seu ticket médio?",
    critical: false
  },
  {
    id: "checkout_delivery",
    category: "Checkout",
    title: "Entrega Automática do Infoproduto",
    description: "O e-mail com acesso ao produto é disparado automaticamente assim que o pagamento é aprovado?",
    critical: true
  },

  // PASSO ESPECIAL: TRÁFEGO & PIXELS
  {
    id: "special_pixels_domain_step",
    category: "Tráfego & Integrações",
    title: "Passo Especial: Integração Completa de Pixels (Meta/TikTok) e Domínio no Checkout",
    description: "Configure e salve seus IDs de Pixel do Meta Ads, TikTok Ads e valide o registro TXT e CNAME do seu domínio próprio diretamente nas ferramentas de checkout.",
    critical: true,
    guideType: "pixel_step"
  },
  {
    id: "traffic_pixel_meta_tiktok",
    category: "Tráfego",
    title: "Instalação de Pixel Meta Ads & TikTok Ads no Checkout",
    description: "IDs de Pixel do Meta (Facebook) e TikTok copiados do Gerenciador e colados no campo de integrações do checkout para rastrear PageView, InitiateCheckout e Purchase.",
    critical: true,
    guideType: "meta_pixel"
  },
  {
    id: "traffic_capi",
    category: "Tráfego",
    title: "API de Conversões (CAPI) & Token de Acesso Meta",
    description: "Token de Acesso CAPI gerado no Gerenciador de Negócios e configurado no checkout para evitar perda de dados no iOS 14+.",
    critical: true,
    guideType: "tiktok_pixel"
  },
  {
    id: "traffic_creatives",
    category: "Tráfego",
    title: "3 Criativos de Anúncio Validados",
    description: "Você possui pelo menos 3 variações de imagens ou vídeos de anúncios com ganchos diferentes?",
    critical: true
  },

  // LEGAL, DOMÍNIO & SUPORTE
  {
    id: "legal_domain_verify",
    category: "Legal & Suporte",
    title: "Verificação de Domínio no Meta Business & DNS CNAME",
    description: "Domínio verificado com registro TXT/DNS no Meta BM e redirecionamento CNAME configurado para seu checkout.",
    critical: true,
    guideType: "domain_verification"
  },
  {
    id: "legal_policies",
    category: "Legal & Suporte",
    title: "Termos de Uso e Política de Privacidade no Rodapé",
    description: "Sua página possui os links obrigatórios de Termos e Privacidade para evitar bloqueios de anúncios?",
    critical: true
  },
  {
    id: "support_whatsapp",
    category: "Legal & Suporte",
    title: "Botão Flutuante de WhatsApp para Dúvidas",
    description: "Existe um canal rápido para clientes tirarem dúvidas antes de comprar?",
    critical: false
  }
];

export default function ChecklistPublicacao() {
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("infinity_launch_checklist");
      return saved ? JSON.parse(saved) : ["page_headline", "page_buttons", "checkout_pix", "special_pixels_domain_step"];
    } catch {
      return ["page_headline", "page_buttons", "checkout_pix", "special_pixels_domain_step"];
    }
  });

  const [activeGuideTab, setActiveGuideTab] = useState<"meta" | "tiktok" | "domain" | "checkout_links">("meta");
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Dedicated saved credentials state (persisted to localStorage)
  const [savedMetaPixelId, setSavedMetaPixelId] = useState<string>(() => {
    return localStorage.getItem("infinity_meta_pixel_id") || "";
  });
  const [savedMetaCapiToken, setSavedMetaCapiToken] = useState<string>(() => {
    return localStorage.getItem("infinity_meta_capi_token") || "";
  });
  const [savedTiktokPixelId, setSavedTiktokPixelId] = useState<string>(() => {
    return localStorage.getItem("infinity_tiktok_pixel_id") || "";
  });
  const [savedDomainName, setSavedDomainName] = useState<string>(() => {
    return localStorage.getItem("infinity_user_domain") || "";
  });
  const [selectedCheckoutPlatform, setSelectedCheckoutPlatform] = useState<string>(() => {
    return localStorage.getItem("infinity_checkout_platform") || "kiwify";
  });

  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("infinity_launch_checklist", JSON.stringify(completedIds));
    } catch {
      // ignore
    }
  }, [completedIds]);

  const toggleItem = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSavePixelCredentials = () => {
    try {
      localStorage.setItem("infinity_meta_pixel_id", savedMetaPixelId);
      localStorage.setItem("infinity_meta_capi_token", savedMetaCapiToken);
      localStorage.setItem("infinity_tiktok_pixel_id", savedTiktokPixelId);
      localStorage.setItem("infinity_user_domain", savedDomainName);
      localStorage.setItem("infinity_checkout_platform", selectedCheckoutPlatform);

      // Auto-check corresponding items
      setCompletedIds((prev) => {
        const set = new Set(prev);
        set.add("special_pixels_domain_step");
        if (savedMetaPixelId.trim() || savedTiktokPixelId.trim()) {
          set.add("traffic_pixel_meta_tiktok");
        }
        if (savedMetaCapiToken.trim()) {
          set.add("traffic_capi");
        }
        if (savedDomainName.trim()) {
          set.add("legal_domain_verify");
        }
        return Array.from(set);
      });

      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 3000);
    } catch {
      // ignore
    }
  };

  const total = CHECKLIST_ITEMS.length;
  const completed = completedIds.length;
  const percent = Math.round((completed / total) * 100);

  const criticalItems = CHECKLIST_ITEMS.filter((item) => item.critical);
  const criticalCompleted = criticalItems.filter((item) => completedIds.includes(item.id)).length;
  const isReadyForLaunch = criticalCompleted === criticalItems.length;

  // Checkout Platform Links Mapping
  const CHECKOUT_GUIDE_LINKS: Record<string, { name: string; url: string; pixelPath: string; domainPath: string }> = {
    kiwify: {
      name: "Kiwify",
      url: "https://dashboard.kiwify.com.br",
      pixelPath: "Produtos → Editar Produto → Configurações → Pixels (Meta & TikTok)",
      domainPath: "Configurações da Conta → Domínios → Adicionar CNAME"
    },
    hotmart: {
      name: "Hotmart",
      url: "https://app.hotmart.com",
      pixelPath: "Ferramentas → Pixels de Rastreamento → Selecionar Produto → Meta / TikTok",
      domainPath: "Ferramentas → Domínio Próprio → Configurar CNAME e TXT"
    },
    cakto: {
      name: "Cakto",
      url: "https://app.cakto.com.br",
      pixelPath: "Produtos → Integrações → Pixel do Facebook / TikTok",
      domainPath: "Configurações → Domínio Personalizado"
    },
    eduzz: {
      name: "Eduzz",
      url: "https://select.eduzz.com",
      pixelPath: "Select Eduzz → Meus Produtos → Checkout Sun → Pixels de Rastreamento",
      domainPath: "Select Eduzz → Configurações → Domínio de Vendas"
    },
    perfectpay: {
      name: "PerfectPay",
      url: "https://app.perfectpay.com.br",
      pixelPath: "Ferramentas → Pixels de Conversão → Adicionar Pixel Meta / TikTok",
      domainPath: "Ferramentas → Domínios Personalizados"
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/80 border border-teal-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 blur-3xl pointer-events-none rounded-full -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Segurança de Lançamento • Infinity Million OS
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white font-display tracking-tight">
              CHECKLIST DE PUBLICAÇÃO & GUIA DE PIXEL
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Verifique todos os itens críticos de segurança, checkout, pixels de rastreamento e verificação de domínio antes de subir tráfego pago.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-black text-xl">
              {percent}%
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Status do Lançamento</span>
              <span className="text-xs font-bold text-slate-200">
                {completed} de {total} Itens Concluídos
              </span>
            </div>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-bold">
            <span className="text-slate-400">Progresso Geral de Validação</span>
            <span className={percent === 100 ? "text-emerald-400" : "text-teal-400"}>{percent}% Concluído</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* LAUNCH READINESS STATUS BOX */}
      <div
        className={`p-5 rounded-2xl border flex items-center justify-between gap-4 transition shadow-xl ${
          isReadyForLaunch
            ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
            : "bg-slate-900 border-amber-500/30 text-amber-200"
        }`}
      >
        <div className="flex items-center gap-3">
          {isReadyForLaunch ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
          )}
          <div>
            <h4 className="text-sm font-extrabold font-sans">
              {isReadyForLaunch
                ? "🟢 PRONTO PARA PUBLICAR! Todos os itens críticos foram validados."
                : `🟡 ATENÇÃO: ${criticalItems.length - criticalCompleted} item(ns) crítico(s) ainda precisa(m) de validação.`}
            </h4>
            <p className="text-xs opacity-80 mt-0.5">
              {isReadyForLaunch
                ? "Seu funil possui infraestrutura segura e está preparado para receber tráfego."
                : "Conclua os itens marcados como CRÍTICO (incluindo Pixels e Domínio) antes de liberar anúncios pagos para evitar perda de métricas de conversão."}
            </p>
          </div>
        </div>
      </div>

      {/* DEDICATED PASSO DE CONFIGURAÇÃO DE PIXELS & DOMÍNIO PAINEL DEDICADO */}
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl p-5 md:p-6 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold shadow-lg">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  PASSO ESPECIAL: GUIA E SALVAMENTO DE PIXELS & DOMÍNIO
                </h3>
                <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-[9px] font-bold uppercase border border-teal-500/30">
                  PASSO A PASSO GUIADO
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Guia interativo para Meta Ads e TikTok Ads, com salvamento de IDs no sistema e direcionamento para sua plataforma de checkout.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>{showGuide ? "Recolher Painel" : "Expandir Painel do Passo"}</span>
            </button>
          </div>
        </div>

        {showGuide && (
          <div className="space-y-6">
            {/* CHECKOUT PLATFORM SELECTOR DROPDOWN & DIRECT LINKS */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="text-xs font-bold text-teal-400 font-mono uppercase flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  1. Selecione a sua Plataforma de Checkout Ativa:
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCheckoutPlatform}
                    onChange={(e) => setSelectedCheckoutPlatform(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-white font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="kiwify">Kiwify (Recomendado)</option>
                    <option value="hotmart">Hotmart</option>
                    <option value="cakto">Cakto</option>
                    <option value="eduzz">Eduzz (Sun)</option>
                    <option value="perfectpay">PerfectPay</option>
                  </select>
                  <a
                    href={CHECKOUT_GUIDE_LINKS[selectedCheckoutPlatform]?.url || "https://dashboard.kiwify.com.br"}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold text-xs rounded-xl border border-teal-500/30 flex items-center gap-1.5 transition"
                  >
                    <span>Acessar {CHECKOUT_GUIDE_LINKS[selectedCheckoutPlatform]?.name}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* DYNAMIC PATH GUIDE BOX */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 space-y-1">
                  <span className="text-[10px] font-bold font-mono text-blue-400 uppercase block">Caminho para cole o Pixel no Checkout:</span>
                  <p className="text-slate-300 font-medium">{CHECKOUT_GUIDE_LINKS[selectedCheckoutPlatform]?.pixelPath}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 space-y-1">
                  <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase block">Caminho para Verificação de Domínio:</span>
                  <p className="text-slate-300 font-medium">{CHECKOUT_GUIDE_LINKS[selectedCheckoutPlatform]?.domainPath}</p>
                </div>
              </div>
            </div>

            {/* GUIDE NAVIGATION TABS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setActiveGuideTab("meta")}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-2 shrink-0 ${
                  activeGuideTab === "meta"
                    ? "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                Meta (Facebook/Instagram) Pixel & CAPI
              </button>

              <button
                type="button"
                onClick={() => setActiveGuideTab("tiktok")}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-2 shrink-0 ${
                  activeGuideTab === "tiktok"
                    ? "bg-pink-600 text-white border-pink-400 shadow-lg shadow-pink-500/20"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
                TikTok Ads Manager Pixel
              </button>

              <button
                type="button"
                onClick={() => setActiveGuideTab("domain")}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-2 shrink-0 ${
                  activeGuideTab === "domain"
                    ? "bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/20"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Verificação de Domínio & CNAME
              </button>

              <button
                type="button"
                onClick={() => setActiveGuideTab("checkout_links")}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-2 shrink-0 ${
                  activeGuideTab === "checkout_links"
                    ? "bg-teal-600 text-white border-teal-400 shadow-lg shadow-teal-500/20"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                Links Diretos do Checkout
              </button>
            </div>

            {/* TAB 1: META PIXEL CONTENT */}
            {activeGuideTab === "meta" && (
              <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
                  <div>
                    <h4 className="text-sm font-black text-blue-400 uppercase tracking-tight flex items-center gap-2">
                      🔵 Passo 1: Como Copiar o Meta Pixel ID e CAPI Token
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Siga o tutorial visual abaixo para extrair o ID numérico e a chave da API de Conversões.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* STEP 1 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[9px] font-bold uppercase border border-blue-500/30">
                        ETAPA 1: LOCALIZAR ID NO META
                      </span>
                      <h5 className="text-xs font-bold text-white mt-2">1. Gerenciador de Negócios Meta</h5>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Acesse <strong className="text-slate-200">business.facebook.com → Configurações do Negócio → Fontes de Dados → Conjuntos de Dados (Pixels)</strong>. Copie o ID numérico de 15 dígitos.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 font-mono text-[10px] text-blue-300">
                      Exemplo Pixel ID: <span className="font-bold text-white">987654321012345</span>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[9px] font-bold uppercase border border-blue-500/30">
                        ETAPA 2: TOKEN CAPI (Opcional Recom)
                      </span>
                      <h5 className="text-xs font-bold text-white mt-2">2. Gerar Token de Conversões</h5>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Em <strong className="text-slate-200">Gerenciador de Eventos → Configurações → API de Conversões</strong>, clique em "Gerar Token de Acesso" e copie o texto gerado.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-[10px] text-emerald-400 font-mono">
                      Evita perdas de até 30% nas vendas do iOS 14+
                    </div>
                  </div>

                  {/* STEP 3 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[9px] font-bold uppercase border border-blue-500/30">
                        ETAPA 3: COLAR NO CHECKOUT
                      </span>
                      <h5 className="text-xs font-bold text-white mt-2">3. Cole no {CHECKOUT_GUIDE_LINKS[selectedCheckoutPlatform]?.name}</h5>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        No painel do seu produto, cole o ID do Pixel e o Token CAPI na aba de Rastreamento do Meta Ads.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-[10px] text-blue-300 font-mono">
                      Eventos: PageView, InitiateCheckout, Purchase
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TIKTOK PIXEL CONTENT */}
            {activeGuideTab === "tiktok" && (
              <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
                  <div>
                    <h4 className="text-sm font-black text-pink-400 uppercase tracking-tight flex items-center gap-2">
                      🎵 Passo 2: Como Configurar o TikTok Ads Pixel ID
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Passo a passo para capturar o código do TikTok Ads Manager e ativar os eventos de conversão.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* STEP 1 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono text-[9px] font-bold uppercase border border-pink-500/30">
                        ETAPA 1: TIKTOK ADS MANAGER
                      </span>
                      <h5 className="text-xs font-bold text-white mt-2">1. Criar Pixel Web</h5>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Em <strong className="text-slate-200">TikTok Ads Manager → Ativos → Eventos → Eventos da Web</strong>, clique em "Criar Pixel" e escolha a opção "Manual".
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 font-mono text-[10px] text-pink-300">
                      Exemplo Pixel: <span className="font-bold text-white">C8294719241284719</span>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono text-[9px] font-bold uppercase border border-pink-500/30">
                        ETAPA 2: CONFIGURAR EVENTO
                      </span>
                      <h5 className="text-xs font-bold text-white mt-2">2. Evento CompletePayment</h5>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Selecione o tipo de evento principal como <strong className="text-slate-200">CompletePayment (Pagamento Concluído)</strong> para que suas campanhas otimizem para vendas.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-[10px] text-pink-400 font-mono">
                      Atribuição automática via Checkout
                    </div>
                  </div>

                  {/* STEP 3 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono text-[9px] font-bold uppercase border border-pink-500/30">
                        ETAPA 3: COLAR NO CHECKOUT
                      </span>
                      <h5 className="text-xs font-bold text-white mt-2">3. Cole no {CHECKOUT_GUIDE_LINKS[selectedCheckoutPlatform]?.name}</h5>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Cole o ID do TikTok Pixel no campo "TikTok Ads Pixel" do seu produto no checkout.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-[10px] text-slate-400 font-mono">
                      Testar com TikTok Pixel Helper Extension
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DOMAIN VERIFICATION CONTENT */}
            {activeGuideTab === "domain" && (
              <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
                  <div>
                    <h4 className="text-sm font-black text-emerald-400 uppercase tracking-tight flex items-center gap-2">
                      🌐 Passo 3: Verificação de Domínio e Redirecionamento CNAME
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Garantia de segurança da marca e permissão de eventos agregados de conversão no Meta Ads.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* STEP 1 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold uppercase border border-emerald-500/30">
                        ETAPA 1: REGISTRO TXT NO META
                      </span>
                      <h5 className="text-xs font-bold text-white mt-2">1. Adicionar Domínio no Meta</h5>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Em <strong className="text-slate-200">Meta Business Suite → Segurança da Marca → Domínios</strong>, insira seu domínio sem www (ex: <code className="text-emerald-300">seusite.com.br</code>) e copie o código TXT DNS.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-850 font-mono text-[9px] text-emerald-400 flex items-center justify-between">
                      <span className="truncate">facebook-domain-verification=123xyz</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("facebook-domain-verification=infinity123456789", "TXT do Meta Copiado!")}
                        className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        title="Copiar TXT de Exemplo"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold uppercase border border-emerald-500/30">
                        ETAPA 2: DNS NO PROVEDOR
                      </span>
                      <h5 className="text-xs font-bold text-white mt-2">2. Cole na Cloudflare / Hostinger</h5>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Acesse a Zona de DNS do seu provedor de domínio e adicione uma entrada <strong className="text-slate-200">TXT</strong> com o valor copiado do Meta.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-850 text-[10px] text-slate-300 font-mono">
                      Tipo: TXT | Nome: @ | Valor: facebook-domain...
                    </div>
                  </div>

                  {/* STEP 3 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold uppercase border border-emerald-500/30">
                        ETAPA 3: CNAME DO CHECKOUT
                      </span>
                      <h5 className="text-xs font-bold text-white mt-2">3. Subdomínio de Checkout</h5>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Crie uma entrada <strong className="text-slate-200">CNAME</strong> (ex: <code className="text-emerald-300">pay.seusite.com.br</code>) apontando para a Kiwify/Hotmart para que o checkout rode sob seu próprio domínio.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-850 text-[10px] text-emerald-400 font-mono">
                      Aumenta a confiança do comprador em 40%!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: DIRECT LINKS TO ALL CHECKOUTS */}
            {activeGuideTab === "checkout_links" && (
              <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <h4 className="text-sm font-black text-teal-400 uppercase tracking-tight flex items-center gap-2 border-b border-slate-850 pb-3">
                  <Link2 className="w-4 h-4" />
                  Links Diretos para as Principais Ferramentas de Checkout
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(CHECKOUT_GUIDE_LINKS).map(([key, item]) => (
                    <a
                      key={key}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/50 rounded-2xl transition flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-extrabold text-white group-hover:text-teal-300 block">
                          {item.name} Checkout
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Abrir Dashboard Oficial</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* DEDICATED FIELDS FOR USER TO INPUT & SAVE PIXEL CREDENTIALS LOCALLY */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-teal-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-400" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                    CAMPOS DEDICADOS: SALVAR CREDENCIAIS DE RASTREAMENTO NO INFINITY OS
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Armazenamento Local Seguro</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* META PIXEL ID */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-blue-400 uppercase font-mono block">
                    Meta (Facebook) Pixel ID:
                  </label>
                  <input
                    type="text"
                    value={savedMetaPixelId}
                    onChange={(e) => setSavedMetaPixelId(e.target.value)}
                    placeholder="Ex: 123456789012345 (15 números)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* TIKTOK PIXEL ID */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-pink-400 uppercase font-mono block">
                    TikTok Ads Pixel ID:
                  </label>
                  <input
                    type="text"
                    value={savedTiktokPixelId}
                    onChange={(e) => setSavedTiktokPixelId(e.target.value)}
                    placeholder="Ex: C8294719241284719"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-pink-500 font-mono"
                  />
                </div>

                {/* META CAPI TOKEN */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase font-mono block">
                    Token de Acesso CAPI (Meta Conversion API):
                  </label>
                  <input
                    type="password"
                    value={savedMetaCapiToken}
                    onChange={(e) => setSavedMetaCapiToken(e.target.value)}
                    placeholder="EAAxxxxx..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                {/* VERIFIED DOMAIN URL */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-emerald-400 uppercase font-mono block">
                    Seu Domínio de Vendas / Subdomínio CNAME:
                  </label>
                  <input
                    type="text"
                    value={savedDomainName}
                    onChange={(e) => setSavedDomainName(e.target.value)}
                    placeholder="Ex: pay.minhamarca.com.br"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[10px] text-slate-400 leading-tight">
                  💡 Ao clicar em Salvar, o Infinity OS registra esses dados e marcará automaticamente as etapas no seu Checklist de Lançamento.
                </span>

                <button
                  type="button"
                  onClick={handleSavePixelCredentials}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2 shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Dados & Validar Checklist</span>
                </button>
              </div>

              {isSavedNotice && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-mono font-bold text-center">
                  ✨ Credenciais registradas com sucesso! As etapas de Pixel e Domínio foram salvas e marcadas no seu Checklist.
                </div>
              )}
            </div>

            {copiedText && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-mono font-bold text-center">
                ✨ {copiedText}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CHECKLIST ITEMS LIST */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 pt-2">
          <CheckSquare className="w-4 h-4 text-teal-400" />
          Lista Completa de Itens de Segurança e Lançamento
        </h3>

        {CHECKLIST_ITEMS.map((item) => {
          const isDone = completedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-4 rounded-2xl border transition flex items-start gap-3.5 cursor-pointer group select-none ${
                isDone
                  ? "bg-slate-950/80 border-slate-800 opacity-80"
                  : "bg-slate-900 border-slate-800 hover:border-teal-500/40 shadow-md"
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-slate-500 group-hover:text-teal-400 transition cursor-pointer shrink-0"
              >
                {isDone ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-600" />
                )}
              </button>

              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-mono text-[9px] font-bold border border-slate-850">
                    {item.category}
                  </span>
                  {item.critical && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[9px] font-bold border border-rose-500/30">
                      CRÍTICO
                    </span>
                  )}
                  {item.guideType && (
                    <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-[9px] font-bold border border-teal-500/30 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-teal-400" />
                      GUIA DISPONÍVEL
                    </span>
                  )}
                  <h4
                    className={`text-sm font-bold transition ${
                      isDone ? "line-through text-slate-500" : "text-white group-hover:text-teal-300"
                    }`}
                  >
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
