import Link from "next/link";
import { getPublishedTopCategories } from "@/features/categories/queries";
import { getPublishedBrands } from "@/features/brands/queries";
import { getFeaturedProducts } from "@/features/products/queries";
import { ProductCard } from "@/components/catalog/product-card";
import { siteConfig } from "@/lib/config/site";

export default async function Home() {
  const [categories, brands, featuredProducts] = await Promise.all([
    getPublishedTopCategories(),
    getPublishedBrands(),
    getFeaturedProducts(),
  ]);

  return (
    <main>
      {/* Hero */}
      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
            {/* TODO: propuesta de valor real del cliente */}
            Soluciones de código de barras para tu operación
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-secondary">
            Productos y tecnología de identificación y captura de datos, con
            asesoramiento técnico especializado.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/catalogo"
              className="cursor-pointer rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary"
            >
              Ver catálogo
            </Link>
            <Link
              href="/contacto"
              className="cursor-pointer rounded-md border border-border bg-white px-6 py-3 text-sm font-medium text-secondary transition-colors hover:border-primary hover:text-primary"
            >
              Solicitar información
            </Link>
          </div>
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
                className="cursor-pointer rounded-lg border border-border p-5 transition-colors hover:border-accent hover:shadow-sm"
              >
                <span className="font-medium text-primary">
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
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  slug={product.slug}
                  name={product.name}
                  brandName={product.brand?.name}
                  imageUrl={product.images[0]?.url}
                  imageAlt={product.images[0]?.alt}
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
          <div className="mt-6 flex flex-wrap items-center gap-8">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/marcas/${brand.slug}`}
                className="cursor-pointer text-lg font-medium text-secondary transition-colors hover:text-primary"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empresa (teaser) */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
          <div>
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
