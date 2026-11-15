"""Kullanıcının tıkladığı normal yerel dosyayı kabuk komutu kurmadan açar."""
from pathlib import Path
import os
import subprocess
TEXT_EXTENSIONS={'.md','.txt','.csv','.tsv','.json','.py','.js','.jsx','.ts','.tsx','.css','.liquid','.html','.xml','.yaml','.yml','.toml','.ini','.log','.ps1','.bat','.cmd'}
EXTENSIONS=TEXT_EXTENSIONS|{'.pdf','.docx','.xlsx','.pptx','.png','.jpg','.jpeg','.webp'}
def resolve(value):
    if not isinstance(value,str) or not 1<=len(value)<=900 or '\x00' in value:raise ValueError('Dosya yolu uygun değil.')
    path=Path(value)
    if not path.is_absolute():
        normalized=value.replace('\\','/')
        if normalized.startswith(('Güner Ofis/','selman/')):path=Path.home()/'Desktop'/normalized
        elif normalized.startswith(('Ekip/','src/','Moduller/')):path=Path(__file__).resolve().parent.parent/normalized
        else:raise ValueError('Dosyanın tam yolu gerekli.')
    path=path.resolve(strict=True)
    roots=[Path.home()/'Desktop',Path.home()/'Documents/Codex',Path.home()/'.codex/skills',Path.home()/'.agents/skills']
    if not any(path.is_relative_to(p.resolve()) for p in roots):raise PermissionError('Bu dosya konumu açılamaz.')
    if any(p.lower() in {'api ve şifreler','.ssh','.aws','.azure'} for p in path.parts):raise PermissionError('Bu dosya konumu açılamaz.')
    if path.name.lower() in {'auth.json','secrets.json'} or path.name.startswith('.env'):raise PermissionError('Bu dosya açılamaz.')
    if not path.is_dir() and (not path.is_file() or path.suffix.lower() not in EXTENSIONS):raise ValueError('Bu dosya türü açılamaz.')
    return path

def open_file(p,role,test=False):
    if role!='admin':raise PermissionError('Yönetici erişimi gerekli.')
    try:path=resolve(p.get('path'))
    except OSError:raise ValueError('Dosya bulunamadı.')
    if not test:
        if path.suffix.lower() in TEXT_EXTENSIONS:
            subprocess.Popen([str(Path(os.environ['WINDIR'])/'System32/notepad.exe'),str(path)],creationflags=subprocess.CREATE_NO_WINDOW)
        else:os.startfile(str(path))
    return {'ok':True,'name':path.name}
