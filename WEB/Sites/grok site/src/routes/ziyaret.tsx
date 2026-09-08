import { type FormEvent, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/form-field";
import { Notice } from "@/components/demo-notice";
import { OpenBadge } from "@/components/open-badge";
import { atelierMailto, isEmail, isHoneypot, openAtelierMail, visitDraft } from "@/lib/leads";

export const Route = createFileRoute("/ziyaret")({
  component: Page,
  head: () =>
    pageHead({
      title: "Atölye ziyareti",
      description: `Bomonti, Şişli. Hafta içi ${BRAND.hours}. Randevu e-posta ile.`,
      path: "/ziyaret",
    }),
});

function Page() {
  const [href, setHref] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (isHoneypot(String(fd.get("trap") ?? ""))) {
      form.reset();
      return;
    }
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    if (name.length < 2 || !isEmail(email)) {
      toast.error("Ad ve e-postayı kontrol edin.");
      return;
    }
    const mail = atelierMailto(
      visitDraft({
        name,
        email,
        when: String(fd.get("when") ?? ""),
        message: String(fd.get("message") ?? ""),
      }),
    );
    setHref(mail);
    openAtelierMail(mail);
    toast.success("E-posta uygulamanız açıldı.");
    form.reset();
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-14 lg:grid-cols-2">
      <div>
        <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Atölye</p>
        <h1 className="mt-3 font-display text-5xl sm:text-6xl">Ziyaret</h1>
        <p className="mt-4 text-sm leading-relaxed text-fg-muted">
          {BRAND.atelier}. Cadde ve kapı numarası sitede yazılmaz; randevu onayında iletilir.
        </p>
        <div className="mt-3">
          <OpenBadge />
        </div>
        <dl className="mt-8 grid gap-px bg-border sm:grid-cols-2">
          {(
            [
              ["Yer", `${BRAND.neighborhood}, ${BRAND.district}`],
              ["Saat", `Hafta içi ${BRAND.hours}`],
              ["Hafta sonu", "Kapalı"],
              ["Randevu", "E-posta ile, walk-in yok"],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="bg-bg-elevated px-4 py-5">
              <dt className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">{k}</dt>
              <dd className="mt-2 text-sm">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-sm text-fg-muted">
          Numune ve renk, randevuda bakılır. Üretim devam ediyor olabilir.{" "}
          <Link to="/atolye" className="text-taba hover:underline">
            Atölye
          </Link>
          {" · "}
          <Link to="/palet" className="text-taba hover:underline">
            Palet
          </Link>
          .
        </p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4 border border-dashed border-border bg-bg-elevated p-6">
        <p className="font-display text-2xl">Randevu iste</p>
        <Notice>
          Form {BRAND.email} adresine e-posta açar. Göndermezseniz atölyeye düşmez.
        </Notice>
        <FormField label="Ad soyad" required htmlFor="name">
          <Input id="name" name="name" required autoComplete="name" minLength={2} />
        </FormField>
        <FormField label="E-posta" required htmlFor="email">
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </FormField>
        <FormField label="Tercih edilen gün" optional htmlFor="when">
          <Input id="when" name="when" placeholder="Hafta içi, öğleden sonra" />
        </FormField>
        <FormField label="Not" optional htmlFor="message">
          <textarea
            id="message"
            name="message"
            rows={3}
            className="border border-border-strong bg-bg-elevated px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </FormField>
        <div className="hidden" aria-hidden>
          <label>
            Bu alanı boş bırakın
            <input name="trap" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <Button type="submit" size="lg">
          Randevu yaz
        </Button>
        {href ? (
          <p className="text-sm text-fg-muted">
            Açılmazsa{" "}
            <a href={href} className="text-taba hover:underline">
              bu bağlantı
            </a>
            .
          </p>
        ) : null}
      </form>
    </div>
  );
}
