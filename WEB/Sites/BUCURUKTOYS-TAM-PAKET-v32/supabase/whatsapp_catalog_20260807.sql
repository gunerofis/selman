-- BÜCÜRÜKTOYS WhatsApp katalog aktarımı — 7 Ağustos 2026
-- 44 yeni SKU ekler, 18 mevcut ürüne mükerrer SKU oluşturmadan galeri görseli bağlar.
-- Yönetimde girilmiş fiyat, maliyet, stok, barkod, tedarikçi ve görünürlük değerlerini korur.

begin;

insert into public.products (
  id, sku, name, category, pack, description, image_url, barcode, supplier, sort_order
)
values
  (36,'BT-036','Karışık Desenli Stres Topu','sensory','12 adetli','Futbol ve emoji temalı, sıkıştırılabilir karışık desenli stres topu.','IMG-20260807-WA0011.webp','DOLDURULACAK','DOLDURULACAK',36),
  (37,'BT-037','Işıklı Sapan','outdoor','50 adetli','Mini ışıklı sapan; karışık renkli toplu teşhir paketi.','IMG-20260807-WA0012.webp','DOLDURULACAK','DOLDURULACAK',37),
  (38,'BT-038','Işıklı Araba Anahtarlık','accessory','48 adetli','Araba formunda ışıklı anahtarlık; karışık renk seçeneği.','IMG-20260807-WA0013.webp','DOLDURULACAK','DOLDURULACAK',38),
  (39,'BT-039','Işıklı Emoji Anahtarlık','accessory','48 adetli','Emoji figürlü ışıklı anahtarlık; karışık model ve renk.','IMG-20260807-WA0014.webp','DOLDURULACAK','DOLDURULACAK',39),
  (40,'BT-040','Yelpaze Çeşitleri','accessory','12 adetli','Katlanabilir el yelpazesi; karışık desen ve renk seçenekleri.','IMG-20260807-WA0016.webp','DOLDURULACAK','DOLDURULACAK',40),
  (41,'BT-041','Projeksiyonlu Oyuncak Fotoğraf Makinesi','fun','12 adetli','Işıklı, çıngıraklı ve projeksiyon özellikli oyuncak fotoğraf makinesi.','IMG-20260807-WA0017.webp','DOLDURULACAK','DOLDURULACAK',41),
  (42,'BT-042','Mini El Fanı Çeşitleri','accessory','DOLDURULACAK','Elde taşınabilir mini pervaneli fan; karışık model ve renk.','IMG-20260807-WA0018.webp','DOLDURULACAK','DOLDURULACAK',42),
  (43,'BT-043','Küçük Çek-Bırak Araba','fun','24 adetli','Kompakt çek-bırak mekanizmalı oyuncak araba; karışık model.','IMG-20260807-WA0021.webp','DOLDURULACAK','DOLDURULACAK',43),
  (44,'BT-044','Off-Road Çek-Bırak Araba','fun','12 adetli','Off-road gövdeli çek-bırak oyuncak araç; karışık renk.','IMG-20260807-WA0023.webp','DOLDURULACAK','DOLDURULACAK',44),
  (45,'BT-045','Panda Slime','sensory','36 adetli','Panda temalı kapta sunulan renkli slime; karışık çeşit.','IMG-20260807-WA0024.webp','DOLDURULACAK','DOLDURULACAK',45),
  (46,'BT-046','Büyüyen Dinozor Yumurtası','fun','60 adetli','Su içinde büyüyen dinozor figürlü sürpriz yumurta oyuncağı.','IMG-20260807-WA0025.webp','DOLDURULACAK','DOLDURULACAK',46),
  (47,'BT-047','Oyun Parası Seti','skill','60 adetli','Rol yapma ve oyun kurma etkinlikleri için temsili oyun parası paketi.','IMG-20260807-WA0026.webp','DOLDURULACAK','DOLDURULACAK',47),
  (48,'BT-048','Uçan Dinozor','outdoor','100 adetli','Kanatlı dinozor formunda hafif oyun ürünü; karışık renk.','IMG-20260807-WA0027.webp','DOLDURULACAK','DOLDURULACAK',48),
  (49,'BT-049','Squishy Anahtarlık Çeşitleri','accessory','50 adetli','Yumuşak dokulu, sıkılabilir figür anahtarlıkları; karışık model.','IMG-20260807-WA0029.webp','DOLDURULACAK','DOLDURULACAK',49),
  (50,'BT-050','4 Fonksiyonlu Lazer','accessory','24 adetli','Dört fonksiyonlu ışık ve lazer ürünü; güvenlik bilgisi DOLDURULACAK.','IMG-20260807-WA0034.webp','DOLDURULACAK','DOLDURULACAK',50),
  (51,'BT-051','Saç Tokası ve Tarak Seti','accessory','20 adetli','Mini tarak ve saç tokası kombinasyonu; karışık renk ve model.','IMG-20260807-WA0036.webp','DOLDURULACAK','DOLDURULACAK',51),
  (52,'BT-052','Çıngıraklı Peluş Anahtarlık','accessory','50 adetli','Yumuşak peluş yüzeyli, çıngırak sesli anahtarlık; karışık figür.','IMG-20260807-WA0037.webp','DOLDURULACAK','DOLDURULACAK',52),
  (53,'BT-053','Işıklı Telefon Anahtarlığı','accessory','48 adetli','Telefon formunda ışıklı anahtarlık; model ve lisans durumu DOLDURULACAK.','IMG-20260807-WA0041.webp','DOLDURULACAK','DOLDURULACAK',53),
  (54,'BT-054','Küçük Çöp Adam Oyuncağı','fun','12 adetli','Çöp adam karakter formunda elde oynanan mini oyuncak; karışık renk.','IMG-20260807-WA0042.webp','DOLDURULACAK','DOLDURULACAK',54),
  (55,'BT-055','Kazımalı Sticker Seti','stationery','20 adetli','Kazıma kalemiyle desen uygulamaya yönelik sticker sayfaları.','IMG-20260807-WA0044.webp','DOLDURULACAK','DOLDURULACAK',55),
  (56,'BT-056','Sesli Timsah Anahtarlık','accessory','12 adetli','Sıkıldığında ses çıkaran timsah figürlü anahtarlık; karışık renk.','IMG-20260807-WA0047.webp','DOLDURULACAK','DOLDURULACAK',56),
  (57,'BT-057','Sulu Işıklı Top','sensory','12 adetli','İç dolgulu ve ışıklı yumuşak top; karışık renk ve model.','IMG-20260807-WA0049.webp','DOLDURULACAK','DOLDURULACAK',57),
  (58,'BT-058','Kurmalı Topaç','fun','48 adetli','Kurma mekanizmalı renkli mini topaç; toplu teşhir paketi.','IMG-20260807-WA0050.webp','DOLDURULACAK','DOLDURULACAK',58),
  (59,'BT-059','Pipo Uçan Top','fun','50 adetli','Nefesle hafif topu havada tutmaya dayalı pipo oyuncağı.','IMG-20260807-WA0053.webp','DOLDURULACAK','DOLDURULACAK',59),
  (60,'BT-060','Kutulu Solo Test','skill','24 adetli','Taş dizilimi ve hamle planlamasına dayalı tek kişilik zekâ oyunu.','IMG-20260807-WA0054.webp','DOLDURULACAK','DOLDURULACAK',60),
  (61,'BT-061','Renk ve Sayı Eşleştirme Kart Oyunu','skill','DOLDURULACAK','Renk ve sayı eşleştirmeye dayalı kart oyunu; marka ve lisans durumu DOLDURULACAK.','IMG-20260807-WA0055.webp','DOLDURULACAK','DOLDURULACAK',61),
  (62,'BT-062','Küçük Boy Kapsül Tabanca','fun','DOLDURULACAK','Mini boy oyuncak kapsül tabanca; kapsül uyumluluğu ve güvenlik bilgisi DOLDURULACAK.','IMG-20260807-WA0057.webp','DOLDURULACAK','DOLDURULACAK',62),
  (63,'BT-063','Örümcek Kahraman Maskesi','accessory','12 adetli','Elastik bantlı çocuk kostüm maskesi; marka ve lisans durumu DOLDURULACAK.','IMG-20260807-WA0058.webp','DOLDURULACAK','DOLDURULACAK',63),
  (64,'BT-064','Yarasa Kahraman Maskesi','accessory','12 adetli','Elastik bantlı çocuk kostüm maskesi; marka ve lisans durumu DOLDURULACAK.','IMG-20260807-WA0059.webp','DOLDURULACAK','DOLDURULACAK',64),
  (65,'BT-065','Beyaz Kostüm Maskesi','accessory','12 adetli','Yüzü kaplayan beyaz kostüm maskesi; model ve lisans durumu DOLDURULACAK.','IMG-20260807-WA0060.webp','DOLDURULACAK','DOLDURULACAK',65),
  (66,'BT-066','3×3 Zekâ Küpü','skill','12 adetli','Klasik 3×3 döner mekanizmalı renk eşleştirme bulmacası.','IMG-20260807-WA0062.webp','DOLDURULACAK','DOLDURULACAK',66),
  (67,'BT-067','Spring Yay','sensory','12 adetli','Metalik görünümlü, karakter desenli esnek oyuncak yay.','IMG-20260807-WA0063.webp','DOLDURULACAK','DOLDURULACAK',67),
  (68,'BT-068','Taraftar Stres Yayı','sensory','12 adetli','Taraftar renklerinden esinlenen desenli esnek stres yayı.','IMG-20260807-WA0064.webp','DOLDURULACAK','DOLDURULACAK',68),
  (69,'BT-069','Orta Boy Kapsül Tabanca','fun','DOLDURULACAK','Orta boy oyuncak kapsül tabanca; kapsül uyumluluğu ve güvenlik bilgisi DOLDURULACAK.','IMG-20260807-WA0066.webp','DOLDURULACAK','DOLDURULACAK',69),
  (70,'BT-070','Su Balonu Paketi','outdoor','60 adetli','Karışık renkli mini su balonlarından oluşan toplu paket.','IMG-20260807-WA0069.webp','DOLDURULACAK','DOLDURULACAK',70),
  (71,'BT-071','Sulu Defter','stationery','48 adetli','Su ile renklendirme etkinliğine yönelik mini aktivite defteri; karışık kapak.','IMG-20260807-WA0070.webp','DOLDURULACAK','DOLDURULACAK',71),
  (72,'BT-072','Mızıka Düdük','fun','28 adetli','Mızıka formunda üflemeli renkli düdük; toplu teşhir paketi.','IMG-20260807-WA0071.webp','DOLDURULACAK','DOLDURULACAK',72),
  (73,'BT-073','Örme Lastik Toka','accessory','60 adetli','Örme görünümlü renkli elastik saç tokaları; karışık paket.','IMG-20260807-WA0072.webp','DOLDURULACAK','DOLDURULACAK',73),
  (74,'BT-074','Kanarya Düdük','fun','35 adetli','Kuş sesini taklit etmeye yönelik renkli üflemeli düdük.','IMG-20260807-WA0073.webp','DOLDURULACAK','DOLDURULACAK',74),
  (75,'BT-075','Üflet Döndür','fun','48 adetli','Nefesle pervanesi dönen mini üflemeli oyuncak; karışık renk.','IMG-20260807-WA0074.webp','DOLDURULACAK','DOLDURULACAK',75),
  (76,'BT-076','İthal Rakam Küpü','skill','24 adetli','Döner halkalardaki rakam ve şekilleri eşleştirmeye yönelik silindir bulmaca.','IMG-20260807-WA0075.webp','DOLDURULACAK','DOLDURULACAK',76),
  (77,'BT-077','Karışık Desenli Mühür','stationery','60 adetli','Emoji ve karakter desenli mini baskı mührü; karışık model.','IMG-20260807-WA0077.webp','DOLDURULACAK','DOLDURULACAK',77),
  (78,'BT-078','Kutulu Mini Zekâ Küpü','skill','12 adetli','Tekli kutuda sunulan kompakt döner renk eşleştirme küpü.','IMG-20260807-WA0078.webp','DOLDURULACAK','DOLDURULACAK',78),
  (79,'BT-079','Görünmez Mürekkepli Kalem','stationery','48 adetli','Gizli yazı kullanımına yönelik görünmez mürekkepli kalem; ışık özelliği DOLDURULACAK.','IMG-20260807-WA0080.webp','DOLDURULACAK','DOLDURULACAK',79)
on conflict (sku) do update set
  name = excluded.name,
  category = excluded.category,
  pack = excluded.pack,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  updated_at = now();

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0068.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0068.webp') end,
    updated_at = now()
where sku = 'BT-004';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0028.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0028.webp') end,
    updated_at = now()
where sku = 'BT-009';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0043.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0043.webp') end,
    updated_at = now()
where sku = 'BT-011';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0065.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0065.webp') end,
    updated_at = now()
where sku = 'BT-013';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0051.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0051.webp') end,
    updated_at = now()
where sku = 'BT-014';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0045.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0045.webp') end,
    updated_at = now()
where sku = 'BT-015';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0046.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0046.webp') end,
    updated_at = now()
where sku = 'BT-016';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0048.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0048.webp') end,
    updated_at = now()
where sku = 'BT-017';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0039.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0039.webp') end,
    description = 'Ruj formunda, döndürmeli silgi; karışık desen.',
    updated_at = now()
where sku = 'BT-019';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0040.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0040.webp') end,
    updated_at = now()
where sku = 'BT-020';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0035.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0035.webp') end,
    updated_at = now()
where sku = 'BT-021';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0038.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0038.webp') end,
    name = 'Sweet Girl Bebek Seti',
    category = 'fun',
    description = 'Altı parçalı, birbirine takılarak birleştirilebilen mini bebek seti.',
    updated_at = now()
where sku = 'BT-022';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0076.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0076.webp') end,
    updated_at = now()
where sku = 'BT-023';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0061.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0061.webp') end,
    pack = 'DOLDURULACAK',
    description = 'Büyük boy oyuncak kapsül tabanca; kapsül uyumluluğu ve güvenlik bilgisi DOLDURULACAK.',
    updated_at = now()
where sku = 'BT-026';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0081.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0081.webp') end,
    updated_at = now()
where sku = 'BT-030';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0079.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0079.webp') end,
    updated_at = now()
where sku = 'BT-031';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0067.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0067.webp') end,
    updated_at = now()
where sku = 'BT-033';

update public.products
set gallery = case when gallery @> jsonb_build_array('IMG-20260807-WA0056.webp') then gallery else gallery || jsonb_build_array('IMG-20260807-WA0056.webp') end,
    updated_at = now()
where sku = 'BT-034';

select setval(
  pg_get_serial_sequence('public.products','id'),
  greatest((select coalesce(max(id), 1) from public.products), 1)
);

notify pgrst, 'reload schema';
commit;
