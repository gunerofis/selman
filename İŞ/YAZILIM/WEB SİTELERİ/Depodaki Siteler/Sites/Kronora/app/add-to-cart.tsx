"use client";
import { useState } from "react";
import { addCartItem } from "./cart-store";

export default function AddToCart({ slug, quantity = 1, disabled = false, compact = false }: { slug: string; quantity?: number; disabled?: boolean; compact?: boolean }) {
  const [added, setAdded] = useState(false);
  return <button type="button" className={compact ? "add-cart compact" : "button primary add-cart"} disabled={disabled} aria-live="polite" onClick={() => {
    addCartItem(slug, Math.max(1, quantity));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }}>{disabled ? "Stokta yok" : added ? "Sepete eklendi ✓" : "Sepete ekle"}</button>;
}
