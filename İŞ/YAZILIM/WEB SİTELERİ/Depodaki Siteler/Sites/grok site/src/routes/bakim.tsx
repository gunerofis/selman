import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { FaqList } from "@/components/faq-list";
import { FAQ_CARE } from "@/lib/faq";
import { CATEGORIES } from "@/lib/products";

export const Route = createFileRoute("/bakim")({
  component: CarePage,
  head: () =>
    pageHead({
      title: "Bakım",
      description: "Nemli bez. Yağ, çözücü, buhar yok. Deri kaplama bakım.",
      path: "/bakim",
    }),
});

function CarePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Atölye</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Bakım</h1>
      <p className="mt-3 text-sm text-fg-muted">
        Dış deri kaplama, iç keçe veya süet. Günlük bakım kısa tutulsun.
      </p>
      <dl className="mt-10 grid gap-px bg-border sm:grid-cols-2">
        {(
          [
            ["Yapın", "Nemli, sıkılmış bez. Hafif silin, kurulayın."],
            ["Yapmayın", "Yağ, çözücü, buhar, çamaşır suyu, deri kremi."],
            ["Güneş", "Uzun doğrudan güneş rengi soldurur. Perde veya gölge."],
            ["Damlama", "Tepsi varsa çıkarıp ayrı yıkayın. Gövdeyi ıslatmayın."],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-4 py-5">
            <dt className="font-display text-xl">{k}</dt>
            <dd className="mt-2 text-sm text-fg-muted">{v}</dd>
          </div>
        ))}
      </dl>
      <section className="mt-12">
        <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Oda</p>
        <h2 className="mt-2 font-display text-2xl">Nerede durduğuna göre</h2>
        <ul className="mt-6 divide-y divide-dashed divide-border border-y border-dashed border-border">
          {(
            [
              ["ofis", "Kuru bez. Kahve ve mürekkep hemen silin."],
              ["banyo", "Damlama tepsisi varsa çıkarın. Gövdeyi ıslatmayın."],
              ["mutfak", "Yağ sıçrarsa nemli bez; çözücü yok."],
              ["giris", "Islak şemsiye ve ayakkabı suyu silin."],
            ] as const
          ).map(([id, note]) => {
            const cat = CATEGORIES.find((c) => c.id === id);
            return (
              <li key={id} className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                <div>
                  <p className="font-display text-xl">{cat?.name ?? id}</p>
                  <p className="mt-1 text-sm text-fg-muted">{note}</p>
                </div>
                <Link to="/kategori/$id" params={{ id }} className="text-xs text-taba hover:underline">
                  Odayı gör
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <p className="mt-8 text-sm leading-relaxed text-fg-muted">
        Islak hacimde (banyo, evye) suyu silin. Çizik görünürse atölyeye yazın; renk tamiri stok
        kodu ve fotoğrafla değerlendirilir. İade koşulları için{" "}
        <Link to="/iade" className="text-taba hover:underline">
          iade
        </Link>{" "}
        sayfası.
      </p>
      <div className="mt-10 flex flex-wrap gap-2">
        <Link to="/palet">
          <Button variant="outline">Palet</Button>
        </Link>
        <Link to="/olcu">
          <Button variant="outline">Ölçü</Button>
        </Link>
        <Link to="/iletisim">
          <Button>Atölyeye yazın</Button>
        </Link>
      </div>
      <FaqList items={FAQ_CARE} />
    </div>
  );
}
