import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, COLORS, PRODUCTS, SERIES, featuredProducts, foldTr, getSeries, productSlug, type CategoryId, type ColorId, type SeriesId } from "@/lib/products";
import { closestTerm } from "@/lib/fuzzy";
import {
  PRICE_BANDS,
  WIDTH_BANDS,
  isPriceBand,
  isWidthBand,
  type PriceBandId,
  type WidthBandId,
} from "@/lib/catalog-filters";
import { pageHead, SITE_ORIGIN } from "@/lib/seo";
import { ProductCard } from "@/components/product-card";
import { RecentRail } from "@/components/recent-rail";
import { SeriesCard, SeriesCards } from "@/components/series-cards";
import { ColorSwatches } from "@/components/color-swatch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePrefs, type GridCols } from "@/lib/prefs";
import { filterCatalog, facetCount as countFacet } from "@/lib/shop";
import { LIST_STEP, MoreList, listWindow, parseListWindow } from "@/components/more-list";
import { FilterChips } from "@/components/filter-chips";
import { rememberList } from "@/lib/last-list";
import { LayoutGrid, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { JOB_CHIPS } from "@/lib/jobs";
import { trapTab } from "@/lib/focus";

type SortId = "onerilen" | "fiyat-asc" | "fiyat-desc" | "ad" | "en";

type Search = {
  kategori?: CategoryId;
  q?: string;
  sirala?: SortId;
  seri?: SeriesId;
  renk?: ColorId;
  fiyat?: PriceBandId;
  en?: WidthBandId;
  goster?: number;
};

export const Route = createFileRoute("/koleksiyon")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    kategori: CATEGORIES.some((c) => c.id === raw.kategori)
      ? (raw.kategori as CategoryId)
      : undefined,
    q: typeof raw.q === "string" ? raw.q : undefined,
    sirala: ["onerilen", "fiyat-asc", "fiyat-desc", "ad", "en"].includes(String(raw.sirala))
      ? (raw.sirala as SortId)
      : undefined,
    seri: SERIES.some((s) => s.id === raw.seri) ? (raw.seri as SeriesId) : undefined,
    renk: COLORS.some((c) => c.id === raw.renk) ? (raw.renk as ColorId) : undefined,
    fiyat: isPriceBand(String(raw.fiyat)) ? (raw.fiyat as PriceBandId) : undefined,
    en: isWidthBand(String(raw.en)) ? (raw.en as WidthBandId) : undefined,
    goster: parseListWindow(raw.goster),
  }),
  head: () =>
    pageHead({
      title: "Ürünler",
      description: "Bütün parçalar. İsim, stok kodu veya iş: şarj, baharat, gözlük.",
      path: "/koleksiyon",
    }),
  component: Shop,
});

function Shop() {
  const { kategori, q, sirala, seri, renk, fiyat, en, goster } = Route.useSearch();
  const navigate = Route.useNavigate();
  const rememberColor = usePrefs((s) => s.rememberColor);
  const gridCols = usePrefs((s) => s.gridCols);
  const setGridCols = usePrefs((s) => s.setGridCols);
  const [query, setQuery] = useState(q ?? "");
  const [sheet, setSheet] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const shown = listWindow(goster);
  const sort: SortId = sirala ?? "onerilen";
  const color = renk;

  useEffect(() => {
    setQuery(q ?? "");
  }, [q]);

  useEffect(() => {
    if (!sheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      const root = sheetRef.current;
      const first = root?.querySelector<HTMLElement>("button, select, input");
      first?.focus();
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

  const list = useMemo(
    () =>
      filterCatalog({
        q: query,
        kategori,
        seri,
        fiyat,
        en,
        sort,
      }),
    [kategori, query, sort, seri, fiyat, en],
  );

  const filterKey = `${kategori}|${query}|${sort}|${seri}|${fiyat}|${en}`;
  const prevFilter = useRef(filterKey);
  useEffect(() => {
    if (prevFilter.current === filterKey) return;
    prevFilter.current = filterKey;
    if (goster != null) {
      void navigate({ search: (s) => ({ ...s, goster: undefined }), replace: true });
    }
  }, [filterKey, goster, navigate]);

  const catName = CATEGORIES.find((c) => c.id === kategori)?.name;
  const seriesMeta = getSeries(seri);
  const colorId = color;

  useEffect(() => {
    const label = query.trim()
      ? `“${query.trim()}” sonuçları`
      : catName
        ? `${catName} listesi`
        : "Ürün listesi";
    rememberList(window.location.pathname + window.location.search, label);
  }, [catName, query, kategori, sirala, seri, renk, fiyat, en, goster]);

  function facetCount(opts: {
    q?: string;
    kategori?: CategoryId;
    seri?: SeriesId;
    fiyat?: PriceBandId;
    en?: WidthBandId;
  }) {
    return countFacet({ q: query, kategori, seri, fiyat, en }, opts);
  }

  function setColor(id: ColorId | undefined) {
    if (id) rememberColor(id);
    void navigate({
      search: (s) => ({ ...s, renk: id }),
      replace: true,
    });
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      {list.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              numberOfItems: list.length,
              itemListElement: list.slice(0, 24).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${SITE_ORIGIN}/urun/${productSlug(p)}`,
                name: p.name,
              })),
            }),
          }}
        />
      ) : null}
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">
        {query.trim() ? "Arama" : "Ürünler"}
      </p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">
        {query.trim()
          ? `“${query.trim()}”`
          : (seriesMeta?.name ?? catName ?? "Bütün parçalar")}
      </h1>
      <p className="mt-3 max-w-xl text-sm text-fg-muted">
        {seriesMeta
          ? `${seriesMeta.blurb} ${list.length} parça.`
          : `${PRODUCTS.length} parça. Odaya göre bakmak için Odalar’a geçin. Fotoğraflar örnek; seçilen renk zemini boyar.`}
      </p>

      <div className="mt-8 flex flex-col gap-3 border-b border-dashed border-border py-3">
        <Input
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            void navigate({
              search: (prev) => ({ ...prev, q: v || undefined }),
              replace: true,
            });
          }}
          placeholder="şarj, baharat, gözlük, dizüstü"
          aria-label="Koleksiyonda ara"
        />
        <div className="flex flex-wrap gap-2 lg:hidden">
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
                "h-9 border px-3 font-mono text-xs",
                fiyat === band.id ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg-muted",
              )}
            >
              {band.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {JOB_CHIPS.map((job) => (
            <button
              key={job}
              type="button"
              onClick={() => {
                setQuery(job);
                void navigate({ search: (s) => ({ ...s, q: job }), replace: true });
              }}
              className={cn(
                "h-9 border px-3 font-mono text-xs",
                query.trim().toLocaleLowerCase("tr") === job
                  ? "border-fg bg-fg text-bg-elevated"
                  : "border-border-strong text-fg-muted hover:border-fg",
              )}
            >
              {job}
            </button>
          ))}
        </div>
        <div className="lg:hidden">
          <Button
            ref={filterBtnRef}
            variant="outline"
            className="w-full"
            onClick={() => setSheet(true)}
          >
            <SlidersHorizontal className="size-4" />
            Filtrele ve sırala
            {list.length ? ` · ${list.length}` : ""}
          </Button>
        </div>
        <div
          ref={sheet ? sheetRef : undefined}
          role={sheet ? "dialog" : undefined}
          aria-modal={sheet ? true : undefined}
          aria-label={sheet ? "Filtre" : undefined}
          className={cn(
            "flex-col gap-3",
            sheet
              ? "fixed inset-0 z-50 flex overflow-y-auto bg-bg px-4 pt-4 pb-28 print:hidden"
              : "hidden lg:flex",
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
          <p className="mb-2 font-mono text-xs text-fg-muted">
            Oda{" "}
            <Link to="/kategori" className="text-taba hover:underline">
              odaların tümü
            </Link>
          </p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={!kategori}
              count={facetCount({ q: query, seri: undefined, fiyat, en })}
              onClick={() =>
                void navigate({ search: (s) => ({ ...s, kategori: undefined, seri: undefined }) })
              }
            >
              Tümü
            </FilterChip>
            {CATEGORIES.map((c) => (
              <FilterChip
                key={c.id}
                active={kategori === c.id}
                count={facetCount({
                  q: query,
                  kategori: c.id,
                  seri: c.id === "ofis" ? seri : undefined,
                  fiyat,
                  en,
                })}
                onClick={() =>
                  void navigate({
                    search: (s) => ({
                      ...s,
                      kategori: c.id,
                      seri: c.id === "ofis" ? s.seri : undefined,
                    }),
                  })
                }
              >
                {c.name}
              </FilterChip>
            ))}
          </div>
        </div>
        {kategori === "ofis" ? (
          <div>
            <p className="mb-2 font-mono text-xs text-fg-muted">Set</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={!seri}
                onClick={() => void navigate({ search: (s) => ({ ...s, seri: undefined }) })}
              >
                Tüm masa
              </FilterChip>
              {SERIES.map((s) => (
                <FilterChip
                  key={s.id}
                  active={seri === s.id}
                  count={facetCount({ q: query, kategori: "ofis", seri: s.id, fiyat, en })}
                  onClick={() =>
                    void navigate({
                      search: (prev) => ({ ...prev, seri: prev.seri === s.id ? undefined : s.id }),
                    })
                  }
                >
                  {s.name}
                </FilterChip>
              ))}
            </div>
          </div>
        ) : null}
        <div>
          <p className="mb-2 font-mono text-xs text-fg-muted">Fiyat</p>
          <div className="flex flex-wrap gap-2">
            {PRICE_BANDS.map((band) => (
              <FilterChip
                key={band.id}
                active={fiyat === band.id}
                count={facetCount({
                  q: query,
                  kategori,
                  seri,
                  fiyat: band.id,
                  en,
                })}
                onClick={() =>
                  void navigate({
                    search: (s) => ({ ...s, fiyat: s.fiyat === band.id ? undefined : band.id }),
                    replace: true,
                  })
                }
              >
                {band.label}
              </FilterChip>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-mono text-xs text-fg-muted">En (dış ölçü)</p>
          <div className="flex flex-wrap gap-2">
            {WIDTH_BANDS.map((band) => (
              <FilterChip
                key={band.id}
                active={en === band.id}
                count={facetCount({
                  q: query,
                  kategori,
                  seri,
                  fiyat,
                  en: band.id,
                })}
                onClick={() =>
                  void navigate({
                    search: (s) => ({ ...s, en: s.en === band.id ? undefined : band.id }),
                    replace: true,
                  })
                }
              >
                {band.label}
              </FilterChip>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1">
            <span className="mr-1 font-mono text-xs text-fg-muted">Zemin</span>
            <button
              type="button"
              onClick={() => setColor(undefined)}
              className={cn(
                "h-11 border px-3 font-mono text-xs",
                !color ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg-muted",
              )}
            >
              Hepsi
            </button>
            <ColorSwatches value={color ?? ""} onChange={setColor} />
          </div>
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            Sırala
            <select
              value={sort}
              onChange={(e) =>
                void navigate({
                  search: (s) => ({
                    ...s,
                    sirala: e.target.value === "onerilen" ? undefined : (e.target.value as SortId),
                  }),
                })
              }
              className="h-11 border border-border-strong bg-bg-elevated px-3 text-sm text-fg"
            >
              <option value="onerilen">Önerilen</option>
              <option value="fiyat-asc">Fiyat: artan</option>
              <option value="fiyat-desc">Fiyat: azalan</option>
              <option value="ad">İsim</option>
              <option value="en">En: dar → geniş</option>
            </select>
          </label>
        </div>
        {sheet ? (
          <div className="sticky bottom-0 -mx-4 mt-auto border-t border-dashed border-border bg-bg p-3 lg:hidden">
            <Button className="w-full" onClick={() => setSheet(false)}>
              {list.length} parçayı göster
            </Button>
          </div>
        ) : null}
        </div>
        <AppliedFilters
          q={query.trim() || undefined}
          kategori={kategori}
          seri={seri}
          renk={color}
          sirala={sirala}
          fiyat={fiyat}
          en={en}
          onClear={(patch) => {
            if ("q" in patch) setQuery(patch.q ?? "");
            void navigate({
              search: (s) => ({ ...s, ...patch }),
              replace: true,
            });
          }}
          onClearAll={() => {
            setQuery("");
            void navigate({ search: {}, replace: true });
          }}
        />
      </div>

      {kategori === "ofis" && !seri ? (
        <div className="mt-10">
          <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Masa setleri</p>
          <h2 className="mt-1 font-display text-2xl">Üç seri</h2>
          <div className="mt-5">
            <SeriesCards color={colorId} />
          </div>
        </div>
      ) : null}

      {seriesMeta ? (
        <div className="mt-10 max-w-xl">
          <SeriesCard id={seriesMeta.id} color={colorId} />
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-sm text-fg-muted">
          {list.length} parça
          {color ? ` · ${COLORS.find((c) => c.id === color)?.name}` : ""}
        </p>
        <div className="flex items-center gap-1" role="group" aria-label="Izgara sıklığı">
          <LayoutGrid className="mr-1 size-4 text-fg-muted" />
          {([2, 3, 4] as GridCols[]).map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={gridCols === n}
              onClick={() => setGridCols(n)}
              className={cn(
                "h-9 min-w-9 border px-2 font-mono text-xs",
                gridCols === n ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg-muted",
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="border border-dashed border-border bg-bg-elevated px-6 py-16 text-center">
          <p className="font-display text-3xl">Eşleşen parça yok</p>
          <p className="mx-auto mt-3 max-w-md text-sm text-fg-muted">
            {query.trim() ? `“${query.trim()}” katalogda yok.` : "Bu filtreler boş döndü."} Oda veya
            hazır parçadan devam edin.
          </p>
          {(() => {
            const hint = query.trim()
              ? closestTerm(query.trim(), [...JOB_CHIPS, ...CATEGORIES.map((c) => c.name)], foldTr)
              : null;
            return hint ? (
              <p className="mt-3 text-sm">
                Bunu mu demek istediniz:{" "}
                <button
                  type="button"
                  className="text-taba hover:underline"
                  onClick={() => {
                    setQuery(hint);
                    void navigate({ search: (s) => ({ ...s, q: hint }), replace: true });
                  }}
                >
                  {hint}
                </button>
              </p>
            ) : null;
          })()}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                void navigate({ search: {} });
              }}
            >
              Filtreleri temizle
            </Button>
            <Link to="/tasarla" search={query.trim() ? { istek: query.trim() } : undefined}>
              <Button>Tasarlayın</Button>
            </Link>
            {query.trim() ? (
              <Link to="/teklif" search={{ not: query.trim() }}>
                <Button variant="outline">Kurumsal teklif</Button>
              </Link>
            ) : null}
            <Link to="/iletisim">
              <Button variant="outline">Yazın</Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <Link key={c.id} to="/kategori/$id" params={{ id: c.id }}>
                <Button variant="outline" size="sm">
                  {c.name}
                </Button>
              </Link>
            ))}
          </div>
          <div className="mt-10 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts()
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.sku} product={p} color={color} />
              ))}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "mt-6 grid gap-6",
            gridCols === 2 && "sm:grid-cols-2",
            gridCols === 3 && "sm:grid-cols-2 lg:grid-cols-3",
            gridCols === 4 && "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}
        >
          {list.slice(0, shown).map((p, i) => (
            <ProductCard
              key={p.sku}
              product={p}
              color={color}
              priority={i < 4}
            />
          ))}
        </div>
      )}
      {list.length > 0 ? (
        <MoreList
          shown={Math.min(shown, list.length)}
          total={list.length}
          onMore={() =>
            void navigate({
              search: (s) => ({ ...s, goster: shown + LIST_STEP }),
              replace: true,
              resetScroll: false,
            })
          }
        />
      ) : null}

      <RecentRail color={colorId} className="mt-20" />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={count === 0}
      className={cn(
        "h-11 border px-3 text-sm transition-colors duration-200",
        active
          ? "border-fg bg-fg text-bg-elevated"
          : "border-border-strong text-fg-muted hover:border-fg hover:text-fg",
        count === 0 && "opacity-40",
      )}
    >
      {children}
      {typeof count === "number" ? (
        <span className="ml-2 font-mono text-[11px] tabular-nums">{count}</span>
      ) : null}
    </button>
  );
}

const SORT_LABEL: Record<SortId, string> = {
  onerilen: "Önerilen",
  "fiyat-asc": "Fiyat: artan",
  "fiyat-desc": "Fiyat: azalan",
  ad: "İsim",
  en: "En: dar → geniş",
};

function AppliedFilters({
  q,
  kategori,
  seri,
  renk,
  sirala,
  fiyat,
  en,
  onClear,
  onClearAll,
}: {
  q?: string;
  kategori?: CategoryId;
  seri?: SeriesId;
  renk?: ColorId;
  sirala?: SortId;
  fiyat?: PriceBandId;
  en?: WidthBandId;
  onClear: (patch: Partial<Search>) => void;
  onClearAll: () => void;
}) {
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (q) chips.push({ key: "q", label: `Arama: ${q}`, clear: () => onClear({ q: undefined }) });
  if (kategori) {
    const name = CATEGORIES.find((c) => c.id === kategori)?.name ?? kategori;
    chips.push({
      key: "kategori",
      label: name,
      clear: () => onClear({ kategori: undefined, seri: undefined }),
    });
  }
  if (seri) {
    const name = getSeries(seri)?.name ?? seri;
    chips.push({ key: "seri", label: name, clear: () => onClear({ seri: undefined }) });
  }
  if (renk) {
    const name = COLORS.find((c) => c.id === renk)?.name ?? renk;
    chips.push({ key: "renk", label: `Zemin: ${name}`, clear: () => onClear({ renk: undefined }) });
  }
  if (sirala) {
    chips.push({
      key: "sirala",
      label: SORT_LABEL[sirala],
      clear: () => onClear({ sirala: undefined }),
    });
  }
  if (fiyat) {
    const name = PRICE_BANDS.find((b) => b.id === fiyat)?.label ?? fiyat;
    chips.push({ key: "fiyat", label: name, clear: () => onClear({ fiyat: undefined }) });
  }
  if (en) {
    const name = WIDTH_BANDS.find((b) => b.id === en)?.label ?? en;
    chips.push({ key: "en", label: name, clear: () => onClear({ en: undefined }) });
  }
  return (
    <FilterChips
      chips={chips.map((c) => ({ key: c.key, label: c.label, onClear: c.clear }))}
      onClearAll={onClearAll}
    />
  );
}
