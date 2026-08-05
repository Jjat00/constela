"use server";

import { createClient } from "@/lib/supabase/server";

export type SaveNoteResult =
  | { status: "ok"; note: string | null }
  | { status: "error" };

/** La nota es una línea de memoria, no un ensayo: cabe en el mini-perfil. */
const NOTE_MAX = 240;

/**
 * Guarda TU nota privada sobre un encuentro (migración 0014): cada extremo de
 * la arista tiene la suya y solo su autor la lee y la edita. La RLS de
 * `connection_notes` hace cumplir ambas cosas — el autor sale siempre de la
 * sesión, y para insertar exige además ser extremo de esa arista. Vaciar el
 * texto borra la nota.
 */
export async function saveConnectionNote(
  connectionId: string,
  note: string,
): Promise<SaveNoteResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error" };

  const trimmed = note.trim().slice(0, NOTE_MAX);

  if (trimmed.length === 0) {
    const { error } = await supabase
      .from("connection_notes")
      .delete()
      .eq("connection_id", connectionId)
      .eq("author_id", user.id);
    if (error) return { status: "error" };
    return { status: "ok", note: null };
  }

  // Si la RLS no deja pasar (arista ajena), el upsert no devuelve fila y eso
  // se reporta como error en vez de fingir éxito.
  const { data, error } = await supabase
    .from("connection_notes")
    .upsert(
      {
        connection_id: connectionId,
        author_id: user.id,
        note: trimmed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "connection_id,author_id" },
    )
    .select("note")
    .maybeSingle();
  if (error || !data) return { status: "error" };

  return { status: "ok", note: data.note };
}
