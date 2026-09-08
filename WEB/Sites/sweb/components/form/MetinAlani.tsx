import type { ComponentPropsWithoutRef } from 'react'

type Props = ComponentPropsWithoutRef<'textarea'> & { etiket: string; hata?: string }

export function MetinAlani({ id, etiket, hata, className = '', ...rest }: Props) {
  const hataId = `${id}-hata`
  return (
    <div className={className}>
      <label htmlFor={id} className="yazi-mono block">
        {etiket}
        {rest.required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <textarea
        id={id}
        aria-invalid={hata ? true : undefined}
        aria-errormessage={hataId}
        className="alan mt-1.5 w-full border border-dikis-koyu bg-kagit px-2.5 py-2.5 text-[15px] text-kahve placeholder:text-ikincil"
        {...rest}
      />
      <p id={hataId} className="alan-hata mt-1.5 text-[13px] text-bordo" data-gorunur={hata ? '' : undefined}>
        {hata ?? 'Bu alanı kontrol edin.'}
      </p>
    </div>
  )
}
