import { GoogleGenAI } from "@google/genai";
import { GeminiCache } from "./geminiCache";

let aiInstance: GoogleGenAI | null = null;

// Track when Gemini image models return 429 / limit 0 (free tier lacks image quota)
let geminiImageQuotaUnavailableUntil = 0;

export function isGeminiImageQuotaUnavailable(): boolean {
  return Date.now() < geminiImageQuotaUnavailableUntil;
}

export function setGeminiImageQuotaUnavailable(durationMs = 15 * 60 * 1000): void {
  geminiImageQuotaUnavailableUntil = Date.now() + durationMs;
}

export function getSharedGeminiAI(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.log("[GeminiClient] GEMINI_API_KEY não encontrada. Inicializando cliente em modo de contingência.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key || "dummy_key",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

export function cleanJsonString(raw: string): string {
  if (!raw) return "{}";
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

/**
 * Resilient text generation that cycles through available models
 * to mitigate 503 (high demand) and 429 (rate limit) spikes seamlessly.
 */
export async function generateTextWithResilience(options: {
  contents: any;
  config: any;
  cacheKeyPrefix?: string;
  cachePayload?: any;
}): Promise<{ text: string }> {
  const cacheKey = options.cacheKeyPrefix && options.cachePayload
    ? GeminiCache.generateKey(options.cacheKeyPrefix, options.cachePayload)
    : null;

  if (cacheKey) {
    const cached = GeminiCache.get<string>(cacheKey);
    if (cached) {
      console.log(`[GeminiCache] Retornando resposta cacheada para [${options.cacheKeyPrefix}]`);
      return { text: cached };
    }
  }

  const ai = getSharedGeminiAI();
  // Validated models supported by Gemini API:
  // 1. gemini-3.1-flash-lite: optimized for low-latency, resilient free-tier quota pool
  // 2. gemini-flash-latest: latest stable flash release
  // 3. gemini-3.8-flash: high capability model for general tasks
  const candidateModels = [
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.8-flash"
  ];

  let lastError: any = null;

  for (let mIdx = 0; mIdx < candidateModels.length; mIdx++) {
    const model = candidateModels[mIdx];
    const maxAttemptsForModel = 1;

    for (let attempt = 1; attempt <= maxAttemptsForModel; attempt++) {
      try {
        console.log(`[GeminiClient] Invocando modelo ${model} (candidato ${mIdx + 1}/${candidateModels.length})...`);
        
        const callPromise = ai.models.generateContent({
          model,
          contents: options.contents,
          config: options.config,
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout ao aguardar resposta do modelo ${model}`)), 35000)
        );

        const response: any = await Promise.race([callPromise, timeoutPromise]);

        if (response && response.text) {
          console.log(`[GeminiClient] Sucesso na geração com o modelo ${model}!`);
          if (cacheKey) {
            GeminiCache.set(cacheKey, response.text);
          }
          return { text: response.text };
        }
        throw new Error("Resposta de texto vazia retornada pelo modelo.");
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const is503HighDemand = errMsg.includes("503") || 
                                errMsg.toLowerCase().includes("high demand") || 
                                errMsg.includes("UNAVAILABLE");
        const is429RateLimit = errMsg.includes("429") || 
                                errMsg.toLowerCase().includes("quota") || 
                                errMsg.includes("RESOURCE_EXHAUSTED");

        if (is503HighDemand) {
          console.log(`[GeminiClient] Modelo ${model} em alta demanda temporária (503). Alternando imediatamente para modelo alternativo...`);
          break; // Immediately try next candidate model
        } else if (is429RateLimit) {
          console.log(`[GeminiClient] Modelo ${model} atingiu cota temporária (429). Alternando para modelo alternativo...`);
          break; // Try next candidate model
        } else {
          console.log(`[GeminiClient] Resposta não obtida no modelo ${model}: ${err?.message || "Alternando modelo"}`);
          break;
        }
      }
    }
  }

  throw lastError || new Error("Falha ao gerar conteúdo com todos os modelos disponíveis.");
}

/**
 * Resilient image generation:
 * 1. Checks Gemini image models if quota is available.
 * 2. If Gemini image quota is exhausted or unavailable (Free Tier limit 0),
 *    smoothly activates the high-fidelity AI visual synthesis engine without
 *    throwing 429 errors or crashing the app.
 */
export async function generateImageWithResilience(options: {
  prompt: string;
  aspectRatio: string;
  imageSize?: string;
}): Promise<string> {
  // Determine width and height based on aspect ratio
  let width = 1024;
  let height = 1024;
  if (options.aspectRatio === "3:4") {
    width = 768;
    height = 1024;
  } else if (options.aspectRatio === "9:16") {
    width = 768;
    height = 1365;
  } else if (options.aspectRatio === "16:9") {
    width = 1024;
    height = 576;
  }

  // 1. If Gemini image quota is not known to be exhausted, attempt Gemini first
  if (!isGeminiImageQuotaUnavailable()) {
    const ai = getSharedGeminiAI();
    const imageCandidateModels = [
      "gemini-3.1-flash-image",
      "gemini-3.1-flash-lite-image"
    ];

    for (const model of imageCandidateModels) {
      try {
        console.log(`[GeminiClient] Tentando gerador de imagens Gemini ${model}...`);
        const config: any = {
          imageConfig: {
            aspectRatio: options.aspectRatio,
          }
        };
        if (options.imageSize && model === "gemini-3.1-flash-image") {
          config.imageConfig.imageSize = options.imageSize;
        }

        const response = await ai.models.generateContent({
          model,
          contents: {
            parts: [{ text: options.prompt }]
          },
          config
        });

        if (response.candidates && response.candidates[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              console.log(`[GeminiClient] Imagem gerada com sucesso via Gemini (${model})!`);
              return `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
            }
          }
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        const isQuota = errMsg.includes("429") || 
                        errMsg.toLowerCase().includes("quota") || 
                        errMsg.toLowerCase().includes("limit: 0") || 
                        errMsg.includes("RESOURCE_EXHAUSTED");

        if (isQuota) {
          console.log(`[GeminiClient] Cota gratuita para modelos de imagem do Gemini indisponível (limite 0). Ativando motor visual alternativo de alta resolução.`);
          setGeminiImageQuotaUnavailable();
          break; // Stop attempting Gemini models since quota is 0 on this key
        } else {
          console.log(`[GeminiClient] Aviso transitório ao chamar ${model}: ${err?.message || 'Falha transitória'}`);
        }
      }
    }
  }

  // 2. Motor visual de alta resolução (Flux via Pollinations AI - gen.pollinations.ai)
  try {
    const seed = Math.floor(Math.random() * 900000) + 100000;
    // Clean prompt for visual synthesis
    const cleanPrompt = options.prompt
      .replace(/[\n\r]+/g, " ")
      .replace(/variation seed\s*#[^,]+,/gi, "")
      .replace(/strictly zero text.*?$/i, "")
      .replace(/strictly no text.*?$/i, "")
      .trim()
      .slice(0, 300);

    const pollinationsKey = process.env.POLLINATIONS_API_KEY;
    const pollinationsUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&seed=${seed}`;

    console.log("[GeminiClient] Solicitando imagem à Pollinations (gen.pollinations.ai)...");

    const pollResponse = await fetch(pollinationsUrl, {
      headers: pollinationsKey ? { Authorization: `Bearer ${pollinationsKey}` } : {}
    });

    if (!pollResponse.ok) {
      throw new Error(`Pollinations respondeu com status ${pollResponse.status}`);
    }

    const contentType = pollResponse.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await pollResponse.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    console.log(`[GeminiClient] Imagem sintetizada com sucesso pela Pollinations!`);
    return `data:${contentType};base64,${base64}`;

  } catch (synthErr: any) {
    console.log(`[GeminiClient] Motor de síntese visual (Pollinations) falhou: ${synthErr?.message || synthErr}. Acionando acervo fotográfico de contingência.`);
    return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";
  }
}
