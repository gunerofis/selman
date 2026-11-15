import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { CATEGORIES, PRODUCTS, foldTr, matchesQuery, minPrice } from "@/lib/products";
import { CONCENTRATIONS, FAMILIES, GENDERS } from "@/lib/perfume";
import { PRICE_BANDS, inPriceBand, isPriceBand, type PriceBandId } from "@/lib/catalog-filters";
import { pageHead } from "@/lib/seo";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { MoreList } from "@/components/more-list";
import { LIST_STEP, listWindow, parseListWindow } from "@/lib/list-window";

type Sort = "onerilen" | "fiyat-asc" | "fiyat-desc" | "ad";

type Search = {
  q?: string;
  kategori?: string;
  cinsiyet?: string;
  aile?: string;
  marka?: string;
  kons?: string;
  fiyat?: PriceBandId;
  sirala?: Sort;
  goster?: number;
};

const str = (v: unknown) => (typeof v === "string" && v.length < 60 ? v : undefined);

export const Route = createFileRoute("/koleksiyon")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    q: str(raw.q),
    kategori: str(raw.kategori),
    cinsiyet: str(raw.cinsiyet),
    aile: str(raw.aile),
    marka: str(raw.marka),
    kons: str(raw.kons),
    fiyat: isPriceBand(String(raw.fiyat)) ? (raw.fiyat as PriceBandId) : undefined,
    sirala: ["onerilen", "fiyat-asc", "fiyat-desc", "ad"].includes(String(raw.sirala))
      ? (raw.sirala as Sort)
      : undefined,
    goster: parseListWindow(raw.goster),
  }),
  head: () =>
    pageHead({
      title: "Tüm Parfümler",
      description:
        "Kadın, erkek ve unisex parfümler. Marka, koku ailesi, konsantrasyon ve fiyata göre filtreleyin.",
      path: "/koleksiyon",
    }),
  component: Shop,
});

function Shop() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState(search.q ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const shown = listWindow(search.goster);

  const set = (patch: Partial<Search>) =>
    void navigate({
      search: (prev) => ({ ...prev, ...patch, goster: undefined }),
      replace: true,
      resetScroll: false,
    });

  const brands = useMemo(
    () =>
      [...new Set(PRODUCTS.map((p) => p.brand).filter((b): b is string => Boolean(b)))].sort(
        (a, b) => a.localeCompare(b, "tr"),
      ),
    [],
  );

  const items = useMemo(() => {
    const list = PRODUCTS.filter((p) => {
      if (search.kategori && p.category !== search.kategori) return false;
      if (search.cinsiyet && p.gender !== search.cinsiyet) return false;
      if (search.aile && !p.families?.includes(search.aile as never)) return false;
      if (search.marka && p.brand !== search.marka) return false;
      if (search.kons && p.concentration !== search.kons) return false;
      if (search.fiyat && !inPriceBand(minPrice(p), search.fiyat)) return false;
      if (search.q && !matchesQuery(p, search.q)) return false;
      return true;
    });
    const sort = search.sirala ?? "onerilen";
    if (sort === "fiyat-asc") list.sort((a, b) => minPrice(a) - minPrice(b));
    if (sort === "fiyat-desc") list.sort((a, b) => minPrice(b) - minPrice(a));
    if (sort === "ad") list.sort((a, b) => foldTr(a.name).localeCompare(foldTr(b.name), "tr"));
    if (sort === "onerilen") list.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    return list;
  }, [search]);

  const active = Boolean(
    search.q || search.kategori || search.cinsiyet || search.aile || search.marka || search.kons || search.fiyat,
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 pb-[calc(6rem+var(--cookie-h,0px))] lg:pb-10">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Katalog</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Tüm parfümler</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside
          className={cn(
            "flex-col gap-6 lg:sticky lg:top-24 lg:z-10 lg:max-h-[calc(100dvh-6rem-var(--cookie-h,0px))] lg:self-start lg:overflow-y-auto",
            filtersOpen
              ? "fixed inset-x-0 bottom-0 z-50 flex max-h-[75dvh] overflow-y-auto bg-bg p-4 lg:inset-auto lg:z-10 lg:bg-transparent lg:p-0"
              : "hidden lg:flex",
          )}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              set({ q: query.trim() || undefined });
            }}
          >
            <label className="relative block">
              <span className="sr-only">Ara</span>
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-muted" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Parfüm, marka, nota…"
                className="h-11 pl-9"
              />
            </label>
          </form>
          <Facet label="Kategori">
            {CATEGORIES.map((c) => (
              <Chip key={c.id} active={search.kategori === c.id} onClick={() => set({ kategori: search.kategori === c.id ? undefined : c.id })}>
                {c.name}
              </Chip>
            ))}
          </Facet>
          <Facet label="Cinsiyet">
            {GENDERS.map((g) => (
              <Chip key={g.id} active={search.cinsiyet === g.id} onClick={() => set({ cinsiyet: search.cinsiyet === g.id ? undefined : g.id })}>
                {g.name}
              </Chip>
            ))}
          </Facet>
          <Facet label="Koku ailesi">
            {FAMILIES.map((f) => (
              <Chip key={f.id} active={search.aile === f.id} onClick={() => set({ aile: search.aile === f.id ? undefined : f.id })}>
                {f.name}
              </Chip>
            ))}
          </Facet>
          <Facet label="Konsantrasyon">
            {CONCENTRATIONS.map((c) => (
              <Chip key={c.id} active={search.kons === c.id} onClick={() => set({ kons: search.kons === c.id ? undefined : c.id })}>
                {c.short}
              </Chip>
            ))}
          </Facet>
          {brands.length ? (
            <Facet label="Marka">
              {brands.map((b) => (
                <Chip key={b} active={search.marka === b} onClick={() => set({ marka: search.marka === b ? undefined : b })}>
                  {b}
                </Chip>
              ))}
            </Facet>
          ) : null}
          <Facet label="Fiyat">
            {PRICE_BANDS.map((b) => (
              <Chip key={b.id} active={search.fiyat === b.id} onClick={() => set({ fiyat: search.fiyat === b.id ? undefined : b.id })}>
                {b.label}
              </Chip>
            ))}
          </Facet>
          {active ? (
            <button
              type="button"
              className="self-start text-sm text-taba hover:underline"
              onClick={() => {
                setQuery("");
                void navigate({ search: {}, replace: true });
              }}
            >
              Filtreleri temizle
            </button>
          ) : null}
          <Button className="w-full lg:hidden" onClick={() => setFiltersOpen(false)}>
            {items.length} ürün
          </Button>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-sm text-fg-muted">{items.length} ürün</p>
            <label className="flex items-center gap-2 text-sm">
              Sırala
              <select
                className="h-11 border border-border-strong bg-bg px-3"
                value={search.sirala ?? "onerilen"}
                onChange={(e) => set({ sirala: e.target.value === "onerilen" ? undefined : (e.target.value as Sort) })}
              >
                <option value="onerilen">Önerilen</option>
                <option value="fiyat-asc">Fiyat: artan</option>
                <option value="fiyat-desc">Fiyat: azalan</option>
                <option value="ad">Ad</option>
              </select>
            </label>
          </div>
          {items.length === 0 ? (
            <div className="mt-6 border border-solid border-border bg-bg-elevated px-6 py-16 text-center">
              <p className="font-display text-3xl">Eşleşen parfüm yok</p>
              <Link to="/koku-testi" className="mt-6 inline-block">
                <Button>Koku testi</Button>
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {items.slice(0, shown).map((p, i) => (
                <ProductCard key={p.sku} product={p} priority={i < 3} />
              ))}
            </div>
          )}
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
        </div>
      </div>
      {filtersOpen ? (
        <button
          type="button"
          aria-label="Kapat"
          className="fixed inset-0 z-40 bg-bg-deep/40 lg:hidden"
          onClick={() => setFiltersOpen(false)}
        />
      ) : null}
      <div
        className={cn("fixed inset-x-0 z-40 border-t border-border bg-bg p-3 lg:hidden", filtersOpen && "hidden")}
        style={{ bottom: "var(--cookie-h, 0px)" }}
      >
        <button type="button" className="h-12 w-full rounded-lg bg-fg text-sm text-bg" onClick={() => setFiltersOpen(true)}>
          Filtre{active ? " · aktif" : ""}
        </button>
      </div>
    </div>
  );
}

function Facet({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-xs tracking-wide text-fg-muted uppercase">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-9 rounded-full border px-3 text-xs",
        active ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg-muted hover:border-fg",
      )}
    >
      {children}
    </button>
  );
}
