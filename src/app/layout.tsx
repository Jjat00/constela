import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import { CalmMode } from "@/components/calm-mode";
import { SITIO, SITIO_URL } from "@/lib/seo";
import "./globals.css";

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

/*
 * Los metadatos que hereda toda la app.
 *
 * `metadataBase` es el que faltaba y el que rompía el resto: sin él, Next
 * emite las imágenes sociales y los canónicos como rutas relativas, y una
 * `og:image` relativa no la resuelve ningún cliente —ni WhatsApp, ni
 * LinkedIn, ni el buscador—. Con Constela repartiéndose por link pegado en un
 * chat, eso significaba que cada vez que alguien la compartía llegaba una
 * tarjeta gris sin imagen ni descripción.
 *
 * El `title` es la única línea donde la categoría gana al lirismo: «app de
 * networking para eventos» es lo que la gente escribe en un buscador, y el
 * tagline entero («el networking que por fin se ve») no contiene ni una sola
 * palabra por la que nadie vaya a buscarnos. Se conserva reconocible —«que
 * por fin se ve»— y completo en el `og:title`, en la portada y en el pie.
 *
 * `alternates.canonical` NO se declara aquí a propósito: Next lo heredaría en
 * cada ruta que no lo sobrescriba y acabaríamos diciéndole a Google que
 * /privacidad y / son la misma página. Cada página pública declara el suyo.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITIO_URL),
  title: {
    default: SITIO.titulo,
    template: `%s — ${SITIO.nombre}`,
  },
  description: SITIO.descripcion,
  applicationName: SITIO.nombre,
  category: "Networking",
  keywords: [
    "app de networking",
    "networking en eventos",
    "eventos presenciales",
    "QR",
    "tarjeta de presentación digital",
    "red de contactos",
  ],
  authors: [{ name: SITIO.nombre, url: SITIO_URL }],
  creator: SITIO.nombre,
  publisher: SITIO.nombre,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Sin esto Google recorta el fragmento y muestra la imagen en miniatura.
      // Un producto que se explica con un mapa merece la vista previa grande.
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITIO.nombre,
    locale: SITIO.locale,
    url: SITIO_URL,
    title: `${SITIO.nombre} — ${SITIO.tagline}`,
    description: SITIO.descripcion,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITIO.nombre} — ${SITIO.tagline}`,
    description: SITIO.descripcion,
  },
  // La verificación de Search Console entra por entorno para que dar de alta
  // el dominio no exija un despliegue de código.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  // iOS necesita saberlo por su cuenta: el manifest no le basta para tratar
  // la app como app cuando alguien la guarda en la pantalla de inicio.
  appleWebApp: {
    capable: true,
    title: SITIO.nombre,
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

// `cover` deja que el fondo llegue bajo la barra del teléfono; las áreas
// seguras se respetan con env(safe-area-inset-*) donde toca (barra inferior).
export const viewport: Viewport = {
  themeColor: "#0B0C0F",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`dark ${interTight.variable} ${plexMono.variable} h-full antialiased motion-safe:scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <CalmMode />
        {children}
      </body>
    </html>
  );
}
