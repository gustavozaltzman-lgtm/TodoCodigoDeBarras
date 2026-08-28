import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/features/products/queries";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductSpecifications } from "@/components/catalog/product-specifications";
import { ProductDocuments } from "@/components/catalog/product-documents";
import { ProductCard } from "@/components/catalog/product-card";
import { InquiryForm } from "@/components/forms/inquiry-form";
import {
  buildWhatsAppUrl,
  siteConfig,
  whatsappMessages,
} from "@/lib/config/site";
import { breadcrumbJsonLd, jsonLdToScript } from "@/lib/seo/jsonld";

export const revalidate = 300;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const title = product.seoTitle ?? product.name;
  const description =
    product.seoDescription ?? product.shortDescription ?? undefined;
  const image = product.images[0]?.url;

  return {
    title,
    description,
    alternates: {
      canonical: `/productos/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    model: product.model ?? undefined,
    mpn: product.mpn ?? undefined,
    image: product.images.map((img) => img.url),
    url: `${siteConfig.url}/productos/${product.slug}`,
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: "Catálogo", url: `${siteConfig.url}/catalogo` },
    ...(product.category
      ? [
          {
            name: product.category.name,
            url: `${siteConfig.url}/catalogo/${product.category.slug}`,
          },
        ]
      : []),
    { name: product.name, url: `${siteConfig.url}/productos/${product.slug}` },
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToScript(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToScript(breadcrumb) }}
      />

      <nav className="text-sm text-secondary">
        <Link href="/catalogo" className="cursor-pointer hover:text-primary">
          Catálogo
        </Link>
        {product.category && (
          <>
            {" "}
            /{" "}
            <Link
              href={`/catalogo/${product.category.slug}`}
              className="cursor-pointer hover:text-primary"
            >
              {product.category.name}
            </Link>
          </>
        )}{" "}
        / <span className="text-primary">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          {product.brand && (
            <Link
              href={`/marcas/${product.brand.slug}`}
              className="cursor-pointer text-sm font-medium text-accent hover:underline"
            >
              {product.brand.name}
            </Link>
          )}
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-primary">
            {product.name}
          </h1>
          {(product.model || product.mpn) && (
            <p className="mt-1 text-sm text-secondary">
              {product.model && <>Modelo: {product.model}</>}
              {product.model && product.mpn && " · "}
              {product.mpn && <>MPN: {product.mpn}</>}
            </p>
          )}
          {product.shortDescription && (
            <p className="mt-4 text-secondary">{product.shortDescription}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#consulta"
              className="cursor-pointer rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary"
            >
              Solicitar cotización
            </a>
            {siteConfig.whatsappNumber && (
              <a
                href={buildWhatsAppUrl(whatsappMessages.product(product.name))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex cursor-pointer items-center gap-2 rounded-md bg-green-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-600"
              >
                Consultar por WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {product.description && (
        <section className="mt-14">
          <h2 className="text-xl font-semibold text-primary">Descripción</h2>
          <div className="mt-4 max-w-3xl text-secondary whitespace-pre-line">
            {product.description}
          </div>
        </section>
      )}

      <div className="mt-14">
        <ProductSpecifications specifications={product.specifications} />
      </div>

      <div className="mt-14">
        <ProductDocuments documents={product.documents} />
      </div>

      <section id="consulta" className="mt-14 scroll-mt-20 rounded-lg border border-border bg-muted p-6">
        <h2 className="text-xl font-semibold text-primary">
          Solicitar información sobre {product.name}
        </h2>
        <div className="mt-4">
          <InquiryForm
            type="product"
            productId={product.id}
            productName={product.name}
          />
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-semibold text-primary">
            Productos relacionados
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard
                key={related.id}
                slug={related.slug}
                name={related.name}
                brandName={related.brand?.name}
                imageUrl={related.images[0]?.url}
                imageAlt={related.images[0]?.alt}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
