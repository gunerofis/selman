import { createServerFn } from "@tanstack/react-start";
import { PRODUCTS } from "./products";

export const FORMS = [
  { id: "kapak", label: "Saat kutusu", hint: "Saat kapasitesi ve kapak biçimine göre." },
  { id: "cekmece", label: "Mücevher kutusu", hint: "Çekmece, bölme ve iç yerleşime göre." },
] as const;

export const MATERIALS = ["Deri kaplama", "Keçe astar", "Metal detay", "Ahşap gövde"] as const;
export const FEATURES = [
  "Çekmece",
  "Kapak",
  "Ayna",
  "Döner taban",
  "Duvara montaj",
  "Ayarlanır bölme",
  "Kaymaz taban",
  "Logo baskı",
] as const;

export type DesignInput = {
  brief: string;
  form: string;
  materials: string[];
  features: string[];
  color: string;
  widthMm: number | null;
  depthMm: number | null;
  heightMm: number | null;
  qty: number;
  email: string;
  trap: string;
};

export type DesignQuote = {
  name: string;
  summary: string;
  form: string;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  materials: string[];
  features: string[];
  color: string;
  unitPrice: number;
  qty: number;
  total: number;
  lead: string;
  similar: string[];
  notes: string;
};

const CATALOG = PRODUCTS.map((p) => `${p.sku} · ${p.name} · ${p.price}`).join("\n");

function clampMm(value: unknown, fallback: number | null, def: number) {
  const n = Number(value);
  if (Number.isFinite(n) && n >= 80 && n <= 900) return Math.round(n);
  if (fallback && fallback >= 80 && fallback <= 900) return fallback;
  return def;
}

function localQuote(data: DesignInput): DesignQuote {
  const brief = data.brief.trim();
  const w = clampMm(data.widthMm, data.widthMm, 280);
  const d = clampMm(data.depthMm, data.depthMm, 180);
  const h = clampMm(data.heightMm, data.heightMm, 90);
  const volume = (w * d * h) / 1_000_000;
  let unit = 1890 + Math.round(volume * 3800);
  unit += data.features.length * 280;
  unit += data.materials.length * 160;
  if (/mobilya|bank|dolap/i.test(data.form)) unit += 2400;
  if (/duvar/i.test(data.form)) unit += 420;
  if (/döner/i.test(data.form)) unit += 380;
  unit = Math.max(890, Math.round(unit / 10) * 10);

  const needle = brief.toLocaleLowerCase("tr");
  const similar = PRODUCTS.filter((p) => {
    const hay = `${p.name} ${p.tagline} ${p.category}`.toLocaleLowerCase("tr");
    return needle.split(/\s+/).some((wrd) => wrd.length > 3 && hay.includes(wrd));
  })
    .slice(0, 4)
    .map((p) => p.sku);
  const fallbackSimilar = similar.length
    ? similar
    : PRODUCTS.filter((p) => p.featured)
        .slice(0, 4)
        .map((p) => p.sku);

  const form = data.form || "Tepsi ve bölmeli kutu";
  const name =
    brief
      .replace(/[.?!].*$/, "")
      .trim()
      .slice(0, 42) || "Düzen parçası";

  return {
    name,
    summary: `${form}. ${w} × ${d} × ${h} mm. Deri kaplama, istenen bölme ve renk atölyede netleşir.`,
    form,
    widthMm: w,
    depthMm: d,
    heightMm: h,
    materials: data.materials.length ? data.materials : ["Deri kaplama"],
    features: data.features,
    color: data.color || "espresso",
    unitPrice: unit,
    qty: data.qty,
    total: unit * data.qty,
    lead: data.qty >= 50 ? "10–20 iş günü" : "10–15 iş günü",
    similar: fallbackSimilar,
    notes:
      "İlk fiyat, tahmini. Onay ve numuneden sonra netleşir. Elli adet ve üzeri teklif sayfasından.",
  };
}

function normalizeQuote(parsed: DesignQuote, data: DesignInput): DesignQuote {
  const qty = data.qty;
  const unit = Math.max(890, Math.round(Number(parsed.unitPrice) || 2490));
  const similar = (parsed.similar ?? [])
    .filter((s) => PRODUCTS.some((p) => p.sku === s))
    .slice(0, 4);
  return {
    name: String(parsed.name || "Düzen parçası").slice(0, 60),
    summary: String(parsed.summary || data.brief).slice(0, 280),
    form: String(parsed.form || data.form || "Tepsi ve bölmeli kutu"),
    widthMm: clampMm(parsed.widthMm, data.widthMm, 240),
    depthMm: clampMm(parsed.depthMm, data.depthMm, 160),
    heightMm: clampMm(parsed.heightMm, data.heightMm, 80),
    materials: Array.isArray(parsed.materials) ? parsed.materials.slice(0, 4) : [...data.materials],
    features: Array.isArray(parsed.features) ? parsed.features.slice(0, 6) : [...data.features],
    color: String(parsed.color || data.color || "espresso"),
    unitPrice: unit,
    qty,
    total: unit * qty,
    lead: String(parsed.lead || (qty >= 50 ? "10–20 iş günü" : "10–15 iş günü")),
    similar: similar.length ? similar : localQuote(data).similar,
    notes: String(parsed.notes || "Numune onayından sonra üretim.").slice(0, 200),
  };
}

export const quoteDesign = createServerFn({ method: "POST" })
  .validator((input: DesignInput) => input)
  .handler(
    async ({ data }): Promise<{ ok: true; quote: DesignQuote } | { ok: false; error: string }> => {
      if (data.trap?.trim()) {
        return { ok: false, error: "Form gönderilemedi." };
      }
      const brief = data.brief.trim();
      if (brief.length < 8) return { ok: false, error: "Ne istediğinizi bir cümle yazın." };
      if (data.qty < 1) return { ok: false, error: "Adet en az 1." };
      if (!data.email.includes("@")) return { ok: false, error: "Geçerli e-posta girin." };

      const apiKey = process.env.XAI_API_KEY;
      if (!apiKey) return { ok: true, quote: localQuote(data) };

      const prompt = `Sen Sweb atölyesinin ölçü uzmanısın. Ev ve çalışma alanı için deri kaplı düzen ürünleri üretiyoruz. Yasak kelimeler: lüks, premium, eşsiz, muhteşem, özel tasarım.
Müşteri isteği:
- Anlatım: ${brief}
- Form: ${data.form || "belirsiz"}
- Malzeme: ${data.materials.join(", ") || "deri kaplama"}
- Özellik: ${data.features.join(", ") || "yok"}
- Renk: ${data.color || "espresso"}
- Ölçü mm (boşsa sen öner): ${data.widthMm ?? "?"} × ${data.depthMm ?? "?"} × ${data.heightMm ?? "?"}
- Adet: ${data.qty}

Katalog (benzer stok seç, en fazla 4 sku):
${CATALOG}

Sadece JSON dön, başka metin yok:
{"name":"işlevle başlayan kısa ad","summary":"iki cümle, işlev","form":"...","widthMm":0,"depthMm":0,"heightMm":0,"materials":[],"features":[],"color":"...","unitPrice":0,"qty":${data.qty},"total":0,"lead":"10–15 iş günü","similar":["7043"],"notes":"kısa üretim notu"}
Birim fiyat TL tam sayı. Hacim ve özellik arttıkça fiyat artsın. 80–900 mm aralığında kal.`;

      try {
        const res = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "grok-4.5",
            temperature: 0.4,
            max_tokens: 700,
            messages: [{ role: "user", content: prompt }],
          }),
          signal: AbortSignal.timeout(12000),
        });
        if (!res.ok) return { ok: true, quote: localQuote(data) };
        const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const text = body.choices?.[0]?.message?.content ?? "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return { ok: true, quote: localQuote(data) };
        const parsed = JSON.parse(jsonMatch[0]) as DesignQuote;
        return { ok: true, quote: normalizeQuote(parsed, data) };
      } catch {
        return { ok: true, quote: localQuote(data) };
      }
    },
  );
