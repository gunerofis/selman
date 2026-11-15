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
      <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Atölye</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Malzeme</h1>
      <p className="mt-3 text-sm text-fg-muted">
        Gövde deri ile kaplanır. İç keçe veya süet. Menteşe ve vida görünmez kalır. {COLORS.length}{" "}
        renk <Link to="/palet" className="text-taba hover:underline">palet</Link> sayfasında.
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
      <p className="mt-8 text-sm leading-relaxed text-fg-muted">
        Fotoğraf örnektir; sitede seçilen renk zemini boyar, deri dokusunu değiştirmez. Bakım: nemli
        bez. Yağ, krem, çözücü ve buhar yok — <Link to="/bakim" className="text-taba hover:underline">bakım</Link>.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-fg-muted">
        Yapılmayanlar: elektrik, cam-seramik gövde, dış mekân, gıdayla doğrudan temas. Ölçüye göre
        iş <Link to="/tasarla" className="text-taba hover:underline">Tasarlayın</Link>’da.
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
