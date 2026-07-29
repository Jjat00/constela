import type { SupabaseClient } from "@supabase/supabase-js";

export type ActiveEvent = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  starts_at: string | null;
};

const EVENT_COLUMNS = "id, name, slug, city, starts_at";

/**
 * El evento activo del usuario: el que eligió explícitamente
 * (`profiles.active_event_id`) o, si aún no eligió ninguno, el último al que
 * entró. Toda vista event-scoped (universo, QR, nav) debe salir de aquí —
 * nunca recalcular "el más reciente" por su cuenta.
 */
export async function resolveActiveEvent(
  supabase: SupabaseClient,
  userId: string,
  activeEventId: string | null,
): Promise<ActiveEvent | null> {
  if (activeEventId) {
    const { data: event } = await supabase
      .from("events")
      .select(EVENT_COLUMNS)
      .eq("id", activeEventId)
      .single();
    if (event) return event as ActiveEvent;
  }

  const { data: attendance } = await supabase
    .from("event_attendees")
    .select(`joined_at, events(${EVENT_COLUMNS})`)
    .eq("user_id", userId)
    .order("joined_at", { ascending: false })
    .limit(1);
  const event = attendance?.[0]?.events;
  return ((Array.isArray(event) ? event[0] : event) as ActiveEvent) ?? null;
}
