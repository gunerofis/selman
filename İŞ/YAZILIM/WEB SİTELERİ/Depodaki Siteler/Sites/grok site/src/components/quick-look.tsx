import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { toast } from "sonner";
import { toastAdded } from "@/lib/cart-toast";
import { PASTEL, getColor, productSlug } from "@/lib/products";
import { parseOuterDims } from "@/lib/scale";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { useQuickLook } from "@/lib/quick-look";
import { formatPrice } from "@/lib/utils";
import { ColorSwatches } from "@/components/color-swatch";
import { WishButton } from "@/components/wish-button";
import { Button } from "@/components/ui/button";
import { QtyControl } from "@/components/qty-control";
import { BuyAssurance } from "@/components/buy-assurance";
import { PlaceLine } from "@/components/fit-context";
import { useState } from "react";
import type { ColorId } from "@/lib/products";
import { trapTab } from "@/lib/focus";

export function QuickLook() {
  const product = useQuickLook((s) => s.product);
  const initial = useQuickLook((s) => s.color);
  const close = useQuickLook((s) => s.close);
  const add = useCart((s) => s.add);
  const lastColor = usePrefs((s) => s.lastColor);
  const rememberColor = usePrefs((s) => s.rememberColor);
  const [color, setColor] = useState<ColorId>(initial ?? lastColor);
  const [qty, setQty] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setColor(initial ?? lastColor);
    setQty(1);
  }, [initial, lastColor, product?.sku]);

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
  const meta = getColor(color);
  const dims = parseOuterDims(product);

  return (
    <div className="fixed inset-0 z-50 print:hidden" data-print-hide>
      <button type="button" aria-label="Kapat" className="absolute inset-0 bg-bg-deep/40" onClick={close} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="absolute inset-x-4 top-[10vh] mx-auto max-h-[80dvh] max-w-3xl overflow-y-auto border border-dashed border-border bg-bg md:inset-x-auto"
      >
        <div className="flex h-12 items-center justify-between border-b border-dashed border-border px-4">
          <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Hızlı bakış</p>
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
          <div className="wash-shift aspect-square" style={{ backgroundColor: PASTEL[color] }}>
            <img src={product.image} alt="" className="size-full object-contain p-6" />
          </div>
          <div className="flex flex-col gap-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] text-fg-muted">{product.sku}</p>
                <h2 className="mt-1 font-display text-3xl">{product.name}</h2>
                <p className="mt-2 text-sm text-fg-muted">{product.tagline}</p>
              </div>
              <WishButton sku={product.sku} />
            </div>
            <p className="font-mono text-xl">{formatPrice(product.price)}</p>
            <PlaceLine category={product.category} />
            {product.specs.find((s) => s.label === "Dış ölçü") ? (
              <p className="font-mono text-xs text-fg-muted">
                {product.specs.find((s) => s.label === "Dış ölçü")?.value}
              </p>
            ) : null}
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Renk</span>
                <span className="font-mono text-fg-muted">{meta?.name}</span>
              </div>
              <ColorSwatches
                named
                value={color}
                onChange={(id) => {
                  setColor(id);
                  rememberColor(id);
                }}
              />
              <p className="mt-2 font-mono text-[11px] text-fg-muted">Zemin boyanır, deri fotoğrafı değil.</p>
            </div>
            <div className="mt-auto flex flex-col gap-3">
              <QtyControl value={qty} onChange={setQty} />
              <BuyAssurance price={product.price} />
              <Button
                size="lg"
                onClick={() => {
                  rememberColor(color);
                  add(product.sku, color, qty);
                  toastAdded(product.name);
                  close();
                }}
              >
                Sepete ekle · {formatPrice(product.price * qty)}
              </Button>
              <Link
                to="/urun/$sku"
                params={{ sku: productSlug(product) }}
                search={{ renk: color }}
                onClick={close}
              >
                <Button variant="outline" className="w-full">
                  Ürün sayfası
                </Button>
              </Link>
              <p className="flex flex-wrap gap-x-3 text-xs text-fg-muted">
                <Link
                  to="/tasarla"
                  search={{
                    en: dims ? String(dims.w) : undefined,
                    boy: dims?.d ? String(dims.d) : undefined,
                    yuk: dims?.h ? String(dims.h) : undefined,
                    renk: color,
                  }}
                  onClick={close}
                  className="text-taba hover:underline"
                >
                  Ölçüye göre
                </Link>
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
