import type { MetadataRoute } from "next";
import { getPublicProducts } from "../lib/catalog-server";
import { getPublicCategories } from "../lib/site-content-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.bucuruktoys.com";
  const products = await getPublicProducts();
  const categoryPages = await getPublicCategories();
  const updated = new Date("2026-08-26T00:00:00+03:00");
  return [
    { url: base, lastModified: updated, changeFrequency: "daily", priority: 1 },
    { url: `${base}/urunler`, lastModified: updated, changeFrequency: "daily", priority: 0.95 },
    { url: `${base}/kategoriler`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/toptan-satis`, lastModified: updated, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/iletisim`, lastModified: updated, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/hakkimizda`, lastModified: updated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/toptan-oyuncak-rehberi`, lastModified: updated, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/sikca-sorulan-sorular`, lastModified: updated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/kurumsal-bilgiler`, lastModified: updated, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/katalog`, lastModified: updated, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/bayi`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/gizlilik`, lastModified: updated, changeFrequency: "monthly", priority: 0.3 },
    ...categoryPages.map((category) => ({ url: `${base}/kategori/${category.slug}`, lastModified: updated, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((product) => ({ url: `${base}/urun/${product.sku.toLowerCase()}`, lastModified: new Date(product.updatedAt), changeFrequency: "weekly" as const, priority: 0.75 })),
  ];
}
