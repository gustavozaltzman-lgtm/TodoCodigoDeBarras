import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  brands,
  categories,
  productImages,
  productSpecifications,
  products,
} from "@/lib/db/schema";
import { resolveCategoryIds } from "@/features/products/queries";

// Selector de insumos por impresora.
//
// No declara "compatible" por su cuenta: compara SOLO las medidas que la
// ficha de la impresora publica (ancho de etiqueta, ancho/nucleo/largo de
// ribbon) contra las medidas de cada insumo, y muestra que se verifico y que
// no. Lo que la ficha no dice no se filtra ni se supone.

export type Range = [number, number];

export type Constraints = {
  labelWidth?: Range;
  ribbonWidth?: Range;
  ribbonCoreMm?: number;
  ribbonMaxLengthM?: number;
  // Texto de origen de cada dato, tal como figura en la ficha.
  sources: { label: string; value: string }[];
};

export type Check = { ok: boolean; text: string };

export type SupplyCard = {
  id: number;
  slug: string;
  name: string;
  brandName: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  availability: "in_stock" | "out_of_stock" | "preorder" | "discontinued";
  checks: Check[];
};

export type PrinterOption = {
  id: number;
  slug: string;
  name: string;
  imageUrl: string | null;
  constraints: Constraints;
};

const num = (text: string) => Number(text.replace(",", "."));

function parseRange(text: string): Range | null {
  const found = text.match(/\d+(?:[.,]\d+)?/g);
  if (!found || found.length < 2) return null;
  const [a, b] = [num(found[0]!), num(found[1]!)];
  return a <= b ? [a, b] : [b, a];
}

function parseSingleMm(text: string): number | null {
  const inParens = text.match(/\((\d+(?:[.,]\d+)?)\s*mm\)/i);
  if (inParens) return num(inParens[1]!);
  const plain = text.match(/^\s*(\d+(?:[.,]\d+)?)\s*mm/i);
  return plain ? num(plain[1]!) : null;
}

type Spec = { label: string; value: string };

export function parseConstraints(specs: Spec[]): Constraints {
  const c: Constraints = { sources: [] };
  const addSource = (spec: Spec) => c.sources.push({ label: spec.label, value: spec.value });

  for (const spec of specs) {
    const label = spec.label.toLowerCase();

    if (/^ancho de (etiqueta|medio)/.test(label)) {
      const range = parseRange(spec.value);
      if (range) {
        c.labelWidth = range;
        addSource(spec);
      }
    } else if (/^ancho de ribbon/.test(label)) {
      const range = parseRange(spec.value);
      if (range) {
        c.ribbonWidth = range;
        addSource(spec);
      }
    } else if (/^largo m[aá]ximo de ribbon/.test(label)) {
      const m = spec.value.match(/(\d+(?:[.,]\d+)?)\s*m\b/i);
      if (m) {
        c.ribbonMaxLengthM = num(m[1]!);
        addSource(spec);
      }
    } else if (/^cinta/.test(label)) {
      // Ej.: "Hasta 450 m, núcleo 1", ancho 40-110 mm"
      const length = spec.value.match(/hasta\s+(\d+(?:[.,]\d+)?)\s*m\b/i);
      const core = spec.value.match(/n[uú]cleo\s*(\d+(?:[.,]\d+)?)\s*"/i);
      const width = spec.value.match(/ancho\s*([\d.,]+\s*-\s*[\d.,]+)\s*mm/i);
      let used = false;
      if (length) {
        c.ribbonMaxLengthM = num(length[1]!);
        used = true;
      }
      if (core) {
        c.ribbonCoreMm = Math.round(num(core[1]!) * 25.4 * 10) / 10;
        used = true;
      }
      if (width) {
        const range = parseRange(width[1]!);
        if (range) {
          c.ribbonWidth = range;
          used = true;
        }
      }
      if (used) addSource(spec);
    }
  }
  return c;
}

export function hasUsableData(c: Constraints) {
  return Boolean(c.labelWidth || c.ribbonWidth || c.ribbonCoreMm || c.ribbonMaxLengthM);
}

// Decimales con coma, como se escribe en el sitio.
const fmt = (n: number) => String(n).replace(".", ",");
const within = (v: number, [min, max]: Range) => v >= min - 0.01 && v <= max + 0.01;

// Verifica un ribbon contra las medidas de la impresora. Devuelve null si no
// hay nada verificable (ni la impresora ni el insumo tienen el dato).
export function checkRibbon(c: Constraints, specs: Spec[]): Check[] {
  const get = (name: string) => specs.find((s) => s.label.toLowerCase() === name)?.value;
  const checks: Check[] = [];

  const width = get("ancho") ? parseSingleMm(get("ancho")!) : null;
  if (c.ribbonWidth && width !== null) {
    const ok = within(width, c.ribbonWidth);
    checks.push({
      ok,
      text: `Ancho ${fmt(width)} mm ${ok ? "dentro de" : "fuera de"} ${fmt(c.ribbonWidth[0])}–${fmt(c.ribbonWidth[1])} mm`,
    });
  }

  const core = get("diámetro de core") ? parseSingleMm(get("diámetro de core")!) : null;
  if (c.ribbonCoreMm && core !== null) {
    const ok = Math.abs(core - c.ribbonCoreMm) <= 0.6;
    checks.push({
      ok,
      text: ok
        ? `Núcleo de ${fmt(core)} mm coincide`
        : `Núcleo de ${fmt(core)} mm (la impresora usa ${fmt(c.ribbonCoreMm)} mm)`,
    });
  }

  const lengthText = get("largo");
  const length = lengthText ? Number(lengthText.replace(",", ".").match(/[\d.]+/)?.[0]) : NaN;
  if (c.ribbonMaxLengthM && Number.isFinite(length)) {
    const ok = length <= c.ribbonMaxLengthM;
    checks.push({
      ok,
      text: `Largo ${fmt(length)} m ${ok ? "dentro del máximo" : "supera el máximo"} de ${fmt(c.ribbonMaxLengthM)} m`,
    });
  }
  return checks;
}

export function checkLabel(c: Constraints, specs: Spec[]): Check[] {
  const ancho = specs.find((s) => s.label.toLowerCase() === "ancho")?.value;
  const width = ancho ? parseSingleMm(ancho) : null;
  if (!c.labelWidth || width === null) return [];
  const ok = within(width, c.labelWidth);
  return [
    {
      ok,
      text: `Ancho ${fmt(width)} mm ${ok ? "dentro de" : "fuera de"} ${fmt(c.labelWidth[0])}–${fmt(c.labelWidth[1])} mm`,
    },
  ];
}

async function loadSpecs(ids: number[]) {
  if (ids.length === 0) return new Map<number, Spec[]>();
  const rows = await db
    .select({
      productId: productSpecifications.productId,
      label: productSpecifications.label,
      value: productSpecifications.value,
      sortOrder: productSpecifications.sortOrder,
    })
    .from(productSpecifications)
    .where(inArray(productSpecifications.productId, ids))
    .orderBy(productSpecifications.sortOrder);
  const map = new Map<number, Spec[]>();
  for (const r of rows) {
    const list = map.get(r.productId) ?? [];
    list.push({ label: r.label, value: r.value });
    map.set(r.productId, list);
  }
  return map;
}

async function loadImages(ids: number[]) {
  if (ids.length === 0) return new Map<number, { url: string; alt: string | null }>();
  const rows = await db
    .select({ productId: productImages.productId, url: productImages.url, alt: productImages.alt })
    .from(productImages)
    .where(and(inArray(productImages.productId, ids), eq(productImages.isPrimary, true)));
  return new Map(rows.map((r) => [r.productId, { url: r.url, alt: r.alt }]));
}

// Impresoras publicadas con medidas utilizables en su ficha.
export async function getPrinterOptions(): Promise<PrinterOption[]> {
  const categoryIds = await resolveCategoryIds("impresion");
  if (!categoryIds) return [];
  const rows = await db
    .select({ id: products.id, slug: products.slug, name: products.name })
    .from(products)
    .where(and(eq(products.status, "published"), inArray(products.categoryId, categoryIds)))
    .orderBy(products.name);

  const ids = rows.map((r) => r.id);
  const [specsById, images] = await Promise.all([loadSpecs(ids), loadImages(ids)]);

  return rows
    .map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      imageUrl: images.get(r.id)?.url ?? null,
      constraints: parseConstraints(specsById.get(r.id) ?? []),
    }))
    .filter((p) => hasUsableData(p.constraints));
}

async function loadSupplies(categorySlug: "ribbons" | "etiquetas") {
  const [category] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, categorySlug))
    .limit(1);
  if (!category) return [];
  return db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      availability: products.availability,
      brandName: brands.name,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(and(eq(products.status, "published"), eq(products.categoryId, category.id)))
    .orderBy(products.name);
}

export type SupplyMatches = {
  ribbons: { matches: SupplyCard[]; rejected: SupplyCard[]; unverified: SupplyCard[] };
  labels: { matches: SupplyCard[]; rejected: SupplyCard[]; unverified: SupplyCard[] };
};

export async function getSupplyMatches(constraints: Constraints): Promise<SupplyMatches> {
  const [ribbonRows, labelRows] = await Promise.all([
    loadSupplies("ribbons"),
    loadSupplies("etiquetas"),
  ]);
  const ids = [...ribbonRows, ...labelRows].map((r) => r.id);
  const [specsById, images] = await Promise.all([loadSpecs(ids), loadImages(ids)]);

  const build = (
    rows: typeof ribbonRows,
    check: (c: Constraints, specs: Spec[]) => Check[]
  ) => {
    const out = { matches: [] as SupplyCard[], rejected: [] as SupplyCard[], unverified: [] as SupplyCard[] };
    for (const r of rows) {
      const checks = check(constraints, specsById.get(r.id) ?? []);
      const card: SupplyCard = {
        id: r.id,
        slug: r.slug,
        name: r.name,
        brandName: r.brandName,
        imageUrl: images.get(r.id)?.url ?? null,
        imageAlt: images.get(r.id)?.alt ?? null,
        availability: r.availability,
        checks,
      };
      if (checks.length === 0) out.unverified.push(card);
      else if (checks.every((c) => c.ok)) out.matches.push(card);
      else out.rejected.push(card);
    }
    return out;
  };

  return {
    ribbons: build(ribbonRows, checkRibbon),
    labels: build(labelRows, checkLabel),
  };
}
