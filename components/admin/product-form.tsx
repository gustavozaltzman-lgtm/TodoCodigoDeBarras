"use client";

import { useActionState, useState } from "react";
import { slugify } from "@/lib/slugify";
import { inputClass, labelClass, primaryButtonClass } from "./form-styles";
import type { ProductFormState } from "@/features/products/actions";

const initialState: ProductFormState = { error: null };

type Product = {
  name: string;
  slug: string;
  brandId: number | null;
  categoryId: number | null;
  model: string | null;
  shortDescription: string | null;
  description: string | null;
  status: "draft" | "published" | "hidden" | "archived";
  isFeatured: boolean;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
};

type Option = { id: number; name: string };

export function ProductForm({
  product,
  brands,
  categories,
  action,
}: {
  product?: Product;
  brands: Option[];
  categories: Option[];
  action: (
    prevState: ProductFormState,
    formData: FormData
  ) => Promise<ProductFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className={labelClass}>
          Nombre *
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={product?.name}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="brandId" className={labelClass}>
            Marca
          </label>
          <select
            id="brandId"
            name="brandId"
            defaultValue={product?.brandId ?? ""}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Sin marca</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="categoryId" className={labelClass}>
            Categoría
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={product?.categoryId ?? ""}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Sin categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="model" className={labelClass}>
          Modelo
        </label>
        <input
          id="model"
          name="model"
          defaultValue={product?.model ?? ""}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="shortDescription" className={labelClass}>
          Descripción corta
        </label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          rows={2}
          defaultValue={product?.shortDescription ?? ""}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className={labelClass}>
          Descripción completa
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={product?.description ?? ""}
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
            defaultValue={product?.status ?? "draft"}
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
            defaultValue={product?.sortOrder ?? 0}
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-secondary">
        <input
          type="checkbox"
          name="isFeatured"
          defaultChecked={product?.isFeatured ?? false}
          className="cursor-pointer"
        />
        Producto destacado (aparece en Home)
      </label>

      <div className="space-y-1">
        <label htmlFor="seoTitle" className={labelClass}>
          SEO Title
        </label>
        <input
          id="seoTitle"
          name="seoTitle"
          defaultValue={product?.seoTitle ?? ""}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="seoDescription" className={labelClass}>
          SEO Description
        </label>
        <textarea
          id="seoDescription"
          name="seoDescription"
          rows={2}
          defaultValue={product?.seoDescription ?? ""}
          className={inputClass}
        />
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
