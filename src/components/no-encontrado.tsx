import Link from "next/link";
import { CosmicSky } from "@/components/cosmos";

/**
 * El 404, sin documento alrededor.
 *
 * Existe suelto porque con dos layouts raíz hay dos sitios donde puede hacer
 * falta: dentro del árbol español, donde lo envuelve su layout, y en
 * `app/not-found.tsx`, que atiende las URLs que no encajan en ningún árbol y
 * por tanto tiene que traerse su propio `<html>`.
 *
 * Sigue en español: quien llega aquí abrió un enlace o un QR roto, no eligió
 * un idioma, y el idioma de la casa es el español.
 */
export function NoEncontrado() {
  return (
    <main className="grain relative flex flex-1 flex-col items-center justify-center gap-6 px-5 py-16 text-center sm:px-8">
      <CosmicSky />
      <p className="relative z-10 font-mono text-[11px] tracking-wider text-faint uppercase">
        [ 404 ]
      </p>
      <h1 className="relative z-10 max-w-md text-3xl font-bold tracking-tight text-balance sm:text-4xl">
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
