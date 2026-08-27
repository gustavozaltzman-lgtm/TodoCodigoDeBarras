import Link from "next/link";
import { getPublishedTopCategories } from "@/features/categories/queries";
import { getPublishedBrands } from "@/features/brands/queries";
import { getFeaturedProducts } from "@/features/products/queries";
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
      <section className="bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            {/* TODO: propuesta de valor real del cliente */}
            Soluciones de código de barras para tu operación
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600">
            Productos y tecnología de identificación y captura de datos, con
            asesoramiento técnico especializado.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/catalogo"
              className="rounded-md bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition hover:opacity-90"
            >
              Ver catálogo
            </Link>
            <Link
              href="/contacto"
              className="rounded-md border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 transition hover:bg-white"
            >
              Solicitar información
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold text-neutral-900">
            Categorías
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/catalogo/${category.slug}`}
                className="rounded-lg border border-neutral-200 p-5 transition hover:border-neutral-300 hover:shadow-sm"
              >
                <span className="font-medium text-neutral-900">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Productos destacados */}
      {featuredProducts.length > 0 && (
        <section className="bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-2xl font-semibold text-neutral-900">
              Productos destacados
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/productos/${product.slug}`}
                  className="rounded-lg border border-neutral-200 bg-white p-4 transition hover:shadow-sm"
                >
                  <div className="aspect-square rounded-md bg-neutral-100" />
                  <p className="mt-3 text-sm font-medium text-neutral-900">
                    {product.name}
                  </p>
                  {product.brand && (
                    <p className="text-xs text-neutral-500">
                      {product.brand.name}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Marcas */}
      {brands.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold text-neutral-900">Marcas</h2>
          <div className="mt-6 flex flex-wrap items-center gap-8">
            {brands.map((brand) => (
              <span key={brand.id} className="text-lg font-medium text-neutral-500">
                {brand.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Empresa (teaser) */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">
              {siteConfig.name}
            </h2>
            <p className="mt-3 text-neutral-600">
              {/* TODO: copy institucional real */}
              Contamos con experiencia acompañando a nuestros clientes en la
              elección e implementación de soluciones tecnológicas para sus
              operaciones.
            </p>
            <Link
              href="/empresa"
              className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
            >
              Conocé más sobre nosotros →
            </Link>
          </div>
        </div>
      </section>

      {/* Contacto CTA */}
      <section className="bg-neutral-900">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold text-white">
            ¿Necesitás asesoramiento?
          </h2>
          <p className="mt-2 text-neutral-300">
            Contactanos y te ayudamos a encontrar la solución adecuada.
          </p>
          <Link
            href="/contacto"
            className="mt-6 inline-block rounded-md bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
          >
            Contactar
          </Link>
        </div>
      </section>
    </main>
  );
}
