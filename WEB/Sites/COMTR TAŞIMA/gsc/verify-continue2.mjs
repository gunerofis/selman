const urls = [
  "https://www.sumentakimi.com.tr/",
  "https://www.sumentakimi.com.tr/collections/sumen-takimi",
  "https://www.sumentakimi.com.tr/collections/sumen-takimi?sort_by=price-ascending",
  "https://www.sumentakimi.com.tr/collections/deri-sumen-takimlari",
  "https://www.sumentakimi.com.tr/collections/deri-otel-ekipmanlari",
  "https://www.sumentakimi.com.tr/collections",
  "https://www.sumentakimi.com.tr/pages/sss",
  "https://www.sumentakimi.com.tr/pages/about-us",
  "https://www.sumentakimi.com.tr/pages/sumen-takimi-rehberi",
  "https://www.sumentakimi.com.tr/products/deri-pecetelik",
  "https://www.sumentakimi.com.tr/products/diamond-silver-sumen-takimi-9-parca-siyah",
  "https://www.sumentakimi.com.tr/blogs/news/sumen-takimi-nedir-ve-hangi-parcalardan-olusur",
  "https://www.sumentakimi.com.tr/robots.txt",
  "https://www.sumentakimi.com.tr/pages/adres-ve-konum-bilgisi",
  "https://www.sumentakimi.com.tr/pages/makam-panolari-2",
  "https://www.sumentakimi.com.tr/pages/contact",
];

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

function ldTypes(html) {
  const out = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      const j = JSON.parse(m[1]);
      if (j["@graph"]) out.push(...j["@graph"].map((x) => x["@type"]));
      else out.push(j["@type"]);
    } catch (e) {
      out.push("PARSE_ERROR:" + e.message.slice(0, 80));
    }
  }
  return out;
}

const rows = [];
for (const url of urls) {
  const res = await fetch(url, {
    redirect: "manual",
    headers: { "user-agent": "sumentakimi-seo-verify/2.0", "cache-control": "no-cache" },
  });
  const loc = res.headers.get("location") || "";
  let html = "";
  if (res.status === 200) html = await res.text();
  const types = ldTypes(html);
  rows.push({
    url,
    status: res.status,
    loc,
    title: pick(html, /<title>([\s\S]*?)<\/title>/i),
    desc: pick(html, /name="description" content="([^"]*)"/i),
    robots: pick(html, /name="robots" content="([^"]*)"/i),
    canonical: pick(html, /rel="canonical" href="([^"]+)"/i),
    ogDesc: pick(html, /property="og:description" content="([^"]*)"/i).slice(0, 140),
    h1: pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, " "),
    makro: (html.match(/Makro Ofis/gi) || []).length,
    guner: (html.match(/Güner Ofis/gi) || []).length,
    vendorEyebrow: pick(html, /class="eyebrow">([^<]+)/i),
    faqItems: (html.match(/class="faq-item"/g) || []).length,
    gunerHash: html.includes('id="otel-ekipmanlari-guner-ofis"'),
    makroHash: html.includes('id="otel-ekipmanlari-makro-ofis"'),
    types,
    liquid: /Liquid error/i.test(html),
    sortDisallow: url.includes("robots") ? /Disallow: \/\*sort_by=/i.test(html) : undefined,
    homeOrg: url.endsWith(".tr/") ? types.includes("Organization") && types.includes("WebSite") : undefined,
    rehberLink: url.endsWith(".tr/") ? html.includes("/pages/sumen-takimi-rehberi") : undefined,
  });
}
console.log(JSON.stringify(rows, null, 2));
const bad = rows.filter((r) => r.liquid || (r.status === 200 && r.types.some((t) => String(t).startsWith("PARSE_ERROR"))));
const makroLive = rows.filter((r) => r.makro > 0 && r.status === 200);
console.log("\nPARSE_OR_LIQUID", bad.length);
console.log("MAKRO_PAGES", makroLive.map((r) => r.url + " x" + r.makro));
