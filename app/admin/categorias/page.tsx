import Link from "next/link";
import { getAllCategories } from "@/features/categories/admin-queries";
import {
  deleteCategoryAction,
  setCategoryStatusAction,
} from "@/features/categories/actions";
import { StatusSelectForm } from "@/components/admin/status-select-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { primaryButtonClass } from "@/components/admin/form-styles";
import { SortableTh } from "@/components/admin/sortable-th";
import { nextDir, parseSort, sortRows } from "@/lib/admin-sort";

const COLUMNS = ["name", "parent", "status", "order"] as const;

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; dir?: string }>;
}) {
  const sp = await searchParams;
  const { sort, dir } = parseSort(sp, COLUMNS);
  const all = await getAllCategories();
  const byId = new Map(all.map((c) => [c.id, c]));
  const categories = sortRows(
    all,
    {
      name: (c) => c.name,
      parent: (c) => (c.parentId ? byId.get(c.parentId)?.name : null),
      status: (c) => c.status,
      order: (c) => c.sortOrder,
    },
    sort,
    dir
  );
  const th = (column: (typeof COLUMNS)[number]) => ({
    href: `/admin/categorias?sort=${column}&dir=${nextDir({ sort, dir }, column)}`,
    direction: sort === column ? dir : null,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-primary">Categorías</h1>
        <Link href="/admin/categorias/nueva" className={primaryButtonClass}>
          Nueva categoría
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-secondary">
            <tr>
              <SortableTh label="Nombre" {...th("name")} />
              <SortableTh label="Categoría padre" {...th("parent")} />
              <SortableTh label="Estado" {...th("status")} />
              <SortableTh label="Orden" {...th("order")} />
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-border">
                <td className="px-4 py-2 font-medium text-primary">
                  {category.parentId && <span className="text-secondary">— </span>}
                  {category.name}
                </td>
                <td className="px-4 py-2 text-secondary">
                  {category.parentId ? byId.get(category.parentId)?.name ?? "—" : "—"}
                </td>
                <td className="px-4 py-2">
                  <StatusSelectForm
                    id={category.id}
                    status={category.status}
                    action={setCategoryStatusAction}
                  />
                </td>
                <td className="px-4 py-2 text-secondary">{category.sortOrder}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/categorias/${category.id}`}
                      className="cursor-pointer text-sm font-medium text-accent hover:underline"
                    >
                      Editar
                    </Link>
                    <DeleteButton id={category.id} action={deleteCategoryAction} />
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-secondary">
                  No hay categorías cargadas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
