'use client'

/**
 * Kök düzey hata sınırı. Layout'un kendisi patlarsa devreye girer, bu
 * yüzden kendi <html> ve <body>'sini yazar ve tasarım sistemine
 * güvenemez — stiller satır içi.
 */
export default function KokHata({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="tr">
      {/* Kök hata sınırı layout'un dışında; başlığı da kendisi yazmalı,
          yoksa hata anında sayfanın adı boş kalıyor. */}
      <head>
        <title>Site açılamadı — Sweb</title>
        <meta name="robots" content="noindex" />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F7F1E8',
          color: '#4A3B2E',
          fontFamily: 'system-ui, sans-serif',
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 460 }}>
          <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#6E6052' }}>hata</p>
          <h1 style={{ fontSize: 30, margin: '10px 0 0', letterSpacing: '-0.02em' }}>
            Site açılamadı
          </h1>
          <p style={{ color: '#6E6052', lineHeight: 1.6 }}>
            Beklenmedik bir hata oluştu. Sayfayı yenilemeyi deneyin.
          </p>
          {error.digest ? (
            <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#6E6052' }}>
              kod: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 20,
              padding: '11px 20px',
              background: '#4A3B2E',
              color: '#FDFAF6',
              border: 'none',
              borderRadius: 0,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Tekrar dene
          </button>
        </div>
      </body>
    </html>
  )
}
