# OPERASYON
Şirketin tüm organlarının tek merkezden yönetimi için çalışma ve geliştirme altyapısı.

**Mevcut:** şirket süreçleri, ortak görev / birim / sistem kayıtları, 13 yerel skill, AI görev ve devir şablonları, rapor ölçütleri ve yapısal doğrulama aracı.
**Uygulama bekliyor:** gerçek kişi / sistem envanteri, merkezi yönetim yazılımı, canlı bağlantılar ve gerçek iş kabul testleri.

| İhtiyaç | Başvuru |
|---|---|
| Genel çalışma ağacı | [Başlangıç](BASLANGIC.md) |
| Şirketin birimleri | [Yönetim modeli](00_YONETIM/SIRKET_YONETIM_MODELI.md) |
| Yapılacak işler | [İş takibi](00_YONETIM/IS_TAKIBI.md) |
| Görev nasıl devredilir | [Görev ve devir](00_YONETIM/GOREV_VE_DEVIR.md) |
| Kim hangi işi sahiplenir | [Rol ve yetki](00_YONETIM/ROL_VE_YETKI.md) |
| Bağlantılar ve eksik bilgiler | [Sistem envanteri](00_YONETIM/kayitlar/sistemler.json), [bilgi kaydı](00_YONETIM/EKSIK_BILGI_KAYDI.md) |
| ChatGPT, Grok, Grokbot ve Codex | [Koordinasyon](11_YAPAY_ZEKA/KOORDINASYON.md) |
| Yazılımda kurulacak yapı | [Uygulama kapsamı](07_ALTYAPI/MERKEZI_UYGULAMA_KAPSAMI.md) |
| Skill kaynakları | [Skill planı](08_SKILL_CALISMALARI/PLAN.md) |
| Raporlama | [Gösterge sözlüğü](09_RAPORLAR/GOSTERGE_SOZLUGU.md) |
| Kabul ve doğrulama | [Senaryolar](18_DOGRULAMA/SENARYOLAR.md), [yapı kontrolü](00_YONETIM/YAPI_KONTROLU.md) |

Windows yapı kontrolü: `powershell -NoProfile -File .\scripts\validate.ps1`.
İş kaydı değişince görünümü üretmek için aynı komuta `-WriteIndex` eklenir.
Python ile: `python scripts/validate_structure.py --write-index` (Python 3.10+; ek paket gerekmez).

## Agent girişi
Bu depoda çalışacak agent önce [AGENTS.md](AGENTS.md), ardından [başlangıç rehberini](11_YAPAY_ZEKA/AGENT_BASLANGIC.md) okur. [Görev yönlendirme tablosu](11_YAPAY_ZEKA/GOREV_YONLENDIRME.md) ilgili süreç ve skill'i seçtirir. Başka bir sohbete verilecek [giriş metni](11_YAPAY_ZEKA/AGENT_GIRIS_PROMPTU.md) hazırdır.
