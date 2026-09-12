import React, { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  Download,
  Copy,
  Check,
  ArrowRight,
  Video,
  Target,
  Flame,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  ShoppingCart,
  Zap,
  DollarSign,
  Layers,
  CheckCircle2,
  Sliders,
  Calculator,
  ChevronRight,
  BookOpen,
  HelpCircle
} from "lucide-react";
import { AIPersonaConfig } from "./PersonalizarIA";

interface Props {
  productName: string;
  niche: string;
  targetAudience: string;
  tone: string;
  aiPersona?: AIPersonaConfig;
  salesPageOffer?: string;
  onGoBackToWizard?: () => void;
}

export interface AdCreativeItem {
  id: number;
  title: string;
  angle: string;
  headline: string;
  primaryText: string;
  visualScript: string;
  cta: string;
  recommendedAudience: string;
}

export interface UpsellItem {
  id: string;
  type: "order_bump" | "upsell_1" | "downsell_1" | "upsell_2";
  typeLabel: string;
  title: string;
  suggestedPrice: number;
  headline: string;
  checkoutText: string;
  deliveryStrategy: string;
  vslScriptShort?: string;
  conversionTarget: string;
}

export default function SocioEstrategicoStep({
  productName,
  niche,
  targetAudience,
  tone,
  aiPersona,
  salesPageOffer,
  onGoBackToWizard
}: Props) {
  const [activeTab, setActiveTab] = useState<"upsell" | "creatives">("upsell");
  const [copiedId, setCopiedId] = useState<number | string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("kiwify");

  // Checklist execution state
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    step_bump: false,
    step_upsell1: false,
    step_downsell: false,
    step_upsell2: false,
  });

  // Simulator State
  const [mainPrice, setMainPrice] = useState<number>(47);
  const [monthlySales, setMonthlySales] = useState<number>(100);
  const [bumpPrice, setBumpPrice] = useState<number>(27);
  const [bumpConvRate, setBumpConvRate] = useState<number>(35); // 35%
  const [upsell1Price, setUpsell1Price] = useState<number>(97);
  const [upsell1ConvRate, setUpsell1ConvRate] = useState<number>(15); // 15%
  const [downsellPrice, setDownsellPrice] = useState<number>(47);
  const [downsellConvRate, setDownsellConvRate] = useState<number>(10); // 10%

  // Calculations
  const baseRevenue = monthlySales * mainPrice;
  const bumpSalesCount = Math.round(monthlySales * (bumpConvRate / 100));
  const bumpRevenue = bumpSalesCount * bumpPrice;

  const upsell1SalesCount = Math.round(monthlySales * (upsell1ConvRate / 100));
  const upsell1Revenue = upsell1SalesCount * upsell1Price;

  const declinedUpsell1 = monthlySales - upsell1SalesCount;
  const downsellSalesCount = Math.round(declinedUpsell1 * (downsellConvRate / 100));
  const downsellRevenue = downsellSalesCount * downsellPrice;

  const totalRevenue = baseRevenue + bumpRevenue + upsell1Revenue + downsellRevenue;
  const baseAOV = mainPrice;
  const newAOV = totalRevenue / Math.max(monthlySales, 1);
  const revenueIncreasePercent = Math.round(((totalRevenue - baseRevenue) / Math.max(baseRevenue, 1)) * 100);

  // Default Upsell Funnel Items customized to user's product
  const [upsellItems, setUpsellItems] = useState<UpsellItem[]>([
    {
      id: "bump_1",
      type: "order_bump",
      typeLabel: "Passo 1 • Order Bump no Checkout (1-Clique)",
      title: `Kit de Prompts Prontos + Audio-Guia Acelerador de ${productName || "Seu Produto"}`,
      suggestedPrice: 27,
      headline: "☑️ SIM! Quero Adicionar o Pacote de Implementação Rápida por Apenas +R$ 27,00",
      checkoutText: "Acelere seus resultados em 10x sem precisar perder tempo pensando. Receba 30 modelos prontos e o áudio explicativo para ouvir enquanto executa.",
      deliveryStrategy: "Entregue como arquivo bônus PDF + MP3 dentro da mesma área de membros ou e-mail de confirmação.",
      conversionTarget: "Expectativa de conversão: 30% a 45% das compras do produto principal."
    },
    {
      id: "upsell_1",
      type: "upsell_1",
      typeLabel: "Passo 2 • Upsell 1 na Thank You Page (1-Click Upsell)",
      title: `Workshop Gravado: Implementação do Zero ao Avançado em ${niche || "Seu Nicho"}`,
      suggestedPrice: 97,
      headline: "ESPERE! Sua compra está quase concluída... Que tal ver este método aplicado na prática passo a passo?",
      checkoutText: "Acesso exclusivo ao treinamento em vídeo de 90 minutos onde mostro os bastidores completos, estudos de caso e como evitar os 5 maiores erros.",
      vslScriptShort: "ROTEIRO VSL 3MIN:\n1. 00:00 - Parabenize pela compra do e-book.\n2. 00:30 - Apresente o desafio da prática.\n3. 01:15 - Mostre como o Workshop de 90 min resolve a execução.\n4. 02:00 - Oferta única de R$ 297 por R$ 97 com botão de 1 clique.",
      deliveryStrategy: "Apresente na página de obrigado antes da liberação do e-book principal com botão de compra com 1-clique.",
      conversionTarget: "Expectativa de conversão: 10% a 20% dos clientes."
    },
    {
      id: "downsell_1",
      type: "downsell_1",
      typeLabel: "Passo 3 • Downsell 1 (Resgate de Recusa do Upsell)",
      title: `Versão Resumida em Checklist e Planilhas de ${productName || "Seu Produto"}`,
      suggestedPrice: 47,
      headline: "Entendo que você está com pressa. Que tal levar apenas as Planilhas e Mapas Mentais por um valor simbólico?",
      checkoutText: "Sem as aulas em vídeo, leve apenas o acervo de materiais de suporte com 50% de desconto adicional.",
      deliveryStrategy: "Aparece somente para quem clica em 'Não, obrigado' na página do Upsell 1.",
      conversionTarget: "Expectativa de conversão: 10% a 15% dos que recusaram o Upsell 1."
    },
    {
      id: "upsell_2",
      type: "upsell_2",
      typeLabel: "Passo 4 • Upsell 2 / Acesso Anual (Comunidade VIP)",
      title: `Grupo VIP de Networking e Mentoria Mensal em ${niche || "Seu Nicho"}`,
      suggestedPrice: 197,
      headline: "Faça parte da nossa comunidade exclusiva de executores!",
      checkoutText: "Receba atualizações mensais de estratégias, tiragem de dúvidas quinzenal e suporte em grupo com especialistas.",
      deliveryStrategy: "Oferecido como assinatura anual de R$ 197/ano ou mensal de R$ 19,90/mês.",
      conversionTarget: "Gera faturamento recorrente diário (MRR)."
    }
  ]);

  // Default 3 High Converting Creatives
  const [creatives, setCreatives] = useState<AdCreativeItem[]>([
    {
      id: 1,
      title: "Criativo 01 • Gancho Direto da Dor (Ganho Rápido)",
      angle: "Foco na Dor Imediata + Solução Descomplicada",
      headline: `Chega de tentar métodos que não funcionam. Descubra o método definitivo de ${productName || "Seu Produto"}.`,
      primaryText: `Se você faz parte de ${targetAudience || "público-alvo"}, precisa ver isso hoje. Enquanto você gasta tempo e dinheiro com métodos ultrapassados, existe um caminho testado e validados para transformar seus resultados em poucos dias.\n\nClique no botão abaixo e assista à apresentação antes que saia do ar!`,
      visualScript: "VÍDEO 15s: Pessoa demonstrando insatisfação com a rotina antiga, seguido de um corte rápido mostrando o checklist em tela com o título chamativo e transição de sucesso.",
      cta: "Quero Garantir Meu Acesso",
      recommendedAudience: `${niche || "Nicho Principal"} • Interesses Abertos + Mães/Empresários`
    },
    {
      id: 2,
      title: "Criativo 02 • Quebra de Objeção & Provocação",
      angle: "Confronto de Mitos + Prova de Eficiência",
      headline: `Eles disseram que era difícil? A verdade revelada sobre ${productName || "Seu Produto"}.`,
      primaryText: `Você não precisa de 10 horas por dia para conseguir resultados em ${niche || "seu nicho"}. O grande erro da maioria é focar em esforço excessivo em vez de método inteligente.\n\nRevelamos os 3 passos exatos que simplificam tudo. Clique e confira!`,
      visualScript: "IMAGEM/CARROSSEL: Fundo claro com texto grande em dourado: 'O MAIOR ERRO QUE VOCÊ COMETE AO TENTAR EVOLUIR EM " + (niche?.toUpperCase() || "SEU NICHO") + "'. Arraste para o lado.",
      cta: "Ver Explicação Prática",
      recommendedAudience: "Público Semelhante (Lookalike 1%) + Engajamento do Instagram"
    },
    {
      id: 3,
      title: "Criativo 03 • Autoridade Suprema & Escassez",
      angle: "Transformação Comprovada + Bônus Exclusivo",
      headline: `Últimas vagas com desconto especial para ${productName || "Seu Infoproduto"}.`,
      primaryText: `A oportunidade de dominar ${niche || "este mercado"} com suporte e ferramentas prontas está aberta por tempo limitado.\n\nGaranta sua vaga hoje e receba todos os bônus exclusivos de implementação rápida antes que o valor do lote aumente!`,
      visualScript: "VÍDEO CURTO 20s: Apresentador segurando o e-book no tablet ou mostrando o painel de resultados com depoimentos piscando na tela.",
      cta: "Garantir Vaga com Bônus",
      recommendedAudience: "Remarketing de Visitantes da Página (Últimos 30 Dias)"
    }
  ]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleCopyText = (text: string, id: number | string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadFullStrategy = () => {
    let content = `=================================================================\n`;
    content += `MANUAL COMPLETO DO SÓCIO ESTRATÉGICO: ESTEIRA DE UPSELL E CRIATIVOS\n`;
    content += `INFOPRODUTO: ${productName || "Seu Produto Digital"}\n`;
    content += `NICHO: ${niche || "Geral"}\n`;
    content += `PÚBLICO-ALVO: ${targetAudience || "Geral"}\n`;
    content += `=================================================================\n\n`;

    content += `1. PROJEÇÃO FINANCIAL DO TICKET MÉDIO (AOV):\n`;
    content += `   - Preço Base do Produto: R$ ${mainPrice.toFixed(2)}\n`;
    content += `   - Vendas Estimadas Mensais: ${monthlySales}\n`;
    content += `   - Faturamento Sem Esteira: R$ ${baseRevenue.toFixed(2)} (Ticket R$ ${baseAOV.toFixed(2)})\n`;
    content += `   - Faturamento Com Esteira: R$ ${totalRevenue.toFixed(2)} (Ticket R$ ${newAOV.toFixed(2)})\n`;
    content += `   - GANHO ADICIONAL ESTIMADO: +${revenueIncreasePercent}% (R$ ${(totalRevenue - baseRevenue).toFixed(2)})\n\n`;

    content += `=================================================================\n`;
    content += `ESTEIRA DE UPSELL E ORDER BUMP (PASSO A PASSO EXECUTÁVEL):\n`;
    content += `=================================================================\n\n`;

    upsellItems.forEach((item, idx) => {
      content += `-----------------------------------------------------------------\n`;
      content += `${idx + 1}. ${item.typeLabel.toUpperCase()}\n`;
      content += `Produto/Oferta: ${item.title}\n`;
      content += `Preço Sugerido: R$ ${item.suggestedPrice.toFixed(2)}\n`;
      content += `Headline / Chamada: ${item.headline}\n`;
      content += `Copy do Checkout / Página: ${item.checkoutText}\n`;
      if (item.vslScriptShort) {
        content += `\nRoteiro de Vídeo (VSL):\n${item.vslScriptShort}\n`;
      }
      content += `Estratégia de Entrega: ${item.deliveryStrategy}\n`;
      content += `Métrica Esperada: ${item.conversionTarget}\n`;
      content += `-----------------------------------------------------------------\n\n`;
    });

    content += `=================================================================\n`;
    content += `3 CRIATIVOS CAMPEÕES PARA TRÁFEGO PAGO (META & GOOGLE ADS):\n`;
    content += `=================================================================\n\n`;

    creatives.forEach((c) => {
      content += `-----------------------------------------------------------------\n`;
      content += `${c.title.toUpperCase()}\n`;
      content += `Ângulo Estratégico: ${c.angle}\n\n`;
      content += `Headline (Título): ${c.headline}\n\n`;
      content += `Copy Principal:\n${c.primaryText}\n\n`;
      content += `Roteiro Visual / Arte: ${c.visualScript}\n\n`;
      content += `CTA: ${c.cta} | Público: ${c.recommendedAudience}\n`;
      content += `-----------------------------------------------------------------\n\n`;
    });

    content += `=================================================================\n`;
    content += `COMO CONFIGURAR NAS PLATAFORMAS (HOTMART, KIWIFY, EDUZZ, KIRVANO):\n`;
    content += `1. KIWIFY: Acesse Meus Produtos > Editar > Selecione Order Bump > Adicionar Oferta.\n`;
    content += `2. HOTMART: Acesse Ferramentas > Aparência da Página de Pagamento > Adicionar Order Bump e Funil de Upsell.\n`;
    content += `3. EDUZZ: Acesse Select > Apps > Nutror & Checkout Sun > Criar Upsell em 1 Clique.\n`;
    content += `4. KIRVANO: Acesse Meus Produtos > Funil de Vendas > Adicionar Oferta de Upsell e Order Bump.\n`;
    content += `=================================================================\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Manual_Esteira_Upsell_${(productName || "Infoproduto").replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegenerateStrategy = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setUpsellItems([
        {
          id: "bump_1",
          type: "order_bump",
          typeLabel: "Passo 1 • Order Bump no Checkout (1-Clique)",
          title: `O Guia de 100 Prompts de Ouro + Checklist Prático de ${productName || "Seu Produto"}`,
          suggestedPrice: 29,
          headline: "☑️ SIM! Adicionar o Acervo de Prompts e Modelos Copiáveis por +R$ 29,00",
          checkoutText: "Economize dezenas de horas com comandos testados e validados prontos para copiar e colar na IA com resultados imediatos.",
          deliveryStrategy: "Entregue diretamente na página de agradecimento e por e-mail automático.",
          conversionTarget: "Projeção de conversão: 35% a 50% das vendas."
        },
        {
          id: "upsell_1",
          type: "upsell_1",
          typeLabel: "Passo 2 • Upsell 1 na Thank You Page (1-Click Upsell)",
          title: `Acelerador de Resultados de 30 Dias em ${niche || "Seu Nicho"}`,
          suggestedPrice: 127,
          headline: "PARE TUDO! Desbloqueie o Plano Direcionado para Dobrar Seus Resultados!",
          checkoutText: "Tenha acesso ao plano de ação de 30 dias com templates executáveis em vídeo, suporte tira-dúvidas e modelos de páginas.",
          vslScriptShort: "ROTEIRO VSL 3MIN:\n1. 00:00 - Confirmar envio do e-book.\n2. 00:45 - Revelar o obstáculo número #1 da maioria.\n3. 01:30 - Apresentar o Acelerador de 30 Dias com 60% de desconto no 1-clique.",
          deliveryStrategy: "Oferecido imediatamente após o checkout com a tecnologia de 1-Click Upsell.",
          conversionTarget: "Projeção de conversão: 12% a 18%."
        },
        {
          id: "downsell_1",
          type: "downsell_1",
          typeLabel: "Passo 3 • Downsell 1 (Resgate com Condição Especial)",
          title: `Acesso Exclusivo aos Bônus e Planilhas de Apoio`,
          suggestedPrice: 37,
          headline: "Última chance: Leve apenas as planilhas e o banco de modelos sem as videoaulas.",
          checkoutText: "Receba todos os arquivos editáveis sem precisar comprar o treinamento completo.",
          deliveryStrategy: "Ativado ao recusa o Upsell 1.",
          conversionTarget: "Projeção de conversão: 15% dos recusados."
        },
        {
          id: "upsell_2",
          type: "upsell_2",
          typeLabel: "Passo 4 • Upsell 2 / Assinatura Recorrente",
          title: `Clube VIP de Atualizações Estratégicas Mensais`,
          suggestedPrice: 197,
          headline: "Mantenha seu negócio atualizado todos os meses com novas estratégias de ponta.",
          checkoutText: "Assinatura anual com encontros mensais de mentoria em grupo e análises de campanhas.",
          deliveryStrategy: "Oferecido como plano anual com cobrança recorrente.",
          conversionTarget: "Projeção de receita recorrente."
        }
      ]);
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* EXECUTIVE BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/70 to-slate-900 border border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-purple-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                8ª Etapa • Orientação do Sócio Estratégico
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Elevador de Ticket Médio (AOV)
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white font-display tracking-tight">
              ESTEIRA DE UPSELL & ELEVADOR DE TICKET MÉDIO
            </h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              O segredo dos grandes produtores não é vender mais e-books, é <strong>dobrar o valor que cada comprador deixa no seu checkout</strong>. Configure esta esteira para lucrar até <strong>+80% a mais no mesmo tráfego pago</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <button
              type="button"
              onClick={handleDownloadFullStrategy}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>Baixar Manual da Esteira (TXT)</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("upsell")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
              activeTab === "upsell"
                ? "bg-emerald-500 text-slate-950 shadow-lg font-black"
                : "bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>1. Esteira de Upsell & Passo a Passo Executável</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("creatives")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
              activeTab === "creatives"
                ? "bg-emerald-500 text-slate-950 shadow-lg font-black"
                : "bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>2. 3 Criativos Campeões de Tráfego Pago</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ESTEIRA DE UPSELL & PASSO A PASSO EXECUTÁVEL */}
      {activeTab === "upsell" && (
        <div className="space-y-6">
          {/* SIMULATOR CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg shrink-0">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
                    <span>Simulador de Lucro do Ticket Médio (AOV Calculator)</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px]">
                      Lucro Adicional Imediato
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ajuste os valores abaixo e veja quanto faturamento extra a esteira de upsell gera para seu negócio no mesmo volume de clientes.
                  </p>
                </div>
              </div>
            </div>

            {/* CONTROLS & CALCULATIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* SLIDERS COLUMN 1 */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                  1. Produto Base & Tráfego:
                </span>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>Preço do E-book Base</span>
                    <span className="text-emerald-400 font-mono">R$ {mainPrice.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={19}
                    max={197}
                    step={2}
                    value={mainPrice}
                    onChange={(e) => setMainPrice(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>Vendas Mensais Estimadas</span>
                    <span className="text-emerald-400 font-mono">{monthlySales} vendas</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={1000}
                    step={10}
                    value={monthlySales}
                    onChange={(e) => setMonthlySales(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* SLIDERS COLUMN 2 */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block">
                  2. Conversões da Esteira:
                </span>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>Order Bump (R$ {bumpPrice}) - Conversão</span>
                    <span className="text-purple-400 font-mono">{bumpConvRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    step={5}
                    value={bumpConvRate}
                    onChange={(e) => setBumpConvRate(parseInt(e.target.value))}
                    className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>Upsell 1 (R$ {upsell1Price}) - Conversão</span>
                    <span className="text-purple-400 font-mono">{upsell1ConvRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={35}
                    step={1}
                    value={upsell1ConvRate}
                    onChange={(e) => setUpsell1ConvRate(parseInt(e.target.value))}
                    className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* RESULT COMPARISON CARD */}
              <div className="bg-gradient-to-br from-slate-950 to-purple-950/60 p-4 rounded-xl border border-purple-500/40 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-2">
                    RESULTADO COMPARATIVO:
                  </span>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
                      <span>Sem Esteira de Upsell:</span>
                      <strong className="text-slate-200 font-mono">R$ {baseRevenue.toLocaleString("pt-BR")}</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
                      <span>Com Esteira Completa:</span>
                      <strong className="text-emerald-400 font-mono text-sm">R$ {totalRevenue.toLocaleString("pt-BR")}</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <span>Novo Ticket Médio (AOV):</span>
                      <strong className="text-purple-300 font-mono">R$ {newAOV.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center">
                  <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase block">
                    Lucro Líquido Adicional Sem Gastar Mais Anúncios:
                  </span>
                  <span className="text-xl font-black text-emerald-400 font-mono block mt-0.5">
                    +R$ {(totalRevenue - baseRevenue).toLocaleString("pt-BR")} (+{revenueIncreasePercent}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP-BY-STEP EXECUTION ROADMAP */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <span>Passo a Passo Prático para Executar a Esteira</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Clique para marcar os passos à medida que for configurando em sua plataforma de vendas.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRegenerateStrategy}
                disabled={isGenerating}
                className="px-3.5 py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isGenerating ? "animate-spin" : ""}`} />
                <span>Recriar Ofertas com IA</span>
              </button>
            </div>

            {/* CHECKLIST STEPS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* STEP 1 */}
              <div
                onClick={() => toggleStep("step_bump")}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                  completedSteps.step_bump
                    ? "bg-emerald-950/30 border-emerald-500/50 text-slate-200"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                    completedSteps.step_bump
                      ? "bg-emerald-500 border-emerald-400 text-slate-950"
                      : "border-slate-700 bg-slate-900 text-transparent"
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">
                    Passo 01 • Order Bump no Checkout
                  </span>
                  <h4 className="text-xs font-bold text-white mt-0.5">
                    Adicionar caixa de 1-clique antes do botão de pagamento
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Crie uma oferta complementar entre R$ 19,90 e R$ 37,00 (ex: Áudio-guia, Lista de Prompts, Checklist) que resolve o desejo de agilidade do cliente.
                  </p>
                </div>
              </div>

              {/* STEP 2 */}
              <div
                onClick={() => toggleStep("step_upsell1")}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                  completedSteps.step_upsell1
                    ? "bg-emerald-950/30 border-emerald-500/50 text-slate-200"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                    completedSteps.step_upsell1
                      ? "bg-emerald-500 border-emerald-400 text-slate-950"
                      : "border-slate-700 bg-slate-900 text-transparent"
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">
                    Passo 02 • Upsell 1 (1-Click na Thank You Page)
                  </span>
                  <h4 className="text-xs font-bold text-white mt-0.5">
                    Redirecionar comprador para a página de oferta imediata
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Apresente um vídeo curto de 3 minutos com uma oferta exclusiva de R$ 97,00 a R$ 197,00 com botão de compra em 1 clique sem redigitar o cartão.
                  </p>
                </div>
              </div>

              {/* STEP 3 */}
              <div
                onClick={() => toggleStep("step_downsell")}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                  completedSteps.step_downsell
                    ? "bg-emerald-950/30 border-emerald-500/50 text-slate-200"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                    completedSteps.step_downsell
                      ? "bg-emerald-500 border-emerald-400 text-slate-950"
                      : "border-slate-700 bg-slate-900 text-transparent"
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
                    Passo 03 • Downsell 1 (Redução de Valor)
                  </span>
                  <h4 className="text-xs font-bold text-white mt-0.5">
                    Resgatar quem recusou o Upsell 1
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Caso a pessoa clique em "Não, obrigado", abra o Downsell de R$ 47,00 oferecendo apenas os materiais e planilhas essenciais sem as aulas em vídeo.
                  </p>
                </div>
              </div>

              {/* STEP 4 */}
              <div
                onClick={() => toggleStep("step_upsell2")}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                  completedSteps.step_upsell2
                    ? "bg-emerald-950/30 border-emerald-500/50 text-slate-200"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                    completedSteps.step_upsell2
                      ? "bg-emerald-500 border-emerald-400 text-slate-950"
                      : "border-slate-700 bg-slate-900 text-transparent"
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-teal-400 font-bold uppercase block">
                    Passo 04 • Assinatura Recorrente / Comunidade
                  </span>
                  <h4 className="text-xs font-bold text-white mt-0.5">
                    Transformar comprador único em receita previsível (MRR)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Ofereça acesso à comunidade VIP ou encontros mensais de mentoria por R$ 19,90/mês ou R$ 197,00/ano.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DETAILED CARDS FOR EACH OFFER IN THE FUNNEL */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Copys e Ofertas Prontas para Configurar no Checkout:</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {upsellItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between gap-4 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                        {item.typeLabel}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-black text-xs border border-emerald-500/30">
                        R$ {item.suggestedPrice.toFixed(2)}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white leading-snug">{item.title}</h4>

                    {/* HEADLINE */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                      <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase block">
                        📌 Chamada / Headline no Checkout:
                      </span>
                      <p className="text-xs font-bold text-white">{item.headline}</p>
                    </div>

                    {/* COPY */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                      <span className="text-[9px] font-mono text-purple-400 font-bold uppercase block">
                        ✍️ Copy da Oferta:
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.checkoutText}</p>
                    </div>

                    {/* VSL SCRIPT IF AVAILABLE */}
                    {item.vslScriptShort && (
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                        <span className="text-[9px] font-mono text-amber-400 font-bold uppercase block">
                          🎬 Roteiro de VSL (3 Minutos):
                        </span>
                        <p className="text-[11px] text-slate-400 font-mono whitespace-pre-line leading-relaxed">
                          {item.vslScriptShort}
                        </p>
                      </div>
                    )}

                    {/* DELIVERY & METRIC */}
                    <div className="pt-2 border-t border-slate-850 space-y-1 text-[11px]">
                      <p className="text-slate-400">
                        <strong className="text-slate-200">Como entregar:</strong> {item.deliveryStrategy}
                      </p>
                      <p className="text-emerald-400 font-mono font-medium">{item.conversionTarget}</p>
                    </div>
                  </div>

                  {/* COPY BUTTON */}
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(
                        `=== ${item.title} ===\nPreço: R$ ${item.suggestedPrice}\nHeadline: ${item.headline}\nCopy: ${item.checkoutText}\nEntrega: ${item.deliveryStrategy}`,
                        item.id
                      )
                    }
                    className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                        <span className="text-emerald-400 font-mono text-[11px]">
                          Copy Copiada para Área de Transferência!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-purple-400" />
                        <span>Copiar Parâmetros da Oferta</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PLATFORM TUTORIAL CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wide">
                  Tutorial Rápido por Plataforma de Checkout
                </h3>
              </div>

              {/* PLATFORM SELECTOR */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {[
                  { id: "kiwify", name: "Kiwify" },
                  { id: "hotmart", name: "Hotmart" },
                  { id: "eduzz", name: "Eduzz" },
                  { id: "kirvano", name: "Kirvano" },
                  { id: "perfectpay", name: "PerfectPay" }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlatform(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedPlatform === p.id
                        ? "bg-purple-500 text-white font-black shadow-md"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* INSTRUCTIONS BY PLATFORM */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs leading-relaxed space-y-2">
              {selectedPlatform === "kiwify" && (
                <div className="space-y-2 text-slate-300">
                  <strong className="text-emerald-400 block font-mono">
                    👉 Como configurar a Esteira na Kiwify:
                  </strong>
                  <p>1. Vá em <strong>Meus Produtos</strong> &gt; Clique no seu e-book principal.</p>
                  <p>2. Na aba <strong>Order Bumps</strong>, clique em <strong>Adicionar Order Bump</strong>. Insira o título, valor (R$ 27) e a mensagem de marcação.</p>
                  <p>3. Na aba <strong>Upsell de 1 Clique</strong>, selecione o produto de Upsell 1 (Workshop/Acelerador) e insira a URL da página de agradecimento.</p>
                </div>
              )}

              {selectedPlatform === "hotmart" && (
                <div className="space-y-2 text-slate-300">
                  <strong className="text-emerald-400 block font-mono">
                    👉 Como configurar a Esteira na Hotmart:
                  </strong>
                  <p>1. Vá em <strong>Ferramentas</strong> &gt; <strong>Aparência da Página de Pagamento</strong>.</p>
                  <p>2. Clique em editar seu checkout e ative a caixa de <strong>Order Bump</strong>.</p>
                  <p>3. Vá em <strong>Ferramentas</strong> &gt; <strong>Funil de Vendas (Upsell)</strong> para configurar o redirecionamento automático pós-compra.</p>
                </div>
              )}

              {selectedPlatform === "eduzz" && (
                <div className="space-y-2 text-slate-300">
                  <strong className="text-emerald-400 block font-mono">
                    👉 Como configurar a Esteira na Eduzz:
                  </strong>
                  <p>1. Acesse o <strong>Select Eduzz</strong> &gt; <strong>Checkout Sun</strong>.</p>
                  <p>2. Em configurações do produto, selecione <strong>Adicionar Order Bump</strong> no carrinho.</p>
                  <p>3. Ative o app <strong>Funil de Vendas 1-Clique</strong> no aplicativo Nutror/Sun.</p>
                </div>
              )}

              {selectedPlatform === "kirvano" && (
                <div className="space-y-2 text-slate-300">
                  <strong className="text-emerald-400 block font-mono">
                    👉 Como configurar a Esteira na Kirvano:
                  </strong>
                  <p>1. Acesse <strong>Meus Produtos</strong> &gt; Selecione o Produto.</p>
                  <p>2. Clique na aba <strong>Order Bump</strong> &gt; <strong>Novo Order Bump</strong>.</p>
                  <p>3. Em <strong>Funil de Vendas</strong>, configure o Upsell de 1 clique para a Thank You Page.</p>
                </div>
              )}

              {selectedPlatform === "perfectpay" && (
                <div className="space-y-2 text-slate-300">
                  <strong className="text-emerald-400 block font-mono">
                    👉 Como configurar a Esteira na PerfectPay:
                  </strong>
                  <p>1. Vá em <strong>Checkouts</strong> &gt; Selecione o Checkout Ativo.</p>
                  <p>2. Clique em <strong>Adicionar Order Bump</strong> e selecione o produto complementar.</p>
                  <p>3. Configure a URL da Página de Upsell com o script de 1-Clique do Checkout.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 3 CRIATIVOS CAMPEÕES */}
      {activeTab === "creatives" && (
        <div className="space-y-6">
          {/* STRATEGIC ADVICE CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-lg shrink-0">
                💡
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">Instrução de Tráfego do Sócio Estratégico</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Suba estes 3 criativos no mesmo conjunto de anúncios no Meta Ads ou Google Ads. A própria inteligência da plataforma de anúncios vai distribuir o orçamento e identificar qual gancho atrai cliques mais baratos para sua página.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsGenerating(true);
                setTimeout(() => {
                  setCreatives([
                    {
                      id: 1,
                      title: "Criativo 01 • O Maior Segredo Revelado",
                      angle: "Gancho de Curiosidade & Revelação",
                      headline: `Descubra a fórmula de ${productName || "Seu Produto"} que poucos conhecem.`,
                      primaryText: `A maioria das pessoas falha em ${niche || "este mercado"} porque ignora um detalhe simples. Com a voz e estrutura certas, você pode aplicar ${productName || "esta solução"} hoje mesmo.\n\nToque no botão e garanta o acesso!`,
                      visualScript: "VÍDEO RÁPIDO: Texto piscando 'PARE DE PERDER TEMPO EM " + (niche?.toUpperCase() || "SEU NICHO") + "' com transição para o produto.",
                      cta: "Acessar Apresentação",
                      recommendedAudience: "Público Aberto (Sem Filtros) + Meta CBO"
                    },
                    {
                      id: 2,
                      title: "Criativo 02 • Quebra de Paradigma Absoluta",
                      angle: "Confronto Direto + Prova Social",
                      headline: `Por que 90% falham em ${niche || "seu nicho"} e como você pode virar o jogo?`,
                      primaryText: `Chega de desculpas. A verdade é que ${targetAudience || "seu público"} precisa de clareza e ação prática. Sem complicações e com passo a passo definitivo.\n\nSaiba mais no link abaixo!`,
                      visualScript: "IMAGEM ESTÁTICA: Arte minimalista em fundo claro com badge dourada e texto de autoimpacto.",
                      cta: "Saiba Mais Agora",
                      recommendedAudience: "Interesses Diretos no Facebook Ads"
                    },
                    {
                      id: 3,
                      title: "Criativo 03 • Oferta de Lançamento Irresistível",
                      angle: "Escassez + Bônus Exclusivo de Ação Rápida",
                      headline: `Garanta ${productName || "Seu Infoproduto"} com todos os bônus inclusos!`,
                      primaryText: `Esta oferta é válida apenas para os primeiros compradores desta semana. Não deixe para depois o resultado que você pode conquistar hoje.`,
                      visualScript: "CARROSSEL: Slide 1 - Benefício Principal. Slide 2 - Os Bônus Inclusos. Slide 3 - Garantia Incondicional.",
                      cta: "Garantir Desconto Agora",
                      recommendedAudience: "Envolvolvimento 90 Dias + Envio de Mensagens"
                    }
                  ]);
                  setIsGenerating(false);
                }, 1000);
              }}
              disabled={isGenerating}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isGenerating ? "animate-spin" : ""}`} />
              <span>Gerar Novos Criativos</span>
            </button>
          </div>

          {/* 3 CREATIVES CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {creatives.map((c) => (
              <div
                key={c.id}
                className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between gap-4 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                      {c.angle}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 text-[9px] font-mono border border-slate-800">
                      Criativo #{c.id}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white leading-snug">{c.title}</h3>

                  {/* HEADLINE */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                    <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase block">📌 Headline do Anúncio:</span>
                    <p className="text-xs font-bold text-white">{c.headline}</p>
                  </div>

                  {/* PRIMARY COPY */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                    <span className="text-[9px] font-mono text-purple-400 font-bold uppercase block">✍️ Texto Principal (Copy):</span>
                    <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{c.primaryText}</p>
                  </div>

                  {/* VISUAL SCRIPT */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                    <span className="text-[9px] font-mono text-amber-400 font-bold uppercase block">🎬 Roteiro Visual / Arte:</span>
                    <p className="text-[11px] text-slate-400 italic leading-snug">{c.visualScript}</p>
                  </div>

                  {/* CTA & TARGETING */}
                  <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">CTA: <strong className="text-white">{c.cta}</strong></span>
                    <span className="text-purple-400">{c.recommendedAudience}</span>
                  </div>
                </div>

                {/* COPY BUTTON */}
                <button
                  type="button"
                  onClick={() => handleCopyText(`=== ${c.title} ===\nÂngulo: ${c.angle}\n\nHEADLINE:\n${c.headline}\n\nCOPY:\n${c.primaryText}\n\nROTEIRO:\n${c.visualScript}\n\nCTA: ${c.cta}`, c.id)}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedId === c.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                      <span className="text-emerald-400 font-mono text-[11px]">Copiado para Área de Transferência!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-purple-400" />
                      <span>Copiar Copy do Anúncio</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FINAL DOWNLOAD ACTION FOOTER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-white">Baixar Manual Completo da Esteira e Criativos</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Baixe o arquivo de texto com todas as ofertas da esteira, simulação financeira e os 3 criativos de tráfego pago.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadFullStrategy}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer hover:scale-105"
        >
          <Download className="w-4 h-4 stroke-[3]" />
          <span>Baixar Manual Completo (TXT)</span>
        </button>
      </div>
    </div>
  );
}


