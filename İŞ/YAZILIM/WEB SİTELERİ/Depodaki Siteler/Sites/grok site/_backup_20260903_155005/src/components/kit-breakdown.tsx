import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { toastAdded } from "@/lib/cart-toast";
import {
  PASTEL,
  SERIES,
  productSlug,
  productsBySeries,
  seriesTotal,
  type ColorId,
} from "@/lib/products";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function KitBreakdown({ color }: { color?: ColorId }) {
  const add = useCart((s) => s.add);
  const addMany = useCart((s) => s.addMany);
  const lastColor = usePrefs((s) => s.lastColor);
  const chosen = color ?? lastColor ?? "espresso";

  return (
    <div className="mt-16 space-y-16">
      {SERIES.map((series) => {
        const items = productsBySeries(series.id);
        const total = seriesTotal(series.id);
        return (
          <section key={series.id}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Kit</p>
                <h2 className="mt-1 font-display text-3xl">{series.name}</h2>
                <p className="mt-1 text-sm text-fg-muted">
                  {series.blurb} {items.length} parça · {formatPrice(total)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    addMany(
                      items.map((p) => p.sku),
                      chosen,
                    );
                    toast.success(`${items.length} parça sepete eklendi`);
                  }}
                >
                  Kiti sepete
                </Button>
                <Link to="/teklif" search={{ seri: series.id, renk: chosen }}>
                  <Button variant="outline">Teklif</Button>
                </Link>
              </div>
            </div>
            <ul className="mt-6 divide-y divide-dashed divide-border border-y border-dashed border-border">
              {items.map((p) => {
                const dim = p.specs.find((s) => s.label === "Dış ölçü")?.value;
                return (
                  <li key={p.sku} className="flex flex-wrap items-center gap-3 py-3">
                    <Link
                      to="/urun/$sku"
                      params={{ sku: productSlug(p) }}
                      search={{ renk: chosen }}
                      className="size-16 shrink-0"
                      style={{ backgroundColor: PASTEL[chosen] }}
                    >
                      <img src={p.image} alt="" className="size-full object-contain p-1" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        to="/urun/$sku"
                        params={{ sku: productSlug(p) }}
                        search={{ renk: chosen }}
                        className="font-display text-lg leading-tight hover:text-taba"
                      >
                        {p.name}
                      </Link>
                      <p className="font-mono text-[11px] text-fg-muted">
                        {p.sku}
                        {dim ? ` · ${dim}` : ""}
                      </p>
                    </div>
                    <p className="font-mono text-sm tabular-nums">{formatPrice(p.price)}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        add(p.sku, chosen, 1);
                        toastAdded(p.name);
                      }}
                    >
                      Ekle
                    </Button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
