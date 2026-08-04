import type { MetadataRoute } from "next";
import { SITIO } from "@/lib/seo";

/**
 * El manifiesto de instalación.
 *
 * Constela se usa de pie, a una mano y en medio del ruido de un evento
 * (PRODUCT.md § Operating Context): el sitio *tiene* que poder quedarse en la
 * pantalla de inicio del teléfono. `display: standalone` quita la barra del
 * navegador, que en un QR a pantalla completa es medio centímetro de brillo
 * perdido.
 *
 * Los colores son los de v6 «Observatorio» y salen de `globals.css`: papel
 * `#0B0C0F` como fondo y como tema, porque la app es dark-only y una pantalla
 * de arranque blanca sería el único destello blanco de todo el producto.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Constela — app de networking para eventos",
    short_name: "Constela",
    description: SITIO.descripcion,
    start_url: "/home",
    id: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0B0C0F",
    theme_color: "#0B0C0F",
    lang: SITIO.idioma,
    dir: "ltr",
    categories: ["social", "business", "productivity"],
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
