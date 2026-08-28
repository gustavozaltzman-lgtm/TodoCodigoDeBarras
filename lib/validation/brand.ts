import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().trim().min(2, "Ingresa un nombre"),
  slug: z.string().trim().min(2, "Ingresa un slug"),
  logoUrl: z.string().trim().optional(),
  description: z.string().trim().optional(),
  status: z.enum(["draft", "published", "hidden", "archived"]),
  sortOrder: z.coerce.number().int().default(0),
});

export type BrandInput = z.infer<typeof brandSchema>;
