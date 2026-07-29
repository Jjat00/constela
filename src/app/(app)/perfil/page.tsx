import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchTagCatalog, labelFor, type TagChoice } from "@/lib/tags";
import { AuraSol } from "@/components/cosmos";
import { ProfileForm } from "./profile-form";

/**
 * Tu estrella — quién eres en el cielo (diseño 3a): nombre, rol, intereses,
 * intención y contacto. Las conexiones no se editan: nacen de un escaneo.
 * La cuenta y las preferencias viven en /ajustes.
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
    .select(
      "name, headline, role, tags, intents, avatar_url, website, instagram, linkedin, github, whatsapp_number",
    )
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

  const roleChoices = toChoices(profile.role ?? [], "rol");
  const interestChoices = toChoices(profile.tags, "interes");
  const intentChoices = toChoices(profile.intents, "intencion");

  const magnitude = (1.1 + (connectionCount ?? 0) * 0.14).toFixed(1);

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8 lg:py-14">
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

      {/* Quién eres en el cielo: rol, intereses, intención, contacto */}
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
          defaultWebsite={profile.website ?? ""}
          defaultInstagram={profile.instagram ?? ""}
          defaultLinkedin={profile.linkedin ?? ""}
          defaultGithub={profile.github ?? ""}
          defaultWhatsappNumber={profile.whatsapp_number ?? ""}
        />
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        La cuenta con la que entras y las preferencias del cielo viven en{" "}
        <Link
          href="/ajustes"
          className="text-celeste underline-offset-4 hover:underline"
        >
          Ajustes
        </Link>
        .
      </p>
    </main>
  );
}
