import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  BookOpen, 
  Megaphone, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Check, 
  Palette, 
  Zap, 
  Globe 
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setCurrentStep: (step: number) => void;
}

export default function WelcomeTour({ isOpen, onClose, setCurrentStep }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: "Boas-vindas à Fábrica de Infoprodutos! 🚀",
      subtitle: "Sua plataforma completa alimentada por Inteligência Artificial para criar, estruturar, estilizar e publicar infoprodutos altamente lucrativos.",
      icon: Sparkles,
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Em menos de 5 minutos, você será capaz de transformar uma simples ideia em um **e-book profissional completo** e uma **página de vendas otimizada para alta conversão**, prontos para ir ao ar na internet!
          </p>
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-900/60 border border-slate-850 p-3 rounded-xl text-center">
              <BookOpen className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
              <span className="text-[10px] font-bold block text-white">1. Criar E-book</span>
              <span className="text-[8px] text-slate-500 block mt-0.5">Conteúdo e Capa 3D</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-850 p-3 rounded-xl text-center">
              <Megaphone className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
              <span className="text-[10px] font-bold block text-white">2. Página Ativa</span>
              <span className="text-[8px] text-slate-500 block mt-0.5">Copy e Vídeo VSL</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-850 p-3 rounded-xl text-center">
              <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
              <span className="text-[10px] font-bold block text-white">3. Publicação</span>
              <span className="text-[8px] text-slate-500 block mt-0.5">Hospedar e Vender</span>
            </div>
          </div>
        </div>
      ),
      actionText: "Iniciar Tour Guiado",
      stepTarget: 1
    },
    {
      title: "Pilar 1: Criação de E-book de Alta Qualidade 📚",
      subtitle: "Defina sua ideia, selecione o público-alvo e deixe a IA formular e redigir toda a estrutura do seu livro digital em segundos.",
      icon: BookOpen,
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      content: (
        <div className="space-y-3.5">
          <div className="space-y-2.5">
            <div className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                <strong className="text-white">Formulário Dirigido:</strong> Escolha entre ideias prontas (Treino, Finanças, IA) ou digite seu nicho, público e promessa para orientar a geração.
              </p>
            </div>
            <div className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                <Palette className="w-3 h-3" />
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                <strong className="text-white">Design de Capa 3D Ativo:</strong> Customize a capa do seu e-book usando inteligência artificial ou cores dinâmicas. O resultado é renderizado em um lindo mockup 3D que flutua na tela!
              </p>
            </div>
            <div className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                <Zap className="w-3 h-3" />
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                <strong className="text-white">Editor Interno de Capítulos:</strong> Edite o texto, modifique os tópicos e refine o conteúdo diretamente para garantir que o material esteja 100% perfeito.
              </p>
            </div>
          </div>
        </div>
      ),
      actionText: "Entendi, ir para Próximo",
      stepTarget: 1
    },
    {
      title: "Pilar 2: Editor de Página de Vendas Persuasiva 📣",
      subtitle: "Gere copys baseadas em frameworks consagrados de copywriting e monte sua landing page com feed visual imediato.",
      icon: Megaphone,
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      content: (
        <div className="space-y-3.5">
          <div className="space-y-2.5">
            <div className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                <strong className="text-white">Headline e Gatilhos:</strong> A IA analisa o seu e-book e cria promessas, dores de público, listas de benefícios práticos e quebras de objeções.
              </p>
            </div>
            <div className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                <Palette className="w-3 h-3" />
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                <strong className="text-white">Estrutura de Vídeo VSL:</strong> Ative um script de apresentação ou vídeo (YouTube, Vimeo, Panda) com opções de posicionamento dinâmico.
              </p>
            </div>
            <div className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                <Zap className="w-3 h-3" />
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                <strong className="text-white">Configurações de Checkout:</strong> Modifique preços, de R$ 97 por R$ 27, por exemplo, configure links de checkout (Kiwify, Hotmart) e suporte via WhatsApp de forma super intuitiva.
              </p>
            </div>
          </div>
        </div>
      ),
      actionText: "Ir para Último Passo",
      stepTarget: 2
    },
    {
      title: "Pilar 3: Publicação Rápida & Vendas On-line 🌐",
      subtitle: "Tudo pronto! É hora de exportar seu material e hospedar seu site de vendas no ar gratuitamente em menos de 10 segundos.",
      icon: CheckCircle2,
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      content: (
        <div className="space-y-3.5">
          <div className="space-y-2.5">
            <div className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                <strong className="text-white">Checklist de Lançamento:</strong> Um checklist interativo verifica se o seu produto está pronto para ser lançado e faturar.
              </p>
            </div>
            <div className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                <Palette className="w-3 h-3" />
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                <strong className="text-white">Exportação ZIP Completa:</strong> Baixe o arquivo compacto contendo todo o código limpo, imagens e estilos integrados em um arquivo único autônomo.
              </p>
            </div>
            <div className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                <Globe className="w-3 h-3" />
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                <strong className="text-white">Hospedagem Netlify Drop:</strong> Arraste o arquivo exportado para o Netlify Drop e tenha um site com domínio HTTPS seguro ativo em segundos sem custo de hospedagem.
              </p>
            </div>
          </div>
        </div>
      ),
      actionText: "Concluir e Começar! 🚀",
      stepTarget: 3
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      // Auto transition the step selector behind the scenes to guide user visually!
      setCurrentStep(slides[nextSlide].stepTarget);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      setCurrentStep(slides[prevSlide].stepTarget);
    }
  };

  const handleClose = () => {
    // Reset to step 1 upon closing the tour so they can start fresh from step 1
    setCurrentStep(1);
    onClose();
  };

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col my-auto relative"
      >
        
        {/* Glow ambient effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row of Tour */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-800/80 relative z-10">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${slides[currentSlide].iconColor}`}>
              <CurrentIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">Tour de Boas-vindas</span>
              <span className="text-[9px] text-slate-500 font-medium font-mono">Passo {currentSlide + 1} de {slides.length}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-500 hover:text-white bg-slate-950/40 hover:bg-slate-850 p-1.5 rounded-lg transition"
            title="Pular Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content Pane */}
        <div className="p-6 md:p-8 flex-1 min-h-[220px] flex flex-col justify-center relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <h2 className="text-base md:text-lg font-black text-white tracking-tight leading-tight">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed font-medium">
                  {slides[currentSlide].subtitle}
                </p>
              </div>

              <hr className="border-slate-800/50" />

              <div>
                {slides[currentSlide].content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation Row */}
        <div className="bg-slate-950/50 p-5 border-t border-slate-800/80 flex items-center justify-between gap-4 relative z-10">
          
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <span 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-5 bg-emerald-400" : "w-1.5 bg-slate-800"}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            {currentSlide > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-extrabold shadow-lg shadow-emerald-500/10 transition flex items-center gap-1.5"
            >
              <span>{slides[currentSlide].actionText}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
