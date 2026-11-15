import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type MenuGroup = "Ana" | "Teklif" | "Rehberler" | "Destek" | "Bilgi";
export type FooterGroup = "Mağaza" | "Yardım" | "Hukuki" | null;

export type ManagedLink = {
  path: string;
  label: string;
  menuGroup: MenuGroup;
  footerGroup: FooterGroup;
  visible: boolean;
};

export type SiteConfig = {
  identity: {
    name: string;
    tagline: string;
    email: string;
    legalEmail: string;
    phone: string;
    atelier: string;
    hours: string;
    legalName: string;
    mersisNumber: string;
    taxOffice: string;
    taxNumber: string;
    legalAddress: string;
    iban: string;
  };
  storefront: {
    announcement: string;
    heroTitle: string;
    heroButton: string;
    footerKicker: string;
    footerTitle: string;
    footerButton: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    socialImage: string;
  };
  links: ManagedLink[];
  updatedAt: string | null;
};

const rawLinks: Array<[string, string, MenuGroup, FooterGroup]> = [
["/saat-mucevher-kutulari", "Saat & Mücevher", "Ana", "Mağaza"],
["/tasarla", "Kendin Tasarla", "Ana", "Mağaza"],
["/teklif", "Ürün teklifi al", "Destek", "Mağaza"],
["/kurumsal-teklif", "Kurumsal teklif al", "Destek", "Mağaza"],
["/hediye", "Hediye rehberi", "Rehberler", "Mağaza"],
["/palet", "Renk paleti", "Rehberler", "Mağaza"],
["/malzeme", "Malzemeler", "Rehberler", "Mağaza"],
["/olcu", "Ölçü rehberi", "Rehberler", "Mağaza"],
["/bakim", "Bakım rehberi", "Rehberler", "Mağaza"],
["/iletisim", "İletişim", "Destek", "Mağaza"],
["/sss", "Sıkça sorulan sorular", "Destek", "Yardım"],
["/siparis-sorgu", "Sipariş sorgula", "Destek", "Yardım"],
["/odeme-yontemleri", "Ödeme yöntemleri", "Destek", "Yardım"],
["/teslimat", "Teslimat", "Destek", "Yardım"],
["/iade", "İade", "Destek", "Yardım"],
["/garanti", "Garanti", "Destek", "Yardım"],
["/sikayet", "Şikayet ve öneri", "Destek", "Hukuki"],
["/ziyaret", "Atölye ziyareti", "Destek", "Mağaza"],
["/", "Ana sayfa", "Bilgi", null],
["/hakkimizda", "Hakkımızda", "Bilgi", "Mağaza"],
["/atolye", "Atölye", "Bilgi", "Mağaza"],
["/bulten", "Bülten", "Bilgi", "Yardım"],
["/favoriler", "Favoriler", "Bilgi", null],
["/karsilastir", "Karşılaştır", "Bilgi", null],
["/sepet", "Sepet", "Bilgi", null],
["/kullanim", "Kullanım koşulları", "Bilgi", "Hukuki"],
["/gizlilik", "Gizlilik", "Bilgi", "Hukuki"],
["/kvkk", "KVKK", "Bilgi", "Hukuki"],
["/cerez", "Çerez politikası", "Bilgi", "Hukuki"],
["/cayma", "Cayma hakkı", "Bilgi", "Hukuki"],
["/on-bilgilendirme", "Ön bilgilendirme", "Bilgi", "Hukuki"],
["/mesafeli", "Mesafeli satış", "Bilgi", "Hukuki"],
["/satici", "Satıcı bilgileri", "Bilgi", "Hukuki"]
];

const links: ManagedLink[] = rawLinks.map(([path, label, menuGroup, footerGroup]) => ({
  path,
  label,
  menuGroup,
  footerGroup,
  visible: true,
}));

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  identity: {
    name: "Sweb",
    tagline: "El yapımı saat ve mücevher kutuları.",
    email: "destek@gunerofis.com",
    legalEmail: "destek@gunerofis.com",
    phone: "+90 212 210 33 91",
    atelier: "Örnektepe Mah. Etibank Cad. Onur Sok. 39/7, Beyoğlu / İstanbul",
    hours: "09.00–18.00",
    legalName: "Guner Ofis Okul ve Büro Malzemeleri Ltd. Şti.",
    mersisNumber: "0432046576100001",
    taxOffice: "Kasımpaşa",
    taxNumber: "4320465761",
    legalAddress: "Örnektepe Mah. Etibank Cad. Onur Sok. 39/7, Beyoğlu / İstanbul",
    iban: "",
  },
  storefront: {
    announcement: "₺1.500 üzeri kargo ücretsiz · 3–5 iş günü · 14 gün iade",
    heroTitle: "El yapımı saat ve mücevher kutuları",
    heroButton: "Saat kutularını gör",
    footerKicker: "Atölye",
    footerTitle: "Tasarımınızı gönderin, üretelim",
    footerButton: "Anlatın",
  },
  seo: {
    defaultTitle: "Saat ve Mücevher Kutuları",
    defaultDescription: "El yapımı saat ve mücevher kutularını keşfedin.",
    socialImage: "/clik/s-8008.webp",
  },
  links,
  updatedAt: null,
};

const linkSchema = z.object({
  path: z.string().startsWith("/").max(120),
  label: z.string().trim().min(2).max(60),
  menuGroup: z.enum(["Ana", "Teklif", "Rehberler", "Destek", "Bilgi"]),
  footerGroup: z.enum(["Mağaza", "Yardım", "Hukuki"]).nullable(),
  visible: z.boolean(),
});

export const siteConfigSchema = z.object({
  identity: z.object({
    name: z.string().trim().min(2).max(40),
    tagline: z.string().trim().min(5).max(180),
    email: z.email().max(160),
    legalEmail: z.email().max(160).or(z.literal("")).default(""),
    phone: z.string().trim().max(40),
    atelier: z.string().trim().min(3).max(160),
    hours: z.string().trim().min(3).max(80),
    legalName: z.string().trim().max(160),
    mersisNumber: z.string().trim().max(20).default(""),
    taxOffice: z.string().trim().max(100).default(""),
    taxNumber: z.string().trim().max(20).default(""),
    legalAddress: z.string().trim().max(300).default(""),
    iban: z.string().trim().max(50),
  }),
  storefront: z.object({
    announcement: z.string().trim().min(3).max(180),
    heroTitle: z.string().trim().min(3).max(100),
    heroButton: z.string().trim().min(2).max(40),
    footerKicker: z.string().trim().min(2).max(40),
    footerTitle: z.string().trim().min(3).max(100),
    footerButton: z.string().trim().min(2).max(40),
  }),
  seo: z.object({
    defaultTitle: z.string().trim().min(3).max(70),
    defaultDescription: z.string().trim().min(10).max(170),
    socialImage: z.string().trim().startsWith("/").max(240),
  }),
  links: z.array(linkSchema).min(1).max(100),
  updatedAt: z.string().nullable(),
});

export const getPublicSiteConfig = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicSiteConfigServer } = await import("./site-config.server");
  return getPublicSiteConfigServer();
});

export const getAdminSiteConfig = createServerFn({ method: "POST" }).handler(async () => {
  const { getAdminSiteConfigServer } = await import("./site-config.server");
  return getAdminSiteConfigServer();
});

export const saveAdminSiteConfig = createServerFn({ method: "POST" })
  .validator((input: unknown) => siteConfigSchema.parse(input))
  .handler(async ({ data }) => {
    const { saveAdminSiteConfigServer } = await import("./site-config.server");
    return saveAdminSiteConfigServer(data);
  });
