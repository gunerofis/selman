# -*- coding: utf-8 -*-
"""Ayıkla — görsel ayıklama galerisi (tam ekran; her kart görselin kendi oranında, boşluksuz).

Kart butonları:  ✕ Red → _RED   ✓ Onay (dosya yerinde kalır, işaretlenir)   − Arşiv → _ARSIV   not → _ISLEM
_RED/_ARSIV/_ISLEM açılan klasörün içinde oluşur; alt klasör yapısı korunur.
İşlenen kart yerinde kalır (soluk + işaret); üstüne tıklamak o işlemi geri alır. F5 listeyi toplar.
Seçim: görsele tık = seç/bırak · basılı sürükle = boyayarak seç · Shift+tık = aralık · Ctrl+A = tümü · Esc = temizle
Toplu işlem: üst çubuktaki renkli butonlar (seçim varken görünür)
Klavye kısayollarının tamamı: F1
"""
import os
import sys
import re
import json
import time
import shutil
import subprocess
from bisect import bisect_left, bisect_right
from collections import OrderedDict
from datetime import datetime

from PySide6.QtCore import (Qt, QPoint, QRect, QRectF, QPointF, QSize, QObject, Signal, QBuffer, QByteArray, QIODevice,
                            QRunnable, QThreadPool, QTimer, QSettings, QEvent, QStandardPaths)
from PySide6.QtGui import (QPainter, QColor, QPen, QPixmap, QImage, QImageReader, QImageIOHandler,
                           QIcon, QPainterPath, QCursor, QKeySequence, QShortcut, QFont, QLinearGradient,
                           QGuiApplication)
from PySide6.QtWidgets import (QApplication, QWidget, QAbstractScrollArea, QHBoxLayout,
                               QVBoxLayout, QLineEdit, QLabel, QToolButton, QFileDialog,
                               QDialog, QPlainTextEdit, QToolTip, QSizePolicy, QMenu)

# ---------------------------------------------------------------- ayarlar
ROW_CHOICES = [1, 2, 3, 4, 5, 6]   # ekranda kaç sıra görsel
DEFAULT_ROWS = 2
DIR_RED = "_RED"
DIR_ARSIV = "_ARSIV"
DIR_ISLEM = "_ISLEM"
LEGACY_ONAY = "_ONAY"      # eski sürümün onay klasörü (açılışta dosyalar yerine geri taşınır)
NOTE_SUFFIX = " - NOT.txt"
SKIP_DIRS = {DIR_RED, DIR_ARSIV, DIR_ISLEM, LEGACY_ONAY, "_COP", "$RECYCLE.BIN", "System Volume Information"}
IS_WIN = sys.platform.startswith("win")

ACTIONS = ["red", "onay", "arsiv", "not"]
ACT_DIRS = {"red": DIR_RED, "arsiv": DIR_ARSIV, "not": DIR_ISLEM}
ACT_ICON = {"red": "x", "onay": "check", "arsiv": "minus", "not": "note"}
ACT_COLOR = {"red": QColor("#e5484d"), "onay": QColor("#2fb36d"), "arsiv": QColor("#f2b01e"), "not": QColor("#4a8df6")}
ACT_TIP = {"red": "Red → _RED  (Del)", "onay": "Onay — dosya yerinde kalır", "arsiv": "Arşiv → _ARSIV",
           "not": "Not yaz → _ISLEM"}
ACT_DONE = {"red": "Red", "onay": "Onaylandı", "arsiv": "Arşivlendi", "not": "İşleme gönderildi"}
KEY_ACTIONS = {Qt.Key_1: "red", Qt.Key_X: "red", Qt.Key_Delete: "red",
               Qt.Key_2: "onay", Qt.Key_O: "onay",
               Qt.Key_3: "arsiv", Qt.Key_A: "arsiv",
               Qt.Key_4: "not", Qt.Key_N: "not",
               Qt.Key_Backspace: "geri", Qt.Key_U: "geri"}

HELP = [
    ("Kart işlemleri", [
        ("1  ·  X  ·  Del", "Red  →  _RED"),
        ("2  ·  O", "Onay (dosya yerinde kalır)"),
        ("3  ·  A", "Arşiv  →  _ARSIV"),
        ("4  ·  N", "Not yaz  →  _ISLEM"),
        ("Backspace  ·  U", "Kartın işlemini geri al"),
        ("Ctrl+Z", "Son işlemi geri al"),
        ("", "Seçim varsa seçilenlere, yoksa imleçteki karta uygulanır; sonra imleç sıradakine geçer"),
    ]),
    ("Gezinme", [
        ("← → ↑ ↓", "İmleci kartlar arasında gezdir"),
        ("PgUp  ·  PgDn", "Bir sayfa yukarı / aşağı"),
        ("Home  ·  End", "İlk / son kart"),
        ("Tekerlek", "Bir sıra kaydır"),
    ]),
    ("Seçim", [
        ("Boşluk", "İmleçteki kartı seç / bırak"),
        ("Shift + ok tuşları", "Seçimi genişlet"),
        ("Ctrl+A", "Tümünü seç"),
        ("Esc", "Seçimi temizle (seçim yoksa tam ekrandan çık)"),
    ]),
    ("Görünüm ve dosya", [
        ("Enter", "Görseli aç"),
        ("Ctrl+E", "Klasörde göster"),
        ("Ctrl + / Ctrl −  ·  Ctrl+tekerlek", "Görselleri büyüt / küçült (ekrandaki sıra sayısı)"),
        ("H", "Onaylıları göster / gizle"),
        ("F5", "Yenile (işlenenleri topla)"),
        ("F11", "Tam ekran"),
        ("Ctrl+O", "Klasör seç"),
        ("Ctrl+L", "Yol kutusuna git"),
        ("F1", "Bu liste"),
        ("Ctrl+Q", "Kapat"),
    ]),
]

BG = QColor("#0d0d0d")
CARD = QColor("#181818")
TEXT = QColor("#9a9a9a")
SEL = QColor("#f2f2f2")

GAP = 2                    # kart kenar boşluğu (px, her yan)
BTN_RATIO = 0.095          # buton şeridi kart yüksekliğine oranı
BTN_MIN = 34
BTN_MAX = 64
CACHE_MB = 300             # küçük resim önbelleği üst sınırı

APP_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(APP_DIR, "ayikla_log.txt")


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


def scan_folder(root, exts):
    """Kök + tüm alt klasörler (derinlik sınırsız). -> (yollar, klasör_sayısı, okunamayan)"""
    out, errors = [], []
    ndirs = 0
    for dp, dns, fns in os.walk(L(root, force=True), onerror=errors.append):
        dns[:] = [d for d in dns if d not in SKIP_DIRS]
        ndirs += 1
        dp = unL(dp)
        for f in fns:
            if f.startswith("._"):          # macOS artığı
                continue
            if os.path.splitext(f)[1].lower() in exts:
                out.append(os.path.join(dp, f))
    out.sort(key=lambda p: sort_key(root, p))
    return out, ndirs, len(errors)


def note_path_for(img_path):
    return os.path.splitext(img_path)[0] + NOTE_SUFFIX


def unique_path(folder, name, with_note=False):
    base, ext = os.path.splitext(name)
    cand = os.path.join(folder, name)
    i = 2
    while os.path.exists(L(cand)) or (with_note and os.path.exists(L(note_path_for(cand)))):
        cand = os.path.join(folder, "%s (%d)%s" % (base, i, ext))
        i += 1
    return cand


def mirror_dir(root, target, path):
    """root/_HEDEF/<görselin root'a göre alt klasörü>"""
    try:
        rel = os.path.relpath(os.path.dirname(path), root)
    except ValueError:
        rel = "."
    if rel == "." or rel.startswith(".."):
        return os.path.join(root, target)
    return os.path.join(root, target, rel)


def prune_empty(d, stop):
    """Boş kalan klasörleri yukarı doğru siler (stop klasörünün kendisi hariç)."""
    stop_n = os.path.normcase(os.path.abspath(stop)) + os.sep
    d = os.path.abspath(d)
    while os.path.normcase(d).startswith(stop_n):
        try:
            if os.listdir(L(d)):
                break
            os.rmdir(L(d))
        except OSError:
            break
        d = os.path.dirname(d)


def is_under(path, root):
    return os.path.normcase(os.path.abspath(path)).startswith(os.path.normcase(os.path.abspath(root)) + os.sep)


def log(line):
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(datetime.now().strftime("%Y-%m-%d %H:%M:%S  ") + line + "\n")
    except Exception:
        pass


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


# ---------------------------------------------------------------- onay kaydı
class Approvals:
    """Onaylanan dosyalar: {normalize_yol: boyut}. Dosya değişirse (boyut farklı) onay düşer."""

    def __init__(self, path):
        self.path = path
        self.data = {}
        self.dirty = False
        try:
            with open(path, encoding="utf-8") as f:
                self.data = json.load(f)
        except Exception:
            self.data = {}

    @staticmethod
    def key(p):
        return os.path.normcase(os.path.abspath(p))

    def has(self, p):
        s = self.data.get(self.key(p))
        if s is None:
            return False
        try:
            return os.path.getsize(L(p)) == s
        except OSError:
            return False

    def add(self, p):
        self.data[self.key(p)] = os.path.getsize(L(p))
        self.dirty = True

    def remove(self, p):
        if self.data.pop(self.key(p), None) is not None:
            self.dirty = True

    def save(self):
        if not self.dirty:
            return
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        tmp = self.path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(self.data, f, ensure_ascii=False)
        os.replace(tmp, self.path)
        self.dirty = False


def migrate_legacy_onay(root, approvals):
    """Eski sürümün _ONAY'a taşıdıklarını log'dan bulup eski yerlerine geri koyar ve onaylı işaretler."""
    legacy = os.path.join(root, LEGACY_ONAY)
    if not os.path.isdir(L(legacy)) or not os.path.exists(LOG_FILE):
        return 0
    n = 0
    try:
        with open(LOG_FILE, encoding="utf-8") as f:
            lines = f.read().splitlines()
    except Exception:
        return 0
    for line in lines:
        body = line[21:] if len(line) > 21 else ""
        if not body.startswith(LEGACY_ONAY + "  ") or " -> " not in body:
            continue
        src, dst = body[len(LEGACY_ONAY) + 2:].split(" -> ", 1)
        if not is_under(src, root) or not is_under(dst, legacy):
            continue
        if os.path.exists(L(dst)) and not os.path.exists(L(src)):
            try:
                os.makedirs(L(os.path.dirname(src)), exist_ok=True)
                shutil.move(L(dst), L(src))
                approvals.add(src)
                log("ESKI ONAY GERI  %s -> %s" % (dst, src))
                n += 1
            except Exception as ex:
                log("ESKI ONAY HATA %s :: %s" % (dst, ex))
    prune_empty(legacy, root)
    return n


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
        return os.path.normcase(os.path.abspath(p))

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


# ---------------------------------------------------------------- ızgara
class Grid(QAbstractScrollArea):
    action = Signal(int, str)          # kart butonu: indeks, eylem
    revert = Signal(int)               # işlenmiş karta tık: geri al
    changed = Signal()                 # sayı / seçim değişti
    zoom = Signal(int)                 # Ctrl+tekerlek: -1 büyüt / +1 küçült
    key_action = Signal(str)           # klavye: red/onay/arsiv/not/geri

    def __init__(self, parent=None):
        super().__init__(parent)
        self.items = []
        self.done = {}                  # yol -> kayıt (işlenmiş kartlar)
        self.sel = set()                # seçili yollar
        self.root = ""
        self.gen = 0
        self.cache = OrderedDict()      # yol -> (QPixmap, (w,h))
        self.pending = {}               # yol -> kuyruk önceliği
        self.cache_bytes = 0
        self.failed = set()
        self._want = set()
        self._prio = 0
        self.hover = None               # (indeks, bölge, buton)
        self._paint = None              # boyayarak seçim: hedef durum (True/False)
        self._anchor = None
        self._wheel_acc = 0
        self.cur = -1                   # klavye imleci (kart indeksi)
        self._layout_init()
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
    def set_items(self, root, items, done, keep_scroll=False):
        anc = self.anchor("view") if keep_scroll else None
        new_root = root != self.root
        self.gen += 1
        self.pool.clear()
        self.root, self.items, self.done = root, items, done
        keep = set(items)
        self.sel = {p for p in self.sel if p in keep} if not new_root else set()
        if new_root:
            self.cache.clear()
            self.cache_bytes = 0
        self.pending.clear()
        self.failed.clear()
        self.hover = None
        self._anchor = None
        self.cur = 0 if items and (new_root or self.cur < 0) else min(self.cur, len(items) - 1)
        self._start_aspects(new_root)
        self.relayout(anc)
        if anc is None:
            self.verticalScrollBar().setValue(0)
        self.viewport().update()
        self.changed.emit()

    def insert_sorted(self, path):
        anc = self.anchor("view")
        k = sort_key(self.root, path)
        i = 0
        while i < len(self.items) and sort_key(self.root, self.items[i]) <= k:
            i += 1
        self.items.insert(i, path)
        if path not in self.ar:
            a = read_aspect(path)
            if a:
                self.ar[path] = a
        self.relayout(anc)
        self.ensure_visible(i)
        return i

    def remaining(self):
        return sum(1 for p in self.items if p not in self.done)

    def set_selected(self, path, on):
        if on and path not in self.done:
            self.sel.add(path)
        else:
            self.sel.discard(path)

    def select_all(self):
        self.sel = {p for p in self.items if p not in self.done}
        self.viewport().update()
        self.changed.emit()

    def clear_selection(self):
        if self.sel:
            self.sel.clear()
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
        ms = 80 if i <= last + 40 else 1200
        t = self._ar_timer
        if not t.isActive() or t.remainingTime() > ms:
            t.start(ms)

    def btn_h(self, card_h):
        return max(BTN_MIN, min(BTN_MAX, int(card_h * BTN_RATIO)))

    def bar_h(self, card_h):
        return self.btn_h(card_h)

    def card_extra(self, bh):
        """Kartta görsel dışında kalan en / boy: sadece alttaki buton şeridi."""
        return 0, bh

    def min_img_w(self, bh):
        return 4 * bh                    # dört buton rahat sığsın

    def hit(self, pos):
        idx = self.hit_index(pos)
        if idx < 0:
            return None
        card = self.card_rect(idx)
        if self.items[idx] in self.done:
            return (idx, "done", -1)
        bh = self.bh
        if pos.y() > card.bottom() - bh:
            n = len(ACTIONS)
            b = min(n - 1, max(0, (pos.x() - card.left()) * n // max(1, card.width())))
            return (idx, "btn", b)
        return (idx, "img", -1)

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
        if self.cur < 0 or self.cur >= len(self.items):
            first, _ = self.visible_range()
            if not self.items:
                return False
            self.cur = min(first, len(self.items) - 1)
        return True

    def next_open(self, start):
        """start'tan itibaren işlenmemiş ilk kart (yoksa start)."""
        for j in range(start, len(self.items)):
            if self.items[j] not in self.done:
                return j
        return start

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
        if old is not None and self._prio - old < 40:   # kuyrukta yeterince öndeyse bekle
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
        self._refresh_hover()
        self.viewport().update()

    # ---- çizim
    def paintEvent(self, e):
        p = QPainter(self.viewport())
        p.fillRect(self.viewport().rect(), BG)
        if not self.items:
            p.setPen(TEXT)
            f = QFont(self.font())
            f.setPointSize(13)
            p.setFont(f)
            msg = "Klasörü buraya sürükle ya da yukarıya yolunu yapıştır" if not self.root else "Bu klasörde görsel yok"
            p.drawText(self.viewport().rect(), Qt.AlignCenter, msg)
            return
        if len(self.rects) != len(self.items):
            return
        p.setRenderHint(QPainter.SmoothPixmapTransform)
        p.setRenderHint(QPainter.Antialiasing)
        first, last = self.visible_range()
        n = len(self.items)
        vis = max(1, last - first)
        self._keep_n = max(24, vis * 3)
        page = max(8, vis * 2)                      # iki ekran ileriyi önceden yükle
        self._want = set(self.items[max(0, first - vis):min(n, last + page)])
        self._cur_ring = None
        for i in range(first, last):
            self._paint_card(p, i)
        if self._cur_ring is not None and self.hasFocus():            # klavye imleci
            pen = QPen(QColor("#f2f2f2"), 2, Qt.DashLine)
            pen.setDashPattern([4, 3])
            p.setPen(pen)
            p.setBrush(Qt.NoBrush)
            p.drawRect(QRectF(self._cur_ring).adjusted(5, 5, -5, -5))
        for i in range(last, min(n, last + page)):
            self._request(self.items[i], *self.target_size(i))
        p.end()

    def _draw_image(self, p, path, img_r, tw, th, opacity=1.0):
        c = self.cache.get(path)
        if c is not None:
            self.cache.move_to_end(path)
            pm = c[0]
            dpr = pm.devicePixelRatio()
            p.save()
            p.setClipRect(img_r)
            p.setOpacity(opacity)
            p.drawPixmap(fit_rect(img_r, pm.width() / dpr, pm.height() / dpr), pm, QRectF(0, 0, pm.width(), pm.height()))
            p.restore()
        elif path in self.failed:
            s = min(img_r.width(), img_r.height()) * 0.12
            draw_icon(p, "x", QRectF(img_r.center().x() - s / 2, img_r.center().y() - s / 2, s, s), QColor("#3a3a3a"))
        if c is None or c[1][0] < tw * 0.92 or c[1][1] < th * 0.92:
            self._request(path, tw, th)

    def _strip(self, card, bh):
        """Buton şeridinin iç alanı (kenar boşluklu)."""
        pad = max(3.0, bh * 0.10)
        return QRectF(card.left() + pad, card.bottom() - bh + 1 + pad * 0.5,
                      card.width() - 2 * pad, bh - pad * 1.5)

    def _btn_rects(self, card, bh):
        st = self._strip(card, bh)
        n = len(ACTIONS)
        gap = max(4.0, bh * 0.16)
        w = (st.width() - gap * (n - 1)) / n
        return [QRectF(st.left() + b * (w + gap), st.top(), w, st.height()) for b in range(n)]

    @staticmethod
    def _draw_btn(p, r, color, icon, hot):
        rad = min(r.height() * 0.32, 12.0)
        path = QPainterPath()
        path.addRoundedRect(r.adjusted(0.5, 0.5, -0.5, -0.5), rad, rad)
        if hot:                                              # üzerindeyken: dolu, hafif degrade
            g = QLinearGradient(r.topLeft(), r.bottomLeft())
            g.setColorAt(0, color.lighter(122))
            g.setColorAt(1, color.darker(105))
            p.setPen(Qt.NoPen)
            p.setBrush(g)
            p.drawPath(path)
            ic = QColor("#ffffff")
        else:                                                # normal: renkli ince çerçeve + hafif zemin
            bg = QColor(color)
            bg.setAlpha(44)
            bd = QColor(color)
            bd.setAlpha(130)
            p.setPen(QPen(bd, 1.2))
            p.setBrush(bg)
            p.drawPath(path)
            ic = color.lighter(115)
        s = r.height() * 0.58
        draw_icon(p, icon, QRectF(r.center().x() - s / 2, r.center().y() - s / 2, s, s), ic,
                  width=max(2.0, s * 0.14))

    def _paint_card(self, p, i):
        path = self.items[i]
        card = self.card_rect(i)
        p.fillRect(card, CARD)
        bh = self.bh
        tw, th = self.target_size(i)
        img_r = QRect(card.left(), card.top(), card.width(), card.height() - bh)
        hov = self.hover if self.hover and self.hover[0] == i else None
        rec = self.done.get(path)
        if i == self.cur:
            self._cur_ring = card

        if rec:                                   # ---- işlenmiş kart
            kind = rec["kind"]
            col = ACT_COLOR[kind]
            if kind == "onay":
                self._draw_image(p, path, img_r, tw, th)
                s = max(18, bh * 1.1)
                badge = QRectF(img_r.right() - s - 6, img_r.top() + 6, s, s)
                p.setPen(Qt.NoPen)
                p.setBrush(col)
                p.drawEllipse(badge)
                draw_icon(p, "check", badge.adjusted(s * .2, s * .2, -s * .2, -s * .2), QColor("#ffffff"), width=s * .11)
            else:
                self._draw_image(p, path, img_r, tw, th, opacity=0.18)
                s = min(img_r.width(), img_r.height()) * 0.30
                draw_icon(p, ACT_ICON[kind], QRectF(img_r.center().x() - s / 2, img_r.center().y() - s / 2, s, s),
                          col, width=s * 0.09)
            self._draw_btn(p, self._strip(card, bh), col, "undo", bool(hov))
            p.setPen(QPen(col, 3 if kind == "onay" else 2))
            p.setBrush(Qt.NoBrush)
            p.drawRect(QRectF(card).adjusted(1, 1, -1, -1))
            return

        self._draw_image(p, path, img_r, tw, th)  # ---- normal kart
        selected = path in self.sel
        if selected:
            p.setPen(QPen(SEL, 3))
            p.setBrush(Qt.NoBrush)
            p.drawRect(QRectF(card).adjusted(1.5, 1.5, -1.5, -1.5))
            s = max(18, bh * 1.1)
            badge = QRectF(img_r.left() + 6, img_r.top() + 6, s, s)
            p.setPen(Qt.NoPen)
            p.setBrush(SEL)
            p.drawEllipse(badge)
            draw_icon(p, "check", badge.adjusted(s * .2, s * .2, -s * .2, -s * .2), QColor("#111111"), width=s * .11)
        elif hov:
            p.setPen(QPen(QColor("#4a4a4a"), 1))
            p.setBrush(Qt.NoBrush)
            p.drawRect(card.adjusted(0, 0, -1, -1))
        for b, r in enumerate(self._btn_rects(card, bh)):
            kind = ACTIONS[b]
            self._draw_btn(p, r, ACT_COLOR[kind], ACT_ICON[kind], bool(hov and hov[1] == "btn" and hov[2] == b))

    # ---- fare / klavye
    def _set_hover(self, h):
        if h != self.hover:
            self.hover = h
            self.viewport().setCursor(Qt.PointingHandCursor if h and h[1] in ("btn", "done") else Qt.ArrowCursor)
            self.viewport().update()

    def _refresh_hover(self):
        pos = self.viewport().mapFromGlobal(QCursor.pos())
        self._set_hover(self.hit(pos) if self.viewport().rect().contains(pos) else None)

    def mouseMoveEvent(self, e):
        h = self.hit(e.position().toPoint())
        self._set_hover(h)
        if h and h[0] != self.cur:
            self.cur = h[0]
            self.viewport().update()
        if self._paint is not None and (e.buttons() & Qt.LeftButton) and h and h[1] != "done":
            path = self.items[h[0]]
            if (path in self.sel) != self._paint:
                self.set_selected(path, self._paint)
                self.viewport().update()
                self.changed.emit()

    def leaveEvent(self, e):
        self.hover = None
        self.viewport().update()
        super().leaveEvent(e)

    def mousePressEvent(self, e):
        self.setFocus()
        pos = e.position().toPoint()
        h = self.hit(pos)
        if e.button() == Qt.RightButton:
            if h:
                reveal_in_explorer(self.items[h[0]])
            return
        if e.button() != Qt.LeftButton:
            return
        if not h:
            if not (e.modifiers() & (Qt.ShiftModifier | Qt.ControlModifier)):
                self.clear_selection()
            return
        idx, zone, b = h
        path = self.items[idx]
        self.cur = idx
        if zone == "btn":                                   # anlık işlem (basışta)
            self.action.emit(idx, ACTIONS[b])
        elif zone == "done":                                # tık = geri al (çift tık koruması ile)
            rec = self.done.get(path)
            if rec and time.monotonic() - rec.get("t", 0) > QApplication.doubleClickInterval() / 1000.0:
                self.revert.emit(idx)
        else:                                               # görsel: seçim
            if (e.modifiers() & Qt.ShiftModifier) and self._anchor is not None:
                a, z = sorted((self._anchor, idx))
                for j in range(a, min(z, len(self.items) - 1) + 1):
                    self.set_selected(self.items[j], True)
            else:
                state = path not in self.sel
                self.set_selected(path, state)
                self._paint = state
                self._anchor = idx
            self.viewport().update()
            self.changed.emit()

    def mouseReleaseEvent(self, e):
        self._paint = None

    def mouseDoubleClickEvent(self, e):
        h = self.hit(e.position().toPoint())
        if h and h[1] == "img":
            open_file(self.items[h[0]])

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

    def focusOutEvent(self, e):
        super().focusOutEvent(e)
        self.viewport().update()

    def keyPressEvent(self, e):
        k, mods = e.key(), e.modifiers()
        if not self.items:
            return super().keyPressEvent(e)
        plain = not (mods & (Qt.ControlModifier | Qt.AltModifier))
        moves = (Qt.Key_Left, Qt.Key_Right, Qt.Key_Up, Qt.Key_Down, Qt.Key_PageUp, Qt.Key_PageDown)
        if k in moves and plain:
            self.cur_valid()
            old = self.cur
            self.set_cur(self.key_target(k))
            if mods & Qt.ShiftModifier:                       # Shift+ok: seçimi genişlet
                if self._anchor is None:
                    self._anchor = old
                a, z = sorted((self._anchor, self.cur))
                for j in range(a, z + 1):
                    self.set_selected(self.items[j], True)
                self.changed.emit()
            else:
                self._anchor = self.cur
            self.viewport().update()
        elif k in (Qt.Key_Home, Qt.Key_End) and plain:
            self.set_cur(0 if k == Qt.Key_Home else len(self.items) - 1)
        elif k == Qt.Key_Space and plain:
            if self.cur_valid():
                path = self.items[self.cur]
                self.set_selected(path, path not in self.sel)
                self._anchor = self.cur
                self.viewport().update()
                self.changed.emit()
        elif k in (Qt.Key_Return, Qt.Key_Enter) and plain:
            if self.cur_valid():
                open_file(self.items[self.cur])
        elif k in KEY_ACTIONS and plain and not (mods & Qt.ShiftModifier):
            if self.cur_valid():
                self.key_action.emit(KEY_ACTIONS[k])
        else:
            super().keyPressEvent(e)

    def viewportEvent(self, e):
        if e.type() == QEvent.ToolTip:
            h = self.hit(e.pos())
            if h:
                path = self.items[h[0]]
                rel = os.path.relpath(path, self.root) if self.root else path
                if h[1] == "btn":
                    tip = ACT_TIP[ACTIONS[h[2]]]
                elif h[1] == "done":
                    tip = "%s — geri almak için tıkla\n%s" % (ACT_DONE[self.done[path]["kind"]], rel)
                else:
                    tip = rel
                QToolTip.showText(e.globalPos(), tip, self.viewport())
            else:
                QToolTip.hideText()
            return True
        return super().viewportEvent(e)


# ---------------------------------------------------------------- not penceresi
class NoteDialog(QDialog):
    def __init__(self, parent, pix=None, title=""):
        super().__init__(parent)
        self.setWindowTitle("Not — " + title)
        self.setStyleSheet("""
            QDialog { background:#151515; }
            QPlainTextEdit { background:#0f0f0f; color:#e6e6e6; border:1px solid #2a2a2a;
                             font-size:15px; padding:6px; selection-background-color:#4a8df6; }
            QToolButton { background:#1f1f1f; border:none; border-radius:4px; }
            QToolButton:hover { background:#2a2a2a; }
        """)
        lay = QHBoxLayout(self)
        lay.setContentsMargins(10, 10, 10, 10)
        lay.setSpacing(10)
        if pix is not None:
            lbl = QLabel()
            d = pix.devicePixelRatio()
            sp = pix.scaled(int(200 * d), int(200 * d), Qt.KeepAspectRatio, Qt.SmoothTransformation)
            sp.setDevicePixelRatio(d)
            lbl.setPixmap(sp)
            lbl.setAlignment(Qt.AlignCenter)
            lbl.setFixedWidth(200)
            lay.addWidget(lbl)
        col = QVBoxLayout()
        self.edit = QPlainTextEdit()
        self.edit.installEventFilter(self)
        col.addWidget(self.edit, 1)
        row = QHBoxLayout()
        row.addStretch(1)
        for kind, color, slot, tip in (("x", QColor("#9a9a9a"), self.reject, "Vazgeç (Esc)"),
                                       ("check", ACT_COLOR["not"], self.accept, "Kaydet (Enter)")):
            b = QToolButton()
            b.setIcon(make_icon(kind, color, 18))
            b.setIconSize(QSize(18, 18))
            b.setFixedSize(44, 30)
            b.setToolTip(tip)
            b.clicked.connect(slot)
            row.addWidget(b)
        col.addLayout(row)
        lay.addLayout(col, 1)
        self.resize(640, 230)
        self.edit.setFocus()

    def eventFilter(self, obj, e):
        if obj is self.edit and e.type() == QEvent.KeyPress and e.key() in (Qt.Key_Return, Qt.Key_Enter):
            if not (e.modifiers() & Qt.ShiftModifier):
                self.accept()
                return True
        return super().eventFilter(obj, e)

    def text(self):
        return self.edit.toPlainText().strip()


# ---------------------------------------------------------------- kısayol listesi
class HelpDialog(QDialog):
    def __init__(self, parent, title, sections):
        super().__init__(parent)
        self.setWindowTitle(title)
        self.setStyleSheet("QDialog{background:#151515;} QLabel{color:#d8d8d8;}")
        rows = []
        for head, items in sections:
            rows.append('<tr><td colspan="2" style="padding:14px 0 6px 0;color:#8a8a8a;'
                        'font-size:12px;letter-spacing:1px;">%s</td></tr>' % head.upper())
            for keys, desc in items:
                if keys:
                    rows.append('<tr><td style="padding:3px 22px 3px 0;white-space:nowrap;">'
                                '<span style="background:#262626;color:#ffffff;padding:2px 7px;'
                                'font-family:Consolas,monospace;">%s</span></td>'
                                '<td style="padding:3px 0;">%s</td></tr>' % (keys, desc))
                else:
                    rows.append('<tr><td></td><td style="padding:3px 0;color:#8a8a8a;">%s</td></tr>' % desc)
        lbl = QLabel('<table style="font-size:14px;">%s</table>' % "".join(rows))
        lbl.setTextFormat(Qt.RichText)
        lay = QVBoxLayout(self)
        lay.setContentsMargins(26, 14, 26, 22)
        lay.addWidget(lbl)
        QShortcut(QKeySequence("F1"), self, activated=self.accept)


# ---------------------------------------------------------------- ana pencere
class Main(QWidget):
    def __init__(self, start_path=None):
        super().__init__()
        self.setWindowTitle("Ayıkla")
        self.setAcceptDrops(True)
        self.settings = QSettings("Ayikla", "Ayikla")
        data_dir = os.environ.get("AYIKLA_DATA") or QStandardPaths.writableLocation(QStandardPaths.AppDataLocation)
        self.approvals = Approvals(os.path.join(data_dir, "onaylar.json"))
        self.exts = image_exts()
        self.root = ""
        self.undo_stack = []            # her öğe: kayıt listesi (toplu işlem tek adımda geri alınır)
        self.show_approved = False

        self.setStyleSheet("""
            QWidget#bar { background:#0d0d0d; }
            QLineEdit { background:#161616; color:#bdbdbd; border:1px solid #232323; border-radius:3px;
                        padding:1px 6px; font-size:12px; selection-background-color:#4a8df6; }
            QLabel { color:#8a8a8a; font-size:12px; }
            QLabel#sel { color:#f2f2f2; font-weight:bold; }
            QToolButton { background:transparent; border:none; border-radius:3px; }
            QToolButton:hover { background:#222; }
            QToolButton:checked { background:#1d3a2a; }
            QScrollBar:vertical { background:#0d0d0d; width:8px; margin:0; }
            QScrollBar::handle:vertical { background:#333; border-radius:3px; min-height:30px; }
            QScrollBar::handle:vertical:hover { background:#4a4a4a; }
            QScrollBar::add-line, QScrollBar::sub-line { height:0; }
            QScrollBar::add-page, QScrollBar::sub-page { background:none; }
            QToolTip { background:#222; color:#ddd; border:1px solid #333; }
            QToolButton#gridbtn { color:#bdbdbd; font-size:12px; padding:0 6px 0 4px; }
            QToolButton#gridbtn::menu-indicator { image:none; width:0; }
            QMenu { background:#1a1a1a; color:#d6d6d6; border:1px solid #2c2c2c; padding:4px; }
            QMenu::item { padding:6px 22px 6px 22px; border-radius:4px; font-size:13px; }
            QMenu::item:selected { background:#2a2a2a; }
            QMenu::item:checked { color:#ffffff; font-weight:bold; }
        """)

        bar = QWidget(objectName="bar")
        bar.setFixedHeight(28)
        bl = QHBoxLayout(bar)
        bl.setContentsMargins(4, 2, 4, 2)
        bl.setSpacing(4)
        self.path_edit = QLineEdit()
        self.path_edit.setPlaceholderText("Klasör yolu…")
        self.path_edit.returnPressed.connect(lambda: self.open_folder(self.path_edit.text()))
        self.count_lbl = QLabel("")
        self.count_lbl.setToolTip("Kalan / toplam")
        self.status_lbl = QLabel("")
        self.status_lbl.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Preferred)
        self.status_lbl.setMinimumWidth(40)

        # toplu işlem grubu (seçim varken görünür)
        self.bulk = QWidget()
        gl = QHBoxLayout(self.bulk)
        gl.setContentsMargins(0, 0, 0, 0)
        gl.setSpacing(3)
        self.sel_lbl = QLabel("", objectName="sel")
        gl.addWidget(self.sel_lbl)
        for kind in ACTIONS:
            c = ACT_COLOR[kind]
            b = QToolButton()
            b.setIcon(make_icon(ACT_ICON[kind], QColor("#ffffff"), 14, 0.12))
            b.setIconSize(QSize(14, 14))
            b.setFixedSize(42, 22)
            b.setToolTip("Seçilenlere: " + ACT_TIP[kind])
            b.setStyleSheet("QToolButton{background:%s;border:1px solid %s;border-radius:6px;}"
                            "QToolButton:hover{background:%s;border-color:%s;}"
                            % (c.darker(170).name(), c.darker(115).name(), c.name(), c.lighter(115).name()))
            b.setFocusPolicy(Qt.NoFocus)
            b.clicked.connect(lambda _=False, k=kind: self.bulk_action(k))
            gl.addWidget(b)
        gl.addWidget(self._tool("x", "Seçimi temizle (Esc)", lambda: self.grid.clear_selection()))
        self.bulk.hide()

        self.btn_grid = QToolButton()
        self.btn_grid.setIcon(make_icon("grid", QColor("#9a9a9a"), 16))
        self.btn_grid.setIconSize(QSize(16, 16))
        self.btn_grid.setToolButtonStyle(Qt.ToolButtonTextBesideIcon)
        self.btn_grid.setPopupMode(QToolButton.InstantPopup)
        self.btn_grid.setFocusPolicy(Qt.NoFocus)
        self.btn_grid.setToolTip("Görsel boyutu: ekranda kaç sıra olsun  ·  Ctrl+tekerlek  ·  Ctrl + / Ctrl −")
        self.btn_grid.setObjectName("gridbtn")
        gm = QMenu(self.btn_grid)
        self.grid_actions = {}
        for r in ROW_CHOICES:
            a = gm.addAction("%d sıra" % r)
            a.setCheckable(True)
            a.triggered.connect(lambda _=False, r=r: self.set_rows(r))
            self.grid_actions[r] = a
        self.btn_grid.setMenu(gm)

        self.btn_eye = self._tool("eye", "Onaylıları göster / gizle", self.toggle_approved)
        self.btn_eye.setCheckable(True)

        bl.addWidget(self._tool("folder", "Klasör seç", self.choose_folder))
        bl.addWidget(self.path_edit, 3)
        bl.addWidget(self.count_lbl)
        bl.addSpacing(6)
        bl.addWidget(self.bulk)
        bl.addSpacing(6)
        bl.addWidget(self.status_lbl, 2)
        bl.addWidget(self.btn_grid)
        bl.addWidget(self.btn_eye)
        bl.addWidget(self._tool("undo", "Geri al (Ctrl+Z)", self.undo))
        bl.addWidget(self._tool("help", "Klavye kısayolları (F1)", self.show_help))
        bl.addWidget(self._tool("refresh", "Yenile / listeyi topla (F5)", self.refresh))
        bl.addWidget(self._tool("full", "Tam ekran (F11)", self.toggle_full))
        bl.addWidget(self._tool("x", "Kapat", self.close))

        self.grid = Grid()
        self.grid.astore = AspectStore(os.path.join(data_dir, "oranlar.json"))
        self.grid.action.connect(self.card_action)
        self.grid.revert.connect(self.revert_card)
        self.grid.changed.connect(self._update_counts)
        self.grid.zoom.connect(self.step_grid)
        self.grid.key_action.connect(self.key_action)

        lay = QVBoxLayout(self)
        lay.setContentsMargins(0, 0, 0, 0)
        lay.setSpacing(0)
        lay.addWidget(bar)
        lay.addWidget(self.grid, 1)

        QShortcut(QKeySequence.Undo, self, activated=self.undo)
        QShortcut(QKeySequence("F5"), self, activated=self.refresh)
        QShortcut(QKeySequence("F11"), self, activated=self.toggle_full)
        for k in ("Ctrl++", "Ctrl+="):
            QShortcut(QKeySequence(k), self, activated=lambda: self.step_grid(-1))
        QShortcut(QKeySequence("Ctrl+-"), self, activated=lambda: self.step_grid(1))
        QShortcut(QKeySequence("Esc"), self, activated=self._esc)
        QShortcut(QKeySequence("Ctrl+A"), self.grid, activated=self.grid.select_all,
                  context=Qt.WidgetWithChildrenShortcut)
        QShortcut(QKeySequence("F1"), self, activated=self.show_help)
        QShortcut(QKeySequence("Ctrl+O"), self, activated=self.choose_folder)
        QShortcut(QKeySequence("Ctrl+L"), self, activated=lambda: (self.path_edit.setFocus(), self.path_edit.selectAll()))
        QShortcut(QKeySequence("Ctrl+E"), self, activated=self.reveal_cur)
        QShortcut(QKeySequence("Ctrl+Q"), self, activated=self.close)
        QShortcut(QKeySequence("H"), self.grid, activated=lambda: (self.btn_eye.toggle(), self.toggle_approved()),
                  context=Qt.WidgetWithChildrenShortcut)

        self._status_timer = QTimer(self, singleShot=True, timeout=lambda: self.status_lbl.setText(""))
        self._save_timer = QTimer(self, singleShot=True, interval=400, timeout=self._save_approvals)

        try:
            r = int(self.settings.value("rows", 0) or 0)
            if not r:                                         # eski sürüm ayarı "sütun,satır"
                r = int(str(self.settings.value("grid", "")).split(",")[1])
            if r not in ROW_CHOICES:
                raise ValueError
        except Exception:
            r = DEFAULT_ROWS
        self.set_rows(r, save=False, quiet=True)

        path = start_path or self.settings.value("last_folder", "")
        if path and os.path.isdir(path):
            QTimer.singleShot(0, lambda: self.open_folder(path))

    def _tool(self, kind, tip, slot):
        b = QToolButton()
        b.setIcon(make_icon(kind, QColor("#8a8a8a"), 16))
        b.setIconSize(QSize(16, 16))
        b.setFixedSize(24, 22)
        b.setToolTip(tip)
        b.clicked.connect(slot)
        b.setFocusPolicy(Qt.NoFocus)
        return b

    # ---- durum
    def status(self, msg, error=False):
        self.status_lbl.setStyleSheet("color:%s" % ("#e5484d" if error else "#8a8a8a"))
        self.status_lbl.setText(msg)
        self._status_timer.start(7000 if error else 3000)

    def _update_counts(self):
        g = self.grid
        self.count_lbl.setText("%d / %d" % (g.remaining(), len(g.items)) if self.root else "")
        n = len(g.sel)
        self.sel_lbl.setText("%d seçili" % n)
        self.bulk.setVisible(n > 0)

    def _save_approvals(self):
        try:
            self.approvals.save()
        except Exception as ex:
            self.status("Onay kaydı yazılamadı: %s" % ex, True)

    # ---- klasör
    def choose_folder(self):
        d = QFileDialog.getExistingDirectory(self, "Klasör seç", self.root or os.path.expanduser("~"))
        if d:
            self.open_folder(d)

    def open_folder(self, path, keep_scroll=False):
        path = path.strip().strip('"').strip("'")
        if not path or not os.path.isdir(path):
            self.status("Klasör bulunamadı", True)
            return
        path = os.path.abspath(path)
        QApplication.setOverrideCursor(Qt.WaitCursor)
        try:
            migrated = migrate_legacy_onay(path, self.approvals)
            if migrated:
                self._save_approvals()
            found, ndirs, nerr = scan_folder(path, self.exts)
        finally:
            QApplication.restoreOverrideCursor()
        items, done, hidden = [], {}, 0
        for p in found:
            if self.approvals.has(p):
                if not self.show_approved:
                    hidden += 1
                    continue
                done[p] = {"kind": "onay", "path": p, "t": 0, "old": True}
            items.append(p)
        self.root = path
        self.path_edit.setText(path)
        self.settings.setValue("last_folder", path)
        self.grid.set_items(path, items, done, keep_scroll=keep_scroll)
        self.grid.setFocus()
        msg = "%d görsel · %d klasör" % (len(found), ndirs)
        if hidden:
            msg += " · %d onaylı gizli" % hidden
        if migrated:
            msg += " · eski _ONAY'dan %d dosya yerine döndü" % migrated
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

    def toggle_approved(self):
        self.show_approved = self.btn_eye.isChecked()
        self.btn_eye.setIcon(make_icon("eye", ACT_COLOR["onay"] if self.show_approved else QColor("#8a8a8a"), 16))
        self.refresh()

    # ---- işlemler
    def _apply_one(self, path, kind, note=None):
        """Tek dosyaya işlem uygular, kayıt döndürür."""
        rec = {"kind": kind, "path": path, "t": time.monotonic()}
        if kind == "onay":
            self.approvals.add(path)
            log("ONAY  %s" % path)
        else:
            dest_dir = mirror_dir(self.root, ACT_DIRS[kind], path)
            os.makedirs(L(dest_dir), exist_ok=True)
            dst = unique_path(dest_dir, os.path.basename(path), with_note=(kind == "not"))
            shutil.move(L(path), L(dst))
            rec["dst"] = dst
            if kind == "not" and note:
                nf = note_path_for(dst)
                try:
                    with open(L(nf), "w", encoding="utf-8") as f:
                        f.write(note + "\n")
                except Exception:
                    shutil.move(L(dst), L(path))
                    raise
                rec["note"] = nf
            log("%s  %s -> %s" % (ACT_DIRS[kind], path, dst))
        return rec

    def apply(self, paths, kind, note=None):
        g = self.grid
        batch, errors = [], 0
        for p in paths:
            if p in g.done:
                continue
            if not os.path.exists(L(p)):
                errors += 1
                continue
            try:
                rec = self._apply_one(p, kind, note)
            except Exception as ex:
                errors += 1
                log("HATA %s %s :: %s" % (kind, p, ex))
                continue
            g.done[p] = rec
            g.sel.discard(p)
            batch.append(rec)
        if batch:
            self.undo_stack.append(batch)
            if kind == "onay":
                self._save_timer.start()
        g.viewport().update()
        self._update_counts()
        if errors:
            self.status("%d işlendi · %d dosya işlenemedi (yerinde yok / kilitli)" % (len(batch), errors), True)
        elif len(batch) > 1:
            self.status("%d görsel: %s" % (len(batch), ACT_DONE[kind]))
        elif batch:
            self.status(ACT_DONE[kind])

    def card_action(self, idx, kind):
        if 0 <= idx < len(self.grid.items):
            path = self.grid.items[idx]
            if kind == "not":
                QTimer.singleShot(0, lambda: self._note([path]))
            else:
                self.apply([path], kind)

    def bulk_action(self, kind):
        g = self.grid
        paths = [p for p in g.items if p in g.sel and p not in g.done]
        if not paths:
            return
        if kind == "not":
            self._note(paths)
        else:
            self.apply(paths, kind)
        g.setFocus()

    def _note(self, paths):
        c = self.grid.cache.get(paths[0])
        title = os.path.basename(paths[0]) if len(paths) == 1 else "%d görsel" % len(paths)
        dlg = NoteDialog(self, c[0] if c else None, title)
        if dlg.exec() == QDialog.Accepted:
            self.apply(paths, "not", note=dlg.text() or None)
        self.grid.setFocus()

    def key_action(self, kind):
        """Klavye: seçim varsa seçilenlere, yoksa imleçteki karta; sonra imleç sıradakine."""
        g = self.grid
        if not g.cur_valid():
            return
        path = g.items[g.cur]
        if kind == "geri":
            if path in g.done:
                self.revert_card(g.cur)
            else:
                self.status("Bu kartta geri alınacak işlem yok")
            return
        if g.sel:
            self.bulk_action(kind)
            return
        if path in g.done:
            self.status("Bu kart işlendi — geri almak için Backspace")
            return
        if kind == "not":
            self._note([path])
        else:
            self.apply([path], kind)
        if path in g.done:
            g.set_cur(g.next_open(g.cur))
            g.viewport().update()

    def reveal_cur(self):
        g = self.grid
        if g.cur_valid():
            reveal_in_explorer(g.items[g.cur])

    def show_help(self):
        HelpDialog(self, "Ayıkla — klavye kısayolları", HELP).exec()
        self.grid.setFocus()

    def _revert_rec(self, rec):
        """Kaydı geri alır; dosyanın döndüğü yolu döndürür."""
        g = self.grid
        path = rec["path"]
        if rec["kind"] == "onay":
            self.approvals.remove(path)
            self._save_timer.start()
            back = path
        else:
            dst = rec["dst"]
            if not os.path.exists(L(dst)):
                raise RuntimeError("dosya %s içinde yok" % ACT_DIRS[rec["kind"]])
            back = path if not os.path.exists(L(path)) else unique_path(os.path.dirname(path), os.path.basename(path))
            os.makedirs(L(os.path.dirname(back)), exist_ok=True)
            shutil.move(L(dst), L(back))
            if rec.get("note") and os.path.exists(L(rec["note"])):
                os.remove(L(rec["note"]))
            prune_empty(os.path.dirname(dst), self.root if is_under(dst, self.root) else os.path.dirname(dst))
        tile = g.done.get(path)
        was_tile = tile is rec or (tile is not None and tile["kind"] == rec["kind"] == "onay")
        if was_tile:
            del g.done[path]
        if was_tile and path in g.items:
            if back != path:
                g.items[g.items.index(path)] = back
        elif back not in g.items and self.root and is_under(back, self.root):
            g.insert_sorted(back)
        log("GERI AL  %s" % back)
        return back

    def revert_card(self, idx):
        rec = self.grid.done.get(self.grid.items[idx])
        if not rec:
            return
        try:
            self._revert_rec(rec)
            same = lambda r: r is rec or (r["kind"] == rec["kind"] == "onay" and r["path"] == rec["path"])
            self.undo_stack = [[r for r in b if not same(r)] for b in self.undo_stack]
            self.undo_stack = [b for b in self.undo_stack if b]
            self.status("Geri alındı")
        except Exception as ex:
            self.status("Geri alınamadı: %s" % ex, True)
        self.grid.viewport().update()
        self._update_counts()

    def undo(self):
        if not self.undo_stack:
            self.status("Geri alınacak işlem yok")
            return
        batch = self.undo_stack.pop()
        ok = err = 0
        for rec in reversed(batch):
            try:
                self._revert_rec(rec)
                ok += 1
            except Exception as ex:
                err += 1
                log("GERI AL HATA %s :: %s" % (rec["path"], ex))
        self.grid.relayout("view")
        self.grid.viewport().update()
        self._update_counts()
        if err:
            self.status("Geri alındı: %d · alınamadı: %d" % (ok, err), True)
        else:
            self.status("Geri alındı" + (" (%d)" % ok if ok > 1 else ""))

    # ---- pencere
    def toggle_full(self):
        if self.isFullScreen():
            self.showMaximized()
        else:
            self.showFullScreen()

    def _esc(self):
        if self.grid.sel:
            self.grid.clear_selection()
        elif self.isFullScreen():
            self.showMaximized()

    def closeEvent(self, e):
        self.grid.pool.clear()
        self.grid.pool.waitForDone(1500)
        self.grid.stop_aspects()
        self._save_approvals()
        super().closeEvent(e)

    def dragEnterEvent(self, e):
        if e.mimeData().hasUrls():
            e.acceptProposedAction()

    def dropEvent(self, e):
        for u in e.mimeData().urls():
            p = u.toLocalFile()
            if p:
                self.open_folder(p if os.path.isdir(p) else os.path.dirname(p))
                return


def main():
    if hasattr(Qt, "HighDpiScaleFactorRoundingPolicy"):
        QGuiApplication.setHighDpiScaleFactorRoundingPolicy(Qt.HighDpiScaleFactorRoundingPolicy.PassThrough)
    app = QApplication(sys.argv)
    app.setApplicationName("Ayikla")
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
