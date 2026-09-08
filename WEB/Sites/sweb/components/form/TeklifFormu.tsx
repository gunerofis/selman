'use client'

import { Alan } from '@/components/ui/Alan'
import { Form } from './Form'
import { MetinAlani } from './MetinAlani'
import * as d from '@/lib/dogrula'

export function TeklifFormu({ kod }: { kod?: string }) {
  return (
    <Form
      uc="/api/teklif"
      gonderEtiketi="Teklif iste"
      basarili="Talebiniz alındı. İki iş günü içinde fiyat ve teslim planıyla dönüş yapılacak."
      dogrula={(v) =>
        d.topla({
          firma: d.metin(v.firma),
          kisi: d.metin(v.kisi),
          eposta: d.eposta(v.eposta),
          telefon: d.telefon(v.telefon),
          adet: d.sayi(v.adet, 1, 100000),
        })
      }
      alanlar={(h) => (
        <>
          <Alan id="firma" name="firma" etiket="firma" placeholder="Firma adı" autoComplete="organization" required hata={h.firma} />
          <Alan id="kisi" name="kisi" etiket="yetkili" placeholder="Ad Soyad" autoComplete="name" required hata={h.kisi} />
          <Alan id="eposta" name="eposta" type="email" etiket="e-posta" ipucu="ad@firma.com" autoComplete="email" required hata={h.eposta} />
          <Alan id="telefon" name="telefon" type="tel" etiket="telefon" ipucu="5xx xxx xx xx" autoComplete="tel" hata={h.telefon} />
          <Alan id="adet" name="adet" type="number" min={1} etiket="adet" placeholder="100" required hata={h.adet} />
          <MetinAlani
            id="not"
            name="not"
            etiket="not"
            rows={4}
            placeholder="Ürün kodu, renk, teslim tarihi"
            defaultValue={kod ? `Ürün kodu: ${kod}` : undefined}
            hata={h.not}
          />
        </>
      )}
    />
  )
}
