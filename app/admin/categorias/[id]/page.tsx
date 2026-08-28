import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import {
  getCategoryById,
  getTopLevelCategories,
} from "@/features/categories/admin-queries";
import { updateCategoryAction } from "@/features/categories/actions";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const [category, parentOptions] = await Promise.all([
    getCategoryById(Number(id)),
    getTopLevelCategories(),
  ]);
  if (!category) notFound();

  const boundAction = updateCategoryAction.bind(null, category.id);

  return (
    <div>
      <h1 className="text-xl font-semibold text-primary">Editar categoría</h1>
      <div className="mt-6">
        <CategoryForm
          category={category}
          parentOptions={parentOptions}
          action={boundAction}
        />
      </div>
    </div>
  );
}
