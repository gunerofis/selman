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
      description: "14 gün, kullanılmamış ürün. Kişiye özel kesim hariç.",
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
            ["Koşul", "Kullanılmamış, etiketli"],
            ["Hariç", "Ölçüye göre üretim"],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-4 py-5">
            <dt className="font-mono text-xs tracking-wide text-fg-muted uppercase">{k}</dt>
            <dd className="mt-2 text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <p>
        Teslimden itibaren 14 gün içinde, kullanılmamış ve etiketli ürünler iade edilir. Kargo
        hasarı ayrı değerlendirilir.
      </p>
      <p>
        İade için sipariş numarası ve stok kodu ile {BRAND.email} adresine yazın. Onaydan sonra ürün
        atölye adresine gönderilir. İnceleme sonrası bedel, ödeme yöntemine göre iade edilir.
      </p>
      <h2>İade adımları</h2>
      <ol className="mt-4 grid gap-3">
        {(
          [
            ["Bildirin", `Sipariş numarası (SW-) ve stok kodu ile ${BRAND.email} adresine yazın veya cayma formunu doldurun.`],
            ["Onay bekleyin", `${BRAND.reply} içinde iade onayı ve gönderim adresi iletilir.`],
            ["Paketleyin", "Ürünü kendi kutusu ve koruyucusuyla, kullanılmamış hâlde paketleyin."],
            ["Gönderin", "Onay e-postasındaki adrese kargolayın; kargo takip numarasını iletin."],
            ["Bedeli alın", "İnceleme sonrası bedel, en geç 14 gün içinde ödeme yönteminize iade edilir."],
          ] as const
        ).map(([k, v], i) => (
          <li key={k} className="border border-dashed border-border bg-bg-elevated px-4 py-4">
            <p className="font-mono text-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-1 font-display text-xl text-fg">{k}</p>
            <p className="mt-1 text-sm">{v}</p>
          </li>
        ))}
      </ol>
      <h2>İade edilemeyenler</h2>
      <ul className="mt-4 grid gap-2 text-sm">
        {[
          "Ölçüye göre üretilen, kişiye özel kesilen parçalar",
          "Logo baskısı veya isim işlemesi yapılmış ürünler",
          "Kurumsal proje siparişleri",
          "Kullanılmış, çizilmiş veya kokusu geçmiş ürünler",
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
