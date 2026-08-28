"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { LogoMark } from "./logo-mark";

const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/empresa", label: "Empresa" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-base font-semibold text-primary transition-colors hover:text-accent sm:text-lg"
        >
          <LogoMark className="h-8 w-8 shrink-0" />
          <span className="truncate">{siteConfig.name}</span>
        </Link>

        {/* Nav de escritorio */}
        <nav className="hidden items-center gap-6 md:flex">
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
            className="cursor-pointer rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary"
          >
            Solicitar cotización
          </Link>
        </nav>

        {/* Boton hamburguesa (mobile) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-primary md:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Panel mobile */}
      {open && (
        <nav
          id="mobile-menu"
          className="border-t border-border bg-white px-4 py-3 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-muted hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contacto"
            onClick={() => setOpen(false)}
            className="mt-3 block cursor-pointer rounded-md bg-accent px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary"
          >
            Solicitar cotización
          </Link>
        </nav>
      )}
    </header>
  );
}
