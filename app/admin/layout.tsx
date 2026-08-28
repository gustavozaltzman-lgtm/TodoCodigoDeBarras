import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { logoutAction } from "@/lib/auth/actions";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/marcas", label: "Marcas" },
  { href: "/admin/consultas", label: "Consultas" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isLoginPage = pathname === "/admin/login";

  const session = await getSession();

  if (!session && !isLoginPage) {
    redirect("/admin/login");
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b border-border bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary">
            Panel de administración
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary">{session?.email}</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="cursor-pointer text-sm text-secondary transition-colors hover:text-primary"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
        <nav className="mt-3 flex gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer text-sm font-medium text-secondary transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
