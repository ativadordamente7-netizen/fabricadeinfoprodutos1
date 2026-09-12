import React, { useState } from "react";
import { Sparkles, Bot, ArrowRight, Zap, Target, CheckCircle2, AlertTriangle, MessageSquare, ChevronDown, ChevronUp, RefreshCw, BarChart3, Award, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ExperienceLevel } from "./NivelamentoExperience";
import RelatorioDesempenhoModal from "./RelatorioDesempenhoModal";

interface Props {
  currentStep: number;
  osTab: string;
  niche: string;
  productName: string;
  experienceLevel: ExperienceLevel;
  hasEbook: boolean;
  hasSalesPage: boolean;
  hasCover: boolean;
  hasVsl: boolean;
  hasAds: boolean;
  onNavigateStep?: (step: number) => void;
  onNavigateTab?: (tab: string) => void;
}

export default function OperadorInteligenteWidget({
  currentStep,
  osTab,
  niche,
  productName,
  experienceLevel,
  hasEbook,
  hasSalesPage,
  hasCover,
  hasVsl,
  hasAds,
  onNavigateStep,
  onNavigateTab
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: `Olá! Sou o Operador Inteligente do Infinity Million OS. Estou monitorando seu progresso em tempo real. Como posso acelerar sua operação hoje?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Dynamic context analysis calculation
  const getContextAnalysis = () => {
    let currentTaskName = "Início da Jornada";
    let completed: string[] = [];
    let pending: string[] = [];
    let currentBottleneck = "";
    let priorityAction = "";
    let nextStepIndex = 1;

    if (currentStep === 1) {
      currentTaskName = "Definição do Nicho e Público-Alvo";
      pending.push("Criar E-book", "Criar Capa 3D", "Criar VSL", "Criar Página de Vendas", "Criar Anúncios");
      currentBottleneck = "Falta de clareza sobre o nicho lucrativo.";
      priorityAction = "Preencher o nicho e público-alvo na Fábrica para gerar a oferta base.";
      nextStepIndex = 2;
    } else if (currentStep === 2) {
      currentTaskName = "Geração e Edição do E-book";
      if (niche) completed.push("Nicho definido");
      pending.push("Criar Capa 3D", "Criar VSL", "Criar Página de Vendas", "Criar Anúncios");
      currentBottleneck = hasEbook ? "E-book gerado. Falta validar os capítulos e a oferta." : "E-book ainda não gerado com IA.";
      priorityAction = hasEbook ? "Avançar para a geração de Capa Profissional (Gemini 3 Pro 1K/2K/4K)." : "Clique em 'Gerar E-book com IA' para estruturar o produto.";
      nextStepIndex = 3;
    } else if (currentStep === 3) {
      currentTaskName = "Criação de Capa & Mockup 3D";
      completed.push("Nicho definido", "E-book estruturado");
      pending.push("Criar VSL", "Criar Página de Vendas", "Criar Anúncios");
      currentBottleneck = hasCover ? "Capa gerada." : "Falta uma capa de alto valor percebido.";
      priorityAction = "Gerar capa com o modelo gemini-3-pro-image-preview em alta resolução (1K, 2K ou 4K).";
      nextStepIndex = 4;
    } else if (currentStep === 4) {
      currentTaskName = "Roteiro de VSL (Vídeo de Sales)";
      completed.push("Nicho definido", "E-book criado", "Capa 3D gerada");
      pending.push("Criar Página de Vendas", "Criar Anúncios");
      currentBottleneck = hasVsl ? "VSL finalizada." : "Falta o roteiro persuasivo de vendas em vídeo.";
      priorityAction = "Gerar o Roteiro AIDA da VSL e escolher o formato de apresentação.";
      nextStepIndex = 5;
    } else if (currentStep === 5) {
      currentTaskName = "Construção da Página de Vendas (LP)";
      completed.push("Nicho definido", "E-book criado", "Capa 3D gerada", "VSL estruturada");
      pending.push("Criar Anúncios", "Publicar Operação");
      currentBottleneck = hasSalesPage ? "Página criada. Falta configurar o checkout e botão de compra." : "Página de Vendas em rascunho.";
      priorityAction = "Ajustar os benefícios, prova social e link de checkout da sua Landing Page.";
      nextStepIndex = 6;
    } else if (currentStep === 6) {
      currentTaskName = "Fábrica de Anúncios e Criativos Visuais";
      completed.push("E-book", "Capa 3D", "VSL", "Página de Vendas");
      pending.push("Publicar no Servidor");
      currentBottleneck = hasAds ? "Criativos gerados." : "Sem artes visuais para rodar tráfego pago.";
      priorityAction = "Gerar 3 opções visuais de anúncios em alta definição com o Imagen 3 Pro.";
      nextStepIndex = 7;
    } else if (currentStep === 7) {
      currentTaskName = "Checklist & Publicação Oficial";
      completed.push("Produto", "Capa", "VSL", "Página", "Criativos");
      pending.push("Travar Vendas");
      currentBottleneck = "Operação pronta mas ainda não publicada em URL ao vivo.";
      priorityAction = "Validar os 11 pontos do checklist e clicar em Publicar Projeto.";
      nextStepIndex = 8;
    } else {
      currentTaskName = "Orientação do Sócio Estratégico & Escala";
      completed.push("Operação Completa Publicada");
      currentBottleneck = "Falta ativar a esteira de Upsell e otimizar o custo por aquisição (CPA).";
      priorityAction = "Configurar Order Bump e Upsell direto no checkout.";
      nextStepIndex = 8;
    }

    return {
      currentTaskName,
      completed,
      pending,
      currentBottleneck,
      priorityAction,
      nextStepIndex
    };
  };

  const analysis = getContextAnalysis();

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || inputQuery;
    if (!messageText.trim()) return;

    setChatMessages((prev) => [...prev, { sender: "user", text: messageText }]);
    if (!textToSend) setInputQuery("");
    setIsThinking(true);

    setTimeout(() => {
      let aiReply = "";
      const lower = messageText.toLowerCase();

      if (lower.includes("gargalo") || lower.includes("travado") || lower.includes("problema")) {
        aiReply = `🔍 **Análise de Gargalo Atual:**\nNo momento, seu principal gargalo é: **${analysis.currentBottleneck}**.\n\n💡 **Solução Recomendada:** ${analysis.priorityAction}`;
      } else if (lower.includes("relatório") || lower.includes("desempenho") || lower.includes("performance")) {
        setShowReport(true);
        aiReply = `📊 Abri o seu **Relatório de Desempenho Inteligente**! Analisei sua constância, execução, organização e disciplina com base na utilização da plataforma.`;
      } else if (lower.includes("fazer agora") || lower.includes("próximo passo") || lower.includes("orientação")) {
        aiReply = `🎯 **Próxima Ação Prioritária:**\n${analysis.priorityAction}\n\nVocê está atualmente na etapa **"${analysis.currentTaskName}"**. Clique em 'Executar Próximo Passo' para ir direto ao módulo!`;
      } else if (lower.includes("nicho") || lower.includes("produto")) {
        aiReply = `💡 **Orientação sobre Produto & Nicho:**\nPara o nicho **${niche || "seu nicho"}**, recomendamos manter uma promessa clara de transformação rápida com entregáveis práticos (como guias em PDF e checklists).`;
      } else {
        aiReply = `🤖 **Orientação do Operador Inteligente:**\nCom base no seu perfil (${experienceLevel.toUpperCase()}) e na etapa atual (${analysis.currentTaskName}), a melhor decisão agora é focar em: ${analysis.priorityAction}`;
      }

      setChatMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <>
      {/* FLOATING PULSING TOGGLE BUTTON */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-2xl border border-emerald-400/50 flex items-center gap-2.5 transition transform hover:scale-105 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 text-emerald-300 group-hover:rotate-12 transition" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-emerald-300 font-mono font-bold leading-none">OPERADOR INTELIGENTE</span>
            <span className="text-xs font-black text-white leading-tight">
              {isOpen ? "Fechar Operador" : "IA de Acompanhamento"}
            </span>
          </div>
        </button>
      </div>

      {/* OPERADOR INTELIGENTE DRAWER / MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[460px] max-h-[82vh] bg-slate-950 border border-emerald-500/40 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* HEADER */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">OPERADOR INTELIGENTE IA</h3>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold uppercase border border-emerald-500/30">
                      ATIVO 24/7
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Monitorando: <span className="text-emerald-400 font-bold">{analysis.currentTaskName}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowReport(true)}
                  title="Abrir Relatório de Desempenho"
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-800 transition cursor-pointer"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* DYNAMIC CONTEXT STATUS CARD */}
            <div className="p-4 bg-slate-900/80 border-b border-slate-850 space-y-3 font-sans">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono font-bold uppercase flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    Diagnóstico em Tempo Real
                  </span>
                  <span className="text-emerald-400 font-mono font-extrabold">Etapa {currentStep}/8</span>
                </div>

                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-slate-200">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-0.5">Prioridade Imediata:</span>
                  <p className="font-medium leading-relaxed">{analysis.priorityAction}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Gargalo: {analysis.currentBottleneck}
                  </span>

                  {onNavigateStep && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateStep(analysis.nextStepIndex);
                        setIsOpen(false);
                      }}
                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black uppercase rounded-lg flex items-center gap-1 cursor-pointer transition"
                    >
                      <span>Ir ao Módulo</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* QUICK CHIP ACTIONS */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
                <button
                  type="button"
                  onClick={() => handleSendMessage("O que devo fazer agora?")}
                  className="px-2.5 py-1 rounded-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold text-emerald-400 shrink-0 cursor-pointer transition flex items-center gap-1"
                >
                  <Target className="w-3 h-3" />
                  Próximo Passo
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("Qual meu maior gargalo?")}
                  className="px-2.5 py-1 rounded-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold text-amber-400 shrink-0 cursor-pointer transition flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3" />
                  Meu Gargalo
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("Gerar meu relatório de performance")}
                  className="px-2.5 py-1 rounded-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold text-purple-400 shrink-0 cursor-pointer transition flex items-center gap-1"
                >
                  <BarChart3 className="w-3 h-3" />
                  Relatório Performance
                </button>
              </div>
            </div>

            {/* CHAT MESSAGES BODY */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "ai" && (
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-emerald-500 text-slate-950 font-bold"
                        : "bg-slate-900 text-slate-200 border border-slate-800 leading-relaxed font-medium"
                    }`}
                  >
                    {msg.text.split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-1.5" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-2 items-center text-slate-400 text-[11px] font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Operador Inteligente analisando contexto...</span>
                </div>
              )}
            </div>

            {/* CHAT INPUT FORM */}
            <div className="p-3 bg-slate-900 border-t border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Pergunte ao Operador (ex: Como destravar vendas?)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim()}
                  className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  Enviar
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PERFORMANCE REPORT MODAL */}
      {showReport && (
        <RelatorioDesempenhoModal
          currentStep={currentStep}
          experienceLevel={experienceLevel}
          hasEbook={hasEbook}
          hasSalesPage={hasSalesPage}
          hasCover={hasCover}
          hasVsl={hasVsl}
          hasAds={hasAds}
          onClose={() => setShowReport(false)}
        />
      )}
    </>
  );
}
