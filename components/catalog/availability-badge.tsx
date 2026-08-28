type Availability = "in_stock" | "out_of_stock" | "preorder" | "discontinued";

const CONFIG: Record<Availability, { label: string; className: string }> = {
  in_stock: {
    label: "En stock",
    className: "bg-green-50 text-green-700 ring-1 ring-green-600/20",
  },
  out_of_stock: {
    label: "Sin stock",
    className: "bg-slate-100 text-slate-600 ring-1 ring-slate-500/20",
  },
  preorder: {
    label: "A pedido",
    className: "bg-orange-50 text-orange-700 ring-1 ring-orange-600/20",
  },
  discontinued: {
    label: "Discontinuado",
    className: "bg-slate-100 text-slate-500 ring-1 ring-slate-500/20",
  },
};

export function AvailabilityBadge({
  availability,
  className = "",
}: {
  availability: Availability;
  className?: string;
}) {
  const config = CONFIG[availability];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className} ${className}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
