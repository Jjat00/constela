import { esLocale, LOCALES } from "@/lib/i18n";
import { laminaOg } from "@/lib/og-lamina";

/**
 * Las dos tarjetas sociales, en una URL que no cambia: `/og/es` y `/og/en`.
 *
 * POR QUÉ NO ES UN `opengraph-image.tsx`, que es la convención de Next y la
 * que este proyecto usaba hasta hoy: esa convención genera la URL con un hash
 * de contenido en cuanto el archivo no está en la raíz del árbol de rutas
 * —`/en/opengraph-image-1nh35u`—, y ese hash cambia con el archivo. La
 * dirección de la imagen tiene que poder escribirse a mano en la metadata,
 * porque Next NO hereda la imagen del segmento en una página que declara su
 * propio `openGraph` (la trampa documentada en `metaPagina`): o se puede
 * nombrar la URL, o no hay imagen social. Se comprobó las dos veces con el
 * HTML generado, no de memoria.
 *
 * `force-static` las deja prerrenderizadas en el build, igual que estaban:
 * cada scrape de WhatsApp o LinkedIn sale de un archivo, no de una ejecución.
 */

export const dynamic = "force-static";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function GET(
  _peticion: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!esLocale(locale)) return new Response("No encontrada", { status: 404 });
  return laminaOg(locale);
}
