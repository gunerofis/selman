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

export const Route = createFileRoute("/kurumsal-teklif")({
  validateSearch: (raw: Record<string, unknown>): Search => {
    const n = Number(raw.adet);
    return {
      sku: typeof raw.sku === "string" && getProduct(raw.sku) ? raw.sku : undefined,
      renk: COLORS.some((c) => c.id === raw.renk) ? (raw.renk as ColorId) : undefined,
      seri: SERIES.some((s) => s.id === raw.seri) ? (raw.seri as SeriesId) : undefined,
      adet: Number.isFinite(n) && n >= 50 ? Math.min(5000, Math.round(n)) : undefined,
      not: clipNote(raw.not),
    };
  },
  component: CorporateQuote,
  head: () =>
    pageHead({
      title: "Kurumsal teklif",
      description: `50 adet ve üzeri kurumsal siparişler için birim fiyat, logo baskısı ve teslim planı. ${BRAND.quoteReply} içinde yazılı dönüş yapılır.`,
      path: "/kurumsal-teklif",
    }),
});

function CorporateQuote() {
  const { sku, renk, seri, adet: adetIn, not } = Route.useSearch();
  const product = sku ? getProduct(sku) : null;
  const series = getSeries(seri);
  const colorName = renk ? COLORS.find((c) => c.id === renk)?.name : undefined;
  const seed = [product ? `${product.sku} · ${product.name}` : "", series?.name, colorName, not]
    .filter(Boolean)
    .join(" · ");
  const [adet, setAdet] = useState(adetIn ?? 50);
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
    const adetValue = Number(fd.get("adet") || 0);
    if (adetValue < 50) {
      toast.error("Kurumsal teklif en az 50 adet. Az adet için ürün teklifi sayfasını kullanın.");
      return;
    }
    const email = String(fd.get("email") ?? "").trim();
    if (!isEmail(email)) {
      toast.error("Geçerli e-posta girin.");
      return;
    }
    const firma = String(fd.get("firma") ?? "").trim();
    const yetkili = String(fd.get("yetkili") ?? "").trim();
    try {
      const result = await submitLead({
        data: {
          type: "quote",
          title: `Kurumsal · ${firma} · ${adetValue} adet`,
          email,
          trap: String(fd.get("trap") ?? ""),
          data: {
            scope: "kurumsal",
            company: firma,
            contactName: yetkili,
            phone: String(fd.get("tel") ?? ""),
            quantity: adetValue,
            logo: String(fd.get("logo") ?? "yok"),
            deadline: String(fd.get("tarih") ?? ""),
            notes: String(fd.get("not") ?? ""),
          },
        },
      });
      toast.success(`Kurumsal teklif talebi kaydedildi · ${result.reference}`);
      form.reset();
      setAdet(50);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Teklif talebi kaydedilemedi.");
    }
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-14">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Kurumsal</p>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">Kurumsal teklif</h1>
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-fg-muted">
        50 adet ve üzeri siparişler içindir: adet kırılımlı birim fiyat, logo baskısı ve teslim
        takvimi {BRAND.quoteReply} içinde yazılı iletilir. Tek parça veya az adet için{" "}
        <Link to="/teklif" className="text-taba hover:underline">
          ürün teklifi
        </Link>{" "}
        sayfasını kullanın.
      </p>
      <div className="mt-3">
        <OpenBadge />
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {[
          ["En az adet", "50"],
          ["Dönüş", BRAND.quoteReply],
          ["Üretim", "10–20 iş günü"],
          ["Logo baskı", "Var"],
        ].map(([k, v]) => (
          <div key={k} className="bg-bg-elevated px-5 py-6">
            <dt className="font-mono text-xs text-fg-muted">{k}</dt>
            <dd className="mt-2 font-display text-2xl">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-12 border border-dashed border-border bg-bg-wash p-6">
        <h2 className="font-display text-2xl">Nasıl ilerler</h2>
        <ol className="mt-5 grid gap-5 sm:grid-cols-4">
          {[
            ["01", "Talep", "Adet, ürün, renk ve teslim tarihini yazarsınız."],
            ["02", "Fiyat", `${BRAND.quoteReply} içinde adet kırılımlı birim fiyat gelir.`],
            ["03", "Numune", "Onay öncesi numune veya baskı provası hazırlanır."],
            ["04", "Üretim", "Onaydan sonra 10–20 iş günü içinde teslim edilir."],
          ].map(([n, t, d]) => (
            <li key={n}>
              <p className="font-mono text-xs text-fg-subtle">{n}</p>
              <p className="mt-1 font-display text-lg">{t}</p>
              <p className="mt-1 text-sm text-fg-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 grid gap-px bg-border sm:grid-cols-3">
        {[
          ["Logo baskısı", "Gofre, yaldız veya serigrafi. Vektörel logo (AI, SVG, PDF) istenir."],
          ["Numune", "Seri üretim öncesi tek adet numune gönderilir; ücreti siparişten düşülür."],
          ["Fatura ve ödeme", "Kurumsal fatura kesilir; ödeme havale/EFT ile yapılır."],
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
          <Notice>Talep doğrudan yönetim paneline kaydolur ve satış ekibine iletilir.</Notice>
          <FormField label="Firma" required htmlFor="firma">
            <Input id="firma" name="firma" required autoComplete="organization" />
          </FormField>
          <FormField label="Yetkili" required htmlFor="yetkili">
            <Input id="yetkili" name="yetkili" required autoComplete="name" />
          </FormField>
          <FormField label="E-posta" required htmlFor="email" hint="Teklif bu adrese gider.">
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="ad@firma.com"
            />
          </FormField>
          <FormField label="Telefon" optional htmlFor="tel" hint="Boş bırakılabilir.">
            <Input id="tel" name="tel" type="tel" autoComplete="tel" placeholder="5xx xxx xx xx" />
          </FormField>
          <FormField label="Adet" required htmlFor="adet" hint="En az 50.">
            <div className="flex items-center gap-2">
              <QtyControl value={adet} onChange={setAdet} min={50} step={10} />
              <input type="hidden" id="adet" name="adet" value={adet} />
            </div>
          </FormField>
          <FormField label="Logo baskısı" optional htmlFor="logo" hint="Varsa baskı yöntemi.">
            <select
              id="logo"
              name="logo"
              defaultValue="yok"
              className="h-11 border border-border-strong bg-bg-elevated px-3 text-sm text-fg"
            >
              <option value="yok">Logo baskısı yok</option>
              <option value="gofre">Gofre (kabartma)</option>
              <option value="yaldiz">Yaldız baskı</option>
              <option value="serigrafi">Serigrafi</option>
              <option value="oneri">Karar vermedim, önerin</option>
            </select>
          </FormField>
          <FormField label="Teslim tarihi" optional htmlFor="tarih" hint="Son teslim tarihiniz.">
            <Input id="tarih" name="tarih" type="date" />
          </FormField>
          <FormField label="Not" required htmlFor="not" hint="Stok kodu, renk, kullanım amacı.">
            <textarea
              id="not"
              name="not"
              required
              rows={5}
              defaultValue={seed}
              key={seed || "empty"}
              placeholder="Stok kodu, renk, kullanım amacı"
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
            Kurumsal teklif iste
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
          <p className="mt-2 font-display text-2xl">Kurumsalda sık istenenler</p>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {featured.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </aside>
      </div>
      <FaqList items={FAQ_QUOTE} heading="Kurumsal siparişte" />
    </div>
  );
}
