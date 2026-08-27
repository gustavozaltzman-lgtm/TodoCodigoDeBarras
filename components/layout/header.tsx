import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/empresa", label: "Empresa" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-heading)] text-lg font-semibold text-primary transition-colors hover:text-accent"
        >
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-secondary transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            className="hidden rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary sm:inline-block"
          >
            Solicitar cotización
          </Link>
        </nav>
      </div>
    </header>
  );
}
