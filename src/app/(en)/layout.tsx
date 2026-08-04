import type { Metadata, Viewport } from "next";
import { RaizHtml } from "@/components/raiz-html";
import { metadataRaiz } from "@/lib/seo";

/*
 * El layout raíz del árbol inglés: las tres páginas de `/en` y nada más.
 *
 * La aplicación con sesión no cuelga de aquí y no es un olvido — `/home`,
 * `/perfil` y las fichas `/u/` siguen hablando español, se declara así en el
 * JSON-LD (`appLd`) y se avisa en la propia portada inglesa antes de que nadie
 * cruce la puerta. Prometer un producto traducido en la landing y entregar
 * otra cosa detrás del login sería peor que no tener landing inglesa.
 */

export const metadata: Metadata = metadataRaiz("en");

export const viewport: Viewport = {
  themeColor: "#0B0C0F",
  viewportFit: "cover",
};

export default function LayoutIngles({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RaizHtml lang="en">{children}</RaizHtml>;
}
