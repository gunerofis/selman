import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Kap } from '@/components/duzen/Kap'
import { UrunGorseli } from '@/components/ui/UrunGorseli'
import { Mono } from '@/components/ui/Mono'
import { fiyat } from '@/lib/bicim'
import { KATEGORILER, kategoriBul, kategoriUrunleri } from '@/lib/urunler'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return KATEGORILER.map((k) => ({ slug: k.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const kategori = kategoriBul(slug)
  if (!kategori) return {}
  return {
    title: kategori.ad,
    description: `${kategori.ad} kategorisindeki ürünler.`,
    alternates: { canonical: `/kategori/${kategori.slug}` },
  }
}

export default async function KategoriSayfasi({ params }: Props) {
  const { slug } = await params
  const kategori = kategoriBul(slug)
  if (!kategori) notFound()

  const urunler = kategoriUrunleri(slug)

  return (
    <Kap className="py-8 md:py-12">
      <nav aria-label="Konum" className="yazi-mono">
        <Link href="/kategori" className="hover:text-taba">
          ürünler
        </Link>{' '}
        / {kategori.ad.toLowerCase()}
      </nav>

      <h1 className="yazi-display mt-3 text-2xl">{kategori.ad}</h1>
      <p className="yazi-mono mt-2">{urunler.length} ürün</p>

      <ul className="mt-8 grid gap-6 grid-cols-2 lg:grid-cols-4">
        {urunler.map((u) => (
          <li key={u.kod}>
            <Link href={`/urun/${u.slug}`} className="group block">
              <UrunGorseli kaynak={u.gorsel} alt="" />
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium group-hover:text-taba">{u.ad}</span>
                <Mono>{u.kod}</Mono>
              </div>
              <span className="mt-0.5 block font-mono text-[13px] text-kahve">
                {fiyat(u.fiyatKurus)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Kap>
  )
}
