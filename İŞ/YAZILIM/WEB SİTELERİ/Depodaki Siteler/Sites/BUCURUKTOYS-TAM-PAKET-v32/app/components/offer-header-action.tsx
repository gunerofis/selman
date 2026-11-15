"use client";

import { useEffect, useState } from "react";
import { countStoredOfferLines, OFFER_STORAGE_KEY } from "../../lib/offer-storage";

export default function OfferHeaderAction() {
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    const refreshCount = () => {
      setLineCount(countStoredOfferLines(window.localStorage.getItem(OFFER_STORAGE_KEY)));
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === OFFER_STORAGE_KEY) refreshCount();
    };

    refreshCount();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("pageshow", refreshCount);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("pageshow", refreshCount);
    };
  }, []);

  return (
    <a
      className="offer-button"
      href="/urunler?teklif=ac"
      aria-label={`Teklif listesi, ${lineCount} ürün`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 8h12l1 12H5L6 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </svg>
      <span>Teklif Listem</span>
      <b>{lineCount}</b>
    </a>
  );
}
