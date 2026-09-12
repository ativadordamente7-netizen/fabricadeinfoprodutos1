import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Megaphone, CheckCircle2, ChevronRight, HelpCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAdCreative } from "../hooks/useAdCreative";
import { SalesPageData, EbookData } from "../types";
import OfferSummary from "./OfferSummary";
import AidaExplanation from "./AidaExplanation";
import AidaCopyGenerator from "./AidaCopyGenerator";
import CreativeComposer from "./CreativeComposer";
import VisualStyleLibrary, { VisualDnaStyle } from "./infinity/VisualStyleLibrary";

interface Props {
  salesPage: SalesPageData;
  ebook: EbookData;
  sessionToken: string;
  onBack: () => void;
  onNextToAvatar?: () => void;
  // Let's pass the default offer settings from the parent if available
  productName?: string;
  niche?: string;
  targetAudience?: string;
  description?: string;
  systemInstruction?: string;
  initialSubStep?: number;
  activeVisualDna?: any;
}

export default function AdCreativeStep({
  salesPage,
  ebook,
  sessionToken,
  onBack,
  onNextToAvatar,
  productName = "",
  niche = "",
  targetAudience = "",
  description = "",
  systemInstruction,
  initialSubStep = 1,
  activeVisualDna
}: Props) {
  // Use hook to manage the full campaign workflow state
  const {
    state,
    loadingCopies,
    loadingImage,
    error,
    updateState,
    generateCopies,
    generateImage,
    generateAll3Images,
    getActiveCopy,
    getActiveImage,
    updateActiveCopyPart
  } = useAdCreative("project", sessionToken, {
    productName: productName || ebook.title || "Infoproduto Sem Nome",
    niche: niche || "Geral",
    targetAudience: targetAudience || "Público Geral interessado em desenvolvimento",
    tone: "Persuasivo e Emocional",
    description: description || ebook.synopsis || "Um guia transformador focado em resultados.",
    coverImage: ebook.cover?.imageUrl || ebook.coverImage,
    initialSubStep,
    systemInstruction
  });

  const [showDnaModal, setShowDnaModal] = useState<boolean>(false);
  const [appliedDnaName, setAppliedDnaName] = useState<string>("");
  const [showCompletionSuccess, setShowCompletionSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (activeVisualDna) {
      setAppliedDnaName(activeVisualDna.name);
      handleApplyDnaStyle(activeVisualDna);
      return;
    }
    const savedRaw = localStorage.getItem("fabrica_selected_visual_dna");
    if (savedRaw) {
      try {
        const parsed = JSON.parse(savedRaw);
        if (parsed?.name) {
          setAppliedDnaName(parsed.name);
        }
      } catch (e) {
        // ignore
      }
    }
  }, [activeVisualDna]);

  // If initialSubStep changes from outside (e.g. from DNA Visual "Aplicar nos Criativos")
  useEffect(() => {
    if (initialSubStep && initialSubStep !== state.currentSubStep) {
      updateState({ currentSubStep: initialSubStep });
    }
  }, [initialSubStep]);

  const handleApplyDnaStyle = (style: VisualDnaStyle) => {
    setAppliedDnaName(style.name);
    // Map font family to supported fonts
    let matchedFont: "Inter" | "Space Grotesk" | "Playfair Display" | "JetBrains Mono" = "Inter";
    if (style.typography.headingFont === "Playfair Display" || style.typography.headingFont === "Cinzel") {
      matchedFont = "Playfair Display";
    } else if (style.typography.headingFont === "Space Grotesk") {
      matchedFont = "Space Grotesk";
    } else if (style.typography.headingFont === "JetBrains Mono") {
      matchedFont = "JetBrains Mono";
    }

    updateState({
      fontFamily: matchedFont,
      textColor: style.colors.text
    });
    setShowDnaModal(false);
  };

  const subSteps = [
    { num: 1, label: "Sua Oferta", desc: "Ajuste os pilares principais" },
    { num: 2, label: "Fórmula AIDA", desc: "Psicologia de Conversão" },
    { num: 3, label: "Copies de Anúncio", desc: "Criação de textos de conversão" },
    { num: 4, label: "Criativos de Imagem", desc: "Geração de artes e diagrama" }
  ];

  const handleNextSubStep = () => {
    if (state.currentSubStep < 4) {
      updateState({ currentSubStep: state.currentSubStep + 1 });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevSubStep = () => {
    if (state.currentSubStep > 1) {
      updateState({ currentSubStep: state.currentSubStep - 1 });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinishWholeCampaign = () => {
    updateState({ isCompleted: true });
    setShowCompletionSuccess(true);
  };

  return (
    <div id="ad-creative-container" className="w-full flex flex-col gap-6">
      
      {/* INTERNAL WIZARD NAV BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Navigation Info */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={state.currentSubStep === 1 ? onBack : handlePrevSubStep}
            className="w-8 h-8 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white flex items-center justify-center transition hover:border-slate-750 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5 leading-none">
              <Megaphone className="w-4 h-4 text-emerald-400" />
              Criador de Anúncios com IA
            </h4>
            <p className="text-[10px] text-slate-500 font-medium mt-1 leading-none">
              Acompanhamento de campanha • Passo {state.currentSubStep} de 4
            </p>
          </div>
        </div>

        {/* Wizard Progression Bubbles & DNA Visual Trigger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowDnaModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            title="Escolher DNA Visual (Gourmet, Dark Money, etc.)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{appliedDnaName ? `DNA: ${appliedDnaName}` : "🎨 DNA Visual"}</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            {subSteps.map((s) => {
              const isActive = state.currentSubStep === s.num;
              const isPassed = state.currentSubStep > s.num;
              return (
                <div key={s.num} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => updateState({ currentSubStep: s.num })}
                    disabled={s.num > 2 && state.copies.length === 0}
                    className={`w-7 h-7 rounded-full text-xs font-bold font-mono flex items-center justify-center border transition-all ${
                      isActive
                        ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-md shadow-emerald-500/10 scale-105"
                        : isPassed
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-slate-950/20 text-slate-650 border-slate-850 cursor-not-allowed"
                    }`}
                    title={`${s.label}: ${s.desc}`}
                  >
                    {s.num}
                  </button>
                  {s.num < 4 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-750 mx-0.5 sm:mx-1 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contingency Offline/Fallback alert banner */}
      {(state.copies.some(c => c.isFallback) || state.images.commercial?.isFallback || state.images.premium?.isFallback) && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-2xl p-4 flex gap-3 items-start animate-fade-in"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm">
            <strong className="text-white block mb-0.5">Modo de Contingência de Anúncios Ativo ⚡</strong>
            <span>
              Devido à alta demanda ou limitações temporárias de quota na API do Gemini, nossa inteligência local ativou o gerador de contingência para as suas copies e criativos de imagem. Você pode usar, editar e diagramar seus anúncios de alta conversão normalmente!
            </span>
          </div>
        </motion.div>
      )}

      {/* CORE ACTIVE PANEL VIEW */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentSubStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {state.currentSubStep === 1 && (
              <OfferSummary
                productName={state.productName}
                niche={state.niche}
                targetAudience={state.targetAudience}
                tone={state.tone}
                description={state.description}
                onUpdate={(data) => updateState(data)}
                onNext={handleNextSubStep}
              />
            )}

            {state.currentSubStep === 2 && (
              <AidaExplanation onNext={handleNextSubStep} />
            )}

            {state.currentSubStep === 3 && (
              <AidaCopyGenerator
                copies={state.copies}
                selectedType={state.selectedCopyType}
                editedCopies={state.editedCopies}
                loading={loadingCopies}
                error={error}
                onSelectType={(type) => updateState({ selectedCopyType: type })}
                onGenerate={generateCopies}
                onUpdatePart={updateActiveCopyPart}
                onNext={handleNextSubStep}
              />
            )}

            {state.currentSubStep === 4 && (
              <CreativeComposer
                productName={state.productName}
                niche={state.niche}
                targetAudience={state.targetAudience}
                description={state.description}
                activeCopy={getActiveCopy()}
                images={state.images}
                selectedImageType={state.selectedImageType}
                loadingImage={loadingImage}
                onGenerateImage={generateImage}
                onGenerateAllImages={generateAll3Images}
                onSelectImageType={(style) => updateState({ selectedImageType: style })}
                fontFamily={state.fontFamily}
                textColor={state.textColor}
                overlayStyle={state.overlayStyle}
                overlayOpacity={state.overlayOpacity}
                textAlignment={state.textAlignment}
                textPlacement={state.textPlacement}
                showLogoBadge={state.showLogoBadge}
                textFontSize={state.textFontSize}
                onUpdateStyle={(styles) => updateState(styles)}
                onUpdateCopyPart={updateActiveCopyPart}
                onFinishCampaign={handleFinishWholeCampaign}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next Step Banner: Avatar Ideal */}
      {onNextToAvatar && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl mt-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-0.5">
              Próxima Etapa do Infoproduto
            </span>
            <h4 className="text-sm font-black text-white">
              Pronto com os anúncios? Agora descubra o seu Avatar Ideal (Buyer Persona)!
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Mapeie dores profundas, objeções de venda e script de abordagem direta para converter o leitor em comprador de alto valor.
            </p>
          </div>

          <button
            type="button"
            onClick={onNextToAvatar}
            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Ir para Etapa 5: Avatar Ideal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MODAL: BIBLIOTECA DE DNA VISUAL (GOURMET, DARK MONEY, ETC.) */}
      {showDnaModal && (
        <VisualStyleLibrary
          mode="modal"
          isOpen={showDnaModal}
          onClose={() => setShowDnaModal(false)}
          onApplyToCreatives={handleApplyDnaStyle}
        />
      )}

      {/* MODAL: SUCESSO DE CONCLUSÃO DA CAMPANHA */}
      {showCompletionSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/50 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl shadow-lg">
              🚀
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider">
                Campanha Modelada com Sucesso!
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Seu kit de criativos, artes de alta conversão e textos AIDA estão prontos para anúncios no Meta Ads e Google!
              </p>
            </div>
            <div className="w-full flex flex-col sm:flex-row gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => setShowCompletionSuccess(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Continuar Editando
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCompletionSuccess(false);
                  onBack();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition"
              >
                Voltar ao Painel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
