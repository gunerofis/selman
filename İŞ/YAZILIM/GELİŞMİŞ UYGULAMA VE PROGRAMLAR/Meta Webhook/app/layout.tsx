import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "İş Merkezi | Meta Bağlantısı",
  description: "Güner Ofis ve Makro Ofis hesap yönetimi için gizlilik ve veri silme bilgileri.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
