import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import {
  CATEGORIES,
  PASTEL,
  WALL_SKUS,
  foldTr,
  getProduct,
  productSlug,
  type Product,
} from "@/lib/products";
import { closestTerm } from "@/lib/fuzzy";
import { CatalogImg } from "@/components/catalog-img";
import { filterCatalog } from "@/lib/shop";
import { SearchRecover } from "@/components/search-recover";
import { usePrefs } from "@/lib/prefs";
import { useCart } from "@/lib/cart";
import { toastAdded } from "@/lib/cart-toast";
import { trapTab } from "@/lib/focus";
import { formatPrice, cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { lineDetailTo } from "@/lib/line-items";
import { useCatalogLines } from "@/lib/catalog-context";
import { searchSite, type SiteHit } from "@/lib/site-search";

const JOBS = ["saat", "mücevher", "çekmeceli", "camlı", "12 saat", "tekli"];

export function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [hi, setHi] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const lines = useCatalogLines();

  useEffect(() => {
    if (open) {
      setQ("");
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) trapTab(e, panelRef.current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const recent = usePrefs((s) => s.recent);
  const lastColor = usePrefs((s) => s.lastColor);
  const add = useCart((s) => s.add);
  const results = useMemo((): SiteHit[] => {
    const needle = q.trim();
    if (needle.length < 1) {
      const fromRecent = recent
        .map(getProduct)
        .filter((p): p is Product => p != null)
        .slice(0, 6);
      const seed =
        fromRecent.length >= 2
          ? fromRecent
          : WALL_SKUS.map(getProduct)
              .filter((p): p is Product => p != null)
              .slice(0, 6);
      return seed.map((p) => ({
        kind: "sku" as const,
        id: `sku-${p.sku}`,
        name: p.name,
        image: p.image,
        price: p.price,
        meta: p.sku,
        sku: p.sku,
        slug: productSlug(p),
      }));
    }
    return searchSite(needle, 12, lines);
  }, [lines, q, recent]);

  const lineHits = useMemo(() => {
    const n = foldTr(q.trim());
    if (n.length < 2) return [];
    return lines.filter((l) => foldTr(l.kicker).includes(n) || foldTr(l.title).includes(n));
  }, [lines, q]);

  const catHits = useMemo(() => {
    const n = foldTr(q.trim());
    if (n.length < 2) return [];
    return CATEGORIES.filter(
      (c) => foldTr(c.name).includes(n) || foldTr(c.blurb).includes(n),
    ).slice(0, 4);
  }, [q]);

  useEffect(() => {
    setHi(0);
  }, [results]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 print:hidden" data-print-hide>
      <button
        type="button"
        aria-label="Kapat"
        className="absolute inset-0 bg-bg-deep/40"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Ara"
        className="absolute inset-x-0 overflow-y-auto border-b border-dashed border-border bg-bg px-4 pt-4 pb-6"
        style={{ top: "var(--nav-h, 6.5rem)", maxHeight: "calc(100dvh - var(--nav-h, 6.5rem))" }}
      >
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-2 border-b border-dashed border-border pb-2">
            <Search className="size-4 shrink-0 text-fg-muted" />
            <Input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHi((i) => Math.min(Math.max(0, results.length - 1), i + 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHi((i) => Math.max(0, i - 1));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  const hit = results[hi];
                  onClose();
                  if (hit?.kind === "sku") {
                    void navigate({
                      to: "/urun/$sku",
                      params: { sku: hit.slug },
                      search: { renk: lastColor },
                    });
                  } else if (hit?.kind === "line") {
                    void navigate({
                      to: lineDetailTo(hit.to),
                      params: { id: hit.itemId },
                    });
                  } else if (q.trim()) {
                    void navigate({ to: "/koleksiyon", search: { q: q.trim() } });
                  }
                }
              }}
              placeholder="saat, mücevher, ürün kodu…  Ctrl+K"
              aria-label="Ara"
              className="border-0 bg-transparent focus-visible:ring-0"
            />
            <kbd className="hidden border border-dashed border-border px-1.5 py-0.5 font-mono text-xs text-fg-muted sm:inline">
              Ctrl+K
            </kbd>
            <button
              type="button"
              className="flex size-11 items-center justify-center"
              aria-label="Kapat"
              onClick={onClose}
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {JOBS.map((job) => (
              <button
                key={job}
                type="button"
                onClick={() => setQ(job)}
                className={cn(
                  "h-11 border px-3 text-sm",
                  q.trim().toLocaleLowerCase("tr") === job
                    ? "border-fg bg-fg text-bg-elevated"
                    : "border-border-strong text-fg-muted hover:border-fg hover:text-fg",
                )}
              >
                {job}
              </button>
            ))}
          </div>
          {lineHits.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {lineHits.map((l) => (
                <Link
                  key={l.key}
                  to={l.to}
                  onClick={onClose}
                  className="inline-flex h-11 items-center border border-dashed border-border px-3 text-sm hover:border-fg"
                >
                  {l.kicker}
                </Link>
              ))}
            </div>
          ) : null}
          {catHits.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {catHits.map((c) => (
                <Link
                  key={c.id}
                  to="/kategori/$id"
                  params={{ id: c.id }}
                  onClick={onClose}
                  className="inline-flex h-11 items-center border border-dashed border-border px-3 text-sm hover:border-fg"
                >
                  {c.name} odası
                </Link>
              ))}
            </div>
          ) : null}
          <ul className="mt-2 max-h-[min(28rem,50dvh)] divide-y divide-dashed divide-border overflow-y-auto">
            {results.map((hit, i) => (
              <li key={hit.id} className={cn("flex items-center gap-2", i === hi && "bg-bg-wash")}>
                {hit.kind === "sku" ? (
                  <Link
                    to="/urun/$sku"
                    params={{ sku: hit.slug }}
                    search={{ renk: lastColor }}
                    onClick={onClose}
                    onMouseEnter={() => setHi(i)}
                    className="flex min-w-0 flex-1 items-center gap-3 py-3 hover:bg-bg-elevated"
                  >
                    <CatalogImg
                      src={hit.image}
                      alt=""
                      className="size-14 object-contain wash-shift"
                      style={{ backgroundColor: PASTEL[lastColor] }}
                      sizes="56px"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg leading-tight">{hit.name}</span>
                      <span className="font-mono text-xs text-fg-subtle">{hit.meta}</span>
                    </span>
                    <span className="font-mono text-sm text-fg-muted tabular-nums">
                      {hit.price == null ? "Teklif alın" : formatPrice(hit.price)}
                    </span>
                  </Link>
                ) : (
                  <Link
                    to={lineDetailTo(hit.to)}
                    params={{ id: hit.itemId }}
                    onClick={onClose}
                    onMouseEnter={() => setHi(i)}
                    className="flex min-w-0 flex-1 items-center gap-3 py-3 hover:bg-bg-elevated"
                  >
                    <img
                      src={hit.image}
                      alt=""
                      className="size-14 object-contain"
                      width={1500}
                      height={1500}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg leading-tight">{hit.name}</span>
                      <span className="font-mono text-xs text-fg-subtle">{hit.meta}</span>
                    </span>
                    <span className="font-mono text-sm text-fg-muted tabular-nums">
                      {hit.price == null ? "Teklif alın" : formatPrice(hit.price)}
                    </span>
                  </Link>
                )}
                {hit.kind === "sku" ? (
                  <button
                    type="button"
                    className="mr-1 h-11 border border-border-strong px-2 font-mono text-xs hover:border-fg"
                    onClick={() => {
                      add(hit.sku, lastColor, 1);
                      toastAdded(hit.name);
                    }}
                  >
                    +
                  </button>
                ) : null}
              </li>
            ))}
            {results.length === 0 ? (
              <li>
                {(() => {
                  const hint = closestTerm(
                    q.trim(),
                    [...JOBS, ...CATEGORIES.map((c) => c.name)],
                    foldTr,
                  );
                  return hint ? (
                    <p className="py-3 text-sm">
                      Bunu mu demek istediniz:{" "}
                      <button
                        type="button"
                        className="text-taba hover:underline"
                        onClick={() => setQ(hint)}
                      >
                        {hint}
                      </button>
                    </p>
                  ) : null;
                })()}
                <div className="flex flex-wrap gap-2 py-2">
                  {CATEGORIES.filter((c) => {
                    const n = foldTr(q);
                    return (
                      n.length >= 2 && (foldTr(c.name).includes(n) || foldTr(c.blurb).includes(n))
                    );
                  }).map((c) => (
                    <Link
                      key={c.id}
                      to="/kategori/$id"
                      params={{ id: c.id }}
                      onClick={onClose}
                      className="border border-dashed border-border px-3 py-2 text-xs"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
                <SearchRecover query={q.trim()} onNavigate={onClose} />
              </li>
            ) : null}
          </ul>
          <Link
            to="/koleksiyon"
            search={q ? { q } : undefined}
            onClick={onClose}
            className="mt-3 block text-center text-sm text-fg-muted hover:text-fg"
          >
            {q.trim()
              ? `Katalogda ${filterCatalog({ q: q.trim() }).length} sonuç`
              : "Tüm ürünlerde ara"}
          </Link>
        </div>
      </div>
    </div>
  );
}
