import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-slate-300">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos
          reservados.
        </p>
        <div className="flex gap-4">
          <Link
            href="/recursos"
            className="cursor-pointer transition-colors hover:text-white"
          >
            Recursos técnicos
          </Link>
          <Link
            href="/privacidad"
            className="cursor-pointer transition-colors hover:text-white"
          >
            Política de Privacidad
          </Link>
          <Link
            href="/terminos"
            className="cursor-pointer transition-colors hover:text-white"
          >
            Términos y Condiciones
          </Link>
        </div>
      </div>
    </footer>
  );
}
