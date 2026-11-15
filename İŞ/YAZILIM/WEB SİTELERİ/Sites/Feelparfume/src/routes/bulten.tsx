import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { NewsletterForm } from "@/components/newsletter-form";
import { CatalogShelf } from "@/components/catalog-shelf";

export const Route = createFileRoute("/bulten")({
  component: Page,
  head: () =>
    pageHead({
      title: "Bülten",
      noindex: true,
      description: "Yeni ürün ve kampanya duyuruları için açık rızalı bülten kaydı.",
      path: "/bulten",
    }),
});

function Page() {
  return (
    <div className="mx-auto grid max-w-[1400px] items-start gap-10 px-4 py-10 lg:grid-cols-[minmax(0,36rem)_1fr]">
    <div>
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Yardım</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Bülten</h1>
      <p className="mt-4 text-sm leading-relaxed text-fg-muted">
        Yeni parfümler, kampanyalar ve koku önerileri. Reklam bombardımanı yok. Kayıt doğrudan bülten listesine alınır.
      </p>
      <dl className="mt-10 grid gap-px bg-border sm:grid-cols-2">
        {(
          [
            ["Ne gelir", "Yeni ürünler ve kampanyalar."],
            ["Sıklık", "Düzenli kampanya dizisi yok; arada bir."],
            ["Rıza", "Siz gönderirsiniz. 6563 sayılı Kanun, açık rıza."],
            ["Çıkış", `Aynı adrese “bülten çıkış” yazın.`],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-4 py-5">
            <dt className="font-display text-xl">{k}</dt>
            <dd className="mt-2 text-sm text-fg-muted">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-10 border border-solid border-border bg-bg-elevated p-6">
        <p className="font-display text-2xl">Kayıt</p>
        <p className="mt-2 text-sm text-fg-muted">
          Kaydınız yönetim panelindeki bülten listesine alınır. Aydınlatma:{" "}
          <Link to="/kvkk" className="text-taba hover:underline">
            KVKK
          </Link>
          .
        </p>
        <div className="mt-4">
          <NewsletterForm />
        </div>
      </div>
    </div>
    <CatalogShelf limit={6} className="sm:grid-cols-3 lg:grid-cols-2" />
    </div>
  );
}
