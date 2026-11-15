# İmalattan Sümen — Kategori İçerik Temizlik Yedeği

**Tarih:** 27 Ağustos 2026  
**Kapsam:** 19 kategori açıklamasındaki görünür `---` paragrafının kaldırılması; ID 3 kaydında ayraçtan sonra yanlışlıkla yayınlanan iç operasyon notlarının temizlenmesi.

## Değişiklik öncesi kayıt özeti

| ID | Slug | Description uzunluğu | SHA-256 |
|---:|---|---:|---|
| 15 | deri-sumen-takimlari | 3256 | `284fe59bbd4d1fa27ed3f7fb0a63d700a2db13f9b4b280e3cb9f80de966afd9c` |
| 13 | ahsap-sumen-takimlari | 3030 | `7014871707e2301e92f2cb9bea9c1ab5ab6db567e4c0ea68390245c1b675c2f5` |
| 16 | luks-sumen-takimlari | 2917 | `4b0c40f830c6878d6c3b1b5cbd5473cbbd6867065c2613608fb0b2f55f59cd89` |
| 23 | ucuz-sumen-takimlari | 2780 | `fe04367e01b05502965c84e118300e47a800dc1926bc51b530884590a94be796` |
| 1023 | sumen-takimi-olusturma | 2755 | `79446bccb3d73204b1ca6da30622b975bf388b10151b375da55e5d5384720027` |
| 9 | ofis-ve-kirtasiye | 2978 | `868aed9c4a8167b1ced7a262567e2208ca7f9a18d1fce8f7451d532aecc45183` |
| 12 | masa-isimlikleri-3 | 2601 | `9b4b4bf0c908df0849ef7c05b1d767554c78c81a231f08a5c9f31179ba7b1487` |
| 19 | kristal-masa-isimlikleri | 2604 | `b05ae761de9e15f4d68a16aedc52dff053d5a871fdeecbed31916653051940ff` |
| 14 | evrak-raflari | 2634 | `78691c69669e5601276f755f6c82ed91345a427e5cbd283d8f2b4b8e4938f4b8` |
| 17 | magazinlik-dosyalik | 2543 | `e8469b01170e4a429ed4cb76b69278989dfc986cbe91a0826b448b377505736e` |
| 18 | cop-kovalari | 2638 | `641c49148fcc478a48244ab59461c609638d9d29d2973315839c8e6f15b3f6ff` |
| 20 | bayraklar | 2472 | `d5c05d877a6aaf7012d0f067f9ccb1ada94c43f533578a447d94f2ab324bc1cc` |
| 22 | masa-bayraklari | 2246 | `b6cd552f55361c1063c0de316a9d300708cfe99b8b1136730a632282b29c6893` |
| 21 | makam-bayraklari | 2348 | `6e7ef98944a69a3e061ba7a86601b7e64a702c2373aac32d8861d88faa9bd240` |
| 4 | kanvas-tablo | 2515 | `fa52150d5f1e3c4f55ac28f87ef5475269d51b4cacde2f60d1120e2056e59a09` |
| 6 | dekoratif-kanvas-tablo-6 | 2235 | `f6a077af58edf2a008a8b31d51d055719902df0243e53cbeed706bd2ada35031` |
| 5 | ataturk-portreleri | 2665 | `38e3d812b2b3158096e7d5401a71127de3e2a062ae4eeaabf83fdd8a2ec64c00` |
| 2 | dugmeli-makam-panosu | 2526 | `fa826feafd82cc1e09e5b5f7b5f653d336f645f8a79240e7194b789094fcf666` |
| 3 | resimli-makam-panosu-51-2 | 4884 | `52acd6615db9d749d2def70c3c3e83d38b5a20d216b632b98f3ca26ab5abb07e` |

İlk 18 kayıtta kaldırılacak parça açıklamanın sonundaki tek `<p>---</p>` öğesidir.

## ID 3 kaydından çıkarılacak kuyruk — 1.932 karakter

```html
<p>---</p>
<p># Panel giriş kontrol tablosu</p>
<p>İçerikleri uygularken aşağıdaki sırayı izleyin.</p>
<p>| Sıra | Kategori | Metadata | Üst açıklama | Alt açıklama | SSS | İç bağlantı | |---:|---|---|---|---|---|---| | 1 | Sümen Takımları | ☐ | ☐ | ☐ | ☐ | ☐ | | 2 | Deri Sümen Takımları | ☐ | ☐ | ☐ | ☐ | ☐ | | 3 | Ahşap Sümen Takımları | ☐ | ☐ | ☐ | ☐ | ☐ | | 4 | Lüks Sümen Takımları | ☐ | ☐ | ☐ | ☐ | ☐ | | 5 | Uygun Fiyatlı Sümen Takımları | ☐ | ☐ | ☐ | ☐ | ☐ | | 6 | Sümen Takımı Oluşturma | ☐ | ☐ | ☐ | ☐ | ☐ | | 7 | Ofis Masaüstü Aksesuarları | ☐ | ☐ | ☐ | ☐ | ☐ | | 8 | Masa İsimlikleri | ☐ | ☐ | ☐ | ☐ | ☐ | | 9 | Kristal Masa İsimlikleri | ☐ | ☐ | ☐ | ☐ | ☐ | | 10 | Deri Evrak Rafları | ☐ | ☐ | ☐ | ☐ | ☐ | | 11 | Magazinlik ve Dosyalık | ☐ | ☐ | ☐ | ☐ | ☐ | | 12 | Deri Ofis Çöp Kovaları | ☐ | ☐ | ☐ | ☐ | ☐ | | 13 | Ofis Bayrakları | ☐ | ☐ | ☐ | ☐ | ☐ | | 14 | Masa Bayrakları | ☐ | ☐ | ☐ | ☐ | ☐ | | 15 | Makam Bayrakları | ☐ | ☐ | ☐ | ☐ | ☐ | | 16 | Kanvas Tablolar | ☐ | ☐ | ☐ | ☐ | ☐ | | 17 | Dekoratif Kanvas Tablolar | ☐ | ☐ | ☐ | ☐ | ☐ | | 18 | Atatürk Portreleri | ☐ | ☐ | ☐ | ☐ | ☐ | | 19 | Düğmeli Makam Panoları | ☐ | ☐ | ☐ | ☐ | ☐ | | 20 | Resimli Makam Panoları | ☐ | ☐ | ☐ | ☐ | ☐ |</p>
<p># Yayın sonrası kontrol</p>
<p>- Kategori URL'si 200 durum kodu vermeli. - Sayfada tek H1 bulunmalı. - Kaynak kodda yeni title ve meta description görünmeli. - Canonical doğru URL'yi göstermeli. - İç bağlantılar 200 durum kodu vermeli. - Üst açıklama ürün listesini mobilde aşırı aşağı itmemeli. - SSS metni kullanıcıya görünür olmalı. - Kategori sayfa 2+ URL'leri kendi canonical'ını taşımalı. - Güncellenen kategori Search Console URL Inspection ile test edilmeli. - Değişiklik tarihi, kategori ve önceki metadata kayıt altına alınmalı.</p>
```

Bu kuyruk ziyaretçiye yönelik kategori içeriği değil, iç operasyon notudur. Geri yükleme ancak özellikle istenirse yapılmalıdır.

## Uygulama sonucu

- 19 kategori kaydı başarıyla güncellendi.
- İlk 18 kayıttan yalnızca sondaki görünür `---` paragrafı kaldırıldı.
- ID 3 kaydından 1.932 karakterlik ayraç + panel kontrol kuyruğu kaldırıldı.
- 20/20 canlı kategori açıklamasında `---` paragrafı: 0.
- 20/20 canlı kategoride panel operasyon notu: 0.
- 20/20 title, meta description, tek H1 ve self-canonical doğrulandı.
- 20/20 SSS görünür; kırık bağlamsal iç bağlantı: 0.
