from pathlib import Path
from PIL import Image
from concurrent.futures import ProcessPoolExecutor
R=Path(__file__).resolve().parent.parent
SAVAS=R/'Oyun'/'gorsel'/'savas'; ARA=R/'Oyun'/'gorsel'/'arayuz'; HUB=R/'Oyun'/'gorsel'/'hub'
ISL=R/'Asset'/'Islenen'
for d in (SAVAS,ARA,HUB,ISL): d.mkdir(parents=True,exist_ok=True)
def plan(s):
    if s.startswith('bg_'):return SAVAS,'rgb',1152,None,66,'arka plan'
    if s.startswith('foe_'):return SAVAS,'trim',None,360,60,'düşman'
    if s=='hub_scene_full':return HUB,'rgb',1440,None,72,'ana sahne'
    if s in('pet_tilki','wing_turna','wing_kuzgun','aura_halka'):return ARA,'trim',448,None,76,'yoldaş/kanat'
    if s.startswith('icon_chest_'):return ARA,'rgba',256,None,78,'sandık'
    if s.startswith(('icon_','btn_','frame_')):return ARA,'rgba',256,None,84,'arayüz'
    return None
def work(p):
    p=Path(p); s=p.stem; pl=plan(s)
    if not pl: return None
    out,mode,w,h,q,grp=pl
    im=Image.open(p)
    im=im.convert('RGB') if mode=='rgb' else im.convert('RGBA')
    if mode=='trim':
        bb=im.getbbox()
        if bb: im=im.crop(bb)
    if h: im=im.resize((max(1,round(im.width*h/im.height)),h),Image.LANCZOS)
    elif w and im.width>w: im=im.resize((w,max(1,round(im.height*w/im.width))),Image.LANCZOS)
    f=out/(s+'.webp'); im.save(f,'WEBP',quality=q,method=4)
    if p.parent.name!='Islenen': p.rename(ISL/p.name)
    return grp,f.stat().st_size
if __name__=='__main__':
    files=[str(x) for x in sorted((R/'Asset'/'Gelen').glob('*.png'))]+[str(x) for x in sorted(ISL.glob('*.png'))]
    rapor={}
    with ProcessPoolExecutor(max_workers=8) as ex:
        for res in ex.map(work,files,chunksize=4):
            if not res: continue
            g,b=res; c=rapor.setdefault(g,[0,0]); c[0]+=1; c[1]+=b
    t=sum(v[1] for v in rapor.values()); n=sum(v[0] for v in rapor.values())
    for k,(c,b) in sorted(rapor.items()): print(f'{k}: {c} dosya, {b/1048576:.1f} MB')
    print(f'TOPLAM {n} dosya, {t/1048576:.1f} MB')
