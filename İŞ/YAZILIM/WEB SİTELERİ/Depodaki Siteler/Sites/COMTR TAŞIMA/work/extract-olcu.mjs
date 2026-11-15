import { readFileSync, writeFileSync } from "node:fs";

const products = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/backup/products.jsonl", "utf8")
  .trim()
  .split("\n")
  .map(JSON.parse)
  .filter((o) => (o.id || "").includes("/Product/") && !(o.id || "").includes("Variant"));

function norm(raw, withCm) {
  let v = String(raw)
    .replace(/\s+/g, "")
    .replace(/[×X]/g, "x")
    .replace(/cm$/i, "");
  if (withCm || /cm/i.test(String(raw))) v += " cm";
  return v;
}

function extract(html, type) {
  const text = String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
  const paren = text.match(/\((\d{2,}\s*[xX×]\s*\d{2,})\)/);
  if (paren) return norm(paren[1], true);
  const labeled = text.match(/(?:Kapaklı Sümen|Pad Sümen|Kapaklı Masa Sümen)\s*(\d{2,}\s*[xX×]\s*\d{2,})/i);
  if (labeled) return norm(labeled[1], true);
  const prefix = text.match(/(\d{2,}\s*[xX×]\s*\d{2,})\s*(?:Kapaklı Sümen|Pad Sümen)/i);
  if (prefix) return norm(prefix[1], true);
  const ebat = text.match(/Ebat\s*:?\s*(\d+\s*[xX×]\s*\d+\s*cm)/i);
  if (ebat) return norm(ebat[1], true);
  const olcu = text.match(/Ölçü:\s*(\d+\s*[xX×]\s*\d+(?:\s*[xX×]\s*\d+)?\s*cm)/i);
  if (olcu) return norm(olcu[1], true);
  if (/isimlik/i.test(type || "")) {
    const plate = text.match(/(\d+\s*[xX×]\s*\d+)\s*cm/i);
    if (plate) return norm(plate[1], true);
  }
  return null;
}

const rows = [];
const missing = [];
for (const p of products) {
  const olcu = extract(p.descriptionHtml, p.productType);
  if (olcu) rows.push({ id: p.id, handle: p.handle, olcu });
  else missing.push(p.handle);
}
const counts = {};
for (const r of rows) counts[r.olcu] = (counts[r.olcu] || 0) + 1;
writeFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/work/olcu-extracted.json", JSON.stringify(rows, null, 2));
console.log(
  JSON.stringify(
    {
      products: products.length,
      withOlcu: rows.length,
      missing: missing.length,
      values: Object.entries(counts).sort((a, b) => b[1] - a[1]),
      missingSample: missing.slice(0, 12),
    },
    null,
    2
  )
);
