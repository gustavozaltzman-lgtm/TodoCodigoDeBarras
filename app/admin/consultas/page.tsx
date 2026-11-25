import { getAllInquiries } from "@/features/inquiries/admin-queries";
import { deleteInquiryAction } from "@/features/inquiries/actions";
import { InquiryStatusSelect } from "@/components/admin/inquiry-status-select";
import { DeleteButton } from "@/components/admin/delete-button";
import { INTEREST_LABELS, SECTOR_LABELS } from "@/lib/content/lead-scoring";
import { SortableTh } from "@/components/admin/sortable-th";
import { nextDir, parseSort, sortRows } from "@/lib/admin-sort";

const COLUMNS = ["date", "type", "name", "email", "status"] as const;

const TYPE_LABELS: Record<string, string> = {
  general: "General",
  quote: "Cotización",
  product: "Producto",
};

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; dir?: string }>;
}) {
  const sp = await searchParams;
  const { sort, dir } = parseSort(sp, COLUMNS);
  const inquiries = sortRows(
    await getAllInquiries(),
    {
      date: (i) => i.createdAt,
      type: (i) => TYPE_LABELS[i.type],
      name: (i) => i.name,
      email: (i) => i.email,
      status: (i) => i.status,
    },
    sort,
    dir
  );
  // La fecha arranca de mas nueva a mas vieja; el resto, de A a Z.
  const th = (column: (typeof COLUMNS)[number]) => ({
    href: `/admin/consultas?sort=${column}&dir=${nextDir({ sort, dir }, column, column === "date" ? "desc" : "asc")}`,
    direction: sort === column ? dir : null,
  });

  return (
    <div>
      <h1 className="text-xl font-semibold text-primary">Consultas</h1>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-secondary">
            <tr>
              <SortableTh label="Fecha" {...th("date")} />
              <SortableTh label="Tipo" {...th("type")} />
              <SortableTh label="Nombre" {...th("name")} />
              <SortableTh label="Contacto" {...th("email")} />
              <th className="px-4 py-2">Mensaje</th>
              <SortableTh label="Estado" {...th("status")} />
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="border-t border-border align-top">
                <td className="px-4 py-2 whitespace-nowrap text-secondary">
                  {inquiry.createdAt.toLocaleDateString("es-AR")}
                </td>
                <td className="px-4 py-2 text-secondary">
                  {TYPE_LABELS[inquiry.type]}
                </td>
                <td className="px-4 py-2 font-medium text-primary">
                  {inquiry.name}
                  {inquiry.company && (
                    <div className="text-xs text-secondary">{inquiry.company}</div>
                  )}
                </td>
                <td className="px-4 py-2 text-secondary">
                  <div>{inquiry.email}</div>
                  {inquiry.phone && <div>{inquiry.phone}</div>}
                </td>
                <td className="max-w-xs whitespace-pre-line break-words px-4 py-2 text-primary">
                  {inquiry.message}
                  {inquiry.quantity && (
                    <div className="mt-1 text-xs text-secondary">
                      Cantidad: {inquiry.quantity}
                    </div>
                  )}
                  {(inquiry.interest || inquiry.sector) && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {inquiry.interest && (
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">
                          {INTEREST_LABELS[inquiry.interest] ?? inquiry.interest}
                        </span>
                      )}
                      {inquiry.sector && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-secondary">
                          {SECTOR_LABELS[inquiry.sector] ?? inquiry.sector}
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">
                  <InquiryStatusSelect id={inquiry.id} status={inquiry.status} />
                </td>
                <td className="px-4 py-2 text-right">
                  <DeleteButton id={inquiry.id} action={deleteInquiryAction} />
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-secondary">
                  No hay consultas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
