import { faqPageJsonLd, type FaqItem } from "@/lib/seo/jsonld";

export function CategoryFaq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(items)) }}
      />
      <h2 className="text-xl font-semibold text-primary">Preguntas frecuentes</h2>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-lg border border-border p-4"
          >
            <summary className="cursor-pointer list-none font-medium text-primary marker:content-none">
              {item.question}
            </summary>
            <p className="mt-2 text-sm text-secondary">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
