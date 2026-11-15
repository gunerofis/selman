import { n as createServerFn } from "./ssr.mjs";
import { i as PRODUCTS } from "./products-BOS9FmZC.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/design-DWAfOUtt.js
var CATALOG = PRODUCTS.map((p) => `${p.sku} · ${p.name} · ${p.price}`).join("\n");
function clampMm(value, fallback, def) {
	const n = Number(value);
	if (Number.isFinite(n) && n >= 80 && n <= 900) return Math.round(n);
	if (fallback && fallback >= 80 && fallback <= 900) return fallback;
	return def;
}
function localQuote(data) {
	const brief = data.brief.trim();
	const w = clampMm(data.widthMm, data.widthMm, 280);
	const d = clampMm(data.depthMm, data.depthMm, 180);
	const h = clampMm(data.heightMm, data.heightMm, 90);
	const volume = w * d * h / 1e6;
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
	}).slice(0, 4).map((p) => p.sku);
	const fallbackSimilar = similar.length ? similar : PRODUCTS.filter((p) => p.featured).slice(0, 4).map((p) => p.sku);
	const form = data.form || "Tepsi ve bölmeli kutu";
	return {
		name: brief.replace(/[.?!].*$/, "").trim().slice(0, 42) || "Düzen parçası",
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
		notes: "İlk fiyat, tahmini. Onay ve numuneden sonra netleşir. Elli adet ve üzeri teklif sayfasından."
	};
}
function normalizeQuote(parsed, data) {
	const qty = data.qty;
	const unit = Math.max(890, Math.round(Number(parsed.unitPrice) || 2490));
	const similar = (parsed.similar ?? []).filter((s) => PRODUCTS.some((p) => p.sku === s)).slice(0, 4);
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
		notes: String(parsed.notes || "Numune onayından sonra üretim.").slice(0, 200)
	};
}
var quoteDesign_createServerFn_handler = createServerRpc({
	id: "8d307d7291f6aff61cc42507a4a004befd2589a0be07852a6e183cb54f4ffe41",
	name: "quoteDesign",
	filename: "src/lib/design.ts"
}, (opts) => quoteDesign.__executeServer(opts));
var quoteDesign = createServerFn({ method: "POST" }).validator((input) => input).handler(quoteDesign_createServerFn_handler, async ({ data }) => {
	if (data.trap?.trim()) return {
		ok: false,
		error: "Form gönderilemedi."
	};
	const brief = data.brief.trim();
	if (brief.length < 8) return {
		ok: false,
		error: "Ne istediğinizi bir cümle yazın."
	};
	if (data.qty < 1) return {
		ok: false,
		error: "Adet en az 1."
	};
	if (!data.email.includes("@")) return {
		ok: false,
		error: "Geçerli e-posta girin."
	};
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: true,
		quote: localQuote(data)
	};
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
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				temperature: .4,
				max_tokens: 700,
				messages: [{
					role: "user",
					content: prompt
				}]
			}),
			signal: AbortSignal.timeout(12e3)
		});
		if (!res.ok) return {
			ok: true,
			quote: localQuote(data)
		};
		const jsonMatch = ((await res.json()).choices?.[0]?.message?.content ?? "").match(/\{[\s\S]*\}/);
		if (!jsonMatch) return {
			ok: true,
			quote: localQuote(data)
		};
		return {
			ok: true,
			quote: normalizeQuote(JSON.parse(jsonMatch[0]), data)
		};
	} catch {
		return {
			ok: true,
			quote: localQuote(data)
		};
	}
});
//#endregion
export { quoteDesign_createServerFn_handler };
