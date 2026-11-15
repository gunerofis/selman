import type { Metadata } from "next";
import "./moneluks-v2.css";
import SiteShell from "./site-shell";
import { getActiveScripts, getProducts, getSettings } from "./lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL("https://moneluks.gunerofis.chatgpt.site"),
    title: settings.seoTitle,
    description: settings.seoDescription,
    alternates: { canonical: "/" },
    keywords: ["saat kutusu", "deri saat kutusu", "12'li saat kutusu", "6'lı saat kutusu", "cam kapaklı saat kutusu"],
    openGraph: { title: settings.seoTitle, description: settings.seoDescription, type: "website", siteName: "Moneluks", images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Moneluks deri saat ve aksesuar kutuları" }] },
    twitter: { card: "summary_large_image", title: settings.seoTitle, description: settings.seoDescription, images: ["/og.jpg"] },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [settings, products, headScripts, bodyScripts] = await Promise.all([getSettings(), getProducts(), getActiveScripts("head"), getActiveScripts("body")]);
  const searchProducts = products.map(({ slug, name, model, color, priceCents, primaryImage }) => ({ slug, name, model, color, priceCents, primaryImage }));
  return <html lang="tr"><head>{headScripts.map((script) => <script key={script.id} dangerouslySetInnerHTML={{ __html: script.code }} />)}</head><body className="antialiased"><a className="skip-link" href="#main-content">İçeriğe geç</a><SiteShell settings={settings} products={searchProducts}>{children}</SiteShell>{bodyScripts.map((script) => <script key={script.id} dangerouslySetInnerHTML={{ __html: script.code }} />)}</body></html>;
}
