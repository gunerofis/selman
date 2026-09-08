import type { ReactNode } from 'react'

/** Sayfa kabı. Tek genişlik, tek yatay boşluk kuralı. */
export function Kap({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1280px] px-5 md:px-8 ${className}`}>{children}</div>
}
