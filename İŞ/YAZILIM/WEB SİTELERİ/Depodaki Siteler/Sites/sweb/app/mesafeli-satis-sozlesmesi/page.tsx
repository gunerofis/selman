import type { Metadata } from 'next'
import { HukukiSayfa } from '@/components/hukuki/HukukiSayfa'

export const metadata: Metadata = {
  title: 'Mesafeli satış sözleşmesi',
  description: 'Satıcı, alıcı, ürün, bedel, teslim ve cayma koşulları.',
  alternates: { canonical: '/mesafeli-satis-sozlesmesi' },
}

/** Metin hukukçudan gelecek; uydurulmaz. Bölüm başlıkları hazır,
 *  `icerik` doldurulunca sayfa tamamlanır. */
export default function Sayfa() {
  return (
    <HukukiSayfa
      baslik="Mesafeli satış sözleşmesi"
      ozet="Satıcı, alıcı, ürün, bedel, teslim ve cayma koşulları."
      guncelleme={null}
      bolumler={[
        { id: 'taraflar', baslik: 'Taraflar' },
        { id: 'konu', baslik: 'Konu' },
        { id: 'urun', baslik: 'Ürün ve bedel' },
        { id: 'odeme', baslik: 'Ödeme' },
        { id: 'teslim', baslik: 'Teslimat' },
        { id: 'cayma', baslik: 'Cayma hakkı' },
        { id: 'uyusmazlik', baslik: 'Uyuşmazlık' },
      ]}
    />
  )
}
