type BrandOption = { slug: string; name: string };

type CatalogFiltersProps = {
  action: string;
  search?: string;
  brandSlug?: string;
  sort?: string;
  brands: BrandOption[];
};

export function CatalogFilters({
  action,
  search,
  brandSlug,
  sort,
  brands,
}: CatalogFiltersProps) {
  return (
    <form
      action={action}
      method="get"
      className="flex flex-wrap items-end gap-4 rounded-lg border border-border bg-white p-4"
    >
      <div className="flex-1 min-w-[200px] space-y-1">
        <label htmlFor="q" className="text-sm font-medium text-secondary">
          Buscar
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={search}
          placeholder="Nombre del producto..."
          className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
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
            className="w-full cursor-pointer rounded-md border border-border px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
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
          className="w-full cursor-pointer rounded-md border border-border px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
        >
          <option value="relevance">Relevancia</option>
          <option value="name-asc">Nombre (A-Z)</option>
          <option value="newest">Más nuevos</option>
        </select>
      </div>

      <button
        type="submit"
        className="cursor-pointer rounded-md bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary"
      >
        Filtrar
      </button>
    </form>
  );
}
