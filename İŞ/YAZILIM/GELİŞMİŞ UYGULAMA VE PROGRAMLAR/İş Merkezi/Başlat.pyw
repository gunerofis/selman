from pathlib import Path
import sys,subprocess,time,urllib.request,json,os,ctypes
ROOT=Path(__file__).resolve().parent
URL='http://127.0.0.1:4196'
def ready():
 try:
  with urllib.request.urlopen(URL+'/health',timeout=1) as r:return json.load(r).get('service')=='is-merkezi-v3'
 except Exception:return False
if not ready():
 subprocess.Popen([sys.executable,'-X','utf8',str(ROOT/'Ekip/server.py'),'serve'],cwd=ROOT,creationflags=subprocess.CREATE_NO_WINDOW,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 for _ in range(100):
  if ready():break
  time.sleep(.1)
if ready() and '--check' not in sys.argv:
 candidates=[Path(os.environ.get(key,''))/relative for relative in ['Google/Chrome/Application/chrome.exe','Microsoft/Edge/Application/msedge.exe'] for key in ['PROGRAMFILES','PROGRAMFILES(X86)','LOCALAPPDATA'] if os.environ.get(key)]
 browser=next((p for p in candidates if p.is_file()),None)
 if browser:
  subprocess.Popen([str(browser),'--app='+URL+'/?tab=jobs','--window-size=1280,900'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 else:
  ctypes.windll.user32.MessageBoxW(None,'Uygulama penceresi için Chrome veya Edge bulunamadı.','İş Merkezi',16)
  sys.exit(1)
sys.exit(0 if ready() else 1)
