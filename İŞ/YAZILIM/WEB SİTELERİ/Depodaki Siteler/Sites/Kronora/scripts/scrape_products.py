#!/usr/bin/env python3
"""Collect the public Turkish product catalogue from gunerofis.com.

The source site is the catalogue authority. This script intentionally keeps
the source URLs so the generated showroom can send checkout traffic back to
the live commerce site.
"""

from __future__ import annotations

import concurrent.futures
import html
import json
import re
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path


BASE_URL = "https://www.gunerofis.com"
SITEMAP_URL = f"{BASE_URL}/sitemap.xml"
OUTPUT = Path(__file__).resolve().parents[1] / "app" / "products.json"
HEADERS = {
    "User-Agent": "Googlebot",
    "Accept-Language": "tr-TR,tr;q=0.9",
}


def fetch(url: str, attempts: int = 3) -> str:
    last_error: Exception | None = None
    for attempt in range(attempts):
        try:
            request = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(request, timeout=35) as response:
                return response.read().decode("utf-8", "ignore")
        except Exception as exc:  # pragma: no cover - network recovery
            last_error = exc
            time.sleep(0.8 * (attempt + 1))
    raise RuntimeError(f"Could not fetch {url}: {last_error}")


def clean_text(value: str | None) -> str:
    if not value:
        return ""
    value = re.sub(r"<script\b[^>]*>.*?</script>", " ", value, flags=re.I | re.S)
    value = re.sub(r"<style\b[^>]*>.*?</style>", " ", value, flags=re.I | re.S)
    value = re.sub(r"<br\s*/?>", "\n", value, flags=re.I)
    value = re.sub(r"</(?:p|li|h[1-6]|div|tr)\s*>", "\n", value, flags=re.I)
    value = re.sub(r"<[^>]+>", " ", value)
    value = html.unescape(value).replace("\xa0", " ")
    lines = [re.sub(r"\s+", " ", line).strip() for line in value.splitlines()]
    return "\n".join(line for line in lines if line)


def attr(source: str, name: str) -> str:
    match = re.search(rf'\b{name}=["\']([^"\']*)["\']', source, re.I)
    return html.unescape(match.group(1)) if match else ""


def meta(document: str, key: str) -> str:
    for tag in re.findall(r"<meta\b[^>]*>", document, re.I):
        if attr(tag, "name") == key or attr(tag, "property") == key:
            return attr(tag, "content")
    return ""


def first_match(pattern: str, document: str, group: int = 1) -> str:
    match = re.search(pattern, document, re.I | re.S)
    return match.group(group).strip() if match else ""


def infer_category(name: str, slug: str, explicit: str) -> str:
    source = f"{name} {slug} {explicit}".lower()
    rules = [
        ("Kumaşlı Panolar", ("kumaş", "kumas", "mantar pano", "yazı tahtası", "yazi tahtasi")),
        ("Makam Panoları", ("makam pano", "makam arkal", "atatürk", "ataturk", "kanvas", "tuğra", "tugra")),
        ("Makam Bayrakları", ("bayrak",)),
        ("Sümen Takımları", ("sümen", "sumen", "masa takımı", "masa seti")),
        ("Deri Kutular", ("saat kut", "gözlük kut", "gozluk kut", "tesbih kut", "takı kut", "taki kut")),
        ("Masa Üstü Gereçleri", ("isimlik", "evrak raf", "kalemlik", "notluk", "telefonluk", "masa üstü", "masa ustu", "masa saati")),
        ("Otel ve Ofis Ekipmanları", ("çöp kova", "cop kova", "peçetelik", "pecetelik", "magazinlik", "otel")),
    ]
    for category, needles in rules:
        if any(needle in source for needle in needles):
            return category
    return explicit or "Diğer Ürünler"


def extract_selects(document: str) -> list[dict[str, object]]:
    selections: list[dict[str, object]] = []
    for block in re.findall(r'<div class="attribute-item"[^>]*>(.*?)</div>\s*</div>', document, re.I | re.S):
        label = clean_text(first_match(r'<label[^>]*>(.*?)</label>', block))
        options = [clean_text(item) for item in re.findall(r'<option\b[^>]*>(.*?)</option>', block, re.I | re.S)]
        options = [option for option in options if option]
        if label and options:
            selections.append({"label": label, "options": options[:24]})
    return selections[:4]


def parse_product(url: str) -> dict[str, object] | None:
    try:
        document = fetch(url)
    except Exception:
        return None

    if 'class="product-details-page"' not in document and 'itemprop="price"' not in document:
        return None

    h1 = clean_text(first_match(r'<h1\b[^>]*>(.*?)</h1>', document))
    price = attr(first_match(r'(<span\b[^>]*itemprop="price"[^>]*>)', document), "content")
    if not h1 or not price:
        return None

    slug = urllib.parse.urlparse(url).path.strip("/")
    old_price = clean_text(first_match(r'<div class="product-old-price"[^>]*>\s*<span[^>]*>(.*?)</span>', document))
    short_description = clean_text(first_match(r'<div class="description"[^>]*>(.*?)</div>\s*<div class="details"', document))
    full_description = clean_text(first_match(r'<div class="full-description"[^>]*>(.*?)</div>\s*</div>', document))
    sku = clean_text(first_match(r'<span\b[^>]*itemprop="sku"[^>]*>(.*?)</span>', document))
    category = clean_text(first_match(r"'item_category'\s*:\s*'([^']*)'", document))
    availability = first_match(r'<link\b[^>]*itemprop="availability"[^>]*href="([^"]+)"', document)
    delivery = clean_text(first_match(r'<div class="delivery-date"[^>]*>.*?<span class="value"[^>]*>(.*?)</span>', document))
    canonical = attr(first_match(r'(<link\b[^>]*rel="canonical"[^>]*>)', document), "href") or url
    images: list[str] = []
    gallery_document = first_match(
        r'<div class="product-details-container"[^>]*>(.*?)<div class="overview">',
        document,
    )
    for candidate in re.findall(r'(?:href|src)="(https://www\.gunerofis\.com/i/l/[^"?#]+)"', gallery_document, re.I):
        candidate = html.unescape(candidate)
        if candidate not in images:
            images.append(candidate)
        if len(images) == 8:
            break
    primary_image = meta(document, "og:image")
    if primary_image:
        images = [primary_image] + [image for image in images if image != primary_image]

    explicit_category = category.replace("&amp;", "&")
    final_category = infer_category(h1, slug, explicit_category)

    return {
        "slug": slug,
        "url": canonical.rstrip("/") + "/",
        "name": h1,
        "category": final_category,
        "sourceCategory": explicit_category,
        "price": float(price),
        "oldPrice": old_price,
        "currency": "TRY",
        "sku": sku,
        "shortDescription": short_description or meta(document, "description"),
        "description": full_description or short_description or meta(document, "description"),
        "image": primary_image or (images[0] if images else ""),
        "images": images,
        "availability": "Stokta" if availability.endswith("InStock") else "Siparişe göre üretilir" if availability.endswith("OutOfStock") else "Bilgi alın",
        "delivery": delivery,
        "metaTitle": clean_text(first_match(r'<title[^>]*>(.*?)</title>', document)),
        "metaDescription": meta(document, "description"),
        "keywords": [part.strip() for part in meta(document, "keywords").split(",") if part.strip()][:16],
        "options": extract_selects(document),
    }


def main() -> None:
    sitemap = fetch(SITEMAP_URL)
    root = ET.fromstring(sitemap.lstrip("\ufeff"))
    namespace = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    urls = [node.text for node in root.findall(f".//{namespace}loc") if node.text]

    products: list[dict[str, object]] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
        futures = {pool.submit(parse_product, url): url for url in urls}
        for index, future in enumerate(concurrent.futures.as_completed(futures), start=1):
            product = future.result()
            if product:
                products.append(product)
            if index % 75 == 0:
                print(f"Checked {index}/{len(urls)} URLs; found {len(products)} products", flush=True)

    products.sort(key=lambda item: (str(item["category"]), str(item["name"])))
    OUTPUT.write_text(json.dumps(products, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    categories: dict[str, int] = {}
    for product in products:
        category = str(product["category"])
        categories[category] = categories.get(category, 0) + 1
    print(json.dumps({"products": len(products), "categories": categories, "output": str(OUTPUT)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
