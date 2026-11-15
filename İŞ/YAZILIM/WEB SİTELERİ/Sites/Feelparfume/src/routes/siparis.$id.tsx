import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PASTEL, getColor } from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RecentRail } from "@/components/recent-rail";
import { PrintButton } from "@/components/print-button";
import { toast } from "sonner";
import { payLabel } from "@/lib/commerce";
import { cartLineDisplay, type CartLine } from "@/lib/cart";
import { fulfillmentLabel, paymentLabel } from "@/lib/order-mail";

export const Route = createFileRoute("/siparis/$id")({
  loader: async ({ params }) => {
    const { publicOrderStatus } = await import("@/lib/commerce.server");
    return { status: await publicOrderStatus(params.id) };
  },
  component: OrderDone,
  head: ({ params }) =>
    pageHead({
      title: `Sipariş ${params.id}`,
      description: "Sipariş özeti.",
      path: `/siparis/${params.id}`,
      noindex: true,
    }),
});

type StoredOrder = {
  id: string;
  name: string;
  city: string;
  district?: string;
  postal?: string;
  note?: string;
  pay: string;
  total: number;
  hidePrices?: boolean;
  giftWrap?: boolean;
  giftNote?: string;
  mail?: string;
  received?: boolean;
  items: CartLine[];
};

function OrderDone() {
  const { id } = Route.useParams();
  const { status } = Route.useLoaderData();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sweb-last-order");
      if (raw) {
        const parsed = JSON.parse(raw) as StoredOrder;
        if (parsed.id === id && parsed.received) setOrder(parsed);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [id]);

  if (!ready) {
    return <div className="mx-auto max-w-xl px-4 py-16 text-sm text-fg-muted">Yükleniyor…</div>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-xs tracking-[0.28em] text-fg-muted uppercase">Sipariş</p>
        <h1 className="mt-3 font-display text-5xl">Özet bu tarayıcıda yok</h1>
        <p className="mt-4 break-all font-mono text-sm">{id}</p>
        {status ? (
          <p className="mt-3 text-sm">
            {fulfillmentLabel(status.shipping)} · {paymentLabel(status.payment)}
            {status.trackingUrl ? (
              <>
                {" · "}
                <a className="text-taba hover:underline" href={status.trackingUrl} rel="noreferrer">
                  Takip {status.tracking}
                </a>
              </>
            ) : null}
          </p>
        ) : null}
        <p className="mt-4 text-sm">
          <a className="text-taba hover:underline" href={`/api/fatura/${id}`}>
            Fatura
          </a>
        </p>
        <p className="mt-4 text-sm text-fg-muted">
          Bu numaraya ait doğrulanmış özet bu tarayıcıda yok. Bu, sunucudaki kaydın silindiği
          anlamına gelmez. Sipariş numaranızı saklayın ve bizimle paylaşın.
        </p>
        <Link to="/koleksiyon" className="mt-8 inline-block">
          <Button>Koleksiyona dön</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-xs tracking-[0.28em] text-fg-muted uppercase">Sipariş talebi alındı</p>
        <h1 className="mt-3 font-display text-5xl">Teşekkürler</h1>
        <p className="mt-4 text-sm text-fg-muted">
          Sipariş numaranız{" "}
          <button
            type="button"
            className="font-medium text-fg hover:text-taba"
            onClick={() => {
              void navigator.clipboard?.writeText(order.id);
              toast.success("Sipariş numarası kopyalandı");
            }}
          >
            {order.id}
          </button>
          {` · ${order.name}, ${order.district ? `${order.district}, ` : ""}${order.city}`}
          {` · ${payLabel(order.pay)}`}
        </p>
        <ul className="mt-8 divide-y divide-solid divide-border border-y border-solid border-border text-left">
          {order.items.map((l) => {
            const p = cartLineDisplay(l);
            const c = getColor(l.color);
            if (!p) return null;
            return (
              <li
                key={`${l.sku}-${l.color}`}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <a href={p.href} className="flex min-w-0 flex-1 items-center gap-3">
                  <img
                    src={p.image}
                    alt=""
                    className="size-14 object-contain"
                    style={{ backgroundColor: PASTEL[l.color] }}
                    width={1500}
                    height={1500}
                  />
                  <span className="min-w-0">
                    {p.name}
                    <span className="block text-xs text-fg-subtle">
                      {p.catalog ? p.code : c?.name} × {l.qty}
                    </span>
                  </span>
                </a>
                <span className="tabular-nums">
                  {p.price == null ? "Fiyat teyidi" : formatPrice(p.price * l.qty)}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-sm">
          Toplam {formatPrice(order.total)} · {payLabel(order.pay)}
          {status ? ` · ${fulfillmentLabel(status.shipping)} · ${paymentLabel(status.payment)}` : ""}
        </p>
        {status?.trackingUrl ? (
          <p className="mt-2 text-sm">
            <a className="text-taba hover:underline" href={status.trackingUrl} rel="noreferrer">
              Takip {status.tracking}
            </a>
          </p>
        ) : null}
        {order.giftWrap ? <p className="mt-2 text-sm">Hediye paketi</p> : null}
        {order.giftNote ? <p className="mt-2 text-sm">{order.giftNote}</p> : null}
        {order.hidePrices ? <p className="mt-2 text-sm">Fiyatsız irsaliye</p> : null}
        <p className="mt-3 text-sm">
          <a className="text-taba hover:underline" href={`/api/fatura/${order.id}`}>
            Fatura
          </a>
          {order.hidePrices ? (
            <>
              {" · "}
              <a className="text-taba hover:underline" href={`/api/irsaliye/${order.id}`}>
                İrsaliye
              </a>
            </>
          ) : null}
        </p>
        {order.note ? (
          <p className="mt-2 text-sm text-fg-muted">Teslimat notu: {order.note}</p>
        ) : null}
        {order.mail ? (
          <p className="mt-4 text-sm">
            <a href={order.mail} className="text-taba hover:underline">
              Siparişi e-posta ile yeniden aç
            </a>
          </p>
        ) : null}
        <p className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm">
          <Link to="/teslimat" className="text-taba hover:underline">
            Teslimat
          </Link>
          <Link to="/iade" className="text-taba hover:underline">
            İade
          </Link>
          <Link to="/cayma" className="text-taba hover:underline">
            Cayma
          </Link>
          <Link to="/garanti" className="text-taba hover:underline">
            Garanti
          </Link>
          <Link to="/siparis-sorgu" className="text-taba hover:underline">
            Sorgula
          </Link>
          <Link to="/iletisim" className="text-taba hover:underline">
            Yazın
          </Link>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <PrintButton label="Özeti yazdır" />
          <Link to="/koleksiyon">
            <Button>Koleksiyona dön</Button>
          </Link>
          <Link
            to="/teklif"
            search={{
              sku: order.items.length === 1 ? order.items[0].sku : undefined,
              renk: order.items[0]?.color,
              not: order.items.map((i) => i.sku).join(" "),
            }}
          >
            <Button variant="outline">50+ adet teklif</Button>
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-[1400px] px-4 pb-16">
        <RecentRail heading="Yanına bakın" />
      </div>
    </>
  );
}
