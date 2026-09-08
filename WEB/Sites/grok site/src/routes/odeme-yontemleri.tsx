import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND, hasBrandValue } from "@/lib/brand";
import { PAY_METHODS } from "@/lib/commerce";
import { pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";

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
  return (
    <LegalPage kicker="Yardım" title="Ödeme yöntemleri" updated={BRAND.legalUpdated}>
      <p>
        Kart numarası, CVV veya son kullanma tarihi bu sitede toplanmaz. Sipariş,
        e-posta uygulamanızdan {BRAND.email} adresine gider.
      </p>
      <ul className="mt-6 grid gap-3">
        {PAY_METHODS.map((method) => (
          <li key={method.id} className="border border-dashed border-border bg-bg-elevated px-4 py-4">
            <p className="font-display text-xl text-fg">{method.label}</p>
            <p className="mt-1 text-sm">{method.hint}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6">
        Havale seçilirse IBAN{" "}
        {hasBrandValue(BRAND.iban) ? BRAND.iban : "sipariş onayından sonra e-posta ile"}{" "}
        iletilir. Açıklamaya sipariş numarasını yazın. Sitede IBAN uydurulmaz.
      </p>
      <p>
        Ön bilgi: <Link to="/on-bilgilendirme">ön bilgilendirme</Link>. Sepet:{" "}
        <Link to="/sepet">sepet</Link>.
      </p>
      <Link to="/odeme" className="mt-8 inline-block">
        <Button>Ödemeye geç</Button>
      </Link>
    </LegalPage>
  );
}
