"use client";

import { useActionState, useState } from "react";
import { slugify } from "@/lib/slugify";
import { inputClass, labelClass, primaryButtonClass } from "./form-styles";
import type { CategoryFormState } from "@/features/categories/actions";

const initialState: CategoryFormState = { error: null };

type Category = {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  description: string | null;
  imageUrl: string | null;
  status: "draft" | "published" | "hidden" | "archived";
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
};

type ParentOption = { id: number; name: string };

export function CategoryForm({
  category,
  parentOptions,
  action,
}: {
  category?: Category;
  parentOptions: ParentOption[];
  action: (
    prevState: CategoryFormState,
    formData: FormData
  ) => Promise<CategoryFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category));

  const availableParents = parentOptions.filter((p) => p.id !== category?.id);

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
          defaultValue={category?.name}
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
        <label htmlFor="parentId" className={labelClass}>
          Categoría padre
        </label>
        <select
          id="parentId"
          name="parentId"
          defaultValue={category?.parentId ?? ""}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="">Ninguna (categoría principal)</option>
          {availableParents.map((parent) => (
            <option key={parent.id} value={parent.id}>
              {parent.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className={labelClass}>
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={category?.description ?? ""}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="imageUrl" className={labelClass}>
          URL de imagen
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          defaultValue={category?.imageUrl ?? ""}
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
            defaultValue={category?.status ?? "draft"}
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
            defaultValue={category?.sortOrder ?? 0}
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="seoTitle" className={labelClass}>
          SEO Title
        </label>
        <input
          id="seoTitle"
          name="seoTitle"
          defaultValue={category?.seoTitle ?? ""}
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
          defaultValue={category?.seoDescription ?? ""}
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
