"use server";

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

  const { error } = await supabase.from("events").insert({
    slug,
    name,
    city: city || null,
    starts_at: date ? new Date(`${date}T09:00:00-05:00`).toISOString() : null,
    created_by: user.id,
  });
  if (error) redirect("/eventos/nuevo?error=no-creado");

  // El creador queda dentro de su propio evento de una vez
  redirect(`/e/${slug}`);
}
