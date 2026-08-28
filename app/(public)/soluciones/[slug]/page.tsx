import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  INDUSTRY_SOLUTIONS,
  getIndustrySolution,
} from "@/lib/content/industry-solutions";
import { buildWhatsAppUrl, siteConfig, whatsappMessages } from "@/lib/config/site";
import { breadcrumbJsonLd, jsonLdToScript } from "@/lib/seo/jsonld";

export const revalidate = 3600;

type SolucionPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return INDUSTRY_SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: SolucionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = getIndustrySolution(slug);
  if (!solution) return {};
  return {
    title: `Soluciones para ${solution.title}`,
    description: solution.description,
    alternates: { canonical: `/soluciones/${solution.slug}` },
  };
}

export default async function SolucionPage({ params }: SolucionPageProps) {
  const { slug } = await params;
  const solution = getIndustrySolution(slug);
  if (!solution) notFound();

  const breadcrumb = breadcrumbJsonLd([
    { name: "Soluciones", url: `${siteConfig.url}/catalogo` },
    { name: solution.title, url: `${siteConfig.url}/soluciones/${solution.slug}` },
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToScript(breadcrumb) }}
      />

      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <nav className="text-sm text-secondary">
            <Link href="/catalogo" className="cursor-pointer hover:text-primary">
              Soluciones
            </Link>{" "}
            / <span className="text-primary">{solution.title}</span>
          </nav>
          <span className="eyebrow mt-3 inline-block">Solución por industria</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            {solution.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-secondary">
            {solution.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalogo"
              className="cursor-pointer rounded-md bg-accent px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-colors hover:bg-orange-600"
            >
              Ver catálogo
            </Link>
            {siteConfig.whatsappNumber && (
              <a
                href={buildWhatsAppUrl(whatsappMessages.general())}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-md border border-border bg-white px-6 py-3 text-center text-sm font-medium text-primary transition-colors hover:border-accent"
              >
                Consultar por WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-xl font-semibold text-primary">Otras soluciones</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {INDUSTRY_SOLUTIONS.filter((s) => s.slug !== solution.slug).map((s) => (
            <Link
              key={s.slug}
              href={`/soluciones/${s.slug}`}
              className="cursor-pointer rounded-full border border-border px-4 py-1.5 text-sm text-secondary transition-colors hover:border-accent hover:text-primary"
            >
              {s.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
