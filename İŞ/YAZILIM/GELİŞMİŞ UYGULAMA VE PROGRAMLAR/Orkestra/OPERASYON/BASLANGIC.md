# OPERASYON
Kurulum: 14.09.2026. Ana amaç şirketin tüm organlarının tek merkezden yönetimidir. Web siteleri ve AI araçları bu yapının bileşenleridir.
Bu depo plan, iş kaydı ve geliştirme altyapısıdır. Merkezi yazılım, gerçek kişi atamaları ve ChatGPT / Grok / Grokbot bağlantıları henüz kurulmadı. SUMEN-01–04 ve SWEB-01 geçici site kodlarıdır.

| Alan | İçerik |
|---|---|
| [00_YONETIM](00_YONETIM/SIRKET_YONETIM_MODELI.md) | Şirket modeli, görev, rol, envanter ve plan |
| [01_WEB_SITELERI](00_YONETIM/ENVANTER.md) | Dört SÜMEN ve bir SWEB site kartı |
| [02_YURT_DISI](02_YURT_DISI/SUREC.md) | Ülke, kanal ve dış satış |
| [03_URUN_STOK](03_URUN_STOK/SUREC.md) | Katalog, varyant, stok |
| [04_MUHASEBE](04_MUHASEBE/SUREC.md) | Tahsilat, belge, mutabakat, nakit / bütçe |
| [05_KARGO](05_KARGO/SUREC.md) | Paket, sevkiyat ve iade |
| [06_TOPTAN_SATIS](06_TOPTAN_SATIS/SUREC.md) | Müşteri, teklif, toplu sipariş |
| [07_ALTYAPI](07_ALTYAPI/MERKEZI_UYGULAMA_KAPSAMI.md) | Yazılım kapsamı, veri, bağlantı ve kurtarma |
| [08_SKILL_CALISMALARI](08_SKILL_CALISMALARI/PLAN.md) | 13 yerel skill ve pilot planı |
| [09_RAPORLAR](09_RAPORLAR/HAFTALIK_RAPOR_SABLONU.md) | Şirket / birim raporu ve gösterge sözlüğü |
| [10_ARSIV](10_ARSIV) | Kapanmış çalışmalar |
| [11_YAPAY_ZEKA](11_YAPAY_ZEKA/KOORDINASYON.md) | Araç koordinasyonu ve devir paketleri |
| [12_SATIN_ALMA_URETIM](12_SATIN_ALMA_URETIM/SUREC.md) | Tedarik, üretim ve kalite |
| [13_MUSTERI_ILISKILERI](13_MUSTERI_ILISKILERI/SUREC.md) | Talep, destek ve çözüm |
| [14_PAZARLAMA](14_PAZARLAMA/SUREC.md) | Kampanya, içerik ve ölçüm |
| [15_INSAN_KAYNAKLARI_IDARI](15_INSAN_KAYNAKLARI_IDARI/SUREC.md) | Personel görevleri ve idari işler |
| [16_SOZLESME_UYUM](16_SOZLESME_UYUM/SUREC.md) | Sözleşme ve yükümlülük takibi |
| [17_VARLIK_BAKIM](17_VARLIK_BAKIM/SUREC.md) | Varlık, zimmet ve bakım |
| [18_DOGRULAMA](18_DOGRULAMA/SENARYOLAR.md) | Kabul senaryoları ve kanıt şablonu |
| [.agents/skills](.agents/skills) | Projeye ait skill kaynakları |
| [scripts](scripts) | Kayıt / bağlantı denetimi ve iş görünümü üretimi |

[İş takibi](00_YONETIM/IS_TAKIBI.md) uygulama sırasını; [eksik bilgi kaydı](00_YONETIM/EKSIK_BILGI_KAYDI.md) gerçek bağlantılar için gereken bilgileri gösterir. Kayıtları değiştirme biçimi [veri sözleşmesinde](00_YONETIM/kayitlar/VERI_SOZLESMESI.md) tanımlıdır.

## Agent için giriş noktası
[Kök kurallar](AGENTS.md) → [agent başlangıcı](11_YAPAY_ZEKA/AGENT_BASLANGIC.md) → [görev yönlendirme](11_YAPAY_ZEKA/GOREV_YONLENDIRME.md) → ilgili iş, süreç ve skill. Oturum değişiminde [devir şablonu](11_YAPAY_ZEKA/DEVIR_SABLONU.md) kullanılır.
