import Link from "next/link";
import { Galaxia } from "@/components/cosmos";
import { createEvent } from "./actions";

/**
 * Crear evento (diseño 2e): tres campos y ya. Cualquiera puede encender
 * un evento; nace con su propio QR para la entrada.
 */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2.5">
      <span className="font-mono text-[10px] tracking-[0.16em] text-faint">
        {label}
      </span>
      {children}
    </label>
  );
}

const INPUT =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-[15px] outline-none transition-colors placeholder:text-faint focus:border-cosmic/60";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="relative z-10 flex flex-1 flex-col items-center px-5 py-8 sm:justify-center sm:px-8 sm:py-12">
      <div className="relative z-10 flex w-full max-w-sm flex-col gap-7 sm:max-w-md">
        {error && (
          <p className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error === "falta-nombre"
              ? "El evento necesita un nombre."
              : "No pudimos crear el evento. Intenta de nuevo."}
          </p>
        )}

        <form
          action={createEvent}
          className="glass flex flex-col gap-7 rounded-4xl p-6 sm:p-7"
        >
          <div className="flex items-center gap-4">
            <Galaxia size={56} seed={11} active />
            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.025em]">
                Nuevo evento
              </h1>
              <p className="mt-1.5 text-[13px] text-muted-foreground">
                Cualquiera puede crear un evento.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4.5">
            <Field label="[ NOMBRE ]">
              <input
                id="name"
                name="name"
                required
                autoFocus
                placeholder="Encuentro de producto"
                className={INPUT}
              />
            </Field>
            <Field label="[ CIUDAD · OPCIONAL ]">
              <input
                id="city"
                name="city"
                placeholder="Tu ciudad"
                className={INPUT}
              />
            </Field>
            <Field label="[ FECHA · OPCIONAL ]">
              <input id="date" name="date" type="date" className={INPUT} />
            </Field>
          </div>

          <div className="flex items-center gap-3.5">
            <button
              type="submit"
              className="btn-cosmic h-13 flex-1 cursor-pointer text-[15px] font-medium"
            >
              Crear evento
            </button>
            <Link
              href="/eventos"
              className="h-13 content-center px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
