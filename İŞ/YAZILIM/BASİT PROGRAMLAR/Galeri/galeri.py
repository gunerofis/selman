import ctypes
import hashlib
import io
import json
import os
from pathlib import Path
import secrets
import subprocess
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlsplit

from PIL import Image, ImageOps
from pillow_heif import register_heif_opener
from send2trash.win.modern import send2trash

register_heif_opener()
BASE = Path(__file__).resolve().parent
STATE = BASE / '.state'
STATE.mkdir(exist_ok=True)
CACHE = STATE / 'thumbs'
CACHE.mkdir(exist_ok=True)
FAVORITES_FILE = STATE / 'favorites.json'
try:
    FAVORITES = set(json.loads(FAVORITES_FILE.read_text(encoding='utf-8')))
except (OSError, ValueError):
    FAVORITES = set()
EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tif', '.tiff', '.heic', '.heif', '.avif', '.ico'}
SKIP = {'windows', 'program files', 'program files (x86)', 'programdata', 'appdata', '$recycle.bin', 'system volume information', '.git', 'node_modules', '.cache', '.codex', '.state', '__pycache__', '$windows.~bt', '$windows.~ws', 'recovery', 'config.msi', 'msocache', 'gallery-fixtures'}
TOKEN = secrets.token_urlsafe(32)
LOCK = threading.RLock()
OP_LOCK = threading.Lock()
ITEMS = {}
PATHS = set()
SCANNING = True
SCAN_ERRORS = 0
REV = 0
LAST_SEEN = time.monotonic()
ROOTS = []


def fixed_drives():
    return [f'{chr(c)}:\\' for c in range(65, 91) if ctypes.windll.kernel32.GetDriveTypeW(f'{chr(c)}:\\') == 3]


def scan(roots):
    global SCANNING, SCAN_ERRORS, REV
    def failed(_):
        global SCAN_ERRORS
        SCAN_ERRORS += 1
    try:
        for root in roots:
            for parent, dirs, files in os.walk(root, topdown=True, onerror=failed, followlinks=False):
                kept = []
                for d in dirs:
                    try:
                        if d.casefold() not in SKIP and not (getattr((Path(parent) / d).lstat(), 'st_file_attributes', 0) & 0x400):
                            kept.append(d)
                    except OSError:
                        failed(None)
                dirs[:] = kept
                for name in files:
                    p = Path(parent) / name
                    if p.suffix.lower() not in EXTENSIONS:
                        continue
                    try:
                        stat = p.stat()
                        if not p.is_file() or p.is_symlink():
                            continue
                        key = str(p).casefold()
                        with LOCK:
                            if key in PATHS:
                                continue
                            ident = secrets.token_hex(10)
                            ITEMS[ident] = {'id': ident, 'path': str(p), 'name': p.stem, 'ext': p.suffix.lower(), 'folder': str(p.parent), 'size': stat.st_size, 'mtime': stat.st_mtime, 'version': 0}
                            PATHS.add(key)
                            REV += 1
                    except OSError:
                        failed(None)
    except OSError:
        failed(None)
    finally:
        SCANNING = False


def filtered(params):
    query = params.get('q', [''])[0].casefold().strip()
    ext = params.get('ext', [''])[0]
    folder = params.get('folder', [''])[0].casefold()
    order = params.get('sort', ['new'])[0]
    favorites_only = params.get('favorite', [''])[0] == '1'
    with LOCK:
        result = [dict(i, favorite=i['path'].casefold() in FAVORITES) for i in ITEMS.values() if (not query or query in i['name'].casefold()) and (not ext or i['ext'] == ext) and (not folder or folder in i['folder'].casefold()) and (not favorites_only or i['path'].casefold() in FAVORITES)]
    if order == 'name':
        result.sort(key=lambda i: (i['name'].casefold(), i['path'].casefold()))
    elif order == 'size':
        result.sort(key=lambda i: i['size'], reverse=True)
    elif order == 'old':
        result.sort(key=lambda i: i['mtime'])
    else:
        result.sort(key=lambda i: i['mtime'], reverse=True)
    return result


def valid_name(name):
    name = str(name).strip()
    if not name or name in {'.', '..'} or len(name) > 180 or any(c in '<>:"/\\|?*' or ord(c) < 32 for c in name) or name.endswith(('.', ' ')):
        raise ValueError('Geçerli bir dosya adı yazın. / \\ : * ? gibi karakterler kullanılamaz.')
    if name.split('.')[0].upper() in {'CON', 'PRN', 'AUX', 'NUL', *[f'COM{i}' for i in range(1, 10)], *[f'LPT{i}' for i in range(1, 10)]}:
        raise ValueError('Bu ad Windows tarafından ayrılmıştır.')
    return name


def save_favorites():
    temp = FAVORITES_FILE.with_suffix('.tmp')
    temp.write_text(json.dumps(sorted(FAVORITES), ensure_ascii=False), encoding='utf-8')
    os.replace(temp, FAVORITES_FILE)


def close_gallery_windows():
    import pythoncom
    import win32com.client
    import win32gui
    import win32process
    pythoncom.CoInitialize()
    try:
        marker = f'--user-data-dir={STATE / "browser"}'.casefold()
        processes = win32com.client.GetObject('winmgmts:').ExecQuery("SELECT ProcessId, CommandLine FROM Win32_Process WHERE Name='msedge.exe'")
        owned = {int(p.ProcessId) for p in processes if marker in str(p.CommandLine or '').replace('"', '').casefold()}
        processes = None
        windows = []
        def visit(hwnd, _):
            if win32gui.IsWindowVisible(hwnd) and win32process.GetWindowThreadProcessId(hwnd)[1] in owned:
                windows.append(hwnd)
        win32gui.EnumWindows(visit, None)
        for hwnd in windows:
            win32gui.PostMessage(hwnd, 0x10, 0, 0)  # WM_CLOSE: only this gallery's browser profile.
        return bool(windows)
    finally:
        pythoncom.CoUninitialize()


def rename_item(ident, name):
    global REV
    name = valid_name(name)
    with LOCK:
        item = ITEMS[ident]
        old = Path(item['path'])
        new = old.with_name(name + old.suffix)
        if new == old:
            return dict(item)
        if new.exists() and str(new).casefold() != str(old).casefold():
            raise ValueError('Bu klasörde aynı adlı bir dosya zaten var.')
        old.rename(new)
        if str(old).casefold() in FAVORITES:
            FAVORITES.discard(str(old).casefold())
            FAVORITES.add(str(new).casefold())
            save_favorites()
        PATHS.discard(str(old).casefold())
        PATHS.add(str(new).casefold())
        item.update(path=str(new), name=name, version=item['version'] + 1)
        REV += 1
        return dict(item, favorite=str(new).casefold() in FAVORITES)


def recycle_item(ident):
    global REV
    with LOCK:
        item = ITEMS[ident]
        p = Path(item['path'])
        if not p.is_file():
            raise ValueError('Dosya yerinde bulunamadı. Listeyi yenileyin.')
        # Modern IFileOperation uses RECYCLEONDELETE; no permanent-delete fallback.
        send2trash(str(p))
        if p.exists():
            raise OSError('Dosya çöp kutusuna taşınamadı.')
        del ITEMS[ident]
        PATHS.discard(str(p).casefold())
        if str(p).casefold() in FAVORITES:
            FAVORITES.discard(str(p).casefold())
            save_favorites()
        REV += 1


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def output(self, data, mime='application/json', status=200):
        if not isinstance(data, bytes):
            data = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(data)))
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Cache-Control', 'no-store' if mime == 'application/json' else 'private, max-age=3600')
        self.end_headers()
        try:
            self.wfile.write(data)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass

    def authorized(self, params):
        return secrets.compare_digest(params.get('token', [''])[0], TOKEN)

    def do_GET(self):
        global LAST_SEEN
        url = urlsplit(self.path)
        params = parse_qs(url.query)
        if not self.authorized(params):
            return self.output({'error': 'Erişim reddedildi.'}, status=403)
        try:
            if url.path == '/':
                return self.output((BASE / 'index.html').read_bytes(), 'text/html; charset=utf-8')
            if url.path == '/api/list':
                LAST_SEEN = time.monotonic()
                result = filtered(params)
                offset = max(0, int(params.get('offset', ['0'])[0]))
                with LOCK:
                    types = sorted({i['ext'] for i in ITEMS.values()})
                    total = len(ITEMS)
                return self.output({'items': result[offset:offset+120], 'count': len(result), 'total': total, 'types': types, 'scanning': SCANNING, 'skipped': SCAN_ERRORS, 'revision': REV})
            if url.path == '/api/select':
                return self.output({'ids': [i['id'] for i in filtered(params)]})
            if url.path == '/api/ping':
                LAST_SEEN = time.monotonic()
                return self.output({'revision': REV, 'scanning': SCANNING})
            if url.path in {'/thumb', '/image'}:
                with LOCK:
                    item = dict(ITEMS[params['id'][0]])
                p = Path(item['path'])
                edge = 1800 if url.path == '/image' else 560
                cachekey = hashlib.sha256(f'{p}|{p.stat().st_mtime_ns}|{edge}'.encode()).hexdigest()
                cached = CACHE / (cachekey + '.jpg')
                if cached.exists():
                    return self.output(cached.read_bytes(), 'image/jpeg')
                with Image.open(p) as im:
                    im.draft('RGB', (edge, edge))
                    im = ImageOps.exif_transpose(im)
                    im.thumbnail((edge, edge))
                    if im.mode in {'RGBA', 'LA'} or 'transparency' in im.info:
                        bg = Image.new('RGB', im.size, 'white')
                        rgba = im.convert('RGBA')
                        bg.paste(rgba, mask=rgba.getchannel('A'))
                        im = bg
                    else:
                        im = im.convert('RGB')
                    buf = io.BytesIO()
                    im.save(buf, format='JPEG', quality=88)
                    data = buf.getvalue()
                temp = CACHE / (cachekey + '.' + secrets.token_hex(4) + '.tmp')
                temp.write_bytes(data)
                os.replace(temp, cached)
                return self.output(data, 'image/jpeg')
            self.output({'error': 'Bulunamadı.'}, status=404)
        except (KeyError, FileNotFoundError):
            self.output({'error': 'Dosya bulunamadı.'}, status=404)
        except Exception as e:
            self.output({'error': str(e)}, status=400)

    def do_POST(self):
        url = urlsplit(self.path)
        if not self.authorized(parse_qs(url.query)):
            return self.output({'error': 'Erişim reddedildi.'}, status=403)
        # Disallow cross-site writes even when a token is present.
        if self.headers.get('Origin') not in {None, f'http://127.0.0.1:{self.server.server_port}'}:
            return self.output({'error': 'Erişim reddedildi.'}, status=403)
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if length > 2_000_000:
                raise ValueError('Çok fazla dosya seçildi.')
            data = json.loads(self.rfile.read(length))
            with OP_LOCK:
                if url.path == '/api/close':
                    if not close_gallery_windows():
                        raise ValueError('Galeri penceresi bulunamadı.')
                    return self.output({'ok': True})
                if url.path == '/api/favorite':
                    with LOCK:
                        item = ITEMS[data['id']]
                        key = item['path'].casefold()
                        enabled = bool(data['favorite'])
                        was_favorite = key in FAVORITES
                        FAVORITES.add(key) if enabled else FAVORITES.discard(key)
                        try:
                            save_favorites()
                        except OSError:
                            FAVORITES.add(key) if was_favorite else FAVORITES.discard(key)
                            raise
                        return self.output({'id': item['id'], 'favorite': enabled})
                if url.path == '/api/rescan':
                    global SCANNING, SCAN_ERRORS, REV
                    if not SCANNING:
                        SCANNING = True
                        SCAN_ERRORS = 0
                        with LOCK:
                            missing = [ident for ident, item in ITEMS.items() if not Path(item['path']).is_file()]
                            for ident in missing:
                                PATHS.discard(ITEMS[ident]['path'].casefold())
                                del ITEMS[ident]
                            REV += 1
                        threading.Thread(target=scan, args=(ROOTS,), daemon=True).start()
                    return self.output({'ok': True})
                if url.path == '/api/rename':
                    return self.output({'item': rename_item(data['id'], data['name'])})
                if url.path in {'/api/recycle', '/api/batch-rename'}:
                    ids = list(dict.fromkeys(data['ids']))
                    results, errors = [], []
                    for n, ident in enumerate(ids, 1):
                        try:
                            if url.path == '/api/recycle':
                                recycle_item(ident)
                            else:
                                rename_item(ident, f"{valid_name(data['prefix'])} {n:03}")
                            results.append(ident)
                        except Exception as e:
                            with LOCK:
                                label = ITEMS.get(ident, {}).get('name', ident)
                            errors.append({'id': ident, 'name': label, 'error': str(e)})
                    return self.output({'done': results, 'errors': errors})
                if url.path == '/api/reveal':
                    with LOCK:
                        p = ITEMS[data['id']]['path']
                    subprocess.Popen(['explorer.exe', '/select,', p])
                    return self.output({'ok': True})
            self.output({'error': 'Bulunamadı.'}, status=404)
        except Exception as e:
            self.output({'error': str(e)}, status=400)


def open_window(url):
    browsers = [Path(os.environ.get('PROGRAMFILES(X86)', '')) / 'Microsoft/Edge/Application/msedge.exe', Path(os.environ.get('PROGRAMFILES', '')) / 'Microsoft/Edge/Application/msedge.exe']
    browser = next((p for p in browsers if p.exists()), None)
    if browser:
        versioned_url = url + '&ui=' + str((BASE / 'index.html').stat().st_mtime_ns)
        subprocess.Popen([str(browser), f'--app={versioned_url}', '--start-fullscreen', '--allow-scripts-to-close-windows', '--no-first-run', '--disable-session-crashed-bubble', f'--user-data-dir={STATE / "browser"}'])
    else:
        import webbrowser
        webbrowser.open(url)


def main():
    global ROOTS
    # Reuse an existing running gallery when the launcher is double-clicked again.
    runtime = STATE / 'runtime.json'
    if '--serve-only' not in sys.argv:
        try:
            import urllib.request
            info = json.loads(runtime.read_text())
            urllib.request.urlopen(info['url'].replace('/?', '/api/ping?'), timeout=2).read()
            open_window(info['url'])
            return
        except Exception:
            pass
    server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    server.daemon_threads = True
    url = f'http://127.0.0.1:{server.server_port}/?token={TOKEN}'
    runtime.write_text(json.dumps({'url': url, 'pid': os.getpid()}))
    roots = [str(Path(sys.argv[sys.argv.index('--root')+1]).resolve())] if '--root' in sys.argv else fixed_drives()
    ROOTS = roots
    threading.Thread(target=scan, args=(roots,), daemon=True).start()
    if '--serve-only' not in sys.argv:
        open_window(url)
    def watchdog():
        while True:
            time.sleep(15)
            if not SCANNING and time.monotonic() - LAST_SEEN > 180:
                server.shutdown()
                return
    threading.Thread(target=watchdog, daemon=True).start()
    server.serve_forever()


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        ctypes.windll.user32.MessageBoxW(0, str(e), 'Galeri açılamadı', 0x10)
