import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

const linkClass =
  "inline-flex min-h-11 cursor-pointer items-center rounded-md border border-border bg-white px-4 text-sm font-medium text-secondary transition-colors hover:border-accent hover:text-primary";

export function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Paginación"
      className="mt-8 flex flex-wrap items-center justify-center gap-3"
    >
      {page > 1 && (
        <Link href={buildHref(page - 1)} className={linkClass}>
          Anterior
        </Link>
      )}
      <span className="font-mono-data text-sm text-secondary">
        {page} / {totalPages}
      </span>
      {page < totalPages && (
        <Link href={buildHref(page + 1)} className={linkClass}>
          Siguiente
        </Link>
      )}
    </nav>
  );
}
