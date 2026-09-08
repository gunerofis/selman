import { writeFileSync } from "node:fs";

const blogId = "gid://shopify/Blog/125948657956";
const author = { name: "Sümen Takımı TR" };

const articles = [
  {
    handle: "sumen-takimi-nedir-ve-hangi-parcalardan-olusur",
    title: "Sümen Takımı Nedir ve Hangi Parçalardan Oluşur?",
    summary: "Sümen takımının ne işe yaradığını ve yazı altlığı, kalemlik, evraklık, isimlik gibi parçaların masada nasıl durduğunu anlatan kısa rehber.",
    body: `<p>Sümen takımı, çalışma masasındaki yazı altlığı ve tamamlayıcı parçaları aynı malzeme ve düzende tutan masaüstü ofis setidir. Satış listesi değil; masada hangi parçanın ne işe yaradığını ayırmak için yazılmıştır.</p>
<h2>Temel parçalar</h2>
<ul>
<li>Sümen / yazı altlığı: klavye ve evrak için zemin</li>
<li>Kalemlik: günlük kalem ve küçük araçlar</li>
<li>Evrak rafı veya evraklık: bekleyen kâğıtlar</li>
<li>Notluk: kısa not ve imza alanı</li>
<li>İsimlik: ad ve unvan</li>
</ul>
<p>Bazı setlerde telefon standı veya masa bayrağı da bulunur. Bayraklı ve full set modeller ayrı üründür.</p>
<p>Koleksiyon: <a href="/collections/sumen-takimi">sümen takımı modelleri</a>. Karşılaştırma: <a href="/blogs/news/9-10-11-ve-12-parca-sumen-takimi-karsilastirmasi">parça sayısı</a>. Merkez: <a href="/pages/sumen-takimi-rehberi">sümen takımı rehberi</a>.</p>`,
  },
  {
    handle: "9-10-11-ve-12-parca-sumen-takimi-karsilastirmasi",
    title: "9, 10, 11 ve 12 Parça Sümen Takımı Karşılaştırması",
    summary: "9, 10, 11 ve 12 parça sümen takımlarını masa genişliği ve set içeriğine göre ayıran karşılaştırma yazısı.",
    body: `<p>Parça sayısı, sümen takımını fiyatlandırmak için değil; masaya sığacak düzeni seçmek için kullanılır. Bu yazı kategori satış metninin kopyası değildir.</p>
<h2>Kısa ayrım</h2>
<ul>
<li>9 parça: daha dar masa, temel düzen</li>
<li>10 parça: orta masa, günlük ofis</li>
<li>11 parça: isimlikli veya daha geniş set</li>
<li>12 parça: yönetici masası, bayraklı veya full set</li>
</ul>
<p>6 ve 7 parça setler ayrı filtrededir; ilk aşamada kalıcı kategori açılmadı.</p>
<p><a href="/collections/9-parca-sumen-takimi">9 parça</a>, <a href="/collections/10-parca-sumen-takimi">10 parça</a>, <a href="/collections/11-parca-sumen-takimi">11 parça</a>, <a href="/collections/12-parca-sumen-takimi">12 parça</a> sümen takımları. Ölçü notu: <a href="/blogs/news/masa-olcusune-gore-sumen-takimi-secimi">masa ölçüsüne göre seçim</a>.</p>`,
  },
  {
    handle: "deri-sumen-takimi-bakimi-ve-temizligi",
    title: "Deri Sümen Takımı Bakımı ve Temizliği",
    summary: "Deri sümen takımını çizmeden silmek, ıslak bırakmamak ve güneşten korumak için kısa bakım notları.",
    body: `<p>Deri sümen takımı günlük temas görür. Bakım, ürünü yeni göstermek için değil; yüzeyi ve dikişi korumak içindir.</p>
<h2>Günlük temizlik</h2>
<p>Kuru veya hafif nemli yumuşak bez kullanın. Aşındırıcı sünger, çamaşır suyu ve alkol bazlı sert sprey deri görünümünü bozar.</p>
<h2>Lekeler</h2>
<p>Sıvıyı bekletmeden silin. Derin leke veya kurumsal boya için ürünü ıslatmadan üreticiye sorun.</p>
<p>Deri modeller: <a href="/collections/deri-sumen-takimlari">deri sümen takımları</a>. Kristal yüzeyler için bu yazı geçerli değildir; <a href="/collections/kristal-sumen-takimlari">kristal sümen takımları</a> ayrı temizlenir.</p>`,
  },
  {
    handle: "masa-olcusune-gore-sumen-takimi-secimi",
    title: "Masa Ölçüsüne Göre Sümen Takımı Seçimi",
    summary: "Masa genişliği, klavye boşluğu ve parça sayısını birlikte düşünerek sümen takımı seçme rehberi.",
    body: `<p>Sümen, masanın tamamını kaplamak zorunda değildir. Yazı alanı, klavye ve ekran boşluğu kaldıktan sonra set yerleşir.</p>
<h2>Pratik kural</h2>
<ul>
<li>Dar masa: daha az parça, kompakt set</li>
<li>Orta masa: 10 parça civarı</li>
<li>Geniş yönetici masası: 11–12 parça veya lüks set</li>
</ul>
<p>Ölçüyü ürün açıklamasındaki sümen ölçüsüyle karşılaştırın; ölçüsü yazılmayan üründe tahmin etmeyin, <a href="/pages/bize-ulasin">iletişim</a>den sorun.</p>
<p><a href="/collections/sumen-takimi">Tüm sümen takımları</a> · <a href="/blogs/news/yonetici-masasi-icin-sumen-takimi-secimi">yönetici masası</a></p>`,
  },
  {
    handle: "yonetici-masasi-icin-sumen-takimi-secimi",
    title: "Yönetici Masası İçin Sümen Takımı Seçimi",
    summary: "Geniş yönetici masalarında parça sayısı, lüks set ve masa bayrağı seçimini ayıran kısa rehber.",
    body: `<p>Yönetici masası ev ofisten daha geniştir. Burada amaç az parça ile sadeleşmek değil; masa üstünü dağınık göstermeden bütünlüklü tutmaktır.</p>
<h2>Ne zaman lüks veya 12 parça?</h2>
<p>Karşılama alanı genişse, isimlik ve masa bayrağı kullanılıyorsa 11–12 parça veya lüks set daha dengeli durur. Ev ofis için bu yazı zorunlu değildir.</p>
<p><a href="/collections/luks-sumen-takimlari">Lüks sümen takımları</a>, <a href="/collections/12-parca-sumen-takimi">12 parça sümen takımları</a>. Ev ofis için <a href="/collections/deri-sumen-takimlari">deri sümen takımları</a>.</p>`,
  },
  {
    handle: "siyah-kahve-taba-ve-bordo-sumen-renk-rehberi",
    title: "Siyah, Kahve, Taba ve Bordo Sümen Renk Rehberi",
    summary: "Siyah, kahve, taba ve bordo sümen renklerini masa ve aksesuar rengiyle birlikte seçmek için kısa rehber.",
    body: `<p>Renk, sümen takımında en görünür karardır. Bu yazı stok listesi değil; masa ve metal detayla uyum notudur.</p>
<ul>
<li>Siyah: koyu masa ve sade ofis</li>
<li>Kahve: ahşap masa</li>
<li>Taba: açık ahşap ve sıcak ton</li>
<li>Bordo: makam ve kurumsal vurgu</li>
</ul>
<p>Gold ve gümüş aksesuar ayrı alandır. Krem, beyaz, yeşil gibi renkler modelde varsa ürün başlığından okunur.</p>
<p>Deri renkleri: <a href="/collections/deri-sumen-takimlari">deri sümen takımları</a>. Genel seçim: <a href="/blogs/news/sumen-takimi-secerken-nelere-dikkat-edilmeli">seçerken nelere dikkat edilmeli</a>.</p>`,
  },
  {
    handle: "kurumsal-logolu-sumen-takimi-siparis-sureci",
    title: "Kurumsal Logolu Sümen Takımı Sipariş Süreci",
    summary: "Logo, unvan ve adet bilgisini nasıl ileteceğinizi anlatan kurumsal sümen sipariş süreci.",
    body: `<p>Kurumsal logolu sümen veya isimlik, standart sepet ürününden ayrı bir üretim adımıdır. Logo dosyası, unvan satırı ve adet netleşmeden baskı başlamaz.</p>
<h2>İletmeniz gerekenler</h2>
<ul>
<li>Ürün adı veya bağlantısı</li>
<li>Adet</li>
<li>İsim / unvan satırı</li>
<li>Logo dosyası (mümkünse vektör)</li>
</ul>
<p>Sepetteki isim alanına yazılan metin sipariş notuna düşer. Toplu baskı için <a href="/pages/bize-ulasin">iletişim formu</a> kullanın.</p>
<p>İsimlikler: <a href="/collections/masa-ustu-isimlikler">masa üstü isimlikler</a>. Ayrıntı: <a href="/blogs/news/kisiye-ozel-masa-isimligi-siparis-rehberi">kişiye özel isimlik rehberi</a>.</p>`,
  },
  {
    handle: "sumen-takimi-hediye-secim-rehberi",
    title: "Sümen Takımı Hediye Seçim Rehberi",
    summary: "Yönetici, ev ofis ve kurumsal hediye için sümen takımı seçerken bakılacak kısa ölçütler.",
    body: `<p>Sümen takımı hediye olarak masa sahibinin çalışma düzenine bağlıdır. Yanlış parça sayısı veya renk, hediyeyi dekoratif bırakır.</p>
<h2>Hediye için üç soru</h2>
<ul>
<li>Masa geniş mi, dar mı?</li>
<li>İsimlik veya logo istenecek mi?</li>
<li>Günlük ofis mi, yönetici masası mı?</li>
</ul>
<p>Bilinmiyorsa sade deri 10 parça veya isimlik hediyeli set daha az risklidir. Bayraklı full set ancak makam kullanımı netse seçilir.</p>
<p><a href="/collections/deri-sumen-takimlari">Deri sümen takımları</a> · <a href="/pages/sumen-takimi-rehberi">rehber merkezi</a></p>`,
  },
];

writeFileSync(
  "C:/Users/DELL/Desktop/sumentakimi-com-tr/graphql/articles.jsonl",
  articles
    .map((a) =>
      JSON.stringify({
        article: {
          blogId,
          title: a.title,
          handle: a.handle,
          body: a.body,
          summary: a.summary,
          isPublished: true,
          author,
          tags: ["rehber", "sümen"],
        },
      })
    )
    .join("\n")
);

const lines = (await import("node:fs")).readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/backup/products.jsonl", "utf8").trim().split("\n").map(JSON.parse);
const products = lines.filter((o) => (o.id || "").includes("/Product/"));

function color(title) {
  const t = title.toLowerCase();
  const map = [
    ["turkuaz", "Turkuaz"],
    ["turuncu", "Turuncu"],
    ["bordo", "Bordo"],
    ["kahve", "Kahve"],
    ["krem", "Krem"],
    ["beyaz", "Beyaz"],
    ["yeşil", "Yeşil"],
    ["yesil", "Yeşil"],
    ["siyah", "Siyah"],
    ["taba", "Taba"],
    ["gri", "Gri"],
    ["mavi", "Mavi"],
  ];
  for (const [k, v] of map) if (t.includes(k)) return v;
  return "";
}
function accessory(title) {
  const t = title.toLowerCase();
  if (t.includes("gold")) return "Gold";
  if (t.includes("gümüş") || t.includes("gumus") || t.includes("silver")) return "Gümüş";
  return "";
}
function material(title, type) {
  const t = (title + " " + type).toLowerCase();
  if (t.includes("kristal")) return "Kristal";
  if (t.includes("kumaş") || t.includes("kumas")) return "Kumaş";
  if (t.includes("deri")) return "Deri";
  if (type.includes("Sümen")) return "Deri";
  return "";
}
function suffix(type) {
  if (type.includes("İsimlik") || type.includes("Isimlik")) return "isimlik";
  if (type.includes("Bayrak")) return "bayrak";
  if (type.includes("Otel") || type.includes("Aksesuar") || type.includes("Masa Üstü Set")) return "otel";
  if (type.includes("Pano") || type.includes("Tuğra") || type.includes("Tugra") || type.includes("Atatürk")) return "pano";
  if (type.includes("Sümen")) return "sumen";
  return "otel";
}

const meta = [];
const suffixes = [];
for (const p of products) {
  const title = p.title || "";
  const type = p.productType || "";
  const c = color(title);
  const a = accessory(title);
  const m = material(title, type);
  const personal = /isimlik/i.test(title) || type.includes("İsimlik") || (type.includes("Sümen") && !type.includes("Otel"));
  const flag = /bayrak/i.test(title);
  const full = /full set/i.test(title);
  if (c) meta.push({ metafields: [{ ownerId: p.id, namespace: "custom", key: "ana_renk", type: "single_line_text_field", value: c }] });
  if (a) meta.push({ metafields: [{ ownerId: p.id, namespace: "custom", key: "aksesuar_rengi", type: "single_line_text_field", value: a }] });
  if (m) meta.push({ metafields: [{ ownerId: p.id, namespace: "custom", key: "malzeme", type: "single_line_text_field", value: m }] });
  meta.push({ metafields: [{ ownerId: p.id, namespace: "custom", key: "kisisellestirme", type: "boolean", value: personal ? "true" : "false" }] });
  meta.push({ metafields: [{ ownerId: p.id, namespace: "custom", key: "masa_bayragi", type: "boolean", value: flag ? "true" : "false" }] });
  meta.push({ metafields: [{ ownerId: p.id, namespace: "custom", key: "full_set", type: "boolean", value: full ? "true" : "false" }] });
  suffixes.push({ product: { id: p.id, templateSuffix: suffix(type) } });
}

writeFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/graphql/extra-metafields.jsonl", meta.map((x) => JSON.stringify(x)).join("\n"));
writeFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/graphql/template-suffix.jsonl", suffixes.map((x) => JSON.stringify(x)).join("\n"));
console.log({ articles: articles.length, meta: meta.length, suffixes: suffixes.length });
