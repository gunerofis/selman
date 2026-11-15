const checks = [
  ["https://www.sumentakimi.com.tr/?v=seo2", { desc: true, noindex: false }],
  ["https://www.sumentakimi.com.tr/search?q=sumen&v=seo2", { noindex: true }],
  ["https://www.sumentakimi.com.tr/cart?v=seo2", { noindex: true }],
  ["https://www.sumentakimi.com.tr/collections/deri-sumen-takimlari?v=seo2", { guides: true, sss: true }],
  ["https://www.sumentakimi.com.tr/products/deri-pecetelik?v=seo2", { makro: false, guner: true, sss: true }],
  ["https://www.sumentakimi.com.tr/pages/sumen-takimi-rehberi?v=seo2", { nedir: true }],
  ["https://www.sumentakimi.com.tr/blogs/news?v=seo2", { desc: true }],
];

for (const [url, expect] of checks) {
  const html = await (await fetch(url, { headers: { "user-agent": "sumentakimi-seo-verify/1.0" } })).text();
  const row = {
    url: url.split("?")[0],
    title: (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]?.replace(/\s+/g, " ").trim(),
    desc: (html.match(/name="description" content="([^"]*)"/i) || [])[1] || "",
    robots: (html.match(/name="robots" content="([^"]*)"/i) || [])[1] || "",
    makro: /Makro Ofis/i.test(html),
    guner: /Güner Ofis/.test(html),
    guides: /İlgili rehberler/.test(html),
    sss: /pages\/sss/.test(html),
    nedir: /Sümen Takımı Nedir/.test(html),
    liquid: /Liquid error/i.test(html),
  };
  const bad = [];
  if (expect.desc && !row.desc) bad.push("desc missing");
  if (expect.noindex && !/noindex/i.test(row.robots)) bad.push("noindex missing");
  if (expect.noindex === false && /noindex/i.test(row.robots)) bad.push("unexpected noindex");
  if (expect.guides && !row.guides) bad.push("guides missing");
  if (expect.sss && !row.sss) bad.push("sss missing");
  if (expect.makro === false && row.makro) bad.push("makro still visible");
  if (expect.guner && !row.guner) bad.push("guner missing");
  if (expect.nedir && !row.nedir) bad.push("nedir title missing");
  if (row.liquid) bad.push("liquid");
  console.log((bad.length ? "BAD " : "OK  ") + row.url);
  console.log("    title=", row.title);
  console.log("    desc=", row.desc.slice(0, 90));
  console.log("    robots=", row.robots, "makro=", row.makro, "guides=", row.guides);
  if (bad.length) console.log("    issues=", bad.join(", "));
}
