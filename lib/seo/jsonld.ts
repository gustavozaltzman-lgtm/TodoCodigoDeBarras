import { companyInfo, siteConfig } from "@/lib/config/site";

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
    legalName: companyInfo.legalName,
    taxID: companyInfo.cuit,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/logo-512.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: companyInfo.address.street,
      addressLocality: companyInfo.address.locality,
      postalCode: companyInfo.address.postalCode,
      addressCountry: companyInfo.address.country,
    },
    // El telefono publicado del sitio es el WhatsApp comercial.
    contactPoint: siteConfig.whatsappNumber
      ? [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: `+${siteConfig.whatsappNumber}`,
            availableLanguage: "es",
          },
        ]
      : undefined,
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
