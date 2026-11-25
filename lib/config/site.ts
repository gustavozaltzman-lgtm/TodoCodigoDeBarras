const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const siteConfig = {
  name: "TodoCodigoDeBarras",
  description:
    "Productos y soluciones de identificación, captura de datos y código de barras.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  url: siteUrl,
};

// Datos legales y de contacto de la empresa que opera el sitio. Fuente unica:
// legales, footer, contacto y datos estructurados leen de aca.
export const companyInfo = {
  legalName: "SNET SA",
  cuit: "30-70760662-9",
  address: {
    street: "Pizarro 5201",
    locality: "Ciudad Autónoma de Buenos Aires",
    postalCode: "1440",
    country: "AR",
  },
};

export const companyAddressLine = `${companyInfo.address.street}, ${companyInfo.address.locality} (CP ${companyInfo.address.postalCode})`;

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}

export const whatsappMessages = {
  general: () => "Hola, quisiera realizar una consulta.",
  service: () =>
    "Hola, necesito asistencia del servicio técnico para un equipo. Marca y modelo: ",
  category: (categoryName: string) =>
    `Hola, quisiera recibir información sobre los productos de ${categoryName}.`,
  product: (productName: string) =>
    `Hola, estoy interesado en consultar disponibilidad y cotización por volumen del equipo ${productName}.`,
};
