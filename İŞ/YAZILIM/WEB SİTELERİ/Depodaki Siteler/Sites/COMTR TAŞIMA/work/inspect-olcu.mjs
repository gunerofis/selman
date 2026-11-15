import { readFileSync } from "node:fs";
const rows = JSON.parse(readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/work/olcu-extracted.json", "utf8"));
const products = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/backup/products.jsonl", "utf8")
  .trim()
  .split("\n")
  .map(JSON.parse)
  .filter((o) => (o.id || "").includes("/Product/") && !(o.id || "").includes("Variant"));
const byId = new Map(products.map((p) => [p.id, p]));
for (const val of ["8x34", "8x58", "4x48", "48x34", "38x58", "8x21cm"]) {
  const hits = rows.filter((r) => r.olcu === val).slice(0, 2);
  for (const h of hits) {
    const desc = String(byId.get(h.id)?.descriptionHtml || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 400);
    console.log("\n==", val, h.handle);
    console.log(desc);
  }
}
