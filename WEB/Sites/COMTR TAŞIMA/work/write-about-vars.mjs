import { writeFileSync } from "node:fs";

const body = `<p>Sümen Takımı TR, Güner Ofis üretimi masaüstü ofis ürünlerini satar. Mağaza adı Sümen Takımı TR; üretici Güner Ofis’tir.</p>
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
  JSON.stringify({ id: "gid://shopify/Page/166761464100", body })
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
        value: "Hakkımızda ve Üretim | Sümen Takımı TR",
      },
      {
        ownerId: "gid://shopify/Page/166761464100",
        namespace: "global",
        key: "description_tag",
        type: "single_line_text_field",
        value:
          "Sümen Takımı TR mağazası ve Güner Ofis üretimi: MDF işleme, deri kaplama, kişiselleştirme, Gebze üretim ve İstanbul depo.",
      },
    ],
  })
);

console.log("about vars written", Buffer.byteLength(body));
