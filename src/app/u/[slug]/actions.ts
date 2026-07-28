"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ConnectResult =
  | { status: "conectados"; eventName: string; eventSlug: string }
  | { status: "sin-evento" }
  | { status: "sin-sesion" }
  | { status: "error" };

/**
 * Conecta con la estrella del QR abierto (ADR 0001: sin botón ni confirmación).
 *
 * Vive en una acción y no en el render de la página a propósito: crear una
 * arista es una mutación, y en un Server Component se dispararía con cualquier
 * GET — un prefetch de Next o una recarga bastarían para "conocer" a alguien.
 *
 * El único dato que llega del cliente es el slug, que es justo lo que revela un
 * QR escaneado; la identidad y el evento se derivan siempre de la sesión.
 */
export async function connectOnScan(slug: string): Promise<ConnectResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "sin-sesion" };

  const { data: profiles } = await supabase.rpc("get_profile_by_slug", {
    p_slug: slug,
  });
  const target = profiles?.[0];
  if (!target || target.id === user.id) return { status: "error" };

  // Membresía contagiosa: entrar al evento del otro es parte del mismo gesto
  const { data: joined } = await supabase.rpc("join_event_via_profile", {
    p_slug: slug,
  });
  const event = joined?.[0];
  if (!event) return { status: "sin-evento" };

  // Par canónico: el orden hex textual de los uuid coincide con el binario de PG
  const [a, b] =
    user.id < target.id ? [user.id, target.id] : [target.id, user.id];

  const { error } = await supabase.from("connections").insert({
    event_id: event.event_id,
    user_a: a,
    user_b: b,
    created_by: user.id,
  });

  // 23505 = ya estaban conectados en este evento: mismo estado feliz
  if (error && error.code !== "23505") return { status: "error" };

  // Primera vez en Constela: la bienvenida va DESPUÉS de conectar, para no
  // perder el encuentro si alguien abandona el onboarding (ADR 0004). Por eso
  // el guard vive aquí y no en el render de la página: en ese punto la arista
  // ya existe, así que abandonar la bienvenida no cuesta nada.
  const { data: me } = await supabase
    .from("profiles")
    .select("onboarded_at")
    .eq("id", user.id)
    .single();
  if (me && !me.onboarded_at) {
    redirect(`/bienvenida?next=${encodeURIComponent(`/u/${slug}`)}`);
  }

  return {
    status: "conectados",
    eventName: event.event_name,
    eventSlug: event.event_slug,
  };
}
