"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import {
  productDocuments,
  productImages,
  productRelationships,
  productSpecifications,
  products,
} from "@/lib/db/schema";
import { requireAdminSession } from "@/lib/auth/session";
import {
  documentSchema,
  productSchema,
  specificationSchema,
} from "@/lib/validation/product";
import { uploadFile, deleteFile } from "@/lib/storage/blob";

export type ProductFormState = { error: string | null };
type PublicationStatus = "draft" | "published" | "hidden" | "archived";

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    brandId: formData.get("brandId") || undefined,
    categoryId: formData.get("categoryId") || undefined,
    model: formData.get("model") || undefined,
    shortDescription: formData.get("shortDescription") || undefined,
    description: formData.get("description") || undefined,
    status: formData.get("status"),
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: formData.get("sortOrder") || 0,
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
  });
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdminSession();

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };
  }

  const [created] = await db
    .insert(products)
    .values({
      ...parsed.data,
      brandId: parsed.data.brandId ?? null,
      categoryId: parsed.data.categoryId ?? null,
      publishedAt: parsed.data.status === "published" ? new Date() : null,
    })
    .returning();

  revalidatePath("/admin/productos");
  redirect(`/admin/productos/${created.id}`);
}

export async function updateProductAction(
  id: number,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdminSession();

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };
  }

  await db
    .update(products)
    .set({
      ...parsed.data,
      brandId: parsed.data.brandId ?? null,
      categoryId: parsed.data.categoryId ?? null,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}`);
  redirect(`/admin/productos/${id}`);
}

export async function deleteProductAction(id: number) {
  await requireAdminSession();
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/productos");
}

export async function setProductStatusAction(id: number, status: PublicationStatus) {
  await requireAdminSession();
  await db
    .update(products)
    .set({
      status,
      publishedAt: status === "published" ? new Date() : undefined,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));
  revalidatePath("/admin/productos");
}

export async function bulkSetProductStatusAction(
  ids: number[],
  status: PublicationStatus
) {
  await requireAdminSession();
  for (const id of ids) {
    await db
      .update(products)
      .set({
        status,
        publishedAt: status === "published" ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));
  }
  revalidatePath("/admin/productos");
}

// ---------- imagenes ----------

export async function addProductImageAction(productId: number, formData: FormData) {
  await requireAdminSession();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return;

  const { url } = await uploadFile(file, `products/${productId}/images`);
  const alt = String(formData.get("alt") ?? "");

  const existingCount = await db
    .select({ id: productImages.id })
    .from(productImages)
    .where(eq(productImages.productId, productId));

  await db.insert(productImages).values({
    productId,
    url,
    alt: alt || null,
    sortOrder: existingCount.length,
    isPrimary: existingCount.length === 0,
  });

  revalidatePath(`/admin/productos/${productId}`);
}

export async function deleteProductImageAction(imageId: number, productId: number) {
  await requireAdminSession();

  const [image] = await db
    .select()
    .from(productImages)
    .where(eq(productImages.id, imageId))
    .limit(1);

  if (image) {
    await deleteFile(image.url).catch(() => {});
    await db.delete(productImages).where(eq(productImages.id, imageId));
  }

  revalidatePath(`/admin/productos/${productId}`);
}

export async function setPrimaryImageAction(imageId: number, productId: number) {
  await requireAdminSession();

  await db
    .update(productImages)
    .set({ isPrimary: false })
    .where(eq(productImages.productId, productId));
  await db
    .update(productImages)
    .set({ isPrimary: true })
    .where(eq(productImages.id, imageId));

  revalidatePath(`/admin/productos/${productId}`);
}

// ---------- especificaciones ----------

export type SpecFormState = { error: string | null };

export async function addSpecificationAction(
  productId: number,
  _prevState: SpecFormState,
  formData: FormData
): Promise<SpecFormState> {
  await requireAdminSession();

  const parsed = specificationSchema.safeParse({
    groupName: formData.get("groupName") || undefined,
    label: formData.get("label"),
    value: formData.get("value"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };
  }

  await db.insert(productSpecifications).values({
    productId,
    groupName: parsed.data.groupName ?? null,
    label: parsed.data.label,
    value: parsed.data.value,
    sortOrder: 0,
  });

  revalidatePath(`/admin/productos/${productId}`);
  return { error: null };
}

export async function deleteSpecificationAction(specId: number, productId: number) {
  await requireAdminSession();
  await db.delete(productSpecifications).where(eq(productSpecifications.id, specId));
  revalidatePath(`/admin/productos/${productId}`);
}

// ---------- documentos ----------

export type DocumentFormState = { error: string | null };

export async function addDocumentAction(
  productId: number,
  _prevState: DocumentFormState,
  formData: FormData
): Promise<DocumentFormState> {
  await requireAdminSession();

  const parsed = documentSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "Selecciona un archivo" };
  }

  const { url, size } = await uploadFile(file, `products/${productId}/documents`);

  await db.insert(productDocuments).values({
    productId,
    type: parsed.data.type,
    title: parsed.data.title,
    url,
    fileSize: size,
  });

  revalidatePath(`/admin/productos/${productId}`);
  return { error: null };
}

export async function deleteDocumentAction(docId: number, productId: number) {
  await requireAdminSession();

  const [doc] = await db
    .select()
    .from(productDocuments)
    .where(eq(productDocuments.id, docId))
    .limit(1);

  if (doc) {
    await deleteFile(doc.url).catch(() => {});
    await db.delete(productDocuments).where(eq(productDocuments.id, docId));
  }

  revalidatePath(`/admin/productos/${productId}`);
}

// ---------- productos relacionados ----------

export async function addRelatedProductAction(
  productId: number,
  relatedProductId: number,
  type: "related" | "accessory"
) {
  await requireAdminSession();

  if (productId === relatedProductId) return;

  await db
    .insert(productRelationships)
    .values({ productId, relatedProductId, type })
    .onConflictDoNothing();

  revalidatePath(`/admin/productos/${productId}`);
}

export async function removeRelatedProductAction(
  relationshipId: number,
  productId: number
) {
  await requireAdminSession();
  await db
    .delete(productRelationships)
    .where(
      and(
        eq(productRelationships.id, relationshipId),
        eq(productRelationships.productId, productId)
      )
    );
  revalidatePath(`/admin/productos/${productId}`);
}
