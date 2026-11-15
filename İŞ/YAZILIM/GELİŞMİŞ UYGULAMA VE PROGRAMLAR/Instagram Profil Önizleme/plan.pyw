import json, re, sys, threading, subprocess, urllib.request, webbrowser
from pathlib import Path
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, unquote
import edits
import uploads, journal, mimetypes

ROOT = Path(__file__).resolve().parent
DATA = Path.home() / 'Desktop/Güner Ofis/04 Sosyal Medya/Instagram/Makro Ofis'
PLAN = DATA / 'Paylaşım Planı 2026-10-23.md'
MEDIA = DATA / 'Görseller/2026-10-23 İlk Seri'
PORT = 4193
URL = f'http://127.0.0.1:{PORT}'

def read_plan():
    raw = PLAN.read_text(encoding='utf-8-sig')
    rows = {}
    for line in raw.splitlines():
        if re.match(r'\| [PH]\d{2} \|', line):
            code, date, time, title, goal = [s.strip() for s in line.strip('|').split('|')]
            rows[code] = dict(id=code, date=date, time=time, title=title, goal=goal)
    for match in re.finditer(r'### (P\d{2}) — ([^\n]+)\n(.*?)(?=\n### |\n## |\Z)', raw, re.S):
        code, title, body = match.groups()
        row = rows[code]
        row.update(title=title.strip(), images=re.findall(r'`([^`]+\.png)`', body),
                   caption=re.sub(r'^\s*Biçim:[^\n]*\n', '', body.split('Hikâye:')[0]).strip(),
                   story=re.search(r'Hikâye: (.*)', body).group(1),
                   link=re.search(r'Hikâye bağlantısı: (.*)', body).group(1).strip(),
                   alt=re.search(r'Alternatif metin: (.*)', body).group(1).strip())
    if 'H01' in rows:
        rows['H01'].update(images=['05 Cumhuriyet Bayramı Hikâye.png'], caption='Cumhuriyet Bayramımız kutlu olsun.', alt='29 Ekim Cumhuriyet Bayramı kutlaması', story='Cumhuriyet Bayramımız kutlu olsun.')
    for row in rows.values():
        if not row.get('images') or any(Path(n).name != n or not (MEDIA/n).is_file() for n in row['images']):
            raise ValueError(f"Görsel bulunamadı: {row['id']}")
    return dict(posts=edits.overlay(list(rows.values())), source=PLAN.name+' + kayıtlı düzenlemeler', year=2026)

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args): pass
    def local_request(self):
        return self.headers.get('Host') == f'127.0.0.1:{PORT}' and self.headers.get('Sec-Fetch-Site','none') in ('same-origin','none')
    def reply(self, status, data):
        content = json.dumps(data,ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type','application/json; charset=utf-8')
        self.send_header('Cache-Control','no-store')
        self.send_header('Content-Length',str(len(content)))
        self.end_headers(); self.wfile.write(content)
    def do_POST(self):
        if not self.local_request() or self.headers.get('Origin') != URL or self.headers.get('Content-Type') != 'application/json':
            self.reply(403,{'error':'İstek yalnız program içinden yapılabilir.'}); return
        try:
            size = int(self.headers.get('Content-Length','0'))
            if not 0 < size <= (17*1024*1024 if self.path=='/api/upload' else 48000): raise ValueError('İstek boyutu geçersiz.')
            payload = json.loads(self.rfile.read(size))
            if not isinstance(payload,dict): raise ValueError('İstek geçersiz.')
            if self.path == '/api/save': result = edits.save(payload,read_plan()['posts'])
            elif self.path == '/api/upload': result = uploads.accept(payload)
            elif self.path == '/api/retry': result = {'count':edits.retry()}
            else: self.reply(404,{'error':'Bulunamadı.'}); return
            self.reply(200,result)
        except edits.Conflict as exc: self.reply(409,{'error':str(exc)})
        except (ValueError,TypeError) as exc: self.reply(400,{'error':str(exc) or 'Alanları kontrol edin.'})
        except Exception: self.reply(500,{'error':'Kaydedilemedi. Düzenlemeler formda korundu.'})
    def do_GET(self):
        if not self.local_request(): self.send_error(403); return
        path = unquote(urlparse(self.path).path)
        try:
            if path == '/health': content, mime = b'macro-plan-v1', 'text/plain'
            elif path == '/api/plan': content, mime = json.dumps(read_plan(), ensure_ascii=False).encode(), 'application/json; charset=utf-8'
            elif path == '/api/status': content, mime = json.dumps(edits.statuses(),ensure_ascii=False).encode(), 'application/json; charset=utf-8'
            elif path == '/api/journal': content, mime = journal.export().read_bytes(), 'text/plain; charset=utf-8'
            elif path == '/editor.js': content, mime = (ROOT/'editor.js').read_bytes(), 'text/javascript; charset=utf-8'
            elif path in ('/', '/plan.html', '/index.html'):
                content, mime = (ROOT / ('index.html' if path == '/index.html' else 'plan.html')).read_bytes(), 'text/html; charset=utf-8'
            elif path.startswith('/media/'):
                name = path[7:]
                allowed = {n for p in read_plan()['posts'] for n in p['images']}
                if name not in allowed and not name.startswith('upload-'): self.send_error(404); return
                content, mime = uploads.resolve(name).read_bytes(), mimetypes.guess_type(name)[0] or 'application/octet-stream'
            else: self.send_error(404); return
            self.send_response(200)
            self.send_header('Content-Type', mime)
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers(); self.wfile.write(content)
        except Exception:
            self.send_error(500, 'Plan okunamadi')

def launch():
    edge = Path('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe')
    if edge.exists(): subprocess.Popen([str(edge), '--app='+URL, '--window-size=1280,960'])
    else: webbrowser.open(URL)

if __name__ == '__main__':
    try:
        with urllib.request.urlopen(URL+'/health', timeout=1) as response:
            running = response.read() == b'macro-plan-v1'
    except Exception: running = False
    if running:
        if '--serve' not in sys.argv: launch()
    else:
        try: server = ThreadingHTTPServer(('127.0.0.1', PORT), Handler)
        except OSError:
            import ctypes
            ctypes.windll.user32.MessageBoxW(0, '4193 bağlantı noktası başka bir programda açık.', 'Instagram Planı', 16)
            sys.exit(1)
        if '--serve' not in sys.argv: threading.Timer(.4, launch).start()
        edits.retry()
        server.serve_forever()
