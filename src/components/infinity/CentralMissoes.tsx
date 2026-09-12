import React, { useState } from "react";
import { Trophy, Award, CheckCircle2, Lock, Sparkles, Zap, ChevronRight, Star, Flame } from "lucide-react";

export interface MissionItem {
  id: number;
  title: string;
  xp: number;
  desc: string;
  badge: string;
  completed: boolean;
}

export default function CentralMissoes() {
  const [missions, setMissions] = useState<MissionItem[]>([
    { id: 1, title: "Missão 01 • Criar Produto", xp: 100, desc: "E-book ou infoproduto totalmente definido e gerado.", badge: "📦 Criador", completed: true },
    { id: 2, title: "Missão 02 • Publicar Página", xp: 100, desc: "Página de vendas no ar pronta para receber tráfego.", badge: "🌐 Publicador", completed: true },
    { id: 3, title: "Missão 03 • Criar Checkout", xp: 100, desc: "Link de pagamento e order bump integrados.", badge: "💳 Vendedor", completed: false },
    { id: 4, title: "Missão 04 • Criar Criativo", xp: 150, desc: "Anúncio visual ou vídeo gravado para atração.", badge: "🎨 Designer", completed: false },
    { id: 5, title: "Missão 05 • Primeiro Anúncio", xp: 200, desc: "Campanha ativa no Meta Ads ou Google Ads.", badge: "📢 Anunciante", completed: false },
    { id: 6, title: "Missão 06 • Primeiro Lead", xp: 300, desc: "Primeiro contato interessado capturado no funil.", badge: "🎯 Prospectador", completed: false },
    { id: 7, title: "Missão 07 • Primeiro Cliente", xp: 500, desc: "Primeira notificação de venda realizada com sucesso!", badge: "🏆 Conquistador", completed: false },
    { id: 8, title: "Missão 08 • Primeiros R$100", xp: 700, desc: "Primeira centena de reais faturada na plataforma.", badge: "💰 Monetizado", completed: false },
    { id: 9, title: "Missão 09 • Primeiros R$500", xp: 900, desc: "Escala inicial das primeiras dezenas de clientes.", badge: "🚀 Empreendedor", completed: false },
    { id: 10, title: "Missão 10 • Primeiros R$1.000", xp: 1200, desc: "Atingir a marca histórica de R$ 1.000 de lucro.", badge: "⭐ 1k Master", completed: false },
    { id: 11, title: "Missão 11 • Primeiros R$10.000", xp: 2000, desc: "Validação completa de escala do infoproduto.", badge: "👑 10k Pro", completed: false },
    { id: 12, title: "Missão 12 • Primeiros R$100.000", xp: 10000, desc: "Membro da elite dos 6 dígitos no mercado digital.", badge: "💎 100k Lenda", completed: false },
  ]);

  const toggleMission = (id: number) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  // Calculate Total XP and Level
  const totalXP = missions.filter((m) => m.completed).reduce((sum, m) => sum + m.xp, 0);
  const completedCount = missions.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / missions.length) * 100);

  // Level Logic
  let levelName = "Nível 01 • Explorador Digital";
  let nextLevelXP = 500;
  if (totalXP >= 500 && totalXP < 1500) {
    levelName = "Nível 02 • Vendedor Aprendiz";
    nextLevelXP = 1500;
  } else if (totalXP >= 1500 && totalXP < 3500) {
    levelName = "Nível 03 • Estrategista de Vendas";
    nextLevelXP = 3500;
  } else if (totalXP >= 3500 && totalXP < 7000) {
    levelName = "Nível 04 • Gestor de Escala";
    nextLevelXP = 7000;
  } else if (totalXP >= 7000) {
    levelName = "Nível 05 • CEO Million";
    nextLevelXP = 16250;
  }

  // Next Mission
  const nextMission = missions.find((m) => !m.completed) || missions[missions.length - 1];

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* GAMIFIED HERO HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                Jornada Gamificada • Infinity Million
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-display tracking-tight">
              CENTRAL DE MISSÕES
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl">
              Transforme seu aprendizado em conquistas reais. A cada missão concluída você ganha XP, sobe de nível e desbloqueia novos recursos do sistema.
            </p>
          </div>

          <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Flame className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-mono font-bold uppercase block">{levelName}</span>
              <span className="text-xl font-black text-white">{totalXP} XP</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Próximo Nível: {nextLevelXP} XP</span>
            </div>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-6 bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
            <span className="text-slate-400">PROGRESSO GERAL DE MISSÕES</span>
            <span className="text-amber-400">{completedCount} de {missions.length} Concluídas ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* NEXT CHALLENGE HIGHLIGHT */}
      {nextMission && (
        <div className="bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
              ⚡ Próximo Desafio Recomendado
            </span>
            <h4 className="text-base font-black text-white">{nextMission.title} (+{nextMission.xp} XP)</h4>
            <p className="text-xs text-slate-300">{nextMission.desc}</p>
          </div>

          <button
            type="button"
            onClick={() => toggleMission(nextMission.id)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition shrink-0 cursor-pointer"
          >
            Concluir Missão (+{nextMission.xp} XP)
          </button>
        </div>
      )}

      {/* MISSIONS GRID (01 TO 12) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {missions.map((m) => (
          <div
            key={m.id}
            onClick={() => toggleMission(m.id)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              m.completed
                ? "bg-slate-900/90 border-emerald-500/40 ring-1 ring-emerald-500/20"
                : "bg-slate-950/60 border-slate-850 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-400 text-[10px] font-mono font-extrabold border border-slate-800">
                +{m.xp} XP
              </span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                  m.completed ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-600"
                }`}
              >
                {m.completed ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : <Lock className="w-3.5 h-3.5" />}
              </div>
            </div>

            <div>
              <h4 className={`text-sm font-extrabold ${m.completed ? "text-emerald-300" : "text-white"}`}>
                {m.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{m.desc}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-850/60 text-[10px] font-mono">
              <span className="text-slate-500">Selo: {m.badge}</span>
              <span className={m.completed ? "text-emerald-400 font-bold" : "text-slate-600"}>
                {m.completed ? "✔ Desbloqueado" : "Pendente"}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
