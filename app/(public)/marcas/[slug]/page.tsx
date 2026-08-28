import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrandBySlug } from "@/features/brands/queries";
import { getCatalogProducts } from "@/features/products/queries";
import { ProductCard } from "@/components/catalog/product-card";

export const revalidate = 300;

type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: brand.name,
    description: brand.description ?? undefined,
    alternates: {
      canonical: `/marcas/${brand.slug}`,
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const { items, total } = await getCatalogProducts({ brandSlug: slug, pageSize: 24 });

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-primary">
        {brand.name}
      </h1>
      {brand.description && (
        <p className="mt-2 max-w-2xl text-secondary">{brand.description}</p>
      )}

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
          Todavía no hay productos publicados de esta marca.
        </div>
      )}
    </main>
  );
}
