import type { Metadata } from "next";
import Link from "next/link";
import { getCatalogProducts, type CatalogSort } from "@/features/products/queries";
import { getPublishedTopCategories } from "@/features/categories/queries";
import { getPublishedBrands } from "@/features/brands/queries";
import { ProductCard } from "@/components/catalog/product-card";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { Pagination } from "@/components/catalog/pagination";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explorá nuestro catálogo completo de productos.",
  alternates: {
    canonical: "/catalogo",
  },
};

const VALID_SORTS: CatalogSort[] = ["relevance", "name-asc", "newest"];

type CatalogoPageProps = {
  searchParams: Promise<{ q?: string; brand?: string; sort?: string; page?: string }>;
};

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const params = await searchParams;
  const sort = VALID_SORTS.includes(params.sort as CatalogSort)
    ? (params.sort as CatalogSort)
    : "relevance";
  const page = Number(params.page) > 0 ? Number(params.page) : 1;

  const [{ items, page: currentPage, totalPages, total }, categories, brands] =
    await Promise.all([
      getCatalogProducts({
        search: params.q,
        brandSlug: params.brand,
        sort,
        page,
      }),
      getPublishedTopCategories(),
      getPublishedBrands(),
    ]);

  const buildHref = (nextPage: number) => {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.brand) qs.set("brand", params.brand);
    if (sort !== "relevance") qs.set("sort", sort);
    if (nextPage > 1) qs.set("page", String(nextPage));
    const query = qs.toString();
    return `/catalogo${query ? `?${query}` : ""}`;
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-primary">
        Catálogo
      </h1>

      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalogo/${category.slug}`}
              className="cursor-pointer rounded-full border border-border px-4 py-1.5 text-sm text-secondary transition-colors hover:border-accent hover:text-primary"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <CatalogFilters
          action="/catalogo"
          search={params.q}
          brandSlug={params.brand}
          sort={sort}
          brands={brands}
        />
      </div>

      <p className="mt-6 text-sm text-secondary">
        {total} {total === 1 ? "producto encontrado" : "productos encontrados"}
      </p>

      {items.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product, index) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              brandName={product.brandName}
              imageUrl={product.image?.url}
              imageAlt={product.image?.alt}
              availability={product.availability}
              priority={index === 0}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-lg border border-dashed border-border p-10 text-center text-secondary">
          No encontramos productos con esos criterios.
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} buildHref={buildHref} />
    </main>
  );
}
