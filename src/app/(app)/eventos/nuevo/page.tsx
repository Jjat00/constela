import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createEvent } from "./actions";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="relative z-10 flex flex-1 flex-col items-center px-5 py-8 sm:justify-center sm:px-8 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 hidden h-[28rem] w-[44rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl sm:block"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.62 0.13 295 / 60%), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-7 sm:max-w-md sm:gap-8">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
            [ nuevo evento ]
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Enciende una{" "}
            <em className="font-serif font-normal text-primary italic">
              constelación
            </em>
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Nombre y fecha, nada más. El evento nace con su propio QR para
            compartir o proyectar en la entrada.
          </p>
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error === "falta-nombre"
              ? "El evento necesita un nombre."
              : "No pudimos crear el evento. Intenta de nuevo."}
          </p>
        )}

        <form action={createEvent} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="font-mono text-xs text-muted-foreground"
            >
              nombre del evento
            </label>
            <Input
              id="name"
              name="name"
              required
              autoFocus
              placeholder="Tech Community Bogotá"
              className="h-12 rounded-lg text-base"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="date"
              className="font-mono text-xs text-muted-foreground"
            >
              fecha (opcional)
            </label>
            <Input
              id="date"
              name="date"
              type="date"
              className="h-12 rounded-lg text-base"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="node-glow mt-2 h-12 rounded-full text-base"
          >
            Crear evento
          </Button>
        </form>

        <Link
          href="/eventos"
          className="text-center font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          ← tus eventos
        </Link>
      </div>
    </main>
  );
}
