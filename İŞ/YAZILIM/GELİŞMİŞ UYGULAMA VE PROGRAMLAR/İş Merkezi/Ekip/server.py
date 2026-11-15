"""İş Merkezi tek servis: işler, iş takip kayıtları, bilgi girişi, siparişler, reklam/satış.
Yalnız bu bilgisayarda tek kullanıcı; tünel ve ekip erişimi kapalı."""
from datetime import date, datetime, timezone
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, parse_qs, quote
import app_routes
import meta_api
import control_agent
import guner_transfer
import jobs_domain
import local_files
import argparse, gzip, hashlib, hmac, json, os, re, secrets, shutil, socket, sqlite3, subprocess, sys, threading, time, urllib.request, urllib.error

ROOT = Path(__file__).resolve().parent
APP = ROOT.parent
PD = APP.parent
HOME = Path.home()
PORT = int(os.environ.get('IS_MERKEZI_PORT', '4196'))
LOCAL_ORIGIN = f'http://127.0.0.1:{PORT}'
DATA = Path(os.environ.get('IS_MERKEZI_EKIP_DATA', str(ROOT / 'Kayitlar')))
TEST = os.environ.get('IS_MERKEZI_TEST') == '1'
SERVICE = 'is-merkezi-v3'
STATES = ('Bekliyor', 'Yapılıyor', 'Tamamlandı')

WORK = APP / 'Veri'
SOURCES = {
    'work': APP / 'src' / 'data.json',
    'checks': WORK / 'records' / 'checks.json',
    'catalog': APP / 'src' / 'content' / 'dashboard' / 'information-catalog.json',
    'info': HOME / 'Desktop' / 'Güner Ofis' / '02 Web' / 'İşler ve Belgeler' / 'Sümen Takımı TR' / 'Ürün Bilgi Yanıtları.json',
    'orders': Path(os.environ.get('LOCALAPPDATA', str(HOME / 'AppData' / 'Local'))) / 'Siparisler' / 'siparisler.json',
}
if TEST:
    # Test kopyası: gerçek kontrol notlarına ve bilgi yanıtlarına yazılmaz.
    box = DATA / 'test'
    box.mkdir(parents=True, exist_ok=True)
    for key in ('checks', 'info'):
        target = box / SOURCES[key].name
        if not target.exists() and SOURCES[key].exists():
            shutil.copyfile(SOURCES[key], target)
        SOURCES[key] = target

WRITE = threading.Lock()
SYNC = threading.Lock()
last_sync = 0.0

# ---------------------------------------------------------------- yardımcılar
def stamp():
    return time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())

def iso_ms():
    return datetime.now(timezone.utc).isoformat(timespec='milliseconds').replace('+00:00', 'Z')

def read_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8-sig'))

def write_json(path, data, previous=None):
    path = Path(path)
    if previous and path.exists():
        shutil.copyfile(path, previous)
    tmp = path.with_name(path.name + '.tmp')
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    os.replace(tmp, path)

_cache = {}
def cached(key, path, build):
    """Dosya değişmedikçe hazır sonucu döndürür (ayrıştırma bir kez)."""
    try:
        st = Path(path).stat()
        sig = (st.st_mtime_ns, st.st_size)
    except FileNotFoundError:
        sig = None
    hit = _cache.get(key)
    if hit and hit[0] == sig:
        return hit[1]
    value = build()
    _cache[key] = (sig, value)
    return value

def work_data():
    return cached('work', SOURCES['work'], lambda: read_json(SOURCES['work']))

def clean(p, key, limit, minimum=0):
    v = p.get(key, '')
    if not isinstance(v, str) or not minimum <= len(v.strip()) <= limit:
        raise ValueError(key + ': uzunluk uygun değil.')
    return v.strip()

def planned(p):
    value = clean(p, 'plannedFor', 10)
    if value and date.fromisoformat(value).isoformat() != value:
        raise ValueError('Plan tarihi YYYY-AA-GG olmalı.')
    return value

class Conflict(Exception):
    pass

# ---------------------------------------------------------------- veritabanı
_schema_ready = False
_schema_lock = threading.Lock()

def connect():
    global _schema_ready
    DATA.mkdir(parents=True, exist_ok=True)
    c = sqlite3.connect(DATA / 'ekip.sqlite', timeout=15, isolation_level=None)
    c.row_factory = sqlite3.Row
    if not _schema_ready:
        with _schema_lock:
            if not _schema_ready:
                c.executescript('''
                CREATE TABLE IF NOT EXISTS jobs(id TEXT PRIMARY KEY, title TEXT, details TEXT,
                  author TEXT, workStatus TEXT, note TEXT, state TEXT, review TEXT, result TEXT,
                  revision INTEGER, createdAt TEXT, updatedAt TEXT, approvedAt TEXT);
                CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY, job TEXT, actor TEXT,
                  action TEXT, before TEXT, after TEXT, at TEXT);
                CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, role TEXT, csrf TEXT, expires REAL);
                CREATE TABLE IF NOT EXISTS failures(ip TEXT PRIMARY KEY, count INTEGER, until REAL);
                ''')
                columns = {r[1] for r in c.execute('PRAGMA table_info(jobs)')}
                if 'scopeVersion' not in columns:
                    c.execute('ALTER TABLE jobs ADD COLUMN scopeVersion INTEGER NOT NULL DEFAULT 1')
                if 'approvedScope' not in columns:
                    c.execute("ALTER TABLE jobs ADD COLUMN approvedScope TEXT NOT NULL DEFAULT ''")
                    c.execute("UPDATE jobs SET state='awaiting_approval',approvedAt='',revision=revision+1 WHERE state='approved'")
                if 'plannedFor' not in columns:
                    c.execute("ALTER TABLE jobs ADD COLUMN plannedFor TEXT NOT NULL DEFAULT ''")
                for name in ('parentId','summary','need'):
                    if name not in columns:
                        c.execute('ALTER TABLE jobs ADD COLUMN '+name+" TEXT NOT NULL DEFAULT ''")
                _schema_ready = True
    return c

def scope(row):
    return hashlib.sha256(json.dumps([row['title'], row['details'], row['review'], row['scopeVersion']], ensure_ascii=False).encode()).hexdigest()

def jobs_list():
    c = connect()
    try:
        return jobs_domain.decorate([dict(x) for x in c.execute('SELECT * FROM jobs ORDER BY createdAt DESC')])
    finally:
        c.close()

def action(kind, p, role):
    if kind == 'list':
        return jobs_list()
    c = connect()
    try:
        c.execute('BEGIN IMMEDIATE')
        try:
            result = _action(c, kind, p, role)
            c.execute('COMMIT')
            return result
        except BaseException:
            c.execute('ROLLBACK')
            raise
    finally:
        c.close()

def _action(c, kind, p, role):
    if kind == 'add' and role in ('team', 'admin'):
        ident = clean(p, 'id', 32, 32)
        if any(x not in '0123456789abcdef' for x in ident):
            raise ValueError('Geçersiz kimlik.')
        title, details = clean(p, 'title', 160, 3), clean(p, 'details', 12000)
        old = c.execute('SELECT * FROM jobs WHERE id=?', (ident,)).fetchone()
        if old:
            if old['title'] != title or old['details'] != details:
                raise ValueError('Bu kimlik başka bir işte kullanılmış.')
            return dict(old)
        author = clean(p, 'author', 80, 2)
        parent = clean(p, 'parentId', 32)
        if parent:
            owner = c.execute('SELECT * FROM jobs WHERE id=?',(parent,)).fetchone()
            if not owner or parent==ident or owner['parentId']:
                raise ValueError('Geçerli bir ana iş seçin.')
            if jobs_domain.status(dict(owner)) in ('completed','cancelled'):
                raise ValueError('Kapalı ana işe açık alt iş eklenemez.')
        c.execute('INSERT INTO jobs(id,title,details,author,workStatus,note,state,review,result,revision,createdAt,updatedAt,approvedAt,plannedFor) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                  (ident, title, details, author, 'Bekliyor', '', 'review_pending', '', '', 1, stamp(), stamp(), '', planned(p)))
        c.execute('UPDATE jobs SET parentId=?,summary=?,need=? WHERE id=?',(parent,clean(p,'summary',280),clean(p,'need',400),ident))
        if p.get('status')=='completed':
            c.execute("UPDATE jobs SET workStatus='Tamamlandı',state='completed' WHERE id=?",(ident,))
        elif p.get('status')=='needs_user':
            if not clean(p,'need',400,3):raise ValueError('Kullanıcıdan gerekeni kısa yazın.')
            c.execute("UPDATE jobs SET state='needs_input' WHERE id=?",(ident,))
        before = None
    else:
        ident = clean(p, 'id', 32, 32)
        row = c.execute('SELECT * FROM jobs WHERE id=?', (ident,)).fetchone()
        if not row:
            raise ValueError('İş bulunamadı.')
        before = dict(row)
        if type(p.get('revision')) is not int or p['revision'] != row['revision']:
            raise Conflict('İş değişti. Yenileyip tekrar deneyin; yazınız korunuyor.')
        if kind == 'update' and role in ('team', 'admin'):
            visible_status = p.get('status')
            if visible_status is not None:
                if visible_status not in jobs_domain.LABELS:raise ValueError('Geçersiz durum.')
                p=dict(p,workStatus={'active':'Yapılıyor','needs_user':'Bekliyor','completed':'Tamamlandı','cancelled':'Bekliyor'}[visible_status])
            status = clean(p, 'workStatus', 40)
            if status not in STATES:
                raise ValueError('Geçersiz durum.')
            if row['parentId'] and status!='Tamamlandı' and visible_status!='cancelled':
                parent=c.execute('SELECT * FROM jobs WHERE id=?',(row['parentId'],)).fetchone()
                if parent and jobs_domain.status(dict(parent)) in ('completed','cancelled'):
                    raise ValueError('Alt işi açmadan önce ana işi yeniden açın.')
            changes = {'workStatus': status, 'note': clean(p, 'note', 12000)}
            for key,limit in [('summary',280),('need',400)]:
                if key in p:changes[key]=clean(p,key,limit)
            if status == 'Tamamlandı':jobs_domain.guard_close(c,ident)
            if visible_status in ('completed','cancelled') and row['state'] in ('running','approved'):
                raise ValueError('Çalışan işin sonucu önce agent tarafından bildirilmelidir.')
            # Biten yerel iş yeni uygulama/onay turuna girmez.
            if status == 'Tamamlandı' and row['state'] not in ('running', 'approved', 'cancelled'):
                changes.update(state='completed', approvedAt='', approvedScope='')
            elif status != 'Tamamlandı' and row['state'] == 'completed':
                changes.update(state='review_pending', approvedAt='', approvedScope='', review='', result='')
            if visible_status=='needs_user':changes.update(state='needs_input',approvedAt='',approvedScope='')
            elif visible_status=='cancelled':changes.update(state='cancelled',approvedAt='',approvedScope='')
            elif visible_status=='active' and row['state'] in ('needs_input','rejected','cancelled'):
                changes.update(state='review_pending',approvedAt='',approvedScope='')

            if 'plannedFor' in p:
                changes['plannedFor'] = planned(p)
        elif kind == 'approve' and role == 'admin' and row['state'] == 'awaiting_approval':
            if row['workStatus'] == 'Tamamlandı':
                jobs_domain.guard_close(c,ident)
                # Bitmiş ve kanıtı GPT'ce doğrulanmış iş: kapanır, yeniden uygulanmaz.
                changes = {'state': 'completed', 'approvedAt': stamp(), 'approvedScope': ''}
            else:
                # Henüz yapılmamış iş: GPT'ye uygulama onayı.
                changes = {'state': 'approved', 'approvedAt': stamp(), 'approvedScope': scope(row)}
        elif kind == 'reject' and role == 'admin' and row['state'] in ('awaiting_approval', 'approved'):
            changes = {'state': 'rejected', 'approvedAt': '', 'approvedScope': ''}
        elif kind == 'revise' and role in ('team', 'admin') and row['state'] in ('review_pending', 'awaiting_approval', 'approved', 'needs_input', 'rejected'):
            changes = {'title': clean(p, 'title', 160, 3), 'details': clean(p, 'details', 12000),
                       'state': 'review_pending', 'review': '', 'result': '', 'approvedAt': '', 'approvedScope': '', 'scopeVersion': row['scopeVersion'] + 1}
        elif kind == 'cancel' and role in ('team', 'admin') and row['state'] in ('review_pending', 'awaiting_approval', 'approved', 'needs_input', 'rejected'):
            changes = {'state': 'cancelled', 'approvedAt': '', 'approvedScope': ''}
        elif kind == 'claim-review' and role == 'agent' and row['state'] == 'review_pending' and row['workStatus'] != 'Tamamlandı':
            changes = {'state': 'reviewing'}
        elif kind == 'review' and role == 'agent' and row['state'] == 'reviewing':
            changes = {'state': 'awaiting_approval', 'review': clean(p, 'text', 16000, 3), 'approvedAt': '', 'approvedScope': ''}
        elif kind == 'claim' and role == 'agent' and row['state'] == 'approved' and row['approvedAt'] and row['approvedScope'] == scope(row):
            changes = {'state': 'running'}
        elif kind in ('complete', 'block') and role == 'agent' and row['state'] in ('running', 'reviewing'):
            if kind == 'complete' and row['state'] != 'running':
                raise ValueError('Uygulama onayı gerekli.')
            if kind == 'complete':jobs_domain.guard_close(c,ident)
            changes = {'state': 'completed' if kind == 'complete' else 'needs_input', 'result': clean(p, 'text', 16000, 3)}
        else:
            raise PermissionError('Bu işleme yetki yok veya işin durumu uygun değil.')
        changes.update(revision=row['revision'] + 1, updatedAt=stamp())
        c.execute('UPDATE jobs SET ' + ','.join(k + '=?' for k in changes) + ' WHERE id=?', (*changes.values(), ident))
    after = dict(c.execute('SELECT * FROM jobs WHERE id=?', (ident,)).fetchone())
    c.execute('INSERT INTO events(job,actor,action,before,after,at) VALUES(?,?,?,?,?,?)',
              (ident, role, kind, json.dumps(before, ensure_ascii=False), json.dumps(after, ensure_ascii=False), stamp()))
    return after

# ---------------------------------------------------------------- iş takip verisi
TASK_FIELDS = ('taskId', 'title', 'status', 'statusLabel', 'ownerLabel', 'kindLabel', 'summary', 'links', 'productIds', 'completedAt')
PRODUCT_FIELDS = ('productId', 'title', 'currentUrl', 'urls', 'material', 'completed', 'todo', 'review', 'recordGap', 'uncertainty', 'notes')

def work_payload():
    def build():
        d = work_data()
        q = d['queries']
        return {
            'tasks': [{k: r.get(k) for k in TASK_FIELDS} for r in q['work_tasks']['rows']],
            'products': [{k: r.get(k) for k in PRODUCT_FIELDS} for r in q['work_products']['rows']],
            'updatedAt': d.get('workMeta', {}).get('updatedAt', ''),
        }
    return cached('work-payload', SOURCES['work'], build)

def reports_payload():
    def build():
        d = work_data()
        q = d['queries']
        out = {k: q[k]['rows'] for k in ('daily_totals', 'ad_spend', 'ad_conversions', 'site_products') if k in q}
        out['generatedAt'] = d.get('generatedAt', '')
        return out
    return cached('reports-payload', SOURCES['work'], build)

def checks_read():
    if not SOURCES['checks'].exists():
        return {'format': 'sumen-checks-v1', 'legacyImported': True, 'entries': {}}
    return read_json(SOURCES['checks'])

CHECK_ID = re.compile(r'^[A-Za-z0-9_-]{1,180}$')

def check_save(p):
    if set(p) != {'id', 'revision', 'check', 'note'}:
        raise ValueError('Geçersiz alan.')
    ident, check, note, revision = p['id'], p['check'], p['note'], p['revision']
    if not isinstance(ident, str) or not CHECK_ID.match(ident) or check not in ('pending', 'ok', 'issue') or not isinstance(note, str) or len(note) > 2000 or type(revision) is not int:
        raise ValueError('Geçersiz not.')
    if not any(t['taskId'] == ident for t in work_payload()['tasks']):
        raise ValueError('İş bulunamadı.')
    with WRITE:
        d = checks_read()
        current = d['entries'].get(ident) or {}
        if current.get('revision', 0) != revision:
            raise Conflict('Kayıt başka bir yerde değişti. Güncel kaydı alın.')
        entry = {'check': check, 'note': note, 'updatedAt': iso_ms(), 'revision': current.get('revision', 0) + 1}
        d['entries'][ident] = entry
        write_json(SOURCES['checks'], d, previous=str(SOURCES['checks']) + '.previous')
    return {'entry': entry}

def catalog():
    return cached('catalog', SOURCES['catalog'], lambda: read_json(SOURCES['catalog']))

def info_read():
    if not SOURCES['info'].exists():
        return {'format': 'sumen-information-v1', 'entries': {}, 'history': []}
    return read_json(SOURCES['info'])

def information_save(p):
    if set(p) != {'changes'}:
        raise ValueError('Geçersiz alan.')
    changes = p['changes']
    if not isinstance(changes, list) or not 0 < len(changes) <= 100:
        raise ValueError('Geçersiz kayıt listesi.')
    rows = {r['id']: r for r in catalog()}
    with WRITE:
        d = info_read()
        seen = set()
        for ch in changes:
            row = rows.get(ch.get('id')) if isinstance(ch, dict) else None
            values = ch.get('values') if row else None
            if not row or ch['id'] in seen or type(ch.get('revision')) is not int or not isinstance(values, dict):
                raise ValueError('Geçersiz ürün kaydı.')
            seen.add(ch['id'])
            if (d['entries'].get(ch['id']) or {}).get('revision', 0) != ch['revision']:
                raise Conflict(row['title'] + ': kayıt başka bir yerde değişti. Güncel kaydı alın.')
            if len(values) != len(row['fields']):
                raise ValueError('Eksik veya fazla alan.')
            for f in row['fields']:
                v = values.get(f['key'])
                if not isinstance(v, str) or len(v) > 4000 or (f.get('options') and v and v not in f['options']):
                    raise ValueError(row['title'] + ': geçersiz ' + f['label'])
        now = iso_ms()
        for ch in changes:
            previous = d['entries'].get(ch['id'])
            entry = {'values': ch['values'], 'revision': ch['revision'] + 1, 'updatedAt': now}
            d['entries'][ch['id']] = entry
            d.setdefault('history', []).append({'id': ch['id'], 'at': now, 'previous': previous, 'next': entry})
        d['updatedAt'] = now
        target = SOURCES['info']
        if target.exists():
            archive = target.parent / 'Arşiv'
            archive.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(target, archive / ('Ürün Bilgi Yanıtları ' + re.sub(r'[:.]', '-', now) + '.json'))
        write_json(target, d)
    return {'entries': d['entries']}

# ---------------------------------------------------------------- siparişler
def brand(source):
    if source in ('sumentakimi.com', 'sumentakimi.com.tr'):
        return 'Makro Ofis'
    if source in ('gunerofis.com', 'imalattansumen.com', 'Trendyol', 'Hepsiburada', 'n11', 'Çiçeksepeti'):
        return 'Güner Ofis'
    return ''

def orders_payload():
    def build():
        if not SOURCES['orders'].exists():
            return {'rows': [], 'updatedAt': '', 'connections': {}}
        d = read_json(SOURCES['orders'])
        rows = []
        for r in d.get('orders', []):
            b = brand(r.get('source', ''))
            if not b:
                continue
            row = {k: r.get(k) for k in ('key', 'source', 'orderNumber', 'when', 'product', 'amount', 'quantity', 'status', 'countsAsSale')}
            row.update(brand=b, channel='Web Sitesi' if '.' in (row['source'] or '') else row['source'])
            rows.append(row)
        rows.sort(key=lambda r: r.get('when') or '', reverse=True)
        return {'rows': rows, 'updatedAt': d.get('lastSyncUtc', ''), 'connections': d.get('connectionStates', {})}
    return cached('orders', SOURCES['orders'], build)

def orders_refresh():
    global last_sync
    if TEST:
        raise ValueError('Test kopyasında sipariş getirme kapalı.')
    if not SYNC.acquire(False):
        raise ValueError('Siparişler zaten getiriliyor.')
    try:
        if time.time() - last_sync < 60:
            result = dict(orders_payload())
            result['warning'] = any(c.get('state') == 'error' for c in result['connections'].values())
            return result
        last_sync = time.time()
        r = subprocess.run([str(ROOT / 'OrdersRead.exe')], capture_output=True, timeout=300, creationflags=subprocess.CREATE_NO_WINDOW)
        if r.returncode:
            raise ValueError('Siparişler getirilemedi; kayıtlı siparişler korundu.')
        result = dict(orders_payload())
        result['warning'] = r.stdout.strip() == b'partial'
        return result
    finally:
        SYNC.release()

# ---------------------------------------------------------------- Instagram (online görünüm)
IG_LOCK = threading.Lock()

def ig_local(port, path):
    with urllib.request.urlopen(f'http://127.0.0.1:{port}{path}', timeout=10) as r:
        return json.load(r)

def ig_ensure(port):
    with IG_LOCK:
        try:
            return ig_local(port, '/api/plan')
        except Exception:
            pass
        pyw = Path(sys.executable).with_name('pythonw.exe')
        subprocess.Popen([str(pyw if pyw.exists() else sys.executable), str(APP / 'Services.py'), 'guner' if port == 4194 else 'makro'],
                         creationflags=subprocess.CREATE_NO_WINDOW, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(60):
            time.sleep(.15)
            try:
                return ig_local(port, '/api/plan')
            except Exception:
                pass
        raise ValueError('Instagram servisi açılamadı.')

# ---------------------------------------------------------------- giriş
def password_hash(password, salt):
    return hashlib.scrypt(password.encode(), salt=bytes.fromhex(salt), n=16384, r=8, p=1).hex()

def setup():
    import getpass
    target = DATA / 'auth.json'
    if target.exists():
        raise ValueError('Giriş zaten kurulu. Mevcut şifre kaydı korunuyor.')
    cfg, admin_password = {}, None
    for role, label in [('admin', 'Yönetici'), ('team', 'Ekip')]:
        password = getpass.getpass(label + ' şifresi (en az 12 karakter): ')
        if len(password) < 12 or password != getpass.getpass('Tekrar: '):
            raise ValueError('Şifreler eşleşmeli ve en az 12 karakter olmalı.')
        if role == 'team' and password == admin_password:
            raise ValueError('Yönetici ve ekip şifreleri farklı olmalı.')
        admin_password = password
        salt = secrets.token_hex(16)
        cfg[role] = {'salt': salt, 'hash': password_hash(password, salt)}
    DATA.mkdir(parents=True, exist_ok=True)
    with target.open('x', encoding='utf-8') as f:
        json.dump(cfg, f)
    print('Giriş şifreleri kuruldu.')

def expected_origin():
    return LOCAL_ORIGIN

# ---------------------------------------------------------------- HTTP
LOGOS = {'amazon.ico', 'ciceksepeti.ico', 'hepsiburada.ico', 'n11.png', 'trendyol.ico'}
CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; media-src 'self' blob:; frame-src 'self'; frame-ancestors 'self'; form-action 'self'; base-uri 'none'"

class Handler(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def log_message(self, *args):
        pass

    def send(self, code, data, cookie=None, mime=None, cache=False):
        if self.command == 'POST' and 200 <= code < 300:
            action_name = self.path.removeprefix('/api/')
            if action_name in control_agent.ACTIONS:
                try: control_agent.event(*control_agent.ACTIONS[action_name])
                except OSError: pass
        if mime is None:
            body = data if isinstance(data, bytes) else json.dumps(data, ensure_ascii=False, separators=(',', ':')).encode()
            mime = 'application/json; charset=utf-8'
        else:
            body = data
        gz = len(body) > 4096 and 'gzip' in self.headers.get('Accept-Encoding', '') and not mime.startswith('image/')
        if gz:
            body = gzip.compress(body, 5)
        self.send_response(code)
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(body)))
        if gz:
            self.send_header('Content-Encoding', 'gzip')
        self.send_header('Cache-Control', 'private, max-age=3600' if cache else 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'no-referrer')
        self.send_header('Content-Security-Policy', CSP.replace("script-src 'self'", "script-src 'self' 'unsafe-inline' data:") + "; font-src 'self' data:" if urlsplit(self.path).path=='/' else CSP.replace("script-src 'self'", "script-src 'self' 'unsafe-inline'") if self.path.startswith(('/chat','/profil','/instagram/')) else CSP)
        if cookie:
            self.send_header('Set-Cookie', cookie)
        self.end_headers()
        self.wfile.write(body)

    def local_request(self):
        return (self.client_address[0] == '127.0.0.1'
                and self.headers.get('Host') == f'127.0.0.1:{PORT}'
                and not any(k.lower().startswith(('x-forwarded-', 'cf-')) or k.lower() == 'forwarded' for k in self.headers)
                and self.headers.get('Sec-Fetch-Site', '') not in ('cross-site',)
                and self.headers.get('Origin', LOCAL_ORIGIN) == LOCAL_ORIGIN)

    def local_session(self):
        current = self.session()
        if current:
            return current, None
        token, csrf = 'local-' + secrets.token_urlsafe(32), secrets.token_urlsafe(32)
        c = connect()
        try:
            c.execute('INSERT INTO sessions VALUES(?,?,?,?)', (hashlib.sha256(token.encode()).hexdigest(), 'admin', csrf, time.time() + 28800))
        finally:
            c.close()
        return {'role': 'admin', 'csrf': csrf}, 'session=' + token + '; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800'

    def session(self):
        cookie = SimpleCookie()
        try:
            cookie.load(self.headers.get('Cookie', ''))
        except Exception:
            return None
        token = cookie['session'].value if 'session' in cookie else ''
        if not token.startswith('local-'):
            return None
        c = connect()
        try:
            r = c.execute('SELECT * FROM sessions WHERE token=? AND expires>?', (hashlib.sha256(token.encode()).hexdigest(), time.time())).fetchone()
        finally:
            c.close()
        return dict(r) if r else None

    def do_GET(self):
        if not self.local_request():
            return self.send(403, {'error': 'Yalnız yerel erişim.'})
        u = urlsplit(self.path)
        path, q = u.path, parse_qs(u.query)
        if app_routes.assets(self, APP, path):
            return
        if path=='/':
            return self.send(503,{'error':'ChatGPT uygulaması derlenmeli: build.ps1'})
        if path == '/health':
            return self.send(200, {'service': SERVICE, 'pid': os.getpid()})
        if path.startswith('/logo/') and path[6:] in LOGOS:
            name = path[6:]
            return self.send(200, (APP / 'Logolar' / name).read_bytes(), mime='image/png' if name.endswith('.png') else 'image/x-icon', cache=True)
        if path == '/api/session':
            s, cookie = self.local_session()
            return self.send(200, {'role': s['role'], 'csrf': s['csrf'], 'planning': True, 'localOnly': True}, cookie)
        s = self.session()
        if not s:
            return self.send(401, {'error': 'Giriş yapın.'})
        if path.startswith('/api/guner-transfer') and s['role'] != 'admin':
            return self.send(403, {'error': 'Yönetici erişimi gerekli.'})
        try:
            if path == '/api/session':
                return self.send(200, {'role': s['role'], 'csrf': s['csrf'], 'planning': True})
            if app_routes.instagram(self, APP, path, ig_ensure):
                return
            if path == '/chat' or path == '/profil' or path.startswith('/profil-assets/'):
                return self.send(404, {'error': 'Bu bölüm kaldırıldı.'})
            if path == '/api/order-settings':
                if s['role']!='admin':raise PermissionError('Yönetici erişimi gerekli.')
                return self.send(200, app_routes.settings(APP))
            if path == '/api/system-log':
                return self.send(200, control_agent.journal())
            if path == '/api/agent-status':
                return self.send(200, dict(control_agent.status(),counts=jobs_domain.counts(jobs_list())))
            if path == '/api/jobs':
                return self.send(200, jobs_list())
            if path == '/api/guner-transfer':
                return self.send(200, guner_transfer.read(connect))
            if path == '/api/guner-transfer-document':
                return self.send(200, guner_transfer.document(guner_transfer.read(connect)).encode('utf-8'), mime='text/plain; charset=utf-8')
            if path == '/api/guner-transfer-resource':
                resources = guner_transfer.read(connect)['resources']
                index = int(q.get('index', ['-1'])[0])
                if not 0 <= index < len(resources):
                    raise ValueError('Kaynak bulunamadı.')
                resource = Path(resources[index]['path'])
                if resource.suffix.lower() != '.md' or not resource.is_file():
                    raise ValueError('Kaynak okunamadı.')
                return self.send(200, resource.read_bytes(), mime='text/plain; charset=utf-8')
            if path == '/api/work':
                return self.send(200, work_payload())
            if path == '/api/checks':
                return self.send(200, {'entries': checks_read()['entries']})
            if path == '/api/information':
                return self.send(200, {'catalog': catalog(), 'entries': info_read()['entries']})
            if path == '/api/orders':
                return self.send(200, orders_payload())
            if path == '/api/meta-status':
                return self.send(200, meta_api.status())
            if path == '/api/status':
                return self.send(200, read_json(WORK / 'operations' / 'status.json'))
            if path == '/api/reports':
                return self.send(200, reports_payload())
            if path == '/chat':
                return self.send(200, (APP / 'Moduller' / 'Sohbet Okuyucu' / 'index.html').read_bytes(), mime='text/html; charset=utf-8')
            if path in ('/api/instagram', '/instagram-image'):
                name = q.get('brand', [''])[0]
                if name not in ('guner', 'makro'):
                    return self.send(404, {'error': 'Bulunamadı.'})
                port = 4194 if name == 'guner' else 4193
                d = ig_ensure(port)
                posts = [{k: r.get(k, '') for k in ('id', 'title', 'date', 'time', 'goal', 'caption', 'story', 'link', 'alt', 'images')} for r in d['posts']]
                if path == '/api/instagram':
                    return self.send(200, {'posts': posts, 'source': d.get('source', '')})
                image = q.get('name', [''])[0]
                if image not in {n for r in posts for n in r['images']} or Path(image).name != image:
                    return self.send(404, {'error': 'Bulunamadı.'})
                with urllib.request.urlopen(f'http://127.0.0.1:{port}/media/' + quote(image), timeout=20) as r:
                    mime = r.headers.get_content_type()
                    if mime not in ('image/png', 'image/jpeg', 'image/webp'):
                        return self.send(404, {'error': 'Bulunamadı.'})
                    return self.send(200, r.read(), mime=mime, cache=True)
        except PermissionError as e:
            return self.send(403, {'error': str(e)})
        except (ValueError,KeyError) as e:
            return self.send(400, {'error': str(e)})
        except Exception:
            return self.send(503, {'error': 'Kaynak şu anda okunamadı. Yenileyin.'})
        self.send(404, {'error': 'Bulunamadı.'})

    def do_POST(self):
        if not self.local_request():
            return self.send(403, {'error': 'Yalnız yerel erişim.'})
        try:
            origin = self.headers.get('Origin', '')
            local_origin = origin == LOCAL_ORIGIN and self.headers.get('Host') == f'127.0.0.1:{PORT}'
            if (origin != expected_origin() and not local_origin) or self.headers.get('Content-Type', '').split(';')[0] != 'application/json':
                raise PermissionError('Geçersiz istek kaynağı.')
            size = int(self.headers.get('Content-Length', '0'))
            if not 0 < size <= 200000:
                raise ValueError('İstek boyutu uygun değil.')
            p = json.loads(self.rfile.read(size))
            if not isinstance(p, dict):
                raise ValueError('Geçersiz istek.')
            secure = '; Secure' if origin.startswith('https://') else ''
            if self.path == '/api/login':
                return self.send(410, {'error': 'Ekip girişi kapalı. Program yalnız yerelde çalışır.'})
            s = self.session()
            if not s:
                return self.send(401, {'error': 'Oturum bitti. Tekrar giriş yapın.'})
            if not hmac.compare_digest(self.headers.get('X-CSRF', ''), s['csrf']):
                raise PermissionError('Güvenlik doğrulaması başarısız.')
            if self.path == '/api/system-event':
                return self.send(200, control_agent.usage(p))
            if self.path == '/api/guner-transfer-save':
                target = DATA / 'test' / 'Güner taşıma.md' if TEST else None
                return self.send(200, guner_transfer.save(connect, p, s['role'], Conflict, target))
            if self.path == '/api/open-path':
                return self.send(200,local_files.open_file(p,s['role'],TEST))
            if self.path == '/api/agent-finish':
                return self.send(200, control_agent.finish(p))
            if self.path == '/api/agent-run':
                return self.send(200, control_agent.start())
            if self.path == '/api/logout':
                c = connect()
                try:
                    c.execute('DELETE FROM sessions WHERE token=?', (s['token'],))
                finally:
                    c.close()
                return self.send(200, {}, 'session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' + secure)
            if self.path == '/api/order-settings':
                if s['role']!='admin':raise PermissionError('Yönetici erişimi gerekli.')
                with WRITE:
                    result = app_routes.settings(APP, p)
                if result.get('conflict'):
                    raise Conflict('Ayar değişti. Yenileyin; girdileriniz korunuyor.')
                return self.send(200, result)
            if self.path == '/api/check-save':
                return self.send(200, check_save(p))
            if self.path == '/api/information-save':
                return self.send(200, information_save(p))
            if self.path == '/api/meta-refresh':
                return self.send(200, meta_api.refresh(p))
            if self.path == '/api/orders-refresh':
                return self.send(200, orders_refresh())
            if self.path not in ('/api/add', '/api/update', '/api/approve', '/api/reject', '/api/revise', '/api/cancel'):
                raise PermissionError('İşleme izin yok.')
            result=action(self.path[5:],p,s['role'])
            row=next((j for j in jobs_list() if j['id']==result['id']),result)
            return self.send(200,row)
        except PermissionError as e:
            self.send(403, {'error': str(e)})
        except Conflict as e:
            self.send(409, {'error': str(e), 'conflict': True})
        except (ValueError, KeyError) as e:
            self.send(400, {'error': str(e)})
        except Exception:
            self.send(500, {'error': 'Kayıt tamamlanamadı. Yazınızı koruyup tekrar deneyin.'})

    def login(self, p, secure):
        role = p.get('role')
        if role not in ('admin', 'team'):
            raise ValueError('Giriş türünü seçin.')
        c = connect()
        try:
            c.execute('BEGIN IMMEDIATE')
            f = c.execute('SELECT * FROM failures WHERE ip=?', ('login',)).fetchone()
            if f and f['count'] >= 10 and f['until'] > time.time():
                c.execute('COMMIT')
                return self.send(429, {'error': 'Çok fazla deneme. 15 dakika sonra tekrar deneyin.'})
            cfg = json.loads((DATA / 'auth.json').read_text())[role]
            password = clean(p, 'password', 256, 1)
            if not hmac.compare_digest(password_hash(password, cfg['salt']), cfg['hash']):
                count = f['count'] + 1 if f and f['until'] > time.time() else 1
                c.execute('INSERT OR REPLACE INTO failures VALUES(?,?,?)', ('login', count, time.time() + 900))
                c.execute('COMMIT')
                return self.send(401, {'error': 'Şifre yanlış.'})
            c.execute('DELETE FROM failures WHERE ip=?', ('login',))
            token, csrf = secrets.token_urlsafe(32), secrets.token_urlsafe(32)
            c.execute('DELETE FROM sessions WHERE expires<?', (time.time(),))
            c.execute('INSERT INTO sessions VALUES(?,?,?,?)', (hashlib.sha256(token.encode()).hexdigest(), role, csrf, time.time() + 28800))
            c.execute('COMMIT')
        except BaseException:
            if c.in_transaction:
                c.execute('ROLLBACK')
            raise
        finally:
            c.close()
        return self.send(200, {'role': role, 'csrf': csrf, 'planning': True}, 'session=' + token + '; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800' + secure)

class Server(ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = False  # Windows'ta aynı portu ikinci sürecin almasını engeller.

    def server_bind(self):
        if hasattr(socket, 'SO_EXCLUSIVEADDRUSE'):
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        super().server_bind()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('command', choices=['serve', 'setup', 'list', 'claim-review', 'review', 'claim', 'complete', 'block'])
    parser.add_argument('id', nargs='?')
    parser.add_argument('revision', nargs='?', type=int)
    parser.add_argument('file', nargs='?')
    a = parser.parse_args()
    if a.command == 'setup':
        return setup()
    if a.command == 'serve':
        try:
            server = Server(('127.0.0.1', PORT), Handler)
        except OSError:
            return  # Servis zaten çalışıyor.
        threading.Thread(target=lambda: (work_payload(), reports_payload(), catalog()), daemon=True).start()
        server.serve_forever()
    else:
        p = {'id': a.id, 'revision': a.revision}
        if a.file:
            p['text'] = Path(a.file).read_text(encoding='utf-8-sig')
        print(json.dumps(action(a.command, p, 'agent'), ensure_ascii=False))

if __name__ == '__main__':
    if sys.stdout:
        sys.stdout.reconfigure(encoding='utf-8')
    if sys.stderr:
        sys.stderr.reconfigure(encoding='utf-8')
    try:
        main()
    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)
