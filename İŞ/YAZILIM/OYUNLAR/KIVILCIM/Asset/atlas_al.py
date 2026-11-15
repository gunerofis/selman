from pathlib import Path
from PIL import Image
from concurrent.futures import ProcessPoolExecutor
import json
R=Path(__file__).resolve().parent.parent
KAT=R/'Asset'/'Gelen'/'Katalog'
G=R/'Oyun'/'gorsel'
ATL=G/'atlas'; IKO=G/'ikon'
for d in (ATL,IKO): d.mkdir(parents=True,exist_ok=True)
def conv(t):
    src,dst,q,cap=t; src=Path(src); dst=Path(dst)
    im=Image.open(src).convert('RGBA')
    if cap and im.width>cap: im=im.resize((cap,max(1,round(im.height*cap/im.width))),Image.LANCZOS)
    im.save(dst,'WEBP',quality=q,method=4)
    return dst.stat().st_size
if __name__=='__main__':
    man=json.loads((KAT/'manifest.json').read_text(encoding='utf-8'))
    # mevcut ART anahtarlari (cakismayi onle)
    var=set()
    for d in ('hub','mekan','arayuz','savas'):
        for f in (G/d).glob('*'): var.add(f.stem)
    jobs=[];defs={};atlaskeys=[]
    for k,v in man['atlases'].items():
        p=KAT/(k+'.png')
        if not p.exists(): continue
        d={x:v[x] for x in ('logicalHeight','frameMs','frames','clips') if x in v}
        d['src']='gorsel/atlas/'+k+'.webp'
        defs[k]=d; atlaskeys.append(k)
        jobs.append((str(p),str(ATL/(k+'.webp')),58,None))
    ikon=0;atlanan=[]
    for k,v in man['assets'].items():
        p=R/v['src']
        if not p.exists(): continue
        if k in var: atlanan.append(k); continue
        jobs.append((str(p),str(IKO/(k+'.webp')),86,256)); ikon+=1
    with ProcessPoolExecutor(max_workers=6) as ex:
        boyut=list(ex.map(conv,jobs,chunksize=4))
    (R/'Oyun'/'kod'/'atlas_defs.json').write_text(json.dumps({'atlases':defs},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    a=sum(f.stat().st_size for f in ATL.glob('*.webp')); i=sum(f.stat().st_size for f in IKO.glob('*.webp'))
    print(f'atlas: {len(atlaskeys)} sayfa, {a/1048576:.1f} MB (disk, gomulu degil)')
    print(f'ikon: {ikon} dosya, {i/1048576:.1f} MB (gomulu)')
    print(f'cakistigi icin atlanan ikon: {len(atlanan)}')
