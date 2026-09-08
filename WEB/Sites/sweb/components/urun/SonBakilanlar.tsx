'use client'

import { useEffect, useState } from 'react'
import { UrunKarti } from '@/components/kategori/UrunKarti'
import { ekle, oku } from '@/lib/son-bakilanlar'
import type { Urun } from '@/lib/urunler'

/**
 * Son bakılanlar şeridi.
 *
 * Okuma mount sonrasında yapılıyor — sunucuda localStorage yok, ilk render
 * boş listeyle eşleşiyor, hydration uyuşmazlığı çıkmıyor. `kaydet` verilen
 * sayfada ürün ayrıca listeye yazılıyor; şerit o ürünü kendi içinde
 * göstermiyor.
 */
export function SonBakilanlar({ kaydet }: { kaydet?: string }) {
  const [urunler, setUrunler] = useState<readonly Urun[]>([])

  useEffect(() => {
    // Önce mevcut listeyi oku, sonra bu ürünü başa al: kullanıcı kendi
    // baktığı sayfayı şeritte görmesin.
    setUrunler(oku().filter((u) => u.kod !== kaydet))
    if (kaydet) ekle(kaydet)
  }, [kaydet])

  if (urunler.length === 0) return null

  return (
    <section className="dikis-ust mt-12 pt-8">
      <h2 className="yazi-mono">son bakılanlar</h2>
      <ul className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-4">
        {urunler.slice(0, 4).map((u) => (
          <li key={u.kod}>
            <UrunKarti urun={u} />
          </li>
        ))}
      </ul>
    </section>
  )
}
