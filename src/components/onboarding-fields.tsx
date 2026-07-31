"use client";

import { TagPicker } from "@/components/tag-picker";
import type { CatalogTag, TagChoice } from "@/lib/tags";

/**
 * Las tres preguntas de `/bienvenida` (ADR 0004): rol, intereses e intención.
 * Vive aparte del formulario porque la landing enseña esta misma pantalla —
 * si el copy o el orden cambian aquí, cambian en los dos sitios a la vez.
 */
export function OnboardingFields({
  roleOptions,
  interestOptions,
  intentOptions,
  role,
  interests,
  intents,
  onRoleChange,
  onInterestsChange,
  onIntentsChange,
  preview,
}: {
  roleOptions: CatalogTag[];
  interestOptions: CatalogTag[];
  intentOptions: CatalogTag[];
  role: TagChoice[];
  interests: TagChoice[];
  intents: TagChoice[];
  onRoleChange: (next: TagChoice[]) => void;
  onInterestsChange: (next: TagChoice[]) => void;
  onIntentsChange: (next: TagChoice[]) => void;
  /** Cuántas sugerencias muestra cada picker antes de plegar el resto. */
  preview?: number;
}) {
  return (
    <>
      <div className="flex flex-col gap-3.5">
        <p className="font-mono text-[10px] tracking-wider text-faint">
          [ TU ROL ]
        </p>
        <TagPicker
          options={roleOptions}
          value={role}
          onChange={onRoleChange}
          placeholder="busca tu rol o escríbelo"
          preview={preview}
        />
      </div>

      <div className="flex flex-col gap-3.5">
        <p className="font-mono text-[10px] tracking-wider text-faint">
          [ INTERESES · OPCIONAL ]
        </p>
        <TagPicker
          options={interestOptions}
          value={interests}
          onChange={onInterestsChange}
          placeholder="¿de qué quieres hablar?"
          preview={preview}
        />
      </div>

      <div className="flex flex-col gap-3.5">
        <p className="font-mono text-[10px] tracking-wider text-faint">
          [ INTENCIÓN · OPCIONAL ]
        </p>
        <TagPicker
          options={intentOptions}
          value={intents}
          onChange={onIntentsChange}
          placeholder="¿a qué viniste?"
          preview={preview}
        />
      </div>
    </>
  );
}
