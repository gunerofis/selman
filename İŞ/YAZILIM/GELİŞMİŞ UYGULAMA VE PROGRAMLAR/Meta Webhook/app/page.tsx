export default function Home() {
  return <main className="mx-auto max-w-3xl px-6 py-16 text-zinc-800">
    <p className="mb-4 text-sm font-medium text-zinc-500">GÜNER OFİS · MAKRO OFİS</p>
    <h1 className="mb-5 text-4xl font-semibold tracking-tight">İş Merkezi</h1>
    <p className="mb-10 text-lg leading-8">Yetkili Facebook ve Instagram hesaplarının merkezi yönetimi için kullanılan işletme uygulaması.</p>
    <nav className="flex flex-wrap gap-5 border-t border-zinc-200 pt-6" aria-label="Bilgi sayfaları">
      <a className="underline underline-offset-4" href="/privacy">Gizlilik politikası</a>
      <a className="underline underline-offset-4" href="/data-deletion">Veri silme talebi</a>
    </nav>
  </main>;
}
