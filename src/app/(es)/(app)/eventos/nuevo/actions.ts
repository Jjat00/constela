"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(name: string) {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/eventos/nuevo");

  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  if (!name) redirect("/eventos/nuevo?error=falta-nombre");

  // Sufijo aleatorio: evita colisiones y hace el slug no adivinable a ciegas
  const suffix = Math.random().toString(16).slice(2, 6);
  const slug = `${slugify(name) || "evento"}-${suffix}`;

  // RPC atómica (ADR 0005): evento + creador dentro + galaxia activa en un
  // solo gesto. La puerta /e/slug murió, así que nacer dentro ya no puede
  // depender de un auto-join posterior — y sin estar dentro, el QR clavado
  // del creador no tendría galaxia que prometer.
  const { error } = await supabase.rpc("create_event", {
    p_slug: slug,
    p_name: name,
    p_city: city || null,
    p_starts_at: date
      ? new Date(`${date}T09:00:00-05:00`).toISOString()
      : null,
  });
  if (error) redirect("/eventos/nuevo?error=no-creado");

  // La galaxia activa cambió: el chrome del layout debe enterarse
  revalidatePath("/", "layout");
  redirect("/home");
}
