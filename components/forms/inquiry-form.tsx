"use client";

import { useActionState } from "react";
import {
  submitInquiryAction,
  type InquiryFormState,
} from "@/features/inquiries/actions";

const initialState: InquiryFormState = { status: "idle" };

const inputClass =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-accent";
const labelClass = "text-sm font-medium text-secondary";

type InquiryFormProps = {
  type?: "general" | "quote" | "product";
  productId?: number;
  productName?: string;
};

export function InquiryForm({
  type = "general",
  productId,
  productName,
}: InquiryFormProps) {
  const [state, formAction, pending] = useActionState(
    submitInquiryAction,
    initialState
  );

  if (state.status === "success") {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Gracias{productName ? ` por tu interés en ${productName}` : ""}, tu
        consulta fue enviada. Te vamos a contactar a la brevedad.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="type" value={type} />
      {productId && (
        <input type="hidden" name="productId" value={productId} />
      )}
      <input
        type="hidden"
        name="sourceUrl"
        value={typeof window !== "undefined" ? window.location.href : ""}
      />
      {/* Honeypot: oculto para humanos, visible para bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="name" className={labelClass}>
            Nombre *
          </label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div className="space-y-1">
          <label htmlFor="company" className={labelClass}>
            Empresa
          </label>
          <input id="company" name="company" className={inputClass} />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="phone" className={labelClass}>
            Teléfono
          </label>
          <input id="phone" name="phone" className={inputClass} />
        </div>
        <div className="space-y-1">
          <label htmlFor="country" className={labelClass}>
            País
          </label>
          <input id="country" name="country" className={inputClass} />
        </div>
        <div className="space-y-1">
          <label htmlFor="quantity" className={labelClass}>
            Cantidad / volumen
          </label>
          <input
            id="quantity"
            name="quantity"
            placeholder="Ej: 2 cajas, 500 unidades"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className={labelClass}>
          Mensaje *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          defaultValue={
            productName
              ? `Hola, estoy interesado en el producto ${productName}. Quisiera recibir más información.`
              : undefined
          }
          className={inputClass}
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-destructive" role="alert" aria-live="polite">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Enviando..." : "Enviar consulta"}
      </button>
    </form>
  );
}
