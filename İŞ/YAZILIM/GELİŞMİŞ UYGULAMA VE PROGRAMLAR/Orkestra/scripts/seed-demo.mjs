import { randomUUID } from 'node:crypto';
import { openStore, transaction, audit } from '../core/store.mjs';

const db=openStore(process.env.DATABASE_PATH??'data/core.sqlite');
try {
  const actor=db.prepare('SELECT id FROM users WHERE active=1 ORDER BY rowid LIMIT 1').get();
  if(!actor) throw new Error('Önce pnpm setup:local çalıştırın.');
  transaction(db,()=>{
    const now=new Date().toISOString();
    const customerId='demo-customer';
    for(const userId of ['selman','hasan','ali','gulay','korhan']) {
      if(db.prepare('SELECT 1 FROM users WHERE id=?').get(userId)) {
        if(userId==='ali') {
          db.prepare("DELETE FROM grants WHERE user_id=? AND brand='*' AND permission='*'").run(userId);
          for(const permission of ['orders.read','finance.summary']) db.prepare('INSERT OR IGNORE INTO grants(user_id,brand,permission) VALUES(?,?,?)').run(userId,'*',permission);
        } else db.prepare("INSERT OR IGNORE INTO grants(user_id,brand,permission) VALUES(?,'*','*')").run(userId);
        db.prepare("INSERT OR IGNORE INTO user_preferences(user_id,pref_key,value_json,updated_at) VALUES(?,'hidden_modules','[]',?)").run(userId,now);
        db.prepare("INSERT OR IGNORE INTO user_preferences(user_id,pref_key,value_json,updated_at) VALUES(?,'start_module','\"home\"',?)").run(userId,now);
        db.prepare("INSERT OR IGNORE INTO user_preferences(user_id,pref_key,value_json,updated_at) VALUES(?,'display_density','\"comfortable\"',?)").run(userId,now);
      }
    }
    for(const [kind,assignee] of [['invoice','gulay'],['production','hasan'],['shipping.domestic','korhan'],['shipping.international','korhan']]) {
      if(db.prepare('SELECT 1 FROM users WHERE id=?').get(assignee))db.prepare('INSERT OR IGNORE INTO rules(id,brand,kind,assignee) VALUES(?,?,?,?)').run(`guner-${kind}`,'guner',kind,assignee);
    }
    db.prepare('INSERT OR IGNORE INTO customers VALUES(?,?,?,?,?,?,?,?,?,?)').run(customerId,'guner','Demo Müşteri','customer','demo@example.invalid',null,'active','Yalnız geliştirme verisi',now,now);
    const productId='demo-product';
    db.prepare('INSERT OR IGNORE INTO products VALUES(?,?,?,?,?,?,?,?)').run(productId,'guner','DEMO-001','Demo Ürün','adet','active',now,now);
    db.prepare('INSERT OR IGNORE INTO stock_positions VALUES(?,?,?,?,?,?,?,?,?,?)').run('demo-position','guner',productId,'unassigned',1000,1000,0,'unverified',now,now);
    const demoNotification=db.prepare("SELECT id FROM notifications WHERE brand='guner' AND kind='demo' AND title='Demo veri hazır' LIMIT 1").get();
    if(!demoNotification) {
      db.prepare('INSERT INTO notifications VALUES(?,?,?,?,?,?,?,?)').run(randomUUID(),null,'guner','demo','Demo veri hazır','Gerçek bağlantı verisi değildir.',null,now);
    }
    audit(db,actor.id,'guner','demo.seeded',null,{customerId,productId});
  });
  console.log('Demo verisi hazırlandı; gerçek entegrasyon verisi değildir.');
} finally { db.close(); }
