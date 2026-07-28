"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { TagPicker } from "@/components/tag-picker";
import {
  serializeChoices,
  type CatalogTag,
  type TagChoice,
} from "@/lib/tags";
import { updateProfile } from "./actions";

const INPUT =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-[15px] outline-none transition-colors placeholder:text-faint focus:border-cosmic/60";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] tracking-[0.16em] text-faint">
      {children}
    </p>
  );
}

export function ProfileForm({
  defaultName,
  defaultHeadline,
  roleOptions,
  interestOptions,
  intentOptions,
  defaultRole,
  defaultInterests,
  defaultIntents,
}: {
  defaultName: string;
  defaultHeadline: string;
  roleOptions: CatalogTag[];
  interestOptions: CatalogTag[];
  intentOptions: CatalogTag[];
  defaultRole: TagChoice[];
  defaultInterests: TagChoice[];
  defaultIntents: TagChoice[];
}) {
  const [role, setRole] = useState<TagChoice[]>(defaultRole);
  const [interests, setInterests] = useState<TagChoice[]>(defaultInterests);
  const [intents, setIntents] = useState<TagChoice[]>(defaultIntents);

  return (
    <form action={updateProfile} className="flex flex-col gap-7">
      <input type="hidden" name="role" value={serializeChoices(role)} />
      <input
        type="hidden"
        name="interests"
        value={serializeChoices(interests)}
      />
      <input type="hidden" name="intents" value={serializeChoices(intents)} />

      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-5">
        <label className="flex flex-col gap-2.5">
          <SectionLabel>[ NOMBRE ]</SectionLabel>
          <input
            id="name"
            name="name"
            required
            defaultValue={defaultName}
            placeholder="Ana Ruiz"
            className={INPUT}
          />
        </label>
        <label className="flex flex-col gap-2.5">
          <SectionLabel>[ UNA LÍNEA · OPCIONAL ]</SectionLabel>
          <input
            id="headline"
            name="headline"
            defaultValue={defaultHeadline}
            placeholder="Frontend en Rappi · construyendo con IA"
            className={INPUT}
          />
        </label>
      </div>

      <section className="flex flex-col gap-3.5">
        <SectionLabel>[ ROL ]</SectionLabel>
        <TagPicker
          options={roleOptions}
          value={role}
          onChange={setRole}
          mode="single"
          placeholder="busca tu rol o escríbelo"
        />
      </section>

      <section className="flex flex-col gap-3.5">
        <SectionLabel>[ INTERESES · VARIOS ]</SectionLabel>
        <TagPicker
          options={interestOptions}
          value={interests}
          onChange={setInterests}
          placeholder="busca un tema o escríbelo"
        />
      </section>

      <section className="flex flex-col gap-3.5">
        <SectionLabel>[ INTENCIÓN EN ESTE EVENTO ]</SectionLabel>
        <TagPicker
          options={intentOptions}
          value={intents}
          onChange={setIntents}
          placeholder="busca o escríbelo"
        />
      </section>

      <SaveButton />
    </form>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-cosmic h-12 cursor-pointer text-[15px] font-medium disabled:opacity-60 md:w-fit md:px-10"
    >
      {pending ? "Guardando…" : "Guardar"}
    </button>
  );
}
