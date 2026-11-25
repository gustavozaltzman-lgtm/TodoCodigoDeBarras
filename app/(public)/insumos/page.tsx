import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/catalog/product-card";
import {
  getPrinterOptions,
  getSupplyMatches,
  type SupplyCard,
} from "@/features/supplies/compat";
import { buildWhatsAppUrl, siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Insumos para tu impresora: ribbons y etiquetas",
  description:
    "Elegí tu impresora y mirá qué ribbons y etiquetas cumplen sus medidas: ancho, núcleo y largo según la ficha técnica del equipo.",
  alternates: { canonical: "/insumos" },
};

type InsumosPageProps = {
  searchParams: Promise<{ p?: string }>;
};

export default async function InsumosPage({ searchParams }: InsumosPageProps) {
  const { p } = await searchParams;
  const printers = await getPrinterOptions();
  const selected = printers.find((printer) => printer.slug === p) ?? null;
  const supplies = selected ? await getSupplyMatches(selected.constraints) : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <span className="eyebrow">Selector de insumos</span>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
        ¿Qué insumos usa tu impresora?
      </h1>
      <p className="mt-3 max-w-2xl text-secondary">
        Elegí tu equipo y comparamos las medidas que publica su ficha técnica
        (ancho, núcleo y largo) con las de cada ribbon y etiqueta. Te mostramos
        qué verificamos y qué no, para que confirmes con tu manual antes de
        pedir.
      </p>

      <section className="mt-10" aria-labelledby="printers-title">
        <h2 id="printers-title" className="text-lg font-semibold text-primary">
          1. Elegí tu impresora
        </h2>
        {printers.length === 0 ? (
          <p className="mt-3 text-sm text-secondary">
            Todavía no hay impresoras con medidas cargadas.{" "}
            <Link href="/contacto" className="font-medium text-accent hover:underline">
              Consultanos
            </Link>{" "}
            y te asesoramos.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {printers.map((printer) => {
              const active = printer.slug === selected?.slug;
              return (
                <li key={printer.id}>
                  <Link
                    href={`/insumos?p=${printer.slug}#resultado`}
                    aria-current={active ? "true" : undefined}
                    className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border bg-white p-3 transition-colors ${
                      active
                        ? "border-accent bg-accent-soft"
                        : "border-border hover:border-accent"
                    }`}
                  >
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                      {printer.imageUrl && (
                        <Image
                          src={printer.imageUrl}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      )}
                    </span>
                    <span className="min-w-0 text-sm font-medium text-primary">
                      {printer.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {selected && supplies && (
        <section id="resultado" className="mt-12 scroll-mt-24">
          <h2 className="text-lg font-semibold text-primary">
            2. Insumos para {selected.name}
          </h2>

          <div className="mt-4 rounded-lg border border-border bg-white p-4">
            <p className="eyebrow">Medidas que publica la ficha del equipo</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {selected.constraints.sources.map((source) => (
                <li key={source.label} className="flex flex-wrap gap-x-2">
                  <span className="font-medium text-secondary">{source.label}:</span>
                  <span className="font-mono-data text-primary">{source.value}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/productos/${selected.slug}`}
              className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
            >
              Ver ficha completa de {selected.name} →
            </Link>
          </div>

          <SupplyGroup
            title="Ribbons"
            note={
              selected.constraints.ribbonWidth ||
              selected.constraints.ribbonCoreMm ||
              selected.constraints.ribbonMaxLengthM
                ? undefined
                : "La ficha de este equipo no publica medidas de cinta, así que no podemos verificar ribbons."
            }
            group={supplies.ribbons}
            printerName={selected.name}
          />
          <SupplyGroup
            title="Etiquetas"
            note={
              selected.constraints.labelWidth
                ? undefined
                : "La ficha de este equipo no publica el ancho de etiqueta, así que no podemos verificar etiquetas."
            }
            group={supplies.labels}
            printerName={selected.name}
          />

          <div className="mt-10 rounded-lg bg-muted p-5 text-sm text-secondary">
            <p className="font-medium text-primary">Antes de pedir, confirmá estos puntos</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>El lado de la tinta del ribbon (OUT o IN) que indica el manual de tu equipo.</li>
              <li>Que el material de la etiqueta sea el adecuado para el ribbon (por ejemplo cera con papel, resina con sintéticos).</li>
              <li>El diámetro exterior máximo del rollo de etiquetas de tu equipo.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/contacto"
                className="inline-flex min-h-11 items-center rounded-md bg-accent px-5 font-semibold text-white transition-colors hover:bg-orange-600"
              >
                Consultar con un asesor
              </Link>
              {siteConfig.whatsappNumber && (
                <a
                  href={buildWhatsAppUrl(
                    `Hola, necesito insumos (ribbons y etiquetas) para la impresora ${selected.name}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-md border border-border bg-white px-5 font-medium text-primary transition-colors hover:border-green-500"
                >
                  Consultar por WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function SupplyGroup({
  title,
  note,
  group,
  printerName,
}: {
  title: string;
  note?: string;
  group: { matches: SupplyCard[]; rejected: SupplyCard[]; unverified: SupplyCard[] };
  printerName: string;
}) {
  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold text-primary">{title}</h3>

      {note && <p className="mt-2 text-sm text-secondary">{note}</p>}

      {!note && group.matches.length === 0 && (
        <p className="mt-2 text-sm text-secondary">
          Ningún {title.toLowerCase().slice(0, -1)} publicado cumple las medidas de {printerName}.
          Consultanos por stock a medida.
        </p>
      )}

      {group.matches.length > 0 && (
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {group.matches.map((card) => (
            <li key={card.id}>
              <ProductCard
                slug={card.slug}
                name={card.name}
                brandName={card.brandName}
                imageUrl={card.imageUrl}
                imageAlt={card.imageAlt}
                availability={card.availability}
              />
              <ul className="mt-2 space-y-1 text-xs text-secondary">
                {card.checks.map((check) => (
                  <li key={check.text} className="flex gap-1.5">
                    <span aria-hidden="true" className="text-green-700">✓</span>
                    {check.text}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      {group.rejected.length > 0 && (
        <details className="mt-4 rounded-lg border border-border bg-white p-4 text-sm">
          <summary className="cursor-pointer font-medium text-secondary">
            No cumplen las medidas ({group.rejected.length})
          </summary>
          <ul className="mt-3 space-y-3">
            {group.rejected.map((card) => (
              <li key={card.id}>
                <Link href={`/productos/${card.slug}`} className="font-medium text-primary hover:underline">
                  {card.name}
                </Link>
                <ul className="mt-1 space-y-0.5 text-xs text-secondary">
                  {card.checks.map((check) => (
                    <li key={check.text}>
                      <span aria-hidden="true" className={check.ok ? "text-green-700" : "text-destructive"}>
                        {check.ok ? "✓" : "✕"}
                      </span>{" "}
                      {check.text}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </details>
      )}

      {group.unverified.length > 0 && (
        <details className="mt-3 rounded-lg border border-border bg-white p-4 text-sm">
          <summary className="cursor-pointer font-medium text-secondary">
            Sin medidas cargadas para verificar ({group.unverified.length})
          </summary>
          <ul className="mt-3 space-y-1">
            {group.unverified.map((card) => (
              <li key={card.id}>
                <Link href={`/productos/${card.slug}`} className="text-primary hover:underline">
                  {card.name}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
