/*
 * Contrato de dirección (Impeccable · new-work §5)
 *
 * THESIS: la app es un command center dentro del universo del evento; rechaza
 * el patrón "páginas con header" del SaaS.
 * OWN-WORLD: cosmos vivo a pantalla completa (estrellas espectrales, nebulosas
 * en deriva, planeta-horizonte) + cristal (blur, borde blanco 8%) + chrome
 * nebula purple #6E63FF; el oro #FFD97A existe solo para "tú". Geist-led.
 * STORY: quien entra ve su constelación real respirando y entiende que su red
 * ES este universo; la única forma de crecerlo es encontrarse en persona.
 * FIRST VIEWPORT: sidebar de cristal izquierda, grafo protagonista al centro
 * con "Tu red es tu universo.", rail derecho de datos reales; móvil = grafo
 * casi completo + barra de pulgar.
 * FORM: dirección pineada por el usuario (imagen de referencia + master
 * prompt, 2026-07-28); sin tirada de concept-seed.
 */
import { AppNav } from "@/components/app-nav";
import { CosmicSky, Planeta } from "@/components/cosmos";
import { createClient } from "@/lib/supabase/server";
import { fetchTagCatalog, labelFor } from "@/lib/tags";

/**
 * Shell de la app con sesión (`/home`, `/eventos`, `/qr`, `/perfil`).
 * Las páginas públicas — landing, login, `/e/[slug]`, `/u/[slug]` — quedan
 * fuera del grupo: se abren desde un QR y no deben mostrar navegación.
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

  // La identidad del sidebar; si no hay sesión, cada página redirige sola.
  let identity = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, headline, role, avatar_url")
      .eq("id", user.id)
      .single();
    if (profile) {
      const subtitle =
        profile.headline ??
        (profile.role
          ? labelFor(await fetchTagCatalog(supabase), "rol", profile.role)
          : null);
      identity = {
        name: profile.name,
        subtitle,
        avatarUrl: profile.avatar_url,
      };
    }
  }

  return (
    <div className="grain relative flex flex-1 flex-col">
      {/* El cosmos es la sala: el shell entero vive dentro del universo */}
      <CosmicSky
        seed={11}
        stars={190}
        milkyWay
        nebulas="rich"
        shootingStar
        className="fixed inset-0"
      />
      {/* Horizonte planetario: escala de cabina orbital, nunca tras el texto */}
      <Planeta
        size={640}
        className="fixed -bottom-[27rem] -left-[16rem] z-0 hidden opacity-80 lg:block"
      />
      <Planeta
        size={430}
        className="fixed -right-[14rem] -bottom-[19rem] z-0 opacity-70 lg:hidden"
      />

      <AppNav identity={identity} />

      {/* Móvil: aire para las pills de arriba y la barra del pulgar.
          Desktop: el sidebar flota a la izquierda. */}
      <div className="relative z-10 flex flex-1 flex-col pt-[calc(4.25rem+env(safe-area-inset-top))] pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pt-0 lg:pb-0 lg:pl-[17rem]">
        {children}
      </div>
    </div>
  );
}
