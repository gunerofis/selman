import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";
import { useSiteConfig } from "@/lib/site-config-context";

export const Route = createFileRoute("/satici")({
  component: Page,
  head: () =>
    pageHead({
      title: "Satıcı",
      description: `Sweb satıcı, iletişim ve işletme bilgileri.`,
      path: "/satici",
    }),
});

function Page() {
  const { identity } = useSiteConfig();
  const rows = [
    ["Resmî unvan", identity.legalName],
    ["MERSİS", identity.mersisNumber],
    ["Vergi dairesi", identity.taxOffice],
    ["Vergi numarası", identity.taxNumber],
    ["Adres", identity.legalAddress || identity.atelier],
    ["Hukuki e-posta", identity.legalEmail || identity.email],
    ["Destek e-postası", identity.email],
    ["Telefon", identity.phone],
    ["Çalışma saatleri", `Hafta içi ${identity.hours}`],
  ].filter(([, value]) => value.trim());
  return (
    <LegalPage kicker="Hukuki" title="Satıcı" updated={BRAND.legalUpdated}>
      <dl className="mb-8 grid gap-px bg-border sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-4 py-5">
            <dt className="font-mono text-xs tracking-wide text-fg-muted uppercase">{k}</dt>
            <dd className="mt-2 text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <p>
        Şikayet: <Link to="/sikayet">şikayet</Link>. Ön bilgi:{" "}
        <Link to="/on-bilgilendirme">ön bilgilendirme</Link>. Yazın:{" "}
        <Link to="/iletisim">iletişim</Link>.
      </p>
    </LegalPage>
  );
}
