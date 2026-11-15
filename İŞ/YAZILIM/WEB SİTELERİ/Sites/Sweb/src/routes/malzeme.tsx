import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { COLORS } from "@/lib/products";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/malzeme")({
  component: Page,
  head: () =>
    pageHead({
      title: "Malzeme",
      description: "Dış deri kaplama, iç keçe veya süet. Renk paleti ayrı.",
      path: "/malzeme",
    }),
});

function Page() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Atölye</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Malzeme</h1>
      <p className="mt-3 text-sm text-fg-muted">
        Gövde deri ile kaplanır. İç keçe veya süet. Menteşe ve vida görünmez kalır. {COLORS.length}{" "}
        renk{" "}
        <Link to="/palet" className="text-taba hover:underline">
          palet
        </Link>{" "}
        sayfasında.
      </p>
      <dl className="mt-10 grid gap-px bg-border sm:grid-cols-2">
        {(
          [
            ["Dış", "Deri kaplama. Masif deri blok değil; formun üzeri kaplanır."],
            ["İç", "Keçe veya süet. Çekmece ve tepsi tabanı yumuşak kalsın."],
            ["Gövde", "İstenirse ahşap. Metal menteşe, döner taban, vida gizlenir."],
            ["Renk", "Espresso, siyah, krem, orman, taş, beyaz, taba, kestane."],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-4 py-5">
            <dt className="font-display text-xl">{k}</dt>
            <dd className="mt-2 text-sm text-fg-muted">{v}</dd>
          </div>
        ))}
      </dl>
      <section className="mt-12">
        <h2 className="font-display text-3xl">Teknik künye</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <tbody>
              {(
                [
                  ["Gövde", "MDF veya masif ahşap; modele göre değişir, ürün sayfasında yazar."],
                  ["Kaplama", "Deri kaplama; deri türü satış öncesi teyit edilir."],
                  ["İç yüzey", "Keçe veya süet; çekmece ve tepsi tabanı yumuşaktır."],
                  ["Birleşim", "Gizli menteşe, gizli vida; dışarıdan metal görünmez."],
                  ["Kapak", "Modele göre mıknatıslı, toka veya kilitli."],
                  ["Tolerans", "Ölçüye göre üretimde ±2 mm sapma normaldir."],
                  ["Ağırlık", "Ürün sayfasında yazmıyorsa teklif adımında bildirilir."],
                ] as const
              ).map(([k, v]) => (
                <tr key={k} className="border-b border-dashed border-border align-top">
                  <th scope="row" className="w-40 py-3 pr-4 font-normal text-fg">
                    {k}
                  </th>
                  <td className="py-3 text-fg-muted">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl">Üretim sırası</h2>
        <ol className="mt-6 grid gap-3">
          {(
            [
              ["Kalıp", "Ölçü çıkarılır, gövde kesilir ve birleştirilir."],
              ["Kaplama", "Deri kesilir, gövdeye yapıştırılır; köşeler elde bastırılır."],
              ["İç kaplama", "Keçe veya süet iç yüzeye döşenir."],
              ["Montaj", "Menteşe, kilit ve döner aksam takılır; vidalar gizlenir."],
              ["Kontrol", "Kapak boşluğu, dikiş ve renk kontrol edilir, paketlenir."],
            ] as const
          ).map(([k, v], i) => (
            <li key={k} className="border border-dashed border-border bg-bg-elevated px-4 py-4">
              <p className="font-mono text-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-1 font-display text-xl">{k}</p>
              <p className="mt-1 text-sm text-fg-muted">{v}</p>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-8 text-sm leading-relaxed text-fg-muted">
        Fotoğraf örnektir; sitede seçilen renk zemini boyar, deri dokusunu değiştirmez. Bakım: nemli
        bez. Yağ, krem, çözücü ve buhar yok —{" "}
        <Link to="/bakim" className="text-taba hover:underline">
          bakım
        </Link>
        .
      </p>
      <p className="mt-4 text-sm leading-relaxed text-fg-muted">
        Yapılmayanlar: elektrik, cam-seramik gövde, dış mekân, gıdayla doğrudan temas. Ölçüye göre
        iş{" "}
        <Link to="/tasarla" className="text-taba hover:underline">
          Tasarlayın
        </Link>
        ’da.
      </p>
      <div className="mt-10 flex flex-wrap gap-2">
        <Link to="/palet">
          <Button>Palet</Button>
        </Link>
        <Link to="/atolye">
          <Button variant="outline">Atölye</Button>
        </Link>
        <Link to="/koleksiyon">
          <Button variant="outline">Ürünler</Button>
        </Link>
      </div>
    </div>
  );
}
