import { VisualReferenceModel } from "../types";

export const CURATED_VISUAL_REFERENCES: VisualReferenceModel[] = [
  // 1. RECEITAS & GASTRONOMIA
  {
    id: "ref-rec-01",
    title: "Culinária Sensorial Rústica",
    niche: "Receitas & Gastronomia",
    category: "receitas",
    archetype: "Gourmet Sensorial Artesanal",
    badge: "Top Salvo no Pinterest",
    previewUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    description: "Fotografia editorial com iluminação natural suave, tábua de madeira rústica, ingredientes frescos em destaque e foco seletivo.",
    whyItConverts: "Desperta o apetite imediato através de texturas palpáveis e sensação de comida artesanal, saudável e de restaurante estrelado.",
    patterns: {
      primaryColor: "#2A1810",
      accentColor: "#E07A5F",
      textColor: "#F4F1DE",
      backgroundColor: "#1D130E",
      typographyFamily: "Playfair Display",
      typographyReason: "Serifada sofisticada que transmite tradição, requinte e prazer gastronômico.",
      lightingAndMood: "Luz de janela suave lateral, sombras profundas e acolhedoras.",
      layoutStructure: "Composição 'Flat-Lay' equilibrada ou ângulo 45° com profundidade de campo.",
      psychologicalTriggers: ["Sensorialidade imediata", "Sensação de aconchego caseiro", "Percepção de alta culinária acessível"]
    },
    promptFormula: "Editorial food photography, rustic dark wooden table background, warm natural window light, organic ingredients artfully arranged, shallow depth of field, 8k, cinematic gourmet style, no text, clean composition",
    recommendedStyle: "artistic"
  },
  {
    id: "ref-rec-02",
    title: "Minimalist Pastry & Bakery",
    niche: "Confeitaria & Sobremesas",
    category: "receitas",
    archetype: "Confeitaria Francesa Minimalista",
    badge: "Estilo Livro Parisiense",
    previewUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
    description: "Fundo claro em tons pastéis e mármore, iluminação limpa e destaque escultural para doces finos e pães artesanais.",
    whyItConverts: "Visual 'clean girl' e 'aesthetic' que faz o leitor associar a receita a doces finos de vitrine francesa e alta margem de lucro.",
    patterns: {
      primaryColor: "#F5EBE0",
      accentColor: "#D4A373",
      textColor: "#2B2D42",
      backgroundColor: "#FAF0CA",
      typographyFamily: "Playfair Display",
      typographyReason: "Tipografia serifada editorial fina com ar europeu e elegante.",
      lightingAndMood: "Luz difusa estourada em fundo branco/creme, quase sem sombras duras.",
      layoutStructure: "Objeto centralizado com espaço negativo generoso no topo.",
      psychologicalTriggers: ["Perfeição visual", "Estética Pinterest viral", "Sensação de sofisticação sem esforço"]
    },
    promptFormula: "French artisanal bakery book cover aesthetic, minimalist bright marble surface, soft morning light, flour dust in air, ultra-clean negative space, high-end pastry monograph, 8k resolution, no words",
    recommendedStyle: "editorial"
  },

  // 2. FINANÇAS & INVESTIMENTOS
  {
    id: "ref-fin-01",
    title: "Wall Street Quant & Wealth",
    niche: "Finanças & Investimentos",
    category: "financas",
    archetype: "Autoridade Bancária & Soberania",
    badge: "Best-Seller Financeiro",
    previewUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
    description: "Tons escuros de azul-marinho e grafite com toques metálicos esmeralda e dourado, linhas de tendência e elegância austera.",
    whyItConverts: "Conecta instantaneamente com o desejo de riqueza soberana, autoridade bancária e patrimônio protegido.",
    patterns: {
      primaryColor: "#0A192F",
      accentColor: "#10B981",
      textColor: "#F8FAFC",
      backgroundColor: "#030712",
      typographyFamily: "Space Grotesk",
      typographyReason: "Geométrica moderna e precisa, que transmite números exatos, tecnologia e segurança.",
      lightingAndMood: "Iluminação dramática de estúdio com reflexos esmeralda e ciano sutis em superfícies de titânio.",
      layoutStructure: "Linhas verticais ascensionais, grade matemática invisível e título imponente.",
      psychologicalTriggers: ["Escassez e prestígio", "Exclusividade de clube financeiro", "Segurança de dados e números"]
    },
    promptFormula: "Dark luxury financial monograph cover background, deep navy and graphite textured background, subtle glowing emerald chart trendlines, corporate glass reflection, elegant wealth architecture, no letters, cinematic 8k",
    recommendedStyle: "dark_luxury"
  },
  {
    id: "ref-fin-02",
    title: "Minimal Wealth & Liberdade",
    niche: "Independência Financeira",
    category: "financas",
    archetype: "Minimalismo Racional de Riqueza",
    badge: "Tendência Editorial 2025",
    previewUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop",
    description: "Fundo monocromático cinza-carvão com formas geométricas abstratas douradas que representam multiplicação exponencial de valor.",
    whyItConverts: "Elimina a sensação de 'vendedor de curso' e parece um livro sério publicado por editoras tradicionais como HarperCollins ou Portfolio Penguin.",
    patterns: {
      primaryColor: "#18181B",
      accentColor: "#F59E0B",
      textColor: "#FAFAFA",
      backgroundColor: "#09090B",
      typographyFamily: "Space Grotesk",
      typographyReason: "Sem serifa de alto impacto, legível em miniaturas de celular.",
      lightingAndMood: "Iluminação de galeria de arte contemporânea.",
      layoutStructure: "Grande foco central com 60% de espaço negativo para o título respirar.",
      psychologicalTriggers: ["Anti-sensacionalismo que gera confiança", "Clareza mental sobre dinheiro", "Foco no longo prazo"]
    },
    promptFormula: "Abstract minimal wealth book cover design, dark charcoal linen background, floating sculptural golden torus sculpture, studio lighting, gallery aesthetic, clean composition, 8k render, no text",
    recommendedStyle: "minimalist"
  },

  // 3. TECNOLOGIA & IA
  {
    id: "ref-tech-01",
    title: "Cyber Synapse & Deep Intelligence",
    niche: "Tecnologia & IA",
    category: "tech_ia",
    archetype: "Vanguarda Tecnológica",
    badge: "Mais Salvo no Pinterest IA",
    previewUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    description: "Redes neurais bioluminescentes, esferas de silício com reflexos holográficos em tons ciano e violeta elétrico.",
    whyItConverts: "Transmite o futuro imediato. O comprador sente que está adquirindo conhecimento restrito do Vale do Silício.",
    patterns: {
      primaryColor: "#050814",
      accentColor: "#06B6D4",
      textColor: "#FFFFFF",
      backgroundColor: "#02040A",
      typographyFamily: "JetBrains Mono",
      typographyReason: "Monoespaçada com ar hacker e de código de engenharia avançada.",
      lightingAndMood: "Reflexos volumétricos de luz neon com névoa digital de alta tecnologia.",
      layoutStructure: "Centro focal magnético que prende o olho na miniatura do feed.",
      psychologicalTriggers: ["Sensação de obsolescência iminente se não ler", "Domínio sobre ferramentas de IA", "Autoridade de ponta"]
    },
    promptFormula: "Futuristic artificial intelligence book cover background, glowing cybernetic neural plexus, deep cyan and electric violet bioluminescence, polished dark chrome glass, clean digital horizon, 8k, Octane render, no text",
    recommendedStyle: "cyberpunk"
  },
  {
    id: "ref-tech-02",
    title: "Clean Silicon Valley Tech",
    niche: "Inovação & Startups",
    category: "tech_ia",
    archetype: "Silicon Valley Clean Tech",
    badge: "Padrão Silicon Valley",
    previewUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    description: "Design limpo, gradientes sutis em vidro fosco (glassmorphism), tipografia precisa e estética Apple/Stripe.",
    whyItConverts: "Gera credibilidade instantânea para desenvolvedores, CTOs e empreendedores digitais que abominam designs poluídos.",
    patterns: {
      primaryColor: "#0F172A",
      accentColor: "#6366F1",
      textColor: "#F8FAFC",
      backgroundColor: "#020617",
      typographyFamily: "Space Grotesk",
      typographyReason: "Contornos limpos e espaçamento ótico impecável.",
      lightingAndMood: "Luz suave e limpa, estética de design system corporativo moderno.",
      layoutStructure: "Grid simétrico modular e minimalista.",
      psychologicalTriggers: ["Sensação de método escalável", "Elegância corporativa de alto escalão", "Clareza arquitetônica"]
    },
    promptFormula: "Clean tech startup editorial background, frosted glass geometric prisms with subtle indigo and violet refraction, dark slate minimal canvas, Apple inspired aesthetic, elegant abstract composition, no typography, 8k",
    recommendedStyle: "modern"
  },

  // 4. EMAGRECIMENTO & FITNESS
  {
    id: "ref-fit-01",
    title: "Vibrant Energy & Performance",
    niche: "Emagrecimento & Fitness",
    category: "emagrecimento",
    archetype: "Alta Performance & Vitalidade",
    badge: "Alta Conversão de Vendas",
    previewUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
    description: "Contraste cinematográfico com iluminação de recorte (rim-light) em tons laranja energético e carvão profundo.",
    whyItConverts: "Injeta dopamina e urgência de ação física no cérebro do leitor imediatamente ao bater o olho.",
    patterns: {
      primaryColor: "#111827",
      accentColor: "#F97316",
      textColor: "#FFFFFF",
      backgroundColor: "#030712",
      typographyFamily: "Space Grotesk",
      typographyReason: "Caixa alta encorpada com peso visual que transmite disciplina e força.",
      lightingAndMood: "Luz de recorte esportiva de estúdio fotográfico de alta velocidade.",
      layoutStructure: "Diagonal dinâmica que induz sensação de movimento e superação.",
      psychologicalTriggers: ["Motivação instantânea", "Promessa de transformação corporal visível", "Energia e vitalidade"]
    },
    promptFormula: "High-energy athletic fitness book cover background, dark gym atmospheric smoke, vibrant orange and amber rim light rays, textured dark slate floor, intense motivational atmosphere, 8k, cinematic lighting, no text",
    recommendedStyle: "vibrant_fitness"
  },
  {
    id: "ref-fit-02",
    title: "Natural Wellness & Biohacking",
    niche: "Saúde Integrativa & Longevidade",
    category: "emagrecimento",
    archetype: "Longevidade & Saúde Orgânica",
    badge: "Tendência Wellness",
    previewUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
    description: "Verde sálvia, botânica suave, luz da manhã e sensação de desintoxicação e equilíbrio hormonal.",
    whyItConverts: "Atrai o público que rejeita 'dietas malucas' e busca uma cura genuína, calma e duradoura para o corpo.",
    patterns: {
      primaryColor: "#1C2826",
      accentColor: "#34D399",
      textColor: "#F0FDF4",
      backgroundColor: "#0D1F1C",
      typographyFamily: "Inter",
      typographyReason: "Sem serifa humanista limpa, acolhedora e confiável.",
      lightingAndMood: "Luz dourada do amanhecer filtrada por folhas verdes.",
      layoutStructure: "Harmonia circular zen com amplo espaço para respiração.",
      psychologicalTriggers: ["Paz mental sobre o corpo", "Sensação de cura natural", "Longevidade sustentável"]
    },
    promptFormula: "Holistic wellness book cover background, botanical sage green and olive leaves, soft morning sunbeams through morning mist, dew drops, zen organic sanctuary, serene atmosphere, 8k resolution, no words",
    recommendedStyle: "nature_wellness"
  },

  // 5. ESPIRITUALIDADE & MENTE
  {
    id: "ref-esp-01",
    title: "Cosmic Depth & Consciência",
    niche: "Espiritualidade & Mente",
    category: "espiritualidade",
    archetype: "Despertar & Mistério Sagrado",
    badge: "Best-Seller Holístico",
    previewUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
    description: "Céu noturno estrelado profundo, nebulosa sutil dourada e geometria sagrada etérea.",
    whyItConverts: "Cria uma sensação profunda de reverência, revelação de mistérios e paz interior.",
    patterns: {
      primaryColor: "#0B0C1E",
      accentColor: "#FBBF24",
      textColor: "#FFFFFF",
      backgroundColor: "#03040B",
      typographyFamily: "Playfair Display",
      typographyReason: "Serifada clássica e solene que remete a textos ancestrais sagrados.",
      lightingAndMood: "Brilho estelar suave e místico no centro da composição.",
      layoutStructure: "Ponto focal infinito com perspectiva celestial.",
      psychologicalTriggers: ["Busca por propósito superior", "Alívio da ansiedade terrena", "Conexão com algo maior"]
    },
    promptFormula: "Cosmic spirituality book cover background, deep indigo starfield with subtle golden celestial dust, ethereal sacred geometric alignment, soft radiant nebula glow, peaceful transcendental atmosphere, 8k, no text",
    recommendedStyle: "artistic"
  },

  // 6. NEGÓCIOS & VENDAS
  {
    id: "ref-neg-01",
    title: "Modern Executive Authority",
    niche: "Negócios & Gestão",
    category: "negocios",
    archetype: "Liderança Executiva Moderna",
    badge: "Padrão Harvard Business",
    previewUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    description: "Arquitetura corporativa futurista em ângulo contra-plongée, vidro espelhado e aço escovado em tons de cinza e azul royal.",
    whyItConverts: "Transmite escala empresarial, solidez inabalável e visão de 10 anos à frente do mercado.",
    patterns: {
      primaryColor: "#0F172A",
      accentColor: "#3B82F6",
      textColor: "#F8FAFC",
      backgroundColor: "#020617",
      typographyFamily: "Space Grotesk",
      typographyReason: "Moderna, reta e forte, típica de lideranças globais de tecnologia.",
      lightingAndMood: "Luz solar cristalina refletindo em vidros de arranha-céu executivo.",
      layoutStructure: "Linhas convergentes para o alto gerando sensação de crescimento contínuo.",
      psychologicalTriggers: ["Escalabilidade de negócios", "Autoridade inquestionável", "Mentalidade de CEO"]
    },
    promptFormula: "Modern corporate leadership monograph background, low angle view of sleek glass skyscraper reaching into blue sky, architectural abstract lines, reflections of clouds, executive power and scale, 8k, no text",
    recommendedStyle: "corporate"
  },

  // 7. ESTÉTICA & BELEZA
  {
    id: "ref-est-01",
    title: "Luxury Skincare & Elegance",
    niche: "Estética & Beleza",
    category: "estetica",
    archetype: "Luxo Sensorial & Juventude",
    badge: "Estilo Vogue & Pinterest",
    previewUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
    description: "Gotas translúcidas de sérum sobre seda champagne e mármore rosé, iluminação quente e acabamento de alta perfumaria.",
    whyItConverts: "Desperta o desejo incontrolável de rejuvenescimento, autocuidado premium e autoestima elevada.",
    patterns: {
      primaryColor: "#FDF4F5",
      accentColor: "#E11D48",
      textColor: "#1C1917",
      backgroundColor: "#FFF1F2",
      typographyFamily: "Playfair Display",
      typographyReason: "Elegância editorial francesa com charme e feminilidade.",
      lightingAndMood: "Iluminação de estúdio de beleza de alta moda, brilhos nítidos.",
      layoutStructure: "Fluidez orgânica com espaço amplo para título sofisticado.",
      psychologicalTriggers: ["Desejo de rejuvenescimento", "Sensação de merecimento e luxo", "Resultados visíveis rápidos"]
    },
    promptFormula: "Luxury cosmetics and skincare book cover background, flowing champagne silk texture, macro crystalline water droplet refractions, soft rose gold ambient light, Vogue editorial elegance, 8k, no words",
    recommendedStyle: "editorial"
  }
];
