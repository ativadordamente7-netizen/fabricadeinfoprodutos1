import fs from "fs";
import path from "path";
import crypto from "crypto";

const CACHE_FILE = path.join(process.cwd(), "gemini_cache.json");

export class GeminiCache {
  private static cacheData: Record<string, { value: any; timestamp: number }> = {};
  private static isLoaded = false;

  private static ensureLoaded() {
    if (this.isLoaded) return;
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const fileContent = fs.readFileSync(CACHE_FILE, "utf-8");
        this.cacheData = JSON.parse(fileContent);
        console.log(`[GeminiCache] Carregados ${Object.keys(this.cacheData).length} itens de cache do disco.`);
      } else {
        this.cacheData = {};
      }
    } catch (e) {
      console.error("[GeminiCache] Erro ao carregar cache do disco:", e);
      this.cacheData = {};
    }
    this.isLoaded = true;
  }

  private static save() {
    try {
      const tempFile = `${CACHE_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.cacheData, null, 2), "utf-8");
      fs.renameSync(tempFile, CACHE_FILE);
    } catch (e) {
      console.error("[GeminiCache] Erro ao persistir cache no disco:", e);
    }
  }

  /**
   * Generates a stable hash key for any input payload or prompt
   */
  public static generateKey(namespace: string, payload: any): string {
    const serialized = typeof payload === "string" ? payload : JSON.stringify(payload);
    const hash = crypto.createHash("sha256").update(serialized).digest("hex");
    return `${namespace}:${hash}`;
  }

  /**
   * Gets a cached item if exists
   */
  public static get<T>(key: string): T | null {
    this.ensureLoaded();
    const item = this.cacheData[key];
    if (item) {
      console.log(`[GeminiCache] Cache HIT para chave: ${key.split(":")[0]}...`);
      return item.value as T;
    }
    return null;
  }

  /**
   * Stores an item in the cache and persists to disk
   */
  public static set(key: string, value: any): void {
    this.ensureLoaded();
    this.cacheData[key] = {
      value,
      timestamp: Date.now()
    };
    this.save();
    console.log(`[GeminiCache] Item salvo e persistido no cache para chave: ${key.split(":")[0]}...`);
  }

  /**
   * Clears all cache entries
   */
  public static clear(): void {
    this.cacheData = {};
    this.save();
    console.log("[GeminiCache] Cache limpo com sucesso.");
  }
}
