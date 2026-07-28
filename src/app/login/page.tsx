import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CosmicSky, Sol } from "@/components/cosmos";
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
      <CosmicSky seed={21} stars={140} nebulas="rich" />

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-8 sm:max-w-md">
        <div className="flex flex-col gap-3">
          {/* Tu sol, a punto de nacer */}
          <Sol size={52} className="mb-3" />
          <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
            [ entrar ]
          </p>
          <h1 className="text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
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

        {process.env.NODE_ENV === "development" && (
          <DevLoginForm next={safeNext} />
        )}
      </div>
    </main>
  );
}
