# -*- coding: utf-8 -*-
"""Fiyat — görsellere fiyat ve açıklama yazma galerisi.

Her kartın altında yan yana iki alan: Fiyat · Yazı. Yazdıkça kaydedilir.
Kayıt: %APPDATA%\\AyiklaFiyat\\fiyatlar.json  ·  Excel listesi: <açılan klasör>\\_FIYAT_LISTESI.csv
Klavye kısayollarının tamamı: F1
"""
import os
import sys
import re
import csv
import json
import time
import subprocess
from bisect import bisect_left, bisect_right
from collections import OrderedDict
from functools import lru_cache
from datetime import datetime

from PySide6.QtCore import (Qt, QPoint, QRect, QRectF, QPointF, QSize, QObject, Signal, QBuffer, QByteArray, QIODevice,
                            QRunnable, QThreadPool, QTimer, QSettings, QEvent, QStandardPaths,
                            QRegularExpression, QLockFile)
from PySide6.QtGui import (QPainter, QColor, QPen, QPixmap, QImage, QImageReader, QImageIOHandler,
                           QIcon, QPainterPath, QKeySequence, QShortcut, QFont, QRegion,
                           QGuiApplication, QRegularExpressionValidator)
from PySide6.QtWidgets import (QApplication, QWidget, QAbstractScrollArea, QHBoxLayout,
                               QVBoxLayout, QLineEdit, QLabel, QToolButton, QFileDialog,
                               QDialog, QToolTip, QSizePolicy, QMenu, QPushButton, QProgressBar,
                               QButtonGroup, QFrame, QGraphicsDropShadowEffect, QMessageBox)

# ---------------------------------------------------------------- ayarlar
APP = "AyiklaFiyat"
ROW_CHOICES = [1, 2, 3, 4, 5, 6]   # ekranda kaç sıra görsel
DEFAULT_ROWS = 2
SKIP_DIRS = {"_RED", "_ARSIV", "_ISLEM", "_ONAY", "_COP", "$RECYCLE.BIN", "System Volume Information"}
CSV_NAME = "_FIYAT_LISTESI.csv"
IS_WIN = sys.platform.startswith("win")

# açık tema renkleri (kontrast WCAG AA: yazı ≥ 4.5:1, kenarlık ≥ 3:1)
CANVAS = QColor("#ECEEF1")      # pencere zemini
SURFACE = QColor("#FFFFFF")     # kart, üst çubuk
LETTERBOX = QColor("#F5F6F8")   # görselin arkası
INK = QColor("#1F2328")         # ana yazı
INK2 = QColor("#57606A")        # ikincil yazı / ikon
MUTED = QColor("#6E7781")       # ipucu yazısı
STROKE = QColor("#D5DAE0")      # kart kenarı, ayırıcı
STROKE_HOVER = QColor("#AFB8C1")
ACCENT = QColor("#0969DA")      # imleç, odak
PRICE = QColor("#1A7F37")       # fiyatlı
TEXT = MUTED

GAP = 5                    # kartlar arası boşluğun yarısı
PAD = 8                    # kart iç boşluğu
RADIUS = 10
BAR_RATIO = 0.10           # yazı barı yüksekliği / kart yüksekliği
BAR_MIN = 40
BAR_MAX = 56
PRICE_SHARE = 0.34         # fiyat alanının şerit genişliğindeki payı
CACHE_MB = 300

APP_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(APP_DIR, "fiyat_log.txt")

HELP = [
    ("Fiyat ve yazı", [
        ("Rakam yaz", "İmleçteki kartın fiyatına yazmaya başlar"),
        ("Harf yaz", "İmleçteki kartın yazısına yazmaya başlar"),
        ("Enter  ·  F2  ·  Tab", "Fiyat alanına gir"),
        ("F3", "Yazı alanına gir"),
        ("Alanda Enter", "Fiyat → yazı → sonraki kartın fiyatı"),
        ("Alanda Shift+Enter", "Geri git"),
        ("Alanda Tab / Shift+Tab", "Sonraki / önceki alan"),
        ("Alanda ↑ ↓", "Üst / alt kartın aynı alanı"),
        ("Alanda Esc", "Değişikliği iptal et, alandan çık"),
        ("Del", "İmleçteki kartın fiyat ve yazısını sil"),
        ("Ctrl+Z", "Son değişikliği geri al (alanın içindeyken: yazıyı geri al)"),
        ("Ctrl+S", "Hemen kaydet + Excel listesini yaz"),
    ]),
    ("Gezinme", [
        ("← → ↑ ↓", "İmleci kartlar arasında gezdir"),
        ("PgUp  ·  PgDn", "Bir sayfa yukarı / aşağı"),
        ("Home  ·  End", "İlk / son kart"),
        ("Ctrl+Boşluk", "Sıradaki fiyatsız karta git"),
        ("Ctrl+1  ·  Ctrl+2  ·  Ctrl+3", "Tümü  ·  Fiyatsızlar  ·  Fiyatlılar"),
        ("Tekerlek", "Bir sıra kaydır"),
    ]),
    ("Görünüm ve dosya", [
        ("Ctrl+Enter  ·  çift tık", "Görseli aç"),
        ("Ctrl+E  ·  sağ tık", "Klasörde göster"),
        ("Ctrl + / Ctrl −  ·  Ctrl+tekerlek", "Görselleri büyüt / küçült (ekrandaki sıra sayısı)"),
        ("F5", "Yenile"),
        ("F11", "Tam ekran  ·  Esc: tam ekrandan çık"),
        ("Ctrl+O", "Klasör seç"),
        ("Ctrl+L", "Yol kutusuna git"),
        ("F1", "Bu liste"),
        ("Ctrl+Q", "Kapat"),
    ]),
]


STYLE = """
QWidget { color:#1F2328; }
Main, QWidget#bar { background:#FFFFFF; }
QWidget#bar { border-bottom:1px solid #D5DAE0; }
QLineEdit#path { background:#F6F8FA; color:#1F2328; border:1px solid #D5DAE0; border-radius:6px;
                 padding:5px 10px; selection-background-color:#0969DA; }
QLineEdit#path:hover { border-color:#AFB8C1; }
QLineEdit#path:focus { border:2px solid #0969DA; padding:4px 9px; background:#FFFFFF; }
QToolButton { background:transparent; color:#1F2328; border:1px solid transparent; border-radius:6px;
              padding:5px 8px; }
QToolButton:hover { background:#F3F4F6; border-color:#D5DAE0; }
QToolButton:pressed { background:#E7EAED; }
QToolButton#gridbtn::menu-indicator { image:none; width:0; }
QToolButton#segbtn { border:1px solid #D5DAE0; border-radius:0; padding:5px 14px; color:#57606A;
                     background:#FFFFFF; margin-left:-1px; }
QToolButton#segbtn[pos="first"] { border-top-left-radius:6px; border-bottom-left-radius:6px; margin-left:0; }
QToolButton#segbtn[pos="last"] { border-top-right-radius:6px; border-bottom-right-radius:6px; }
QToolButton#segbtn:hover { background:#F3F4F6; color:#1F2328; }
QToolButton#segbtn:checked { background:#DDF4FF; border-color:#54AEFF; color:#0969DA; font-weight:600; }
QLabel#count { color:#1F2328; font-weight:600; }
QLabel#status { color:#57606A; }
QProgressBar#progress { background:#E7EAED; border:none; border-radius:3px; }
QProgressBar#progress::chunk { background:#1A7F37; border-radius:3px; }
QLineEdit#fiyat, QLineEdit#yazi { background:#FFFFFF; color:#1F2328; border:1px solid #8C959F;
                 border-radius:8px; padding:0 10px; selection-background-color:#0969DA;
                 placeholder-text-color:#6E7781; }
QLineEdit#fiyat { font-weight:600; }
QLineEdit#fiyat:hover, QLineEdit#yazi:hover { border-color:#57606A; }
QLineEdit#fiyat[filled="true"] { color:#1A7F37; border-color:#1A7F37; background:#F0FFF4; }
QLineEdit#fiyat:focus, QLineEdit#yazi:focus { border:2px solid #0969DA; padding:0 9px; background:#FFFFFF; }
QWidget#empty { background:transparent; }
QLabel#emptyTitle { font-size:20px; font-weight:600; color:#1F2328; }
QLabel#emptyText { font-size:14px; color:#57606A; max-width:460px; }
QPushButton#primary { background:#0969DA; color:#FFFFFF; border:none; border-radius:8px;
                      padding:10px 22px; font-size:14px; font-weight:600; }
QPushButton#primary:hover { background:#0860C7; }
QPushButton#primary:pressed { background:#0757B4; }
QMenu { background:#FFFFFF; color:#1F2328; border:1px solid #D5DAE0; padding:4px; }
QMenu::item { padding:7px 24px; border-radius:4px; }
QMenu::item:selected { background:#F3F4F6; }
QMenu::item:checked { color:#0969DA; font-weight:600; }
QScrollBar:vertical { background:#ECEEF1; width:10px; margin:2px; }
QScrollBar::handle:vertical { background:#C1C7CD; border-radius:3px; min-height:40px; }
QScrollBar::handle:vertical:hover { background:#8C959F; }
QScrollBar::add-line, QScrollBar::sub-line { height:0; }
QScrollBar::add-page, QScrollBar::sub-page { background:none; }
QToolTip { background:#1F2328; color:#FFFFFF; border:none; padding:5px 8px; }
QFrame#tourBubble { background:#FFFFFF; border-radius:12px; }
QLabel#tourStep { color:#0969DA; font-size:12px; font-weight:600; }
QLabel#tourTitle { color:#1F2328; font-size:18px; font-weight:600; }
QLabel#tourText { color:#57606A; font-size:14px; }
QPushButton#tourSkip { background:transparent; color:#57606A; border:none; padding:8px 6px; font-size:13px; }
QPushButton#tourSkip:hover { color:#1F2328; }
QPushButton#tourNext { background:#0969DA; color:#FFFFFF; border:none; border-radius:8px;
                       padding:8px 20px; font-size:14px; font-weight:600; }
QPushButton#tourNext:hover { background:#0860C7; }
"""


# ---------------------------------------------------------------- yardımcılar
def natural_key(s):
    return [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", s.lower())]

def image_exts():
    fmts = {bytes(f).decode().lower() for f in QImageReader.supportedImageFormats()}
    fmts -= {"pdf", "svg", "svgz", "cur", "xbm", "xpm", "pbm", "pgm", "ppm", "wbmp", "icns"}
    return {"." + f for f in fmts}

def L(p, force=False):
    """Windows: 260+ karakterlik yollar için uzun yol öneki ekler (dosya işlemleri bunu kullanır)."""
    if not IS_WIN or p.startswith("\\\\?\\"):
        return p
    p = os.path.abspath(p)
    if force or len(p) >= 240:
        return "\\\\?\\UNC\\" + p[2:] if p.startswith("\\\\") else "\\\\?\\" + p
    return p

def unL(p):
    if p.startswith("\\\\?\\UNC\\"):
        return "\\\\" + p[8:]
    if p.startswith("\\\\?\\"):
        return p[4:]
    return p

def sort_key(root, path):
    try:
        rel = os.path.relpath(os.path.dirname(path), root)
    except ValueError:
        rel = path
    rel = "" if rel == "." else rel
    return (natural_key(rel), natural_key(os.path.basename(path)))

SKIP_LOWER = {"appdata", "node_modules", ".git", "__pycache__", "windows", "program files",
              "program files (x86)", "programdata", "$windows.~bt", "$windows.~ws"}


def _skip_dir(e):
    """Taranmayacak klasör: program klasörleri, kısayol bağlantıları, Windows'un gizli/sistem klasörleri."""
    n = e.name
    if n in SKIP_DIRS or n.lower() in SKIP_LOWER:
        return True
    try:
        if e.is_symlink() or (hasattr(e, "is_junction") and e.is_junction()):
            return True
        if IS_WIN and e.stat(follow_symlinks=False).st_file_attributes & 0x6:   # gizli | sistem
            return True
    except OSError:
        return True
    return False


def scan_folder(root, exts, progress=None, cancel=None):
    """Kök + tüm alt klasörler (derinlik sınırsız). -> (yollar, klasör_sayısı, okunamayan); iptalde yollar None."""
    out, ndirs, nerr = [], 0, 0
    stack = [L(root, force=True)]
    last = time.monotonic()
    while stack:
        if cancel is not None and cancel():
            return None, ndirs, nerr
        d = stack.pop()
        ndirs += 1
        try:
            with os.scandir(d) as it:
                for e in it:
                    try:
                        if e.is_dir(follow_symlinks=False):
                            if not _skip_dir(e):
                                stack.append(e.path)
                        elif not e.name.startswith("._") and os.path.splitext(e.name)[1].lower() in exts:
                            out.append(unL(e.path))
                    except OSError:
                        pass
        except OSError:
            nerr += 1
        if progress is not None and time.monotonic() - last > 0.25:
            last = time.monotonic()
            progress(len(out))
    out.sort(key=lambda p: sort_key(root, p))
    return out, ndirs, nerr


class ScanSignals(QObject):
    progress = Signal(int, int)                # nesil, bulunan görsel
    done = Signal(int, object, int, int)       # nesil, yollar (iptalde None), klasör, okunamayan


class ScanTask(QRunnable):
    """Klasörü arka planda tarar: büyük klasörde de pencere donmaz."""

    def __init__(self, root, exts, gen, current, sig):
        super().__init__()
        self.root, self.exts, self.gen, self.current, self.sig = root, exts, gen, current, sig
        self.setAutoDelete(True)

    def _emit(self, sig, *a):
        try:
            sig.emit(self.gen, *a)
        except RuntimeError:                   # program kapanırken
            pass

    def run(self):
        try:
            items, nd, ne = scan_folder(self.root, self.exts,
                                        progress=lambda n: self._emit(self.sig.progress, n),
                                        cancel=lambda: self.current() != self.gen)
        except Exception:
            items, nd, ne = None, 0, 1
        self._emit(self.sig.done, items, nd, ne)

def open_file(path):
    try:
        if IS_WIN:
            os.startfile(path)
        elif sys.platform == "darwin":
            subprocess.Popen(["open", path])
        else:
            subprocess.Popen(["xdg-open", path])
    except Exception:
        pass

def reveal_in_explorer(path):
    try:
        if IS_WIN:
            subprocess.Popen('explorer /select,"%s"' % os.path.normpath(path))
        elif sys.platform == "darwin":
            subprocess.Popen(["open", "-R", path])
        else:
            subprocess.Popen(["xdg-open", os.path.dirname(path)])
    except Exception:
        pass


def log(line):
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(datetime.now().strftime("%Y-%m-%d %H:%M:%S  ") + line + "\n")
    except Exception:
        pass


@lru_cache(maxsize=262144)
def norm_key(p):
    """Kayıt anahtarı (büyük/küçük harf ve yol biçimi tekleştirilmiş); sık çağrıldığı için önbellekli."""
    return os.path.normcase(os.path.abspath(p))


def clean_price(s):
    return re.sub(r"\s+", "", s or "")


# ---------------------------------------------------------------- kayıt
class PriceStore:
    """{normalize_yol: {"fiyat": str, "yazi": str, "yol": tam_yol}} — %APPDATA% altında JSON."""

    def __init__(self, path):
        self.path = path
        self.data = {}
        self.dirty = False
        self.version = 0                           # her değişiklikte artar (Excel listesi gerekince yazılsın)
        try:
            with open(path, encoding="utf-8") as f:
                self.data = json.load(f)
            if not isinstance(self.data, dict):
                raise ValueError("biçim")
        except FileNotFoundError:
            self.data = {}
        except Exception:                          # bozuk dosya: silinmesin, yanına yedek olarak taşınsın
            self.data = {}
            try:
                os.replace(path, path[:-5] + datetime.now().strftime("-bozuk-%Y%m%d-%H%M%S.json"))
            except OSError:
                pass

    @staticmethod
    def key(p):
        return norm_key(p)

    def get(self, p, field):
        return self.data.get(self.key(p), {}).get(field, "")

    def set(self, p, field, value):
        k = self.key(p)
        rec = self.data.get(k, {"fiyat": "", "yazi": "", "yol": os.path.abspath(p)})
        if rec.get(field, "") == value:
            return False
        rec[field] = value
        rec["yol"] = os.path.abspath(p)
        if not rec.get("fiyat") and not rec.get("yazi"):
            self.data.pop(k, None)
        else:
            self.data[k] = rec
        self.dirty = True
        self.version += 1
        return True

    def has_price(self, p):
        return bool(self.get(p, "fiyat"))

    def save(self):
        if not self.dirty:
            return
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        tmp = self.path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(self.data, f, ensure_ascii=False, indent=0)
        os.replace(tmp, self.path)
        self.dirty = False


def export_csv(root, items, store):
    """Açılan klasöre Excel'in açabileceği liste yazar (UTF-8 BOM, ; ayraçlı)."""
    path = os.path.join(root, CSV_NAME)
    tmp = path + ".tmp"
    n = len(root.rstrip("\\/")) + 1                # alt klasör adı: kök yolundan sonrası
    data = store.data
    with open(tmp, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["Klasör", "Dosya", "Fiyat", "Yazı"])
        for p in items:
            d, name = os.path.split(p)
            rec = data.get(norm_key(p)) or {}
            w.writerow([d[n:], name, rec.get("fiyat", ""), rec.get("yazi", "")])
    try:
        os.replace(tmp, path)
    except OSError:                       # Excel'de açık: geçici dosyayı bırakma
        try:
            os.remove(tmp)
        except OSError:
            pass
        raise
    return path


# ---------------------------------------------------------------- ikonlar
def draw_icon(p, kind, r, color, width=None):
    """r: QRectF ikon kutusu."""
    s = min(r.width(), r.height())
    w = width or max(1.4, s * 0.13)
    p.setPen(QPen(color, w, Qt.SolidLine, Qt.RoundCap, Qt.RoundJoin))
    p.setBrush(Qt.NoBrush)
    x0 = r.center().x() - s / 2
    y0 = r.center().y() - s / 2

    def P(fx, fy):
        return QPointF(x0 + fx * s, y0 + fy * s)

    if kind == "x":
        p.drawLine(P(.18, .18), P(.82, .82))
        p.drawLine(P(.82, .18), P(.18, .82))
    elif kind == "check":
        path = QPainterPath(P(.12, .55))
        path.lineTo(P(.40, .82))
        path.lineTo(P(.90, .20))
        p.drawPath(path)
    elif kind == "minus":
        p.drawLine(P(.15, .5), P(.85, .5))
    elif kind == "note":
        path = QPainterPath(P(.14, .12))
        path.lineTo(P(.86, .12))
        path.lineTo(P(.86, .62))
        path.lineTo(P(.60, .88))
        path.lineTo(P(.14, .88))
        path.closeSubpath()
        p.drawPath(path)
        fold = QPainterPath(P(.86, .62))
        fold.lineTo(P(.60, .62))
        fold.lineTo(P(.60, .88))
        p.drawPath(fold)
    elif kind == "folder":
        path = QPainterPath(P(.10, .25))
        path.lineTo(P(.40, .25))
        path.lineTo(P(.48, .35))
        path.lineTo(P(.90, .35))
        path.lineTo(P(.90, .80))
        path.lineTo(P(.10, .80))
        path.closeSubpath()
        p.drawPath(path)
    elif kind in ("refresh", "undo"):
        rect = QRectF(P(.18, .18), P(.82, .82))
        if kind == "refresh":
            p.drawArc(rect, 60 * 16, 290 * 16)
            a, b, c = P(.62, .10), P(.80, .26), P(.58, .34)
        else:
            p.drawArc(rect, 200 * 16, -250 * 16)
            a, b, c = P(.10, .30), P(.20, .55), P(.40, .40)
        path = QPainterPath(a)
        path.lineTo(b)
        path.lineTo(c)
        p.drawPath(path)
    elif kind == "full":
        for (ax, ay, bx, by, cx, cy) in [(.15, .38, .15, .15, .38, .15), (.62, .15, .85, .15, .85, .38),
                                         (.85, .62, .85, .85, .62, .85), (.38, .85, .15, .85, .15, .62)]:
            path = QPainterPath(P(ax, ay))
            path.lineTo(P(bx, by))
            path.lineTo(P(cx, cy))
            p.drawPath(path)
    elif kind == "help":
        p.drawEllipse(QRectF(P(.10, .10), P(.90, .90)))
        path = QPainterPath(P(.37, .38))
        path.cubicTo(P(.37, .20), P(.63, .20), P(.63, .38))
        path.cubicTo(P(.63, .50), P(.50, .50), P(.50, .60))
        p.drawPath(path)
        p.drawPoint(P(.50, .74))
    elif kind == "grid":
        for (ax, ay) in [(.12, .12), (.56, .12), (.12, .56), (.56, .56)]:
            p.drawRoundedRect(QRectF(P(ax, ay), P(ax + .32, ay + .32)), s * .05, s * .05)
    elif kind == "eye":
        path = QPainterPath(P(.06, .5))
        path.quadTo(P(.5, .08), P(.94, .5))
        path.quadTo(P(.5, .92), P(.06, .5))
        p.drawPath(path)
        p.drawEllipse(QRectF(P(.38, .38), P(.62, .62)))


def make_icon(kind, color, size=18, width_ratio=0.09):
    pm = QPixmap(size * 2, size * 2)
    pm.fill(Qt.transparent)
    p = QPainter(pm)
    p.setRenderHint(QPainter.Antialiasing)
    draw_icon(p, kind, QRectF(0, 0, size * 2, size * 2), color, width=size * 2 * width_ratio)
    p.end()
    pm.setDevicePixelRatio(2)
    return QIcon(pm)


def app_icon_image(size=256):
    """Uygulama simgesi: mavi zemin üzerinde beyaz fiyat etiketi."""
    img = QImage(size, size, QImage.Format_ARGB32)
    img.fill(Qt.transparent)
    p = QPainter(img)
    p.setRenderHint(QPainter.Antialiasing)
    s = float(size)
    p.setPen(Qt.NoPen)
    p.setBrush(ACCENT)
    p.drawRoundedRect(QRectF(s * .04, s * .04, s * .92, s * .92), s * .22, s * .22)
    p.translate(s / 2, s / 2)
    p.rotate(-45)
    w, h = s * .36, s * .64                        # etiket: üstte sivri uç, ortada delik
    tag = QPainterPath()
    tag.moveTo(0, -h / 2)
    tag.lineTo(w / 2, -h / 2 + w * .5)
    tag.lineTo(w / 2, h / 2 - s * .05)
    tag.quadTo(w / 2, h / 2, w / 2 - s * .05, h / 2)
    tag.lineTo(-w / 2 + s * .05, h / 2)
    tag.quadTo(-w / 2, h / 2, -w / 2, h / 2 - s * .05)
    tag.lineTo(-w / 2, -h / 2 + w * .5)
    tag.closeSubpath()
    hole = QPainterPath()
    hole.addEllipse(QPointF(0, -h / 2 + w * .62), s * .045, s * .045)
    p.setBrush(QColor("#FFFFFF"))
    p.drawPath(tag.subtracted(hole))
    p.setPen(QPen(ACCENT, s * .035, Qt.SolidLine, Qt.RoundCap))
    for k in (0.10, 0.20):                         # etiket üzerindeki iki çizgi
        p.drawLine(QPointF(-w * .26, k * h), QPointF(w * .26, k * h))
    p.end()
    return img


# ---------------------------------------------------------------- görsel oranları
def _exif_orientation(seg):
    """JPEG APP1 (Exif) bölümündeki yön etiketi (1-8) ya da None."""
    if not seg.startswith(b"Exif\x00\x00"):
        return None
    t = seg[6:]
    e = {b"II": "little", b"MM": "big"}.get(t[:2])
    if e is None or len(t) < 8:
        return None
    off = int.from_bytes(t[4:8], e)
    if off + 2 > len(t):
        return None
    for k in range(int.from_bytes(t[off:off + 2], e)):
        p = off + 2 + 12 * k
        if p + 12 > len(t):
            break
        if int.from_bytes(t[p:p + 2], e) == 0x0112:
            return int.from_bytes(t[p + 8:p + 10], e)
    return None


def _jpeg_size(f):
    """JPEG başlığından (en, boy, döndür_mü). Sadece işaretçiler okunur, görüntü verisine inilmez."""
    f.seek(2)
    orient = 1
    while True:
        b = f.read(1)
        while b and b != b"\xff":
            b = f.read(1)
        while b == b"\xff":
            b = f.read(1)
        if not b:
            return None
        m = b[0]
        if f.tell() > (16 << 20):                   # bozuk dosya: başlık bu kadar uzun olmaz
            return None
        if m == 0x01 or 0xD0 <= m <= 0xD8:
            continue
        if m in (0xD9, 0xDA):                       # görüntü sonu / veri başladı: boyut yok
            return None
        ln = int.from_bytes(f.read(2), "big")
        if ln < 2:
            return None
        if 0xC0 <= m <= 0xCF and m not in (0xC4, 0xC8, 0xCC):
            d = f.read(5)
            if len(d) < 5:
                return None
            return int.from_bytes(d[3:5], "big"), int.from_bytes(d[1:3], "big"), orient in (5, 6, 7, 8)
        if m == 0xE1 and orient == 1:
            orient = _exif_orientation(f.read(ln - 2)) or 1
        else:
            f.seek(ln - 2, 1)


def _header_size(f):
    """PNG / JPEG / WebP / GIF / BMP başlığından (en, boy, döndür_mü); tanınmazsa None."""
    h = f.read(32)
    if h[:8] == b"\x89PNG\r\n\x1a\n" and h[12:16] == b"IHDR":
        return int.from_bytes(h[16:20], "big"), int.from_bytes(h[20:24], "big"), False
    if h[:2] == b"\xff\xd8":
        return _jpeg_size(f)
    if h[:4] == b"RIFF" and h[8:12] == b"WEBP" and len(h) >= 30:
        c = h[12:16]
        if c == b"VP8X":
            return int.from_bytes(h[24:27], "little") + 1, int.from_bytes(h[27:30], "little") + 1, False
        if c == b"VP8L":
            v = int.from_bytes(h[21:25], "little")
            return (v & 0x3FFF) + 1, ((v >> 14) & 0x3FFF) + 1, False
        if c == b"VP8 ":
            return int.from_bytes(h[26:28], "little") & 0x3FFF, int.from_bytes(h[28:30], "little") & 0x3FFF, False
        return None
    if h[:6] in (b"GIF87a", b"GIF89a"):
        return int.from_bytes(h[6:8], "little"), int.from_bytes(h[8:10], "little"), False
    if h[:2] == b"BM" and len(h) >= 26:
        if int.from_bytes(h[14:18], "little") == 12:
            return int.from_bytes(h[18:20], "little"), int.from_bytes(h[20:22], "little"), False
        return (abs(int.from_bytes(h[18:22], "little", signed=True)),
                abs(int.from_bytes(h[22:26], "little", signed=True)), False)
    return None


def read_aspect(path):
    """Görselin en/boy oranı (EXIF dönüşü dahil); okunamazsa None.
    Dosya Python ile okunur: disk yavaşken bile arayüz donmaz (Qt'nin dosya okuması GIL'i bırakmıyor)."""
    try:
        with open(L(path), "rb") as f:
            try:
                s = _header_size(f)
            except Exception:
                s = None
            if s is None:                             # başka biçim: ilk 1 MB'ı belleğe al, Qt çözsün
                f.seek(0)
                buf = QBuffer()
                buf.setData(QByteArray(f.read(1 << 20)))
                buf.open(QIODevice.ReadOnly)
                r = QImageReader(buf)
                sz = r.size()
                try:
                    rot = bool(r.transformation() & QImageIOHandler.Transformation.TransformationRotate90)
                except Exception:
                    rot = False
                del r                                 # okuyucu, tamponundan önce silinmeli (yoksa çöker)
                if not sz.isValid():
                    return None
                s = (sz.width(), sz.height(), rot)
        w, h, rot = s
        if w <= 0 or h <= 0:
            return None
        return h / w if rot else w / h
    except Exception:
        return None


def fit_rect(area, sw, sh):
    """Görseli alana yerleştir: oran neredeyse aynıysa tam doldur (kenarda çizgi kalmasın), değilse sığdır."""
    k1 = min(area.width() / sw, area.height() / sh)
    k2 = max(area.width() / sw, area.height() / sh)
    k = k2 if k2 <= k1 * 1.04 else k1
    dw, dh = sw * k, sh * k
    return QRectF(area.left() + (area.width() - dw) / 2, area.top() + (area.height() - dh) / 2, dw, dh)


class AspectStore:
    """Görsel oranı önbelleği {normalize_yol: [bayt, değişim_ms, oran]} — klasör açılınca kartlar hemen doğru boyda."""
    LIMIT = 80000

    def __init__(self, path):
        self.path = path
        self.data = {}
        self.dirty = False
        try:
            with open(path, "r", encoding="utf-8") as f:
                d = json.load(f)
            if isinstance(d, dict):
                self.data = d
        except Exception:
            pass

    @staticmethod
    def key(p):
        return norm_key(p)

    def get(self, p):
        v = self.data.get(self.key(p))
        try:
            a = float(v[2])
            return a if a > 0 else None
        except Exception:
            return None

    def snapshot(self, paths):
        out = {}
        for p in paths:
            v = self.data.get(self.key(p))
            if v:
                out[p] = v
        return out

    def put(self, p, size, mtime, a):
        k = self.key(p)
        v = [size, mtime, round(a, 5)]
        if self.data.get(k) != v:
            self.data.pop(k, None)
            self.data[k] = v
            self.dirty = True

    def save(self):
        if not self.dirty:
            return
        extra = len(self.data) - self.LIMIT
        if extra > 0:                                    # en eski kayıtları at
            for k in list(self.data)[:extra]:
                del self.data[k]
        tmp = self.path + ".tmp"
        try:
            os.makedirs(os.path.dirname(self.path) or ".", exist_ok=True)
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(self.data, f, ensure_ascii=False, separators=(",", ":"))
            os.replace(tmp, self.path)
            self.dirty = False
        except OSError:
            try:
                os.remove(tmp)
            except OSError:
                pass


class AspectSignals(QObject):
    got = Signal(int, object)      # nesil, [(yol, oran|None, bayt, değişim_ms)]
    finished = Signal(int)


class AspectScan(QRunnable):
    """Arka planda görsel oranlarını okur; önbellekte olup değişmemiş dosyayı açmaz."""

    def __init__(self, paths, known, gen, current, sig):
        super().__init__()
        self.paths, self.known, self.gen, self.current, self.sig = paths, known, gen, current, sig
        self.setAutoDelete(True)

    def _emit(self, batch):
        try:
            self.sig.got.emit(self.gen, batch)
        except RuntimeError:            # program kapanırken
            pass

    def run(self):
        try:
            self._run()
        except Exception:
            pass
        try:
            self.sig.finished.emit(self.gen)
        except RuntimeError:
            pass

    def _run(self):
        batch, t0 = [], time.monotonic()
        for p in self.paths:
            if self.current() != self.gen:
                return
            try:
                st = os.stat(L(p))
            except OSError:
                continue
            size, mt = st.st_size, st.st_mtime_ns // 1000000
            old = self.known.get(p)
            if old and old[0] == size and old[1] == mt:
                a = float(old[2])
            elif getattr(st, "st_file_attributes", 0) & 0x441000:    # bulutta (OneDrive): indirtme
                a = None
            else:
                a = read_aspect(p)
            batch.append((p, a, size, mt))
            if len(batch) >= 64 or time.monotonic() - t0 > 0.12:
                self._emit(batch)
                batch, t0 = [], time.monotonic()
        if batch:
            self._emit(batch)


# ---------------------------------------------------------------- arka plan yükleyici
class LoaderSignals(QObject):
    done = Signal(str, QImage, int, bool, int, int)   # yol, görsel, nesil, başarılı, istenen en/boy


class LoadTask(QRunnable):
    def __init__(self, path, w, h, gen, sig, wanted, have):
        super().__init__()
        self.path, self.w, self.h, self.gen, self.sig, self.wanted, self.have = path, w, h, gen, sig, wanted, have
        self.setAutoDelete(True)

    def _emit(self, img, ok):
        try:
            self.sig.done.emit(self.path, img, self.gen, ok, self.w, self.h)
        except RuntimeError:        # program kapanırken
            pass

    def run(self):
        try:
            self._run()
        except Exception:
            self._emit(QImage(), False)

    def _run(self):
        if self.path not in self.wanted() or self.have(self.path, self.w, self.h):
            self._emit(QImage(), True)
            return
        try:
            with open(L(self.path), "rb") as f:        # baytlar Python ile okunur: disk yavaşken arayüz donmaz
                self._buf = QBuffer()
                self._buf.setData(QByteArray(f.read()))
            self._buf.open(QIODevice.ReadOnly)
            r = QImageReader(self._buf)
            r.setAutoTransform(True)
            sz = r.size()
            if sz.isValid() and sz.width() > 0 and sz.height() > 0:
                try:
                    rot = bool(r.transformation() & QImageIOHandler.Transformation.TransformationRotate90)
                except Exception:
                    rot = False
                ew, eh = (sz.height(), sz.width()) if rot else (sz.width(), sz.height())
                k = min(self.w / ew, self.h / eh, 1.0)
                if k < 1.0:   # ölçek dönüşümden önce uygulanır -> ham boyut üzerinden
                    r.setScaledSize(QSize(max(1, round(sz.width() * k)), max(1, round(sz.height() * k))))
            img = r.read()
            if img.isNull():
                self._emit(QImage(), False)
                return
            if img.width() > self.w or img.height() > self.h:
                img = img.scaled(self.w, self.h, Qt.KeepAspectRatio, Qt.SmoothTransformation)
            self._emit(img, True)
        except Exception:
            self._emit(QImage(), False)


# ---------------------------------------------------------------- yazı barı
class FieldEdit(QLineEdit):
    """Kart altındaki alan. Izgara kaydırılınca başka karta bağlanır (geri dönüşümlü)."""

    def __init__(self, grid, field):
        super().__init__(grid.viewport())
        self.grid = grid
        self.field = field              # "fiyat" | "yazi"
        self.idx = -1
        self.path = None
        self._orig = ""
        self.setObjectName(field)
        self.setFrame(False)
        if field == "fiyat":
            self.setTextMargins(22, 0, 0, 0)
        self.setAttribute(Qt.WA_MacShowFocusRect, False)
        self.setProperty("filled", False)
        if field == "fiyat":
            self.setPlaceholderText("Fiyat")
            self.setValidator(QRegularExpressionValidator(QRegularExpression(r"[0-9 .,]*"), self))
            self.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
            self.setToolTip("Fiyat — rakam yaz, Enter ile yazıya geç")
        else:
            self.setPlaceholderText("Açıklama yaz")
            self.setToolTip("Açıklama — Enter ile sonraki görselin fiyatına geç")
        self.textChanged.connect(self._sync_filled)
        self.textEdited.connect(self._edited)
        self.hide()

    def _sync_filled(self, txt):
        f = bool(txt.strip())
        if f != self.property("filled"):
            self.setProperty("filled", f)
            self.style().unpolish(self)
            self.style().polish(self)

    def paintEvent(self, e):
        super().paintEvent(e)
        if self.field == "fiyat":                              # sabit "₺" etiketi
            p = QPainter(self)
            p.setPen(PRICE if self.property("filled") else MUTED)
            f = QFont(self.font())
            f.setBold(True)
            p.setFont(f)
            p.drawText(QRect(12, 0, 24, self.height()), Qt.AlignLeft | Qt.AlignVCenter, "₺")
            p.end()

    def bind(self, idx, path):
        if path != self.path:
            if self.hasFocus():
                self.grid.setFocus()
            self.path = path
            self.setText(self.grid.store.get(path, self.field) if path else "")
            self.setCursorPosition(0)
        self.idx = idx

    def _edited(self, txt):
        if self.path:
            if self.grid.store.set(self.path, self.field, txt):
                self.grid.value_changed.emit()

    def focusInEvent(self, e):
        super().focusInEvent(e)
        self._orig = self.text()
        if self.idx >= 0 and self.idx != self.grid.cur:
            self.grid.cur = self.idx
            self.grid.viewport().update()

    def focusOutEvent(self, e):
        self.commit()
        super().focusOutEvent(e)

    def commit(self):
        if not self.path:
            return
        val = self.text()
        if self.field == "fiyat":
            val = clean_price(val)
            if val != self.text():
                self.setText(val)
            self.grid.store.set(self.path, self.field, val)
        if val != self._orig:
            self.grid.push_undo(self.path, self.field, self._orig, val)
            self._orig = val
            self.grid.value_changed.emit()

    def event(self, e):
        if e.type() == QEvent.KeyPress and e.key() in (Qt.Key_Tab, Qt.Key_Backtab):
            self.grid.step_field(self, -1 if (e.key() == Qt.Key_Backtab or e.modifiers() & Qt.ShiftModifier) else 1)
            return True
        return super().event(e)

    def keyPressEvent(self, e):
        k, mods = e.key(), e.modifiers()
        g = self.grid
        if k in (Qt.Key_Return, Qt.Key_Enter):
            if mods & Qt.ControlModifier:
                open_file(self.path)
            else:
                g.step_field(self, -1 if mods & Qt.ShiftModifier else 1)
        elif k == Qt.Key_Escape:
            self.setText(self._orig)
            if self.path:
                g.store.set(self.path, self.field, self._orig)
                g.value_changed.emit()
            g.setFocus()
        elif k in (Qt.Key_Up, Qt.Key_Down):
            g.focus_field(g.neighbor(self.idx, 1 if k == Qt.Key_Down else -1), self.field)
        elif k in (Qt.Key_PageUp, Qt.Key_PageDown):
            g.focus_field(g.neighbor(self.idx, g.rows_vis if k == Qt.Key_PageDown else -g.rows_vis), self.field)
        else:
            super().keyPressEvent(e)


# ---------------------------------------------------------------- ızgara
class Grid(QAbstractScrollArea):
    changed = Signal()                 # liste değişti
    value_changed = Signal()           # bir fiyat/yazı değişti
    zoom = Signal(int)

    def __init__(self, store, parent=None):
        super().__init__(parent)
        self.store = store
        self.items = []
        self.root = ""
        self.gen = 0
        self.cache = OrderedDict()
        self.pending = {}
        self.cache_bytes = 0
        self.failed = set()
        self._want = set()
        self._prio = 0
        self.hover = -1
        self.cur = -1
        self._wheel_acc = 0
        self.editors = []               # [(fiyat, yazi)] — ekrandaki kartlara dağıtılır
        self.emap = {}                  # kart indeksi -> (fiyat, yazi)
        self._layout_init()
        self.undo_stack = []
        self.pool = QThreadPool(self)
        self.pool.setMaxThreadCount(max(2, min(6, (os.cpu_count() or 4) - 1)))
        self.sig = LoaderSignals()
        self.sig.done.connect(self._loaded)

        self.setFrameShape(QAbstractScrollArea.NoFrame)
        self.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOn)
        self.viewport().setMouseTracking(True)
        self.viewport().setAttribute(Qt.WA_OpaquePaintEvent)
        self.setFocusPolicy(Qt.StrongFocus)
        self.verticalScrollBar().valueChanged.connect(lambda _: self._after_scroll())

    # ---- veri
    def set_items(self, root, items, keep_scroll=False):
        anc = self.anchor("view") if keep_scroll else None
        new_root = root != self.root
        self.gen += 1
        self.pool.clear()
        self.root, self.items = root, items
        if new_root:
            self.cache.clear()
            self.cache_bytes = 0
            self.undo_stack.clear()
        self.pending.clear()
        self.failed.clear()
        self.hover = -1
        self.cur = 0 if items and (new_root or self.cur < 0) else min(self.cur, len(items) - 1)
        for pr, tx in self.editors:
            pr.bind(-1, None)
            tx.bind(-1, None)
        self.emap = {}
        self._start_aspects(new_root)
        self.relayout(anc)
        if anc is None:
            self.verticalScrollBar().setValue(0)
        self.viewport().update()
        self.changed.emit()

    # ---- yerleşim: her kart kendi görselinin oranında, satırlar ekran genişliğini boşluksuz doldurur
    def _layout_init(self):
        self.rows_vis = DEFAULT_ROWS     # ekranda kaç sıra
        self.ar = {}                     # yol -> en/boy oranı
        self.averified = set()           # oranı bu oturumda doğrulananlar
        self.astore = None               # AspectStore (Main bağlar)
        self.pos = {}                    # yol -> indeks
        self.rects = []                  # kart dikdörtgenleri (içerik koordinatı)
        self.row_tops = []               # satırın üst y'si
        self.row_start = []              # satırın ilk kartı
        self.row_of = []                 # kart -> satır
        self.total_h = 0
        self.cell_h = 1.0
        self.bh = 1
        self._keep_n = 24
        self._agen = [0]
        self.apool = QThreadPool(self)
        self.apool.setMaxThreadCount(1)
        self.asig = AspectSignals()
        self.asig.got.connect(self._got_aspects)
        self.asig.finished.connect(self._aspects_done)
        self._ar_timer = QTimer(self, singleShot=True, timeout=lambda: self.relayout("view"))

    def set_rows(self, rows):
        rows = max(ROW_CHOICES[0], min(ROW_CHOICES[-1], int(rows)))
        if rows == self.rows_vis:
            return
        anc = self.anchor("cur")                      # imleç ekrandaysa o kart yerinde kalır
        cur_vis = anc is not None and 0 <= self.cur < len(self.items) and anc[0] == self.items[self.cur]
        self.rows_vis = rows
        self.relayout(anc)
        if cur_vis:
            self.ensure_visible(self.cur)

    def _layout(self):
        vw = max(1, self.viewport().width())
        vh = max(1, self.viewport().height())
        items = self.items
        n = len(items)
        self.cell_h = vh / max(1, self.rows_vis)
        card_h = self.cell_h - 2 * GAP
        self.bh = bh = self.bar_h(card_h)
        exw, exh = self.card_extra(bh)
        th = max(24.0, card_h - exh)                           # en büyük görsel yüksekliği (N sıra ekrana sığar)
        amin = self.min_img_w(bh) / th                         # buton/alan sığsın: en dar kart
        known = sorted(self.ar[p] for p in items if p in self.ar)
        dflt = known[len(known) // 2] if known else 1.0        # oranı henüz okunmamışlar: çoğunluk
        A = [max(amin, self.ar.get(p, dflt)) for p in items]
        ov = exw + 2 * GAP                                     # kart başına yatay ek
        rects = [None] * n
        row_of = [0] * n
        tops, starts = [], []
        y, i = 0, 0
        while i < n:
            s, j = 0.0, i
            while j < n:
                s2 = s + A[j]
                if j > i and s2 * th + (j - i + 1) * ov > vw:  # satır taştı: taşan kart bu satıra mı?
                    room = vw - (j - i + 1) * ov
                    shrink = 1 - room / s2 / th if room > 0 else 1.0   # alırsak görseller bu oranda küçülür
                    gap = (vw - s * th - (j - i) * ov) / vw             # almazsak satırda bu oranda boşluk kalır
                    if shrink < gap:
                        s, j = s2, j + 1
                    break
                s, j = s2, j + 1
            h = max(8.0, min(th, (vw - (j - i) * ov) / s))
            ch = int(round(h + exh))
            r = len(tops)
            tops.append(y)
            starts.append(i)
            used = (j - i) * ov + s * h
            x = (vw - used) / 2 if j < n and used < vw - 1 else 0.0   # nadiren dolmayan satır ortalanır
            for k in range(i, j):
                x2 = x + A[k] * h + ov
                xl, xr = int(round(x)), int(round(x2))
                rects[k] = QRect(xl + GAP, y + GAP, max(1, xr - xl - 2 * GAP), ch)
                row_of[k] = r
                x = x2
            y += ch + 2 * GAP
            i = j
        self.rects, self.row_of, self.row_tops, self.row_start = rects, row_of, tops, starts
        self.total_h = y
        self.pos = {p: k for k, p in enumerate(items)}

    def anchor(self, mode="view"):
        """Yeniden dizilişte ekranda yerinde kalacak kart: (yol, ekrandaki y)."""
        if not self.items or len(self.rects) != len(self.items):
            return None
        v = self.verticalScrollBar().value()
        vh = self.viewport().height()
        if mode == "cur" and 0 <= self.cur < len(self.items):
            r = self.rects[self.cur]
            if r.bottom() >= v and r.top() < v + vh:
                return self.items[self.cur], r.top() - v
        first, last = self.visible_range()
        for i in range(first, last):
            if self.rects[i].top() >= v:
                return self.items[i], self.rects[i].top() - v
        if first < len(self.items):
            return self.items[first], self.rects[first].top() - v
        return None

    def relayout(self, anchor=None):
        """Kartları yeniden diz. anchor: "view" / "cur" ya da (yol, y) — o kart ekranda aynı yerde kalır."""
        if isinstance(anchor, str):
            anchor = self.anchor(anchor)
        self._layout()
        vh = self.viewport().height()
        sb = self.verticalScrollBar()
        sb.blockSignals(True)
        sb.setRange(0, max(0, self.total_h - vh))
        sb.setSingleStep(max(1, int(self.cell_h)))
        sb.setPageStep(max(1, vh))
        if anchor is not None:
            i = self.pos.get(anchor[0])
            if i is not None:
                sb.setValue(self.rects[i].top() - anchor[1])
        sb.blockSignals(False)
        self._after_scroll()

    def resizeEvent(self, e):
        super().resizeEvent(e)
        self.relayout("view")

    def card_rect(self, idx):
        return self.rects[idx].translated(0, -self.verticalScrollBar().value())

    def target_size(self, idx):
        r = self.rects[idx]
        exw, exh = self.card_extra(self.bh)
        dpr = self.devicePixelRatioF()
        return max(1, int((r.width() - exw) * dpr)), max(1, int((r.height() - exh) * dpr))

    def hit_index(self, pos):
        if not self.row_tops or len(self.rects) != len(self.items):
            return -1
        y = pos.y() + self.verticalScrollBar().value()
        r = bisect_right(self.row_tops, y) - 1
        if r < 0:
            return -1
        a = self.row_start[r]
        b = self.row_start[r + 1] if r + 1 < len(self.row_start) else len(self.items)
        pt = QPoint(pos.x(), y)
        for i in range(a, b):
            if self.rects[i].contains(pt):
                return i
        return -1

    def visible_range(self):
        if not self.row_tops or len(self.rects) != len(self.items):
            return 0, 0
        v = self.verticalScrollBar().value()
        r0 = max(0, bisect_right(self.row_tops, v) - 1)
        r1 = bisect_left(self.row_tops, v + self.viewport().height())
        first = self.row_start[r0]
        last = self.row_start[r1] if r1 < len(self.row_start) else len(self.items)
        return first, last

    def neighbor(self, idx, d):
        """d satır aşağıdaki (eksi: yukarıdaki) en yakın kart."""
        n = len(self.items)
        if not n or len(self.rects) != n:
            return -1
        idx = max(0, min(n - 1, idx))
        r = self.row_of[idx] + d
        if r < 0:
            return 0
        if r >= len(self.row_start):
            return n - 1
        cx = self.rects[idx].center().x()
        a = self.row_start[r]
        b = self.row_start[r + 1] if r + 1 < len(self.row_start) else n
        return min(range(a, b), key=lambda i: abs(self.rects[i].center().x() - cx))

    def key_target(self, k):
        c = self.cur
        if k == Qt.Key_Left:
            return c - 1
        if k == Qt.Key_Right:
            return c + 1
        if k in (Qt.Key_Up, Qt.Key_Down):
            return self.neighbor(c, 1 if k == Qt.Key_Down else -1)
        return self.neighbor(c, self.rows_vis if k == Qt.Key_PageDown else -self.rows_vis)

    def ensure_visible(self, idx):
        if not 0 <= idx < len(self.rects):
            return
        r = self.rects[idx]
        sb = self.verticalScrollBar()
        v, vh = sb.value(), self.viewport().height()
        top, bot = r.top() - GAP, r.bottom() + 1 + GAP
        if top < v or bot - top > vh:
            sb.setValue(top)
        elif bot > v + vh:
            sb.setValue(bot - vh)

    def scroll_rows(self, n):
        if not self.row_tops:
            return
        sb = self.verticalScrollBar()
        v = sb.value()
        r = max(0, bisect_right(self.row_tops, v) - 1)
        if n < 0 and v > self.row_tops[r]:
            r += 1
        r = max(0, min(len(self.row_tops) - 1, r + n))
        sb.setValue(self.row_tops[r])

    # ---- oranlar (arka planda okunur, önbellekte tutulur)
    def _start_aspects(self, new_root):
        if new_root:
            self.averified.clear()
        st = self.astore
        if st is not None:
            for p in self.items:
                if p not in self.ar:
                    a = st.get(p)
                    if a:
                        self.ar[p] = a
        self._agen[0] += 1
        todo = [p for p in self.items if p not in self.averified]
        if todo:
            known = st.snapshot(todo) if st is not None else {}
            h = self._agen
            self.apool.start(AspectScan(todo, known, h[0], lambda: h[0], self.asig))

    def stop_aspects(self):
        self._agen[0] += 1
        self.apool.clear()
        self.apool.waitForDone(1500)
        if self.astore is not None:
            self.astore.save()

    def _got_aspects(self, gen, batch):
        lo = None
        for p, a, size, mt in batch:
            self.averified.add(p)
            if not a:
                continue
            if self.astore is not None:
                self.astore.put(p, size, mt, a)
            old = self.ar.get(p)
            if old is None or abs(old - a) > old * 0.01:
                self.ar[p] = a
                i = self.pos.get(p)
                if i is not None and (lo is None or i < lo):
                    lo = i
        if lo is not None:
            self._schedule_relayout(lo)

    def _aspects_done(self, gen):
        if self.astore is not None:
            self.astore.save()

    def _learn_aspect(self, path, img):
        """Küçük resim yüklenince gerçek oranı öğren (başlığı okunamayanlar için)."""
        w, h = img.width(), img.height()
        if w <= 0 or h <= 0:
            return
        a = w / h
        old = self.ar.get(path)
        if old is None or abs(old - a) > old * max(0.03, 2.0 / min(w, h)):
            self.ar[path] = a
            i = self.pos.get(path)
            if i is not None:
                self._schedule_relayout(i)

    def _schedule_relayout(self, i):
        _, last = self.visible_range()
        ms = 80 if i <= last + 40 else (1200 if len(self.items) < 20000 else 4000)   # çok büyük klasörde seyrek
        t = self._ar_timer
        if not t.isActive() or t.remainingTime() > ms:
            t.start(ms)

    def bar_h(self, card_h):
        return max(BAR_MIN, min(BAR_MAX, int(card_h * BAR_RATIO)))

    def card_extra(self, bh):
        """Kartta görsel dışında kalan en / boy: iç boşluk + alttaki iki alan."""
        return 2 * PAD, 3 * PAD + bh

    def min_img_w(self, bh):
        return 200                       # iki alan yan yana rahat sığsın

    def field_rects(self, card, bh):
        """Kartın altındaki iki bar: fiyat (sol) · yazı (sağ)."""
        top = card.bottom() - PAD - bh + 1
        w = card.width() - 2 * PAD
        gap = 8
        pw = max(96, int((w - gap) * PRICE_SHARE))
        price = QRect(card.left() + PAD, top, pw, bh)
        text = QRect(price.right() + 1 + gap, top, w - pw - gap, bh)
        return price, text

    def image_rect(self, card, bh):
        return QRect(card.left() + PAD, card.top() + PAD, card.width() - 2 * PAD, card.height() - 3 * PAD - bh)

    def hit(self, pos):
        return self.hit_index(pos)

    def set_cur(self, idx, scroll=True):
        if not self.items:
            self.cur = -1
            return
        idx = max(0, min(len(self.items) - 1, idx))
        if idx != self.cur:
            self.cur = idx
            self.viewport().update()
        if scroll:
            self.ensure_visible(idx)

    def cur_valid(self):
        if not self.items:
            return False
        if self.cur < 0 or self.cur >= len(self.items):
            self.cur = min(self.visible_range()[0], len(self.items) - 1)
        return True

    # ---- yazı barları (ekrandaki kartlara dağıtılır, kaydırınca yeniden kullanılır)
    def _place_editors(self):
        first, last = self.visible_range()
        vh = self.viewport().height()
        vis = []
        for i in range(first, last):
            c = self.card_rect(i)
            if c.top() < vh and c.bottom() > 0:
                vis.append(i)
        want = set(vis)
        keep, free = {}, []
        for pair in self.editors:
            i = pair[0].idx
            if i in want and i not in keep and pair[0].path == self.items[i]:
                keep[i] = pair
            else:
                free.append(pair)
        f = QFont(self.font())
        f.setPixelSize(max(14, int(self.bh * 0.40)))
        for i in vis:
            pair = keep.get(i)
            if pair is None:
                if free:
                    pair = free.pop()
                else:
                    pair = (FieldEdit(self, "fiyat"), FieldEdit(self, "yazi"))
                    self.editors.append(pair)
                keep[i] = pair
            r1, r2 = self.field_rects(self.card_rect(i), self.bh)
            for ed, r in zip(pair, (r1, r2)):
                ed.bind(i, self.items[i])
                if ed.font().pixelSize() != f.pixelSize():
                    ed.setFont(f)
                ed.setGeometry(r)
                ed.show()
        for pair in free:
            for ed in pair:
                if ed.hasFocus():
                    self.setFocus()
                ed.bind(-1, None)
                ed.hide()
        self.emap = keep

    def editor_for(self, idx, field):
        pair = self.emap.get(idx)
        if pair is None:
            return None
        ed = pair[0] if field == "fiyat" else pair[1]
        return ed if ed.idx == idx else None

    def focus_field(self, idx, field, initial=None):
        if not self.items:
            return
        idx = max(0, min(len(self.items) - 1, idx))
        self.set_cur(idx)
        self._place_editors()
        ed = self.editor_for(idx, field)
        if ed is None:
            return
        ed.setFocus()
        if initial is None:
            ed.selectAll()
        else:
            ed.setText(initial)
            ed._edited(initial)

    def step_field(self, ed, d):
        """Fiyat → yazı → sonraki kartın fiyatı (d=+1) ya da tersi (d=-1)."""
        ed.commit()
        idx, field = ed.idx, ed.field
        if d > 0:
            nxt = (idx, "yazi") if field == "fiyat" else (idx + 1, "fiyat")
        else:
            nxt = (idx, "fiyat") if field == "yazi" else (idx - 1, "yazi")
        if 0 <= nxt[0] < len(self.items):
            self.focus_field(*nxt)

    def refresh_editor(self, path):
        for pr, tx in self.editors:
            for ed in (pr, tx):
                if ed.path == path and not ed.hasFocus():
                    ed.setText(self.store.get(path, ed.field))

    # ---- geri al
    def push_undo(self, path, field, old, new):
        self.undo_stack.append((path, field, old, new))
        del self.undo_stack[:-500]

    def undo(self):
        if not self.undo_stack:
            return None
        path, field, old, new = self.undo_stack.pop()
        self.store.set(path, field, old)
        self.refresh_editor(path)
        if path in self.items:
            self.set_cur(self.items.index(path))
            self._place_editors()
        self.value_changed.emit()
        return path

    def clear_cur(self):
        if not self.cur_valid():
            return
        path = self.items[self.cur]
        for field in ("fiyat", "yazi"):
            old = self.store.get(path, field)
            if old:
                self.store.set(path, field, "")
                self.push_undo(path, field, old, "")
        self.refresh_editor(path)
        self.value_changed.emit()

    def next_unpriced(self):
        if not self.items:
            return
        n = len(self.items)
        start = self.cur if self.cur >= 0 else 0
        for k in range(1, n + 1):
            j = (start + k) % n
            if not self.store.has_price(self.items[j]):
                self.focus_field(j, "fiyat")
                return True
        return False

    # ---- yükleme
    def _have(self, path, tw, th):
        c = self.cache.get(path)
        return c is not None and c[1][0] >= tw * 0.92 and c[1][1] >= th * 0.92

    def _drop_cache(self, path):
        c = self.cache.pop(path, None)
        if c is not None:
            self.cache_bytes -= c[0].width() * c[0].height() * 4

    def _request(self, path, tw, th):
        if path in self.failed or self._have(path, tw, th):
            return
        old = self.pending.get(path)
        if old is not None and self._prio - old < 40:
            return
        self._prio += 1
        self.pending[path] = self._prio
        self.pool.start(LoadTask(path, tw, th, self.gen, self.sig, lambda: self._want, self._have), self._prio)

    def _loaded(self, path, img, gen, ok, tw, th):
        if gen != self.gen:
            return
        self.pending.pop(path, None)
        if not ok:
            self.failed.add(path)
        elif not img.isNull():
            self._learn_aspect(path, img)
            pm = QPixmap.fromImage(img)
            pm.setDevicePixelRatio(self.devicePixelRatioF())
            self._drop_cache(path)
            self.cache[path] = (pm, (tw, th))
            self.cache_bytes += pm.width() * pm.height() * 4
            while self.cache_bytes > CACHE_MB * 1024 * 1024 and len(self.cache) > self._keep_n:
                self._drop_cache(next(iter(self.cache)))
        else:
            return
        self.viewport().update()

    def _after_scroll(self):
        self._place_editors()
        self.viewport().update()

    # ---- çizim
    def paintEvent(self, e):
        p = QPainter(self.viewport())
        p.fillRect(self.viewport().rect(), CANVAS)
        if not self.items or len(self.rects) != len(self.items):
            return
        p.setRenderHint(QPainter.SmoothPixmapTransform)
        p.setRenderHint(QPainter.Antialiasing)
        first, last = self.visible_range()
        n = len(self.items)
        vis = max(1, last - first)
        self._keep_n = max(24, vis * 3)
        page = max(8, vis * 2)                     # iki ekran ileriyi önceden yükle
        self._want = set(self.items[max(0, first - vis):min(n, last + page)])
        for i in range(first, last):
            self._paint_card(p, i)
        for i in range(last, min(n, last + page)):
            self._request(self.items[i], *self.target_size(i))
        p.end()

    def _paint_card(self, p, i):
        path = self.items[i]
        card = self.card_rect(i)
        bh = self.bh
        tw, th = self.target_size(i)
        cur, hov = i == self.cur, i == self.hover
        # kart: beyaz, yuvarlak köşe; imleçte mavi, üzerindeyken koyu kenar
        if cur:
            p.setPen(QPen(ACCENT, 2))
        else:
            p.setPen(QPen(STROKE_HOVER if hov else STROKE, 1))
        p.setBrush(SURFACE)
        p.drawRoundedRect(QRectF(card).adjusted(1, 1, -1, -1), RADIUS, RADIUS)
        img_r = self.image_rect(card, bh)
        clip = QPainterPath()
        clip.addRoundedRect(QRectF(img_r), 6, 6)
        p.save()
        p.setClipPath(clip)
        p.fillRect(img_r, LETTERBOX)
        c = self.cache.get(path)
        if c is not None:
            self.cache.move_to_end(path)
            pm = c[0]
            dpr = pm.devicePixelRatio()
            p.drawPixmap(fit_rect(img_r, pm.width() / dpr, pm.height() / dpr), pm, QRectF(0, 0, pm.width(), pm.height()))
        elif path in self.failed:
            s = min(img_r.width(), img_r.height()) * 0.12
            draw_icon(p, "x", QRectF(img_r.center().x() - s / 2, img_r.center().y() - s / 2, s, s), STROKE_HOVER)
        p.restore()
        if c is None or c[1][0] < tw * 0.92 or c[1][1] < th * 0.92:
            self._request(path, tw, th)
        if self.store.has_price(path):                                 # fiyatlı: yeşil onay rozeti
            s = 26
            badge = QRectF(img_r.right() - s - 8, img_r.top() + 8, s, s)
            p.setPen(QPen(SURFACE, 2))
            p.setBrush(PRICE)
            p.drawEllipse(badge)
            draw_icon(p, "check", badge.adjusted(7, 7, -7, -7), SURFACE, width=2.2)

    # ---- fare / klavye
    def mouseMoveEvent(self, e):
        h = self.hit(e.position().toPoint())
        if h != self.hover:
            self.hover = h
            self.viewport().update()

    def leaveEvent(self, e):
        self.hover = -1
        self.viewport().update()
        super().leaveEvent(e)

    def mousePressEvent(self, e):
        self.setFocus()
        h = self.hit(e.position().toPoint())
        if h < 0:
            return
        if e.button() == Qt.RightButton:
            reveal_in_explorer(self.items[h])
            return
        self.set_cur(h, scroll=False)

    def mouseDoubleClickEvent(self, e):
        h = self.hit(e.position().toPoint())
        if h >= 0:
            open_file(self.items[h])

    def wheelEvent(self, e):
        if e.modifiers() & Qt.ControlModifier:
            d = e.angleDelta().y()
            if d:
                self.zoom.emit(-1 if d > 0 else 1)
            e.accept()
            return
        self._wheel_acc += e.angleDelta().y()
        steps = int(self._wheel_acc / 120)
        if steps:
            self._wheel_acc -= steps * 120
            self.scroll_rows(-steps)
        e.accept()

    def focusInEvent(self, e):
        super().focusInEvent(e)
        self.viewport().update()

    def keyPressEvent(self, e):
        k, mods = e.key(), e.modifiers()
        if not self.items:
            return super().keyPressEvent(e)
        plain = not (mods & (Qt.ControlModifier | Qt.AltModifier))
        moves = (Qt.Key_Left, Qt.Key_Right, Qt.Key_Up, Qt.Key_Down, Qt.Key_PageUp, Qt.Key_PageDown)
        txt = e.text()
        if k in moves and plain:
            self.cur_valid()
            self.set_cur(self.key_target(k))
            self._place_editors()
        elif k in (Qt.Key_Home, Qt.Key_End) and plain:
            self.set_cur(0 if k == Qt.Key_Home else len(self.items) - 1)
            self._place_editors()
        elif k in (Qt.Key_Return, Qt.Key_Enter) and (mods & Qt.ControlModifier):
            if self.cur_valid():
                open_file(self.items[self.cur])
        elif k in (Qt.Key_Return, Qt.Key_Enter, Qt.Key_F2, Qt.Key_Tab) and self.cur_valid():
            self.focus_field(self.cur, "fiyat")
        elif k == Qt.Key_F3 and self.cur_valid():
            self.focus_field(self.cur, "yazi")
        elif k == Qt.Key_Delete and plain:
            self.clear_cur()
        elif k == Qt.Key_Space and (mods & Qt.ControlModifier):
            self.next_unpriced()
        elif plain and txt and txt.isprintable() and not txt.isspace() and self.cur_valid():
            if txt.isdigit():                                  # rakam: fiyata yaz
                self.focus_field(self.cur, "fiyat", initial=txt)
            else:                                              # harf: yazıya yaz
                self.focus_field(self.cur, "yazi", initial=txt)
        else:
            super().keyPressEvent(e)

    def focusNextPrevChild(self, nxt):
        return False                                           # Tab'ı ızgara kendisi yönetir

    def viewportEvent(self, e):
        if e.type() == QEvent.ToolTip:
            h = self.hit(e.pos())
            if h >= 0:
                path = self.items[h]
                QToolTip.showText(e.globalPos(), os.path.relpath(path, self.root) if self.root else path,
                                  self.viewport())
            else:
                QToolTip.hideText()
            return True
        return super().viewportEvent(e)


# ---------------------------------------------------------------- kısayol listesi
class HelpDialog(QDialog):
    def __init__(self, parent, title, sections):
        super().__init__(parent)
        self.setWindowTitle(title)
        self.setStyleSheet("QDialog{background:#FFFFFF;} QLabel{color:#1F2328;}")
        rows = []
        for head, items in sections:
            rows.append('<tr><td colspan="2" style="padding:16px 0 6px 0;color:#57606A;'
                        'font-size:13px;font-weight:600;">%s</td></tr>' % head)
            for keys, desc in items:
                if keys:
                    rows.append('<tr><td style="padding:4px 24px 4px 0;white-space:nowrap;">'
                                '<span style="background:#F3F4F6;color:#1F2328;padding:2px 8px;'
                                'border:1px solid #D5DAE0;">%s</span></td>'
                                '<td style="padding:4px 0;">%s</td></tr>' % (keys, desc))
                else:
                    rows.append('<tr><td></td><td style="padding:4px 0;color:#57606A;">%s</td></tr>' % desc)
        lbl = QLabel('<table style="font-size:14px;">%s</table>' % "".join(rows))
        lbl.setTextFormat(Qt.RichText)
        lay = QVBoxLayout(self)
        lay.setContentsMargins(28, 16, 28, 24)
        lay.addWidget(lbl)
        self.replay = False
        again = QPushButton("Tanıtımı yeniden göster", objectName="tourSkip")
        again.setCursor(Qt.PointingHandCursor)
        again.setStyleSheet("color:#0969DA; padding:12px 0 0 0;")
        again.clicked.connect(self._replay)
        lay.addWidget(again, 0, Qt.AlignLeft)
        QShortcut(QKeySequence("F1"), self, activated=self.accept)

    def _replay(self):
        self.replay = True
        self.accept()


# ---------------------------------------------------------------- ilk açılış tanıtımı
class Tour(QWidget):
    """İlk açılışta bir kez: ilgili yeri aydınlatır, kısa not gösterir. Aydınlık alana tıklama alttaki öğeye geçer."""
    STEPS = [
        ("Klasörünü seç", "Görsellerin olduğu klasörü seç. Alt klasörler de gelir.", None),
        ("Fiyatı yaz", "Rakamı yaz, Enter'a bas.", "İleri"),
        ("Açıklamayı yaz", "Yaz, Enter'a bas: sıradaki görsele geçer. Her şey kendiliğinden kaydedilir.", "İleri"),
        ("Kalanları takip et", "Fiyatsız: sadece kalanları gösterir. Excel listesi klasörüne kendiliğinden "
                               "yazılır. Tüm kısayollar: F1.", "Başla"),
    ]

    def __init__(self, main):
        super().__init__(main)
        self.m = main
        self.step = -1
        self.idx = -1
        self.hole = QRect()
        self.setFocusPolicy(Qt.NoFocus)
        self.bubble = QFrame(self, objectName="tourBubble")
        self.bubble.setFixedWidth(340)
        sh = QGraphicsDropShadowEffect(self.bubble)
        sh.setBlurRadius(28)
        sh.setOffset(0, 6)
        sh.setColor(QColor(0, 0, 0, 90))
        self.bubble.setGraphicsEffect(sh)
        bl = QVBoxLayout(self.bubble)
        bl.setContentsMargins(20, 16, 16, 12)
        bl.setSpacing(6)
        self.step_lbl = QLabel("", objectName="tourStep")
        self.title_lbl = QLabel("", objectName="tourTitle")
        self.text_lbl = QLabel("", objectName="tourText")
        self.text_lbl.setWordWrap(True)
        for w in (self.step_lbl, self.title_lbl, self.text_lbl):
            bl.addWidget(w)
        row = QHBoxLayout()
        row.setContentsMargins(0, 8, 0, 0)
        self.skip_btn = QPushButton("Tanıtımı geç", objectName="tourSkip")
        self.next_btn = QPushButton("İleri", objectName="tourNext")
        for b in (self.skip_btn, self.next_btn):
            b.setCursor(Qt.PointingHandCursor)
            b.setFocusPolicy(Qt.NoFocus)
        self.skip_btn.clicked.connect(self.finish)
        self.next_btn.clicked.connect(self.next)
        row.addWidget(self.skip_btn)
        row.addStretch(1)
        row.addWidget(self.next_btn)
        bl.addLayout(row)
        self.timer = QTimer(self, interval=120, timeout=self._poll)
        self.hide()

    # ---- akış
    def start(self, step=0):
        self.setGeometry(self.m.rect())
        self.raise_()
        self.show()
        self.timer.start()
        self.go(step)

    def go(self, step, focus=True):
        g = self.m.grid
        if step == 0 and g.items:
            step = 1                                  # klasör zaten açık
        if step in (1, 2) and not g.items:
            step = 0
        self.step = step
        if step == 1:
            self.idx = self._first_card()
            if focus and self.idx >= 0:
                g.focus_field(self.idx, "fiyat")
        elif step == 2 and focus and self.idx >= 0:
            g.focus_field(self.idx, "yazi")
        elif step == 3 and focus:
            g.setFocus()
        title, text, btn = self.STEPS[step]
        self.step_lbl.setText("%d / %d" % (step + 1, len(self.STEPS)))
        self.title_lbl.setText(title)
        self.text_lbl.setText(text)
        self.next_btn.setVisible(bool(btn))
        self.next_btn.setText(btn or "")
        self.bubble.adjustSize()
        self._poll(force=True)

    def next(self):
        if self.step >= len(self.STEPS) - 1:
            self.finish()
        else:
            self.go(self.step + 1)

    def finish(self):
        self.timer.stop()
        self.hide()
        self.step = -1
        self.m.settings.setValue("tour_done", 1)
        if not isinstance(QApplication.focusWidget(), FieldEdit):
            self.m.grid.setFocus()

    # ---- hedef
    def _first_card(self):
        g = self.m.grid
        first, last = g.visible_range()
        vh = g.viewport().height()
        for i in range(first, last):
            r = g.card_rect(i)
            if r.top() >= 0 and r.bottom() <= vh:
                return i
        return first if first < last else -1

    def _rect_of(self, w):
        return QRect(w.mapTo(self.m, QPoint(0, 0)), w.size())

    def _target(self):
        m = self.m
        if self.step == 0:
            return self._rect_of(m.empty_btn if m.empty.isVisible() else m.btn_folder)
        if self.step in (1, 2):
            ed = m.grid.editor_for(self.idx, "fiyat" if self.step == 1 else "yazi")
            return self._rect_of(ed) if ed is not None and ed.isVisible() else QRect()
        return self._rect_of(m.seg).united(self._rect_of(m.prog))

    def _poll(self, force=False):
        if self.step < 0:
            return
        g = self.m.grid
        if self.step == 0 and g.items:
            return self.go(1)
        if self.step in (1, 2) and not g.items:
            return self.go(0)
        fw = QApplication.focusWidget()
        if isinstance(fw, FieldEdit) and fw.idx >= 0:   # kullanıcı adımı kendisi yaptıysa ilerle
            if self.step == 1 and fw.field == "yazi" and fw.idx == self.idx:
                return self.go(2, focus=False)
            if self.step == 2 and fw.idx != self.idx:
                return self.go(3, focus=False)
        if self.geometry() != self.m.rect():
            self.setGeometry(self.m.rect())
            force = True
        r = self._target()
        hole = r.adjusted(-6, -6, 6, 6) if r.isValid() and not r.isEmpty() else QRect()
        if force or hole != self.hole:
            self.hole = hole
            reg = QRegion(self.rect())
            if not hole.isEmpty():
                path = QPainterPath()
                path.addRoundedRect(QRectF(hole), 10, 10)
                reg = reg.subtracted(QRegion(path.toFillPolygon().toPolygon()))
            self.setMask(reg)
            self._place_bubble()
            self.update()

    def _place_bubble(self):
        b, h = self.bubble, self.hole
        b.adjustSize()
        bw, bh, W, H, m = b.width(), b.height(), self.width(), self.height(), 14
        if h.isEmpty():
            x, y = (W - bw) // 2, (H - bh) // 2
        else:
            x = max(m, min(W - bw - m, h.center().x() - bw // 2))
            y = h.bottom() + m
            if y + bh > H - m:
                y = h.top() - m - bh
            if y < m:                                     # üstte de yer yoksa yanına
                y = max(m, min(H - bh - m, h.center().y() - bh // 2))
                x = h.right() + m if h.right() + m + bw <= W - m else max(m, h.left() - m - bw)
        b.move(x, y)

    def paintEvent(self, e):
        p = QPainter(self)
        p.setRenderHint(QPainter.Antialiasing)
        path = QPainterPath()
        path.setFillRule(Qt.OddEvenFill)
        path.addRect(QRectF(self.rect()))
        if not self.hole.isEmpty():
            path.addRoundedRect(QRectF(self.hole), 10, 10)
        p.fillPath(path, QColor(17, 24, 39, 150))
        if not self.hole.isEmpty():
            p.setPen(QPen(ACCENT, 3))
            p.setBrush(Qt.NoBrush)
            p.drawRoundedRect(QRectF(self.hole).adjusted(-1.5, -1.5, 1.5, 1.5), 11, 11)
        p.end()


# ---------------------------------------------------------------- ana pencere
class Main(QWidget):
    def __init__(self, start_path=None):
        super().__init__()
        self.setWindowTitle("Fiyat")
        self.setAcceptDrops(True)
        self.settings = QSettings(APP, APP)
        data_dir = os.environ.get("FIYAT_DATA") or QStandardPaths.writableLocation(QStandardPaths.AppDataLocation)
        self.store = PriceStore(os.path.join(data_dir, "fiyatlar.json"))
        self.exts = image_exts()
        self._scan_gen = [0]
        self._items_ver = 0                                   # klasör her açıldığında artar
        self._csv_sig = None                                  # en son yazılan Excel listesinin durumu
        self._scan = None                                     # (yol, kaydırma_korunsun) — tarama sürerken
        self.scan_pool = QThreadPool(self)
        self.scan_pool.setMaxThreadCount(2)
        self.scan_sig = ScanSignals()
        self.scan_sig.progress.connect(self._scan_progress)
        self.scan_sig.done.connect(self._scan_done)
        self.root = ""
        self._csv_warned = False

        self.setStyleSheet(STYLE)
        self.all_items = []
        self.filter = "all"

        # ---- üst çubuk
        bar = QWidget(objectName="bar")
        bar.setFixedHeight(52)
        bl = QHBoxLayout(bar)
        bl.setContentsMargins(10, 8, 10, 8)
        bl.setSpacing(6)

        self.btn_folder = self._tool("folder", "Klasör seç", "Klasör seç (Ctrl+O)", self.choose_folder)
        self.path_edit = QLineEdit(objectName="path")
        self.path_edit.setPlaceholderText("Klasör yolunu yapıştır ve Enter'a bas")
        self.path_edit.returnPressed.connect(lambda: self.open_folder(self.path_edit.text()))
        self.path_edit.setMinimumWidth(180)

        self.seg = seg = QWidget(objectName="seg")
        sl = QHBoxLayout(seg)
        sl.setContentsMargins(0, 0, 0, 0)
        sl.setSpacing(0)
        self.filter_group = QButtonGroup(self)
        self.filter_btns = {}
        for i, (key, label, tip) in enumerate((("all", "Tümü", "Tüm görseller (Ctrl+1)"),
                                               ("todo", "Fiyatsız", "Fiyatı girilmemişler (Ctrl+2)"),
                                               ("done", "Fiyatlı", "Fiyatı girilmişler (Ctrl+3)"))):
            b = QToolButton(objectName="segbtn")
            b.setText(label)
            b.setToolTip(tip)
            b.setCheckable(True)
            b.setFocusPolicy(Qt.NoFocus)
            b.setProperty("pos", ("first", "mid", "last")[i])
            b.clicked.connect(lambda _=False, k=key: self.set_filter(k))
            self.filter_group.addButton(b)
            self.filter_btns[key] = b
            sl.addWidget(b)
        self.filter_btns["all"].setChecked(True)

        self.count_lbl = QLabel("", objectName="count")
        self.progress = QProgressBar(objectName="progress")
        self.progress.setTextVisible(False)
        self.progress.setFixedSize(120, 6)
        self.prog = prog = QWidget()
        pl = QVBoxLayout(prog)
        pl.setContentsMargins(0, 0, 0, 0)
        pl.setSpacing(3)
        pl.addWidget(self.count_lbl)
        pl.addWidget(self.progress)

        self.status_lbl = QLabel("", objectName="status")
        self.status_lbl.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Preferred)
        self.status_lbl.setMinimumWidth(60)

        self.btn_grid = QToolButton(objectName="gridbtn")
        self.btn_grid.setIcon(make_icon("grid", INK2, 16))
        self.btn_grid.setIconSize(QSize(16, 16))
        self.btn_grid.setToolButtonStyle(Qt.ToolButtonTextBesideIcon)
        self.btn_grid.setPopupMode(QToolButton.InstantPopup)
        self.btn_grid.setFocusPolicy(Qt.NoFocus)
        self.btn_grid.setToolTip("Görsel boyutu: ekranda kaç sıra olsun  (Ctrl+tekerlek · Ctrl + / Ctrl −)")
        gm = QMenu(self.btn_grid)
        self.grid_actions = {}
        for r in ROW_CHOICES:
            act = gm.addAction("%d sıra" % r)
            act.setCheckable(True)
            act.triggered.connect(lambda _=False, r=r: self.set_rows(r))
            self.grid_actions[r] = act
        self.btn_grid.setMenu(gm)

        bl.addWidget(self.btn_folder)
        bl.addWidget(self.path_edit, 3)
        bl.addSpacing(10)
        bl.addWidget(seg)
        bl.addSpacing(12)
        bl.addWidget(prog)
        bl.addSpacing(10)
        bl.addWidget(self.status_lbl, 2)
        bl.addWidget(self.btn_grid)
        bl.addWidget(self._tool("undo", "Geri al", "Son değişikliği geri al (Ctrl+Z)", self.undo))
        bl.addWidget(self._tool("help", "Kısayollar", "Klavye kısayolları (F1)", self.show_help))
        bl.addWidget(self._tool("refresh", "", "Yenile (F5)", self.refresh))
        bl.addWidget(self._tool("full", "", "Tam ekran (F11)", self.toggle_full))
        bl.addWidget(self._tool("x", "", "Kapat (Ctrl+Q)", self.close))

        self.grid = Grid(self.store)
        self.grid.astore = AspectStore(os.path.join(data_dir, "oranlar.json"))
        self.grid.changed.connect(self._update_counts)
        self.grid.value_changed.connect(self._on_value)
        self.grid.zoom.connect(self.step_grid)

        # ---- boş durum (klasör yok / görsel yok / filtre boş)
        self.empty = QWidget(self.grid.viewport(), objectName="empty")
        el = QVBoxLayout(self.empty)
        el.setAlignment(Qt.AlignCenter)
        el.setSpacing(10)
        self.empty_icon = QLabel()
        self.empty_icon.setPixmap(make_icon("folder", STROKE_HOVER, 48, 0.06).pixmap(QSize(48, 48)))
        self.empty_icon.setAlignment(Qt.AlignCenter)
        self.empty_title = QLabel("", objectName="emptyTitle")
        self.empty_title.setAlignment(Qt.AlignCenter)
        self.empty_text = QLabel("", objectName="emptyText")
        self.empty_text.setAlignment(Qt.AlignCenter)
        self.empty_text.setWordWrap(True)
        self.empty_btn = QPushButton("", objectName="primary")
        self.empty_btn.setCursor(Qt.PointingHandCursor)
        self.empty_btn.clicked.connect(self._empty_action)
        for wdg in (self.empty_icon, self.empty_title, self.empty_text):
            el.addWidget(wdg)
        el.addSpacing(6)
        el.addWidget(self.empty_btn, 0, Qt.AlignCenter)
        self.grid.viewport().installEventFilter(self)

        lay = QVBoxLayout(self)
        lay.setContentsMargins(0, 0, 0, 0)
        lay.setSpacing(0)
        lay.addWidget(bar)
        lay.addWidget(self.grid, 1)

        QShortcut(QKeySequence.Undo, self.grid, activated=self.undo, context=Qt.WidgetShortcut)
        QShortcut(QKeySequence("F5"), self, activated=self.refresh)
        QShortcut(QKeySequence("F11"), self, activated=self.toggle_full)
        QShortcut(QKeySequence("F1"), self, activated=self.show_help)
        QShortcut(QKeySequence("Ctrl+S"), self, activated=lambda: self.save(force=True))
        QShortcut(QKeySequence("Ctrl+O"), self, activated=self.choose_folder)
        QShortcut(QKeySequence("Ctrl+L"), self, activated=lambda: (self.path_edit.setFocus(), self.path_edit.selectAll()))
        QShortcut(QKeySequence("Ctrl+E"), self, activated=self.reveal_cur)
        QShortcut(QKeySequence("Ctrl+Q"), self, activated=self.close)
        QShortcut(QKeySequence("Esc"), self.grid, activated=self._esc, context=Qt.WidgetShortcut)
        QShortcut(QKeySequence("Esc"), self.empty, activated=self._esc, context=Qt.WidgetWithChildrenShortcut)
        for k in ("Ctrl++", "Ctrl+="):
            QShortcut(QKeySequence(k), self, activated=lambda: self.step_grid(-1))
        QShortcut(QKeySequence("Ctrl+-"), self, activated=lambda: self.step_grid(1))
        QShortcut(QKeySequence("Ctrl+1"), self, activated=lambda: self.set_filter("all"))
        QShortcut(QKeySequence("Ctrl+2"), self, activated=lambda: self.set_filter("todo"))
        QShortcut(QKeySequence("Ctrl+3"), self, activated=lambda: self.set_filter("done"))

        self._status_timer = QTimer(self, singleShot=True, timeout=lambda: self.status_lbl.setText(""))
        self._save_timer = QTimer(self, singleShot=True, interval=1200, timeout=self.save)

        try:
            r = int(self.settings.value("rows", 0) or 0)
            if not r:                                         # eski sürüm ayarı "sütun,satır"
                r = int(str(self.settings.value("grid", "")).split(",")[1])
            if r not in ROW_CHOICES:
                raise ValueError
        except Exception:
            r = DEFAULT_ROWS
        self.set_rows(r, save=False, quiet=True)

        self._update_counts()
        self._todo_hint = False
        self.tour = Tour(self)
        path = start_path or self.settings.value("last_folder", "")
        if path and os.path.isdir(path):
            QTimer.singleShot(0, lambda: self.open_folder(path))
        try:
            done = int(self.settings.value("tour_done", 0) or 0)
        except (TypeError, ValueError):
            done = 0
        if not done:                                          # ilk açılış: kısa tanıtım (bir kez)
            QTimer.singleShot(450, self.tour.start)

    def _tool(self, kind, text, tip, slot):
        b = QToolButton()
        b.setIcon(make_icon(kind, INK2, 16))
        b.setIconSize(QSize(16, 16))
        if text:
            b.setText(" " + text)
            b.setToolButtonStyle(Qt.ToolButtonTextBesideIcon)
        b.setToolTip(tip)
        b.setCursor(Qt.PointingHandCursor)
        b.clicked.connect(slot)
        b.setFocusPolicy(Qt.NoFocus)
        return b

    # ---- boş durum
    def eventFilter(self, obj, e):
        if obj is self.grid.viewport() and e.type() == QEvent.Resize:
            self.empty.setGeometry(self.grid.viewport().rect())
        return super().eventFilter(obj, e)

    def _update_empty(self):
        if self.grid.items:
            self.empty.hide()
            return
        if self._scan is not None:
            t, x, btn = "Klasör taranıyor…", "Görseller bulunuyor. Çok büyük bir klasör seçtiysen durdurup alt klasörünü seç.", "Durdur"
        elif not self.root:
            t, x, btn = ("Görsellerin olduğu klasörü seç",
                         "Alt klasörler dahil tüm görseller listelenir. Klasörü pencereye sürükleyebilir "
                         "ya da yolunu üstteki kutuya yapıştırabilirsin.", "Klasör seç")
        elif not self.all_items:
            t, x, btn = "Bu klasörde görsel yok", "JPG, PNG, WEBP gibi görsellerin olduğu bir klasör seç.", "Başka klasör seç"
        elif self.filter == "todo":
            t, x, btn = "Fiyatı girilmemiş görsel kalmadı", "Bu klasördeki bütün görsellerin fiyatı girildi.", "Tümünü göster"
        else:
            t, x, btn = "Fiyatı girilmiş görsel yok", "Fiyat girdiğin görseller burada listelenir.", "Tümünü göster"
        self.empty_title.setText(t)
        self.empty_text.setText(x)
        self.empty_btn.setText(btn)
        self.empty.setGeometry(self.grid.viewport().rect())
        self.empty.show()
        self.empty.raise_()

    def _empty_action(self):
        if self._scan is not None:
            self.stop_scan()
        elif self.root and self.all_items:
            self.set_filter("all")
        else:
            self.choose_folder()

    # ---- filtre
    def set_filter(self, key, keep_scroll=False):
        self.filter = key
        self.filter_btns[key].setChecked(True)
        if not self.root:
            self._update_empty()
            return
        self.save()
        if key == "todo":
            items = [p for p in self.all_items if not self.store.has_price(p)]
        elif key == "done":
            items = [p for p in self.all_items if self.store.has_price(p)]
        else:
            items = list(self.all_items)
        self.grid.set_items(self.root, items, keep_scroll=keep_scroll)
        self.grid.setFocus()
        self._update_empty()

    # ---- durum / kayıt
    def status(self, msg, error=False):
        self.status_lbl.setStyleSheet("color:%s" % ("#CF222E" if error else "#57606A"))
        self.status_lbl.setText(msg)
        self._status_timer.start(7000 if error else 3000)

    def _update_counts(self):
        total = len(self.all_items)
        if not self.root:
            self.count_lbl.setText("Klasör seçilmedi")
            self.progress.setMaximum(1)
            self.progress.setValue(0)
            self._update_empty()
            return
        n = sum(1 for p in self.all_items if self.store.has_price(p))
        self.count_lbl.setText("%d / %d fiyatlı" % (n, total))
        self.progress.setMaximum(max(1, total))
        self.progress.setValue(n)
        self._update_empty()

    def _on_value(self):
        self._update_counts()
        if self.filter == "todo" and not self._todo_hint:
            self._todo_hint = True
            self.status("Fiyatı girilenler F5 ile bu listeden çıkar")
        self.grid.viewport().update()
        self._save_timer.start(1200)

    def save(self, force=False):
        for pr, tx in self.grid.editors:                      # odaktaki alanı da işle
            for ed in (pr, tx):
                if ed.hasFocus() and ed.path:
                    val = clean_price(ed.text()) if ed.field == "fiyat" else ed.text()
                    self.store.set(ed.path, ed.field, val)
        ok = True
        try:
            self.store.save()
        except Exception as ex:
            ok = False
            self.status("Kayıt yazılamadı: %s" % ex, True)
        sig = (self.root, self._items_ver, self.store.version)
        if self.root and (force or sig != self._csv_sig):     # liste yalnız bir şey değiştiyse yazılır
            try:
                export_csv(self.root, self.all_items, self.store)
                self._csv_sig = sig
                self._csv_warned = False
            except PermissionError:
                ok = False
                if force or not self._csv_warned:
                    self.status("Excel listesi yazılamadı (dosya Excel'de açık olabilir) — fiyatlar kayıtlı, "
                                "kapatınca yazılır", True)
                self._csv_warned = True
                self._save_timer.start(5000)
            except Exception as ex:
                ok = False
                self.status("Liste yazılamadı: %s" % ex, True)
        if ok and force:
            self.status("Kaydedildi · %s" % CSV_NAME)

    # ---- klasör
    def choose_folder(self):
        start = self.root or QStandardPaths.writableLocation(QStandardPaths.DesktopLocation) or os.path.expanduser("~")
        d = QFileDialog.getExistingDirectory(self, "Görsellerin olduğu klasörü seç", start)
        if d:
            self.open_folder(d)

    def open_folder(self, path, keep_scroll=False, sync=False):
        """Klasörü arka planda tarar (pencere donmaz); bitince listeyi açar. sync: beklemeli (test)."""
        path = path.strip().strip('"').strip("'")
        if not path or not os.path.isdir(path):
            self.status("Klasör bulunamadı", True)
            return
        path = os.path.abspath(path)
        self._scan_gen[0] += 1
        gen = self._scan_gen[0]
        self._scan = (path, keep_scroll)
        if sync:
            items, nd, ne = scan_folder(path, self.exts)
            self._scan_done(gen, items, nd, ne)
            return
        self.status_lbl.setStyleSheet("color:#57606A")
        self.status_lbl.setText("Klasör taranıyor…  (Esc: durdur)")
        self._status_timer.stop()
        self._update_empty()
        h = self._scan_gen
        self.scan_pool.start(ScanTask(path, self.exts, gen, lambda: h[0], self.scan_sig))

    def stop_scan(self):
        if self._scan is None:
            return
        self._scan_gen[0] += 1
        self._scan = None
        self.status("Tarama durduruldu")
        self._update_empty()

    def _scan_progress(self, gen, n):
        if gen == self._scan_gen[0] and self._scan is not None:
            self.status_lbl.setText("Klasör taranıyor… %d görsel bulundu  (Esc: durdur)" % n)
            if self.empty.isVisible():
                self.empty_text.setText("%d görsel bulundu. Çok büyük bir klasör seçtiysen durdurup alt klasörünü seç." % n)

    def _scan_done(self, gen, items, ndirs, nerr):
        if gen != self._scan_gen[0] or self._scan is None:
            return
        path, keep_scroll = self._scan
        self._scan = None
        if items is None:
            self.status("Klasör okunamadı", True)
            self._update_empty()
            return
        if self.root:
            self.save()
        self.root = path
        self.all_items = items
        self._items_ver += 1
        self.path_edit.setText(path)
        self.path_edit.setCursorPosition(0)
        self.settings.setValue("last_folder", path)
        self.set_filter(self.filter, keep_scroll=keep_scroll)
        msg = "%d görsel · %d klasör" % (len(items), ndirs)
        if nerr:
            msg += " · %d klasör okunamadı" % nerr
        self.status(msg, bool(nerr))

    def refresh(self):
        if self.root:
            self.open_folder(self.root, keep_scroll=True)

    def set_rows(self, r, save=True, quiet=False):
        self.grid.set_rows(r)
        r = self.grid.rows_vis
        self.btn_grid.setText("  %d sıra" % r)
        for k, a in self.grid_actions.items():
            a.setChecked(k == r)
        if save:
            self.settings.setValue("rows", r)
        if not quiet:
            self.status("Ekranda %d sıra" % r)

    def step_grid(self, d):
        self.set_rows(self.grid.rows_vis + d)

    # ---- işlemler
    def undo(self):
        if self.grid.undo() is None:
            self.status("Geri alınacak değişiklik yok")
        else:
            self.status("Geri alındı")

    def reveal_cur(self):
        g = self.grid
        if g.cur_valid():
            reveal_in_explorer(g.items[g.cur])

    def show_help(self):
        dlg = HelpDialog(self, "Fiyat — klavye kısayolları", HELP)
        dlg.exec()
        self.grid.setFocus()
        if dlg.replay:
            self.tour.start(0)

    # ---- pencere
    def toggle_full(self):
        if self.isFullScreen():
            self.showMaximized()
        else:
            self.showFullScreen()

    def _esc(self):
        if self._scan is not None:
            self.stop_scan()
        elif self.isFullScreen():
            self.showMaximized()

    def closeEvent(self, e):
        self._scan_gen[0] += 1                                # süren taramayı bırak
        self.scan_pool.clear()
        self.grid.pool.clear()
        self.grid.pool.waitForDone(1500)
        self.grid.stop_aspects()
        self.save()
        super().closeEvent(e)

    def resizeEvent(self, e):
        super().resizeEvent(e)
        t = getattr(self, "tour", None)
        if t is not None and t.isVisible():
            t.setGeometry(self.rect())

    def dragEnterEvent(self, e):
        if e.mimeData().hasUrls():
            e.acceptProposedAction()

    def dropEvent(self, e):
        for u in e.mimeData().urls():
            p = u.toLocalFile()
            if p:
                self.open_folder(p if os.path.isdir(p) else os.path.dirname(p))
                return


def self_test(out_path):
    """Paketlenmiş sürüm için hızlı kontrol: biçimler, okuma, kayıt, liste, pencere. Sonuç JSON olarak yazılır."""
    import tempfile
    import shutil
    global APP
    res, ok = {}, True
    tmp = tempfile.mkdtemp(prefix="fiyat_test_")
    APP = "AyiklaFiyatOzTest"
    try:
        exts = image_exts()
        res["bicimler"] = sorted(exts)
        for e in (".jpg", ".jpeg", ".png", ".webp"):
            ok &= e in exts
        root = os.path.join(tmp, "Ürünler", "alt klasör")
        os.makedirs(root)
        for name, fmt, (w, h) in (("a.jpg", "JPG", (800, 600)), ("b.png", "PNG", (600, 900)),
                                  ("c.webp", "WEBP", (1000, 1000))):
            im = QImage(w, h, QImage.Format_RGB888)
            im.fill(QColor("#3366aa"))
            ok &= im.save(os.path.join(root, name), fmt)
        items, _, _ = scan_folder(os.path.join(tmp, "Ürünler"), exts)
        res["gorsel"] = len(items)
        ok &= len(items) == 3
        res["oranlar"] = [round(read_aspect(p) or 0, 3) for p in items]
        ok &= res["oranlar"] == [1.333, 0.667, 1.0]
        for p in items:
            r = QImageReader(p)
            ok &= not r.read().isNull()
            del r
        os.environ["FIYAT_DATA"] = os.path.join(tmp, "veri")
        w = Main(os.path.join(tmp, "Ürünler"))
        w.resize(1200, 800)
        w.open_folder(os.path.join(tmp, "Ürünler"), sync=True)
        w.store.set(w.all_items[0], "fiyat", "1250,50")
        w.store.set(w.all_items[0], "yazi", "Deri çanta")
        w.save(force=True)
        rows = open(os.path.join(tmp, "Ürünler", CSV_NAME), encoding="utf-8-sig").read()
        ok &= "1250,50" in rows and "Deri çanta" in rows
        ok &= os.path.exists(os.path.join(tmp, "veri", "fiyatlar.json"))
        res["pencere"] = len(w.grid.rects)
        ok &= len(w.grid.rects) == 3
        w.tour.start(0)
        res["tanitim_adimi"] = w.tour.step
        ok &= w.tour.step == 1
        w.tour.finish()
        w.close()
        QSettings(APP, APP).clear()
    except Exception as ex:
        ok = False
        res["hata"] = repr(ex)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    res["sonuc"] = "TAMAM" if ok else "HATA"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=1)
    return 0 if ok else 1


def main():
    if hasattr(Qt, "HighDpiScaleFactorRoundingPolicy"):
        QGuiApplication.setHighDpiScaleFactorRoundingPolicy(Qt.HighDpiScaleFactorRoundingPolicy.PassThrough)
    app = QApplication(sys.argv)
    app.setApplicationName(APP)
    app.setApplicationDisplayName("Fiyat")
    app.setWindowIcon(QIcon(QPixmap.fromImage(app_icon_image())))
    f = QFont()
    f.setFamilies(["Segoe UI Variable Text", "Segoe UI", "Inter", "Noto Sans", "DejaVu Sans"])
    f.setPointSize(10)
    app.setFont(f)
    if os.environ.get("FIYAT_SELFTEST"):
        sys.exit(self_test(os.environ["FIYAT_SELFTEST"]))
    data_dir = os.environ.get("FIYAT_DATA") or QStandardPaths.writableLocation(QStandardPaths.AppDataLocation)
    os.makedirs(data_dir, exist_ok=True)
    lock = QLockFile(os.path.join(data_dir, "fiyat.lock"))    # aynı anda iki kopya kayıtları ezmesin
    lock.setStaleLockTime(0)
    if not lock.tryLock(300):
        QMessageBox.information(None, "Fiyat", "Fiyat zaten açık. Açık olan pencereyi kullan.")
        return
    start = sys.argv[1] if len(sys.argv) > 1 else None
    w = Main(start)
    if os.environ.get("AYIKLA_TEST_SIZE"):
        a, b = os.environ["AYIKLA_TEST_SIZE"].split("x")
        w.resize(int(a), int(b))
        w.show()
    else:
        w.showFullScreen()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
