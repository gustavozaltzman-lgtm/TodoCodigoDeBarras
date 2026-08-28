import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { ProductImagesManager } from "@/components/admin/product-images-manager";
import { ProductSpecificationsManager } from "@/components/admin/product-specifications-manager";
import { ProductDocumentsManager } from "@/components/admin/product-documents-manager";
import { ProductRelationsManager } from "@/components/admin/product-relations-manager";
import {
  getAllProductsLite,
  getProductForEdit,
  getProductRelationshipsForEdit,
} from "@/features/products/admin-queries";
import { getAllBrands } from "@/features/brands/admin-queries";
import { getAllCategories } from "@/features/categories/admin-queries";
import { updateProductAction } from "@/features/products/actions";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  const [product, brands, categories, allProducts, relations] = await Promise.all([
    getProductForEdit(productId),
    getAllBrands(),
    getAllCategories(),
    getAllProductsLite(),
    getProductRelationshipsForEdit(productId),
  ]);

  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, product.id);

  return (
    <div className="space-y-14">
      <div>
        <Link href="/admin/productos" className="cursor-pointer text-sm text-secondary hover:text-primary">
          ← Volver a productos
        </Link>
        <h1 className="mt-2 text-xl font-semibold text-primary">{product.name}</h1>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-primary">Datos del producto</h2>
        <ProductForm
          product={product}
          brands={brands}
          categories={categories}
          action={boundAction}
        />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-primary">Imágenes</h2>
        <ProductImagesManager productId={product.id} images={product.images} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-primary">
          Especificaciones técnicas
        </h2>
        <ProductSpecificationsManager
          productId={product.id}
          specifications={product.specifications}
        />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-primary">Documentación</h2>
        <ProductDocumentsManager productId={product.id} documents={product.documents} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-primary">
          Productos relacionados
        </h2>
        <ProductRelationsManager
          productId={product.id}
          relations={relations}
          allProducts={allProducts}
        />
      </section>
    </div>
  );
}
