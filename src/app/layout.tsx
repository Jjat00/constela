import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import { CalmMode } from "@/components/calm-mode";
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

export const metadata: Metadata = {
  title: "Constela — El networking que por fin se ve",
  description:
    "Cada persona es una estrella, cada conexión, una constelación. Conecta con un escaneo y mira la red del evento dibujarse en vivo.",
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
