import Link from "next/link";

export default function NotFound() {
  return <main id="main-content" className="inner-page">
    <section className="success-card">
      <span aria-hidden="true">404</span>
      <p className="eyebrow">Sayfa bulunamadı</p>
      <h1>Aradığınız sayfa burada değil.</h1>
      <p>Bağlantı değişmiş veya sayfa kaldırılmış olabilir. Koleksiyona dönerek ürünleri inceleyebilirsiniz.</p>
      <Link className="button primary" href="/koleksiyon">Koleksiyona dön</Link>
    </section>
  </main>;
}
