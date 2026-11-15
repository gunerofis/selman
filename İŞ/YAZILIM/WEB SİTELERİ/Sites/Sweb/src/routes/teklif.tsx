import { type FormEvent, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/demo-notice";
import { ProductCard } from "@/components/product-card";
import { OpenBadge } from "@/components/open-badge";
import { QtyControl } from "@/components/qty-control";
import { BRAND } from "@/lib/brand";
import { isEmail, isHoneypot } from "@/lib/leads";
import { submitLead } from "@/lib/lead-submissions";
import {
  COLORS,
  SERIES,
  featuredProducts,
  getProduct,
  getSeries,
  type ColorId,
  type SeriesId,
} from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { FaqList } from "@/components/faq-list";
import { FAQ_QUOTE } from "@/lib/faq";
import { PrintButton } from "@/components/print-button";
import { FormField } from "@/components/form-field";

type Search = { sku?: string; renk?: ColorId; seri?: SeriesId; adet?: number; not?: string };

function clipNote(raw: unknown) {
  if (typeof raw !== "string") return undefined;
  const t = raw.trim();
  if (!t) return undefined;
  return t.length > 180 ? `${t.slice(0, 177)}…` : t;
}

export const Route = createFileRoute("/teklif")({
  validateSearch: (raw: Record<string, unknown>): Search => {
    const n = Number(raw.adet);
    return {
      sku: typeof raw.sku === "string" && getProduct(raw.sku) ? raw.sku : undefined,
      renk: COLORS.some((c) => c.id === raw.renk) ? (raw.renk as ColorId) : undefined,
      seri: SERIES.some((s) => s.id === raw.seri) ? (raw.seri as SeriesId) : undefined,
      adet: Number.isFinite(n) && n >= 1 ? Math.min(5000, Math.round(n)) : undefined,
      not: clipNote(raw.not),
    };
  },
  component: ProductQuote,
  head: () =>
    pageHead({
      title: "Ürün teklifi",
      description: `Tek parça ve az adetli siparişler için fiyat, ölçü ve teslim teyidi. ${BRAND.reply} içinde dönüş yapılır; adet sınırı yoktur.`,
      path: "/teklif",
    }),
});

function ProductQuote() {
  const { sku, renk, seri, adet: adetIn, not } = Route.useSearch();
  const product = sku ? getProduct(sku) : null;
  const series = getSeries(seri);
  const colorName = renk ? COLORS.find((c) => c.id === renk)?.name : undefined;
  const seed = [product ? `${product.sku} · ${product.name}` : "", series?.name, colorName, not]
    .filter(Boolean)
    .join(" · ");
  const [adet, setAdet] = useState(adetIn ?? 1);
  const featured = featuredProducts().slice(0, 4);

  useEffect(() => {
    if (adetIn) setAdet(adetIn);
  }, [adetIn]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (isHoneypot(String(fd.get("trap") ?? ""))) {
      form.reset();
      return;
    }
    const email = String(fd.get("email") ?? "").trim();
    if (!isEmail(email)) {
      toast.error("Geçerli e-posta girin.");
      return;
    }
    const adSoyad = String(fd.get("ad") ?? "").trim();
    const adetValue = Math.max(1, Number(fd.get("adet") || 1));
    try {
      const result = await submitLead({
        data: {
          type: "quote",
          title: `Ürün teklifi · ${adSoyad || email} · ${adetValue} adet`,
          email,
          trap: String(fd.get("trap") ?? ""),
          data: {
            scope: "urun",
            contactName: adSoyad,
            phone: String(fd.get("tel") ?? ""),
            quantity: adetValue,
            product: product ? `${product.sku} · ${product.name}` : "",
            color: colorName ?? "",
            notes: String(fd.get("not") ?? ""),
          },
        },
      });
      toast.success(`Ürün teklifi talebi kaydedildi · ${result.reference}`);
      form.reset();
      setAdet(1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Teklif talebi kaydedilemedi.");
    }
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-14">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Ürün</p>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">Ürün teklifi</h1>
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-fg-muted">
        Tek parça ve az adetli siparişler içindir: fiyat, ölçü, renk ve teslim süresi{" "}
        {BRAND.reply} içinde teyit edilir. Adet sınırı yoktur. 50 adet ve üzeri için{" "}
        <Link to="/kurumsal-teklif" className="text-taba hover:underline">
          kurumsal teklif
        </Link>{" "}
        sayfasını kullanın.
      </p>
      <div className="mt-3">
        <OpenBadge />
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {[
          ["Adet sınırı", "Yok"],
          ["Dönüş", BRAND.reply],
          ["Hazır stok", "3–5 iş günü"],
          ["Ölçüye göre", "10–15 iş günü"],
        ].map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-5 py-6">
            <dt className="font-mono text-xs text-fg-muted">{k}</dt>
            <dd className="mt-2 font-display text-2xl">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-12 grid gap-px bg-border sm:grid-cols-3">
        {[
          ["Ne zaman gerekir", "Fiyatı görünmeyen parçalar, ölçü değişikliği veya renk kombinasyonu isteyen siparişler."],
          ["Neyi teyit ederiz", "Birim fiyat, dış ölçü, seçtiğiniz renk ve kargoya çıkış tarihi."],
          ["Sipariş nasıl olur", "Onayınızdan sonra sipariş kaydı açılır; kart bilgisi sitede alınmaz."],
        ].map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-5 py-6">
            <p className="font-display text-lg">{k}</p>
            <p className="mt-2 text-sm text-fg-muted">{v}</p>
          </div>
        ))}
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 border border-dashed border-border bg-bg-elevated p-6"
        >
          <Notice>Talep doğrudan yönetim paneline kaydolur ve atölyeye iletilir.</Notice>
          <FormField label="Ad soyad" required htmlFor="ad">
            <Input id="ad" name="ad" required autoComplete="name" />
          </FormField>
          <FormField label="E-posta" required htmlFor="email" hint="Teklif bu adrese gider.">
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="ad@ornek.com"
            />
          </FormField>
          <FormField label="Telefon" optional htmlFor="tel" hint="Boş bırakılabilir.">
            <Input id="tel" name="tel" type="tel" autoComplete="tel" placeholder="5xx xxx xx xx" />
          </FormField>
          <FormField label="Adet" required htmlFor="adet" hint="Tek parça da olabilir.">
            <div className="flex items-center gap-2">
              <QtyControl value={adet} onChange={setAdet} min={1} step={1} />
              <input type="hidden" id="adet" name="adet" value={adet} />
            </div>
          </FormField>
          <FormField
            label="Ürün ve not"
            required
            htmlFor="not"
            hint="Stok kodu, renk, ölçü veya kullanım amacı."
          >
            <textarea
              id="not"
              name="not"
              required
              rows={5}
              defaultValue={seed}
              key={seed || "empty"}
              placeholder="Stok kodu, renk, ölçü"
              className="border border-border-strong bg-bg-elevated px-3 py-2 font-mono text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            Teklif iste
          </Button>
        </form>
        <aside>
          <div className="mb-4">
            <PrintButton label="Sayfayı yazdır" />
          </div>
          {product ? (
            <div className="mb-8">
              <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Bu parça</p>
              <p className="mt-2 font-display text-2xl">{product.name}</p>
              <div className="mt-4">
                <ProductCard product={product} color={renk} />
              </div>
            </div>
          ) : series ? (
            <div className="mb-8">
              <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Masa seti</p>
              <p className="mt-2 font-display text-2xl">{series.name}</p>
              <p className="mt-1 text-sm text-fg-muted">{series.blurb}</p>
            </div>
          ) : null}
          <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Katalogdan</p>
          <p className="mt-2 font-display text-2xl">Sık istenen parçalar</p>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {featured.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </aside>
      </div>
      <FaqList items={FAQ_QUOTE} heading="Teklif hakkında" />
    </div>
  );
}
