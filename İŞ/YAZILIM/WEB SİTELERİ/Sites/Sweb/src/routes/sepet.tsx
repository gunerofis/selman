import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  cartCount,
  cartHasPendingPrice,
  cartLineDisplay,
  cartSubtotal,
  shippingFor,
  useCart,
} from "@/lib/cart";
import { PASTEL, getColor } from "@/lib/products";
import { includedVat } from "@/lib/commerce";
import { pageHead } from "@/lib/seo";
import { cn, formatPrice } from "@/lib/utils";
import { ColorDot } from "@/components/color-swatch";
import { LineColorPicker } from "@/components/line-color-picker";
import { EmptyHint, QtyControl } from "@/components/qty-control";
import { RecentRail } from "@/components/recent-rail";
import { SearchRecover } from "@/components/search-recover";
import { EtaLine } from "@/components/eta-line";
import { ShippingBar } from "@/components/shipping-bar";
import { SeriesFill } from "@/components/series-fill";
import { BuyAssurance } from "@/components/buy-assurance";
import { PENDING_PRICE_NOTICE } from "@/lib/storefront-copy";
import { SaveForLater } from "@/components/save-for-later";
import { toastRemoved } from "@/lib/cart-toast";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sepet")({
  component: CartPage,
  head: () =>
    pageHead({
      title: "Sepet",
      description: "Sepet tarayıcıda tutulur.",
      path: "/sepet",
      noindex: true,
    }),
});

function CartPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const setColor = useCart((s) => s.setColor);
  const clear = useCart((s) => s.clear);
  const lastAdded = useCart((s) => s.lastAdded);
  const subtotal = cartSubtotal(lines);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  const pendingPrice = cartHasPendingPrice(lines);

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="font-display text-5xl">Sepet</h1>
        <p className="mt-4 text-sm text-fg-muted">Sepetiniz hazırlanıyor…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <EmptyHint
          title="Sepet boş"
          body="Koleksiyondan bir parça seçin — sekiz deri renk sizi bekliyor."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/koleksiyon">
                <Button>Ürünlere git</Button>
              </Link>
              <Link to="/kategori">
                <Button variant="outline">Odalar</Button>
              </Link>
              <Link to="/tasarla">
                <Button variant="outline">Tasarlayın</Button>
              </Link>
              <Link to="/son">
                <Button variant="outline">Son baktıklarınız</Button>
              </Link>
            </div>
          }
        />
        <div className="mx-auto max-w-lg">
          <SearchRecover />
        </div>
        <RecentRail heading="Son baktıklarınız — sepete ekleyin" />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 pb-[calc(7rem+var(--cookie-h,0px))] lg:grid-cols-[1fr_320px] lg:pb-10">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-5xl">Sepet</h1>
            <p className="mt-1 text-sm text-fg-muted">{cartCount(lines)} parça</p>
          </div>
          <button
            type="button"
            className="font-mono text-xs text-fg-muted hover:text-danger"
            onClick={() => {
              clear();
              toast.success("Sepet boşaltıldı");
            }}
          >
            Tümünü kaldır
          </button>
        </div>
        <ul className="mt-8 divide-y divide-dashed divide-border border-y border-dashed border-border">
          {lines.map((line) => {
            const p = cartLineDisplay(line);
            if (!p) return null;
            const color = getColor(line.color);
            const isLast = lastAdded?.sku === line.sku && lastAdded.color === line.color;
            return (
              <li
                key={`${line.sku}-${line.color}`}
                className={cn("flex gap-4 py-5", isLast && "-mx-2 bg-bg-wash px-2")}
              >
                <a
                  href={p.href}
                  className="size-24 shrink-0 overflow-hidden border border-dashed border-border sm:size-28"
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
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <a
                        href={p.href}
                        className="font-display text-xl leading-tight hover:underline"
                      >
                        {p.name}
                      </a>
                      {isLast ? (
                        <p className="font-mono text-xs text-taba">Az önce eklendi</p>
                      ) : null}
                      {p.catalog ? (
                        <p className="mt-1 text-sm text-fg-muted">{p.code}</p>
                      ) : (
                        <>
                          <p className="mt-1 flex items-center gap-2 text-sm text-fg-muted">
                            <ColorDot id={line.color} />
                            {color?.name} · {p.code}
                          </p>
                          <LineColorPicker
                            value={line.color}
                            label={`${p.name} renk`}
                            onChange={(id) => setColor(line.sku, line.color, id)}
                          />
                        </>
                      )}
                    </div>
                    <p className="text-sm tabular-nums">
                      {p.price == null ? "Fiyat teyidi" : formatPrice(p.price * line.qty)}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <QtyControl
                      value={line.qty}
                      onChange={(n) => setQty(line.sku, line.color, n)}
                    />
                    <div className="flex items-center gap-3">
                      {!p.catalog ? <SaveForLater sku={line.sku} color={line.color} /> : null}
                      <button
                        type="button"
                        className="flex size-11 items-center justify-center text-fg-muted hover:text-danger"
                        aria-label="Kaldır"
                        onClick={() => {
                          remove(line.sku, line.color);
                          toastRemoved(p.name);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <SeriesFill />
      </div>

      <aside
        className="h-fit border border-dashed border-border bg-bg-elevated p-5 lg:sticky"
        style={{ top: "calc(var(--nav-h, 4rem) + 1rem)" }}
      >
        <h2 className="font-display text-2xl">Özet</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted">{pendingPrice ? "Bilinen ara toplam" : "Ara toplam"}</dt>
            <dd className="shrink-0 whitespace-nowrap tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted">Kargo</dt>
            <dd className="shrink-0 whitespace-nowrap tabular-nums">
              {shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}
            </dd>
          </div>
        </dl>
        <div className="mt-4">
          <ShippingBar subtotal={subtotal} />
        </div>
        <div className="mt-4 flex justify-between gap-4 border-t border-border pt-4 text-base">
          <span>Toplam</span>
          <span className="shrink-0 whitespace-nowrap tabular-nums">{formatPrice(total)}</span>
        </div>
        <p className="mt-1 text-xs text-fg-muted">KDV dahil {formatPrice(includedVat(total))}</p>
        {pendingPrice ? <p className="mt-2 text-xs text-fg-muted">{PENDING_PRICE_NOTICE}</p> : null}
        <EtaLine className="mt-3 text-xs text-fg-muted" />
        <Link
          to={pendingPrice ? "/teklif" : "/odeme"}
          search={pendingPrice ? { not: PENDING_PRICE_NOTICE } : undefined}
          className="mt-5 block"
        >
          <Button className="w-full" size="lg">
            {pendingPrice ? "Fiyat ve stok teklifi al" : "Ödemeye geç"}
          </Button>
        </Link>
        <p className="mt-1 text-center font-mono text-xs text-fg-muted">
          Kart çekilmez · talebiniz kaydedilir
        </p>
        <div className="mt-3">
          <BuyAssurance />
        </div>
        <Link
          to="/teklif"
          search={{
            sku: lines.length === 1 ? lines[0].sku : undefined,
            renk: lines[0]?.color,
            not: lines
              .map(
                (l) =>
                  `${l.catalog?.code ?? l.sku} ${l.catalog ? l.catalog.name : (getColor(l.color)?.name ?? l.color)}`,
              )
              .join(" · "),
          }}
          className="mt-3 block"
        >
          <Button variant="outline" className="w-full">
            50+ adet teklif
          </Button>
        </Link>
        <Link
          to="/koleksiyon"
          className="mt-3 block text-center text-sm text-fg-muted hover:text-fg"
        >
          Alışverişe dön
        </Link>
      </aside>
      <div
        className="fixed inset-x-0 z-40 border-t border-dashed border-border bg-bg/95 p-3 print:hidden lg:hidden"
        style={{ bottom: "var(--cookie-h, 0px)" }}
        data-print-hide
      >
        <Link
          to={pendingPrice ? "/teklif" : "/odeme"}
          search={pendingPrice ? { not: PENDING_PRICE_NOTICE } : undefined}
          className="block"
        >
          <Button className="w-full" size="lg">
            {pendingPrice ? "Fiyat ve stok teklifi al" : `Ödemeye geç · ${formatPrice(total)}`}
          </Button>
        </Link>
      </div>
    </div>
  );
}
