import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Toptan Oyuncak Ürünleri",
  description: "BÜCÜRÜKTOYS toptan oyuncak kataloğunu kategori, ürün adı ve stok koduyla inceleyin; adetli teklif listenizi oluşturun.",
  alternates: { canonical: "/urunler" },
};

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return children;
}
