import type { Metadata } from "next";
import SocialRail from "./components/social-rail";
import "./globals.css";

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  verification: googleVerification && googleVerification !== "DOLDURULACAK" ? { google: googleVerification } : undefined,
  metadataBase: new URL("https://www.bucuruktoys.com"),
  title: {
    default: "BÜCÜRÜKTOYS | Türkiye Geneli Toptan Oyuncak Kataloğu",
    template: "%s | BÜCÜRÜKTOYS",
  },
  description:
    "İşletmeler için BÜCÜRÜKTOYS toptan oyuncak kataloğu. Ürünleri seçin, talep adetlerini girin; stok kodlu listenizle WhatsApp üzerinden fiyat ve stok teklifi alın.",
  keywords: ["toptan oyuncak", "Türkiye geneli oyuncak tedariki", "paketli oyuncak", "oyuncak teklif listesi", "BÜCÜRÜKTOYS"],
  applicationName: "BÜCÜRÜKTOYS",
  manifest: "/manifest.json",
  category: "Toptan oyuncak",
  formatDetection: { telephone: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "BÜCÜRÜKTOYS",
    title: "BÜCÜRÜKTOYS | Türkiye Geneli Toptan Oyuncak Kataloğu",
    description: "Mağaza ve işletmeler için paketli oyuncak kataloğu; talep adedinizi girin ve stok kodlu listenizle WhatsApp üzerinden teklif alın.",
    images: [{ url: "/assets/bucuruktoys-og-card.png", width: 1200, height: 630, alt: "BÜCÜRÜKTOYS Toptan Oyuncak Kataloğu" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BÜCÜRÜKTOYS | Türkiye Geneli Toptan Oyuncak Kataloğu",
    description: "Paketli toptan oyuncakları seçin, adetleri girin ve WhatsApp üzerinden teklif alın.",
    images: ["/assets/bucuruktoys-og-card.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "TR-34",
    "geo.placename": "İstanbul",
  },
  icons: {
    icon: "/assets/bucuruktoys-icon.svg",
    shortcut: "/assets/bucuruktoys-icon.svg",
    apple: "/assets/bucuruktoys-touch-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}<SocialRail /></body>
    </html>
  );
}
