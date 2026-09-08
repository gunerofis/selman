const urls = [
  "https://www.sumentakimi.com.tr/",
  "https://www.sumentakimi.com.tr/pages/about-us",
  "https://www.sumentakimi.com.tr/pages/sss",
  "https://www.sumentakimi.com.tr/products/deri-pecetelik",
  "https://www.sumentakimi.com.tr/products/diamond-silver-sumen-takimi-9-parca-siyah",
  "https://www.sumentakimi.com.tr/collections/sumen-takimi",
  "https://www.sumentakimi.com.tr/collections/10-parca-sumen-takimi",
];

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

for (const url of urls) {
  const html = await (await fetch(url, { headers: { "user-agent": "olay-close/1.0", "cache-control": "no-cache" } })).text();
  const ld = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      const j = JSON.parse(m[1]);
      ld.push(j["@type"] || (j["@graph"] || []).map((x) => x["@type"]).join("+"));
    } catch (e) {
      ld.push("PARSE:" + e.message.slice(0, 40));
    }
  }
  console.log({
    url,
    title: pick(html, /<title>([\s\S]*?)<\/title>/i),
    desc: pick(html, /name="description" content="([^"]*)"/i).slice(0, 120),
    h1: pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, " "),
    eyebrow: pick(html, /class="eyebrow">([^<]+)/i),
    tr: (html.match(/Sümen Takımı TR/g) || []).length,
    guner: (html.match(/Güner Ofis/g) || []).length,
    makro: (html.match(/Makro Ofis/g) || []).length,
    faq: (html.match(/class="faq-item"/g) || []).length,
    piece9: html.includes("/collections/9-parca-sumen-takimi"),
    piece12: html.includes("/collections/12-parca-sumen-takimi"),
    makroHash: html.includes("otel-ekipmanlari-makro-ofis"),
    gunerHash: html.includes("otel-ekipmanlari-guner-ofis"),
    liquid: /Liquid error/i.test(html),
    ld,
  });
}
