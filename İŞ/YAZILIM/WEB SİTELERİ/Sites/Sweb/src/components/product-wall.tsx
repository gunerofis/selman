import { useEffect, useId, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PASTEL, type ColorId } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useCart, type CartCatalogItem } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/lib/site-config-context";
import { useCatalogLine } from "@/lib/catalog-context";
import { toastAdded } from "@/lib/cart-toast";

type Props = {
  color?: ColorId;
  onColor: (id: ColorId | undefined) => void;
};

export function ProductWall({ color }: Props) {
  const siteConfig = useSiteConfig();
  const line = useCatalogLine("/saat-mucevher-kutulari");
  const watchItems = useMemo(() => {
    const newWatchBoxes = line.items.filter((item) => item.id.startsWith("gnrs"));
    const jewelryBoxes = line.items.filter((item) => item.filter === "mucevher");
    const otherWatchBoxes = line.items.filter(
      (item) =>
        item.filter === "saat" &&
        !item.id.startsWith("gnrs") &&
        !item.id.startsWith("gercek-deri-") &&
        item.id !== "P-7001",
    );

    // Ortada bir yeni ürün; çevrede 10 yeni ürün, 3 mücevher ve 3 saat kutusu.
    return [
      newWatchBoxes[0],
      newWatchBoxes[1],
      newWatchBoxes[2],
      jewelryBoxes[0],
      newWatchBoxes[3],
      otherWatchBoxes[0],
      newWatchBoxes[4],
      newWatchBoxes[5],
      jewelryBoxes[1],
      newWatchBoxes[6],
      otherWatchBoxes[1],
      newWatchBoxes[7],
      newWatchBoxes[8],
      jewelryBoxes[2],
      newWatchBoxes[9],
      otherWatchBoxes[2],
      newWatchBoxes[10],
    ].filter((item): item is (typeof line.items)[number] => Boolean(item));
  }, [line.items]);
  const [order, setOrder] = useState<string[]>(() => watchItems.map((item) => item.id));
  const liveId = useId();
  const [live, setLive] = useState("");
  const wash = color ? PASTEL[color] : undefined;
  const center = watchItems.find((item) => item.id === order[0]) ?? watchItems[0];
  const surround = order.slice(1);
  const addCatalog = useCart((state) => state.addCatalog);

  useEffect(() => {
    setOrder((previous) => {
      const available = new Set(watchItems.map((item) => item.id));
      const retained = previous.filter((id) => available.has(id));
      const added = watchItems.map((item) => item.id).filter((id) => !retained.includes(id));
      return [...retained, ...added];
    });
  }, [watchItems]);

  useEffect(() => {
    if (!center) return;
    setLive(`Merkezde ${center.name}, ürün kodu ${center.code ?? center.id}`);
  }, [center]);

  if (!center) return null;

  const cartItem = (item: typeof center): CartCatalogItem => ({
    lineKey: "clik",
    itemId: item.id,
    path: line.to,
    name: item.name,
    image: item.image,
    price: item.price,
    code: item.code,
    kind: item.kind,
  });

  return (
    <section className="px-4 pt-6 pb-10">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5">
        <div className="flex flex-col gap-4 border border-dashed border-border bg-bg-wash px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
          <h1 className="min-w-0 font-display text-3xl leading-tight sm:text-5xl">
            {siteConfig.storefront.heroTitle}
          </h1>
          <Link to="/saat-mucevher-kutulari" search={{ tur: "saat" }} className="shrink-0">
            <Button size="lg" className="w-full sm:w-auto sm:px-8">
              {siteConfig.storefront.heroButton}
            </Button>
          </Link>
        </div>

        <p id={liveId} className="sr-only" aria-live="polite">
          {live}
        </p>

        <div className="w-full">
          <div
            className="product-wall-grid grid grid-cols-2 gap-px md:grid-cols-5 md:grid-rows-5"
            style={{ backgroundColor: "var(--color-border)" }}
          >
            <article
              id={`${liveId}-center`}
              className="wall-center relative col-span-2 flex min-h-0 flex-col overflow-hidden md:col-span-3 md:col-start-2 md:row-start-2 md:row-span-3"
              style={{
                backgroundColor: wash ?? "var(--color-bg-wash)",
                viewTransitionName: `tile-${center.id}`,
              }}
            >
              <Link
                to="/saat-mucevher-kutulari/$id"
                params={{ id: center.id }}
                className="relative flex aspect-[4/3] md:absolute md:inset-0 md:aspect-auto"
                aria-label={center.name}
              >
                <img
                  src={center.image}
                  srcSet={center.imageSrcSet}
                  sizes="(min-width: 768px) 60vw, 100vw"
                  alt={center.name}
                  width={1500}
                  height={1500}
                  fetchPriority="high"
                  className="h-full w-full object-contain p-1 sm:p-2"
                />
              </Link>
              <div className="relative z-10 flex flex-col gap-1.5 border-t border-border/40 px-3 py-3 sm:px-5 sm:py-4 md:absolute md:inset-x-0 md:bottom-0 md:mt-auto md:gap-1.5 md:border-0 md:px-6 md:pt-16 md:pb-6 md:[text-shadow:0_1px_14px_rgba(255,255,255,0.92)]">
                <Link
                  to="/saat-mucevher-kutulari/$id"
                  params={{ id: center.id }}
                  className="font-display text-lg leading-tight font-normal text-fg transition-colors hover:text-taba sm:text-2xl md:text-3xl"
                >
                  {center.name}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p className="font-mono text-sm tracking-wide text-fg">
                    {center.price == null ? "Fiyat teyidi bekliyor" : formatPrice(center.price)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Button
                      size="sm"
                      onClick={() => {
                        addCatalog(cartItem(center));
                        toastAdded(center.name);
                      }}
                    >
                      Sepete ekle
                    </Button>
                    <Link to="/tasarla" search={{ istek: `${center.name} — özel ölçü ve renk` }}>
                      <Button size="sm" variant="outline">
                        Kişiselleştir
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {surround.map((id, i) => {
              const p = watchItems.find((item) => item.id === id);
              if (!p) return null;
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={`${p.name} ürününü merkeze getir`}
                  aria-controls={`${liveId}-center`}
                  title={p.name}
                  onClick={() => {
                    setOrder((previous) => {
                      const selectedIndex = previous.indexOf(id);
                      if (selectedIndex <= 0) return previous;
                      const next = [...previous];
                      [next[0], next[selectedIndex]] = [next[selectedIndex], next[0]];
                      return next;
                    });
                  }}
                  className={cn(
                    "wall-tile relative flex aspect-square min-h-0 flex-col overflow-hidden hover:z-10 md:aspect-auto",
                    i >= 6 && "max-md:hidden",
                  )}
                  style={{
                    backgroundColor: wash ?? "var(--color-bg-wash)",
                    animationDelay: `${i * 40}ms`,
                    viewTransitionName: `tile-${p.id}`,
                  }}
                >
                  <img
                    src={p.image}
                    srcSet={p.imageSrcSet}
                    sizes="20vw"
                    alt={p.name}
                    width={1500}
                    height={1500}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-contain p-0.5 sm:p-1"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-center font-mono text-xs text-fg-muted">
          Saat kutusuna dokunarak merkeze getirin. Detaylar için merkezdeki ürüne dokunun.
        </p>
      </div>
    </section>
  );
}
