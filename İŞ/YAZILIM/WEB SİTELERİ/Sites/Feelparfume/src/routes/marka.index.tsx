import { createFileRoute, Link } from "@tanstack/react-router";
import { brandList, minPrice, productSlug, productsByBrand } from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { CatalogImg } from "@/components/catalog-img";
import { formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/marka/")({
  head: () => pageHead({ title: "Markalar", description: "Tüm parfüm markaları A–Z.", path: "/marka" }),
  component: Brands,
});

function Brands() {
  const brands = brandList();
  const groups = new Map<string, typeof brands>();
  for (const b of brands) {
    const k = b.name.charAt(0).toLocaleUpperCase("tr");
    groups.set(k, [...(groups.get(k) ?? []), b]);
  }
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">A–Z</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Markalar</h1>
      {brands.length === 0 ? (
        <p className="mt-8 text-sm text-fg-muted">Henüz marka yok.</p>
      ) : (
        <>
          <nav className="mt-6 flex flex-wrap gap-1" aria-label="Harfler">
            {[...groups.keys()].map((k) => (
              <a
                key={k}
                href={`#harf-${k}`}
                className="flex size-10 items-center justify-center rounded-full border border-border-strong font-mono text-sm hover:border-fg"
              >
                {k}
              </a>
            ))}
          </nav>
          <div className="mt-10 grid gap-12">
            {[...groups.entries()].map(([k, list]) => (
              <section key={k} id={`harf-${k}`} className="scroll-mt-28">
                <h2 className="font-display text-4xl">{k}</h2>
                {list.map((b) => (
                  <div key={b.slug} className="mt-6">
                    <Link to="/marka/$slug" params={{ slug: b.slug }} className="font-display text-3xl hover:text-taba">
                      {b.name}
                    </Link>
                    <span className="ml-3 font-mono text-xs text-fg-muted">{b.count}</span>
                    <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {productsByBrand(b.slug).map((p) => (
                        <li key={p.sku}>
                          <Link
                            to="/urun/$sku"
                            params={{ sku: productSlug(p) }}
                            className="how-step block overflow-hidden rounded-xl bg-bg-wash"
                          >
                            <CatalogImg src={p.image} alt="" sizes="25vw" className="aspect-square w-full object-contain p-3" />
                            <span className="block px-3 font-display text-lg leading-tight">{p.name}</span>
                            <span className="block px-3 pt-1 pb-3 font-mono text-xs">{formatPrice(minPrice(p))}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
