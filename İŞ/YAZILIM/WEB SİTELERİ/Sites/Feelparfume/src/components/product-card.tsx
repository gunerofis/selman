import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { toastAdded } from "@/lib/cart-toast";
import {
  CATEGORIES,
  defaultSizeId,
  minPrice,
  productSizes,
  productSlug,
  type ColorId,
  type Product,
} from "@/lib/products";
import { concentrationOf } from "@/lib/perfume";
import { SampleBadge } from "@/components/perfume-details";
import { CatalogImg } from "@/components/catalog-img";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { WishButton } from "@/components/wish-button";
import { Button } from "@/components/ui/button";
import { useQuickLook } from "@/lib/quick-look";
import { ArrowLeftRight, Expand } from "lucide-react";
import { COMPARE_MAX, useCompare } from "@/lib/compare";
import { cn } from "@/lib/utils";
import { ratingOf } from "@/lib/reviews";

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
  const add = useCart((s) => s.add);
  const inCart = useCart((s) => s.lines.some((l) => l.sku === product.sku));
  const peek = useQuickLook((s) => s.open);
  const sizes = productSizes(product);
  const chosen = color && sizes.some((s) => s.id === color) ? color : defaultSizeId(product);
  const chosenSize = sizes.find((s) => s.id === chosen) ?? sizes[0];
  const conc = concentrationOf(product.concentration);
  const from = minPrice(product);
  const comparing = useCompare((s) => s.skus.includes(product.sku));
  const toggleCompare = useCompare((s) => s.toggle);
  const score = ratingOf(product.sku);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl">
      <div
        className="relative border border-solid border-border bg-bg-wash wash-shift group-hover:border-fg"
      >
        <Link
          to="/urun/$sku"
          params={{ sku: productSlug(product) }}
          className="img-zoom block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CatalogImg
            src={product.image}
            alt={product.name}
            priority={priority}
            className="aspect-square w-full object-contain p-3"
          />
        </Link>
        <span className="absolute top-2 left-2 flex items-center gap-1.5">
          <SampleBadge product={product} />
        </span>
        <div className="absolute top-1 right-1 flex flex-col">
          <WishButton sku={product.sku} />
          <button
            type="button"
            aria-pressed={comparing}
            aria-label={comparing ? "Karşılaştırmadan çıkar" : "Karşılaştır"}
            className={cn(
              "flex size-11 items-center justify-center rounded-md bg-bg-elevated/90 text-fg hover:bg-bg",
              comparing && "bg-fg text-bg-elevated",
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const ok = toggleCompare(product.sku);
              if (!ok) toast.error(`En fazla ${COMPARE_MAX} ürün`);
            }}
          >
            <ArrowLeftRight className="size-4" />
          </button>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-md bg-bg-elevated/90 text-fg hover:bg-bg"
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
      <div className="flex flex-1 flex-col gap-1 border-x border-b border-solid border-border bg-bg-elevated px-3 pt-3 pb-3">
        <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">
          {product.brand ?? cat?.name}
        </p>
        <h3 className="font-display text-lg leading-snug">
          <Link
            to="/urun/$sku"
            params={{ sku: productSlug(product) }}
            className="product-title text-fg hover:text-taba"
          >
            {product.name}
          </Link>
        </h3>
        {conc ? <p className="font-mono text-xs text-fg-muted">{conc.short}</p> : null}
        {score ? (
          <p className="font-mono text-xs tabular-nums" aria-label={`${score.rating} / 5, ${score.count}`}>
            {score.rating.toLocaleString("tr-TR")} · {score.count}
          </p>
        ) : null}
        <p className="font-mono text-sm tabular-nums">
          {sizes.length > 1 ? `${formatPrice(from)}'den` : formatPrice(from)}
        </p>
        {inCart ? <p className="font-mono text-xs text-taba">Sepette</p> : null}
        <div className="mt-3">
          <Button
            variant="outline"
            size="sm"
            className="h-auto min-h-9 px-2 py-2 leading-tight"
            onClick={() => {
              add(product.sku, chosen, 1);
              toastAdded(`${product.name}${chosenSize.ml ? ` · ${chosenSize.ml} ml` : ""}`);
            }}
          >
            {inCart ? "Bir tane daha" : chosenSize.ml ? `${chosenSize.ml} ml sepete ekle` : "Sepete ekle"}
          </Button>
        </div>
      </div>
    </article>
  );
}
