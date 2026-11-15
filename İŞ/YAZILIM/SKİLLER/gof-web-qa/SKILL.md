---
name: gof-web-qa
description: Yayına/reklama hazırlık, açıkça istenen işlev-UX kontrolü veya birden çok akışın regresyon testi için kullan. Her küçük düzenleme sonrası otomatik tam denetim başlatmak ve yalnız SEO/hız raporu için kullanma.
---

# Web işlev ve yayına hazırlık kontrolü

Kullanıcının kabul koşullarını ve test edilecek ortamı belirle. Yerel çalışma, staging/tema önizlemesi ve canlı siteyi karıştırma. Test talebi yayınlama veya gerçek müşteri işlemi izni değildir.

Önce ilgili birincil kullanıcı yolunu doğrula. Mağaza ve etkileşimli sayfa için [kritik akışlar](references/kritik-akislar.md) rehberinden yalnız mevcut/istenen işlevleri seç. Tek bileşen regresyonunda bütün siteyi test etme; açıkça kapsamlı kontrol istenmişse test kapsamını daraltıp eksiksizmiş gibi sunma.

Mevcut yetkili tarayıcı/otomasyon aracını kullan. Windows uygulamasını kontrol etmek gerçekten gerekiyorsa kurulu computer-use skill'inin runtime, güvenlik ve onay rehberlerine uy; bu skill onların yerine geçmez. Tarayıcı erişimi yoksa kaynak/derleme kontrolünü görsel veya işlevsel doğrulama diye adlandırma.

Mobilde kritik eylem, dokunma/klavye, taşma, görünür odak ve gerekiyorsa hata/boş durumunu dene. Otomatik puanı tam erişilebilirlik veya satışa hazır oluş kanıtı sayma. Test sırasında ücretli sipariş, canlı form gönderimi veya kalıcı kayıt oluşturmayı açık yetki olmadan gerçekleştirme.

Bulgu biçimi: önem — sorun — yeniden üretim/kanıt — çözüm. Kullanıcı isterse Engelleyici / Kritik / Orta / Düşük gruplarını kullan. Tekrar kontrolde çözülenleri tekrar listeleme; yeniden görülmeyeni kesin çözüldü sayma. Doğrulama sınırını kısaca belirt.

Düzeltme de istenmişse ilgili geliştirici skill'iyle onar; aynı başarısız testi değişikliksiz döngüye sokma. Sonuçta neyin geçtiğini, neyin kaldığını ve yayına çıkılıp çıkılmadığını ayrı bildir.
