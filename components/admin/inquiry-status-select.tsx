"use client";

import { useTransition } from "react";
import { setInquiryStatusAction } from "@/features/inquiries/actions";

type Status = "new" | "contacted" | "closed";

export function InquiryStatusSelect({ id, status }: { id: number; status: Status }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as Status;
        startTransition(() => setInquiryStatusAction(id, next));
      }}
      className="cursor-pointer rounded-md border border-border px-2 py-1 text-xs outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="new">Nueva</option>
      <option value="contacted">Contactada</option>
      <option value="closed">Cerrada</option>
    </select>
  );
}
