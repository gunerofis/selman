//#region node_modules/.nitro/vite/services/ssr/assets/products-BOS9FmZC.js
/** Damerau: 1 insert/delete/substitute/transpose. Short tokens stay exact. */
function withinOne(a, b) {
	if (a === b) return true;
	const la = a.length;
	const lb = b.length;
	if (Math.abs(la - lb) > 1) return false;
	if (la === lb) {
		let diffs = 0;
		for (let i = 0; i < la; i++) {
			if (a[i] === b[i]) continue;
			if (i + 1 < la && a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2)) return true;
			diffs += 1;
			if (diffs > 1) return false;
		}
		return diffs <= 1;
	}
	const longer = la > lb ? a : b;
	const shorter = la > lb ? b : a;
	let i = 0;
	let j = 0;
	let skipped = 0;
	while (i < longer.length) {
		if (j < shorter.length && longer[i] === shorter[j]) {
			i += 1;
			j += 1;
			continue;
		}
		skipped += 1;
		if (skipped > 1) return false;
		i += 1;
	}
	return true;
}
function fuzzyIncludes(hay, term) {
	if (!term) return true;
	if (hay.includes(term)) return true;
	if (term.length < 4) return false;
	return hay.split(/\s+/).some((token) => token.length >= 4 && withinOne(token, term));
}
function closestTerm(query, candidates, fold) {
	const q = fold(query.trim());
	if (q.length < 4) return null;
	let best = null;
	for (const c of candidates) {
		const f = fold(c);
		if (!f || f === q) continue;
		if (withinOne(f, q)) return c;
		if (!best && f.includes(q) && q.length >= 4) best = c;
	}
	return best;
}
/** Baymard: exact SKU or name belongs at the top of “önerilen” results. */
function promoteExact(list, q, fold) {
	const n = fold(q.trim());
	if (!n || list.length < 2) return list;
	const i = list.findIndex((p) => fold(p.sku) === n || fold(p.name) === n);
	if (i <= 0) return list;
	const next = list.slice();
	const [hit] = next.splice(i, 1);
	next.unshift(hit);
	return next;
}
var COLORS = [
	{
		id: "siyah",
		name: "Siyah",
		swatch: "#191715"
	},
	{
		id: "beyaz",
		name: "Beyaz",
		swatch: "#F4F1E8"
	},
	{
		id: "gri",
		name: "Gri",
		swatch: "#73706C"
	},
	{
		id: "krem",
		name: "Krem",
		swatch: "#D8C6A5"
	},
	{
		id: "espresso",
		name: "Kahve",
		swatch: "#5A3825"
	},
	{
		id: "taba",
		name: "Taba",
		swatch: "#A56632"
	},
	{
		id: "bordo",
		name: "Bordo",
		swatch: "#642B36"
	},
	{
		id: "kirmizi",
		name: "Kırmızı",
		swatch: "#B3262D"
	},
	{
		id: "turuncu",
		name: "Turuncu",
		swatch: "#D86A2B"
	},
	{
		id: "pembe",
		name: "Pembe",
		swatch: "#D990A5"
	},
	{
		id: "turkuaz",
		name: "Turkuaz",
		swatch: "#159B9B"
	},
	{
		id: "mavi",
		name: "Mavi",
		swatch: "#285F9E"
	},
	{
		id: "lacivert",
		name: "Lacivert",
		swatch: "#1F2F4A"
	},
	{
		id: "yesil",
		name: "Yeşil",
		swatch: "#315C42"
	}
];
function productImageVariant(image, width) {
	return image.replace(/\.webp$/, `-${width}.webp`);
}
/** Tile wash when a leather color is selected on the wall. */
var PASTEL = {
	siyah: "#E4DFD6",
	beyaz: "#F7F3EC",
	gri: "#E6E3DC",
	krem: "#EFE6DA",
	espresso: "#EDE2DB",
	taba: "#EDE2DB",
	bordo: "#E8DFD4",
	kirmizi: "#F2DDDC",
	turuncu: "#F3E2D4",
	pembe: "#F3E2E6",
	turkuaz: "#DCEDEA",
	mavi: "#DDE6F0",
	lacivert: "#DDE2EA",
	yesil: "#DFE9E0"
};
var CATEGORIES = [];
CATEGORIES.filter((c) => c.id !== "arac");
var SERIES = [];
var TR_SLUG = {
	ç: "c",
	ğ: "g",
	ı: "i",
	i: "i",
	ö: "o",
	ş: "s",
	ü: "u",
	â: "a",
	î: "i",
	û: "u"
};
function slugify(input) {
	return input.split("").map((ch) => TR_SLUG[ch] ?? TR_SLUG[ch.toLocaleLowerCase("tr")] ?? ch).join("").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function productSlug(p) {
	return slugify(p.name);
}
var PRODUCTS = [];
PRODUCTS.length;
/** Homepage wall: 21 SKUs (center first). Extra tiles hide below 768 / 1440. */
var WALL_SKUS = [
	"7043",
	"7069",
	"7060",
	"7083",
	"7067",
	"7054",
	"7036",
	"7068",
	"7080",
	"7012",
	"7048",
	"7007",
	"7065",
	"7075",
	"7015",
	"7076",
	"7052",
	"7073",
	"7047",
	"7062"
];
var SLUG_TO_SKU = {
	"sarj-standi": "7033",
	"sarj-istasyonu": "7033",
	"basucu-sarj-istasyonu": "7062",
	"tezgaah-organizeri": "7029",
	"tezgah-organizeri": "7029",
	"masa-organizeri": "7017",
	"tablet-ve-saat-standi": "7011",
	"basucu-valesi": "7062",
	"duvar-telefon-cebi": "7063",
	"saat-kutusu": "7034",
	"folyo-duzenleyici": "7044",
	"lavabo-istasyonu": "7030",
	"lavabo-tepsisi": "7065",
	"dizustu-folyo": "7080"
};
function getProduct(id) {
	const key = decodeURIComponent(id).trim();
	const aliased = SLUG_TO_SKU[key.toLowerCase()];
	if (aliased) return PRODUCTS.find((p) => p.sku === aliased);
	return PRODUCTS.find((p) => p.sku === key) ?? PRODUCTS.find((p) => productSlug(p) === key.toLowerCase());
}
function getColor(id) {
	return COLORS.find((c) => c.id === id);
}
function getCategory(id) {
	return CATEGORIES.find((c) => c.id === id);
}
function featuredProducts() {
	return PRODUCTS.filter((p) => p.featured);
}
function productsBySeries(id) {
	return PRODUCTS.filter((p) => p.series === id);
}
function getSeries(id) {
	return SERIES.find((s) => s.id === id);
}
function foldTr(s) {
	return s.toLocaleLowerCase("tr").replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c").replace(/â/g, "a");
}
var JOB_EXPAND = {
	sarj: ["sarj", "kablo"],
	kablo: ["kablo", "sarj"],
	charger: ["sarj", "kablo"],
	baharat: ["baharat", "baharatlik"],
	spice: ["baharat", "baharatlik"],
	gozluk: ["gozluk"],
	glasses: ["gozluk"],
	dizustu: ["dizustu", "laptop"],
	laptop: ["dizustu", "laptop"],
	notebook: ["dizustu", "laptop"],
	macbook: ["dizustu", "laptop"],
	folyo: ["folyo", "rulo"],
	lavabo: ["lavabo"],
	kulaklik: ["kulaklik"],
	mouse: ["mouse"],
	tepsi: ["tepsi"],
	tray: ["tepsi"],
	sumen: ["sumen"],
	kalem: ["kalem"],
	ruj: ["ruj", "makyaj"],
	oje: ["oje", "makyaj"],
	makyaj: ["makyaj"],
	makeup: ["makyaj"],
	anahtar: ["anahtar"],
	key: ["anahtar"],
	saat: ["saat"],
	watch: ["saat"],
	kahve: ["kahve"],
	coffee: ["kahve"],
	organizer: ["organizer"],
	duzenleyici: ["organizer"],
	semsiye: ["semsiye"],
	ayakkabi: ["ayakkabi"],
	cuzdan: ["cuzdan"]
};
function matchesQuery(p, q) {
	const raw = foldTr(q.trim());
	if (!raw) return true;
	const words = raw.split(/\s+/).filter(Boolean);
	const hay = foldTr([
		p.name,
		p.shortName,
		p.sku,
		p.tagline,
		p.description,
		p.features.join(" "),
		p.category,
		p.series ?? ""
	].join(" "));
	return words.every((w) => {
		return (JOB_EXPAND[w] ?? [w]).some((term) => hay.includes(term) || fuzzyIncludes(hay, term));
	});
}
function searchProducts(q, limit = 8) {
	const needle = q.trim();
	if (!needle) return PRODUCTS.slice(0, limit);
	return promoteExact(PRODUCTS.filter((p) => matchesQuery(p, needle)), needle, foldTr).slice(0, limit);
}
function neighborsInCategory(sku) {
	const current = getProduct(sku);
	if (!current) return {
		prev: null,
		next: null
	};
	const list = PRODUCTS.filter((p) => p.category === current.category);
	const i = list.findIndex((p) => p.sku === current.sku);
	return {
		prev: i > 0 ? list[i - 1] : null,
		next: i >= 0 && i < list.length - 1 ? list[i + 1] : null
	};
}
function specGrams(p) {
	const row = p.specs.find((s) => s.label === "Ağırlık");
	if (!row) return "—";
	if (/kg/i.test(row.value)) {
		const n = Number(row.value.replace(",", ".").replace(/[^\d.]/g, ""));
		if (Number.isFinite(n)) return `${Math.round(n * 1e3)} g`;
	}
	return row.value;
}
function relatedProducts(sku, limit = 4) {
	const current = getProduct(sku);
	if (!current) return PRODUCTS.slice(0, limit);
	const tokens = foldTr(`${current.name} ${current.tagline}`).split(/\s+/).filter((w) => w.length > 3);
	const scored = PRODUCTS.filter((p) => p.sku !== current.sku).map((p) => {
		let score = 0;
		if (p.category === current.category) score += 6;
		if (current.series && p.series === current.series) score += 5;
		const hay = foldTr(`${p.name} ${p.tagline} ${p.features.join(" ")}`);
		for (const t of tokens) if (hay.includes(t)) score += 2;
		return {
			p,
			score
		};
	});
	scored.sort((a, b) => b.score - a.score);
	return scored.slice(0, limit).map((x) => x.p);
}
//#endregion
export { specGrams as C, searchProducts as S, productImageVariant as _, SERIES as a, promoteExact as b, featuredProducts as c, getCategory as d, getColor as f, neighborsInCategory as g, matchesQuery as h, PRODUCTS as i, foldTr as l, getSeries as m, COLORS as n, WALL_SKUS as o, getProduct as p, PASTEL as r, closestTerm as s, CATEGORIES as t, fuzzyIncludes as u, productSlug as v, relatedProducts as x, productsBySeries as y };
