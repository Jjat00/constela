import type { MetadataRoute } from "next";
import { LOCALES, PAGINAS, RUTAS } from "@/lib/i18n";
import { abs, RUTAS_LEGALES } from "@/lib/seo";

/**
 * El mapa del sitio: ocho URLs, las únicas que un buscador puede ver enteras y
 * sin sesión.
 *
 * Tres páginas × dos idiomas, más las dos legales, que existen solo en
 * español. No se generan entradas para `/u/` ni `/e/` —serían miles de URLs de
 * personas y eventos reales, justo las que `robots.ts` cierra— así que este
 * archivo no necesita tocar la base de datos y puede quedarse estático.
 *
 * CADA URL DECLARA SUS ALTERNATIVAS. Es la misma información que el `hreflang`
 * del `<head>` (ver `alternativas()` en `src/lib/seo.ts`) dicha por segunda
 * vez, y no es redundancia inútil: Google acepta las dos formas y las cruza,
 * y un sitio nuevo —sin enlaces entrantes que le den autoridad— necesita que
 * la relación entre versiones esté dicha por todos los canales disponibles.
 *
 * `lastModified` es la fecha del despliegue, que para un sitio de ocho páginas
 * escritas a mano es exactamente lo que dice ser: la última vez que este
 * contenido pudo cambiar.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();

  /** Con qué frecuencia y cuánta prioridad, por página. */
  const peso: Record<
    (typeof PAGINAS)[number],
    { changeFrequency: "weekly" | "monthly"; priority: number }
  > = {
    portada: { changeFrequency: "weekly", priority: 1 },
    categoria: { changeFrequency: "monthly", priority: 0.9 },
    guia: { changeFrequency: "monthly", priority: 0.8 },
  };

  const contenido = PAGINAS.flatMap((pagina) =>
    LOCALES.map((locale) => ({
      url: abs(RUTAS[locale][pagina]),
      lastModified: ahora,
      ...peso[pagina],
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((otro) => [otro, abs(RUTAS[otro][pagina])]),
        ),
      },
    })),
  );

  // Sin `alternates`: no tienen gemela inglesa, y declarar una que no existe
  // es peor que no declarar ninguna.
  const legales = RUTAS_LEGALES.map((ruta) => ({
    url: abs(ruta),
    lastModified: ahora,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [...contenido, ...legales];
}
