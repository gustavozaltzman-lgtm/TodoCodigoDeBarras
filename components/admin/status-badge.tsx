type Status = "draft" | "published" | "hidden" | "archived";

const STYLES: Record<Status, string> = {
  draft: "bg-slate-100 text-slate-700",
  published: "bg-green-100 text-green-700",
  hidden: "bg-amber-100 text-amber-700",
  archived: "bg-red-100 text-red-700",
};

const LABELS: Record<Status, string> = {
  draft: "Borrador",
  published: "Publicado",
  hidden: "Oculto",
  archived: "Archivado",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
