import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { getAllPublishedCategorySlugs } from "@/features/categories/queries";
import { getAllPublishedProductSlugs } from "@/features/products/queries";
import { getPublishedBrands } from "@/features/brands/queries";
import { INDUSTRY_SOLUTIONS } from "@/lib/content/industry-solutions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, brands] = await Promise.all([
    getAllPublishedCategorySlugs(),
    getAllPublishedProductSlugs(),
    getPublishedBrands(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/empresa`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/contacto`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/catalogo`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/recursos`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${siteConfig.url}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/terminos`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteConfig.url}/catalogo/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const brandEntries: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${siteConfig.url}/marcas/${brand.slug}`,
    lastModified: brand.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/productos/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const solutionEntries: MetadataRoute.Sitemap = INDUSTRY_SOLUTIONS.map((s) => ({
    url: `${siteConfig.url}/soluciones/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...categoryEntries,
    ...brandEntries,
    ...productEntries,
    ...solutionEntries,
  ];
}
