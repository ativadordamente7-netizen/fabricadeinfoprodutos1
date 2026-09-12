import React, { useState, useEffect } from "react";
import { Sparkles, Shield, UserCheck, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

export type ExperienceLevel = "iniciante" | "intermediario" | "avancado";

export interface ExperienceConfig {
  id: ExperienceLevel;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  recommendations: string[];
}

export const ExperienceLevelsData: Record<ExperienceLevel, ExperienceConfig> = {
  iniciante: {
    id: "iniciante",
    title: "Nunca vendi",
    badge: "Modo Iniciante • Passo a Passo Descomplicado",
    tagline: "Foco total em validação rápida e criação do primeiro produto em 24h",
    description: "Linguagem simples e altamente didática sem termos técnicos complexos.",
    recommendations: [
      "Comece criando seu E-book na Fábrica de Infoprodutos (Etapa 1 a 3)",
      "Escolha uma dor urgente que você resolve sem promessas irrealistas",
      "Use os prompts prontos do Módulo 01 da Central de IA para gerar o conteúdo"
    ]
  },
  intermediario: {
    id: "intermediario",
    title: "Já vendi algumas vezes",
    badge: "Modo Intermediário • Otimização & Conversão",
    tagline: "Foco em aumentar taxa de conversão da página e criar esteira de upsell",
    description: "Linguagem focada em métricas de funil, CTR, CPC, CPA e ofertas complementares.",
    recommendations: [
      "Suba o ticket médio adicionando um Order Bump no checkout",
      "Gere 3 variações de criativos na Central de IA (Módulo 08)",
      "Analise seus gargalos na Central de Diagnóstico para baixar o CAC"
    ]
  },
  avancado: {
    id: "avancado",
    title: "Já tenho experiência",
    badge: "Modo Avançado • Escala Múltiplos 6 Dígitos",
    tagline: "Foco em escala de tráfego pago, diversificação de canais e automações",
    description: "Linguagem analítica e executiva voltada para ROI, LTV e contratação de IA.",
    recommendations: [
      "Escale o tráfego testando públicos abertos com criativos de alto engajamento",
      "Ative a esteira de upsell de 2 passos no Sócio Estratégico (Etapa 8)",
      "Utilize a Sala do CEO para consultorias anticrise de posicionamento de marca"
    ]
  }
};

interface Props {
  currentLevel: ExperienceLevel;
  onSelectLevel: (level: ExperienceLevel) => void;
  onClose?: () => void;
}

export default function NivelamentoExperienceModal({ currentLevel, onSelectLevel, onClose }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Nivelamento Inteligente
          </span>
          <h3 className="text-xl font-black text-white">Qual é o seu nível atual de experiência?</h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-xs px-3 py-1.5 rounded-lg bg-slate-800 cursor-pointer"
          >
            Sair
          </button>
        )}
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Selecione seu momento atual para que o Infinity Million OS adapte automaticamente a linguagem, explicações e recomendações prioritárias para seu perfil.
      </p>

      {/* OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(ExperienceLevelsData) as ExperienceLevel[]).map((levelKey) => {
          const config = ExperienceLevelsData[levelKey];
          const isSelected = currentLevel === levelKey;
          return (
            <div
              key={levelKey}
              onClick={() => onSelectLevel(levelKey)}
              className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-4 select-none ${
                isSelected
                  ? "bg-emerald-950/40 border-emerald-500 text-white ring-2 ring-emerald-500/20 shadow-xl"
                  : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono text-emerald-400 uppercase">
                    {config.title}
                  </span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </div>

                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {config.tagline}
                </p>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                  isSelected
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {isSelected ? "Nível Selecionado" : "Selecionar Perfil"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
