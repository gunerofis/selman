import type { Metadata } from 'next'
import { HukukiSayfa } from '@/components/hukuki/HukukiSayfa'

export const metadata: Metadata = {
  title: 'Çerez politikası',
  description: 'Kullanılan çerezler, amaçları ve tercih yönetimi.',
  alternates: { canonical: '/cerez-politikasi' },
}

/** Metin hukukçudan gelecek; uydurulmaz. Bölüm başlıkları hazır,
 *  `icerik` doldurulunca sayfa tamamlanır. */
export default function Sayfa() {
  return (
    <HukukiSayfa
      baslik="Çerez politikası"
      ozet="Kullanılan çerezler, amaçları ve tercih yönetimi."
      guncelleme={null}
      bolumler={[
        { id: 'nedir', baslik: 'Çerez nedir' },
        { id: 'zorunlu', baslik: 'Zorunlu çerezler' },
        { id: 'olcum', baslik: 'Ölçüm çerezleri' },
        { id: 'pazarlama', baslik: 'Pazarlama çerezleri' },
        { id: 'yonetim', baslik: 'Tercih yönetimi' },
      ]}
    />
  )
}
