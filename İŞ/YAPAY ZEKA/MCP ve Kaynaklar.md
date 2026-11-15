# MCP ve Kaynaklar

Tarih: 2026-10-24. Sıra, o günkü MCP Toplist ve resmi dokümanlara göredir. Bağlantı kurulmadı. Shop ve hesap kimliği `Desktop\HARİTA.md` içindedir.

Bu oturumda Grok’a bağlı olanlar: `cursor`, `tasks`. `~\.gemini\config\mcp_config.json` boş. Grok `config.toml` içinde `[mcp_servers]` yok.

Aynı işte iki tarayıcı MCP’si açma. Windows’ta `npx` yerine `npx.cmd`.

## Seçilenler

| Sıra | Sunucu | İş | Yetki | Kaynak |
|---|---|---|---|---|
| 1 | Chrome DevTools MCP | Canlı sayfa, console, network, performans izi | Tarayıcıyı sürer | [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) |
| 2 | Playwright MCP | DevTools olmayan araçta erişilebilirlik ağacıyla test | Tarayıcıyı sürer | [playwright-mcp](https://github.com/microsoft/playwright-mcp) |
| 3 | Context7 | Kütüphanenin güncel dokümanı | Anahtarsız okuma | [context7](https://github.com/upstash/context7) |
| 4 | Shopify Dev MCP | Admin API, Liquid ve şema. Mağazaya yazmaz | Anahtarsız, yerel | [@shopify/dev-mcp](https://shopify.dev/docs/apps/build/devmcp) |
| 5 | Google Ads MCP | Üç reklam hesabının raporu | Salt okuma | [Ads MCP](https://developers.google.com/google-ads/api/docs/developer-toolkit/mcp-server) |
| 6 | Google Analytics MCP | GA4 raporu | Salt okuma | [Analytics MCP](https://developers.google.com/analytics/devguides/MCP) |
| 7 | GitHub MCP | Yalnız depo GitHub’daysa issue ve PR | Hesap yetkisi kadar | [github-mcp-server](https://github.com/github/github-mcp-server) |

Grok’un kendi tarayıcı araçları varken Chrome DevTools’u ayrıca açma. Playwright, DevTools kurulamayan araç içindir.

Shopify Dev MCP kurulumunda Windows komutu `npx.cmd -y @shopify/dev-mcp@latest` olur. `https://mcp.shop.com` alışveriş ajanıdır; mağaza yönetimine bağlanmaz.

Ads ve Analytics resmi sunucuları 16–22.10.2026 dokümanında salt okumadır. Kampanya ve mülk ayarı değiştirmez. Search Console için aynı tarihte resmi MCP yok; organik kontrol `seo-audit` ve yerel dosyayla kalır.

## Alınmayanlar

| Sunucu | Neden |
|---|---|
| REA | Tersine mühendislik. Bu işlerin aracı değil |
| Scrapling, Browser Use | İkinci tarayıcı ve bot duvarı aşma. DevTools yeter |
| Meta Ads MCP | Kampanya yazabiliyor. İstenmeden bağlanmaz |
| Shop MCP, Global Catalog | Başka mağazalardan alışveriş. Kendi vitrinini yönetmez |
| Figma, Zoom, n8n, Home Assistant | Bu dosya düzeninde kullanılan araç değil |
| Notion, Linear | Bu makinede bağlı ve dolu bir oturum görülmedi |

## Diğer kaynaklar

| Kaynak | Yer |
|---|---|
| Klasör ve hesap | `Desktop\HARİTA.md` |
| Belge ve görsel | Grok bundled `docx`, `pdf`, `pptx`, `imagine` |
| Skill merkezi (52 skill) | `selman\Yapay Zeka\Skill Setleri` |
| Ham skill kopyası | `selman\Yapay Zeka\Skill Kopyaları 2026-10-24` |
| İş kaydı | İş Merkezi, `127.0.0.1:4196` |
| Shopify doküman | [shopify.dev](https://shopify.dev/docs/apps/build/devmcp) |
