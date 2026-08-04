"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Cambiar de evento es un gesto explícito: fija `active_event_id` y aterriza
 * en su universo. Vive en una acción y no en un GET a propósito: un prefetch
 * jamás debe cambiarte de galaxia.
 */
export async function activateEvent(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/eventos");
  if (!slug) redirect("/eventos");

  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("slug", slug)
    .single();

  // Solo un evento donde ya estás puede volverse tu evento activo
  if (event) {
    const { count } = await supabase
      .from("event_attendees")
      .select("event_id", { count: "exact", head: true })
      .eq("event_id", event.id)
      .eq("user_id", user.id);
    if (count) {
      await supabase
        .from("profiles")
        .update({ active_event_id: event.id })
        .eq("id", user.id);
    }
  }

  // El «estás en …» vive en el layout de (app), y el redirect de una acción
  // navega en suave reutilizando el layout ya montado: sin revalidarlo, el
  // sidebar seguiría mostrando la galaxia anterior.
  revalidatePath("/", "layout");
  redirect("/home");
}
