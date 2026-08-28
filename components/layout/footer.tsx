import Link from "next/link";
import { siteConfig, buildWhatsAppUrl, whatsappMessages } from "@/lib/config/site";
import { getPublishedTopCategories } from "@/features/categories/queries";
import { LogoMark } from "./logo-mark";

export async function Footer() {
  const categories = await getPublishedTopCategories();

  return (
    <footer className="border-t border-white/10 bg-primary">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-base font-semibold text-white"
            >
              <LogoMark className="h-8 w-8 shrink-0" />
              {siteConfig.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-400">
              {siteConfig.description}
            </p>
            {siteConfig.whatsappNumber && (
              <a
                href={buildWhatsAppUrl(whatsappMessages.general())}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-orange-400 transition-colors hover:text-orange-300"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2zm5.83 14.11c-.25.7-1.45 1.34-2 1.42-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.69-.62-2.97-1.28-4.91-4.27-5.06-4.47-.15-.2-1.21-1.61-1.21-3.07s.76-2.18 1.03-2.48c.27-.3.59-.37.78-.37.2 0 .39 0 .56.01.18.01.42-.07.66.5.25.6.84 2.07.91 2.22.07.15.12.33.02.53-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.73.82 2.02.97.3.15.5.22.57.35.07.13.07.75-.18 1.45z" />
                </svg>
                Escribinos por WhatsApp
              </a>
            )}
          </div>

          {categories.length > 0 && (
            <div>
              <p className="eyebrow text-slate-500">Catálogo</p>
              <ul className="mt-4 space-y-2.5">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/catalogo/${category.slug}`}
                      className="cursor-pointer text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="eyebrow text-slate-500">Empresa</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/empresa" className="cursor-pointer text-sm text-slate-400 transition-colors hover:text-white">
                  Quiénes somos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="cursor-pointer text-sm text-slate-400 transition-colors hover:text-white">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/recursos" className="cursor-pointer text-sm text-slate-400 transition-colors hover:text-white">
                  Recursos técnicos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-slate-500">Legal</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/privacidad" className="cursor-pointer text-sm text-slate-400 transition-colors hover:text-white">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="cursor-pointer text-sm text-slate-400 transition-colors hover:text-white">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}
