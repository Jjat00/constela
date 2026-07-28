import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CosmicSky } from "@/components/cosmos";

export default function NotFound() {
  return (
    <main className="grain relative flex flex-1 flex-col items-center justify-center gap-6 px-5 py-16 text-center sm:px-8">
      <CosmicSky seed={61} stars={110} milkyWay={false} />
      <p className="relative z-10 font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
        [ 404 ]
      </p>
      <h1 className="max-w-md text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        Esta estrella no está en el <span className="text-lavanda">mapa</span>
      </h1>
      <p className="max-w-xs text-sm leading-6 text-muted-foreground">
        El enlace o el QR que abriste no lleva a ningún lado. Puede que el
        evento ya no exista.
      </p>
      <Button
        asChild
        size="lg"
        className="node-glow h-12 w-full max-w-xs rounded-full px-7 sm:w-auto"
      >
        <Link href="/home">Ir a mi universo</Link>
      </Button>
    </main>
  );
}
