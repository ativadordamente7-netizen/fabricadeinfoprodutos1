import React, { useState, useEffect } from "react";
import { 
  UserCheck, 
  Sparkles, 
  ArrowLeft, 
  RefreshCw, 
  Download, 
  Copy, 
  Check, 
  Target, 
  ShieldAlert, 
  Heart, 
  MessageSquare, 
  Zap, 
  Compass, 
  Lightbulb, 
  HelpCircle,
  Briefcase,
  MapPin,
  GraduationCap,
  DollarSign,
  AlertCircle,
  FileText,
  Video,
  ArrowRight
} from "lucide-react";
import { EbookData } from "../types";
import { AvatarData } from "../../server/avatarService";

interface Props {
  ebook: EbookData;
  productName: string;
  niche: string;
  targetAudience: string;
  description: string;
  sessionToken: string;
  systemInstruction?: string;
  onBackToAds: () => void;
  onNextToVsl?: () => void;
}

export default function IdealAvatarStep({
  ebook,
  productName,
  niche,
  targetAudience,
  description,
  sessionToken,
  systemInstruction,
  onBackToAds,
  onNextToVsl
}: Props) {
  const [avatar, setAvatar] = useState<AvatarData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchAvatar = async (forceRefresh = false) => {
    setLoading(true);
    setError("");
    setLoadingStep("Lendo o conteúdo do seu E-book e estrutura de capítulos...");

    try {
      await new Promise((r) => setTimeout(r, 600));
      setLoadingStep("Mapeando os comportamentos e psicologia do comprador ideal...");
      await new Promise((r) => setTimeout(r, 700));
      setLoadingStep("Construindo objeções, gatilhos mentais e script de abordagem...");

      const response = await fetch("/api/avatar/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken
        },
        body: JSON.stringify({
          productName: ebook.title || productName || "E-book Digital",
          niche: niche || "Geral",
          description: description || ebook.synopsis || "E-book completo",
          targetAudience: targetAudience || "Público Comprador",
          chapters: ebook.chapters?.map(c => c.title) || [],
          forceRefresh,
          systemInstruction
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Falha ao mapear o Avatar Ideal.");
      }

      const data: AvatarData = await response.json();
      setAvatar(data);
    } catch (err: any) {
      console.error("[IdealAvatarStep] Erro ao buscar avatar:", err);
      setError(err.message || "Erro ao conectar à Inteligência Artificial.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-fetch avatar if not present
    if (!avatar && !loading) {
      fetchAvatar(false);
    }
  }, []);

  const handleCopyText = () => {
    if (!avatar) return;
    const text = `
🎯 FICHA COMPLETA DO AVATAR IDEAL (BUYER PERSONA)
Produto: ${ebook.title || productName}
Nicho: ${niche}

1. DADOS DEMOGRÁFICOS:
- Nome: ${avatar.demographics.name} (${avatar.demographics.age} anos)
- Gênero: ${avatar.demographics.gender}
- Profissão: ${avatar.demographics.occupation}
- Renda: ${avatar.demographics.income}
- Estado Civil: ${avatar.demographics.maritalStatus}
- Localização: ${avatar.demographics.location}
- Frase Marcante: "${avatar.demographics.avatarQuote}"

2. DORES & FRUSTRAÇÕES:
- O que tira o sono de madrugada: ${avatar.painsAndFrustrations.nighttimeWorry}
- Maior Frustração Diária: ${avatar.painsAndFrustrations.mainFrustration}
- Tentativas Frustradas do Passado:
${avatar.painsAndFrustrations.pastFailedAttempts.map(a => `  • ${a}`).join("\n")}
- Medo Secreto: ${avatar.painsAndFrustrations.secretFear}

3. DESEJOS & METAS:
- Resultado dos Sonhos: ${avatar.desiresAndGoals.dreamResult}
- Status Desejado: ${avatar.desiresAndGoals.statusGoal}
- Nova Rotina com o E-book: ${avatar.desiresAndGoals.dailyRoutineAfterEbook}

4. OBJEÇÕES & RESPOSTAS DE VENDA:
${avatar.buyingObjections.map(b => `  • Objeção: "${b.objection}"\n    Resposta: "${b.salesResponse}"`).join("\n\n")}

5. GATILHOS E CANAIS DE ANÚNCIO:
- Canais Preferidos: ${avatar.marketingChannelsAndTriggers.favoritePlatforms.join(", ")}
- Gatilhos que Compram: ${avatar.marketingChannelsAndTriggers.buyingTriggers.join(", ")}
- Tom de Voz: ${avatar.marketingChannelsAndTriggers.toneOfVoice}
- Palavras-Chave de Engajamento: ${avatar.marketingChannelsAndTriggers.keywordsThatHook.join(", ")}

6. SCRIPT DIRETO / WHATSAPP:
- Abordagem Direct: ${avatar.directPitchScript.whatsappHook}
- Headline da Página de Vendas: ${avatar.directPitchScript.salesPageHeadline}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPDF = () => {
    if (!avatar) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Avatar Ideal - ${ebook.title || productName}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
            h1 { color: #059669; font-size: 24px; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-bottom: 5px; }
            h2 { font-size: 16px; color: #1e293b; margin-top: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
            .subtitle { font-size: 13px; color: #64748b; margin-bottom: 25px; }
            .quote { background: #f0fdf4; border-left: 4px solid #10b981; padding: 12px; font-style: italic; margin: 15px 0; font-size: 14px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 13px; }
            .card strong { color: #0f172a; }
            ul { margin: 5px 0 10px 20px; padding: 0; font-size: 13px; }
            li { margin-bottom: 4px; }
            .footer { margin-top: 40px; border-t: 1px solid #cbd5e1; pt: 10px; font-size: 11px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <h1>🎯 Ficha do Avatar Ideal</h1>
          <div class="subtitle">Infoproduto: <strong>${ebook.title || productName}</strong> | Nicho: ${niche}</div>

          <div class="quote">"${avatar.demographics.avatarQuote}"</div>

          <h2>1. Dados Demográficos</h2>
          <div class="grid">
            <div class="card"><strong>Nome:</strong> ${avatar.demographics.name}</div>
            <div class="card"><strong>Idade:</strong> ${avatar.demographics.age} anos</div>
            <div class="card"><strong>Gênero:</strong> ${avatar.demographics.gender}</div>
            <div class="card"><strong>Profissão:</strong> ${avatar.demographics.occupation}</div>
            <div class="card"><strong>Renda Mensal:</strong> ${avatar.demographics.income}</div>
            <div class="card"><strong>Estado Civil:</strong> ${avatar.demographics.maritalStatus}</div>
            <div class="card"><strong>Escolaridade:</strong> ${avatar.demographics.education}</div>
            <div class="card"><strong>Localização:</strong> ${avatar.demographics.location}</div>
          </div>

          <h2>2. Dores Profundas & Frustrações</h2>
          <div class="card" style="margin-bottom: 10px;">
            <strong>O que tira o sono às 2h da manhã:</strong> ${avatar.painsAndFrustrations.nighttimeWorry}
          </div>
          <div class="card" style="margin-bottom: 10px;">
            <strong>Maior Frustração Diária:</strong> ${avatar.painsAndFrustrations.mainFrustration}
          </div>
          <div class="card" style="margin-bottom: 10px;">
            <strong>Tentativas Anteriores Frustradas:</strong>
            <ul>
              ${avatar.painsAndFrustrations.pastFailedAttempts.map(a => `<li>${a}</li>`).join("")}
            </ul>
          </div>
          <div class="card">
            <strong>Medo Secreto:</strong> ${avatar.painsAndFrustrations.secretFear}
          </div>

          <h2>3. Desejos & Transformação Esperada</h2>
          <div class="card" style="margin-bottom: 10px;">
            <strong>Resultado dos Sonhos:</strong> ${avatar.desiresAndGoals.dreamResult}
          </div>
          <div class="card" style="margin-bottom: 10px;">
            <strong>Status / Reconhecimento:</strong> ${avatar.desiresAndGoals.statusGoal}
          </div>
          <div class="card">
            <strong>Nova Rotina Pós-Leitura do E-book:</strong> ${avatar.desiresAndGoals.dailyRoutineAfterEbook}
          </div>

          <h2>4. Quebra de Objeções de Venda</h2>
          ${avatar.buyingObjections.map(b => `
            <div class="card" style="margin-bottom: 8px;">
              <strong style="color: #dc2626;">Objeção:</strong> "${b.objection}"<br/>
              <strong style="color: #059669;">Resposta Matadora:</strong> "${b.salesResponse}"
            </div>
          `).join("")}

          <h2>5. Gatilhos & Canais de Venda</h2>
          <div class="grid">
            <div class="card"><strong>Onde Encontrar:</strong> ${avatar.marketingChannelsAndTriggers.favoritePlatforms.join(", ")}</div>
            <div class="card"><strong>Gatilhos Mentais:</strong> ${avatar.marketingChannelsAndTriggers.buyingTriggers.join(", ")}</div>
            <div class="card"><strong>Tom de Comunicação:</strong> ${avatar.marketingChannelsAndTriggers.toneOfVoice}</div>
            <div class="card"><strong>Palavras que Pescam Atenção:</strong> ${avatar.marketingChannelsAndTriggers.keywordsThatHook.join(", ")}</div>
          </div>

          <h2>6. Scripts Prontos de Venda</h2>
          <div class="card" style="margin-bottom: 10px;">
            <strong>Headline do Anúncio / Página:</strong><br/>
            "${avatar.directPitchScript.salesPageHeadline}"
          </div>
          <div class="card">
            <strong>Script de Abordagem Direta (Direct / WhatsApp):</strong><br/>
            "${avatar.directPitchScript.whatsappHook}"
          </div>

          <div class="footer">Gerado pela Fábrica de Infoprodutos com Inteligência Artificial</div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="w-full text-left space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Etapa 5 de 5 • Mapeamento de Cliente Perfeito</span>
              </span>
              {avatar?.isFallback && (
                <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold rounded-full">
                  Ficha de Contingência
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Descubra o Seu <span className="text-emerald-400">Avatar Ideal</span> (Buyer Persona)
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Descubra quem é a pessoa exata pronta para comprar o seu e-book <strong className="text-white">"{ebook.title || productName}"</strong>. Aprenda suas dores, medos e desejos para vender com facilidade!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onBackToAds}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar aos Anúncios</span>
            </button>

            <button
              type="button"
              onClick={() => fetchAvatar(true)}
              disabled={loading}
              className="px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Mapeando..." : "Regerar Avatar com IA"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Didactic Step Bar Explanation */}
      <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
            <Lightbulb className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-xs">Por que mapear o Avatar Ideal aumenta suas vendas em 3x?</h4>
            <p className="text-slate-400 text-[11px] leading-snug">
              Anúncios genéricos que tentam falar com "todo mundo" não vendem. Quando você usa as palavras exatas e ataca a dor real do seu avatar, a conversão dispara!
            </p>
          </div>
        </div>

        {avatar && (
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-[11px] rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? "Copiado!" : "Copiar Ficha"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] rounded-xl flex items-center gap-1.5 transition shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Ficha em PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button 
            type="button" 
            onClick={() => fetchAvatar(true)}
            className="underline font-bold text-rose-300 hover:text-white"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[350px]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
            <UserCheck className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Analisando Mente do Comprador com IA...</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">{loadingStep}</p>
          </div>
          <div className="max-w-xs w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse w-3/4 rounded-full" />
          </div>
        </div>
      )}

      {/* MAIN CONTENT DIDACTIC STEP-BY-STEP AVATAR DISPLAY */}
      {!loading && avatar && (
        <div className="space-y-6">

          {/* Interactive Step Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { id: 1, name: "1. Perfil", icon: UserCheck, desc: "Demografia e frases" },
              { id: 2, name: "2. Dores", icon: ShieldAlert, desc: "Medos e angústias" },
              { id: 3, name: "3. Desejos", icon: Heart, desc: "Sonhos e status" },
              { id: 4, name: "4. Objeções", icon: HelpCircle, desc: "Quebra de dúvidas" },
              { id: 5, name: "5. Gatilhos", icon: Zap, desc: "Canais e palavras" },
              { id: 6, name: "6. Script", icon: MessageSquare, desc: "Direct & WhatsApp" }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isActive
                      ? "bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${isActive ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-500"}`}>
                      Passo {tab.id}
                    </span>
                  </div>
                  <div>
                    <div className={`text-xs font-bold leading-tight ${isActive ? "text-emerald-400" : "text-slate-300"}`}>
                      {tab.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{tab.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* TAB 1: PERFIL DEMOGRÁFICO */}
          {activeTab === 1 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Passo 1 do Mapeamento</span>
                  <h3 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                    Perfil Demográfico e Identidade do Avatar
                  </h3>
                </div>
                <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-700">
                  {avatar.demographics.age} anos • {avatar.demographics.gender}
                </span>
              </div>

              {/* Quote Card */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border-l-4 border-emerald-500 p-5 rounded-2xl shadow-inner">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">
                  Frase Marcante do Avatar (Sua Dor em Palavras)
                </span>
                <p className="text-base font-serif italic text-emerald-100 leading-relaxed">
                  "{avatar.demographics.avatarQuote}"
                </p>
                <div className="text-xs text-slate-400 mt-2 font-bold">
                  — {avatar.demographics.name}, {avatar.demographics.occupation}
                </div>
              </div>

              {/* Grid of Demographics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-semibold">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nome Fictício Ideal</span>
                  </div>
                  <div className="text-sm font-black text-white">{avatar.demographics.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{avatar.demographics.age} anos • {avatar.demographics.gender}</div>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-semibold">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Profissão / Ocupação</span>
                  </div>
                  <div className="text-sm font-black text-white truncate">{avatar.demographics.occupation}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Atuação profissional ativa</div>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-semibold">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Renda Mensal Estimada</span>
                  </div>
                  <div className="text-sm font-black text-emerald-400">{avatar.demographics.income}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Poder de compra verificado</div>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-semibold">
                    <Heart className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Estado Civil & Família</span>
                  </div>
                  <div className="text-sm font-black text-white truncate">{avatar.demographics.maritalStatus}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Estrutura familiar</div>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Localização no Brasil</span>
                  </div>
                  <div className="text-xs font-bold text-slate-200">{avatar.demographics.location}</div>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl col-span-1 sm:col-span-2">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-semibold">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Escolaridade e Nível de Informação</span>
                  </div>
                  <div className="text-xs font-bold text-slate-200">{avatar.demographics.education}</div>
                </div>
              </div>

              {/* Action to Next Tab */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab(2)}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Avançar para Passo 2: Dores & Frustrações</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DORES & FRUSTRAÇÕES */}
          {activeTab === 2 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Passo 2 do Mapeamento</span>
                <h3 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  Dores Profundas, Medos e Tentativas Frustradas
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  💡 <strong>Análise de Conversão:</strong> As pessoas não compram e-books por causa de sumários longos; elas compram para parar de sentir dor!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Nighttime Worry */}
                <div className="bg-slate-950 border border-rose-500/20 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>O Pensamento das 2h da Manhã</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    "{avatar.painsAndFrustrations.nighttimeWorry}"
                  </p>
                </div>

                {/* Secret Fear */}
                <div className="bg-slate-950 border border-amber-500/20 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Medo Secreto (Vergonha Inconfessável)</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    "{avatar.painsAndFrustrations.secretFear}"
                  </p>
                </div>

              </div>

              {/* Main Frustration & Past Attempts */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">
                    Maior Frustração Diária no Mercado
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {avatar.painsAndFrustrations.mainFrustration}
                  </p>
                </div>

                <div className="border-t border-slate-800/80 pt-3">
                  <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider mb-2">
                    Tentativas Anteriores Que Falharam (O que ele já tentou antes)
                  </h4>
                  <div className="space-y-2">
                    {avatar.painsAndFrustrations.pastFailedAttempts.map((attempt, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          ✕
                        </span>
                        <span>{attempt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab(1)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  ← Passo Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(3)}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Avançar para Passo 3: Desejos & Transformação</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: DESEJOS & METAS */}
          {activeTab === 3 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Passo 3 do Mapeamento</span>
                <h3 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                  <Heart className="w-5 h-5 text-emerald-400" />
                  Desejos Profundos, Status e Visão de Futuro
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                <div className="bg-slate-950 border border-emerald-500/20 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
                    <Target className="w-4 h-4 shrink-0" />
                    <span>Resultado dos Sonhos</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {avatar.desiresAndGoals.dreamResult}
                  </p>
                </div>

                <div className="bg-slate-950 border border-indigo-500/20 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider">
                    <Compass className="w-4 h-4 shrink-0" />
                    <span>Status / Reconhecimento Social</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {avatar.desiresAndGoals.statusGoal}
                  </p>
                </div>

                <div className="bg-slate-950 border border-teal-500/20 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Nova Rotina com o E-book</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {avatar.desiresAndGoals.dailyRoutineAfterEbook}
                  </p>
                </div>

              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab(2)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  ← Passo Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(4)}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Avançar para Passo 4: Quebra de Objeções</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: OBJEÇÕES & RESPOSTAS */}
          {activeTab === 4 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Passo 4 do Mapeamento</span>
                <h3 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  Objeções de Compra e Respostas de Fechamento
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  💡 Use estas respostas na sua FAQ de Vendas, no suporte do Direct ou no rodapé da sua Página de Vendas.
                </p>
              </div>

              <div className="space-y-4">
                {avatar.buyingObjections.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold text-[10px] rounded-lg shrink-0">
                        Dúvida #{idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-rose-300">
                        "{item.objection}"
                      </h4>
                    </div>

                    <div className="bg-slate-900/80 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3">
                      <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block mb-0.5">
                          Resposta Matadora para Quebrar a Objeção
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium">
                          "{item.salesResponse}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab(3)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  ← Passo Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(5)}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Avançar para Passo 5: Gatilhos & Canais</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: GATILHOS & CANAIS */}
          {activeTab === 5 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Passo 5 do Mapeamento</span>
                <h3 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  Gatilhos Mentais, Canais de Atenção e Palavras Chave
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Favorite Platforms */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    Redes e Canais Onde Ele Passa Tempo
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {avatar.marketingChannelsAndTriggers.favoritePlatforms.map((plat, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold rounded-xl">
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Buying Triggers */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Gatilhos que Fazem Ele Comprar
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {avatar.marketingChannelsAndTriggers.buyingTriggers.map((trig, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold rounded-xl">
                        ⚡ {trig}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Tone of Voice & Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    Tom de Voz Ideal para Vender
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {avatar.marketingChannelsAndTriggers.toneOfVoice}
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <h4 className="text-xs font-black text-teal-400 uppercase tracking-wider">
                    Palavras-Chave de Alto Engajamento
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {avatar.marketingChannelsAndTriggers.keywordsThatHook.map((kw, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab(4)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  ← Passo Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(6)}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Avançar para Passo 6: Script Direct & Vendas</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: SCRIPT DIRETO & HEADLINE */}
          {activeTab === 6 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Passo 6 do Mapeamento</span>
                <h3 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  Script Prático de Abordagem Direct & Headline
                </h3>
              </div>

              <div className="space-y-5">
                
                {/* Headline Box */}
                <div className="bg-slate-950 border border-emerald-500/30 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      Headline Perfeita da Página de Vendas
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(avatar.directPitchScript.salesPageHeadline);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-[10px] text-slate-400 hover:text-emerald-400 underline font-bold flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </button>
                  </div>
                  <p className="text-sm font-black text-white leading-snug">
                    "{avatar.directPitchScript.salesPageHeadline}"
                  </p>
                </div>

                {/* WhatsApp Direct Pitch Box */}
                <div className="bg-slate-950 border border-indigo-500/30 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Script de Abordagem Direct / WhatsApp
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(avatar.directPitchScript.whatsappHook);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-[10px] text-slate-400 hover:text-indigo-400 underline font-bold flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copiar Script</span>
                    </button>
                  </div>
                  <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono">
                    "{avatar.directPitchScript.whatsappHook}"
                  </div>
                </div>

              </div>

              {/* Completion Box */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-950 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-3">
                <Sparkles className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-black text-white">
                  🎉 Ficha do Avatar Concluída! Pronto para Criar a Sua VSL?
                </h4>
                <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                  Agora você tem o perfil do comprador ideal. Que tal criar um Roteiro de Vídeo de Vendas (VSL) pronto para gravar com teleprompter e IA?
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {onNextToVsl && (
                    <button
                      type="button"
                      onClick={onNextToVsl}
                      className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>Ir para Etapa 6: Gerar Roteiro de VSL</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Avatar em PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={onBackToAds}
                    className="px-4 py-3 bg-slate-900 text-slate-400 hover:text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Voltar aos Anúncios
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
