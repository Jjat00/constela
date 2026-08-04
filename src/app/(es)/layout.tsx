import type { Metadata, Viewport } from "next";
import { RaizHtml } from "@/components/raiz-html";
import { metadataRaiz } from "@/lib/seo";

/*
 * El layout raíz del árbol español: la app entera menos las tres páginas de
 * `/en`. El documento y las fuentes los pone `RaizHtml`, que comparte con su
 * gemelo inglés; aquí solo se declara el idioma y la metadata heredada.
 */

export const metadata: Metadata = metadataRaiz("es");

// `cover` deja que el fondo llegue bajo la barra del teléfono; las áreas
// seguras se respetan con env(safe-area-inset-*) donde toca (barra inferior).
export const viewport: Viewport = {
  themeColor: "#0B0C0F",
  viewportFit: "cover",
};

export default function LayoutEspanol({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RaizHtml lang="es">{children}</RaizHtml>;
}
