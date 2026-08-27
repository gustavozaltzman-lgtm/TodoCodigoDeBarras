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
