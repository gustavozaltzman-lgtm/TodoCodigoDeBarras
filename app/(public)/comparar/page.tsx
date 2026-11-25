import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/features/products/queries";
import { AvailabilityBadge } from "@/components/catalog/availability-badge";

// Pagina de uso (depende de la seleccion de cada visitante): no se indexa.
export const metadata: Metadata = {
  title: "Comparar equipos",
  robots: { index: false, follow: true },
};

const MAX = 3;

type ComparePageProps = {
  searchParams: Promise<{ p?: string }>;
};

const norm = (label: string) => label.trim().toLowerCase();

export default async function CompararPage({ searchParams }: ComparePageProps) {
  const { p } = await searchParams;
  const slugs = Array.from(
    new Set((p ?? "").split(",").map((s) => s.trim()).filter(Boolean))
  ).slice(0, MAX);

  const found = await Promise.all(slugs.map((slug) => getProductBySlug(slug)));
  const items = found.filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (items.length < 2) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <span className="eyebrow">Comparador</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-primary">
          Comparar equipos
        </h1>
        <p className="mt-3 text-secondary">
          Elegí al menos dos equipos con el botón “Comparar” de cada tarjeta del
          catálogo y los ves lado a lado, con las diferencias resaltadas.
        </p>
        <Link
          href="/catalogo"
          className="mt-6 inline-flex min-h-11 items-center rounded-md bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Ir al catálogo
        </Link>
      </main>
    );
  }

  // Filas = etiquetas de especificacion de todos los equipos, en orden de
  // aparicion. Una fila se resalta cuando los valores no coinciden.
  const rows: { key: string; label: string }[] = [];
  for (const item of items) {
    for (const spec of item.specifications) {
      const key = norm(spec.label);
      if (!rows.some((r) => r.key === key)) rows.push({ key, label: spec.label });
    }
  }
  const valueOf = (item: (typeof items)[number], key: string) =>
    item.specifications.find((s) => norm(s.label) === key)?.value ?? null;

  const without = (slug: string) =>
    `/comparar?p=${items
      .filter((i) => i.slug !== slug)
      .map((i) => encodeURIComponent(i.slug))
      .join(",")}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <span className="eyebrow">Comparador</span>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-primary">
        Comparar equipos
      </h1>
      <p className="mt-2 text-sm text-secondary">
        Las filas resaltadas son las que difieren entre los equipos. Un guion
        significa que ese dato no está cargado para ese equipo.
      </p>

      <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="align-top">
              <th className="sticky left-0 w-40 bg-white p-4 text-left text-xs font-medium uppercase tracking-wide text-secondary" />
              {items.map((item) => (
                <th key={item.id} className="min-w-[200px] border-l border-border p-4 text-left font-normal">
                  <Link href={`/productos/${item.slug}`} className="block">
                    <span className="relative mb-3 block aspect-[4/3] overflow-hidden rounded-md bg-muted">
                      {item.images[0] && (
                        <Image
                          src={item.images[0].url}
                          alt={item.images[0].alt ?? item.name}
                          fill
                          sizes="240px"
                          className="object-contain"
                        />
                      )}
                    </span>
                    {item.brand && (
                      <span className="block text-xs font-medium text-accent">{item.brand.name}</span>
                    )}
                    <span className="block font-semibold text-primary hover:underline">
                      {item.name}
                    </span>
                  </Link>
                  <span className="mt-2 block">
                    <AvailabilityBadge availability={item.availability} />
                  </span>
                  <span className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/productos/${item.slug}#consulta`}
                      className="inline-flex min-h-9 items-center rounded-md bg-accent px-3 text-xs font-semibold text-white transition-colors hover:bg-orange-600"
                    >
                      Cotizar
                    </Link>
                    <Link
                      href={without(item.slug)}
                      className="inline-flex min-h-9 items-center rounded-md border border-border px-3 text-xs text-secondary transition-colors hover:border-accent hover:text-primary"
                    >
                      Quitar
                    </Link>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { key: "__model", label: "Modelo", get: (i: (typeof items)[number]) => i.model },
              { key: "__mpn", label: "MPN", get: (i: (typeof items)[number]) => i.mpn },
            ].map((row) => {
              const values = items.map((i) => row.get(i));
              if (values.every((v) => !v)) return null;
              const differs = new Set(values.map((v) => v ?? "")).size > 1;
              return (
                <Row key={row.key} label={row.label} values={values} differs={differs} />
              );
            })}
            {rows.map((row) => {
              const values = items.map((i) => valueOf(i, row.key));
              const differs = new Set(values.map((v) => (v ?? "").toLowerCase())).size > 1;
              return <Row key={row.key} label={row.label} values={values} differs={differs} />;
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/contacto"
          className="inline-flex min-h-11 items-center rounded-md bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Pedí tu cotización
        </Link>
        <Link
          href="/catalogo"
          className="inline-flex min-h-11 items-center rounded-md border border-border bg-white px-5 text-sm font-medium text-primary transition-colors hover:border-accent"
        >
          Seguir viendo el catálogo
        </Link>
      </div>
    </main>
  );
}

function Row({
  label,
  values,
  differs,
}: {
  label: string;
  values: (string | null)[];
  differs: boolean;
}) {
  return (
    <tr className={`border-t border-border align-top ${differs ? "bg-accent-soft/50" : ""}`}>
      <th
        scope="row"
        className={`sticky left-0 p-4 text-left text-sm font-medium text-secondary ${
          differs ? "bg-accent-soft" : "bg-white"
        }`}
      >
        {label}
      </th>
      {values.map((value, i) => (
        <td key={i} className="font-mono-data break-words border-l border-border p-4 text-primary">
          {value ?? <span className="text-secondary">—</span>}
        </td>
      ))}
    </tr>
  );
}
