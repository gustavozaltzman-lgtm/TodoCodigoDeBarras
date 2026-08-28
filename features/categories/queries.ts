import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { categories, products } from "@/lib/db/schema";

// Categorias con 0 productos publicados no se muestran en la navegacion
// publica (Home, header, pills de catalogo) -- una categoria vacia
// transmite que el sitio esta incompleto. Para una categoria top-level
// esto cuenta productos propios + de sus subcategorias, asi una categoria
// "contenedora" (sin productos directos pero con hijas que si tienen) sigue
// apareciendo.
async function getCategoryIdsWithPublishedProducts(categoryIds: number[]) {
  if (categoryIds.length === 0) return new Set<number>();
  const rows = await db
    .select({ categoryId: products.categoryId })
    .from(products)
    .where(
      and(eq(products.status, "published"), inArray(products.categoryId, categoryIds))
    )
    .groupBy(products.categoryId);
  return new Set(rows.map((r) => r.categoryId).filter((id): id is number => id !== null));
}

export async function getPublishedTopCategories() {
  const top = await db
    .select()
    .from(categories)
    .where(and(eq(categories.status, "published"), isNull(categories.parentId)))
    .orderBy(asc(categories.sortOrder));
  if (top.length === 0) return [];

  const topIds = top.map((c) => c.id);
  const children = await db
    .select({ id: categories.id, parentId: categories.parentId })
    .from(categories)
    .where(and(eq(categories.status, "published"), inArray(categories.parentId, topIds)));

  const childIdsByParent = new Map<number, number[]>();
  for (const child of children) {
    const list = childIdsByParent.get(child.parentId!) ?? [];
    list.push(child.id);
    childIdsByParent.set(child.parentId!, list);
  }

  const allIds = [...topIds, ...children.map((c) => c.id)];
  const withProducts = await getCategoryIdsWithPublishedProducts(allIds);

  return top.filter(
    (category) =>
      withProducts.has(category.id) ||
      (childIdsByParent.get(category.id) ?? []).some((id) => withProducts.has(id))
  );
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
  const subcategories = await db
    .select()
    .from(categories)
    .where(and(eq(categories.status, "published"), eq(categories.parentId, parentId)))
    .orderBy(asc(categories.sortOrder));
  if (subcategories.length === 0) return [];

  const withProducts = await getCategoryIdsWithPublishedProducts(
    subcategories.map((c) => c.id)
  );
  return subcategories.filter((c) => withProducts.has(c.id));
}

export async function getAllPublishedCategorySlugs() {
  const all = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      parentId: categories.parentId,
      updatedAt: categories.updatedAt,
    })
    .from(categories)
    .where(eq(categories.status, "published"));
  if (all.length === 0) return [];

  const childIdsByParent = new Map<number, number[]>();
  for (const category of all) {
    if (category.parentId === null) continue;
    const list = childIdsByParent.get(category.parentId) ?? [];
    list.push(category.id);
    childIdsByParent.set(category.parentId, list);
  }

  const withProducts = await getCategoryIdsWithPublishedProducts(all.map((c) => c.id));

  return all.filter(
    (category) =>
      withProducts.has(category.id) ||
      (childIdsByParent.get(category.id) ?? []).some((id) => withProducts.has(id))
  );
}
