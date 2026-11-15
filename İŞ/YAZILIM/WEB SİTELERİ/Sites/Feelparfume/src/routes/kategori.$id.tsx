import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { CATEGORIES, productSlug, productsByCategory, resolveCategory, type CategoryId } from "@/lib/products";
import {
  PRICE_BANDS,
  WIDTH_BANDS,
  isPriceBand,
  isWidthBand,
  type PriceBandId,
  type WidthBandId,
} from "@/lib/catalog-filters";
import { filterCatalog } from "@/lib/shop";
import { MoreList, listWindow, parseListWindow } from "@/components/more-list";
import { FilterChips } from "@/components/filter-chips";
import { rememberList } from "@/lib/last-list";
import { pageHead, SITE_ORIGIN } from "@/lib/seo";
import { ProductCard } from "@/components/product-card";
import { CatalogImg } from "@/components/catalog-img";
import { RecentRail } from "@/components/recent-rail";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";
import { trapTab } from "@/lib/focus";
import { SlidersHorizontal, X } from "lucide-react";

type SortId = "kod" | "ad" | "fiyat-asc" | "fiyat-desc";
type Search = { sirala?: SortId; fiyat?: PriceBandId; en?: WidthBandId; goster?: number };

export const Route = createFileRoute("/kategori/$id")({
  beforeLoad: ({ params }) => {
    const resolved = resolveCategory(params.id);
    if (resolved && resolved !== params.id) {
      throw redirect({ to: "/kategori/$id", params: { id: resolved } });
    }
  },
  validateSearch: (raw: Record<string, unknown>): Search => ({
    sirala: ["kod", "ad", "fiyat-asc", "fiyat-desc"].includes(String(raw.sirala))
      ? (raw.sirala as SortId)
      : undefined,
    fiyat: isPriceBand(String(raw.fiyat)) ? (raw.fiyat as PriceBandId) : undefined,
    en: isWidthBand(String(raw.en)) ? (raw.en as WidthBandId) : undefined,
    goster: parseListWindow(raw.goster),
  }),
  head: ({ params }) => {
    const catId = resolveCategory(params.id);
    const cat = CATEGORIES.find((c) => c.id === catId);
    return pageHead({
      title: cat?.name ?? "Kategori",
      description: cat?.blurb,
      path: `/kategori/${catId ?? params.id}`,
    });
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { id } = Route.useParams();
  const { sirala, fiyat, en, goster } = Route.useSearch();
  const navigate = Route.useNavigate();
  const catId = resolveCategory(id);
  const cat = CATEGORIES.find((c) => c.id === catId);
  const sort: SortId = sirala ?? "kod";
  const shown = listWindow(goster);
  const [sheet, setSheet] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const items = useMemo(() => {
    if (!cat) return [];
    return filterCatalog({ kategori: cat.id, fiyat, en, sort });
  }, [cat, sort, fiyat, en]);
  const filterKey = `${catId}|${sort}|${fiyat}|${en}`;
  const prevFilter = useRef(filterKey);
  useEffect(() => {
    if (prevFilter.current === filterKey) return;
    prevFilter.current = filterKey;
    if (goster != null) {
      void navigate({ search: (s) => ({ ...s, goster: undefined }), replace: true });
    }
  }, [filterKey, goster, navigate]);
  useEffect(() => {
    if (!cat) return;
    rememberList(window.location.pathname + window.location.search, cat.name);
  }, [cat, sirala, fiyat, en, goster]);

  useEffect(() => {
    if (!sheet) return;
    const prev = document.body.style.overflow;
    const trigger = filterBtnRef.current;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      sheetRef.current?.querySelector<HTMLElement>("button, select")?.focus();
    }, 20);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setSheet(false);
        return;
      }
      if (e.key === "Tab" && sheetRef.current) trapTab(e, sheetRef.current);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [sheet]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!cat) throw notFound();

  const chips: { key: string; label: string; onClear: () => void }[] = [];
  if (fiyat) {
    chips.push({
      key: "fiyat",
      label: PRICE_BANDS.find((b) => b.id === fiyat)?.label ?? fiyat,
      onClear: () => void navigate({ search: (s) => ({ ...s, fiyat: undefined }), replace: true }),
    });
  }
  if (sirala) {
    chips.push({
      key: "sirala",
      label: sirala === "ad" ? "Ad" : sirala === "fiyat-asc" ? "Fiyat ↑" : "Fiyat ↓",
      onClear: () => void navigate({ search: (s) => ({ ...s, sirala: undefined }), replace: true }),
    });
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 pb-[calc(6rem+var(--cookie-h,0px))] lg:pb-10">
      {items.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: cat.name,
              numberOfItems: items.length,
              itemListElement: items.slice(0, 24).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${SITE_ORIGIN}/urun/${productSlug(p)}`,
                name: p.name,
              })),
            }),
          }}
        />
      ) : null}
      <h1 className="font-display text-5xl sm:text-6xl">{cat.name}</h1>
      <ul className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(7.5rem,1fr))] gap-2">
        {productsByCategory(cat.id).map((p) => (
          <li key={p.sku}>
            <Link to="/urun/$sku" params={{ sku: productSlug(p) }} className="block overflow-hidden rounded-xl bg-bg-wash">
              <CatalogImg src={p.image} alt={p.name} sizes="12vw" className="aspect-square w-full object-contain p-1" />
            </Link>
          </li>
        ))}
      </ul>

      <div
        className="fixed inset-x-0 z-40 border-t border-border bg-bg p-3 lg:hidden"
        style={{ bottom: "var(--cookie-h, 0px)" }}
      >
        <Button
          ref={filterBtnRef}
          className="w-full"
          onClick={() => setSheet(true)}
        >
          <SlidersHorizontal className="size-4" />
          Filtre
          {items.length ? ` · ${items.length}` : ""}
        </Button>
      </div>
      <div>
      <div
        ref={sheet ? sheetRef : undefined}
        role={sheet ? "dialog" : undefined}
        aria-modal={sheet ? true : undefined}
        aria-label={sheet ? "Filtre" : undefined}
        className={cn(
          "flex-col gap-4",
          sheet
            ? "fixed inset-0 z-50 flex overflow-y-auto bg-bg px-4 pt-4 pb-28 print:hidden"
            : "sticky top-24 z-10 mt-8 hidden bg-bg/95 py-3 lg:flex",
        )}
      >
        {sheet ? (
          <div className="flex items-center justify-between">
            <p className="font-display text-2xl">Filtre</p>
            <button
              type="button"
              className="flex size-11 items-center justify-center"
              aria-label="Kapat"
              onClick={() => setSheet(false)}
            >
              <X className="size-5" />
            </button>
          </div>
        ) : null}
        <div>
          <p className="mb-2 font-mono text-xs text-fg-muted">Fiyat</p>
          <div className="flex flex-wrap gap-2">
            {PRICE_BANDS.map((band) => (
              <button
                key={band.id}
                type="button"
                onClick={() =>
                  void navigate({
                    search: (s) => ({ ...s, fiyat: s.fiyat === band.id ? undefined : band.id }),
                    replace: true,
                  })
                }
                className={cn(
                  "h-11 rounded-full border px-3 text-sm",
                  fiyat === band.id
                    ? "border-fg bg-fg text-bg-elevated"
                    : "border-border-strong text-fg-muted",
                )}
              >
                {band.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-mono text-xs text-fg-muted">Sırala</p>
          <div className="flex flex-wrap gap-1" role="group" aria-label="Sırala">
            {(
              [
                ["kod", "Kod"],
                ["ad", "Ad"],
                ["fiyat-asc", "Fiyat ↑"],
                ["fiyat-desc", "Fiyat ↓"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={sort === id}
                onClick={() =>
                  void navigate({
                    search: (s) => ({ ...s, sirala: id === "kod" ? undefined : id }),
                    replace: true,
                  })
                }
                className={cn(
                  "h-11 rounded-full border px-3 font-mono text-xs",
                  sort === id
                    ? "border-fg bg-fg text-bg-elevated"
                    : "border-border-strong text-fg-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {sheet ? (
          <div className="sticky bottom-0 -mx-4 mt-auto border-t border-solid border-border bg-bg p-3 lg:hidden">
            <Button className="w-full" onClick={() => setSheet(false)}>
              {items.length} ürünü göster
            </Button>
          </div>
        ) : null}
      </div>
      <div className="mt-4">
        <FilterChips
          chips={chips}
          onClearAll={() => void navigate({ search: {}, replace: true })}
        />
      </div>
      <p className="mt-6 font-mono text-sm text-fg-muted">{items.length} ürün</p>
      {items.length === 0 ? (
        <div className="mt-6 border border-solid border-border bg-bg-elevated px-6 py-16 text-center">
          <p className="font-display text-3xl">Bu kategoride ürün yok</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button variant="outline" onClick={() => void navigate({ search: {}, replace: true })}>
              Filtreleri temizle
            </Button>
            <Link to="/koleksiyon">
              <Button>Tüm ürünler</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.slice(0, shown).map((p, i) => (
            <ProductCard key={p.sku} product={p} priority={i < 4} />
          ))}
        </div>
      )}
      {items.length > 0 ? (
        <MoreList
          shown={Math.min(shown, items.length)}
          total={items.length}
          onMore={() =>
            void navigate({
              search: (s) => ({ ...s, goster: items.length }),
              replace: true,
              resetScroll: false,
            })
          }
        />
      ) : null}
      </div>
      <RecentRail className="mt-16" />

      {CATEGORIES.length > 1 ? (
        <div className="mt-16">
          <h2 className="font-display text-3xl">Diğer kategoriler</h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {CATEGORIES.filter((c) => c.id !== cat.id).map((c) => {
              const shot = productsByCategory(c.id)[0];
              return (
                <li key={c.id}>
                  <Link
                    to="/kategori/$id"
                    params={{ id: c.id }}
                    className="how-step block overflow-hidden rounded-xl bg-bg-wash"
                  >
                    {shot ? (
                      <CatalogImg src={shot.image} alt="" className="aspect-square w-full object-contain p-4" />
                    ) : null}
                    <span className="block px-4 pb-4 font-display text-2xl">{c.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
