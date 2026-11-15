# İmalattan Sümen — Bilgi Mimarisi Pilot Yedeği

**Tarih:** 27 Ağustos 2026  
**Pilot kategori:** ID 15 — Deri Sümen Takımları  
**URL:** `https://www.imalattansumen.com/deri-sumen-takimlari/`

## Değişiklik öncesi değerler

| Alan | Değer |
|---|---|
| Name | Deri Sümen Takımları |
| SeName | deri-sumen-takimlari |
| ParentCategoryId | 0 |
| CategoryTemplateId | 1 |
| PageSize | 96 |
| DisplayOrder | 0 |
| Published | true |
| HTTP | 200 |
| Breadcrumb | Anasayfa > Deri Sümen Takımları |
| İlk sayfa ürün kartı | 96 |

## Pilot değişikliği

Yalnızca `ParentCategoryId` değeri `0` yerine `8` yapılacak. Böylece kategori, `Sümen Takımları` üst kategorisinin altına bağlanacak. Ad, URL, içerik, metadata, şablon, sayfa boyutu, yayın durumu ve sıralama korunacak.

## Geri alma

Beklenmeyen menü, breadcrumb, ürün veya URL davranışında ID 15 kaydının `ParentCategoryId` değeri tekrar `0` yapılmalıdır.

---

## Pilot sonrası hiyerarşi dalgası yedeği

| ID | Kategori | Eski parent | Hedef parent | Şablon | PageSize | Sıra | Ürün |
|---:|---|---:|---:|---:|---:|---:|---:|
| 16 | Lüks Sümen Takımları | 0 | 8 — Sümen Takımları | 1 | 96 | 0 | 40 |
| 23 | Ucuz Sümen Takımları | 0 | 8 — Sümen Takımları | 1 | 96 | 0 | 41 |
| 22 | Masa Bayrakları | 0 | 20 — Bayraklar | 1 | 96 | 0 | 4 |
| 21 | Makam Bayrakları | 0 | 20 — Bayraklar | 1 | 96 | 0 | 6 |
| 14 | Evrak Rafları | 0 | 9 — Ofis ve Kırtasiye | 1 | 96 | 0 | 30 |
| 17 | Magazinlik & Dosyalık | 0 | 9 — Ofis ve Kırtasiye | 1 | 96 | 0 | 10 |
| 18 | Çöp Kovaları | 0 | 9 — Ofis ve Kırtasiye | 1 | 96 | 0 | 10 |

Bu yedi kaydın değişiklik öncesi breadcrumb'ı `Anasayfa > Kategori` biçimindedir. Geri alma için her kaydın `ParentCategoryId` değeri tekrar `0` yapılmalıdır.

## Uygulama sonucu

- ID 15, 16 ve 23 → parent ID 8 — Sümen Takımları
- ID 22 ve 21 → parent ID 20 — Bayraklar
- ID 14, 17 ve 18 → parent ID 9 — Ofis ve Kırtasiye
- 8/8 admin kaydında hedef parent değeri doğrulandı.
- 8/8 URL, title, meta, tek H1, canonical ve ürün sayısı korundu.
- 8/8 breadcrumb hedef üst kategoriyi gösteriyor.
- 8/8 kategori ana menü HTML'inde erişilebilir bağlantı olarak bulunuyor.

---

## Kanvas konu kümesi — değişiklik öncesi yedek

**Tarih:** 27 Ağustos 2026

| ID | Kategori | URL | Eski parent | Hedef parent | Şablon | PageSize | Sıra | Ürün |
|---:|---|---|---:|---:|---:|---:|---:|---:|
| 6 | Dekoratif Kanvas Tablolar | `/dekoratif-kanvas-tablo-6/` | 0 | 4 — Kanvas Tablolar | 1 | 96 | 0 | 25 |
| 5 | Atatürk Portreleri | `/ataturk-portreleri/` | 0 | 4 — Kanvas Tablolar | 1 | 96 | 0 | 22 |

Değişiklikte yalnızca `ParentCategoryId` alanı `0` yerine `4` yapılacaktır. Ad, slug/URL, açıklama, metadata, şablon, sayfa boyutu, yayın durumu ve sıralama korunacaktır.

### Değişiklik öncesi Kanvas sayfalaması

| Sayfa | HTTP | Ürün | Canonical |
|---:|---:|---:|---|
| 1 | 200 | 96 | `https://www.imalattansumen.com/kanvas-tablo/` |
| 2 | 200 | 16 | `https://www.imalattansumen.com/kanvas-tablo/` |
| 3 | 200 | 0 | `https://www.imalattansumen.com/kanvas-tablo/` |

**Geri alma:** Beklenmeyen davranışta ID 6 ve ID 5 kayıtlarının `ParentCategoryId` değeri tekrar `0` yapılmalıdır.

### Uygulama sonucu

- ID 6 ve ID 5 kayıtlarının `ParentCategoryId` değeri canlıda `4` yapıldı ve admin panelinden doğrulandı.
- Breadcrumb'lar sırasıyla `Anasayfa > Kanvas Tablolar > Dekoratif Kanvas Tablolar` ve `Anasayfa > Kanvas Tablolar > Atatürk Portreleri` oldu.
- İki kategorinin URL, Name/H1, title, meta description, self-canonical ve ürün sayıları korundu.
- Ana sayfa menüsündeki iki kategori bağlantısı korunuyor.
- Kanvas üst kategorisi sayfa 1: 96, sayfa 2: 63, boş sayfa 3: 0 ürün; yeni bir dolu üçüncü sayfa oluşmadı.

---

## Masa isimlikleri konu kümesi — değişiklik öncesi yedek

**Tarih:** 27 Ağustos 2026

| ID | Kategori | URL | Eski parent | Hedef parent | Şablon | PageSize | Sıra | Ürün |
|---:|---|---|---:|---:|---:|---:|---:|---:|
| 19 | Kristal Masa İsimlikleri | `/kristal-masa-isimlikleri/` | 0 | 12 — Masa İsimlikleri | 1 | 96 | 0 | 16 |

Değişiklikte yalnızca `ParentCategoryId` alanı `0` yerine `12` yapılacaktır. Ad, slug/URL, açıklama, metadata, şablon, sayfa boyutu, yayın durumu ve sıralama korunacaktır.

### Değişiklik öncesi parent sayfalaması

| Sayfa | HTTP | Ürün | Canonical |
|---:|---:|---:|---|
| 1 | 200 | 21 | `https://www.imalattansumen.com/masa-isimlikleri-3/` |
| 2 | 200 | 0 | `https://www.imalattansumen.com/masa-isimlikleri-3/` |

**Geri alma:** Beklenmeyen davranışta ID 19 kaydının `ParentCategoryId` değeri tekrar `0` yapılmalıdır.

### Uygulama sonucu

- ID 19 kaydının `ParentCategoryId` değeri canlıda `12` yapıldı ve admin panelinden doğrulandı.
- Breadcrumb `Anasayfa > Masa İsimlikleri > Kristal Masa İsimlikleri` oldu; tarayıcıda görünür sayfa üzerinden ayrıca doğrulandı.
- URL, Name/H1, title, 139 karakterlik meta description, self-canonical ve 16 ürün korundu.
- Ana sayfa menüsündeki kategori bağlantısı korunuyor.
- Masa İsimlikleri parent sayfası 21 üründen 26 benzersiz ürüne çıktı; sayfa 2 yine 0 ürün ve yeni dolu sayfa oluşmadı.
