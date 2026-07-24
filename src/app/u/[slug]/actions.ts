"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function connectWithProfile(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const note = String(formData.get("note") ?? "")
    .trim()
    .slice(0, 280);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/u/${slug}`);

  // Asegura el evento común (membresía contagiosa, idempotente) y lo devuelve
  const { data: joined } = await supabase.rpc("join_event_via_profile", {
    p_slug: slug,
  });
  const event = joined?.[0];
  if (!event) redirect(`/u/${slug}?error=sin-evento`);

  const { data: profiles } = await supabase.rpc("get_profile_by_slug", {
    p_slug: slug,
  });
  const target = profiles?.[0];
  if (!target || target.id === user.id) redirect(`/u/${slug}`);

  // Par canónico: el orden hex textual de los uuid coincide con el binario de PG
  const [a, b] =
    user.id < target.id ? [user.id, target.id] : [target.id, user.id];

  const { error } = await supabase.from("connections").insert({
    event_id: event.event_id,
    user_a: a,
    user_b: b,
    note: note || null,
    created_by: user.id,
  });

  // 23505 = ya estaban conectados en este evento: no es un error
  if (error && error.code !== "23505") {
    redirect(`/u/${slug}?error=no-conectado`);
  }

  redirect(`/home?e=${event.event_slug}`);
}
