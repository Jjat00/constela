import type { MetadataRoute } from "next";
import { RUTAS_PRIVADAS, SITIO_URL } from "@/lib/seo";

/**
 * Qué puede recorrer un rastreador.
 *
 * DOS DECISIONES, y las dos importan:
 *
 * 1. **`/u/` y `/e/` se cierran.** Son personas y eventos reales. Una ficha de
 *    `/u/` es pública en el sentido de que no pide sesión —tiene que serlo:
 *    quien la abre acaba de escanear un QR y todavía no tiene cuenta—, pero
 *    «accesible con el link» y «archivada por Google» no son lo mismo. Nadie
 *    aceptó lo segundo al dejarse escanear.
 *
 * 2. **Los bots de IA entran.** GPTBot, ClaudeBot, PerplexityBot y
 *    Google-Extended tienen su propio user-agent y bloquearlos no protege
 *    nada aquí: solo garantiza que esos motores no puedan citar a Constela
 *    cuando alguien les pregunte por una app de networking para eventos. Se
 *    les aplica la misma lista de exclusión que a Googlebot, ni más ni menos.
 *
 * Los despliegues que no son producción se cierran enteros: un preview de
 * Vercel indexado es una copia del sitio compitiendo contra el sitio.
 */
export default function robots(): MetadataRoute.Robots {
  const esProduccion = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : process.env.NODE_ENV === "production";

  if (!esProduccion) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  const disallow = [...RUTAS_PRIVADAS];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      // Los que responden preguntas citando fuentes. Se nombran uno a uno
      // para dejar constancia de que es una decisión, no un descuido.
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-User",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "Bingbot",
          "cohere-ai",
        ],
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${SITIO_URL}/sitemap.xml`,
    host: SITIO_URL,
  };
}
