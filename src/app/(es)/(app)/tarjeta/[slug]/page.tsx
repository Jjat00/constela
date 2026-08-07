import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { TarjetaEstelar } from "@/components/tarjeta-estelar";
import { conProtocolo, handleGithub, handleInstagram } from "@/lib/canales";
import { timeAgo } from "@/lib/format";
import { qrSvg, siteUrl } from "@/lib/qr";
import { createClient } from "@/lib/supabase/server";
import { fetchTagCatalog, labelFor } from "@/lib/tags";
import { CompartirTarjeta } from "./compartir";

/** Las señales que caben dentro de la tarjeta; el resto se cuenta. */
const TAGS_EN_TARJETA = 4;

type Canal = {
  key: string;
  /** La etiqueta mono del canal: Constela no pone logotipos ajenos. */
  label: string;
  display: string;
  href: string;
};

function dominio(url: string) {
  try {
    return new URL(conProtocolo(url)).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** «@nadie» y «nadie» son la misma persona: el arroba lo pone la tarjeta. */
const handle = (valor: string) => valor.trim().replace(/^@/, "");

function linkedin(valor: string): Canal | null {
  const v = valor.trim();
  if (!v) return null;
  if (/linkedin\.com/i.test(v)) {
    const partes = new URL(conProtocolo(v)).pathname.split("/").filter(Boolean);
    return {
      key: "linkedin",
      label: "linkedin",
      display: partes[partes.length - 1] ?? dominio(v),
      href: conProtocolo(v),
    };
  }
  const h = handle(v);
  return {
    key: "linkedin",
    label: "linkedin",
    display: h,
    href: `https://linkedin.com/in/${h}`,
  };
}

/**
 * Los canales de la persona. El WhatsApp es un teléfono, no un perfil
 * público: solo aparece si ya se cruzaron en persona (o si es tu propia
 * tarjeta). Lo demás — web, LinkedIn, GitHub, Instagram — ya es público
 * donde vive, así que la tarjeta no se lo guarda.
 */
function canalesDe(
  p: {
    website: string | null;
    instagram: string | null;
    linkedin: string | null;
    github: string | null;
    whatsapp_number: string | null;
  },
  puedeVerPrivados: boolean,
): Canal[] {
  const canales: Canal[] = [];
  if (p.website?.trim()) {
    canales.push({
      key: "web",
      label: "web",
      display: dominio(p.website),
      href: conProtocolo(p.website),
    });
  }
  const li = p.linkedin?.trim() ? linkedin(p.linkedin) : null;
  if (li) canales.push(li);
  if (p.github?.trim()) {
    const h = handleGithub(p.github);
    canales.push({
      key: "github",
      label: "github",
      display: h,
      href: `https://github.com/${h}`,
    });
  }
  if (p.instagram?.trim()) {
    const h = handleInstagram(p.instagram);
    canales.push({
      key: "instagram",
      label: "instagram",
      display: `@${h}`,
      href: `https://instagram.com/${h}`,
    });
  }
  if (puedeVerPrivados && p.whatsapp_number?.trim()) {
    const digitos = p.whatsapp_number.replace(/\D/g, "");
    if (digitos) {
      canales.push({
        key: "whatsapp",
        label: "whatsapp",
        display: p.whatsapp_number.trim(),
        href: `https://wa.me/${digitos}`,
      });
    }
  }
  return canales;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("name")
    .eq("qr_slug", slug)
    .maybeSingle();
  return {
    title: data?.name
      ? `Tarjeta de ${data.name} — Constela`
      : "Tarjeta — Constela",
  };
}

/**
 * La tarjeta de presentación de una estrella. Se llega desde el MiniPerfil
 * del mapa: tocar a alguien enseña quién es en una ficha; esta vista es lo
 * que esa persona te entregaría en la mano.
 *
 * Vive dentro del shell con sesión: la constelación de un evento no es un
 * directorio público, y sus canales de contacto tampoco.
 */
export default async function TarjetaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/tarjeta/${slug}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, name, headline, role, tags, intents, avatar_url, qr_slug, website, instagram, linkedin, github, whatsapp_number",
    )
    .eq("qr_slug", slug)
    .maybeSingle();
  if (!profile) notFound();

  const isMe = profile.id === user.id;

  // Nuestra arista, si existe. RLS solo deja ver las mías (`connections_
  // select_own`), así que basta con pedir aquellas donde la otra persona es
  // extremo: lo que vuelva es necesariamente el encuentro entre los dos. El
  // embed de connection_notes vuelve ya filtrado por la RLS de solo-autor:
  // la nota que se muestra aquí es LA MÍA sobre ese encuentro (0014).
  let encuentro: string | null = null;
  let nota: string | null = null;
  if (!isMe) {
    const { data: link } = await supabase
      .from("connections")
      .select("created_at, events(name), connection_notes(note)")
      .or(`user_a.eq.${profile.id},user_b.eq.${profile.id}`)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (link) {
      const evento = Array.isArray(link.events) ? link.events[0] : link.events;
      encuentro = `se cruzaron${evento?.name ? ` en ${evento.name}` : ""} · ${timeAgo(link.created_at)}`;
      nota = link.connection_notes?.[0]?.note ?? null;
    }
  }

  const catalog = await fetchTagCatalog(supabase);
  const roleLabel = (profile.role as string[] | null)?.length
    ? (profile.role as string[]).map((r) => labelFor(catalog, "rol", r)).join(" · ")
    : null;
  const señales = [
    ...((profile.intents ?? []) as string[]).map((s) =>
      labelFor(catalog, "intencion", s),
    ),
    ...((profile.tags ?? []) as string[]).map((s) =>
      labelFor(catalog, "interes", s),
    ),
  ];

  const rutaPublica = `/u/${profile.qr_slug}`;
  const urlPublica = `${siteUrl()}${rutaPublica}`;
  // El QR de la tarjeta va sin `?e=`: abre su ficha y no conecta a nadie
  // (ADR 0001) — para eso está el QR de verdad, escaneado en persona.
  const qrMarkup = await qrSvg(rutaPublica, isMe ? "sol" : "night");
  const canales = canalesDe(profile, isMe || encuentro !== null);

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-7 px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex w-full items-center justify-between gap-3">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wide text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          volver al mapa
        </Link>
        <p className="font-mono text-[10px] tracking-wider text-faint uppercase">
          [ tarjeta de presentación ]
        </p>
      </div>

      <h1 className="sr-only">
        {isMe ? "Tu tarjeta de presentación" : `Tarjeta de ${profile.name}`}
      </h1>

      <TarjetaEstelar
        id={profile.id}
        name={profile.name}
        headline={profile.headline}
        roleLabel={roleLabel}
        tags={señales.slice(0, TAGS_EN_TARJETA)}
        extraTags={Math.max(0, señales.length - TAGS_EN_TARJETA)}
        avatarUrl={profile.avatar_url}
        isMe={isMe}
        qrMarkup={qrMarkup}
        publicUrl={urlPublica.replace(/^https?:\/\//, "")}
        encuentro={encuentro}
      />

      {nota && (
        <p className="max-w-md text-center text-sm leading-6 text-muted-foreground">
          &quot;{nota}&quot;
        </p>
      )}

      {/* Los canales: la parte útil de una tarjeta. Etiqueta mono + el dato
          tal como lo escribió su dueño — sin logotipos de terceros. */}
      {canales.length > 0 ? (
        <section className="flex w-full max-w-md flex-col gap-2.5">
          <p className="font-mono text-[10px] tracking-wider text-faint uppercase">
            [ dónde encontrarle ]
          </p>
          <div className="flex flex-wrap gap-2">
            {canales.map((canal) => (
              <a
                key={canal.key}
                href={canal.href}
                target="_blank"
                rel="noopener noreferrer"
                className="chip-star inline-flex min-h-11 items-center gap-2 px-3.5 py-2 text-[13px]"
              >
                <span className="font-mono text-[10px] tracking-wide text-faint">
                  {canal.label}
                </span>
                <span className="max-w-40 truncate font-medium text-foreground">
                  {canal.display}
                </span>
                <ExternalLink className="size-3.5 shrink-0" aria-hidden />
              </a>
            ))}
          </div>
          {!isMe && !encuentro && profile.whatsapp_number && (
            <p className="font-mono text-[11px] leading-5 text-muted-foreground">
              su whatsapp se abre cuando se crucen en persona
            </p>
          )}
        </section>
      ) : (
        <p className="max-w-sm text-center font-mono text-xs leading-5 text-muted-foreground">
          {isMe
            ? "tu tarjeta aún no lleva canales — añádelos en tu perfil"
            : "esta estrella todavía no ha dejado ningún canal"}
        </p>
      )}

      <div className="flex w-full max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
        <CompartirTarjeta url={urlPublica} name={profile.name} isMe={isMe} />
        {isMe ? (
          <Link
            href="/perfil"
            className="btn-cosmic inline-flex h-11 items-center justify-center px-5 text-[13px] font-medium"
          >
            Editar tu tarjeta
          </Link>
        ) : (
          <Link
            href={rutaPublica}
            className="chip-star inline-flex h-11 items-center justify-center px-5 text-[13px] font-medium"
          >
            Ver su ficha pública
          </Link>
        )}
      </div>
    </main>
  );
}
