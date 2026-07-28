"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseChoices, resolveTagChoices } from "@/lib/tags";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/perfil");

  const name = String(formData.get("name") ?? "").trim();
  const headline = String(formData.get("headline") ?? "").trim();

  if (!name) redirect("/perfil?error=falta-nombre");

  // Lo que escribas aquí también alimenta el catálogo: quien busque tu rol
  // después lo encontrará en vez de inventar un gemelo (ADR 0004).
  const [roles, tags, intents] = await Promise.all([
    resolveTagChoices(
      supabase,
      "rol",
      parseChoices(formData.get("role")).slice(0, 1),
    ),
    resolveTagChoices(
      supabase,
      "interes",
      parseChoices(formData.get("interests")),
    ),
    resolveTagChoices(
      supabase,
      "intencion",
      parseChoices(formData.get("intents")),
    ),
  ]);

  const { error } = await supabase
    .from("profiles")
    .update({
      name,
      headline: headline || null,
      role: roles[0] ?? null,
      tags,
      intents,
    })
    .eq("id", user.id);

  if (error) redirect("/perfil?error=no-guardado");

  redirect("/home");
}
