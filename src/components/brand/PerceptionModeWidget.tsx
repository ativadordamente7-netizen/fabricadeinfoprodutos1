import React, { useState } from "react";
import { Eye, Sparkles, Check, Flame, Shield, Award, Heart, Zap, Target } from "lucide-react";
import { PerceptionTrigger } from "../../types";

interface Props {
  currentPerception: PerceptionTrigger;
  onPerceptionChange: (p: PerceptionTrigger) => void;
}

export default function PerceptionModeWidget({ currentPerception, onPerceptionChange }: Props) {
  const triggers: { id: PerceptionTrigger; icon: string; desc: string; colors: string; headlineStyle: string }[] = [
    { id: "Luxo", icon: "💎", desc: "Aumenta o valor percebido, eleva o ticket e transmite exclusividade inalcançável.", colors: "Preto, Ouro Rosé e Dourado 24K", headlineStyle: "Tipografia de Alta Costura com Margens Amplas" },
    { id: "Autoridade", icon: "👑", desc: "Posiciona sua marca como líder absoluta com dados e provas irrefutáveis.", colors: "Azul Marinho, Slate e Esmeralda", headlineStyle: "Headlines Diretas e Afirmações Categóricas" },
    { id: "Confiança", icon: "🛡️", desc: "Reduz o medo do cliente, reforça garantias e segurança no checkout.", colors: "Azul Petróleo e Verde Menta", headlineStyle: "Garantia em Destaque com Selos e Depoimentos Realistas" },
    { id: "Curiosidade", icon: "🔮", desc: "Cria ganchos visuais enigmáticos para maximizar a taxa de clique (CTR).", colors: "Roxo Cyber e Amarelo Neon", headlineStyle: "Perguntas Provocativas e Revelações Ocultas" },
    { id: "Segurança", icon: "🔒", desc: "Transmite estabilidade e proteção completa do investimento do comprador.", colors: "Verde Escuro e Branco Off-white", headlineStyle: "Clareza nos Termos, Suporte Ativo e Sem Entrelinhas" },
    { id: "Transformação", icon: "🚀", desc: "Foca no estado futuro desejado e no alívio imediato do problema.", colors: "Gradiente Esmeralda para Cyan", headlineStyle: "Antes vs Depois Irresistível com Depoimentos" },
    { id: "Exclusividade", icon: "✨", desc: "Cria a sensação de um clube privado com vagas estritamente limitadas.", colors: "Preto Absoluto e Dourado", headlineStyle: "Apenas para Aprovados / Vagas sob Seleção" },
    { id: "Clareza", icon: "💡", desc: "Elimina qualquer ruído cognitivo para decisão de compra rápida e simples.", colors: "Branco Neutro e Grafite", headlineStyle: "Lista em Bullets Curto e Passo a Passo 1-2-3" },
    { id: "Urgência", icon: "⏳", desc: "Dispara o gatilho da escassez e da perda iminente com cronômetros visuais.", colors: "Vermelho Escuro e Laranja Vivo", headlineStyle: "Oferta Encerra Hoje com Desconto Exclusivo" },
    { id: "Esperança", icon: "🌱", desc: "Restaura a crença na conquista do objetivo mesmo após várias tentativas.", colors: "Verde Claro e Dourado Suave", headlineStyle: "O Novo Caminho Descomplicado e Acolhedor" }
  ];

  const active = triggers.find((t) => t.id === currentPerception) || triggers[0];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl space-y-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                MODO PERCEPÇÃO • DIREÇÃO PSICOLÓGICA DA OFERTA
              </h3>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold uppercase border border-amber-500/30">
                GATILHO ATIVO: {currentPerception}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Selecione o sentimento primário que você deseja causar nos visitantes. A IA adaptará cores, headlines e hierarquia.
            </p>
          </div>
        </div>
      </div>

      {/* SELECTOR BUTTONS */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
        {triggers.map((t) => {
          const isSelected = t.id === currentPerception;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onPerceptionChange(t.id)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/30"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.id}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE TRIGGER CARDS & INSTRUCTION */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-400 font-mono uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Efeito em Cadeia do Modo Percepção "{active.id}":
          </span>
          <span className="text-[10px] font-mono text-slate-500">Auto-Injeção em Copy, Imagem e Layout</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{active.desc}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-850">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Adaptador de Paleta & Visual:</span>
            <span className="font-bold text-teal-300">{active.colors}</span>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-850">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Direção de Headline & Copy:</span>
            <span className="font-bold text-amber-300">{active.headlineStyle}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
