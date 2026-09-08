"use client";

import { useState } from "react";
import { privacyControllerReady } from "../../lib/business-info";
import DeveloperContact from "../components/developer-contact";
import SiteHeader from "../components/site-header";

export default function DealerPage() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError(false);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const body = Object.fromEntries(form.entries());
    (body as Record<string, unknown>).consent = form.get("consent") === "on";
    const whatsappText = encodeURIComponent(
      `Merhaba BÜCÜRÜKTOYS, bayilik/kurumsal alım başvurusu yapmak istiyorum. Firma: ${body.companyName}; Yetkili: ${body.contactName}; Telefon: ${body.phone}; İl/İlçe: ${body.city || "Belirtilmedi"}/${body.district || "Belirtilmedi"}; İşletme türü: ${body.businessType || "Belirtilmedi"}; Tahmini alım: ${body.monthlyVolume || "Belirtilmedi"}; Not: ${body.note || "Yok"}`,
    );

    if (!privacyControllerReady) {
      window.location.href = `https://wa.me/905393468527?text=${whatsappText}`;
      setBusy(false);
      return;
    }

    try {
      const response = await fetch("/api/dealer-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as { error?: string; stored?: boolean };
      if (!response.ok) throw new Error(data.error || "Başvuru gönderilemedi.");
      if (data.stored) {
        setMessage("Başvurunuz alındı. Ekibimiz sizinle iletişime geçecek.");
        formElement.reset();
      } else {
        window.location.href = `https://wa.me/905393468527?text=${whatsappText}`;
      }
    } catch (cause) {
      setError(true);
      setMessage(cause instanceof Error ? cause.message : "Başvuru gönderilemedi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="lead-page">
      <SiteHeader />
      <section className="lead-hero">
        <div className="lead-copy">
          <p className="kicker">Kurumsal satış</p>
          <h1>Birlikte<br />büyüyelim.</h1>
          <p>Mağaza, kırtasiye, oyuncakçı, e-ticaret satıcısı ve kurumsal alıcılar için düzenli ürün tedariği ve hızlı teklif akışı.</p>
          <div className="lead-benefits">
            <div><strong>Toptan ürün seçkisi</strong><span>Ürün kodu, koli düzeni ve güncel stok teyidi.</span></div>
            <div><strong>Türkiye geneli teslimat</strong><span>Şehir ve sipariş hacmine göre planlama.</span></div>
            <div><strong>Tek muhatap</strong><span>Tekliften teslimata doğrudan WhatsApp desteği.</span></div>
          </div>
        </div>
        <form className="lead-form" onSubmit={submit}>
          <h2>Firma başvurusu</h2>
          <p>İlk değerlendirme için temel bilgileri bırakın.</p>
          {!privacyControllerReady && <p className="lead-privacy-note"><strong>Başvurunuz WhatsApp üzerinden tamamlanır.</strong> Bu formdaki bilgiler şu anda sitede saklanmaz; gönderdiğinizde hazır başvuru mesajınız açılır.</p>}
          <div className="lead-grid">
            <label>Firma adı<input name="companyName" required maxLength={160} /></label>
            <label>Yetkili adı<input name="contactName" required maxLength={120} /></label>
            <label>Telefon<input name="phone" type="tel" required placeholder="05xx xxx xx xx" /></label>
            <label>E-posta<input name="email" type="email" /></label>
            <label>İl<input name="city" defaultValue="İstanbul" /></label>
            <label>İlçe<input name="district" /></label>
            <label>Vergi dairesi<input name="taxOffice" /></label>
            <label>Vergi numarası<input name="taxNumber" inputMode="numeric" /></label>
            <label>İşletme türü<select name="businessType"><option value="Oyuncak mağazası">Oyuncak mağazası</option><option value="Kırtasiye">Kırtasiye</option><option value="E-ticaret">E-ticaret</option><option value="Kurumsal alıcı">Kurumsal alıcı</option><option value="Diğer">Diğer</option></select></label>
            <label>Aylık tahmini alım<select name="monthlyVolume"><option value="Belirtilmedi">Belirtilmedi</option><option value="1-10 koli">1–10 koli</option><option value="11-30 koli">11–30 koli</option><option value="31+ koli">31+ koli</option></select></label>
            <label className="wide">Not<textarea name="note" rows={4} placeholder="İlgilendiğiniz ürün grupları ve talepleriniz…" /></label>
            <label className="trap">Web sitesi<input name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <label className="lead-consent"><input type="checkbox" name="consent" required /><span><a href="/gizlilik" target="_blank">Veri kullanımı bilgilendirmesini</a> okudum ve WhatsApp üzerinden iletişim kurulmasını kabul ediyorum.</span></label>
          {message && <p className={`lead-result ${error ? "error" : ""}`}>{message}</p>}
          <button disabled={busy}>{busy ? "Hazırlanıyor…" : privacyControllerReady ? "Başvuruyu gönder" : "WhatsApp'tan başvur"}</button>
        </form>
      </section>
      <footer className="lead-foot">BÜCÜRÜKTOYS · <a href="tel:+905393468527">0539 346 85 27</a></footer>
      <DeveloperContact />
    </main>
  );
}
