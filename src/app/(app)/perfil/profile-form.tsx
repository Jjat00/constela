"use client";

import { useState } from "react";
import { TagPicker } from "@/components/tag-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CATEGORY_COPY,
  serializeChoices,
  type CatalogTag,
  type TagCategory,
  type TagChoice,
} from "@/lib/tags";
import { updateProfile } from "./actions";

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
    <form action={updateProfile} className="flex flex-col gap-8">
      <input type="hidden" name="role" value={serializeChoices(role)} />
      <input
        type="hidden"
        name="interests"
        value={serializeChoices(interests)}
      />
      <input type="hidden" name="intents" value={serializeChoices(intents)} />

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="font-mono text-xs text-muted-foreground"
          >
            tu nombre
          </label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={defaultName}
            placeholder="Ana Ruiz"
            className="h-12 rounded-lg text-base"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="headline"
            className="font-mono text-xs text-muted-foreground"
          >
            una línea sobre ti (opcional)
          </label>
          <Input
            id="headline"
            name="headline"
            defaultValue={defaultHeadline}
            placeholder="Frontend en Rappi · construyendo con IA"
            className="h-12 rounded-lg text-base"
          />
        </div>
      </div>

      <TagSection category="rol">
        <TagPicker
          options={roleOptions}
          value={role}
          onChange={setRole}
          mode="single"
          placeholder="busca tu rol o escríbelo"
        />
      </TagSection>

      <TagSection category="interes">
        <TagPicker
          options={interestOptions}
          value={interests}
          onChange={setInterests}
          placeholder="busca un tema o escríbelo"
        />
      </TagSection>

      <TagSection category="intencion">
        <TagPicker
          options={intentOptions}
          value={intents}
          onChange={setIntents}
          placeholder="busca o escríbelo"
        />
      </TagSection>

      <Button
        type="submit"
        size="lg"
        className="node-glow h-12 rounded-full text-base"
      >
        Guardar
      </Button>
    </form>
  );
}

function TagSection({
  category,
  children,
}: {
  category: TagCategory;
  children: React.ReactNode;
}) {
  const copy = CATEGORY_COPY[category];
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
          [ {copy.title} ]
        </p>
        <p className="font-mono text-xs text-muted-foreground">{copy.hint}</p>
      </div>
      {children}
    </section>
  );
}
