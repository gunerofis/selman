"use client";

import { useEffect, useState } from "react";
import { getFavorites, toggleFavorite } from "./favorites-store";

export default function FavoriteButton({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const [favorite, setFavorite] = useState(false);
  useEffect(() => {
    const update = () => setFavorite(getFavorites().includes(slug));
    update();
    window.addEventListener("favorites-updated", update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener("favorites-updated", update); window.removeEventListener("storage", update); };
  }, [slug]);
  return <button type="button" className={`${compact ? "favorite-button compact" : "favorite-button"}${favorite ? " active" : ""}`} aria-pressed={favorite} aria-label={favorite ? "Favorilerden çıkar" : "Favorilere ekle"} onClick={() => setFavorite(toggleFavorite(slug))}><span aria-hidden="true">{favorite ? "♥" : "♡"}</span>{!compact && <b>{favorite ? "Favorilerimde" : "Favorilere ekle"}</b>}</button>;
}
