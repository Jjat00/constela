import type { Metadata } from "next";
import { VistaCategoria } from "@/components/vista-categoria";
import { copy } from "@/lib/copy";
import { metaPagina } from "@/lib/seo";

/**
 * La página de categoría en inglés.
 *
 * El slug es `event-networking-app` y no la traducción del español: la URL es
 * uno de los pocos sitios donde la palabra buscada todavía pesa, y «event
 * networking app» es exactamente lo que se escribe en el buscador.
 */
export const metadata: Metadata = metaPagina({
  locale: "en",
  pagina: "categoria",
  titulo: copy("en").categoria.titulo,
  descripcion: copy("en").categoria.descripcion,
});

export default function EventNetworkingAppPage() {
  return <VistaCategoria locale="en" />;
}
