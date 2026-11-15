import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/cerez")({
  component: Page,
  head: () =>
    pageHead({
      title: "Çerez politikası",
      description: "Zorunlu depo. Ölçüm ve reklam yok.",
      path: "/cerez",
    }),
});

function Page() {
  return (
    <LegalPage kicker="Hukuki" title="Çerez politikası" updated={BRAND.legalUpdated}>
      <p>
        Sitede yalnızca zorunlu çerez ve tarayıcı deposu kullanılır. Sepet, favori, son bakılan ürün
        ve çerez onayı cihazınızda tutulur. Ölçüm, reklam ve üçüncü taraf izleme çerezi yoktur.
      </p>
      <p>
        Tamam zorunlu depoyu kabul eder. Reddet çubuğu kapatır; sepet ve favori yine tarayıcıda
        çalışır çünkü ödeme başka türlü yürüyemez.
      </p>
      <p>
        Tercihi değiştirmek için alt bilgideki «Çerez tercihleri» bağlantısını kullanın. Sorular:{" "}
        {BRAND.email}.
      </p>
    </LegalPage>
  );
}
