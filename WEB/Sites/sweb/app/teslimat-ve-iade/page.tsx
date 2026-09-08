import type { Metadata } from 'next'
import { HukukiSayfa } from '@/components/hukuki/HukukiSayfa'

export const metadata: Metadata = {
  title: 'Teslimat ve iade',
  description: 'Kargo süresi, teslim koşulları, iade ve değişim adımları.',
  alternates: { canonical: '/teslimat-ve-iade' },
}

/** Metin hukukçudan gelecek; uydurulmaz. Bölüm başlıkları hazır,
 *  `icerik` doldurulunca sayfa tamamlanır. */
export default function Sayfa() {
  return (
    <HukukiSayfa
      baslik="Teslimat ve iade"
      ozet="Kargo süresi, teslim koşulları, iade ve değişim adımları."
      guncelleme={null}
      bolumler={[
        { id: 'sure', baslik: 'Teslim süresi' },
        { id: 'kargo', baslik: 'Kargo' },
        { id: 'teslim-alma', baslik: 'Teslim alma' },
        { id: 'iade', baslik: 'İade' },
        { id: 'degisim', baslik: 'Değişim' },
        { id: 'hasarli', baslik: 'Hasarlı ürün' },
      ]}
    />
  )
}
