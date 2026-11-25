"use client";

import { useEffect, useState } from "react";

type Tab = { id: string; label: string };

// Menu de secciones fijo bajo el header. Son anclas a secciones que ya estan
// todas en el HTML (no pestañas que ocultan contenido), asi buscadores y
// lectores ven la ficha completa. Resalta la seccion visible mientras se
// hace scroll.
export function SectionTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  useEffect(() => {
    const elements = tabs
      .map((tab) => document.getElementById(tab.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Franja angosta bajo el header + barra: la primera seccion que la cruza es la activa.
      { rootMargin: "-130px 0px -60% 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [tabs]);

  if (tabs.length < 2) return null;

  return (
    <nav
      aria-label="Secciones de la ficha"
      className="sticky top-16 z-30 -mx-4 mt-10 border-b border-border bg-white/95 px-4 backdrop-blur"
    >
      <ul className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <li key={tab.id} className="shrink-0">
            <a
              href={`#${tab.id}`}
              aria-current={active === tab.id ? "true" : undefined}
              className={`inline-flex min-h-11 cursor-pointer items-center border-b-2 px-3 text-sm font-medium transition-colors ${
                active === tab.id
                  ? "border-accent text-primary"
                  : "border-transparent text-secondary hover:text-primary"
              }`}
            >
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
