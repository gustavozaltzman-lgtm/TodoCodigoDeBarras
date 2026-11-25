import { and, eq, inArray, sql, type SQL } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
import { resolveCategoryIds } from "./queries";

// Filtros tecnicos por categoria. Cada opcion es una condicion sobre las
// especificaciones reales ya cargadas (product_specifications) o el nombre.
// Las opciones sin ningun producto en la categoria no se muestran, asi que
// el filtro nunca ofrece una combinacion vacia ni inventa un dato.

type Option = { value: string; label: string; where: SQL };
export type Facet = { key: string; label: string; options: Option[] };

const spec = (labelPatterns: string[], valuePattern: string): SQL => {
  const labels = sql.join(
    labelPatterns.map((p) => sql`s.label ilike ${p}`),
    sql` or `
  );
  return sql`exists (select 1 from product_specifications s where s.product_id = ${products.id} and (${labels}) and s.value ilike ${valuePattern})`;
};
const name = (pattern: string): SQL => sql`${products.name} ilike ${pattern}`;
const either = (a: SQL, b: SQL): SQL => sql`(${a} or ${b})`;

const CONNECTIVITY_LABELS = ["Conectividad%", "Puertos%", "Interfaz%", "Interfaces%", "Inal%"];

const PRINTER: Facet[] = [
  {
    key: "tec",
    label: "Tecnología",
    options: [
      { value: "directa", label: "Térmica directa", where: spec(["Método%"], "%directa%") },
      { value: "transferencia", label: "Transferencia térmica", where: spec(["Método%"], "%transferencia%") },
    ],
  },
  {
    key: "res",
    label: "Resolución",
    options: [
      { value: "203", label: "203 dpi", where: spec(["Resoluci%"], "%203%") },
      { value: "300", label: "300 dpi", where: spec(["Resoluci%"], "%300%") },
      { value: "600", label: "600 dpi", where: spec(["Resoluci%"], "%600%") },
    ],
  },
  {
    key: "con",
    label: "Conectividad",
    options: [
      { value: "ethernet", label: "Ethernet", where: spec(CONNECTIVITY_LABELS, "%ethernet%") },
      { value: "wifi", label: "Wi-Fi", where: spec(CONNECTIVITY_LABELS, "%wi-fi%") },
      { value: "bluetooth", label: "Bluetooth", where: spec(CONNECTIVITY_LABELS, "%bluetooth%") },
    ],
  },
];

const SCANNER: Facet[] = [
  {
    key: "tipo",
    label: "Tipo de lectura",
    options: [
      { value: "1d", label: "1D (lineal)", where: either(name("%1D%"), spec(["Tipo%"], "%1D%")) },
      { value: "2d", label: "2D (imager)", where: either(name("%2D%"), spec(["Tipo%"], "%2D%")) },
    ],
  },
  {
    key: "con",
    label: "Conexión",
    options: [
      {
        value: "inalambrico",
        label: "Inalámbrico",
        where: either(name("%inal%"), spec(CONNECTIVITY_LABELS, "%bluetooth%")),
      },
      { value: "usb", label: "USB", where: either(name("%usb%"), spec(CONNECTIVITY_LABELS, "%usb%")) },
    ],
  },
];

const RIBBON: Facet[] = [
  {
    key: "tipo",
    label: "Tipo de ribbon",
    options: [
      { value: "cera", label: "Cera", where: spec(["Tipo"], "cera%") },
      { value: "mezcla", label: "Mezcla (cera-resina)", where: spec(["Tipo"], "mezcla%") },
      { value: "resina", label: "Resina", where: spec(["Tipo"], "resina%") },
    ],
  },
  {
    key: "color",
    label: "Color",
    options: [
      { value: "negro", label: "Negro", where: spec(["Color"], "negro") },
      { value: "color", label: "Color / otro", where: sql`not ${spec(["Color"], "negro")}` },
    ],
  },
];

const LABEL: Facet[] = [
  {
    key: "material",
    label: "Material",
    options: [
      { value: "directa", label: "Térmica directa", where: spec(["Material"], "%directa%") },
      { value: "opp", label: "OPP (polipropileno)", where: spec(["Material"], "%opp%") },
      { value: "ilustracion", label: "Papel ilustración", where: spec(["Material"], "%ilustraci%") },
    ],
  },
];

const BY_CATEGORY: Record<string, Facet[]> = {
  impresion: PRINTER,
  "impresoras-escritorio": PRINTER,
  "impresoras-industriales": PRINTER,
  "impresoras-rfid": PRINTER,
  "captura-de-datos": SCANNER,
  ribbons: RIBBON,
  etiquetas: LABEL,
};

export function getFacetDefinitions(categorySlug: string): Facet[] {
  return BY_CATEGORY[categorySlug] ?? [];
}

export type SelectedFacets = Record<string, string | undefined>;

// Condiciones SQL de las opciones elegidas (una opcion por filtro).
export function buildFacetConditions(categorySlug: string, selected: SelectedFacets): SQL[] {
  const conditions: SQL[] = [];
  for (const facet of getFacetDefinitions(categorySlug)) {
    const option = facet.options.find((o) => o.value === selected[facet.key]);
    if (option) conditions.push(option.where);
  }
  return conditions;
}

export type FacetWithCounts = {
  key: string;
  label: string;
  options: { value: string; label: string; count: number }[];
};

// Conteo de productos publicados de la categoria por cada opcion, en una
// sola consulta. Solo devuelve opciones con al menos un producto.
export async function getFacetsWithCounts(categorySlug: string): Promise<FacetWithCounts[]> {
  const definitions = getFacetDefinitions(categorySlug);
  if (definitions.length === 0) return [];
  const categoryIds = await resolveCategoryIds(categorySlug);
  if (!categoryIds) return [];

  const flat = definitions.flatMap((facet) =>
    facet.options.map((option) => ({ facet, option }))
  );
  const columns = flat.map(({ option }) => sql<number>`count(*) filter (where ${option.where})::int`);

  const [row] = await db
    .select(
      Object.fromEntries(columns.map((c, i) => [`c${i}`, c])) as Record<string, SQL<number>>
    )
    .from(products)
    .where(and(eq(products.status, "published"), inArray(products.categoryId, categoryIds)));

  return definitions
    .map((facet) => ({
      key: facet.key,
      label: facet.label,
      options: facet.options
        .map((option) => ({
          value: option.value,
          label: option.label,
          count: Number((row as Record<string, number>)[`c${flat.findIndex((f) => f.option === option)}`] ?? 0),
        }))
        .filter((o) => o.count > 0),
    }))
    .filter((facet) => facet.options.length > 0);
}
