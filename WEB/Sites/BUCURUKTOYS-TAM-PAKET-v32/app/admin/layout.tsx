import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Yönetim Paneli",
  description: "BÜCÜRÜKTOYS ürün ve stok yönetimi",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
