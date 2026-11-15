import Link from 'next/link'
import { site } from '@/lib/site'

export type KirintiOgesi = { ad: string; yol?: string }

/** Kırıntı yolu. Son öge bağlantısız. BreadcrumbList da buradan yayılır,
 *  böylece görünen yol ile yapılandırılmış veri ayrışmaz. */
export function Kirinti({ ogeler }: { ogeler: readonly KirintiOgesi[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: ogeler.map((o, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: o.ad,
      ...(o.yol && { item: `${site.url}${o.yol}` }),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Konum" className="yazi-mono">
        {ogeler.map((o, i) => (
          <span key={o.ad}>
            {i > 0 ? ' / ' : null}
            {o.yol ? (
              <Link href={o.yol} className="hover:text-taba">
                {o.ad.toLowerCase()}
              </Link>
            ) : (
              <span aria-current="page">{o.ad.toLowerCase()}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
