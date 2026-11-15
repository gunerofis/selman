"""Yerel Meta rapor köprüsü. Dış işlemler meta_read.py içinde yalnız GET'tir."""
from pathlib import Path
import importlib.util, json, re, subprocess, sys, threading

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'Veri/operations/meta_read.py'
LOCK=threading.Lock()

def status():
    spec=importlib.util.spec_from_file_location('is_merkezi_meta_read',SCRIPT)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    try:
        settings=module.config()
        return {'configured':True,'brands':[b['brand'] for b in settings['accounts']]}
    except module.MetaError as error:
        return {'configured':False,'error':str(error)}

def refresh(payload):
    if set(payload)-{'since','until'}:raise ValueError('Geçersiz Meta rapor isteği.')
    cmd=[sys.executable,'-X','utf8',str(SCRIPT),'refresh']
    for key in ['since','until']:
        if payload.get(key):
            if not isinstance(payload[key],str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}',payload[key]):raise ValueError('Geçersiz rapor tarihi.')
            cmd += ['--'+key,payload[key]]
    if not LOCK.acquire(blocking=False):raise ValueError('Meta raporu zaten yenileniyor.')
    try:
        try:result=subprocess.run(cmd,capture_output=True,text=True,encoding='utf-8',timeout=180,creationflags=subprocess.CREATE_NO_WINDOW)
        except subprocess.TimeoutExpired:raise ValueError('Meta yenilemesi süreyi aştı; son veriler korundu.') from None
        try:response=json.loads(result.stdout)
        except (ValueError,TypeError):raise ValueError('Meta raporu tamamlanamadı; son veriler korundu.') from None
        if result.returncode:raise ValueError(response.get('error','Meta bağlantısı doğrulanamadı.'))
        return response
    finally:LOCK.release()
