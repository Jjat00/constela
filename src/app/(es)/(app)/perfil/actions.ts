"use server";

import { redirect } from "next/navigation";
import { handleGithub, handleInstagram } from "@/lib/canales";
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
  const website = String(formData.get("website") ?? "").trim();
  // Se guarda el handle destilado: «@nadie» o la URL completa acaban igual.
  const instagram = handleInstagram(String(formData.get("instagram") ?? ""));
  const linkedin = String(formData.get("linkedin") ?? "").trim();
  const github = handleGithub(String(formData.get("github") ?? ""));
  const whatsapp_number = String(formData.get("whatsapp_number") ?? "").trim();

  if (!name) redirect("/perfil?error=falta-nombre");

  // Lo que escribas aquí también alimenta el catálogo: quien busque tu rol
  // después lo encontrará en vez de inventar un gemelo (ADR 0004).
  const [roles, tags, intents] = await Promise.all([
    resolveTagChoices(
      supabase,
      "rol",
      parseChoices(formData.get("role")),
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
      role: roles.length > 0 ? roles : [],
      tags,
      intents,
      website: website || null,
      instagram: instagram || null,
      linkedin: linkedin || null,
      github: github || null,
      whatsapp_number: whatsapp_number || null,
    })
    .eq("id", user.id);

  if (error) redirect("/perfil?error=no-guardado");

  // Ajustes es un lugar donde te quedas (diseño 3a): confirma sin sacarte
  redirect("/perfil?ok=1");
}
