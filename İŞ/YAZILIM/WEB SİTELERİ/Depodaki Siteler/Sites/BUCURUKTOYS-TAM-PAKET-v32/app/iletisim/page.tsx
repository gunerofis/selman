import type { Metadata } from "next";
import { getPublicSettings } from "../../lib/site-content-server";
import DeveloperContact from "../components/developer-contact";
import SiteHeader from "../components/site-header";

export const metadata: Metadata = {
  title: "İletişim",
  description: "BÜCÜRÜKTOYS satış, ürün bilgisi, toptan teklif ve bayilik iletişim kanalları.",
  alternates: { canonical: "/iletisim" },
};

export default async function ContactPage() {
  const settings = await getPublicSettings();
  const phone = typeof settings.phone === "string" ? settings.phone : "0539 346 85 27";
  const phoneDigits = phone.replace(/\D/g, "");
  const whatsapp = typeof settings.whatsapp === "string" ? settings.whatsapp.replace(/\D/g, "") : phoneDigits;
  const email = typeof settings.email === "string" ? settings.email : "";
  const address = typeof settings.address === "string" ? settings.address : "İstanbul";
  return <main className="content-page contact-detail-page">
    <SiteHeader />
    <header className="content-hero"><p className="content-kicker">Satış ve ürün bilgisi</p><h1>Doğrudan ulaşın.</h1><p>Ürün kodu, talep adedi, paket içeriği ve teslimat için satış birimine telefonla veya WhatsApp üzerinden ulaşabilirsiniz.</p></header>
    <section className="contact-channel-grid"><a className="primary-channel" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"><span>WhatsApp</span><strong>Teklif listesini gönderin</strong><p>Ürün kodu ve talep adetlerinizi tek mesajla iletin.</p><b>Görüşmeyi aç →</b></a><a href={`tel:+${phoneDigits}`}><span>Telefon</span><strong>{phone}</strong><p>Satış, ürün ve teslimat bilgisi için arayın.</p><b>Aramayı başlat →</b></a><a href="/bayi"><span>Bayilik</span><strong>İş ortaklığı başvurusu</strong><p>{email ? `${email} veya başvuru formu üzerinden ulaşın.` : "Firma ve faaliyet bilgilerinizi başvuru formuyla iletin."}</p><b>Formu aç →</b></a></section>
    <section className="contact-prep"><div><p className="content-kicker">Hızlı yanıt için</p><h2>Mesajınıza bunları ekleyin.</h2></div><ol><li>Ürün stok kodu</li><li>Talep edilen adet</li><li>Firma ve yetkili adı</li><li>Teslimat ilçesi</li><li>Varsa özel sipariş notu</li></ol></section>
    <section className="content-cta"><div><p className="content-kicker">Hazır teklif mesajı</p><h2>Ürünleri katalogdan seçin.</h2><p>Listeyi elle yazmadan, doğru kodlarla oluşturun.</p></div><a href="/urunler">Ürün kataloğu →</a></section>
    <footer className="content-footer">BÜCÜRÜKTOYS · {address}</footer>
    <DeveloperContact />
  </main>;
}
