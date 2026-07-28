import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CosmicSky } from "@/components/cosmos";
import { safeNext } from "@/lib/nav";
import { fetchTagCatalog, type TagChoice } from "@/lib/tags";
import { OnboardingFlow } from "./onboarding-flow";

/** El nombre del evento al que ibas, para que el botón final diga a dónde. */
async function eventNameFromNext(
  supabase: Awaited<ReturnType<typeof createClient>>,
  next: string,
): Promise<string | null> {
  const slug = next.match(/^\/e\/([^/?#]+)/)?.[1] ?? next.match(/[?&]e=([^&#]+)/)?.[1];
  if (!slug) return null;
  const { data } = await supabase.rpc("get_event_by_slug", {
    p_slug: decodeURIComponent(slug),
  });
  return data?.[0]?.name ?? null;
}

export default async function BienvenidaPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next: rawNext, error } = await searchParams;
  const next = safeNext(rawNext);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Al volver del login, el guard del destino traerá de vuelta aquí
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role, tags, intents, onboarded_at")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/login?error=sin-perfil");

  // La bienvenida es de una sola vez: después se edita en /perfil
  if (profile.onboarded_at) redirect(next);

  const [catalog, eventName] = await Promise.all([
    fetchTagCatalog(supabase),
    eventNameFromNext(supabase, next),
  ]);

  const toChoices = (
    slugs: string[],
    options: { slug: string; label: string }[],
  ): TagChoice[] =>
    slugs.map((slug) => ({
      slug,
      label: options.find((o) => o.slug === slug)?.label ?? slug,
    }));

  const firstName = profile.name?.split(" ")[0] ?? "";

  return (
    <main className="grain relative flex flex-1 flex-col items-center justify-center px-6 py-12">
      <CosmicSky seed={31} stars={100} milkyWay={false} nebulas="none" />

      <div className="relative z-10 flex w-full max-w-md flex-col gap-6">
        <p className="font-mono text-xs tracking-[0.3em] text-primary uppercase">
          [ {firstName ? `hola ${firstName.toLowerCase()}` : "bienvenida"} ]
        </p>

        {error && (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            No pudimos guardar tu estrella. Intenta de nuevo.
          </p>
        )}

        <OnboardingFlow
          eventName={eventName}
          next={next}
          roleOptions={catalog.rol}
          interestOptions={catalog.interes}
          intentOptions={catalog.intencion}
          initialRole={
            profile.role ? toChoices([profile.role], catalog.rol) : []
          }
          initialInterests={toChoices(profile.tags ?? [], catalog.interes)}
          initialIntents={toChoices(profile.intents ?? [], catalog.intencion)}
        />
      </div>
    </main>
  );
}
