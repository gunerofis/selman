import { useEffect, useId, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  COLORS,
  PASTEL,
  WALL_SKUS,
  PRODUCT_COUNT,
  getProduct,
  productImageVariant,
  productSlug,
  type ColorId,
} from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { WishButton } from "@/components/wish-button";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  color?: ColorId;
  onColor: (id: ColorId | undefined) => void;
};

export function ProductWall({ color, onColor }: Props) {
  const [order, setOrder] = useState<string[]>(() => [...WALL_SKUS]);
  const liveId = useId();
  const [live, setLive] = useState("");
  const wash = color ? PASTEL[color] : undefined;
  const center = getProduct(order[0]);
  const surround = order.slice(1);
  const navigate = useNavigate();
  const add = useCart((s) => s.add);
  const lastColor = usePrefs((s) => s.lastColor);
  const rememberColor = usePrefs((s) => s.rememberColor);
  const cartColor = color ?? lastColor;

  useEffect(() => {
    if (!center) return;
    setLive(`Merkezde ${center.name}, stok ${center.sku}`);
  }, [center]);

  function swap(sku: string) {
    const run = () => {
      setOrder((prev) => {
        const i = prev.indexOf(sku);
        if (i <= 0) return prev;
        const next = [...prev];
        const tmp = next[0];
        next[0] = next[i];
        next[i] = tmp;
        return next;
      });
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (!reduced && typeof doc.startViewTransition === "function") {
      doc.startViewTransition(run);
    } else {
      run();
    }
  }

  if (!center) return null;

  return (
    <section className="px-3 pt-6 pb-10 sm:px-6">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-wide text-fg-muted">
              Sweb · {PRODUCT_COUNT} parça
            </p>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl">Düzen ürünleri</h1>
          </div>
          <div
            className="flex max-w-full flex-wrap items-center gap-1 overflow-x-auto"
            role="radiogroup"
            aria-label="Deri renk"
          >
            <button
              type="button"
              role="radio"
              aria-checked={!color}
              onClick={() => onColor(undefined)}
              className={cn(
                "h-11 shrink-0 border px-3 font-mono text-xs transition-colors duration-200",
                !color
                  ? "border-taba text-fg"
                  : "border-border-strong text-fg-muted hover:border-taba",
              )}
            >
              Tümü
            </button>
            {COLORS.map((c) => {
              const selected = color === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => onColor(selected ? undefined : c.id)}
                  className="flex size-11 shrink-0 items-center justify-center"
                >
                  <span
                    className={cn(
                      "swatch-dot size-5 border border-border-strong",
                      selected && "is-on outline-2 outline-offset-2 outline-taba",
                    )}
                    style={{ backgroundColor: c.swatch }}
                  />
                </button>
              );
            })}
            <span className="shrink-0 px-1 font-mono text-xs text-fg-muted">
              {color
                ? `${COLORS.find((c) => c.id === color)?.name} · örnek fotoğraf`
                : "8 renk, örnek fotoğraf"}
            </span>
          </div>
        </div>

        <p id={liveId} className="sr-only" aria-live="polite">
          {live}
        </p>

        <div className="mx-auto w-full max-w-6xl">
          <div
            className="product-wall-grid grid grid-cols-4 grid-rows-4 gap-px md:grid-cols-5 md:grid-rows-5 min-[1440px]:grid-cols-6 min-[1440px]:grid-rows-6"
            style={{ backgroundColor: "var(--color-border)" }}
          >
            <article
              className="wall-center relative col-span-2 col-start-2 row-span-2 row-start-2 flex min-h-0 flex-col overflow-hidden md:col-end-5 md:row-end-5 min-[1440px]:col-end-6 min-[1440px]:row-end-6"
              style={{
                backgroundColor: wash ?? "var(--color-bg-wash)",
                viewTransitionName: `tile-${center.sku}`,
              }}
            >
              <WishButton sku={center.sku} className="absolute top-2 right-2 z-20" />
              <Link
                to="/urun/$sku"
                params={{ sku: productSlug(center) }}
                search={color ? { renk: color } : undefined}
                className="absolute inset-0 flex"
                aria-label={center.name}
              >
                <img
                  src={productImageVariant(center.image, 800)}
                  alt=""
                  width={1500}
                  height={1500}
                  fetchPriority="high"
                  className="h-full w-full object-contain p-3 sm:p-6"
                />
              </Link>
              <div className="absolute inset-x-3 bottom-3 z-10 flex flex-col gap-1 border border-fg/20 bg-bg-elevated/55 px-3 py-3 backdrop-blur-[2px] sm:inset-x-5 sm:bottom-5 sm:px-5 sm:py-4">
                <p className="font-mono text-xs text-fg-muted">{center.sku}</p>
                <Link
                  to="/urun/$sku"
                  params={{ sku: productSlug(center) }}
                  search={color ? { renk: color } : undefined}
                  className="font-display text-xl leading-tight text-fg hover:text-taba sm:text-3xl"
                >
                  {center.name}
                </Link>
                <p className="hidden text-sm text-fg-muted sm:block">{center.tagline}</p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-sm">{formatPrice(center.price)}</p>
                  <Button
                    size="sm"
                    onClick={() => {
                      rememberColor(cartColor);
                      add(center.sku, cartColor, 1);
                      toast.success(`${center.name} sepete eklendi`);
                    }}
                  >
                    Sepete ekle
                  </Button>
                </div>
              </div>
            </article>

            {surround.map((sku, i) => {
              const p = getProduct(sku);
              if (!p) return null;
              return (
                <button
                  key={sku}
                  type="button"
                  aria-label={`${p.name} merkeze al`}
                  title={p.name}
                  onClick={() => swap(sku)}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    void navigate({
                      to: "/urun/$sku",
                      params: { sku: productSlug(p) },
                      search: color ? { renk: color } : undefined,
                    });
                  }}
                  className={cn(
                    "wall-tile relative flex min-h-0 flex-col overflow-hidden hover:z-10",
                    i >= 12 && "max-md:hidden",
                    i >= 16 && "max-[1439px]:hidden",
                  )}
                  style={{
                    backgroundColor: wash ?? "var(--color-bg-wash)",
                    animationDelay: `${i * 40}ms`,
                    viewTransitionName: `tile-${sku}`,
                  }}
                >
                  <img
                    src={productImageVariant(p.image, 320)}
                    alt=""
                    width={1500}
                    height={1500}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-contain p-1.5 sm:p-2"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-center font-mono text-xs text-fg-muted">
          Çevre kareye dokun: merkeze alır. Çift tık: ürün sayfası. Renk zemini boyar.
        </p>
      </div>
    </section>
  );
}
