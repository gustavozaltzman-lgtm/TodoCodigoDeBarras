import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { buildWhatsAppUrl, siteConfig, whatsappMessages } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactate con nosotros para solicitar información o una cotización.",
};

export default function ContactoPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
        Contacto
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Escribinos y te respondemos a la brevedad, o contactanos directamente
        por WhatsApp.
      </p>

      <div className="mt-10 grid gap-10 sm:grid-cols-[1fr_auto]">
        <InquiryForm type="general" />

        {siteConfig.whatsappNumber && (
          <div className="sm:w-56">
            <a
              href={buildWhatsAppUrl(whatsappMessages.general())}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-md bg-green-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-600"
            >
              Contactar por WhatsApp
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
