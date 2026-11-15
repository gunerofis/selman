# Çalışma Düzeni (Workflow)

## Görev Dağılımı

| Ajan | Sorumluluk |
|------|------------|
| **OpenCode** | Kod / site dosyaları (okuma, yazma, düzenleme, test çalıştırma) |
| **Goose** | Genel görevler, araştırma, MCP entegrasyonları |
| **OpenClaw** | Sürekli çalışan asistan / kanal otomasyonu (mesajlaşma, bildirim, zamanlanmış işler) |
| **Ollama** | Ortak yerel model sunucusu (tüm ajanlar buraya bağlanır) |
| **Lemonade** | İleride test edilecek NPU alternatif motoru (şu an beklemede) |

## Kurallar

1. **Zincirleme çağrı yok:** Ajanlar birbirlerini çağırmaz; her biri bağımsız çalışır.
2. **Eşzamanlı dosya yazımı yok:** Aynı proje dosyasını iki ajan aynı anda değiştirmez.
3. **Onay zorunlu:** Silme, canlıya yayınlama, dışarıya mesaj gönderme işlemleri kullanıcı onayı gerektirir.
4. **Model optimizasyonu ertelendi:** Model seçimi, bağlam boyutu ve NPU/GPU ayarlaması daha sonra yapılacak.