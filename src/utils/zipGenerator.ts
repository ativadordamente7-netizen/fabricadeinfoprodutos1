import JSZip from "jszip";
import { SalesPageData, EbookData } from "../types";
import { processVideoSource } from "./videoHelper";

export function getExportedHTML(salesPage: SalesPageData, ebook: EbookData): string {
  // Theme color styling
  const themes: { [key: string]: { primary: string; bgGrad: string; textGrad: string; btn: string; hoverBtn: string; badge: string; accent: string } } = {
    emerald: {
      primary: "#10b981",
      bgGrad: "from-emerald-950 to-slate-950",
      textGrad: "from-emerald-400 to-teal-300",
      btn: "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
      hoverBtn: "hover:bg-emerald-400",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      accent: "#34d399",
    },
    indigo: {
      primary: "#6366f1",
      bgGrad: "from-indigo-950 to-slate-950",
      textGrad: "from-indigo-400 to-purple-300",
      btn: "bg-indigo-500 text-white hover:bg-indigo-400",
      hoverBtn: "hover:bg-indigo-400",
      badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      accent: "#818cf8",
    },
    rose: {
      primary: "#f43f5e",
      bgGrad: "from-rose-950 to-slate-950",
      textGrad: "from-rose-400 to-pink-300",
      btn: "bg-rose-500 text-white hover:bg-rose-400",
      hoverBtn: "hover:bg-rose-400",
      badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      accent: "#fb7185",
    },
    slate: {
      primary: "#475569",
      bgGrad: "from-slate-900 to-slate-950",
      textGrad: "from-slate-400 to-slate-200",
      btn: "bg-slate-700 text-white hover:bg-slate-600",
      hoverBtn: "hover:bg-slate-600",
      badge: "bg-slate-800 text-slate-300 border-slate-700",
      accent: "#94a3b8",
    },
  };

  const theme = themes[salesPage.themeColor] || themes["emerald"];

  // Mapping Cover background for 3D mockup
  const coverBgColors: { [key: string]: string } = {
    emerald: "linear-gradient(135deg, #064e3b, #022c22)",
    indigo: "linear-gradient(135deg, #1e1b4b, #0f172a)",
    rose: "linear-gradient(135deg, #4c0519, #1e1b4b)",
    slate: "linear-gradient(135deg, #0f172a, #020617)",
    amber: "linear-gradient(135deg, #78350f, #1e1b4b)",
  };
  const mockBg = coverBgColors[ebook.coverColor] || coverBgColors["slate"];

  // Filter sections in visible order
  const order = salesPage.sectionsOrder || [
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
  ];

  // Process VSL Video for Static HTML Export
  const vslProcessed = (salesPage.vslEnabled && (salesPage.vslUrl || salesPage.vslEmbedCode))
    ? processVideoSource(salesPage.vslUrl || "", salesPage.vslEmbedCode || "", salesPage.vslPlatform)
    : null;

  const showVsl = salesPage.vslEnabled && vslProcessed && vslProcessed.src && salesPage.vslVisible !== false;
  const vslAutoplayAttr = salesPage.vslAutoplayMuted ? "autoplay=1&mute=1&muted=1" : "";
  
  let vslIframeSrc = "";
  if (showVsl && vslProcessed) {
    vslIframeSrc = vslProcessed.src;
    if (vslAutoplayAttr) {
      vslIframeSrc = vslIframeSrc.includes("?") 
        ? `${vslIframeSrc}&${vslAutoplayAttr}` 
        : `${vslIframeSrc}?${vslAutoplayAttr}`;
    }
  }

  // Generate HTML for the VSL Block
  const vslHtmlBlock = showVsl ? `
        <!-- VSL VIDEO LETTER BLOCK -->
        <div class="w-full max-w-2xl mx-auto my-8 flex flex-col gap-3 text-center items-center">
          ${salesPage.vslTitle ? `<span class="text-xs md:text-sm font-bold text-slate-300 tracking-wider uppercase">${salesPage.vslTitle}</span>` : ""}
          <div class="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl" style="width: 100%; aspect-ratio: 16/9;">
            <iframe
              src="${vslIframeSrc}"
              class="absolute inset-0 w-full h-full border-0"
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              title="Video Sales Letter"
            ></iframe>
          </div>
          ${salesPage.vslSubtitle ? `<p class="text-xs text-slate-400 italic max-w-lg leading-relaxed">${salesPage.vslSubtitle}</p>` : ""}
          
          ${salesPage.vslShowCtaBelow !== false ? `
            <div style="margin-top: 12px; width: 100%; display: flex; justify-content: center;">
              <a href="${salesPage.checkoutLink || '#'}" target="_blank" rel="noopener noreferrer" class="cta-btn inline-block font-extrabold text-xs md:text-sm px-6 py-3 rounded-xl shadow-md tracking-wider transition-all transform hover:scale-[1.02]">
                ${salesPage.vslCtaText || "QUERO GARANTIR MINHA VAGA AGORA"} 🚀
              </a>
            </div>
          ` : ""}
        </div>
  ` : "";

  const isVslTop = showVsl && (salesPage.vslPosition || "top") === "top";
  const isVslBottom = showVsl && salesPage.vslPosition === "bottom";

  const hasAiCover = !!(
    ebook.coverImage ||
    (ebook.cover && (ebook.cover.imageUrl || ebook.cover.coverImage))
  );
  const cov = ebook.cover || {};
  const coverImgUrl = ebook.coverImage || cov.imageUrl || cov.coverImage || "";

  const getFontFamilyCSS = (typ?: string) => {
    switch (typ) {
      case "Space Grotesk": return "font-family: 'Space Grotesk', sans-serif;";
      case "Playfair Display": return "font-family: 'Playfair Display', Georgia, serif;";
      case "JetBrains Mono": return "font-family: 'JetBrains Mono', monospace;";
      default: return "font-family: 'Inter', sans-serif;";
    }
  };

  const getAlignmentCSS = (align?: string) => {
    switch (align) {
      case "center": return "justify-content: center;";
      case "bottom": return "justify-content: flex-end; padding-bottom: 20px;";
      default: return "justify-content: flex-start; padding-top: 20px;";
    }
  };

  let coverHtml = "";
  if (hasAiCover) {
    coverHtml = `
            <div class="book-cover" style="background-image: url('${coverImgUrl}'); background-size: cover; background-position: center; position: absolute; width: 100%; height: 100%; border-radius: 2px 8px 8px 2px; box-shadow: 10px 10px 25px rgba(0,0,0,0.5); transform: rotateY(-20deg); transform-style: preserve-3d; z-index: 2; display: flex; flex-direction: column; overflow: hidden; padding: 15px;">
              ${cov.overlayColor !== "none" ? `<div style="position: absolute; inset: 0; background-color: #020617; opacity: ${cov.overlayOpacity ?? 0.55}; z-index: 1;"></div>` : ""}
              ${cov.showDecorativeBorder ? `<div style="position: absolute; inset: 10px; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; pointer-events: none; z-index: 2;"></div>` : ""}
              <div style="position: relative; z-index: 3; height: 100%; display: flex; flex-direction: column; ${getAlignmentCSS(cov.alignment)} gap: 4px;">
                ${cov.alignment !== "bottom" ? `<span style="font-size: 6px; font-weight: 900; letter-spacing: 1.5px; color: ${cov.authorColor || "#10B981"}; text-transform: uppercase; ${getFontFamilyCSS(cov.typography)}">E-BOOK PREMIUM</span>` : ""}
                <div style="font-size: 11px; font-weight: 900; line-height: 1.1; letter-spacing: -0.2px; color: ${cov.titleColor || "#FFFFFF"}; text-transform: uppercase; ${getFontFamilyCSS(cov.typography)}">${ebook.title}</div>
                <div style="font-size: 6px; opacity: 0.9; margin-top: 2px; font-style: italic; color: ${cov.subtitleColor || "#D1D5DB"}; ${getFontFamilyCSS(cov.typography)}">${ebook.subtitle}</div>
                <div style="font-size: 6px; font-weight: bold; position: absolute; bottom: 10px; left: 0; right: 0; color: ${cov.authorColor || "#10B981"}; ${getFontFamilyCSS(cov.typography)}">Autor: ${ebook.author}</div>
              </div>
            </div>
    `;
  } else {
    coverHtml = `
            <div class="book-cover">
              <span style="font-size:8px; font-weight:bold; letter-spacing:1px; opacity:0.8; margin-bottom:4px;">E-BOOK</span>
              <div style="font-size:12px; font-weight:900; line-height:1.2; letter-spacing:-0.2px;">${ebook.title}</div>
              <div style="font-size:7px; opacity:0.9; margin-top:5px; font-style:italic;">${ebook.subtitle}</div>
              <div style="font-size:7px; font-weight:bold; position:absolute; bottom:15px; left:15px; right:15px;">Autor: ${ebook.author}</div>
            </div>
    `;
  }

  // Determine what mockup/script layout to show in exported HTML based on VSL configuration
  let heroMockupBlock = "";

  if (!salesPage.vslEnabled) {
    // Case 1: WITHOUT VSL -> Centered premium 3D book mockup only, buyable & floating
    heroMockupBlock = `
        <!-- Centered Mockup 3D container (No VSL) -->
        <div class="flex flex-col items-center justify-center py-6 w-full max-w-sm mx-auto mt-8 float-only-no-vsl">
          <a href="${salesPage.checkoutLink || '#'}" target="_blank" rel="noopener noreferrer" class="book-wrapper-link">
            <div class="book-container">
              <div class="book-spine"></div>
              ${coverHtml}
            </div>
          </a>
          <p class="text-[11px] text-slate-400 mt-4 font-mono font-bold uppercase tracking-wider">Maquete Tridimensional do Produto</p>
        </div>
    `;
  } else if (!showVsl) {
    // Case 2: WITH VSL but NO video uploaded -> Side-by-side grid of 3D Cover (buyable but NOT floating) & baseline VSL explanation script
    heroMockupBlock = `
        <!-- Side-by-side baseline configuration (VSL Enabled but no video url configured) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-3xl mt-8">
          <!-- Mockup 3D container (NOT floating because VSL is enabled) -->
          <div class="flex flex-col items-center justify-center py-4">
            <a href="${salesPage.checkoutLink || '#'}" target="_blank" rel="noopener noreferrer" class="book-wrapper-link">
              <div class="book-container">
                <div class="book-spine"></div>
                ${coverHtml}
              </div>
            </a>
            <p class="text-[11px] text-slate-400 mt-4 font-mono font-bold uppercase tracking-wider">Metodologia 3D Ativa Incluída</p>
          </div>
 
          <!-- Video / Hook / Script VSL description -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left flex flex-col justify-center gap-3 shadow-xl">
            <span class="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider block">Script de Apresentação</span>
            <p class="text-xs text-slate-300 italic leading-relaxed">
              "${salesPage.videoPlaceholderText}"
            </p>
            <hr class="border-slate-800 my-1">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pronto para Acesso Imediato</span>
            </div>
          </div>
        </div>
    `;
  } else {
    // Case 3: WITH VSL AND video IS uploaded -> ONLY show the video player block (handled by vslHtmlBlock)
    heroMockupBlock = "";
  }

  // Helper to build sections
  const sectionsContent: { [key: string]: string } = {
    hero: `
    <!-- HERO SECTION -->
    <section class="relative bg-slate-950 text-white px-6 py-16 md:py-24 overflow-hidden border-b border-slate-800">
      <!-- Ambient light effect -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-${salesPage.themeColor}-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div class="max-w-4xl mx-auto flex flex-col items-center text-center gap-6 relative z-10">
        <span class="inline-block px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-widest border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
          🔥 OPORTUNIDADE ÚNICA E LIMITADA
        </span>
        
        <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl">
          ${salesPage.headline}
        </h1>
        
        <p class="text-slate-300 text-sm md:text-lg max-w-2xl font-medium">
          ${salesPage.subheadline}
        </p>

        ${isVslTop ? vslHtmlBlock : ""}
 
        ${heroMockupBlock}

        ${isVslBottom ? vslHtmlBlock : ""}
 
        <div class="mt-8">
          <a href="${salesPage.checkoutLink || '#'}" target="_blank" rel="noopener noreferrer" class="cta-btn inline-block font-extrabold text-base px-8 py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.03]">
            ${salesPage.pricing.ctaText} 🚀
          </a>
          <span class="block text-[11px] text-slate-400 mt-3 font-mono">🔒 Compra Segura • Acesso imediato via e-mail</span>
        </div>
      </div>
    </section>
    `,

    problem: `
    <!-- PROBLEM SECTION -->
    <section class="py-16 px-6 bg-slate-50 border-b border-slate-200">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-xs font-bold text-red-500 uppercase tracking-widest font-mono text-center mb-2">Será que isto acontece com você?</h2>
        <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight text-center mb-8">Por que você ainda se sente estagnado?</h3>
        
        <div class="flex flex-col gap-4">
          ${salesPage.painPoints.map(pain => `
            <div class="bg-white border border-red-100 rounded-xl p-4 flex gap-3 shadow-sm">
              <div class="bg-red-50 text-red-500 font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">✕</div>
              <p class="text-sm text-slate-600 font-medium leading-relaxed">${pain}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
    `,

    transformation: `
    <!-- TRANSFORMATION SECTION -->
    <section class="py-16 px-6 bg-white border-b border-slate-200">
      <div class="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <span class="text-xs font-bold text-emerald-500 uppercase tracking-widest font-mono">A Grande Virada de Chave</span>
        <h2 class="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          O Futuro Que Te Aguarda Do Outro Lado
        </h2>
        <p class="text-sm md:text-base text-slate-600 max-w-xl leading-relaxed italic">
          "${salesPage.hookText}"
        </p>
        <div class="w-24 h-1 bg-emerald-500/20 rounded-full my-4"></div>
        <p class="text-xs text-slate-500 font-mono">Sem fórmulas milagrosas. Apenas estratégias reais aplicadas passo a passo.</p>
      </div>
    </section>
    `,

    productIntro: `
    <!-- PRODUCT INTRO SECTION -->
    <section class="py-16 px-6 bg-slate-900 text-white border-b border-slate-800">
      <div class="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <span class="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">Apresentação Oficial</span>
        <h2 class="text-2xl md:text-4xl font-extrabold tracking-tight">O Manual Definitivo do Sucesso</h2>
        <p class="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
          O infoproduto <strong>"${ebook.title}"</strong> foi projetado com um objetivo central: resolver sua dor de forma direta, simples e pragmática. Este não é mais um livro genérico — é um mapa de ação consolidado.
        </p>
        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-left w-full mt-4 max-w-xl shadow-xl">
          <h4 class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">📖 Sinopse do E-book</h4>
          <p class="text-xs text-slate-300 leading-relaxed italic">
            "${ebook.synopsis}"
          </p>
        </div>
      </div>
    </section>
    `,

    whatYouLearn: `
    <!-- WHAT YOU WILL LEARN -->
    <section class="py-16 px-6 bg-slate-50 border-b border-slate-200">
      <div class="max-w-3xl mx-auto">
        <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest font-mono text-center block mb-2">Por dentro do método</span>
        <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight text-center mb-8">O que você vai aprender em cada capítulo</h2>
        
        <div class="grid grid-cols-1 gap-4">
          ${ebook.chapters.map(ch => `
            <div class="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:border-emerald-500/30 transition-all">
              <span class="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider">Capítulo 0${ch.number}</span>
              <h4 class="text-sm font-bold text-slate-900 mt-0.5">${ch.title}</h4>
              <p class="text-xs text-slate-500 mt-2 leading-relaxed italic line-clamp-2">
                ${ch.content.substring(0, 160)}...
              </p>
              <div class="mt-3 text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                <span>✓ Estratégia de Prática Inclusa</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
    `,

    benefits: `
    <!-- BENEFITS -->
    <section class="py-16 px-6 bg-white border-b border-slate-200">
      <div class="max-w-3xl mx-auto">
        <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest font-mono text-center block mb-2">Vantagens Exclusivas</span>
        <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight text-center mb-8">Por que este material é diferente de tudo o que existe?</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${salesPage.benefits.map(b => `
            <div class="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-2">
              <div class="bg-emerald-100 text-emerald-700 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">✓</div>
              <h4 class="text-sm font-extrabold text-slate-900 mt-1">${b.title}</h4>
              <p class="text-xs text-slate-500 leading-relaxed">${b.description}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
    `,

    testimonials: `
    <!-- TESTIMONIALS SECTION -->
    ${salesPage.testimonials && salesPage.testimonials.length > 0 ? `
    <section class="py-16 px-6 bg-slate-50 border-b border-slate-200">
      <div class="max-w-3xl mx-auto">
        <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest font-mono text-center block mb-2">Quem Já Testou Comprova</span>
        <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight text-center mb-8">Depoimentos Reais de Alunos</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${salesPage.testimonials.map(t => `
            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div class="flex text-amber-400 gap-0.5 mb-2">★★★★★</div>
                <p class="text-xs text-slate-600 leading-relaxed italic mb-3">"${t.text}"</p>
              </div>
              <div>
                <strong class="text-xs text-slate-800 block">${t.name}</strong>
                <span class="text-[10px] text-slate-400 font-mono">${t.profile}</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
    ` : ""}
    `,

    offer: `
    <!-- OFFER & PRICING -->
    <section class="py-16 px-6 bg-slate-900 text-white text-center border-b border-slate-800">
      <div class="max-w-2xl mx-auto flex flex-col items-center gap-4">
        <span class="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">Oferta Especial de Lançamento</span>
        <h2 class="text-2xl md:text-4xl font-extrabold tracking-tight">Comece a Mudar Sua Vida Hoje</h2>
        <p class="text-slate-300 text-xs md:text-sm max-w-md">
          Ao garantir sua cópia hoje, você recebe o E-book completo com todos os bônus e atualizações vitalícias.
        </p>

        <div class="bg-slate-950 border-2 border-emerald-500/30 rounded-2xl p-8 my-6 w-full max-w-sm shadow-2xl flex flex-col items-center gap-3">
          <span class="text-[10px] text-emerald-400 font-mono uppercase tracking-widest font-bold">Acesso Vitalício</span>
          <h3 class="text-lg font-bold text-white">${ebook.title}</h3>
          
          <div class="text-slate-400 text-xs line-through mt-2">De ${salesPage.pricing.originalPrice}</div>
          <div class="text-3xl md:text-4xl font-extrabold text-emerald-400">Por Apenas ${salesPage.pricing.discountedPrice}</div>
          
          <a href="${salesPage.checkoutLink || '#'}" target="_blank" rel="noopener noreferrer" class="cta-btn w-full inline-block font-extrabold text-xs py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-[1.03] mt-3">
            ${salesPage.pricing.ctaText}
          </a>
          <span class="text-[9px] text-slate-500 font-mono uppercase tracking-wider">🔒 Pagamento 100% criptografado e seguro</span>
        </div>
      </div>
    </section>
    `,

    guarantee: `
    <!-- GUARANTEE SECTION -->
    ${salesPage.guaranteeDays && salesPage.guaranteeDays !== "0" ? `
    <section class="py-16 px-6 bg-white border-b border-slate-200">
      <div class="max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-left bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <div class="bg-emerald-100 text-emerald-700 w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-xl shrink-0">
          ${salesPage.guaranteeDays}d
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-900">Garantia Incondicional de ${salesPage.guaranteeDays} Dias</h3>
          <p class="text-xs text-slate-500 mt-1 leading-relaxed">
            Se por qualquer motivo você achar que o e-book não serviu para você, basta enviar um e-mail em até ${salesPage.guaranteeDays} dias e devolveremos 100% do seu dinheiro investido. Sem burocracias, sem perguntas chatas. O risco é inteiramente nosso.
          </p>
        </div>
      </div>
    </section>
    ` : ""}
    `,

    faq: `
    <!-- FAQ SECTION -->
    <section class="py-16 px-6 bg-slate-50 border-b border-slate-200">
      <div class="max-w-2xl mx-auto">
        <span class="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono text-center block mb-2">Tire Suas Dúvidas</span>
        <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight text-center mb-8">Perguntas Frequentes (FAQ)</h2>
        
        <div class="flex flex-col gap-3">
          ${salesPage.faq.map((item, idx) => `
            <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <button class="faq-toggle w-full text-left px-5 py-4 font-bold text-xs md:text-sm text-slate-800 hover:bg-slate-50 flex justify-between items-center transition" data-index="${idx}">
                <span>${item.question}</span>
                <span class="faq-icon text-slate-400 font-bold transition-transform">+</span>
              </button>
              <div class="faq-content hidden px-5 py-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed bg-slate-50/50">
                ${item.answer}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
    `,
  };

  // Build ordered HTML output
  let orderedSectionsHTML = "";
  order.forEach(sectionId => {
    if (salesPage.sectionsVisibility[sectionId as keyof typeof salesPage.sectionsVisibility] !== false) {
      if (sectionsContent[sectionId]) {
        orderedSectionsHTML += sectionsContent[sectionId];
      }
    }
  });

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${salesPage.headline}</title>
  
  <!-- Tailwind CSS loaded safely via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <style>
    /* Premium 3D Book rendering in CSS */
    .book-container {
      position: relative;
      width: 130px;
      height: 190px;
      perspective: 1000px;
      transition: transform 0.5s ease;
    }
    .book-container:hover {
      transform: rotateY(-25deg) rotateX(8deg) scale(1.05);
    }
    .book-cover {
      position: absolute;
      width: 100%;
      height: 100%;
      background: ${mockBg};
      color: white;
      padding: 15px;
      border-radius: 2px 8px 8px 2px;
      box-shadow: 10px 10px 25px rgba(0,0,0,0.5);
      transform: rotateY(-20deg);
      transform-style: preserve-3d;
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .book-spine {
      position: absolute;
      left: 0px;
      width: 12px;
      height: 100%;
      background: rgba(0,0,0,0.3);
      border-radius: 2px 0 0 2px;
      transform: rotateY(-90deg);
      transform-origin: left;
      z-index: 1;
    }
    .cta-btn {
      background: ${theme.primary};
      color: ${salesPage.themeColor === "emerald" ? "#0f172a" : "white"};
      box-shadow: 0 4px 20px ${theme.primary}50;
      transition: all 0.3s ease;
    }
    .cta-btn:hover {
      filter: brightness(1.15);
      box-shadow: 0 6px 24px ${theme.primary}70;
    }
    
    /* Dynamic Floating Animation when no VSL is active */
    @keyframes float-animation {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
      100% { transform: translateY(0px); }
    }
    .float-only-no-vsl {
      animation: float-animation 3s ease-in-out infinite;
    }
    .book-wrapper-link {
      display: inline-block;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.3s ease;
    }
    .book-wrapper-link:hover {
      transform: scale(1.02);
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased font-sans">

  ${orderedSectionsHTML}

  <!-- GLOBAL FOOTER & NICHE COMPLIANCE WARNING -->
  <footer class="bg-slate-950 text-slate-500 py-12 px-6 border-t border-slate-900 text-center">
    <div class="max-w-2xl mx-auto flex flex-col items-center gap-4">
      <p class="text-xs">
        Este site não é afiliado ao Facebook, Google ou a qualquer plataforma de anúncios. Os resultados informados são frutos de estudo e dedicação e podem variar de pessoa para pessoa.
      </p>
      
      <!-- Niche specific health warning if relevant -->
      ${["Emagrecimento & Fitness", "Finanças & Investimentos"].includes(ebook.coverPattern) ? `
        <div class="bg-slate-900 border border-slate-800 text-[10px] text-slate-400 p-3.5 rounded-lg max-w-lg italic">
          <strong>Aviso Educativo:</strong> O conteúdo deste produto possui caráter puramente educativo e não substitui o aconselhamento médico profissional, diagnóstico ou tratamentos específicos de especialistas.
        </div>
      ` : ""}

      <hr class="w-12 border-slate-800 my-2">
      
      <p class="text-[10px] font-mono">
        © ${new Date().getFullYear()} ${ebook.title}. Todos os direitos reservados.
      </p>

      ${salesPage.supportWhatsapp ? `
        <a href="https://wa.me/${salesPage.supportWhatsapp.replace(/[^0-9]/g, "")}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline">
          💬 Fale com o Suporte (WhatsApp)
        </a>
      ` : ""}
    </div>
  </footer>

  <!-- FAQ Toggle logic in lightweight Vanilla JS -->
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const faqToggles = document.querySelectorAll(".faq-toggle");
      faqToggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
          const content = toggle.nextElementSibling;
          const icon = toggle.querySelector(".faq-icon");
          
          if (content.classList.contains("hidden")) {
            content.classList.remove("hidden");
            icon.textContent = "−";
          } else {
            content.classList.add("hidden");
            icon.textContent = "+";
          }
        });
      });
    });
  </script>

</body>
</html>`;
}

export async function generateSalesPageZIP(salesPage: SalesPageData, ebook: EbookData) {
  const zip = new JSZip();
  const htmlContent = getExportedHTML(salesPage, ebook);
  
  // Add index.html to ZIP root
  zip.file("index.html", htmlContent);

  // Add a documentation helper file for Netlify publish instructions
  zip.file("LEIA-ME.txt", `=== INSTRUÇÕES DE PUBLICAÇÃO GRÁTIS NO NETLIFY ===

Sua página de vendas está totalmente pronta! Siga estes passos simples para publicá-la gratuitamente na internet:

1. Acesse o site do Netlify: https://www.netlify.com
2. Crie uma conta gratuita (ou faça login).
3. Vá para o painel principal e clique no menu "Sites".
4. Procure a seção de publicação manual: "Want to deploy a new site without connecting to Git? Drag and drop your site folder here".
5. Basta arrastar e soltar o arquivo "index.html" ou a pasta onde você descompactou este ZIP diretamente na área indicada!
6. Em menos de 5 segundos sua página estará online na internet com um link público gerado pelo Netlify.
7. Teste todos os botões para garantir que estão abrindo corretamente o seu link de pagamento: ${salesPage.checkoutLink}

Parabéns pelo lançamento! Boas vendas!
`);

  // Generate ZIP bundle
  const content = await zip.generateAsync({ type: "blob" });
  
  // Trigger file download
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  const zipName = `${ebook.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-pagina-de-vendas.zip`;
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
