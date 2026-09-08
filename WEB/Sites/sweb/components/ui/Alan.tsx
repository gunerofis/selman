import type { ComponentPropsWithoutRef } from 'react'

type AlanProps = ComponentPropsWithoutRef<'input'> & {
  etiket: string
  /** Biçim ipucu. Otomatik doldurma balonu kapatmasın diye alanın üstünde durur. */
  ipucu?: string
  /** Sunucudan dönen hata. Tarayıcı doğrulaması ayrıca :user-invalid ile çalışır. */
  hata?: string
}

export function Alan({ id, etiket, ipucu, hata, className = '', ...rest }: AlanProps) {
  const ipucuId = ipucu ? `${id}-ipucu` : undefined
  const hataId = `${id}-hata`

  return (
    <div className={className}>
      <label htmlFor={id} className="yazi-mono block">
        {etiket}
        {rest.required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {ipucu ? (
        <span id={ipucuId} className="mt-0.5 block text-[13px] text-ikincil">
          {ipucu}
        </span>
      ) : null}
      <input
        id={id}
        aria-invalid={hata ? true : undefined}
        aria-describedby={ipucuId}
        aria-errormessage={hataId}
        className="alan mt-1.5 w-full border border-dikis-koyu bg-kagit px-2.5 py-2.5 text-[15px] text-kahve placeholder:text-ikincil"
        {...rest}
      />
      {/* Hata metni gizli durur; tarayıcı alanı :user-invalid saydığında ya da
          sunucu hata döndüğünde görünür. Yazarken erken uyarı çıkmaz. */}
      <p id={hataId} className="alan-hata mt-1.5 text-[13px] text-bordo" data-gorunur={hata ? '' : undefined}>
        {hata ?? 'Bu alanı kontrol edin.'}
      </p>
    </div>
  )
}
