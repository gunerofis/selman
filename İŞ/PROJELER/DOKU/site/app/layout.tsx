import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DOKU",
  description: "Mekâna özel duvar tasarımları.",
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
      <body>{children}</body>
    </html>
  );
}
