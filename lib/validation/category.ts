import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Ingresa un nombre"),
  slug: z.string().trim().min(2, "Ingresa un slug"),
  parentId: z.coerce.number().int().positive().optional(),
  description: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  status: z.enum(["draft", "published", "hidden", "archived"]),
  sortOrder: z.coerce.number().int().default(0),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
