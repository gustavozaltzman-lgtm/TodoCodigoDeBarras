import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Empresa",
  description:
    "Conocé nuestra trayectoria, los productos que comercializamos y los sectores a los que atendemos.",
};

// TODO: reemplazar por copy institucional real del cliente
const DIFERENCIALES = [
  {
    title: "Trayectoria comprobada",
    description:
      "Años de experiencia acompañando a empresas en la implementación de soluciones de identificación y captura de datos.",
  },
  {
    title: "Soporte técnico especializado",
    description:
      "Equipo propio de soporte para acompañar antes, durante y después de cada implementación.",
  },
  {
    title: "Marcas líderes",
    description:
      "Representamos marcas reconocidas internacionalmente en tecnología de código de barras.",
  },
];

export default function EmpresaPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
        Empresa
      </h1>

      <section className="mt-8 space-y-4 text-neutral-600">
        <p>
          {/* TODO: copy institucional real */}
          Somos una empresa especializada en la comercialización de productos
          y soluciones tecnológicas para identificación, captura de datos y
          código de barras, acompañando a nuestros clientes en la elección e
          implementación de la tecnología adecuada para cada operación.
        </p>
        <p>
          Trabajamos con una amplia variedad de industrias, ofreciendo
          asesoramiento técnico y comercial en cada etapa del proceso.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-semibold text-neutral-900">
          Por qué elegirnos
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {DIFERENCIALES.map((item) => (
            <div key={item.title}>
              <h3 className="font-medium text-neutral-900">{item.title}</h3>
              <p className="mt-1 text-sm text-neutral-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-lg bg-neutral-50 p-8 text-center">
        <p className="text-neutral-700">
          ¿Querés conocer nuestros productos?
        </p>
        <Link
          href="/catalogo"
          className="mt-3 inline-block rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground transition hover:opacity-90"
        >
          Ver catálogo
        </Link>
      </section>
    </main>
  );
}
