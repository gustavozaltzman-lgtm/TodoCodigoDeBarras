import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getProductRelationGroups,
} from "@/features/products/queries";
import { SectionTabs } from "@/components/catalog/section-tabs";
import { QuoteAddButton } from "@/components/quote/quote-add-button";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductSpecifications } from "@/components/catalog/product-specifications";
import { ProductDocuments } from "@/components/catalog/product-documents";
import { ProductCard } from "@/components/catalog/product-card";
import { AvailabilityBadge } from "@/components/catalog/availability-badge";
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

  const { complements, fitsWith, related, alternatives } =
    await getProductRelationGroups(product.id, product.categoryId);

  const hasCompat = complements.length > 0 || fitsWith.length > 0;
  const tabs = [
    ...(product.description ? [{ id: "descripcion", label: "Descripción" }] : []),
    ...(product.specifications.length
      ? [{ id: "especificaciones", label: "Especificaciones" }]
      : []),
    ...(hasCompat ? [{ id: "compatibilidad", label: "Compatibilidad" }] : []),
    ...(product.documents.length ? [{ id: "descargas", label: "Descargas" }] : []),
    { id: "consulta", label: "Cotizar" },
  ];

  const cards = (items: typeof alternatives) =>
    items.map((item) => (
      <ProductCard
        key={item.id}
        slug={item.slug}
        name={item.name}
        brandName={item.brand?.name}
        imageUrl={item.images[0]?.url}
        imageAlt={item.images[0]?.alt}
        availability={item.availability}
      />
    ));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    model: product.model ?? undefined,
    mpn: product.mpn ?? undefined,
    sku: product.sku ?? undefined,
    category: product.category?.name ?? undefined,
    // Specs reales de la ficha como propiedades estructuradas: da a buscadores
    // y a las IA datos tecnicos citables sin inventar nada.
    additionalProperty: product.specifications.length
      ? product.specifications.map((spec) => ({
          "@type": "PropertyValue",
          name: spec.label,
          value: spec.value,
        }))
      : undefined,
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
          <div className="mt-2">
            <AvailabilityBadge availability={product.availability} />
          </div>
          {(product.model || product.mpn) && (
            <p className="font-mono-data mt-2 text-xs text-secondary">
              {product.model && (
                <span className="mr-2 inline-block rounded border border-border bg-muted px-2 py-1">
                  MODELO {product.model}
                </span>
              )}
              {product.mpn && (
                <span className="inline-block rounded border border-border bg-muted px-2 py-1">
                  MPN {product.mpn}
                </span>
              )}
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
              Solicitar cotización por volumen
            </a>
            <QuoteAddButton slug={product.slug} name={product.name} />
            <a
              href="#consulta"
              className="cursor-pointer rounded-md border border-border bg-white px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:border-accent"
            >
              Consultar asesoramiento técnico
            </a>
            {siteConfig.whatsappNumber && (
              <a
                href={buildWhatsAppUrl(whatsappMessages.product(product.name))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex cursor-pointer items-center gap-2 rounded-md bg-green-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-600"
              >
                Contactar por WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      <SectionTabs tabs={tabs} />

      {product.description && (
        <section id="descripcion" className="mt-10 scroll-mt-32">
          <h2 className="text-xl font-semibold text-primary">Descripción</h2>
          <div className="mt-4 max-w-3xl text-secondary whitespace-pre-line">
            {product.description}
          </div>
        </section>
      )}

      {product.specifications.length > 0 && (
        <div id="especificaciones" className="mt-12 scroll-mt-32">
          <ProductSpecifications specifications={product.specifications} />
        </div>
      )}

      {hasCompat && (
        <section id="compatibilidad" className="mt-12 scroll-mt-32">
          {complements.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-primary">
                Complementá tu solución
              </h2>
              <p className="mt-1 text-sm text-secondary">
                Insumos y accesorios compatibles con este equipo.
              </p>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {cards(complements)}
              </div>
            </>
          )}
          {fitsWith.length > 0 && (
            <div className={complements.length > 0 ? "mt-10" : undefined}>
              <h2 className="text-xl font-semibold text-primary">
                Compatible con
              </h2>
              <p className="mt-1 text-sm text-secondary">
                Equipos con los que se usa este producto.
              </p>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {cards(fitsWith)}
              </div>
            </div>
          )}
        </section>
      )}

      {product.documents.length > 0 && (
        <div id="descargas" className="mt-12 scroll-mt-32">
          <ProductDocuments documents={product.documents} />
        </div>
      )}

      <section
        id="consulta"
        className="mt-12 scroll-mt-32 rounded-lg border border-border bg-muted p-5 sm:p-6"
      >
        <h2 className="text-xl font-semibold text-primary">
          Cotizar {product.name}
        </h2>
        <p className="mt-1 text-sm text-secondary">
          Indicá la cantidad y te respondemos con disponibilidad y precio por volumen.
        </p>
        <div className="mt-4">
          <InquiryForm
            type="product"
            productId={product.id}
            productName={product.name}
          />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-primary">
            Productos relacionados
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards(related)}
          </div>
        </section>
      )}

      {alternatives.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-primary">
            También puede interesarte
          </h2>
          <p className="mt-1 text-sm text-secondary">
            Otros equipos de la misma categoría.
          </p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards(alternatives)}
          </div>
        </section>
      )}

      {/* Barra de cotizacion fija, solo mobile/tablet: el boton principal siempre a mano */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-white/95 px-4 pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] backdrop-blur [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom,0px))] lg:hidden">
        <a
          href="#consulta"
          className="flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Pedí tu cotización
        </a>
        {siteConfig.whatsappNumber && (
          <a
            href={buildWhatsAppUrl(whatsappMessages.product(product.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 cursor-pointer items-center justify-center rounded-md bg-green-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-600"
          >
            WhatsApp
          </a>
        )}
      </div>
    </main>
  );
}
