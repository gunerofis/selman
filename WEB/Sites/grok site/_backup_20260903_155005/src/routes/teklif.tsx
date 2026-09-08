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
import { atelierMailto, isEmail, isHoneypot, openAtelierMail, quoteDraft } from "@/lib/leads";
import { COLORS, SERIES, featuredProducts, getProduct, getSeries, type ColorId, type SeriesId } from "@/lib/products";
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
      adet: Number.isFinite(n) && n >= 50 ? Math.min(5000, Math.round(n)) : undefined,
      not: clipNote(raw.not),
    };
  },
  component: Quote,
  head: () =>
    pageHead({
      title: "Kurumsal teklif",
      description: `50 adet ve üzeri. ${BRAND.quoteReply} içinde fiyat ve teslim planı.`,
      path: "/teklif",
    }),
});

function Quote() {
  const { sku, renk, seri, adet: adetIn, not } = Route.useSearch();
  const product = sku ? getProduct(sku) : null;
  const series = getSeries(seri);
  const colorName = renk ? COLORS.find((c) => c.id === renk)?.name : undefined;
  const seed = [product ? `${product.sku} · ${product.name}` : "", series?.name, colorName, not]
    .filter(Boolean)
    .join(" · ");
  const [href, setHref] = useState("");
  const [adet, setAdet] = useState(adetIn ?? 50);
  const featured = featuredProducts().slice(0, 4);

  useEffect(() => {
    if (adetIn) setAdet(adetIn);
  }, [adetIn]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (isHoneypot(String(fd.get("trap") ?? ""))) {
      setHref("sent");
      form.reset();
      return;
    }
    const adet = Number(fd.get("adet") || 0);
    if (adet < 50) {
      toast.error("Kurumsal teklif en az 50 adet.");
      return;
    }
    const email = String(fd.get("email") ?? "").trim();
    if (!isEmail(email)) {
      toast.error("Geçerli e-posta girin.");
      return;
    }
    const mail = atelierMailto(
      quoteDraft({
        firma: String(fd.get("firma") ?? ""),
        yetkili: String(fd.get("yetkili") ?? ""),
        email,
        tel: String(fd.get("tel") ?? ""),
        adet,
        note: String(fd.get("not") ?? ""),
      }),
    );
    setHref(mail);
    openAtelierMail(mail);
    toast.success("E-posta uygulamanız açıldı.");
    form.reset();
    setAdet(50);
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-14">
      <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Kurumsal</p>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">Kurumsal teklif</h1>
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-fg-muted">
        Adet, ürün ve teslim tarihini yazın; {BRAND.quoteReply} içinde fiyat ve teslim
        planıyla dönüş yapılır.
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
            <dt className="font-mono text-[11px] text-fg-muted">{k}</dt>
            <dd className="mt-2 font-display text-2xl">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        onSubmit={onSubmit}
        className="mt-10 flex flex-col gap-4 border border-dashed border-border bg-bg-elevated p-6"
      >
        <Notice>
          Talep {BRAND.email} adresine e-posta olarak gider. Göndermezseniz aynı adrese yazın.
        </Notice>
        <FormField label="Firma" required htmlFor="firma">
          <Input id="firma" name="firma" required autoComplete="organization" />
        </FormField>
        <FormField label="Yetkili" required htmlFor="yetkili">
          <Input id="yetkili" name="yetkili" required autoComplete="name" />
        </FormField>
        <FormField label="E-posta" required htmlFor="email" hint="Teklif bu adrese gider.">
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="ad@firma.com" />
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
        <FormField label="Not" required htmlFor="not" hint="Stok kodu, renk, teslim tarihi.">
          <textarea
            id="not"
            name="not"
            required
            rows={5}
            defaultValue={seed}
            key={seed || "empty"}
            placeholder="Stok kodu, renk, teslim tarihi"
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
      <aside>
        <div className="mb-4">
          <PrintButton label="Sayfayı yazdır" />
        </div>
        {product ? (
          <div className="mb-8">
            <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Bu parça</p>
            <p className="mt-2 font-display text-2xl">{product.name}</p>
            <div className="mt-4">
              <ProductCard product={product} color={renk} />
            </div>
          </div>
        ) : series ? (
          <div className="mb-8">
            <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Kit</p>
            <p className="mt-2 font-display text-2xl">{series.name}</p>
            <p className="mt-1 text-sm text-fg-muted">{series.blurb}</p>
          </div>
        ) : null}
        <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Katalogdan</p>
        <p className="mt-2 font-display text-2xl">Sık istenen parçalar</p>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          {featured.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      </aside>
      </div>
      <FaqList items={FAQ_QUOTE} />
    </div>
  );
}
