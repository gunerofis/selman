import Link from "next/link";
import CartClient from "./cart-client";
import { getProducts, getSettings } from "../lib/store";
export const metadata = { title: "Sepet | Moneluks", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function CartPage() { const [products, settings] = await Promise.all([getProducts(), getSettings()]); return <main id="main-content" className="inner-page"><section className="page-hero small"><p className="breadcrumb"><Link href="/">Ana Sayfa</Link><span>/</span>Sepet</p><h1>Sepetiniz</h1></section><CartClient products={products} shippingNote={settings.shippingNote}/></main>; }
