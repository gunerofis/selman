import Link from 'next/link'
import { UrunGorseli } from '@/components/ui/UrunGorseli'
import { Mono } from '@/components/ui/Mono'
import { fiyat } from '@/lib/bicim'
import { gorselFor, type Urun } from '@/lib/urunler'
import type { RenkAnahtari } from '@/lib/renkler'

/** Listelerde tek ürün gösterimi. Kategori, koleksiyon ve benzer ürünler
 *  aynı kartı kullanır; görünüm tek yerden değişir. */
export function UrunKarti({
  urun,
  oncelik = false,
  zemin,
  renk,
}: {
  urun: Urun
  oncelik?: boolean
  /** Renk görünümü seçiliyse kartın zemini o renge döner — duvarla aynı davranış. */
  zemin?: string
  /** O rengin çekimi varsa görsel de değişir. */
  renk?: RenkAnahtari | null
}) {
  return (
    <Link href={`/urun/${urun.slug}`} className="group block">
      <UrunGorseli kaynak={gorselFor(urun, renk)} alt="" oncelik={oncelik} zemin={zemin} />
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="min-w-0 truncate text-sm font-medium group-hover:text-taba">
          {urun.ad}
        </span>
        <Mono className="shrink-0">{urun.kod}</Mono>
      </div>
      <span className="mt-0.5 block font-mono text-[13px] text-kahve">{fiyat(urun.fiyatKurus)}</span>
    </Link>
  )
}
