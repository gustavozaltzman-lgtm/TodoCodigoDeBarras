"use server";

import { and, eq, gt, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/lib/db/client";
import { inquiries } from "@/lib/db/schema";
import { inquirySchema } from "@/lib/validation/inquiry";
import { requireAdminSession } from "@/lib/auth/session";
import { notifyNewLead } from "@/lib/integrations/leads";

const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_SUBMISSIONS = 3;

async function getClientIp(): Promise<string | null> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return headersList.get("x-real-ip");
}

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
    quantity: formData.get("quantity") || undefined,
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

  const ipAddress = await getClientIp();

  if (ipAddress) {
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000);
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(inquiries)
      .where(and(eq(inquiries.ipAddress, ipAddress), gt(inquiries.createdAt, windowStart)));

    if (count >= RATE_LIMIT_MAX_SUBMISSIONS) {
      return {
        status: "error",
        message: "Ya recibimos varias consultas tuyas. Probá de nuevo en unos minutos.",
      };
    }
  }

  const data = parsed.data;

  const [inquiry] = await db
    .insert(inquiries)
    .values({
      type: data.type,
      productId: data.productId ?? null,
      name: data.name,
      company: data.company ?? null,
      email: data.email,
      phone: data.phone ?? null,
      country: data.country ?? null,
      quantity: data.quantity ?? null,
      message: data.message,
      sourceUrl: data.sourceUrl ?? null,
      ipAddress,
    })
    .returning();

  await notifyNewLead({
    id: inquiry.id,
    type: inquiry.type,
    name: inquiry.name,
    company: inquiry.company,
    email: inquiry.email,
    phone: inquiry.phone,
    country: inquiry.country,
    quantity: inquiry.quantity,
    message: inquiry.message,
    sourceUrl: inquiry.sourceUrl,
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
