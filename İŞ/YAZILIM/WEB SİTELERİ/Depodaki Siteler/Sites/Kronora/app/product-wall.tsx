"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { WALL_COLORS, type WallColor, type WallProductModel } from "./lib/product-wall";

type WallStyle = CSSProperties & Record<`--${string}`, number | string>;

function ring(size: number, centerSize: number) {
  const start = Math.floor((size - centerSize) / 2);
  const positions: Array<[number, number]> = [];
  for (let row = 1; row <= size; row += 1) for (let column = 1; column <= size; column += 1) {
    const central = row > start && row <= start + centerSize && column > start && column <= start + centerSize;
    if (!central) positions.push([row, column]);
  }
  return positions;
}

const desktopRing = ring(6, 4);
const tabletRing = ring(5, 3);
const mobileRing = ring(4, 2);
const money = (value: number) => `${(value / 100).toLocaleString("tr-TR")} TL`;

export default function ProductWall({ models, initialColor }: { models: WallProductModel[]; initialColor: WallColor }) {
  const [selectedKey, setSelectedKey] = useState(models[0]?.key || "");
  const [color, setColor] = useState<WallColor>(initialColor);
  const [announcement, setAnnouncement] = useState("");
  const selectedModel = models.find((model) => model.key === selectedKey) || models[0];
  const center = selectedModel?.variants[color];
  if (!selectedModel || !center) return null;

  function showModel(model: WallProductModel) {
    setSelectedKey(model.key);
    setAnnouncement(`Merkezde artık ${model.name}, ${model.variants[color].color} gösteriliyor.`);
  }

  function chooseColor(nextColor: WallColor) {
    setColor(nextColor);
    setAnnouncement(`Tüm ürünlerde ${WALL_COLORS.find((item) => item.slug === nextColor)?.name} varyantı gösteriliyor.`);
    const url = new URL(window.location.href);
    url.searchParams.set("duvar", nextColor);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }

  return (
    <section className="product-wall-section" aria-labelledby="product-wall-title">
      <div className="product-wall-heading">
        <div><span>20 model · 5 renk</span><h2 id="product-wall-title">Bir modeli seçin, beş rengini karşılaştırın.</h2></div>
        <div className="wall-color-picker" aria-label="Ürün rengini seçin">
          {WALL_COLORS.map((item) => (
            <button key={item.slug} type="button" aria-label={`Seç: ${item.name}`} aria-pressed={color === item.slug} onClick={() => chooseColor(item.slug)}>
              <span style={{ backgroundColor: item.hex }} /><small>{item.name}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="product-wall-grid" data-selected-color={color}>
        <article className="wall-center wall-load-item" style={{ "--wall-delay": "0ms" } as WallStyle}>
          <div className="wall-center-media"><img key={center.primaryImage} src={center.primaryImage} alt={`${selectedModel.name}, ${center.color}`} /></div>
          <div className="wall-center-copy">
            <span>{selectedModel.concept ? `Yeni model · ${center.color}` : `${selectedModel.name} · ${center.color}`}</span>
            <h3><Link href={center.href}>{selectedModel.name}</Link></h3>
            <div className="wall-center-meta">
              <strong>{center.priceCents === null ? "Fiyat için iletişim" : money(center.priceCents)}</strong>
              <Link className="wall-center-link" href={center.href}>İncele <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </article>

        {models.slice(0, 20).map((model, perimeterIndex) => {
          const variant = model.variants[color];
          const desktop = desktopRing[perimeterIndex];
          const tablet = tabletRing[perimeterIndex] || [1, 1];
          const mobile = mobileRing[perimeterIndex] || [1, 1];
          const visibilityClass = perimeterIndex >= 16 ? "wall-desktop-only" : perimeterIndex >= 12 ? "wall-tablet-only" : "";
          const style: WallStyle = { "--desktop-row": desktop[0], "--desktop-column": desktop[1], "--tablet-row": tablet[0], "--tablet-column": tablet[1], "--mobile-row": mobile[0], "--mobile-column": mobile[1], "--wall-delay": `${(perimeterIndex + 1) * 40}ms` };
          return (
            <button className={`wall-tile wall-load-item ${visibilityClass}`} data-model-key={model.key} data-concept={model.concept || undefined} key={model.key} type="button" style={style} onClick={() => showModel(model)} onKeyDown={(event) => {
              if (event.key === "Enter") { event.preventDefault(); showModel(model); }
            }} aria-label={`Göster: ${model.name}, ${variant.color}`} aria-pressed={selectedModel.key === model.key}>
              <span className="wall-tile-media" aria-hidden="true">
                <img key={variant.primaryImage} src={variant.primaryImage} alt="" loading={perimeterIndex < 8 ? "eager" : "lazy"} />
              </span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </section>
  );
}
