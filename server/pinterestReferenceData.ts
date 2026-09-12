export interface VisualPatternData {
  primaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  typographyFamily: "Space Grotesk" | "Playfair Display" | "Inter" | "JetBrains Mono";
  typographyReason: string;
  lightingAndMood: string;
  layoutStructure: string;
  psychologicalTriggers: string[];
}

export interface VisualReferenceModel {
  id: string;
  title: string;
  niche: string;
  category: "receitas" | "financas" | "tech_ia" | "emagrecimento" | "espiritualidade" | "negocios" | "estetica" | "geral";
  archetype: string;
  badge: string;
  previewUrl: string;
  description: string;
  whyItConverts: string;
  patterns: VisualPatternData;
  promptFormula: string;
  recommendedStyle: string;
}

export interface VisualAnalysisResult {
  archetype: string;
  nicheIdentified: string;
  confidenceScore: number;
  badge: string;
  patterns: VisualPatternData;
  visualDeconstruction: {
    focalPoint: string;
    contrastRatio: string;
    hierarchy: string;
    commercialAppeal: string;
  };
  synthesizedPrompt: string;
  recommendedStyle: string;
  recommendedCoverParams: {
    typography: "Space Grotesk" | "Playfair Display" | "Inter" | "JetBrains Mono";
    titleColor: string;
    subtitleColor: string;
    authorColor: string;
    overlayColor: "none" | "dark" | "gradient" | "light" | "colored";
    overlayOpacity: number;
    alignment: "top" | "center" | "bottom";
  };
}

export const PINTEREST_VISUAL_REFERENCES: VisualReferenceModel[] = [
  // 1. RECEITAS & GASTRONOMIA
  {
    id: "ref-rec-01",
    title: "Culinária Sensorial Rústica",
    niche: "Receitas & Gastronomia",
    category: "receitas",
    archetype: "Gourmet Sensorial Artesanal",
    badge: "Pinterest Viral #1",
    previewUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
    description: "Composição acolhedora com iluminação natural lateral, vapor sutil e ingredientes frescos que despertam apetite imediato.",
    whyItConverts: "Estimula os sentidos de fome e aconchego. Títulos com fontes serifadas elegantes transmitem sabor caseiro e sofisticação.",
    recommendedStyle: "artistic",
    patterns: {
      primaryColor: "#D97706", // Amber quente
      accentColor: "#10B981", // Verde erva fresca
      textColor: "#FFFFFF",
      backgroundColor: "#1C1917", // Fundo madeira escura rústica
      typographyFamily: "Playfair Display",
      typographyReason: "Transmite tradição gastronômica, artesanato culinário e credibilidade de chef renomado.",
      lightingAndMood: "Luz natural difusa de janela, reflexos quentes em cerâmica e contraste rico entre comida e tábua rústica.",
      layoutStructure: "Prato centralizado em ângulo zenital 45°, títulos dispostos na parte superior com respiro generoso.",
      psychologicalTriggers: ["Apetite sensorial imediato", "Sensação de comida de verdade", "Receitas práticas que funcionam"]
    },
    promptFormula: "Artisan culinary photography of gourmet appetizing dish for {niche}, steam rising gently, rustic wooden table, fresh herbs, natural warm window lighting, commercial cookbook cover aesthetic, sharp focus 8k"
  },
  {
    id: "ref-rec-02",
    title: "Confeitaria & Sobremesas Pastel",
    niche: "Receitas & Gastronomia",
    category: "receitas",
    archetype: "Doceria Fina & Confeitaria Européia",
    badge: "Tendência Best-Seller",
    previewUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
    description: "Tons pastéis aveludados, iluminação suave de estúdio e camadas de texturas que valorizam doces, bolos e sobremesas lucrativas.",
    whyItConverts: "Estética extremamente compartilhável no Pinterest e Instagram. Dá percepção de produto premium e alto valor agregado.",
    recommendedStyle: "minimalist",
    patterns: {
      primaryColor: "#F43F5E", // Rosa framboesa
      accentColor: "#FDE047", // Amarelo baunilha
      textColor: "#FFFFFF",
      backgroundColor: "#0F172A",
      typographyFamily: "Playfair Display",
      typographyReason: "Elegância francesa clássica, remetendo a confeitarias de luxo e livros premiados.",
      lightingAndMood: "High-key suave, reflexos cremosos de chocolate e brilho aveludado.",
      layoutStructure: "Sobremesa imponente em close-up, tipografia com alto contraste e selo de 'Renda Extra'.",
      psychologicalTriggers: ["Desejo incontrolável por doces", "Percepção de lucro fácil na confeitaria", "Sofisticação gourmet"]
    },
    promptFormula: "High-end luxury pastry and bakery photography for {niche}, decadent chocolate layers, soft pastel lighting, French patisserie magazine cover style, macro textures, clean dark elegant background, 8k"
  },

  // 2. FINANÇAS & INVESTIMENTOS
  {
    id: "ref-fin-01",
    title: "Dark Luxury VIP Gold",
    niche: "Finanças & Investimentos",
    category: "financas",
    archetype: "Dark Luxury High-Ticket",
    badge: "Alta Conversão (R$ 197 - R$ 997)",
    previewUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop",
    description: "Fundo ônix acetinado profundo com iluminação volumétrica dourada, barras de ouro 3D sutis e tipografia geométrica imponente.",
    whyItConverts: "Conecta instantaneamente com o desejo de riqueza soberana, autoridade bancária e patrimônio protegido.",
    recommendedStyle: "dark_luxury",
    patterns: {
      primaryColor: "#F59E0B", // Dourado metálico nobre
      accentColor: "#10B981", // Esmeralda de prosperidade
      textColor: "#FFFFFF",
      backgroundColor: "#030712", // Ônix ultra-profundo
      typographyFamily: "Space Grotesk",
      typographyReason: "Transmite modernidade de Wall Street e precisão matemática indiscutível.",
      lightingAndMood: "Iluminação de estúdio direcional com reflexos metálicos acetinados em dourado nobre.",
      layoutStructure: "Título imponente no terço superior, centro com elemento financeiro de valor e rodapé com nome do autor em destaque.",
      psychologicalTriggers: ["Status e exclusividade VIP", "Crescimento patrimonial acelerado", "Proteção contra crises"]
    },
    promptFormula: "Ultra-luxury financial wealth visual for {niche}, sleek matte black stone texture, cinematic volumetric golden lighting, subtle 3D gold accents, high-ticket investment book cover, 8k render"
  },
  {
    id: "ref-fin-02",
    title: "Wall Street & Cripto Futurista",
    niche: "Finanças & Investimentos",
    category: "financas",
    archetype: "Mercado Financeiro & Tendência Global",
    badge: "Kindle Best-Seller Finanças",
    previewUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
    description: "Linhas de tendência ascendente esmeralda, telas de alta precisão e estética executiva de tomadas de decisão rápidas.",
    whyItConverts: "Passa segurança técnica e validação quantitativa. O verde de alta saturação ativa o gatilho de lucros diários.",
    recommendedStyle: "modern",
    patterns: {
      primaryColor: "#10B981", // Verde lucro
      accentColor: "#38BDF8", // Ciano tecnologia de dados
      textColor: "#FFFFFF",
      backgroundColor: "#0B1120",
      typographyFamily: "Space Grotesk",
      typographyReason: "Família tipográfica com peso visual que projeta autoridade e firmeza nas decisões financeiras.",
      lightingAndMood: "Luz volumétrica azul marinho com feixes verde-esmeralda simbolizando valorização constante.",
      layoutStructure: "Gráfico ascendente em diagonal dinamizando o olhar do leitor de baixo para cima.",
      psychologicalTriggers: ["Lucro previsível", "Validação por dados reais", "Vantagem assimétrica de mercado"]
    },
    promptFormula: "Cinematic modern financial analytics concept for {niche}, glowing green bull market trajectory vectors, sleek glass skyscrapers at twilight, sophisticated executive lighting, editorial business book cover, 8k"
  },

  // 3. TECNOLOGIA & INTELIGÊNCIA ARTIFICIAL
  {
    id: "ref-tech-01",
    title: "Cyber Synthwave / Neon Matrix",
    niche: "Tecnologia & IA",
    category: "tech_ia",
    archetype: "Inteligência Artificial de Vanguarda",
    badge: "Mais Salvo no Pinterest IA",
    previewUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
    description: "Redes neurais luminosas em ciano e roxo elétrico, circuitos tridimensionais e sensação de automação inteligente.",
    whyItConverts: "Posiciona o leitor à frente de 99% das pessoas que ainda não dominam ferramentas e fluxos de IA.",
    recommendedStyle: "cyberpunk",
    patterns: {
      primaryColor: "#06B6D4", // Ciano elétrico
      accentColor: "#A855F7", // Roxo sintético
      textColor: "#FFFFFF",
      backgroundColor: "#020617", // Espaço sideral digital
      typographyFamily: "JetBrains Mono",
      typographyReason: "Estética de código, precisão algorítmica e mentalidade de engenharia de software.",
      lightingAndMood: "Linhas de neon luminescentes em ambiente escuro, transmitindo velocidade de processamento.",
      layoutStructure: "Núcleo neural central emitindo feixes de dados, títulos em caixa alta com alto impacto.",
      psychologicalTriggers: ["Não ficar para trás na era da IA", "Automação total de tarefas", "Domínio de tecnologia de ponta"]
    },
    promptFormula: "Futuristic artificial intelligence glowing neural network for {niche}, vibrant electric cyan and violet neon circuitry, glowing data pathways, deep dark sci-fi background, high-tech non-fiction book cover, 8k"
  },
  {
    id: "ref-tech-02",
    title: "Vale do Silício Minimalista Clean",
    niche: "Tecnologia & IA",
    category: "tech_ia",
    archetype: "Tech Minimalista Apple / OpenAI Style",
    badge: "Padrão Silicon Valley",
    previewUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    description: "Formas geométricas abstratas suaves, gradientes foscos de luxo e espaço negativo limpo com foco cirúrgico.",
    whyItConverts: "Transmite sofisticação intelectual, clareza e autoridade institucional comparável às maiores big techs mundiais.",
    recommendedStyle: "minimalist",
    patterns: {
      primaryColor: "#38BDF8", // Azul céu suave
      accentColor: "#F43F5E",
      textColor: "#FFFFFF",
      backgroundColor: "#0F172A",
      typographyFamily: "Inter",
      typographyReason: "Design suíço limpo, legibilidade perfeita e ar de produto digital inovador.",
      lightingAndMood: "Iluminação de estúdio suave sobre superfícies foscas acetinadas.",
      layoutStructure: "Amplo espaço negativo ao redor do título para criar leitura imediata até em miniaturas pequenas.",
      psychologicalTriggers: ["Clareza descomplicada", "Inovação validada", "Design sofisticado internacional"]
    },
    promptFormula: "Abstract minimalist technology sculpture for {niche}, smooth frosted glass geometric ribbons, subtle blue and silver ambient light, Cupertino tech design aesthetic, elegant book cover, 8k"
  },

  // 4. EMAGRECIMENTO & FITNESS
  {
    id: "ref-fit-01",
    title: "Performance Extrema & Alta Queima",
    niche: "Emagrecimento & Fitness",
    category: "emagrecimento",
    archetype: "Energia, Garra & Transformação Corporal",
    badge: "Top 1 Conversão Fitness",
    previewUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
    description: "Contraste dramático entre sombras profundas e luzes energéticas de academia, transmitindo foco e superação de limites.",
    whyItConverts: "Toca diretamente na dor da estagnação física e acende a centelha de motivação e disciplina imediata.",
    recommendedStyle: "vibrant_fitness",
    patterns: {
      primaryColor: "#EF4444", // Vermelho adrenalina
      accentColor: "#F59E0B", // Laranja fogo
      textColor: "#FFFFFF",
      backgroundColor: "#09090B",
      typographyFamily: "Space Grotesk",
      typographyReason: "Tipografia robusta e condensada que simboliza força física e determinação inabalável.",
      lightingAndMood: "Iluminação dramática de estúdio esportivo com bordas acentuadas (rim light).",
      layoutStructure: "Símbolo de ação ou atleta em silhueta triunfante no terço inferior, promessa direta em letras maiúsculas.",
      psychologicalTriggers: ["Quebra do ciclo de preguiça", "Transformação visível no espelho", "Sensação de vitória pessoal"]
    },
    promptFormula: "High-intensity athletic gym fitness photography for {niche}, dramatic rim lighting on iron barbell, chalk dust particles in air, gritty motivational sports magazine cover style, intense contrast, 8k"
  },
  {
    id: "ref-fit-02",
    title: "Wellness Holístico & Nutrição Vital",
    niche: "Emagrecimento & Fitness",
    category: "emagrecimento",
    archetype: "Saúde Botânica & Emagrecimento Natural",
    badge: "Queridinho Pinterest Wellness",
    previewUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
    description: "Tons botânicos de verde sálvia, luz matinal dourada e elementos naturais que simbolizam desinflamação e saúde plena.",
    whyItConverts: "Muito mais palatável para quem tem aversão a dietas restritivas malucas; promete equilíbrio sustentável.",
    recommendedStyle: "nature_wellness",
    patterns: {
      primaryColor: "#10B981", // Verde sálvia
      accentColor: "#FBBF24", // Dourado solar
      textColor: "#FFFFFF",
      backgroundColor: "#064E3B",
      typographyFamily: "Playfair Display",
      typographyReason: "Traz harmonia orgânica e credibilidade de medicina integrativa e nutrição funcional.",
      lightingAndMood: "Luz solar matinal filtrada, gotas de orvalho cristalinas e sensação de frescor renovador.",
      layoutStructure: "Elementos de nutrição fresca circundando o título central de forma serena e arejada.",
      psychologicalTriggers: ["Saúde de dentro para fora", "Fim do efeito sanfona", "Leveza e bem-estar corporal"]
    },
    promptFormula: "Vibrant healthy lifestyle and organic nutrition visual for {niche}, fresh green botanicals, morning sunlight dew drops, crisp clean wellness lifestyle aesthetic, high-end nutrition book cover, 8k"
  },

  // 5. ESPIRITUALIDADE & MENTALIDADE
  {
    id: "ref-esp-01",
    title: "Luz Dourada Zen & Aurora Interior",
    niche: "Espiritualidade & Mente",
    category: "espiritualidade",
    archetype: "Paz, Transcendência & Clareza Mental",
    badge: "Mais Compartilhado Mente & Fé",
    previewUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    description: "Horizonte oceânico ao amanhecer, raios dourados atravessando a bruma e atmosfera de profunda serenidade interior.",
    whyItConverts: "Acalma a ansiedade do leitor no primeiro contato visual, gerando um alívio psicológico instantâneo.",
    recommendedStyle: "nature_wellness",
    patterns: {
      primaryColor: "#FBBF24", // Dourado amanhecer
      accentColor: "#38BDF8", // Azul serenidade
      textColor: "#FFFFFF",
      backgroundColor: "#0C1222",
      typographyFamily: "Playfair Display",
      typographyReason: "Espaçamento entre letras nobre que inspira respiração profunda e respeito sagrado.",
      lightingAndMood: "Golden hour translúcida com partículas de luz flutuando suavemente.",
      layoutStructure: "Horizonte aberto convidando à contemplação, títulos com espaçamento refinado.",
      psychologicalTriggers: ["Paz mental duradoura", "Silenciar pensamentos acelerados", "Reconexão com o propósito"]
    },
    promptFormula: "Serene spiritual sunrise horizon over misty calm waters for {niche}, ethereal golden sunbeams piercing through dawn clouds, peaceful zen meditation aesthetic, mindful inspirational book cover, 8k"
  },
  {
    id: "ref-esp-02",
    title: "Sabedoria Ancestral & Noite Estrelada",
    niche: "Espiritualidade & Mente",
    category: "espiritualidade",
    archetype: "Mistério Cósmico & Profundidade Filosófica",
    badge: "Best-Seller Filosofia & Mente",
    previewUrl: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=800&auto=format&fit=crop",
    description: "Céu estrelado profundo com constelações sutis e iluminação cinematográfica de silhueta no topo de uma montanha.",
    whyItConverts: "Desperta a curiosidade por segredos antigos e sabedoria que não é ensinada nas escolas tradicionais.",
    recommendedStyle: "emotional",
    patterns: {
      primaryColor: "#C084FC", // Violeta cósmico
      accentColor: "#FDE047", // Estrela dourada
      textColor: "#FFFFFF",
      backgroundColor: "#050816",
      typographyFamily: "Playfair Display",
      typographyReason: "Solenidade filosófica que eleva o infoproduto ao status de obra literária atemporal.",
      lightingAndMood: "Luz das estrelas e nebulosas cósmicas com atmosfera de silêncio e reflexão.",
      layoutStructure: "Silhueta contemplativa no terço inferior olhando para a imensidão do conhecimento.",
      psychologicalTriggers: ["Descoberta de segredos ancestrais", "Desenvolvimento de mente blindada", "Evolução espiritual real"]
    },
    promptFormula: "Cosmic starry night sky with deep violet nebula and glowing constellations for {niche}, solitary silhouette on mountain peak overlooking universe, mysterious wisdom philosophical book cover, 8k"
  },

  // 6. MARKETING DIGITAL & NEGÓCIOS
  {
    id: "ref-mkt-01",
    title: "Black & Gold Masterclass Executiva",
    niche: "Marketing & Vendas",
    category: "negocios",
    archetype: "Autoridade de Elite 7 Dígitos",
    badge: "Padrão Infoprodutor de Elite",
    previewUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    description: "Arquitetura corporativa contemporânea com ângulos arrojados de arranha-céus e tipografia de liderança executiva.",
    whyItConverts: "Elimina qualquer impressão de amadorismo, permitindo cobrar tickets 3x maiores pelo infoproduto.",
    recommendedStyle: "corporate",
    patterns: {
      primaryColor: "#F59E0B", // Dourado autoridade
      accentColor: "#38BDF8", // Azul confiança
      textColor: "#FFFFFF",
      backgroundColor: "#090D16",
      typographyFamily: "Space Grotesk",
      typographyReason: "Linhas retas e autoritárias que comunicam expertise e capacidade de entrega de resultados.",
      lightingAndMood: "Vidros espelhados refletindo o crepúsculo corporativo com iluminação de prestígio.",
      layoutStructure: "Estrutura ascendente com nome do método em destaque absoluto e selo de excelência.",
      psychologicalTriggers: ["Respeito e admiração profissional", "Escala de faturamento comprovada", "Autoridade inquestionável"]
    },
    promptFormula: "Sophisticated corporate executive architecture at dusk for {niche}, reflective glass skyscraper angles, subtle gold and cyan lighting accents, Forbes masterclass business book cover, 8k"
  },
  {
    id: "ref-mkt-02",
    title: "Funil Disruptivo & Conversão Extrema",
    niche: "Marketing & Vendas",
    category: "negocios",
    archetype: "Copywriting Agressivo & Tráfego Direto",
    badge: "Viral em Tráfego Pago",
    previewUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    description: "Contraste agressivo em amarelo neon e preto com formas dinâmicas de conversão rápida e cliques imediatos.",
    whyItConverts: "Para o scroll do usuário no Instagram e Pinterest em menos de 0.8 segundos. Impossível passar despercebido.",
    recommendedStyle: "modern",
    patterns: {
      primaryColor: "#EAB308", // Amarelo marca-texto
      accentColor: "#EC4899", // Rosa choque
      textColor: "#FFFFFF",
      backgroundColor: "#000000",
      typographyFamily: "Space Grotesk",
      typographyReason: "Contraste máximo, leitura rápida mesmo em telas de celular em movimento.",
      lightingAndMood: "Alto contraste gráfico sem meias-palavras, focado em gatilhos de urgência.",
      layoutStructure: "Palavras-chave em destaque visual reforçado, simulando carrossel de alta retenção.",
      psychologicalTriggers: ["Curiosidade extrema", "FOMO (medo de perder vendas)", "Método direto sem enrolação"]
    },
    promptFormula: "High-impact bold direct response marketing graphics for {niche}, electric yellow and carbon black high contrast geometry, sharp modern sales funnel visuals, viral ad creative book cover, 8k"
  },

  // 7. ESTÉTICA & BELEZA
  {
    id: "ref-est-01",
    title: "Vogue Beauty Editorial & Pele Glow",
    niche: "Estética & Beleza",
    category: "estetica",
    archetype: "Editorial Vogue & Skincare Científico",
    badge: "Top Salvos Pinterest Beleza",
    previewUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
    description: "Texturas luxuosas de sérum cristalino, iluminação difusa de estúdio de beleza e acabamento acetinado de revista Vogue.",
    whyItConverts: "Entrega o resultado visual do que o cliente quer sentir: uma pele perfeita, rejuvenescimento e autocuidado premium.",
    recommendedStyle: "editorial",
    patterns: {
      primaryColor: "#FB7185", // Rosa peônia suave
      accentColor: "#38BDF8", // Gotas cristalinas
      textColor: "#FFFFFF",
      backgroundColor: "#1E141D",
      typographyFamily: "Playfair Display",
      typographyReason: "Sofisticação editorial comparável aos perfumes e dermocosméticos mais caros do mundo.",
      lightingAndMood: "Iluminação beauty dish difusa com brilho suave e reflexos cristalinos de água pura.",
      layoutStructure: "Composição limpa com foco na textura aveludada e títulos em caixa alta refinada.",
      psychologicalTriggers: ["Autoestima renovada", "Rejuvenescimento visível", "Segredos de clínicas de luxo"]
    },
    promptFormula: "High-end luxury skincare editorial beauty visual for {niche}, crystalline serum droplets, soft satin rose and champagne studio lighting, Vogue cosmetic book cover aesthetic, macro skin glow textures, 8k"
  }
];
