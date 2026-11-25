"use client";

import { useState } from "react";
import {
  QUOTE_MAX_ITEMS,
  addToQuote,
  openQuote,
  useQuoteItems,
} from "./quote-store";

// "Agregar a mi lista" de la ficha de producto. Si el producto ya esta en
// la lista, el mismo boton abre la lista.
export function QuoteAddButton({ slug, name }: { slug: string; name: string }) {
  const items = useQuoteItems();
  const [full, setFull] = useState(false);
  const inList = items.some((i) => i.slug === slug);

  return (
    <button
      type="button"
      onClick={() => {
        if (inList) return openQuote();
        const result = addToQuote({ slug, name });
        if (result === "full") setFull(true);
      }}
      className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-5 text-sm font-medium transition-colors ${
        inList
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-white text-primary hover:border-accent"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
        {inList ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        )}
      </svg>
      {full
        ? `Máximo ${QUOTE_MAX_ITEMS} productos`
        : inList
          ? "En tu lista · Ver lista"
          : "Agregar a mi lista"}
    </button>
  );
}
