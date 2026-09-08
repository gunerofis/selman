"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "bucuruktoys-quote-quantities-v2";

function readOffer() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}") as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).filter(([id, quantity]) => /^\d+$/.test(id) && Number.isInteger(quantity) && Number(quantity) > 0),
    ) as Record<string, number>;
  } catch {
    return {};
  }
}

export default function QuoteButton({ id, sku, name }: { id: number; sku: string; name: string }) {
  const [selected, setSelected] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSelected(Boolean(readOffer()[String(id)]));
    setReady(true);
  }, [id]);

  function toggle() {
    const offer = readOffer();
    if (offer[String(id)]) delete offer[String(id)];
    else offer[String(id)] = 1;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(offer));
    setSelected(Boolean(offer[String(id)]));
    if (!selected) {
      void fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({ eventType: "offer_add", productId: id, sku }),
      }).catch(() => undefined);
    }
  }

  return <div className="product-quote-actions">
    <button type="button" className={selected ? "selected" : ""} onClick={toggle} disabled={!ready}>
      <span aria-hidden="true">{selected ? "✓" : "+"}</span>
      {selected ? "Teklif listesinde" : "Teklif listeme ekle"}
    </button>
    <a href="/urunler?teklif=ac#products">Teklif listemi aç</a>
    <span className="product-quote-status" role="status" aria-live="polite">{selected ? `${name} 1 adet olarak listeye eklendi; miktarı teklif listesinde değiştirebilirsiniz.` : ""}</span>
  </div>;
}
