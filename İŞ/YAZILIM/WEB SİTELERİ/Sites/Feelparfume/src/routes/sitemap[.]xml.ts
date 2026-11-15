import { createFileRoute } from "@tanstack/react-router";
import { SITE_ORIGIN } from "@/lib/seo";
import { CATEGORIES, productSlug, slugify } from "@/lib/products";

const STATIC_PATHS = [
  "/", "/koleksiyon", "/koku-testi", "/kesif-seti", "/marka", "/nota", "/kategori", "/hakkimizda",
  "/iletisim", "/teklif", "/kurumsal-teklif", "/sikayet", "/teslimat", "/iade", "/gizlilik",
  "/cerez", "/kvkk", "/mesafeli", "/on-bilgilendirme", "/cayma", "/kullanim", "/satici",
  "/sss", "/odeme-yontemleri", "/garanti", "/hesap",
];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { getPublicCatalogServer } = await import("@/lib/catalog-db.server");
        const { products } = await getPublicCatalogServer();
        const real = products.filter((p) => !p.sample);
        const urls = new Set(STATIC_PATHS);
        for (const c of CATEGORIES) if (real.some((p) => p.category === c.id)) urls.add(`/kategori/${c.id}`);
        for (const p of real) {
          urls.add(`/urun/${productSlug(p)}`);
          if (p.brand) urls.add(`/marka/${slugify(p.brand)}`);
          for (const n of [...(p.notes?.top ?? []), ...(p.notes?.heart ?? []), ...(p.notes?.base ?? [])])
            urls.add(`/nota/${slugify(n)}`);
        }
        const body =
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          [...urls].map((u) => `  <url><loc>${esc(SITE_ORIGIN + u)}</loc></url>`).join("\n") +
          `\n</urlset>\n`;
        return new Response(body, {
          headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
        });
      },
    },
  },
});
