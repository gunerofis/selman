import { Link, useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import { comparedProducts, COMPARE_MAX, useCompare } from "@/lib/compare";
import { productSlug } from "@/lib/products";
import { useHydrated } from "@/lib/use-hydrated";
import { Button } from "@/components/ui/button";

const HIDE = ["/odeme", "/siparis", "/urun", "/sepet"];

export function CompareBar() {
  const ready = useHydrated();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const skus = useCompare((s) => s.skus);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  if (!ready) return null;
  if (HIDE.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
  const items = comparedProducts(skus);
  if (items.length === 0) return null;

  return (
    <div
      className="fixed inset-x-0 z-30 border-t border-dashed border-border bg-bg/95 print:hidden"
      style={{ bottom: "var(--cookie-h, 0px)" }}
      data-print-hide
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 overflow-x-auto px-4 py-3">
        <p className="shrink-0 font-mono text-[11px] text-fg-muted">
          {items.length}/{COMPARE_MAX}
        </p>
        <ul className="flex min-w-0 flex-1 items-center gap-2">
          {items.map((p) => (
            <li key={p.sku} className="flex shrink-0 items-center gap-1 border border-dashed border-border pr-1">
              <Link to="/urun/$sku" params={{ sku: productSlug(p) }} className="flex items-center gap-2 px-2 py-1">
                <img src={p.image} alt="" className="size-8 object-contain" />
                <span className="max-w-28 truncate text-xs">{p.name}</span>
              </Link>
              <button
                type="button"
                className="flex size-8 items-center justify-center text-fg-muted hover:text-fg"
                aria-label={`${p.name} çıkar`}
                onClick={() => remove(p.sku)}
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" className="text-xs text-fg-muted hover:text-fg" onClick={clear}>
            Temizle
          </button>
          <Link to="/karsilastir">
            <Button size="sm" disabled={items.length < 2}>
              Karşılaştır
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
