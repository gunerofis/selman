import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { toastAdded } from "@/lib/cart-toast";
import { defaultSizeId, productSizes, productSlug } from "@/lib/products";
import { concentrationOf } from "@/lib/perfume";
import { SizePicker } from "@/components/size-picker";
import { useCart } from "@/lib/cart";
import { useQuickLook } from "@/lib/quick-look";
import { formatPrice } from "@/lib/utils";
import { WishButton } from "@/components/wish-button";
import { Button } from "@/components/ui/button";
import { QtyControl } from "@/components/qty-control";
import { useState } from "react";
import type { ColorId } from "@/lib/products";
import { trapTab } from "@/lib/focus";

export function QuickLook() {
  const product = useQuickLook((s) => s.product);
  const initial = useQuickLook((s) => s.color);
  const close = useQuickLook((s) => s.close);
  const add = useCart((s) => s.add);
  const [color, setColor] = useState<ColorId>(initial ?? "");
  const [qty, setQty] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setColor(product ? (initial && productSizes(product).some((s) => s.id === initial) ? initial : defaultSizeId(product)) : "");
    setQty(1);
  }, [initial, product]);

  useEffect(() => {
    if (!product) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 20);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab" && panelRef.current) trapTab(e, panelRef.current);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lastFocus.current?.focus();
    };
  }, [product, close]);

  if (!product) return null;
  const sizes = productSizes(product);
  const size = sizes.find((s) => s.id === color) ?? sizes[0];
  const conc = concentrationOf(product.concentration);

  return (
    <div className="fixed inset-0 z-50 print:hidden" data-print-hide>
      <button
        type="button"
        aria-label="Kapat"
        className="absolute inset-0 bg-bg-deep/40"
        onClick={close}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="absolute inset-x-4 top-[10vh] mx-auto max-h-[80dvh] max-w-3xl overflow-y-auto rounded-2xl border border-solid border-border bg-bg md:inset-x-auto"
      >
        <div className="flex h-12 items-center justify-between border-b border-solid border-border px-4">
          <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Hızlı bakış</p>
          <button
            ref={closeRef}
            type="button"
            className="flex size-11 items-center justify-center"
            aria-label="Kapat"
            onClick={close}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="grid md:grid-cols-2">
          <div className="aspect-square bg-bg-wash">
            <img
              src={product.image}
              alt=""
              className="size-full object-contain p-6"
              width={1500}
              height={1500}
            />
          </div>
          <div className="flex flex-col gap-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-fg-muted">
                  {[product.brand, conc?.short].filter(Boolean).join(" · ")}
                </p>
                <h2 className="mt-1 font-display text-3xl">{product.name}</h2>
              </div>
              <WishButton sku={product.sku} />
            </div>
            <p className="font-mono text-xl">{formatPrice(size.price)}</p>
            {product.notes ? (
              <p className="text-sm text-fg-muted">
                {[...product.notes.top, ...product.notes.heart, ...product.notes.base].slice(0, 6).join(" · ")}
              </p>
            ) : null}
            <SizePicker product={product} value={size.id} onChange={setColor} />
            <div className="mt-auto flex flex-col gap-3">
              <QtyControl value={qty} onChange={setQty} />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="lg"
                  className="h-auto min-h-12 px-3 py-2 leading-tight"
                  onClick={() => {
                    add(product.sku, size.id, qty);
                    toastAdded(`${product.name}${size.ml ? ` · ${size.ml} ml` : ""}`);
                    close();
                  }}
                >
                  Sepete ekle · {formatPrice(size.price * qty)}
                </Button>
              </div>
              <Link
                to="/urun/$sku"
                params={{ sku: productSlug(product) }}
                search={{ renk: size.id }}
                onClick={close}
              >
                <Button variant="outline" className="w-full">
                  Ürün sayfası
                </Button>
              </Link>
              <p className="flex flex-wrap gap-x-3 text-xs text-fg-muted">
                <Link
                  to="/teklif"
                  search={{ sku: product.sku, renk: color }}
                  onClick={close}
                  className="text-taba hover:underline"
                >
                  50+ adet
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
