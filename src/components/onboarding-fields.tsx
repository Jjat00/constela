"use client";

import { TagPicker } from "@/components/tag-picker";
import type { Chrome } from "@/lib/copy";
import { ES } from "@/lib/copy/es";
import type { CatalogTag, TagChoice } from "@/lib/tags";

/**
 * Las tres preguntas de `/bienvenida` (ADR 0004): rol, intereses e intención.
 * Vive aparte del formulario porque la landing enseña esta misma pantalla —
 * si el copy o el orden cambian aquí, cambian en los dos sitios a la vez.
 *
 * `textos` cae en español por defecto, que es lo que habla `/bienvenida`; la
 * portada inglesa le pasa los suyos. Lo que NO cambia con el idioma son las
 * opciones: salen del catálogo curado de la base y son datos, no copy.
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
  textos = ES.chrome.ficha,
}: {
  textos?: Chrome["ficha"];
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
          {textos.rol}
        </p>
        <TagPicker
          options={roleOptions}
          value={role}
          onChange={onRoleChange}
          placeholder={textos.buscaRol}
          preview={preview}
          verRestantes={textos.verRestantes}
        />
      </div>

      <div className="flex flex-col gap-3.5">
        <p className="font-mono text-[10px] tracking-wider text-faint">
          {textos.intereses}
        </p>
        <TagPicker
          options={interestOptions}
          value={interests}
          onChange={onInterestsChange}
          placeholder={textos.buscaIntereses}
          preview={preview}
          verRestantes={textos.verRestantes}
        />
      </div>

      <div className="flex flex-col gap-3.5">
        <p className="font-mono text-[10px] tracking-wider text-faint">
          {textos.intencion}
        </p>
        <TagPicker
          options={intentOptions}
          value={intents}
          onChange={onIntentsChange}
          placeholder={textos.buscaIntencion}
          preview={preview}
          verRestantes={textos.verRestantes}
        />
      </div>
    </>
  );
}
