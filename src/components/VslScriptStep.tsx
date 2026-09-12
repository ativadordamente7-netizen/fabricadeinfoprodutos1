import React, { useState, useEffect } from "react";
import { 
  Video, 
  Sparkles, 
  ArrowLeft, 
  RefreshCw, 
  Download, 
  Copy, 
  Check, 
  Play, 
  Pause, 
  Volume2, 
  Eye, 
  ExternalLink, 
  Sliders, 
  Lightbulb, 
  Mic, 
  FileText, 
  Film, 
  Clapperboard, 
  Zap, 
  AlertCircle,
  Clock,
  MessageSquare,
  Camera,
  Sun,
  Smartphone,
  Tv,
  Monitor,
  ArrowRight,
  GitFork
} from "lucide-react";
import { EbookData } from "../types";
import { VslData } from "../../server/vslService";

interface Props {
  ebook: EbookData;
  productName: string;
  niche: string;
  targetAudience: string;
  description: string;
  price?: string;
  sessionToken: string;
  systemInstruction?: string;
  onBackToAvatar: () => void;
  onNextToFunnel?: () => void;
}

export default function VslScriptStep({
  ebook,
  productName,
  niche,
  targetAudience,
  description,
  price = "R$ 47,00",
  sessionToken,
  systemInstruction,
  onBackToAvatar,
  onNextToFunnel
}: Props) {
  const [vsl, setVsl] = useState<VslData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"scenes" | "teleprompter" | "tools">("scenes");
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedSceneIdx, setCopiedSceneIdx] = useState<number | null>(null);

  // Video Format & Mobile Recording Settings
  const [videoFormat, setVideoFormat] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [selectedLighting, setSelectedLighting] = useState<"window" | "ringlight" | "three_point">("window");

  // Teleprompter state
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2); // 1, 2, 3, 4, 5
  const [fontSize, setFontSize] = useState<number>(20); // 16, 20, 24, 28, 32

  const fetchVsl = async (forceRefresh = false) => {
    setLoading(true);
    setError("");
    setLoadingStep("Analisando promessa e dores do E-book para a VSL...");

    try {
      await new Promise((r) => setTimeout(r, 500));
      setLoadingStep("Estruturando o gancho de 3 segundos e a narrativa persuasiva...");
      await new Promise((r) => setTimeout(r, 600));
      setLoadingStep("Gerando direções de cena, sugestões visuais e áudio...");

      const response = await fetch("/api/vsl/generate", {
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
          price: price || "R$ 47,00",
          chapters: ebook.chapters?.map(c => c.title) || [],
          forceRefresh,
          systemInstruction
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Falha ao gerar roteiro de VSL.");
      }

      const data: VslData = await response.json();
      setVsl(data);
    } catch (err: any) {
      console.error("[VslScriptStep] Erro ao buscar VSL:", err);
      setError(err.message || "Erro ao conectar à Inteligência Artificial.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!vsl && !loading) {
      fetchVsl(false);
    }
  }, []);

  // Teleprompter auto scroll effect
  useEffect(() => {
    let interval: any;
    if (isScrolling && activeTab === "teleprompter") {
      interval = setInterval(() => {
        const el = document.getElementById("teleprompter-container");
        if (el) {
          el.scrollTop += scrollSpeed;
          if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
            setIsScrolling(false);
          }
        }
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isScrolling, scrollSpeed, activeTab]);

  const handleCopyFullScript = () => {
    if (!vsl) return;
    const text = `
🎬 ROTEIRO DE VSL MAGNÉTICA (VÍDEO DE VENDAS)
Produto: ${ebook.title || productName}
Nicho: ${niche}
Duração Estimada: ${vsl.estimatedDuration} | Palavras: ${vsl.wordCount}
Tom Ideal: ${vsl.targetTone}

TITULO / GANCHO DE IMPACTO:
"${vsl.headline}"

==================================================
CENAS E ROTEIRO PASSO A PASSO
==================================================

${vsl.scenes.map(s => `
[CENA ${s.sceneNumber} - ${s.phase}]
🗣️ FALA EXATA:
"${s.spokenText}"

👁️ DIREÇÃO VISUAL NA TELA:
${s.visualDirections}

🎵 INSTRUÇÕES DE ÁUDIO E TOM:
${s.audioNotes}
--------------------------------------------------
`).join("\n")}

==================================================
TEXTO COMPLETO PARA TELEPROMPTER / IA (ELEVENLABS)
==================================================

${vsl.teleprompterText}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyScene = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSceneIdx(idx);
    setTimeout(() => setCopiedSceneIdx(null), 2000);
  };

  const handleDownloadPDF = () => {
    if (!vsl) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Roteiro VSL - ${ebook.title || productName}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
            h1 { color: #059669; font-size: 22px; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-bottom: 5px; }
            .subtitle { font-size: 13px; color: #64748b; margin-bottom: 20px; }
            .headline { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 8px; font-weight: bold; color: #065f46; font-size: 15px; margin-bottom: 20px; }
            .meta { display: flex; gap: 15px; background: #f8fafc; padding: 10px; border-radius: 6px; font-size: 12px; margin-bottom: 25px; }
            .scene-card { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin-bottom: 15px; }
            .scene-header { font-size: 13px; font-weight: bold; color: #059669; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px; }
            .spoken { font-size: 14px; font-weight: 500; color: #1e293b; background: #f8fafc; padding: 10px; border-radius: 6px; margin-bottom: 8px; font-style: italic; }
            .direction { font-size: 12px; color: #475569; margin-bottom: 4px; }
            .audio { font-size: 12px; color: #2563eb; }
            .teleprompter { background: #0f172a; color: #f8fafc; padding: 20px; border-radius: 8px; white-space: pre-wrap; font-size: 14px; line-height: 1.8; margin-top: 30px; }
            .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 11px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <h1>🎬 Roteiro de VSL (Vídeo de Vendas)</h1>
          <div class="subtitle">Infoproduto: <strong>${ebook.title || productName}</strong> | Nicho: ${niche}</div>

          <div class="headline">
            🎯 Hook de Abertura: "${vsl.headline}"
          </div>

          <div class="meta">
            <div><strong>Duração:</strong> ${vsl.estimatedDuration}</div>
            <div><strong>Palavras:</strong> ${vsl.wordCount}</div>
            <div><strong>Tom de Locução:</strong> ${vsl.targetTone}</div>
          </div>

          <h2>Cenas e Direção de Gravacão</h2>
          ${vsl.scenes.map(s => `
            <div class="scene-card">
              <div class="scene-header">Cena ${s.sceneNumber} • ${s.phase}</div>
              <div class="spoken">"${s.spokenText}"</div>
              <div class="direction">👁️ <strong>O que mostrar na tela:</strong> ${s.visualDirections}</div>
              <div class="audio">🎵 <strong>Instrução de Áudio/Tom:</strong> ${s.audioNotes}</div>
            </div>
          `).join("")}

          <h2>Texto para Teleprompter / Leitura Única</h2>
          <div class="teleprompter">${vsl.teleprompterText}</div>

          <div class="footer">Gerado pela Fábrica de Infoprodutos • VSL Studio IA</div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="w-full text-left space-y-6" id="vsl-script-step-container">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                <span>Etapa 6 de 6 • VSL Studio & Roteiro de Vídeo</span>
              </span>
              {vsl?.isFallback && (
                <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold rounded-full">
                  Roteiro de Contingência
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Roteiro de <span className="text-emerald-400">VSL Magnética</span> Pronto para Gravar
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Transforme a oferta do seu e-book <strong className="text-white">"{ebook.title || productName}"</strong> em um Vídeo de Vendas altamente persuasivo de 5 minutos, com falas, direções visuais e ferramentas de IA para narrar sem precisar aparecer!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onBackToAvatar}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Avatar</span>
            </button>

            <button
              type="button"
              onClick={() => fetchVsl(true)}
              disabled={loading}
              className="px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Criando VSL..." : "Regerar Roteiro VSL"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Configurações de Gravação (Formato de Vídeo & Iluminação para Celular) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Configurações de Gravação</h3>
              <p className="text-xs text-slate-400">Ajuste o formato do vídeo e veja orientações de iluminação para gravação com celular.</p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg self-start sm:self-auto">
            Formato Selecionado: <strong className="text-emerald-400">{videoFormat === "16:9" ? "16:9 Horizontal" : videoFormat === "9:16" ? "9:16 Vertical" : "1:1 Quadrado"}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Formato do Vídeo */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">
              1. Selecione o Formato de Vídeo
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setVideoFormat("16:9")}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                  videoFormat === "16:9"
                    ? "bg-emerald-500/10 border-emerald-500 text-white shadow-md"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Monitor className={`w-4 h-4 ${videoFormat === "16:9" ? "text-emerald-400" : "text-slate-400"}`} />
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">16:9</span>
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">Horizontal</span>
                  <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">Página de Vendas & YouTube</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVideoFormat("9:16")}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                  videoFormat === "9:16"
                    ? "bg-emerald-500/10 border-emerald-500 text-white shadow-md"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Smartphone className={`w-4 h-4 ${videoFormat === "9:16" ? "text-emerald-400" : "text-slate-400"}`} />
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">9:16</span>
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">Vertical</span>
                  <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">Reels, TikTok & Shorts</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVideoFormat("1:1")}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                  videoFormat === "1:1"
                    ? "bg-emerald-500/10 border-emerald-500 text-white shadow-md"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Tv className={`w-4 h-4 ${videoFormat === "1:1" ? "text-emerald-400" : "text-slate-400"}`} />
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">1:1</span>
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">Quadrado</span>
                  <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">Feed Instagram & Facebook</span>
                </div>
              </button>
            </div>
          </div>

          {/* Iluminação Básica para Celular */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">
              2. Iluminação & Setup para Celular
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedLighting("window")}
                className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                  selectedLighting === "window"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1 text-white">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Luz de Janela</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">De frente para janela aberta (sem luz direta do sol no rosto).</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedLighting("ringlight")}
                className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                  selectedLighting === "ringlight"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1 text-white">
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Ring Light / Abajur</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Posicione a luz a 45° levemente acima da linha dos olhos.</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedLighting("three_point")}
                className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                  selectedLighting === "three_point"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1 text-white">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2 Pontos de Luz</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Luz principal na frente e luz suave de preenchimento ao lado.</p>
              </button>
            </div>
          </div>
        </div>

        {/* Dicas Extras de Gravação com Celular */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start gap-2">
            <Camera className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-[11px]">Use a Câmera Traseira</strong>
              <span className="text-[10px] text-slate-400 leading-tight">A lente traseira do celular tem melhor sensor e nitidez. Limpe a lente antes!</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Mic className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-[11px]">Áudio sem Eco</strong>
              <span className="text-[10px] text-slate-400 leading-tight">Grave em cômodos com cortinas ou tapetes e use fone de ouvido com microfone.</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-[11px]">Altura dos Olhos</strong>
              <span className="text-[10px] text-slate-400 leading-tight">Apoie o celular em pilhas de livros ou tripé na linha do seu olhar.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Didactic Tutorial Banner */}
      <div className="bg-slate-950/80 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
            <Lightbulb className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-xs">Não quer gravar sua voz ou rosto? Veja o Método Sem Rosto (3 Passos):</h4>
            <p className="text-slate-400 text-[11px] leading-snug">
              1. Copie o texto no <strong>ElevenLabs</strong> para voz realista em IA → 2. Cole no <strong>CapCut</strong> com legendas pretas/amarelas → 3. Publique na sua página de vendas!
            </p>
          </div>
        </div>

        {vsl && (
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
            <button
              type="button"
              onClick={handleCopyFullScript}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-[11px] rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? "Copiado!" : "Copiar Roteiro"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] rounded-xl flex items-center gap-1.5 transition shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Roteiro em PDF</span>
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
            onClick={() => fetchVsl(true)}
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
            <Video className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Escrevendo Roteiro Persuasivo de VSL com IA...</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">{loadingStep}</p>
          </div>
          <div className="max-w-xs w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse w-3/4 rounded-full" />
          </div>
        </div>
      )}

      {/* MAIN CONTENT VSL DISPLAY */}
      {!loading && vsl && (
        <div className="space-y-6">

          {/* View Mode Selector Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab("scenes")}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer flex-1 sm:flex-initial justify-center ${
                  activeTab === "scenes"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Clapperboard className="w-4 h-4" />
                <span>1. Cenas e Roteiro Detalhado</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("teleprompter")}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer flex-1 sm:flex-initial justify-center ${
                  activeTab === "teleprompter"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>2. Modo Teleprompter (Gravação)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("tools")}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer flex-1 sm:flex-initial justify-center ${
                  activeTab === "tools"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>3. Ferramentas & IA Gratuitas</span>
              </button>
            </div>

            <div className="flex items-center gap-3 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <strong>{vsl.estimatedDuration}</strong>
              </span>
              <span>•</span>
              <span>{vsl.wordCount} palavras</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{vsl.targetTone}</span>
            </div>
          </div>

          {/* TAB 1: CENAS E ROTEIRO DETALHADO */}
          {activeTab === "scenes" && (
            <div className="space-y-5">
              
              {/* VSL Headline Box */}
              <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 rounded-3xl space-y-2 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    Gancho de Abertura do Vídeo (Primeiros 3 segundos)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyScene(vsl.headline, -1)}
                    className="text-[10px] text-slate-400 hover:text-emerald-400 underline font-bold flex items-center gap-1"
                  >
                    {copiedSceneIdx === -1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSceneIdx === -1 ? "Copiado!" : "Copiar Gancho"}</span>
                  </button>
                </div>
                <h3 className="text-lg md:text-xl font-black text-white leading-snug">
                  "{vsl.headline}"
                </h3>
              </div>

              {/* Scenes Cards */}
              <div className="space-y-4">
                {vsl.scenes.map((scene, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition rounded-3xl p-6 space-y-4">
                    
                    {/* Scene Top Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
                          #{scene.sceneNumber}
                        </span>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block">
                            {scene.phase}
                          </span>
                          <h4 className="text-sm font-bold text-white">Estrutura Narrativa Persuasiva</h4>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyScene(scene.spokenText, idx)}
                        className="self-start sm:self-auto text-[11px] font-bold text-slate-400 hover:text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedSceneIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSceneIdx === idx ? "Copiado!" : "Copiar Fala da Cena"}</span>
                      </button>
                    </div>

                    {/* Spoken Copy Box */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-black uppercase tracking-wider">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Fala Exata (Para Ler ou Enviar ao ElevenLabs)</span>
                      </div>
                      <p className="text-sm text-slate-100 font-medium leading-relaxed italic">
                        "{scene.spokenText}"
                      </p>
                    </div>

                    {/* Visual & Audio Directions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <Eye className="w-3 h-3 text-indigo-400" />
                          <span>Direção Visual (O que mostrar na tela)</span>
                        </span>
                        <p className="text-slate-300 text-xs leading-normal">
                          {scene.visualDirections}
                        </p>
                      </div>

                      <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-emerald-400" />
                          <span>Instrução de Áudio e Tom</span>
                        </span>
                        <p className="text-slate-300 text-xs leading-normal">
                          {scene.audioNotes}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: MODO TELEPROMPTER */}
          {activeTab === "teleprompter" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              
              {/* Controls Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsScrolling(!isScrolling)}
                    className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer ${
                      isScrolling
                        ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                        : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    }`}
                  >
                    {isScrolling ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isScrolling ? "Pausar Leitura" : "Iniciar Leitura Automática"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("teleprompter-container");
                      if (el) el.scrollTop = 0;
                      setIsScrolling(false);
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                  >
                    Reiniciar
                  </button>
                </div>

                {/* Speed & Font controls */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400">Velocidade:</span>
                    {[1, 2, 3, 4, 5].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setScrollSpeed(spd)}
                        className={`w-7 h-7 rounded-lg font-black text-xs transition ${
                          scrollSpeed === spd
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400">Tamanho da Fonte:</span>
                    <button
                      type="button"
                      onClick={() => setFontSize(Math.max(16, fontSize - 2))}
                      className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-white font-bold"
                    >
                      A-
                    </button>
                    <span className="font-mono text-emerald-400">{fontSize}px</span>
                    <button
                      type="button"
                      onClick={() => setFontSize(Math.min(36, fontSize + 2))}
                      className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-white font-bold"
                    >
                      A+
                    </button>
                  </div>
                </div>
              </div>

              {/* Teleprompter Display Box */}
              <div 
                id="teleprompter-container"
                className="bg-slate-950 border-2 border-emerald-500/30 rounded-3xl p-8 md:p-12 max-h-[500px] overflow-y-auto space-y-6 scroll-smooth shadow-inner relative"
              >
                <div className="sticky top-0 right-0 float-right px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-lg">
                  {isScrolling ? "Rolando..." : "Pronto para Leitura"}
                </div>

                <div 
                  className="text-white font-serif leading-relaxed text-left whitespace-pre-wrap transition-all"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {vsl.teleprompterText}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: FERRAMENTAS & IA GRATUITAS */}
          {activeTab === "tools" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Guia de Produção de Vídeo</span>
                <h3 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Ferramentas de IA Recomendadas para Fazer a VSL
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Não precisa de estúdio, câmeras caras ou mikrofone profissional. Use estas ferramentas gratuitas para criar sua VSL completa hoje mesmo!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vsl.recommendedTools.map((tool, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-[10px] rounded-md">
                          {tool.category}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-900 text-slate-300 font-bold text-[10px] rounded-md border border-slate-800">
                          {tool.badge}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-white flex items-center gap-2">
                        {tool.name}
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed mt-2">
                        {tool.description}
                      </p>
                    </div>

                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-xs rounded-xl transition cursor-pointer mt-3"
                    >
                      <span>Acessar {tool.name}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>

              {/* Step-by-step tutorial card */}
              <div className="bg-slate-950 border border-emerald-500/20 p-6 rounded-2xl space-y-4">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-emerald-400" />
                  Passo a Passo Didático para Montar o Vídeo em 10 Minutos
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center mb-2">
                      1
                    </span>
                    <h5 className="font-bold text-white">Gere o Áudio com IA</h5>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Acesse o ElevenLabs, escolha uma voz brasileira e cole a aba 'Modo Teleprompter'. Baixe o MP3.
                    </p>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center mb-2">
                      2
                    </span>
                    <h5 className="font-bold text-white">Adicione no CapCut</h5>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Abra o CapCut, importe o áudio MP3 e clique em 'Legendas Automáticas'. Ajuste a fonte para amarelo/branco.
                    </p>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center mb-2">
                      3
                    </span>
                    <h5 className="font-bold text-white">Insera na Página</h5>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Exporte o vídeo MP4 e faça o upload na sua Página de Vendas (Etapa 2) ou no YouTube/Vimeo.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Next Step Banner */}
          {onNextToFunnel && (
            <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 rounded-3xl text-center space-y-3 shadow-xl">
              <Sparkles className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-base font-black text-white">
                🎉 Roteiro VSL Pronto! Próximo Passo: Estruturar Seus Funis de Vendas
              </h4>
              <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                Com o vídeo pronto, entenda como aplicar o <strong className="text-white">Tráfego Direto</strong> e o <strong className="text-white">Funil de WhatsApp</strong> com roteiros prontos de atendimento!
              </p>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={onNextToFunnel}
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <GitFork className="w-4 h-4" />
                  <span>Ir para Etapa 7: Estratégia de Funis de Vendas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
