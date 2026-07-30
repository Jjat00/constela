import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import { CalmMode } from "@/components/calm-mode";
import "./globals.css";

// DM Sans es la familia compatible con el wordmark del logo: geométrica de
// bajo contraste, «o» circular, «a» de doble piso y astas sin cola — Geist
// erraba un 21% en las proporciones de esas mismas letras (su «l» lleva cola).
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

// El mono se queda en Geist Mono: es otra voz a propósito (anotación de
// observatorio), y DM Sans no tiene monoespaciada hermana en la app.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
  themeColor: "#02030A",
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
      className={`dark ${dmSans.variable} ${geistMono.variable} h-full antialiased motion-safe:scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <CalmMode />
        {children}
      </body>
    </html>
  );
}
