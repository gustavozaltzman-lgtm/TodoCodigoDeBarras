import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { buildWhatsAppUrl, siteConfig, whatsappMessages } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactate con nosotros para solicitar información o una cotización.",
  alternates: {
    canonical: "/contacto",
  },
};

export default function ContactoPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <span className="eyebrow">Hablemos</span>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
        Contacto
      </h1>
      <p className="mt-3 max-w-2xl text-secondary">
        Escribinos y te respondemos a la brevedad, o contactanos directamente
        por WhatsApp.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-[1fr_18rem]">
        <div className="rounded-lg border border-border bg-white p-6">
          <InquiryForm type="general" />
        </div>

        {siteConfig.whatsappNumber && (
          <div className="h-fit rounded-lg border border-border bg-white p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50">
              <svg viewBox="0 0 24 24" fill="#22c55e" className="h-6 w-6">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2zm5.83 14.11c-.25.7-1.45 1.34-2 1.42-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.69-.62-2.97-1.28-4.91-4.27-5.06-4.47-.15-.2-1.21-1.61-1.21-3.07s.76-2.18 1.03-2.48c.27-.3.59-.37.78-.37.2 0 .39 0 .56.01.18.01.42-.07.66.5.25.6.84 2.07.91 2.22.07.15.12.33.02.53-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.73.82 2.02.97.3.15.5.22.57.35.07.13.07.75-.18 1.45z" />
              </svg>
            </span>
            <h2 className="mt-4 font-medium text-primary">
              ¿Preferís WhatsApp?
            </h2>
            <p className="mt-1.5 text-sm text-secondary">
              Escribinos directo y te respondemos por ese mismo medio.
            </p>
            <a
              href={buildWhatsAppUrl(whatsappMessages.general())}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-md bg-green-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-600"
            >
              Contactar por WhatsApp
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
