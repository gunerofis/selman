import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { LineItemLink } from "@/components/line-catalog";
import { matchesLineItem, type LineDef } from "@/lib/line-items";
import { useCatalogLines } from "@/lib/catalog-context";
import {
  CATEGORIES,
  COLORS,
  SERIES,
  type CategoryId,
  type ColorId,
  type SeriesId,
} from "@/lib/products";
import {
  PRICE_BANDS,
  inPriceBand,
  isPriceBand,
  isWidthBand,
  type PriceBandId,
  type WidthBandId,
} from "@/lib/catalog-filters";
import { pageHead } from "@/lib/seo";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { MoreList } from "@/components/more-list";
import { LIST_STEP, listWindow, parseListWindow } from "@/lib/list-window";

type SortParam = "onerilen" | "fiyat-asc" | "fiyat-desc" | "ad" | "en";

type Search = {
  kategori?: CategoryId;
  q?: string;
  sirala?: SortParam;
  seri?: SeriesId;
  renk?: ColorId;
  fiyat?: PriceBandId | "teklif";
  en?: WidthBandId;
  goster?: number;
  // Katalog kendi seri (ürün ailesi) filtresi — line-item anahtarları.
  aile?: "all" | "clik" | "slac" | "desq" | "sweb";
  // Ürün türü faceti (Saat kutusu, Masa seti, Aksesuar, Organizer alt türü…).
  tur?: string;
};

export const Route = createFileRoute("/koleksiyon")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    kategori: CATEGORIES.some((c) => c.id === raw.kategori)
      ? (raw.kategori as CategoryId)
      : undefined,
    q: typeof raw.q === "string" ? raw.q : undefined,
    sirala: ["onerilen", "fiyat-asc", "fiyat-desc", "ad", "en"].includes(String(raw.sirala))
      ? (raw.sirala as SortParam)
      : undefined,
    seri: SERIES.some((s) => s.id === raw.seri) ? (raw.seri as SeriesId) : undefined,
    renk: COLORS.some((c) => c.id === raw.renk) ? (raw.renk as ColorId) : undefined,
    fiyat:
      raw.fiyat === "teklif"
        ? "teklif"
        : isPriceBand(String(raw.fiyat))
          ? (raw.fiyat as PriceBandId)
          : undefined,
    en: isWidthBand(String(raw.en)) ? (raw.en as WidthBandId) : undefined,
    goster: parseListWindow(raw.goster),
    aile: ["all", "clik"].includes(String(raw.aile))
      ? (raw.aile as Search["aile"])
      : undefined,
    tur: typeof raw.tur === "string" ? raw.tur : undefined,
  }),
  head: () =>
    pageHead({
      title: "Tüm Ürünler",
      description:
        "Saat ve mücevher kutularını kapasite, tür ve fiyata göre keşfedin.",
      path: "/koleksiyon",
    }),
  component: Shop,
});

type SeriesFilter = "all" | LineDef["key"];
type PriceFilter = "all" | PriceBandId | "teklif";
type Sort = "onerilen" | "fiyat-asc" | "fiyat-desc" | "ad";

const SERIES_FILTERS: { id: SeriesFilter; label: string }[] = [
{ id: "all", label: "Tümü" },
{ id: "clik", label: "Saat & Mücevher" }
];

const PRICE_FILTERS: { id: PriceFilter; label: string }[] = [
  { id: "all", label: "Tümü" },
  ...PRICE_BANDS.map((b) => ({ id: b.id as PriceFilter, label: b.label })),
  { id: "teklif", label: "Teklife özel" },
];

function Shop() {
  const lines = useCatalogLines();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const [query, setQuery] = useState(search.q ?? "");
  const [seri, setSeri] = useState<SeriesFilter>(search.aile ?? "all");
  const [fiyat, setFiyat] = useState<PriceFilter>(search.fiyat ?? "all");
  const [tur, setTur] = useState<string>(search.tur ?? "all");
  const [sort, setSort] = useState<Sort>(
    search.sirala && search.sirala !== "en" ? search.sirala : "onerilen",
  );
  const [shown, setShown] = useState(() => listWindow(search.goster));

  // Filtre/sayfa durumunu URL'ye yaz: link paylaşılabilir, geri/ileri çalışır.
  const syncUrl = (patch: Partial<Search>) => {
    void navigate({
      to: "/koleksiyon",
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,
      resetScroll: false,
    });
  };

  // Serileri sırayla harmanla: ilk sayfa tek kategoriye değil tüm kategorilere
  // ait ürünlerin karışımını gösterir ("önerilen" sıralaması).
  const all = useMemo(() => {
    // Tasarım/ürün arşivinden gelen, fiyatı teyit bekleyen kayıtları ana
    // katalog dışında tut; bunlar teklif akışında gösterilir.
    const isArchive = (item: LineDef["items"][number]) =>
      Boolean(item.note && /arşiv/i.test(item.note));
    const buckets = lines.map((line) =>
      line.items.filter((item) => !isArchive(item)).map((item) => ({ line, item })),
    );
    const out: { line: LineDef; item: LineDef["items"][number] }[] = [];
    const longest = buckets.reduce((max, b) => Math.max(max, b.length), 0);
    for (let i = 0; i < longest; i++) {
      for (const bucket of buckets) {
        if (i < bucket.length) out.push(bucket[i]);
      }
    }
    return out;
  }, [lines]);

  // Mevcut ürünlerden gerçek "tür" değerlerini çıkar (facet için ikinci eksen).
  const turler = useMemo(() => {
    const set = new Set<string>();
    for (const { item } of all) if (item.kind) set.add(item.kind);
    return [...set].sort((a, b) => a.localeCompare(b, "tr"));
  }, [all]);

  const filtered = useMemo(() => {
    const needle = query.trim();
    return all.filter(({ line, item }) => {
      if (seri !== "all" && line.key !== seri) return false;
      if (tur !== "all" && item.kind !== tur) return false;
      if (fiyat === "teklif") {
        if (item.price != null) return false;
      } else if (fiyat !== "all") {
        if (item.price == null || !inPriceBand(item.price, fiyat)) return false;
      }
      if (needle && !matchesLineItem(item, line, needle)) return false;
      return true;
    });
  }, [all, seri, tur, fiyat, query]);

  const list = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const featuredOrder = Number(b.item.price === 1850) - Number(a.item.price === 1850);
      if (featuredOrder !== 0) return featuredOrder;
      if (sort === "fiyat-asc")
        return (a.item.price ?? Infinity) - (b.item.price ?? Infinity);
      if (sort === "fiyat-desc")
        return (b.item.price ?? -Infinity) - (a.item.price ?? -Infinity);
      if (sort === "ad") return a.item.name.localeCompare(b.item.name, "tr");
      return 0;
    });
    return copy;
  }, [filtered, sort]);

  const windowed = list.slice(0, shown);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Katalog</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">Tüm Ürünler</h1>
      <p className="mt-2 text-sm text-fg-muted">
        Tüm kategoriler tek listede. {all.length} ürün arasından filtreleyin.
      </p>

      <div className="mt-8 space-y-5 border-y border-dashed border-border py-6">
        <label className="relative block">
          <span className="sr-only">Ara</span>
          <Search className="pointer-events-none absolute top-3.5 left-3 size-4 text-fg-subtle" />
          <Input
            className="pl-10"
            placeholder="Ürün adı, kod veya özellik ara"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShown(LIST_STEP);
              syncUrl({ q: e.target.value.trim() || undefined, goster: undefined });
            }}
          />
        </label>

        <FilterRow label="Kategori">
          {SERIES_FILTERS.map((f) => (
            <Chip
              key={f.id}
              active={seri === f.id}
              onClick={() => {
                setSeri(f.id);
                setShown(LIST_STEP);
                syncUrl({ aile: f.id === "all" ? undefined : f.id, goster: undefined });
              }}
            >
              {f.label}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label="Fiyat">
          {PRICE_FILTERS.map((f) => (
            <Chip
              key={f.id}
              active={fiyat === f.id}
              onClick={() => {
                setFiyat(f.id);
                setShown(LIST_STEP);
                syncUrl({ fiyat: f.id === "all" ? undefined : f.id, goster: undefined });
              }}
            >
              {f.label}
            </Chip>
          ))}
        </FilterRow>

        {turler.length > 1 ? (
          <FilterRow label="Tür">
            <Chip
              active={tur === "all"}
              onClick={() => {
                setTur("all");
                setShown(LIST_STEP);
                syncUrl({ tur: undefined, goster: undefined });
              }}
            >
              Tümü
            </Chip>
            {turler.map((k) => (
              <Chip
                key={k}
                active={tur === k}
                onClick={() => {
                  setTur(k);
                  setShown(LIST_STEP);
                  syncUrl({ tur: k, goster: undefined });
                }}
              >
                {k}
              </Chip>
            ))}
          </FilterRow>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-sm text-fg-muted">{list.length} ürün</p>
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            Sırala
            <select
              value={sort}
              onChange={(e) => {
                const v = e.target.value as Sort;
                setSort(v);
                syncUrl({ sirala: v === "onerilen" ? undefined : v });
              }}
              className="h-11 border border-border-strong bg-bg-elevated px-3 text-sm text-fg"
            >
              <option value="onerilen">Önerilen</option>
              <option value="fiyat-asc">Fiyat: artan</option>
              <option value="fiyat-desc">Fiyat: azalan</option>
              <option value="ad">İsim</option>
            </select>
          </label>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="py-20 text-center text-sm text-fg-muted">Bu filtrelerle eşleşen ürün yok.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-4">
          {windowed.map(({ line, item }) => (
            <li key={`${line.key}-${item.id}`} className="flex flex-col bg-bg">
              <LineItemLink
                line={line}
                id={item.id}
                className="img-zoom block bg-bg-wash"
                ariaLabel={item.name}
              >
                <img
                  src={item.image}
                  srcSet={item.imageSrcSet}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  alt={item.alt}
                  width={1500}
                  height={1125}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-contain p-1 sm:p-3"
                />
              </LineItemLink>
              <div className="flex flex-1 flex-col p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs tracking-wide text-fg-muted uppercase">
                    {line.kicker}
                  </span>
                  <span className="font-mono text-xs tracking-wide text-fg-subtle uppercase">
                    {item.code}
                  </span>
                </div>
                <h2 className="mt-2 font-display text-base leading-snug sm:text-lg">
                  <LineItemLink line={line} id={item.id} className="hover:text-taba">
                    {item.name}
                  </LineItemLink>
                </h2>
                <p className="mt-auto pt-4 font-display text-lg sm:text-xl">
                  {item.price == null ? "Fiyat teyidi bekliyor" : formatPrice(item.price)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {list.length > 0 ? (
        <MoreList
          shown={Math.min(shown, list.length)}
          total={list.length}
          onMore={() =>
            setShown((s) => {
              const next = s + LIST_STEP;
              syncUrl({ goster: next });
              return next;
            })
          }
        />
      ) : null}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-xs tracking-wide text-fg-muted uppercase">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-11 border px-4 py-2 text-sm transition-colors duration-150",
        active
          ? "border-fg bg-fg text-bg-elevated"
          : "border-border-strong text-fg-muted hover:border-fg hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
