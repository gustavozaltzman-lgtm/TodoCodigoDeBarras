import Link from "next/link";
import type { SortDir } from "@/lib/admin-sort";

// Titulo de columna clickeable. `direction` es la direccion actual de esta
// columna (null si la tabla no esta ordenada por ella); `href` ya trae la
// direccion que se aplica en el proximo clic.
export function SortableTh({
  label,
  href,
  direction,
  className = "",
}: {
  label: string;
  href: string;
  direction: SortDir | null;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-2 ${className}`}
      aria-sort={
        direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"
      }
    >
      <Link
        href={href}
        title={`Ordenar por ${label.toLowerCase()}`}
        className={`inline-flex cursor-pointer items-center gap-1 rounded transition-colors hover:text-primary ${
          direction ? "font-semibold text-primary" : ""
        }`}
      >
        {label}
        <span aria-hidden="true" className="w-3 text-xs">
          {direction === "asc" ? "▲" : direction === "desc" ? "▼" : ""}
        </span>
      </Link>
    </th>
  );
}
