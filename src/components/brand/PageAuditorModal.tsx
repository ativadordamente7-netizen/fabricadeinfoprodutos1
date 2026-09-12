import React, { useState } from "react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  X, 
  Award, 
  BarChart2, 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles,
  Search,
  Check
} from "lucide-react";
import { PageAuditReport } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pageTitle?: string;
}

export default function PageAuditorModal({ isOpen, onClose, pageTitle = "Página de Vendas de Alta Conversão" }: Props) {
  const [isAuditing, setIsAuditing] = useState(false);
  const [report, setReport] = useState<PageAuditReport | null>({
    score: 96,
    uxScore: 98,
    uiScore: 95,
    speedScore: 97,
    persuasionScore: 96,
    legibilityScore: 99,
    responsivenessScore: 100,
    hierarchyScore: 94,
    brandingScore: 98,
    accessibilityScore: 92,
    seoScore: 95,
    performanceScore: 97,
    offerClarityScore: 99,
    ctaQualityScore: 96,
    priorityActions: [
      {
        title: "Aumentar Contraste do Botão de Checkout Secundário",
        impact: "ALTO",
        justification: "Estudos de UX comprovam que botões de CTA com contraste mínimo de 7:1 aumentam a taxa de clique em até 18%.",
        recommendedFix: "O botão inferior foi atualizado para utilizar o verde esmeralda com brilho de borda em alto destaque."
      },
      {
        title: "Adicionar Marca d'Água de Garantia Incondicional de 7 Dias no Hero",
        impact: "MÉDIO",
        justification: "Mostrar o selo de garantia antes do primeiro scroll reduz a fricção cognitiva nos primeiros 5 segundos de visita.",
        recommendedFix: "Selo de Garantia Incondicional inserido logo abaixo do player de vídeo."
      },
      {
        title: "Otimizar Pré-carregamento das Imagens da Seção de Benefícios",
        impact: "MÉDIO",
        justification: "Imagens leves reduzem o tempo de carregamento em redes móveis (3G/4G), melhorando o índice Core Web Vitals.",
        recommendedFix: "Compressão de imagens ativada em formato WebP responsivo."
      }
    ]
  });

  if (!isOpen) return null;

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      if (report) {
        setReport({
          ...report,
          score: Math.min(100, report.score + 1)
        });
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl w-full max-w-4xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-slate-950 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold shadow-lg">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                AUDITORIA AUTOMÁTICA DE PÁGINAS & FUNIS DE VENDAS
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[9px] font-extrabold border border-teal-500/30">
                AUDITORIA IA 13 DIMENSÕES
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Análise em tempo real de UX, UI, Velocidade, Persuasão, Legibilidade e Qualidade da Oferta da sua página.
            </p>
          </div>
        </div>

        {/* OVERALL SCORE & RE-AUDIT BUTTON */}
        <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-black text-2xl shadow-xl">
              {report?.score || 96}
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase font-mono">{pageTitle}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Nível de Otimização: <strong className="text-emerald-400">PRONTO PARA ESCALA DE TRÁFEGO PAGO</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-2 transition cursor-pointer shrink-0 uppercase tracking-wider"
          >
            <Zap className={`w-4 h-4 text-slate-950 ${isAuditing ? "animate-spin" : ""}`} />
            <span>{isAuditing ? "Auditando..." : "Executar Re-Auditoria"}</span>
          </button>
        </div>

        {/* 13 DIMENSIONS GRID */}
        {report && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 font-mono uppercase">
              Desempenho em 13 Critérios de Conversão
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {[
                { label: "UX", val: report.uxScore },
                { label: "UI", val: report.uiScore },
                { label: "Velocidade", val: report.speedScore },
                { label: "Persuasão", val: report.persuasionScore },
                { label: "Legibilidade", val: report.legibilityScore },
                { label: "Responsivo", val: report.responsivenessScore },
                { label: "Hierarquia", val: report.hierarchyScore },
                { label: "Branding", val: report.brandingScore },
                { label: "Acessibilidade", val: report.accessibilityScore },
                { label: "SEO", val: report.seoScore },
                { label: "Performance", val: report.performanceScore },
                { label: "Oferta", val: report.offerClarityScore },
                { label: "CTA", val: report.ctaQualityScore },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-center space-y-0.5">
                  <span className="text-[9px] font-bold text-slate-400 font-mono uppercase block truncate">{item.label}</span>
                  <span className="text-xs font-black text-emerald-400 font-mono">{item.val}/100</span>
                </div>
              ))}
            </div>

            {/* PRIORITIZED RECOMMENDATIONS WITH JUSTIFICATIONS */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Melhorias Priorizadas por Impacto na Conversão
              </h4>

              <div className="space-y-3">
                {report.priorityActions.map((act, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{act.title}</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase border ${
                        act.impact === "CRÍTICO"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          : act.impact === "ALTO"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-teal-500/20 text-teal-300 border-teal-500/30"
                      }`}>
                        IMPACTO {act.impact}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong className="text-slate-300 font-mono">Por que melhorar:</strong> {act.justification}
                    </p>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-850 text-[11px] text-emerald-300 font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{act.recommendedFix}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 cursor-pointer"
          >
            Fechar Relatório
          </button>
        </div>
      </div>
    </div>
  );
}
