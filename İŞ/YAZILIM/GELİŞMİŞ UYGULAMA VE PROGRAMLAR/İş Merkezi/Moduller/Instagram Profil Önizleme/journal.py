"""Shared journal. Receipt/results never trigger another wake-up."""
import json, threading, uuid
from datetime import datetime, timezone, timedelta
import edits

mutex=threading.Lock()
def init():
    with edits.bridge.database() as c:
        c.execute('CREATE TABLE IF NOT EXISTS work_log (event_id TEXT NOT NULL, agent TEXT NOT NULL, stage TEXT NOT NULL, note TEXT NOT NULL, created TEXT NOT NULL, PRIMARY KEY(event_id,agent,stage))')
        c.execute('CREATE TABLE IF NOT EXISTS handoffs (entry_id TEXT PRIMARY KEY, parent_id TEXT NOT NULL, depth INTEGER NOT NULL)')

def snapshot(connection=None):
    def read(c):
        c.row_factory=edits.bridge.sqlite3.Row
        events=[dict(r) for r in c.execute('SELECT e.* FROM entries e JOIN plan_events p ON p.entry_id=e.id ORDER BY e.created_at,e.rowid')]
        work=[dict(r) for r in c.execute('SELECT * FROM work_log ORDER BY created,rowid')]
        plan=[dict(r) for r in c.execute('SELECT * FROM plan_edits')]
        return dict(events=events,work=work,plan=plan)
    if connection is not None: return read(connection)
    init()
    with edits.bridge.database() as c: return read(c)

def export():
    init()
    with mutex, edits.bridge.database() as c:
        c.execute('BEGIN IMMEDIATE')
        data=snapshot(c)
        lines=[]
        for e in data['events']:
            # Never export connector errors; they may contain endpoints.
            lines.append(json.dumps({k:e[k] for k in ('id','created_at','title','detail','codex_status','grok_status')},ensure_ascii=False))
        lines.extend(json.dumps(dict(type='agent_result',**w),ensure_ascii=False) for w in data['work'])
        dest=edits.bridge.DATA_DIR/'Ortak İş Kaydı.jsonl'
        tmp=dest.with_suffix('.tmp')
        tmp.write_text('\n'.join(lines)+'\n',encoding='utf-8')
        tmp.replace(dest)
    return dest

def record(event,agent,stage,note):
    if agent=='Grok' and not edits.bridge.read_config().get('grok_enabled', True): raise ValueError('Bu iş akışında Grok devre dışı.')
    if agent not in ('Codex','Grok') or stage not in ('alindi','tamamlandi','engelli','dogrulandi') or not isinstance(note,str) or not 1<=len(note)<=4000: raise ValueError('İş kaydı geçersiz.')
    init()
    with edits.bridge.database() as c:
        if not c.execute('SELECT 1 FROM plan_events WHERE entry_id=?',(event,)).fetchone(): raise ValueError('Olay bulunamadı.')
        c.execute('INSERT OR IGNORE INTO work_log VALUES (?,?,?,?,?)',(event,agent,stage,note,datetime.now(timezone(timedelta(hours=3))).isoformat(timespec='seconds')))
    export()

def handoff(event,agent,note):
    if agent=='Grok' and not edits.bridge.read_config().get('grok_enabled', True): raise ValueError('Bu iş akışında Grok devre dışı.')
    if agent not in ('Codex','Grok') or not isinstance(note,str) or not 1<=len(note)<=2000: raise ValueError('Devir kaydı geçersiz.')
    init()
    key=str(uuid.uuid5(uuid.NAMESPACE_URL,event+'|'+agent+'|'+note))
    with edits.bridge.database() as c:
        c.execute('BEGIN IMMEDIATE')
        if not c.execute('SELECT 1 FROM plan_events WHERE entry_id=?',(event,)).fetchone(): raise ValueError('Üst olay bulunamadı.')
        row=c.execute('SELECT depth FROM handoffs WHERE entry_id=?',(event,)).fetchone()
        depth=(row[0] if row else 0)+1
        if depth>3: raise ValueError('Devir sınırı doldu; kullanıcı değerlendirmesi gerekli.')
        detail=json.dumps(dict(parent_id=event,author=agent,actionable_followup=note),ensure_ascii=False)
        c.execute('INSERT OR IGNORE INTO entries (id,created_at,kind,title,detail,file_path) VALUES (?,?,?,?,?,?)',(key,datetime.now(timezone(timedelta(hours=3))).isoformat(timespec='seconds'),'Post planı',agent+' iş devri',detail,str(edits.bridge.DATA_DIR/'Ortak İş Kaydı.jsonl')))
        c.execute('INSERT OR IGNORE INTO plan_events VALUES (?)',(key,))
        c.execute('INSERT OR IGNORE INTO handoffs VALUES (?,?,?)',(key,event,depth))
    export();edits.enqueue(key)
    return key

if __name__=='__main__':
    import argparse
    p=argparse.ArgumentParser();p.add_argument('action',choices=['read','record','handoff']);p.add_argument('--event');p.add_argument('--agent');p.add_argument('--stage');p.add_argument('--note');a=p.parse_args()
    if a.action=='read': print(export().read_text(encoding='utf-8'))
    elif a.action=='record': record(a.event,a.agent,a.stage,a.note)
    else:
        print(handoff(a.event,a.agent,a.note));edits.jobs.join()
