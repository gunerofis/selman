import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteShell } from "@/components/layout/site-shell";
import { BRAND } from "@/lib/brand";
import appCss from "../styles.css?url";
import { getPublicLines } from "@/lib/catalog-admin";
import { CatalogProvider } from "@/lib/catalog-context";
import { UnifiedCatalogProvider } from "@/lib/unified-catalog-context";
import { getPublicScripts } from "@/lib/site-scripts";
import { getPublicSiteConfig } from "@/lib/site-config";
import { SiteConfigProvider } from "@/lib/site-config-context";
import { SITE_ORIGIN } from "@/lib/seo";

export const Route = createRootRoute({
  loader: async () => {
    const [lines, scripts, siteConfig] = await Promise.all([
      getPublicLines(),
      getPublicScripts(),
      getPublicSiteConfig(),
    ]);
    return { lines, scripts, siteConfig };
  },
  head: ({ loaderData }) => ({
    meta: (() => {
      const name = loaderData?.siteConfig.identity.name ?? BRAND.name;
      const title = loaderData?.siteConfig.seo.defaultTitle ?? "Düzen ürünleri";
      const description = loaderData?.siteConfig.seo.defaultDescription ?? BRAND.tagline;
      const image = `${SITE_ORIGIN}${loaderData?.siteConfig.seo.socialImage ?? "/clik/s-8008.webp"}`;
      return [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: description },
        { property: "og:site_name", content: name },
        { property: "og:title", content: `${title} — ${name}` },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${title} — ${name}` },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
        { name: "theme-color", content: "#F4EFE4" },
      ];
    })(),
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..600&family=Instrument+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  const { lines, scripts, siteConfig } = Route.useLoaderData();
  return (
    <html
      lang="tr"
      className="antialiased"
      data-contact-email={siteConfig.identity.email}
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
        {scripts
          .filter((item) => item.placement === "head")
          .map((item) => (
            <script
              key={item.id}
              data-managed-script={item.name}
              dangerouslySetInnerHTML={{ __html: item.code }}
            />
          ))}
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <SiteConfigProvider value={siteConfig}>
            <CatalogProvider lines={lines}>
              <UnifiedCatalogProvider>
                <SiteShell>
                  <Outlet />
                </SiteShell>
              </UnifiedCatalogProvider>
            </CatalogProvider>
          </SiteConfigProvider>
        </AuthProvider>
        {scripts
          .filter((item) => item.placement === "body")
          .map((item) => (
            <script
              key={item.id}
              data-managed-script={item.name}
              dangerouslySetInnerHTML={{ __html: item.code }}
            />
          ))}
        <Scripts />
      </body>
    </html>
  );
}
