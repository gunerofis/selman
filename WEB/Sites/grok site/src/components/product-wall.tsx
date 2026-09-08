import { useEffect, useId, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  PASTEL,
  WALL_SKUS,
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

export function ProductWall({ color }: Props) {
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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <div className="flex flex-col gap-4 border border-dashed border-border bg-bg-wash px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
          <h1 className="min-w-0 font-display text-3xl leading-tight sm:text-5xl">
            Hayal edin sizin için üretelim
          </h1>
          <Link to="/tasarla" className="shrink-0">
            <Button size="lg" className="w-full sm:w-auto sm:px-8">
              Tasarımı gönder
            </Button>
          </Link>
        </div>

        <p id={liveId} className="sr-only" aria-live="polite">
          {live}
        </p>

        <div className="w-full">
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
