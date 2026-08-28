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

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}

export const whatsappMessages = {
  general: () => "Hola, quisiera realizar una consulta.",
  category: (categoryName: string) =>
    `Hola, quisiera recibir información sobre los productos de ${categoryName}.`,
  product: (productName: string) =>
    `Hola, estoy interesado en consultar disponibilidad y cotización por volumen del equipo ${productName}.`,
};
