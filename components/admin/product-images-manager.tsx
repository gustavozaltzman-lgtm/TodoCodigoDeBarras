"use client";

import { useTransition } from "react";
import Image from "next/image";
import {
  addProductImageAction,
  deleteProductImageAction,
  setPrimaryImageAction,
} from "@/features/products/actions";
import { inputClass, primaryButtonClass } from "./form-styles";

type ImageRow = {
  id: number;
  url: string;
  alt: string | null;
  isPrimary: boolean;
};

export function ProductImagesManager({
  productId,
  images,
}: {
  productId: number;
  images: ImageRow[];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="rounded-lg border border-border p-2">
            <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
              <Image
                src={image.url}
                alt={image.alt ?? ""}
                fill
                className="object-contain"
                sizes="200px"
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              {image.isPrimary ? (
                <span className="text-xs font-medium text-accent">Principal</span>
              ) : (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() => setPrimaryImageAction(image.id, productId))
                  }
                  className="cursor-pointer text-xs text-secondary hover:text-primary disabled:opacity-50"
                >
                  Marcar principal
                </button>
              )}
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  startTransition(() => deleteProductImageAction(image.id, productId))
                }
                className="cursor-pointer text-xs text-destructive hover:underline disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <form
        action={addProductImageAction.bind(null, productId)}
        className="mt-4 flex flex-wrap items-end gap-3"
      >
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary" htmlFor="file">
            Nueva imagen
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept="image/*"
            required
            className="text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary" htmlFor="alt">
            Texto alternativo
          </label>
          <input id="alt" name="alt" className={inputClass} />
        </div>
        <button type="submit" className={primaryButtonClass}>
          Subir
        </button>
      </form>
    </div>
  );
}
