# Sistemler — ne var, ne gelecek

## Güncel karar — 13.11.2026

Kullanıcı Arena/Lonca kategori dağılımı ve Lonca üye/görev işleyişi kararını devretti. Kaynak: güncel sohbet; kodun tek sayı kaynağı Oyun/kod/ekonomi.js.

- Market dört sekme: Sandıklar, Mağaza, Arena, Lonca. 9 sandığın seçimi kilitli. Geçici fiyat 1 altın/elmas; diğer ürünler taslak.
- Arena alt kategorileri: Tümü, Ekipman (7), Malzeme (2), Özel (3). Lonca: Tümü, Ekipman (0), Malzeme (4), Özel (2). Ürün kimlikleri korunur; kategori görseli ürün eklemez. Şimdiki stok sınırsız; yenilenme süresi yok.
- Lonca: Geçit Muhafızları, mevcut tek oyunculu yerel yapı. Üyeler gerçek oyuncu kaydını gösterir; arama ve profil açma çalışır. Sahte üye, sıra, seviye, çevrimiçi davet ve sayaç bulunmaz.
- Bağış: mevcut 20 altın → 1 lonca jetonu. Bir başarılı işlem bir görev ilerlemesi sayılır.
- Görevler: bağış / Arena zaferi / tamamlanan Lonca Bossu veya Sancak Düellosu / tam av. Günlük hedefler 1/1/1/1; haftalık 5/5/5/10. Çekilme ve kaybedilen Arena/tamamlanmamış av sayılmaz.
- Her görev geçici 1 lonca jetonu verir. Ödül dönem başına bir kez alınır; claim bayrağı ve sayaçlar guildTasks.version=1 altında aynı oyuncu kaydında saklanır.
- Türkiye saati: günlük 00.00; haftalık Pazartesi 00.00. Eski kayıtlar bu özelliğin başlangıcında sıfır sayaçla açılır; geçmiş etkinliklere toplu ödül yazılmaz. Dönem dışı savaş günlük ilerlemeye eklenmez; aynı hafta ise haftalığa eklenebilir.
- Kontrol: Oyun/kod/lonca-kontrol.cjs ve ayrı #qa tarayıcı kaydı geçti. Ekonomi dengelemesi yapılmadı.

## Önceki sistem notları

Aşağıdaki eski sayı ve planlar güncel karar değildir. Güncel ekran durumu Is_Listesi.md, mekanik değerleri ekonomi.js içindedir.

Amaç: her alan dolu olsun; menü değil oyun hissi. Sıra: görünüm → sistem → içerik.

## Ortak kurallar

- Nadirlik (her sistemde aynı 8 basamak): Gri · Yeşil · Mavi · Mor · Turuncu · Altın · Siyah · Işıldayan beyaz.
- Kademe: T1–T20. Güçlendirme: +0…+20.
- Sayılar kutu içine alınmaz: ikon + rakam.
- Tek düğme biçimi: sivri uçlu altın çerçeveli plaka (ui.css).
- Kod: sistem mantığı `gear.js` ve `rooms2.js`; görünüm `gear.css`, `rooms2.css`, `ui.css`.

## Alan durumu

| Alan | Durum |
|---|---|
| Ekipman | Tamam |
| Çanta | Tamam |
| Demirci | Tamam |
| Petler | Tamam (yetenek içeriği hariç) |
| Kanatlar | Tamam |
| Market | Tamam |
| Tılsım · Aura · Kalıntı · Unvan | Eski kalıpta; sırada |
| Profil · Sıralama · Lonca · Posta · Bildirim · Ayarlar | Eski kalıpta; sırada |

## Ekipman

- 6 yuva: Silah, Yüzük, Rün (saldırı) · Kask, Zırh, Çizme (can). Yeni yuva = `gearSlots` tablosuna bir satır.
- Değer = yuva tabanı × kademe (T başına +%40) × nadirlik (1 / 1,3 / 1,7 / 2,2 / 2,9 / 3,8 / 5 / 6,6) × güçlendirme (+ başına %8).
- Taş yuvası nadirliğe göre: 0 · 0 · 1 · 1 · 2 · 2 · 3 · 4. Taşlar: Yakut (saldırı), Zümrüt (can).
- Güçlendirme: 15 × kademe × (seviye+1) altın, +5'ten sonra cevher. Başarısızlık yok.
- Ganimet: ilk geçiş kesin; boss yüksek şans; tam av %40; arena %30; sandık. Boss ve tam av taş, %22 ihtimalle tüy veya yumurta verir.
- Ekran: kahramanın iki yanında yuvalar, toplam güç, seçili eşya (karşılaştırma oku, sonraki + değeri), çanta.

## Çanta

- Tek ızgara; sekmeler: Tümü · Ekipman · Taş · Malzeme · Sandık.
- Seçilen her şeyin kendi işlemi var: kuşan, aç, ilgili alana git.

## Demirci — tezgâh kalıbı

Kod: `demirci.js`. Solda yuva süzgeci + eşyalar, ortada halkada seçili eşya ve +0…+20 merdiveni, sağda işlem. Sekmeler: Yükselt · Birleştir · Taş İşle · Kademe · Parçala.

- **Yükselt:** +1. Bedel altın (düğmede) + cevher (+5'ten sonra). **Başarı oranı** ilk üç seviye %100, sonra her seviyede 4 puan düşer, en az %35. Tutmazsa malzeme gider, seviye düşmez.
- **Birleştir:** aynı yuva + aynı nadirlikten 3 eşya → 1 üst nadirlik; kademe ve + en yüksekten gelir. "Hepsini birleştir" toplu.
- **Taş İşle:** boş yuvaya yakut/zümrüt tak; yuvaya dokununca 50 altınla geri al.
- **Kademe:** aynı yuvadan aynı kademede bir eşya + cevher + altın → T+1. Güçlendirme ve taşlar korunur; harcanan eşya en düşük nadirlikten seçilir.
- **Parçala:** cevher + altın + içindeki taşlar geri. "Gri ve yeşilleri parçala" toplu. Takılı eşya parçalanamaz.

Tasarımda olup oyunda karşılığı olmadığı için eklenmeyen sekmeler: Üretim, Onar.

## Petler

- Üç güçlendirme alanı: Seviye (yem, 0–20), Yıldız (yumurta, 0–5, her yıldız +%20), Yetenek (1★, 3★, 5★'da açılır — içerik sonra).
- Akboynuz can, Kızıl Tilki saldırı verir. Yeni petler yumurtadan gelecek.

## Kanatlar — tezgâh kalıbının ilk örneği

Kod: `kanat.js`, ortak yerleşim `tezgah.css`. Üç bölge: solda liste, ortada kahraman + evre yolu, sağda işlem. Sekmeler: Güçlendir · Evrim · Rün.

- **Güçlendir:** +1 seviye, tüy + altın. **Başarı oranı** %100'den başlar, her seviyede 3 puan düşer, en az %40. Başarısızlıkta malzeme gider, seviye düşmez.
- **Evrim:** 5 evre. Seviye evre sınırına (5/10/15/20) ulaşınca evrim açılır; bedel tüy + altın, her zaman başarılı. Her evre tüm değeri %25 artırır ve 5 seviye daha açar.
- **Rün:** 1 yuva (2. evrede 2 olur). Yakut saldırı, zümrüt can. Yuvaya dokununca rün geri alınır.
- Turna can, Kuzgun saldırı. Kanat kahramanın sırtında canlı görünür.

Diğer ekranlar da bu kalıba taşınacak: Demirci, Market, Petler, Ekipman.

## Market

- Sekmeler: Sandıklar · Mağaza · Takas · Arena · Lonca.
- 6 sandık: Yolcu (250 altın) · Avcı (900 altın) · Muhafız (5 elmas) · Şövalye (15 elmas, +1) · Ejder (40 elmas, +2) · UBER (120 elmas, 5 eşya +5). Kademe ve nadirlik aralığı kartta görünür. Her sandık tüy ve yumurta da verir.

## Sıradaki sistemler

- Pet yetenekleri (3 yuva, yetenek kitabı), yeni petler ve kuluçka.
- Tılsım, Aura, Kalıntı, Unvan: aynı kalıba (liste + seviye + nadirlik).
- Set bonusu, eşya kilidi, "en iyiyi kuşan".
- Eldiven / Pelerin / Kolye yuvaları (ikonları hazır).

## Kullanıcı özeti

Ekipman, Çanta, Demirci, Pet, Kanat ve Market sistemleri kuruldu ve ekranları doldu. Sırada Tılsım, Aura, Kalıntı, Unvan ve pet yetenekleri var.

## Kullanıcı özeti — güncel

Market alt kategorileri ve yerel Lonca görevleri tamamlandı. Güncel kararlar üsttedir; eski sistem notları tarihsel başvurudur.
