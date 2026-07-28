import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CalmMode } from "@/components/calm-mode";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Constela — El networking que por fin se ve",
  description:
    "Conecta con un escaneo. Cada persona que conoces se vuelve una estrella en tu constelación del evento — con las conexiones de tus conexiones, en vivo.",
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
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased motion-safe:scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <CalmMode />
        {children}
      </body>
    </html>
  );
}
