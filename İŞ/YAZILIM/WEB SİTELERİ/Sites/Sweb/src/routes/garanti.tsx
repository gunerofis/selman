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
            <dt className="font-mono text-xs tracking-wide text-fg-muted uppercase">{k}</dt>
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
      <h2>Ürün grubuna göre kapsam</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-wash">
              <th className="px-3 py-3"> Ürün grubu</th>
              <th className="px-3 py-3">Tamir / servis</th>
              <th className="px-3 py-3">Değişim</th>
              <th className="px-3 py-3">Kullanıcı hatası</th>
            </tr>
          </thead>
          <tbody>
            {(
              [
                [
                  "Hazır ve standart ürün",
                  "Dikiş, kaplama ve mekanizma incelenir; üretim hatası tamir edilir.",
                  "Tamir uygun değilse aynı model veya yasal seçimlik haklar değerlendirilir.",
                  "Darbe, sıvı, çözücü, buhar ve bakım talimatına aykırı kullanım kapsam dışıdır.",
                ],
                [
                  "Ölçüye veya kişiye özel ürün",
                  "Onaylanan ölçü ve tasarıma uygunluk ile üretim hatası incelenir.",
                  "Üretim hatasında tamir veya yeniden üretim değerlendirilir; cayma istisnası ayıplı mal haklarını kaldırmaz.",
                  "Yanlış verilen ölçü, sonradan tercih değişikliği ve uygunsuz kullanım kapsam dışıdır.",
                ],
              ] as const
            ).map(([group, service, replacement, misuse]) => (
              <tr key={group} className="border-b border-dashed border-border align-top">
                <th scope="row" className="px-3 py-3 font-normal text-fg">
                  {group}
                </th>
                <td className="px-3 py-3 text-fg-muted">{service}</td>
                <td className="px-3 py-3 text-fg-muted">{replacement}</td>
                <td className="px-3 py-3 text-fg-muted">{misuse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Ne yapıyoruz</h2>
      <p>
        Sipariş numarası, stok kodu ve fotoğrafla {BRAND.email} adresine yazın. Ayıp görülürse tamir
        veya aynı model değişim. Ölçüye göre üretilen parçada cayma yoktur; üretim hatası yine
        ayıptır.
      </p>
      <h2>Başvuruda ne gerekir</h2>
      <ul className="mt-4 grid gap-2 text-sm">
        {[
          "Sipariş numarası (SW- ile başlar)",
          "Ürünün stok kodu",
          "Sorunu gösteren 2–3 fotoğraf, mümkünse gün ışığında",
          "Sorunun ne zaman ve nasıl ortaya çıktığı",
        ].map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 bg-taba" />
            {item}
          </li>
        ))}
      </ul>
      <h2>Süreç ve süre</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left text-sm">
          <tbody>
            {(
              [
                ["Değerlendirme", `${BRAND.reply} içinde yanıt`],
                ["Ürünün atölyeye ulaşması", "Kargo süresi, bedeli satıcıda"],
                ["Tamir veya değişim", "10–15 iş günü"],
                ["Yeniden gönderim", "3–5 iş günü, bedeli satıcıda"],
              ] as const
            ).map(([a, b]) => (
              <tr key={a} className="border-b border-dashed border-border">
                <th scope="row" className="py-3 pr-4 font-normal text-fg">
                  {a}
                </th>
                <td className="py-3">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
