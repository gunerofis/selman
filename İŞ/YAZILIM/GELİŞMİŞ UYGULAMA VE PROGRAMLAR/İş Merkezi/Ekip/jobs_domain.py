"""İş listesi, çip ve kontrol sonucunun ortak durum kaynağı."""
import re

LABELS={'active':'Devam ediyor','needs_user':'Senden bekleniyor','completed':'Tamamlandı','cancelled':'İptal'}
def status(row):
    if row['state']=='cancelled':return 'cancelled'
    if row['state']=='completed' or (row['workStatus']=='Tamamlandı' and row['state'] not in ('running','approved')):return 'completed'
    if row['state'] in ('needs_input','awaiting_approval','rejected'):return 'needs_user'
    return 'active'

def sentence(value,limit=180):
    value=' '.join(str(value or '').split())
    if len(value)<=limit:return value
    prefix=value[:limit+1]
    end=prefix.rfind(' ')
    return (prefix[:end] if end>0 else value.split(' ')[0])+'…'

def decorate(rows):
    result=[]
    children={}
    for row in rows:
        if row.get('parentId'):children.setdefault(row['parentId'],[]).append(row)
    for row in rows:
        item=dict(row);value=status(item);sub=children.get(row['id'],[])
        if value=='active' and any(status(x)=='needs_user' for x in sub):value='needs_user'
        summaries=re.findall(r'(?:^|[·—]\s*)Özet:\s*([^\n]+)',item.get('note') or '',re.M|re.I)
        item.update(status=value,statusLabel=LABELS[value],summary=item.get('summary') or sentence(summaries[-1] if summaries else '',280),
                    childCount=len(sub),openChildren=sum(status(x) not in ('completed','cancelled') for x in sub))
        result.append(item)
    return result

def counts(rows):
    roots=[r for r in decorate(rows) if not r.get('parentId')]
    return {'active':sum(r['status'] in ('active','needs_user') for r in roots),
            'needs_user':sum(r['status']=='needs_user' for r in roots),
            'completed':sum(r['status']=='completed' for r in roots),
            'cancelled':sum(r['status']=='cancelled' for r in roots)}

def guard_close(c,ident):
    children=[dict(x) for x in c.execute('SELECT * FROM jobs WHERE parentId=?',(ident,))]
    if any(status(x) not in ('completed','cancelled') for x in children):
        raise ValueError('Açık alt işler var. Ana iş henüz kapatılamaz.')
