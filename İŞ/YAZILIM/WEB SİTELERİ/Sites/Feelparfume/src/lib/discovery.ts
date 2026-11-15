import { productSizes, PRODUCTS, type Product } from "./products.ts";

export function discoverySetPrice(prices: number[]) {
  const sorted = prices.filter((price) => Number.isInteger(price) && price > 0).sort((a, b) => a - b);
  if (sorted.length < 5) return null;
  return sorted.slice(0, 5).reduce((sum, price) => sum + price, 0);
}

export function sampleVariantPrices(products: Product[] = PRODUCTS) {
  const prices: number[] = [];
  for (const product of products) {
    for (const size of productSizes(product)) {
      if (size.sample && size.stockStatus !== "tukendi" && Number.isInteger(size.price) && size.price > 0) {
        prices.push(size.price);
      }
    }
  }
  return prices;
}

export function catalogDiscoveryPrice(products: Product[] = PRODUCTS) {
  return discoverySetPrice(sampleVariantPrices(products));
}

export function isSampleVariant(sku: string, color: string, products: Product[] = PRODUCTS) {
  const product = products.find((item) => item.sku === sku);
  if (!product) return false;
  return productSizes(product).some((size) => size.id === color && size.sample && size.stockStatus !== "tukendi");
}

export type SampleChoice = {
  sku: string;
  name: string;
  image: string;
  color: string;
  ml: number;
  price: number;
};

export function sampleChoices(products: Product[] = PRODUCTS): SampleChoice[] {
  const bySku = new Map<string, SampleChoice>();
  for (const product of products) {
    if (product.category === "hediye-seti") continue;
    for (const size of productSizes(product)) {
      if (!size.sample || size.stockStatus === "tukendi" || size.price <= 0) continue;
      const choice: SampleChoice = {
        sku: product.sku,
        name: product.name,
        image: product.image,
        color: size.id,
        ml: size.ml,
        price: size.price,
      };
      const prev = bySku.get(product.sku);
      if (!prev || choice.price < prev.price || (choice.price === prev.price && choice.ml < prev.ml)) {
        bySku.set(product.sku, choice);
      }
    }
  }
  return [...bySku.values()];
}
