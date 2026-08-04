import type { Metadata } from "next";
import { NoEncontrado } from "@/components/no-encontrado";
import { RaizHtml } from "@/components/raiz-html";
import { NOMBRE, NO_INDEXAR, SITIO_URL } from "@/lib/seo";

/**
 * El 404 de las URLs que no encajan en ningún árbol.
 *
 * Trae su propio `<html>` porque no hay layout raíz por encima: al partir el
 * sitio en `(es)` y `(en)` para que cada idioma tenga su atributo `lang`,
 * `app/layout.tsx` dejó de existir, y una página sin layout raíz no tiene
 * documento.
 *
 * Y por lo mismo declara su propio `metadataBase`: sin layout encima no hereda
 * ninguno, y Next avisa en cada build de que está resolviendo las URL sociales
 * contra `localhost`.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITIO_URL),
  title: `404 — ${NOMBRE}`,
  ...NO_INDEXAR,
};

export default function NotFound() {
  return (
    <RaizHtml lang="es">
      <NoEncontrado />
    </RaizHtml>
  );
}
