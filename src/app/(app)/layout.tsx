/*
 * Contrato de dirección (Impeccable · new-work §5)
 *
 * THESIS: la app es una sala de observación dentro del universo del evento;
 * rechaza el patrón "páginas con header" del SaaS.
 * OWN-WORLD: el fondo premium del hero a pantalla completa — gradiente
 * #070A12 en silencio, sin estrellas ni nebulosas: la única luz es el grafo —
 * + cristal (blur 26, borde blanco 8%) + chrome cosmic blue #4EA8FF /
 * celeste #9DC8FF; el oro #FFD97A existe solo para "tú"; H-alfa #F0699F solo
 * para cierres triádicos. Geist-led.
 * STORY: quien entra ve su constelación real respirando y entiende que su red
 * ES este universo; la única forma de crecerlo es encontrarse en persona.
 * FIRST VIEWPORT: sidebar de cristal izquierda, grafo protagonista al centro
 * bajo la barra de búsqueda, rail derecho de datos reales; móvil = grafo
 * casi completo + controles del pulgar.
 * FORM: dirección pineada por el usuario (proyecto claude.ai/design «Constela
 * UI design options», Constela.dc.html, 2026-07-28).
 */
import { AppNav } from "@/components/app-nav";
import { CosmicSky } from "@/components/cosmos";
import { resolveActiveEvent } from "@/lib/active-event";
import { createClient } from "@/lib/supabase/server";
import { fetchTagCatalog, labelFor } from "@/lib/tags";

/**
 * Shell de la app con sesión (`/home`, `/eventos`, `/qr`, `/perfil`,
 * `/ajustes`). Fuera del grupo quedan la landing, el login, `/u/[slug]`
 * (se abre desde un QR: es una primera impresión, sin navegación) y
 * `/e/[slug]` (ficha gated con su propia vuelta a `/eventos`).
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // La identidad del sidebar y tu galaxia activa (la nav la hace visible en
  // todas las pantallas); si no hay sesión, cada página redirige sola.
  let identity = null;
  let activeEvent = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, headline, role, avatar_url, active_event_id")
      .eq("id", user.id)
      .single();
    activeEvent = await resolveActiveEvent(
      supabase,
      user.id,
      profile?.active_event_id ?? null,
    );
    if (profile) {
      let subtitle: string | null = profile.headline;
      if (!subtitle && profile.role?.length) {
        const catalog = await fetchTagCatalog(supabase);
        subtitle = (profile.role as string[])
          .map((r) => labelFor(catalog, "rol", r))
          .join(" · ");
      }
      identity = {
        name: profile.name,
        subtitle,
        avatarUrl: profile.avatar_url,
      };
    }
  }

  return (
    <div className="grain relative flex flex-1 flex-col">
      {/* El cosmos es la sala: el mismo vacío premium de la landing */}
      <CosmicSky className="fixed inset-0" />

      <AppNav
        identity={identity}
        activeEvent={
          activeEvent && { name: activeEvent.name, slug: activeEvent.slug }
        }
      />

      {/* Móvil: aire para las pills de arriba y la barra del pulgar.
          Desktop: el sidebar (w-56 + márgenes) flota a la izquierda. */}
      <div className="relative z-10 flex flex-1 flex-col pt-[calc(4.25rem+env(safe-area-inset-top))] pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pt-0 lg:pb-0 lg:pl-[16.5rem]">
        {children}
      </div>
    </div>
  );
}
