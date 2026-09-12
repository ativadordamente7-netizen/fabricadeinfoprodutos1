import React, { useState } from "react";
import { Zap, Eye, Heart, CheckCircle2, ArrowRight, BookOpen, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  onNext: () => void;
}

export default function AidaExplanation({ onNext }: Props) {
  const [activeTab, setActiveTab] = useState<"A" | "I" | "D" | "A2">("A");

  const tabs = [
    {
      id: "A" as const,
      label: "Atenção (Attention)",
      icon: Zap,
      accentColor: "text-amber-400 border-amber-500 bg-amber-500/10",
      pillColor: "bg-amber-400/10 text-amber-400 border-amber-400/20",
      bgGradient: "from-amber-500/5 to-transparent",
      title: "Como reter o scroll do feed em 3 segundos?",
      subtitle: "Gatilho no Cérebro: O Sistema Atencional de Orientação Primitivo",
      description: "No feed do Instagram ou Facebook, seu potencial cliente é bombardeado por distrações. O primeiro objetivo absoluto é o 'gancho visual e de copy'. Sem atenção imediata, seu anúncio é ignorado.",
      rules: [
        "Use ganchos curtos, polêmicos, provocativos ou contra-intuitivos.",
        "Proiba logos desnecessários no início que dêem cara de 'propaganda'.",
        "A imagem ou vídeo de fundo deve criar quebra de padrão visual."
      ],
      example: "🚨 'Não compre nenhum e-book de investimentos antes de ver esta única página...'"
    },
    {
      id: "I" as const,
      label: "Interesse (Interest)",
      icon: Eye,
      accentColor: "text-sky-400 border-sky-500 bg-sky-500/10",
      pillColor: "bg-sky-400/10 text-sky-400 border-sky-400/20",
      bgGradient: "from-sky-500/5 to-transparent",
      title: "Conectando com o problema real",
      subtitle: "Gatilho no Cérebro: Ativação de Relevância Pessoal (Foco Cortical)",
      description: "Uma vez que a pessoa parou, você precisa apresentar uma grande verdade ou um problema real em que ela se identifique imediatamente. Ela deve pensar: 'Nossa, isso é exatamente sobre mim'.",
      rules: [
        "Foque em dores específicas do público-alvo.",
        "Gere curiosidade sobre um novo método ou segredo guardado.",
        "Evite generalizações abstratas. Fale de situações do dia a dia."
      ],
      example: "👉 'A maioria das pessoas passa 8h por dia trabalhando para enriquecer o chefe enquanto vê o salário derreter pela inflação...'"
    },
    {
      id: "D" as const,
      label: "Desejo (Desire)",
      icon: Heart,
      accentColor: "text-rose-400 border-rose-500 bg-rose-500/10",
      pillColor: "bg-rose-400/10 text-rose-400 border-rose-400/20",
      bgGradient: "from-rose-500/5 to-transparent",
      title: "Desenhando a nova realidade",
      subtitle: "Gatilho no Cérebro: Ativação Dopaminérgica (Antecipação de Recompensa)",
      description: "Mostre o caminho da transformação. Explique como o seu e-book resolve aquela dor de forma definitiva e rápida. Faça a pessoa salivar pela solução proposta, visualizando o benefício em sua vida.",
      rules: [
        "Apresente o seu produto como a ponte perfeita entre a dor e a vitória.",
        "Cite 2 ou 3 transformações concretas (ex: faturar em dólar, perder peso sem passar fome).",
        "Mostre autoridade e prova de que o método é simples de aplicar."
      ],
      example: "✨ 'Com o nosso E-book estruturado, você vai aprender um plano à prova de falhas para aplicar em apenas 20 minutos por dia...'"
    },
    {
      id: "A2" as const,
      label: "Ação (Action)",
      icon: CheckCircle2,
      accentColor: "text-emerald-400 border-emerald-500 bg-emerald-500/10",
      pillColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      bgGradient: "from-emerald-500/5 to-transparent",
      title: "Eliminando barreiras para o clique",
      subtitle: "Gatilho no Cérebro: Resposta Motora e Alinhamento de Intenção",
      description: "Toda a persuasão anterior é inútil se você não disser exatamente qual é o próximo passo de forma extremamente clara, simples e direta. Reduza o atrito e ordene o clique.",
      rules: [
        "Ação única e imperativa (toque, clique, acesse).",
        "Insira uma pitada de escassez ou bônus de ação imediata.",
        "Alinhamento total com o botão de destino."
      ],
      example: "👇 'Toque no botão [SAIBA MAIS] abaixo e garanta o seu exemplar com 50% de desconto enquanto a oferta está ativa!'"
    }
  ];

  const currentTabData = tabs.find((t) => t.id === activeTab)!;
  const ActiveIcon = currentTabData.icon;

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto animate-fade-in">
      {/* Intro visual banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl text-center md:text-left flex flex-col md:flex-row items-center gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none"></div>
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <BrainCircuit className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Entenda a Fórmula de Persuasão AIDA</h3>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed max-w-xl">
            AIDA é a estrutura de copywriting de anúncio mais utilizada no mundo porque imita a jornada psicológica natural de tomada de decisão do cérebro humano. Explore as abas abaixo para dominar o método.
          </p>
        </div>
      </div>

      {/* Tabs list container */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tabs.map((t) => {
          const TabIcon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`p-3 rounded-xl border transition-all text-left flex flex-col gap-1.5 justify-between relative overflow-hidden ${
                isActive
                  ? "bg-slate-800 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500/20 shadow-md"
                  : "bg-slate-900/40 border-slate-850 text-slate-500 hover:border-slate-800 hover:text-slate-350"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <TabIcon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-650"}`} />
                <span className="text-[9px] font-mono font-bold uppercase text-slate-600">Fase {t.id}</span>
              </div>
              <span className={`text-[10px] font-bold tracking-tight mt-1 ${isActive ? "text-white" : "text-slate-400"}`}>
                {t.label.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive content card */}
      <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b ${currentTabData.bgGradient} pointer-events-none`}></div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5 relative z-10"
          >
            {/* Header tab detail */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${currentTabData.pillColor}`}>
                {currentTabData.label}
              </span>
              <span className="text-[10px] text-slate-450 font-medium">
                {currentTabData.subtitle}
              </span>
            </div>

            {/* Title and body */}
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <ActiveIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                {currentTabData.title}
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed mt-2.5">
                {currentTabData.description}
              </p>
            </div>

            {/* Directives list */}
            <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-4 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Regras de Ouro do Diretor de Criação:
              </span>
              <ul className="flex flex-col gap-1.5 pl-1">
                {currentTabData.rules.map((rule, index) => (
                  <li key={index} className="text-xs text-slate-350 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold font-mono mt-0.5">•</span>
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Real Copy Example preview */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Exemplo Persuasivo no E-book:
              </span>
              <p className="text-xs text-slate-200 font-medium italic leading-relaxed">
                {currentTabData.example}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation bottom row */}
        <div className="flex items-center justify-between border-t border-slate-850 pt-5 mt-6 relative z-10">
          <p className="text-[10px] text-slate-500 leading-none">
            Dica: Domine as 4 fases para que seus anúncios convertam mais gastando menos.
          </p>

          <button
            type="button"
            onClick={onNext}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/10 transition-all flex items-center gap-1.5 hover:scale-[1.01] active:scale-95 cursor-pointer"
          >
            <span>Gerar minha Copy com IA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
