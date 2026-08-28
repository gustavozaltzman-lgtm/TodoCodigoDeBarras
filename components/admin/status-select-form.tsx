"use client";

import { useTransition } from "react";

type Status = "draft" | "published" | "hidden" | "archived";

const OPTIONS: { value: Status; label: string }[] = [
  { value: "draft", label: "Borrador" },
  { value: "published", label: "Publicado" },
  { value: "hidden", label: "Oculto" },
  { value: "archived", label: "Archivado" },
];

export function StatusSelectForm({
  id,
  status,
  action,
}: {
  id: number;
  status: Status;
  action: (id: number, status: Status) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as Status;
        startTransition(() => {
          action(id, next);
        });
      }}
      className="cursor-pointer rounded-md border border-border px-2 py-1 text-xs outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-50"
    >
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
