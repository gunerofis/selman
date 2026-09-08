import type { ReactNode } from 'react'
import { Kap } from '@/components/duzen/Kap'

export type Bolum = { id: string; baslik: string; icerik?: ReactNode }

/**
 * Hukuki sayfa şablonu: başlık, son güncelleme, içindekiler, numaralı
 * bölümler. Metin Faris'ten / hukukçudan gelecek — uydurulmuyor; `icerik`
 * boş bırakılan bölüm "Metin bekleniyor." gösterir.
 */
export function HukukiSayfa({
  baslik,
  ozet,
  guncelleme,
  bolumler,
}: {
  baslik: string
  ozet: string
  /** ISO tarih. Metin girilmeden null. */
  guncelleme: string | null
  bolumler: readonly Bolum[]
}) {
  return (
    <Kap className="py-8 md:py-12">
      <h1 className="yazi-display text-2xl">{baslik}</h1>
      <p className="yazi-mono mt-2">
        son güncelleme:{' '}
        {guncelleme ? (
          <time dateTime={guncelleme}>
            {new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' }).format(new Date(guncelleme))}
          </time>
        ) : (
          '—'
        )}
      </p>
      <p className="mt-3 max-w-[70ch] text-ikincil">{ozet}</p>

      <div className="dikis-ust mt-8 grid gap-10 pt-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="İçindekiler" className="h-fit lg:sticky lg:top-8">
          <p className="yazi-mono">içindekiler</p>
          <ol className="mt-3 space-y-1.5 text-sm">
            {bolumler.map((b, i) => (
              <li key={b.id}>
                <a href={`#${b.id}`} className="text-kahve hover:text-taba">
                  <span className="font-mono text-[13px] text-ikincil">{i + 1}.</span> {b.baslik}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-[70ch]">
          {bolumler.map((b, i) => (
            <section key={b.id} id={b.id} className="scroll-mt-8 border-b border-dashed border-dikis pb-8 pt-8 first:pt-0 last:border-b-0">
              <h2 className="yazi-display-orta text-lg">
                <span className="font-mono text-sm text-ikincil">{i + 1}.</span> {b.baslik}
              </h2>
              <div className="mt-3 space-y-3 text-ikincil">
                {b.icerik ?? <p>Metin bekleniyor.</p>}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Kap>
  )
}
