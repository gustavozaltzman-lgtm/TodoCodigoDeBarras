"use client";

import { useActionState, useState } from "react";
import { slugify } from "@/lib/slugify";
import { inputClass, labelClass, primaryButtonClass } from "./form-styles";
import type { BrandFormState } from "@/features/brands/actions";

const initialState: BrandFormState = { error: null };

type Brand = {
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  status: "draft" | "published" | "hidden" | "archived";
  sortOrder: number;
};

export function BrandForm({
  brand,
  action,
}: {
  brand?: Brand;
  action: (prevState: BrandFormState, formData: FormData) => Promise<BrandFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(brand?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(brand));

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className={labelClass}>
          Nombre *
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={brand?.name}
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="slug" className={labelClass}>
          Slug *
        </label>
        <input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="logoUrl" className={labelClass}>
          URL del logo
        </label>
        <input
          id="logoUrl"
          name="logoUrl"
          defaultValue={brand?.logoUrl ?? ""}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className={labelClass}>
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={brand?.description ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="status" className={labelClass}>
            Estado
          </label>
          <select
            id="status"
            name="status"
            defaultValue={brand?.status ?? "draft"}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="hidden">Oculto</option>
            <option value="archived">Archivado</option>
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="sortOrder" className={labelClass}>
            Orden
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={brand?.sortOrder ?? 0}
            className={inputClass}
          />
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert" aria-live="polite">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
