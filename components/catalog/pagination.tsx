import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

export function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Paginación"
      className="mt-8 flex items-center justify-center gap-2"
    >
      {page > 1 && (
        <Link
          href={buildHref(page - 1)}
          className="cursor-pointer rounded-md border border-border px-3 py-2 text-sm text-secondary transition-colors hover:border-accent hover:text-primary"
        >
          Anterior
        </Link>
      )}
      <span className="text-sm text-secondary">
        Página {page} de {totalPages}
      </span>
      {page < totalPages && (
        <Link
          href={buildHref(page + 1)}
          className="cursor-pointer rounded-md border border-border px-3 py-2 text-sm text-secondary transition-colors hover:border-accent hover:text-primary"
        >
          Siguiente
        </Link>
      )}
    </nav>
  );
}
