import { CategoryForm } from "@/components/admin/category-form";
import { createCategoryAction } from "@/features/categories/actions";
import { getTopLevelCategories } from "@/features/categories/admin-queries";

export default async function NewCategoryPage() {
  const parentOptions = await getTopLevelCategories();

  return (
    <div>
      <h1 className="text-xl font-semibold text-primary">Nueva categoría</h1>
      <div className="mt-6">
        <CategoryForm action={createCategoryAction} parentOptions={parentOptions} />
      </div>
    </div>
  );
}
