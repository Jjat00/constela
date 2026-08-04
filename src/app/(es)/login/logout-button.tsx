"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors hover:border-faint/50"
    >
      <LogOut className="size-4" aria-hidden />
      <span className="text-xs">salir</span>
    </button>
  );
}
