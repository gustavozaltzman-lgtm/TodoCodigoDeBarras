import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";

export async function getFeaturedProducts(limit = 8) {
  return db.query.products.findMany({
    where: and(eq(products.status, "published"), eq(products.isFeatured, true)),
    orderBy: asc(products.sortOrder),
    limit,
    with: {
      brand: true,
      images: {
        orderBy: (image, { desc }) => [desc(image.isPrimary)],
        limit: 1,
      },
    },
  });
}
