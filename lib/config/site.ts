export const siteConfig = {
  name: "TodoCodigoDeBarras",
  description:
    "Productos y soluciones de identificacion, captura de datos y codigo de barras.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
};

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}

export const whatsappMessages = {
  general: () => "Hola, quisiera realizar una consulta.",
  category: (categoryName: string) =>
    `Hola, quisiera recibir informacion sobre los productos de ${categoryName}.`,
  product: (productName: string) =>
    `Hola, estoy interesado en el producto ${productName}. Quisiera recibir mas informacion.`,
};
