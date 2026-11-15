import { Link } from "@tanstack/react-router";
import { toastAdded } from "@/lib/cart-toast";
import { PASTEL, productSlug, relatedProducts, type ColorId } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function PairRail({ sku, color }: { sku: string; color: ColorId }) {
  const add = useCart((s) => s.add);
  const pairs = relatedProducts(sku, 2);
  if (pairs.length === 0) return null;

  return (
    <section className="mt-12 border border-dashed border-border bg-bg-elevated p-5">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Yanına ekle</p>
      <h2 className="mt-1 font-display text-2xl">Aynı paletten iki parça</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {pairs.map((p) => (
          <li key={p.sku} className="flex gap-3">
            <Link
              to="/urun/$sku"
              params={{ sku: productSlug(p) }}
              search={{ renk: color }}
              aria-label={`${p.name} ürününü aç`}
              className="size-20 shrink-0 border border-dashed border-border"
              style={{ backgroundColor: PASTEL[color] }}
            >
              <img
                src={p.image}
                alt=""
                className="size-full object-contain p-1"
                width={1500}
                height={1500}
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                to="/urun/$sku"
                params={{ sku: productSlug(p) }}
                search={{ renk: color }}
                className="font-display text-lg leading-tight hover:text-taba"
              >
                {p.name}
              </Link>
              <p className="mt-1 font-mono text-sm tabular-nums">{formatPrice(p.price)}</p>
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    add(p.sku, color, 1);
                    toastAdded(p.name);
                  }}
                >
                  Sepete ekle
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
