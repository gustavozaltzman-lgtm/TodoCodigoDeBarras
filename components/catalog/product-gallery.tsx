"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryImage = {
  url: string;
  alt: string | null;
};

export function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
        {active && (
          <Image
            src={active.url}
            alt={active.alt ?? productName}
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver imagen ${index + 1}`}
              aria-current={index === activeIndex}
              className={`relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-md border transition-colors ${
                index === activeIndex ? "border-accent" : "border-border hover:border-secondary"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt ?? `${productName} miniatura ${index + 1}`}
                fill
                className="object-contain"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
