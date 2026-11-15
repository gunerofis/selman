import type { Metadata } from "next";
import type { ReactNode } from "react";
import { THREE_D_PUBLIC_ENABLED } from "../../lib/features";
import "../bayi/bayi.css";
import "./print.css";
export const metadata: Metadata = {
  title: THREE_D_PUBLIC_ENABLED ? "Toptan 3D Baskı Kataloğu" : "3D Baskı Kataloğu Hazırlanıyor",
  description: THREE_D_PUBLIC_ENABLED ? "BÜCÜRÜKTOYS toptan 3D baskı ürün kataloğu." : "BÜCÜRÜKTOYS 3D baskı kataloğu yeni koleksiyon hazırlığı nedeniyle geçici olarak kapalıdır.",
  alternates: { canonical: "/3d-baski" },
  robots: THREE_D_PUBLIC_ENABLED ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    title: THREE_D_PUBLIC_ENABLED ? "BÜCÜRÜKTOYS Toptan 3D Baskı Kataloğu" : "BÜCÜRÜKTOYS 3D Baskı Kataloğu Hazırlanıyor",
    description: THREE_D_PUBLIC_ENABLED ? "Toptan 3D baskı ürünleri ve teknik bilgiler." : "Yeni koleksiyon hazırlanana kadar 3D baskı bölümü geçici olarak kapalıdır.",
    images: [{
      url: THREE_D_PUBLIC_ENABLED ? "/media/assets/3d/products/crystal-dragon.webp" : "/assets/bucuruktoys-og-card.png",
      width: 1200,
      height: THREE_D_PUBLIC_ENABLED ? 900 : 630,
      alt: THREE_D_PUBLIC_ENABLED ? "BÜCÜRÜKTOYS 3D baskı kataloğu" : "BÜCÜRÜKTOYS",
    }],
  },
};
export default function Layout({children}:{children:ReactNode}){return children;}
