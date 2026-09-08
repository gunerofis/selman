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
      <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Mağaza</p>
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
      <p className="mt-8 text-sm leading-relaxed text-fg-muted">
        Cayma ve iade, teslim alan için de 14 gündür; kullanılmamış ve etiketli olmalı. Ölçüye göre
        kesim hariç. Bildirim {BRAND.email} veya{" "}
        <Link to="/cayma" className="text-taba hover:underline">
          cayma
        </Link>
        .
      </p>
      <div className="mt-10 flex flex-wrap gap-2">
        <Link to="/koleksiyon">
          <Button>Ürünler</Button>
        </Link>
        <Link to="/odeme">
          <Button variant="outline">Ödemeye geç</Button>
        </Link>
        <Link to="/teslimat">
          <Button variant="outline">Teslimat</Button>
        </Link>
      </div>
    </div>
  );
}
