export default function ProductLoading() {
  return (
    <main
      className="mx-auto max-w-6xl px-4 py-16"
      aria-busy="true"
      aria-label="Cargando producto"
    >
      <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-lg bg-muted" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />
          <div className="h-16 animate-pulse rounded bg-muted" />
          <div className="h-11 w-60 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </main>
  );
}
