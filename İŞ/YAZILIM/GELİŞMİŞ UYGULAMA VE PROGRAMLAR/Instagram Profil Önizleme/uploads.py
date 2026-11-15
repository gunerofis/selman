import base64, hashlib, io, re, warnings
from pathlib import Path
from PIL import Image
import edits

def folder():
    return edits.bridge.DATA_DIR.parent / 'Görseller/Programdan Eklenenler'

def resolve(name):
    if not isinstance(name,str): raise ValueError('Görsel geçersiz.')
    if re.fullmatch(r'upload-[0-9a-f]{64}\.(png|jpg|webp)',name): return folder()/name
    if Path(name).name!=name or '/' in name or '\\' in name: raise ValueError('Görsel yolu geçersiz.')
    return edits.bridge.DATA_DIR.parent / 'Görseller/2026-10-23 İlk Seri' / name

def accept(payload):
    raw=base64.b64decode(payload.get('data',''),validate=True)
    if not 0<len(raw)<=12*1024*1024: raise ValueError('Görsel en fazla 12 MB olabilir.')
    with warnings.catch_warnings():
        warnings.simplefilter('error',Image.DecompressionBombWarning)
        try:
            with Image.open(io.BytesIO(raw)) as im:
                fmt=im.format
                if fmt not in ('PNG','JPEG','WEBP') or im.width*im.height>40000000 or getattr(im,'n_frames',1)!=1: raise ValueError()
                im.verify()
            with Image.open(io.BytesIO(raw)) as im: im.load()
        except Exception: raise ValueError('Geçerli, tek kareli PNG, JPEG veya WebP seçin (en fazla 40 megapiksel).')
    name='upload-'+hashlib.sha256(raw).hexdigest()+{'PNG':'.png','JPEG':'.jpg','WEBP':'.webp'}[fmt]
    folder().mkdir(parents=True,exist_ok=True)
    path=folder()/name
    if not path.exists():
        try:
            with path.open('xb') as f: f.write(raw)
        except FileExistsError: pass
    return {'name':name}

def validate(names):
    if not isinstance(names,list) or not 1<=len(names)<=10: raise ValueError('1–10 görsel seçin.')
    for name in names:
        if not resolve(name).is_file(): raise ValueError('Görsel bulunamadı.')
    return names
