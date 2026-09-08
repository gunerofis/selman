import { readFileSync } from "node:fs";

let text = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/urun.tsv", "utf8");
if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
const lines = text.split(/\r?\n/).filter((l) => l.length);
const headers = lines[0].split("\t");
console.log("headerCols", headers.length);

const colCounts = {};
const samples = { shopify: [], faprika: [], other: [], wide: [] };
let shopify = 0,
  faprikaImg = 0,
  makroBrand = 0,
  guner = 0,
  newStatus = 0,
  emptyId = 0;
const feedTags = {};
const idPrefix = {};

for (let i = 1; i < lines.length; i++) {
  const cols = lines[i].split("\t");
  colCounts[cols.length] = (colCounts[cols.length] || 0) + 1;
  const obj = {};
  headers.forEach((h, idx) => {
    obj[h] = cols[idx] || "";
  });
  const id = obj.kimlik || "";
  const feed = obj["feed etiketi"] || "";
  const brand = obj.marka || "";
  const link = obj.bağlantı || "";
  const img = obj["resim bağlantısı"] || "";
  feedTags[feed || "(bos)"] = (feedTags[feed || "(bos)"] || 0) + 1;
  const pfx = id.startsWith("shopify_") ? "shopify" : id ? "otherId" : "noId";
  idPrefix[pfx] = (idPrefix[pfx] || 0) + 1;
  if (id.startsWith("shopify_")) shopify++;
  if (!id) emptyId++;
  if (/makro ofis/i.test(brand)) makroBrand++;
  if (/güner ofis/i.test(brand)) guner++;
  if (obj.durum === "yeni") newStatus++;
  if (/sumentakimi\.com\.tr\/i\//.test(img + link + lines[i])) faprikaImg++;
  if (cols.length !== 24 && samples.wide.length < 2) samples.wide.push({ i, n: cols.length, start: lines[i].slice(0, 160) });
  if (id.startsWith("shopify_") && samples.shopify.length < 1) samples.shopify.push({ brand, feed, durum: obj.durum, stok: obj["stok durumu"], link: link.slice(0, 120), img: img.slice(0, 80) });
  if (obj.durum === "yeni" && samples.faprika.length < 2) {
    samples.faprika.push({
      title: obj.başlık.slice(0, 80),
      id,
      brand,
      feed,
      link: link.slice(0, 140),
      img: img.slice(0, 140),
      stok: obj["stok durumu"],
    });
  }
}

console.log(
  JSON.stringify(
    {
      dataLines: lines.length - 1,
      colCounts,
      idPrefix,
      feedTags,
      shopify,
      emptyId,
      newStatus,
      makroBrand,
      guner,
      faprikaImg,
      samples,
    },
    null,
    2
  )
);
