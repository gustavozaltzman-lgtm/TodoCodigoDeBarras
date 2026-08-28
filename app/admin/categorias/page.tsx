import Link from "next/link";
import { getAllCategories } from "@/features/categories/admin-queries";
import {
  deleteCategoryAction,
  setCategoryStatusAction,
} from "@/features/categories/actions";
import { StatusSelectForm } from "@/components/admin/status-select-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { primaryButtonClass } from "@/components/admin/form-styles";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();
  const byId = new Map(categories.map((c) => [c.id, c]));

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
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Categoría padre</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Orden</th>
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
