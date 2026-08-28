"use client";

import { useActionState, useTransition } from "react";
import {
  addDocumentAction,
  deleteDocumentAction,
  type DocumentFormState,
} from "@/features/products/actions";
import { inputClass, primaryButtonClass } from "./form-styles";

const initialState: DocumentFormState = { error: null };

const TYPE_LABELS: Record<string, string> = {
  datasheet: "Ficha técnica",
  manual: "Manual",
  other: "Documento",
};

type DocumentRow = {
  id: number;
  type: "datasheet" | "manual" | "other";
  title: string;
  url: string;
};

export function ProductDocumentsManager({
  productId,
  documents,
}: {
  productId: number;
  documents: DocumentRow[];
}) {
  const boundAction = addDocumentAction.bind(null, productId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);
  const [isDeleting, startTransition] = useTransition();

  return (
    <div>
      {documents.length > 0 && (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between rounded-md border border-border px-4 py-2"
            >
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-sm text-secondary hover:text-primary"
              >
                <span className="font-medium">{TYPE_LABELS[doc.type]}:</span> {doc.title}
              </a>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() =>
                  startTransition(() => deleteDocumentAction(doc.id, productId))
                }
                className="cursor-pointer text-sm text-destructive hover:underline disabled:opacity-50"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary" htmlFor="type">
            Tipo
          </label>
          <select id="type" name="type" defaultValue="datasheet" className={`${inputClass} cursor-pointer`}>
            <option value="datasheet">Ficha técnica</option>
            <option value="manual">Manual</option>
            <option value="other">Otro</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary" htmlFor="title">
            Título *
          </label>
          <input id="title" name="title" required className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary" htmlFor="doc-file">
            Archivo *
          </label>
          <input id="doc-file" name="file" type="file" accept=".pdf,.doc,.docx" required className="text-sm" />
        </div>
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Subiendo..." : "Subir"}
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
