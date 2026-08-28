import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getPublishedSubcategories,
} from "@/features/categories/queries";
import { getCatalogProducts, type CatalogSort } from "@/features/products/queries";
import { getPublishedBrands } from "@/features/brands/queries";
import { ProductCard } from "@/components/catalog/product-card";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { Pagination } from "@/components/catalog/pagination";

const VALID_SORTS: CatalogSort[] = ["relevance", "name-asc", "newest"];

type CategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ q?: string; brand?: string; sort?: string; page?: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return {};
  return {
    title: category.seoTitle ?? category.name,
    description: category.seoDescription ?? category.description ?? undefined,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const sp = await searchParams;
  const sort = VALID_SORTS.includes(sp.sort as CatalogSort)
    ? (sp.sort as CatalogSort)
    : "relevance";
  const page = Number(sp.page) > 0 ? Number(sp.page) : 1;

  const [subcategories, { items, page: currentPage, totalPages, total }, brands] =
    await Promise.all([
      getPublishedSubcategories(category.id),
      getCatalogProducts({
        categorySlug,
        search: sp.q,
        brandSlug: sp.brand,
        sort,
        page,
      }),
      getPublishedBrands(),
    ]);

  const buildHref = (nextPage: number) => {
    const qs = new URLSearchParams();
    if (sp.q) qs.set("q", sp.q);
    if (sp.brand) qs.set("brand", sp.brand);
    if (sort !== "relevance") qs.set("sort", sort);
    if (nextPage > 1) qs.set("page", String(nextPage));
    const query = qs.toString();
    return `/catalogo/${categorySlug}${query ? `?${query}` : ""}`;
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <nav className="text-sm text-secondary">
        <Link href="/catalogo" className="cursor-pointer hover:text-primary">
          Catálogo
        </Link>{" "}
        / <span className="text-primary">{category.name}</span>
      </nav>

      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-primary">
        {category.name}
      </h1>
      {category.description && (
        <p className="mt-2 max-w-2xl text-secondary">{category.description}</p>
      )}

      {subcategories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/catalogo/${sub.slug}`}
              className="cursor-pointer rounded-full border border-border px-4 py-1.5 text-sm text-secondary transition-colors hover:border-accent hover:text-primary"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <CatalogFilters
          action={`/catalogo/${categorySlug}`}
          search={sp.q}
          brandSlug={sp.brand}
          sort={sort}
          brands={brands}
        />
      </div>

      <p className="mt-6 text-sm text-secondary">
        {total} {total === 1 ? "producto encontrado" : "productos encontrados"}
      </p>

      {items.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              brandName={product.brandName}
              imageUrl={product.image?.url}
              imageAlt={product.image?.alt}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-lg border border-dashed border-border p-10 text-center text-secondary">
          No encontramos productos con esos criterios en esta categoría.
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} buildHref={buildHref} />
    </main>
  );
}
