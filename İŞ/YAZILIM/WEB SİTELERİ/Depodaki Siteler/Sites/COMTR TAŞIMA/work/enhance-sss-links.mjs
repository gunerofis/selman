import { readFileSync, writeFileSync } from "node:fs";

const live = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/sss-live.html", "utf8");
const m = live.match(/data-faq-root>\s*([\s\S]*?)\s*<\/div>\s*\n\s*<aside class="prose-help"/);
if (!m) throw new Error("live body not found");
let html = m[1].trim();

function related(links) {
  const items = links.map(([href, label]) => `<a href="${href}">${label}</a>`).join(" · ");
  return `<p class="faq-related"><strong>İlgili kategoriler:</strong> ${items}</p>`;
}

function insertBeforeSectionEnd(sectionId, block) {
  const re = new RegExp(`(<section class="faq-section" id="${sectionId}"[\\s\\S]*?)(\\n</section>)`);
  if (!re.test(html)) throw new Error("section missing " + sectionId);
  html = html.replace(re, `$1\n${block}$2`);
}

function appendInAnswer(itemId, extraHtml) {
  const re = new RegExp(`(<details class="faq-item" id="${itemId}">[\\s\\S]*?</p>)\\s*</div></details>`);
  if (!re.test(html)) throw new Error("item missing " + itemId);
  html = html.replace(re, `$1\n${extraHtml}\n</div></details>`);
}

const sections = {
  "temel-bilgiler": [
    ["/collections/sumen-takimi", "Sümen takımları"],
    ["/pages/sumen-takimi-rehberi", "Sümen takımı rehberi"],
    ["/blogs/news/sumen-takimi-secerken-nelere-dikkat-edilmeli", "Seçim yazısı"],
  ],
  "satin-alma-model-secimi": [
    ["/collections/sumen-takimi", "Sümen takımları"],
    ["/collections/deri-sumen-takimlari", "Deri sümen takımları"],
    ["/blogs/news/sumen-takimi-secerken-nelere-dikkat-edilmeli", "Seçim yazısı"],
  ],
  "deri-sumen-takimlari": [
    ["/collections/deri-sumen-takimlari", "Deri sümen takımları"],
    ["/blogs/news/deri-ve-kristal-sumen-takimi-arasindaki-farklar", "Deri ve kristal farkları"],
  ],
  "ahsap-kristal-luks-tek-parca": [
    ["/collections/kristal-sumen-takimlari", "Kristal sümen takımları"],
    ["/collections/luks-sumen-takimlari", "Lüks sümen takımları"],
    ["/collections/deri-sumen-takimlari", "Deri sümen takımları"],
  ],
  "parcalar-ve-islevler": [
    ["/collections/sumen-aksesuarlari", "Sümen aksesuarları"],
    ["/collections/masa-ustu-isimlikler", "Masaüstü isimlikler"],
    ["/collections/masa-ustu-setler", "Masa üstü setler"],
  ],
  "parca-sayisi": [
    ["/collections/9-parca-sumen-takimi", "9 parça sümen"],
    ["/collections/10-parca-sumen-takimi", "10 parça sümen"],
    ["/collections/11-parca-sumen-takimi", "11 parça sümen"],
    ["/collections/12-parca-sumen-takimi", "12 parça sümen"],
  ],
  "olcu-masa-ergonomi": [
    ["/collections/sumen-takimi", "Sümen takımları"],
    ["/pages/sumen-takimi-rehberi", "Ölçü ve seçim rehberi"],
  ],
  "renk-ve-tasarim": [
    ["/collections/deri-sumen-takimlari", "Deri sümen takımları"],
    ["/collections/luks-sumen-takimlari", "Lüks sümen takımları"],
  ],
  "kisiye-ozel-logo": [
    ["/collections/masa-ustu-isimlikler", "Masaüstü isimlikler"],
    ["/blogs/news/kisiye-ozel-masa-isimligi-siparis-rehberi", "İsimlik sipariş rehberi"],
    ["/pages/bize-ulasin", "Özel sipariş"],
  ],
  "kalite-ve-dayaniklilik": [
    ["/pages/about-us", "Üretim"],
    ["/pages/teslimat-ve-iade-sozlesmesi", "Teslimat ve iade"],
  ],
  "bakim-ve-temizlik": [
    ["/pages/sumen-takimi-rehberi", "Sümen takımı rehberi"],
  ],
  "kullanim-alanlari-hediye": [
    ["/collections/sumen-takimi", "Sümen takımları"],
    ["/collections/masa-ustu-isimlikler", "Masaüstü isimlikler"],
    ["/pages/bize-ulasin", "Kurumsal hediye"],
  ],
  "siparis-odeme-kargo-iade": [
    ["/pages/teslimat-ve-iade-sozlesmesi", "Teslimat ve iade"],
    ["/pages/mesafeli-satis-sozlesmesi", "Mesafeli satış"],
    ["/pages/bize-ulasin", "İletişim"],
  ],
  "kurumsal-toptan-ozel-uretim": [
    ["/pages/bize-ulasin", "Kurumsal talep"],
    ["/pages/about-us", "Üretim"],
  ],
  "masa-isimlikleri-masaustu": [
    ["/collections/masa-ustu-isimlikler", "Masaüstü isimlikler"],
    ["/collections/masa-ustu-setler", "Masa üstü setler"],
    ["/products/kristal-masa-isimligi", "Kristal masa isimliği"],
  ],
  "makam-panolari-kanvas": [
    ["/collections/makam-panolari", "Makam panoları"],
    ["/collections/ataturk-resimli-makam-panolari", "Atatürk resimli makam panoları"],
  ],
  "kumasli-panolar-yazi-tahtalari": [
    ["/collections/kumasli-panolar", "Kumaşlı panolar"],
    ["/products/duvara-monte-kumasli-pano-bordo", "Duvara monte kumaşlı pano bordo"],
  ],
  "makam-ve-masa-bayraklari": [
    ["/collections/makam-bayraklari", "Makam bayrakları"],
    ["/products/logolu-makam-bayragi", "Logolu makam bayrağı"],
    ["/products/tekli-masa-bayragi-gumus-direkli", "Tekli masa bayrağı"],
  ],
  "deri-kutular-aksesuarlar": [
    ["/collections/sumen-aksesuarlari", "Sümen aksesuarları"],
    ["/collections/deri-otel-ekipmanlari", "Deri otel ekipmanları"],
    ["/products/deri-pecetelik", "Deri peçetelik"],
  ],
  "otel-ekipmanlari-guner-ofis": [
    ["/collections/deri-otel-ekipmanlari", "Deri otel ekipmanları"],
    ["/pages/about-us", "Hakkımızda ve üretim"],
  ],
};

for (const [id, links] of Object.entries(sections)) {
  insertBeforeSectionEnd(id, related(links));
}

appendInAnswer(
  "soru-001",
  `<p>Güncel modeller <a href="/collections/sumen-takimi">sümen takımları</a> koleksiyonunda karşılaştırılabilir.</p>`
);
appendInAnswer(
  "soru-012",
  `<p>Seçim sırası için <a href="/blogs/news/sumen-takimi-secerken-nelere-dikkat-edilmeli">sümen takımı seçerken nelere dikkat edilmeli</a> yazısına ve <a href="/pages/sumen-takimi-rehberi">sümen takımı rehberine</a> bakın.</p>`
);
appendInAnswer(
  "soru-021",
  `<p>Mevcut deri setler <a href="/collections/deri-sumen-takimlari">deri sümen takımları</a> koleksiyonundadır.</p>`
);
appendInAnswer(
  "soru-034",
  `<p>Malzeme karşılaştırması için <a href="/blogs/news/deri-ve-kristal-sumen-takimi-arasindaki-farklar">deri ve kristal sümen takımı arasındaki farklar</a> yazısını kullanın.</p>`
);
appendInAnswer(
  "soru-038",
  `<p>Bu mağazadaki lüks setler <a href="/collections/luks-sumen-takimlari">lüks sümen takımları</a> koleksiyonundadır.</p>`
);
appendInAnswer(
  "soru-042",
  `<p>İsimlikli modeller <a href="/collections/masa-ustu-isimlikler">masaüstü isimlikler</a> koleksiyonunda yer alır.</p>`
);
appendInAnswer(
  "soru-047",
  `<p>Evrak raflı masaüstü örnekleri <a href="/collections/masa-ustu-setler">masa üstü setler</a> içindedir. Üç parçalı bir örnek: <a href="/products/deri-3-parca-masa-ustu-seti-ciftli-evrak-rafi-kalemlik-ve-notluk">deri 3 parça masa üstü seti</a>.</p>`
);
appendInAnswer(
  "soru-054",
  `<p>Bu mağazadaki dokuz parçalı setler <a href="/collections/9-parca-sumen-takimi">9 parça sümen takımı</a> koleksiyonundadır.</p>`
);
appendInAnswer(
  "soru-055",
  `<p>On parçalı modeller <a href="/collections/10-parca-sumen-takimi">10 parça sümen takımı</a> koleksiyonunda toplanır.</p>`
);
appendInAnswer(
  "soru-056",
  `<p>Karşılaştırma için <a href="/collections/11-parca-sumen-takimi">11 parça sümen takımı</a> ve <a href="/collections/12-parca-sumen-takimi">12 parça sümen takımı</a> koleksiyonlarına bakın.</p>`
);
appendInAnswer(
  "soru-081",
  `<p>İsimlik uygulaması için <a href="/blogs/news/kisiye-ozel-masa-isimligi-siparis-rehberi">kişiye özel masa isimliği sipariş rehberi</a> ve <a href="/pages/bize-ulasin">iletişim</a> sayfasını kullanın.</p>`
);
appendInAnswer(
  "soru-126",
  `<p>Güncel kargo ve iade koşulları <a href="/pages/teslimat-ve-iade-sozlesmesi">teslimat ve iade sözleşmesinde</a> yer alır.</p>`
);
appendInAnswer(
  "soru-130",
  `<p>Cayma ve iade metni <a href="/pages/teslimat-ve-iade-sozlesmesi">teslimat ve iade</a> ile <a href="/pages/mesafeli-satis-sozlesmesi">mesafeli satış sözleşmesinde</a> belirtilir.</p>`
);
appendInAnswer(
  "soru-154",
  `<p>Bu mağazadaki Atatürk temalı modeller <a href="/collections/ataturk-resimli-makam-panolari">Atatürk resimli makam panoları</a> koleksiyonundadır.</p>`
);
appendInAnswer(
  "soru-161",
  `<p>Mevcut kumaşlı panolar <a href="/collections/kumasli-panolar">kumaşlı panolar</a> koleksiyonundadır. Örnek model: <a href="/products/duvara-monte-kumasli-pano-bordo">duvara monte kumaşlı pano bordo</a>.</p>`
);
appendInAnswer(
  "soru-173",
  `<p>Logolu seçenekler arasında <a href="/products/logolu-makam-bayragi">yalnız bayrak</a>, <a href="/products/logolu-makam-bayragi-krom">krom direkli</a> ve <a href="/products/logolu-makam-bayragi-gold">gold direkli</a> modeller bulunur.</p>`
);
appendInAnswer(
  "soru-176",
  `<p>Tekli masa bayrağı örnekleri: <a href="/products/tekli-masa-bayragi-gumus-direkli">krom direkli tekli masa bayrağı</a> ve <a href="/products/tekli-masa-bayragi-krom-direkli">gold direkli tekli masa bayrağı</a>.</p>`
);
appendInAnswer(
  "soru-187",
  `<p>Bu mağazadaki örnek: <a href="/products/deri-pecetelik">deri peçetelik</a>.</p>`
);

html = html.replace(
  "Ahşap sümen takımları</a> masa rengiyle birlikte değerlendirilmelidir.",
  "sümen takımları</a> masa rengiyle birlikte değerlendirilmelidir."
);

writeFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/work/sss-body.html", html);
console.log({
  chars: html.length,
  related: (html.match(/faq-related/g) || []).length,
  products: (html.match(/\/products\//g) || []).length,
  collections: (html.match(/\/collections\//g) || []).length,
});
