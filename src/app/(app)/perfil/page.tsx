import Link from "next/link";
import { redirect } from "next/navigation";
import { QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fetchTagCatalog, labelFor, type TagChoice } from "@/lib/tags";
import { HaloEstelar } from "@/components/cosmos";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/perfil");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, headline, role, tags, intents, avatar_url")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/login?error=sin-perfil");

  const catalog = await fetchTagCatalog(supabase);
  const toChoices = (
    slugs: string[] | null,
    category: Parameters<typeof labelFor>[1],
  ): TagChoice[] =>
    (slugs ?? []).map((slug) => ({
      slug,
      label: labelFor(catalog, category, slug),
    }));

  const roleChoices = toChoices(profile.role ? [profile.role] : [], "rol");
  const interestChoices = toChoices(profile.tags, "interes");
  const intentChoices = toChoices(profile.intents, "intencion");

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col gap-7 px-5 py-8 sm:px-8 lg:gap-9 lg:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 hidden h-[28rem] w-[44rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl sm:block"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.89 0.11 90 / 55%), transparent 70%)",
        }}
      />

      <header className="relative z-10 flex flex-col gap-3">
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
          [ tu estrella ]
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Así te <span className="text-sol">ven</span>
        </h1>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Todo opcional: tu titular y tus temas ayudan a que las conexiones
          recuerden de qué hablaron contigo.
        </p>
      </header>

      {error && (
        <p className="relative z-10 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error === "falta-nombre"
            ? "Tu estrella necesita un nombre."
            : "No pudimos guardar. Intenta de nuevo."}
        </p>
      )}

      <div className="relative z-10 flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,17.5rem)_1fr] lg:items-start lg:gap-8">
        {/* Cómo se ve tu estrella hoy — el lado que los demás encuentran */}
        <aside className="glass hidden flex-col items-center gap-5 rounded-3xl p-6 text-center lg:flex">
          <HaloEstelar id={user.id} size={104}>
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt=""
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-card text-3xl font-bold text-sol">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </HaloEstelar>
          <div className="flex flex-col gap-1">
            <p className="text-lg leading-tight font-semibold">
              {profile.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {profile.headline ??
                (roleChoices[0]?.label || "aún sin titular")}
            </p>
          </div>
          {(roleChoices.length > 0 || interestChoices.length > 0) && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {roleChoices.map((choice) => (
                <Badge key={`rol-${choice.label}`} className="text-xs">
                  {choice.label}
                </Badge>
              ))}
              {interestChoices.map((choice) => (
                <Badge
                  key={`interes-${choice.label}`}
                  variant="outline"
                  className="text-xs"
                >
                  {choice.label}
                </Badge>
              ))}
            </div>
          )}
          <Link
            href="/qr"
            className="flex items-center gap-2 font-mono text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            <QrCode className="size-3.5" aria-hidden />
            mostrar mi QR
          </Link>
        </aside>

        <div className="glass rounded-3xl p-5 sm:p-6 lg:p-8">
          <ProfileForm
            defaultName={profile.name}
            defaultHeadline={profile.headline ?? ""}
            roleOptions={catalog.rol}
            interestOptions={catalog.interes}
            intentOptions={catalog.intencion}
            defaultRole={roleChoices}
            defaultInterests={interestChoices}
            defaultIntents={intentChoices}
          />
        </div>
      </div>
    </main>
  );
}
