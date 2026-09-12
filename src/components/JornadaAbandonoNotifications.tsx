import React, { useState, useEffect } from "react";
import { 
  BellRing, 
  Sparkles, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  ShoppingCart, 
  Zap, 
  Copy, 
  Check, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  Send, 
  ShieldCheck, 
  Tag, 
  Download,
  X,
  ExternalLink
} from "lucide-react";

interface Props {
  productName: string;
  niche: string;
  price?: string;
  targetAudience?: string;
}

interface NotificationStep {
  id: string;
  triggerTime: string;
  channel: "whatsapp" | "email" | "sms" | "push" | "popup";
  channelName: string;
  iconColor: string;
  title: string;
  headline: string;
  message: string;
  ctaText: string;
  conversionBoost: string;
}

export default function JornadaAbandonoNotifications({
  productName,
  niche,
  price = "R$ 47,00",
  targetAudience
}: Props) {
  const [selectedTrigger, setSelectedTrigger] = useState<"carrinho" | "pix" | "boleto" | "exit_intent">("carrinho");
  const [supportName, setSupportName] = useState("Equipe de Suporte");
  const [couponCode, setCouponCode] = useState("RECUPERA10");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedStep, setSimulatedStep] = useState<number>(-1);
  const [activeToast, setActiveToast] = useState<{
    title: string;
    message: string;
    channel: string;
    type: "info" | "success" | "warning";
  } | null>(null);

  const prod = productName || "E-book Digital";
  const pNiche = niche || "seu segmento";

  // Dynamic notification templates according to trigger type
  const getNotificationSteps = (): NotificationStep[] => {
    if (selectedTrigger === "carrinho") {
      return [
        {
          id: "car-1",
          triggerTime: "5 minutos após abandono",
          channel: "whatsapp",
          channelName: "WhatsApp Automático",
          iconColor: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
          title: "🚨 Notificação #1: Resgate Instantâneo no WhatsApp",
          headline: "Sua compra de " + prod + " não foi concluída!",
          message: `Olá! Vi que você começou a inscrição para garantir o "${prod}", mas não conseguiu concluir.\n\nAconteceu algum problema no pagamento ou ficou com alguma dúvida sobre o conteúdo?\n\n👉 Responda esta mensagem para falar com o suporte ou acesse o link seguro com seu pedido salvo: [LINK_CHECKOUT]`,
          ctaText: "💬 Responder no WhatsApp",
          conversionBoost: "+18% de Recuperação Direct"
        },
        {
          id: "car-2",
          triggerTime: "15 minutos após abandono",
          channel: "push",
          channelName: "Notificação Push / PWA",
          iconColor: "text-indigo-400 bg-indigo-500/20 border-indigo-500/30",
          title: "📱 Notificação #2: Web Push / App Banner",
          headline: "🎁 Presente Especial Guardado!",
          message: `O e-book "${prod}" ainda está reservado para você! Liberamos um cupom exclusivo de 10% OFF [${couponCode}] ativo pelos próximos 30 minutos.`,
          ctaText: "⚡ Usar Cupom " + couponCode,
          conversionBoost: "+12% de Cliques Voluntários"
        },
        {
          id: "car-3",
          triggerTime: "1 hora após abandono",
          channel: "email",
          channelName: "E-mail de Prova Social",
          iconColor: "text-sky-400 bg-sky-500/20 border-sky-500/30",
          title: "📧 Notificação #3: E-mail de Depoimentos & Garantia",
          headline: "Assunto: [Dúvida] Você ainda quer dominar " + pNiche + "?",
          message: `Olá!\n\nSei que a rotina é corrida, mas não queria que você perdesse a oportunidade de transformar seus resultados em ${pNiche}.\n\nCentenas de pessoas já estão aplicando o método do e-book "${prod}" com resultados incríveis.\n\n🛡️ Lembrando que você tem 7 Dias de Garantia Incondicional: se não gostar, devolvemos 100% do seu dinheiro.\n\n👉 Clique aqui para resgatar sua cópia: [LINK_CHECKOUT]`,
          ctaText: "📖 Resgatar Meu E-book sem Risco",
          conversionBoost: "+15% de Conversão por Prova Social"
        },
        {
          id: "car-4",
          triggerTime: "24 horas após abandono",
          channel: "sms",
          channelName: "SMS de Último Aviso",
          iconColor: "text-amber-400 bg-amber-500/20 border-amber-500/30",
          title: "⚡ Notificação #4: SMS de Encerramento de Carrinho",
          headline: "⚠️ ÚLTIMO AVISO DE RESERVA",
          message: `[ALERTA] Seu carrinho do "${prod}" será cancelado hoje às 23:59. Acesse o link para garantir por ${price}: [LINK_CURTO]`,
          ctaText: "📲 Concluir Pedido Agora",
          conversionBoost: "+9% de Urgência Final"
        }
      ];
    } else if (selectedTrigger === "pix") {
      return [
        {
          id: "pix-1",
          triggerTime: "2 minutos após gerar Pix",
          channel: "whatsapp",
          channelName: "WhatsApp com Chave Pix",
          iconColor: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
          title: "🚨 Notificação #1: Envio da Chave Pix Copia e Cola",
          headline: "Chave Pix gerada com sucesso para " + prod,
          message: `Olá! Seu pedido do e-book "${prod}" via Pix no valor de ${price} foi gerado com sucesso! 🎉\n\nPara facilitar seu acesso imediato, aqui está sua Chave Pix Copia e Cola:\n\n[CHAVE_PIX_AQUI]\n\nApós o pagamento, o envio do e-book é 100% AUTOMÁTICO no seu e-mail em menos de 10 segundos!`,
          ctaText: "📋 Copiar Chave Pix",
          conversionBoost: "+35% de Pagamento Imediato"
        },
        {
          id: "pix-2",
          triggerTime: "15 minutos antes do Pix expirar",
          channel: "sms",
          channelName: "SMS Lembrete de Expiração",
          iconColor: "text-amber-400 bg-amber-500/20 border-amber-500/30",
          title: "📱 Notificação #2: Alerta de Expiração de Pix",
          headline: "⏰ Seu Pix expira em 15 minutos!",
          message: `Sua chave Pix de ${price} para o "${prod}" expira em instantes. Conclua o pagamento para garantir seus bônus exclusivos! [LINK_PIX]`,
          ctaText: "⚡ Pagar Pix Agora",
          conversionBoost: "+22% de Reativação"
        },
        {
          id: "pix-3",
          triggerTime: "2 horas após Pix expirar",
          channel: "whatsapp",
          channelName: "WhatsApp Oferta de Suporte Humano",
          iconColor: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
          title: "💬 Notificação #3: Ajuda com Erro no Pix",
          headline: "Sua chave Pix expirou. Gerar uma nova?",
          message: `Olá! Notei que a chave Pix do "${prod}" expirou. Teve algum limite diário ou problema com o aplicativo do banco?\n\nSe quiser, posso gerar um novo código Pix pra você agora mesmo ou disponibilizar o pagamento no Cartão em até 12x!`,
          ctaText: "🔄 Gerar Novo Pix",
          conversionBoost: "+19% de Recuperação com Ajuda Humanizada"
        }
      ];
    } else if (selectedTrigger === "boleto") {
      return [
        {
          id: "bol-1",
          triggerTime: "10 minutos após imprimir boleto",
          channel: "email",
          channelName: "E-mail Código de Barras",
          iconColor: "text-sky-400 bg-sky-500/20 border-sky-500/30",
          title: "📄 Notificação #1: Boleto Impresso e Código de Barras",
          headline: "Confirmação do Pedido: " + prod,
          message: `Olá!\n\nObrigado por escolher o e-book "${prod}".\n\nAqui está o seu Código de Barras para pagamento no banco ou app do celular:\n\n[CODIGO_DE_BARRAS]\n\n💡 Dica rápida: Boletos levam até 1 a 2 dias úteis para compensar. Se quiser receber o acesso HOJE MESMO, você pode migrar para Pix ou Cartão!`,
          ctaText: "⚡ Mudar para Pix e Acessar Agora",
          conversionBoost: "+25% de Migração para Pix"
        },
        {
          id: "bol-2",
          triggerTime: "24 horas após emissão",
          channel: "whatsapp",
          channelName: "WhatsApp Lembrete de Vencimento",
          iconColor: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
          title: "🚨 Notificação #2: Lembrete de Vencimento do Boleto",
          headline: "Lembrete: Seu boleto vence HOJE!",
          message: `Olá! Passando para avisar que o boleto do e-book "${prod}" (${price}) vence hoje.\n\nGaranta seu pagamento até às 22:00 para não perder o valor promocional e os bônus de lançamento!`,
          ctaText: "📄 Ver Boleto / Pagar",
          conversionBoost: "+30% de Pagamento em Dia"
        }
      ];
    } else {
      return [
        {
          id: "exit-1",
          triggerTime: "Ativado no instante que o usuário move o mouse para fechar",
          channel: "popup",
          channelName: "Pop-up de Intenção de Saída",
          iconColor: "text-rose-400 bg-rose-500/20 border-rose-500/30",
          title: "🛑 Notificação Pop-up: Oferta Irresistível de Saída",
          headline: "ESPERE! NÃO VÁ EMBORA DE MÃOS VAZIAS!",
          message: `Sabemos que você quer transformar seus resultados em ${pNiche}.\n\nPara que o preço não seja um obstáculo, liberamos um BÔNUS SURPRESA + 15% de Desconto Imediato se você concluir nos próximos 5 minutos!`,
          ctaText: "🔥 SIM! Quero Garantir com Desconto Agora",
          conversionBoost: "+14% de Resgate Imediato no Checkout"
        }
      ];
    }
  };

  const steps = getNotificationSteps();

  // Handle copy text
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Start Live Simulation Sequence
  const startSimulation = () => {
    setIsSimulating(true);
    setSimulatedStep(0);

    const runStep = (index: number) => {
      if (index >= steps.length) {
        setIsSimulating(false);
        setSimulatedStep(-1);
        setActiveToast({
          title: "🎉 Jornada Concluída com Sucesso!",
          message: "Todas as 4 notificações de recuperação foram simuladas e disparadas.",
          channel: "Sistema",
          type: "success"
        });
        setTimeout(() => setActiveToast(null), 4000);
        return;
      }

      const st = steps[index];
      setSimulatedStep(index);

      setActiveToast({
        title: st.title,
        message: st.message.substring(0, 110) + "...",
        channel: st.channelName,
        type: "info"
      });

      setTimeout(() => {
        runStep(index + 1);
      }, 3500);
    };

    runStep(0);
  };

  const downloadAllNotificationsTxt = () => {
    let fullText = `===================================================\n`;
    fullText += `🔔 JORNADA DE NOTIFICAÇÕES DE ABANDONO DE CARRINHO\n`;
    fullText += `Produto: ${productName}\n`;
    fullText += `Gatilho: ${selectedTrigger.toUpperCase()}\n`;
    fullText += `===================================================\n\n`;

    steps.forEach((st, idx) => {
      fullText += `--- PASSO ${idx + 1}: ${st.channelName.toUpperCase()} (${st.triggerTime}) ---\n`;
      fullText += `TÍTULO: ${st.headline}\n`;
      fullText += `MENSAGEM:\n${st.message}\n`;
      fullText += `CHAMADA DE AÇÃO: ${st.ctaText}\n`;
      fullText += `ESTIMATIVA: ${st.conversionBoost}\n\n`;
    });

    const element = document.createElement("a");
    const file = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `NOTIFICACOES_ABANDONO_${productName.toLowerCase().replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full space-y-6 font-sans relative">
      
      {/* FLOATING REAL-TIME TOAST NOTIFICATION */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border-2 border-emerald-500 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-500/20 animate-bounce flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
            <BellRing className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                {activeToast.channel}
              </span>
              <button
                type="button"
                onClick={() => setActiveToast(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <h5 className="text-xs font-black text-white">{activeToast.title}</h5>
            <p className="text-[11px] text-slate-300 font-mono leading-tight">{activeToast.message}</p>
          </div>
        </div>
      )}

      {/* BANNER HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0 shadow-lg shadow-amber-500/10">
              <BellRing className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                  JORNADA DE ABANDONO & NOTIFICAÇÕES IA
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-extrabold border border-amber-500/40">
                  SISTEMA DE DISPAROS
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Recupere até 35% das vendas perdidas no checkout ativando a sequência de disparos via WhatsApp, E-mail, SMS e Notificações Push automáticas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={startSimulation}
              disabled={isSimulating}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition cursor-pointer disabled:opacity-50 uppercase tracking-wider"
            >
              <Play className={`w-4 h-4 text-slate-950 ${isSimulating ? "animate-spin" : ""}`} />
              <span>{isSimulating ? "Simulando Disparos..." : "Testar Disparos da Jornada"}</span>
            </button>

            <button
              type="button"
              onClick={downloadAllNotificationsTxt}
              className="px-4 py-3 bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 flex items-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Baixar (.TXT)</span>
            </button>
          </div>
        </div>

        {/* TRIGGER SELECTOR TABS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/80 relative z-10">
          <button
            type="button"
            onClick={() => setSelectedTrigger("carrinho")}
            className={`p-3 rounded-2xl text-left border transition cursor-pointer flex flex-col gap-1 ${
              selectedTrigger === "carrinho"
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black uppercase">Carrinho Abandonado</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">4 Disparos • Retenção Alto Nível</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTrigger("pix")}
            className={`p-3 rounded-2xl text-left border transition cursor-pointer flex flex-col gap-1 ${
              selectedTrigger === "pix"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black uppercase">Pix Pendente</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">3 Disparos • Chave Copia & Cola</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTrigger("boleto")}
            className={`p-3 rounded-2xl text-left border transition cursor-pointer flex flex-col gap-1 ${
              selectedTrigger === "boleto"
                ? "bg-sky-500/20 border-sky-500/50 text-sky-300 shadow-lg shadow-sky-500/10"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-black uppercase">Boleto Emitido</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">2 Disparos • Conversão em Pix</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTrigger("exit_intent")}
            className={`p-3 rounded-2xl text-left border transition cursor-pointer flex flex-col gap-1 ${
              selectedTrigger === "exit_intent"
                ? "bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-500/10"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-black uppercase">Pop-up de Saída</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">1 Alerta • Oferta Relâmpago</span>
          </button>
        </div>
      </div>

      {/* SIMULATION TIMELINE STATUS */}
      {isSimulating && (
        <div className="bg-slate-900 border border-amber-500/40 p-4 rounded-2xl flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-bold text-amber-300">
              Simulando Disparos em Tempo Real (Passo {simulatedStep + 1} de {steps.length})...
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {steps[simulatedStep]?.channelName}
          </span>
        </div>
      )}

      {/* NOTIFICATIONS STEPS LIST */}
      <div className="space-y-4">
        {steps.map((st, idx) => (
          <div
            key={st.id}
            className={`bg-slate-900/90 border rounded-2xl p-5 md:p-6 space-y-4 transition-all shadow-xl ${
              simulatedStep === idx
                ? "border-amber-400 ring-2 ring-amber-400/30 bg-slate-900"
                : "border-slate-800 hover:border-slate-700"
            }`}
          >
            {/* CARD TOP HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs ${st.iconColor}`}>
                  {st.channel === "whatsapp" && <MessageSquare className="w-5 h-5" />}
                  {st.channel === "email" && <Mail className="w-5 h-5" />}
                  {st.channel === "sms" && <Smartphone className="w-5 h-5" />}
                  {st.channel === "push" && <BellRing className="w-5 h-5" />}
                  {st.channel === "popup" && <AlertCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{st.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {st.triggerTime}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">•</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {st.conversionBoost}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(st.message, st.id)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedId === st.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copiar Notificação</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* NOTIFICATION PREVIEW BOX */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-extrabold">
                {st.headline}
              </span>
              <p className="text-xs text-slate-200 font-mono whitespace-pre-line leading-relaxed">
                {st.message}
              </p>
            </div>

            {/* ACTION CALL BADGE */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-300 rounded-lg border border-amber-500/20 font-mono font-bold text-[11px] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                {st.ctaText}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Disparo 100% Automático via Webhook
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
