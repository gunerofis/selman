import type { Metadata, Viewport } from 'next'
import './globals.css'
import { fontDegiskenleri } from '@/lib/fonts'
import { site } from '@/lib/site'
import { Baslik } from '@/components/duzen/Baslik'
import { Etek } from '@/components/duzen/Etek'
import { SepetSaglayici } from '@/lib/sepet'
import { CerezSaglayici } from '@/lib/cerez'
import { CerezBandi } from '@/components/gizlilik/CerezBandi'
import { KomutPaleti } from '@/components/arama/KomutPaleti'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.ad} — düzen ürünleri`,
    template: `%s — ${site.ad}`,
  },
  description: 'Ev ve çalışma alanı için düzen ürünleri.',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: site.ad,
    url: '/',
  },
  alternates: { canonical: '/' },
  formatDetection: { telephone: false, address: false, email: false },
}

export const viewport: Viewport = {
  themeColor: '#F7F1E8',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={fontDegiskenleri}>
      <body className="flex min-h-dvh flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: site.ad,
              url: site.url,
              logo: `${site.url}/icon.png`,
            }),
          }}
        />
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-kahve focus:px-4 focus:py-2 focus:text-kagit"
        >
          İçeriğe geç
        </a>
        <CerezSaglayici>
          <SepetSaglayici>
            <Baslik />
            <main id="icerik" className="flex-1">
              {children}
            </main>
            <Etek />
            <CerezBandi />
            <KomutPaleti />
          </SepetSaglayici>
        </CerezSaglayici>
      </body>
    </html>
  )
}
