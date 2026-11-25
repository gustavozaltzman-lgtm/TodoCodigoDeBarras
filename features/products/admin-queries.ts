import { and, asc, desc, eq, ilike, sql, type SQL } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { brands, categories, products } from "@/lib/db/schema";
import type { SortDir } from "@/lib/admin-sort";

export type AdminProductFilters = {
  search?: string;
  status?: "draft" | "published" | "hidden" | "archived";
  page?: number;
  sort?: ProductSortColumn;
  dir?: SortDir;
};

export const PRODUCT_SORT_COLUMNS = ["name", "brand", "category", "status", "featured"] as const;
export type ProductSortColumn = (typeof PRODUCT_SORT_COLUMNS)[number];

const PAGE_SIZE = 20;

// Vacios al final y desempate por nombre, para que el orden sea estable
// entre paginas.
function orderFor(sort: ProductSortColumn | undefined, dir: SortDir): SQL[] {
  if (!sort) return [desc(products.createdAt)];
  const column = {
    name: products.name,
    brand: brands.name,
    category: categories.name,
    status: products.status,
    featured: products.isFeatured,
  }[sort];
  const direction = dir === "desc" ? sql.raw("desc") : sql.raw("asc");
  return [sql`${column} ${direction} nulls last`, asc(products.name), asc(products.id)];
}

export async function getAllProductsAdmin(filters: AdminProductFilters) {
  const page = Math.max(filters.page ?? 1, 1);
  const conditions = [];

  if (filters.search) {
    conditions.push(ilike(products.name, `%${filters.search}%`));
  }
  if (filters.status) {
    conditions.push(eq(products.status, filters.status));
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, [{ count }]] = await Promise.all([
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        status: products.status,
        isFeatured: products.isFeatured,
        brandName: brands.name,
        categoryName: categories.name,
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(...orderFor(filters.sort, filters.dir ?? "asc"))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ count: sql<number>`count(*)::int` }).from(products).where(where),
  ]);

  return {
    items: rows,
    total: count,
    page,
    totalPages: Math.max(Math.ceil(count / PAGE_SIZE), 1),
  };
}

export async function getProductForEdit(id: number) {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      images: { orderBy: (image, { asc: ascOrder }) => [ascOrder(image.sortOrder)] },
      specifications: {
        orderBy: (spec, { asc: ascOrder }) => [ascOrder(spec.sortOrder)],
      },
      documents: true,
    },
  });
}

export async function getAllProductsLite() {
  return db
    .select({ id: products.id, name: products.name })
    .from(products)
    .orderBy(asc(products.name));
}

export async function getProductRelationshipsForEdit(productId: number) {
  return db.query.productRelationships.findMany({
    where: (rel, { eq: eqOp }) => eqOp(rel.productId, productId),
    with: { relatedProduct: true },
  });
}
