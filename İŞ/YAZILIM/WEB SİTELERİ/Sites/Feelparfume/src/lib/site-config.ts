import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { DEFAULT_SHIPPING, type ShippingRule } from "./shipping";

export const MENU_GROUPS = ["Mağaza", "Keşif", "Yardım", "Bilgi", "Ana", "Teklif", "Rehberler", "Destek"] as const;
export type MenuGroup = (typeof MENU_GROUPS)[number];
export type FooterGroup = "Mağaza" | "Yardım" | "Hukuki" | null;

export type ManagedLink = {
  path: string;
  label: string;
  menuGroup: MenuGroup | null;
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
  shipping: ShippingRule;
  updatedAt: string | null;
};

const rawLinks: Array<[string, string, MenuGroup | null, FooterGroup]> = [
  ["/kategori", "Kategoriler", "Mağaza", "Mağaza"],
  ["/koleksiyon", "Tüm parfümler", "Mağaza", null],
  ["/kategori/kadin", "Kadın", "Mağaza", "Mağaza"],
  ["/kategori/erkek", "Erkek", "Mağaza", "Mağaza"],
  ["/kategori/unisex", "Unisex", "Mağaza", "Mağaza"],
  ["/kategori/deneme-boyu", "Deneme Boyu", "Mağaza", "Mağaza"],
  ["/kategori/hediye-seti", "Hediye Setleri", "Mağaza", "Mağaza"],
  ["/marka", "Markalar", "Mağaza", "Mağaza"],
  ["/nota", "Notalar", "Mağaza", "Mağaza"],
  ["/koku-testi", "Koku testi", "Keşif", "Mağaza"],
  ["/kesif-seti", "Keşif seti", "Keşif", "Mağaza"],
  ["/teklif", "Ürün teklifi al", "Yardım", "Mağaza"],
  ["/kurumsal-teklif", "Kurumsal teklif al", "Yardım", "Mağaza"],
  ["/iletisim", "İletişim", "Yardım", "Mağaza"],
  ["/sss", "Sıkça sorulan sorular", "Yardım", "Yardım"],
  ["/siparis-sorgu", "Sipariş sorgula", "Yardım", "Yardım"],
  ["/odeme-yontemleri", "Ödeme yöntemleri", "Yardım", "Yardım"],
  ["/teslimat", "Teslimat", "Yardım", "Yardım"],
  ["/iade", "İade", "Yardım", "Yardım"],
  ["/garanti", "Garanti", "Yardım", "Yardım"],
  ["/bulten", "Bülten", "Yardım", "Yardım"],
  ["/sikayet", "Şikayet ve öneri", "Yardım", "Hukuki"],
  ["/", "Ana sayfa", null, null],
  ["/hakkimizda", "Hakkımızda", "Bilgi", "Mağaza"],
  ["/favoriler", "Favoriler", null, null],
  ["/hesap", "Hesap", null, null],
  ["/karsilastir", "Karşılaştır", null, null],
  ["/sepet", "Sepet", null, null],
  ["/kullanim", "Kullanım koşulları", null, "Hukuki"],
  ["/gizlilik", "Gizlilik", null, "Hukuki"],
  ["/kvkk", "KVKK", null, "Hukuki"],
  ["/cerez", "Çerez politikası", null, "Hukuki"],
  ["/cayma", "Cayma hakkı", null, "Hukuki"],
  ["/on-bilgilendirme", "Ön bilgilendirme", null, "Hukuki"],
  ["/mesafeli", "Mesafeli satış", null, "Hukuki"],
  ["/satici", "Satıcı bilgileri", null, "Hukuki"],
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
    name: "feelparfume",
    tagline: "Parfüm koleksiyonu.",
    email: "destek@feelparfume.com",
    legalEmail: "hukuk@feelparfume.com",
    phone: "+90 212 000 00 00",
    atelier: "Örnek Mah. Parfüm Sok. No:1 D:2, Şişli / İstanbul",
    hours: "09.00–18.00",
    legalName: "Feel Parfüm Kozmetik Ticaret Ltd. Şti. (örnek)",
    mersisNumber: "0000000000000000",
    taxOffice: "Şişli",
    taxNumber: "0000000000",
    legalAddress: "Örnek Mah. Parfüm Sok. No:1 D:2, Şişli / İstanbul",
    iban: "TR00 0000 0000 0000 0000 0000 00",
  },
  storefront: {
    announcement: "₺1.500 üzeri kargo ücretsiz · Orijinal ürün · Deneme boyu seçeneği",
    heroTitle: "Kokunuzu bulun",
    heroButton: "Parfümleri keşfet",
    footerKicker: "İletişim",
    footerTitle: "Sorunuz mu var? Yazın.",
    footerButton: "İletişim",
  },
  seo: {
    defaultTitle: "Parfüm koleksiyonu",
    defaultDescription: "Orijinal kadın, erkek ve unisex parfümler. Deneme boyu, koku testi, güvenli ödeme.",
    socialImage: "/favicon.svg",
  },
  links,
  shipping: DEFAULT_SHIPPING,
  updatedAt: null,
};

const linkSchema = z.object({
  path: z.string().startsWith("/").max(120),
  label: z.string().trim().min(2).max(60),
  menuGroup: z.enum(MENU_GROUPS).nullable(),
  footerGroup: z.enum(["Mağaza", "Yardım", "Hukuki"]).nullable(),
  visible: z.boolean(),
});

export const siteConfigSchema = z.object({
  identity: z.object({
    name: z.string().trim().min(2).max(40),
    tagline: z.string().trim().min(5).max(180),
    email: z.email().max(160).or(z.literal("")),
    legalEmail: z.email().max(160).or(z.literal("")).default(""),
    phone: z.string().trim().max(40),
    atelier: z.string().trim().max(160),
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
  shipping: z
    .object({
      fee: z.number().int().min(0).max(100_000),
      freeFrom: z.number().int().min(0).max(1_000_000),
    })
    .default(DEFAULT_SHIPPING),
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
