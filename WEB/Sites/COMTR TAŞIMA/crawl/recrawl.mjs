import { writeFileSync } from "node:fs";

const origin = "https://www.sumentakimi.com.tr";
const closed = [
  "/collections/frontpage",
  "/collections/kristal-masa-setleri",
  "/collections/makam-panolari-3",
  "/collections/kristal-sumen-takimlari-2",
  "/pages/adres-ve-konum-bilgisi",
  "/pages/contact",
  "/pages/anasayfa-aciklama",
];
const extra = [
  "/",
  "/sumen-takimi-nedir",
  "/sumen-takimi-nasil-secilir-10-onemli-kriter",
  "/collections",
  "/collections/sumen-takimi",
  "/collections/sumen-takimi?page=2",
  "/pages/sumen-takimi-rehberi",
  "/pages/bize-ulasin",
  "/pages/about-us",
];

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function inspect(url) {
  const res = await fetch(url, {
    redirect: "manual",
    headers: {
      "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    },
  });
  let html = "";
  if (res.status === 200) html = await res.text();
  const title = (html.match(/<title>([^<]+)<\/title>/i) || [, ""])[1];
  const canonical = (html.match(/rel="canonical"\s+href="([^"]+)"/i) || html.match(/href="([^"]+)"\s+rel="canonical"/i) || [, ""])[1];
  const crumb = /class="breadcrumbs"/.test(html);
  return { url, status: res.status, location: res.headers.get("location") || "", canonical, title: title.replace(/\s+/g, " ").trim(), crumb, viewport: /width=device-width/.test(html) };
}

const indexXml = await (await fetch(`${origin}/sitemap.xml`)).text();
const child = extractLocs(indexXml).filter((u) => u.includes("sitemap_"));
const urls = new Set(extra.map((p) => new URL(p, origin).toString()));
const sitemapUrls = [];
for (const sm of child) {
  const xml = await (await fetch(sm)).text();
  for (const loc of extractLocs(xml)) {
    sitemapUrls.push(loc);
    urls.add(loc);
  }
}

const closedInSitemap = sitemapUrls.filter((u) => closed.some((c) => u.includes(c)));
const rows = [];
for (const url of urls) {
  try {
    rows.push(await inspect(url));
  } catch (err) {
    rows.push({ url, status: "ERR", location: "", canonical: "", title: String(err), crumb: false, viewport: false });
  }
  await new Promise((r) => setTimeout(r, 350));
}

const by = {};
for (const r of rows) by[r.status] = (by[r.status] || 0) + 1;
writeFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/crawl/recrawl.json", JSON.stringify({ at: new Date().toISOString(), by, closedInSitemap, rows }, null, 2));
console.log(JSON.stringify({ total: rows.length, by, closedInSitemap, crumbs: rows.filter((r) => r.crumb).length, viewport: rows.filter((r) => r.viewport).length }));
