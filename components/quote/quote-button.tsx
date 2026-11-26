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
      title="Lista de cotización"
      className="relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-primary transition-colors hover:bg-muted"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
      {/* Cantidad de productos distintos en la lista (no la suma de unidades). */}
      {items.length > 0 && (
        <span className="font-mono-data absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white">
          {items.length}
        </span>
      )}
    </button>
  );
}
