"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/perfil");

  const name = String(formData.get("name") ?? "").trim();
  const headline = String(formData.get("headline") ?? "").trim();
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 3);

  if (!name) redirect("/perfil?error=falta-nombre");

  const { error } = await supabase
    .from("profiles")
    .update({ name, headline: headline || null, tags })
    .eq("id", user.id);

  if (error) redirect("/perfil?error=no-guardado");

  redirect("/home");
}
