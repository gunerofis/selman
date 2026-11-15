# Section, template ve görünürlük

“Dosyayı ekledim ama görünmüyor” hatasında önce sayfanın gerçekten kullandığı tema/template'i doğrula. Yeni bir script daha yapıştırmak ilk teşhis yöntemi değildir.

Bileşen DOM'da yoksa template/section bağını, render çağrısını, koşullu Liquid'i ve eksik veri nedeniyle boş dönen dalları incele. DOM'da varsa computed style, boyut, overflow, stacking ve breakpoint davranışına bak. JS ile sonradan oluşuyorsa gerçek hata/başlatma noktasını kontrol et; tahmine dayalı sürekli zamanlayıcı ekleme.

Yeni section dosyası oluşturmanın onu her sayfaya kendiliğinden eklediğini varsayma. Hedef JSON template veya mevcut render düzeniyle bağlantısını ve tema düzenleyicisindeki eklenebilirliğini kontrol et. JSON template'i bütünüyle yeniden yazarak mevcut section sırası ve ayarlarını kaybetme. Schema/settings kimliklerini ve çeviri anahtarlarını mevcut yapıya uydur.

Bileşen yeniden render edildiğinde event listener ve observer'lar çoğalmasın. Tema düzenleyicisi veya Section Rendering API devredeyse ilgili lifecycle davranışını resmî dokümandan doğrula. Inline script'in her HTML ekleme yönteminde otomatik çalıştığını varsayma.

İsim çakışmasını mevcut naming convention ve instance'a özgü kimlikle önle. Genel `h1`, `button` veya tüm sayfaya etki eden seçiciyi gerekçesiz kullanma. Müşterinin güncel isteği bütün siteyi hedefliyorsa global değişiklik kapsam dahilinde olabilir.

En dar doğrulama: hedef sayfada görünüm, en az ilgili mobil/masaüstü düzeni, iki instance varsa bağımsız çalışma, hata konsolu ve ana aksiyon. Sorun çözüldüğünde başka template'leri refactor etme.

Resmî kaynak: `https://shopify.dev/docs/storefronts/themes/architecture` (12 Eylül 2026). Section/JSON davranışında ilgili alt dokümanı kurulu tema yapısına göre doğrula.
