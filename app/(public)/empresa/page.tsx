import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Empresa",
  description:
    "Conocé nuestra trayectoria, los productos que comercializamos y los sectores a los que atendemos.",
  alternates: {
    canonical: "/empresa",
  },
};

const DIFERENCIALES = [
  {
    title: "Trayectoria comprobada",
    description:
      "Desde 1992 acompañando a empresas en la implementación de soluciones de identificación y captura de datos.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
      />
    ),
  },
  {
    title: "Soporte técnico especializado",
    description:
      "Equipo propio de soporte para acompañar antes, durante y después de cada implementación.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437 5.113-5.113"
      />
    ),
  },
  {
    title: "Marcas líderes",
    description:
      "Representamos marcas reconocidas internacionalmente en tecnología de código de barras.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15l3.75-3.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    ),
  },
];

export default function EmpresaPage() {
  return (
    <main>
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <span className="eyebrow">Sobre nosotros</span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            Empresa
          </h1>
          <div className="mt-6 space-y-4 text-secondary">
            <p>
              Desde 1992 somos una empresa especializada en la
              comercialización de productos y soluciones tecnológicas para
              identificación, captura de datos y código de barras,
              acompañando a nuestros clientes en la elección e
              implementación de la tecnología adecuada para cada operación.
            </p>
            <p>
              Trabajamos con una amplia variedad de industrias, ofreciendo
              asesoramiento técnico y comercial en cada etapa del proceso.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-xl font-semibold text-primary">
          Por qué elegirnos
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {DIFERENCIALES.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-5 w-5 text-accent"
                  aria-hidden="true"
                >
                  {item.icon}
                </svg>
              </span>
              <h3 className="mt-4 font-medium text-primary">{item.title}</h3>
              <p className="mt-1.5 text-sm text-secondary">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-slate-300">¿Querés conocer nuestros productos?</p>
          <Link
            href="/catalogo"
            className="mt-4 inline-block cursor-pointer rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-colors hover:bg-orange-600"
          >
            Ver catálogo
          </Link>
        </div>
      </section>
    </main>
  );
}
