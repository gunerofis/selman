import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { CATEGORIES, PASTEL, WALL_SKUS, foldTr, getProduct, productSlug, searchProducts, type Product } from "@/lib/products";
import { isExactHit } from "@/lib/search-rank";
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

const JOBS = ["sümen", "şarj", "kahve", "baharat", "gözlük", "dizüstü", "saat", "anahtar", "banyo"];

export function SearchPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [hi, setHi] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
  const results = useMemo(() => {
    const needle = q.trim();
    if (needle.length < 1) {
      const fromRecent = recent
        .map(getProduct)
        .filter((p): p is Product => p != null)
        .slice(0, 6);
      if (fromRecent.length >= 2) return fromRecent;
      return WALL_SKUS.map(getProduct)
        .filter((p): p is Product => p != null)
        .slice(0, 6);
    }
    return searchProducts(needle, 12);
  }, [q, recent]);

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
                  const p = results[hi];
                  onClose();
                  if (p) {
                    void navigate({
                      to: "/urun/$sku",
                      params: { sku: productSlug(p) },
                      search: { renk: lastColor },
                    });
                  } else if (q.trim()) {
                    void navigate({ to: "/koleksiyon", search: { q: q.trim() } });
                  }
                }
              }}
              placeholder="şarj, sümen, kahve…  Ctrl+K"
              aria-label="Ara"
              className="border-0 bg-transparent focus-visible:ring-0"
            />
            <kbd className="hidden border border-dashed border-border px-1.5 py-0.5 font-mono text-[10px] text-fg-muted sm:inline">
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
            {results.map((p, i) => (
              <li
                key={p.sku}
                className={cn("flex items-center gap-2", i === hi && "bg-bg-wash")}
              >
                <Link
                  to="/urun/$sku"
                  params={{ sku: productSlug(p) }}
                  search={{ renk: lastColor }}
                  onClick={onClose}
                  onMouseEnter={() => setHi(i)}
                  className="flex min-w-0 flex-1 items-center gap-3 py-3 hover:bg-bg-elevated"
                >
                  <CatalogImg
                    src={p.image}
                    alt=""
                    className="size-14 object-contain wash-shift"
                    style={{ backgroundColor: PASTEL[lastColor] }}
                    sizes="56px"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg leading-tight">{p.name}</span>
                    <span className="font-mono text-xs text-fg-subtle">
                      {p.sku}
                      {isExactHit(p, q, foldTr) ? " · tam eşleşme" : ""}
                    </span>
                  </span>
                  <span className="font-mono text-sm text-fg-muted tabular-nums">
                    {formatPrice(p.price)}
                  </span>
                </Link>
                <button
                  type="button"
                  className="mr-1 h-9 border border-border-strong px-2 font-mono text-[11px] hover:border-fg"
                  onClick={() => {
                    add(p.sku, lastColor, 1);
                    toastAdded(p.name);
                  }}
                >
                  +
                </button>
              </li>
            ))}
            {results.length === 0 ? (
              <li>
                {(() => {
                  const hint = closestTerm(q.trim(), [...JOBS, ...CATEGORIES.map((c) => c.name)], foldTr);
                  return hint ? (
                    <p className="py-3 text-sm">
                      Bunu mu demek istediniz:{" "}
                      <button type="button" className="text-taba hover:underline" onClick={() => setQ(hint)}>
                        {hint}
                      </button>
                    </p>
                  ) : null;
                })()}
                <div className="flex flex-wrap gap-2 py-2">
                  {CATEGORIES.filter((c) => {
                    const n = foldTr(q);
                    return n.length >= 2 && (foldTr(c.name).includes(n) || foldTr(c.blurb).includes(n));
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
              ? `Koleksiyonda ${filterCatalog({ q: q.trim() }).length} sonuç`
              : "Tüm ürünlerde ara"}
          </Link>
        </div>
      </div>
    </div>
  );
}
