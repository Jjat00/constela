import Link from "next/link";
import { CosmicSky } from "@/components/cosmos";

export default function NotFound() {
  return (
    <main className="grain relative flex flex-1 flex-col items-center justify-center gap-6 px-5 py-16 text-center sm:px-8">
      <CosmicSky />
      <p className="relative z-10 font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
        [ 404 ]
      </p>
      <h1 className="relative z-10 max-w-md text-3xl font-bold tracking-[-0.035em] text-balance sm:text-4xl">
        Esta estrella no está en el <span className="text-celeste">mapa</span>
      </h1>
      <p className="relative z-10 max-w-xs text-sm leading-6 text-muted-foreground">
        El enlace o el QR que abriste no lleva a ningún lado. Puede que el
        evento ya no exista.
      </p>
      <Link
        href="/home"
        className="btn-cosmic relative z-10 flex h-13 w-full max-w-xs items-center justify-center px-7 text-[15px] font-medium sm:w-auto"
      >
        Ir a mi universo
      </Link>
    </main>
  );
}
