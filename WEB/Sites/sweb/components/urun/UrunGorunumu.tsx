'use client'

import { useState, type ReactNode } from 'react'
import { UrunGorseli } from '@/components/ui/UrunGorseli'
import { UrunSecim } from './UrunSecim'
import { RENKLER, type RenkAnahtari } from '@/lib/renkler'
import { gorselFor, type Urun } from '@/lib/urunler'
import { fiyat } from '@/lib/bicim'

/**
 * Ürün sayfasının renge bağlı bölümü.
 *
 * Renk seçimi hem görseli hem zemini değiştiriyor; ikisi tek durumdan
 * besleniyor. Ölçü tablosu ve teklif kutusu sunucuda üretilip `children`
 * olarak geçiyor — renkten etkilenmeyen içerik istemciye taşınmıyor.
 */
export function UrunGorunumu({ urun, children }: { urun: Urun; children: ReactNode }) {
  const [renk, setRenk] = useState<RenkAnahtari>(urun.renkler[0])
  const secili = RENKLER.find((r) => r.anahtar === renk)
  // Bu ürünün o renk için ayrı çekimi var mı? Yoksa yalnız zemin döner.
  const ayriCekim = Boolean(urun.renkGorselleri?.[renk])

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-2">
      <UrunGorseli
        kaynak={gorselFor(urun, renk)}
        alt={`${urun.ad}, ${secili?.ad.toLowerCase()}`}
        oncelik
        zemin={ayriCekim ? undefined : secili?.zemin}
        boyutlar="(max-width: 1023px) 100vw, 50vw"
      />

      <div>
        <span className="yazi-mono">{urun.kod}</span>
        <h1 className="yazi-display mt-2 text-2xl">{urun.ad}</h1>
        <p className="mt-3 max-w-[62ch] text-ikincil">{urun.aciklama}</p>
        <p className="mt-5 font-mono text-lg text-kahve">{fiyat(urun.fiyatKurus)}</p>

        <div className="mt-8 border-t border-dashed border-dikis pt-6">
          <UrunSecim urun={urun} renk={renk} onRenk={setRenk} />
        </div>

        {children}
      </div>
    </div>
  )
}
