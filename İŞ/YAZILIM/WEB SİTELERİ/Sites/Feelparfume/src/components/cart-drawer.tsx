import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Trash2, X } from "lucide-react";
import {
  cartCount,
  cartHasPendingPrice,
  cartLineDisplay,
  chargedSubtotal,
  discoveryCart,
  shippingFor,
  useCart,
} from "@/lib/cart";
import { PASTEL, getColor, getProduct, productSlug } from "@/lib/products";
import { includedVat } from "@/lib/commerce";
import { formatPrice } from "@/lib/utils";
import { usePrefs } from "@/lib/prefs";
import { QtyControl } from "@/components/qty-control";
import { Button } from "@/components/ui/button";
import { PENDING_PRICE_NOTICE } from "@/lib/storefront-copy";
import { SaveForLater } from "@/components/save-for-later";
import { toastRemoved } from "@/lib/cart-toast";
import { useSiteConfig } from "@/lib/site-config-context";
import { trapTab } from "@/lib/focus";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const open = useCart((s) => s.drawerOpen);
  const close = useCart((s) => s.closeDrawer);
  const lastAdded = useCart((s) => s.lastAdded);
  const lines = useCart((s) => s.lines);
  const discovery = useCart((s) => s.discovery);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const setColor = useCart((s) => s.setColor);
  const recent = usePrefs((s) => s.recent);
  const recents = recent
    .map(getProduct)
    .filter((p): p is NonNullable<ReturnType<typeof getProduct>> => p != null)
    .slice(0, 4);
  const { shipping: shippingRule } = useSiteConfig();
  const bundle = discoveryCart(lines, discovery);
  const subtotal = chargedSubtotal(lines, discovery);
  const shipping = shippingFor(subtotal, shippingRule);
  const total = subtotal + shipping;
  const pendingPrice = cartHasPendingPrice(lines);
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastLineRef = useRef<HTMLLIElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeAfterNavigate = () => window.setTimeout(close, 0);

  useEffect(() => {
    if (!open) return;
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
  }, [open, close]);

  useEffect(() => {
    if (!open || !lastAdded) return;
    lastLineRef.current?.scrollIntoView({ block: "nearest" });
  }, [open, lastAdded]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 print:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
      inert={!open}
      data-print-hide
    >
      <button
        type="button"
        aria-label="Kapat"
        tabIndex={open ? 0 : -1}
        className={cn(
          "absolute inset-0 bg-bg-deep/40 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={close}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Sepet"
        className={cn(
          "absolute top-0 right-0 flex h-full w-full max-w-md flex-col border-l border-solid border-border bg-bg-elevated transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-solid border-border px-4">
          <h2 className="font-display text-2xl">Sepet · {cartCount(lines)}</h2>
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
        <span className="sr-only" aria-live="polite">
          {lastAdded
            ? `${cartLineDisplay(lines.find((line) => line.sku === lastAdded.sku && line.color === lastAdded.color))?.name ?? lastAdded.sku} eklendi`
            : ""}
        </span>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="font-display text-2xl">Sepet boş</p>
            <p className="text-sm text-fg-muted">Koleksiyondan bir parfüm ekleyin.</p>
            <Link to="/koleksiyon" onClick={closeAfterNavigate}>
              <Button>Koleksiyona git</Button>
            </Link>
            {recents.length > 0 ? (
              <ul className="mt-8 w-full divide-y divide-solid divide-border border-t border-solid border-border text-left">
                {recents.map((p) => (
                  <li key={p.sku}>
                    <Link
                      to="/urun/$sku"
                      params={{ sku: productSlug(p) }}
                      onClick={closeAfterNavigate}
                      className="flex items-center gap-3 py-3"
                    >
                      <img
                        src={p.image}
                        alt=""
                        className="size-12 object-contain"
                        width={1500}
                        height={1500}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display">{p.name}</span>
                        <span className="font-mono text-xs text-fg-muted">{p.sku}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-4">
              {lines.map((line) => {
                const p = cartLineDisplay(line);
                if (!p) return null;
                const color = getColor(line.color);
                const isLast = lastAdded?.sku === line.sku && lastAdded.color === line.color;
                return (
                  <li
                    key={`${line.sku}-${line.color}`}
                    ref={isLast ? lastLineRef : undefined}
                    className={cn(
                      "flex gap-3 border-b border-solid border-border py-4",
                      isLast && "-mx-4 bg-bg-wash px-4",
                    )}
                  >
                    <a
                      href={p.href}
                      onClick={closeAfterNavigate}
                      aria-label={p.name}
                      className="size-20 shrink-0 overflow-hidden"
                      style={{ backgroundColor: p.catalog ? undefined : PASTEL[line.color] }}
                    >
                      <img
                        src={p.image}
                        alt=""
                        className="size-full object-contain"
                        width={1500}
                        height={1500}
                      />
                    </a>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <a
                          href={p.href}
                          onClick={closeAfterNavigate}
                          className="font-display text-lg leading-tight"
                        >
                          {p.name}
                        </a>
                        <button
                          type="button"
                          className="flex size-11 shrink-0 items-center justify-center text-fg-muted hover:text-danger"
                          aria-label="Kaldır"
                          onClick={() => {
                            remove(line.sku, line.color);
                            toastRemoved(p.name);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      {isLast ? (
                        <p className="font-mono text-xs text-taba">Az önce eklendi</p>
                      ) : null}
                      {p.catalog ? (
                        <p className="mt-1 text-xs text-fg-muted">{p.code}</p>
                      ) : (
                        <>
                          <p className="mt-1 flex items-center gap-2 text-xs text-fg-muted">
                            {color?.name}
                          </p>
                        </>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <QtyControl
                          value={line.qty}
                          onChange={(n) => setQty(line.sku, line.color, n)}
                        />
                        <span className="font-mono text-sm">
                          {bundle ? "" : p.price == null ? "Fiyat teyidi" : formatPrice(p.price * line.qty)}
                        </span>
                      </div>
                      {!p.catalog ? <SaveForLater sku={line.sku} color={line.color} /> : null}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-border p-4">
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-fg-muted">{pendingPrice ? "Bilinen toplam" : "Toplam"}</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
              </div>
              {pendingPrice ? (
                <p className="mb-2 text-xs text-fg-muted">{PENDING_PRICE_NOTICE}</p>
              ) : null}
              <p className="mb-3 text-xs text-fg-muted">
                KDV dahil {formatPrice(includedVat(total))}
              </p>
              <Link
                to={pendingPrice ? "/teklif" : "/odeme"}
                search={pendingPrice ? { not: PENDING_PRICE_NOTICE } : undefined}
                onClick={closeAfterNavigate}
                className="block"
              >
                <Button className="w-full" size="lg">
                  {pendingPrice ? "Fiyat ve stok teklifi al" : "Ödemeye geç"}
                </Button>
              </Link>
              <Link
                to="/kurumsal-teklif"
                search={{
                  sku: lines.length === 1 ? lines[0].sku : undefined,
                  renk: lines[0]?.color,
                  not: lines
                    .map((l) => `${l.sku} ${getColor(l.color)?.name ?? l.color}`)
                    .join(" · "),
                }}
                onClick={closeAfterNavigate}
                className="mt-2 block text-center text-sm text-fg-muted hover:text-fg"
              >
                50+ adet kurumsal teklif
              </Link>
              <button
                type="button"
                className="mt-2 h-11 w-full text-sm text-fg-muted hover:text-fg"
                onClick={close}
              >
                Alışverişe devam
              </button>
              <Link
                to="/sepet"
                onClick={closeAfterNavigate}
                className="mt-3 block text-center text-sm text-fg-muted hover:text-fg"
              >
                Sepet sayfası
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
