import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";
import { FREE_SHIPPING_FROM } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { FaqList } from "@/components/faq-list";
import { FAQ_SHIP } from "@/lib/faq";

export const Route = createFileRoute("/teslimat")({
  component: Page,
  head: () =>
    pageHead({
      title: "Teslimat",
      description: `Hazır stok 3–5 iş günü. ${formatPrice(FREE_SHIPPING_FROM)} üzeri kargo ücretsiz.`,
      path: "/teslimat",
    }),
});

function Page() {
  return (
    <LegalPage kicker="Hukuki" title="Teslimat" updated={BRAND.legalUpdated}>
      <dl className="mb-8 grid gap-px bg-border sm:grid-cols-3">
        {(
          [
            ["Hazır stok", "3–5 iş günü"],
            ["Kargo", `${formatPrice(FREE_SHIPPING_FROM)} üzeri ücretsiz`],
            ["Çıkış", BRAND.atelier],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-4 py-5">
            <dt className="font-mono text-xs tracking-wide text-fg-muted uppercase">{k}</dt>
            <dd className="mt-2 text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <p>
        Siparişler {BRAND.atelier} atölyesinden kargoya verilir. Hazır stok 3–5 iş günü. Hafta içi
        18.00'a kadar gelen sipariş aynı iş günü işleme alınır; sonrası veya hafta sonu bir sonraki
        iş gününe kalır. Stok dışı, ölçüye göre veya proje siparişlerinde süre ayrıca yazılır.
      </p>
      <p>
        {formatPrice(FREE_SHIPPING_FROM)} üzeri Türkiye içi kargo ücretsizdir. Altındaki
        siparişlerde kargo bedeli sepet özetinde görünür.
      </p>
      <h2>Süreler</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border-strong font-mono text-xs uppercase">
              <th className="py-3 pr-4">Sipariş tipi</th>
              <th className="py-3 pr-4">Hazırlık</th>
              <th className="py-3">Kargo</th>
            </tr>
          </thead>
          <tbody>
            {(
              [
                ["Hazır stok", "1 iş günü", "3–5 iş günü"],
                ["Ölçüye göre üretim", "10–15 iş günü", "3–5 iş günü"],
                ["50 adet ve üzeri", "10–20 iş günü", "Teslim planına göre"],
              ] as const
            ).map(([a, b, c]) => (
              <tr key={a} className="border-b border-dashed border-border">
                <th scope="row" className="py-3 pr-4 font-normal text-fg">
                  {a}
                </th>
                <td className="py-3 pr-4">{b}</td>
                <td className="py-3">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Kargo hasarlıysa</h2>
      <p>
        Paketi kurye yanındayken kontrol edin. Ezik, yırtık veya ıslaklık varsa tutanak tutturun ve
        teslim almayın. Teslim aldıktan sonra fark ettiyseniz aynı gün fotoğrafla{" "}
        {BRAND.email} adresine yazın; hasarlı teslimat <Link to="/garanti">garanti</Link>
        kapsamındadır.
      </p>
      <h2>Adres ve teslim</h2>
      <p>
        Teslimat adresi sipariş formunda bildirilir. Adres hatası nedeniyle dönen kargonun yeniden
        gönderim bedeli alıcıya aittir. Kapıcı, kat ve zil notunuzu ödeme adımındaki teslimat notu
        alanına yazın; not kargoya iletilir. Kargo takip numarası, çıkıştan sonra e-posta ile
        gönderilir ve <Link to="/siparis-sorgu">sipariş sorgula</Link> sayfasından da görünür.
      </p>
      <p>
        İade ve cayma için <Link to="/iade">İade</Link> sayfasına bakın.
      </p>
      <FaqList items={FAQ_SHIP} />
    </LegalPage>
  );
}
