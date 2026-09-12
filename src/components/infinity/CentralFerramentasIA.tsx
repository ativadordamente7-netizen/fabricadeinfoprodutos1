import React, { useState, useEffect } from "react";
import {
  Wrench,
  Search,
  ExternalLink,
  Star,
  Sparkles,
  Zap,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  Layers,
  ArrowUpRight
} from "lucide-react";

export interface AIToolItem {
  id: string;
  name: string;
  category: "Texto" | "Imagem" | "Vídeo" | "Áudio" | "Avatares" | "Sites" | "Automação" | "Produtividade";
  description: string;
  whenToUse: string;
  advantages: string[];
  limitations: string[];
  url: string;
  badge?: string;
  pricing?: "Gratuito" | "Freemium" | "Pago";
}

const AI_TOOLS_DATABASE: AIToolItem[] = [
  // TEXTO
  {
    id: "chatgpt",
    name: "ChatGPT (OpenAI)",
    category: "Texto",
    description: "Modelo de linguagem de ponta para criação de copies, e-books, roteiros e estratégias de vendas.",
    whenToUse: "Criação de headlines, e-mails, roteiros de VSL, estruturação de capítulos e atendimento.",
    advantages: ["Respostas extremamente perspicazes", "Ótimo para raciocínio lógico e copy persuasiva", "Grande ecossistema de plugins e GPTs"],
    limitations: ["Versão gratuita usa modelo mais simples", "Requer engenharia de prompt precisa"],
    url: "https://chat.openai.com",
    badge: "Essencial",
    pricing: "Freemium"
  },
  {
    id: "gemini",
    name: "Google Gemini",
    category: "Texto",
    description: "IA avançada da Google integrada com dados em tempo real da web e análise multimodal.",
    whenToUse: "Pesquisa de mercado em tempo real, validação de nicho, síntese de PDFs e criação de conteúdo.",
    advantages: ["Informações atualizadas ao vivo da pesquisa Google", "Processamento de textos gigantescos (1M+ tokens)", "Rápido e gratuito para uso básico"],
    limitations: ["Estilo de escrita pode requerer ajuste de tom de voz"],
    url: "https://gemini.google.com",
    badge: "Recomendado",
    pricing: "Freemium"
  },
  {
    id: "claude",
    name: "Claude (Anthropic)",
    category: "Texto",
    description: "Especialista em escrita natural, tom de voz humano e textos longos com estilo refinado.",
    whenToUse: "Redação de e-books completos, artigos profundos e cartas de vendas humanizadas.",
    advantages: ["Linguagem extremamente natural e elegante", "Excelente interpretação de contexto longo"],
    limitations: ["Limite de mensagens no plano gratuito"],
    url: "https://claude.ai",
    pricing: "Freemium"
  },

  // IMAGEM
  {
    id: "midjourney",
    name: "Midjourney",
    category: "Imagem",
    description: "A IA gráfica mais fotorrealista do mundo para capas de e-books, mockups e criativos de anúncios.",
    whenToUse: "Criação de imagens de alto impacto estético, personagens de marca e capas 3D.",
    advantages: ["Qualidade fotorrealista inacreditável", "Controle de estética e iluminação de cinema"],
    limitations: ["Exige uso pelo Discord ou plano pago web"],
    url: "https://www.midjourney.com",
    badge: "Líder em Qualidade",
    pricing: "Pago"
  },
  {
    id: "ideogram",
    name: "Ideogram AI",
    category: "Imagem",
    description: "IA especializada em gerar imagens fotorrealistas com TEXTOS PERFEITOS dentro da imagem.",
    whenToUse: "Criativos de anúncios com headlines embutidas, logotipos e banners para Instagram.",
    advantages: ["Rende textos legíveis sem erros ortográficos na imagem", "Gratuito para começar"],
    limitations: ["Menos estilo pintura que o Midjourney"],
    url: "https://ideogram.ai",
    badge: "Perfeito para Textos",
    pricing: "Freemium"
  },
  {
    id: "leonardo",
    name: "Leonardo AI",
    category: "Imagem",
    description: "Plataforma completa de geração de ativos visuais com controle de estilo e modelos treinados.",
    whenToUse: "Mockups de produtos digitais, artes para landing pages e avatares ilustrados.",
    advantages: ["Interface web fácil de usar", "Créditos diários gratuitos", "Modelos prontos para e-commerce"],
    limitations: ["Opções avançadas requerem créditos pagos"],
    url: "https://leonardo.ai",
    pricing: "Freemium"
  },

  // VÍDEO
  {
    id: "runway",
    name: "Runway Gen-2 / Gen-3",
    category: "Vídeo",
    description: "Gerador de vídeo por IA que transforma fotos estáticas e prompts em cenas em movimento de cinema.",
    whenToUse: "Criação de B-Rolls dinâmicos para VSL, anúncios para TikTok e Meta Ads.",
    advantages: ["Animações ultra-realistas", "Fácil de gerar animações a partir de imagens estáticas"],
    limitations: ["Geração de vídeo é computacionalmente cara (poucos segundos gratuitos)"],
    url: "https://runwayml.com",
    badge: "Top VSL",
    pricing: "Freemium"
  },
  {
    id: "opusclip",
    name: "Opus Clip",
    category: "Vídeo",
    description: "Ferramenta que transforma vídeos longos (podcasts, aulas) em dezenas de Reels/TikToks viralizados.",
    whenToUse: "Criação de anúncios em formato de cortes virais com legendas dinâmicas coloridas.",
    advantages: ["Identifica automaticamente os trechos de maior retenção", "Insere legendas animadas automáticas"],
    limitations: ["Requer vídeo de origem com fala clara"],
    url: "https://www.opus.pro",
    badge: "Automação de Cortes",
    pricing: "Freemium"
  },
  {
    id: "veed",
    name: "Veed.io AI",
    category: "Vídeo",
    description: "Editor de vídeo online acelerado por IA com tradutor automático, legenda e gerador de avatar.",
    whenToUse: "Edição rápida de vídeos de vendas, inclusão de legendas dinâmicas e elementos visuais.",
    advantages: ["Muito simples sem precisar instalar nada", "Legendas automáticas em português perfeito"],
    limitations: ["Marca d'água no plano gratuito"],
    url: "https://www.veed.io",
    pricing: "Freemium"
  },

  // ÁUDIO
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    category: "Áudio",
    description: "O sintetizador de voz hiper-realista mais avançado do mercado com clonagem vocal.",
    whenToUse: "Narração de VSLs, locução de anúncios, audiolivros e cursos sem precisar gravar com sua voz.",
    advantages: ["Vozes indistinguíveis de seres humanos", "Acentuação e emoção perfeitas em português BR"],
    limitations: ["Plano gratuito com limite de caracteres mensal"],
    url: "https://elevenlabs.io",
    badge: "Voz Realista #1",
    pricing: "Freemium"
  },
  {
    id: "adobe_enhance",
    name: "Adobe Podcast Speech Enhance",
    category: "Áudio",
    description: "Melhorador de áudio gratuito da Adobe que limpa ruídos e transforma gravações de celular em áudio de estúdio.",
    whenToUse: "Tratar narrações gravadas em ambientes barulhentos para usar nos seus cursos ou anúncios.",
    advantages: ["Totalmente gratuito", "Remove eco e chiado instantaneamente"],
    limitations: ["Suporta apenas arquivos de áudio MP3/WAV"],
    url: "https://podcast.adobe.com/enhance",
    badge: "Gratuito",
    pricing: "Gratuito"
  },

  // AVATARES
  {
    id: "heygen",
    name: "HeyGen",
    category: "Avatares",
    description: "Plataforma para criar avatares fotorrealistas falantes para VSL e vídeos de vendas.",
    whenToUse: "Apresentadores virtuais para ofertas sem aparecer fisicamente na câmera.",
    advantages: ["Sincronia labial perfeita", "Traduz o vídeo mantendo a voz e o movimento dos lábios"],
    limitations: ["Rendimentos em HD exigem plano pago"],
    url: "https://www.heygen.com",
    badge: "Líder Avatares",
    pricing: "Freemium"
  },

  // SITES & LANDING PAGES
  {
    id: "framer",
    name: "Framer AI",
    category: "Sites",
    description: "Criador de sites e landing pages profissionais com design estilo Silicon Valley e publicação em 1 clique.",
    whenToUse: "Construção de páginas de vendas com animações suaves e alta velocidade de carregamento.",
    advantages: ["Design ultramoderno nível Apple/Linear", "Responsivo automático e publicação instantânea"],
    limitations: ["Curva de aprendizado se quiser efeitos muito complexos"],
    url: "https://www.framer.com",
    pricing: "Freemium"
  },
  {
    id: "v0_dev",
    name: "v0 por Vercel",
    category: "Sites",
    description: "IA generativa para criar componentes e telas completas em React e Tailwind via prompt.",
    whenToUse: "Criar rapidamente estruturas de checkout, áreas de membros e calculadoras personalizadas.",
    advantages: ["Código limpo e produção-ready", "Desenvolvimento em tempo recorde"],
    limitations: ["Requer conhecimento básico de web"],
    url: "https://v0.dev",
    badge: "Código Premium",
    pricing: "Freemium"
  },

  // AUTOMAÇÃO
  {
    id: "make",
    name: "Make.com (Integromat)",
    category: "Automação",
    description: "Plataforma visual de automação de fluxos conectando Hotmart, Kiwify, WhatsApp, E-mail e IA.",
    whenToUse: "Enviar e-mails de recuperação, disparar mensagens no WhatsApp e cadastrar alunos automaticamente.",
    advantages: ["Interface drag-and-drop intuitiva", "Possibilita construir fluxos extremamente poderosos"],
    limitations: ["Requer entender a lógica de webhooks"],
    url: "https://www.make.com",
    badge: "Automação Sem Código",
    pricing: "Freemium"
  },

  // PRODUTIVIDADE
  {
    id: "notion_ai",
    name: "Notion AI",
    category: "Produtividade",
    description: "Workspace com IA integrada para organizar lançamentos, roteiros, tarefas e acervos de conteúdo.",
    whenToUse: "Planejamento editorial, mapas de esteira de produtos e gestão do negócio digital.",
    advantages: ["Tudo centralizado em uma única ferramenta", "Procura e resume seus próprios documentos"],
    limitations: ["Módulo de IA é um add-on pago"],
    url: "https://www.notion.so",
    pricing: "Freemium"
  }
];

export default function CentralFerramentasIA() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("infinity_favorite_tools");
      return saved ? JSON.parse(saved) : ["chatgpt", "elevenlabs", "midjourney"];
    } catch {
      return ["chatgpt", "elevenlabs", "midjourney"];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("infinity_favorite_tools", JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories = [
    "Todas",
    "Texto",
    "Imagem",
    "Vídeo",
    "Áudio",
    "Avatares",
    "Sites",
    "Automação",
    "Produtividade"
  ];

  const filteredTools = AI_TOOLS_DATABASE.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.whenToUse.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "Todas" || tool.category === selectedCategory;

    const matchesFav = !onlyFavorites || favorites.includes(tool.id);

    return matchesSearch && matchesCategory && matchesFav;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                Arsenal Tecnológico • Infinity Million OS
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white font-display tracking-tight">
              CENTRAL DE FERRAMENTAS DE IA
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Curadoria das melhores inteligências artificiais do mundo testadas e validadas para acelerar seu marketing, criação de conteúdo e operações digitais.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-lg">
              {AI_TOOLS_DATABASE.length}
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Ferramentas Mapeadas</span>
              <span className="text-xs font-bold text-slate-200">{favorites.length} Marcadas como Favoritas</span>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar ferramenta, utilidade ou funcionalidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* FAVORITES TOGGLE */}
          <button
            type="button"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              onlyFavorites
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
            }`}
          >
            <Star className={`w-4 h-4 ${onlyFavorites ? "fill-amber-400 text-amber-400" : ""}`} />
            <span>Ver Apenas Favoritas ({favorites.length})</span>
          </button>
        </div>

        {/* CATEGORY TABS */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-500 text-slate-950 border-indigo-400 font-black shadow-md"
                  : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* TOOLS GRID */}
      {filteredTools.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <Wrench className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-300">Nenhuma ferramenta encontrada</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tente remover os filtros ou pesquisar por termos como "Vídeo", "Copy", "Voz" ou "Imagem".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const isFav = favorites.includes(tool.id);
            return (
              <div
                key={tool.id}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between gap-4 transition group"
              >
                <div className="space-y-3">
                  {/* CARD TOP BAR */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[9px] font-bold border border-indigo-500/30">
                        {tool.category}
                      </span>
                      {tool.badge && (
                        <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
                          {tool.badge}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(tool.id)}
                      className="p-1 text-slate-500 hover:text-amber-400 transition cursor-pointer"
                      title={isFav ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                    >
                      <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                    </button>
                  </div>

                  {/* TOOL TITLE & PRICING */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition">
                      {tool.name}
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850 shrink-0">
                      {tool.pricing}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* WHEN TO USE */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                    <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase block flex items-center gap-1">
                      <Zap className="w-3 h-3 text-indigo-400" />
                      Quando utilizar:
                    </span>
                    <p className="text-[11px] text-slate-300 leading-snug">{tool.whenToUse}</p>
                  </div>

                  {/* ADVANTAGES & LIMITATIONS */}
                  <div className="space-y-2 pt-1 text-[11px]">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase block flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Vantagens:
                      </span>
                      <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                        {tool.advantages.map((adv, i) => (
                          <li key={i} className="truncate">{adv}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-amber-400 font-bold uppercase block flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        Limitações:
                      </span>
                      <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                        {tool.limitations.map((lim, i) => (
                          <li key={i} className="truncate">{lim}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* ACCESS LINK */}
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-slate-950 hover:bg-indigo-950/80 border border-slate-800 hover:border-indigo-500/50 text-indigo-300 hover:text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-lg"
                >
                  <span>Acessar {tool.name.split(" ")[0]}</span>
                  <ArrowUpRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
