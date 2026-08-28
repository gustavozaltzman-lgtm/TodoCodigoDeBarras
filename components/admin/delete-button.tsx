"use client";

import { useTransition } from "react";
import { dangerButtonClass } from "./form-styles";

export function DeleteButton({
  id,
  action,
  confirmMessage = "¿Eliminar este registro? Esta acción no se puede deshacer.",
}: {
  id: number;
  action: (id: number) => Promise<void>;
  confirmMessage?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      className={`${dangerButtonClass} disabled:cursor-not-allowed disabled:opacity-50`}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(() => {
          action(id);
        });
      }}
    >
      {isPending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
