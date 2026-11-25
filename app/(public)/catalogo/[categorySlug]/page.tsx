import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getPublishedSubcategories,
} from "@/features/categories/queries";
import { getCatalogProducts, type CatalogSort } from "@/features/products/queries";
import {
  buildFacetConditions,
  getFacetDefinitions,
  getFacetsWithCounts,
} from "@/features/products/facets";
import { CatalogFacets } from "@/components/catalog/catalog-facets";
import { getPublishedBrands } from "@/features/brands/queries";
import { ProductCard } from "@/components/catalog/product-card";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { Pagination } from "@/components/catalog/pagination";
import { buildWhatsAppUrl, siteConfig, whatsappMessages } from "@/lib/config/site";
import { breadcrumbJsonLd, jsonLdToScript } from "@/lib/seo/jsonld";
import { CategoryFaq } from "@/components/catalog/category-faq";
import { CATEGORY_FAQ } from "@/lib/content/category-faq";

const VALID_SORTS: CatalogSort[] = ["relevance", "name-asc", "newest"];

type CategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
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
    alternates: {
      canonical: `/catalogo/${category.slug}`,
    },
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

  // Filtros tecnicos elegidos (solo los validos para esta categoria).
  const facetKeys = getFacetDefinitions(categorySlug).map((f) => f.key);
  const selectedFacets: Record<string, string> = {};
  for (const key of facetKeys) {
    if (sp[key]) selectedFacets[key] = sp[key]!;
  }

  const [subcategories, { items, page: currentPage, totalPages, total }, brands, facets] =
    await Promise.all([
      getPublishedSubcategories(category.id),
      getCatalogProducts({
        categorySlug,
        search: sp.q,
        brandSlug: sp.brand,
        sort,
        page,
        extraConditions: buildFacetConditions(categorySlug, selectedFacets),
      }),
      getPublishedBrands(),
      getFacetsWithCounts(categorySlug),
    ]);

  const baseParams = (facetOverrides: Record<string, string | null> = {}) => {
    const qs = new URLSearchParams();
    if (sp.q) qs.set("q", sp.q);
    if (sp.brand) qs.set("brand", sp.brand);
    if (sort !== "relevance") qs.set("sort", sort);
    const merged: Record<string, string | null | undefined> = {
      ...selectedFacets,
      ...facetOverrides,
    };
    for (const [key, value] of Object.entries(merged)) {
      if (value) qs.set(key, value);
    }
    return qs;
  };
  const withQuery = (qs: URLSearchParams) => {
    const query = qs.toString();
    return `/catalogo/${categorySlug}${query ? `?${query}` : ""}`;
  };
  const buildHref = (nextPage: number) => {
    const qs = baseParams();
    if (nextPage > 1) qs.set("page", String(nextPage));
    return withQuery(qs);
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: "Catálogo", url: `${siteConfig.url}/catalogo` },
    { name: category.name, url: `${siteConfig.url}/catalogo/${category.slug}` },
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToScript(breadcrumb) }}
      />

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

      {siteConfig.whatsappNumber && (
        <a
          href={buildWhatsAppUrl(whatsappMessages.category(category.name))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
        >
          Consultar por WhatsApp
        </a>
      )}

      {subcategories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/catalogo/${sub.slug}`}
              className="cursor-pointer rounded-full border border-border px-4 py-2 text-sm text-secondary transition-colors hover:border-accent hover:text-primary"
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
          facetParams={selectedFacets}
        />
        <CatalogFacets
          facets={facets}
          selected={selectedFacets}
          hrefFor={(key, value) => withQuery(baseParams({ [key]: value }))}
          clearHref={withQuery(
            (() => {
              const qs = new URLSearchParams();
              if (sp.q) qs.set("q", sp.q);
              if (sp.brand) qs.set("brand", sp.brand);
              if (sort !== "relevance") qs.set("sort", sort);
              return qs;
            })()
          )}
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
          No encontramos productos con esos criterios en esta categoría.
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} buildHref={buildHref} />

      <CategoryFaq items={CATEGORY_FAQ[category.slug] ?? []} />
    </main>
  );
}
