import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { inquiries } from "@/lib/db/schema";

export async function getAllInquiries() {
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

export async function getInquiryById(id: number) {
  const [inquiry] = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.id, id))
    .limit(1);
  return inquiry ?? null;
}
