import { AppNav } from "@/components/app-nav";

/**
 * Shell de la app con sesión (`/home`, `/eventos`, `/qr`, `/perfil`).
 * Las páginas públicas — landing, login, `/e/[slug]`, `/u/[slug]` — quedan
 * fuera del grupo: se abren desde un QR y no deben mostrar navegación.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grain relative flex flex-1 flex-col">
      <AppNav />
      {/* Hueco para la barra inferior de móvil; en desktop no existe */}
      <div className="flex flex-1 flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </div>
    </div>
  );
}
