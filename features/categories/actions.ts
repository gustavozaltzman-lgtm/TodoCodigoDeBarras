"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";
import { requireAdminSession } from "@/lib/auth/session";
import { categorySchema } from "@/lib/validation/category";

export type CategoryFormState = { error: string | null };

function parseCategoryForm(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    parentId: formData.get("parentId") || undefined,
    description: formData.get("description") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") || 0,
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
  });
}

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdminSession();

  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };
  }

  await db.insert(categories).values({
    ...parsed.data,
    parentId: parsed.data.parentId ?? null,
  });
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  redirect("/admin/categorias");
}

export async function updateCategoryAction(
  id: number,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdminSession();

  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };
  }

  if (parsed.data.parentId === id) {
    return { error: "Una categoria no puede ser su propia categoria padre" };
  }

  await db
    .update(categories)
    .set({ ...parsed.data, parentId: parsed.data.parentId ?? null, updatedAt: new Date() })
    .where(eq(categories.id, id));

  revalidatePath("/admin/categorias");
  revalidatePath("/");
  redirect("/admin/categorias");
}

export async function deleteCategoryAction(id: number) {
  await requireAdminSession();
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

export async function setCategoryStatusAction(
  id: number,
  status: "draft" | "published" | "hidden" | "archived"
) {
  await requireAdminSession();
  await db
    .update(categories)
    .set({ status, updatedAt: new Date() })
    .where(eq(categories.id, id));
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}
