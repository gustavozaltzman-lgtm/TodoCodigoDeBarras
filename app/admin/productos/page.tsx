import Link from "next/link";
import {
  PRODUCT_SORT_COLUMNS,
  getAllProductsAdmin,
} from "@/features/products/admin-queries";
import { nextDir, parseSort } from "@/lib/admin-sort";
import { ProductsTable, type ProductSortLinks } from "@/components/admin/products-table";
import { Pagination } from "@/components/catalog/pagination";
import { inputClass, primaryButtonClass } from "@/components/admin/form-styles";

type AdminProductsPageProps = {
  searchParams: Promise<{ q?: string; status?: string; page?: string; sort?: string; dir?: string }>;
};

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) > 0 ? Number(sp.page) : 1;
  const status = ["draft", "published", "hidden", "archived"].includes(sp.status ?? "")
    ? (sp.status as "draft" | "published" | "hidden" | "archived")
    : undefined;

  const { sort, dir } = parseSort(sp, PRODUCT_SORT_COLUMNS);

  const { items, totalPages, page: currentPage } = await getAllProductsAdmin({
    search: sp.q,
    status,
    page,
    sort,
    dir,
  });

  // Filtros y orden se conservan al paginar; al cambiar el orden se vuelve a la pagina 1.
  const baseParams = () => {
    const qs = new URLSearchParams();
    if (sp.q) qs.set("q", sp.q);
    if (status) qs.set("status", status);
    return qs;
  };
  const buildHref = (nextPage: number) => {
    const qs = baseParams();
    if (sort) {
      qs.set("sort", sort);
      qs.set("dir", dir);
    }
    if (nextPage > 1) qs.set("page", String(nextPage));
    const query = qs.toString();
    return `/admin/productos${query ? `?${query}` : ""}`;
  };
  const sortLinks = Object.fromEntries(
    PRODUCT_SORT_COLUMNS.map((column) => {
      const qs = baseParams();
      qs.set("sort", column);
      qs.set("dir", nextDir({ sort, dir }, column));
      return [
        column,
        { href: `/admin/productos?${qs.toString()}`, direction: sort === column ? dir : null },
      ];
    })
  ) as ProductSortLinks;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-primary">Productos</h1>
        <Link href="/admin/productos/nueva" className={primaryButtonClass}>
          Nuevo producto
        </Link>
      </div>

      <form method="get" className="mt-6 flex flex-wrap gap-3">
        {sort && <input type="hidden" name="sort" value={sort} />}
        {sort && <input type="hidden" name="dir" value={dir} />}
        <input
          type="search"
          name="q"
          defaultValue={sp.q}
          placeholder="Buscar por nombre..."
          className={`${inputClass} max-w-xs`}
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className={`${inputClass} w-auto cursor-pointer`}
        >
          <option value="">Todos los estados</option>
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
          <option value="hidden">Oculto</option>
          <option value="archived">Archivado</option>
        </select>
        <button type="submit" className={primaryButtonClass}>
          Filtrar
        </button>
      </form>

      <div className="mt-6">
        <ProductsTable items={items} sortLinks={sortLinks} />
      </div>

      <Pagination page={currentPage} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
