import Link from "next/link";
import CheckoutClient from "./checkout-client";
import { getProducts, getSettings } from "../lib/store";
export const metadata = { title: "Siparişi Tamamla | Moneluks", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function CheckoutPage() { const [products, settings] = await Promise.all([getProducts(), getSettings()]); return <main id="main-content" className="inner-page"><section className="page-hero small"><p className="breadcrumb"><Link href="/">Ana Sayfa</Link><span>/</span><Link href="/sepet">Sepet</Link><span>/</span>Ödeme</p><h1>Siparişi tamamlayın</h1><p>Ödeme kartı bilgisi bu sayfada alınmaz veya saklanmaz.</p></section><CheckoutClient products={products} shippingNote={settings.shippingNote}/></main>; }
