import { IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import { CalmMode } from "@/components/calm-mode";
import "@/app/globals.css";

/*
 * El documento: `<html>`, `<body>` y las dos fuentes de v6 «Observatorio».
 *
 * POR QUÉ ES UN COMPONENTE Y NO EL LAYOUT RAÍZ: desde que el sitio habla dos
 * idiomas hay dos layouts raíz —`app/(es)/layout.tsx` y `app/(en)/layout.tsx`—
 * porque `<html lang>` es un atributo del documento y un layout anidado no
 * puede tocarlo. Servir la portada inglesa dentro de un `<html lang="es">`
 * sería mentirle a los lectores de pantalla, que pronunciarían el inglés con
 * fonética castellana, y a los buscadores que sí leen ese atributo.
 *
 * Con dos layouts raíz aparece el riesgo opuesto: que se separen. Uno gana una
 * fuente, el otro se queda con `motion-safe:scroll-smooth` y a los dos meses el
 * árbol inglés se ve distinto sin que nadie lo haya decidido. Aquí no pueden:
 * los dos layouts son cuatro líneas que llaman a esto.
 *
 * Precio a pagar, y es real: navegar entre `/` y `/en` es una recarga completa
 * de página, no una transición del router. Ocurre una vez, al cambiar de
 * idioma, y a cambio cada árbol se prerrenderiza estático.
 */

// v6 «Observatorio»: la app deja DM Sans y adopta la tipografía de la portada.
// Inter Tight es una grotesca ya condensada de fábrica — el titular puede
// crecer a 6rem sin abrirse y el cuerpo no necesita tracking negativo. Es la
// mitad del rediseño; la otra mitad la hace el mono.
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

// IBM Plex Mono releva a Geist Mono: mismo papel —anotación de observatorio,
// no lectura corrida— con más carácter de ingeniería a 10,5px, que es el
// tamaño al que vive casi todo el mono de esta app.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export function RaizHtml({
  lang,
  children,
}: Readonly<{ lang: string; children: React.ReactNode }>) {
  return (
    <html
      lang={lang}
      className={`dark ${interTight.variable} ${plexMono.variable} h-full antialiased motion-safe:scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <CalmMode />
        {children}
      </body>
    </html>
  );
}
