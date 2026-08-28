import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { brands } from "@/lib/db/schema";

export async function getPublishedBrands() {
  return db
    .select()
    .from(brands)
    .where(eq(brands.status, "published"))
    .orderBy(asc(brands.sortOrder));
}

export async function getBrandBySlug(slug: string) {
  const [brand] = await db
    .select()
    .from(brands)
    .where(and(eq(brands.slug, slug), eq(brands.status, "published")))
    .limit(1);
  return brand ?? null;
}
