import type { ProductCategory } from "./products";

type CategoryGuide = {
  title: string;
  text: string;
};

export type CategoryPage = {
  id: ProductCategory;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  guides: CategoryGuide[];
};

export const categoryPages: CategoryPage[] = [
  {
    id: "outdoor",
    slug: "dis-mekan",
    name: "Dış Mekân Oyuncakları",
    shortDescription: "Açık alanda hareket ve oyun için paketli ürünler.",
    description: "Su tabancası, köpük, ok-yay ve benzeri hareketli ürünlerden oluşan toptan dış mekân oyuncakları.",
    guides: [
      { title: "Toptan dış mekân oyuncağı seçimi", text: "Dış mekân grubunda ürünün yalnızca görsel çekiciliğine değil; yaş sınıfına, çalışma biçimine, parça dayanımına ve paket içeriğine birlikte bakılmalıdır. Su, köpük, fırlatma veya üfleme mekanizması bulunan ürünlerde kullanım uyarıları ve uygunluk belgeleri siparişten önce teyit edilmelidir. Mağaza için karışık renkli paketler rafı hareketlendirirken, aynı ürün kodunun koli düzenini korumak stok takibini kolaylaştırır." },
      { title: "Raf ve sezon planı", text: "Su tabancası, su balonu ve köpük gibi ürünler sıcak havalarda daha görünür bir raf konumu ister. Ok-yay, pervane ve uçan ürünler ise park, bahçe ve etkinlik temasıyla birlikte sergilenebilir. Kasa önü yerine müşterinin ürünü bütünüyle görebileceği geniş bir askı veya sepet alanı tercih edin. Dönemsel talepte tek modelden aşırı stok yapmak yerine farklı fiyat ve paket boylarını birlikte değerlendirin." },
      { title: "Siparişten önce kontrol", text: "Ürün ölçüsü, koli ölçüsü, koli ağırlığı, menşe, barkod, yaş grubu ve CE/uygunluk beyanı teknik föyde yazılı olmalıdır. Hareketli veya fırlatmalı ürünlerde kırık parça, sivri kenar ve mekanizma tutarlılığı numune üzerinden kontrol edilir. BÜCÜRÜKTOYS teklif listesinde ürün kodu ve paket adedini belirttikten sonra güncel stok, teslim planı ve belge durumu sipariş onayından önce ayrıca doğrulanır." },
    ],
  },
  {
    id: "fun",
    slug: "saka-eglence",
    name: "Şaka ve Eğlence Oyuncakları",
    shortDescription: "Hızlı ilgi gören eğlenceli tezgâh ürünleri.",
    description: "Korna, büyüteç, kapsül ve şaka ürünleri gibi dikkat çeken toptan eğlence oyuncakları.",
    guides: [
      { title: "Hızlı dönen eğlence ürünleri", text: "Şaka ve eğlence oyuncakları çoğunlukla kısa sürede anlaşılan bir hareket, ses veya sürpriz etkisi taşır. Bu nedenle alıcı için ilk kontrol; ürünün ne yaptığı, pakette kaç adet bulunduğu ve mekanizmanın tekrarlı kullanımda tutarlı çalışıp çalışmadığıdır. Korna, topaç, büyüteç, çek-bırak araç ve benzeri küçük ürünler aynı fiyat bandında karışık bir tezgâh seçkisi oluşturmak için birlikte planlanabilir." },
      { title: "Mağazada sunum", text: "Bu kategori kasa önü, karşı raf ve kampanya sepeti gibi yüksek temaslı alanlarda daha iyi anlatılır. Ürünün hareketini gösteren açık bir numune bulundurmak, kapalı pakette anlaşılmayan mekanizmayı görünür kılar. Sesli ürünlerde mağaza ortamını rahatsız etmeyecek bir deneme düzeni kurulmalı; kapsül veya benzeri sarfla çalışan modellerde uyumlu sarf türü, yaş uyarısı ve ses seviyesi müşteriye açıkça belirtilmelidir." },
      { title: "Güvenlik ve koli doğrulaması", text: "Oyuncak tabanca, kapsül, lazer veya göze yöneltilebilen ışıklı ürünler sıradan şaka ürünü gibi değerlendirilmemelidir. Yaş sınıfı, lazer sınıfı, çıkış gücü, ses seviyesi ve uygunluk belgeleri yazılı olarak doğrulanmadan satışa alınmamalıdır. Ürün ölçüsü, koli desisi, barkod, menşe ve paket adedi de teklif aşamasında teknik föyle eşleştirilir; doğrulanmayan bilgiler teyit edilene kadar kamuya açık katalogda gösterilmez." },
    ],
  },
  {
    id: "skill",
    slug: "zeka-beceri",
    name: "Zekâ ve Beceri Oyuncakları",
    shortDescription: "El becerisi ve problem çözme odaklı ürünler.",
    description: "Kart setleri, labirentler ve şekillendirilebilir modellerden oluşan toptan zekâ ve beceri oyuncakları.",
    guides: [
      { title: "Zekâ oyuncağında doğru yaş eşleşmesi", text: "Zekâ ve beceri grubunda zorluk seviyesi kadar parça boyutu ve kullanım biçimi de önemlidir. Küp, kart, labirent ve şekillendirilebilir modeller için önerilen yaş grubu; küçük parça riski ve yönerge diliyle birlikte değerlendirilmelidir. Alıcı, ürünün tek kişilik mi grup oyunu mu olduğunu, kutu içinde kaç parça bulunduğunu ve yeniden kurulabilir bir oyun döngüsü sunup sunmadığını teknik açıklamadan görebilmelidir." },
      { title: "Raf anlatımı ve tekrar satış", text: "Bu ürünler yalnızca isimle değil, müşteriye sağladığı deneyimle satılır. Raf etiketinde ‘eşleştirme’, ‘hamle planlama’, ‘el-göz koordinasyonu’ veya ‘şekil oluşturma’ gibi gerçek kullanım davranışını kısa biçimde anlatın. Açık numune, çözüm kartı ya da kutu arkasındaki basit örnek müşterinin ürünü hızla anlamasına yardımcı olur. Farklı zorluk ve fiyat basamaklarını yan yana sunmak, tek seferlik seçim yerine kategori içinde karşılaştırma yaratır." },
      { title: "Belge, içerik ve lisans kontrolü", text: "Kart setlerinde görsel ve marka kullanım hakkı, küp ve mekanik ürünlerde parça dayanımı, tüm çocuk ürünlerinde yaş ve uygunluk beyanı siparişten önce doğrulanmalıdır. Ürün ölçüsü, koli ölçüsü, koli ağırlığı, barkod ve menşe bilgisi mağazanın stok ve sevkiyat planını doğrudan etkiler. BÜCÜRÜKTOYS teklifinde ürün kodu, paket adedi ve varsa seri tercihi belirtilerek kesin içerik ve belge seti yazılı olarak istenir." },
    ],
  },
  {
    id: "sensory",
    slug: "stres-duyusal",
    name: "Stres ve Duyusal Oyuncaklar",
    shortDescription: "Sıkma, bükme ve dokunma deneyimi sunan ürünler.",
    description: "Stres topları, renkli yaylar ve sıkıştırılabilir modellerden oluşan toptan duyusal oyuncaklar.",
    guides: [
      { title: "Duyusal ürün nasıl seçilir?", text: "Stres ve duyusal oyuncaklarda temel değer; sıkma, bükme, çekme veya tekrar eden hareketin güvenli ve tutarlı olmasıdır. Ürünün dış malzemesi, dolgu türü, koku bilgisi ve yüzey dayanımı yaş grubuyla birlikte incelenmelidir. Stres topu, yay, squishy ve benzeri ürünlerde ilk numune; sızıntı, yırtılma, renk transferi, keskin çapak ve küçük parça oluşumu açısından tekrarlı kullanım testine alınmalıdır." },
      { title: "Karışık paket ve renk planı", text: "Duyusal kategoride renk ve karakter çeşitliliği satın alma kararını güçlendirir; ancak karışık paket dağılımı belirsiz bırakılmamalıdır. Alıcı, bir pakette hangi renk veya model oranlarının bulunduğunu ve yeniden siparişte aynı dağılımın korunup korunamayacağını sormalıdır. Küçük ürünler kasa önü veya deneme alanında, daha büyük sıkılabilir ürünler ise müşterinin formu görebileceği açık raflarda sergilenebilir." },
      { title: "Teknik föyde bulunması gerekenler", text: "Yaş grubu, ürün ölçüsü, net ağırlık, koli ölçüsü ve ağırlığı, menşe, barkod ve CE/uygunluk beyanı her ürün için ayrı alanlarda tutulmalıdır. Sıvı, jel veya boncuk içeren modellerde içerik ve sızıntı riski ayrıca açıklanır. Sipariş onayında paket içeriği, güncel stok ve güvenlik belgesi ürün koduyla eşleştirilir; henüz doğrulanmayan teknik değerler tahmin edilmez ve kamuya açık katalogda gizlenir." },
    ],
  },
  {
    id: "stationery",
    slug: "kirtasiye-sticker",
    name: "Kırtasiye ve Sticker Ürünleri",
    shortDescription: "Oyuncak niteliği taşıyan küçük kırtasiye çeşitleri.",
    description: "Defter, sticker, silgi ve çizim setlerinden oluşan paketli toptan kırtasiye ürünleri.",
    guides: [
      { title: "Kırtasiye seçkisinde ürün içeriği", text: "Mini defter, sticker, silgi, mühür ve etkinlik setlerinde ilk bakılan alan paket içeriğidir. Sayfa adedi, parça sayısı, desen dağılımı, kalem veya yardımcı aparat bulunup bulunmadığı açıkça yazılmalıdır. Çocuk kullanımına sunulan kırtasiye ürünlerinde malzeme, boya ve küçük parça durumu ürün sınıfına göre değerlendirilir; yalnızca ambalaj görseline bakarak yaş grubu veya uygunluk varsayımı yapılmaz." },
      { title: "Raf, seri ve sezon yönetimi", text: "Kırtasiye ürünleri tek modelden çok seri mantığıyla çalışır. Karışık kapak, desen veya karakter paketlerinde koli içi dağılımı siparişten önce istemek, rafın tek tipe yığılmasını önler. Okul dönemi, hediye paketi ve kasa önü için farklı fiyat basamakları yan yana planlanabilir. Küçük ürünlerde ürün kodu ve barkodun ambalajla eşleşmesi, hızlı stok sayımı ve tekrar sipariş için özellikle önemlidir." },
      { title: "Lisans ve teknik doğrulama", text: "Karakter, logo veya tanınabilir sanat eseri taşıyan sticker, kart ve defterlerde ticari satış yetkisi ayrıca doğrulanmalıdır. Jenerik ürün adı kullanmak, görseldeki lisans sorumluluğunu ortadan kaldırmaz. Ürün ölçüsü, koli ölçüsü, koli ağırlığı, menşe, barkod ve uygulanacak uygunluk beyanı teknik föyde tutulur. Belge veya lisans kaydı sağlanmayan ürünler seri satışa alınmadan önce tedarikçiyle yazılı olarak netleştirilmelidir." },
    ],
  },
  {
    id: "accessory",
    slug: "anahtarlik-aksesuar",
    name: "Anahtarlık ve Oyuncak Aksesuarları",
    shortDescription: "Kasa önü ve küçük hediye satışına uygun çeşitler.",
    description: "Işıklı anahtarlık, bileklik, toka ve küçük aksesuar modellerinden oluşan toptan ürün grubu.",
    guides: [
      { title: "Kasa önü aksesuarı seçimi", text: "Anahtarlık, toka, bileklik ve küçük ışıklı aksesuarlar düşük yer kaplayan, kolay karşılaştırılan ürünlerdir. Alıcı için bağlantı halkasının dayanımı, pil veya ışık mekanizması, parça sayısı ve karışık model dağılımı ürünün görünümünden daha önemlidir. Numunede halka çekme testi, kapak tutuşu, pil yuvası ve keskin kenar kontrolü yapılmalı; küçük parçalı modellerin yaş grubu ambalajda görünür olmalıdır." },
      { title: "Paketleme ve vitrin", text: "Bu kategori kartela, küçük kutu veya şeffaf poşetle düzenli sunulduğunda daha profesyonel görünür. Aynı askıda çok farklı fiyat ve form kullanmak yerine ışıklı, sesli, yumuşak veya kişiselleştirilebilir ürünleri küçük gruplar hâlinde ayırın. Karışık renkli kolilerde her modelin yaklaşık dağılımını isteyin. Ürün kodunun ve barkodun ambalaj üzerinde okunabilir olması kasa işlemini ve yeniden siparişi kolaylaştırır." },
      { title: "Güvenlik ve hak sahipliği", text: "Işıklı veya lazerli aksesuarlarda pil güvenliği, lazer sınıfı ve yaş uyarıları; karakter maskesi, anahtarlık ve kartlı ürünlerde ise ticari lisans ayrı ayrı doğrulanmalıdır. Ürün ölçüsü, koli ölçüsü, desi, koli ağırlığı, menşe ve CE/uygunluk beyanı teknik föyde bulunur. Doğrulama yapılmadan yalnızca görsele dayanarak satışa çıkmak alıcı ve tedarikçi için güvenlik, iade ve hak sahipliği riski oluşturur." },
    ],
  },
];

export function categoryBySlug(slug: string) {
  return categoryPages.find((category) => category.slug === slug);
}

export function categoryById(id: ProductCategory) {
  return categoryPages.find((category) => category.id === id);
}
