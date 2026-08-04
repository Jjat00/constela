import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NO_INDEXAR } from "@/lib/seo";
import { fetchTagCatalog, labelFor } from "@/lib/tags";
import { CosmicSky, HaloEstelar } from "@/components/cosmos";
import { AutoConnect } from "./auto-connect";

/**
 * Abierta sin sesión —tiene que serlo: quien llega acaba de ser escaneado y
 * todavía no tiene cuenta— pero **nunca indexada**. La ficha existe para la
 * persona que tiene el QR delante, no para el archivo de un buscador: nadie
 * consintió que su nombre, su rol y su foto quedaran guardados en Google al
 * dejarse escanear en un evento.
 *
 * El título sí lleva el nombre porque es lo que se ve en la pestaña y en la
 * vista previa de un chat, que son los dos sitios donde este link vive.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_profile_by_slug", { p_slug: slug });
  const nombre = data?.[0]?.name as string | undefined;
  return {
    title: nombre ? `${nombre} en Constela` : "Una estrella de la constelación",
    description: nombre
      ? `${nombre} está en la constelación de su evento. Escanea su QR para conectar en persona.`
      : undefined,
    ...NO_INDEXAR,
  };
}

/**
 * La estrella detrás de un QR. Todo QR va clavado a una galaxia (ADR 0005):
 * `?e=` dice a cuál. Con sesión, siendo otra persona y con galaxia, ocurre el
 * encuentro completo (diseño 2c) — <AutoConnect /> une, traza la arista y
 * celebra con números reales. Sin `?e=` esta página es SOLO la ficha pública:
 * un QR sin galaxia no une ni conecta a nadie.
 */
export default async function PublicProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ e?: string }>;
}) {
  const [{ slug }, { e }] = await Promise.all([params, searchParams]);
  const eventSlug = typeof e === "string" && e.length > 0 ? e : null;

  const supabase = await createClient();
  const { data } = await supabase.rpc("get_profile_by_slug", {
    p_slug: slug,
  });

  const profile = data?.[0];
  if (!profile) notFound();

  // El catálogo es público: esta página también se ve sin sesión
  const catalog = await fetchTagCatalog(supabase);
  const roleLabels = ((profile.role ?? []) as string[]).map((slug) =>
    labelFor(catalog, "rol", slug),
  );
  const intentLabel = profile.intents?.[0]
    ? labelFor(catalog, "intencion", profile.intents[0])
    : null;
  const tagLabels = [
    ...((profile.tags ?? []) as string[]).map((slug) =>
      labelFor(catalog, "interes", slug),
    ),
    ...((profile.intents ?? []) as string[]).map((slug) =>
      labelFor(catalog, "intencion", slug),
    ),
  ];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isMe = user?.id === profile.id;

  // Esta página solo pinta la estrella. Unirse a la galaxia del QR y crear la
  // arista (ADR 0001: sin botón ni confirmación) ocurre en <AutoConnect />, que
  // invoca una server action desde el cliente — nunca durante el render de un
  // GET. El guard de la bienvenida (ADR 0004) vive en esa misma acción, después
  // de crear la conexión: redirigir aquí se llevaría al recién llegado antes de
  // que la arista exista, que es justo lo que ese ADR quiere evitar.

  if (user && !isMe && eventSlug) {
    const { data: myProfile } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", user.id)
      .single();

    return (
      <main className="grain relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 sm:py-16">
        <CosmicSky />
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center sm:max-w-md">
          <AutoConnect
            slug={slug}
            eventSlug={eventSlug}
            peer={{
              id: profile.id,
              name: profile.name,
              avatarUrl: profile.avatar_url,
              meta:
                [...roleLabels, intentLabel].filter(Boolean).join(" · ") ||
                null,
            }}
            me={{
              name: myProfile?.name ?? "Tú",
              avatarUrl: myProfile?.avatar_url ?? null,
            }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="grain relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 sm:py-16">
      <CosmicSky />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 text-center sm:max-w-md sm:gap-7">
        {/* La persona vive dentro de su estrella: el mismo tratamiento
            espectral del grafo, en grande — es la primera impresión */}
        <HaloEstelar id={profile.id} size={96} className="my-5">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt=""
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-card text-3xl font-bold text-estrella-a">
              {profile.name?.charAt(0)?.toUpperCase() ?? "✦"}
            </div>
          )}
        </HaloEstelar>

        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-[10px] tracking-widest text-faint uppercase">
            [ una estrella de la constelación ]
          </p>
          <h1 className="text-3xl font-bold tracking-snug text-balance sm:text-4xl">
            {profile.name}
          </h1>
          {profile.headline && (
            <p className="text-sm text-muted-foreground">{profile.headline}</p>
          )}
        </div>

        {(roleLabels.length > 0 || tagLabels.length > 0) && (
          <div className="flex flex-wrap justify-center gap-2">
            {roleLabels.map((label) => (
              <span
                key={label}
                className="chip-star px-3 py-1.5 text-xs font-medium"
                data-active="true"
              >
                {label}
              </span>
            ))}
            {tagLabels.map((label) => (
              <span key={label} className="chip-star px-3 py-1.5 text-xs">
                {label}
              </span>
            ))}
          </div>
        )}

        {isMe ? (
          <Link
            href="/qr"
            className="chip-star flex h-12 w-full items-center justify-center px-7 text-sm font-medium sm:w-auto"
          >
            Este eres tú — volver a mi QR
          </Link>
        ) : !user && eventSlug ? (
          <a
            href={`/login?next=${encodeURIComponent(`/u/${slug}?e=${eventSlug}`)}`}
            className="btn-cosmic flex h-13 w-full items-center justify-center px-7 text-[15px] font-medium sm:w-auto"
          >
            Entrar para conectar
          </a>
        ) : (
          // Link pelado, sin galaxia: solo la ficha. Conectar exige escanear
          // un QR de verdad — uno que siempre lleva a un evento (ADR 0005).
          <p className="max-w-xs font-mono text-xs leading-5 text-muted-foreground">
            para conectar con esta estrella, escanea su QR en un evento
          </p>
        )}
      </div>
    </main>
  );
}
