import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";
import { FaqList } from "@/components/faq-list";
import { FAQ_RETURN } from "@/lib/faq";

export const Route = createFileRoute("/iade")({
  component: Page,
  head: () =>
    pageHead({
      title: "İade",
      description: "14 gün, ambalajı açılmamış ürün. Açılmış kozmetik ürün hariç.",
      path: "/iade",
    }),
});

function Page() {
  return (
    <LegalPage kicker="Hukuki" title="İade" updated={BRAND.legalUpdated}>
      <dl className="mb-8 grid gap-px bg-border sm:grid-cols-3">
        {(
          [
            ["Süre", "14 gün"],
            ["Koşul", "Jelatini açılmamış"],
            ["Hariç", "Açılmış kozmetik"],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-4 py-5">
            <dt className="font-mono text-xs tracking-wide text-fg-muted uppercase">{k}</dt>
            <dd className="mt-2 text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <p>
        Teslimden itibaren 14 gün içinde, ambalajı ve koruma bandı açılmamış ürünler iade edilir.
        Tesliminden sonra ambalajı, koruma bandı (jelatin) veya mührü açılmış kozmetik ürünler — parfüm ve deneme boyları dahil — sağlık ve hijyen nedeniyle iade edilemez (Mesafeli Sözleşmeler Yönetmeliği m.15). Kargo hasarı ve ayıplı ürün ayrı değerlendirilir.
      </p>
      <p>
        İade için sipariş numarası ve stok kodu ile {BRAND.email} adresine yazın. Onaydan sonra ürün
        iade adresine gönderilir. İnceleme sonrası bedel, ödeme yöntemine göre iade edilir.
      </p>
      <h2>İade adımları</h2>
      <ol className="mt-4 grid gap-3">
        {(
          [
            ["Bildirin", `Sipariş numarası (SW-) ve stok kodu ile ${BRAND.email} adresine yazın veya cayma formunu doldurun.`],
            ["Onay bekleyin", `${BRAND.reply} içinde iade onayı ve gönderim adresi iletilir.`],
            ["Paketleyin", "Ürünü jelatini açılmamış kutusuyla, darbeye karşı korunaklı paketleyin."],
            ["Gönderin", "Onay e-postasındaki adrese kargolayın; kargo takip numarasını iletin."],
            ["Bedeli alın", "İnceleme sonrası bedel, en geç 14 gün içinde ödeme yönteminize iade edilir."],
          ] as const
        ).map(([k, v], i) => (
          <li key={k} className="border border-solid border-border bg-bg-elevated px-4 py-4">
            <p className="font-mono text-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-1 font-display text-xl text-fg">{k}</p>
            <p className="mt-1 text-sm">{v}</p>
          </li>
        ))}
      </ol>
      <h2>İade edilemeyenler</h2>
      <ul className="mt-4 grid gap-2 text-sm">
        {[
          "Ambalajı, jelatini veya mührü açılmış parfüm ve kozmetik ürünler",
          "Kullanılmış veya denenmiş ürünler",
          "Deneme boyları (dekant) ve açılmış keşif setleri",
          "Kişiye özel hazırlanmış hediye paketleri",
        ].map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 bg-taba" />
            {item}
          </li>
        ))}
      </ul>
      <p>
        Bu ürünlerde üretim hatası varsa <Link to="/garanti">garanti</Link> kapsamında
        değerlendirilir; iade dışı olmaları ayıplı malı kapsamaz.
      </p>
      <p>
        İade kargo bedeli ayıplı üründe satıcıya aittir. Anlaşmalı iade taşıyıcısı sitede adı
        yazılmaz; caymada da kargoyu tüketiciye yüklemeyiz. Bildirim: <Link to="/cayma">cayma</Link>
        .
      </p>
      <FaqList items={FAQ_RETURN} />
    </LegalPage>
  );
}
