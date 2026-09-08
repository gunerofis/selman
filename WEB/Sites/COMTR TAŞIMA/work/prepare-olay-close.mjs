import { readFileSync, writeFileSync } from "node:fs";

let sss = readFileSync("work/sss-body.html", "utf8");
sss = sss.replaceAll("Güner Ofis", "Makro Ofis");
sss = sss.replaceAll("otel-ekipmanlari-guner-ofis", "otel-ekipmanlari-makro-ofis");
sss = sss.replaceAll("Sümen Takımı TR", "Sümen Takımı");
writeFileSync("work/sss-body.html", sss);
writeFileSync(
  "graphql/sss-update-vars.json",
  JSON.stringify({ id: "gid://shopify/Page/166814220580", body: sss })
);
console.log("sss faq", (sss.match(/class="faq-item"/g) || []).length);
console.log("sss guner", (sss.match(/Güner/g) || []).length);
console.log("sss makro", (sss.match(/Makro Ofis/g) || []).length);
console.log("sss TR", (sss.match(/Sümen Takımı TR/g) || []).length);

const vendor = readFileSync("graphql/vendor.jsonl", "utf8").replaceAll(
  '"vendor":"Güner Ofis"',
  '"vendor":"Makro Ofis"'
);
writeFileSync("graphql/vendor-makro.jsonl", vendor);
console.log("vendor lines", vendor.trim().split("\n").length);

const about = `<p>Sümen Takımı, Makro Ofis üretimi masaüstü ofis ürünlerini satar. Mağaza adı Sümen Takımı; üretici Makro Ofis’tir.</p>
<h2>Üretim yapısı</h2>
<ul>
<li>MDF işleme</li>
<li>Deri kaplama</li>
<li>Ahşap uygulama</li>
<li>Kişiselleştirme</li>
<li>Seri ve kurumsal üretim</li>
</ul>
<h2>Adresler</h2>
<p><strong>Üretim (Gebze):</strong> <a href="https://www.google.com/maps/search/?api=1&query=Arapçeşme+Mahallesi+1038.+Sokak+No:32/A+Gebze+Kocaeli" rel="noopener" target="_blank">Arapçeşme Mah. 1038. Sok. No:32/A, Gebze / Kocaeli</a></p>
<p><strong>Depo (İstanbul):</strong> Onur Sokak No:8, 34445 İstanbul</p>
<p>Telefon: <a href="tel:+905011442729">0501 144 27 29</a><br>E-posta: <a href="mailto:info@sumentakimi.com.tr">info@sumentakimi.com.tr</a></p>
<p>Kargo her iki noktadan da çıkabilir.</p>`;
writeFileSync(
  "graphql/about-body-vars.json",
  JSON.stringify({ id: "gid://shopify/Page/166761464100", body: about })
);
writeFileSync(
  "graphql/about-seo-vars.json",
  JSON.stringify({
    metafields: [
      {
        ownerId: "gid://shopify/Page/166761464100",
        namespace: "global",
        key: "title_tag",
        type: "single_line_text_field",
        value: "Hakkımızda ve Üretim | Sümen Takımı",
      },
      {
        ownerId: "gid://shopify/Page/166761464100",
        namespace: "global",
        key: "description_tag",
        type: "single_line_text_field",
        value:
          "Sümen Takımı mağazası ve Makro Ofis üretimi: MDF işleme, deri kaplama, kişiselleştirme, Gebze üretim ve İstanbul depo.",
      },
    ],
  })
);
console.log("about vars ok");
