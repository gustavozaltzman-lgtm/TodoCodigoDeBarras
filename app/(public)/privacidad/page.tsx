import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Cómo recopilamos, usamos y protegemos los datos personales que nos compartís a través de este sitio.",
  alternates: {
    canonical: "/privacidad",
  },
};

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-primary">
        Política de Privacidad
      </h1>
      <p className="mt-2 text-sm text-secondary">
        Última actualización: 27 de agosto de 2026
      </p>

      <div className="prose-legal mt-10 space-y-8 text-secondary [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-primary [&_h2]:mb-2 [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
        <section>
          <h2>1. Responsable del tratamiento</h2>
          <p>
            {siteConfig.name} [Completar: razón social, CUIT y domicilio
            legal] es responsable del tratamiento de los datos personales que
            se recopilan a través de este sitio web. Ante cualquier consulta
            sobre esta política podés escribirnos a través del{" "}
            <a href="/contacto" className="text-accent hover:underline">
              formulario de contacto
            </a>
            .
          </p>
        </section>

        <section>
          <h2>2. Qué datos recopilamos</h2>
          <p>
            Recopilamos únicamente los datos que completás voluntariamente en
            nuestros formularios de consulta y cotización: nombre, empresa,
            email, teléfono, país y el mensaje o producto por el que
            consultás. No pedimos ni almacenamos datos de pago ni información
            financiera en este sitio.
          </p>
        </section>

        <section>
          <h2>3. Para qué usamos tus datos</h2>
          <p>Usamos la información que nos enviás exclusivamente para:</p>
          <ul>
            <li>Responder tu consulta o solicitud de cotización</li>
            <li>Contactarte por email, teléfono o WhatsApp según corresponda</li>
            <li>Llevar un registro interno de nuestras comunicaciones comerciales</li>
          </ul>
          <p>
            No vendemos ni compartimos tus datos con terceros con fines
            comerciales. Solo los compartiríamos si una autoridad competente
            lo requiere por ley.
          </p>
        </section>

        <section>
          <h2>4. Conservación y seguridad</h2>
          <p>
            Conservamos tus datos mientras dure la relación comercial o hasta
            que solicites su eliminación. Aplicamos medidas técnicas
            razonables para proteger la información contra accesos no
            autorizados, incluyendo conexión cifrada (HTTPS) y controles de
            acceso a nuestra base de datos.
          </p>
        </section>

        <section>
          <h2>5. Tus derechos</h2>
          <p>
            De acuerdo con la Ley 25.326 de Protección de Datos Personales,
            tenés derecho a acceder, rectificar, actualizar o solicitar la
            eliminación de tus datos personales. Podés ejercer estos derechos
            escribiéndonos a través del formulario de contacto. La Agencia de
            Acceso a la Información Pública, en su carácter de Órgano de
            Control de la Ley 25.326, tiene la atribución de atender las
            denuncias y reclamos que se interpongan con relación al
            incumplimiento de las normas sobre protección de datos
            personales.
          </p>
        </section>

        <section>
          <h2>6. Cookies</h2>
          <p>
            Este sitio utiliza únicamente cookies técnicas necesarias para su
            funcionamiento básico. Actualmente no utilizamos cookies de
            análisis ni de publicidad de terceros. Si en el futuro
            incorporamos herramientas de analítica, esta política será
            actualizada en consecuencia.
          </p>
        </section>

        <section>
          <h2>7. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política ocasionalmente. La fecha de
            última actualización figura al inicio de esta página.
          </p>
        </section>
      </div>
    </main>
  );
}
