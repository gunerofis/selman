import type { Metadata } from "next";
import "./print.css";

export const metadata: Metadata = {
  title: "Yazdırılabilir Toptan Ürün Kataloğu",
  description: "BÜCÜRÜKTOYS güncel toptan oyuncak ürünlerini yazdırın veya PDF olarak kaydedin.",
  alternates: { canonical: "/katalog" },
};

export default function CatalogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
