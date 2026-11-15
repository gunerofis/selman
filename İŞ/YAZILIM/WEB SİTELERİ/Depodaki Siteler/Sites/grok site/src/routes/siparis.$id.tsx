import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PASTEL, getColor, getProduct, productSlug } from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import type { ColorId } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { RecentRail } from "@/components/recent-rail";
import { EtaLine } from "@/components/eta-line";
import { PrintButton } from "@/components/print-button";
import { toast } from "sonner";
import { BRAND } from "@/lib/brand";
import { payLabel } from "@/lib/commerce";

export const Route = createFileRoute("/siparis/$id")({
  component: OrderDone,
  head: ({ params }) =>
    pageHead({
      title: `Sipariş ${params.id}`,
      description: "Sipariş özeti. Kart tahsilatı yoktur.",
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
  mail?: string;
  items: { sku: string; color: ColorId; qty: number }[];
};

function OrderDone() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sweb-last-order");
      if (raw) {
        const parsed = JSON.parse(raw) as StoredOrder;
        if (parsed.id === id) setOrder(parsed);
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
        <h1 className="mt-3 font-display text-5xl">Kayıt bulunamadı</h1>
        <p className="mt-4 text-sm text-fg-muted">
          Bu numaraya ait sipariş bu tarayıcıda yok. {BRAND.email} adresine yazın.
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
      <p className="text-xs tracking-[0.28em] text-fg-muted uppercase">Sipariş hazır</p>
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
        {` · ${order.name}, ${order.district ? `${order.district}, ` : ""}${order.city}`}.
      </p>
      <ol className="mx-auto mt-6 max-w-md space-y-3 text-left text-sm text-fg-muted">
        <li>
          <span className="font-mono text-[11px] text-fg">1</span> E-posta uygulamanızdaki mesajı
          gönderin. Açılmazsa {BRAND.email} adresine bu numarayla yazın.
        </li>
        <li>
          <span className="font-mono text-[11px] text-fg">2</span> Atölye hafta içi {BRAND.hours}{" "}
          işleme alır. Kart bu sitede alınmaz; {payLabel(order.pay)}.
        </li>
        <li>
          <span className="font-mono text-[11px] text-fg">3</span> Kargo penceresi
          <EtaLine className="mt-1 text-sm text-fg-muted" />
        </li>
      </ol>
      <ul className="mt-8 divide-y divide-dashed divide-border border-y border-dashed border-border text-left">
        {order.items.map((l) => {
          const p = getProduct(l.sku);
          const c = getColor(l.color);
          if (!p) return null;
          return (
            <li key={`${l.sku}-${l.color}`} className="flex items-center justify-between gap-3 py-3 text-sm">
              <Link
                to="/urun/$sku"
                params={{ sku: productSlug(p) }}
                search={{ renk: l.color }}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <img
                  src={p.image}
                  alt=""
                  className="size-14 object-contain"
                  style={{ backgroundColor: PASTEL[l.color] }}
                />
                <span className="min-w-0">
                  {p.name}
                  <span className="block text-xs text-fg-subtle">
                    {c?.name} × {l.qty}
                  </span>
                </span>
              </Link>
              <span className="tabular-nums">{formatPrice(p.price * l.qty)}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm">
        Toplam {formatPrice(order.total)} · {payLabel(order.pay)}
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
      <p className="mt-6 text-sm text-fg-muted">
        Teslimden sonra nemli bez yeter.{" "}
        <Link to="/bakim" className="text-taba hover:underline">
          Bakım
        </Link>
      </p>
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
          to="/tasarla"
          search={{
            istek: order.items
              .map((i) => getProduct(i.sku)?.shortName ?? i.sku)
              .join(", "),
            renk: order.items[0]?.color,
          }}
        >
          <Button variant="outline">Başka bir ölçü</Button>
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
