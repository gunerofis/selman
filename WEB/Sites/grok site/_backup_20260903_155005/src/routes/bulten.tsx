import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { BRAND } from "@/lib/brand";
import { NewsletterForm } from "@/components/newsletter-form";

export const Route = createFileRoute("/bulten")({
  component: Page,
  head: () =>
    pageHead({
      title: "Bülten",
      description: "Atölye notları. Kayıt e-posta ile açık rızadır.",
      path: "/bulten",
    }),
});

function Page() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Yardım</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Atölye notları</h1>
      <p className="mt-4 text-sm leading-relaxed text-fg-muted">
        Yeni parça, palet ve bakım notu. Reklam bombardımanı yok. Kayıt, e-posta
        uygulamanızdan {BRAND.email} adresine giden mesajdır; göndermezseniz listeye düşmez.
      </p>
      <dl className="mt-10 grid gap-px bg-border sm:grid-cols-2">
        {(
          [
            ["Ne gelir", "Atölye notu, yeni parça, bakım."],
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
      <div className="mt-10 border border-dashed border-border bg-bg-elevated p-6">
        <p className="font-display text-2xl">Kayıt</p>
        <p className="mt-2 text-sm text-fg-muted">
          Gönderince e-posta açılır. Aydınlatma:{" "}
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
  );
}
