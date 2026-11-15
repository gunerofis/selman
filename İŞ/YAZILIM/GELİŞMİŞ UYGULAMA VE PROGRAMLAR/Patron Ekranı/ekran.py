# Patron ekranı. Yerel pencere. İş Merkezi'ne bağlanmaz.
# Siparişi sitelerden, reklamı Meta'dan okur. Anahtarları diske yazmaz.
import json, sys, threading, time, base64, ctypes
from ctypes import wintypes
from datetime import date, datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlencode, urlsplit
from urllib.request import Request, build_opener, HTTPRedirectHandler
from xml.etree import ElementTree

HOST, PORT = "127.0.0.1", 4217
ROOT = Path(__file__).resolve().parent
PAGE = ROOT / "ekran.html"
KAYIT = Path(r"C:\Users\Guner Office\Desktop\Güner Ofis\01 Yönetim\API ve Şifreler\API ve Erişim Bilgileri.json")
AYLAR = ["", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
FIRMALAR = (("guner", "Güner Ofis"), ("makro", "Makro Ofis"))
SATIS = {"PAID", "PARTIALLY_REFUNDED", "PARTIALLY_PAID", "AUTHORIZED"}
_lock = threading.Lock()
_cache = {"at": 0, "data": None}


class Dur(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def bugun():
    return datetime.now(timezone(timedelta(hours=3))).date()


def yaz(gun):
    return f"{gun.day} {AYLAR[gun.month]}"


def yuvarla(value):
    return round(float(value) + 0.0, 2)


def ac(yol):
    return json.loads(KAYIT.read_text(encoding="utf-8-sig"))


def acici():
    return build_opener(Dur)


def govde(response):
    raw = response.read()
    return raw.decode("utf-8-sig", "replace")


def meta_anahtar(korumali):
    raw = base64.b64decode(korumali.removeprefix("dpapi:"))

    class Blob(ctypes.Structure):
        _fields_ = [("size", wintypes.DWORD), ("data", ctypes.POINTER(ctypes.c_byte))]

    buf = ctypes.create_string_buffer(raw)
    src = Blob(len(raw), ctypes.cast(buf, ctypes.POINTER(ctypes.c_byte)))
    dest = Blob()
    if not ctypes.windll.crypt32.CryptUnprotectData(ctypes.byref(src), None, None, None, None, 1, ctypes.byref(dest)):
        raise RuntimeError("açılamadı")
    try:
        return ctypes.string_at(dest.data, dest.size).decode("utf-8")
    finally:
        ctypes.windll.kernel32.LocalFree(dest.data)


def guner_siparis(kok, start, end):
    bilgi = kok.get("api", {}).get("faprika_guner", {})
    adres = bilgi.get("orders_xml_url") or ""
    parca = urlsplit(adres)
    if parca.scheme != "https" or parca.hostname != "www.gunerofis.com":
        raise RuntimeError("bağlantı yok")
    istek = Request(adres, headers={"User-Agent": "Mozilla/5.0", "Accept": "application/xml"})
    try:
        yanit = acici().open(istek, timeout=60)
    except HTTPError as hata:
        raise RuntimeError("bağlantısı kapalı" if hata.code == 404 else "okunamadı") from None
    with yanit:
        if yanit.status != 200:
            raise RuntimeError("okunamadı")
        metin = govde(yanit)
    if "<!DOCTYPE" in metin[:200].upper():
        raise RuntimeError("yanıt bozuk")
    try:
        kok_xml = ElementTree.fromstring(metin)
    except ElementTree.ParseError as hata:
        raise RuntimeError("yanıt bozuk") from hata
    if kok_xml.tag != "Orders":
        raise RuntimeError("yanıt bozuk")
    rows = []
    for order in kok_xml.findall("Order"):
        when = order.get("CreatedOnDate") or ""
        try:
            day = date.fromisoformat(when[:10])
        except ValueError:
            parcalar = when.split(".")
            if len(parcalar) != 3:
                raise RuntimeError("tarih okunamadı")
            day = date(int(parcalar[2]), int(parcalar[1]), int(parcalar[0]))
        if day < start or day > end:
            continue
        durum = (order.get("OrderStatus") or "").replace("İ", "i").replace("I", "ı").lower()
        odeme = order.get("PaymentStatus") or ""
        odeme_kucuk = odeme.replace("İ", "i").replace("I", "ı").lower()
        if "iptal" in durum or "iade" in odeme_kucuk or odeme != "Ödeme Tamamlandı":
            continue
        rows.append({"date": day, "amount": yuvarla(order.get("OrderTotal") or 0)})
    return rows


def shopify_jeton(bilgi):
    dukkan = bilgi.get("SHOPIFY_SHOP") or ""
    if "." not in dukkan:
        dukkan += ".myshopify.com"
    veri = urlencode({
        "grant_type": "client_credentials",
        "client_id": bilgi.get("SHOPIFY_API_KEY") or "",
        "client_secret": bilgi.get("SHOPIFY_API_SECRET") or "",
    }).encode()
    istek = Request(
        f"https://{dukkan}/admin/oauth/access_token",
        data=veri,
        headers={"Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json"},
        method="POST",
    )
    with acici().open(istek, timeout=30) as yanit:
        token = json.loads(govde(yanit)).get("access_token") or ""
    if not token:
        raise RuntimeError("anahtar yok")
    return dukkan, token


def makro_siparis(kok, start, end):
    bilgi = kok.get("shopify_apps", {}).get("sumentakimi_com_tr", {})
    dukkan, token = shopify_jeton(bilgi)
    sorgu = """query($after:String,$filter:String!){orders(first:80,after:$after,sortKey:CREATED_AT,query:$filter){pageInfo{hasNextPage endCursor} nodes{createdAt cancelledAt test displayFinancialStatus currentTotalPriceSet{shopMoney{amount currencyCode}}}}}"""
    filtre = f"created_at:>='{start.isoformat()}T00:00:00+03:00' created_at:<'{(end + timedelta(days=1)).isoformat()}T00:00:00+03:00'"
    rows, cursor, gorulen = [], None, set()
    for _ in range(30):
        govde_istek = json.dumps({"query": sorgu, "variables": {"after": cursor, "filter": filtre}}).encode()
        istek = Request(
            f"https://{dukkan}/admin/api/2026-07/graphql.json",
            data=govde_istek,
            headers={"Content-Type": "application/json", "Accept": "application/json", "X-Shopify-Access-Token": token},
            method="POST",
        )
        with acici().open(istek, timeout=40) as yanit:
            gelen = json.loads(govde(yanit))
        if gelen.get("errors"):
            raise RuntimeError("yetki yok")
        orders = (gelen.get("data") or {}).get("orders") or {}
        for node in orders.get("nodes") or []:
            if node.get("test"):
                continue
            when = (node.get("createdAt") or "")[:10]
            day = date.fromisoformat(when)
            para = ((node.get("currentTotalPriceSet") or {}).get("shopMoney") or {})
            if para.get("currencyCode") not in (None, "", "TRY"):
                continue
            if node.get("cancelledAt") or node.get("displayFinancialStatus") not in SATIS:
                continue
            rows.append({"date": day, "amount": yuvarla(para.get("amount") or 0)})
        info = orders.get("pageInfo") or {}
        if not info.get("hasNextPage"):
            return rows
        cursor = info.get("endCursor")
        if not cursor or cursor in gorulen:
            raise RuntimeError("liste yarım")
        gorulen.add(cursor)
    raise RuntimeError("liste yarım")


def meta_reklam(kok, start, end):
    bilgi = kok.get("api", {}).get("meta_read", {})
    token = meta_anahtar(bilgi.get("access_token_protected") or "")
    surum = bilgi.get("graph_version") or ""
    sonuc = {}
    for hesap in bilgi.get("accounts") or []:
        marka = hesap.get("brand")
        kimlik = hesap.get("ad_account_id")
        if marka not in ("Güner Ofis", "Makro Ofis") or not kimlik:
            continue
        parametre = urlencode({
            "level": "account",
            "fields": "spend,date_start",
            "time_increment": 1,
            "limit": 100,
            "time_range": json.dumps({"since": start.isoformat(), "until": end.isoformat()}),
        })
        istek = Request(
            f"https://graph.facebook.com/{surum}/{kimlik}/insights?{parametre}",
            headers={"Authorization": "Bearer " + token, "Accept": "application/json"},
            method="GET",
        )
        with acici().open(istek, timeout=40) as yanit:
            gelen = json.loads(govde(yanit))
        if gelen.get("error"):
            raise RuntimeError("yanıt yok")
        rows = []
        for row in gelen.get("data") or []:
            rows.append({"date": date.fromisoformat(row["date_start"]), "spend": yuvarla(row.get("spend") or 0)})
        sonuc[marka] = rows
    if len(sonuc) < 2:
        raise RuntimeError("firma eksik")
    return sonuc


def kaynak(fn, *args):
    try:
        return fn(*args), ""
    except RuntimeError as hata:
        mesaj = str(hata)
        if mesaj not in ("bağlantısı kapalı", "okunamadı", "yetki yok", "liste yarım", "anahtar yok", "bağlantı yok", "yanıt yok", "yanıt bozuk", "tarih okunamadı", "firma eksik", "açılamadı"):
            mesaj = "okunamadı"
        return None, mesaj
    except (HTTPError, URLError, ValueError, OSError, KeyError):
        return None, "okunamadı"


def cek():
    today = bugun()
    start = today.replace(day=1)
    try:
        kok = ac(KAYIT)
    except (OSError, ValueError):
        bos = {"siparis": None, "reklam": None, "uyari": "Kayıt okunamadı."}
        return {key: dict(bos) for key, _ in FIRMALAR}
    guner, guner_hata = kaynak(guner_siparis, kok, start, today)
    makro, makro_hata = kaynak(makro_siparis, kok, start, today)
    reklam, reklam_hata = kaynak(meta_reklam, kok, start, today)
    reklam = reklam or {}
    return {
        "guner": {"siparis": guner, "reklam": None if reklam_hata else reklam.get("Güner Ofis", []), "uyari": " ".join(x for x in (guner_hata and "Sipariş " + guner_hata, reklam_hata and "Reklam " + reklam_hata) if x)},
        "makro": {"siparis": makro, "reklam": None if reklam_hata else reklam.get("Makro Ofis", []), "uyari": " ".join(x for x in (makro_hata and "Sipariş " + makro_hata, reklam_hata and "Reklam " + reklam_hata) if x)},
    }


def canli():
    with _lock:
        if _cache["data"] is not None and time.time() - _cache["at"] < 120:
            return _cache["data"]
        data = cek()
        _cache.update(at=time.time(), data=data)
        return data


def aralik(rows, start, end, key):
    if rows is None:
        return None
    hit = [row for row in rows if start <= row["date"] <= end]
    if key == "amount":
        return yuvarla(sum(row["amount"] for row in hit)), len(hit)
    return yuvarla(sum(row["spend"] for row in hit))


def ozet(donem):
    today = bugun()
    if donem == "buay":
        start, end = today.replace(day=1), today
        title = yaz(today) if start == end else f"{start.day}–{end.day} {AYLAR[end.month]}"
    else:
        donem, start, end, title = "bugun", today, today, yaz(today)
    data = canli()
    firms = []
    for key, name in FIRMALAR:
        row = data[key]
        sales = aralik(row["siparis"], start, end, "amount")
        ads = aralik(row["reklam"], start, end, "spend")
        firms.append({
            "ad": name,
            "satis": None if sales is None else sales[0],
            "siparis": None if sales is None else sales[1],
            "reklam": ads,
            "reklamNot": "" if ads is None else "Meta. Google bağlı değil.",
            "uyari": row["uyari"],
        })
    return {
        "donem": donem,
        "baslik": title,
        "bos": False,
        "not": "İptal ve iade satışa girmez.",
        "firmalar": firms,
    }


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        return

    def send_json(self, code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.client_address[0] not in ("127.0.0.1", "::1"):
            return self.send_json(403, {"error": "Yalnız yerel erişim."})
        path, query = urlsplit(self.path).path, parse_qs(urlsplit(self.path).query)
        if path == "/health":
            return self.send_json(200, {"service": "patron-ekran"})
        if path == "/api/ozet":
            period = (query.get("donem") or ["bugun"])[0]
            if period not in ("bugun", "buay"):
                period = "bugun"
            return self.send_json(200, ozet(period))
        if path != "/":
            return self.send_json(404, {"error": "Yok."})
        body = PAGE.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)


def main():
    if "--denet" in sys.argv:
        print(json.dumps({key: ozet(key) for key in ("bugun", "buay")}, ensure_ascii=False, indent=2))
        return
    ThreadingHTTPServer.allow_reuse_address = True
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()


if __name__ == "__main__":
    main()
