import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const origin = "https://www.sumentakimi.com.tr";

const extraPaths = [
  "/",
  "/adres-ve-konum-bilgisi/",
  "/sumen-takimi/",
  "/deri-sumen-takimlari/",
  "/masa-ustu-isimlikler/",
  "/kumasli-panolar/",
  "/sumen-takimi-nasil-secilir-10-onemli-kriter/",
  "/sumen-takimi-nedir/",
  "/collections",
  "/collections?page=2",
  "/collections/all",
  "/search",
  "/cart",
];

async function fetchText(url) {
  const res = await fetch(url, { redirect: "manual" });
  const text = await res.text();
  return { res, text };
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

async function inspect(url) {
  const res = await fetch(url, {
    redirect: "manual",
    headers: { "user-agent": "sumentakimi-tr-audit/1.0" },
  });
  const loc = res.headers.get("location") || "";
  let html = "";
  if (res.status === 200) {
    html = await res.text();
  }
  return {
    url,
    status: res.status,
    location: loc,
    canonical: pick(html, /rel="canonical"\s+href="([^"]+)"/i) || pick(html, /href="([^"]+)"\s+rel="canonical"/i),
    robots: pick(html, /name="robots"\s+content="([^"]+)"/i),
    title: pick(html, /<title>([^<]+)<\/title>/i),
    h1: pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, " "),
    metaDescription: pick(html, /name="description"\s+content="([^"]*)"/i),
  };
}

const indexXml = (await fetchText(`${origin}/sitemap.xml`)).text;
const childSitemaps = extractLocs(indexXml).filter((u) => u.includes("sitemap_"));
const sitemapUrls = [];
for (const sm of childSitemaps) {
  const xml = (await fetchText(sm)).text;
  sitemapUrls.push(...extractLocs(xml));
}

const unique = [...new Set([...sitemapUrls, ...extraPaths.map((p) => new URL(p, origin).toString())])];
const rows = [];
for (const url of unique) {
  try {
    rows.push(await inspect(url));
  } catch (err) {
    rows.push({ url, status: "ERR", location: "", canonical: "", robots: "", title: "", h1: "", metaDescription: String(err) });
  }
}

writeFileSync(join(root, "url-inventory.json"), JSON.stringify({ crawledAt: new Date().toISOString(), rows }, null, 2));
writeFileSync(
  join(root, "url-inventory.csv"),
  ["url,status,location,canonical,robots,title,h1", ...rows.map((r) => [r.url, r.status, r.location, r.canonical, r.robots, JSON.stringify(r.title), JSON.stringify(r.h1)].join(","))].join("\n")
);
console.log(`crawled ${rows.length}`);
