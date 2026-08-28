import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  slug: string;
  name: string;
  brandName?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export function ProductCard({
  slug,
  name,
  brandName,
  imageUrl,
  imageAlt,
}: ProductCardProps) {
  return (
    <Link
      href={`/productos/${slug}`}
      className="cursor-pointer rounded-lg border border-border bg-white p-4 transition-shadow hover:shadow-sm"
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt ?? name}
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        )}
      </div>
      <p className="mt-3 text-sm font-medium text-primary">{name}</p>
      {brandName && <p className="text-xs text-secondary">{brandName}</p>}
    </Link>
  );
}
