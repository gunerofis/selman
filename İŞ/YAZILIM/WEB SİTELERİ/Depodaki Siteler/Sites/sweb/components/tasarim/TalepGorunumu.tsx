'use client'

import { useEffect, useState } from 'react'
import { ButonLink } from '@/components/ui/Buton'
import { SpecTablosu } from '@/components/ui/SpecTablosu'
import { UrunKarti } from '@/components/kategori/UrunKarti'
import { benzerUrunler, type Brif, type Oneri } from '@/lib/tasarim'
import { FORMLAR, MALZEMELER, OZELLIKLER } from '@/lib/uretim'
import { renkBul } from '@/lib/renkler'
import { fiyat, olcu } from '@/lib/bicim'

type Talep = {
  jeton: string
  olusturuldu: string
  durum: 'sirada' | 'hazir' | 'iptal'
  brif: Brif
  oneri: Oneri | null
  hata: string | null
}

const SURE_SN = 30

/**
 * Talep sayfası. E-postadaki bağlantı da, gönderim sonrası yönlendirme
 * de buraya gelir; ikisi aynı sayfayı gösterir.
 *
 * Hazır olana kadar 5 saniyede bir yoklar. Sekme arkadayken yoklamaz —
 * açık bırakılan sayfa boşuna istek atmasın.
 */
export function TalepGorunumu({ jeton }: { jeton: string }) {
  const [talep, setTalep] = useState<Talep | null>(null)
  const [hata, setHata] = useState('')
  const [gecen, setGecen] = useState(0)

  useEffect(() => {
    let durduruldu = false
    let zamanlayici: number | undefined

    async function yokla() {
      try {
        const y = await fetch(`/api/tasarim/durum?jeton=${encodeURIComponent(jeton)}`, {
          cache: 'no-store',
        })
        if (y.status === 404) {
          setHata('Bu bağlantı geçersiz ya da talep silinmiş.')
          return
        }
        if (!y.ok) throw new Error(String(y.status))
        const veri: Talep = await y.json()
        if (durduruldu) return
        setTalep(veri)
        if (veri.durum === 'sirada') zamanlayici = window.setTimeout(yokla, 5000)
      } catch {
        if (!durduruldu) zamanlayici = window.setTimeout(yokla, 8000)
      }
    }

    yokla()
    const sayac = window.setInterval(() => setGecen((s) => s + 1), 1000)
    const gorunurluk = () => {
      if (document.visibilityState === 'visible' && talep?.durum === 'sirada') yokla()
    }
    document.addEventListener('visibilitychange', gorunurluk)

    return () => {
      durduruldu = true
      window.clearTimeout(zamanlayici)
      window.clearInterval(sayac)
      document.removeEventListener('visibilitychange', gorunurluk)
    }
    // jeton değişmedikçe tek kurulum
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jeton])

  if (hata) {
    return (
      <div className="dikis-ust mt-8 pt-8">
        <p className="text-ikincil">{hata}</p>
        <ButonLink href="/tasarla" className="mt-6">
          Yeni tasarım anlat
        </ButonLink>
      </div>
    )
  }

  if (!talep) {
    return (
      <p role="status" className="dikis-ust mt-8 pt-8 text-ikincil">
        Talep açılıyor…
      </p>
    )
  }

  const eslesme = benzerUrunler(talep.brif)
  const hazir = talep.durum === 'hazir' && talep.oneri
  const oran = Math.min(100, Math.round((gecen / SURE_SN) * 100))
  const formAdi = FORMLAR.find((f) => f.anahtar === talep.brif.form)?.ad ?? talep.brif.form

  return (
    <div className="dikis-ust mt-8 pt-8">
      {hazir ? (
        <SonucGorunumu oneri={talep.oneri!} adet={talep.brif.adet} />
      ) : (
        <div className="max-w-[62ch]">
          <p className="yazi-mono">tasarım hazırlanıyor</p>
          <h2 className="yazi-display mt-2 text-xl">Anlattığınız ürün çiziliyor</h2>
          <p className="mt-3 text-ikincil">
            Bu genelde {SURE_SN} saniye sürer. Sayfayı kapatabilirsiniz — bağlantı
            e-posta ile de gönderiliyor, hazır olunca buradan görürsünüz.
          </p>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={oran}
            aria-label="Tasarım hazırlanıyor"
            className="mt-5 h-1 w-full max-w-[380px] bg-dikis"
          >
            <div
              className="h-full bg-kahve transition-[width] duration-1000 ease-linear"
              style={{ width: `${oran}%` }}
            />
          </div>
        </div>
      )}

      <section className="dikis-ust mt-12 pt-8">
        <h2 className="yazi-display-orta text-lg">Anlattığınız</h2>
        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <p className="max-w-[62ch] whitespace-pre-line text-ikincil">{talep.brif.anlatim}</p>
          <div className="h-fit border border-dikis bg-kagit p-4">
            <SpecTablosu
              satirlar={[
                { etiket: 'Form', deger: formAdi },
                {
                  etiket: 'Malzeme',
                  deger:
                    talep.brif.malzemeler
                      .map((m) => MALZEMELER.find((x) => x.anahtar === m)?.ad ?? m)
                      .join(', ') || '—',
                },
                {
                  etiket: 'Özellik',
                  deger:
                    talep.brif.ozellikler
                      .map((o) => OZELLIKLER.find((x) => x.anahtar === o)?.ad ?? o)
                      .join(', ') || '—',
                },
                { etiket: 'Renk', deger: renkBul(talep.brif.renk)?.ad ?? 'Biz önerelim' },
                { etiket: 'Adet', deger: String(talep.brif.adet) },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="dikis-ust mt-12 pt-8">
        <h2 className="yazi-display-orta text-lg">Anlattığınıza yakın ürettiklerimiz</h2>
        <p className="yazi-mono mt-2">bu ürünler hazır, hemen sipariş edilebilir</p>
        <ul className="mt-5 grid grid-cols-2 gap-6 lg:grid-cols-3">
          {eslesme.map((e) => (
            <li key={e.urun.kod}>
              <UrunKarti urun={e.urun} />
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButonLink href="/koleksiyon" tur="cerceve">
            Tüm koleksiyona bak
          </ButonLink>
          <ButonLink href="/tasarla" tur="cerceve">
            Yeni tasarım anlat
          </ButonLink>
        </div>
      </section>
    </div>
  )
}

function SonucGorunumu({ oneri, adet }: { oneri: Oneri; adet: number }) {
  return (
    <div>
      <p className="yazi-mono">tasarım hazır</p>
      <h2 className="yazi-display mt-2 text-2xl">{oneri.ad}</h2>
      <p className="mt-3 max-w-[62ch] text-ikincil">{oneri.aciklama}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {oneri.gorsel ? (
          <div className="relative aspect-3/2 w-full overflow-hidden bg-sut">
            {/* Sağlayıcının ürettiği konsept görseli; katalog görselleri
                gibi optimize edilemediği için düz <img>. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={oneri.gorsel}
              alt={oneri.ad}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        ) : null}

        <div>
          <SpecTablosu
            satirlar={[
              { etiket: 'Dış ölçü', deger: olcu(oneri.olcuMm) },
              { etiket: 'Adet', deger: String(adet) },
              { etiket: 'Birim fiyat', deger: fiyat(oneri.birimFiyatKurus) },
              { etiket: 'Toplam', deger: fiyat(oneri.birimFiyatKurus * adet) },
            ]}
          />

          {oneri.uyarilar.length > 0 ? (
            <div className="mt-6 border border-dikis bg-kagit p-4">
              <p className="yazi-mono">notlar</p>
              <ul className="mt-2 space-y-1.5 text-sm text-bordo">
                {oneri.uyarilar.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <ButonLink href="/kurumsal-teklif" className="mt-6">
            Numune iste
          </ButonLink>
        </div>
      </div>
    </div>
  )
}
