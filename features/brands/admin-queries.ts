import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { brands } from "@/lib/db/schema";

export async function getAllBrands() {
  return db.select().from(brands).orderBy(asc(brands.sortOrder), asc(brands.name));
}

export async function getBrandById(id: number) {
  const [brand] = await db.select().from(brands).where(eq(brands.id, id)).limit(1);
  return brand ?? null;
}
