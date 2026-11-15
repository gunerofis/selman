'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSepet } from '@/lib/sepet'
import { renkBul } from '@/lib/renkler'
import { gorselFor } from '@/lib/urunler'
import { fiyat } from '@/lib/bicim'
import { ButonLink } from '@/components/ui/Buton'

export function SepetListesi({ ozetli = true }: { ozetli?: boolean }) {
  const { satirlar, adetDegistir, cikar, araToplamKurus, hazir } = useSepet()

  if (!hazir) return <div className="dikis-ust mt-8 pt-8 text-ikincil">Sepet açılıyor…</div>

  if (satirlar.length === 0) {
    return (
      <div className="dikis-ust mt-8 pt-8">
        <p className="text-ikincil">Sepetiniz boş.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButonLink href="/koleksiyon">Ürünlere bak</ButonLink>
          <ButonLink href="/kurumsal-teklif" tur="cerceve">
            Teklif iste
          </ButonLink>
        </div>
      </div>
    )
  }

  return (
    <div className="dikis-ust mt-8 grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <ul>
        {satirlar.map((s) => {
          const renk = renkBul(s.renk)
          return (
            <li
              key={`${s.kod}-${s.renk}`}
              className="flex gap-4 border-b border-dashed border-dikis py-5 first:pt-0"
            >
              <Link href={`/urun/${s.urun.slug}`} className="shrink-0">
                <div className="relative h-16 w-24 overflow-hidden bg-sut">
                  <Image src={gorselFor(s.urun, s.renk)} alt="" fill sizes="96px" className="object-contain" />
                </div>
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <Link href={`/urun/${s.urun.slug}`} className="truncate font-medium hover:text-taba">
                    {s.urun.ad}
                  </Link>
                  <span className="yazi-mono shrink-0">{s.kod}</span>
                </div>
                <p className="yazi-mono mt-1">{renk?.ad.toLowerCase()}</p>

                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div className="flex items-center border border-dikis-koyu">
                    <button
                      type="button"
                      aria-label="Adet azalt"
                      onClick={() => adetDegistir(s.kod, s.renk, s.adet - 1)}
                      className="px-3 py-1.5 text-kahve hover:bg-sut"
                    >
                      −
                    </button>
                    <span
                      aria-live="polite"
                      className="min-w-9 px-1 text-center font-mono text-sm"
                    >
                      {s.adet}
                    </span>
                    <button
                      type="button"
                      aria-label="Adet artır"
                      onClick={() => adetDegistir(s.kod, s.renk, s.adet + 1)}
                      className="px-3 py-1.5 text-kahve hover:bg-sut"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-mono text-sm">{fiyat(s.urun.fiyatKurus)}</span>

                  <button
                    type="button"
                    onClick={() => cikar(s.kod, s.renk)}
                    className="text-sm text-ikincil underline underline-offset-2 hover:text-bordo"
                  >
                    Ürünü çıkar
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {ozetli ? (
        <aside className="h-fit border border-dikis bg-kagit p-4">
          <h2 className="yazi-display-orta text-lg">Özet</h2>
          <dl className="mt-3 text-sm">
            <div className="flex justify-between border-b border-dashed border-dikis py-[7px]">
              <dt>Ara toplam</dt>
              <dd className="font-mono text-[13px]">{fiyat(araToplamKurus)}</dd>
            </div>
            <div className="flex justify-between border-b border-dashed border-dikis py-[7px]">
              <dt>Kargo</dt>
              <dd className="font-mono text-[13px]">Ödeme adımında</dd>
            </div>
          </dl>
          {araToplamKurus == null ? (
            <p className="mt-3 text-[13px] text-ikincil">
              Fiyatlar girilmedi; tutar ödeme adımında kesinleşir.
            </p>
          ) : null}
          <ButonLink href="/odeme" className="mt-5 w-full">
            Ödemeye geç
          </ButonLink>
        </aside>
      ) : null}
    </div>
  )
}
