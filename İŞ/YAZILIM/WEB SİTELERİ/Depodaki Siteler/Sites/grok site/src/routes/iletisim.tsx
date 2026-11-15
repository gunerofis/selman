import { type FocusEvent, type FormEvent, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/demo-notice";
import { BRAND, hasBrandValue } from "@/lib/brand";
import { atelierMailto, contactDraft, isEmail, isHoneypot, openAtelierMail } from "@/lib/leads";
import { pageHead } from "@/lib/seo";
import { FREE_SHIPPING_FROM } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { OpenBadge } from "@/components/open-badge";
import { FaqList } from "@/components/faq-list";
import { FAQ_CONTACT } from "@/lib/faq";
import { FormField, fieldBorder } from "@/components/form-field";

export const Route = createFileRoute("/iletisim")({
  component: Contact,
  head: () =>
    pageHead({
      title: "İletişim",
      description: `Atölyeye yazın. Hafta içi ${BRAND.hours} yanıtlanır.`,
      path: "/iletisim",
    }),
});

function Contact() {
  const [href, setHref] = useState("");
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});

  function checkField(name: string, value: string) {
    const v = value.trim();
    if (name === "name") return v.length < 2 ? "Ad soyad en az 2 karakter." : "";
    if (name === "email") return isEmail(v) ? "" : "Geçerli bir e-posta yazın.";
    if (name === "message") return v.length < 8 ? "Mesaj en az 8 karakter." : "";
    return "";
  }

  function onFieldBlur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const el = e.currentTarget;
    setFieldErr((s) => ({ ...s, [el.name]: checkField(el.name, el.value) }));
  }

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
    const message = String(fd.get("message") ?? "").trim();
    const next = {
      name: checkField("name", name),
      email: checkField("email", email),
      message: checkField("message", message),
    };
    setFieldErr(next);
    const first = (["name", "email", "message"] as const).find((key) => next[key]);
    if (first) {
      toast.error("Ad, e-posta ve mesajı kontrol edin.");
      document.getElementById(first)?.focus();
      return;
    }
    const mail = atelierMailto(
      contactDraft({
        name,
        email,
        order: String(fd.get("order") ?? ""),
        message,
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
        <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">İletişim</p>
        <h1 className="mt-3 font-display text-5xl sm:text-6xl">Atölyeye yazın.</h1>
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-fg-muted">
          Sipariş, renk veya toptan için. Dönüş {BRAND.reply}.
        </p>
        <div className="mt-3">
          <OpenBadge />
        </div>
        <dl className="mt-8 grid gap-px bg-border sm:grid-cols-2">
          <div className="bg-bg-elevated px-4 py-5">
            <dt className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">E-posta</dt>
            <dd className="mt-2">
              <a href={`mailto:${BRAND.email}`} className="text-taba hover:underline">
                {BRAND.email}
              </a>
            </dd>
          </div>
          {hasBrandValue(BRAND.phone) ? (
            <div className="bg-bg-elevated px-4 py-5">
              <dt className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Telefon</dt>
              <dd className="mt-2">
                <a href={`tel:${BRAND.phone}`} className="text-taba hover:underline">
                  {BRAND.phone}
                </a>
              </dd>
            </div>
          ) : null}
          <div className="bg-bg-elevated px-4 py-5">
            <dt className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Atölye</dt>
            <dd className="mt-2">{BRAND.atelier}</dd>
          </div>
          <div className="bg-bg-elevated px-4 py-5">
            <dt className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Yanıt</dt>
            <dd className="mt-2">{BRAND.reply}</dd>
          </div>
          <div className="bg-bg-elevated px-4 py-5 sm:col-span-2">
            <dt className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Kargo</dt>
            <dd className="mt-2">{formatPrice(FREE_SHIPPING_FROM)} üzeri yok · 3–5 iş günü</dd>
          </div>
        </dl>
        <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-muted">
          <Link to="/teslimat" className="hover:text-taba">
            Teslimat
          </Link>
          <Link to="/ziyaret" className="hover:text-taba">
            Ziyaret
          </Link>
          <Link to="/siparis-sorgu" className="hover:text-taba">
            Sipariş sorgula
          </Link>
          <Link to="/sikayet" className="hover:text-taba">
            Şikayet
          </Link>
          <Link to="/tasarla" className="hover:text-taba">
            Tasarlayın
          </Link>
          <Link to="/teklif" className="hover:text-taba">
            Kurumsal teklif
          </Link>
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 border border-dashed border-border bg-bg-elevated p-6"
      >
        <Notice>
          Form, e-posta uygulamanızı {BRAND.email} adresine açar. Göndermezseniz aynı adrese yazın.
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
            onBlur={onFieldBlur}
          />
        </FormField>
        <FormField label="E-posta" required htmlFor="email" hint="Dönüş bu adrese gider." error={fieldErr.email}>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="ad@firma.com"
            className={fieldBorder(fieldErr.email)}
            aria-invalid={Boolean(fieldErr.email)}
            onBlur={onFieldBlur}
          />
        </FormField>
        <FormField label="Sipariş no" optional htmlFor="order" hint="Varsa tarayıcıdaki SW- numarası.">
          <Input id="order" name="order" />
        </FormField>
        <FormField label="Mesaj" required htmlFor="message" error={fieldErr.message}>
          <textarea
            id="message"
            name="message"
            required
            minLength={8}
            rows={5}
            className={`border bg-bg-elevated px-3 py-2 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${fieldErr.message ? "border-danger" : "border-border-strong"}`}
            aria-invalid={Boolean(fieldErr.message)}
            onBlur={onFieldBlur}
          />
        </FormField>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="kvkk" required className="mt-1 size-4 shrink-0" />
          <span>
            <Link to="/kvkk" className="underline-offset-2 hover:underline">
              KVKK aydınlatmasını
            </Link>{" "}
            okudum.
          </span>
        </label>
        <div className="hidden" aria-hidden>
          <label>
            Bu alanı boş bırakın
            <input name="trap" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <Button type="submit" size="lg">
          Mesaj gönder
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
      <div className="lg:col-span-2">
        <FaqList items={FAQ_CONTACT} />
      </div>
    </div>
  );
}
