from pathlib import Path
import base64,json
p=Path(__file__).resolve().parent
root=p.parent
assets={}
for directory,prefix in [(root/'gorsel'/'hub',''),(root/'gorsel'/'mekan','room_'),(root/'gorsel'/'arayuz',''),(root/'gorsel'/'savas',''),(root/'gorsel'/'ikon','')]:
    for source in sorted(directory.iterdir()) if directory.exists() else []:
        if source.suffix.lower() not in {'.webp','.png','.jpg'}: continue
        mime={'.webp':'webp','.png':'png','.jpg':'jpeg'}[source.suffix.lower()]
        assets[prefix+source.stem]='data:image/'+mime+';base64,'+base64.b64encode(source.read_bytes()).decode()
assert all(k in assets for k in ['scene','hero','companion','item_dagger','scene_1','scene_6'])
assets['hub_reference']='data:image/png;base64,'+base64.b64encode((root/'gorsel'/'ref'/'Fantastik Türkçe RPG Hub Dünyası.png').read_bytes()).decode()
template=(p/'base.html').read_text(encoding='utf-8')
template=template.replace('{"atlases":{}}',(p/'atlas_defs.json').read_text(encoding='utf-8'))
parts={
'/*STYLE*/':'\n'.join((p/n).read_text(encoding='utf-8') for n in ['style.css','venues.css','rooms.css','hub.css','battle.css','casino.css','gear.css','rooms2.css','tezgah.css','demirci.css','ui.css','profil.css']),
'/*ASSETS*/':json.dumps(assets,ensure_ascii=False),
'/*BALANCE*/':(p/'Baslangic_Dengesi.json').read_text(encoding='utf-8'),
'/*ENGINE*/':'\n'.join((p/n).read_text(encoding='utf-8') for n in ['engine.js','world.js','gear.js']),
'/*APP*/':'\n'.join((p/n).read_text(encoding='utf-8') for n in ['art.js','minigames.js','systems.js','venues.js','rooms.js','rooms2.js','kanat.js','demirci.js','profil.js','hub.js','app.js'])}
for marker,value in parts.items(): template=template.replace(marker,value)
target=root/'Kivilcim_Koy_Seferi.html'
target.write_text(template,encoding='utf-8')
print(f'{len(assets)} assets; {target.stat().st_size:,} bytes')
