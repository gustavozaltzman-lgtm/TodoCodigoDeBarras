import { and, asc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";

export async function getPublishedTopCategories() {
  return db
    .select()
    .from(categories)
    .where(and(eq(categories.status, "published"), isNull(categories.parentId)))
    .orderBy(asc(categories.sortOrder));
}

export async function getCategoryBySlug(slug: string) {
  const [category] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.status, "published")))
    .limit(1);
  return category ?? null;
}

export async function getPublishedSubcategories(parentId: number) {
  return db
    .select()
    .from(categories)
    .where(and(eq(categories.status, "published"), eq(categories.parentId, parentId)))
    .orderBy(asc(categories.sortOrder));
}
