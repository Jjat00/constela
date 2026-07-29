import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuraSol } from "@/components/cosmos";
import { qrSvg } from "@/lib/qr";
import { fetchTagCatalog, labelFor } from "@/lib/tags";

/**
 * Tu QR (diseño 2b): tu estrella en oro, lista para que la escaneen.
 * La arista solo nace de un encuentro real — por eso esta pantalla es
 * la más importante del evento y vive a un tap.
 */
export default async function MyQrPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/qr");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, headline, qr_slug, role, avatar_url")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/login?error=sin-perfil");

  const [svg, catalog, { count: connectionCount }, { data: attendance }] =
    await Promise.all([
      qrSvg(`/u/${profile.qr_slug}`, "sol"),
      fetchTagCatalog(supabase),
      supabase
        .from("connections")
        .select("id", { count: "exact", head: true })
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`),
      supabase
        .from("event_attendees")
        .select("events(name)")
        .eq("user_id", user.id)
        .order("joined_at", { ascending: false })
        .limit(1),
    ]);

  const event = attendance?.[0]?.events;
  const eventName = (Array.isArray(event) ? event[0] : event)?.name;
  const roleLabel = profile.role
    ? labelFor(catalog, "rol", profile.role)
    : null;
  const magnitude = (1.1 + (connectionCount ?? 0) * 0.14).toFixed(1);

  return (
    <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-7 px-5 py-8 sm:px-8">
      <h1 className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
        [ TU ESTRELLA ]
      </h1>

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
          [ tu brillo en la red: conexiones × 0.14 + 1.1 ]
        </p>
      </div>

      <div className="flex max-w-xs flex-col items-center gap-2.5 text-center">
        <p className="text-sm leading-6 text-muted-foreground">
          Deja que te escaneen. La arista solo nace de un encuentro real.
        </p>
        {eventName ? (
          <p className="font-mono text-xs leading-5 text-muted-foreground">
            quien lo escanee entra a{" "}
            <span className="text-celeste">{eventName}</span> y quedan
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
          ¿el QR de un evento? cada uno tiene el suyo en{" "}
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
