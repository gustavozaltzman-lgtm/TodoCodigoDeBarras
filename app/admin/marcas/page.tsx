import Link from "next/link";
import { getAllBrands } from "@/features/brands/admin-queries";
import { deleteBrandAction, setBrandStatusAction } from "@/features/brands/actions";
import { StatusSelectForm } from "@/components/admin/status-select-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { primaryButtonClass } from "@/components/admin/form-styles";
import { SortableTh } from "@/components/admin/sortable-th";
import { nextDir, parseSort, sortRows } from "@/lib/admin-sort";

const COLUMNS = ["name", "slug", "status", "order"] as const;

export default async function AdminBrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; dir?: string }>;
}) {
  const sp = await searchParams;
  const { sort, dir } = parseSort(sp, COLUMNS);
  const brands = sortRows(
    await getAllBrands(),
    {
      name: (b) => b.name,
      slug: (b) => b.slug,
      status: (b) => b.status,
      order: (b) => b.sortOrder,
    },
    sort,
    dir
  );
  const th = (column: (typeof COLUMNS)[number]) => ({
    href: `/admin/marcas?sort=${column}&dir=${nextDir({ sort, dir }, column)}`,
    direction: sort === column ? dir : null,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-primary">Marcas</h1>
        <Link href="/admin/marcas/nueva" className={primaryButtonClass}>
          Nueva marca
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-secondary">
            <tr>
              <SortableTh label="Nombre" {...th("name")} />
              <SortableTh label="Slug" {...th("slug")} />
              <SortableTh label="Estado" {...th("status")} />
              <SortableTh label="Orden" {...th("order")} />
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="border-t border-border">
                <td className="px-4 py-2 font-medium text-primary">{brand.name}</td>
                <td className="px-4 py-2 text-secondary">{brand.slug}</td>
                <td className="px-4 py-2">
                  <StatusSelectForm
                    id={brand.id}
                    status={brand.status}
                    action={setBrandStatusAction}
                  />
                </td>
                <td className="px-4 py-2 text-secondary">{brand.sortOrder}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/marcas/${brand.id}`}
                      className="cursor-pointer text-sm font-medium text-accent hover:underline"
                    >
                      Editar
                    </Link>
                    <DeleteButton id={brand.id} action={deleteBrandAction} />
                  </div>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-secondary">
                  No hay marcas cargadas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
