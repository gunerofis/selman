const urls = [
  "https://www.sumentakimi.com.tr/",
  "https://www.sumentakimi.com.tr/collections/sumen-takimi",
  "https://www.sumentakimi.com.tr/collections/sumen-takimi?sort_by=price-ascending",
  "https://www.sumentakimi.com.tr/collections/sumen-takimi?page=2",
  "https://www.sumentakimi.com.tr/collections/deri-sumen-takimlari",
  "https://www.sumentakimi.com.tr/collections/luks-sumen-takimlari",
  "https://www.sumentakimi.com.tr/collections/kristal-sumen-takimlari",
  "https://www.sumentakimi.com.tr/collections/10-parca-sumen-takimi",
  "https://www.sumentakimi.com.tr/collections/masa-ustu-isimlikler",
  "https://www.sumentakimi.com.tr/collections/makam-panolari",
  "https://www.sumentakimi.com.tr/collections/deri-otel-ekipmanlari",
  "https://www.sumentakimi.com.tr/collections",
  "https://www.sumentakimi.com.tr/pages/sumen-takimi-rehberi",
  "https://www.sumentakimi.com.tr/pages/sss",
  "https://www.sumentakimi.com.tr/pages/about-us",
  "https://www.sumentakimi.com.tr/pages/bize-ulasin",
  "https://www.sumentakimi.com.tr/search?q=sumen",
  "https://www.sumentakimi.com.tr/cart",
  "https://www.sumentakimi.com.tr/robots.txt",
  "https://www.sumentakimi.com.tr/sitemap.xml",
  "https://www.sumentakimi.com.tr/blogs/news",
  "https://www.sumentakimi.com.tr/blogs/news/sumen-takimi-nedir-ve-hangi-parcalardan-olusur",
  "https://www.sumentakimi.com.tr/products/deri-pecetelik",
  "https://www.sumentakimi.com.tr/products/diamond-9-parca-sumen-takimi-siyah",
];

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

const rows = [];
for (const url of urls) {
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "sumentakimi-seo-audit/2.0" } });
  const loc = res.headers.get("location") || "";
  let html = "";
  if (res.status === 200 || res.status === 429) html = await res.text();
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((m) => {
    try { return JSON.parse(m[1]); } catch { return m[1].slice(0, 180); }
  });
  const makroHits = [...html.matchAll(/Makro Ofis/gi)].length;
  rows.push({
    url,
    status: res.status,
    loc,
    title: pick(html, /<title>([\s\S]*?)<\/title>/i),
    desc: pick(html, /name="description" content="([^"]*)"/i),
    robots: pick(html, /name="robots" content="([^"]*)"/i),
    canonical: pick(html, /rel="canonical" href="([^"]+)"/i),
    ogDesc: pick(html, /property="og:description" content="([^"]*)"/i),
    h1: pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, " "),
    makroHits,
    guner: /Güner Ofis|Guner Ofis/i.test(html),
    vendorEyebrow: pick(html, /class="eyebrow">([^<]+)/i),
    olcu: /<dt>Ölçü<\/dt>/i.test(html),
    faq: /collection-faq|faq-item|data-faq-root/i.test(html),
    orgLd: ld.some((x) => x && (x["@type"] === "Organization" || (Array.isArray(x["@type"]) && x["@type"].includes("Organization")) || x["@graph"] )),
    types: ld.map((x) => (x && x["@type"]) || typeof x).slice(0, 8),
    liquid: /Liquid error/i.test(html),
    sitemapHint: url.includes("robots") || url.includes("sitemap") ? html.slice(0, 500).replace(/\s+/g, " ") : undefined,
    sssHash: url.includes("/sss") ? {
      guner: html.includes('id="otel-ekipmanlari-guner-ofis"'),
      makro: html.includes('id="otel-ekipmanlari-makro-ofis"'),
    } : undefined,
  });
}
console.log(JSON.stringify(rows, null, 2));
