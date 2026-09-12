/**
 * Safely parses the Response as JSON.
 * If JSON parsing fails (due to an HTML/text error page from Nginx, Cloud Run, proxy timeouts, etc.),
 * it catches the error and throws a friendly Portuguese error message depending on the response status.
 */
export async function safeJson<T = any>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  
  if (!contentType.includes("application/json")) {
    if (!response.ok) {
      if (response.status === 502 || response.status === 504 || response.status === 503) {
        throw new Error(
          "O servidor está temporariamente indisponível ou demorou muito para responder (Erro de Timeout). Por favor, aguarde alguns instantes e tente novamente."
        );
      }
      if (response.status === 429) {
        throw new Error(
          "Limite de requisições temporariamente atingido (Código 429). Por favor, aguarde alguns segundos e tente novamente."
        );
      }
      throw new Error(`Erro temporário no servidor (Código ${response.status}). Por favor, tente novamente.`);
    }
    const text = await response.text();
    throw new Error(`Resposta do servidor inválida (esperava JSON, recebeu: ${text.slice(0, 100)}...)`);
  }

  let data: any;
  try {
    data = await response.json();
  } catch (parseError: any) {
    if (!response.ok) {
      if (response.status === 502 || response.status === 504 || response.status === 503) {
        throw new Error(
          "O servidor está temporariamente instável ou indisponível (Erro de Gateway). Por favor, tente de novo em instantes."
        );
      }
      if (response.status === 429) {
        throw new Error("Limite de cota de requisições atingido (429). Tente novamente em instantes.");
      }
      throw new Error(`Erro de resposta do servidor (Código ${response.status}).`);
    }
    throw new Error("Não foi possível processar a resposta do servidor como JSON.");
  }

  // If response is not OK, but we successfully parsed JSON, throw data.error or status text
  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Erro do servidor (Código ${response.status}).`;
    if (response.status === 429 || errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.toLowerCase().includes("quota")) {
      throw new Error("Limite de cota da IA atingido temporariamente (429). O sistema ativou o modo de contingência.");
    }
    throw new Error(errorMsg);
  }

  return data as T;
}
