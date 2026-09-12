import React, { useState } from "react";
import {
  BookOpen,
  Copy,
  Check,
  Search,
  Sparkles,
  Layout,
  Video,
  ShoppingBag,
  MessageSquare,
  Mail,
  Zap,
  Tag,
  Eye,
  Edit3
} from "lucide-react";

export interface ExampleTemplate {
  id: string;
  title: string;
  category:
    | "Landing Page"
    | "VSL"
    | "Checkout"
    | "Criativos"
    | "Headlines"
    | "Oferta"
    | "E-mails"
    | "WhatsApp"
    | "Funil"
    | "Anúncio"
    | "Carrossel";
  conversionRate: string;
  description: string;
  content: string;
  useCase: string;
}

const TEMPLATES_DATABASE: ExampleTemplate[] = [
  // LANDING PAGE
  {
    id: "lp_high_converting",
    title: "Landing Page de Alta Conversão para E-books & Métodos",
    category: "Landing Page",
    conversionRate: "28.4%",
    description: "Estrutura modular de 7 seções com Headline de Impacto, Prova Social, Oferta Irresistível e FAQ.",
    useCase: "Infoprodutos de R$ 29,90 a R$ 97,00.",
    content: `[HEADLINE PRINCIPAL]
Descubra Como [OBJETIVO DESEJADO] Sem [MAIOR DOR DO CLIENTE] em Menos de [TEMPO ESTIMADO]

[SUB-HEADLINE]
O método passo a passo testado por mais de [NÚMERO] pessoas para ter resultados reais sem complicações.

[VÍDEO OU IMAGEM DE MOCKUP 3D DO PRODUTO]

[BOTÃO DE AÇÃO]
Quero Garantir Meu Acesso Agora por Apenas 12x de R$ 9,74!

[SEÇÃO DE PROVA SOCIAL - DEPOIMENTOS]
"Achei que seria só mais um material genérico, mas no 3º dia eu já tinha aplicado e visto resultados!" - Maria S.

[O QUE VOCÊ VAI RECEBER]
• Módulo 1: Fundamentos Anticrise
• Módulo 2: O Passo a Passo Prático
• Módulo 3: Scripts Prontos Copie e Cole
• BÔNUS 1: Checklist de Execução Rápida (R$ 97)
• BÔNUS 2: Suporte em Grupo VIP (R$ 197)

[GARANTIA INCONDICIONAL DE 7 DIAS]
Teste por 7 dias. Se não gostar por qualquer motivo, devolvemos 100% do seu dinheiro sem perguntas.`
  },

  // VSL
  {
    id: "vsl_5_min",
    title: "Roteiro VSL Curto de 5 Minutos (Gancho + História + Oferta)",
    category: "VSL",
    conversionRate: "8.2%",
    description: "Roteiro de vídeo de vendas curto projetado para capturar atenção nos primeiros 5 segundos e fechar a venda.",
    useCase: "Público frio em tráfego pago (Meta Ads e TikTok).",
    content: `00:00 - GANCHO QUEBRADOR DE PADRÃO:
"Se você está tentando [OBJETIVO] e continua caindo no erro de [DOR COMUM], pare o que está fazendo nos próximos 2 minutos."

00:45 - A GRANDE REVELAÇÃO (MECANISMO):
"O problema não é sua falta de força de vontade. O verdadeiro motivo pelo qual 95% das pessoas falham é porque elas usam o método antigo. Existe um atalho testado chamado [NOME DO SEU MÉTODO]."

02:15 - A SOLUÇÃO COMPACTA:
"Foi exatamente para resolver isso que criei o [NOME DO PRODUTO]. Um guia prático feito para você aplicar em menos de 30 minutos por dia."

03:30 - A OFERTA IRRESISTÍVEL & BÔNUS:
"Hoje você não vai pagar o valor normal de R$ 197,00. Apenas nesta página, você leva o produto completo + 3 Bônus Exclusivos por apenas R$ 37,00."

04:30 - CHAMADA PARA AÇÃO COM ESCASSEZ:
"Clique no botão verde abaixo e garanta seu acesso imediato antes que o lote promocional encerre."`
  },

  // CHECKOUT
  {
    id: "checkout_bump",
    title: "Script de Checkout de Alta Conversão com Order Bump",
    category: "Checkout",
    conversionRate: "42.1% no Bump",
    description: "Modelos de Order Bump de impulso imediato no checkout para elevação imediata do ticket médio.",
    useCase: "Checkout Kiwify, Hotmart ou Eduzz.",
    content: `[TÍTULO DO ORDER BUMP]
☑️ SIM! Adicionar o Mapa de Execução Rápida em Áudio por Apenas R$ 14,90 (Economize 80%)

[DESCRIÇÃO DO ORDER BUMP]
Gosta de aprender ouvindo? Leve a versão em áudio MP3 de todo o material para ouvir no carro, na academia ou no trabalho. Marque o quadradinho acima para incluir no seu pedido.`
  },

  // HEADLINES
  {
    id: "headlines_irresistiveis",
    title: "Top 5 Headlines com Garantia de Alto CTR",
    category: "Headlines",
    conversionRate: "CTR 4.8%",
    description: "Modelos de títulos com gatilhos de curiosidade, urgência e benefício tangível.",
    useCase: "Anúncios, topo de Landing Page e capas de Reels.",
    content: `1. "Como [OBJETIVO DESEJADO] em [TEMPO] Sem Precisar de [MAIOR OBJEÇÃO]."
2. "O Segredo que os [ESPECIALISTAS DO SEU NICHO] Nunca Contaram Sobre [TÓPICO]."
3. "Apenas 15 Minutos Por Dia: O Método Simples para [RESULTADO DESEJADO]."
4. "Pare de [ERRO COMUM]! Faça Isso Hoje se Você Quer [BENEFÍCIO]."
5. "O Guia Definitivo para [OBJETIVO] Mesmo que Você Esteja Começando do Zero."`
  },

  // WHATSAPP
  {
    id: "whatsapp_recuperacao",
    title: "Sequência de 3 Mensagens para Recuperação de Pix e Carrinho",
    category: "WhatsApp",
    conversionRate: "31.5%",
    description: "Script humanizado para converter boletos e Pix pendentes sem parecer vendedor chato.",
    useCase: "Recuperação de vendas pendentes via WhatsApp.",
    content: `[MENSAGEM 1 - 15 MINUTOS APÓS O GERAMENTO DE PIX]
"Oi [NOME], tudo bem? Vi que você gerou o Pix para o [NOME DO PRODUTO]! Passando só pra avisar que o seu acesso já está reservado na plataforma. Precisa de alguma ajuda pra finalizar o pagamento?"

[MENSAGEM 2 - 2 HORAS APÓS (GATILHO DE BÔNUS EXCLUSIVO)]
"[NOME], consegui liberar um bônus especial extra pra quem finalizar o Pix ainda hoje: [NOME DO BÔNUS EXTRA]. Me avisa se conseguir pagar pra eu liberar pra você!"

[MENSAGEM 3 - ÚLTIMO AVISO DE CANCELAMENTO]
"Oi [NOME], seu código Pix está prestes a expirar. Como temos limite de vagas, o sistema vai liberar a sua vaga para a lista de espera em alguns minutos. Quer o link direto pra não perder?"`
  },

  // E-MAILS
  {
    id: "email_boas_vindas",
    title: "E-mail de Boas-Vindas + Entrega Imediata de Infoproduto",
    category: "E-mails",
    conversionRate: "Open Rate 68%",
    description: "Template de e-mail transacional de alto engajamento para gerar confiança desde o minuto 1.",
    useCase: "Envio pós-compra automático.",
    content: `ASSUNTO: 🚀 [IMPORTANTE] Seu acesso ao [NOME DO PRODUTO] chegou!

Olá [NOME], parabéns pela decisão!

Seu acesso exclusivo já está liberado. Você deu um passo importante para [BENEFÍCIO PRINCIPAL DO PRODUTO].

👉 CLIQUE AQUI PARA ACESSAR SEU MATERIAL AGORA [LINK]

O que fazer nos próximos 5 minutos:
1. Clique no link acima e faça seu login.
2. Baixe o PDF do Módulo 1.
3. Entre no nosso grupo exclusivo de avisos.

Qualquer dúvida, basta responder a este e-mail.

Abraços,
[SEU NOME / INFINITY MILLION]`
  },

  // CARROSSEL
  {
    id: "carrossel_infinito",
    title: "Roteiro para Carrossel Viral no Instagram (10 Sliders)",
    category: "Carrossel",
    conversionRate: "8.5k Salvamentos",
    description: "Carrossel estruturado com retenção slide a slide focado em salvamentos e compartilhamentos.",
    useCase: "Instagram Feed e LinkedIn Carousel.",
    content: `Slide 1 (Capa): "5 Erros Graves que Estão Destruindo Seu [OBJETIVO] (O #3 é o Pior)"
Slide 2: "Erro 1: Focar em [X] ao invés de [Y]."
Slide 3: "Erro 2: Ignorar a métrica de [MÉTRICA IMPORTANTÍSSIMA]."
Slide 4: "Erro 3 (O Mais Perigoso): Acreditar que [MITO POPULAR]."
Slide 5: "Por que isso acontece? Por causa do [MECANISMO DO PROBLEMA]."
Slide 6: "Como Corrigir Hoje Mesmo: Passo 1..."
Slide 7: "Como Corrigir Hoje Mesmo: Passo 2..."
Slide 8: "Resumo Prático em 1 Imagem (Tire Print)."
Slide 9: "O Atalho Completo: Conheça o [NOME DO SEU PRODUTO]."
Slide 10 (Call to Action): "Salve este post para não esquecer e clique no link da bio para acessar o treinamento completo!"`
  }
];

export default function BibliotecaExemplos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<ExampleTemplate | null>(null);
  const [editableContent, setEditableContent] = useState<string>("");

  const categories = [
    "Todas",
    "Landing Page",
    "VSL",
    "Checkout",
    "Headlines",
    "WhatsApp",
    "E-mails",
    "Carrossel"
  ];

  const filtered = TEMPLATES_DATABASE.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "Todas" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openPreviewModal = (template: ExampleTemplate) => {
    setPreviewTemplate(template);
    setEditableContent(template.content);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/80 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl pointer-events-none rounded-full -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                Acervo Premium • Infinity Million
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white font-display tracking-tight">
              BIBLIOTECA DE EXEMPLOS PRONTOS & EDITÁVEIS
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Modelos reais e validados no mercado de alta conversão. Copie, edite e aplique diretamente nos seus funis e campanhas.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-lg">
              {TEMPLATES_DATABASE.length}
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Modelos Validados</span>
              <span className="text-xs font-bold text-slate-200">100% Copie & Cole</span>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por termo, e-mail, script ou VSL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full md:w-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md"
                    : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TEMPLATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((tpl) => {
          const isCopied = copiedId === tpl.id;
          return (
            <div
              key={tpl.id}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between gap-4 transition group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold border border-amber-500/30">
                    {tpl.category}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    Taxa: {tpl.conversionRate}
                  </span>
                </div>

                <h3 className="text-base font-black text-white group-hover:text-amber-300 transition">
                  {tpl.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">{tpl.description}</p>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <span className="text-[9px] font-mono text-amber-400 font-bold uppercase block mb-1">
                    Indicação de Uso:
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{tpl.useCase}</span>
                </div>

                {/* PREVIEW BOX */}
                <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-850 font-mono text-[11px] text-slate-300 max-h-36 overflow-y-auto whitespace-pre-line scrollbar-thin">
                  {tpl.content}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => openPreviewModal(tpl)}
                  className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Personalizar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(tpl.id, tpl.content)}
                  className="py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-slate-950" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-950" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">
                  Editor do Modelo
                </span>
                <h3 className="text-lg font-black text-white">{previewTemplate.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="text-slate-400 hover:text-white font-bold text-sm px-2 py-1 rounded bg-slate-800"
              >
                ✕ Fechar
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Ajuste o texto para se adequar ao seu produto ou nicho antes de copiar:
            </p>

            <textarea
              rows={12}
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCopy("modal", editableContent);
                  setPreviewTemplate(null);
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copiar Texto Editado</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
