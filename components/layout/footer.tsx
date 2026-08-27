import { siteConfig } from "@/lib/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-300">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
