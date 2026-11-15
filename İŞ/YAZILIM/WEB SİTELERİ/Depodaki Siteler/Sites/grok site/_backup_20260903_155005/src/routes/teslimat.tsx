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
      description: `Hazır stok 3–5 iş günü. ${formatPrice(FREE_SHIPPING_FROM)} üzeri kargo yok.`,
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
            ["Kargo", `${formatPrice(FREE_SHIPPING_FROM)} üzeri yok`],
            ["Çıkış", BRAND.atelier],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-4 py-5">
            <dt className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">{k}</dt>
            <dd className="mt-2 text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <p>
        Siparişler {BRAND.atelier} atölyesinden kargoya verilir. Hazır stok 3–5 iş
        günü. Hafta içi 18.00'a kadar gelen sipariş aynı iş günü işleme alınır;
        sonrası veya hafta sonu bir sonraki iş gününe kalır. Stok dışı, ölçüye
        göre veya proje siparişlerinde süre ayrıca yazılır.
      </p>
      <p>
        {formatPrice(FREE_SHIPPING_FROM)} üzeri Türkiye içi kargo ücretsizdir.
        Altındaki siparişlerde kargo bedeli sepet özetinde görünür.
      </p>
      <p>
        Teslimat adresi sipariş formunda bildirilir. Adres hatası nedeniyle
        dönen kargonun yeniden gönderim bedeli alıcıya aittir.
      </p>
      <p>
        İade ve cayma için <Link to="/iade">İade</Link> sayfasına bakın.
      </p>
      <FaqList items={FAQ_SHIP} />
    </LegalPage>
  );
}
