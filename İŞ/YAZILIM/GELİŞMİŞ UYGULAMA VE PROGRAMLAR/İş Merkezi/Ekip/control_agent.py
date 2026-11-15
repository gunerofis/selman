"""Olay tabanlı günlük ve tek kalıcı Codex kontrol sohbeti."""
from pathlib import Path
from datetime import datetime,timezone
from collections import Counter,deque
import uuid,json,os,subprocess,threading,time,msvcrt,sys
APP=Path(__file__).resolve().parent.parent
DATA=Path(os.environ.get('IS_MERKEZI_EKIP_DATA',str(APP/'Ekip/Kayitlar')))
THREAD='01a178b8-ecf8-73a0-997b-b9337c36f7ce'
MODEL='gpt-6.1-sol'
LOCK=threading.Lock()
AREAS={'settings':'Ayarlar','guner-transfer':'Güner taşıma','jobs':'İşler','products':'Ürünler','information':'Bilgi Girişi','orders':'Siparişler','instagram':'Instagram','dashboard':'Reklam ve Satış','rules':'Kurallar','agent':'GPT Kontrol'}
ACTIONS={'add':('jobs','İş eklendi'),'update':('jobs','İş güncellendi'),'approve':('jobs','Onay verildi'),'reject':('jobs','Reddedildi'),'revise':('jobs','Revize edildi'),'cancel':('jobs','İptal edildi'),'information-save':('information','Bilgi kaydedildi'),'check-save':('products','Kontrol kaydedildi'),'order-settings':('orders','Ayar kaydedildi'),'orders-refresh':('orders','Sipariş yenilendi'),'meta-refresh':('dashboard','Meta yenilendi')}
def now():return datetime.now(timezone.utc).isoformat(timespec='seconds')
def event(area,action):
 if area not in AREAS:raise ValueError('Alan bulunamadı.')
 DATA.mkdir(parents=True,exist_ok=True)
 with LOCK:
  with (DATA/'Sistem Günlüğü.jsonl').open('a',encoding='utf-8') as f:f.write(json.dumps({'id':time.time_ns(),'at':now(),'area':AREAS[area],'action':action},ensure_ascii=False)+'\n')
 return {'ok':True}
def usage(p):
 if p.get('action')!='alan-açıldı':raise ValueError('İşlem bulunamadı.')
 return event(p.get('area'),'Alan açıldı')
def journal():
 path=DATA/'Sistem Günlüğü.jsonl';rows=deque(maxlen=300);counts=Counter();total=0
 if path.exists():
  with path.open(encoding='utf-8') as f:
   for line in f:
    try:r=json.loads(line)
    except ValueError:continue
    rows.append(r);counts[r['area']]+=1;total+=1
 return {'events':list(reversed(rows)),'counts':dict(counts),'total':total}
def lockfile():
 DATA.mkdir(parents=True,exist_ok=True)
 f=(DATA/'agent.lock').open('a+b');f.seek(0)
 try:msvcrt.locking(f.fileno(),msvcrt.LK_NBLCK,1)
 except OSError:f.close();return None
 return f
def store(state):
 target=DATA/'agent-status.json';temp=target.with_suffix('.tmp');temp.write_text(json.dumps(state,ensure_ascii=False),encoding='utf-8');os.replace(temp,target)
def status():
 try:s=json.loads((DATA/'agent-status.json').read_text(encoding='utf-8'))
 except (OSError,ValueError):s={'running':False,'message':'Kontrole hazır.'}
 if s.get('running') and time.time()-s.get('startedEpoch',0)>3600:
  s.update(running=False,message='Kontrol sonucu alınamadı. Codex sohbetini kontrol edin.')
 return dict(s,threadId=THREAD,model=MODEL,effort='medium')
def executable():
 path=Path.home()/'AppData/Roaming/npm/node_modules/@openai/codex/node_modules/@openai/codex-win32-x64/vendor/x86_64-pc-windows-msvc/bin/codex.exe'
 if not path.is_file():raise ValueError('Codex çalıştırıcısı bulunamadı.')
 return path
def start():
 executable()
 with LOCK:
  s=status()
  if s.get('running'):return s
  handle=lockfile()
  if not handle:return dict(s,running=True,message='Kontrol zaten çalışıyor.')
  handle.close()
  s={'runId':uuid.uuid4().hex,'running':True,'startedAt':now(),'startedEpoch':time.time(),'message':'Açık işler ve değişiklikler kontrol ediliyor.'};store(s)
  python=Path(sys.executable).with_name('python.exe')
  try:subprocess.Popen([str(python),str(Path(__file__)),'run'],cwd=APP,stdin=subprocess.DEVNULL,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=subprocess.CREATE_NO_WINDOW)
  except Exception:s.update(running=False,message='Kontrol başlatılamadı.');store(s);raise ValueError(s['message'])
 return status()
def run():
 handle=lockfile()
 if not handle:return
 s=status();event('agent','Kontrol başladı')
 prompt='İş Merkezi kontrol düğmesine basıldı. Önce Desktop AGENTS.md, HARİTA.md, program Kurallar.md ve C:/Users/Guner Office/.codex/skills/is-merkezi/SKILL.md oku. Bu istek salt okunur program kontrolüdür; kaynak dosyalarını veya gerçek iş kararlarını değiştirme. /api/session oturumundan sonra /api/jobs, /api/agent-status ve /api/system-log oku. İş listesi ve sayaçlarda yalnız parentId boş ana işleri ve API status alanını kullan; active ve needs_user devam eden, completed biten, cancelled iptal. Güncel sayılar agent-status.counts ile aynı olmalıdır. Alt işler ana görevin altında kalır; biten işleri yeniden uygulama. Geçmiş notları yeni görev, eski sayıları bugünün sonucu sayma. Yeni agent veya otomasyon oluşturma. Dış hesap, yayın, müşteri veya ödeme işlemi yapma. Agent Notları.md içinde yalnız tarih, kısa sonuç ve varsa somut engeli güncelle. Kullanıcıdan gerekeni tek anlaşılır cümleyle yaz. Sonucu en kısa biçimde bildir.'

 try:
  prompt+=' Bu kontrol kimliği: '+s['runId']+'. İşin sonunda (başarı veya engel) yerel /api/session ile oturum al, aynı çerez ve X-CSRF, Origin başlıklarıyla POST http://127.0.0.1:4196/api/agent-finish gönder: {"runId":"'+s['runId']+'","success":true veya false,"result":"kısa sonuç ve varsa engel"}. Sonuç bildirimini mutlaka yap; bu yalnız programdaki çalışma göstergesini kapatır. Ana sohbette UI düzenlemesi halen sürüyorsa kaynak dosyaları değiştirme; salt okunur kontrol yap ve Agent Notları.md güncelle.'
  cmd=[str(executable()),'queue','--thread',THREAD,'--model',MODEL,'-c','model_reasoning_effort="medium"','--message',prompt]
  completed=subprocess.run(cmd,cwd=APP,capture_output=True,text=True,encoding='utf-8',errors='replace',timeout=45,creationflags=subprocess.CREATE_NO_WINDOW)
  if completed.returncode:
   s.update(running=False,finishedAt=now(),message='Kontrol isteği Codex sohbetine iletilemedi.');store(s);event('agent','Kontrol iletilemedi')

 except Exception:s.update(running=False,finishedAt=now(),message='Kontrol çalıştırılamadı. Codex bağlantısını kontrol edin.');store(s);event('agent','Kontrol başarısız')
 finally:handle.close()
def finish(p):
 with LOCK:
  s=status()
  if not s.get('running') or p.get('runId')!=s.get('runId'):raise ValueError('Kontrol kimliği güncel değil.')
  result=p.get('result','')
  if not isinstance(result,str) or not 1<=len(result)<=12000 or not isinstance(p.get('success'),bool):raise ValueError('Sonuç uygun değil.')
  s.update(running=False,finishedAt=now(),message='Kontrol tamamlandı.' if p['success'] else 'Kontrol engelle karşılaştı.',result=result);store(s)
 event('agent','Kontrol tamamlandı' if p['success'] else 'Kontrol engellendi')
 return status()
if __name__=='__main__' and sys.argv[-1]=='run':run()
