import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchTagCatalog, labelFor } from "@/lib/tags";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AutoConnect } from "./auto-connect";

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

  return (
    <main className="grain relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[24rem] w-[38rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.8 0.14 70 / 55%), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 text-center sm:max-w-md sm:gap-7">
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt=""
            className="node-glow size-20 rounded-full border border-border sm:size-24"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="node-glow flex size-20 items-center justify-center rounded-full bg-primary font-display text-3xl font-bold text-primary-foreground sm:size-24 sm:text-4xl">
            {profile.name?.charAt(0)?.toUpperCase() ?? "✦"}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
            [ una estrella de la constelación ]
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {profile.name}
          </h1>
          {profile.headline && (
            <p className="text-sm text-muted-foreground">{profile.headline}</p>
          )}
        </div>

        {(roleLabel || tagLabels.length > 0) && (
          <div className="flex flex-wrap justify-center gap-2">
            {roleLabel && <Badge className="text-xs">{roleLabel}</Badge>}
            {tagLabels.map((label) => (
              <Badge key={label} variant="outline" className="text-xs">
                {label}
              </Badge>
            ))}
          </div>
        )}

        {isMe ? (
          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-full sm:w-auto sm:px-7"
          >
            <Link href="/qr">Este eres tú ✦ volver a mi QR</Link>
          </Button>
        ) : user ? (
          <AutoConnect slug={slug} />
        ) : (
          <Button
            asChild
            size="lg"
            className="node-glow h-12 w-full rounded-full px-7 sm:w-auto"
          >
            <a href={`/login?next=/u/${slug}`}>Entrar para conectar</a>
          </Button>
        )}
      </div>
    </main>
  );
}
