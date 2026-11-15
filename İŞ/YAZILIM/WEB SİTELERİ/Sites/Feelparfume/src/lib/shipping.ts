export type ShippingRule = { fee: number; freeFrom: number };

export const DEFAULT_SHIPPING: ShippingRule = { fee: 149, freeFrom: 1500 };

export const TR_CITIES = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Aksaray",
  "Amasya",
  "Ankara",
  "Antalya",
  "Ardahan",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bartın",
  "Batman",
  "Bayburt",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Düzce",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkâri",
  "Hatay",
  "Iğdır",
  "Isparta",
  "İstanbul",
  "İzmir",
  "Kahramanmaraş",
  "Karabük",
  "Karaman",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kilis",
  "Kırıkkale",
  "Kırklareli",
  "Kırşehir",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Mardin",
  "Mersin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Osmaniye",
  "Rize",
  "Sakarya",
  "Samsun",
  "Siirt",
  "Sinop",
  "Sivas",
  "Şanlıurfa",
  "Şırnak",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Uşak",
  "Van",
  "Yalova",
  "Yozgat",
  "Zonguldak",
] as const;

const CITY_KEY = new Set(TR_CITIES.map((city) => city.toLocaleLowerCase("tr-TR")));

export function isTurkeyCity(city: string) {
  return CITY_KEY.has(city.trim().toLocaleLowerCase("tr-TR"));
}

export function shippingAmount(subtotal: number, rule: ShippingRule = DEFAULT_SHIPPING) {
  if (!Number.isFinite(subtotal) || subtotal <= 0) return 0;
  return subtotal >= rule.freeFrom ? 0 : rule.fee;
}

export function cargoKeyFor(orderId: string) {
  return orderId.replace(/[^0-9a-f]/gi, "").toUpperCase().slice(0, 20);
}

export function invoiceKeyFor(orderId: string) {
  return orderId.replace(/[^0-9a-f]/gi, "").toUpperCase().slice(-20);
}

const TRACK_BASE = "https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=";

export function trackingUrl(docId: string) {
  const code = docId.trim();
  if (!/^[0-9A-Za-z]{4,30}$/.test(code)) return "";
  return TRACK_BASE + encodeURIComponent(code);
}
