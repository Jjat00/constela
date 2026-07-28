import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchTagCatalog, labelFor } from "@/lib/tags";
import { CosmicSky, HaloEstelar } from "@/components/cosmos";
import { AutoConnect } from "./auto-connect";

/**
 * La estrella detrás de un QR. Sin sesión o si eres tú: la ficha pública.
 * Con sesión y siendo otra persona: el encuentro completo (diseño 2c) —
 * <AutoConnect /> traza la arista y celebra con números reales.
 */
export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data } = await supabase.rpc("get_profile_by_slug", {
    p_slug: slug,
  });

  const profile = data?.[0];
  if (!profile) notFound();

  // El catálogo es público: esta página también se ve sin sesión
  const catalog = await fetchTagCatalog(supabase);
  const roleLabel = profile.role
    ? labelFor(catalog, "rol", profile.role)
    : null;
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

  // Esta página solo pinta la estrella. Unirse al evento y crear la arista
  // (ADR 0001: sin botón ni confirmación) ocurre en <AutoConnect />, que invoca
  // una server action desde el cliente — nunca durante el render de un GET.
  // El guard de la bienvenida (ADR 0004) vive en esa misma acción, después de
  // crear la conexión: redirigir aquí se llevaría al recién llegado antes de
  // que la arista exista, que es justo lo que ese ADR quiere evitar.

  if (user && !isMe) {
    const { data: myProfile } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", user.id)
      .single();

    return (
      <main className="grain relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 sm:py-16">
        <CosmicSky seed={41} stars={130} nebulas="faint" />
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center sm:max-w-md">
          <AutoConnect
            slug={slug}
            peer={{
              id: profile.id,
              name: profile.name,
              avatarUrl: profile.avatar_url,
              meta:
                [roleLabel, intentLabel].filter(Boolean).join(" · ") || null,
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
      <CosmicSky seed={41} stars={130} nebulas="faint" />

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
          <p className="font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
            [ una estrella de la constelación ]
          </p>
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-balance sm:text-4xl">
            {profile.name}
          </h1>
          {profile.headline && (
            <p className="text-sm text-muted-foreground">{profile.headline}</p>
          )}
        </div>

        {(roleLabel || tagLabels.length > 0) && (
          <div className="flex flex-wrap justify-center gap-2">
            {roleLabel && (
              <span
                className="chip-star px-3 py-1.5 text-xs font-medium"
                data-active="true"
              >
                {roleLabel}
              </span>
            )}
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
        ) : (
          <a
            href={`/login?next=/u/${slug}`}
            className="btn-cosmic flex h-13 w-full items-center justify-center px-7 text-[15px] font-medium sm:w-auto"
          >
            Entrar para conectar
          </a>
        )}
      </div>
    </main>
  );
}
