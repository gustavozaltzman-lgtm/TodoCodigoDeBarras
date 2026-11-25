"use client";

import { useState } from "react";
import { COMPARE_MAX, toggleCompare, useCompareList } from "./compare-store";

// Boton "Comparar" de cada tarjeta de producto (hasta 3 equipos).
export function CompareToggle({
  slug,
  name,
  className = "",
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const list = useCompareList();
  const [full, setFull] = useState(false);
  const selected = list.some((i) => i.slug === slug);

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={
        selected ? `Quitar ${name} de la comparación` : `Comparar ${name}`
      }
      title={full ? `Podés comparar hasta ${COMPARE_MAX} equipos` : undefined}
      onClick={() => {
        const result = toggleCompare({ slug, name });
        setFull(result === "full");
        if (result === "full") setTimeout(() => setFull(false), 2500);
      }}
      className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs font-medium shadow-sm transition-colors ${
        selected
          ? "border-accent bg-accent text-white"
          : "border-border bg-white text-secondary hover:border-accent hover:text-primary"
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5" aria-hidden="true">
        {selected ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        )}
      </svg>
      {full ? `Máx. ${COMPARE_MAX}` : selected ? "Comparando" : "Comparar"}
    </button>
  );
}
