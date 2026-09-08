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
            <dt className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">{k}</dt>
            <dd className="mt-2 text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <p>
        Teslimden itibaren 14 gün içinde, kullanılmamış ve etiketli ürünler iade
        edilir. Kargo hasarı ayrı değerlendirilir.
      </p>
      <p>
        İade için sipariş numarası ve stok kodu ile {BRAND.email} adresine yazın.
        Onaydan sonra ürün atölye adresine gönderilir. İnceleme sonrası bedel,
        ödeme yöntemine göre iade edilir.
      </p>
      <p>
        Kişiye özel kesim, ölçüye göre üretilen ve proje siparişleri iade kapsamı
        dışındadır.
      </p>
      <p>
        İade kargo bedeli ayıplı üründe satıcıya aittir. Anlaşmalı iade taşıyıcısı
        sitede adı yazılmaz; caymada da kargoyu tüketiciye yüklemeyiz. Bildirim:{" "}
        <Link to="/cayma">cayma</Link>.
      </p>
      <FaqList items={FAQ_RETURN} />
    </LegalPage>
  );
}
