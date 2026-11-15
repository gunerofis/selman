const urls = [
  "https://www.sumentakimi.com.tr/",
  "https://www.sumentakimi.com.tr/collections/sumen-takimi",
  "https://www.sumentakimi.com.tr/collections/deri-sumen-takimlari",
  "https://www.sumentakimi.com.tr/collections/sumen-takimi?sort_by=price-ascending",
  "https://www.sumentakimi.com.tr/pages/sumen-takimi-rehberi",
  "https://www.sumentakimi.com.tr/pages/sss",
  "https://www.sumentakimi.com.tr/search?q=sumen",
  "https://www.sumentakimi.com.tr/cart",
  "https://www.sumentakimi.com.tr/robots.txt",
  "https://www.sumentakimi.com.tr/sitemap.xml",
  "https://www.sumentakimi.com.tr/products/deri-pecetelik",
  "https://www.sumentakimi.com.tr/blogs/news",
];

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

const rows = [];
for (const url of urls) {
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "sumentakimi-seo-audit/1.0" } });
  const loc = res.headers.get("location") || "";
  let html = "";
  if (res.status === 200) html = await res.text();
  rows.push({
    url,
    status: res.status,
    loc,
    title: pick(html, /<title>([\s\S]*?)<\/title>/i),
    desc: pick(html, /name="description" content="([^"]*)"/i),
    robots: pick(html, /name="robots" content="([^"]*)"/i),
    canonical: pick(html, /rel="canonical" href="([^"]+)"/i),
    h1: pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, " "),
    noindex: /noindex/i.test(html),
    makro: /Makro Ofis/i.test(html),
    liquid: /Liquid error/i.test(html),
    sitemapHint: html.slice(0, 180).replace(/\s+/g, " "),
  });
}
console.log(JSON.stringify(rows, null, 2));
