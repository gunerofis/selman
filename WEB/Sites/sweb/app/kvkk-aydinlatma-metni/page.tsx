import type { Metadata } from 'next'
import { HukukiSayfa } from '@/components/hukuki/HukukiSayfa'

export const metadata: Metadata = {
  title: 'KVKK aydınlatma metni',
  description: 'Veri sorumlusu, işleme amaçları ve ilgili kişi hakları.',
  alternates: { canonical: '/kvkk-aydinlatma-metni' },
}

/** Metin hukukçudan gelecek; uydurulmaz. Bölüm başlıkları hazır,
 *  `icerik` doldurulunca sayfa tamamlanır. */
export default function Sayfa() {
  return (
    <HukukiSayfa
      baslik="KVKK aydınlatma metni"
      ozet="Veri sorumlusu, işleme amaçları ve ilgili kişi hakları."
      guncelleme={null}
      bolumler={[
        { id: 'sorumlu', baslik: 'Veri sorumlusu' },
        { id: 'veriler', baslik: 'İşlenen kişisel veriler' },
        { id: 'amaclar', baslik: 'İşleme amaçları' },
        { id: 'hukuki', baslik: 'Hukuki sebep' },
        { id: 'aktarim', baslik: 'Aktarım' },
        { id: 'haklar', baslik: 'İlgili kişinin hakları' },
        { id: 'basvuru', baslik: 'Başvuru yolu' },
      ]}
    />
  )
}
