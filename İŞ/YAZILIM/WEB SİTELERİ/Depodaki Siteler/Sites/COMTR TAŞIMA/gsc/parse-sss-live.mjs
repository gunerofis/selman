import { readFileSync, existsSync } from "node:fs";
const path = "C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/sss-live.html";
if (!existsSync(path)) {
  console.log("missing html");
  process.exit(1);
}
const h = readFileSync(path, "utf8");
const title = (h.match(/<title>([^<]+)/) || [])[1];
const h1 = ((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || "").replace(/<[^>]+>/g, " ").trim();
const can = (h.match(/rel="canonical" href="([^"]+)/) || [])[1];
const desc = (h.match(/name="description" content="([^"]*)"/) || [])[1];
console.log(
  JSON.stringify(
    {
      bytes: h.length,
      title,
      h1,
      can,
      desc,
      details: (h.match(/<details/g) || []).length,
      faqPage: /FAQPage/.test(h),
      article: /schema.org\/Article/.test(h),
      gunerofisUrl: /gunerofis\.com/i.test(h),
      search: /data-faq-search/.test(h),
      footerSss: /href="\/pages\/sss"/.test(h),
      q1: /soru-001/.test(h),
      q200: /soru-200/.test(h),
      liquidError: /Liquid error/i.test(h),
    },
    null,
    2
  )
);
