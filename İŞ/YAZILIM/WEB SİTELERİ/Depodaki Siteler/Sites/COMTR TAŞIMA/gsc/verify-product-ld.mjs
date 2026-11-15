const urls = [
  "https://www.sumentakimi.com.tr/products/deri-pecetelik",
  "https://www.sumentakimi.com.tr/products/diamond-silver-sumen-takimi-9-parca-siyah",
];
for (const url of urls) {
  const html = await (await fetch(url, { headers: { "user-agent": "sumentakimi-seo-verify/2.0", "cache-control": "no-cache" } })).text();
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((m) => JSON.parse(m[1]));
  const product = blocks.find((x) => x["@type"] === "Product");
  console.log(url, {
    brand: product?.brand,
    manufacturer: product?.manufacturer,
    sku: product?.sku,
    gtin: product?.gtin13 || product?.gtin12 || product?.gtin || product?.gtin8,
    additionalProperty: product?.additionalProperty,
    offerCount: product?.offers?.length,
    shipping: product?.offers?.[0]?.shippingDetails ? "present" : "absent",
  });
}
