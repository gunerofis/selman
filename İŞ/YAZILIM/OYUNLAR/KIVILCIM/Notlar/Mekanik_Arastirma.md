# Mekanik araştırması

Tarih: 11.11.2026 · Durum: Araştırma tamamlandı; uygulama yapılmadı.
Ana iş: `01a5f472d0a047b1a80f489543df9ca1` · Ana iş açık kalır.

## Mevcut kayıt ve kapsam

İlgili tasarım kaydı: [Oyun_Tasarimi_ve_Denge.md](Oyun_Tasarimi_ve_Denge.md). Ayrı web araştırması kaydı bulunmadığı için bu dosya açıldı. [Hub_Buton_Haritasi.md](Hub_Buton_Haritasi.md) yalnız okundu. Onaylı yatay telefon düzeni, mevcut girişler ve hub'a hedef paneli eklememe kararı korunur.

Kod salt okunur incelendi. Aşağıdaki `kod/` yolları Oyun klasörüne göredir. Bunlar kod bulgularıdır; bu çalışmada oynanış veya fiziksel telefon testi yapılmadı.

| Kaynak | Doğrulanan mevcut durum |
|---|---|
| `kod/world.js` — `regions`, `route`, `bossLadders`, `huntingGrounds` | 17 bölge, 51 Sefer durağı, 85 bölge bossu ve 17 Av karşılaşması tanımlı. Dört taktik: Öfke, Taş zırh, Onarım, Çifte vuruş. |
| `kod/engine.js` — `advance`, `settle`, `upgradeOffer` | Otomatik vuruş, hedef seçimi, zamanlı savunma ve 30 saniyelik sınır var. Av hedef başına ganimet verir. Kılıç +1 ve +2 yükseltmeleri mevcut. |
| `kod/systems.js` — `arenaPage`, `eventsList`, `systemAction` | Arena yerel antrenman olarak etiketli. Günlük etkinlikler, bir kez ödül alma, pet eğitimi ve sandık açma işlemleri var. |
| `kod/minigames.js` — `dealRound`, `endRound` | Dokuz mini oyun, günde üç ödüllü tur ve ödülsüz alıştırma var. Ana gelişim araştırması bu tur gelirine dayandırılmadı. |

Tasarım belgesi ilk üç durağı ve sonraki genişleme planını anlatıyor; kod bu sınırın ötesine geçmiş. Aşağıdaki maddeler mevcut sistemlere uygulanabilecek önerilerdir; yeni denge veya üretim kararı değildir.

## En çok 10 uygulanabilir bulgu

“Doğrulanmış örnek” yayıncının kaynağındaki bilgidir. Son sütunun tamamı KIVILCIM için öneridir; henüz uygulandığı iddia edilmez.

| # / Ekran | Doğrulanmış örnek | Oyuncu eylemi → geri bildirim → ödül / sonuç önerisi |
|---|---|---|
| 1 · Hub / Bildirimler | BDM kampında kaynaklar ve toplama, inşa, üretim işlemleri ayrı girişlerden yönetilir. [K1] | Mevcut bina veya düğmeye dokun → ilgili mekân seçili işlemle açılsın; hazır işlem işareti yalnız gerçekten yapılabiliyorsa görünsün → mevcut ödül/işleme ulaş. Hub'a yeni panel ekleme. |
| 2 · Sefer / Ekipman | BDM sezon rehberi kuşanma, yükseltme ve Boss Rush'ı sıralı görevler ve ilgili ekrana geçişlerle öğretir. [K2] | Durağı seç, kazan, kılıcı kuşan → ilk geçiş/tekrar ayrımı ve saldırı değişimi aynı akışta görülsün → mevcut ilk ödül ve sıradaki durak. İlk üç durakta tek yeni kararı öne çıkar. |
| 3 · Boss | BDM Boss Rush hikâyede karşılaşılan bossları yeniden oynatır; girişten önce zorluk ve ödül görünür. Boss Blitz'te saldırı örüntüsü ve zayıflık değerlendirilir. [K3, K4] | Açık bossu seç, ağır darbeyi savun → mevcut taktiğin görsel karşılığı ve savunma sonucu seçilebilsin → mevcut ilk günlük 3 parça veya tekrar 10 altın. Beş bossu yalnız ad/can farkıyla sunmak yerine mevcut taktik farkını okut. |
| 4 · Av | BDM Black Spirit Mode'da bölge seçilir; ödül, biriken süre ve tüketilebilir Adventuring Fervor ile sınırlıdır. [K5] | Bölgeyi seç, 2 enerjiyle ava gir → 0/3–3/3 hedef ve harcanan enerji görülsün → mevcut hedef başına 5 altın + 1 cevher; tam avda ek cevher. Sonuçtaki Demirci geçişi malzemenin kullanımını bağlasın. Çevrimdışı av ekleme. |
| 5 · Arena | BDM'nin resmî turnuva rehberi Spar ve Ascent modlarını ayırır; Spar 1v1'dir ve oyuncu güçleri ayarlanır. [K6] | Yerel rakibi seç, hedef/savunma kararlarını kullan → antrenman etiketi ve süre sonunda iki tarafın kalan can yüzdesi görülsün → mevcut ilk üç günlük zaferde 2'şer jeton. Yerel puanı gerçek oyuncu sırası gibi sunma; güç eşitleme bu araştırmayla uygulanmaz. |
| 6 · Ekipman / Demirci | BDM geliştirme rehberi malzeme tüketimini ve seçili eşya bilgisini açıklar; sezon rehberinde garantili başlangıç geliştirmesi vardır. [K2, K7] | Kılıcı seç, bedeli gör, yükselt → saldırı önce/sonra ve düşen bakiye birlikte güncellensin → mevcut +1/+2 kazanımı. İlk kılıç +1: 60 altın; +2: 100 altın + 4 cevher. Başarı oranı veya kayıp sistemi ekleme. |
| 7 · Petler / Savaş | BDM petleri stat ve yardımcı bonus sağlar; yetenekleri eğitimle gelişir. [K8] | Akboynuz'u seç ve eğit → eğitim başına mevcut 5 canlık iyileşme açıkça görülsün; savaşta tetiklenince kısa iyileşme tepkisi oluşsun → sağ kalan kahraman %40 cana indiğinde savaşta bir kez mevcut eğitim × 5 iyileşme. Bu tetik BDM'den alınmış bilgi değil, KIVILCIM kodudur. |
| 8 · Kanatlar | Diablo Immortal'ın kanat özelleştirmesi biçim, renk ve görsel efekt seçenekleri sunar. [K9] | Mevcut kanadı seç, kuşan/çıkar → karakterin sırtında seçimin önizlemesi ve mevcut bonus değişimi görülsün → Turna +5 can veya Kuzgun +2 saldırı. Kaynağın ücretli yeniden çekim sistemi önerilmiyor; yeni kanat/asset gerektiren genişleme kapsam dışı. |
| 9 · Kalıntılar | BDM'de kalıntı üretimi kamp sunağında belirli malzemelerle yapılır. [K10] | Bölge bossundan parça topla, sunağı aç, etkinleştir → mevcut 6 parça eşiği ve etkin durum gösterilsin → mevcut kalıcı +3 azami can. Boss sonucundaki Kalıntılar geçişi toplama ve harcamayı bağlasın. Yeni kademe ekleme. |
| 10 · Etkinlikler / Çanta / Market | Diablo Immortal Events Center mevcut etkinliklere katılımdan ortak ilerleme ve ödül verir. Kaynak, tarihli bir etkinlik örneğidir. [K11] | Mevcut üç tam Av hedefini tamamla ve ödülü al → 0/3 ilerlemesi, hazır/alındı ayrımı ve günlük yenilenme zamanı görülsün → mevcut 1 sandık; Çanta'da açınca 10 altın + 1 yem. Yem Petler'e, cevher Demirci'ye dönsün; yeni para birimi ekleme. |

## Mevcut kaynak döngüleri

- Sefer → ilk kılıç, altın ve XP → Ekipman / Demirci → sıradaki durak.
- Enerji → Av → altın ve cevher → kılıç +2. Enerji üst sınırı 20; 10 dakikada 1 yenilenir.
- Bölge bossu → günlük ilk zaferde 3 parça → 6 parçayla kalıntı → +3 can.
- Üç tam Av → günlük etkinlik sandığı → 10 altın + 1 yem → pet eğitimi. Eğitim en çok 3; yem Market'te 35 altınla da alınabilir.
- Arena → günlük ilk üç zaferden jeton → mevcut 2 jetonluk sandık. Günlük boss → kristal → Market takası → elmas / sandık.

Bu değerler koddan okundu; harcama ve ödüller değiştirilmedi. Dünya bossu ve lonca içerikleri mevcut yerel yapının parçasıdır; ortak sunuculu rekabet doğrulanmadı.

## Birincil kaynaklar

Kontrol: 11.11.2026. Kaynaklar yayıncı rehberleri ve duyurularıdır. Tarihli örnekler güncel aktif etkinlik iddiası taşımaz; tarihsiz wiki sayfalarının son değişiklik tarihi bilinmiyor.

- K1 — Pearl Abyss, [Camp](https://www.world.blackdesertm.com/Ocean/News/Detail?boardNo=163), 28.11.2019. Kaynak ve işlem girişleri; tarihsel arayüz örneği.
- K2 — Pearl Abyss, [Remaster Season Guide](https://www.world.blackdesertm.com/Ocean/Wiki?wikiNo=2177). Sıralı öğrenme, kuşanma, başlangıç geliştirmesi ve Boss Rush.
- K3 — Pearl Abyss, [Boss Rush](https://www.world.blackdesertm.com/Ocean/News/Detail?boardNo=167), 05.12.2019. Yeniden boss karşılaşması, zorluk ve ödül önizlemesi; tarihsel sistem örneği.
- K4 — Pearl Abyss, [Boss Blitz](https://www.world.blackdesertm.com/Ocean/Wiki?wikiNo=2111). Örüntü, zayıflık ve başlangıç/ileri zorluk ayrımı.
- K5 — Pearl Abyss, [Black Spirit Mode](https://www.world.blackdesertm.com/Ocean/Wiki?wikiNo=43). Bölge seçimi, biriken süre ve ödül bütçesi.
- K6 — Pearl Abyss, [Martial God Tournament](https://www.world.blackdesertm.com/Ocean/Wiki?wikiNo=70). Spar/Ascent ayrımı ve 1v1 Spar kuralları.
- K7 — Pearl Abyss, [Enhancement / Force Enhancement](https://www.world.blackdesertm.com/Ocean/Wiki?wikiNo=13). Malzeme ve eşya bilgisi.
- K8 — Pearl Abyss, [Pets](https://www.world.blackdesertm.com/Ocean/Wiki?wikiNo=6). Yardımcı bonuslar ve yetenek eğitimi.
- K9 — Blizzard, [Prepare to Embolden your Awakened Wings](https://news.blizzard.com/en-us/article/24261470/prepare-to-embolden-your-awakened-wings), 23.02.2026. Kanat görünümünü özelleştirme.
- K10 — Pearl Abyss, [How to Craft Primal Items](https://www.world.blackdesertm.com/Ocean/Wiki?wikiNo=2001). Ancient Relic Altar'da malzemeyle kalıntı üretimi.
- K11 — Blizzard, [Take Heed of the Shadows in Treacherous Reflection](https://news.blizzard.com/en-gb/article/24066686/take-heed-of-the-shadows-in-treacherous-reflection), 06.05.2024. Events Center ortak ilerlemesi; tarihsel etkinlik örneği.

## Kullanıcı özeti

Mevcut oyuna uygun 10 bulgu, resmî kaynaklarla ve ekran → eylem → geri bildirim → ödül ilişkisiyle kaydedildi. Öncelik mevcut Sefer, Av, boss ve gelişim döngülerinin anlaşılmasıdır. Öneriler uygulanmadı; kod, HTML, denge, assetler ve ortak tasarım kayıtları değiştirilmedi. Ana iş açık bırakıldı.
