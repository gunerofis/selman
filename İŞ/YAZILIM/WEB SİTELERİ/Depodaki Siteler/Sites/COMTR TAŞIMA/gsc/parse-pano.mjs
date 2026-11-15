import { readFileSync } from "node:fs";
const h = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/pano-turuncu.html", "utf8");
console.log("bytes", h.length);
console.log("title", (h.match(/<title>([^<]+)/) || [])[1]);
const h1 = (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || "";
console.log("h1", h1.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
const og = (h.match(/property="og:image" content="([^"]+)"/) || [])[1];
console.log("og:image", og);
const avail = (h.match(/availability["']?\s*[:=]\s*["']?([^"'\s<]+)/i) || [])[1];
console.log("avail_guess", avail);
const lds = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
console.log("ld_count", lds.length);
for (const [i, raw] of lds.entries()) {
  try {
    const o = JSON.parse(raw);
    const t = o["@type"] || o["@graph"]?.map((x) => x["@type"]);
    console.log("ld", i, JSON.stringify(t));
    const dump = JSON.stringify(o);
    if (dump.includes("Product") || dump.includes("Offer")) {
      const p = o["@graph"] ? o["@graph"].find((x) => x["@type"] === "Product" || (Array.isArray(x["@type"]) && x["@type"].includes("Product"))) : o;
      const prod = p || o;
      const offer = prod.offers || prod.Offers;
      console.log(
        JSON.stringify(
          {
            name: prod.name,
            sku: prod.sku,
            brand: prod.brand,
            image: Array.isArray(prod.image) ? prod.image.slice(0, 2) : prod.image,
            offers: offer,
          },
          null,
          2
        )
      );
    }
  } catch (e) {
    console.log("ld parse fail", i, e.message, raw.slice(0, 120));
  }
}
