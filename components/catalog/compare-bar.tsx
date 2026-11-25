"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearCompare, useCompareList } from "./compare-store";

// Barra flotante que aparece cuando hay equipos elegidos para comparar.
// Queda a la izquierda para no chocar con el boton de WhatsApp (derecha) y,
// en la ficha de producto en mobile, se sube sobre la barra de cotizacion.
export function CompareBar() {
  const list = useCompareList();
  const pathname = usePathname();

  if (list.length === 0 || pathname === "/comparar") return null;

  const onProduct = pathname.startsWith("/productos/");
  const href = `/comparar?p=${list.map((i) => encodeURIComponent(i.slug)).join(",")}`;

  return (
    <div
      className={`fixed left-4 z-40 flex max-w-[calc(100vw-6.5rem)] items-center gap-2 rounded-lg border border-border bg-white p-2 pl-3 shadow-lg sm:max-w-md ${
        onProduct
          ? "[bottom:calc(5.25rem+env(safe-area-inset-bottom,0px))] lg:[bottom:1.25rem]"
          : "[bottom:calc(1.25rem+env(safe-area-inset-bottom,0px))]"
      }`}
      role="region"
      aria-label="Equipos a comparar"
    >
      <p className="min-w-0 truncate text-sm text-primary">
        <span className="font-semibold">{list.length}</span>{" "}
        {list.length === 1 ? "equipo" : "equipos"} para comparar
      </p>
      {list.length >= 2 ? (
        <Link
          href={href}
          className="inline-flex min-h-9 shrink-0 cursor-pointer items-center rounded-md bg-accent px-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Comparar
        </Link>
      ) : (
        <span className="shrink-0 text-xs text-secondary">Sumá uno más</span>
      )}
      <button
        type="button"
        onClick={clearCompare}
        aria-label="Vaciar comparación"
        className="inline-flex min-h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-secondary transition-colors hover:bg-muted hover:text-primary"
      >
        ✕
      </button>
    </div>
  );
}
