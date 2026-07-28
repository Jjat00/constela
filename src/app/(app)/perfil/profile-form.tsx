"use client";

import { useState } from "react";
import { updateProfile } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_TAGS = 3;

const SUGGESTED = [
  "frontend",
  "backend",
  "ia",
  "datos",
  "producto",
  "diseño",
  "devops",
  "móvil",
];

export function ProfileForm({
  defaultName,
  defaultHeadline,
  defaultTags,
}: {
  defaultName: string;
  defaultHeadline: string;
  defaultTags: string[];
}) {
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [tagInput, setTagInput] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase();
    if (!tag || tags.includes(tag) || tags.length >= MAX_TAGS) return;
    setTags([...tags, tag]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  return (
    <form action={updateProfile} className="flex flex-col gap-5">
      <input type="hidden" name="tags" value={tags.join(",")} />

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-mono text-xs text-muted-foreground">
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
          qué haces (opcional)
        </label>
        <Input
          id="headline"
          name="headline"
          defaultValue={defaultHeadline}
          placeholder="Frontend en Rappi · construyendo con IA"
          className="h-12 rounded-lg text-base"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="tag" className="font-mono text-xs text-muted-foreground">
          tus temas (opcional) · máx {MAX_TAGS}
        </label>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                title="Quitar"
              >
                <Badge className="cursor-pointer px-3 py-1 text-sm">
                  {tag} ✕
                </Badge>
              </button>
            ))}
          </div>
        )}

        {tags.length < MAX_TAGS && (
          <>
            <Input
              id="tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              placeholder="escribe y presiona Enter"
              className="h-12 rounded-lg text-base"
            />
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.filter((s) => !tags.includes(s)).map((s) => (
                <button key={s} type="button" onClick={() => addTag(s)}>
                  <Badge
                    variant="outline"
                    className="cursor-pointer px-3 py-1 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary"
                  >
                    + {s}
                  </Badge>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="node-glow mt-2 h-12 rounded-full text-base"
      >
        Guardar
      </Button>
    </form>
  );
}
