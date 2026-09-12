import { BrandDnaProfile } from "../types";

export const BRAND_DNA_PROFILES: BrandDnaProfile[] = [
  {
    id: "dna_high_ticket",
    name: "High-Ticket & Autoridade Absoluta",
    archetype: "O Governante & O Mago",
    slogan: "Exclusividade inegociável, resultados matemáticos e sofisticação sóbria.",
    icon: "👑",
    badge: "ALTO VALOR PERCEBIDO",
    description: "Desenhado para ofertas acima de R$ 997, mentorias, consultorias e produtos com posicionamento de liderança de mercado sem apelação barata.",
    voiceTone: "Sóbrio, direto, inquestionável e focado em retorno sobre investimento.",
    personality: "Líder de mercado, visionário prático, austero e refinado.",
    targetAudience: "Empresários, líderes de mercado, infoprodutores de 6 e 7 dígitos e profissionais liberais que buscam o ápice.",
    primaryColor: "#0f766e", // Teal nobre
    secondaryColor: "#090d16", // Ônix profundo
    accentColor: "#f59e0b", // Ouro champanhe
    backgroundColor: "#030712",
    typographyHeading: "Playfair Display",
    typographyBody: "Inter",
    coreValues: ["Soberania Financeira", "Discrição de Elite", "Precisão Matemática", "Padrão Internacional"],
    mandatoryTriggers: ["Autoridade Inabalável", "Exclusividade", "Escassez Real", "Prova Institucional"],
    forbiddenWords: ["Baratinho", "Fácil demais", "Milagre", "Ganhe dinheiro rápido", "Corre que vai acabar"],
    keyPromise: "Transforme sua operação em um ativo de autoridade que atrai os clientes mais lucrativos do seu nicho.",
    authorityBioTemplate: "Estrategista de negócios e mentor com mais de 8 dígitos faturados e operações estruturadas em 4 países.",
    recommendedLighting: "Studio Rembrandt com luz de recorte dourada e fundo escuro aveludado",
    sampleHeadline: "A Estrutura de Liderança que Separa Produtores Amadores dos Detentores de Mercado."
  },
  {
    id: "dna_tech_innovation",
    name: "Tech & Inovação Futurista",
    archetype: "O Visionário & O Criador",
    slogan: "Automação implacável, Inteligência Artificial de ponta e escala exponencial.",
    icon: "⚡",
    badge: "NEXT-GEN & IA",
    description: "Ideal para infoprodutos de tecnologia, ferramentas de inteligência artificial, automações digitais e ecossistemas SaaS.",
    voiceTone: "Analítico, vanguardista, dinâmico e focado em eficiência máxima.",
    personality: "Inovador disruptivo, metódico, veloz e focado no futuro presente.",
    targetAudience: "Criadores digitais, programadores, entusiastas de IA, agências e operadores de tráfego de alta escala.",
    primaryColor: "#3b82f6", // Azul elétrico
    secondaryColor: "#020617", // Espaço sideral
    accentColor: "#06b6d4", // Ciano laser
    backgroundColor: "#020617",
    typographyHeading: "Space Grotesk",
    typographyBody: "JetBrains Mono",
    coreValues: ["Automação Total", "Escalabilidade Sem Atrito", "Vanguarda Tecnológica", "Dados Concretos"],
    mandatoryTriggers: ["Inovação Disruptiva", "Velocidade de Execução", "Lógica Irrefutável", "Simplicidade Algorítmica"],
    forbiddenWords: ["Artesanal", "Complicado", "Lento", "Método antigo", "Tradicional"],
    keyPromise: "Automatize 90% do trabalho operacional e multiplique sua capacidade de entrega através de IA proprietária.",
    authorityBioTemplate: "Engenheiro de automação e pioneiro em arquiteturas neurais aplicadas a vendas e escala digital.",
    recommendedLighting: "Cyberpunk Rim Light com feixes volumétricos azuis e reflexos metálicos",
    sampleHeadline: "O Algoritmo Autônomo que Executa 40 Horas de Trabalho Humano em 4 Minutos."
  },
  {
    id: "dna_direct_response",
    name: "Vendas Agressivas & Direct Response",
    archetype: "O Guerreiro & O Conquistador",
    slogan: "Conversão imediata no tráfego frio, quebra implacável de objeções e ROI rápido.",
    icon: "🎯",
    badge: "ALTA CONVERSÃO",
    description: "Perfeito para infoprodutos de entrada (low-ticket e front-end), funis de perpétuo, ebooks de alta demanda e tráfego pago massivo.",
    voiceTone: "Urgente, visceral, empático na dor e extremamente persuasivo.",
    personality: "Combativo, empático com a frustração do lead, solucionador rápido e direto ao ponto.",
    targetAudience: "Pessoas com uma dor latente não resolvida que buscam uma solução definitiva e sem enrolação.",
    primaryColor: "#dc2626", // Vermelho conversão
    secondaryColor: "#0f172a", // Slate preto
    accentColor: "#facc15", // Amarelo alerta
    backgroundColor: "#05070d",
    typographyHeading: "Plus Jakarta Sans",
    typographyBody: "Inter",
    coreValues: ["Velocidade no Resultado", "Transparência Radical", "Garantia Blindada", "Simplicidade de Aplicação"],
    mandatoryTriggers: ["Urgência Real", "Inimigo Comum", "Alívio Imediato da Dor", "Risco Zero Incondicional"],
    forbiddenWords: ["Teórico", "Talvez", "Futuramente", "Estudo aprofundado", "Conceitual"],
    keyPromise: "Elimine o principal obstáculo que trava o seu progresso em menos de 7 dias com um passo a passo testado.",
    authorityBioTemplate: "Especialista em campo com mais de 300 mil horas de testes práticos e validações sem teoria vazia.",
    recommendedLighting: "High Contrast Studio com sombras fortes e recorte dinâmico que foca a atenção no objeto principal",
    sampleHeadline: "Pare de Perder Tempo com Métodos que Só Funcionam na Teoria: O Roteiro Prático de Execução."
  },
  {
    id: "dna_minimalist_clean",
    name: "Minimalista & Elegância Clean",
    archetype: "O Sábio & O Perfeccionista",
    slogan: "Clareza radical, menos ruído, mais sofisticação e precisão estética.",
    icon: "⚪",
    badge: "APPLE STYLE",
    description: "Criado para marcas que priorizam design intencional, sofisticação moderna, organização de vida, produtividade e estética limpa.",
    voiceTone: "Calmo, refinado, objetivo, estético e profundamente inspirador.",
    personality: "Minimalista, metódico, focado na essência e alérgico à poluição visual.",
    targetAudience: "Profissionais criativos, arquitetos, designers, executivos e pessoas que valorizam clareza mental e funcionalidade.",
    primaryColor: "#e2e8f0", // Branco titânio
    secondaryColor: "#1e293b", // Grafite escovado
    accentColor: "#38bdf8", // Azul cristalino
    backgroundColor: "#090d16",
    typographyHeading: "Inter",
    typographyBody: "Inter",
    coreValues: ["Essência Pura", "Respiro Visual", "Funcionalidade Impecável", "Sofisticação Atemporal"],
    mandatoryTriggers: ["Clareza Mental", "Simplicidade Sofisticada", "Paz Visual", "Eficiência Sem Esforço"],
    forbiddenWords: ["Bombástico", "Sensacional", "Gritaria", "Promoção maluca", "Poluído"],
    keyPromise: "Subtraia o excesso e construa uma rotina ou negócio centrado no que realmente move o ponteiro.",
    authorityBioTemplate: "Designer de sistemas e consultor de produtividade essencial com foco em operações enxutas de alto impacto.",
    recommendedLighting: "Soft Natural Daylight difusa de 45 graus com sombras suaves e superfícies acetinadas",
    sampleHeadline: "Menos Atrito, Mais Clareza: O Design Definitivo para Fazer Mais Trabalhando Menos."
  },
  {
    id: "dna_wellness_health",
    name: "Saúde, Longevidade & Bem-Estar",
    archetype: "O Cuidador & O Alquimista",
    slogan: "Vitalidade orgânica, harmonia biológica e equilíbrio corpo-mente comprovado.",
    icon: "🌿",
    badge: "ORGANIC & HEALTH",
    description: "Excelente para produtos de emagrecimento saudável, receitas funcionais, longevidade, treino físico, nutrição e hábitos positivos.",
    voiceTone: "Acolhedor, científico porém acessível, motivador e focado no respeito ao corpo.",
    personality: "Guia empático, autoridade biológica, entusiasmado pela vida e regenerador.",
    targetAudience: "Pessoas buscando recuperar a energia, autoestima, disposição e bem-estar físico duradouro.",
    primaryColor: "#10b981", // Verde esmeralda vital
    secondaryColor: "#064e3b", // Verde floresta profundo
    accentColor: "#f59e0b", // Dourado mel
    backgroundColor: "#021a14",
    typographyHeading: "Plus Jakarta Sans",
    typographyBody: "Inter",
    coreValues: ["Respeito Biológico", "Constância Sustentável", "Comprovação Científica", "Amor Próprio"],
    mandatoryTriggers: ["Renovação Celular", "Segurança Clínica", "Acolhimento Sem Culpa", "Transformação Visível"],
    forbiddenWords: ["Sofrimento", "Remédio perigoso", "Passar fome", "Impossível", "Milagre tóxico"],
    keyPromise: "Reative a energia natural do seu metabolismo sem dietas punitivas ou restrições insustentáveis.",
    authorityBioTemplate: "Pesquisador em fisiologia integrativa e criador de protocolos de regeneração metabólica aplicados a milhares de pessoas.",
    recommendedLighting: "Morning Sun Golden Glow com reflexos verdes de folhas e atmosfera de vitalidade límpida",
    sampleHeadline: "O Reset Metabólico de 21 Dias: Desinflame Seu Corpo e Recupere Sua Disposição Juvenil."
  },
  {
    id: "dna_didactic_mastery",
    name: "Didático & Educação Acelerada",
    archetype: "O Mestre & O Facilitador",
    slogan: "Zero jargões, passo a passo mastigado e aprendizado descomplicado para qualquer nível.",
    icon: "📚",
    badge: "MÉTODO PASSO A PASSO",
    description: "Projetado para cursos rápidos, guias práticos, tutorias operacionais, transição de carreira e capacitação técnica acessível.",
    voiceTone: "Claro, didático, paciente, encorajador e pontuado por analogias perfeitas.",
    personality: "O professor favorito, generoso, prático e que celebra cada pequena vitória do aluno.",
    targetAudience: "Iniciantes ou profissionais em transição que se sentem intimidados pela complexidade técnica do mercado.",
    primaryColor: "#6366f1", // Índigo educacional
    secondaryColor: "#1e1b4b", // Noite acadêmica
    accentColor: "#10b981", // Verde de validação
    backgroundColor: "#070817",
    typographyHeading: "Plus Jakarta Sans",
    typographyBody: "Inter",
    coreValues: ["Democratização do Saber", "Didática Sem Rodeios", "Resultados Incrementais", "Acompanhamento Amigável"],
    mandatoryTriggers: ["Facilidade de Aplicação", "Segurança no Passo a Passo", "Eliminação do Medo", "Vitórias Rápidas"],
    forbiddenWords: ["Complexo demais", "Apenas para gênios", "Duvidoso", "Indecifrável", "Abstrato"],
    keyPromise: "Aprenda e domine qualquer habilidade digital com um mapa de implementação claro do zero ao avançado.",
    authorityBioTemplate: "Educador e criador de metodologias de aceleração cognitiva que já formou mais de 15.000 alunos no Brasil.",
    recommendedLighting: "Clean High-Key Education Lighting com foco luminoso equilibrado e quadros nítidos",
    sampleHeadline: "O Guia Descomplicado Passo a Passo: Do Absoluto Zero até Seus Primeiros Resultados Práticos."
  },
  {
    id: "dna_spiritual_mindset",
    name: "Espiritualidade & Mente Próspera",
    archetype: "O Místico & O Iluminador",
    slogan: "Alinhamento vibracional, abundância consciente e quebra de travas invisíveis.",
    icon: "✨",
    badge: "TRANSFORMAÇÃO INTERIOR",
    description: "Perfeito para temas de lei da atração, meditação, cura emocional, expansão de consciência, propósito de vida e física quântica prática.",
    voiceTone: "Profundo, sereno, magnético, elevador e focado na conexão espiritual.",
    personality: "Mentor de alma, sábio ancestral, acolhedor das dores emocionais e catalisador de milagres diários.",
    targetAudience: "Buscadores de sentido, pessoas que sentem bloqueios invisíveis de prosperidade e desejam viver em harmonia.",
    primaryColor: "#8b5cf6", // Violeta cósmico
    secondaryColor: "#2e1065", // Roxo profundo
    accentColor: "#fbbf24", // Dourado solar
    backgroundColor: "#0d061f",
    typographyHeading: "Playfair Display",
    typographyBody: "Inter",
    coreValues: ["Harmonia Interior", "Prosperidade Ética", "Propósito Sagrado", "Elevação Vibracional"],
    mandatoryTriggers: ["Libertação Emocional", "Ressonância", "Paz Mental", "Ativação da Abundância"],
    forbiddenWords: ["Explorar o próximo", "Ansiedade descontrolada", "Vingança", "Punição", "Desespero"],
    keyPromise: "Destrave os bloqueios invisíveis que impedem a prosperidade de fluir na sua vida financeira e pessoal.",
    authorityBioTemplate: "Terapeuta quântico e mestre em reprogramação de crenças limitantes com alunos em mais de 20 países.",
    recommendedLighting: "Golden Nebula Twilight com partículas douradas suspensas e luz mística suave",
    sampleHeadline: "A Chave Oculta da Prosperidade: Reprograme Sua Frequência e Ative a Abundância que Já é Sua."
  },
  {
    id: "dna_aesthetic_luxury",
    name: "Estética, Beleza & Sofisticação",
    archetype: "O Amante & O Artista",
    slogan: "Perfeição visual, harmonia facial e rejuvenescimento com assinatura de luxo.",
    icon: "💎",
    badge: "LUXURY BEAUTY",
    description: "Ideal para infoprodutos e cursos de estética avançada, micropigmentação, skincare, moda, maquiagem profissional e imagem pessoal.",
    voiceTone: "Encantador, detalhista, elegante e focado na valorização da autoestima máxima.",
    personality: "Consultor de imagem sofisticado, criterioso, focado na proporção áurea e no acabamento impecável.",
    targetAudience: "Mulheres e profissionais da beleza que exigem alto padrão visual, técnicas refinadas e clientes dispostos a pagar mais.",
    primaryColor: "#ec4899", // Rosa cetim sofisticado
    secondaryColor: "#1c0a1a", // Ameixa negra
    accentColor: "#f59e0b", // Ouro champanhe
    backgroundColor: "#12030f",
    typographyHeading: "Playfair Display",
    typographyBody: "Plus Jakarta Sans",
    coreValues: ["Proporção Áurea", "Autoestima Magnética", "Acabamento Impecável", "Exclusividade Feminina"],
    mandatoryTriggers: ["Transformação Espelho", "Reconhecimento Social", "Beleza Sem Esforço", "Assinatura Visual"],
    forbiddenWords: ["Artificial", "Feio", "Desleixado", "Baratear", "Amadorismo"],
    keyPromise: "Domine as técnicas estéticas refinadas que transformam qualquer procedimento em uma obra de arte cobiçada.",
    authorityBioTemplate: "Especialista em visagismo e proporção áurea facial com clínica boutique de referência internacional.",
    recommendedLighting: "Fashion Editorial Beauty Dish com catchlight nos olhos e pele aveludada impecável",
    sampleHeadline: "A Arte da Sofisticação: O Segredo das Técnicas que Geram Fila de Espera na Estética de Luxo."
  }
];

export function getBrandDnaById(id: string): BrandDnaProfile {
  const found = BRAND_DNA_PROFILES.find(p => p.id === id);
  return found || BRAND_DNA_PROFILES[0];
}
