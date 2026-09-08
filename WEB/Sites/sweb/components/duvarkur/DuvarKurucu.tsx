'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { UrunGorseli } from '@/components/ui/UrunGorseli'
import { Buton } from '@/components/ui/Buton'
import { UrunSecici } from './UrunSecici'
import { useSepet } from '@/lib/sepet'
import { renkBul, type RenkAnahtari } from '@/lib/renkler'
import { URUNLER, gorselFor } from '@/lib/urunler'
import { fiyat } from '@/lib/bicim'
import {
  KENARLAR,
  adrestenDuvar,
  bosDuvar,
  doluSayisi,
  duvarAdresi,
  kalemler,
  kenarDegistir,
  toplamKurus,
  type Duvar,
  type Kenar,
} from '@/lib/duvar-kur'

const YEDEK_ANAHTAR = 'sweb-duvar-v1'

/**
 * Duvar kurucu.
 *
 * Durum adres çubuğunda: kurulan duvar bağlantı olarak paylaşılıyor, geri
 * tuşu adımları geri alıyor, hesap gerekmiyor. Adres boşsa tarayıcıdaki
 * son duvar geri yükleniyor — sekme kapanınca emek kaybolmasın.
 *
 * Yerleştirme "hücreye bas → ürün seç": sürükle-bırak yerine bu akış
 * seçildi, çünkü dokunmatikte ve klavyede aynı şekilde çalışıyor.
 */
export function DuvarKurucu() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const { ekle } = useSepet()

  const duvar = useMemo(
    () => adrestenDuvar(params.get('n'), params.get('h')),
    [params],
  )
  const [acikHucre, setAcikHucre] = useState<number | null>(null)
  const [sonRenk, setSonRenk] = useState<RenkAnahtari>('taba')
  const [eklendi, setEklendi] = useState(0)

  const yaz = useCallback(
    (yeni: Duvar) => {
      const adres = pathname + duvarAdresi(yeni)
      router.replace(adres, { scroll: false })
      try {
        window.localStorage.setItem(YEDEK_ANAHTAR, duvarAdresi(yeni))
      } catch {
        // özel sekme: duvar yalnız adres çubuğunda kalır
      }
    },
    [pathname, router],
  )

  // Adres boşsa tarayıcıdaki son duvarı geri yükle. Mount sonrası çalışır,
  // sunucu çıktısıyla uyuşmazlık olmaz.
  useEffect(() => {
    if (params.get('h') || params.get('n')) return
    try {
      const kayit = window.localStorage.getItem(YEDEK_ANAHTAR)
      if (kayit && kayit.length > 4) router.replace(pathname + kayit, { scroll: false })
    } catch {
      // depolama kapalı: boş duvarla başlanır
    }
    // yalnız ilk açılışta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function yerlestir(sira: number, kod: string, renk: RenkAnahtari) {
    const hucreler = [...duvar.hucreler]
    hucreler[sira] = { kod, renk }
    setSonRenk(renk)
    const uygula = () => yaz({ ...duvar, hucreler })
    // Yerleştirme duvardaki değişimle aynı süreyi kullanır.
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      ;(document as Document & { startViewTransition: (f: () => void) => void }).startViewTransition(
        uygula,
      )
    } else uygula()
    setAcikHucre(null)
  }

  function bosalt(sira: number) {
    const hucreler = [...duvar.hucreler]
    hucreler[sira] = null
    yaz({ ...duvar, hucreler })
    setAcikHucre(null)
  }

  function kenarSec(k: Kenar) {
    yaz(kenarDegistir(duvar, k))
  }

  function hepsiniEkle() {
    const liste = kalemler(duvar)
    for (const k of liste) ekle(k.urun.kod, k.renk, k.adet)
    setEklendi(liste.reduce((t, k) => t + k.adet, 0))
  }

  const liste = kalemler(duvar)
  const dolu = doluSayisi(duvar)
  const toplam = toplamKurus(duvar)

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="yazi-mono" id="kenar-etiketi">
            ızgara
          </span>
          <div role="radiogroup" aria-labelledby="kenar-etiketi" className="flex gap-2">
            {KENARLAR.map((k) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={k === duvar.kenar}
                onClick={() => kenarSec(k)}
                className={`border px-3 py-1 font-mono text-[13px] ${
                  k === duvar.kenar
                    ? 'border-kahve text-kahve'
                    : 'border-dikis-koyu text-ikincil hover:border-kahve'
                }`}
              >
                {k}×{k}
              </button>
            ))}
          </div>
          <p className="yazi-mono ml-auto" aria-live="polite">
            {dolu}/{duvar.hucreler.length} dolu
          </p>
        </div>

        <div
          className="mt-4 grid gap-px border border-dikis bg-dikis"
          style={{
            gridTemplateColumns: `repeat(${duvar.kenar}, minmax(0, 1fr))`,
            aspectRatio: '1',
          }}
        >
          {duvar.hucreler.map((h, i) => {
            const urun = h ? URUNLER.find((u) => u.kod === h.kod) : null
            const renk = h ? renkBul(h.renk) : null
            return (
              <button
                key={i}
                type="button"
                onClick={() => setAcikHucre(i)}
                aria-label={
                  urun ? `${i + 1}. hücre: ${urun.ad}, ${renk?.ad}. Değiştir.` : `${i + 1}. hücre boş. Ürün seç.`
                }
                className="group relative flex flex-col justify-end overflow-hidden bg-sut p-0 text-left focus-visible:z-10"
                style={renk ? { background: renk.zemin } : undefined}
              >
                {urun ? (
                  <>
                    <span className="absolute inset-0">
                      <UrunGorseli
                        kaynak={gorselFor(urun, h?.renk)}
                        alt=""
                        zemin="transparent"
                        boyutlar="(max-width: 1023px) 33vw, 200px"
                        className="h-full !aspect-auto"
                      />
                    </span>
                    <span className="relative z-10 w-full truncate border-t border-dikis bg-kagit px-1.5 py-1 font-mono text-[11px]">
                      {urun.kod}
                    </span>
                  </>
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-ikincil opacity-0 transition-opacity duration-[320ms] group-hover:opacity-100 group-focus-visible:opacity-100">
                    +
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <p className="mt-3 max-w-[60ch] text-sm text-ikincil">
          Hücreye basın, ürünü ve rengini seçin. Kurduğunuz duvar adres
          çubuğunda duruyor — bağlantıyı kopyalayıp paylaşabilirsiniz.
        </p>
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="border border-dikis bg-kagit p-4">
          <h2 className="yazi-mono">liste</h2>

          {liste.length === 0 ? (
            <p className="mt-3 text-sm text-ikincil">Henüz ürün yerleştirilmedi.</p>
          ) : (
            <ul className="mt-3 dikis-ust">
              {liste.map((k) => (
                <li key={`${k.urun.kod}.${k.renk}`} className="flex items-baseline gap-3 py-2 dikis-alt">
                  <span className="yazi-mono shrink-0">{k.urun.kod}</span>
                  <Link href={`/urun/${k.urun.slug}`} className="min-w-0 flex-1 truncate text-sm hover:underline">
                    {k.urun.ad}
                  </Link>
                  <span className="shrink-0 font-mono text-[13px]">×{k.adet}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex items-baseline justify-between dikis-ust pt-3">
            <span className="text-sm">Toplam</span>
            <span className="font-mono text-[13px]">{fiyat(toplam)}</span>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Buton onClick={hepsiniEkle} disabled={liste.length === 0}>
              Duvarı sepete ekle
            </Buton>
            <Buton
              tur="cerceve"
              onClick={() => yaz(bosDuvar(duvar.kenar))}
              disabled={dolu === 0}
            >
              Duvarı temizle
            </Buton>
          </div>

          <p className="mt-3 text-sm text-ikincil" aria-live="polite">
            {eklendi > 0 ? `${eklendi} parça sepete eklendi.` : ''}
          </p>
        </div>
      </aside>

      <UrunSecici
        acik={acikHucre !== null}
        baslik={acikHucre === null ? '' : `${acikHucre + 1}. hücre`}
        seciliKod={acikHucre === null ? null : (duvar.hucreler[acikHucre]?.kod ?? null)}
        seciliRenk={acikHucre === null ? sonRenk : (duvar.hucreler[acikHucre]?.renk ?? sonRenk)}
        onSec={(kod, renk) => acikHucre !== null && yerlestir(acikHucre, kod, renk)}
        onKaldir={() => acikHucre !== null && bosalt(acikHucre)}
        onKapat={() => setAcikHucre(null)}
      />
    </div>
  )
}
