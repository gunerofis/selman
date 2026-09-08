import type { ReactNode } from 'react'

/** Kesikli çizgiyle ayrılan sayfa bölümü. */
export function Bolum({
  baslik,
  children,
  className = '',
}: {
  baslik?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`dikis-ust py-8 ${className}`}>
      {baslik ? <h2 className="yazi-display-orta text-lg mb-4">{baslik}</h2> : null}
      {children}
    </section>
  )
}
