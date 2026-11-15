import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { brandList, productSlug, productsByBrand } from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { ProductCard } from "@/components/product-card";
import { CatalogImg } from "@/components/catalog-img";

export const Route = createFileRoute("/marka/$slug")({
  beforeLoad: ({ params }) => {
    if (!brandList().some((b) => b.slug === params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const b = brandList().find((x) => x.slug === params.slug);
    return pageHead({
      title: b ? `${b.name} parfümleri` : "Marka",
      description: b ? `${b.name} kadın, erkek ve unisex parfümleri; nota, ml ve fiyat bilgisiyle.` : undefined,
      path: `/marka/${params.slug}`,
    });
  },
  component: Brand,
});

function Brand() {
  const { slug } = Route.useParams();
  const brand = brandList().find((b) => b.slug === slug);
  const items = productsByBrand(slug);
  if (!brand) throw notFound();
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <h1 className="font-display text-5xl sm:text-6xl">{brand.name}</h1>
      <p className="mt-3 font-mono text-sm text-fg-muted">{items.length} ürün</p>
      <ul className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(7.5rem,1fr))] gap-2">
        {items.map((p) => (
          <li key={p.sku}>
            <Link to="/urun/$sku" params={{ sku: productSlug(p) }} className="block overflow-hidden rounded-xl bg-bg-wash">
              <CatalogImg src={p.image} alt={p.name} sizes="12vw" className="aspect-square w-full object-contain p-1" />
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((p, i) => (
          <ProductCard key={p.sku} product={p} priority={i < 4} />
        ))}
      </div>
    </div>
  );
}
