import { ProductForm } from "@/components/admin/product-form";
import { createProductAction } from "@/features/products/actions";
import { getAllBrands } from "@/features/brands/admin-queries";
import { getAllCategories } from "@/features/categories/admin-queries";

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    getAllBrands(),
    getAllCategories(),
  ]);

  return (
    <div>
      <h1 className="text-xl font-semibold text-primary">Nuevo producto</h1>
      <p className="mt-1 text-sm text-secondary">
        Después de guardar los datos básicos vas a poder agregar imágenes,
        especificaciones, documentos y productos relacionados.
      </p>
      <div className="mt-6">
        <ProductForm action={createProductAction} brands={brands} categories={categories} />
      </div>
    </div>
  );
}
