"use server";

import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { brands, productImages, products } from "@/lib/db/schema";
import { searchCondition } from "./queries";

export type SearchResult = {
  slug: string;
  name: string;
  brandName: string | null;
  imageUrl: string | null;
};

const MAX_RESULTS = 6;
const MAX_TERM_LENGTH = 60;

// Buscador instantaneo del header. Es de solo lectura, publico y devuelve
// unicamente datos que ya se ven en el catalogo (nombre, marca, foto):
// nunca precio, costo ni productos en borrador. Se acota el largo de la
// busqueda y la cantidad de resultados.
export async function searchProductsAction(term: string): Promise<SearchResult[]> {
  const clean = term.trim().slice(0, MAX_TERM_LENGTH);
  if (clean.length < 2) return [];
  const condition = searchCondition(clean);
  if (!condition) return [];

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      brandName: brands.name,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(and(eq(products.status, "published"), condition))
    .orderBy(asc(products.sortOrder), asc(products.name))
    .limit(MAX_RESULTS);

  if (rows.length === 0) return [];

  const images = await db
    .select({ productId: productImages.productId, url: productImages.url })
    .from(productImages)
    .where(
      and(
        inArray(
          productImages.productId,
          rows.map((r) => r.id)
        ),
        eq(productImages.isPrimary, true)
      )
    );
  const imageByProduct = new Map(images.map((i) => [i.productId, i.url]));

  return rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    brandName: r.brandName,
    imageUrl: imageByProduct.get(r.id) ?? null,
  }));
}
