"use client";

import { openQuote, useQuoteItems } from "./quote-store";

// Acceso a la lista de cotizacion desde el header, con la cantidad de productos.
export function QuoteButton() {
  const items = useQuoteItems();

  return (
    <button
      type="button"
      onClick={openQuote}
      aria-label={
        items.length > 0
          ? `Abrir lista de cotización, ${items.length} ${items.length === 1 ? "producto" : "productos"}`
          : "Abrir lista de cotización"
      }
      className="relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-primary transition-colors hover:bg-muted"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
      </svg>
      {items.length > 0 && (
        <span className="font-mono-data absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
          {items.length}
        </span>
      )}
    </button>
  );
}
