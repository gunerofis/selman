---
name: faprika-safe-customization
description: Faprika veya benzer panelden CSS/JavaScript enjekte edilen e-ticaret sitelerinde kapsüllenmiş, idempotent ve tek parça özelleştirme geliştirir. Normal kaynak kodlu web projelerinde kullanma. Use when the user runs /faprika-safe-customization.
---

# Faprika Safe Customization

Panel enjeksiyonunun tema, AJAX render, sepet, varyant ve checkout davranışını bozmamasını sağla.

## Girdiler

- Canlı veya temsilî gerçek DOM, hedef sayfalar ve Faprika ekleme noktası
- İstenen görünüm/davranış, dil sürümleri ve mobil bileşenler
- Mevcut özel CSS/JavaScript ile tema güncelleme kısıtları

## Akış

1. Altyapının gerçekten Faprika veya benzer panel enjeksiyonu olduğunu ve gerçek DOM seçicilerini doğrula.
2. Tüm class, ID, data attribute, style ve global isimleri projeye özel namespace ile kapsülle.
3. Kullanıcı tek parça kod istediyse gerekli CSS ve JavaScript'i doğrudan uygulanabilir tek blokta teslim et.
4. Kurulumu idempotent yap; tekrar çalışmada duplicate style, element, event, observer veya global oluşturma.
5. Genel `div`, `a`, `img`, `.container` veya `.button` seçicilerini ezme; kırılgan metin/nth-child seçicilerinden kaçın.
6. Dinamik içerikte hafif event delegation kullan; MutationObserver yalnız gerekliyse dar kökte ve ucuz callback ile çalışsın.
7. Native sepet, varyant, checkout ve ödeme scriptlerini değiştirme; gereksiz `preventDefault` veya event durdurma yapma.
8. TR/EN/AR, RTL, mobil sticky alan, modal/popup ve AJAX yeniden render davranışını gerçek sitede doğrula.

## Beklenen çıktı

- Nereye ekleneceği belirtilmiş tek uygulanabilir kod bloğu
- Namespace/idempotency açıklaması ve test edilen sayfalar
- Canlı doğrulama yapılamadıysa açık sınırlama

## Tamamlanma ölçütü

Kod tekrar çalıştırıldığında çoğalmaz, hedef DOM dışında stil/davranış sızdırmaz ve kritik e-ticaret akışını gerçek tarayıcıda bozmadığı doğrulanır.
