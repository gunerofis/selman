import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";
import { PAY_METHODS } from "@/lib/commerce";
import { pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/lib/site-config-context";

export const Route = createFileRoute("/odeme-yontemleri")({
  component: Page,
  head: () =>
    pageHead({
      title: "Ödeme yöntemleri",
      description: "Kapıda nakit veya kart, havale. Kart numarası sitede alınmaz.",
      path: "/odeme-yontemleri",
    }),
});

function Page() {
  const { identity } = useSiteConfig();

  return (
    <LegalPage kicker="Yardım" title="Ödeme yöntemleri" updated={BRAND.legalUpdated}>
      <p>
        Kart numarası, CVV veya son kullanma tarihi bu sitede toplanmaz. Ödeme adımında seçtiğiniz
        yöntem sipariş kaydına işlenir; tahsilat teslimde veya havale ile yapılır.
      </p>
      <h2>Nasıl işler</h2>
      <ol className="mt-4 grid gap-3">
        {(
          [
            ["Sipariş", "Ödeme adımında yöntemi seçip talebi gönderirsiniz."],
            ["Onay", "Sipariş numaranız (SW-) ekranda görünür ve e-posta ile iletilir."],
            ["Tahsilat", "Kapıda nakit/kart teslimde; havalede dekont sonrası kargoya verilir."],
            ["Fatura", "Fatura ürünle birlikte gönderilir; kurumsal fatura için unvan yazın."],
          ] as const
        ).map(([k, v], i) => (
          <li key={k} className="border border-dashed border-border bg-bg-elevated px-4 py-4">
            <p className="font-mono text-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-1 font-display text-xl text-fg">{k}</p>
            <p className="mt-1 text-sm">{v}</p>
          </li>
        ))}
      </ol>
      <h2>Yöntemler</h2>
      <ul className="mt-6 grid gap-3">
        {PAY_METHODS.map((method) => (
          <li
            key={method.id}
            className="border border-dashed border-border bg-bg-elevated px-4 py-4"
          >
            <p className="font-display text-xl text-fg">{method.label}</p>
            <p className="mt-1 text-sm">{method.hint}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6">
        Havale seçilirse IBAN {identity.iban || "sipariş onayından sonra e-posta ile"} iletilir.
        Açıklamaya sipariş numarasını yazın. Sitede IBAN uydurulmaz.
      </p>
      <h2>Güvenlik</h2>
      <p>
        Site hiçbir aşamada kart bilgisi istemez. Kart bilgisi isteyen bir sayfa veya e-posta ile
        karşılaşırsanız işlemi durdurun ve <Link to="/iletisim">bize yazın</Link>. Kapıda kart
        ödemesinde tahsilat kuryenin POS cihazından yapılır; numara bize iletilmez.
      </p>
      <h2>Sık sorulanlar</h2>
      <dl className="mt-4 space-y-3 text-sm">
        {(
          [
            ["Taksit var mı?", "Kapıda kart ödemesinde taksit kuryenin POS cihazına ve bankanıza bağlıdır."],
            ["Fiyatlara KDV dahil mi?", "Evet, sitedeki tüm fiyatlar KDV dahildir."],
            ["Havale ne kadar sürede geçer?", "Dekont ulaştıktan sonra aynı iş günü siparişe işlenir."],
            ["Kurumsal fatura alabilir miyim?", "Evet; sipariş notuna unvan, vergi dairesi ve numarasını yazın."],
          ] as const
        ).map(([q, a]) => (
          <div key={q}>
            <dt className="font-medium text-fg">{q}</dt>
            <dd className="mt-0.5">{a}</dd>
          </div>
        ))}
      </dl>
      <p>
        Ön bilgi: <Link to="/on-bilgilendirme">ön bilgilendirme</Link>. Sepet:{" "}
        <Link to="/sepet">sepet</Link>. İade: <Link to="/iade">iade</Link>.
      </p>
      <Link to="/odeme" className="mt-8 inline-block">
        <Button>Ödemeye geç</Button>
      </Link>
    </LegalPage>
  );
}
