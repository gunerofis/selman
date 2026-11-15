import { type FocusEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  cartHasPendingPrice,
  cartLineDisplay,
  chargedSubtotal,
  discoveryCart,
  shippingFor,
  useCart,
} from "@/lib/cart";
import { PASTEL, getColor } from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { EmptyHint } from "@/components/qty-control";
import { RecentRail } from "@/components/recent-rail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  checkoutPayMethods,
  includedVat,
  isPostalCode,
  isTaxNumber,
  isTurkishPhone,
  type PayMethod,
} from "@/lib/commerce";
import { GIFT_WRAP_CENTS } from "@/lib/checkout-pricing";
import { TR_CITIES } from "@/lib/shipping";
import { PENDING_PRICE_NOTICE } from "@/lib/storefront-copy";
import { emailIssue } from "@/lib/leads";
import { quoteCheckout, submitOrder } from "@/lib/orders";
import {
  clearCheckoutDraft,
  readCheckoutDraft,
  stableOrderId,
  writeCheckoutDraft,
  type CheckoutDraft,
} from "@/lib/checkout-draft";
import { FormField, fieldBorder } from "@/components/form-field";
import { useSiteConfig } from "@/lib/site-config-context";

export const Route = createFileRoute("/odeme")({
  loader: async () => {
    const { paytrConfigured } = await import("@/lib/paytr.server");
    return { paytr: paytrConfigured() };
  },
  component: Checkout,
  head: () =>
    pageHead({
      title: "Ödeme",
      description: "Kapıda ödeme veya havale. Kart bilgisi bu sitede alınmaz.",
      path: "/odeme",
      noindex: true,
    }),
});

function Checkout() {
  const { paytr } = Route.useLoaderData();
  const methods = checkoutPayMethods(paytr);
  const { identity, shipping: shippingRule } = useSiteConfig();
  const navigate = useNavigate();
  const lines = useCart((s) => s.lines);
  const discovery = useCart((s) => s.discovery);
  const clear = useCart((s) => s.clear);
  const bundle = discoveryCart(lines, discovery);
  const subtotal = chargedSubtotal(lines, discovery);
  const shipping = shippingFor(subtotal, shippingRule);
  const pendingPrice = cartHasPendingPrice(lines);
  const [ready, setReady] = useState(false);
  const [pay, setPay] = useState<PayMethod>("kapida-nakit");
  const [error, setError] = useState("");
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<Partial<CheckoutDraft>>({});
  const [submitting, setSubmitting] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [hidePrices, setHidePrices] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [quote, setQuote] = useState<{
    discount: number;
    sampleCredit: number;
    shipping: number;
    giftWrap: number;
    total: number;
  } | null>(null);
  const [paytrToken, setPaytrToken] = useState("");
  const [city, setCity] = useState("İstanbul");
  const giftLira = giftWrap ? GIFT_WRAP_CENTS / 100 : 0;
  const discountShown = quote?.discount ?? 0;
  const sampleShown = quote?.sampleCredit ?? 0;
  const shippingShown = quote?.shipping ?? shipping;
  const total = quote ? quote.total - quote.giftWrap + giftLira : subtotal + shipping + giftLira;

  useEffect(() => {
    const stored = readCheckoutDraft();
    setDraft(stored);
    const allowed = checkoutPayMethods(paytr).map((method) => method.id);
    if (stored.pay && allowed.includes(stored.pay)) setPay(stored.pay);
    if (stored.gift || stored.hidePrices) setHidePrices(true);
    if (stored.giftWrap) setGiftWrap(true);
    if (stored.city && (TR_CITIES as readonly string[]).includes(stored.city)) setCity(stored.city);
    setReady(true);
  }, [paytr]);

  useEffect(() => {
    if (!paytrToken) return;
    const script = document.createElement("script");
    script.src = "https://www.paytr.com/js/iframeResizer.min.js";
    script.onload = () => {
      const host = window as Window & { iFrameResize?: (opts: object, target: string) => void };
      host.iFrameResize?.({}, "#paytriframe");
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [paytrToken]);

  useEffect(() => {
    setQuote(null);
    setAppliedCoupon("");
  }, [lines]);

  const items = useMemo(
    () =>
      lines
        .map((l) => {
          const p = cartLineDisplay(l);
          const c = getColor(l.color);
          if (!p) return null;
          return { ...l, product: p, colorName: p.catalog ? p.code : (c?.name ?? l.color) };
        })
        .filter(Boolean),
    [lines],
  );

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="font-display text-5xl">Sipariş bilgileri</h1>
        <p className="mt-4 text-sm text-fg-muted">Sipariş formunuz hazırlanıyor…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <EmptyHint
          title="Ödenecek bir şey yok"
          body=""
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/koleksiyon">
                <Button>Koleksiyona git</Button>
              </Link>
              <Link to="/sepet">
                <Button variant="outline">Sepete bak</Button>
              </Link>
            </div>
          }
        />
        <div className="mx-auto max-w-[1400px]">
          <RecentRail heading="Son baktıklarınız" />
        </div>
      </div>
    );
  }

  if (pendingPrice) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyHint
          title="Bu sepet için önce teklif gerekiyor"
          body=""
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/teklif" search={{ not: PENDING_PRICE_NOTICE }}>
                <Button>Fiyat ve stok teklifi al</Button>
              </Link>
              <Link to="/sepet">
                <Button variant="outline">Sepeti düzenle</Button>
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  function checkField(name: string, value: string) {
    const v = value.trim();
    if (name === "name") return v.length < 2 ? "Ad soyad en az 2 karakter." : "";
    if (name === "email") return emailIssue(v);
    if (name === "phone")
      return isTurkishPhone(v) ? "" : "Geçerli bir Türkiye telefon numarası girin.";
    if (name === "district") return v.length < 2 ? "İlçe girin." : "";
    if (name === "postal") return !v || isPostalCode(v) ? "" : "Posta kodu 5 haneli olmalı.";
    if (name === "taxNumber")
      return isTaxNumber(v) ? "" : "Vergi/TC kimlik no 10 veya 11 haneli olmalı.";
    if (name === "address") return v.length < 10 ? "Adres en az 10 karakter." : "";
    return "";
  }

  function onFieldBlur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const el = e.currentTarget;
    setFieldErr((s) => ({ ...s, [el.name]: checkField(el.name, el.value) }));
    if (el.name === "email" && !checkField("email", el.value) && lines.length) {
      void quoteCheckout({
        data: {
          items: lines.map((line) => ({ sku: line.sku, color: line.color, qty: line.qty })),
          coupon: appliedCoupon,
          giftWrap,
          email: el.value.trim(),
          discoverySet: bundle,
        },
      }).then((result) => {
        if (result.ok) {
          setQuote({
            discount: result.discount,
            sampleCredit: result.sampleCredit,
            shipping: result.shipping,
            giftWrap: result.giftWrap,
            total: result.total,
          });
        }
      });
    }
  }

  function onFieldInput(e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const el = e.currentTarget;
    persistField(el.name, el.value);
    setFieldErr((s) => {
      if (!s[el.name]) return s;
      const next = checkField(el.name, el.value);
      return { ...s, [el.name]: next };
    });
  }

  function persistField(name: string, value: string) {
    writeCheckoutDraft({ [name]: value } as Partial<CheckoutDraft>);
  }

  async function applyCoupon() {
    setCouponError("");
    const code = coupon.trim();
    if (!code) {
      setQuote(null);
      return;
    }
    const email = (document.getElementById("email") as HTMLInputElement | null)?.value?.trim() ?? "";
    try {
      const result = await quoteCheckout({
        data: {
          items: lines.map((line) => ({ sku: line.sku, color: line.color, qty: line.qty })),
          coupon: code,
          giftWrap,
          email,
          discoverySet: bundle,
        },
      });
      if (!result.ok) {
        setQuote(null);
        setAppliedCoupon("");
        setCouponError(result.error);
        return;
      }
      setAppliedCoupon(code);
      setQuote(result);
    } catch {
      setQuote(null);
      setCouponError("Kupon geçersiz.");
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError("");
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const cityPick = String(fd.get("city") ?? "").trim();
    const city = cityPick;
    const district = String(fd.get("district") ?? "").trim();
    const postal = String(fd.get("postal") ?? "").trim();
    const taxNumber = String(fd.get("taxNumber") ?? "").trim();
    const address = String(fd.get("address") ?? "").trim();
    const note = String(fd.get("note") ?? "").trim();
    const giftNote = String(fd.get("giftNote") ?? "").trim();
    const next = {
      name: checkField("name", name),
      email: checkField("email", email),
      phone: checkField("phone", phone),
      district: checkField("district", district),
      postal: checkField("postal", postal),
      taxNumber: checkField("taxNumber", taxNumber),
      address: checkField("address", address),
    };
    setFieldErr(next);
    const first = (
      ["name", "email", "phone", "district", "postal", "taxNumber", "address"] as const
    ).find((key) => next[key]);
    if (first) {
      setError("Eksik veya hatalı alanlar işaretli.");
      const el = document.getElementById(first);
      el?.scrollIntoView({ block: "center" });
      el?.focus();
      return;
    }
    if (!city || !(TR_CITIES as readonly string[]).includes(city)) {
      setError("İl seçin.");
      const el = document.getElementById("city");
      el?.focus();
      return;
    }
    if (!fd.get("onbilgi")) {
      setError("Ön bilgilendirmeyi işaretleyin.");
      return;
    }
    if (!fd.get("kvkk")) {
      setError("KVKK aydınlatmasını işaretleyin.");
      return;
    }
    setSubmitting(true);
    const customer = {
      name,
      email,
      phone,
      city,
      district,
      postal,
      taxNumber,
      address,
      note,
      pay,
      coupon: appliedCoupon,
      giftWrap,
      giftNote,
      hidePrices,
    };
    const id = stableOrderId(lines, email, JSON.stringify(customer));
    let payable = total;
    try {
      const priced = await quoteCheckout({
        data: {
          items: lines.map((line) => ({ sku: line.sku, color: line.color, qty: line.qty })),
          coupon: appliedCoupon,
          giftWrap,
          email,
          discoverySet: bundle,
        },
      });
      if (priced.ok && Math.round(priced.total * 100) !== Math.round(payable * 100)) {
        setQuote({
          discount: priced.discount,
          sampleCredit: priced.sampleCredit,
          shipping: priced.shipping,
          giftWrap: priced.giftWrap,
          total: priced.total,
        });
        setError("Sepet tutarı değişti. Sepeti yenileyip güncel tutarı kontrol edin.");
        return;
      }
      if (priced.ok) payable = priced.total;
      const receipt = await submitOrder({
        data: {
          id,
          ...customer,
          consent: true,
          discoverySet: bundle,
          expectedTotal: payable,
          items: lines.map((line) => ({ sku: line.sku, color: line.color, qty: line.qty })),
        },
      });
      const order = { ...customer, ...receipt, items: lines, received: true };
      try {
        localStorage.setItem("sweb-last-order", JSON.stringify(order));
      } catch {
        // The server receipt remains valid if this device cannot store a copy.
      }
      if (pay === "kart") {
        if (!receipt.paytrToken) {
          setError("Kart ödemesi başlatılamadı.");
          return;
        }
        setPaytrToken(receipt.paytrToken);
        return;
      }
      clearCheckoutDraft();
      clear();
      await navigate({ to: "/siparis/$id", params: { id: receipt.id } });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setError(
        message.startsWith("Kupon") ||
        message.startsWith("Sepet") ||
        message.startsWith("Kart") ||
        message.startsWith("Yurt") ||
        message.startsWith("Keşif")
          ? message
          : "Sipariş kaydı tamamlanamadı. Sepetiniz ve formunuz korundu; bağlantınızı kontrol edip yeniden deneyin. Tutar değiştiyse sepeti yenileyin.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_340px]">
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <ol className="flex flex-wrap gap-4 font-mono text-xs tracking-wide text-fg-muted uppercase">
          <li className="text-fg">1 · Teslimat</li>
          <li>2 · Ödeme</li>
          <li>3 · Onay</li>
        </ol>
        <h1 className="font-display text-4xl">Teslimat</h1>
        <FormField label="Ad soyad" required htmlFor="name" error={fieldErr.name}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            minLength={2}
            required
            className={fieldBorder(fieldErr.name)}
            aria-invalid={Boolean(fieldErr.name)}
            aria-describedby={fieldErr.name ? "name-hata" : undefined}
            defaultValue={draft.name ?? ""}
            onBlur={onFieldBlur}
            onInput={onFieldInput}
          />
        </FormField>
        <FormField
          label="E-posta"
          required
          htmlFor="email"
          hint="Siparişiniz hakkında size ulaşabilmemiz için."
          error={fieldErr.email}
        >
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="ad@ornek.com"
            defaultValue={draft.email ?? ""}
            className={fieldBorder(fieldErr.email)}
            aria-invalid={Boolean(fieldErr.email)}
            aria-describedby={fieldErr.email ? "email-hata" : undefined}
            onBlur={onFieldBlur}
            onInput={onFieldInput}
          />
        </FormField>
        <FormField
          label="Telefon"
          required
          htmlFor="phone"
          hint="Kargo bu numaradan ulaşır."
          error={fieldErr.phone}
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            pattern="(?:\+90|0)?(?:5[0-9]{9}|[234][0-9]{9})"
            title="Cep veya sabit Türkiye telefon numarası girin"
            required
            placeholder="05XXXXXXXXX"
            defaultValue={draft.phone ?? ""}
            className={fieldBorder(fieldErr.phone)}
            aria-invalid={Boolean(fieldErr.phone)}
            aria-describedby={fieldErr.phone ? "phone-hata" : undefined}
            onBlur={onFieldBlur}
            onInput={onFieldInput}
          />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="İl" required htmlFor="city">
            <select
              id="city"
              name="city"
              required
              value={city}
              onChange={(e) => {
                const next = e.target.value;
                setCity(next);
                persistField("city", next);
              }}
              className="h-11 border border-border-strong bg-bg-elevated px-3 text-sm"
            >
              {TR_CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </FormField>
          <FormField label="İlçe" required htmlFor="district" error={fieldErr.district}>
            <Input
              id="district"
              name="district"
              autoComplete="address-level2"
              required
              minLength={2}
              defaultValue={draft.district ?? ""}
              className={fieldBorder(fieldErr.district)}
              aria-invalid={Boolean(fieldErr.district)}
              aria-describedby={fieldErr.district ? "district-hata" : undefined}
              onBlur={onFieldBlur}
              onInput={onFieldInput}
            />
          </FormField>
        </div>
        <FormField
          label="Posta kodu (isteğe bağlı)"
          htmlFor="postal"
          hint="Kargo firması isterse 5 haneli posta kodunuzu yazın."
          error={fieldErr.postal}
        >
          <Input
            id="postal"
            name="postal"
            inputMode="numeric"
            autoComplete="postal-code"
            pattern="[0-9]{5}"
            title="5 haneli posta kodu"
            placeholder="34000"
            defaultValue={draft.postal ?? ""}
            className={fieldBorder(fieldErr.postal)}
            aria-invalid={Boolean(fieldErr.postal)}
            aria-describedby={fieldErr.postal ? "postal-hata" : undefined}
            onBlur={onFieldBlur}
            onInput={onFieldInput}
          />
        </FormField>
        <FormField
          label="Vergi / TC kimlik no"
          required
          htmlFor="taxNumber"
          hint="Fatura için: firma vergi no (10 hane) veya TC kimlik no (11 hane)."
          error={fieldErr.taxNumber}
        >
          <Input
            id="taxNumber"
            name="taxNumber"
            inputMode="numeric"
            required
            pattern="[0-9]{10,11}"
            title="10 haneli vergi no veya 11 haneli TC kimlik no"
            placeholder="Vergi no veya TC kimlik no"
            defaultValue={draft.taxNumber ?? ""}
            className={fieldBorder(fieldErr.taxNumber)}
            aria-invalid={Boolean(fieldErr.taxNumber)}
            aria-describedby={fieldErr.taxNumber ? "taxNumber-hata" : undefined}
            onBlur={onFieldBlur}
            onInput={onFieldInput}
          />
        </FormField>
        <FormField label="Adres" required htmlFor="address" error={fieldErr.address}>
          <textarea
            id="address"
            name="address"
            required
            minLength={10}
            rows={4}
            autoComplete="street-address"
            defaultValue={draft.address ?? ""}
            className={`border bg-bg-elevated px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${fieldErr.address ? "border-danger" : "border-border-strong"}`}
            aria-invalid={Boolean(fieldErr.address)}
            aria-describedby={fieldErr.address ? "address-hata" : undefined}
            onBlur={onFieldBlur}
            onInput={onFieldInput}
          />
        </FormField>
        <FormField
          label="Teslimat notu"
          optional
          htmlFor="note"
          hint="Kapıcı, kat, zil — kargoya iletilir."
        >
          <textarea
            id="note"
            name="note"
            rows={2}
            maxLength={240}
            placeholder="Kapıcı, kat, zil…"
            defaultValue={draft.note ?? ""}
            onInput={(e) => persistField("note", e.currentTarget.value)}
            className="border border-border-strong bg-bg-elevated px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </FormField>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="giftWrap"
            checked={giftWrap}
            onChange={(e) => {
              setGiftWrap(e.target.checked);
              writeCheckoutDraft({ giftWrap: e.target.checked });
            }}
            className="mt-1 size-4 shrink-0"
          />
          <span>Hediye paketi · {formatPrice(GIFT_WRAP_CENTS / 100)}</span>
        </label>
        <FormField label="Not kartı" optional htmlFor="giftNote">
          <textarea
            id="giftNote"
            name="giftNote"
            rows={2}
            maxLength={200}
            defaultValue={draft.giftNote ?? ""}
            onInput={(e) => persistField("giftNote", e.currentTarget.value)}
            className="border border-border-strong bg-bg-elevated px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </FormField>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="hidePrices"
            checked={hidePrices}
            onChange={(e) => {
              setHidePrices(e.target.checked);
              writeCheckoutDraft({ hidePrices: e.target.checked });
            }}
            className="mt-1 size-4 shrink-0"
          />
          <span>Fiyatsız irsaliye</span>
        </label>
        <div className="flex flex-wrap items-end gap-2">
          <FormField label="Kupon" htmlFor="coupon" error={couponError}>
            <Input
              id="coupon"
              name="coupon"
              value={coupon}
              maxLength={40}
              autoComplete="off"
              onChange={(e) => {
                setCoupon(e.target.value);
                setQuote(null);
                setAppliedCoupon("");
              }}
              aria-invalid={Boolean(couponError)}
            />
          </FormField>
          <Button type="button" variant="outline" onClick={() => void applyCoupon()}>
            Uygula
          </Button>
        </div>
        <fieldset className="grid gap-2">
          <legend className="text-sm">Ödeme</legend>
          {methods.map((method) => (
            <label
              key={method.id}
              className="flex items-start gap-3 border border-border-strong bg-bg-elevated px-3 py-3 text-sm"
            >
              <input
                type="radio"
                name="pay"
                className="mt-1"
                checked={pay === method.id}
                onChange={() => {
                  setPay(method.id);
                  writeCheckoutDraft({ pay: method.id });
                }}
              />
              <span>{method.label}</span>
            </label>
          ))}
          {pay === "havale" && identity.iban ? (
            <p className="font-mono text-sm">{identity.iban}</p>
          ) : null}
          {paytrToken ? (
            <iframe
              id="paytriframe"
              title="Kart ödemesi"
              src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
              className="min-h-[640px] w-full border border-border bg-bg"
            />
          ) : null}
        </fieldset>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="onbilgi" required className="mt-1 size-4 shrink-0" />
          <span>
            <Link to="/on-bilgilendirme" className="underline-offset-2 hover:underline">
              Ön bilgilendirmeyi
            </Link>{" "}
            ve{" "}
            <Link to="/mesafeli" className="underline-offset-2 hover:underline">
              mesafeli satışı
            </Link>{" "}
            okudum.
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="kvkk" required className="mt-1 size-4 shrink-0" />
          <span>
            <Link to="/kvkk" className="underline-offset-2 hover:underline">
              KVKK aydınlatmasını
            </Link>{" "}
            okudum.
          </span>
        </label>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {paytrToken ? null : (
          <Button type="submit" size="lg" disabled={submitting} aria-busy={submitting}>
            {submitting ? "Kaydediliyor…" : `Sipariş talebini oluştur · ${formatPrice(total)}`}
          </Button>
        )}
      </form>

      <aside
        className="h-fit border border-solid border-border bg-bg-elevated p-5 lg:sticky"
        style={{ top: "calc(var(--nav-h, 4rem) + var(--cookie-h, 0px) + 1rem)" }}
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl">Sipariş</h2>
          <Link to="/sepet" className="text-xs text-taba hover:underline">
            Sepeti düzenle
          </Link>
        </div>
        <ul className="mt-4 space-y-3">
          {items.map((it) =>
            it ? (
              <li
                key={`${it.sku}-${it.color}`}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <img
                    src={it.product.image}
                    alt=""
                    className="size-12 object-contain"
                    style={{ backgroundColor: PASTEL[it.color] }}
                    width={1500}
                    height={1500}
                  />
                  <span className="min-w-0">
                    {it.product.name}
                    <span className="block text-xs text-fg-subtle">
                      {it.colorName} × {it.qty}
                    </span>
                  </span>
                </span>
                <span className="tabular-nums">
                  {bundle
                    ? ""
                    : it.product.price == null
                      ? "Fiyat teyidi"
                      : formatPrice(it.product.price * it.qty)}
                </span>
              </li>
            ) : null,
          )}
        </ul>
        {discountShown > 0 ? (
          <div className="mt-4 flex justify-between text-sm">
            <span>İndirim</span>
            <span className="tabular-nums">-{formatPrice(discountShown)}</span>
          </div>
        ) : null}
        {sampleShown > 0 ? (
          <div className="mt-2 flex justify-between text-sm">
            <span>Deneme indirimi</span>
            <span className="tabular-nums">-{formatPrice(sampleShown)}</span>
          </div>
        ) : null}
        {giftLira > 0 ? (
          <div className="mt-2 flex justify-between text-sm">
            <span>Hediye paketi</span>
            <span className="tabular-nums">{formatPrice(giftLira)}</span>
          </div>
        ) : null}
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm">
          <span>Kargo</span>
          <span>{shippingShown === 0 ? "Ücretsiz" : formatPrice(shippingShown)}</span>
        </div>
        <div className="mt-2 flex justify-between text-base">
          <span>{pendingPrice ? "Bilinen toplam" : "Toplam"}</span>
          <span className="tabular-nums">{formatPrice(total)}</span>
        </div>
        {pendingPrice ? <p className="mt-2 text-xs text-fg-muted">{PENDING_PRICE_NOTICE}</p> : null}
        <p className="mt-1 text-xs text-fg-muted">KDV dahil {formatPrice(includedVat(total))}</p>
      </aside>
    </div>
  );
}
