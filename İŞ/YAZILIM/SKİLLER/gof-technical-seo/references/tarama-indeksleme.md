# Tarama, indeksleme ve bağlantılar

Hedef URL'yi kullanıcı niyetiyle birlikte değerlendir: bu URL'nin indekslenmesi gerekiyor mu? Teknik olarak 200 dönmesi tek başına indekslenmesi gerektiğini göstermez. Önce erişim, yanıt/yönlendirme zinciri, canonical, robots meta/X-Robots-Tag ve robots.txt sinyallerini birbirinden ayır.

Dar hatada ilgili URL ve onu etkileyen şablon/bağlantı yeterli olabilir. Geniş denetimde sitemap ve sayfa tiplerinden envanter çıkar; ana sayfa, koleksiyon, ürün, içerik ve ilgili filtre/paginasyon yollarını kapsa. Çok sayıda URL'de önce temsilci örnekle kök nedeni bul, kapsamı kanıtlamak için gerekli taramayı tamamla. Erişim sınırı varsa tam tarama demeden kontrol edilen kapsamı yaz.

Canonical sinyalini mutlak indeks emri gibi yorumlama. Kullanıcının seçtiği canonical ile Google'ın seçtiğini ancak ilgili kaynak varsa kıyasla. Robots engeli ve noindex aynı işlem değildir; taranamayan sayfada noindex okunacağını varsayma. Kullanıcının hedefini doğrulamadan toplu noindex veya robots kuralı yazma.

Yönlendirmeyi içerik eşdeğerliğine göre planla; bütün kaldırılan URL'leri ana sayfaya atma. Kalıcı taşıma, geçici durum ve silinen ürün senaryolarını ayır. Alan adı ve canlı yönlendirme değişikliğini sırf SEO raporundan yetkilendirme.

Başlık, ana başlık, açıklama ve bağlantıları sayfanın gerçek niyetiyle değerlendir; karakter sayısını evrensel sıralama kuralı yapma. Filtrelerin, variant parametrelerinin ve paginasyonun hepsine aynı çözümü uygulama. Sitemap'te bulunmak indekslenme garantisi değildir.

Güncel teknik doğrulama için Google Search Central'ın ilgili canonical, robots, sitemap ve site taşıma rehberlerini kullan. Doğrulanmamış harici araç uyarısını kritik bulguya dönüştürme. Sırf header eksikliği, yapılandırılmış veri uyarısı veya puan düşüklüğünü otomatik SEO engeli sayma.

Resmî kaynak merkezi: `https://developers.google.com/search/docs`.
