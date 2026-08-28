import { asc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";

export async function getAllCategories() {
  return db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function getTopLevelCategories() {
  return db
    .select()
    .from(categories)
    .where(isNull(categories.parentId))
    .orderBy(asc(categories.name));
}

export async function getCategoryById(id: number) {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  return category ?? null;
}
