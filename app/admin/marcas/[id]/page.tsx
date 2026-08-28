import { notFound } from "next/navigation";
import { BrandForm } from "@/components/admin/brand-form";
import { getBrandById } from "@/features/brands/admin-queries";
import { updateBrandAction } from "@/features/brands/actions";

type EditBrandPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBrandPage({ params }: EditBrandPageProps) {
  const { id } = await params;
  const brand = await getBrandById(Number(id));
  if (!brand) notFound();

  const boundAction = updateBrandAction.bind(null, brand.id);

  return (
    <div>
      <h1 className="text-xl font-semibold text-primary">Editar marca</h1>
      <div className="mt-6">
        <BrandForm brand={brand} action={boundAction} />
      </div>
    </div>
  );
}
