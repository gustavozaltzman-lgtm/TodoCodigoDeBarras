import type { Metadata } from "next";
import Link from "next/link";
import { InquiryForm } from "@/components/forms/inquiry-form";
import {
  buildWhatsAppUrl,
  companyInfo,
  siteConfig,
  whatsappMessages,
} from "@/lib/config/site";
import { breadcrumbJsonLd, jsonLdToScript } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Servicio técnico",
  description:
    "Servicio técnico propio para equipos de captura automática de datos y etiquetado. Consultanos por tu equipo.",
  alternates: { canonical: "/servicio-tecnico" },
};

// Solo se afirma lo confirmado por el cliente: el servicio tecnico es
// propio. Marcas atendidas, tipos de reparacion y plazos no se publican
// hasta tener ese dato.
export default function ServicioTecnicoPage() {
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Servicio técnico de equipos de captura automática de datos",
    serviceType: "Servicio técnico",
    url: `${siteConfig.url}/servicio-tecnico`,
    provider: {
      "@type": "Organization",
      name: companyInfo.legalName,
      url: siteConfig.url,
    },
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: "Inicio", url: siteConfig.url },
    { name: "Servicio técnico", url: `${siteConfig.url}/servicio-tecnico` },
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToScript(service) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToScript(breadcrumb) }}
      />

      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <span className="eyebrow">Postventa</span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            Servicio técnico
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-secondary">
            Contamos con servicio técnico propio para equipos de captura
            automática de datos y etiquetado. Contanos qué equipo tenés y qué
            le pasa, y te respondemos.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#consulta"
              className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md bg-accent px-6 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-colors hover:bg-orange-600"
            >
              Consultar al servicio técnico
            </a>
            {siteConfig.whatsappNumber && (
              <a
                href={buildWhatsAppUrl(whatsappMessages.service())}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-border bg-white px-6 text-sm font-medium text-primary transition-colors hover:border-green-500"
              >
                Escribir por WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-4 px-4 py-14 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="text-lg font-semibold text-primary">Para agilizar tu consulta</h2>
          <p className="mt-2 text-sm text-secondary">Tené a mano estos datos:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-secondary">
            <li>Marca y modelo del equipo.</li>
            <li>Número de serie, si lo tenés a la vista.</li>
            <li>Qué problema notás y desde cuándo.</li>
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="text-lg font-semibold text-primary">Repuestos y accesorios</h2>
          <p className="mt-2 text-sm text-secondary">
            En el catálogo vas a encontrar cabezales térmicos, baterías,
            fundas, bases de carga y otros repuestos y accesorios.
          </p>
          <Link
            href="/catalogo/repuestos-y-accesorios"
            className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-accent hover:underline"
          >
            Ver repuestos y accesorios →
          </Link>
        </div>
      </section>

      <section id="consulta" className="mx-auto max-w-4xl scroll-mt-24 px-4 pb-20">
        <div className="rounded-lg border border-border bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-primary">Consulta de servicio técnico</h2>
          <p className="mt-1 text-sm text-secondary">
            Escribí el equipo y el problema en el mensaje.
          </p>
          <div className="mt-4">
            <InquiryForm type="general" defaultInterest="servicio_tecnico" />
          </div>
        </div>
      </section>
    </main>
  );
}
