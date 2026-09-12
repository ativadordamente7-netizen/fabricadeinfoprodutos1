import React, { useState, useEffect } from "react";
import { Download, Check, AlertTriangle, RefreshCw, FileImage, Loader2, FileText, CheckCircle2 } from "lucide-react";
import JSZip from "jszip";
import { AdImageResponse } from "../../server/adService";

interface AdKitDownloaderProps {
  productName: string;
  activeImage: AdImageResponse | null;
  overlayText: string;
  overlayStyle: "none" | "dark" | "gradient" | "light" | "colored";
  overlayOpacity: number;
  textColor: string;
  fontFamily: "Inter" | "Space Grotesk" | "Playfair Display" | "JetBrains Mono";
  textFontSize: number;
  textPlacement: "top" | "center" | "bottom";
  textAlignment: "left" | "center" | "right";
  activeCopy?: {
    attention: string;
    interest: string;
    desire: string;
    action: string;
    primaryText: string;
  } | null;
}

export default function AdKitDownloader({
  productName,
  activeImage,
  overlayText,
  overlayStyle,
  overlayOpacity,
  textColor,
  fontFamily,
  textFontSize,
  textPlacement,
  textAlignment,
  activeCopy
}: AdKitDownloaderProps) {
  const [validationState, setValidationState] = useState<"idle" | "validating" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validatedBlobs, setValidatedBlobs] = useState<{
    feedPortrait: Blob | null;
    stories: Blob | null;
  }>({
    feedPortrait: null,
    stories: null,
  });

  const [downloadingZip, setDownloadingZip] = useState(false);

  // Trigger auto-validation when the component mounts or active image changes
  useEffect(() => {
    if (activeImage) {
      runProportionValidation();
    } else {
      setValidationState("idle");
      setValidatedBlobs({ feedPortrait: null, stories: null });
    }
  }, [activeImage, overlayText, overlayStyle, overlayOpacity, textColor, fontFamily, textFontSize, textPlacement, textAlignment]);

  /**
   * Helper function to render the canvas on demand and check the aspect ratios
   */
  const renderFormatToBlob = (
    format: "feed_portrait" | "stories"
  ): Promise<{ blob: Blob; width: number; height: number; ratio: number }> => {
    return new Promise((resolve, reject) => {
      if (!activeImage) {
        reject(new Error("Nenhuma imagem ativa para renderização."));
        return;
      }

      let width = 1080;
      let height = 1350; // default for 4:5 (feed_portrait)
      if (format === "stories") {
        width = 1080;
        height = 1920; // 9:16
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Não foi possível inicializar o contexto de desenho 2D."));
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.referrerPolicy = "no-referrer";
      img.src = activeImage.imageUrl;

      img.onload = () => {
        try {
          // 1. Draw and scale background image
          const hRatio = canvas.width / img.width;
          const vRatio = canvas.height / img.height;
          const scale = Math.max(hRatio, vRatio);
          const shiftX = (canvas.width - img.width * scale) / 2;
          const shiftY = (canvas.height - img.height * scale) / 2;
          ctx.drawImage(img, 0, 0, img.width, img.height, shiftX, shiftY, img.width * scale, img.height * scale);

          // 2. Apply chosen overlay style
          if (overlayStyle === "dark") {
            ctx.fillStyle = `rgba(15, 23, 42, ${overlayOpacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else if (overlayStyle === "colored") {
            ctx.fillStyle = `rgba(6, 78, 59, ${overlayOpacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else if (overlayStyle === "gradient") {
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, "rgba(15, 23, 42, 0.1)");
            gradient.addColorStop(0.5, `rgba(15, 23, 42, ${overlayOpacity / 2})`);
            gradient.addColorStop(1, `rgba(15, 23, 42, ${overlayOpacity})`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else if (overlayStyle === "light") {
            ctx.fillStyle = `rgba(255, 255, 255, ${overlayOpacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          // 3. Draw high-contrast design frame
          ctx.strokeStyle = textColor;
          ctx.lineWidth = width * 0.015;
          ctx.strokeRect(width * 0.04, width * 0.04, canvas.width - width * 0.08, canvas.height - width * 0.08);

          // 4. Set font configurations
          let fontName = "sans-serif";
          if (fontFamily === "Space Grotesk") fontName = "'Space Grotesk', sans-serif";
          else if (fontFamily === "Playfair Display") fontName = "'Playfair Display', serif";
          else if (fontFamily === "JetBrains Mono") fontName = "'JetBrains Mono', monospace";
          else if (fontFamily === "Inter") fontName = "'Inter', sans-serif";

          const scaleFactor = canvas.width / 400;
          const fontSize = textFontSize * scaleFactor;
          ctx.font = `bold ${fontSize}px ${fontName}`;
          ctx.fillStyle = textColor;
          ctx.textAlign = textAlignment;

          // 5. Wrap text logic
          const words = overlayText.split(" ");
          const lines = [];
          let currentLine = words[0] || "";
          const maxWidth = canvas.width - (width * 0.2);

          for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const testWidth = ctx.measureText(currentLine + " " + word).width;
            if (testWidth < maxWidth) {
              currentLine += " " + word;
            } else {
              lines.push(currentLine);
              currentLine = word;
            }
          }
          if (currentLine) lines.push(currentLine);

          // 6. Draw lines based on alignment & placement
          const lineHeight = fontSize * 1.3;
          const totalHeight = lines.length * lineHeight;
          let startY = canvas.height / 2;

          if (textPlacement === "top") {
            startY = width * 0.15 + lineHeight;
          } else if (textPlacement === "bottom") {
            startY = canvas.height - (width * 0.15) - totalHeight + lineHeight;
          } else {
            startY = (canvas.height - totalHeight) / 2 + lineHeight;
          }

          let startX = canvas.width / 2;
          if (textAlignment === "left") startX = width * 0.12;
          else if (textAlignment === "right") startX = canvas.width - (width * 0.12);

          lines.forEach((line) => {
            ctx.fillText(line, startX, startY);
            startY += lineHeight;
          });

          // 7. Output blob and return resolution details
          canvas.toBlob((blob) => {
            if (blob) {
              resolve({
                blob,
                width,
                height,
                ratio: width / height
              });
            } else {
              reject(new Error(`Falha ao renderizar formato ${format} em Blob.`));
            }
          }, "image/png");

        } catch (e: any) {
          reject(new Error(`Erro de renderização gráfica: ${e.message || e}`));
        }
      };

      img.onerror = () => {
        // Handle CORS / connection failure gracefully with fallback drawing
        try {
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 20px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("Modo de Contingência Ativo", canvas.width / 2, canvas.height / 2);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve({ blob, width, height, ratio: width / height });
            } else {
              reject(new Error("Erro crítico no renderizador de fallback."));
            }
          }, "image/png");
        } catch (fallbackError: any) {
          reject(new Error(`Erro catastrófico no renderizador de segurança: ${fallbackError.message}`));
        }
      };
    });
  };

  /**
   * Run full validation loop for 4:5 and 9:16 aspect ratios
   */
  const runProportionValidation = async () => {
    setValidationState("validating");
    setErrorMessage(null);
    setValidatedBlobs({ feedPortrait: null, stories: null });

    // Artificial tiny delay for premium feeling loading state
    await new Promise((r) => setTimeout(r, 600));

    try {
      // 1. Validate Feed Portrait (4:5)
      const feedPortraitRes = await renderFormatToBlob("feed_portrait");
      // Check proportion exact match (1080 / 1350 === 0.8)
      const expectedFeedRatio = 1080 / 1350; // 0.8
      if (Math.abs(feedPortraitRes.ratio - expectedFeedRatio) > 0.001) {
        throw new Error(`Razão de aspecto incorreta para Feed Retrato. Esperado: 4:5 (0.80), Obtido: ${feedPortraitRes.ratio.toFixed(4)}`);
      }

      // 2. Validate Stories (9:16)
      const storiesRes = await renderFormatToBlob("stories");
      // Check proportion exact match (1080 / 1920 === 0.5625)
      const expectedStoriesRatio = 1080 / 1920; // 0.5625
      if (Math.abs(storiesRes.ratio - expectedStoriesRatio) > 0.001) {
        throw new Error(`Razão de aspecto incorreta para Stories. Esperado: 9:16 (0.5625), Obtido: ${storiesRes.ratio.toFixed(4)}`);
      }

      // Everything valid! Save blobs to allow direct downloads and ZIP generation
      setValidatedBlobs({
        feedPortrait: feedPortraitRes.blob,
        stories: storiesRes.blob,
      });
      setValidationState("success");

    } catch (err: any) {
      console.error("[AdKitDownloader] Erro na validação:", err);
      setErrorMessage(err.message || "Erro desconhecido na renderização das proporções do kit.");
      setValidationState("error");
      // Display alert block as requested in prompt instructions
      alert(`⚠️ Erro de Renderização Detectado!\nNão foi possível validar o kit de anúncios devido ao seguinte problema:\n\n${err.message || "Problema de renderização do canvas."}\n\nO download completo do kit permanecerá bloqueado por segurança.`);
    }
  };

  /**
   * Handle single direct download from verified blobs
   */
  const handleSingleDownload = (format: "feed_portrait" | "stories") => {
    const blob = format === "feed_portrait" ? validatedBlobs.feedPortrait : validatedBlobs.stories;
    if (!blob) {
      alert("Por favor, aguarde a validação bem-sucedida do design antes de fazer o download.");
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const nameSlug = productName.toLowerCase().replace(/\s+/g, "_");
    link.download = `criativo_${format === "feed_portrait" ? "4x5_retrato" : "9x16_stories"}_${nameSlug}.png`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Compile all assets (4:5 image, 9:16 image, copywriting text) into a single ZIP and download
   */
  const handleDownloadFullKitZip = async () => {
    if (!validatedBlobs.feedPortrait || !validatedBlobs.stories) {
      alert("⚠️ Não é possível compilar o kit: O teste de proporções e renderização falhou ou ainda está rodando.");
      return;
    }

    setDownloadingZip(true);
    try {
      const zip = new JSZip();
      const nameSlug = productName.toLowerCase().replace(/\s+/g, "_");

      // 1. Add 4:5 image
      zip.file(`01_criativo_feed_retrato_4x5_${nameSlug}.png`, validatedBlobs.feedPortrait);

      // 2. Add 9:16 image
      zip.file(`02_criativo_stories_reels_9x16_${nameSlug}.png`, validatedBlobs.stories);

      // 3. Add Copywriting text instructions if active copy is provided
      if (activeCopy) {
        const readmeContent = `===========================================================
KIT DE ANÚNCIOS DE ALTA CONVERSÃO - FABRICA DE INFO-PRODUTOS
===========================================================
Produto: ${productName}

Aqui está a sua copy de anúncios estruturada no modelo clássico AIDA (Atenção, Interesse, Desejo, Ação) para colar nos seus anúncios do Meta (Facebook/Instagram Ads).

-----------------------------------------------------------
1. TEXTO PRINCIPAL (COPY PARA COLAR NO ANÚNCIO)
-----------------------------------------------------------
${activeCopy.primaryText}

-----------------------------------------------------------
2. COPIES INDIVIDUAIS POR ETAPA DO FUNIL (AIDA)
-----------------------------------------------------------
[A] ATENÇÃO (Título Chamativo):
${activeCopy.attention}

[I] INTERESSE (Destaque do Problema):
${activeCopy.interest}

[D] DESEJO (Oferta / Transformação):
${activeCopy.desire}

[A] AÇÃO (Chamada para Ação / CTA):
${activeCopy.action}

-----------------------------------------------------------
3. ESPECIFICAÇÕES DOS ARQUIVOS INCLUSOS
-----------------------------------------------------------
* 01_criativo_feed_retrato_4x5_${nameSlug}.png: Proporção Retrato (1080x1350px). Ideal para posicionamento de Feed do Instagram, Feed do Facebook e aba Explorar. O formato 4:5 ocupa mais espaço vertical na tela do celular do usuário, aumentando em até 35% as taxas de clique (CTR).
* 02_criativo_stories_reels_9x16_${nameSlug}.png: Proporção Vertical (1080x1920px). Ideal para anúncios de Stories (Instagram/Facebook) e Reels.

Parabéns! Sua campanha está pronta para rodar com alta conversão e escala!
`;
        zip.file(`README_COPIES_ANUNCIO.txt`, readmeContent);
      }

      // Generate Zip blob
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.download = `KIT_ANUNCIOS_${nameSlug.toUpperCase()}_4x5_e_9x16.zip`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

    } catch (e: any) {
      console.error("[AdKitDownloader] Erro ao criar arquivo ZIP:", e);
      alert(`Ocorreu um erro ao compactar o kit de anúncios: ${e.message || e}`);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4 animate-fade-in" id="ad-kit-downloader-container">
      
      {/* Header and Badge status */}
      <div className="flex items-center justify-between border-b border-slate-850 pb-3" id="ad-kit-downloader-header">
        <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5 uppercase tracking-wider">
          <Download className="w-4 h-4 text-emerald-400" />
          Central de Downloads (AdKit Proportioned)
        </h4>
        <div className="flex items-center gap-1.5">
          {validationState === "validating" && (
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Validando...
            </span>
          )}
          {validationState === "success" && (
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Check className="w-3 h-3" />
              Verificado 4:5 & 9:16
            </span>
          )}
          {validationState === "error" && (
            <span className="text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Falha de Proporção
            </span>
          )}
        </div>
      </div>

      <p className="text-slate-450 text-xs leading-relaxed" id="ad-kit-downloader-desc">
        Antes de liberar o download do kit, nosso analisador renderiza cada criativo off-screen para atestar as resoluções de anúncios oficiais exigidas pelas redes sociais: <strong>Retrato (4:5)</strong> para Feed e <strong>Vertical (9:16)</strong> para Stories.
      </p>

      {/* Interactive Validation Step Panel */}
      <div className="bg-slate-950/60 border border-slate-850/80 rounded-xl p-4 flex flex-col gap-3" id="ad-kit-validation-panel">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status das Camadas de Renderização:</span>
          <button
            type="button"
            disabled={validationState === "validating"}
            onClick={runProportionValidation}
            className="text-[10px] text-slate-400 hover:text-emerald-400 transition flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            id="revalidate-button"
          >
            <RefreshCw className={`w-3 h-3 ${validationState === "validating" ? "animate-spin" : ""}`} />
            Revalidar Proporções
          </button>
        </div>

        {/* List of validated formats */}
        <div className="flex flex-col gap-2.5">
          {/* Format 4:5 */}
          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-900" id="validation-format-45">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px] flex items-center justify-center">
                4:5
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Feed Retrato (1080 x 1350px)</span>
                <span className="text-[9px] text-slate-500 block">Formato otimizado que ocupa mais espaço no feed</span>
              </div>
            </div>
            {validationState === "validating" && <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />}
            {validationState === "success" && <Check className="w-4 h-4 text-emerald-400 font-bold" />}
            {validationState === "error" && <AlertTriangle className="w-4 h-4 text-rose-500" />}
            {validationState === "idle" && <span className="text-[9px] font-bold text-slate-600">AGUARDANDO</span>}
          </div>

          {/* Format 9:16 */}
          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-900" id="validation-format-916">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px] flex items-center justify-center">
                9:16
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Stories / Reels (1080 x 1920px)</span>
                <span className="text-[9px] text-slate-500 block">Formato vertical nativo para mídias rápidas</span>
              </div>
            </div>
            {validationState === "validating" && <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />}
            {validationState === "success" && <Check className="w-4 h-4 text-emerald-400 font-bold" />}
            {validationState === "error" && <AlertTriangle className="w-4 h-4 text-rose-500" />}
            {validationState === "idle" && <span className="text-[9px] font-bold text-slate-600">AGUARDANDO</span>}
          </div>
        </div>

        {/* Error notification card */}
        {validationState === "error" && errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] p-3 rounded-lg flex items-start gap-2 animate-fade-in" id="validation-error-box">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Falha no Renderizador</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Success confirmation note */}
        {validationState === "success" && (
          <div className="bg-emerald-500/5 border border-emerald-500/10 text-emerald-300 text-[11px] p-3 rounded-lg flex items-start gap-2 animate-fade-in" id="validation-success-box">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Integridade do Kit Aprovada! 🎯</strong>
              <span>As proporções de pixel e escala estão 100% corretas para as campanhas do Facebook Ads. Download completo liberado.</span>
            </div>
          </div>
        )}
      </div>

      {/* Main downloads section */}
      <div className="flex flex-col gap-2.5" id="download-actions-section">
        {/* Full ZIP package compiled button */}
        <button
          type="button"
          disabled={validationState !== "success" || downloadingZip}
          onClick={handleDownloadFullKitZip}
          className={`p-4 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2.5 tracking-wider transition-all border shadow-lg ${
            validationState === "success"
              ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400/20 shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              : "bg-slate-950/40 border-slate-850 text-slate-500 opacity-60 cursor-not-allowed"
          }`}
          id="download-full-kit-zip-btn"
        >
          {downloadingZip ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Compactando Arquivos do Kit...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Baixar Kit de Criativos Completo (.ZIP) 🎁</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="download-individual-files-grid">
          {/* Download 4:5 Retrato */}
          <button
            type="button"
            disabled={validationState !== "success"}
            onClick={() => handleSingleDownload("feed_portrait")}
            className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
              validationState === "success"
                ? "bg-slate-950/80 border-slate-800 hover:bg-slate-950 text-white cursor-pointer"
                : "bg-slate-950/20 border-slate-900 text-slate-600 cursor-not-allowed"
            }`}
            id="download-individual-45-btn"
          >
            <div className="flex items-center gap-2">
              <FileImage className={`w-4 h-4 ${validationState === "success" ? "text-emerald-400" : "text-slate-700"}`} />
              <div>
                <span className="text-[11px] font-bold block">Criativo Retrato 4:5</span>
                <span className="text-[9px] text-slate-500 block">Apenas imagem 1080x1350px</span>
              </div>
            </div>
            <Download className={`w-3.5 h-3.5 ${validationState === "success" ? "text-slate-400" : "text-slate-750"}`} />
          </button>

          {/* Download 9:16 Stories */}
          <button
            type="button"
            disabled={validationState !== "success"}
            onClick={() => handleSingleDownload("stories")}
            className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
              validationState === "success"
                ? "bg-slate-950/80 border-slate-800 hover:bg-slate-950 text-white cursor-pointer"
                : "bg-slate-950/20 border-slate-900 text-slate-600 cursor-not-allowed"
            }`}
            id="download-individual-916-btn"
          >
            <div className="flex items-center gap-2">
              <FileImage className={`w-4 h-4 ${validationState === "success" ? "text-emerald-400" : "text-slate-700"}`} />
              <div>
                <span className="text-[11px] font-bold block">Criativo Stories 9:16</span>
                <span className="text-[9px] text-slate-500 block">Apenas imagem 1080x1920px</span>
              </div>
            </div>
            <Download className={`w-3.5 h-3.5 ${validationState === "success" ? "text-slate-400" : "text-slate-750"}`} />
          </button>
        </div>
      </div>

    </div>
  );
}
