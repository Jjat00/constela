import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GoogleButton } from "./google-button";
import { DevLoginForm } from "./dev-login-form";

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
    <main className="grain relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.8 0.14 70 / 55%), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-8 sm:max-w-md">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
            [ entrar ]
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Tu constelación{" "}
            <em className="font-serif font-normal text-primary italic">
              te espera
            </em>
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

        {process.env.NODE_ENV === "development" && (
          <DevLoginForm next={safeNext} />
        )}
      </div>
    </main>
  );
}
