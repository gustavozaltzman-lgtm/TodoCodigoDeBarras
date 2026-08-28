import Link from "next/link";
import { getAllProductsAdmin } from "@/features/products/admin-queries";
import { ProductsTable } from "@/components/admin/products-table";
import { Pagination } from "@/components/catalog/pagination";
import { inputClass, primaryButtonClass } from "@/components/admin/form-styles";

type AdminProductsPageProps = {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
};

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) > 0 ? Number(sp.page) : 1;
  const status = ["draft", "published", "hidden", "archived"].includes(sp.status ?? "")
    ? (sp.status as "draft" | "published" | "hidden" | "archived")
    : undefined;

  const { items, totalPages, page: currentPage } = await getAllProductsAdmin({
    search: sp.q,
    status,
    page,
  });

  const buildHref = (nextPage: number) => {
    const qs = new URLSearchParams();
    if (sp.q) qs.set("q", sp.q);
    if (status) qs.set("status", status);
    if (nextPage > 1) qs.set("page", String(nextPage));
    const query = qs.toString();
    return `/admin/productos${query ? `?${query}` : ""}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-primary">Productos</h1>
        <Link href="/admin/productos/nueva" className={primaryButtonClass}>
          Nuevo producto
        </Link>
      </div>

      <form method="get" className="mt-6 flex flex-wrap gap-3">
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
        <ProductsTable items={items} />
      </div>

      <Pagination page={currentPage} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
