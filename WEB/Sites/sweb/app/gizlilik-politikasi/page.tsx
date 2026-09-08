import type { Metadata } from 'next'
import { HukukiSayfa } from '@/components/hukuki/HukukiSayfa'

export const metadata: Metadata = {
  title: 'Gizlilik politikası',
  description: 'Toplanan veri, işleme amacı, saklama süresi ve haklar.',
  alternates: { canonical: '/gizlilik-politikasi' },
}

/** Metin hukukçudan gelecek; uydurulmaz. Bölüm başlıkları hazır,
 *  `icerik` doldurulunca sayfa tamamlanır. */
export default function Sayfa() {
  return (
    <HukukiSayfa
      baslik="Gizlilik politikası"
      ozet="Toplanan veri, işleme amacı, saklama süresi ve haklar."
      guncelleme={null}
      bolumler={[
        { id: 'toplanan', baslik: 'Toplanan veriler' },
        { id: 'amac', baslik: 'İşleme amacı' },
        { id: 'paylasim', baslik: 'Üçüncü taraflar' },
        { id: 'saklama', baslik: 'Saklama süresi' },
        { id: 'guvenlik', baslik: 'Güvenlik' },
        { id: 'haklar', baslik: 'Haklarınız' },
      ]}
    />
  )
}
