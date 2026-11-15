"""Validate OPERASYON's versioned planning records without external packages."""
from pathlib import Path
from datetime import date
import argparse
import json
import re
import sys
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent


def task_index(tasks):
    labels = {'bekliyor':'Bekliyor','calisiliyor':'Çalışılıyor','engelli':'Engelli',
              'dogrulama':'Doğrulama','tamamlandi':'Tamamlandı','iptal':'İptal'}
    def cell(value):
        return str(value).replace('|', '\\|').replace('\n', ' ')
    lines = ['# İş takibi', '',
             'Kaynak: [kayitlar/isler.json](kayitlar/isler.json). Bu görünüm scripts/validate_structure.py --write-index ile üretilir.', '',
             '| Kimlik | İş | Birim | Durum | Kişi | Bağımlılık |',
             '|---|---|---|---|---|---|']
    for t in sorted(tasks, key=lambda x: x['id']):
        lines.append('| ' + ' | '.join(cell(x) for x in [t['id'], t['title'], t['unit'],
                     labels[t['status']], t['owner'] or 'Atanacak', ', '.join(t['dependencies']) or 'Yok']) + ' |')
    lines += ['', 'Hedef tarih, kabul ölçütü, kanıt ve engel bilgileri ana kayıttadır. Tamamlanan taslak işi, canlı uygulamanın tamamlandığı anlamına gelmez.', '']
    return '\n'.join(lines)


def validate(root, write_index=False):
    errors=[]
    def need(ok, message):
        if not ok: errors.append(message)
        return bool(ok)
    def local(ref):
        if not isinstance(ref,str) or not ref.strip(): return False
        path=(root/ref).resolve()
        return path.is_relative_to(root.resolve()) and path.is_file()
    def day(value, label):
        if value is None: return
        try:
            if not isinstance(value,str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', value): raise ValueError()
            date.fromisoformat(value)
        except ValueError: errors.append(f'{label}: geçersiz tarih')
    def load(filename, key):
        try:
            data=json.loads((root/'00_YONETIM/kayitlar'/filename).read_text(encoding='utf-8'))
            if not isinstance(data,dict) or data.get('version')!=1 or not isinstance(data.get(key),list):
                raise ValueError('version=1 ve kayıt dizisi gerekli')
            if not all(isinstance(x,dict) for x in data[key]): raise ValueError('Kayıtlar nesne olmalı')
            return data[key]
        except (OSError,ValueError) as exc:
            errors.append(f'{filename}: {exc}')
            return []
    units=load('birimler.json','units')
    systems=load('sistemler.json','systems')
    tasks=load('isler.json','tasks')
    def ids(rows,label):
        values=[x.get('id') for x in rows]
        if not all(isinstance(x,str) and x for x in values):
            errors.append(f'{label}: kimlik eksik veya geçersiz'); return set()
        need(len(set(values))==len(values),f'{label}: mükerrer kimlik')
        return set(values)
    unit_ids=ids(units,'birimler'); ids(systems,'sistemler'); task_ids=ids(tasks,'isler')
    for u in units:
        need(isinstance(u.get('name'),str) and bool(u['name'].strip()),f"{u.get('id')}: birim adı eksik")
        p=u.get('path')
        need(isinstance(p,str) and (root/p).resolve().is_relative_to(root.resolve()) and (root/p).is_dir(),f"{u.get('id')}: birim klasörü yok")
    for s in systems:
        label=s.get('id','sistem')
        need(s.get('unit') in unit_ids,f'{label}: bilinmeyen birim')
        need(s.get('state') in {'belirlenecek','tanimli','test','aktif'},f'{label}: bağlantı durumu geçersiz')
        day(s.get('last_verified'),str(label))
        if s.get('state')=='aktif':
            need(s.get('last_verified') is not None and local(s.get('evidence')),f'{label}: aktif bağlantıda doğrulama tarihi/kanıtı eksik')
    required={'id','title','unit','owner','status','priority','dependencies','due_date','acceptance','evidence','blocker'}
    statuses={'bekliyor','calisiliyor','engelli','dogrulama','tamamlandi','iptal'}
    for t in tasks:
        label=t.get('id','iş')
        need(required<=t.keys(),f'{label}: gerekli alan eksik')
        need(isinstance(label,str) and bool(re.fullmatch(r'OP-\d{3,}',label)),f'{label}: iş kimliği geçersiz')
        need(t.get('unit') in unit_ids,f'{label}: bilinmeyen birim')
        need(t.get('status') in statuses,f'{label}: durum geçersiz')
        need(t.get('priority') in {'P0','P1','P2','P3'},f'{label}: öncelik geçersiz')
        for key in ['title','acceptance']:
            need(isinstance(t.get(key),str) and bool(t[key].strip()),f'{label}: {key} gerekli')
        owner=t.get('owner')
        need(owner is None or isinstance(owner,str) and bool(owner.strip()),f'{label}: kişi biçimi geçersiz')
        if t.get('status') in {'calisiliyor','dogrulama','tamamlandi'}:
            need(isinstance(owner,str) and bool(owner.strip()),f'{label}: kişi atanmamış')
        deps=t.get('dependencies')
        if need(isinstance(deps,list) and all(isinstance(d,str) for d in deps),f'{label}: bağımlılık dizisi geçersiz'):
            need(len(set(deps))==len(deps),f'{label}: yinelenen bağımlılık')
            for dep in deps: need(dep in task_ids and dep!=label,f'{label}: geçersiz bağımlılık {dep}')
        ev=t.get('evidence')
        if need(isinstance(ev,list) and all(isinstance(e,str) for e in ev),f'{label}: kanıt dizisi geçersiz'):
            for ref in ev: need(local(ref),f'{label}: kanıt yok veya depo dışında: {ref}')
            if t.get('status') in {'dogrulama','tamamlandi'}: need(bool(ev),f'{label}: kanıt gerekli')
        if t.get('status') in {'engelli','iptal'}:
            need(isinstance(t.get('blocker'),str) and bool(t['blocker'].strip()),f'{label}: engel/iptal gerekçesi eksik')
        day(t.get('due_date'),str(label))
    graph={t['id']:t.get('dependencies',[]) for t in tasks if isinstance(t.get('id'),str) and isinstance(t.get('dependencies'),list) and all(isinstance(d,str) for d in t['dependencies'])}
    visited=set(); visiting=set()
    def walk(key):
        if key in visiting: errors.append(f'{key}: bağımlılık döngüsü'); return
        if key in visited: return
        visiting.add(key)
        for dep in graph.get(key,[]): walk(dep)
        visiting.remove(key); visited.add(key)
    for key in graph: walk(key)
    status_by_id={t.get('id'):t.get('status') for t in tasks if isinstance(t.get('id'),str)}
    for t in tasks:
        if t.get('status') in {'calisiliyor','dogrulama','tamamlandi'} and t.get('id') in graph:
            for dep in graph[t['id']]: need(status_by_id.get(dep)=='tamamlandi',f"{t['id']}: tamamlanmamış bağımlılık {dep}")
    skill_files=list((root/'.agents/skills').glob('*/SKILL.md'))
    need(bool(skill_files),'Skill bulunamadı')
    for p in skill_files:
        data=p.read_text(encoding='utf-8')
        match=re.match(r'^---\n(.*?)\n---\n',data,re.S)
        if not need(match is not None,f'{p.parent.name}: frontmatter eksik'): continue
        name=re.search(r'^name:\s*(\S+)\s*$',match[1],re.M)
        desc=re.search(r'^description:\s*(.+)$',match[1],re.M)
        need(name is not None and name[1]==p.parent.name and bool(re.fullmatch(r'[a-z0-9-]{1,63}',name[1])),f'{p.parent.name}: skill adı geçersiz')
        need(desc is not None and bool(desc[1].strip()),f'{p.parent.name}: açıklama eksik')
    for p in root.rglob('*.md'):
        if any(x in {'.git','work','node_modules','.venv'} for x in p.relative_to(root).parts): continue
        text=p.read_text(encoding='utf-8')
        for ref in re.findall(r'\]\(([^)]+)\)',text):
            ref=ref.strip('<>').split('#',1)[0]
            if not ref or re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:',ref): continue
            target=(p.parent/unquote(ref)).resolve()
            need(target.is_relative_to(root.resolve()) and target.exists(),f'{p.relative_to(root)}: kırık bağlantı {ref}')
    # Never rewrite a generated view if source records are invalid.
    if not errors:
        expected=task_index(tasks)
        index=root/'00_YONETIM/IS_TAKIBI.md'
        if write_index: index.write_text(expected,encoding='utf-8')
        else: need(index.exists() and index.read_text(encoding='utf-8')==expected,'IS_TAKIBI.md güncel değil; --write-index çalıştır')
    return errors, (len(units),len(systems),len(tasks),len(skill_files))


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--write-index',action='store_true',help='Geçerli iş kaydından Markdown görünümü üret')
    parser.add_argument('--root',type=Path,default=ROOT,help='Kontrol edilecek depo kökü')
    args=parser.parse_args()
    errors,counts=validate(args.root,args.write_index)
    for err in errors: print('HATA: '+err)
    if errors: return 1
    print(f'Başarılı: {counts[0]} birim, {counts[1]} sistem, {counts[2]} iş, {counts[3]} skill; bağımlılık ve yerel bağlantılar geçerli.')
    return 0


if __name__=='__main__': sys.exit(main())
