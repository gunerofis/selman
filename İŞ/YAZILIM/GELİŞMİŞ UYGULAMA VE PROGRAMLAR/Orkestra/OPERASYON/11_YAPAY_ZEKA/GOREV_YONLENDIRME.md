# Görevden süreç ve skill'e yönlendirme

Birincil işin satırını seç; birden çok birimi etkileyen görevde yalnız gerekli ek süreçleri oku. Skill'ler bu depoda talimat kaynaklarıdır, araç veya bağlantı kurulumu değildir.

| Görev | Önce okunacak süreç | Skill |
|---|---|---|
| Şirket çapında görev / öncelik / devir | [Görev düzeni](../00_YONETIM/GOREV_VE_DEVIR.md) | [operasyon-merkez](../.agents/skills/operasyon-merkez/SKILL.md) |
| Beş site arasında iş dağılımı | [Site envanteri](../00_YONETIM/ENVANTER.md) ve ilgili SITE_KARTI.md | [operasyon-web-portfoy](../.agents/skills/operasyon-web-portfoy/SKILL.md) |
| Ülke / dış kanal hazırlığı | [Dış satış](../02_YURT_DISI/SUREC.md) | [operasyon-dis-satis](../.agents/skills/operasyon-dis-satis/SKILL.md) |
| SKU, sipariş, rezervasyon | [Ürün / stok](../03_URUN_STOK/SUREC.md) | [operasyon-siparis-stok](../.agents/skills/operasyon-siparis-stok/SKILL.md) |
| Tahsilat, iade, belge / bakiye | [Muhasebe](../04_MUHASEBE/SUREC.md), gerekiyorsa [nakit / bütçe](../04_MUHASEBE/NAKIT_VE_BUTCE.md) | [operasyon-muhasebe](../.agents/skills/operasyon-muhasebe/SKILL.md) |
| Paket, teslimat, fiziksel iade | [Kargo](../05_KARGO/SUREC.md) | [operasyon-kargo](../.agents/skills/operasyon-kargo/SKILL.md) |
| Teklif, toptan sipariş | [Toptan satış](../06_TOPTAN_SATIS/SUREC.md) | [operasyon-toptan](../.agents/skills/operasyon-toptan/SKILL.md) |
| Sistem bağlantısı / ortak veri | [Ana kaynaklar](../07_ALTYAPI/ANA_KAYNAKLAR.md) | [operasyon-entegrasyon](../.agents/skills/operasyon-entegrasyon/SKILL.md) |
| ChatGPT / Grok / Grokbot / Codex görevi | [AI koordinasyonu](KOORDINASYON.md) | [operasyon-ai-koordinasyon](../.agents/skills/operasyon-ai-koordinasyon/SKILL.md) |
| Satın alma, üretim, kalite | [Tedarik / üretim](../12_SATIN_ALMA_URETIM/SUREC.md) | [operasyon-tedarik-uretim](../.agents/skills/operasyon-tedarik-uretim/SKILL.md) |
| Müşteri talebi ve çözüm | [Müşteri ilişkileri](../13_MUSTERI_ILISKILERI/SUREC.md) | [operasyon-musteri](../.agents/skills/operasyon-musteri/SKILL.md) |
| Kampanya, yayın ve ölçüm | [Pazarlama](../14_PAZARLAMA/SUREC.md) | [operasyon-pazarlama](../.agents/skills/operasyon-pazarlama/SKILL.md) |
| Personel / idari görev | [İdari süreç](../15_INSAN_KAYNAKLARI_IDARI/SUREC.md) | [operasyon-idari](../.agents/skills/operasyon-idari/SKILL.md) |
| Sözleşme / vade | [Sözleşme](../16_SOZLESME_UYUM/SUREC.md) | [operasyon-idari](../.agents/skills/operasyon-idari/SKILL.md) |
| Zimmet / bakım | [Varlık](../17_VARLIK_BAKIM/SUREC.md) | [operasyon-idari](../.agents/skills/operasyon-idari/SKILL.md) |
| Şirket / birim raporu | [Gösterge sözlüğü](../09_RAPORLAR/GOSTERGE_SOZLUGU.md) ve ilgili birim süreci | Raporlanan birimin skill'i; yalnız tablo biçimi için zorunlu değil |
| Kabul / doğrulama | [Senaryolar](../18_DOGRULAMA/SENARYOLAR.md), [kabul kaydı](../18_DOGRULAMA/KABUL_KAYDI.md) | Test edilen sürecin skill'i |
| Agent yönergesi / basit belge düzeltmesi | [Kök kurallar](../AGENTS.md) ve değiştirilen kaynak | Sırf dosya düzenlendiği için ek skill gerekmez |

Yeni yazılım görevi ayrıca [uygulama kapsamını](../07_ALTYAPI/MERKEZI_UYGULAMA_KAPSAMI.md) izler. SEO, Shopify, tasarım veya başka uzmanlık gerektiğinde oturumda gerçekten mevcut olan ilgili skill kullanılır; makineye özgü skill yolu başka araca taşınmaz. Uygun skill yoksa bunu açıkça belirtip yetkili işi mevcut araçlarla tamamla.
