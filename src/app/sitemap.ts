import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

/**
 * El mapa del sitio.
 *
 * Solo las cinco rutas que un buscador puede ver enteras y sin sesión. No se
 * generan entradas para `/u/` ni `/e/` —serían miles de URLs de personas y
 * eventos reales, justo las que `robots.ts` cierra— así que este archivo no
 * necesita tocar la base de datos y puede quedarse estático.
 *
 * `lastModified` es la fecha del despliegue, que para un sitio de cinco
 * páginas escritas a mano es exactamente lo que dice ser: la última vez que
 * este contenido pudo cambiar.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();

  return [
    {
      url: abs("/"),
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: abs("/app-de-networking-para-eventos"),
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: abs("/networking-en-eventos"),
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: abs("/privacidad"),
      lastModified: ahora,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: abs("/terminos"),
      lastModified: ahora,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
