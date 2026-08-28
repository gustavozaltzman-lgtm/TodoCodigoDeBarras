"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { inquiries } from "@/lib/db/schema";
import { inquirySchema } from "@/lib/validation/inquiry";
import { requireAdminSession } from "@/lib/auth/session";

export type InquiryFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitInquiryAction(
  _prevState: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  const raw = {
    name: formData.get("name"),
    company: formData.get("company") || undefined,
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    country: formData.get("country") || undefined,
    message: formData.get("message"),
    type: formData.get("type") || "general",
    productId: formData.get("productId") || undefined,
    sourceUrl: formData.get("sourceUrl") || undefined,
  };

  const parsed = inquirySchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Datos invalidos",
    };
  }

  // Honeypot anti-spam: campo oculto que un bot completa y un humano no ve
  if (formData.get("website")) {
    return { status: "success" };
  }

  const data = parsed.data;

  await db.insert(inquiries).values({
    type: data.type,
    productId: data.productId ?? null,
    name: data.name,
    company: data.company ?? null,
    email: data.email,
    phone: data.phone ?? null,
    country: data.country ?? null,
    message: data.message,
    sourceUrl: data.sourceUrl ?? null,
  });

  return { status: "success" };
}

export async function setInquiryStatusAction(
  id: number,
  status: "new" | "contacted" | "closed"
) {
  await requireAdminSession();
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
  revalidatePath("/admin/consultas");
}

export async function deleteInquiryAction(id: number) {
  await requireAdminSession();
  await db.delete(inquiries).where(eq(inquiries.id, id));
  revalidatePath("/admin/consultas");
}
