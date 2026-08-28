import Link from "next/link";
import { getPublishedTopCategories } from "@/features/categories/queries";
import { getPublishedBrands } from "@/features/brands/queries";
import { getFeaturedProducts } from "@/features/products/queries";
import { ProductCard } from "@/components/catalog/product-card";
import { TrustBadges } from "@/components/layout/trust-badges";
import { CategoryIcon } from "@/components/layout/category-icon";
import { siteConfig } from "@/lib/config/site";

export const revalidate = 3600;

// Anchos pseudo-aleatorios para la franja decorativa tipo codigo de barras del hero
const BARCODE_WIDTHS = [
  2, 1, 4, 1, 2, 3, 1, 5, 2, 1, 3, 1, 1, 4, 2, 1, 3, 2, 1, 5, 1, 2, 4, 1, 2, 1,
  3, 1, 2, 5, 1, 1, 3, 2, 1, 4, 2, 1, 2, 3, 1, 1, 5, 2, 1, 3, 1, 2, 4, 1, 1, 2,
  3, 1, 5, 2, 1, 1, 4, 2,
];

export default async function Home() {
  const [categories, brands, featuredProducts] = await Promise.all([
    getPublishedTopCategories(),
    getPublishedBrands(),
    getFeaturedProducts(),
  ]);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.15] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_0%,black_30%,transparent_100%)]"
        />

        {/* Barras decorativas tipo codigo de barras */}
        <svg
          aria-hidden="true"
          viewBox="0 0 400 60"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-0 h-14 w-full opacity-40 sm:h-20"
        >
          {BARCODE_WIDTHS.map((w, i) => (
            <rect
              key={i}
              x={BARCODE_WIDTHS.slice(0, i).reduce((a, b) => a + b + 1.4, 0)}
              y="0"
              width={w}
              height="60"
              fill="white"
            />
          ))}
        </svg>

        {/* Linea de escaneo animada */}
        <div
          aria-hidden="true"
          className="animate-scan pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_12px_2px_rgba(251,146,60,0.6)]"
        />

        <div className="relative mx-auto max-w-6xl px-4 pt-28 pb-24 text-center">
          <span className="eyebrow inline-flex items-center gap-2 text-orange-400">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
            Hardware AIDC &amp; RFID
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tecnología que impulsa tu operación
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-slate-300 sm:text-xl">
            Equipos y soluciones para identificar, capturar, imprimir y
            controlar.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/catalogo"
              className="cursor-pointer rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-colors hover:bg-orange-600"
            >
              Ver catálogo
            </Link>
            <Link
              href="/contacto"
              className="cursor-pointer rounded-md border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              Solicitar información
            </Link>
          </div>

          <TrustBadges variant="dark" />
        </div>
      </section>

      {/* Categorías */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold text-primary">Categorías</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/catalogo/${category.slug}`}
                className="group cursor-pointer rounded-lg border border-border bg-white p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <CategoryIcon
                  slug={category.slug}
                  className="mx-auto h-8 w-8 text-accent transition-transform duration-200 group-hover:scale-110"
                />
                <span className="mt-3 block font-medium text-primary">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Productos destacados */}
      {featuredProducts.length > 0 && (
        <section className="bg-muted">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-2xl font-semibold text-primary">
              Productos destacados
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  slug={product.slug}
                  name={product.name}
                  brandName={product.brand?.name}
                  imageUrl={product.images[0]?.url}
                  imageAlt={product.images[0]?.alt}
                  priority={index === 0}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Marcas */}
      {brands.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold text-primary">Marcas</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/marcas/${brand.slug}`}
                className="cursor-pointer rounded-lg border border-border bg-white px-6 py-4 text-lg font-semibold text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:text-primary hover:shadow-md"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empresa (teaser) */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-primary">
            {siteConfig.name}
          </h2>
          <p className="mt-3 text-secondary">
            {/* TODO: copy institucional real */}
            Contamos con experiencia acompañando a nuestros clientes en la
            elección e implementación de soluciones tecnológicas para sus
            operaciones.
          </p>
          <Link
            href="/empresa"
            className="mt-4 inline-block cursor-pointer text-sm font-medium text-accent transition-colors hover:text-primary hover:underline"
          >
            Conocé más sobre nosotros →
          </Link>
        </div>
      </section>

      {/* Contacto CTA */}
      <section className="bg-primary">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold text-white">
            ¿Necesitás asesoramiento?
          </h2>
          <p className="mt-2 text-slate-300">
            Contactanos y te ayudamos a encontrar la solución adecuada.
          </p>
          <Link
            href="/contacto"
            className="mt-6 inline-block cursor-pointer rounded-md bg-white px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-muted"
          >
            Contactar
          </Link>
        </div>
      </section>
    </main>
  );
}
