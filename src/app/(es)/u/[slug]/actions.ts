"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ConnectResult =
  | {
      status: "conectados";
      eventName: string;
      eventSlug: string;
      /** Tus números en ESTE evento, ya con la arista nueva. */
      connections: number;
      triangles: number;
      /** Nombre del tercer vértice si este escaneo cerró un triángulo. */
      closedWith: string | null;
      /** La arista entre ustedes, para colgarle tu nota del encuentro. */
      connectionId: string | null;
      /** TU nota privada ya escrita, si el encuentro no es nuevo. */
      note: string | null;
    }
  | { status: "dueno-fuera" }
  | { status: "galaxia-no-existe" }
  | { status: "sin-sesion" }
  | { status: "error" };

/**
 * Conecta con la estrella del QR abierto (ADR 0001: sin botón ni confirmación).
 *
 * Vive en una acción y no en el render de la página a propósito: crear una
 * arista es una mutación, y en un Server Component se dispararía con cualquier
 * GET — un prefetch de Next o una recarga bastarían para "conocer" a alguien.
 *
 * Del cliente llegan el slug del dueño y el de la galaxia — exactamente lo que
 * el QR escaneado revela (ADR 0005: todo QR va clavado a un evento); la
 * identidad del escaneador se deriva siempre de la sesión, y la RPC valida en
 * el servidor que el dueño realmente pertenezca a esa galaxia.
 */
export async function connectOnScan(
  slug: string,
  eventSlug: string,
): Promise<ConnectResult> {
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

  // Une a la galaxia del QR y valida que su dueño siga dentro — la promesa
  // del QR se cumple entera o no se cumple (join_event_via_profile v3)
  const { data: joined } = await supabase.rpc("join_event_via_profile", {
    p_slug: slug,
    p_event_slug: eventSlug,
  });
  if (joined?.status === "dueno-fuera") return { status: "dueno-fuera" };
  if (joined?.status === "galaxia-no-existe" || joined?.status === "estrella-no-existe") {
    return { status: "galaxia-no-existe" };
  }
  if (joined?.status !== "ok") return { status: "error" };

  // Par canónico: el orden hex textual de los uuid coincide con el binario de PG
  const [a, b] =
    user.id < target.id ? [user.id, target.id] : [target.id, user.id];

  const { data: inserted, error } = await supabase
    .from("connections")
    .insert({
      event_id: joined.event_id,
      user_a: a,
      user_b: b,
      created_by: user.id,
    })
    .select("id")
    .single();

  // Una arista recién nacida no puede tener nota tuya; solo el camino 23505
  // (ya estaban conectados) busca la existente. El embed de connection_notes
  // vuelve ya filtrado a las tuyas por la RLS de solo-autor.
  let connectionId: string | null = inserted?.id ?? null;
  let note: string | null = null;
  if (error) {
    if (error.code !== "23505") return { status: "error" };
    const { data: existing } = await supabase
      .from("connections")
      .select("id, connection_notes(note)")
      .eq("event_id", joined.event_id)
      .eq("user_a", a)
      .eq("user_b", b)
      .maybeSingle();
    connectionId = existing?.id ?? null;
    note = existing?.connection_notes?.[0]?.note ?? null;
  }

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
    redirect(
      `/bienvenida?next=${encodeURIComponent(`/u/${slug}?e=${eventSlug}`)}`,
    );
  }

  // Los números del momento (diseño 2c): cuántas líneas tienes ya en este
  // evento, cuántos triángulos cierras y con quién se cerró este último.
  let connections = 0;
  let triangles = 0;
  let closedWith: string | null = null;
  const { data: graph } = await supabase.rpc("get_event_graph", {
    p_event_id: joined.event_id,
  });
  if (graph?.edges) {
    const edges = graph.edges as Array<{ source: string; target: string }>;
    const neighbors = new Map<string, Set<string>>();
    for (const e of edges) {
      if (!neighbors.has(e.source)) neighbors.set(e.source, new Set());
      if (!neighbors.has(e.target)) neighbors.set(e.target, new Set());
      neighbors.get(e.source)!.add(e.target);
      neighbors.get(e.target)!.add(e.source);
    }
    const mine = neighbors.get(user.id) ?? new Set<string>();
    connections = mine.size;
    for (const p of mine) {
      for (const q of neighbors.get(p) ?? []) {
        if (q !== user.id && mine.has(q) && p < q) triangles++;
      }
    }
    const shared = [...mine].filter(
      (id) => id !== target.id && neighbors.get(target.id)?.has(id),
    );
    if (shared.length > 0) {
      const nodes = (graph.nodes ?? []) as Array<{ id: string; name: string }>;
      closedWith = nodes.find((n) => n.id === shared[0])?.name ?? null;
    }
  }

  return {
    status: "conectados",
    eventName: joined.event_name,
    eventSlug: joined.event_slug,
    connections,
    triangles,
    closedWith,
    connectionId,
    note,
  };
}
