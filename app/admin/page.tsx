import Link from "next/link";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { brands, categories, inquiries, products } from "@/lib/db/schema";

async function getCounts() {
  const [[p], [c], [b], [i]] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(products),
    db.select({ count: sql<number>`count(*)::int` }).from(categories),
    db.select({ count: sql<number>`count(*)::int` }).from(brands),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(inquiries)
      .where(sql`${inquiries.status} = 'new'`),
  ]);
  return { products: p.count, categories: c.count, brands: b.count, newInquiries: i.count };
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  const cards = [
    { label: "Productos", value: counts.products, href: "/admin/productos" },
    { label: "Categorías", value: counts.categories, href: "/admin/categorias" },
    { label: "Marcas", value: counts.brands, href: "/admin/marcas" },
    { label: "Consultas nuevas", value: counts.newInquiries, href: "/admin/consultas" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-primary">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="cursor-pointer rounded-lg border border-border bg-white p-5 transition-colors hover:border-accent"
          >
            <p className="text-sm text-secondary">{card.label}</p>
            <p className="mt-1 text-3xl font-semibold text-primary">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
