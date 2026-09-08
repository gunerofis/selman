import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Maximize2, X } from "lucide-react";
import {
  CATEGORIES,
  COLORS,
  PASTEL,
  getColor,
  getProduct,
  getSeries,
  neighborsInCategory,
  productSlug,
  productsBySeries,
  relatedProducts,
  specGrams,
  type ColorId,
} from "@/lib/products";
import { pageHead, SITE_ORIGIN } from "@/lib/seo";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { RecentRail } from "@/components/recent-rail";
import { ColorSwatches } from "@/components/color-swatch";
import { QtyControl } from "@/components/qty-control";
import { WishButton } from "@/components/wish-button";
import { ShareButton } from "@/components/share-button";
import { PairRail } from "@/components/pair-rail";
import { BuyAssurance } from "@/components/buy-assurance";
import { CraftFold } from "@/components/craft-fold";
import { PrintButton } from "@/components/print-button";
import { DimDiagram, PlaceLine, ScaleHint } from "@/components/fit-context";
import { FaqList } from "@/components/faq-list";
import { FAQ_PDP } from "@/lib/faq";
import { Button } from "@/components/ui/button";
import { CatalogImg } from "@/components/catalog-img";
import { toast } from "sonner";
import { toastAdded } from "@/lib/cart-toast";
import { ListBack } from "@/components/list-back";
import { trapTab } from "@/lib/focus";

type Search = { renk?: ColorId };

export const Route = createFileRoute("/urun/$sku")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    renk: COLORS.some((c) => c.id === raw.renk) ? (raw.renk as ColorId) : undefined,
  }),
  beforeLoad: ({ params, search }) => {
    const p = getProduct(params.sku);
    if (!p) return;
    const slug = productSlug(p);
    if (params.sku !== slug) {
      throw redirect({
        to: "/urun/$sku",
        params: { sku: slug },
        search,
      });
    }
  },
  head: ({ params }) => {
    const p = getProduct(params.sku);
    if (!p) return pageHead({ title: "Ürün", path: `/urun/${params.sku}` });
    return pageHead({
      title: p.name,
      description: `${p.tagline} ${p.sku}. 8 deri renk, örnek fotoğraf.`,
      path: `/urun/${productSlug(p)}`,
      image: p.image,
    });
  },
  component: ProductPage,
});

function ProductPage() {
  const { sku } = Route.useParams();
  const { renk } = Route.useSearch();
  const navigate = Route.useNavigate();
  const product = getProduct(sku);
  if (!product) throw notFound();

  const [color, setColor] = useState<ColorId>(renk ?? "espresso");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [hoverScale, setHoverScale] = useState(1);
  const add = useCart((s) => s.add);
  const addMany = useCart((s) => s.addMany);
  const pushRecent = usePrefs((s) => s.pushRecent);
  const rememberColor = usePrefs((s) => s.rememberColor);
  const colorMeta = getColor(color);
  const related = relatedProducts(product.sku);
  const series = getSeries(product.series);
  const cat = CATEGORIES.find((c) => c.id === product.category);
  const { prev: prevP, next: nextP } = neighborsInCategory(product.sku);
  const weight = specGrams(product);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    image: new URL(product.image, SITE_ORIGIN).href,
    url: `${SITE_ORIGIN}/urun/${productSlug(product)}`,
    description: product.description,
    brand: { "@type": "Brand", name: "Sweb" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
      url: `${SITE_ORIGIN}/urun/${productSlug(product)}`,
    },
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

  function chooseColor(id: ColorId) {
    setColor(id);
    rememberColor(id);
    void navigate({
      search: { renk: id },
      replace: true,
    });
  }

  function addToCart() {
    if (!product) return;
    rememberColor(color);
    add(product.sku, color, qty);
    toastAdded(product.name);
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 pb-[calc(7rem+var(--cookie-h,0px))] lg:pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ListBack />
      <p className="font-mono text-[11px] text-fg-muted">
        <Link to="/koleksiyon" className="hover:text-fg">
          Ürünler
        </Link>
        {cat ? (
          <>
            <span className="px-2">/</span>
            <Link to="/kategori/$id" params={{ id: cat.id }} className="hover:text-fg">
              {cat.name}
            </Link>
          </>
        ) : null}
        {series ? (
          <>
            <span className="px-2">/</span>
            <Link
              to="/koleksiyon"
              search={{ kategori: "ofis", seri: series.id }}
              className="hover:text-fg"
            >
              {series.name}
            </Link>
          </>
        ) : null}
        <span className="px-2">/</span>
        <span>{product.name}</span>
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <button
            type="button"
            className="group relative w-full overflow-hidden border border-dashed border-border text-left outline-none wash-shift transition-colors hover:border-taba focus-visible:ring-2 focus-visible:ring-taba focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            style={{ backgroundColor: PASTEL[color] }}
            onClick={() => setZoom(true)}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - r.left) / r.width) * 100;
              const y = ((e.clientY - r.top) / r.height) * 100;
              setOrigin(`${x}% ${y}%`);
              setHoverScale(1.14);
            }}
            onMouseLeave={() => {
              setOrigin("50% 50%");
              setHoverScale(1);
            }}
            aria-label="Görseli büyüt"
          >
            <CatalogImg
              src={product.image}
              alt={`${product.name} — örnek fotoğraf, ${colorMeta?.name ?? "deri"} zemin`}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="aspect-square w-full object-contain p-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `scale(${hoverScale})`, transformOrigin: origin }}
            />
            <span className="absolute right-3 bottom-3 flex items-center gap-2 border border-border bg-bg/90 px-3 py-2 font-mono text-[11px] shadow-sm backdrop-blur-sm transition-colors group-hover:border-taba group-hover:bg-bg">
              <Maximize2 className="size-3.5" aria-hidden="true" />
              Görseli incele
            </span>
          </button>
          <p className="mt-2 font-mono text-[11px] text-fg-muted">
            8 renk, örnek fotoğraf. Seçilen renk zemini boyar, deriyi değil.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <button
                type="button"
                className="font-mono text-[11px] tracking-wide text-fg-muted hover:text-taba"
                onClick={() => {
                  void navigator.clipboard?.writeText(product.sku);
                  toast.success(`${product.sku} kopyalandı`);
                }}
              >
                {product.sku} · kopyala
              </button>
              <h1 className="mt-2 font-display text-4xl leading-none sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-3 text-base text-fg-muted">{product.tagline}</p>
              <div className="mt-2">
                <PlaceLine category={product.category} />
              </div>
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
            <p className="font-mono text-2xl">{formatPrice(product.price)}</p>
            <p className="mt-1 font-mono text-[11px] text-fg-muted">KDV dahil · 8 deri renk</p>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm">Renk</p>
              <p className="font-mono text-sm text-fg-muted">{colorMeta?.name}</p>
            </div>
            <ColorSwatches value={color} onChange={chooseColor} named />
          </div>

          <div className="hidden flex-wrap items-center gap-3 lg:flex">
            <QtyControl value={qty} onChange={setQty} />
            <Button size="lg" className="min-w-40 flex-1" onClick={addToCart}>
              Sepete ekle
            </Button>
          </div>
          <div className="hidden lg:block">
            <BuyAssurance price={product.price} />
          </div>

          {series ? (
            <div className="border border-dashed border-border bg-bg-elevated p-4">
              <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">
                {series.name} kiti
              </p>
              <p className="mt-1 text-sm text-fg-muted">{series.blurb}</p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={() => {
                  const skus = productsBySeries(series.id).map((p) => p.sku);
                  addMany(skus, color);
                  toast.success(`${skus.length} parça sepete eklendi`);
                }}
              >
                Seriyi sepete ekle
              </Button>
            </div>
          ) : null}

          <p className="max-w-prose text-sm leading-relaxed text-fg-muted">{product.description}</p>

          <p className="text-sm text-fg-muted">
            50 adet ve üzeri siparişte fiyat ve teslim planı ayrı çıkarılır.{" "}
            <Link
              to="/teklif"
              search={{ sku: product.sku, renk: color }}
              className="text-taba hover:underline"
            >
              Bu ürün için teklif iste
            </Link>
            .
          </p>

          <ul className="grid gap-2 text-sm">
            {product.features.map((f) => (
              <li key={f} className="flex gap-2 text-fg">
                <span className="mt-2 size-1.5 shrink-0 bg-taba" />
                {f}
              </li>
            ))}
          </ul>

          <CraftFold />

          <div className="border border-dashed border-border bg-bg-elevated p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-[11px] text-fg-muted">Ölçü fişi</p>
              <PrintButton label="Yazdır" />
            </div>
            <table className="w-full text-sm">
              <tbody>
                {product.specs.map((s) => (
                  <tr key={s.label} className="border-b border-dashed border-border last:border-0">
                    <td className="py-2 text-fg-muted">{s.label}</td>
                    <td className="py-2 text-right font-mono text-[13px]">
                      {s.label === "Ağırlık" ? weight : s.value}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-dashed border-border last:border-0">
                  <td className="py-2 text-fg-muted">Teslim</td>
                  <td className="py-2 text-right font-mono text-[13px]">3–5 iş günü</td>
                </tr>
              </tbody>
            </table>
            <DimDiagram product={product} />
            <ScaleHint product={product} color={color} />
          </div>

          <FaqList items={FAQ_PDP} heading="Siparişten önce" />

          <div className="grid gap-3 border-t border-dashed border-border pt-6 text-sm lg:hidden">
            <BuyAssurance price={product.price} />
          </div>
        </div>
      </div>

      <nav className="mt-12 flex items-center justify-between gap-4 border-t border-dashed border-border pt-6 text-sm">
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

      <PairRail sku={product.sku} color={color} />

      <section className="mt-20">
        <h2 className="font-display text-3xl">{series ? "Bu seride" : "Yanına"}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.sku} product={p} color={color} />
          ))}
        </div>
      </section>

      <RecentRail exclude={product.sku} color={color} />

      <div
        className="fixed inset-x-0 z-40 border-t border-dashed border-border bg-bg/95 p-3 print:hidden lg:hidden"
        style={{ bottom: "var(--cookie-h, 0px)" }}
        data-print-hide
      >
        <div className="mx-auto flex max-w-[1400px] items-center gap-3">
          <QtyControl value={qty} onChange={setQty} />
          <Button className="flex-1" size="lg" onClick={addToCart}>
            Sepete ekle · {formatPrice(product.price * qty)}
          </Button>
        </div>
      </div>

      {zoom ? (
        <ZoomLightbox src={product.image} alt={product.name} onClose={() => setZoom(false)} />
      ) : null}
    </div>
  );
}

function ZoomLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState("50% 50%");
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 20);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) trapTab(e, panelRef.current);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lastFocus.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/90 p-4 print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} görsel galerisi`}
      data-print-hide
    >
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Galeriyi kapat"
        onClick={onClose}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-4 text-bg sm:p-6">
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-bg/65 uppercase">
            Ürün görünümü
          </p>
          <p className="mt-1 font-display text-xl">{alt}</p>
        </div>
        <button
          ref={closeRef}
          type="button"
          className="pointer-events-auto flex size-11 shrink-0 items-center justify-center border border-bg/30 bg-bg-deep/50 transition-colors hover:border-bg hover:bg-bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg"
          aria-label="Galeriyi kapat"
          onClick={onClose}
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      <img
        src={src}
        alt={alt}
        className="relative z-10 max-h-[calc(100%-7rem)] max-w-full cursor-zoom-in object-contain transition-transform duration-200"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: origin,
          cursor: scale > 1 ? "zoom-out" : "zoom-in",
        }}
        onClick={(e) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setOrigin(`${x}% ${y}%`);
          setScale((s) => (s === 1 ? 2.4 : 1));
        }}
      />
      <p className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap border border-bg/20 bg-bg-deep/55 px-3 py-2 font-mono text-[10px] text-bg/75 backdrop-blur-sm">
        Yakınlaştırmak için görsele dokunun · ESC ile kapatın
      </p>
    </div>
  );
}
