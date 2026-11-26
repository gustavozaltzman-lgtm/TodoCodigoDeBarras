import { cache } from "react";
import { and, asc, desc, eq, ilike, inArray, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  brands,
  categories,
  productDocuments,
  productImages,
  productRelationships,
  products,
} from "@/lib/db/schema";

export async function getAllPublicDocuments() {
  return db
    .select({
      id: productDocuments.id,
      type: productDocuments.type,
      title: productDocuments.title,
      url: productDocuments.url,
      productName: products.name,
      productSlug: products.slug,
      brandName: brands.name,
    })
    .from(productDocuments)
    .innerJoin(products, eq(productDocuments.productId, products.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.status, "published"))
    .orderBy(asc(brands.name), asc(products.name));
}

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
  // Condiciones extra ya armadas (filtros tecnicos por categoria, ver facets.ts).
  extraConditions?: SQL[];
};

const DEFAULT_PAGE_SIZE = 12;

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

// Busqueda por palabras: cada palabra tiene que aparecer en nombre,
// descripcion corta, modelo, MPN o marca. Asi "ribbon resina" o "zebra 2d"
// funcionan aunque las palabras no esten juntas ni en ese orden.
export function searchCondition(term: string): SQL | undefined {
  const tokens = term.trim().split(/\s+/).filter(Boolean).slice(0, 6);
  if (tokens.length === 0) return undefined;
  return and(
    ...tokens.map((token) => {
      const like = `%${escapeLike(token)}%`;
      return or(
        ilike(products.name, like),
        ilike(products.shortDescription, like),
        ilike(products.model, like),
        ilike(products.mpn, like),
        ilike(brands.name, like)
      )!;
    })
  );
}

// Una categoria top-level (ej. "Impresion") no tiene productos asignados
// directamente: los productos cuelgan de sus subcategorias (ej.
// "Industriales"). Devuelve la categoria pedida + sus hijas directas.
export async function resolveCategoryIds(slug: string): Promise<number[] | null> {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
    columns: { id: true },
  });
  if (!category) return null;
  const children = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.parentId, category.id));
  return [category.id, ...children.map((c) => c.id)];
}

export async function getCatalogProducts(filters: CatalogFilters) {
  const page = Math.max(filters.page ?? 1, 1);
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;

  const conditions: SQL[] = [eq(products.status, "published")];

  if (filters.search) {
    const search = searchCondition(filters.search);
    if (search) conditions.push(search);
  }

  if (filters.categorySlug) {
    const categoryIds = await resolveCategoryIds(filters.categorySlug);
    conditions.push(categoryIds ? inArray(products.categoryId, categoryIds) : sql`false`);
  }

  if (filters.extraConditions) conditions.push(...filters.extraConditions);

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
        availability: products.availability,
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

async function getProductBySlugUncached(slug: string) {
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

export async function getAllPublishedProductSlugs() {
  return db
    .select({ slug: products.slug, updatedAt: products.updatedAt })
    .from(products)
    .where(eq(products.status, "published"));
}

async function findPublishedCards(ids: number[]) {
  if (ids.length === 0) return [];
  return db.query.products.findMany({
    where: and(inArray(products.id, ids), eq(products.status, "published")),
    with: {
      brand: true,
      images: {
        orderBy: (image, { desc: descOrder }) => [descOrder(image.isPrimary)],
        limit: 1,
      },
    },
  });
}

// Relaciones de una ficha, en tres grupos segun lo que necesita el comprador:
//  - complements: insumos/accesorios de ESTE equipo (relacion "compatible" o
//    "accessory" cargada desde este producto).
//  - fitsWith: equipos con los que se usa ESTE producto, cuando este producto
//    es el insumo/accesorio (la misma relacion leida al reves).
//  - alternatives: otros equipos publicados de la misma categoria, siempre
//    datos reales, nunca inventados.
export async function getProductRelationGroups(
  productId: number,
  categoryId: number | null
) {
  // La consulta de "misma categoria" no depende de las relaciones: se lanza
  // junto con ellas para no sumar una ida y vuelta a la base.
  const sameCategoryPromise =
    categoryId !== null
      ? db
          .select({ id: products.id })
          .from(products)
          .where(and(eq(products.status, "published"), eq(products.categoryId, categoryId)))
          .orderBy(asc(products.sortOrder), asc(products.name))
          .limit(8)
      : Promise.resolve([] as { id: number }[]);

  const [forward, reverse] = await Promise.all([
    db
      .select({
        id: productRelationships.relatedProductId,
        type: productRelationships.type,
      })
      .from(productRelationships)
      .where(eq(productRelationships.productId, productId)),
    db
      .select({
        id: productRelationships.productId,
        type: productRelationships.type,
      })
      .from(productRelationships)
      .where(eq(productRelationships.relatedProductId, productId)),
  ]);

  const supply = (type: string) => type === "compatible" || type === "accessory";
  const complementIds = forward.filter((r) => supply(r.type)).map((r) => r.id);
  const fitsWithIds = reverse.filter((r) => supply(r.type)).map((r) => r.id);
  const relatedIds = forward.filter((r) => r.type === "related").map((r) => r.id);

  const [complements, fitsWith, related] = await Promise.all([
    findPublishedCards(complementIds),
    findPublishedCards(fitsWithIds),
    findPublishedCards(relatedIds),
  ]);

  const taken = new Set([
    productId,
    ...complements.map((p) => p.id),
    ...fitsWith.map((p) => p.id),
    ...related.map((p) => p.id),
  ]);

  const sameCategory = await sameCategoryPromise;
  const alternatives =
    sameCategory.length > 0
      ? (
          await findPublishedCards(
            sameCategory.map((p) => p.id).filter((id) => !taken.has(id))
          )
        ).slice(0, 4)
      : [];

  return { complements, fitsWith, related, alternatives };
}

// Memoizada por request: generateMetadata y la pagina comparten el resultado.
export const getProductBySlug = cache(getProductBySlugUncached);
