"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  searchProductsAction,
  type SearchResult,
} from "@/features/products/search-actions";

// Buscador instantaneo: panel bajo el header con resultados en vivo (foto,
// nombre y marca). Busca por modelo, MPN, marca y palabras del nombre.
export function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Cierra al navegar a otra pagina.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Busqueda con espera de 250 ms para no consultar en cada tecla; las
  // respuestas viejas se descartan si llego una busqueda mas nueva.
  useEffect(() => {
    const clean = term.trim();
    if (clean.length < 2) return;
    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      try {
        const data = await searchProductsAction(clean);
        if (id === requestId.current) {
          setResults(data);
          setSearched(true);
        }
      } catch {
        if (id === requestId.current) setResults([]);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [term]);

  if (!open) return null;

  const onChange = (value: string) => {
    setTerm(value);
    if (value.trim().length < 2) {
      requestId.current++;
      setResults([]);
      setSearched(false);
      setLoading(false);
    } else {
      setLoading(true);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = term.trim();
    if (!clean) return;
    onClose();
    router.push(`/catalogo?q=${encodeURIComponent(clean)}`);
  };

  return (
    <div className="absolute inset-x-0 top-full border-b border-border bg-white shadow-lg">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <form onSubmit={submit} role="search" className="flex gap-2">
          <label htmlFor="site-search" className="sr-only">
            Buscar productos
          </label>
          <input
            id="site-search"
            ref={inputRef}
            type="search"
            value={term}
            onChange={(e) => onChange(e.target.value)}
            autoComplete="off"
            placeholder="Buscá por modelo, marca o tipo: DS2208, ribbon resina, impresora portátil…"
            className="min-h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition-colors focus:border-accent"
          />
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 shrink-0 cursor-pointer rounded-md border border-border px-4 text-sm text-secondary transition-colors hover:border-accent hover:text-primary"
          >
            Cerrar
          </button>
        </form>

        <div aria-live="polite" className="mt-3">
          {loading && <p className="text-sm text-secondary">Buscando…</p>}

          {!loading && searched && results.length === 0 && (
            <p className="text-sm text-secondary">
              No encontramos productos para “{term.trim()}”. Probá con otra
              palabra o{" "}
              <Link href="/contacto" className="font-medium text-accent hover:underline">
                consultanos
              </Link>
              .
            </p>
          )}

          {results.length > 0 && (
            <ul className="divide-y divide-border rounded-md border border-border">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/productos/${r.slug}`}
                    className="flex min-h-14 cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-muted"
                  >
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                      {r.imageUrl && (
                        <Image
                          src={r.imageUrl}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-contain"
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-primary">
                        {r.name}
                      </span>
                      {r.brandName && (
                        <span className="block text-xs text-secondary">{r.brandName}</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`/catalogo?q=${encodeURIComponent(term.trim())}`}
                  className="flex min-h-11 cursor-pointer items-center px-3 text-sm font-medium text-accent hover:bg-muted"
                >
                  Ver todos los resultados →
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
