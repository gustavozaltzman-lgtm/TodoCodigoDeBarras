"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { DeleteButton } from "./delete-button";
import { StatusSelectForm } from "./status-select-form";
import {
  bulkSetProductStatusAction,
  deleteProductAction,
  setProductStatusAction,
} from "@/features/products/actions";

type Status = "draft" | "published" | "hidden" | "archived";

type ProductRow = {
  id: number;
  name: string;
  slug: string;
  status: Status;
  isFeatured: boolean;
  brandName: string | null;
  categoryName: string | null;
};

export function ProductsTable({ items }: { items: ProductRow[] }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<Status>("published");
  const [isPending, startTransition] = useTransition();

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === items.length ? new Set() : new Set(items.map((i) => i.id))
    );
  };

  const applyBulk = () => {
    if (selected.size === 0) return;
    startTransition(async () => {
      await bulkSetProductStatusAction([...selected], bulkStatus);
      setSelected(new Set());
    });
  };

  return (
    <div>
      {selected.size > 0 && (
        <div className="mb-3 flex items-center gap-3 rounded-md border border-border bg-white p-3">
          <span className="text-sm text-secondary">
            {selected.size} seleccionado{selected.size > 1 ? "s" : ""}
          </span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value as Status)}
            className="cursor-pointer rounded-md border border-border px-2 py-1 text-sm outline-none focus:border-accent"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="hidden">Oculto</option>
            <option value="archived">Archivado</option>
          </select>
          <button
            type="button"
            disabled={isPending}
            onClick={applyBulk}
            className="cursor-pointer rounded-md bg-accent px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-primary disabled:opacity-50"
          >
            {isPending ? "Aplicando..." : "Aplicar"}
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-secondary">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={items.length > 0 && selected.size === items.length}
                  onChange={toggleAll}
                  aria-label="Seleccionar todos"
                />
              </th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Marca</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Destacado</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((product) => (
              <tr key={product.id} className="border-t border-border">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={selected.has(product.id)}
                    onChange={() => toggle(product.id)}
                    aria-label={`Seleccionar ${product.name}`}
                  />
                </td>
                <td className="px-4 py-2 font-medium text-primary">{product.name}</td>
                <td className="px-4 py-2 text-secondary">{product.brandName ?? "—"}</td>
                <td className="px-4 py-2 text-secondary">{product.categoryName ?? "—"}</td>
                <td className="px-4 py-2">
                  <StatusSelectForm
                    id={product.id}
                    status={product.status}
                    action={setProductStatusAction}
                  />
                </td>
                <td className="px-4 py-2 text-secondary">
                  {product.isFeatured ? "Sí" : "—"}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      className="cursor-pointer text-sm font-medium text-accent hover:underline"
                    >
                      Editar
                    </Link>
                    <DeleteButton id={product.id} action={deleteProductAction} />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-secondary">
                  No hay productos que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
