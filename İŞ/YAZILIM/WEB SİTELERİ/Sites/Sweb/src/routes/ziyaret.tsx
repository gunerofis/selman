import { type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/form-field";
import { Notice } from "@/components/demo-notice";
import { OpenBadge } from "@/components/open-badge";
import { isEmail, isHoneypot } from "@/lib/leads";
import { submitLead } from "@/lib/lead-submissions";

export const Route = createFileRoute("/ziyaret")({
  component: Page,
  head: () =>
    pageHead({
      title: "Atölye ziyareti",
      noindex: true,
      description: `${BRAND.district}, ${BRAND.city}. Hafta içi ${BRAND.hours}. Randevu formuyla.`,
      path: "/ziyaret",
    }),
});

function Page() {
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
    if (name.length < 2 || !isEmail(email)) {
      toast.error("Ad ve e-postayı kontrol edin.");
      return;
    }
    try {
      const result = await submitLead({
        data: {
          type: "visit",
          title: `${name} · Atölye ziyareti`,
          email,
          trap: String(fd.get("trap") ?? ""),
          data: {
            contactName: name,
            preferredTime: String(fd.get("when") ?? ""),
            message: String(fd.get("message") ?? ""),
          },
        },
      });
      toast.success(`Randevu talebi kaydedildi · ${result.reference}`);
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Randevu talebi kaydedilemedi.");
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-14 lg:grid-cols-2">
      <div>
        <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Atölye</p>
        <h1 className="mt-3 font-display text-5xl sm:text-6xl">Ziyaret</h1>
        <p className="mt-4 text-sm leading-relaxed text-fg-muted">
          {BRAND.atelier}. Ziyaretler, üretim akışını aksatmamak için randevuyla kabul edilir.
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
              ["Randevu", "Form ile, plansız ziyaret yok"],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="bg-bg-elevated px-4 py-5">
              <dt className="font-mono text-xs tracking-wide text-fg-muted uppercase">{k}</dt>
              <dd className="mt-2 text-sm">{v}</dd>
            </div>
          ))}
        </dl>
        <section className="mt-10">
          <h2 className="font-display text-2xl">Ziyarette ne görürsünüz</h2>
          <ul className="mt-4 grid gap-2 text-sm text-fg-muted">
            {[
              "Sekiz deri rengin fiziksel numunesi",
              "İç keçe ve süet örnekleri",
              "Stokta duran modellerin gerçek boyutu",
              "Menteşe, kilit ve kapak mekanizmaları",
              "Logo baskısı örnekleri (gofre, yaldız, serigrafi)",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 bg-taba" />
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-10">
          <h2 className="font-display text-2xl">Gelmeden önce</h2>
          <ol className="mt-4 grid gap-2 text-sm text-fg-muted">
            {[
              "Formu doldurun; gün ve saat teyidi e-posta ile gelir.",
              "İlgilendiğiniz stok kodlarını nota yazın, hazır bulundurulsun.",
              "Ölçüye göre iş için yerin ölçüsünü ve varsa fotoğrafını getirin.",
              "Atölye üretim alanıdır; kapalı ayakkabı tercih edin.",
            ].map((item, i) => (
              <li key={item} className="flex gap-2">
                <span className="font-mono text-xs text-fg-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </section>
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
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 border border-dashed border-border bg-bg-elevated p-6"
      >
        <p className="font-display text-2xl">Randevu iste</p>
        <Notice>Form randevu talebinizi doğrudan yönetim paneline kaydeder.</Notice>
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
      </form>
    </div>
  );
}
