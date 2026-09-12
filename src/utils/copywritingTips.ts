import { CopywritingTipData } from "../components/CopywritingTooltip";

export const SALES_PAGE_COPY_TIPS: Record<string, CopywritingTipData> = {
  checkoutLink: {
    triggerName: "Fricção Zero no Pagamento",
    triggerCategory: "conversion",
    concept: "Cada clique ou obstáculo extra entre o desejo de compra e a tela de pagamento derruba a taxa de conversão em até 20%.",
    practicalTip: "Use links diretos com checkout transparente (ex: Kiwify, Hotmart, Eduzz) que já abram com o método PIX pré-selecionado para compra rápida.",
    highConvertingExample: "https://pay.kiwify.com.br/SEU-CHECKOUT",
    impactMetric: "+35% conversão"
  },
  originalPrice: {
    triggerName: "Ancoragem de Preço",
    triggerCategory: "persuasion",
    concept: "O cérebro humano julga o valor de algo comparando com o primeiro número que vê. Um valor mais alto estabelece uma âncora de alto valor percebido.",
    practicalTip: "Coloque o preço real somado de todos os bônus inclusos (ex: R$ 197 ou R$ 297) para que o valor promocional pareça uma pechincha irresistível.",
    formula: "Preço Original = 2x a 3x o valor de oferta com bônus",
    highConvertingExample: "R$ 197,00",
    impactMetric: "+42% percepção de valor"
  },
  discountedPrice: {
    triggerName: "Acessibilidade & Preço Psicológico",
    triggerCategory: "urgency",
    concept: "Preços terminados em 7 ou 9 (R$ 47, R$ 97) são interpretados pelo cérebro como desconto genuíno e oportunidade promocional exclusiva.",
    practicalTip: "Se for infoproduto direto, preços abaixo de R$ 100 geram a 'compra por impulso' sem necessidade de consulta ou longas hesitações.",
    formula: "De [Âncora] por apenas [Preço Psicológico terminado em 7 ou 9]",
    highConvertingExample: "R$ 97,00",
    impactMetric: "+50% compras por impulso"
  },
  expertName: {
    triggerName: "Autoridade Pessoal & Humanização",
    triggerCategory: "authority",
    concept: "Pessoas compram de pessoas, não de empresas impessoais. O cérebro busca um mentor confiável com nome, rosto e histórico comprovado.",
    practicalTip: "Associe o nome do autor ao seu título de autoridade ou nicho de atuação para reforçar a credibilidade no primeiro contato.",
    highConvertingExample: "Carlos Mendes | Mentor de Negócios Digitais",
    impactMetric: "+28% confiança"
  },
  expertBio: {
    triggerName: "Jornada do Herói & Prova Social",
    triggerCategory: "authority",
    concept: "O público se conecta profundamente quando percebe que você já esteve na mesma dor que ele e desenvolveu um atalho testado para vencer.",
    practicalTip: "Conte em 2 ou 3 linhas: a dor que você superou no passado, o método que criou e o número de alunos ou resultados gerados.",
    formula: "[Nome] superou [Dor do Nicho] e já ajudou mais de [X alunos] a alcançarem [Resultado Desejado].",
    highConvertingExample: "Ex-bancário que faturou múltiplos 6 dígitos e já ajudou mais de 1.400 pessoas a criarem uma nova fonte de renda online.",
    impactMetric: "+30% retenção"
  },
  guaranteeDays: {
    triggerName: "Reversão Total de Risco",
    triggerCategory: "trust",
    concept: "O medo da perda é o maior freio de compra. Transferir 100% da responsabilidade para você elimina as dúvidas de última hora.",
    practicalTip: "Ofereça garantia incondicional (7, 15 ou 30 dias). Frase chave: 'Se por qualquer motivo você não amar, devolvemos 100% do seu dinheiro com 1 clique'.",
    formula: "Garantia Incondicional de [X] Dias: Risco 100% nas minhas costas.",
    highConvertingExample: "7 Dias de Garantia Incondicional — Risco Zero",
    impactMetric: "Elimina 90% das hesitações"
  },
  supportWhatsapp: {
    triggerName: "Acessibilidade & Segurança Imediata",
    triggerCategory: "trust",
    concept: "Ver que existe um suporte humano rápido via WhatsApp traz segurança psicológica imediata para quem tem dúvidas sobre o acesso.",
    practicalTip: "Adicione o número com DDD. Tirar dúvidas pré-compra pelo WhatsApp recupera até 60% dos carrinhos e boletos pendentes.",
    highConvertingExample: "11999999999",
    impactMetric: "+20% recuperação"
  },
  headline: {
    triggerName: "Atenção & Promessa Irresistível (AIDA)",
    triggerCategory: "persuasion",
    concept: "A headline tem apenas 3 segundos para responder à pergunta subconsciente do lead: 'O que eu ganho com isso e por que devo continuar lendo?'.",
    practicalTip: "Combine um benefício claro, sem a dor mais temida pelo lead, com especificidade de tempo ou facilidade de execução.",
    formula: "Como [Resultado Sonhado] Sem [Pior Dor / Objeção] Mesmo Que [Dificuldade Comum]",
    highConvertingExample: "Como Criar e Vender seu Primeiro Infoproduto em 7 Dias Sem Precisar Aparecer ou Gastar com Anúncios",
    impactMetric: "Determina 80% do sucesso"
  },
  subheadline: {
    triggerName: "Reforço de Crença & Quebra de Objeções",
    triggerCategory: "clarity",
    concept: "Enquanto a Headline atrai pelo sonho, a Subheadline valida a promessa mostrando que o método é simples, prático e aplicável para qualquer um.",
    practicalTip: "Diga claramente o formato (método prático, e-book passo a passo) e para quem foi desenvolvido.",
    formula: "O passo a passo direto ao ponto para [Público Alvo] destravar [Objetivo] começando do absoluto zero.",
    highConvertingExample: "O guia prático definitivo com modelos prontos para você copiar e colar e faturar no piloto automático.",
    impactMetric: "+25% tempo de leitura"
  },
  hookText: {
    triggerName: "Dor vs Prazer & Contraste Emocional",
    triggerCategory: "persuasion",
    concept: "As pessoas se movem muito mais para fugir de uma dor aguda do que para buscar um benefício futuro. Mostre o contraste vívido da virada.",
    practicalTip: "Descreva a sensação de alívio e conquista que o lead sentirá após aplicar o conteúdo do livro.",
    formula: "Imagine acordar sabendo que [Situação Ideal] enquanto [Problema Antigo] ficou no passado.",
    highConvertingExample: "Chega de trabalhar horas sem ver lucro. É hora de colocar seu conhecimento para vender 24 horas por dia no piloto automático.",
    impactMetric: "+40% conexão emocional"
  },
  videoPlaceholderText: {
    triggerName: "Storytelling & Loop de Curiosidade",
    triggerCategory: "persuasion",
    concept: "Uma narrativa com conflito, descoberta de um método e superação mantém a atenção alta e prepara o lead para comprar na oferta final.",
    practicalTip: "Instigue o lead a assistir ao vídeo revelando que o segredo principal será revelado no decorrer do vídeo.",
    highConvertingExample: "Neste vídeo rápido de 4 minutos, descubra o método exato de 3 etapas que mudou meus resultados.",
    impactMetric: "+35% retenção de VSL"
  },
  ctaText: {
    triggerName: "Chamada para Ação no Modo Ativo (CTA)",
    triggerCategory: "conversion",
    concept: "O cérebro responde com muito mais energia a comandos na 1ª pessoa afirmativa ('Eu quero') do que a ordens impessoais ('Clique aqui').",
    practicalTip: "Use verbos fortes de decisão como 'QUERO', 'GARANTIR', 'DESTRAVAR', 'ACESSAR' acompanhados de senso de urgência.",
    formula: "SIM, QUERO [BENEFÍCIO DESEJADO] AGORA COM DESCONTO!",
    highConvertingExample: "QUERO GARANTIR MINHA VAGA COM 50% OFF",
    impactMetric: "+31% cliques no botão"
  },
  vslUrl: {
    triggerName: "Apresentação em Vídeo (VSL de Alta Conversão)",
    triggerCategory: "conversion",
    concept: "Vídeos de vendas aumentam a confiança e transmitem emoção através da voz e ritmo, elevando a conversão média de páginas de infoprodutos.",
    practicalTip: "Hospede seu vídeo no YouTube (não listado), Vimeo ou Panda Video para carregamento instantâneo em celulares.",
    highConvertingExample: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    impactMetric: "+45% conversão em ticket médio"
  },
  vslTitle: {
    triggerName: "Gatilho da Atenção Imediata",
    triggerCategory: "urgency",
    concept: "Diga para o usuário dar o play agora mesmo antes de continuar a navegação pela página.",
    practicalTip: "Crie um alerta de urgência ou curiosidade irresistível sobre o conteúdo do vídeo.",
    highConvertingExample: "Assista ao vídeo abaixo antes que esta condição especial expire...",
    impactMetric: "+27% taxa de reprodução"
  },
  vslSubtitle: {
    triggerName: "Instrução Direta & Antecipação",
    triggerCategory: "clarity",
    concept: "Informar ao lead o que esperar do vídeo reduz a ansiedade e prepara o momento exato de clicar no botão de compra.",
    practicalTip: "Oriente o espectador a assistir até o fim para receber a condição exclusiva de lançamento.",
    highConvertingExample: "Após assistir ao vídeo, clique no botão abaixo para garantir sua cópia com valor promocional.",
    impactMetric: "+22% tempo de tela"
  },
  vslCtaText: {
    triggerName: "CTA Pós-Vídeo de Alta Decisão",
    triggerCategory: "conversion",
    concept: "Ao término do vídeo o lead atinge o pico de interesse e prontidão para comprar. O botão deve ser claro, grande e direto.",
    practicalTip: "Use caixa alta, emojis de ação e promessa de acesso imediato.",
    highConvertingExample: "QUERO GARANTIR MINHA VAGA AGORA 🚀",
    impactMetric: "+34% cliques imediatos"
  }
};
