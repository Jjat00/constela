import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CalmToggle } from "@/components/calm-mode";

/**
 * Ajustes — la cuenta con la que entras y cómo se comporta el cielo.
 * Quién eres en el cielo (nombre, rol, intereses, contacto) vive aparte,
 * en /perfil: la card «Tu estrella» es su puerta.
 */
export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/ajustes");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, avatar_url")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/login?error=sin-perfil");

  const provider = user.app_metadata?.provider ?? "email";

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 lg:py-16">
      <header className="flex flex-col gap-2.5">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Ajustes
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Tu cuenta y las preferencias del observatorio.
        </p>
      </header>

      {/* Tu estrella: la puerta al perfil — lo que los demás ven de ti */}
      <Link
        href="/perfil"
        className="glass group flex items-center gap-4 rounded-4xl p-5 transition-colors hover:border-sol/30"
      >
        <div className="relative size-11 shrink-0">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt=""
              className="relative z-1 h-full w-full rounded-full border border-sol/50 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="relative z-1 flex h-full w-full items-center justify-center rounded-full border border-sol/50 bg-card text-sm font-semibold text-sol">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[15px] font-semibold">Tu estrella</span>
          <span className="mt-0.5 truncate text-[13px] leading-snug text-muted-foreground">
            {profile.name} — nombre, rol, intereses y contacto
          </span>
        </span>
        <ChevronRight
          className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
          aria-hidden
        />
      </Link>

      <section className="glass flex flex-col gap-4 rounded-4xl p-5 sm:p-6">
        <h2 className="font-mono text-[10px] tracking-wider text-faint">
          [ CUENTA ]
        </h2>
        <div className="flex flex-col gap-1">
          <p className="truncate text-sm font-medium">
            {user.email ?? "sin correo"}
          </p>
          <p className="text-xs text-muted-foreground">
            {provider === "google"
              ? "Conectado con Google"
              : "Acceso por correo"}
          </p>
        </div>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="chip-star h-10.5 w-full cursor-pointer text-[13px] sm:w-auto sm:px-7"
          >
            Cerrar sesión
          </button>
        </form>
      </section>

      <section className="glass flex flex-col gap-3.5 rounded-4xl p-5 sm:p-6">
        <h2 className="font-mono text-[10px] tracking-wider text-faint">
          [ PREFERENCIAS ]
        </h2>
        <div className="flex items-start gap-3 rounded-3xl border p-3.5">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] leading-snug font-medium">
              Movimiento reducido
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              Congela el titileo y la deriva del cielo.
            </p>
          </div>
          <CalmToggle />
        </div>
      </section>
    </main>
  );
}
