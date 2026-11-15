"""Kurallar.md tek kaynağından arayüz verisini üretir; servisi değiştirmez."""
from pathlib import Path
import csv,hashlib,json,shutil,sys
from app_routes import rules

app=Path(__file__).resolve().parents[1]
target=app/'src/content/dashboard/rules.json'
content=(json.dumps(rules(app)['rules'],ensure_ascii=False,indent=2)+'\n').encode('utf-8')
current=target.read_bytes() if target.exists() else None
if '--check' in sys.argv:
    if current!=content:raise SystemExit('Kurallar.md ile arayüz verisi farklı.')
elif current!=content:
    if current is not None:
        digest=hashlib.sha256(current).hexdigest()
        root=Path.home()/'Desktop/_ARŞİV'
        dest=root/'JSON'/('Kurallar arayüzü — '+digest[:12]+'.json')
        dest.parent.mkdir(parents=True,exist_ok=True)
        if not dest.exists():
            shutil.copy2(target,dest)
            with (root/'CSV/Kayıt Dizini.csv').open('a',encoding='utf-8',newline='') as f:
                csv.writer(f).writerow(['JSON',dest.name,str(target),'İş Merkezi','Kural güncellemesi öncesi',digest])
    temp=target.with_suffix('.json.tmp')
    temp.write_bytes(content)
    temp.replace(target)
print('Kurallar eşleşiyor.')
