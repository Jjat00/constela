"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { TagPicker } from "@/components/tag-picker";
import { Button } from "@/components/ui/button";
import { serializeChoices, type CatalogTag, type TagChoice } from "@/lib/tags";
import { completeOnboarding } from "./actions";

const STEPS = [
  {
    key: "rol",
    question: "¿Qué haces?",
    hint: "elige uno · si el tuyo no está, escríbelo y queda para los demás",
  },
  {
    key: "interes",
    question: "¿De qué quieres hablar?",
    hint: "los que quieras · con esto filtras la constelación después",
  },
  {
    key: "intencion",
    question: "¿A qué viniste?",
    hint: "opcional · es lo que hace que te encuentren",
  },
] as const;

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
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<TagChoice[]>(initialRole);
  const [interests, setInterests] = useState<TagChoice[]>(initialInterests);
  const [intents, setIntents] = useState<TagChoice[]>(initialIntents);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  // El rol es lo único que se pide de verdad: un tap y ya estás descrito.
  const canAdvance = step > 0 || role.length > 0;

  return (
    <form action={completeOnboarding} className="flex flex-col gap-8">
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="role" value={serializeChoices(role)} />
      <input
        type="hidden"
        name="interests"
        value={serializeChoices(interests)}
      />
      <input type="hidden" name="intents" value={serializeChoices(intents)} />

      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <span
              key={s.key}
              className={
                i <= step
                  ? "h-1 flex-1 rounded-full bg-primary"
                  : "h-1 flex-1 rounded-full bg-border"
              }
            />
          ))}
        </div>
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
          [ paso {step + 1} de {STEPS.length} ]
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-balance">
          {current.question}
        </h1>
        <p className="font-mono text-xs leading-5 text-muted-foreground">
          {current.hint}
        </p>
      </header>

      {/* Los tres pickers viven montados: volver atrás no pierde lo elegido */}
      <div className={step === 0 ? "block" : "hidden"}>
        <TagPicker
          options={roleOptions}
          value={role}
          onChange={setRole}
          mode="single"
          placeholder="busca tu rol o escríbelo"
        />
      </div>
      <div className={step === 1 ? "block" : "hidden"}>
        <TagPicker
          options={interestOptions}
          value={interests}
          onChange={setInterests}
          placeholder="busca un tema o escríbelo"
          emptyHint="sin intereses nadie podrá filtrarte ✦ elige al menos uno"
        />
      </div>
      <div className={step === 2 ? "block" : "hidden"}>
        <TagPicker
          options={intentOptions}
          value={intents}
          onChange={setIntents}
          placeholder="busca o escríbelo"
        />
      </div>

      <footer className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {step > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => setStep(step - 1)}
              className="h-12 rounded-full font-mono text-xs text-muted-foreground"
            >
              ← atrás
            </Button>
          )}

          {isLast ? (
            <SubmitButton
              label={
                eventName ? `Entrar a ${eventName} ✦` : "Ver mi constelación ✦"
              }
            />
          ) : (
            <Button
              type="button"
              size="lg"
              disabled={!canAdvance}
              onClick={() => setStep(step + 1)}
              className="node-glow h-12 flex-1 rounded-full text-base"
            >
              {canAdvance ? "Siguiente" : "Elige tu rol"}
            </Button>
          )}
        </div>

        <button
          type="submit"
          name="skip"
          value="1"
          className="text-center font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          lo hago después
        </button>
      </footer>
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className="node-glow h-12 flex-1 rounded-full text-base"
    >
      {pending ? "Guardando…" : label}
    </Button>
  );
}
