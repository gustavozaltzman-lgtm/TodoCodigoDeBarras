import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { brands } from "@/lib/db/schema";

export async function getPublishedBrands() {
  return db
    .select()
    .from(brands)
    .where(eq(brands.status, "published"))
    .orderBy(asc(brands.sortOrder));
}
