"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  submitQuoteAction,
  type InquiryFormState,
} from "@/features/inquiries/actions";
import { SECTOR_OPTIONS } from "@/lib/content/lead-scoring";
import { buildWhatsAppUrl, siteConfig } from "@/lib/config/site";
import {
  QUOTE_MAX_QUANTITY,
  clearQuote,
  closeQuote,
  removeFromQuote,
  setQuoteQuantity,
  useQuoteItems,
  useQuoteOpen,
} from "./quote-store";

const initialState: InquiryFormState = { status: "idle" };

const fieldClass =
  "w-full min-h-11 rounded-md border border-border bg-white px-3 text-sm outline-none transition-colors focus:border-accent";
const labelClass = "text-sm font-medium text-secondary";

// Lista de cotizacion: panel lateral en 2 pasos (1: productos y cantidades,
// 2: datos de contacto). Un solo envio genera UN pedido con todos los
// productos. Tambien se puede mandar la misma lista por WhatsApp.
export function QuoteDrawer() {
  const open = useQuoteOpen();
  const items = useQuoteItems();
  const [step, setStep] = useState<1 | 2>(1);
  const [state, formAction, pending] = useActionState(submitQuoteAction, initialState);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuote();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Pedido enviado: se vacia la lista. Depende del objeto de estado (uno
  // nuevo por cada envio) para funcionar tambien en pedidos posteriores.
  useEffect(() => {
    if (state.status === "success") clearQuote();
  }, [state]);

  if (!open) return null;

  // La confirmacion se muestra mientras la lista siga vacia; si el visitante
  // agrega productos nuevos, vuelve el flujo normal.
  const success = state.status === "success" && items.length === 0;

  const whatsappText = [
    "Hola, quisiera cotizar por volumen:",
    ...items.map((i) => `- ${i.quantity} x ${i.name}`),
  ].join("\n");

  const close = () => {
    closeQuote();
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby="quote-title">
      <button
        type="button"
        aria-label="Cerrar lista de cotización"
        onClick={close}
        className="absolute inset-0 cursor-pointer bg-primary/50 backdrop-blur-[1px]"
        tabIndex={-1}
      />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 [padding-top:calc(0.75rem+env(safe-area-inset-top,0px))]">
          <div>
            <h2 id="quote-title" className="text-lg font-semibold text-primary">
              Tu lista de cotización
            </h2>
            {!success && items.length > 0 && (
              <p className="font-mono-data text-xs text-secondary">
                Paso {step} de 2
              </p>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-secondary transition-colors hover:bg-muted hover:text-primary"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {success ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              <p className="font-semibold">¡Recibimos tu pedido!</p>
              <p className="mt-1">
                Te contactamos a la brevedad con disponibilidad y precio por
                volumen de todos los productos.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-4 min-h-11 cursor-pointer rounded-md bg-green-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                Seguir navegando
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-secondary">
              <p>Todavía no agregaste productos.</p>
              <p className="mt-1">
                Usá “Agregar a mi lista” en cada ficha y pedí la cotización de
                todo junto.
              </p>
              <Link
                href="/catalogo"
                onClick={close}
                className="mt-4 inline-flex min-h-11 items-center rounded-md bg-accent px-5 font-semibold text-white transition-colors hover:bg-orange-600"
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <form id="quote-form" action={formAction} className="space-y-5">
              <input type="hidden" name="items" value={JSON.stringify(items.map((i) => ({ slug: i.slug, quantity: i.quantity })))} />
              {/* Honeypot: oculto para personas, visible para bots */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              {step === 1 && (
                <ul className="divide-y divide-border rounded-lg border border-border">
                  {items.map((item) => (
                    <li key={item.slug} className="flex items-center gap-3 p-3">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/productos/${item.slug}`}
                          onClick={close}
                          className="block truncate text-sm font-medium text-primary hover:underline"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromQuote(item.slug)}
                          className="mt-0.5 cursor-pointer text-xs text-secondary underline-offset-2 hover:text-accent hover:underline"
                        >
                          Quitar
                        </button>
                      </div>
                      <div className="flex shrink-0 items-center">
                        <button
                          type="button"
                          aria-label={`Una unidad menos de ${item.name}`}
                          onClick={() => setQuoteQuantity(item.slug, item.quantity - 1)}
                          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-l-md border border-border text-lg text-secondary transition-colors hover:bg-muted"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={QUOTE_MAX_QUANTITY}
                          value={item.quantity}
                          aria-label={`Cantidad de ${item.name}`}
                          onChange={(e) => setQuoteQuantity(item.slug, Number(e.target.value))}
                          className="font-mono-data h-11 w-16 border-y border-border text-center text-sm outline-none focus:border-accent"
                        />
                        <button
                          type="button"
                          aria-label={`Una unidad más de ${item.name}`}
                          onClick={() => setQuoteQuantity(item.slug, item.quantity + 1)}
                          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-r-md border border-border text-lg text-secondary transition-colors hover:bg-muted"
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-secondary">
                    {items.length} {items.length === 1 ? "producto" : "productos"} en tu pedido. Dejanos tus datos y te respondemos con disponibilidad y precio por volumen.
                  </p>
                  <div className="space-y-1">
                    <label htmlFor="q-name" className={labelClass}>Nombre *</label>
                    <input id="q-name" name="name" required autoComplete="name" className={fieldClass} />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="q-company" className={labelClass}>Empresa</label>
                    <input id="q-company" name="company" autoComplete="organization" className={fieldClass} />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="q-email" className={labelClass}>Email *</label>
                    <input id="q-email" name="email" type="email" required autoComplete="email" className={fieldClass} />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="q-phone" className={labelClass}>Teléfono</label>
                    <input id="q-phone" name="phone" type="tel" autoComplete="tel" className={fieldClass} />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="q-sector" className={labelClass}>¿Para qué sector o aplicación?</label>
                    <select id="q-sector" name="sector" defaultValue="" className={`${fieldClass} cursor-pointer`}>
                      <option value="">Elegí una opción</option>
                      {SECTOR_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="q-notes" className={labelClass}>Comentarios</label>
                    <textarea id="q-notes" name="notes" rows={3} maxLength={1000} className={`${fieldClass} py-2`} />
                  </div>
                </div>
              )}

              {state.status === "error" && (
                <p className="text-sm text-destructive" role="alert" aria-live="polite">
                  {state.message}
                </p>
              )}
            </form>
          )}
        </div>

        {!success && items.length > 0 && (
          <footer className="space-y-2 border-t border-border px-4 pt-3 [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom,0px))]">
            {step === 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="min-h-11 w-full cursor-pointer rounded-md bg-accent text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                >
                  Continuar con mis datos
                </button>
                {siteConfig.whatsappNumber && (
                  <a
                    href={buildWhatsAppUrl(whatsappText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 w-full cursor-pointer items-center justify-center rounded-md border border-border text-sm font-medium text-primary transition-colors hover:border-green-500"
                  >
                    Enviar esta lista por WhatsApp
                  </a>
                )}
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="min-h-11 cursor-pointer rounded-md border border-border px-4 text-sm font-medium text-secondary transition-colors hover:border-accent hover:text-primary"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  form="quote-form"
                  disabled={pending}
                  className="min-h-11 flex-1 cursor-pointer rounded-md bg-accent text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pending ? "Enviando…" : "Pedir cotización"}
                </button>
              </div>
            )}
          </footer>
        )}
      </aside>
    </div>
  );
}
