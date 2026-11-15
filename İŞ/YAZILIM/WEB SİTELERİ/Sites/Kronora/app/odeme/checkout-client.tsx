"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clearCart, readCart, type CartItem } from "../cart-store";
import type { StoreProduct } from "../lib/store";

export default function CheckoutClient({ products, shippingNote }: { products: StoreProduct[]; shippingNote: string }) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; name: string; discountCents: number } | null>(null);
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponError, setCouponError] = useState("");
  const idempotencyKey = useRef("");
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCart(readCart()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const rows = useMemo(() => cart
    .map((item) => ({ item, product: products.find((product) => product.slug === item.slug) }))
    .filter((row): row is { item: CartItem; product: StoreProduct } => Boolean(row.product)), [cart, products]);
  const subtotal = rows.reduce((sum, row) => sum + row.product.priceCents * row.item.quantity, 0);
  const total = Math.max(0, subtotal - (coupon?.discountCents || 0));

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  async function applyCoupon() {
    setCouponBusy(true); setCouponError("");
    try { const response = await fetch("/api/discounts/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: couponInput, items: rows.map(({ item }) => item) }) }); const result = await response.json() as { code?: string; name?: string; discountCents?: number; error?: string }; if (!response.ok || !result.code || !result.discountCents) throw new Error(result.error || "Kod uygulanamadı."); setCoupon({ code: result.code, name: result.name || result.code, discountCents: result.discountCents }); setCouponInput(result.code); } catch (caught) { setCoupon(null); setCouponError(caught instanceof Error ? caught.message : "Kod uygulanamadı."); } finally { setCouponBusy(false); }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rows.length) return;
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();
    const payload = {
      customerName: form.get("customerName"), email: form.get("email"), phone: form.get("phone"),
      taxNumber: form.get("taxNumber"), taxOffice: form.get("taxOffice"),
      city: form.get("city"), district: form.get("district"), address: form.get("address"),
      postalCode: form.get("postalCode"), notes: form.get("notes"), accepted: form.get("accepted") === "on",
      items: rows.map(({ item }) => item), couponCode: coupon?.code || "", idempotencyKey: idempotencyKey.current,
    };
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { orderNumber?: string; error?: string };
      if (!response.ok || !result.orderNumber) throw new Error(result.error || "Sipariş oluşturulamadı.");
      clearCart();
      router.push(`/siparis-tamamlandi?no=${encodeURIComponent(result.orderNumber)}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sipariş oluşturulamadı.");
      setBusy(false);
    }
  }

  if (!rows.length) return <section className="cart-empty"><h2>Sepetiniz boş.</h2><Link className="button primary" href="/koleksiyon">Koleksiyona git</Link></section>;

  return <section className="checkout-layout">
    <form className="checkout-form" onSubmit={submit} aria-busy={busy}>
      <div className="checkout-form-heading"><div><span>Sipariş ve teslimat</span><h2>Teslimat ve fatura bilgileri</h2></div><p><b aria-hidden="true">*</b> Zorunlu alanlar</p></div>
      <div className="form-grid">
        <label><span>Ad soyad <b aria-hidden="true">*</b></span><input name="customerName" autoComplete="name" required minLength={3} /></label><label><span>E-posta <b aria-hidden="true">*</b></span><input name="email" type="email" autoComplete="email" required /></label>
        <label><span>Telefon <b aria-hidden="true">*</b></span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" required minLength={10} /></label><label><span>Şehir <b aria-hidden="true">*</b></span><input name="city" autoComplete="address-level1" required /></label>
        <label><span>İlçe <b aria-hidden="true">*</b></span><input name="district" autoComplete="address-level2" required /></label><label><span>Posta kodu <small>İsteğe bağlı</small></span><input name="postalCode" inputMode="numeric" autoComplete="postal-code" /></label>
        <label><span>Vergi no <b aria-hidden="true">*</b></span><input name="taxNumber" inputMode="numeric" autoComplete="off" required minLength={10} maxLength={15} /></label><label><span>Vergi dairesi <b aria-hidden="true">*</b></span><input name="taxOffice" autoComplete="off" required minLength={2} maxLength={80} /></label>
        <label className="full"><span>Adres <b aria-hidden="true">*</b></span><textarea name="address" autoComplete="street-address" required rows={4} /></label><label className="full"><span>Sipariş notu <small>İsteğe bağlı</small></span><textarea name="notes" rows={3} /></label>
      </div>
      <label className="consent"><input name="accepted" type="checkbox" required /><span><Link href="/gizlilik" target="_blank" rel="noopener noreferrer">Gizlilik ve kişisel veriler metnini</Link> okudum ve sipariş için gerekli bilgilerin işlenmesini kabul ediyorum.</span></label>
      {error && <p className="form-error" role="alert" tabIndex={-1} ref={errorRef}>{error}</p>}
      <button className="button primary" disabled={busy}>{busy ? "Sipariş oluşturuluyor…" : "Siparişi oluştur →"}</button>
      <p className="checkout-fact">Kart bilgileriniz bu formda istenmez. Sipariş kaydı güvenli şekilde oluşturulduktan sonra ödeme yönlendirmesi ayrıca paylaşılır.</p>
    </form>
    <aside className="cart-summary checkout-summary"><h2>Siparişiniz</h2>{rows.map(({ item, product }) => <div className="checkout-line-item" key={product.slug}><img src={product.primaryImage} width="80" height="80" alt=""/><span>{product.name}<small>Adet: {item.quantity}</small></span><b>{((product.priceCents * item.quantity) / 100).toLocaleString("tr-TR")} TL</b></div>)}<section className="coupon-entry"><label htmlFor="coupon-code">İndirim kodu</label><div><input id="coupon-code" autoComplete="off" value={couponInput} onChange={(event) => { setCouponInput(event.target.value.toLocaleUpperCase("tr-TR")); setCoupon(null); }} placeholder="KODUNUZ"/><button type="button" disabled={couponBusy || !couponInput.trim()} onClick={applyCoupon}>{couponBusy ? "Kontrol…" : "Uygula"}</button></div>{coupon && <p className="coupon-success">{coupon.name} uygulandı. <button type="button" onClick={() => { setCoupon(null); setCouponInput(""); }}>Kaldır</button></p>}{couponError && <p className="form-error" role="alert">{couponError}</p>}</section>{coupon && <div className="summary-discount"><span>İndirim ({coupon.code})</span><b>−{(coupon.discountCents / 100).toLocaleString("tr-TR")} TL</b></div>}<div className="summary-total"><span>Toplam</span><b>{(total / 100).toLocaleString("tr-TR")} TL</b></div><p>{shippingNote}</p></aside>
  </section>;
}
