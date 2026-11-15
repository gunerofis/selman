import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND, hasBrandValue, sellerName } from "@/lib/brand";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/satici")({
  component: Page,
  head: () =>
    pageHead({
      title: "Satıcı",
      description: `${sellerName()}, ${BRAND.atelier}. Unvan uydurulmaz.`,
      path: "/satici",
    }),
});

function Page() {
  return (
    <LegalPage kicker="Hukuki" title="Satıcı" updated={BRAND.legalUpdated}>
      <dl className="mb-8 grid gap-px bg-border sm:grid-cols-2">
        {(
          [
            ["Ad", sellerName()],
            ["Yer", `${BRAND.atelier} · ${BRAND.country}`],
            ["E-posta", BRAND.email],
            ["Saat", `Hafta içi ${BRAND.hours}`],
            ["Dönüş", BRAND.reply],
            ["Telefon", hasBrandValue(BRAND.phone) ? BRAND.phone : "Sitede yayınlanmaz"],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-4 py-5">
            <dt className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">{k}</dt>
            <dd className="mt-2 text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <p>
        {hasBrandValue(BRAND.legalName)
          ? `Resmî unvan: ${BRAND.legalName}.`
          : "Resmî unvan, MERSİS ve vergi kimlik numarası bilinmeden yazılmaz; sipariş e-postasında iletilir."}
      </p>
      <p>
        Şikayet: <Link to="/sikayet">şikayet</Link>. Ön bilgi:{" "}
        <Link to="/on-bilgilendirme">ön bilgilendirme</Link>. Yazın:{" "}
        <Link to="/iletisim">iletişim</Link>.
      </p>
    </LegalPage>
  );
}
