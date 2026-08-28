import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Condiciones de uso de este sitio web y de las consultas comerciales realizadas a través de él.",
  alternates: {
    canonical: "/terminos",
  },
};

export default function TerminosPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-primary">
        Términos y Condiciones
      </h1>
      <p className="mt-2 text-sm text-secondary">
        Última actualización: 27 de agosto de 2026
      </p>

      <div className="prose-legal mt-10 space-y-8 text-secondary [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-primary [&_h2]:mb-2 [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
        <section>
          <h2>1. Aceptación de los términos</h2>
          <p>
            El acceso y uso de este sitio web atribuye la condición de
            usuario e implica la aceptación de estos términos y condiciones.
            Si no estás de acuerdo, te pedimos que no utilices el sitio.
          </p>
        </section>

        <section>
          <h2>2. Objeto del sitio</h2>
          <p>
            {siteConfig.name} comercializa e integra hardware de captura
            automática de datos (códigos de barras, RFID) y etiquetado
            industrial, junto con sus insumos y servicios técnicos asociados.
            Este sitio web tiene fines informativos y de generación de
            consultas comerciales: <strong>no procesa pagos ni ventas
            online</strong>. Toda cotización, precio o condición comercial se
            confirma directamente con nuestro equipo, fuera del sitio.
          </p>
        </section>

        <section>
          <h2>3. Carácter de la información publicada</h2>
          <p>
            La información técnica, imágenes y especificaciones de productos
            publicadas en el sitio tienen carácter orientativo. Las
            características finales, disponibilidad y condiciones de cada
            equipo o insumo se confirman en la cotización formal enviada por
            nuestro equipo comercial.
          </p>
        </section>

        <section>
          <h2>4. Propiedad intelectual</h2>
          <p>
            Los textos, imágenes, marca y demás contenidos de este sitio son
            propiedad de {siteConfig.name} o de sus licenciantes, salvo
            logos y materiales de fabricantes de terceros, que pertenecen a
            sus respectivos dueños. No está permitida su reproducción total
            o parcial sin autorización previa por escrito.
          </p>
        </section>

        <section>
          <h2>5. Uso del formulario de contacto</h2>
          <p>
            Al enviar una consulta o solicitud de cotización a través de este
            sitio, aceptás que la información brindada sea utilizada para
            responderte, de acuerdo con nuestra{" "}
            <a href="/privacidad" className="text-accent hover:underline">
              Política de Privacidad
            </a>
            . Nos reservamos el derecho de no procesar consultas que
            consideremos fraudulentas, abusivas o generadas por sistemas
            automatizados.
          </p>
        </section>

        <section>
          <h2>6. Limitación de responsabilidad</h2>
          <p>
            No nos responsabilizamos por interrupciones temporales del sitio
            por mantenimiento o causas ajenas a nuestro control, ni por el
            uso que terceros puedan hacer de la información pública
            disponible en el sitio.
          </p>
        </section>

        <section>
          <h2>7. Legislación aplicable</h2>
          <p>
            Estos términos se rigen por las leyes de la República Argentina.
            Ante cualquier controversia, las partes se someten a los
            tribunales ordinarios competentes [Completar: jurisdicción
            específica].
          </p>
        </section>

        <section>
          <h2>8. Contacto</h2>
          <p>
            Para consultas sobre estos términos, escribinos a través del{" "}
            <a href="/contacto" className="text-accent hover:underline">
              formulario de contacto
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
