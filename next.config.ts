import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Las fotos del grafo se dibujan en canvas, y un canvas solo acepta
    // imágenes de otro origen si ese origen manda CORS (pravatar no lo hace).
    // Sirviéndolas por el optimizador quedan en nuestro propio origen, así que
    // el problema desaparece sea cual sea el proveedor del avatar.
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
