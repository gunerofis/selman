import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import {
  CATEGORIES,
  productSlug,
  resolveCategory,
  type CategoryId,
} from "@/lib/products";
import { PRICE_BANDS, WIDTH_BANDS, isPriceBand, isWidthBand, type PriceBandId, type WidthBandId } from "@/lib/catalog-filters";
import { filterCatalog } from "@/lib/shop";
import { LIST_STEP, MoreList, listWindow, parseListWindow } from "@/components/more-list";
import { FilterChips } from "@/components/filter-chips";
import { rememberList } from "@/lib/last-list";
import { pageHead, SITE_ORIGIN } from "@/lib/seo";
import { ProductCard } from "@/components/product-card";
import { RecentRail } from "@/components/recent-rail";
import { SeriesCards } from "@/components/series-cards";
import { RoomTile } from "@/components/room-tile";
import { ShareButton } from "@/components/share-button";
import { cn } from "@/lib/utils";
import { roomLook } from "@/lib/room-looks";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trapTab } from "@/lib/focus";
import { SlidersHorizontal, X } from "lucide-react";

const WASH = [
  "bg-p-krem",
  "bg-p-taba",
  "bg-bg-wash",
  "bg-p-siyah",
  "bg-p-bordo",
  "bg-p-krem",
  "bg-p-taba",
  "bg-bg-wash",
];

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
    rememberList(window.location.pathname + window.location.search, `${cat.name} odası`);
  }, [cat, sirala, fiyat, en, goster]);

  useEffect(() => {
    if (!sheet) return;
    const prev = document.body.style.overflow;
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
      filterBtnRef.current?.focus();
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
      onClear: () =>
        void navigate({ search: (s) => ({ ...s, fiyat: undefined }), replace: true }),
    });
  }
  if (en) {
    chips.push({
      key: "en",
      label: WIDTH_BANDS.find((b) => b.id === en)?.label ?? en,
      onClear: () =>
        void navigate({ search: (s) => ({ ...s, en: undefined }), replace: true }),
    });
  }
  if (sirala) {
    chips.push({
      key: "sirala",
      label: sirala === "ad" ? "Ad" : sirala === "fiyat-asc" ? "Fiyat ↑" : "Fiyat ↓",
      onClear: () =>
        void navigate({ search: (s) => ({ ...s, sirala: undefined }), replace: true }),
    });
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
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
      <p className="font-mono text-[11px] text-fg-muted">
        <Link to="/kategori" className="hover:text-fg">
          Odalar
        </Link>
        <span className="px-2">/</span>
        <span>{cat.name}</span>
      </p>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">{cat.name}</h1>
      <p className="mt-3 max-w-xl text-sm text-fg-muted">
        {cat.blurb} {items.length} parça, sekiz deri renk. Fotoğraflar örnek; renk zemini boyar.
      </p>

      <RoomLookBlock id={cat.id} name={cat.name} />

      {cat.id === "ofis" ? (
        <div className="mt-10">
          <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Masa setleri</p>
          <div className="mt-4">
            <SeriesCards />
          </div>
        </div>
      ) : null}

      <div className="mt-10 lg:hidden">
        <Button
          ref={filterBtnRef}
          variant="outline"
          className="w-full"
          onClick={() => setSheet(true)}
        >
          <SlidersHorizontal className="size-4" />
          Filtrele ve sırala
          {items.length ? ` · ${items.length}` : ""}
        </Button>
      </div>
      <div
        ref={sheet ? sheetRef : undefined}
        role={sheet ? "dialog" : undefined}
        aria-modal={sheet ? true : undefined}
        aria-label={sheet ? "Filtre" : undefined}
        className={cn(
          "flex-col gap-4",
          sheet
            ? "fixed inset-0 z-50 flex overflow-y-auto bg-bg px-4 pt-4 pb-28 print:hidden"
            : "mt-10 hidden lg:flex",
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
                  "h-11 border px-3 text-sm",
                  fiyat === band.id ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg-muted",
                )}
              >
                {band.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-mono text-xs text-fg-muted">En (dış ölçü)</p>
          <div className="flex flex-wrap gap-2">
            {WIDTH_BANDS.map((band) => (
              <button
                key={band.id}
                type="button"
                onClick={() =>
                  void navigate({
                    search: (s) => ({ ...s, en: s.en === band.id ? undefined : band.id }),
                    replace: true,
                  })
                }
                className={cn(
                  "h-11 border px-3 text-sm",
                  en === band.id ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg-muted",
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
                  "h-9 border px-3 font-mono text-xs",
                  sort === id ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {sheet ? (
          <div className="sticky bottom-0 -mx-4 mt-auto border-t border-dashed border-border bg-bg p-3 lg:hidden">
            <Button className="w-full" onClick={() => setSheet(false)}>
              {items.length} parçayı göster
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
      <p className="mt-6 font-mono text-sm text-fg-muted">{items.length} parça</p>
      {items.length === 0 ? (
        <div className="mt-6 border border-dashed border-border bg-bg-elevated px-6 py-16 text-center">
          <p className="font-display text-3xl">Bu odada eşleşme yok</p>
          <p className="mt-3 text-sm text-fg-muted">Fiyat veya en filtresini silin.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => void navigate({ search: {}, replace: true })}
            >
              Filtreleri temizle
            </Button>
            <Link to="/tasarla">
              <Button>Tasarlayın</Button>
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
              search: (s) => ({ ...s, goster: shown + LIST_STEP }),
              replace: true,
              resetScroll: false,
            })
          }
        />
      ) : null}
      <RecentRail className="mt-16" />

      <div className="mt-16">
        <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Diğer odalar</p>
        <ul className="mt-4 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.filter((c) => c.id !== cat.id).map((c, i) => (
            <li key={c.id}>
              <RoomTile
                id={c.id}
                name={c.name}
                wash={WASH[i % WASH.length]}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RoomLookBlock({ id, name }: { id: CategoryId; name: string }) {
  const { products, note } = roomLook(id);
  const addMany = useCart((s) => s.addMany);
  const lastColor = usePrefs((s) => s.lastColor);
  if (products.length < 1) return null;
  return (
    <div className="mt-8 border border-dashed border-border bg-bg-elevated p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Sahne</p>
          <h2 className="mt-1 font-display text-2xl">Bu odada birlikte</h2>
          <p className="mt-1 text-sm text-fg-muted">{note}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              addMany(
                products.map((p) => p.sku),
                lastColor,
              );
              toast.success(`${name} look'u sepete eklendi`);
            }}
          >
            Look'u sepete
          </Button>
          <ShareButton title={`${name} — Sweb`} url={`${SITE_ORIGIN}/kategori/${id}`} text={note} />
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {products.map((p) => (
          <li key={p.sku}>
            <Link
              to="/urun/$sku"
              params={{ sku: productSlug(p) }}
              className="block border border-dashed border-border bg-bg-wash"
            >
              <img src={p.image} alt={p.name} className="aspect-square w-full object-contain p-2" />
              <p className="truncate px-2 pb-2 font-display text-sm">{p.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
