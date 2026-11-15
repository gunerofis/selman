import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/hediye")({
  component: Page,
  head: () =>
    pageHead({
      title: "Hediye",
      description: "Fiyat fişi pakete konmaz. Sarma ve hediye kartı satılmaz.",
      path: "/hediye",
    }),
});

function Page() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Mağaza</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Hediye</h1>
      <p className="mt-3 text-sm text-fg-muted">
        Ödeme adımında isteğe bağlı kutu. Sarma, kurdele ve hediye kartı satılmaz.
      </p>
      <dl className="mt-10 grid gap-px bg-border sm:grid-cols-2">
        {(
          [
            ["Fiş", "Hediye işaretlenirse fiyat fişi pakete konmaz."],
            ["Not", "Kapıcı, kat, zil — teslimat notuna yazılır."],
            ["Adres", "Teslimat formu alıcının adresidir; ayrı hediye adresi yok."],
            ["Süre", "Hazır stok yine 3–5 iş günü. Hediye hızlandırmaz."],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-4 py-5">
            <dt className="font-display text-xl">{k}</dt>
            <dd className="mt-2 text-sm text-fg-muted">{v}</dd>
          </div>
        ))}
      </dl>
      <section className="mt-12">
        <h2 className="font-display text-3xl">Kime ne gider</h2>
        <ul className="mt-6 divide-y divide-dashed divide-border border-y border-dashed border-border">
          {(
            [
              ["Saat koleksiyoncusu", "Kapasiteye göre saat kutusu; 2, 4, 6 veya 12 saatlik modeller."],
              ["Mücevher takan", "Çekmeceli, vitrinli veya kilitli mücevher kutuları."],
            ] as const
          ).map(([k, v]) => (
            <li key={k} className="py-4">
              <p className="font-display text-xl">{k}</p>
              <p className="mt-1 text-sm text-fg-muted">{v}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl">Hediye almadan önce</h2>
        <ol className="mt-6 grid gap-3">
          {(
            [
              ["Ölçüyü kontrol edin", "Kutu nereye konacaksa o yüzeyi ölçün; ölçü rehberi yardımcı olur."],
              ["Rengi belirleyin", "Alıcının mobilya tonuna yakın bir renk seçin; palet sayfasında künye var."],
              ["Zamanı hesaplayın", "Hazır stok 3–5 iş günü. Özel gün için en az bir hafta önce sipariş verin."],
              ["Hediye kutusunu işaretleyin", "Ödeme adımında hediye seçeneğini işaretleyin; fiyat fişi konmaz."],
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
        Cayma ve iade, teslim alan için de 14 gündür; kullanılmamış ve etiketli olmalı. Ölçüye göre
        kesim hariç. Bildirim {BRAND.email} veya{" "}
        <Link to="/cayma" className="text-taba hover:underline">
          cayma
        </Link>
        .
      </p>
      <div className="mt-10 flex flex-wrap gap-2">
        <Link to="/saat-mucevher-kutulari">
          <Button variant="outline">Saat ve mücevher kutuları</Button>
        </Link>
        <Link to="/kurumsal-teklif" search={{ not: "Kurumsal hediye" }}>
          <Button variant="outline">Kurumsal hediye</Button>
        </Link>
        <Link to="/teslimat">
          <Button variant="outline">Teslimat</Button>
        </Link>
      </div>
    </div>
  );
}
