/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  // Keep generated bundles behind the Worker-controlled asset route. The
  // hosting edge otherwise serves matching physical files before the Worker
  // can attach immutable caching headers.
  assetPrefix: "/app-assets",
  // Keep route metadata inside <head> for every user agent. This avoids
  // streaming metadata being emitted at the end of <body>, which breaks
  // lightweight WhatsApp/Facebook link preview crawlers.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
