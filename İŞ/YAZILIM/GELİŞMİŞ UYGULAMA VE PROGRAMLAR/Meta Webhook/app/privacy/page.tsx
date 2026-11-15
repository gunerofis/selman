export default function Privacy() {
  return <main className="mx-auto max-w-3xl space-y-6 px-6 py-14 leading-7 text-zinc-800">
    <a className="underline" href="/">İş Merkezi</a>
    <h1 className="text-3xl font-semibold">Gizlilik politikası</h1>
    <p>Son güncelleme: 10 Kasım 2026. Bu politika, Güner Ofis ve Makro Ofis tarafından kullanılan İş Merkezi uygulamasının Meta bağlantısını kapsar. Meta uygulama kimliği: 3905225382967988.</p>
    <h2 className="text-xl font-semibold">İşlenen bilgiler ve amaç</h2>
    <p>Uygulama, yetkili işletme hesaplarının profil bilgilerini, gönderilerini, yorumlarını, mesajlarını, hesap istatistiklerini, reklam hesaplarını, kataloglarını ve dönüşüm verilerini verilen API izinleri kapsamında yönetmek için kullanılır. Erişim yalnızca işletme tarafından yetkilendirilen hesap ve varlıklarla sınırlıdır.</p>
    <h2 className="text-xl font-semibold">Webhook bildirimleri</h2>
    <p>Meta, hesap değişikliklerini HTTPS alıcısına iletir. Gelen bildirimin imzası doğrulanır. Alıcıda yalnızca işletme hesabı kimliği, bildirim türü, değişen alan, zaman ve tekrarları ayırt eden özet değer saklanır. Mesaj metni, ekler ve müşterilerin kimlik bilgileri bu alıcının kayıtlarına yazılmaz.</p>
    <h2 className="text-xl font-semibold">Saklama ve erişim</h2>
    <p>Bildirim kayıtları 30 gün boyunca yetkili merkezi uygulamadan okunabilir; eski kayıtlar sonraki bildirim alımında temizlenir. İşletmenin merkezi sistemindeki diğer kayıtlar, işletme süreçlerinin ve geçerli saklama yükümlülüklerinin gerektirdiği süreyle tutulur. Erişim anahtarları herkese açık sayfalarda gösterilmez.</p>
    <h2 className="text-xl font-semibold">Hizmet sağlayıcılar</h2>
    <p>Bu sayfa ve bildirim alıcısı Sites barındırması ve Cloudflare altyapısı üzerinde çalışır. Meta bağlantısı için gereken bilgiler Meta ile, barındırma için gereken bilgiler altyapı sağlayıcılarıyla işlenir. Alıcıdaki bildirim kayıtları herkese açık değildir.</p>
    <h2 className="text-xl font-semibold">İletişim ve silme</h2>
    <p>Verilerinizle ilgili erişim, düzeltme veya silme talebinizi <a className="underline" href="mailto:sumentakimicom@gmail.com">sumentakimicom@gmail.com</a> adresine iletebilirsiniz. <a className="underline" href="/data-deletion">Veri silme talimatları</a>.</p>
  </main>;
}
