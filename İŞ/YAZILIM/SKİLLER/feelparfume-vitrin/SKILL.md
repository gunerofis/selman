---
name: feelparfume-vitrin
description: feelparfume vitrin rengi, suskun metin kuralı ve sade yönetim paneli. Yalnız kullanıcı bu görevde feelparfume veya parfum adını açıkça yazdıysa kullan. Adı yoksa klasöre girme. Shopify ve başka markalarda kullanma.
---

# feelparfume vitrin

Çok markalı parfüm vitrini. Şişe fotoğrafı rengi taşır. Arayüz susar.

## Renk

Fildişi `#F7F2EA`, espresso `#231E1A`, tek vurgu reçine `#8A4B32`. Üç ton: zemin, mürekkep, vurgu. Altın varak ve siyah-altın lüks klişesi yok; koyu sinema tek koku evi içindir. Başlık Fraunces, gövde Manrope. Çizgi düz.

Köşe yumuşak: kart, düğme, alan, hacim seçici, filtre, form paneli ve görsel çerçeve token yarıçapını kullanır. Çerçeveli kutu `border` ile 16px alır. Üst menü açık zeminde, tek satırda durur; açılır panel tıklanan sözcüğün altından iner. Mağaza parfüm / set / rehber, Yardım sipariş / yazışma / bilgi diye ayrılır. Ürün yolunda kırıntı bir kez durur. Telefonda şişe kısa kalır; hacim, alttaki satın alma çubuğunun üstünde görünür. Çerez çubuğu düz kalır. Yapışkan alt çubuk, çubuğun ölçülen yüksekliği kadar yukarıda durur. Kartta karşılaştırma bir simgedir. Kategori, nota ve marka dizinleri şişe görseli, ad ve sayıdır. Ana sayfanın ilk ekranı solda öne çıkan şişe, sağda dört şişedir; yükseklik başlık ve çerez payını düşer. Hemen altında bütün parfümler kart olarak durur. Katalog süzgeci masaüstünde yapışır. Ürün sayfasında satın alma bloğu yapışır ve altında üç benzer şişe durur; koku piramidi, özellik ve içerik galerinin altında durur. Kategori, marka ve nota sayfası başlığın altında tam genişlikte şişe şeridi açar. Marka dizini her harfin altında o markanın ürünlerini dizer. Yardım ve hukuki sayfalar metnin yanında şişe rafı taşır. Koku testinde seçenek bir şişedir. Üründeki koku ailesi küçük karttır. Boş sepet, favori ve karşılaştırma kategori görsellerine çıkar.

Karar kaynağı: 2026 parfüm vitrinleri (Byredo, Le Labo, Diptyque çizgisi) fotoğrafı öne alır, paleti sıcak nötr artı tek aksanda tutar. Anlatı hero’su bu markanın metin kuralıyla çelişir.

Tokenlar `src/styles.css` içindedir. Yeni renk için token değiştir; sayfaya hex yazma. Google arama önizlemesindeki mavi ve yeşil, Google’ın rengidir.

## Metin

Vitrinde anlatım, uyarı, ipucu, hatırlatma ve “nasıl çalışır” kutusu yok.

Kalır:

- Alan adı ve zorunlu / isteğe bağlı işareti
- Doğrulama hatası
- Fiyat, KDV, hacim, stok, nota, INCI, kozmetik güvenlik uyarısı
- Yasal sayfalar, çerez onayı, KVKK ve mesafeli satış onay kutuları
- Fiyatı olmayan üründe teklif gerçeği
- Havale seçilince IBAN

Form `hint` gösterilmez. Boş durumda yalnız başlık ve eylem kalır.

## Yönetim

`/yonetim` sade operasyon: genel bakış, sipariş, ürün, hareket. Katalog `/katalog-yonetimi`, site ayarı `/admin`. Panelde kapsam yazısı, giriş paragrafı ve yol tarifi yok. Etiket, sayı ve işlem yeter. Yetki sunucuda kalır; menüyü gizlemek güvenlik değildir.

## Doğrulama

Renk ve metin değişince ana sayfa, ürün, sepet ve yönetim girişini masaüstü ve mobilde aç. Kontrast: espresso ve reçine, fildişi üstünde gövde metni için en az 4.5:1.
