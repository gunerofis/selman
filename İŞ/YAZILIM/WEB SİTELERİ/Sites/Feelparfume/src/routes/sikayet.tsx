import { type FormEvent, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { LegalPage } from "@/components/legal-page";
import { FormField, fieldBorder } from "@/components/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";
import { isEmail, isHoneypot } from "@/lib/leads";
import { submitLead } from "@/lib/lead-submissions";

export const Route = createFileRoute("/sikayet")({
  component: Page,
  head: () =>
    pageHead({
      title: "Şikayet",
      noindex: true,
      description: "Önce atölye e-postası. Sonra hakem heyeti; dava öncesi arabulucu.",
      path: "/sikayet",
    }),
});

function Page() {
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
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
    try {
      const result = await submitLead({
        data: {
          type: "complaint",
          title: `${name} · Şikayet`,
          email,
          trap: String(fd.get("trap") ?? ""),
          data: { contactName: name, orderNumber: String(fd.get("order") ?? ""), message },
        },
      });
      toast.success(`Şikayetiniz kaydedildi · ${result.reference}`);
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Şikayet kaydedilemedi.");
    }
  }

  return (
    <LegalPage kicker="Hukuki" title="Şikayet" updated={BRAND.legalUpdated}>
      <p>
        Önce {BRAND.email}. Dönüş {BRAND.reply}. Cayma ve ayıp için <Link to="/cayma">cayma</Link>{" "}
        ve <Link to="/garanti">garanti</Link>.
      </p>
      <h2>Sıra</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Atölye e-postası veya aşağıdaki form.</li>
        <li>Çözülmezse Tüketici Hakem Heyeti.</li>
        <li>Tüketici mahkemesi için 6502 m. 73/A uyarınca önce arabulucu.</li>
      </ol>
      <h2>Bildirimde ne yazmalı</h2>
      <ul className="mt-4 grid gap-2 text-sm">
        {[
          "Sipariş numarası (SW- ile başlar) ve sipariş tarihi",
          "Ürünün stok kodu ve rengi",
          "Sorunun ne olduğu, ne zaman fark edildiği",
          "Varsa fotoğraf veya kargo tutanağı",
          "Beklentiniz: tamir, değişim veya iade",
        ].map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 bg-taba" />
            {item}
          </li>
        ))}
      </ul>
      <h2>Süreler</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left text-sm">
          <tbody>
            {(
              [
                ["İlk yanıt", BRAND.reply],
                ["Değerlendirme sonucu", "En geç 5 iş günü"],
                ["Hakem heyeti başvurusu", "Çözüm gelmezse her zaman açıktır"],
              ] as const
            ).map(([a, b]) => (
              <tr key={a} className="border-b border-solid border-border">
                <th scope="row" className="py-3 pr-4 font-normal text-fg">
                  {a}
                </th>
                <td className="py-3">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Şikayetiniz ayıplı mala ilişkinse <Link to="/garanti">garanti</Link>, cayma hakkına
        ilişkinse <Link to="/cayma">cayma</Link> sayfasındaki süreç işler. Satıcının resmî künye ve
        iletişim bilgileri: <Link to="/satici">satıcı bilgileri</Link>.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-10 flex flex-col gap-4 border border-solid border-border bg-bg-elevated p-6 text-fg"
      >
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
      </form>
    </LegalPage>
  );
}
