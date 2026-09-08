import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/garanti")({
  component: Page,
  head: () =>
    pageHead({
      title: "Garanti",
      description: "Ayıplı mal, üretim hatası ve kargo hasarı. 14 günlük caymadan ayrı.",
      path: "/garanti",
    }),
});

function Page() {
  return (
    <LegalPage kicker="Yardım" title="Garanti" updated={BRAND.legalUpdated}>
      <dl className="mb-8 grid gap-px bg-border sm:grid-cols-3">
        {(
          [
            ["Ayıp", "Üretim, dikiş, kaplama, menteşe"],
            ["Kargo", "Hasar ayrı bakılır"],
            ["Cayma", "14 gün, /iade ve /cayma"],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-4 py-5">
            <dt className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">{k}</dt>
            <dd className="mt-2 text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <p>
        Bu sayfa ayıplı mal içindir. Beğenmeme, ölçü pişmanlığı veya hediye değişimi 14 günlük{" "}
        <Link to="/cayma">cayma</Link> ve <Link to="/iade">iade</Link> kapsamındadır.
      </p>
      <h2>Ne ayıptır</h2>
      <p>
        Dikiş açılması, kaplama kalkması, menteşe veya döner aksamın çalışmaması, teslimde kargo
        hasarı. Yanlış kullanım, yağ, çözücü, buhar ve uzun güneş <Link to="/bakim">bakım</Link>{" "}
        dışıdır; ayıp sayılmaz.
      </p>
      <h2>Ne yapıyoruz</h2>
      <p>
        Sipariş numarası, stok kodu ve fotoğrafla {BRAND.email} adresine yazın. Ayıp görülürse tamir
        veya aynı model değişim. Ölçüye göre üretilen parçada cayma yoktur; üretim hatası yine ayıptır.
      </p>
      <h2>Kargo</h2>
      <p>
        Ayıplı üründe iade ve yeniden gönderim kargosu satıcıya aittir. Anlaşmalı iade taşıyıcısı
        sitede adı yazılmaz.
      </p>
      <p>
        Yasal ayıp hükümleri 6502 sayılı Kanun’dadır. Ticari “24 ay belgesi” sitede uydurulmaz.
        Şikayet yolu: <Link to="/sikayet">şikayet</Link>.
      </p>
    </LegalPage>
  );
}
