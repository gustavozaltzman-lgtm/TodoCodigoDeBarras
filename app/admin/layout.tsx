import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { logoutAction } from "@/lib/auth/actions";

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
      <header className="flex items-center justify-between border-b border-border bg-white px-6 py-3">
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
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
