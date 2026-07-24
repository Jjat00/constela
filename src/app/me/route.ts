import { redirect } from "next/navigation";

// /me fue el home de la fase 1 v1; ahora el home es /home (evento al centro)
export function GET() {
  redirect("/home");
}
