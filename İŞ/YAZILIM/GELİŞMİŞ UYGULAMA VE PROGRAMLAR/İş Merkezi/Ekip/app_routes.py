"""ChatGPT Data App ve yerel modüllerin aynı origin üzerindeki yolları."""
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json,re,subprocess,urllib.request,urllib.error

def settings(app,payload=None,test_folder=None):
    cmd=[str(app/'Ekip/SettingsApi.exe'),'save' if payload is not None else 'read']
    if test_folder:cmd.append(str(test_folder))
    result=subprocess.run(cmd,input=json.dumps(payload,ensure_ascii=False) if payload is not None else '',capture_output=True,text=True,encoding='utf-8',timeout=15,creationflags=subprocess.CREATE_NO_WINDOW)
    if result.returncode==2:return {'conflict':True}
    if result.returncode:raise ValueError('Bağlantı ayarı okunamadı veya kaydedilemedi.')
    return json.loads(result.stdout.lstrip('\ufeff'))

def assets(handler,app,path):
    name='index.html' if path=='/' else path.lstrip('/')
    if name=='index.html' or re.fullmatch(r'snapshot\.[a-f0-9]{64}\.json',name):
        file=app/'dist'/name
        if file.is_file():handler.send(200,file.read_bytes(),mime='text/html; charset=utf-8' if name.endswith('.html') else 'application/json; charset=utf-8');return True
    return False

def embed(handler,app,path):
    if path.startswith('/profil-assets/'):
        name=path.removeprefix('/profil-assets/')
        if not re.fullmatch(r'[a-z0-9-]+\.png',name):return False
        file=app/'Moduller/Instagram Profil Önizleme/assets'/name
        if not file.is_file():return False
        handler.send(200,file.read_bytes(),mime='image/png');return True
    if path=='/profil':
        content=(app/'Moduller/Instagram Profil Önizleme/index.html').read_text(encoding='utf-8-sig')
    elif path=='/chat':
        content=(app/'Moduller/Sohbet Okuyucu/index.html').read_text(encoding='utf-8-sig')
    else:return False
    if path=='/profil':content=content.replace("sheet:'assets/","sheet:'/profil-assets/")
    file='Preview.css' if path=='/profil' else 'Chat.css'
    content=content.replace('</head>','<style>'+ (app/file).read_text(encoding='utf-8')+'</style></head>')
    handler.send(200,content.encode(),mime='text/html; charset=utf-8');return True

def instagram(handler,app,path,ensure,post=False):
    m=re.fullmatch(r'/instagram/(guner|makro)(/.*)',path)
    if not m:return False
    if not handler.session():handler.send(401,{'error':'Oturumu yenileyin.'});return True
    brand,tail=m.groups();port=4194 if brand=='guner' else 4193;prefix='/instagram/'+brand
    if post and tail not in ['/api/save','/api/upload','/api/retry']:
        handler.send(404,{'error':'Yol bulunamadı.'});return True
    if not post and not (tail in ['/','/index.html','/plan.html','/editor.js','/guner-editor.js','/api/plan','/api/status','/api/journal','/takvim','/health'] or tail.startswith('/media/')):
        handler.send(404,{'error':'Yol bulunamadı.'});return True
    ensure(port)
    data=None
    if post:
        if handler.headers.get('Origin')!=f'http://127.0.0.1:{handler.server.server_port}' or handler.headers.get('Content-Type','').split(';')[0]!='application/json':
            handler.send(403,{'error':'Geçersiz kaynak.'});return True
        size=int(handler.headers.get('Content-Length','0'))
        if not 0<size<=(17*1024*1024 if tail=='/api/upload' else 48000):raise ValueError('İstek boyutu geçersiz.')
        data=handler.rfile.read(size)
    target=f'http://127.0.0.1:{port}'
    request=urllib.request.Request(target+tail,data=data,headers={'Origin':target,'Content-Type':'application/json','Sec-Fetch-Site':'same-origin'})
    try:
        with urllib.request.urlopen(request,timeout=30) as response:body=response.read();mime=response.headers.get('Content-Type','application/json');code=response.status
    except urllib.error.HTTPError as e:body=e.read();mime=e.headers.get('Content-Type','application/json');code=e.code
    if 'text/html' in mime or 'javascript' in mime:
        text=body.decode('utf-8-sig')
        for name in ['/api/','/media/','/editor.js','/guner-editor.js','/takvim']:
            text=text.replace("'"+name,"'"+prefix+name).replace('"'+name,'"'+prefix+name).replace('`'+name,'`'+prefix+name)
        if 'text/html' in mime:
            script='<script>'+ (app/'Instagram.js').read_text(encoding='utf-8')+'</script>'
            text=text.replace('</head>',script+'</head>') if '</head>' in text else text+script
        body=text.encode()
    handler.send(code,body,mime=mime);return True

def rules(app):
    text=(app/'Kurallar.md').read_text(encoding='utf-8-sig')
    rows=[{'number':int(n),'title':title,'text':body.strip()} for n,title,body in re.findall(r'^([0-9]+)\. \*\*(.+?)\*\* (.+)$',text,re.M)]
    if not rows or len({r['number'] for r in rows})!=len(rows):
        raise ValueError('Kural listesi okunamadı.')
    return {'rules':rows}
