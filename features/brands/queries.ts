import { cache } from "react";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { brands } from "@/lib/db/schema";

async function getPublishedBrandsUncached() {
  return db
    .select()
    .from(brands)
    .where(eq(brands.status, "published"))
    .orderBy(asc(brands.sortOrder));
}

async function getBrandBySlugUncached(slug: string) {
  const [brand] = await db
    .select()
    .from(brands)
    .where(and(eq(brands.slug, slug), eq(brands.status, "published")))
    .limit(1);
  return brand ?? null;
}

// Memoizada por request: generateMetadata y la pagina comparten el resultado.
export const getPublishedBrands = cache(getPublishedBrandsUncached);

// Memoizada por request: generateMetadata y la pagina comparten el resultado.
export const getBrandBySlug = cache(getBrandBySlugUncached);

export async function getAllPublishedBrandSlugs() {
  return db.select({ slug: brands.slug }).from(brands).where(eq(brands.status, "published"));
}
