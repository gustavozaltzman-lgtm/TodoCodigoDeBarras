import { z } from "zod";
import { INTEREST_OPTIONS, SECTOR_OPTIONS } from "@/lib/content/lead-scoring";

const interestValues = INTEREST_OPTIONS.map((o) => o.value) as [string, ...string[]];
const sectorValues = SECTOR_OPTIONS.map((o) => o.value) as [string, ...string[]];

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre"),
  company: z.string().trim().optional(),
  email: z.email("Email invalido"),
  phone: z.string().trim().optional(),
  country: z.string().trim().optional(),
  quantity: z.string().trim().optional(),
  interest: z.enum(interestValues).optional(),
  sector: z.enum(sectorValues).optional(),
  message: z.string().trim().min(5, "Contanos tu consulta"),
  type: z.enum(["general", "quote", "product"]).default("general"),
  productId: z.coerce.number().int().positive().optional(),
  sourceUrl: z.string().trim().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
