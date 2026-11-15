import { useEffect, useState } from "react";
import { getAdminOrders, reviewOrder } from "@/lib/orders";
import type { AdminOrder } from "@/lib/order-input";
import { formatPrice } from "@/lib/utils";
import { payLabel } from "@/lib/commerce";
import { Button } from "./ui/button";

export function OrderInbox() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function refresh() {
    setBusy(true);
    try {
      setOrders(await getAdminOrders());
      setError("");
    } catch {
      setError("Siparişler yüklenemedi. Yeniden deneyin.");
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    void refresh();
  }, []);
  async function reviewed(id: string) {
    setBusy(true);
    try {
      await reviewOrder({ data: { id } });
      await refresh();
    } catch {
      setError("Durum kaydedilemedi. Yeniden deneyin.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="mx-auto max-w-[1500px] border-b border-dashed border-border px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-3xl">Sipariş talepleri</h2>
        <Button variant="outline" disabled={busy} onClick={() => void refresh()}>
          {busy ? "Yükleniyor…" : "Yenile"}
        </Button>
      </div>
      <p className="mt-2 text-sm text-fg-muted">
        Son 100 kayıt. Yeni talep: {orders.filter((order) => order.status === "new").length}. Bu
        kayıtlar ödeme tahsilatı anlamına gelmez.
      </p>
      {error && (
        <p role="alert" className="mt-4 text-danger">
          {error}
        </p>
      )}
      {!error && !busy && orders.length === 0 && (
        <p className="mt-5 text-sm text-fg-muted">Henüz sipariş talebi yok.</p>
      )}
      <div className="mt-5 space-y-3">
        {orders.map((order) => (
          <details key={order.id} className="border border-dashed border-border bg-bg-elevated p-4">
            <summary className="cursor-pointer break-words text-sm">
              {order.status === "new" ? "Yeni" : "İncelendi"} · {order.customer.name} ·{" "}
              {formatPrice(order.total)} · {order.id}
            </summary>
            <div className="mt-4 space-y-3 break-words text-sm">
              <p>
                {new Date(order.at).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })} ·{" "}
                {payLabel(order.customer.pay)}
              </p>
              <p>
                {order.customer.email} · {order.customer.phone}
              </p>
              <p>
                {order.customer.address} · {order.customer.district} / {order.customer.city} ·{" "}
                {order.customer.postal}
              </p>
              {order.customer.note && <p>Not: {order.customer.note}</p>}
              <ul>
                {order.items.map((item) => (
                  <li key={`${item.sku}:${item.color}`}>
                    {item.sku} · {item.name} · {item.colorName} × {item.qty} ·{" "}
                    {formatPrice((item.unitPrice * item.qty) / 100)}
                  </li>
                ))}
              </ul>
              <p>
                Kargo: {formatPrice(order.shipping)} · Toplam: {formatPrice(order.total)}
              </p>
              {order.status === "new" && (
                <Button disabled={busy} onClick={() => void reviewed(order.id)}>
                  İncelendi olarak işaretle
                </Button>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
