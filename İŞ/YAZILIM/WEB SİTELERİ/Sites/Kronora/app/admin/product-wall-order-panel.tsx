"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { applyProductWallOrder, buildProductWallModels } from "../lib/product-wall";
import type { StoreProduct } from "../lib/store";

export default function ProductWallOrderPanel({ products, savedOrder, busy, onSave }: { products: StoreProduct[]; savedOrder?: string; busy: boolean; onSave: (order: string[]) => void }) {
  const [ordered, setOrdered] = useState(() => applyProductWallOrder(buildProductWallModels(products), savedOrder));
  const [draggedSlug, setDraggedSlug] = useState<string | null>(null);

  function move(from: number, to: number) {
    if (to < 0 || to >= ordered.length || from === to) return;
    setOrdered((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function shuffle() {
    setOrdered((current) => {
      const next = [...current];
      for (let index = next.length - 1; index > 0; index -= 1) {
        const target = Math.floor(Math.random() * (index + 1));
        [next[index], next[target]] = [next[target], next[index]];
      }
      return next;
    });
  }

  return (
    <section className="admin-section wall-order-panel">
      <div className="admin-section-head">
        <div><h2>Ürün duvarı sırası</h2><p>Çevrede 20 model sabit kalır. Geniş ekranda 20, tablette 16, telefonda 12 model görünür; merkez seçili modelin ayrı önizlemesidir.</p></div>
        <div className="wall-order-actions"><button type="button" className="table-action" onClick={shuffle} disabled={busy}>Karıştır</button><button type="button" className="admin-primary" onClick={() => onSave(ordered.map((model) => model.key))} disabled={busy}>Kaydet</button></div>
      </div>
      <div className="wall-order-breakpoints" aria-label="Duvar kırılımları"><span><b>6×6</b> 20 çevre</span><span><b>5×5</b> 16 çevre</span><span><b>4×4</b> 12 çevre</span></div>
      <ol className="wall-order-list">
        {ordered.map((model, index) => (
          <li
            key={model.key}
            draggable
            onDragStart={() => setDraggedSlug(model.key)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              const from = ordered.findIndex((item) => item.key === draggedSlug);
              if (from >= 0) move(from, index);
              setDraggedSlug(null);
            }}
          >
            <span className="wall-order-handle" aria-hidden="true">⠿</span>
            <b>{String(index + 1).padStart(2, "0")}</b>
            <img src={model.variants.bordo.primaryImage} alt="" />
            <div><strong>{model.name}</strong><small>{model.concept ? "Konsept · 5 renk · Yakında" : "Satışta · 5 renk"} · {index < 12 ? "Tüm ekranlar" : index < 16 ? "Tablet ve geniş ekran" : "Yalnız geniş ekran"}</small></div>
            <div className="wall-order-row-actions">
              <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0 || busy} aria-label={`Yukarı taşı: ${model.name}`}>↑</button>
              <button type="button" onClick={() => move(index, index + 1)} disabled={index === ordered.length - 1 || busy} aria-label={`Aşağı taşı: ${model.name}`}>↓</button>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
