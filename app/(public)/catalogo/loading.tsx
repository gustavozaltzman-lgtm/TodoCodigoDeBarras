// Esqueleto mientras carga el listado: el usuario ve la estructura de la
// pagina al instante en vez de una pantalla en blanco.
export default function CatalogLoading() {
  return (
    <main
      className="mx-auto max-w-6xl px-4 py-16"
      aria-busy="true"
      aria-label="Cargando catálogo"
    >
      <div className="h-9 w-48 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-24 animate-pulse rounded-lg bg-muted" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-white p-4">
            <div className="aspect-square animate-pulse rounded-md bg-muted" />
            <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </main>
  );
}
