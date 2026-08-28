import type { Metadata } from "next";
import Link from "next/link";
import { getAllPublicDocuments } from "@/features/products/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Recursos técnicos",
  description:
    "Fichas técnicas y documentación oficial de los equipos de nuestro catálogo.",
  alternates: {
    canonical: "/recursos",
  },
};

const TYPE_LABELS: Record<string, string> = {
  datasheet: "Ficha técnica",
  manual: "Manual",
  other: "Documento",
};

export default async function RecursosPage() {
  const documents = await getAllPublicDocuments();

  const byBrand = new Map<string, typeof documents>();
  for (const doc of documents) {
    const key = doc.brandName ?? "Otros";
    if (!byBrand.has(key)) byBrand.set(key, []);
    byBrand.get(key)!.push(doc);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-primary">
        Recursos técnicos
      </h1>
      <p className="mt-2 max-w-2xl text-secondary">
        Fichas técnicas y manuales oficiales de los equipos de nuestro
        catálogo, organizados por marca. Cada documento enlaza directamente a
        la fuente oficial del fabricante.
      </p>

      {byBrand.size === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-border p-10 text-center text-secondary">
          Todavía no hay documentos publicados.
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {[...byBrand.entries()].map(([brandName, docs]) => (
            <section key={brandName}>
              <h2 className="text-xl font-semibold text-primary">{brandName}</h2>
              <ul className="mt-4 space-y-2">
                {docs.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex flex-wrap items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm"
                  >
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer text-secondary transition-colors hover:text-primary"
                    >
                      <span className="font-medium text-primary">
                        {TYPE_LABELS[doc.type] ?? "Documento"}:
                      </span>{" "}
                      {doc.title}
                    </a>
                    <span className="text-secondary">—</span>
                    <Link
                      href={`/productos/${doc.productSlug}`}
                      className="cursor-pointer text-secondary transition-colors hover:text-primary hover:underline"
                    >
                      {doc.productName}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
