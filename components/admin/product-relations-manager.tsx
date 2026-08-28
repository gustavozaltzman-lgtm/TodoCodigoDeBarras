"use client";

import { useTransition } from "react";
import {
  addRelatedProductAction,
  removeRelatedProductAction,
} from "@/features/products/actions";
import { inputClass, primaryButtonClass } from "./form-styles";

type RelationRow = {
  id: number;
  type: "related" | "accessory" | "compatible";
  relatedProduct: { id: number; name: string };
};

type ProductOption = { id: number; name: string };

const TYPE_LABELS: Record<string, string> = {
  related: "Relacionado",
  accessory: "Accesorio",
  compatible: "Compatible (insumo/repuesto)",
};

export function ProductRelationsManager({
  productId,
  relations,
  allProducts,
}: {
  productId: number;
  relations: RelationRow[];
  allProducts: ProductOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const options = allProducts.filter((p) => p.id !== productId);

  return (
    <div>
      {relations.length > 0 && (
        <ul className="space-y-2">
          {relations.map((relation) => (
            <li
              key={relation.id}
              className="flex items-center justify-between rounded-md border border-border px-4 py-2"
            >
              <span className="text-sm text-primary">
                <span className="text-secondary">{TYPE_LABELS[relation.type]}:</span>{" "}
                {relation.relatedProduct.name}
              </span>
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  startTransition(() =>
                    removeRelatedProductAction(relation.id, productId)
                  )
                }
                className="cursor-pointer text-sm text-destructive hover:underline disabled:opacity-50"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        className="mt-4 flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const relatedProductId = Number(formData.get("relatedProductId"));
          const type = formData.get("type") as "related" | "accessory" | "compatible";
          if (!relatedProductId) return;
          startTransition(() => addRelatedProductAction(productId, relatedProductId, type));
          e.currentTarget.reset();
        }}
      >
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary" htmlFor="relatedProductId">
            Producto
          </label>
          <select
            id="relatedProductId"
            name="relatedProductId"
            required
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Seleccionar...</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary" htmlFor="type">
            Tipo
          </label>
          <select id="type" name="type" defaultValue="related" className={`${inputClass} cursor-pointer`}>
            <option value="related">Relacionado</option>
            <option value="accessory">Accesorio</option>
            <option value="compatible">Compatible (insumo/repuesto)</option>
          </select>
        </div>
        <button type="submit" disabled={isPending} className={primaryButtonClass}>
          Agregar
        </button>
      </form>
    </div>
  );
}
