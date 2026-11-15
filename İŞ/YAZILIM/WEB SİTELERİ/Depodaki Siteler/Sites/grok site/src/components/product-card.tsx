import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { toastAdded } from "@/lib/cart-toast";
import {
  CATEGORIES,
  COLORS,
  PASTEL,
  SERIES,
  productSlug,
  type ColorId,
  type Product,
} from "@/lib/products";
import { CatalogImg } from "@/components/catalog-img";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { formatPrice } from "@/lib/utils";
import { WishButton } from "@/components/wish-button";
import { Button } from "@/components/ui/button";
import { useQuickLook } from "@/lib/quick-look";
import { Expand } from "lucide-react";
import { COMPARE_MAX, useCompare } from "@/lib/compare";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  color,
  priority = false,
}: {
  product: Product;
  color?: ColorId;
  priority?: boolean;
}) {
  const cat = CATEGORIES.find((c) => c.id === product.category);
  const series = SERIES.find((s) => s.id === product.series);
  const add = useCart((s) => s.add);
  const inCart = useCart((s) => s.lines.some((l) => l.sku === product.sku));
  const lastColor = usePrefs((s) => s.lastColor);
  const rememberColor = usePrefs((s) => s.rememberColor);
  const peek = useQuickLook((s) => s.open);
  const chosen = color ?? lastColor ?? "espresso";
  const colorName = COLORS.find((c) => c.id === chosen)?.name;
  const washBg = color ? PASTEL[color] : undefined;
  const dim = product.specs.find((s) => s.label === "Dış ölçü")?.value;
  const comparing = useCompare((s) => s.skus.includes(product.sku));
  const toggleCompare = useCompare((s) => s.toggle);

  return (
    <article className="group flex flex-col">
      <div
        className="relative border border-dashed border-border bg-bg-wash wash-shift group-hover:border-fg"
        style={washBg ? { backgroundColor: washBg } : undefined}
      >
        <Link
          to="/urun/$sku"
          params={{ sku: productSlug(product) }}
          search={color ? { renk: color } : undefined}
          className="img-zoom block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CatalogImg
            src={product.image}
            alt={product.name}
            priority={priority}
            className="aspect-square w-full object-contain p-3"
          />
        </Link>
        <span className="absolute top-2 left-2 font-mono text-xs text-fg-muted">{product.sku}</span>
        <div className="absolute top-1 right-1 flex flex-col">
          <WishButton sku={product.sku} />
          <button
            type="button"
            className="flex size-11 items-center justify-center bg-bg-elevated/90 text-fg hover:bg-bg"
            aria-label="Hızlı bakış"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              peek(product, chosen);
            }}
          >
            <Expand className="size-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 border-x border-b border-dashed border-border bg-bg-elevated px-3 pt-3 pb-3">
        <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">
          {series?.name ?? cat?.name}
        </p>
        <h3 className="font-display text-lg leading-snug">
          <Link
            to="/urun/$sku"
            params={{ sku: productSlug(product) }}
            search={color ? { renk: color } : undefined}
            className="product-title text-fg hover:text-taba"
          >
            {product.name}
          </Link>
        </h3>
        <p className="font-mono text-sm tabular-nums">{formatPrice(product.price)}</p>
        {dim ? <p className="font-mono text-xs text-fg-muted">{dim}</p> : null}
        {color ? (
          <p className="font-mono text-xs text-fg-muted">
            {colorName} · zemin, fotoğraf değil
          </p>
        ) : null}
        {inCart ? (
          <p className="font-mono text-[11px] text-taba">Sepette</p>
        ) : null}
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full"
          onClick={() => {
            rememberColor(chosen);
            add(product.sku, chosen, 1);
            toastAdded(product.name);
          }}
        >
          {inCart ? "Bir tane daha" : "Sepete ekle"}
        </Button>
        <button
          type="button"
          aria-pressed={comparing}
          className={cn(
            "mt-1 h-9 w-full border text-xs",
            comparing ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg-muted hover:border-fg",
          )}
          onClick={() => {
            const ok = toggleCompare(product.sku);
            if (!ok) toast.error(`En fazla ${COMPARE_MAX} parça`);
          }}
        >
          {comparing ? "Karşılaştırmada" : "Karşılaştır"}
        </button>
      </div>
    </article>
  );
}
