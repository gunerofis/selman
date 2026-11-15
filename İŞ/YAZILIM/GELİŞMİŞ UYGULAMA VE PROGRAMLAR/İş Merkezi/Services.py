"""Instagram planı servisleri (Güner 4194, Makro 4193). Açılışta bekleyen dış iletimleri tekrar göndermez.
Aynı port için ikinci süreç açılmaz."""
import sys, socket, importlib.util, importlib.machinery
from pathlib import Path
from http.server import ThreadingHTTPServer
root = Path(__file__).resolve().parent / 'Moduller/Instagram Profil Önizleme'
sys.path.insert(0, str(root))
name = 'guner' if sys.argv[1] == 'guner' else 'plan'
port = 4194 if name == 'guner' else 4193

class Server(ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = False
    def server_bind(self):
        if hasattr(socket, 'SO_EXCLUSIVEADDRUSE'):
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        super().server_bind()

try:
    probe = Server(('127.0.0.1', port), None)
except OSError:
    sys.exit(0)  # zaten çalışıyor
loader = importlib.machinery.SourceFileLoader('hub_' + name, str(root / (name + '.pyw')))
spec = importlib.util.spec_from_loader(loader.name, loader)
module = importlib.util.module_from_spec(spec)
loader.exec_module(module)
probe.RequestHandlerClass = module.Handler
probe.serve_forever()
