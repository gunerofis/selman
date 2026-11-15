import { type FormEvent, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { LegalPage } from "@/components/legal-page";
import { FormField, fieldBorder } from "@/components/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/demo-notice";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";
import { atelierMailto, caymaDraft, isEmail, isHoneypot, openAtelierMail } from "@/lib/leads";

export const Route = createFileRoute("/cayma")({
  component: Page,
  head: () =>
    pageHead({
      title: "Cayma hakkı",
      description: "Teslimden 14 gün, gerekçesiz. Bildirim e-posta veya bu form.",
      path: "/cayma",
    }),
});

function Page() {
  const [href, setHref] = useState("");
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (isHoneypot(String(fd.get("trap") ?? ""))) {
      setHref("sent");
      form.reset();
      return;
    }
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const order = String(fd.get("order") ?? "").trim();
    const sku = String(fd.get("sku") ?? "").trim();
    const delivered = String(fd.get("delivered") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const next = {
      name: name.length < 2 ? "Ad soyad en az 2 karakter." : "",
      email: isEmail(email) ? "" : "Geçerli bir e-posta yazın.",
    };
    setFieldErr(next);
    if (next.name || next.email) {
      toast.error("Ad ve e-postayı kontrol edin.");
      return;
    }
    const mail = atelierMailto(
      caymaDraft({ name, email, order, sku, delivered, message }),
    );
    setHref(mail);
    openAtelierMail(mail);
    toast.success("E-posta uygulamanız açıldı.");
    form.reset();
  }

  return (
    <LegalPage kicker="Hukuki" title="Cayma hakkı" updated={BRAND.legalUpdated}>
      <dl className="mb-8 grid gap-px bg-border sm:grid-cols-3">
        {(
          [
            ["Süre", "14 gün"],
            ["Gerekçe", "Gerekmez"],
            ["Hariç", "Ölçüye göre kesim"],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-4 py-5">
            <dt className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">{k}</dt>
            <dd className="mt-2 text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <p>
        Teslimden itibaren 14 gün içinde, herhangi bir gerekçe göstermeksizin cayma
        hakkınız vardır. Bildirim bu formla veya {BRAND.email} adresine açık bir
        yazıyla yeterlidir.
      </p>
      <p>
        Kullanılmış, hasarlı veya kişiye özel kesim / ölçüye göre üretilen ürünler
        cayma dışıdır. Ayrıntı: <Link to="/iade">İade</Link>.
      </p>
      <p>
        Anlaşmalı iade taşıyıcısı sitede adı yazılmaz; caymada iade kargosunu
        tüketiciye yüklemeyiz. Ayıplı malda da satıcı öder.
      </p>
      <p>
        Ön bilgi: <Link to="/on-bilgilendirme">ön bilgilendirme</Link>. Sözleşme:{" "}
        <Link to="/mesafeli">mesafeli satış</Link>.
      </p>

      <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-4 border border-dashed border-border bg-bg-elevated p-6 text-fg">
        <p className="font-display text-2xl text-fg">Cayma bildirimi</p>
        <Notice>
          Form, e-posta uygulamanızı {BRAND.email} adresine açar. Göndermezseniz
          atölyeye düşmez.
        </Notice>
        <FormField label="Ad soyad" required htmlFor="name" error={fieldErr.name}>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            minLength={2}
            className={fieldBorder(fieldErr.name)}
            aria-invalid={Boolean(fieldErr.name)}
          />
        </FormField>
        <FormField label="E-posta" required htmlFor="email" error={fieldErr.email}>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldBorder(fieldErr.email)}
            aria-invalid={Boolean(fieldErr.email)}
          />
        </FormField>
        <FormField label="Sipariş no" optional htmlFor="order" hint="Varsa SW- numarası.">
          <Input id="order" name="order" />
        </FormField>
        <FormField label="Ürün" optional htmlFor="sku" hint="Stok kodu veya ad.">
          <Input id="sku" name="sku" />
        </FormField>
        <FormField label="Teslim tarihi" optional htmlFor="delivered">
          <Input id="delivered" name="delivered" type="date" />
        </FormField>
        <FormField label="Not" optional htmlFor="message">
          <textarea
            id="message"
            name="message"
            rows={3}
            className="border border-border-strong bg-bg-elevated px-3 py-2 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </FormField>
        <div className="hidden" aria-hidden>
          <label>
            Bu alanı boş bırakın
            <input name="trap" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <Button type="submit" size="lg">
          Bildirimi gönder
        </Button>
        {href && href !== "sent" ? (
          <p className="text-sm text-fg-muted">
            Uygulama açılmazsa{" "}
            <a href={href} className="text-taba hover:underline">
              bu bağlantıdan gönderin
            </a>
            .
          </p>
        ) : null}
      </form>
    </LegalPage>
  );
}
