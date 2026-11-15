'use client'

import { Alan } from '@/components/ui/Alan'
import { Form } from './Form'
import { MetinAlani } from './MetinAlani'
import * as d from '@/lib/dogrula'

export function IletisimFormu() {
  return (
    <Form
      uc="/api/iletisim"
      gonderEtiketi="Mesaj gönder"
      basarili="Mesajınız alındı. Bir iş günü içinde dönüş yapılacak."
      dogrula={(v) =>
        d.topla({
          ad: d.metin(v.ad),
          eposta: d.eposta(v.eposta),
          mesaj: d.metin(v.mesaj, 10, 2000),
        })
      }
      alanlar={(h) => (
        <>
          <Alan id="ad" name="ad" etiket="ad soyad" placeholder="Ad Soyad" autoComplete="name" required hata={h.ad} />
          <Alan id="eposta" name="eposta" type="email" etiket="e-posta" ipucu="ad@firma.com" autoComplete="email" required hata={h.eposta} />
          <Alan id="siparis" name="siparis" etiket="sipariş no" placeholder="Varsa" />
          <MetinAlani id="mesaj" name="mesaj" etiket="mesaj" rows={5} required minLength={10} hata={h.mesaj} />
        </>
      )}
    />
  )
}
