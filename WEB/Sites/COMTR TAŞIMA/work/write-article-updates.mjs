import { writeFileSync } from "node:fs";

const articles = {
  aNedir: {
    id: "gid://shopify/Article/635984675108",
    tags: ["sümen takımı", "parça", "rehber"],
    body: `<p>Sümen takımı, çalışma masasının ana yazı yüzeyini ve günlük masaüstü araçlarını aynı malzeme ve düzende tutan settir. Tek parça sümen yalnızca altlıkken takım; kalemlik, notluk, isimlik veya evrak rafı gibi tamamlayıcılarla birlikte gelir.</p>
<h2>Hangi parçalardan oluşur?</h2>
<p>Modele göre değişir. Yaygın parçalar ana sümen, kalemlik, notluk, kartvizitlik, evrak rafı, telefonluk ve masa isimliğidir. Satın almadan önce ürün sayfasındaki set içeriği esas alınır; görseldeki her obje satışa dahil olmayabilir.</p>
<h2>Takım ile tek parça farkı</h2>
<p>Az eşyalı veya küçük masada tek parça yeterli olabilir. Bütün aksesuarların aynı renk ve kaplamada olmasını istiyorsanız takım daha tutarlıdır. Parça sayısı kaliteyi göstermez; ihtiyaç duyulan parçalar seçilir.</p>
<h2>Bu yazı ne işe yarar?</h2>
<p>Tanım ve parça okuması içindir. Satış listesi veya fiyat tablosu değildir. Seçim sırası için <a href="/blogs/news/sumen-takimi-secerken-nelere-dikkat-edilmeli">sümen takımı seçerken nelere dikkat edilmeli</a> yazısına bakın.</p>
<p>Koleksiyon: <a href="/collections/sumen-takimi">sümen takımı modelleri</a>. Merkez: <a href="/pages/sumen-takimi-rehberi">sümen takımı rehberi</a>. Soru listesi: <a href="/pages/sss#temel-bilgiler">SSS temel bilgiler</a>.</p>`,
  },
  aParca: {
    id: "gid://shopify/Article/635984707876",
    tags: ["parça sayısı", "9 parça", "12 parça", "sümen takımı"],
    body: `<p>Parça sayısı fiyat etiketi değil; masaya sığacak düzeni seçme aracıdır. Aynı sayıdaki iki setin içeriği farklı olabilir. Bardak altlığı veya kalem standı da sayıya dahil edilebilir. Bu yazı kategori satış metninin kopyası değildir.</p>
<h2>9 parça</h2>
<p>Daha dar masa ve temel düzen için uygundur. Ana sümenle birlikte kalemlik, notluk ve isimlik gibi sık kullanılan parçalar beklenir. Evrak rafı her 9 parçalı sette yoktur; yazılı set içeriğine bakın. Modeller: <a href="/collections/9-parca-sumen-takimi">9 parça sümen takımı</a>.</p>
<h2>10 parça</h2>
<p>Orta masa ve günlük ofis için dengeli bir basamaktır. Tekli evrak çözümü veya ek aksesuar 9 parçaya göre fark yaratabilir. Modeller: <a href="/collections/10-parca-sumen-takimi">10 parça sümen takımı</a>.</p>
<h2>11 parça</h2>
<p>İsimlikli, masa bayraklı veya daha geniş setlerde görülür. Yönetici masasında sık tercih edilir; küçük masada kalabalık durabilir. Modeller: <a href="/collections/11-parca-sumen-takimi">11 parça sümen takımı</a>.</p>
<h2>12 parça</h2>
<p>Full set ve masa bayraklı modeller bu grupta toplanır. Parçaların hepsini aynı anda masada tutmak zorunda değilsiniz. Modeller: <a href="/collections/12-parca-sumen-takimi">12 parça sümen takımı</a>.</p>
<h2>Nasıl karşılaştırılır?</h2>
<p>Sayıyı değil listeyi okuyun: ana sümen ölçüsü, evrak rafı, isimlik, bayrak. Masa ölçüsü için <a href="/blogs/news/masa-olcusune-gore-sumen-takimi-secimi">masa ölçüsüne göre sümen takımı seçimi</a> yazısına geçin.</p>`,
  },
  aBakim: {
    id: "gid://shopify/Article/635984740644",
    tags: ["deri sümen", "bakım", "temizlik"],
    body: `<p>Deri sümen takımı günlük temas görür. Bakım, ürünü yeni göstermek için değil; kaplama, kenar ve gövdeyi korumak içindir. Bu yazı deri kategori satış metninin tekrarı değildir.</p>
<h2>Günlük temizlik</h2>
<p>Tozu kuru ve yumuşak bezle alın. Gerekirse bez çok hafif nemlendirilir, ardından kurulanır. Ürünün üzerine doğrudan sprey sıkmayın. Sert sünger, çamaşır suyu ve alkol bazlı yoğun ürünler kaplamayı bozabilir.</p>
<h2>Sıvı ve leke</h2>
<p>Kahve veya su dökülürse emici, renksiz bezle bastırmadan alın. Kenara yaymayın. Mürekkep için rastgele çözücü kullanmayın; aseton ve kolonya rengi açabilir. Şüphede ürünün kaplama türünü yazıp <a href="/pages/bize-ulasin">iletişimden</a> sorun.</p>
<h2>Güneş ve ısı</h2>
<p>Uzun süre doğrudan güneş renk değişimine yol açabilir. Sıcak bardak ve ısıtıcı teması önlenir. Bardak altlığı bu yüzden sette yer alır.</p>
<h2>Hakiki deri ve suni deri</h2>
<p>Hakiki deride üreticinin önerdiği bakım ürünü varsa önce görünmeyen alanda deneyin. Suni deride genelde nemli bez yeter. İki malzeme aynı kimyasalla temizlenmez.</p>
<p>Deri setler: <a href="/collections/deri-sumen-takimlari">deri sümen takımları</a>. Kristal bakım ayrıdır: <a href="/collections/kristal-sumen-takimlari">kristal sümen takımları</a>. Soru listesi: <a href="/pages/sss#bakim-ve-temizlik">SSS bakım</a>.</p>`,
  },
  aOlcu: {
    id: "gid://shopify/Article/635984773412",
    tags: ["ölçü", "masa", "sümen takımı"],
    body: `<p>Sümen ölçüsü tek bir standarda bağlı değildir. Ürün sayfasındaki en ve boy, masanın kullanılabilir düz alanına göre okunur. Monitör ayağı, kablo kanalı ve kavisli kenar toplam masa ölçüsünden düşülür.</p>
<h2>Küçük masa</h2>
<p>Az parçalı set veya dar ana sümen daha kullanışlıdır. 9–10 parça bu masalarda sık dengelenir. Klavye ile masa kenarı arasında sümenin sıkışmaması gerekir. Koleksiyon: <a href="/collections/9-parca-sumen-takimi">9 parça</a> ve <a href="/collections/10-parca-sumen-takimi">10 parça sümen takımı</a>.</p>
<h2>Orta ve yönetici masası</h2>
<p>Ana sümen oturma eksenine konur. İsimlik karşıya bakar. 11–12 parça ve full set ancak boşluk kalıyorsa anlam taşır. Koleksiyon: <a href="/collections/11-parca-sumen-takimi">11 parça</a>, <a href="/collections/12-parca-sumen-takimi">12 parça</a>.</p>
<h2>Pratik kontrol</h2>
<p>Ürün ölçüsünü masada bantla işaretlemek, fotoğrafa güvenmekten daha nettir. Laptop ve mouse kullanımı ürün açıklamasındaki yüzeyle birlikte düşünülür.</p>
<p>Karşılaştırma: <a href="/blogs/news/9-10-11-ve-12-parca-sumen-takimi-karsilastirmasi">parça sayısı yazısı</a>. Rehber: <a href="/pages/sumen-takimi-rehberi">sümen takımı rehberi</a>.</p>`,
  },
  aYonetici: {
    id: "gid://shopify/Article/635984806180",
    tags: ["yönetici masası", "makam", "sümen takımı"],
    body: `<p>Yönetici masasında sümen takımı hem düzen hem temsil taşır. Amaç masayı doldurmak değil; isimlik, evrak ve yazı alanını aynı dilde tutmaktır. Bu yazı lüks kategori metninin kopyası değildir.</p>
<h2>Ne öne çıkar?</h2>
<p>İsimlik ziyaretçiye dönük olmalı. Evrak rafı iş akışına göre erişilebilir durmalı. Ana sümen oturma merkezine konur. Çok sayıda küçük aksesuar profesyonel görünümü zayıflatır.</p>
<h2>Malzeme ve renk</h2>
<p>Koyu ahşap mobilyada deri-kahve veya siyah setler; açık ve modern odada gri, lacivert veya krem daha sakin durur. Kristal set temsil odaklı masalarda tercih edilebilir. Karşılaştırma: <a href="/blogs/news/deri-ve-kristal-sumen-takimi-arasindaki-farklar">deri ve kristal farkları</a>.</p>
<h2>Parça</h2>
<p>Geniş masada 11–12 parça veya full set anlam taşır. Dar yönetici masasında 10 parça yeterli olabilir. Koleksiyonlar: <a href="/collections/luks-sumen-takimlari">lüks sümen takımları</a>, <a href="/collections/deri-sumen-takimlari">deri sümen takımları</a>.</p>
<p>Hediye veya unvan yazımı için <a href="/blogs/news/kisiye-ozel-masa-isimligi-siparis-rehberi">isimlik sipariş rehberi</a> ve <a href="/pages/bize-ulasin">iletişim</a>.</p>`,
  },
  aRenk: {
    id: "gid://shopify/Article/635984838948",
    tags: ["renk", "siyah sümen", "deri sümen"],
    body: `<p>Renk, sümen takımında en görünür karardır. Stok listesi değil; masa, metal aksesuar ve ofis ışığıyla uyum notudur. GSC’de geçen siyah sümen takımı araması da bu yüzden ayrı ele alınır.</p>
<h2>Siyah</h2>
<p>Açık masada kontrast, koyu masada bütünleşik görünüm verir. Toz ve açık iz daha görünür olabilir. Sade ofis ve modern makamda sık kullanılır.</p>
<h2>Kahve</h2>
<p>Ahşap masa ile sıcak geçiş sağlar. Klasik yönetici odasında doğal durur. Tonu masa ile birebir aynı olmak zorunda değildir.</p>
<h2>Taba</h2>
<p>Kahveden açık, siyahtan yumuşak bir ara tondur. Açık ahşap ve sıcak aydınlatmayla uyumludur.</p>
<h2>Bordo</h2>
<p>Koyu ahşap ve makam odasında vurgu yapar. Gold aksesuarla geleneksel, gümüşle daha dengeli okunur. Büyük yüzeyde diğer parçaların sade tutulması yararlıdır.</p>
<h2>Aksesuar rengi</h2>
<p>Gold sıcak ahşap ve kahve-bordo ile; gümüş veya krom gri, siyah ve lacivert ile kolay eşleşir. Kapı kolu ve lamba rengi karar vermeyi kolaylaştırır.</p>
<p>Deri renk seçenekleri: <a href="/collections/deri-sumen-takimlari">deri sümen takımları</a>. Seçim sırası: <a href="/blogs/news/sumen-takimi-secerken-nelere-dikkat-edilmeli">seçim yazısı</a>.</p>`,
  },
  aLogo: {
    id: "gid://shopify/Article/635984871716",
    tags: ["logo", "kurumsal", "kişiselleştirme"],
    body: `<p>Kurumsal logolu sümen takımı, standart setin üzerine isim, unvan veya logo uygulandığı sipariştir. Her model her uygulamayı taşımaz. Bu yazı süreç notudur; fiyat veya süre taahhüdü değildir.</p>
<h2>Siparişten önce</h2>
<p>Model, renk, adet, logo dosyası (mümkünse vektör), uygulama yeri ve isim-unvan listesi tek dosyada toplanır. Ekran rengi fiziksel kaplamayı garanti etmez; numune veya kartela istenebilir.</p>
<h2>Onay</h2>
<p>Yazım, logo ölçüsü ve yerleşim üretimden önce yazılı veya görsel onaylanır. Telefonda söylenen unvan tek başına yeterli değildir.</p>
<h2>Üretim ve teslim</h2>
<p>Hazır ürün ile logolu üretim aynı sürede bitmez. Güncel süre ürün sayfası veya sipariş onayındadır. Kargo ve iade, kişiselleştirilmiş üründe standart üründen farklı okunabilir: <a href="/pages/teslimat-ve-iade-sozlesmesi">teslimat ve iade</a>, <a href="/pages/mesafeli-satis-sozlesmesi">mesafeli satış</a>.</p>
<p>Talebi <a href="/pages/bize-ulasin">iletişim</a> sayfasından iletin. İsimlik ayrıntısı: <a href="/blogs/news/kisiye-ozel-masa-isimligi-siparis-rehberi">isimlik sipariş rehberi</a>. Modeller: <a href="/collections/sumen-takimi">sümen takımları</a>.</p>`,
  },
  aHediye: {
    id: "gid://shopify/Article/635984904484",
    tags: ["hediye", "terfi", "sümen takımı"],
    body: `<p>Sümen takımı terfi, göreve başlama ve kurumsal takdimde kalıcı bir masa hediyesidir. Güvenli seçim; masa ölçüsü, sade renk ve doğru unvandır. Unvan kesinleşmeden isimlik üretimine başlanmamalıdır.</p>
<h2>Ne sorulur?</h2>
<p>Masa genişliği, ofis mobilya rengi, isim-unvan ve hediye notu. Stil bilinmiyorsa siyah, kahve, gri veya lacivert daha az risklidir.</p>
<h2>Kim için?</h2>
<p>Yönetici ve avukat masasında evrak rafı ve isimlik işlevlidir. Öğretmen veya ev-ofiste az parçalı set daha kullanışlıdır. Kamu ve belediye hediyelerinde logo ve resmi unvan yazımı kontrol edilir.</p>
<h2>Paket</h2>
<p>Büyük sette taşıma güvenliği süs ambalajından önce gelir. Fatura belgesinin pakete konup konmayacağı önceden belirtilir.</p>
<p>Modeller: <a href="/collections/sumen-takimi">sümen takımları</a>, <a href="/collections/masa-ustu-isimlikler">masaüstü isimlikler</a>. Süreç: <a href="/blogs/news/kisiye-ozel-masa-isimligi-siparis-rehberi">isimlik rehberi</a>, <a href="/pages/bize-ulasin">iletişim</a>.</p>`,
  },
};

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

let gql = "mutation ExpandNewArticles {\n";
for (const [alias, a] of Object.entries(articles)) {
  const tags = a.tags.map((t) => `"${t}"`).join(", ");
  gql += `  ${alias}: articleUpdate(id: "${a.id}", article: { tags: [${tags}], body: "${esc(a.body)}" }) { article { handle } userErrors { field message } }\n`;
}
gql += "}\n";
writeFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/graphql/mutations-expand-articles.graphql", gql);
console.log("bytes", Buffer.byteLength(gql), "articles", Object.keys(articles).length);
