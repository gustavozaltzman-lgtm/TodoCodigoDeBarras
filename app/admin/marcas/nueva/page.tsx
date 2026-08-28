import { BrandForm } from "@/components/admin/brand-form";
import { createBrandAction } from "@/features/brands/actions";

export default function NewBrandPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-primary">Nueva marca</h1>
      <div className="mt-6">
        <BrandForm action={createBrandAction} />
      </div>
    </div>
  );
}
