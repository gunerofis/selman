# Site ve pazarlama

## Site
- Adres: https://www.dokuduvar.com (29.10.2026 yayında).
- Barındırma: ChatGPT Sites, bu hesapta `appgprj_6af0e6d445688191bf2e8225482133ea`; yayın https://doku-duvar.selmankorkmaz.chatgpt.site (09.11.2026).
- Müşteri hesabı ve dosya API’si mevcut Cloudflare Pages `doku-9e5.pages.dev`, D1 `doku-db` ve KV üzerinde korunur; Sites aynı alan adından bu hizmete bağlanır.
- DNS Vercel’de; `www` CNAME `custom-domains.chatgpt.site.`. `doku-yonlendirme` kök alanı `www`’ye yönlendirir. Google Workspace MX/SPF/DKIM ve doğrulama kayıtları korunur.
- Kaynak: `DOKU\site` (tek çalışan kopya). Eski kopyalar `DOKU\Arşiv`.
- Yayın yalnız Faris onayıyla.
- Site katalog değil, müşteri merkezi: gör → tasarımı seç → teklif iste.

## İçerik kuralları
- 09.11.2026 kullanıcının “iyi olanların hepsini ekle” talebiyle 07 Kontrol Edilecek klasöründeki seçim sayıyla sınırlanmadı. Önceki altı görsele 40 görsel daha eklendi: klasörden toplam 46 görsel / 44 ürün; tam duvar, pano ve yedi yapay portre konsepti. Ahtapot ve Athena sunumları aynı ürün altında toplandı; dosya ve görsel ilişkileri Görsel İndeksi.csv ile katalog provenance alanında. Kaynaklar yerinde korundu; kaplama kodu atanmadı.
- 09.11.2026 kullanıcı talebiyle altı yerel tam duvar konsepti seçildi: Ritim, Dalga, Çokgen Mozaik, S Akışı, Modüler Duvar, Ağaçlı Nehir. Bu seçimde kumaş kodu atanmadı; malzeme ve renk numuneyle belirlenecek.
- Yalnız kumaş kodlu tasarımlar görünür; diğerleri gizli, silinmez (30.10: 513 tasarım, 561 grup gizlendi). Gizlenenler bu kurallarla kumaş kodlu varyant olarak yeniden üretilecek.
- Kategoriler elle yapılmaz: görünür tasarımların anahtar kelimeleri her derlemede sayılır; en sık 6–8 kelime menüde + "Tümü"; bütün kelimeler "En çok arananlar" alanında.
- Elle yapılmış `/alan/`, `/mekan/`, `/tema/` sayfaları menü ve sitemap'ten kalktı; eski bağlantılar galeriye gider; veri silinmez.
- Anahtar kelime tek sözcük; yalnız görselde görüleni anlatır; duvarın rengi yazılır, mobilyanın değil; her şeye uyan etiket yok.
- Aynı motifin renk/mekân türevleri aynı ürün; farklı motif ayrı ürün.
- Bütün tasarım görselleri konsepttir; konsept uyarısı alt bilgi, tasarım sayfası ve SSS'de.
- Gerçek iş olarak yalnız izinli "Fotoğraftan duvara" örneği.
- Kamuya açık metinde MDF, CNC, XPE, atölye, tedarikçi yok.
- Fiyat, teslim süresi, garanti süresi, puan, referans, sertifika kanıtsız söylenmez. "Eşsiz", sahte indirim yok.
- `tools/check.mjs` tedarikçi adını bulursa yayını durdurur.
- Site m² fiyat hesaplayıcısı alacak.
- Site tasarımı Faris'in GPT'sinde parça parça yapılıyor.

## Görünüm
- Profesyonel pastel: zemin `#f6f7f4`, adaçayı `#dbe6df`, vurgu `#c3d7cf`, sis mavisi `#dfe9ef`, açık taş `#eee8e1`, başlık `#344b4a`, metin `#556967`.
- Yazı: başlık Manrope, metin DM Sans. Bordo ve Cormorant yok.
- Düğmeler küçük, yazılar kısa. Başlık + tek cümle.

## Shopier
Mağaza `dokupanel`. Yalnız Türkiye içi kargoya uygun 70×100 kişisel tablolar. Logo, banner, üretim süresi, teslimat/iade metni, ürün görselleri, fiyat bekliyor. Banka/kimlik bilgisi değiştirilmez; hiçbir şey izinsiz yayımlanmaz.

## Sosyal medya
- Instagram `doku.wall`: kişisel, kargoya uygun ürünler; viral Reels. Reels'i Faris çeker; çeken kişi belli değil.
- B2B: LinkedIn şirket sayfası + sitenin mimarlar sayfası.
- Claude'un Instagram'ı yönetmesi (Meta API / bağlayıcı) düşünülüyor.
- Paylaşım rutini planı yapılacak.

## Mimar e-postası
- İlk kitle: iç mimar, otel, kafe, ofis; sonra yatak, çocuk, çalışma odası.
- Liste: İstanbul'da 20–30 iç mimarlık ofisi (kayıtlı 27 ofis, genel adresler).
- E-posta kısa; MDF/teknik yok; kaplama dokusu odaklı. Ekte kartela + kartela kumaşlarıyla hazırlanmış bir görsel. Kapanış: istediği kumaşı/dokuyu seçebilir.
- Birden çok şablon (alıcı türü/amaç); takip dizisi değil.
- Instagram dolmadan e-postaya konmaz.
- Gönderim Faris onayıyla.

## E-posta görselleri
- 1200×630 · sRGB JPG · ≤150 KB · duvar ≥ %60 · sağ alt sade · tek sahne · yazı/logo yok.
- 5 grup × 3 aşama: konut, otel, restoran, ofis, çocuk × tanışma (bitmiş mekân), görüşme (doku ve kenar yakın planı), ortaklık (süreç + uygulanmış duvar).
- Eski 15 görselin istemleri geçersiz derz tarifi içerir ([Arşiv](<Arşiv/Geçersiz Kurallar.md>)); yeniden üretimde [08](<08 Görsel Üretim Akışı.md>) kullanılır.

## Google
Workspace (info@dokuduvar.com), İşletme Profili, Search Console, Analytics kurulu. Merchant Center = Shopier ürünleri.

## Kullanıcı özeti

DOKU vitrini bu hesaptaki ChatGPT Sites projesinden alan adıyla yayında. 07 Kontrol Edilecek klasöründen sayıyla sınırlamadan toplam 46 uygun görsel seçildi; katalogda 44 ürün altında toplandı. Nar Bahçesi ve Sarmal ana sayfada öne çıkarıldı. Alan adı Vercel DNS, e-posta Google Workspace, müşteri hesabı/dosya hizmeti Cloudflare üzerinde korunur. Satıcı adresi ve etiket yönetimi şifresi eksik.
