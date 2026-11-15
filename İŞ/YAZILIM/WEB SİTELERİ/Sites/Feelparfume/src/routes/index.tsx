import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, PRODUCTS, brandList, featuredProducts, getProduct, minPrice, noteList, productSizes, productSlug, productsByBrand, productsByCategory, productsByNote } from "@/lib/products";
import { FAMILIES } from "@/lib/perfume";
import { pageHead, SITE_ORIGIN } from "@/lib/seo";
import { ProductCard } from "@/components/product-card";
import { RecentRail } from "@/components/recent-rail";
import { CatalogImg } from "@/components/catalog-img";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/lib/site-config-context";
import { sampleChoices } from "@/lib/discovery";
import { formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Orijinal parfüm, deneme boyu ve hediye setleri",
      description:
        "Kadın, erkek ve unisex parfümler. Nota piramidi, deneme boyu, koku testi ve güvenli ödeme.",
      path: "/",
    }),
  component: Home,
});

function Home() {
  const siteConfig = useSiteConfig();
  const featured = featuredProducts().length ? featuredProducts() : PRODUCTS.slice(0, 4);
  const lead = featured[0] ?? PRODUCTS[0];
  const side = PRODUCTS.filter((product) => product.sku !== lead?.sku).slice(0, 4);
  const samples = sampleChoices().slice(0, 8);
  const gifts = productsByCategory("hediye-seti");
  const notes = noteList().slice(0, 12);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_ORIGIN}/#organization`,
        name: siteConfig.identity.name,
        url: SITE_ORIGIN,
        ...(siteConfig.identity.email ? { email: siteConfig.identity.email } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: siteConfig.identity.name,
        inLanguage: "tr-TR",
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_ORIGIN}/koleksiyon?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="mx-auto grid max-w-[1400px] grid-cols-2 items-stretch gap-3 px-4 pt-6 lg:h-[calc(100svh-var(--nav-h,6.5rem)-var(--cookie-h,0px)-0.75rem)] lg:grid-cols-4">
        <div className="col-span-2 flex min-h-0 flex-col overflow-hidden rounded-2xl bg-bg-wash lg:row-span-2">
          <h1 className="shrink-0 px-5 pt-5 font-display text-4xl leading-none sm:text-6xl">{siteConfig.identity.name}</h1>
          {lead ? (
            <Link to="/urun/$sku" params={{ sku: productSlug(lead) }} className="mt-2 block min-h-0 flex-1">
              <CatalogImg
                src={lead.image}
                alt={lead.name}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="aspect-square w-full object-contain p-2 sm:p-4 lg:aspect-auto lg:h-full"
              />
            </Link>
          ) : null}
          <div className="flex flex-wrap items-end justify-between gap-3 px-5 pb-5">
            {lead ? (
              <p className="font-display text-2xl leading-tight">
                <Link to="/urun/$sku" params={{ sku: productSlug(lead) }} className="underline-offset-4 hover:underline">
                  {lead.name}
                </Link>
                <span className="mt-1 block font-mono text-sm">
                  {productSizes(lead).length > 1 ? `${formatPrice(minPrice(lead))}'den` : formatPrice(minPrice(lead))}
                </span>
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Link to="/koleksiyon">
                <Button size="lg">{siteConfig.storefront.heroButton}</Button>
              </Link>
              <Link to="/koku-testi">
                <Button size="lg" variant="outline">
                  Koku testi
                </Button>
              </Link>
              <Link to="/kesif-seti">
                <Button size="lg" variant="outline">
                  Keşif seti
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {side.map((product) => (
          <Link
            key={product.sku}
            to="/urun/$sku"
            params={{ sku: productSlug(product) }}
            className="flex min-h-0 flex-col overflow-hidden rounded-xl bg-bg-wash"
          >
            <CatalogImg src={product.image} alt="" sizes="25vw" className="aspect-square w-full object-contain p-2 lg:aspect-auto lg:h-full lg:min-h-0 lg:flex-1" />
            <span className="shrink-0 px-3 font-display text-lg leading-tight">{product.name}</span>
            <span className="shrink-0 px-3 pt-1 pb-3 font-mono text-xs">{formatPrice(minPrice(product))}</span>
          </Link>
        ))}
      </section>

      {PRODUCTS.length ? (
        <section className="mx-auto max-w-[1400px] px-4 py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl sm:text-5xl">Parfümler</h2>
            <Link to="/koleksiyon" className="text-sm text-fg-muted hover:text-fg">
              Tüm parfümler
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.sku} product={p} priority={i < 4} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="deferred-section mx-auto max-w-[1400px] px-4 py-6">
        <h2 className="font-display text-4xl sm:text-5xl">
          <Link to="/kategori">Kategoriler</Link>
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const shot = productsByCategory(c.id)[0];
            return (
              <Link
                key={c.id}
                to="/kategori/$id"
                params={{ id: c.id }}
                className="how-step overflow-hidden rounded-xl bg-bg-wash"
              >
                {shot ? (
                  <CatalogImg src={shot.image} alt="" className="aspect-square w-full object-contain p-4" />
                ) : null}
                <p className="px-4 pb-4 font-display text-2xl">{c.name}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {samples.length ? (
        <section className="deferred-section mx-auto max-w-[1400px] px-4 py-6">
          <h2 className="font-display text-4xl sm:text-5xl">
            <Link to="/kesif-seti">Keşif seti</Link>
          </h2>
          <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
            {samples.map((item) => {
              const product = getProduct(item.sku);
              if (!product) return null;
              return (
              <Link
                key={item.sku}
                to="/urun/$sku"
                params={{ sku: productSlug(product) }}
                className="w-40 shrink-0 overflow-hidden rounded-xl bg-bg-elevated"
              >
                <CatalogImg src={item.image} alt="" className="aspect-square w-full object-contain p-3" />
                <p className="px-3 pb-3 font-display text-lg leading-tight">{item.name}</p>
                <p className="px-3 pb-4 font-mono text-xs">{item.ml} ml</p>
              </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="deferred-section mx-auto max-w-[1400px] px-4 py-6">
        <h2 className="font-display text-4xl sm:text-5xl">Koku ailesine göre</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {FAMILIES.map((f) => {
            const shot = PRODUCTS.find((p) => p.families?.includes(f.id));
            return (
              <Link
                key={f.id}
                to="/koleksiyon"
                search={{ aile: f.id }}
                className="how-step overflow-hidden rounded-xl bg-bg-elevated"
              >
                {shot ? (
                  <CatalogImg src={shot.image} alt="" className="aspect-[4/3] w-full object-contain p-3" />
                ) : null}
                <p className="px-4 pb-4 font-display text-xl">{f.name}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="deferred-section mx-auto max-w-[1400px] px-4 py-6">
        <h2 className="font-display text-4xl sm:text-5xl">
          <Link to="/marka">Markalar</Link>
        </h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {brandList().map((brand) => (
            <Link
              key={brand.slug}
              to="/marka/$slug"
              params={{ slug: brand.slug }}
              className="overflow-hidden rounded-xl bg-bg-wash p-4"
            >
              <p className="font-display text-2xl">{brand.name}</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {productsByBrand(brand.slug)
                  .slice(0, 3)
                  .map((p) => (
                    <CatalogImg
                      key={p.sku}
                      src={p.image}
                      alt=""
                      className="aspect-square w-full rounded-lg bg-bg-elevated object-contain p-2"
                    />
                  ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {notes.length ? (
        <section className="deferred-section mx-auto max-w-[1400px] px-4 py-6">
          <h2 className="font-display text-4xl sm:text-5xl">
            <Link to="/nota">Notalar</Link>
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {notes.map((note) => {
              const shot = productsByNote(note.slug)[0];
              return (
                <Link
                  key={note.slug}
                  to="/nota/$slug"
                  params={{ slug: note.slug }}
                  className="how-step block overflow-hidden rounded-xl bg-bg-elevated"
                >
                  {shot ? (
                    <CatalogImg src={shot.image} alt="" className="aspect-square w-full object-contain p-4" />
                  ) : null}
                  <span className="block px-4 font-display text-xl leading-tight">{note.name}</span>
                  <span className="block px-4 pt-1 pb-4 font-mono text-xs text-fg-muted">{note.count}</span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {gifts.length ? (
        <section className="deferred-section mx-auto max-w-[1400px] px-4 py-6">
          <h2 className="font-display text-4xl sm:text-5xl">
            <Link to="/kategori/$id" params={{ id: "hediye-seti" }}>
              Hediye setleri
            </Link>
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {gifts.map((gift) => (
              <Link
                key={gift.sku}
                to="/urun/$sku"
                params={{ sku: productSlug(gift) }}
                className="grid overflow-hidden rounded-2xl bg-bg-wash sm:grid-cols-2"
              >
                <CatalogImg src={gift.image} alt="" className="aspect-square w-full object-contain p-6" />
                <span className="flex flex-col justify-end gap-2 p-6">
                  <span className="font-display text-3xl leading-tight">{gift.name}</span>
                  <span className="font-mono text-sm tabular-nums">{formatPrice(minPrice(gift))}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mx-auto max-w-[1400px] px-4">
        <RecentRail className="py-12" />
      </div>
    </div>
  );
}
