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
  defaultWebsite,
  defaultInstagram,
  defaultLinkedin,
  defaultGithub,
  defaultWhatsappNumber,
}: {
  defaultName: string;
  defaultHeadline: string;
  roleOptions: CatalogTag[];
  interestOptions: CatalogTag[];
  intentOptions: CatalogTag[];
  defaultRole: TagChoice[];
  defaultInterests: TagChoice[];
  defaultIntents: TagChoice[];
  defaultWebsite?: string;
  defaultInstagram?: string;
  defaultLinkedin?: string;
  defaultGithub?: string;
  defaultWhatsappNumber?: string;
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

      <section className="flex flex-col gap-4">
        <SectionLabel>[ CONTACTO · OPCIONAL ]</SectionLabel>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-5">
          <label className="flex flex-col gap-2.5">
            <SectionLabel>SITIO WEB</SectionLabel>
            <input
              id="website"
              name="website"
              type="url"
              defaultValue={defaultWebsite ?? ""}
              placeholder="https://example.com"
              className={INPUT}
            />
          </label>
          <label className="flex flex-col gap-2.5">
            <SectionLabel>INSTAGRAM</SectionLabel>
            <input
              id="instagram"
              name="instagram"
              defaultValue={defaultInstagram ?? ""}
              placeholder="username"
              className={INPUT}
            />
          </label>
          <label className="flex flex-col gap-2.5">
            <SectionLabel>LINKEDIN</SectionLabel>
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              defaultValue={defaultLinkedin ?? ""}
              placeholder="https://linkedin.com/in/username"
              className={INPUT}
            />
          </label>
          <label className="flex flex-col gap-2.5">
            <SectionLabel>GITHUB</SectionLabel>
            <input
              id="github"
              name="github"
              defaultValue={defaultGithub ?? ""}
              placeholder="username"
              className={INPUT}
            />
          </label>
          <label className="flex flex-col gap-2.5 md:col-span-2">
            <SectionLabel>WHATSAPP</SectionLabel>
            <input
              id="whatsapp_number"
              name="whatsapp_number"
              type="tel"
              defaultValue={defaultWhatsappNumber ?? ""}
              placeholder="+34 612 345 678"
              className={INPUT}
            />
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-3.5">
        <SectionLabel>[ ROL · VARIOS ]</SectionLabel>
        <TagPicker
          options={roleOptions}
          value={role}
          onChange={setRole}
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
