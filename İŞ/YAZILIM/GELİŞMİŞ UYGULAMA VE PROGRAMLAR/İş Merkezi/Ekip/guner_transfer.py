"""Güner taşıma: yalnız istekle okunan iş listesi; uygulama kuyruğuna bağlı değildir."""
from pathlib import Path
from datetime import datetime, timezone, timedelta
import csv, hashlib, json, os, re, shutil, threading

PROJECT = Path.home() / 'Desktop/Güner Ofis/02 Web/İşler ve Belgeler/Güner Shopify Taşıma - KRİTİK'
LOCK = threading.RLock()
DECISIONS = {'pending': 'Onay bekliyor', 'approved': 'Onaylandı', 'rejected': 'Reddedildi', 'revise': 'Revize'}
STATUSES = {'remaining': 'Kalan', 'deferred': 'Ertelenen', 'uncertain': 'Doğrulanmamış', 'done': 'Biten'}

def now():
    return datetime.now(timezone.utc).isoformat(timespec='seconds')

def text(p, key, maximum, minimum=0):
    value = p.get(key, '')
    if not isinstance(value, str) or not minimum <= len(value.strip()) <= maximum:
        raise ValueError(key + ': uzunluk uygun değil.')
    return value.strip()

def item_fields(p):
    title = text(p, 'title', 140, 3)
    if '\n' in title or '\r' in title:
        raise ValueError('İş tek kısa cümle olmalı.')
    priority = p.get('priority')
    if type(priority) is not int or not 0 <= priority <= 100:
        raise ValueError('Önem puanı 0–100 olmalı.')
    status = p.get('status', 'remaining')
    if status not in STATUSES:
        raise ValueError('Geçersiz durum.')
    return title, priority, status, text(p, 'source', 900), text(p, 'sourceDate', 10)

def schema(c):
    c.executescript('''
    CREATE TABLE IF NOT EXISTS guner_transfer_items(
      id TEXT PRIMARY KEY,title TEXT NOT NULL,priority INTEGER NOT NULL,status TEXT NOT NULL,
      decision TEXT NOT NULL DEFAULT 'pending',note TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT '',sourceDate TEXT NOT NULL DEFAULT '',
      revision INTEGER NOT NULL DEFAULT 1,updatedAt TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS guner_transfer_area(
      id INTEGER PRIMARY KEY CHECK(id=1),revision INTEGER NOT NULL DEFAULT 1,
      userNote TEXT NOT NULL DEFAULT '',agentNotes TEXT NOT NULL DEFAULT '',
      resources TEXT NOT NULL DEFAULT '[]',updatedAt TEXT NOT NULL);
    ''')
    c.execute('INSERT OR IGNORE INTO guner_transfer_area(id,updatedAt) VALUES(1,?)', (now(),))

def payload(c):
    area = dict(c.execute('SELECT * FROM guner_transfer_area WHERE id=1').fetchone())
    area['resources'] = json.loads(area['resources'])
    area['items'] = [dict(r) for r in c.execute('SELECT * FROM guner_transfer_items ORDER BY priority DESC,title,id')]
    area['document'] = str(PROJECT / 'Açık.md')
    area['rules'] = [
        'Her iş tek kısa cümle ve 0–100 önem puanıyla yazılır.',
        'Yalnız kalan iş kaydedilir; araştırma ve çözüm yapılmaz.',
        'Program yalnız kullanıcı istediğinde kontrol edilir.',
        'Agent önce kaynakları ve agent notlarını okur; kısa devir notu bırakır.',
    ]
    return area

def read(connect):
    with LOCK:
        c = connect()
        try:
            schema(c)
            return payload(c)
        finally:
            c.close()

def preserve(path):
    if not path.is_file():
        return
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    desktop = Path.home() / 'Desktop'
    destination = desktop / '_ARŞİV/MD' / f'{path.stem} — Güner taşıma — {digest[:12]}.md'
    if destination.exists():
        return
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, destination)
    with (desktop / '_ARŞİV/CSV/Kayıt Dizini.csv').open('a', encoding='utf-8', newline='') as f:
        csv.writer(f).writerow(['MD', destination.name, str(path), 'Güner taşıma', 'Önceki sürüm', digest])

def document(d):
    def escape(s):
        return str(s).replace('|', '\\|').replace('\n', ' / ')
    lines = ['# Güner taşıma', '', 'Güncelleme: ' + datetime.now(timezone(timedelta(hours=3))).strftime('%d.%m.%Y') + '.',
             'Program aktarımı bekliyor; iş listesi bu belgededir.' if d.get('staged') else 'Kaynak: İş Merkezi → Güner taşıma. Bu belge aynı kayıtların görünümüdür.',
             'Durumlar mevcut kayıtlara dayanır; bu çalışma canlı site kontrolü değildir.',
             'Önem puanları iş sırası için verilmiştir.', '', '## Çalışma kuralları', '']
    lines.extend('- ' + r for r in d['rules'])
    for label, predicate in [
        ('Kalan işler', lambda x: x['status'] != 'done' and x['decision'] != 'rejected'),
        ('Biten işler', lambda x: x['status'] == 'done' and x['decision'] != 'rejected'),
        ('Reddedilen işler', lambda x: x['decision'] == 'rejected'),
    ]:
        lines.extend(['', '## ' + label, '', '| İş | Önem /100 | Durum | Karar |', '|---|---:|---|---|'])
        for item in filter(predicate, d['items']):
            lines.append(f"| {escape(item['title'])} | {item['priority']} | {STATUSES[item['status']]} | {DECISIONS[item['decision']]} |")
    lines.extend(['', '## Kullanıcı notu', '', d['userNote'] or '—'])
    notes = [i for i in d['items'] if i['note']]
    if notes:
        lines.extend(['', '## İş notları', ''])
        lines.extend('- ' + i['title'] + ' ' + i['note'] for i in notes)
    lines.extend(['', '## Kurallar ve kaynaklar', ''])
    lines.extend('- ' + r['label'] + ': `' + r['path'] + '`' for r in d['resources'])
    lines.extend(['', '## Agent notları', '', d['agentNotes'] or '—', '', '## Kullanıcı özeti', '',
                  ('53 kalan ve 23 biten iş listelendi. Program alanı henüz devrede değil.' if d.get('staged') else 'Kalan ve biten işler aynı alandadır. Her iş ayrı kayıttır; karar ve notlar programda tutulur.'), ''])
    return '\n'.join(lines)

def save(connect, p, role, conflict, document_path=None):
    if role != 'admin':
        raise PermissionError('Yönetici erişimi gerekli.')
    operation = p.get('operation')
    with LOCK:
        c = connect()
        try:
            schema(c)
            c.execute('BEGIN IMMEDIATE')
            before = None
            ident = 'guner-transfer'
            if operation == 'import':
                items = p.get('items')
                if not isinstance(items, list) or not 1 <= len(items) <= 200:
                    raise ValueError('İş listesi uygun değil.')
                for item in items:
                    if not isinstance(item, dict):
                        raise ValueError('Geçersiz iş.')
                    ident = text(item, 'id', 32, 32)
                    if not re.fullmatch('[0-9a-f]{32}', ident):
                        raise ValueError('Geçersiz iş kimliği.')
                    fields = item_fields(item)
                    row = c.execute('SELECT * FROM guner_transfer_items WHERE id=?', (ident,)).fetchone()
                    if row:
                        if tuple(row[k] for k in ('title','priority','status','source','sourceDate')) != fields:
                            raise conflict('İş zaten değişmiş; yeniden yüklenmedi.')
                    else:
                        c.execute('INSERT INTO guner_transfer_items(id,title,priority,status,source,sourceDate,updatedAt) VALUES(?,?,?,?,?,?,?)', (ident, *fields, now()))
                ident = 'guner-transfer'
            elif operation in ('add', 'edit', 'decision', 'note'):
                ident = text(p, 'id', 32, 32)
                if not re.fullmatch('[0-9a-f]{32}', ident):
                    raise ValueError('Geçersiz iş kimliği.')
                row = c.execute('SELECT * FROM guner_transfer_items WHERE id=?', (ident,)).fetchone()
                if operation == 'add':
                    fields = item_fields(p)
                    if row:
                        if tuple(row[k] for k in ('title','priority','status','source','sourceDate')) != fields:
                            raise conflict('Kimlik başka kayıt için kullanılıyor.')
                    else:
                        c.execute('INSERT INTO guner_transfer_items(id,title,priority,status,source,sourceDate,updatedAt) VALUES(?,?,?,?,?,?,?)', (ident, *fields, now()))
                else:
                    if not row:
                        raise ValueError('İş bulunamadı.')
                    before = dict(row)
                    if type(p.get('revision')) is not int or p['revision'] != row['revision']:
                        raise conflict('İş değişti. Yenileyin; yazınız korunuyor.')
                    if operation == 'edit':
                        fields = item_fields(p)
                        c.execute("UPDATE guner_transfer_items SET title=?,priority=?,status=?,source=?,sourceDate=?,decision='pending',revision=revision+1,updatedAt=? WHERE id=?", (*fields, now(), ident))
                    elif operation == 'decision':
                        choice = p.get('decision')
                        if choice not in ('approved', 'rejected', 'revise'):
                            raise ValueError('Geçersiz karar.')
                        c.execute('UPDATE guner_transfer_items SET decision=?,revision=revision+1,updatedAt=? WHERE id=?', (choice, now(), ident))
                    else:
                        c.execute('UPDATE guner_transfer_items SET note=?,revision=revision+1,updatedAt=? WHERE id=?', (text(p, 'note', 1000), now(), ident))
            elif operation == 'area':
                row = c.execute('SELECT * FROM guner_transfer_area WHERE id=1').fetchone()
                before = dict(row)
                if type(p.get('revision')) is not int or p['revision'] != row['revision']:
                    raise conflict('Alan değişti. Yenileyin; yazınız korunuyor.')
                changes = {}
                for key, limit in [('userNote', 3000), ('agentNotes', 4000)]:
                    if key in p:
                        changes[key] = text(p, key, limit)
                if 'resources' in p:
                    resources = p['resources']
                    if not isinstance(resources, list) or len(resources) > 30:
                        raise ValueError('Kaynak listesi uygun değil.')
                    resources = [{'label': text(r, 'label', 100, 1), 'path': text(r, 'path', 900, 1)} for r in resources if isinstance(r, dict)]
                    changes['resources'] = json.dumps(resources, ensure_ascii=False)
                if not changes:
                    raise ValueError('Değişiklik yok.')
                c.execute('UPDATE guner_transfer_area SET ' + ','.join(k+'=?' for k in changes) + ',revision=revision+1,updatedAt=? WHERE id=1', (*changes.values(), now()))
            else:
                raise ValueError('Geçersiz işlem.')
            result = payload(c)
            c.execute('INSERT INTO events(job,actor,action,before,after,at) VALUES(?,?,?,?,?,?)',
                      (ident, role, 'guner-transfer-' + operation, json.dumps(before, ensure_ascii=False), json.dumps(p, ensure_ascii=False), now()))
            path = Path(document_path) if document_path else PROJECT / 'Açık.md'
            path.parent.mkdir(parents=True, exist_ok=True)
            rendered = document(result)
            if not path.exists() or path.read_text(encoding='utf-8-sig') != rendered:
                if document_path is None:
                    preserve(path)
                tmp = path.with_suffix('.md.tmp')
                tmp.write_text(rendered, encoding='utf-8')
                os.replace(tmp, path)
            c.execute('COMMIT')
            return result
        except BaseException:
            if c.in_transaction:
                c.execute('ROLLBACK')
            raise
        finally:
            c.close()
