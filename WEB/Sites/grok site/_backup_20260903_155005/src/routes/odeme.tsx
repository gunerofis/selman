import { type FocusEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { cartSubtotal, shippingFor, useCart } from "@/lib/cart";
import { PASTEL, getColor, getProduct } from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { EmptyHint } from "@/components/qty-control";
import { RecentRail } from "@/components/recent-rail";
import { Notice } from "@/components/demo-notice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { includedVat, isPostalCode, isTurkishMobile, PAY_METHODS, payLabel, type PayMethod } from "@/lib/commerce";
import { BRAND, hasBrandValue } from "@/lib/brand";
import { atelierMailto, emailIssue, openAtelierMail, orderDraft } from "@/lib/leads";
import {
  clearCheckoutDraft,
  readCheckoutDraft,
  stableOrderId,
  writeCheckoutDraft,
  type CheckoutDraft,
} from "@/lib/checkout-draft";
import { EtaLine } from "@/components/eta-line";
import { FormField, fieldBorder } from "@/components/form-field";
import { ShippingBar } from "@/components/shipping-bar";

export const Route = createFileRoute("/odeme")({
  component: Checkout,
  head: () =>
    pageHead({
      title: "Ödeme",
      description: "Kapıda ödeme veya havale. Kart bilgisi bu sitede alınmaz.",
      path: "/odeme",
      noindex: true,
    }),
});

const CITIES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Kocaeli",
  "Eskişehir",
  "Adana",
  "Gaziantep",
  "Konya",
  "Mersin",
  "Kayseri",
  "Samsun",
  "Denizli",
  "Muğla",
  "Trabzon",
  "Balıkesir",
  "Sakarya",
  "Tekirdağ",
  "Diğer",
];
const KNOWN_CITIES = CITIES.filter((c) => c !== "Diğer");

function Checkout() {
  const navigate = useNavigate();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const subtotal = cartSubtotal(lines);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  const [ready, setReady] = useState(false);
  const [pay, setPay] = useState<PayMethod>("kapida-nakit");
  const [error, setError] = useState("");
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<Partial<CheckoutDraft>>({});
  const [submitting, setSubmitting] = useState(false);
  const [gift, setGift] = useState(false);
  const [city, setCity] = useState("İstanbul");
  const [cityOther, setCityOther] = useState("");

  useEffect(() => {
    const stored = readCheckoutDraft();
    setDraft(stored);
    if (stored.pay && ["kapida-nakit", "kapida-kart", "havale"].includes(stored.pay)) {
      setPay(stored.pay);
    }
    if (stored.gift) setGift(true);
    if (stored.city && KNOWN_CITIES.includes(stored.city)) {
      setCity(stored.city);
    } else if (stored.city) {
      setCity("Diğer");
      setCityOther(stored.cityOther || stored.city);
    }
    setReady(true);
  }, []);

  const items = useMemo(
    () =>
      lines
        .map((l) => {
          const p = getProduct(l.sku);
          const c = getColor(l.color);
          if (!p) return null;
          return { ...l, product: p, colorName: c?.name ?? l.color };
        })
        .filter(Boolean),
    [lines],
  );

  if (!ready) {
    return <div className="mx-auto max-w-6xl px-4 py-20 text-sm text-fg-muted">Yükleniyor…</div>;
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <EmptyHint
          title="Ödenecek bir şey yok"
          body="Sepetiniz boş. Koleksiyondan başlayın."
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

  function checkField(name: string, value: string) {
    const v = value.trim();
    if (name === "name") return v.length < 2 ? "Ad soyad en az 2 karakter." : "";
    if (name === "email") return emailIssue(v);
    if (name === "phone") return isTurkishMobile(v) ? "" : "05XXXXXXXXX veya +90 5XX…";
    if (name === "district") return v.length < 2 ? "İlçe girin." : "";
    if (name === "postal") return isPostalCode(v) ? "" : "Posta kodu 5 haneli olmalı.";
    if (name === "address") return v.length < 10 ? "Adres en az 10 karakter." : "";
    return "";
  }

  function onFieldBlur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const el = e.currentTarget;
    setFieldErr((s) => ({ ...s, [el.name]: checkField(el.name, el.value) }));
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

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError("");
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const cityPick = String(fd.get("city") ?? "").trim();
    const cityExtra = String(fd.get("cityOther") ?? "").trim();
    const city = cityPick === "Diğer" ? cityExtra : cityPick;
    const district = String(fd.get("district") ?? "").trim();
    const postal = String(fd.get("postal") ?? "").trim();
    const address = String(fd.get("address") ?? "").trim();
    const noteRaw = String(fd.get("note") ?? "").trim();
    const asGift = Boolean(fd.get("gift"));
    const note = [asGift ? "Hediye: fiyat fişi pakete konmasın." : "", noteRaw]
      .filter(Boolean)
      .join(" ");
    const next = {
      name: checkField("name", name),
      email: checkField("email", email),
      phone: checkField("phone", phone),
      district: checkField("district", district),
      postal: checkField("postal", postal),
      address: checkField("address", address),
    };
    setFieldErr(next);
    const first = (["name", "email", "phone", "district", "postal", "address"] as const).find(
      (key) => next[key],
    );
    if (first) {
      setError("Eksik veya hatalı alanlar işaretli.");
      const el = document.getElementById(first);
      el?.scrollIntoView({ block: "center" });
      el?.focus();
      return;
    }
    if (!city || (cityPick === "Diğer" && cityExtra.length < 2)) {
      setError("İl seçin veya yazın.");
      const el = document.getElementById(cityPick === "Diğer" ? "cityOther" : "city");
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
    const id = stableOrderId(lines, email);
    const lineText = lines.map((l) => {
      const p = getProduct(l.sku);
      const c = getColor(l.color);
      const nameLine = p?.name ?? l.sku;
      const price = p ? formatPrice(p.price * l.qty) : "";
      return `${nameLine} · ${c?.name ?? l.color} × ${l.qty}${price ? ` · ${price}` : ""}`;
    });
    const mail = atelierMailto(
      orderDraft({
        id,
        name,
        email,
        phone,
        city,
        district,
        postal,
        address,
        note,
        pay: payLabel(pay),
        total: formatPrice(total),
        shipping: shipping === 0 ? "Ücretsiz" : formatPrice(shipping),
        lines: lineText,
      }),
    );
    const order = {
      id,
      name,
      email,
      phone,
      city,
      district,
      postal,
      address,
      note: note || undefined,
      pay,
      total,
      items: lines,
      mail,
      at: new Date().toISOString(),
    };
    try {
      localStorage.setItem("sweb-last-order", JSON.stringify(order));
    } catch {
      /* ignore quota */
    }
    openAtelierMail(mail);
    clearCheckoutDraft();
    clear();
    void navigate({ to: "/siparis/$id", params: { id: order.id } });
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
        <Notice>
          Kart numarası bu sitede alınmaz. Sipariş, e-posta uygulamanızdan {BRAND.email} adresine
          gider. Atölyeye düşmesi için o mesajı göndermeniz gerekir.
        </Notice>
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
          hint="Sipariş kopyası bu adrese düşer. Kart istenmez."
          error={fieldErr.email}
        >
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="ad@firma.com"
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
            pattern="(?:\\+90|0)?5[0-9]{9}"
            title="05XXXXXXXXX veya +905XXXXXXXXX biçiminde bir cep telefonu girin"
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
                if (next !== "Diğer") {
                  setCityOther("");
                  persistField("cityOther", "");
                }
              }}
              className="h-11 border border-border-strong bg-bg-elevated px-3 text-sm"
            >
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </FormField>
          {city === "Diğer" ? (
            <FormField label="İl adı" required htmlFor="cityOther">
              <Input
                id="cityOther"
                name="cityOther"
                autoComplete="address-level1"
                required
                minLength={2}
                value={cityOther}
                onChange={(e) => {
                  setCityOther(e.target.value);
                  persistField("cityOther", e.target.value);
                }}
              />
            </FormField>
          ) : null}
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
          label="Posta kodu"
          required
          htmlFor="postal"
          hint="5 hane, örneğin 34394."
          error={fieldErr.postal}
        >
          <Input
            id="postal"
            name="postal"
            inputMode="numeric"
            autoComplete="postal-code"
            required
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
            name="gift"
            checked={gift}
            onChange={(e) => {
              setGift(e.target.checked);
              writeCheckoutDraft({ gift: e.target.checked });
            }}
            className="mt-1 size-4 shrink-0"
          />
          <span>
            Hediye — fiyat fişini pakete koymayın
            <span className="mt-0.5 block text-xs text-fg-muted">
              Sarma yok; atölye fişi dışarıda bırakır.
            </span>
          </span>
        </label>
        <fieldset className="grid gap-2">
          <legend className="text-sm">Ödeme</legend>
          {PAY_METHODS.map((method) => (
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
              <span>
                {method.label}
                <span className="mt-0.5 block text-xs text-fg-muted">{method.hint}</span>
              </span>
            </label>
          ))}
          {pay === "havale" ? (
            <p className="text-sm text-fg-muted">
              {hasBrandValue(BRAND.iban)
                ? `Havale açıklamasına sipariş numarasını yazın. IBAN: ${BRAND.iban}`
                : "IBAN sipariş onayından sonra e-posta ile iletilir. Açıklamaya sipariş numarasını yazın."}
            </p>
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
            okudum. Sipariş bir kopyası tarayıcınızda, asıl iletim e-posta iledir.
          </span>
        </label>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" size="lg" disabled={submitting} aria-busy={submitting}>
          {submitting ? "E-posta açılıyor…" : `Siparişi tamamla · ${formatPrice(total)}`}
        </Button>
        <p className="text-xs text-fg-muted">
          Kart çekilmez. Gönderince e-posta uygulamanız açılır; mesajı iletmezseniz atölyeye düşmez.
        </p>
      </form>

      <aside
        className="h-fit border border-dashed border-border bg-bg-elevated p-5 lg:sticky"
        style={{ top: "calc(var(--nav-h, 4rem) + 1rem)" }}
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
              <li key={`${it.sku}-${it.color}`} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-3">
                  <img
                    src={it.product.image}
                    alt=""
                    className="size-12 object-contain"
                    style={{ backgroundColor: PASTEL[it.color] }}
                  />
                  <span className="min-w-0">
                    {it.product.name}
                    <span className="block text-xs text-fg-subtle">
                      {it.colorName} × {it.qty}
                    </span>
                  </span>
                </span>
                <span className="tabular-nums">{formatPrice(it.product.price * it.qty)}</span>
              </li>
            ) : null,
          )}
        </ul>
        <div className="mt-4">
          <ShippingBar subtotal={subtotal} />
        </div>
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm">
          <span>Kargo</span>
          <span>{shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}</span>
        </div>
        <div className="mt-2 flex justify-between text-base">
          <span>Toplam</span>
          <span className="tabular-nums">{formatPrice(total)}</span>
        </div>
        <p className="mt-1 text-xs text-fg-muted">KDV dahil {formatPrice(includedVat(total))}</p>
        <EtaLine className="mt-3 text-xs text-fg-muted" />
      </aside>
    </div>
  );
}
