import { siteConfig } from "@/lib/config/site";

// Serializa un objeto para inyectarlo en <script type="application/ld+json">.
// Escapa "<" para que un valor con "</script>" (ej. nombre o descripcion de
// un producto) no pueda cerrar el tag prematuramente e inyectar HTML/JS.
export function jsonLdToScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    // TODO: agregar logo (URL absoluta) cuando el cliente provea el asset real
  };
}

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export type FaqItem = {
  question: string;
  answer: string;
};

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
