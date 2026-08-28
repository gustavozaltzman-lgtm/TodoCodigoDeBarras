"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { brands } from "@/lib/db/schema";
import { requireAdminSession } from "@/lib/auth/session";
import { brandSchema } from "@/lib/validation/brand";

export type BrandFormState = { error: string | null };

function parseBrandForm(formData: FormData) {
  return brandSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    logoUrl: formData.get("logoUrl") || undefined,
    description: formData.get("description") || undefined,
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") || 0,
  });
}

export async function createBrandAction(
  _prevState: BrandFormState,
  formData: FormData
): Promise<BrandFormState> {
  await requireAdminSession();

  const parsed = parseBrandForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };
  }

  await db.insert(brands).values(parsed.data);
  revalidatePath("/admin/marcas");
  redirect("/admin/marcas");
}

export async function updateBrandAction(
  id: number,
  _prevState: BrandFormState,
  formData: FormData
): Promise<BrandFormState> {
  await requireAdminSession();

  const parsed = parseBrandForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };
  }

  await db
    .update(brands)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(brands.id, id));

  revalidatePath("/admin/marcas");
  redirect("/admin/marcas");
}

export async function deleteBrandAction(id: number) {
  await requireAdminSession();
  await db.delete(brands).where(eq(brands.id, id));
  revalidatePath("/admin/marcas");
}

export async function setBrandStatusAction(
  id: number,
  status: "draft" | "published" | "hidden" | "archived"
) {
  await requireAdminSession();
  await db
    .update(brands)
    .set({ status, updatedAt: new Date() })
    .where(eq(brands.id, id));
  revalidatePath("/admin/marcas");
}
