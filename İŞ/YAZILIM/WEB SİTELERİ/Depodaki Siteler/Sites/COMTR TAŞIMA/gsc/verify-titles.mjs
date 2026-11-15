import { spawn } from "node:child_process";

const urls = [
  "https://www.sumentakimi.com.tr/pages/about-us",
  "https://www.sumentakimi.com.tr/products/deri-pecetelik",
  "https://www.sumentakimi.com.tr/collections/sumen-takimi?sort_by=price-ascending",
];
for (const url of urls) {
  const html = await (await fetch(url, { headers: { "user-agent": "v", "cache-control": "no-cache" } })).text();
  const t = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1];
  const r = (html.match(/name="robots" content="([^"]*)"/i) || [])[1] || "";
  const m = (html.match(/Makro Ofis/gi) || []).length;
  const l = /Liquid error/i.test(html);
  console.log({ url, t, r, m, l });
}
void spawn;
