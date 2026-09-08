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
import { atelierMailto, isEmail, isHoneypot, openAtelierMail, sikayetDraft } from "@/lib/leads";

export const Route = createFileRoute("/sikayet")({
  component: Page,
  head: () =>
    pageHead({
      title: "Şikayet",
      description: "Önce atölye e-postası. Sonra hakem heyeti; dava öncesi arabulucu.",
      path: "/sikayet",
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
      form.reset();
      return;
    }
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const next = {
      name: name.length < 2 ? "Ad soyad en az 2 karakter." : "",
      email: isEmail(email) ? "" : "Geçerli bir e-posta yazın.",
      message: message.length < 8 ? "Mesaj en az 8 karakter." : "",
    };
    setFieldErr(next);
    if (next.name || next.email || next.message) {
      toast.error("Ad, e-posta ve mesajı kontrol edin.");
      return;
    }
    const mail = atelierMailto(
      sikayetDraft({
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
    <LegalPage kicker="Hukuki" title="Şikayet" updated={BRAND.legalUpdated}>
      <p>
        Önce {BRAND.email}. Dönüş {BRAND.reply}. Cayma ve ayıp için{" "}
        <Link to="/cayma">cayma</Link> ve <Link to="/garanti">garanti</Link>.
      </p>
      <h2>Sıra</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Atölye e-postası veya aşağıdaki form.</li>
        <li>Çözülmezse Tüketici Hakem Heyeti.</li>
        <li>
          Tüketici mahkemesi için 6502 m. 73/A uyarınca önce arabulucu.
        </li>
      </ol>
      <p>
        Resmî unvan ve MERSİS sitede uydurulmaz; künye: <Link to="/satici">satıcı</Link>.
      </p>

      <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-4 border border-dashed border-border bg-bg-elevated p-6 text-fg">
        <p className="font-display text-2xl text-fg">Atölyeye yazın</p>
        <Notice>
          Form e-posta uygulamanızı açar. Göndermezseniz atölyeye düşmez.
        </Notice>
        <FormField label="Ad soyad" required htmlFor="name" error={fieldErr.name}>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            className={fieldBorder(fieldErr.name)}
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
          />
        </FormField>
        <FormField label="Sipariş no" optional htmlFor="order">
          <Input id="order" name="order" />
        </FormField>
        <FormField label="Mesaj" required htmlFor="message" error={fieldErr.message}>
          <textarea
            id="message"
            name="message"
            required
            minLength={8}
            rows={5}
            className={`border bg-bg-elevated px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${fieldErr.message ? "border-danger" : "border-border-strong"}`}
          />
        </FormField>
        <div className="hidden" aria-hidden>
          <label>
            Bu alanı boş bırakın
            <input name="trap" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <Button type="submit" size="lg">
          Şikayeti gönder
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
    </LegalPage>
  );
}
