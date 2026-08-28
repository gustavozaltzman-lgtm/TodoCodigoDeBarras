type Document = {
  id: number;
  type: "datasheet" | "manual" | "other";
  title: string;
  url: string;
};

const TYPE_LABELS: Record<Document["type"], string> = {
  datasheet: "Ficha técnica",
  manual: "Manual",
  other: "Documento",
};

export function ProductDocuments({ documents }: { documents: Document[] }) {
  if (documents.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold text-primary">Documentación</h2>
      <ul className="mt-4 space-y-2">
        {documents.map((doc) => (
          <li key={doc.id}>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm text-secondary transition-colors hover:border-accent hover:text-primary"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-5 w-5 shrink-0 text-accent"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              <span className="font-medium">{TYPE_LABELS[doc.type]}:</span>
              <span>{doc.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
