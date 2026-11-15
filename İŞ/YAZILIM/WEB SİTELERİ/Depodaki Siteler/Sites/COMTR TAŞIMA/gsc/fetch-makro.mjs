const urls = [
  "https://www.sumentakimi.com.tr/pages/sss",
  "https://www.sumentakimi.com.tr/pages/about-us",
];
for (const url of urls) {
  const html = await (await fetch(url, { headers: { "user-agent": "sumentakimi-seo-audit/2.0" } })).text();
  const lines = html.split(/\n/);
  const hits = [];
  lines.forEach((line, i) => {
    if (/Makro Ofis|makro-ofis|makroofis/i.test(line)) {
      hits.push({ n: i + 1, t: line.replace(/\s+/g, " ").trim().slice(0, 240) });
    }
  });
  console.log("\n==", url, "hits", hits.length);
  for (const h of hits) console.log(h.n, h.t);
}
