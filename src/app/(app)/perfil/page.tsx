import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchTagCatalog, labelFor, type TagChoice } from "@/lib/tags";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/perfil");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, headline, role, tags, intents")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/login?error=sin-perfil");

  const catalog = await fetchTagCatalog(supabase);
  const toChoices = (
    slugs: string[] | null,
    category: Parameters<typeof labelFor>[1],
  ): TagChoice[] =>
    (slugs ?? []).map((slug) => ({
      slug,
      label: labelFor(catalog, category, slug),
    }));

  return (
    <main className="relative z-10 flex flex-1 flex-col items-center px-5 py-8 sm:justify-center sm:px-8 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 hidden h-[28rem] w-[44rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl sm:block"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.8 0.14 70 / 55%), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-7 sm:max-w-md sm:gap-8">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
            [ tu estrella ]
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Así te{" "}
            <em className="font-serif font-normal text-primary italic">ven</em>
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Todo opcional: tu titular y tus temas ayudan a que las conexiones
            recuerden de qué hablaron contigo.
          </p>
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error === "falta-nombre"
              ? "Tu estrella necesita un nombre."
              : "No pudimos guardar. Intenta de nuevo."}
          </p>
        )}

        <ProfileForm
          defaultName={profile.name}
          defaultHeadline={profile.headline ?? ""}
          roleOptions={catalog.rol}
          interestOptions={catalog.interes}
          intentOptions={catalog.intencion}
          defaultRole={toChoices(profile.role ? [profile.role] : [], "rol")}
          defaultInterests={toChoices(profile.tags, "interes")}
          defaultIntents={toChoices(profile.intents, "intencion")}
        />
      </div>
    </main>
  );
}
