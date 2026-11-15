import guner_context as context
import importlib.util, importlib.machinery, json, sys, urllib.request, threading, subprocess, webbrowser, html
from pathlib import Path
from urllib.parse import urlparse
from http.server import ThreadingHTTPServer
ROOT=Path(__file__).resolve().parent
loader=importlib.machinery.SourceFileLoader('guner_base',str(ROOT/'plan.pyw'))
spec=importlib.util.spec_from_loader(loader.name,loader)
base=importlib.util.module_from_spec(spec);loader.exec_module(base)
base.DATA=context.DATA
base.MEDIA=base.DATA/'Görseller/2026-10-23 İlk Seri'
base.PLAN=base.DATA/'Paylaşım Planı 2026-10-23.md'
base.PORT=4194;base.URL='http://127.0.0.1:4194'
def read_plan():
    posts=json.loads((base.DATA/'Plan Verisi.json').read_text(encoding='utf-8'))
    return dict(posts=base.edits.overlay(posts),source='Güner Ofis planı + kayıtlı düzenlemeler',year=2026)
base.read_plan=read_plan
class Handler(base.Handler):
    def do_GET(self):
        if not self.local_request(): self.send_error(403);return
        path=urlparse(self.path).path
        if path in ('/','/plan.html','/index.html'):
            content=(ROOT/'guner.html').read_bytes();mime='text/html; charset=utf-8'
        elif path=='/guner-editor.js':
            content=(ROOT/'guner-editor.js').read_bytes();mime='text/javascript; charset=utf-8'
        elif path=='/takvim':
            content=('<!doctype html><meta charset="utf-8"><title>Güner Ofis Yayın Planı</title><style>body{max-width:1100px;margin:40px auto;padding:20px;font:16px/1.6 Segoe UI}pre{white-space:pre-wrap;font:inherit}</style><a href="/">← Paylaşımlar</a><pre>'+html.escape(base.PLAN.read_text(encoding='utf-8'))+'</pre>').encode();mime='text/html; charset=utf-8'
        elif path=='/health': content=b'guner-plan-v1';mime='text/plain'
        else: return super().do_GET()
        self.send_response(200);self.send_header('Content-Type',mime);self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(content)));self.end_headers();self.wfile.write(content)
def launch():
    webbrowser.open(base.URL)
if __name__=='__main__':
    try:
        with urllib.request.urlopen(base.URL+'/health',timeout=1) as r: running=r.read()==b'guner-plan-v1'
    except Exception: running=False
    if running:
        if '--serve' not in sys.argv: launch()
    else:
        server=ThreadingHTTPServer(('127.0.0.1',4194),Handler)
        if '--serve' not in sys.argv: threading.Timer(.4,launch).start()
        base.edits.retry();server.serve_forever()
