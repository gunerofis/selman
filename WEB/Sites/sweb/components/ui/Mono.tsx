import type { ReactNode } from 'react'

/** Ürün kodu, ölçü, fiyat — her yerde mono. */
export function Mono({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`yazi-mono ${className}`}>{children}</span>
}
