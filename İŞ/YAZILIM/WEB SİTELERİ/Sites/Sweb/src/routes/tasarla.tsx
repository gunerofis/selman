import { type FormEvent, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { COLORS, getProduct, searchProducts, type ColorId, type Product } from "@/lib/products";
import { FEATURES, FORMS, MATERIALS, quoteDesign, type DesignQuote } from "@/lib/design";
import { pageHead } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import { Notice } from "@/components/demo-notice";
import { DimensionPreview } from "@/components/dimension-preview";
import { ColorSwatches } from "@/components/color-swatch";
import { QtyControl } from "@/components/qty-control";
import { isHoneypot } from "@/lib/leads";
import { submitLead } from "@/lib/lead-submissions";
import { BRAND } from "@/lib/brand";
import { FaqList } from "@/components/faq-list";
import { FAQ_DESIGN } from "@/lib/faq";
import { PrintButton } from "@/components/print-button";
import { FormField } from "@/components/form-field";
import { DesignRefs, type DesignRef } from "@/components/design-refs";

type Search = { en?: string; boy?: string; yuk?: string; renk?: ColorId; istek?: string };

function mmParam(raw: unknown) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return undefined;
  const r = Math.round(n);
  if (r < 80 || r > 900) return undefined;
  return String(r);
}

function clipIstek(raw: unknown) {
  if (typeof raw !== "string") return undefined;
  const t = raw.trim().replace(/\s+/g, " ");
  if (t.length < 2) return undefined;
  return t.length > 160 ? t.slice(0, 160) : t;
}

export const Route = createFileRoute("/tasarla")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    en: mmParam(raw.en),
    boy: mmParam(raw.boy),
    yuk: mmParam(raw.yuk),
    renk: COLORS.some((c) => c.id === raw.renk) ? (raw.renk as ColorId) : undefined,
    istek: clipIstek(raw.istek),
  }),
  component: DesignPage,
  head: () =>
    pageHead({
      title: "Tasarlayın",
      description: "Ölçüye göre düzen ürünü. İlk fiyat tahmini.",
      path: "/tasarla",
    }),
});

function DesignPage() {
  const start = Route.useSearch();
  const [brief, setBrief] = useState(start.istek ?? "");
  const [form, setForm] = useState("");
  const [materials, setMaterials] = useState<string[]>(["Deri kaplama"]);
  const [features, setFeatures] = useState<string[]>([]);
  const [color, setColor] = useState<ColorId | "">(start.renk ?? "");
  const [widthMm, setWidthMm] = useState(start.en ?? "");
  const [depthMm, setDepthMm] = useState(start.boy ?? "");
  const [heightMm, setHeightMm] = useState(start.yuk ?? "");
  const [qty, setQty] = useState(1);
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [busy, setBusy] = useState(false);
  const [quote, setQuote] = useState<DesignQuote | null>(null);
  const [refs, setRefs] = useState<DesignRef[]>([]);

  useEffect(() => {
    if (start.en) setWidthMm(start.en);
    if (start.boy) setDepthMm(start.boy);
    if (start.yuk) setHeightMm(start.yuk);
    if (start.renk) setColor(start.renk);
    if (start.istek) setBrief(start.istek);
  }, [start.en, start.boy, start.yuk, start.renk, start.istek]);

  const waiting = useMemo(
    () =>
      ["7043", "7054", "7012", "7036"]
        .map(getProduct)
        .filter((p): p is NonNullable<typeof p> => p != null),
    [],
  );

  const matches = useMemo(() => {
    if (brief.trim().length < 3) return waiting;
    const found = searchProducts(brief, 4).filter((p): p is Product => p != null);
    return found.length > 0 ? found : waiting;
  }, [brief, waiting]);

  function toggle(list: string[], value: string, set: (v: string[]) => void) {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setQuote(null);
    if (isHoneypot(trap)) {
      setBusy(false);
      return;
    }
    try {
      const result = await quoteDesign({
        data: {
          brief,
          form,
          materials,
          features,
          color,
          widthMm: widthMm ? Number(widthMm) : null,
          depthMm: depthMm ? Number(depthMm) : null,
          heightMm: heightMm ? Number(heightMm) : null,
          qty: Math.max(1, qty),
          email,
          trap,
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setQuote(result.quote);
      toast.success("Tahmini ölçü ve fiyat çıktı.");
    } catch {
      toast.error("Bağlantı kesildi. Yeniden deneyin.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Atölye</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Tasarımınızı gönderin</h1>
      <p className="mt-3 max-w-xl text-sm text-fg-muted">
        Aklınızdaki ürünü kendi cümlelerinizle yazın. Çıkan ölçü ve fiyat ilk tahmindir.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Link to="/olcu" className="text-sm text-taba hover:underline">
          Ölçü rehberi
        </Link>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <Notice>
            İlk fiyat tahmini sitede çıkar. Onaylamak için taslağı {BRAND.email} adresine gönderin.
          </Notice>
          <label className="grid gap-1.5 text-sm">
            <span className="font-mono text-xs text-fg-muted">Fikrinizi Anlatın</span>
            <textarea
              required
              minLength={8}
              rows={4}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Çekmeceye oturan, kalem ve kart için üç gözlü tepsi."
              className="border border-border-strong bg-bg-elevated px-3 py-2 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {start.istek ? (
              <span className="text-xs text-fg-muted">
                {brief.trim().length < 8
                  ? "Katalog aramanız taşındı. Cümleye çevirin (en az 8 karakter)."
                  : "Katalog aramanız taslağa taşındı."}
              </span>
            ) : null}
          </label>

          <fieldset>
            <legend className="font-mono text-xs text-fg-muted">form</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {FORMS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setForm(form === f.label ? "" : f.label)}
                  className={cn(
                    "border px-3 py-3 text-left text-sm",
                    form === f.label
                      ? "border-fg bg-fg text-bg-elevated"
                      : "border-border-strong text-fg hover:border-fg",
                  )}
                >
                  <span className="block font-medium">{f.label}</span>
                  <span
                    className={cn(
                      "mt-1 block text-[12px]",
                      form === f.label ? "text-bg-elevated/70" : "text-fg-muted",
                    )}
                  >
                    {f.hint}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-mono text-xs text-fg-muted">malzeme</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {MATERIALS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggle(materials, m, setMaterials)}
                  className={cn(
                    "h-11 border px-3 text-sm",
                    materials.includes(m)
                      ? "border-fg bg-fg text-bg-elevated"
                      : "border-border-strong text-fg-muted hover:border-fg",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-mono text-xs text-fg-muted">özellik</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {FEATURES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggle(features, m, setFeatures)}
                  className={cn(
                    "h-11 border px-3 text-sm",
                    features.includes(m)
                      ? "border-fg bg-fg text-bg-elevated"
                      : "border-border-strong text-fg-muted hover:border-fg",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-mono text-xs text-fg-muted">renk</legend>
            <p className="mt-1 text-xs text-fg-muted">
              Seçmezseniz forma uygun rengi biz öneririz.
            </p>
            <div className="mt-2">
              <ColorSwatches value={color} onChange={setColor} named />
              <button
                type="button"
                onClick={() => setColor("")}
                className={cn(
                  "mt-2 h-11 border px-3 font-mono text-xs",
                  color === ""
                    ? "border-fg bg-fg text-bg-elevated"
                    : "border-border-strong text-fg-muted hover:border-fg",
                )}
              >
                Atölye önerir
              </button>
              <p className="mt-2 font-mono text-xs text-fg-muted">
                {color ? COLORS.find((c) => c.id === color)?.name : "Renk atölye önerisi"}
              </p>
            </div>
          </fieldset>

          <FormField
            label="Görsel"
            optional
            hint="Masa, çekmece, eskiz. Mailto ek taşımaz; gönderirken iliştirin."
          >
            <DesignRefs refs={refs} onChange={setRefs} />
          </FormField>

          <FormField label="Ölçü (mm)" optional hint="Biliyorsanız 80–900. Boşsa atölye önerir.">
            <div className="grid grid-cols-3 gap-2">
              <Input
                inputMode="numeric"
                placeholder="en"
                aria-label="En mm"
                value={widthMm}
                onChange={(e) => setWidthMm(e.target.value)}
              />
              <Input
                inputMode="numeric"
                placeholder="boy"
                aria-label="Boy mm"
                value={depthMm}
                onChange={(e) => setDepthMm(e.target.value)}
              />
              <Input
                inputMode="numeric"
                placeholder="yükseklik"
                aria-label="Yükseklik mm"
                value={heightMm}
                onChange={(e) => setHeightMm(e.target.value)}
              />
            </div>
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Adet" required>
              <QtyControl value={qty} onChange={setQty} />
            </FormField>
            <FormField label="E-posta" required htmlFor="email" hint="Taslak bu adrese gider.">
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="ad@firma.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>
          </div>

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
              <input
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          <Button type="submit" size="lg" disabled={busy}>
            {busy ? "Ölçülüyor…" : "Tasarımı gönder"}
          </Button>
        </form>

        <aside className="flex flex-col gap-6">
          {busy ? (
            <div className="border border-dashed border-border bg-bg-elevated p-5">
              <p className="font-mono text-xs text-fg-muted">Beklerken</p>
              <p className="mt-2 font-display text-2xl">Yakın ürettiklerimiz</p>
              <div className="mt-4 grid gap-4">
                {matches.map((p) => (
                  <ProductCard key={p.sku} product={p} color={color || undefined} />
                ))}
              </div>
            </div>
          ) : quote ? (
            <div className="border border-dashed border-border bg-bg-elevated p-5">
              <p className="font-mono text-xs text-fg-muted">taslak</p>
              <h2 className="mt-1 font-display text-3xl">{quote.name}</h2>
              <p className="mt-3 text-sm text-fg-muted">{quote.summary}</p>
              <table className="mt-5 w-full text-sm">
                <tbody>
                  {[
                    ["Form", quote.form],
                    ["Ölçü", `${quote.widthMm} × ${quote.depthMm} × ${quote.heightMm} mm`],
                    ["Renk", quote.color],
                    ["Malzeme", quote.materials.join(", ") || "—"],
                    ["Özellik", quote.features.join(", ") || "—"],
                    ["Adet", String(quote.qty)],
                    ["Birim", formatPrice(quote.unitPrice)],
                    ["Toplam", formatPrice(quote.total)],
                    ["Teslim", quote.lead],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-dashed border-border">
                      <td className="py-2 text-fg-muted">{k}</td>
                      <td className="py-2 text-right font-mono text-[13px]">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-sm text-fg-muted">{quote.notes}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <PrintButton label="Taslağı yazdır" />
                <Button
                  type="button"
                  onClick={async () => {
                    try {
                      const result = await submitLead({
                        data: {
                          type: "design",
                          title: quote.name,
                          email,
                          data: {
                            brief,
                            form,
                            materials: materials.join(", "),
                            features: features.join(", "),
                            color: quote.color,
                            measurements: `${quote.widthMm} × ${quote.depthMm} × ${quote.heightMm} mm`,
                            quantity: quote.qty,
                            amount: quote.total,
                            unitPrice: quote.unitPrice,
                            fileNames: refs.map((item) => item.file.name).join(", "),
                          },
                        },
                      });
                      toast.success(`Tasarım talebi atölyeye kaydedildi · ${result.reference}`);
                    } catch (error) {
                      toast.error(
                        error instanceof Error ? error.message : "Tasarım talebi kaydedilemedi.",
                      );
                    }
                  }}
                >
                  Taslağı atölyeye gönder
                </Button>
                <Link
                  to="/kurumsal-teklif"
                  search={{
                    adet: Math.max(50, quote.qty),
                    renk: color || undefined,
                    not: `${quote.name} · ${quote.widthMm}×${quote.depthMm}×${quote.heightMm} mm`,
                  }}
                >
                  <Button variant="outline">Kurumsal teklif</Button>
                </Link>
              </div>
              {quote.similar.length > 0 ? (
                <div className="mt-8">
                  <p className="font-mono text-xs text-fg-muted">Yakın stok</p>
                  <div className="mt-3 grid gap-4">
                    {quote.similar
                      .map(getProduct)
                      .map((p) => (p ? <ProductCard key={p.sku} product={p} /> : null))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              {widthMm || depthMm || heightMm ? (
                <DimensionPreview
                  widthMm={widthMm}
                  depthMm={depthMm}
                  heightMm={heightMm}
                  color={color}
                />
              ) : null}
              <div className="border border-dashed border-border bg-bg-wash p-5">
                <p className="font-mono text-xs text-fg-muted">Nasıl işliyor</p>
                <ol className="mt-3 space-y-2 text-sm text-fg-muted">
                  <li>1. Ne istediğinizi anlatın; varsa ölçü fotoğrafı ekleyin.</li>
                  <li>2. İlk fiyat tahmini çıkar; onaydan sonra netleşir.</li>
                  <li>3. Beklerken benzer ürettiklerimizi görürsünüz.</li>
                  <li>4. Onaylarsanız numune 10–15 iş gününde çıkar.</li>
                </ol>
              </div>
            </>
          )}

          <div className="border border-dashed border-border p-5">
            <p className="font-mono text-xs text-fg-muted">Yapmadıklarımız</p>
            <ul className="mt-3 space-y-1.5 text-sm text-fg-muted">
              <li>Elektrikli veya elektronik parça</li>
              <li>Cam ve seramik gövde</li>
              <li>Dış mekân ve suya dayanıklı ürün</li>
              <li>Tek parçada 900 mm üstü ölçü</li>
              <li>Gıdayla doğrudan temas eden yüzey</li>
            </ul>
            <p className="mt-4 text-sm">
              Hazır ürün mü arıyorsunuz?{" "}
              <Link to="/koleksiyon" className="text-taba hover:underline">
                Koleksiyona bakın
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
      <FaqList items={FAQ_DESIGN} />
    </div>
  );
}
