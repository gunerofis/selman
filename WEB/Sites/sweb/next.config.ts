import type { NextConfig } from 'next'

const guvenlikBasliklari = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Duvar kareleri, kart ızgaraları ve ürün sayfası genişlikleri.
    deviceSizes: [390, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [56, 96, 128, 200, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [{ source: '/:yol*', headers: guvenlikBasliklari }]
  },
}

export default nextConfig
