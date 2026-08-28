// Contenido de las paginas "Soluciones por Industria". Copy provisto
// directamente por el cliente (no inventado) -- ver docs/ROADMAP.md.
export type IndustrySolution = {
  slug: string;
  title: string;
  description: string;
};

export const INDUSTRY_SOLUTIONS: IndustrySolution[] = [
  {
    slug: "logistica-y-depositos",
    title: "Logística y Depósitos",
    description: "Control de inventario, recepción y despachos.",
  },
  {
    slug: "retail-y-punto-de-venta",
    title: "Retail y Punto de Venta",
    description: "Etiquetado y lectura rápida.",
  },
  {
    slug: "manufactura-e-industria",
    title: "Manufactura e Industria",
    description: "Trazabilidad de planta y activos.",
  },
  {
    slug: "salud-y-laboratorios",
    title: "Salud y Laboratorios",
    description: "Identificación de muestras y pacientes.",
  },
  {
    slug: "control-de-activos",
    title: "Control de Activos",
    description: "Seguimiento RFID de bienes de uso.",
  },
];

export function getIndustrySolution(slug: string) {
  return INDUSTRY_SOLUTIONS.find((s) => s.slug === slug) ?? null;
}
