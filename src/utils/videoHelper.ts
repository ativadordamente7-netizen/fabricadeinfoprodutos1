// Utility helper for VSL video platform detection, URL translation, and sanitization

export function sanitizeEmbedCode(rawHTML: string): { src: string; isValid: boolean; error?: string } {
  if (!rawHTML) return { src: "", isValid: false, error: "Código de incorporação vazio." };

  // Remove any <script> tags or other dangerous tags to be safe
  if (/<script/i.test(rawHTML)) {
    return { src: "", isValid: false, error: "Por segurança, códigos JavaScript (<script>) não são permitidos. Cole apenas o código iframe puro." };
  }

  // Extract the src attribute of an iframe
  const iframeSrcMatch = rawHTML.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (iframeSrcMatch && iframeSrcMatch[1]) {
    const src = iframeSrcMatch[1];
    // Check if the URL starts with http:// or https:// or //
    if (/^(https?:)?\/\//i.test(src)) {
      return { src, isValid: true };
    }
    return { src: "", isValid: false, error: "O endereço do iframe é inválido ou inseguro." };
  }

  return { src: "", isValid: false, error: "Nenhum elemento iframe válido foi encontrado no código de incorporação." };
}

export function processVideoSource(
  url: string,
  embedCode?: string,
  selectedPlatform?: "youtube" | "vimeo" | "panda" | "other"
): {
  src: string;
  platform: "youtube" | "vimeo" | "panda" | "other";
  error?: string;
} {
  // 1. If embedCode is provided, try to extract src from it first (giving priority to raw iframe)
  if (embedCode && embedCode.trim()) {
    const sanitized = sanitizeEmbedCode(embedCode);
    if (sanitized.isValid) {
      // Auto-identify platform from the iframe src
      let platform: "youtube" | "vimeo" | "panda" | "other" = selectedPlatform || "other";
      const srcLower = sanitized.src.toLowerCase();
      if (srcLower.includes("youtube.com") || srcLower.includes("youtu.be")) {
        platform = "youtube";
      } else if (srcLower.includes("vimeo.com")) {
        platform = "vimeo";
      } else if (srcLower.includes("pandavideo")) {
        platform = "panda";
      }
      return { src: sanitized.src, platform };
    } else {
      return { src: "", platform: selectedPlatform || "other", error: sanitized.error };
    }
  }

  // 2. Otherwise process the URL
  if (!url || !url.trim()) {
    return { src: "", platform: selectedPlatform || "youtube", error: "O link do vídeo não pode estar vazio." };
  }

  const trimmedUrl = url.trim();
  if (!/^https?:\/\//i.test(trimmedUrl)) {
    return { src: "", platform: selectedPlatform || "youtube", error: "O endereço deve começar com http:// ou https://" };
  }

  // Try to auto-detect platform if not specified, or inspect the URL to confirm
  let detectedPlatform: "youtube" | "vimeo" | "panda" | "other" = "other";
  const urlLower = trimmedUrl.toLowerCase();
  if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) {
    detectedPlatform = "youtube";
  } else if (urlLower.includes("vimeo.com")) {
    detectedPlatform = "vimeo";
  } else if (urlLower.includes("pandavideo")) {
    detectedPlatform = "panda";
  } else if (selectedPlatform) {
    detectedPlatform = selectedPlatform;
  }

  // Transform to embed format based on platform
  if (detectedPlatform === "youtube") {
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/ ]{11})/;
    const match = trimmedUrl.match(ytRegex);
    if (match && match[1]) {
      const videoId = match[1];
      return { src: `https://www.youtube.com/embed/${videoId}`, platform: "youtube" };
    } else {
      return { src: "", platform: "youtube", error: "Não conseguimos extrair o código do vídeo do YouTube. Verifique o link." };
    }
  }

  if (detectedPlatform === "vimeo") {
    const vimeoRegex = /(?:vimeo\.com\/(?:channels\/[^\/]+\/|groups\/[^\/]+\/album\/[^\/]+\/video\/|showcase\/[^\/]+\/video\/|)?|player\.vimeo\.com\/video\/)(\d+)/;
    const match = trimmedUrl.match(vimeoRegex);
    if (match && match[1]) {
      const videoId = match[1];
      return { src: `https://player.vimeo.com/video/${videoId}`, platform: "vimeo" };
    } else {
      return { src: "", platform: "vimeo", error: "Não conseguimos extrair o código do vídeo do Vimeo. Verifique o link." };
    }
  }

  if (detectedPlatform === "panda") {
    if (urlLower.includes("pandavideo.com.br/embed") || urlLower.includes("pandavideo.com/embed")) {
      return { src: trimmedUrl, platform: "panda" };
    }
    const pandaIdMatch = trimmedUrl.match(/[?&]v=([^&]+)/);
    if (pandaIdMatch && pandaIdMatch[1]) {
      const hostMatch = trimmedUrl.match(/https?:\/\/([^/]+)/);
      const host = hostMatch ? hostMatch[1] : "player.pandavideo.com.br";
      return { src: `https://${host}/embed/?v=${pandaIdMatch[1]}`, platform: "panda" };
    }
    return { src: trimmedUrl, platform: "panda" };
  }

  return { src: trimmedUrl, platform: detectedPlatform };
}
