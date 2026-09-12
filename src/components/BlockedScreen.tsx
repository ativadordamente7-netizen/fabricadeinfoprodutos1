import React from "react";
import { ShieldAlert, LogOut, ArrowRight } from "lucide-react";

interface BlockedScreenProps {
  onLogout: () => void;
  email?: string;
}

export default function BlockedScreen({ onLogout, email }: BlockedScreenProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 antialiased selection:bg-rose-500 selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="w-full max-w-md bg-slate-900 border border-slate-850 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500" />
        
        <div className="mx-auto w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400 mb-6 animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
          Acesso Suspenso ou Inativo
        </h2>
        
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Seu acesso à Fábrica de Infoprodutos não está ativo no momento para o e-mail <strong className="text-slate-200">{email || "seu e-mail de compra"}</strong>. 
          Isso pode ocorrer se a compra foi reembolsada, cancelada ou contestada na Kiwify.
        </p>

        <div className="bg-slate-950/60 rounded-2xl border border-slate-850 p-4 text-left mb-6 text-xs text-slate-400 flex flex-col gap-2">
          <span className="font-bold text-rose-400 uppercase tracking-widest text-[10px]">O que fazer agora?</span>
          <p>1. Verifique se o e-mail acima é o mesmo utilizado para comprar o curso na Kiwify.</p>
          <p>2. Acesse sua conta na Kiwify para conferir o status do seu pagamento.</p>
          <p>3. Se você acredita que isso é um erro, entre em contato direto com o nosso suporte.</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onLogout}
            className="w-full bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sair da Conta</span>
          </button>
          
          <a
            href="https://kiwify.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-emerald-400 transition flex items-center justify-center gap-1 mt-2 group"
          >
            <span>Ir para o dashboard Kiwify</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
      
      <div className="mt-8 text-[11px] text-slate-600 font-mono">
        FÁBRICA DE INFOPRODUTOS • SISTEMA SEGURO ANTI-FRAUDE
      </div>
    </div>
  );
}
