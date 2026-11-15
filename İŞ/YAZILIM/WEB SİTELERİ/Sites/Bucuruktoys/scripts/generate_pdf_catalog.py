from __future__ import annotations

import argparse
import functools
import json
import math
import shutil
import urllib.request
from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "output" / "pdf" / "bucuruktoys-toptan-katalog-2026.pdf"
PUBLIC_COPY = ROOT / "public" / "catalogs" / "bucuruktoys-toptan-katalog-2026.pdf"
DEFAULT_SOURCE = "https://katalog.bucuruktoys.workers.dev/api/products"

INK = HexColor("#17352D")
INK_SOFT = HexColor("#5B6863")
PAPER = HexColor("#F5F1E8")
CORAL = HexColor("#FF665A")
PURPLE = HexColor("#6D5CA8")
LINE = HexColor("#D9D2C7")

CATEGORIES = [
    ("outdoor", "Dış Mekân"),
    ("fun", "Şaka ve Eğlence"),
    ("skill", "Zekâ ve Beceri"),
    ("sensory", "Stres ve Duyusal"),
    ("stationery", "Kırtasiye ve Sticker"),
    ("accessory", "Anahtarlık ve Aksesuar"),
    ("3d", "3D Baskı Oyuncaklar"),
]


def register_fonts() -> None:
    candidates = [
        (Path("C:/Windows/Fonts/arial.ttf"), Path("C:/Windows/Fonts/arialbd.ttf")),
        (Path("C:/Windows/Fonts/calibri.ttf"), Path("C:/Windows/Fonts/calibrib.ttf")),
    ]
    for regular, bold in candidates:
        if regular.exists() and bold.exists():
            pdfmetrics.registerFont(TTFont("Catalog", str(regular)))
            pdfmetrics.registerFont(TTFont("Catalog-Bold", str(bold)))
            return
    raise FileNotFoundError("Türkçe karakter desteği için Arial veya Calibri fontu bulunamadı.")


def load_products(source_url: str) -> list[dict]:
    request = urllib.request.Request(source_url, headers={"User-Agent": "BUCURUKTOYS-Catalog-Builder/1.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.load(response)
    products = payload.get("products", [])
    if not isinstance(products, list) or not products:
        raise ValueError("Katalog ürünleri alınamadı.")
    return [item for item in products if isinstance(item, dict) and item.get("isPublished", True)]


def fit_lines(text: str, font: str, size: float, width: float, maximum: int) -> list[str]:
    words = str(text or "").split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if pdfmetrics.stringWidth(candidate, font, size) <= width:
            current = candidate
            continue
        if current:
            lines.append(current)
        current = word
        if len(lines) == maximum:
            break
    if current and len(lines) < maximum:
        lines.append(current)
    if len(lines) == maximum and words:
        joined = " ".join(lines)
        if len(joined) < len(" ".join(words)):
            last = lines[-1]
            while last and pdfmetrics.stringWidth(last + "…", font, size) > width:
                last = last[:-1]
            lines[-1] = last.rstrip() + "…"
    return lines


def draw_brand(pdf: canvas.Canvas, x: float, y: float, size: float = 22) -> None:
    pdf.setFillColor(CORAL)
    pdf.circle(x + size * 0.18, y + size * 0.32, size * 0.17, fill=1, stroke=0)
    pdf.setFillColor(INK)
    pdf.setFont("Catalog-Bold", size)
    pdf.drawString(x + size * 0.48, y, "BÜCÜRÜK")
    width = pdfmetrics.stringWidth("BÜCÜRÜK", "Catalog-Bold", size)
    pdf.setFillColor(PURPLE)
    pdf.setFont("Catalog-Bold", size * 0.45)
    pdf.drawString(x + size * 0.55 + width, y + size * 0.08, "TOYS")


def image_path(product: dict) -> Path | None:
    raw = str(product.get("image") or "").strip()
    if not raw or raw.startswith("http://") or raw.startswith("https://"):
        return None
    name = Path(raw).name
    for width in (540, 320, 160):
        candidate = ROOT / "public" / "media" / "products" / str(width) / name
        if candidate.exists():
            return candidate
    original = ROOT / "public" / "products" / name
    return original if original.exists() else None


@functools.lru_cache(maxsize=256)
def optimized_image_path(source: Path | None) -> Path | None:
    if not source:
        return None
    target_dir = ROOT / "tmp" / "pdfs" / "catalog-images"
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / f"{source.stem}.jpg"
    if target.exists() and target.stat().st_mtime >= source.stat().st_mtime:
        return target
    with PILImage.open(source) as image:
        image.thumbnail((440, 320), PILImage.Resampling.LANCZOS)
        if image.mode in {"RGBA", "LA"}:
            background = PILImage.new("RGB", image.size, "white")
            background.paste(image, mask=image.getchannel("A"))
            image = background
        else:
            image = image.convert("RGB")
        image.save(target, "JPEG", quality=78, optimize=True, progressive=True)
    return target


def draw_contained_image(pdf: canvas.Canvas, path: Path | None, x: float, y: float, width: float, height: float) -> None:
    pdf.setFillColor(HexColor("#F0ECE3"))
    pdf.roundRect(x, y, width, height, 8, fill=1, stroke=0)
    if not path:
        pdf.setFillColor(INK_SOFT)
        pdf.setFont("Catalog", 8)
        pdf.drawCentredString(x + width / 2, y + height / 2, "Ürün görseli")
        return
    with PILImage.open(path) as image:
        source_width, source_height = image.size
    scale = min((width - 10) / source_width, (height - 10) / source_height)
    render_width = source_width * scale
    render_height = source_height * scale
    pdf.drawImage(
        str(path),
        x + (width - render_width) / 2,
        y + (height - render_height) / 2,
        width=render_width,
        height=render_height,
        preserveAspectRatio=True,
        mask="auto",
    )


def draw_cover(pdf: canvas.Canvas, product_count: int, total_pages: int) -> None:
    width, height = A4
    pdf.setFillColor(PAPER)
    pdf.rect(0, 0, width, height, fill=1, stroke=0)
    pdf.setFillColor(HexColor("#E8DFF5"))
    pdf.circle(width + 30, height - 190, 180, fill=1, stroke=0)
    pdf.setFillColor(HexColor("#F8D8D2"))
    pdf.circle(-45, 75, 150, fill=1, stroke=0)
    draw_brand(pdf, 54, height - 92, 27)
    pdf.setFillColor(PURPLE)
    pdf.setFont("Catalog-Bold", 10)
    pdf.drawString(54, height - 195, "2026 TOPTAN OYUNCAK KATALOĞU")
    pdf.setFillColor(INK)
    pdf.setFont("Catalog-Bold", 38)
    pdf.drawString(54, height - 260, "Raflara neşe,")
    pdf.drawString(54, height - 305, "mağazanıza hareket.")
    pdf.setFillColor(INK_SOFT)
    pdf.setFont("Catalog", 13)
    pdf.drawString(54, height - 352, f"{product_count} ürün · Türkiye geneli teslimat")
    pdf.setFillColor(INK)
    pdf.roundRect(54, 170, width - 108, 112, 18, fill=1, stroke=0)
    pdf.setFillColor(white)
    pdf.setFont("Catalog-Bold", 16)
    pdf.drawString(78, 240, "Toptan teklif ve stok teyidi")
    pdf.setFont("Catalog", 10)
    pdf.setFillColor(HexColor("#D7E2DE"))
    pdf.drawString(78, 218, "Ürün kodlarını ve talep adetlerini WhatsApp üzerinden iletin.")
    pdf.setFillColor(CORAL)
    pdf.setFont("Catalog-Bold", 12)
    pdf.drawString(78, 190, "0539 346 85 27")
    pdf.setFillColor(INK_SOFT)
    pdf.setFont("Catalog", 9)
    pdf.drawString(54, 58, "www.bucuruktoys.com")
    pdf.drawRightString(width - 54, 58, f"{total_pages} sayfa")
    pdf.showPage()


def draw_product_card(pdf: canvas.Canvas, product: dict, x: float, y: float, width: float, height: float) -> None:
    pdf.setFillColor(white)
    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(0.6)
    pdf.roundRect(x, y, width, height, 10, fill=1, stroke=1)
    image_height = 102
    draw_contained_image(pdf, optimized_image_path(image_path(product)), x + 7, y + height - image_height - 7, width - 14, image_height)
    text_x = x + 10
    text_width = width - 20
    pdf.setFillColor(PURPLE)
    pdf.setFont("Catalog-Bold", 7)
    pdf.drawString(text_x, y + height - image_height - 24, str(product.get("sku") or ""))
    pdf.setFillColor(INK)
    name_lines = fit_lines(str(product.get("name") or "Ürün"), "Catalog-Bold", 9, text_width, 2)
    name_y = y + height - image_height - 41
    for line in name_lines:
        pdf.setFont("Catalog-Bold", 9)
        pdf.drawString(text_x, name_y, line)
        name_y -= 11
    pdf.setFillColor(INK_SOFT)
    note_lines = fit_lines(str(product.get("note") or "Toptan katalog ürünü"), "Catalog", 7.5, text_width, 2)
    note_y = y + 40
    for line in note_lines:
        pdf.setFont("Catalog", 7.5)
        pdf.drawString(text_x, note_y, line)
        note_y -= 9
    pdf.setStrokeColor(LINE)
    pdf.line(text_x, y + 22, x + width - 10, y + 22)
    pdf.setFillColor(INK)
    pdf.setFont("Catalog-Bold", 7.5)
    pack = fit_lines(str(product.get("pack") or "Teklif ile paket"), "Catalog-Bold", 7.5, text_width, 1)[0]
    pdf.drawString(text_x, y + 9, pack)


def draw_catalog_page(pdf: canvas.Canvas, title: str, products: list[dict], page_no: int, total_pages: int, part: int, part_count: int) -> None:
    width, height = A4
    pdf.setFillColor(PAPER)
    pdf.rect(0, 0, width, height, fill=1, stroke=0)
    draw_brand(pdf, 32, height - 44, 13)
    pdf.setFillColor(PURPLE)
    pdf.setFont("Catalog-Bold", 7)
    pdf.drawString(32, height - 79, "BÜCÜRÜKTOYS TOPTAN KATALOG")
    pdf.setFillColor(INK)
    pdf.setFont("Catalog-Bold", 22)
    pdf.drawString(32, height - 108, title)
    pdf.setFillColor(INK_SOFT)
    pdf.setFont("Catalog", 8)
    suffix = f" · {part}/{part_count}" if part_count > 1 else ""
    pdf.drawRightString(width - 32, height - 103, f"{len(products)} ürün{suffix}")
    pdf.setStrokeColor(INK)
    pdf.setLineWidth(1.1)
    pdf.line(32, height - 118, width - 32, height - 118)

    columns, rows = 3, 3
    gap = 8
    grid_top = height - 133
    grid_bottom = 43
    card_width = (width - 64 - gap * (columns - 1)) / columns
    card_height = (grid_top - grid_bottom - gap * (rows - 1)) / rows
    for index, product in enumerate(products):
        column = index % columns
        row = index // columns
        x = 32 + column * (card_width + gap)
        y = grid_top - (row + 1) * card_height - row * gap
        draw_product_card(pdf, product, x, y, card_width, card_height)

    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(0.6)
    pdf.line(32, 31, width - 32, 31)
    pdf.setFillColor(INK_SOFT)
    pdf.setFont("Catalog", 7)
    pdf.drawString(32, 18, "BÜCÜRÜKTOYS · Türkiye geneli toptan oyuncak")
    pdf.drawRightString(width - 32, 18, f"{page_no}/{total_pages}")
    pdf.showPage()


def generate(source_url: str, output: Path) -> None:
    register_fonts()
    products = load_products(source_url)
    grouped = {category: [p for p in products if p.get("category") == category] for category, _ in CATEGORIES}
    pages: list[tuple[str, list[dict], int, int]] = []
    for category, title in CATEGORIES:
        items = grouped[category]
        part_count = max(1, math.ceil(len(items) / 9))
        for part in range(part_count):
            chunk = items[part * 9 : part * 9 + 9]
            if chunk:
                pages.append((title, chunk, part + 1, part_count))
    total_pages = 1 + len(pages)
    output.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(output), pagesize=A4, pageCompression=1)
    pdf.setTitle("BÜCÜRÜKTOYS 2026 Toptan Oyuncak Kataloğu")
    pdf.setAuthor("BÜCÜRÜKTOYS")
    pdf.setSubject("Türkiye geneli toptan oyuncak kataloğu")
    draw_cover(pdf, len(products), total_pages)
    for index, (title, chunk, part, part_count) in enumerate(pages, start=2):
        draw_catalog_page(pdf, title, chunk, index, total_pages, part, part_count)
    pdf.save()
    PUBLIC_COPY.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(output, PUBLIC_COPY)
    print(json.dumps({"output": str(output), "publicCopy": str(PUBLIC_COPY), "products": len(products), "pages": total_pages}, ensure_ascii=False))


def main() -> None:
    parser = argparse.ArgumentParser(description="BÜCÜRÜKTOYS PDF katalog üreticisi")
    parser.add_argument("--source-url", default=DEFAULT_SOURCE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    generate(args.source_url, args.output.resolve())


if __name__ == "__main__":
    main()
