import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveActiveEvent } from "@/lib/active-event";
import { AuraSol, Galaxia } from "@/components/cosmos";
import { qrSvg } from "@/lib/qr";
import { fetchTagCatalog, labelFor } from "@/lib/tags";

/**
 * Tu QR (diseño 2b): tu estrella en oro, lista para que la escaneen.
 * La arista solo nace de un encuentro real — por eso esta pantalla es
 * la más importante del evento y vive a un tap. Todo aquí pertenece a tu
 * evento activo: quien te escanee entra a ESE evento, y la magnitud que
 * muestras es tu brillo en ESA galaxia.
 */
export default async function MyQrPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/qr");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, headline, qr_slug, role, avatar_url, active_event_id")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/login?error=sin-perfil");

  const activeEvent = await resolveActiveEvent(
    supabase,
    user.id,
    profile.active_event_id,
  );

  // Sin evento, las conexiones son cero por definición: la arista vive
  // dentro de un evento — el conteo global aquí mentiría sobre esta galaxia
  const connectionsQuery = supabase
    .from("connections")
    .select("id", { count: "exact", head: true })
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);
  const [svg, catalog, { count: connectionCount }] = await Promise.all([
    qrSvg(`/u/${profile.qr_slug}`, "sol"),
    fetchTagCatalog(supabase),
    activeEvent
      ? connectionsQuery.eq("event_id", activeEvent.id)
      : connectionsQuery,
  ]);

  const roleLabel = profile.role?.length
    ? (profile.role as string[])
        .map((r) => labelFor(catalog, "rol", r))
        .join(" · ")
    : null;
  const magnitude = (1.1 + (connectionCount ?? 0) * 0.14).toFixed(1);

  return (
    <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-7 px-5 py-8 sm:px-8">
      {/* A qué galaxia pertenece este QR — la promesa del escaneo, arriba */}
      {activeEvent ? (
        <div className="flex flex-col items-center gap-3">
          <h1 className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            [ TU ESTRELLA EN ]
          </h1>
          <Link
            href="/eventos"
            className="glass flex max-w-[85vw] items-center gap-2.5 rounded-full py-1.5 pr-4 pl-2 transition-colors hover:border-celeste/35"
          >
            <Galaxia
              seed={activeEvent.slug.charCodeAt(0)}
              size={30}
              active
            />
            <span className="truncate text-sm font-semibold">
              {activeEvent.name}
            </span>
            <span className="shrink-0 font-mono text-[10px] tracking-[0.08em] text-celeste">
              cambiar
            </span>
          </Link>
        </div>
      ) : (
        <h1 className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          [ TU ESTRELLA ]
        </h1>
      )}

      {/* El QR dorado: cristal con borde de oro y la luz de tu corona */}
      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-8 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,217,122,0.22) 0%, transparent 70%)",
            filter: "blur(24px)",
          }}
        />
        <div className="relative rounded-4xl border border-sol/30 bg-sol/[0.04] p-6 backdrop-blur-xl">
          <div
            className="w-[min(14rem,58vw)] [&_svg]:h-auto [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="relative size-14">
          <AuraSol size={56} />
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt=""
              className="relative z-1 size-14 rounded-full border border-sol/50 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="relative z-1 flex size-14 items-center justify-center rounded-full border border-sol/50 bg-card text-lg font-semibold text-sol">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <p className="text-[22px] font-semibold tracking-tight">
          {profile.name}
        </p>
        <p className="font-mono text-[10px] tracking-[0.18em] text-sol uppercase">
          {roleLabel ? `${roleLabel} · ` : ""}MAG {magnitude}
        </p>
        <p className="font-mono text-[9px] tracking-[0.16em] text-muted-foreground">
          {activeEvent
            ? "[ tu brillo en esta galaxia: conexiones × 0.14 + 1.1 ]"
            : "[ tu brillo en la red: conexiones × 0.14 + 1.1 ]"}
        </p>
      </div>

      <div className="flex max-w-xs flex-col items-center gap-2.5 text-center">
        <p className="text-sm leading-6 text-muted-foreground">
          Deja que te escaneen. La arista solo nace de un encuentro real.
        </p>
        {activeEvent ? (
          <p className="font-mono text-xs leading-5 text-muted-foreground">
            quien lo escanee entra a{" "}
            <span className="text-celeste">{activeEvent.name}</span> y quedan
            conectados
          </p>
        ) : (
          <p className="font-mono text-xs leading-5 text-muted-foreground">
            entra a un evento para que tu QR conecte — hoy solo muestra tu
            estrella
          </p>
        )}
        {/* Dos QRs distintos (CONTEXT.md): este es el tuyo; la puerta de
            cada evento tiene el suyo propio en su página */}
        <p className="font-mono text-xs leading-5 text-muted-foreground">
          ¿el QR del evento? cada uno tiene el suyo en{" "}
          <Link
            href="/eventos"
            className="text-celeste underline-offset-4 hover:underline"
          >
            tus eventos
          </Link>
        </p>
        <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
          [ sube el brillo de la pantalla ]
        </p>
      </div>
    </main>
  );
}
