import { AdImageResponse } from "../../server/adService";

interface CacheEntry {
  response: AdImageResponse;
  timestamp: number;
}

/**
 * CreativeImageGenerator
 * A local caching manager for digital ad creative images.
 * Avoids duplicate backend API hits, improves latency, and persists images and prompts.
 */
export class CreativeImageGenerator {
  private static MEMORY_CACHE = new Map<string, CacheEntry>();
  private static CACHE_PREFIX = "fabrica_creative_image_cache_";

  /**
   * Generates a unique key based on generation params
   */
  private static getCacheKey(params: {
    niche: string;
    description: string;
    productName: string;
    style: "commercial" | "premium" | "customCover";
    targetAudience: string;
    imageSize?: "1K" | "2K" | "4K";
  }): string {
    const serialized = JSON.stringify({
      n: params.niche.trim().toLowerCase(),
      d: params.description.trim().toLowerCase(),
      p: params.productName.trim().toLowerCase(),
      s: params.style,
      t: params.targetAudience.trim().toLowerCase(),
      z: params.imageSize || "1K"
    });
    
    // Simple hash of the serialized string
    let hash = 0;
    for (let i = 0; i < serialized.length; i++) {
      const char = serialized.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `${this.CACHE_PREFIX}${Math.abs(hash)}`;
  }

  /**
   * Retrieves an image from local memory or storage cache
   */
  public static getCachedImage(params: {
    niche: string;
    description: string;
    productName: string;
    style: "commercial" | "premium" | "customCover";
    targetAudience: string;
    imageSize?: "1K" | "2K" | "4K";
  }): AdImageResponse | null {
    const key = this.getCacheKey(params);

    // 1. Check in-memory cache first
    if (this.MEMORY_CACHE.has(key)) {
      return this.MEMORY_CACHE.get(key)!.response;
    }

    // 2. Check localStorage/sessionStorage
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const entry: CacheEntry = JSON.parse(stored);
        // Put in memory for next access
        this.MEMORY_CACHE.set(key, entry);
        return entry.response;
      }
    } catch (e) {
      // Ignore storage read error
    }

    return null;
  }

  /**
   * Saves an image response to local memory and storage cache
   */
  public static saveToCache(
    params: {
      niche: string;
      description: string;
      productName: string;
      style: "commercial" | "premium" | "customCover";
      targetAudience: string;
      imageSize?: "1K" | "2K" | "4K";
    },
    response: AdImageResponse
  ): void {
    const key = this.getCacheKey(params);
    const entry: CacheEntry = {
      response,
      timestamp: Date.now(),
    };

    // Store in memory
    this.MEMORY_CACHE.set(key, entry);

    // Store in localStorage
    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
      // Storage full or restricted
    }
  }

  /**
   * Generates or fetches from cache
   */
  public static async generate(
    params: {
      niche: string;
      description: string;
      productName: string;
      style: "commercial" | "premium" | "customCover";
      targetAudience: string;
      imageSize?: "1K" | "2K" | "4K";
    },
    sessionToken: string,
    forceRefresh = false
  ): Promise<AdImageResponse> {
    // If not forcing refresh, check cache
    if (!forceRefresh) {
      const cached = this.getCachedImage(params);
      if (cached) {
        return cached;
      }
    }

    console.log(`[CreativeImageGenerator] Cache Miss ou ForceRefresh. Chamando API de imagem para estilo: ${params.style}, tamanho: ${params.imageSize || "1K"}`);
    
    const res = await fetch("/api/ad/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-session-token": sessionToken,
      },
      body: JSON.stringify({ ...params, forceRefresh }),
    });

    if (!res.ok) {
      throw new Error("Falha ao gerar arte de fundo com a API.");
    }

    const imageResponse: AdImageResponse = await res.json();
    
    // Save to cache
    this.saveToCache(params, imageResponse);

    return imageResponse;
  }

  /**
   * Clears the image cache
   */
  public static clearCache(): void {
    this.MEMORY_CACHE.clear();
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      // Ignore
    }
  }
}
