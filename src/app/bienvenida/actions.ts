"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/nav";
import { parseChoices, resolveTagChoices } from "@/lib/tags";

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const next = safeNext(String(formData.get("next") ?? ""));
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);

  // "lo hago después": la bienvenida no vuelve a aparecer, el perfil queda
  // vacío y /perfil sigue disponible. Nadie se queda atrapado en el evento.
  const skipped = formData.get("skip") === "1";

  const [roles, tags, intents] = skipped
    ? [[], [], []]
    : await Promise.all([
        resolveTagChoices(supabase, "rol", parseChoices(formData.get("role"))),
        resolveTagChoices(supabase, "interes", parseChoices(formData.get("interests"))),
        resolveTagChoices(supabase, "intencion", parseChoices(formData.get("intents"))),
      ]);

  const { error } = await supabase
    .from("profiles")
    .update({
      ...(skipped ? {} : { role: roles, tags, intents }),
      onboarded_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    redirect(
      `/bienvenida?next=${encodeURIComponent(next)}&error=no-guardado`,
    );
  }

  redirect(next);
}
