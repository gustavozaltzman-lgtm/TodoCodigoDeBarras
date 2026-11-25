import Image from "next/image";
import Link from "next/link";
import { AvailabilityBadge } from "./availability-badge";
import { CompareToggle } from "./compare-toggle";

type Availability = "in_stock" | "out_of_stock" | "preorder" | "discontinued";

type ProductCardProps = {
  slug: string;
  name: string;
  brandName?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  availability?: Availability | null;
  priority?: boolean;
};

export function ProductCard({
  slug,
  name,
  brandName,
  imageUrl,
  imageAlt,
  availability,
  priority = false,
}: ProductCardProps) {
  return (
    <div className="relative">
    <Link
      href={`/productos/${slug}`}
      className="group relative block h-full cursor-pointer rounded-lg border border-border bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt ?? name}
            fill
            className="object-contain transition-transform duration-200 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
          />
        )}
        {availability && (
          <AvailabilityBadge
            availability={availability}
            className="absolute left-2 top-2 bg-white/95 shadow-sm"
          />
        )}
      </div>
      <p className="mt-3 text-sm font-medium text-primary">{name}</p>
      {brandName && <p className="text-xs text-secondary">{brandName}</p>}
    </Link>
    {/* Fuera del link: un boton no puede ir dentro de un enlace */}
    <CompareToggle slug={slug} name={name} className="absolute right-6 top-6" />
    </div>
  );
}
