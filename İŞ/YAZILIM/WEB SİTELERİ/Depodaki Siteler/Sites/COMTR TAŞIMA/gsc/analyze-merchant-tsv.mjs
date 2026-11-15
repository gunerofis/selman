import { readFileSync, writeFileSync } from "node:fs";

let text = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/urun.tsv", "utf8");
if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
const lines = text.split(/\r?\n/).filter((l) => l.length);

function splitRow(line) {
  const out = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      q = !q;
      continue;
    }
    if (c === "\t" && !q) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

const headers = splitRow(lines[0]);
const rows = lines.slice(1).map((l) => {
  const c = splitRow(l);
  const o = {};
  headers.forEach((h, i) => {
    o[h] = c[i] || "";
  });
  return o;
});

function count(k) {
  const m = {};
  for (const r of rows) {
    const v = r[k] || "(bos)";
    m[v] = (m[v] || 0) + 1;
  }
  return m;
}

const ids = rows.map((r) => r.kimlik);
const uniqueIds = new Set(ids);
const products = new Set(
  ids.map((id) => {
    const m = String(id).match(/shopify_ZZ_(\d+)_/);
    return m ? m[1] : id;
  })
);
const group = {};
for (const r of rows) {
  const m = String(r.kimlik).match(/shopify_ZZ_(\d+)_/);
  const p = m ? m[1] : "?";
  group[p] = (group[p] || 0) + 1;
}
const multi = Object.entries(group).filter(([, n]) => n > 1);
const noImg = rows.filter((r) => !r["resim bağlantısı"]);
const noLink = rows.filter((r) => !r["bağlantı"]);
const noSku = rows.filter((r) => !r.sku);
const noBrand = rows.filter((r) => !r.marka);
const wt0 = rows.filter((r) => /^0\s*kg/i.test(r["gönderi ağırlığı"] || ""));
const rating = rows.filter((r) => (r["rating count"] || "").trim() && r["rating count"] !== "0");
const clicks = rows.filter((r) => Number(r["tüm tıklamalar"] || 0) > 0);
const disc = rows.filter((r) => (r["indirimli fiyat"] || "").trim());
const makro = rows.filter((r) => /makro/i.test(`${r.marka} ${r.başlık} ${r.açıklama}`));
const badUrl = rows.filter((r) => r.bağlantı && !r.bağlantı.includes("sumentakimi.com.tr"));
const prices = rows.map((r) => parseFloat(String(r.fiyat).replace(",", "."))).filter((n) => !Number.isNaN(n));
const qty = rows.map((r) => Number(r["sell on google quantity"] || 0));
const descLen = rows.map((r) => (r.açıklama || "").length);
const durumEmpty = rows.filter((r) => !(r.durum || "").trim());
const utm = rows.filter((r) => /utm_source=google/i.test(r.bağlantı || "")).length;
const variantInUrl = rows.filter((r) => /variant=/.test(r.bağlantı || "")).length;
const shipping = count("gönderim(fiyat:hizmet:maks_nakliye_süresi:maksimum sevkiyata hazırlık süresi:min_nakliye_süresi:minimum sevkiyata hazırlık süresi:ülke)");
const feed = count("feed etiketi");

const summary = {
  rows: rows.length,
  uniqueItem: uniqueIds.size,
  uniqueProducts: products.size,
  multiVariantProducts: multi.length,
  maxVariants: Math.max(...Object.values(group)),
  durum: count("durum"),
  stok: count("stok durumu"),
  kanal: count("kanal"),
  dil: count("dil"),
  feed,
  brands: count("marka"),
  types: count("ürün türü"),
  noImg: noImg.length,
  noLink: noLink.length,
  noSku: noSku.length,
  noBrand: noBrand.length,
  weight0: wt0.length,
  withRating: rating.length,
  withClicks: clicks.length,
  withDiscount: disc.length,
  makroMentions: makro.length,
  otherDomain: badUrl.length,
  durumEmpty: durumEmpty.length,
  utmLinks: utm,
  variantLinks: variantInUrl,
  priceMin: Math.min(...prices),
  priceMax: Math.max(...prices),
  qtyMin: Math.min(...qty),
  qtyMax: Math.max(...qty),
  qtyAll1000: qty.filter((q) => q === 1000).length,
  descMin: Math.min(...descLen),
  descMax: Math.max(...descLen),
  descEmpty: descLen.filter((n) => n === 0).length,
  shippingKeys: Object.keys(shipping).length,
  shippingSample: Object.keys(shipping)[0],
  clickRows: clicks.map((r) => ({ title: r.başlık, clicks: r["tüm tıklamalar"], status: r.durum })),
  sampleNoSku: noSku.slice(0, 8).map((r) => r.başlık),
  sampleEmptyDurum: durumEmpty.slice(0, 5).map((r) => r.başlık),
  makroSample: makro.slice(0, 5).map((r) => `${r.başlık} | ${r.marka}`),
};

writeFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/merchant-summary.json", JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
