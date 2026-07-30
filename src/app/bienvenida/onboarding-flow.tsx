"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { TagPicker } from "@/components/tag-picker";
import { serializeChoices, type CatalogTag, type TagChoice } from "@/lib/tags";
import { completeOnboarding } from "./actions";

/**
 * Bienvenida en una pantalla, un tap (ADR 0004): el rol es lo único que se
 * pide de verdad; intereses e intención son opcionales pero se preguntan aquí
 * — sin ellos la constelación es un mapa de nombres que no se puede filtrar,
 * y casi nadie vuelve a /perfil a ponerlos. Lo ya elegido llega precargado.
 */
export function OnboardingFlow({
  eventName,
  next,
  roleOptions,
  interestOptions,
  intentOptions,
  initialRole,
  initialInterests,
  initialIntents,
}: {
  eventName: string | null;
  next: string;
  roleOptions: CatalogTag[];
  interestOptions: CatalogTag[];
  intentOptions: CatalogTag[];
  initialRole: TagChoice[];
  initialInterests: TagChoice[];
  initialIntents: TagChoice[];
}) {
  const [role, setRole] = useState<TagChoice[]>(initialRole);
  const [interests, setInterests] = useState<TagChoice[]>(initialInterests);
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
        value={serializeChoices(interests)}
      />
      <input type="hidden" name="intents" value={serializeChoices(intents)} />

      <div className="flex flex-col gap-3.5">
        <p className="font-mono text-[10px] tracking-wider text-faint">
          [ TU ROL ]
        </p>
        <TagPicker
          options={roleOptions}
          value={role}
          onChange={setRole}
          placeholder="busca tu rol o escríbelo"
        />
      </div>

      <div className="flex flex-col gap-3.5">
        <p className="font-mono text-[10px] tracking-wider text-faint">
          [ INTERESES · OPCIONAL ]
        </p>
        <TagPicker
          options={interestOptions}
          value={interests}
          onChange={setInterests}
          placeholder="¿de qué quieres hablar?"
        />
      </div>

      <div className="flex flex-col gap-3.5">
        <p className="font-mono text-[10px] tracking-wider text-faint">
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
