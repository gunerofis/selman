# Süreçler — adım adım tarifler

> **04.11.2026 · Güncel kurallar ve bütün DOKU bilgisi: [00 Tek Kaynak](<00 Tek Kaynak/00 Dizin.md>).** Bu dosya tarihsel kayıttır; çelişkide 00 Tek Kaynak geçerlidir.


## A. Müşteri işi (talepten bakıma)
1. **Talep:** Müşteri ne istediğini anlatır (WhatsApp / form). Duvarın ölçüsü ve fotoğrafı alınır.
2. **Ölçü:** Yerinde ölçü (fiyatın %4'ü; müşteri kendi ölçüsünü verip sorumluluğu alırsa yok).
3. **Kapora:** Tasarım öncesi %5.
4. **Tasarım:** Ölçekli tasarım (ör. 28×20 → ×10). Renkli çizim + uygulama görseli. Revizyon sınırı yok.
5. **Onay ve teklif:** Son düzeltme sonrası müşteri onayı. Kapsam (garanti dahil) teklifte yazılır; garanti süresi verilmez.
6. **Üretim:** Başlarken toplamın %50'si tahsil edilmiş olur (kapora dahil). Bağlantılar atölyede takılır.
7. **Montaj:** Gizli geçme (fiyatın %8'i; müşteri vazgeçebilir). Müşteri kurarsa: parça arka numaraları ve numaraları eşleşen renksiz A4 yerleşim çizimi; köşeden başlanır (18.10 kullanıcı açıklaması, CL06 M115). Önceki gerçek ölçülü şablon kaydı üretim/ölçek kaynağıdır; müşteri çizimiyle karıştırılmaz. Bakım bilgisi seçilen malzemeye göre verilir.
8. **Kalan ödeme:** %50 montajda veya kargo öncesi.
9. **Garanti ve bakım:** Teklifteki kapsama göre.

## B. Tasarım ve görsel üret

1. [Ana rehberden](<05 Kaynaklar/Önceki Kurallar 2026-11-04/00 Görsel ve Tasarım Rehberi.md>) iş ve ürün türünü seç. Güncel talep, referans, adet ve varsa onay sınırını belirle. Eski “1 tur = 9 görsel” veya “önce 3” talebi yeni işe aktarılmaz.
2. Kaynağın öğe kimliğini, sayısını, yerleşimini ve renklerini çıkar. Kolaj karelerini dosya + satır/sütunla ayır; istenmedikçe karıştırma. İndekste yakın tasarımı kontrol et.
3. Ana silüet → tanıtan parçalar → destek öğeler sırasıyla çöz. Kırılgan ayrıntıyı geniş forma kat; tanınırlığı ve oranları koru. Gereksiz parça/tema sınırı ekleme.
4. Doğrulanmış karteladan doku ve renk seç. Kod eşleşmiyorsa tahmin etme; eksik kodu iş kaydında belirt. Teknik ölçü verilmediyse kesin ölçü iddiası yazma.
5. [İstemlerden](<05 Kaynaklar/Önceki Kurallar 2026-11-04/05 Görsel İstemleri.md>) uygun modu kullan. Çizim istenmişse önce renkli parça haritasını oluştur; uygulamada aynı haritayı koru. Her karede tek tasarım.
6. [Denetimi](<05 Kaynaklar/Önceki Kurallar 2026-11-04/02 Görsel Denetim.md>) uygula. Hatalı bölgeyi düzelt, doğru kısmı koru; bütün görseli tekrar kontrol et.
7. Uygun yeni konsept → `Görseller/02 Onay Bekleyen`; deneme → `04 Denemeler`; hata → `03 Düzeltilecek`. Ad ve kod düzeni [Ajan ve Dosyalama](<05 Kaynaklar/Önceki Kurallar 2026-11-04/04 Ajan ve Dosyalama.md>) içindedir. Kaynağın üzerine yazma.
8. Görsel İndeksi ve ilgili Onay Listesi/Sorunlar kaydını güncelle. İstem ve değişikliği mevcut iş/parti kaydına kısa yaz. Sonucu, durumunu ve gerekiyorsa kullanıcı kararını bildir.

## C. Görselleri denetle ve düzelt

Tek yöntem [02 Görsel Denetim](<05 Kaynaklar/Önceki Kurallar 2026-11-04/02 Görsel Denetim.md>) içindedir. İstenen kapsamın bütün görsellerine bak; şüpheli alanı büyüt. Teknik çizime kaplama dokusu/oda şartı uygulama. Yalnız görülen sorunu kaydet. Düzeltme, katalog ve yayın statüsünü kendiliğinden değiştirmez.

## D. Onaylanan görseli kataloğa al

1. Kullanıcının bu tasarıma ait onayını mevcut kayıttan doğrula; verilmiş onayı yeniden isteme.
2. Kategori ön eki + indeksteki sıradaki boş numarayı ver. Mevcut kalıcı kodu değiştirme. Renk/oda türevini aynı tasarım altında tut; farklı motifi ayır.
3. `Görseller/01 Katalog/<kategori>/KOD - Ad - 01.png` konumuna al. Kaplama kodu indekste kalır; görsele basılmaz.
4. İndeksteki yol, durum, boyut ve SHA256'yı güncelle; Onay Listesi'ndeki ilgili satırı kapat. Değişiklik öncesi kayıt yedeklenir.
5. Siteye ekleme ayrı işse E adımını uygula; katalog onayı tek başına canlı yayın veya fiziksel üretim onayı değildir.

## E. Siteye görsel/tasarım ekle
Yalnız `DOKU\site` klasöründe (arşivdeki kopyalarda değil):
1. `cd tools` → ilk kez `npm install`.
2. Görseli kaynak klasöre koy → `node images.mjs` (WebP, 900 px, ≤200 KB).
3. `data/catalog.json`'a kayıt (kalıcı DK/G kodu); `data/keywords.json`'a tek sözcüklü etiketler; en az bir alana bağla (`data/areas.json`).
4. `node build.mjs` → `node check.mjs` (+ `search-check.mjs`, `admin-check.mjs`) GEÇTİ. Kontrol tedarikçi adını da arar; bulursa durur.
5. Tarayıcıda mobil + masaüstü, arama, teklif mesajı kontrolü.
6. Yayın yalnız Faris onayıyla, Codex Sites projesinden (`00 Başla.md` › Site).
7. Kartela eklenecekse: orijinal `06 Kaplamalar`'na + listeye; siteye yalnız seri adı, renk kodu ve görsel girer.

## F. Mimar e-posta dizisi
- **Kime:** 1) İstanbul konut/villa iç mimarları 2) otel, restoran, kafe, ofis yapan ofisler 3) sonra Ankara, İzmir, Bodrum. Ofisin genel adresi; kişisel adres toplanmaz.
- **Hız:** Haftada 10–15 ofis; ofis başına ayda en fazla 2–3 temas. Gönderim sabah 08–12, Faris onayıyla, Faris'in adresinden (SPF/DKIM/DMARC kurulu).
- **Sıra:** Gün 1 tanışma → Gün 4 kısa hatırlatma → Gün 10 görüşme (numune/örnek) → Gün 21 kapanış. Cevap gelirse dizi durur; iş ortaklığı e-postası yalnız cevap verene.
- **Tanışma (18.10):** kısa; MDF/teknik yok; doku ve kaplama odaklı. Üstte `EP - Kartela Tanışma - 01.jpg`, ekte `DOKU Kaplama Kartelası.pdf`. Kapanış: kartelamızdan istediği kumaşı/dokuyu seçebilir. Şablon: `Görseller\05 Pazarlama\E-posta\Mimar Tanışma - Kartela.html` (+ `.txt`); Gmail'de taslak var.
- **Cevap gelirse:** 24 saatte dön → numune veya kısa görüşme → çizim gelirse ölçekli öneri.
- **Liste:** [DOKU içindeki mimar listesi](<../Arşiv/Derlenen Kaynaklar/18 Omurga 2026-09-28/satis/mimar/liste.csv>) (27 ofis, genel adresler).
- **Ölçü:** gönderilen · cevap · görüşme · numune isteği · proje (`satis\mimar\liste.csv`).
- Metinler: `05 Kaynaklar\Omurga…\satis\mimar\eposta-dizisi.md` (ifadeler `03\3`'e uygun olmalı).

## G. Kayıt tut
- İş bitti → `04 Kayıt\Günlük.md` en üste: `YYYY-AA-GG · iş · sonuç`.
- Faris karar verdi → `01 Kararlar.md` ilgili başlık.
- İş açıldı/kapandı → `02 Program ve İşler.md`.
- Dosya taşındı → indeks + gerekirse `04 Kayıt`'a taşıma listesi.

## H. Tasarımı fiziksel üretime hazırla

1. Kullanıcı/müşteri onaylı tasarım sürümü, duvar ölçüsü ve ölçü birimini doğrula. Ölçülü tasarım ile oda önizlemesini aynı parça yerleşiminde tut.
2. Kaplama serisi/kodu, kalınlık, kenar radiusu, birleşim ve bağlantı yöntemini iş özelinde netleştir. CNC takımına uygun iç köşe, minimum parça/boğaz ve kaplama payı için doğrulanmamış değer uydurma.
3. Renkli tasarım çizimini kesim verisinden ayır. Görselden otomatik CNC onayı çıkarma; kesim yolları, gerçek ölçek ve üretilebilirlik atölye/numune kontrolü ister. Bu kontrolün sonucu mevcut iş kaydına yazılır.
4. Kesimde parçaları işaretle; kaplamadan sonra arka numaraları koru. Kaplama kenardan arkaya döner, bağlantılar atölyede hazırlanır.
5. Aynı numaraları taşıyan renksiz A4 yerleşim çizimini hazırla; müşteri montajında köşeden başlanır. A4 montaj krokisi, gerçek ölçülü üretim şablonu değildir.
6. Fiziksel numune/uygulama sonucunu gerçek fotoğraf ve iş kaydıyla ayır. Konseptin görüntü kontrolünden geçmesi üretimin doğrulandığı anlamına gelmez.

Kaynak: [Kararlar](<01 Kararlar.md>) › Ürün ve malzeme; [CL06](<05 Kaynaklar/Claude/Sohbetler/CL06 Numune Fiyat ve Montaj.md>) M115–117. Müşteri/ödeme/montaj akışının bütünü A bölümünde kalır.
