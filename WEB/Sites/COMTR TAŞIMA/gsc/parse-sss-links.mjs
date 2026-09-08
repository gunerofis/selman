import { readFileSync } from "node:fs";
const h = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/sss-live.html", "utf8");
const related = (h.match(/faq-related/g) || []).length;
const products = [...h.matchAll(/href="(\/products\/[^"]+)"/g)].map((x) => x[1]);
const uniqP = [...new Set(products)];
console.log(
  JSON.stringify(
    {
      detailsFaq: (h.match(/class="faq-item"/g) || []).length,
      related,
      productLinks: uniqP,
      has9: h.includes("/collections/9-parca-sumen-takimi"),
      hasAtaturk: h.includes("/collections/ataturk-resimli-makam-panolari"),
      hasBlog: h.includes("/blogs/news/deri-ve-kristal-sumen-takimi-arasindaki-farklar"),
      liquidError: /Liquid error/i.test(h),
    },
    null,
    2
  )
);
