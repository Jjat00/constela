import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CosmicSky, Sol } from "@/components/cosmos";
import { Logo } from "@/components/logo";
import { NO_INDEXAR } from "@/lib/seo";
import { GoogleButton } from "./google-button";
import { DevLoginForm } from "./dev-login-form";

/**
 * Una pantalla de login no es un resultado de búsqueda útil para nadie: quien
 * busca «app de networking» quiere saber qué es esto, no un formulario. Que
 * Google la indexara solo serviría para que compitiera con la portada.
 */
export const metadata: Metadata = { title: "Entrar", ...NO_INDEXAR };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const safeNext = next?.startsWith("/") ? next : undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect(safeNext ?? "/home");
  }

  return (
    <div className="grain relative flex flex-1 flex-col">
      <CosmicSky />

      {/* La puerta se abre en los dos sentidos: el wordmark devuelve a la
          portada a quien llegó aquí sin querer entrar todavía. */}
      <header className="relative z-10 flex items-center px-5 pt-[calc(1.75rem+env(safe-area-inset-top))] sm:px-8 lg:px-14 lg:pt-8">
        <Link href="/" className="inline-flex transition-opacity hover:opacity-80">
          <Logo className="h-8 lg:h-9" priority />
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8">
        <div className="flex w-full max-w-sm flex-col gap-8 sm:max-w-md">
          <div className="flex flex-col gap-3">
            {/* Tu sol, a punto de nacer */}
            <Sol size={52} className="mb-3" />
            <p className="font-mono text-[11px] tracking-wider text-faint uppercase">
              [ entrar ]
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Tu universo <span className="text-celeste">te espera</span>
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Un toque y adentro: tu nombre y tu foto llegan solos.
            </p>
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              No pudimos completar el ingreso. Intenta de nuevo.
            </p>
          )}

          <GoogleButton next={safeNext} />

          {/* La aceptación va donde ocurre el acto, no escondida en un pie */}
          <p className="-mt-3 text-center text-xs leading-5 text-faint">
            Al entrar aceptas los{" "}
            <Link
              href="/terminos"
              className="underline underline-offset-3 transition-colors hover:text-celeste"
            >
              términos
            </Link>{" "}
            y la{" "}
            <Link
              href="/privacidad"
              className="underline underline-offset-3 transition-colors hover:text-celeste"
            >
              política de privacidad
            </Link>
            .
          </p>

          {process.env.NODE_ENV === "development" && (
            <DevLoginForm next={safeNext} />
          )}
        </div>
      </main>
    </div>
  );
}
