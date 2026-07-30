import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CosmicSky } from "@/components/cosmos";
import { safeNext } from "@/lib/nav";
import { fetchTagCatalog, type TagChoice } from "@/lib/tags";
import { OnboardingFlow } from "./onboarding-flow";

/** El nombre del evento al que ibas, para hablar de SU constelación. */
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

/**
 * Bienvenida (diseño 2a): una pantalla, un tap. Ya estás dentro — solo
 * falta decir qué haces para aparecer en el cielo.
 */
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

  return (
    <main className="grain relative flex flex-1 flex-col justify-center px-6 py-12 lg:px-16">
      <CosmicSky />

      <div className="relative z-10 mx-auto grid w-full max-w-md gap-8 lg:max-w-5xl lg:grid-cols-[1fr_30rem] lg:items-center lg:gap-16">
        <header className="flex flex-col gap-5">
          <p className="font-mono text-[11px] tracking-wider text-faint">
            [ PASO 1 DE 1 ]
          </p>
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] font-bold tracking-tighter text-balance">
            Ya estás <span className="text-celeste">dentro.</span>
          </h1>
          <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground lg:text-lg">
            {eventName
              ? `Ya perteneces a la constelación de ${eventName}. Dinos qué haces y apareces en el cielo.`
              : "Dinos qué haces y apareces en el cielo del evento."}
          </p>
          {error && (
            <p className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              No pudimos guardar tu estrella. Intenta de nuevo.
            </p>
          )}
        </header>

        <OnboardingFlow
          eventName={eventName}
          next={next}
          roleOptions={catalog.rol}
          interestOptions={catalog.interes}
          intentOptions={catalog.intencion}
          initialRole={toChoices(profile.role ?? [], catalog.rol)}
          initialInterests={toChoices(profile.tags ?? [], catalog.interes)}
          initialIntents={toChoices(profile.intents ?? [], catalog.intencion)}
        />
      </div>
    </main>
  );
}
