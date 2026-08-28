import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Ingresa un nombre"),
  slug: z.string().trim().min(2, "Ingresa un slug"),
  brandId: z.coerce.number().int().positive().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  model: z.string().trim().optional(),
  mpn: z.string().trim().optional(),
  condition: z.enum(["new", "refurbished", "used"]).default("new"),
  availability: z
    .enum(["in_stock", "out_of_stock", "preorder", "discontinued"])
    .default("in_stock"),
  shortDescription: z.string().trim().optional(),
  description: z.string().trim().optional(),
  status: z.enum(["draft", "published", "hidden", "archived"]),
  isFeatured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

export const specificationSchema = z.object({
  groupName: z.string().trim().optional(),
  label: z.string().trim().min(1, "Ingresa una etiqueta"),
  value: z.string().trim().min(1, "Ingresa un valor"),
});

export const documentSchema = z.object({
  type: z.enum(["datasheet", "manual", "other"]),
  title: z.string().trim().min(1, "Ingresa un titulo"),
});
