"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { TagPicker } from "@/components/tag-picker";
import { serializeChoices, type CatalogTag, type TagChoice } from "@/lib/tags";
import { completeOnboarding } from "./actions";

/**
 * Bienvenida en una pantalla, un tap (diseño 2a): el rol es lo único que se
 * pide de verdad; la intención es opcional y los intereses se afinan luego
 * en Ajustes. Lo ya elegido (si vuelves) llega precargado.
 */
export function OnboardingFlow({
  eventName,
  next,
  roleOptions,
  intentOptions,
  initialRole,
  initialInterests,
  initialIntents,
}: {
  eventName: string | null;
  next: string;
  roleOptions: CatalogTag[];
  intentOptions: CatalogTag[];
  initialRole: TagChoice[];
  /** Se conservan y reenvían tal cual: los intereses se editan en /perfil. */
  initialInterests: TagChoice[];
  initialIntents: TagChoice[];
}) {
  const [role, setRole] = useState<TagChoice[]>(initialRole);
  const [intents, setIntents] = useState<TagChoice[]>(initialIntents);
  const ready = role.length > 0;

  return (
    <form
      action={completeOnboarding}
      className="glass flex flex-col gap-7 rounded-4xl p-6 sm:p-7"
    >
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="role" value={serializeChoices(role)} />
      <input
        type="hidden"
        name="interests"
        value={serializeChoices(initialInterests)}
      />
      <input type="hidden" name="intents" value={serializeChoices(intents)} />

      <div className="flex flex-col gap-3.5">
        <p className="font-mono text-[10px] tracking-[0.16em] text-faint">
          [ TU ROL ]
        </p>
        <TagPicker
          options={roleOptions}
          value={role}
          onChange={setRole}
          mode="single"
          placeholder="busca tu rol o escríbelo"
        />
      </div>

      <div className="flex flex-col gap-3.5">
        <p className="font-mono text-[10px] tracking-[0.16em] text-faint">
          [ INTENCIÓN · OPCIONAL ]
        </p>
        <TagPicker
          options={intentOptions}
          value={intents}
          onChange={setIntents}
          placeholder="¿a qué viniste?"
        />
      </div>

      <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4.5">
        <SubmitButton
          ready={ready}
          label={eventName ? "Entrar a la constelación" : "Ver mi constelación"}
        />
        <button
          type="submit"
          name="skip"
          value="1"
          className="h-11 px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Lo hago después
        </button>
      </div>
    </form>
  );
}

function SubmitButton({ ready, label }: { ready: boolean; label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || !ready}
      className={
        ready
          ? "btn-cosmic h-12 w-full cursor-pointer px-6.5 text-[15px] font-medium sm:w-auto"
          : "h-12 w-full rounded-full border border-white/10 bg-white/[0.03] px-6.5 text-[15px] text-faint sm:w-auto"
      }
    >
      {pending ? "Guardando…" : ready ? label : "Elige tu rol"}
    </button>
  );
}
