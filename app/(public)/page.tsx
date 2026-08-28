import Image from "next/image";
import Link from "next/link";
import { getPublishedTopCategories } from "@/features/categories/queries";
import { getPublishedBrands } from "@/features/brands/queries";
import { getFeaturedProducts } from "@/features/products/queries";
import { ProductCard } from "@/components/catalog/product-card";
import { CategoryIcon } from "@/components/layout/category-icon";
import { siteConfig } from "@/lib/config/site";

export const revalidate = 3600;

// Anchos pseudo-aleatorios para la franja decorativa tipo codigo de barras del hero
const BARCODE_WIDTHS = [
  2, 1, 4, 1, 2, 3, 1, 5, 2, 1, 3, 1, 1, 4, 2, 1, 3, 2, 1, 5, 1, 2, 4, 1, 2, 1,
  3, 1, 2, 5, 1, 1, 3, 2, 1, 4, 2, 1, 2, 3, 1, 1, 5, 2, 1, 3, 1, 2, 4, 1, 1, 2,
  3, 1, 5, 2, 1, 1, 4, 2,
];

// Fotos reales de producto para la composicion del hero (una por familia de
// hardware: impresora industrial, escaner, cómputo movil, lector RFID fijo).
const HERO_HARDWARE = [
  {
    slug: "zebra-zt411",
    name: "Impresora industrial",
    url: "https://tqoxsbd82945ttxp.public.blob.vercel-storage.com/products/zebra-zt411/zebra-zt411-H9rC16y1NydH22hcKlmK1VsXNeeDZS.jpg",
  },
  {
    slug: "zebra-ds2208",
    name: "Escáner 1D/2D",
    url: "https://tqoxsbd82945ttxp.public.blob.vercel-storage.com/products/zebra-ds2208/zebra-ds2208-SL9QVRIUQYJ7dQQO5fevtzq84Q3HWR.jpg",
  },
  {
    slug: "zebra-tc22",
    name: "Cómputo móvil",
    url: "https://tqoxsbd82945ttxp.public.blob.vercel-storage.com/products/zebra-tc22/zebra-tc22-RPUKHQSdmEX8qarFw0uVcDab9oBoDM.jpg",
  },
  {
    slug: "zebra-fx9600",
    name: "Lector RFID fijo",
    url: "https://tqoxsbd82945ttxp.public.blob.vercel-storage.com/products/zebra-fx9600/zebra-fx9600-OGfyRz9z8QpKpgwA0xm5Xi7JRrx0dd.jpg",
  },
];

const DIFERENCIALES = [
  {
    title: "Asesoramiento técnico especializado",
    description: "Te ayudamos a elegir el equipo exacto para tu infraestructura.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
      />
    ),
  },
  {
    title: "Stock y disponibilidad",
    description: "Equipos e insumos listos para responder con rapidez a tu operación.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
      />
    ),
  },
  {
    title: "Soporte directo y post-venta",
    description: "Acompañamiento técnico antes, durante y después de la compra.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
      />
    ),
  },
];

const SOLUCIONES = [
  {
    slug: "logistica-y-depositos",
    title: "Logística y Depósitos",
    description: "Control de inventario, recepción y despachos.",
  },
  {
    slug: "retail-y-punto-de-venta",
    title: "Retail y Punto de Venta",
    description: "Etiquetado y lectura rápida.",
  },
  {
    slug: "manufactura-e-industria",
    title: "Manufactura e Industria",
    description: "Trazabilidad de planta y activos.",
  },
  {
    slug: "salud-y-laboratorios",
    title: "Salud y Laboratorios",
    description: "Identificación de muestras y pacientes.",
  },
  {
    slug: "control-de-activos",
    title: "Control de Activos",
    description: "Seguimiento RFID de bienes de uso.",
  },
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
        <Image
          src="/brand/warehouse-hero.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        {/* Overlay oscuro para contraste de texto (40-50%) */}
        <div className="absolute inset-0 bg-primary/[.45]" />
        {/* Refuerzo de contraste sobre la columna de texto (izquierda) */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/50 to-transparent" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_0%,black_30%,transparent_100%)]"
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

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pt-24 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-28 lg:pb-24">
          <div className="text-center lg:text-left">
            <span className="eyebrow inline-flex items-center gap-2 text-orange-400 [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
              Hardware para código de barras, QR, RFID y etiquetas inteligentes
            </span>
            <h1 className="mx-auto mt-4 max-w-xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:mx-0 lg:text-6xl">
              Tecnología que impulsa tu operación
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-balance text-base text-slate-300 sm:text-xl lg:mx-0">
              Equipos y soluciones para identificar, capturar, imprimir y
              controlar.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4 lg:justify-start">
              <Link
                href="/catalogo"
                className="w-full cursor-pointer rounded-md bg-accent px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-colors hover:bg-orange-600 sm:w-auto"
              >
                Ver catálogo
              </Link>
              <Link
                href="/contacto"
                className="w-full cursor-pointer rounded-md border border-white/20 bg-white/5 px-6 py-3 text-center text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/10 sm:w-auto"
              >
                Solicitar información
              </Link>
            </div>
          </div>

          {/* Composicion de hardware real: impresora, escaner, movilidad, RFID */}
          <div className="mx-auto w-full max-w-sm">
            <span className="eyebrow mb-3 block text-center text-slate-300 lg:text-left">
              Destacados
            </span>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {HERO_HARDWARE.map((item) => (
                <Link
                  key={item.slug}
                  href={`/productos/${item.slug}`}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-white/95 shadow-xl ring-1 ring-white/10 transition-transform duration-200 hover:-translate-y-1"
                >
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="object-contain p-4 transition-transform duration-200 group-hover:scale-105"
                    sizes="(min-width: 1024px) 20vw, 40vw"
                  />
                  <span className="font-mono-data absolute inset-x-0 bottom-0 bg-primary/85 px-2 py-1.5 text-center text-[10px] uppercase tracking-wide text-white">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Diferencial B2B */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {DIFERENCIALES.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-5 w-5 text-accent"
                  aria-hidden="true"
                >
                  {item.icon}
                </svg>
              </span>
              <h3 className="mt-4 font-medium text-primary">{item.title}</h3>
              <p className="mt-1.5 text-sm text-secondary">{item.description}</p>
            </div>
          ))}
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

      {/* Soluciones por industria */}
      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <span className="eyebrow">Soluciones</span>
          <h2 className="mt-2 text-2xl font-semibold text-primary">
            Soluciones por industria
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUCIONES.map((solucion) => (
              <Link
                key={solucion.slug}
                href={`/soluciones/${solucion.slug}`}
                className="group cursor-pointer rounded-lg border border-border bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <h3 className="font-medium text-primary">{solucion.title}</h3>
                <p className="mt-1.5 text-sm text-secondary">
                  {solucion.description}
                </p>
                <span className="mt-3 inline-flex items-center text-sm font-medium text-accent">
                  Ver más
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                  availability={product.availability}
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
                className="group flex cursor-pointer items-center justify-center rounded-lg border border-border bg-white px-8 py-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                {brand.logoUrl ? (
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain grayscale transition-all duration-200 group-hover:grayscale-0"
                  />
                ) : (
                  <span className="text-lg font-semibold text-secondary transition-colors hover:text-primary">
                    {brand.name}
                  </span>
                )}
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
            Desde 1992 acompañamos a nuestros clientes en la elección e
            implementación de soluciones tecnológicas para sus operaciones.
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
