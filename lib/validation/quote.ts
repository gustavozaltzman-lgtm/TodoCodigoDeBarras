import { z } from "zod";
import { SECTOR_OPTIONS } from "@/lib/content/lead-scoring";

export const QUOTE_MAX_ITEMS = 20;
export const QUOTE_MAX_QUANTITY = 99999;

const sectorValues = SECTOR_OPTIONS.map((o) => o.value) as [string, ...string[]];

// Pedido de cotizacion con varios productos. Los nombres NO vienen del
// navegador: se buscan en la base por slug al guardar.
export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Ingresá tu nombre"),
  company: z.string().trim().max(255).optional(),
  email: z.email("Ingresá un email válido"),
  phone: z.string().trim().max(50).optional(),
  sector: z.enum(sectorValues).optional(),
  notes: z.string().trim().max(1000, "Los comentarios son muy largos").optional(),
  items: z
    .array(
      z.object({
        slug: z.string().trim().min(1).max(255),
        quantity: z.coerce.number().int().min(1).max(QUOTE_MAX_QUANTITY),
      })
    )
    .min(1, "Agregá al menos un producto a la lista")
    .max(QUOTE_MAX_ITEMS, `Máximo ${QUOTE_MAX_ITEMS} productos por pedido`),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
