import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  brands,
  categories,
  productImages,
  productRelationships,
  products,
} from "@/lib/db/schema";

export async function getFeaturedProducts(limit = 8) {
  return db.query.products.findMany({
    where: and(eq(products.status, "published"), eq(products.isFeatured, true)),
    orderBy: asc(products.sortOrder),
    limit,
    with: {
      brand: true,
      images: {
        orderBy: (image, { desc: descOrder }) => [descOrder(image.isPrimary)],
        limit: 1,
      },
    },
  });
}

export type CatalogSort = "relevance" | "name-asc" | "newest";

export type CatalogFilters = {
  search?: string;
  categorySlug?: string;
  brandSlug?: string;
  sort?: CatalogSort;
  page?: number;
  pageSize?: number;
};

const DEFAULT_PAGE_SIZE = 12;

export async function getCatalogProducts(filters: CatalogFilters) {
  const page = Math.max(filters.page ?? 1, 1);
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;

  const conditions = [eq(products.status, "published")];

  if (filters.search) {
    const term = `%${filters.search}%`;
    conditions.push(
      or(
        ilike(products.name, term),
        ilike(products.shortDescription, term)
      )!
    );
  }

  if (filters.categorySlug) {
    conditions.push(eq(categories.slug, filters.categorySlug));
  }

  if (filters.brandSlug) {
    conditions.push(eq(brands.slug, filters.brandSlug));
  }

  const where = and(...conditions);

  const orderBy =
    filters.sort === "name-asc"
      ? [asc(products.name)]
      : filters.sort === "newest"
        ? [desc(products.createdAt)]
        : [asc(products.sortOrder), asc(products.name)];

  const [rows, [{ count }]] = await Promise.all([
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        shortDescription: products.shortDescription,
        brandName: brands.name,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(...orderBy)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where),
  ]);

  const productIds = rows.map((row) => row.id);
  const primaryImages = productIds.length
    ? await db
        .select({
          productId: productImages.productId,
          url: productImages.url,
          alt: productImages.alt,
        })
        .from(productImages)
        .where(
          and(
            inArray(productImages.productId, productIds),
            eq(productImages.isPrimary, true)
          )
        )
    : [];

  const imageByProductId = new Map(primaryImages.map((img) => [img.productId, img]));

  const items = rows.map((row) => ({
    ...row,
    image: imageByProductId.get(row.id) ?? null,
  }));

  return {
    items,
    total: count,
    page,
    pageSize,
    totalPages: Math.max(Math.ceil(count / pageSize), 1),
  };
}

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.status, "published")),
    with: {
      brand: true,
      category: true,
      images: {
        orderBy: (image, { desc: descOrder }) => [descOrder(image.isPrimary), asc(image.sortOrder)],
      },
      specifications: {
        orderBy: (spec, { asc: ascOrder }) => [ascOrder(spec.sortOrder)],
      },
      documents: true,
    },
  });
}

export async function getRelatedProducts(productId: number) {
  const relations = await db
    .select({ relatedProductId: productRelationships.relatedProductId })
    .from(productRelationships)
    .where(eq(productRelationships.productId, productId));

  const relatedIds = relations.map((r) => r.relatedProductId);
  if (relatedIds.length === 0) return [];

  return db.query.products.findMany({
    where: and(inArray(products.id, relatedIds), eq(products.status, "published")),
    with: {
      brand: true,
      images: {
        orderBy: (image, { desc: descOrder }) => [descOrder(image.isPrimary)],
        limit: 1,
      },
    },
  });
}
