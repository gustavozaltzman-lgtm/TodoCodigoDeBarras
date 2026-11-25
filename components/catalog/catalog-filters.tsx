"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type BrandOption = { slug: string; name: string };

type CatalogFiltersProps = {
  action: string;
  search?: string;
  brandSlug?: string;
  sort?: string;
  brands: BrandOption[];
  // Filtros tecnicos elegidos (ej. { res: "203" }): se conservan al buscar u ordenar.
  facetParams?: Record<string, string>;
};

const fieldClass =
  "w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent";

// Los filtros se aplican al cambiar (sin boton ni recarga completa): se
// navega con el router y la lista nueva aparece con el esqueleto de carga.
export function CatalogFilters({
  action,
  search,
  brandSlug,
  sort,
  brands,
  facetParams = {},
}: CatalogFiltersProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(search ?? "");
  const [prevSearch, setPrevSearch] = useState(search);
  // Si la busqueda cambia desde afuera (ej. buscador del header), se refleja en el campo.
  if (search !== prevSearch) {
    setPrevSearch(search);
    setQuery(search ?? "");
  }

  const apply = () => {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) {
      const text = String(value).trim();
      if (text && !(key === "sort" && text === "relevance")) params.set(key, text);
    }
    const qs = params.toString();
    startTransition(() => router.push(`${action}${qs ? `?${qs}` : ""}`));
  };

  // Espera 400 ms despues de la ultima tecla antes de buscar.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onQueryChange = (value: string) => {
    setQuery(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(apply, 400);
  };

  return (
    <form
      ref={formRef}
      action={action}
      method="get"
      onSubmit={(e) => {
        e.preventDefault();
        if (timer.current) clearTimeout(timer.current);
        apply();
      }}
      aria-busy={pending}
      className="flex flex-wrap items-end gap-4 rounded-lg border border-border bg-white p-4"
    >
      {Object.entries(facetParams).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}

      <div className="min-w-[200px] flex-1 space-y-1">
        <label htmlFor="q" className="text-sm font-medium text-secondary">
          Buscar
        </label>
        <input
          id="q"
          name="q"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Modelo, marca o tipo de producto…"
          className={fieldClass}
        />
      </div>

      {brands.length > 0 && (
        <div className="min-w-[160px] space-y-1">
          <label htmlFor="brand" className="text-sm font-medium text-secondary">
            Marca
          </label>
          <select
            id="brand"
            name="brand"
            defaultValue={brandSlug ?? ""}
            onChange={apply}
            className={`${fieldClass} cursor-pointer`}
          >
            <option value="">Todas</option>
            {brands.map((brand) => (
              <option key={brand.slug} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="min-w-[160px] space-y-1">
        <label htmlFor="sort" className="text-sm font-medium text-secondary">
          Ordenar por
        </label>
        <select
          id="sort"
          name="sort"
          defaultValue={sort ?? "relevance"}
          onChange={apply}
          className={`${fieldClass} cursor-pointer`}
        >
          <option value="relevance">Relevancia</option>
          <option value="name-asc">Nombre (A-Z)</option>
          <option value="newest">Más nuevos</option>
        </select>
      </div>

      <noscript>
        <button
          type="submit"
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white"
        >
          Filtrar
        </button>
      </noscript>
    </form>
  );
}
