import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchTagCatalog, labelFor, type TagChoice } from "@/lib/tags";
import { AuraSol } from "@/components/cosmos";
import { CalmToggle } from "@/components/calm-mode";
import { ProfileForm } from "./profile-form";

/**
 * Tu estrella — perfil y preferencias (diseño 3a). Lo único editable eres
 * tú: rol, intereses, intención. Las conexiones no se editan: nacen de un
 * escaneo.
 */
export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/perfil");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, headline, role, tags, intents, avatar_url")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/login?error=sin-perfil");

  const [catalog, { count: connectionCount }] = await Promise.all([
    fetchTagCatalog(supabase),
    supabase
      .from("connections")
      .select("id", { count: "exact", head: true })
      .or(`user_a.eq.${user.id},user_b.eq.${user.id}`),
  ]);

  const toChoices = (
    slugs: string[] | null,
    category: Parameters<typeof labelFor>[1],
  ): TagChoice[] =>
    (slugs ?? []).map((slug) => ({
      slug,
      label: labelFor(catalog, category, slug),
    }));

  const roleChoices = toChoices(profile.role ? [profile.role] : [], "rol");
  const interestChoices = toChoices(profile.tags, "interes");
  const intentChoices = toChoices(profile.intents, "intencion");

  const magnitude = (1.1 + (connectionCount ?? 0) * 0.14).toFixed(1);
  const provider = user.app_metadata?.provider ?? "email";

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8 lg:py-14">
      {/* Tu sol, en cabecera: la foto llega de tu cuenta */}
      <header className="flex items-center gap-5 sm:gap-6">
        <div className="relative size-16 shrink-0 sm:size-24">
          <AuraSol size={96} />
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt=""
              className="relative z-1 h-full w-full rounded-full border border-sol/50 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="relative z-1 flex h-full w-full items-center justify-center rounded-full border border-sol/50 bg-card text-2xl font-bold text-sol sm:text-3xl">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
            {profile.name.split(" ")[0]}
          </h1>
          <p className="mt-2.5 font-mono text-[10px] tracking-[0.16em] text-sol sm:text-[11px]">
            MAG {magnitude} · {connectionCount ?? 0}{" "}
            {connectionCount === 1 ? "CONEXIÓN" : "CONEXIONES"}
          </p>
        </div>
      </header>

      {error && (
        <p className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error === "falta-nombre"
            ? "Tu estrella necesita un nombre."
            : "No pudimos guardar. Intenta de nuevo."}
        </p>
      )}
      {ok && (
        <p className="rounded-2xl border border-aurora/30 bg-aurora/[0.08] px-4 py-3 font-mono text-xs tracking-[0.14em] text-aurora">
          [ GUARDADO ]
        </p>
      )}

      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[1fr_16rem] lg:items-start lg:gap-6">
        {/* Quién eres en el cielo: rol, intereses, intención */}
        <div className="glass rounded-4xl p-6 sm:p-7">
          <ProfileForm
            defaultName={profile.name}
            defaultHeadline={profile.headline ?? ""}
            roleOptions={catalog.rol}
            interestOptions={catalog.interes}
            intentOptions={catalog.intencion}
            defaultRole={roleChoices}
            defaultInterests={interestChoices}
            defaultIntents={intentChoices}
          />
        </div>

        {/* Rail: preferencias y cuenta */}
        <aside className="flex flex-col gap-4">
          <section className="glass flex flex-col gap-3.5 rounded-4xl p-5">
            <h2 className="font-mono text-[10px] tracking-[0.16em] text-faint">
              [ PREFERENCIAS ]
            </h2>
            <div className="flex items-start gap-3 rounded-3xl border border-white/5 bg-white/[0.03] p-3.5">
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

          <section className="glass flex flex-col gap-3 rounded-4xl p-5">
            <h2 className="font-mono text-[10px] tracking-[0.16em] text-faint">
              [ CUENTA ]
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              {provider === "google"
                ? "Conectado con Google"
                : "Acceso por correo"}
              {user.email ? ` · ${user.email}` : ""}
            </p>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="chip-star h-10.5 w-full cursor-pointer text-[13px]"
              >
                Cerrar sesión
              </button>
            </form>
          </section>
        </aside>
      </div>
    </main>
  );
}
