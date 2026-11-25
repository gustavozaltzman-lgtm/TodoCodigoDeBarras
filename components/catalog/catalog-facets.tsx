import Link from "next/link";
import type { FacetWithCounts } from "@/features/products/facets";

type CatalogFacetsProps = {
  facets: FacetWithCounts[];
  selected: Record<string, string | undefined>;
  // Arma el link para elegir una opcion (value) o quitarla (null).
  hrefFor: (key: string, value: string | null) => string;
  clearHref: string;
};

// Filtros tecnicos de la categoria. Son links (navegacion sin recarga
// completa), con la cantidad de productos de cada opcion.
export function CatalogFacets({ facets, selected, hrefFor, clearHref }: CatalogFacetsProps) {
  if (facets.length === 0) return null;
  const anySelected = facets.some((f) => selected[f.key]);

  return (
    <div className="mt-4 space-y-3 rounded-lg border border-border bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">Filtros técnicos</p>
        {anySelected && (
          <Link
            href={clearHref}
            className="text-sm font-medium text-accent hover:underline"
          >
            Quitar filtros
          </Link>
        )}
      </div>
      {facets.map((facet) => (
        <div
          key={facet.key}
          className="flex flex-wrap items-center gap-x-3 gap-y-2"
        >
          <span className="w-28 shrink-0 text-sm font-medium text-secondary">
            {facet.label}
          </span>
          <div className="flex flex-wrap gap-2">
            {facet.options.map((option) => {
              const active = selected[facet.key] === option.value;
              return (
                <Link
                  key={option.value}
                  href={hrefFor(facet.key, active ? null : option.value)}
                  aria-pressed={active}
                  className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors ${
                    active
                      ? "border-accent bg-accent-soft font-medium text-accent"
                      : "border-border text-secondary hover:border-accent hover:text-primary"
                  }`}
                >
                  {option.label}
                  <span className="font-mono-data text-xs opacity-70">
                    {active ? "✕" : option.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
