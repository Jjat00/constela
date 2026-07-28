import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { qrSvg } from "@/lib/qr";

export default async function MyQrPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/qr");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, headline, qr_slug")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/login?error=sin-perfil");

  // Papel: módulos oscuros sobre claro, lo que cualquier cámara lee sin dudar
  const svg = await qrSvg(`/u/${profile.qr_slug}`, "paper");

  const { data: attendance } = await supabase
    .from("event_attendees")
    .select("events(name)")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false })
    .limit(1);

  const event = attendance?.[0]?.events;
  const eventName = (Array.isArray(event) ? event[0] : event)?.name;

  return (
    <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-5 py-8 sm:gap-8 sm:px-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
          [ tu QR personal ]
        </p>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Que te{" "}
          <em className="font-serif font-normal text-primary italic">
            escaneen
          </em>
        </h1>
      </div>

      {/* Papel iluminado: el QR manda, ocupa todo el ancho útil del teléfono */}
      <div className="node-glow w-full max-w-[min(20rem,78vw)] rounded-3xl bg-[#F5F3EE] p-5 sm:max-w-sm sm:p-6">
        <div
          className="[&_svg]:h-auto [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="font-display text-lg font-semibold">{profile.name}</p>
        {eventName ? (
          <p className="max-w-xs font-mono text-xs leading-5 text-muted-foreground">
            quien lo escanee entra a{" "}
            <span className="text-primary">{eventName}</span> y quedan
            conectados
          </p>
        ) : (
          <p className="max-w-xs font-mono text-xs leading-5 text-muted-foreground">
            entra a un evento para que tu QR conecte — hoy solo muestra tu
            estrella
          </p>
        )}
        <p className="mt-2 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          [ sube el brillo de la pantalla ]
        </p>
      </div>
    </main>
  );
}
