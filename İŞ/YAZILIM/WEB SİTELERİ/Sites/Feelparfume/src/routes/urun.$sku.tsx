import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/brand";
import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import {
  CATEGORIES,
  defaultSizeId,
  getProduct,
  neighborsInCategory,
  PRODUCTS,
  minPrice,
  productSizes,
  productSlug,
  relatedProducts,
  slugify,
  type ColorId,
} from "@/lib/products";
import { concentrationOf, familyName } from "@/lib/perfume";
import { SizePicker } from "@/components/size-picker";
import {
  CosmeticInfo,
  NotePyramid,
  PerfumeFacts,
  SampleBadge,
} from "@/components/perfume-details";
import { pageHead, SITE_ORIGIN } from "@/lib/seo";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { cn, formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { RecentRail } from "@/components/recent-rail";
import { QtyControl } from "@/components/qty-control";
import { WishButton } from "@/components/wish-button";
import { ShareButton } from "@/components/share-button";
import { PairRail } from "@/components/pair-rail";
import { Button } from "@/components/ui/button";
import { InstallmentTable } from "@/components/installment-table";
import { RestockForm } from "@/components/restock-form";

import { ProductGallery } from "@/components/product-gallery";
import { CatalogImg } from "@/components/catalog-img";
import { gallerySlides } from "@/lib/gallery";
import { toast } from "sonner";
import { toastAdded } from "@/lib/cart-toast";
import { ListBack } from "@/components/list-back";
import { ProductReviews } from "@/components/product-reviews";
import { ratingSummary, type PublicReview } from "@/lib/reviews";
import { listProductReviews } from "@/lib/reviews-api";

type Search = { renk?: ColorId };

function reviewSchema(reviews: PublicReview[]) {
  const summary = ratingSummary(reviews.map((review) => review.rating));
  if (!summary) return {};
  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: summary.rating,
      reviewCount: summary.count,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.slice(0, 8).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      ...(review.body ? { reviewBody: review.body } : {}),
    })),
  };
}

export const Route = createFileRoute("/urun/$sku")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    renk: typeof raw.renk === "string" && /^[\w.]{1,12}$/.test(raw.renk) ? raw.renk : undefined,
  }),
  beforeLoad: ({ params, search }) => {
    const p = getProduct(params.sku);
    if (!p) throw notFound();
    const slug = productSlug(p);
    if (params.sku !== slug) {
      throw redirect({
        to: "/urun/$sku",
        params: { sku: slug },
        search,
      });
    }
  },
  loader: async ({ params }) => {
    const { publicInstallments } = await import("@/lib/paytr.server");
    const product = getProduct(params.sku);
    const reviews = product ? await listProductReviews({ data: { sku: product.sku } }) : [];
    return { rates: await publicInstallments(), reviews };
  },
  head: ({ params }) => {
    const p = getProduct(params.sku);
    if (!p) return pageHead({ title: "Ürün", path: `/urun/${params.sku}` });
    const conc = concentrationOf(p.concentration);
    return pageHead({
      title: [p.brand, p.name, conc?.short].filter(Boolean).join(" "),
      description: `${p.tagline} ${p.description}`,
      path: `/urun/${productSlug(p)}`,
      image: p.image,
      noindex: p.sample,
    });
  },
  component: ProductPage,
});

function ProductPage() {
  const { rates, reviews } = Route.useLoaderData();
  const { sku } = Route.useParams();
  const { renk } = Route.useSearch();
  const navigate = Route.useNavigate();
  const product = getProduct(sku);
  if (!product) throw notFound();

  const sizes = productSizes(product);
  const [color, setColor] = useState<ColorId>(
    renk && sizes.some((s) => s.id === renk) ? renk : defaultSizeId(product),
  );
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const pushRecent = usePrefs((s) => s.pushRecent);
  const rememberColor = usePrefs((s) => s.rememberColor);
  const size = sizes.find((s) => s.id === color) ?? sizes[0];
  const price = size.price;
  const conc = concentrationOf(product.concentration);
  const related = relatedProducts(product.sku, 8);
  const slides = gallerySlides(product);
  const cat = CATEGORIES.find((c) => c.id === product.category);
  const { prev: prevP, next: nextP } = neighborsInCategory(product.sku);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    ...(product.gtin ? { gtin13: product.gtin } : {}),
    image: slides.filter((s) => s.kind === "image").map((s) => new URL(s.src, SITE_ORIGIN).href),
    url: `${SITE_ORIGIN}/urun/${productSlug(product)}`,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand ?? BRAND.name },
    ...(product.gender ? { audience: { "@type": "PeopleAudience", suggestedGender: product.gender === "kadin" ? "female" : product.gender === "erkek" ? "male" : "unisex" } } : {}),
    offers: sizes.map((s) => ({
      "@type": "Offer",
      name: `${s.ml} ml`,
      sku: `${product.sku}-${s.id}`,
      price: s.price,
      priceCurrency: "TRY",
      availability:
        s.stockStatus === "tukendi" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: `${SITE_ORIGIN}/urun/${productSlug(product)}?renk=${s.id}`,
    })),
    ...reviewSchema(reviews),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ürünler",
        item: `${SITE_ORIGIN}/koleksiyon`,
      },
      ...(cat
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: cat.name,
              item: `${SITE_ORIGIN}/kategori/${cat.id}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: cat ? 3 : 2,
        name: product.name,
        item: `${SITE_ORIGIN}/urun/${productSlug(product)}`,
      },
    ],
  };

  useEffect(() => {
    pushRecent(product.sku);
  }, [product.sku, pushRecent]);

  useEffect(() => {
    if (renk) setColor(renk);
  }, [renk]);

  const buyRef = useRef<HTMLDivElement>(null);
  const [showDock, setShowDock] = useState(false);
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setShowDock(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [product.sku]);

  function chooseColor(id: ColorId) {
    setColor(id);
    rememberColor(id);
    void navigate({
      search: { renk: id },
      replace: true,
    });
  }

  function addToCart() {
    if (!product || size.stockStatus === "tukendi") return;
    rememberColor(color);
    add(product.sku, color, qty);
    toastAdded(`${product.name} · ${size.ml} ml`);
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 pb-[calc(7rem+var(--cookie-h,0px))] lg:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ListBack />

      <div className="mt-4 grid items-start gap-10 lg:grid-cols-2">
        <ProductGallery slides={slides} title={product.name} />
        <div className="flex flex-col gap-4 lg:gap-6">
        <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:z-10 lg:gap-6 lg:self-start">
          <div className="flex items-start justify-between gap-3">
            <div>
              <button
                type="button"
                className="font-mono text-xs tracking-wide text-fg-muted hover:text-taba"
                onClick={() => {
                  void navigator.clipboard?.writeText(product.sku);
                  toast.success(`${product.sku} kopyalandı`);
                }}
              >
                {product.sku}
              </button>
              {product.brand ? (
                <Link
                  to="/marka/$slug"
                  params={{ slug: slugify(product.brand) }}
                  className="mt-2 block font-mono text-xs tracking-widest text-fg-muted uppercase hover:text-taba"
                >
                  {product.brand}
                </Link>
              ) : null}
              <h1 className="mt-1 font-display text-4xl leading-none sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs text-fg-muted">
                {conc ? <span>{conc.name}</span> : null}
                <SampleBadge product={product} />
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <WishButton sku={product.sku} />
              <ShareButton
                title={product.name}
                url={`${SITE_ORIGIN}/urun/${productSlug(product)}${color ? `?renk=${color}` : ""}`}
                text={product.tagline}
              />
            </div>
          </div>
          <div>
            <p className="font-mono text-2xl">
              {size.compareAt && size.compareAt > price ? (
                <s className="mr-2 text-fg-muted">{formatPrice(size.compareAt)}</s>
              ) : null}
              {formatPrice(price)}
            </p>
            <p className="mt-1 font-mono text-xs text-fg-muted">
              KDV dahil{size.ml ? ` · ${size.ml} ml · ${formatPrice(Math.round((price / size.ml) * 100) / 100)}/ml` : ""}
            </p>
          </div>

          <SizePicker product={product} value={color} onChange={chooseColor} />
          <InstallmentTable price={price} rates={rates} />

          {size.stockStatus === "tukendi" && size.ml > 0 ? (
            <div ref={buyRef}>
              <RestockForm sku={product.sku} ml={size.ml} id="restock-email" />
            </div>
          ) : (
            <div ref={buyRef} className="flex flex-wrap items-center gap-3">
              <QtyControl value={qty} onChange={setQty} />
              <Button size="lg" className="min-w-40 flex-1" onClick={addToCart}>
                Sepete ekle
              </Button>
            </div>
          )}
        </div>
          <ul className="grid gap-2">
            {related.slice(0, 3).map((item) => (
              <li key={item.sku}>
                <Link
                  to="/urun/$sku"
                  params={{ sku: productSlug(item) }}
                  className="flex items-center gap-3 rounded-xl bg-bg-wash p-2"
                >
                  <CatalogImg src={item.image} alt="" sizes="80px" className="size-16 shrink-0 object-contain" />
                  <span className="min-w-0">
                    <span className="block truncate font-display text-lg leading-tight">{item.name}</span>
                    <span className="font-mono text-xs">{formatPrice(minPrice(item))}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {product.families?.length ? (
        <ul className="mt-10 flex flex-wrap gap-2">
          {product.families.map((id) => {
            const shot = PRODUCTS.find((p) => p.sku !== product.sku && p.families?.includes(id));
            return (
              <li key={id} className="w-[calc(50%-0.25rem)] sm:w-52">
                <Link
                  to="/koleksiyon"
                  search={{ aile: id }}
                  className="how-step block overflow-hidden rounded-xl bg-bg-wash"
                >
                  {shot ? (
                    <CatalogImg src={shot.image} alt="" className="aspect-[4/3] w-full object-contain p-3" />
                  ) : null}
                  <span className="block px-3 pb-3 font-display text-lg leading-tight">{familyName(id)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="mt-10 grid items-start gap-4 lg:grid-cols-3">
        <NotePyramid product={product} />
        <PerfumeFacts product={product} />
        <CosmeticInfo product={product} />
      </div>

      <nav className="mt-12 flex items-center justify-between gap-4 border-t border-solid border-border pt-6 text-sm">
        {prevP ? (
          <Link
            to="/urun/$sku"
            params={{ sku: productSlug(prevP) }}
            className="text-fg-muted hover:text-taba"
          >
            ← {prevP.name}
          </Link>
        ) : (
          <span />
        )}
        {nextP ? (
          <Link
            to="/urun/$sku"
            params={{ sku: productSlug(nextP) }}
            className="text-right text-fg-muted hover:text-taba"
          >
            {nextP.name} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <ProductReviews sku={product.sku} reviews={reviews} />

      <PairRail sku={product.sku} color={color} />

      {related.length > 3 ? (
        <section className="mt-20">
          <h2 className="font-display text-3xl">Benzer kokular</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.slice(3).map((p) => (
              <ProductCard key={p.sku} product={p} color={color} />
            ))}
          </div>
        </section>
      ) : null}

      <RecentRail exclude={product.sku} color={color} />

      <div
        className={cn(
          "fixed inset-x-0 z-40 border-t border-solid border-border bg-bg/95 p-3 print:hidden lg:hidden",
          !showDock && "hidden",
        )}
        style={{ bottom: "var(--cookie-h, 0px)" }}
        data-print-hide
      >
        <div className="mx-auto flex max-w-[1400px] items-center gap-3">
          {size.stockStatus === "tukendi" && size.ml > 0 ? (
            <RestockForm sku={product.sku} ml={size.ml} id="restock-email-m" />
          ) : (
            <>
              <QtyControl value={qty} onChange={setQty} />
              <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
                <Button
                  className="h-auto min-h-12 px-2 py-2 leading-tight"
                  size="lg"
                  onClick={addToCart}
                >
                  Sepete ekle · {formatPrice(price * qty)}
                </Button>
                <Button
                  className="h-auto min-h-12 px-2 py-2 leading-tight"
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    addToCart();
                    void navigate({ to: "/odeme" });
                  }}
                >
                  Öde
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
