"use client";

import { useActionState, useTransition } from "react";
import {
  addSpecificationAction,
  deleteSpecificationAction,
  type SpecFormState,
} from "@/features/products/actions";
import { inputClass, primaryButtonClass } from "./form-styles";

const initialState: SpecFormState = { error: null };

type Spec = {
  id: number;
  groupName: string | null;
  label: string;
  value: string;
};

export function ProductSpecificationsManager({
  productId,
  specifications,
}: {
  productId: number;
  specifications: Spec[];
}) {
  const boundAction = addSpecificationAction.bind(null, productId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);
  const [isDeleting, startTransition] = useTransition();

  return (
    <div>
      {specifications.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-secondary">
              <tr>
                <th className="px-4 py-2">Grupo</th>
                <th className="px-4 py-2">Etiqueta</th>
                <th className="px-4 py-2">Valor</th>
                <th className="px-4 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {specifications.map((spec) => (
                <tr key={spec.id} className="border-t border-border">
                  <td className="px-4 py-2 text-secondary">{spec.groupName ?? "—"}</td>
                  <td className="px-4 py-2 text-primary">{spec.label}</td>
                  <td className="px-4 py-2 text-primary">{spec.value}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() =>
                        startTransition(() =>
                          deleteSpecificationAction(spec.id, productId)
                        )
                      }
                      className="cursor-pointer text-sm text-destructive hover:underline disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary" htmlFor="groupName">
            Grupo
          </label>
          <input
            id="groupName"
            name="groupName"
            placeholder="Ej: General"
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary" htmlFor="label">
            Etiqueta *
          </label>
          <input id="label" name="label" required className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary" htmlFor="value">
            Valor *
          </label>
          <input id="value" name="value" required className={inputClass} />
        </div>
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Agregando..." : "Agregar"}
        </button>
      </form>

      {state.error && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
    </div>
  );
}
