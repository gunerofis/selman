import { createServer } from 'node:http';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { openStore, hash, permitted, transaction, audit } from '../../core/store.mjs';
import { enqueueOrderEvent, fail, identifier } from '../../core/orders.mjs';
import { normalizeShopDomain } from '../../core/connectors/shopify.mjs';
import { defaultGoogleDataset, supportsGoogleConnection } from '../../core/connectors/google.mjs';

const permissions = [
  'orders.read','orders.write','tasks.read','tasks.update','customers.read','customers.write','products.read','products.write',
  'inventory.read','inventory.write','production.read','production.write','quotes.read','quotes.write',
  'shipping.read','shipping.write','finance.read','finance.summary','finance.write','audit.read','notifications.read','preferences.write','settings.write'
];
const kinds = ['invoice','production','shipping.domestic','shipping.international'];
const publicRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public');
const publicFiles = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/app.css', ['app.css', 'text/css; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']]
]);
async function body(req) {
  const chunks = []; let length = 0;
  for await (const chunk of req) { length += chunk.length; if (length > 65536) fail(413, 'İstek çok büyük'); chunks.push(chunk); }
  const raw = Buffer.concat(chunks);
  let json; try { json = JSON.parse(raw.toString()); } catch { fail(400, 'Geçersiz JSON'); }
  if (!json || typeof json !== 'object' || Array.isArray(json)) fail(400, 'JSON nesnesi gerekli');
  return { raw, json };
}
const shortText = (value, min = 1, max = 120) => typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;
const optionalText = (value, max = 500) => value === undefined || value === null || (typeof value === 'string' && value.length <= max);
const finiteNumber = value => typeof value === 'number' && Number.isFinite(value);
const optionalDate = value => value === undefined || value === null || value === '' || (typeof value === 'string' && Number.isFinite(Date.parse(value)));
const shipmentStatuses=['preparing','shipped','in_transit','delivered','exception','returned','cancelled'];
const invoiceStatuses=['draft','issued','paid','cancelled'];
export function createApp(db, { ingestSecret, featurePin = '1122', passwordsDisabled = false, defaultUserId = 'selman' } = {}) {
  return createServer(async (req, res) => {
    const send = (status, result) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(result)); };
    const sendPublic = async (pathname) => {
      const [filename, contentType] = publicFiles.get(pathname);
      const content = await readFile(join(publicRoot, filename));
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'no-referrer',
        'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
      });
      res.end(content);
    };
    try {
      const url = new URL(req.url, 'http://localhost');
      let requestHostname='';
      try { requestHostname=new URL(`http://${req.headers.host ?? ''}`).hostname; } catch {}
      const localPasswordBypass=passwordsDisabled&&['127.0.0.1','localhost','::1'].includes(requestHostname);
      if (req.method === 'GET' && url.pathname === '/health') {
        const worker=db.prepare("SELECT status,last_seen_at FROM service_heartbeats WHERE service='worker'").get();
        const workerFresh=worker&&Date.now()-new Date(worker.last_seen_at).getTime()<5000;
        return send(workerFresh?200:503,{status:workerFresh?'ok':'degraded',api:'ok',worker:workerFresh?'ok':worker?.status??'missing',database:'sqlite',lastWorkerSeenAt:worker?.last_seen_at??null});
      }
      if (req.method === 'GET' && publicFiles.has(url.pathname)) return await sendPublic(url.pathname);
      if (req.headers.origin) {
        const origin = new URL(req.headers.origin);
        if (!['http:','https:'].includes(origin.protocol) || origin.host !== req.headers.host) fail(403, 'Farklı kaynaktan API erişimi kapalı');
      }
      if (req.method === 'GET' && url.pathname === '/api/runtime') return send(200,{passwordsDisabled:localPasswordBypass,users:localPasswordBypass?db.prepare('SELECT id,name FROM users WHERE active=1 ORDER BY name').all():[]});
      const hook = url.pathname.match(/^\/internal\/accounts\/([a-zA-Z0-9_-]+)\/order-(created|updated|cancelled|restarted)$/);
      if (req.method === 'POST' && hook) {
        if (!ingestSecret || ingestSecret.length < 32) fail(503, 'Olay alımı yapılandırılmamış');
        const { raw, json } = await body(req);
        const timestamp = req.headers['x-timestamp'];
        const signature = req.headers['x-signature'];
        if (typeof timestamp !== 'string' || !/^\d{13}$/.test(timestamp) || Math.abs(Date.now() - Number(timestamp)) > 300000 || typeof signature !== 'string' || !/^[a-f0-9]{64}$/.test(signature)) fail(401, 'Geçersiz olay imzası');
        const expected = createHmac('sha256', ingestSecret).update(`${timestamp}.${url.pathname}.`).update(raw).digest();
        if (!timingSafeEqual(expected, Buffer.from(signature, 'hex'))) fail(401, 'Geçersiz olay imzası');
        const result = enqueueOrderEvent(db,hook[1],json,`order.${hook[2]}`);
        return send(result.duplicate?200:202,result);
      }
      const token = /^Bearer (\S+)$/.exec(req.headers.authorization ?? '')?.[1];
      const requestedLocalUser=localPasswordBypass&&identifier(req.headers['x-local-user'])?req.headers['x-local-user']:defaultUserId;
      const user = localPasswordBypass
        ? db.prepare('SELECT id,name FROM users WHERE id=? AND active=1').get(requestedLocalUser) ?? db.prepare('SELECT id,name FROM users WHERE id=? AND active=1').get(defaultUserId) ?? db.prepare('SELECT id,name FROM users WHERE active=1 ORDER BY rowid LIMIT 1').get()
        : token && db.prepare('SELECT id,name FROM users WHERE token_hash=? AND active=1').get(hash(token));
      if (!user) fail(401, 'Kimlik doğrulama gerekli');
      const requirePermission = (brand, permission) => { if (!permitted(db, user, brand, permission)) fail(403, 'Yetki yok'); };
      if (req.method === 'GET' && url.pathname === '/api/me') {
        const grants = db.prepare('SELECT brand,permission FROM grants WHERE user_id=? ORDER BY brand,permission').all(user.id);
        const knownBrands = db.prepare(`SELECT id AS brand FROM brands WHERE active=1 UNION SELECT brand FROM accounts UNION SELECT brand FROM rules UNION SELECT brand FROM tasks UNION SELECT brand FROM audit WHERE brand <> '*' ORDER BY brand`).all().map(row => row.brand);
        const grantedBrands = grants.filter(grant => grant.brand !== '*').map(grant => grant.brand);
        const brands = [...new Set([...knownBrands, ...grantedBrands])].filter(brand => permissions.some(permission => permitted(db,user,brand,permission)));
        return send(200, { user, grants, brands });
      }
      if (req.method === 'GET' && url.pathname === '/api/feature-access') {
        return send(200,{items:db.prepare('SELECT feature,unlocked,updated_at FROM feature_access WHERE user_id=? ORDER BY feature').all(user.id)});
      }
      const featureRoute = url.pathname.match(/^\/api\/feature-access\/([a-zA-Z0-9_.:@/-]+)\/(unlock|lock)$/);
      if (req.method === 'POST' && featureRoute) {
        const feature = featureRoute[1], unlock = featureRoute[2] === 'unlock';
        if (!identifier(feature) || feature.length > 80) fail(400,'Geçersiz klasör');
        if (unlock && !localPasswordBypass) {
          const { json: input } = await body(req);
          if (String(input.pin ?? '') !== String(featurePin)) fail(403,'Kilit kodu hatalı');
        }
        const before = db.prepare('SELECT unlocked FROM feature_access WHERE user_id=? AND feature=?').get(user.id,feature);
        const now = new Date().toISOString();
        transaction(db, () => {
          db.prepare('INSERT INTO feature_access VALUES(?,?,?,?) ON CONFLICT(user_id,feature) DO UPDATE SET unlocked=excluded.unlocked,updated_at=excluded.updated_at').run(user.id,feature,Number(unlock),now);
          audit(db,user.id,'*',unlock ? 'feature.unlocked':'feature.locked',before ?? null,{feature,unlocked:unlock});
        });
        return send(200,{feature,unlocked:unlock});
      }
      if (req.method === 'GET' && url.pathname === '/api/overview') {
        const brand = url.searchParams.get('brand');
        if (!identifier(brand)) fail(400,'Marka gerekli');
        if (!permissions.some(permission => permitted(db,user,brand,permission))) fail(403,'Yetki yok');
        const count = (permission, table, extra = '') => permitted(db,user,brand,permission) ? Number(db.prepare(`SELECT COUNT(*) AS total FROM ${table} WHERE brand=?${extra}`).get(brand).total) : null;
        const orderCount = permitted(db,user,brand,'orders.read') ? Number(db.prepare("SELECT COUNT(*) AS total FROM order_cache o JOIN accounts a ON a.id=o.account WHERE a.brand=? AND o.status='open'").get(brand).total) : null;
        return send(200,{brand,counts:{
          orders:orderCount, tasks:count('tasks.read','tasks'," AND status IN ('pending','in_progress','blocked')"),
          customers:count('customers.read','customers'," AND status='active'"), products:count('products.read','products'," AND status='active'"),
          stockPending:count('inventory.read','stock_positions'," AND verification_status='unverified'"), production:count('production.read','production_jobs'," AND status NOT IN ('completed','cancelled')"),
          shipping:count('shipping.read','shipments'," AND status IN ('preparing','shipped','in_transit','exception')"), invoicesDue:count('finance.read','invoices'," AND status='issued'")
        }});
      }
      if (req.method === 'GET' && ['/api/customers','/api/products','/api/quotes','/api/production'].includes(url.pathname)) {
        const brand = url.searchParams.get('brand');
        if (!identifier(brand)) fail(400,'Marka gerekli');
        const resource = url.pathname.split('/').pop();
        const permission = resource === 'production' ? 'production.read' : `${resource}.read`;
        requirePermission(brand,permission);
        const limit = Number(url.searchParams.get('limit') ?? 100), offset = Number(url.searchParams.get('offset') ?? 0);
        if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isSafeInteger(offset) || offset < 0) fail(400,'Geçersiz sayfalama');
        const search = String(url.searchParams.get('q') ?? '').trim().slice(0,100);
        const pattern = `%${search}%`;
        const sql = {
          customers:`SELECT * FROM customers WHERE brand=? AND (?='' OR name LIKE ? OR COALESCE(email,'') LIKE ? OR COALESCE(phone,'') LIKE ?) ORDER BY updated_at DESC LIMIT ? OFFSET ?`,
          products:`SELECT p.*,s.on_hand,s.reserved,s.verification_status,s.location FROM products p LEFT JOIN stock_positions s ON s.product_id=p.id WHERE p.brand=? AND (?='' OR p.name LIKE ? OR p.sku LIKE ?) ORDER BY p.updated_at DESC LIMIT ? OFFSET ?`,
          quotes:`SELECT q.*,c.name AS customer_name FROM quotes q LEFT JOIN customers c ON c.id=q.customer_id WHERE q.brand=? AND (?='' OR q.number LIKE ? OR COALESCE(c.name,'') LIKE ?) ORDER BY q.updated_at DESC LIMIT ? OFFSET ?`,
          production:`SELECT p.*,pr.name AS product_name,u.name AS assignee_name FROM production_jobs p LEFT JOIN products pr ON pr.id=p.product_id LEFT JOIN users u ON u.id=p.assignee WHERE p.brand=? AND (?='' OR p.code LIKE ? OR COALESCE(pr.name,'') LIKE ?) ORDER BY p.updated_at DESC LIMIT ? OFFSET ?`
        }[resource];
        const args = resource === 'customers' ? [brand,search,pattern,pattern,pattern,limit,offset] : [brand,search,pattern,pattern,limit,offset];
        return send(200,{items:db.prepare(sql).all(...args),limit,offset});
      }
      if (req.method === 'GET' && url.pathname === '/api/inventory') {
        const brand = url.searchParams.get('brand');
        if (!identifier(brand)) fail(400,'Marka gerekli');
        requirePermission(brand,'inventory.read');
        const items = db.prepare(`SELECT s.*,p.sku,p.name,p.unit,(s.on_hand-s.reserved) AS available FROM stock_positions s JOIN products p ON p.id=s.product_id WHERE s.brand=? ORDER BY p.name,s.location`).all(brand);
        return send(200,{items});
      }
      if(req.method==='GET'&&url.pathname==='/api/inventory/movements') {
        const brand=url.searchParams.get('brand');if(!identifier(brand))fail(400,'Marka gerekli');requirePermission(brand,'inventory.read');
        const items=db.prepare(`SELECT m.*,p.sku,p.name,s.location,u.name AS actor_name FROM stock_movements m
          JOIN stock_positions s ON s.id=m.position_id JOIN products p ON p.id=s.product_id LEFT JOIN users u ON u.id=m.actor
          WHERE m.brand=? ORDER BY m.created_at DESC LIMIT 200`).all(brand);
        return send(200,{items});
      }
      if(req.method==='GET'&&url.pathname==='/api/inventory/reservations') {
        const brand=url.searchParams.get('brand');if(!identifier(brand))fail(400,'Marka gerekli');requirePermission(brand,'inventory.read');
        const status=String(url.searchParams.get('status')??'').trim();if(status&&!['active','released','consumed','cancelled'].includes(status))fail(400,'Geçersiz rezervasyon durumu');
        const items=db.prepare(`SELECT r.*,p.sku,p.name,p.unit,s.location,o.external_id AS external_order_id,a.id AS account_id
          FROM stock_reservations r JOIN stock_positions s ON s.id=r.position_id JOIN products p ON p.id=s.product_id
          LEFT JOIN order_cache o ON o.id=r.order_id LEFT JOIN accounts a ON a.id=o.account
          WHERE r.brand=? AND (?='' OR r.status=?) ORDER BY r.created_at DESC LIMIT 200`).all(brand,status,status);
        return send(200,{items});
      }
      if(req.method==='POST'&&url.pathname==='/api/inventory/reservations') {
        const {json:input}=await body(req);
        if(!identifier(input.brand)||!identifier(input.positionId)||!(input.orderId===null||input.orderId===undefined||input.orderId===''||identifier(input.orderId))||!finiteNumber(input.quantity)||input.quantity<=0)fail(400,'Geçersiz rezervasyon');
        requirePermission(input.brand,'inventory.write');
        const position=db.prepare('SELECT * FROM stock_positions WHERE id=? AND brand=?').get(input.positionId,input.brand);
        if(!position)fail(404,'Stok konumu bulunamadı');
        if(position.verification_status!=='verified')fail(409,'Sayımı doğrulanmamış stok rezerve edilemez');
        if(input.orderId&&!db.prepare('SELECT 1 FROM order_cache o JOIN accounts a ON a.id=o.account WHERE o.id=? AND a.brand=? AND o.status<>?').get(input.orderId,input.brand,'cancelled'))fail(404,'Açık sipariş bulunamadı');
        if(position.on_hand-position.reserved<input.quantity)fail(409,'Kullanılabilir stok yetersiz');
        const id=randomUUID(),now=new Date().toISOString();
        transaction(db,()=>{db.prepare('INSERT INTO stock_reservations(id,brand,position_id,order_id,quantity,status,created_at,released_at) VALUES(?,?,?,?,?,?,?,NULL)').run(id,input.brand,position.id,input.orderId||null,input.quantity,'active',now);db.prepare('UPDATE stock_positions SET reserved=reserved+?,updated_at=? WHERE id=?').run(input.quantity,now,position.id);audit(db,user.id,input.brand,'inventory.reserved',null,{id,positionId:position.id,orderId:input.orderId||null,quantity:input.quantity});});
        return send(201,{id,status:'active'});
      }
      const reservationRoute=url.pathname.match(/^\/api\/inventory\/reservations\/([a-f0-9-]+)\/release$/);
      if(req.method==='POST'&&reservationRoute) {
        const reservation=db.prepare('SELECT * FROM stock_reservations WHERE id=?').get(reservationRoute[1]);
        if(!reservation)fail(404,'Rezervasyon bulunamadı');requirePermission(reservation.brand,'inventory.write');
        if(reservation.status!=='active')fail(409,'Yalnız aktif rezervasyon bırakılabilir');
        const now=new Date().toISOString();
        transaction(db,()=>{db.prepare("UPDATE stock_reservations SET status='released',released_at=? WHERE id=?").run(now,reservation.id);db.prepare('UPDATE stock_positions SET reserved=MAX(0,reserved-?),updated_at=? WHERE id=?').run(reservation.quantity,now,reservation.position_id);audit(db,user.id,reservation.brand,'inventory.reservation_released',{id:reservation.id,status:'active'},{id:reservation.id,status:'released'});});
        return send(200,{id:reservation.id,status:'released'});
      }
      if(req.method==='GET'&&url.pathname==='/api/material-needs') {
        const brand=url.searchParams.get('brand');if(!identifier(brand))fail(400,'Marka gerekli');requirePermission(brand,'production.read');
        const items=db.prepare(`WITH demand AS (
          SELECT bl.component_product_id AS product_id,SUM((j.quantity/b.quantity)*bl.quantity*(1+(bl.waste_percent/100.0))) AS required
          FROM production_jobs j JOIN bills_of_materials b ON b.product_id=j.product_id AND b.brand=j.brand AND b.status='active'
          JOIN bill_of_material_lines bl ON bl.bom_id=b.id
          WHERE j.brand=? AND j.status IN ('planned','in_progress','quality_check') GROUP BY bl.component_product_id
        ),stock AS (SELECT product_id,SUM(on_hand) AS on_hand,SUM(reserved) AS reserved FROM stock_positions WHERE brand=? GROUP BY product_id)
        SELECT p.id,p.sku,p.name,p.unit,d.required,COALESCE(s.on_hand,0) AS on_hand,COALESCE(s.reserved,0) AS reserved,
          MAX(0,d.required-(COALESCE(s.on_hand,0)-COALESCE(s.reserved,0))) AS shortage
        FROM demand d JOIN products p ON p.id=d.product_id LEFT JOIN stock s ON s.product_id=d.product_id ORDER BY shortage DESC,p.name`).all(brand,brand);
        return send(200,{items});
      }
      if(req.method==='GET'&&url.pathname==='/api/boms') {
        const brand=url.searchParams.get('brand');if(!identifier(brand))fail(400,'Marka gerekli');requirePermission(brand,'production.read');
        const items=db.prepare(`SELECT b.*,p.sku,p.name,(SELECT COUNT(*) FROM bill_of_material_lines l WHERE l.bom_id=b.id) AS line_count
          FROM bills_of_materials b JOIN products p ON p.id=b.product_id WHERE b.brand=? ORDER BY b.updated_at DESC`).all(brand);
        return send(200,{items});
      }
      if(req.method==='POST'&&url.pathname==='/api/boms') {
        const {json:input}=await body(req);
        if(!identifier(input.brand)||!identifier(input.productId)||!shortText(input.code,1,80)||!finiteNumber(input.quantity)||input.quantity<=0||!Array.isArray(input.lines)||!input.lines.length||input.lines.length>100||!optionalText(input.notes,1000))fail(400,'Geçersiz ürün reçetesi');
        requirePermission(input.brand,'production.write');
        if(!db.prepare('SELECT 1 FROM products WHERE id=? AND brand=?').get(input.productId,input.brand))fail(404,'Ürün bulunamadı');
        for(const line of input.lines)if(!identifier(line.productId)||!finiteNumber(line.quantity)||line.quantity<=0||!finiteNumber(line.wastePercent??0)||line.wastePercent<0||line.wastePercent>100||!db.prepare('SELECT 1 FROM products WHERE id=? AND brand=?').get(line.productId,input.brand))fail(400,'Geçersiz reçete kalemi');
        const id=randomUUID(),now=new Date().toISOString();
        transaction(db,()=>{db.prepare('INSERT INTO bills_of_materials(id,brand,product_id,code,revision,quantity,status,notes,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)').run(id,input.brand,input.productId,input.code.trim(),1,input.quantity,'active',input.notes?.trim()||null,now,now);const insert=db.prepare('INSERT INTO bill_of_material_lines(id,bom_id,component_product_id,quantity,unit,waste_percent,created_at) VALUES(?,?,?,?,?,?,?)');for(const line of input.lines)insert.run(randomUUID(),id,line.productId,line.quantity,line.unit||'adet',line.wastePercent??0,now);audit(db,user.id,input.brand,'bom.created',null,{id,code:input.code,productId:input.productId,lineCount:input.lines.length});});
        return send(201,{id,status:'active'});
      }
      if(req.method==='GET'&&url.pathname==='/api/purchase-requests') {
        const brand=url.searchParams.get('brand');if(!identifier(brand))fail(400,'Marka gerekli');requirePermission(brand,'inventory.read');
        const items=db.prepare(`SELECT r.*,c.name AS supplier_name,u.name AS requested_by_name,(SELECT COUNT(*) FROM purchase_request_lines l WHERE l.purchase_request_id=r.id) AS line_count,
          (SELECT COALESCE(SUM(l.quantity*COALESCE(l.estimated_unit_cost,0)),0) FROM purchase_request_lines l WHERE l.purchase_request_id=r.id) AS estimated_total
          FROM purchase_requests r LEFT JOIN customers c ON c.id=r.supplier_id LEFT JOIN users u ON u.id=r.requested_by WHERE r.brand=? ORDER BY r.updated_at DESC LIMIT 200`).all(brand);
        return send(200,{items});
      }
      if(req.method==='POST'&&url.pathname==='/api/purchase-requests') {
        const {json:input}=await body(req);
        if(!identifier(input.brand)||!shortText(input.number,1,80)||!(input.supplierId===null||input.supplierId===undefined||input.supplierId===''||identifier(input.supplierId))||!['low','normal','high','urgent'].includes(input.priority??'normal')||!optionalDate(input.neededAt)||!optionalText(input.notes,1000)||!Array.isArray(input.lines)||!input.lines.length||input.lines.length>100)fail(400,'Geçersiz satın alma talebi');
        requirePermission(input.brand,'inventory.write');
        if(input.supplierId&&!db.prepare("SELECT 1 FROM customers WHERE id=? AND brand=? AND kind='supplier'").get(input.supplierId,input.brand))fail(404,'Tedarikçi bulunamadı');
        for(const line of input.lines)if(!identifier(line.productId)||!finiteNumber(line.quantity)||line.quantity<=0||!(line.estimatedUnitCost===null||line.estimatedUnitCost===undefined||(finiteNumber(line.estimatedUnitCost)&&line.estimatedUnitCost>=0))||!db.prepare('SELECT 1 FROM products WHERE id=? AND brand=?').get(line.productId,input.brand))fail(400,'Geçersiz satın alma kalemi');
        const id=randomUUID(),now=new Date().toISOString();
        transaction(db,()=>{db.prepare('INSERT INTO purchase_requests(id,brand,number,supplier_id,status,priority,needed_at,notes,requested_by,approved_by,approved_at,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id,input.brand,input.number.trim(),input.supplierId||null,'draft',input.priority??'normal',input.neededAt?new Date(input.neededAt).toISOString():null,input.notes?.trim()||null,user.id,null,null,now,now);const insert=db.prepare('INSERT INTO purchase_request_lines(id,purchase_request_id,product_id,quantity,unit,estimated_unit_cost,currency,notes) VALUES(?,?,?,?,?,?,?,?)');for(const line of input.lines)insert.run(randomUUID(),id,line.productId,line.quantity,line.unit||'adet',line.estimatedUnitCost??null,line.currency??'TRY',line.notes??null);audit(db,user.id,input.brand,'purchase_request.created',null,{id,number:input.number,lineCount:input.lines.length});});
        return send(201,{id,status:'draft'});
      }
      const purchaseRoute=url.pathname.match(/^\/api\/purchase-requests\/([a-f0-9-]+)$/);
      if(req.method==='PATCH'&&purchaseRoute) {
        const {json:input}=await body(req),request=db.prepare('SELECT * FROM purchase_requests WHERE id=?').get(purchaseRoute[1]);
        if(!request)fail(404,'Satın alma talebi bulunamadı');requirePermission(request.brand,'inventory.write');
        const transitions={draft:['submitted','cancelled'],submitted:['approved','cancelled'],approved:['ordered','cancelled'],ordered:['received','cancelled'],received:[],cancelled:[]};
        if(!transitions[request.status]?.includes(input.status))fail(409,'Geçersiz satın alma durum geçişi');
        const now=new Date().toISOString(),approved=input.status==='approved';
        transaction(db,()=>{db.prepare('UPDATE purchase_requests SET status=?,approved_by=CASE WHEN ? THEN ? ELSE approved_by END,approved_at=CASE WHEN ? THEN ? ELSE approved_at END,updated_at=? WHERE id=?').run(input.status,Number(approved),user.id,Number(approved),now,now,request.id);audit(db,user.id,request.brand,'purchase_request.status_changed',{id:request.id,status:request.status},{id:request.id,status:input.status});});
        return send(200,{id:request.id,status:input.status});
      }
      if (req.method === 'GET' && url.pathname === '/api/channel-products') {
        const brand=url.searchParams.get('brand'); if(!identifier(brand))fail(400,'Marka gerekli'); requirePermission(brand,'products.read');
        const limit=Number(url.searchParams.get('limit')??100),offset=Number(url.searchParams.get('offset')??0);
        if(!Number.isInteger(limit)||limit<1||limit>100||!Number.isSafeInteger(offset)||offset<0)fail(400,'Geçersiz sayfalama');
        const search=String(url.searchParams.get('q')??'').trim().slice(0,100),pattern=`%${search}%`;
        const where=`a.brand=? AND cp.deleted_at IS NULL AND (?='' OR cp.title LIKE ? OR COALESCE(cp.vendor,'') LIKE ? OR COALESCE(cv.sku,'') LIKE ?)`;
        const filterArgs=[brand,search,pattern,pattern,pattern];
        const items=db.prepare(`SELECT cp.*,a.platform,a.id AS account_label,
          COUNT(cv.id) AS variant_count,
          SUM(CASE WHEN mv.entity_id IS NOT NULL THEN 1 ELSE 0 END) AS mapped_variant_count,
          COALESCE(SUM(cv.inventory_quantity),0) AS inventory_quantity,
          GROUP_CONCAT(DISTINCT NULLIF(cv.sku,'')) AS skus
          FROM channel_products cp JOIN accounts a ON a.id=cp.account_id
          LEFT JOIN channel_variants cv ON cv.channel_product_id=cp.id AND cv.deleted_at IS NULL
          LEFT JOIN mappings mv ON mv.account=a.id AND mv.kind='variant' AND mv.external_id=cv.external_id
          WHERE ${where}
          GROUP BY cp.id ORDER BY cp.source_updated_at DESC,cp.title LIMIT ? OFFSET ?`).all(...filterArgs,limit,offset);
        const total=Number(db.prepare(`SELECT COUNT(DISTINCT cp.id) AS total
          FROM channel_products cp JOIN accounts a ON a.id=cp.account_id
          LEFT JOIN channel_variants cv ON cv.channel_product_id=cp.id AND cv.deleted_at IS NULL
          WHERE ${where}`).get(...filterArgs).total);
        return send(200,{items,limit,offset,total});
      }
      const channelProductRoute=url.pathname.match(/^\/api\/channel-products\/([a-f0-9-]+)$/);
      if(req.method==='GET'&&channelProductRoute) {
        const product=db.prepare(`SELECT cp.*,a.brand,a.platform,a.id AS account_label FROM channel_products cp JOIN accounts a ON a.id=cp.account_id WHERE cp.id=?`).get(channelProductRoute[1]);
        if(!product)fail(404,'Kanal ürünü bulunamadı'); requirePermission(product.brand,'products.read');
        const variants=db.prepare(`SELECT cv.*,p.id AS local_product_id,p.name AS local_product_name,p.sku AS local_product_sku
          FROM channel_variants cv
          LEFT JOIN mappings m ON m.account=cv.account_id AND m.kind='variant' AND m.external_id=cv.external_id
          LEFT JOIN products p ON p.id=m.entity_id
          WHERE cv.channel_product_id=? AND cv.deleted_at IS NULL ORDER BY cv.title,cv.sku`).all(product.id);
        return send(200,{product,variants});
      }
      if (req.method === 'GET' && url.pathname === '/api/shipments') {
        const brand=url.searchParams.get('brand'); if(!identifier(brand))fail(400,'Marka gerekli'); requirePermission(brand,'shipping.read');
        const status=String(url.searchParams.get('status')??'').trim(); if(status&&!shipmentStatuses.includes(status))fail(400,'Geçersiz kargo durumu');
        const search=String(url.searchParams.get('q')??'').trim().slice(0,100),pattern=`%${search}%`;
        const items=db.prepare(`SELECT s.*,o.external_id AS external_order_id,a.id AS account_id FROM shipments s
          LEFT JOIN order_cache o ON o.id=s.order_id LEFT JOIN accounts a ON a.id=o.account
          WHERE s.brand=? AND (?='' OR s.status=?) AND (?='' OR COALESCE(s.tracking_number,'') LIKE ? OR s.carrier LIKE ? OR COALESCE(o.external_id,'') LIKE ?)
          ORDER BY s.updated_at DESC LIMIT 100`).all(brand,status,status,search,pattern,pattern,pattern);
        return send(200,{items});
      }
      if (req.method === 'GET' && url.pathname === '/api/invoices') {
        const brand=url.searchParams.get('brand'); if(!identifier(brand))fail(400,'Marka gerekli'); requirePermission(brand,'finance.read');
        const status=String(url.searchParams.get('status')??'').trim(); if(status&&!invoiceStatuses.includes(status))fail(400,'Geçersiz fatura durumu');
        const search=String(url.searchParams.get('q')??'').trim().slice(0,100),pattern=`%${search}%`;
        const items=db.prepare(`SELECT i.*,c.name AS customer_name,o.external_id AS external_order_id,
          COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.invoice_id=i.id AND p.status='completed' AND p.direction='incoming'),0) AS paid_total
          FROM invoices i LEFT JOIN customers c ON c.id=i.customer_id LEFT JOIN order_cache o ON o.id=i.order_id
          WHERE i.brand=? AND (?='' OR i.status=?) AND (?='' OR i.number LIKE ? OR COALESCE(c.name,'') LIKE ? OR COALESCE(o.external_id,'') LIKE ?)
          ORDER BY i.updated_at DESC LIMIT 100`).all(brand,status,status,search,pattern,pattern,pattern);
        return send(200,{items});
      }
      if (req.method === 'GET' && url.pathname === '/api/payments') {
        const brand=url.searchParams.get('brand'); if(!identifier(brand))fail(400,'Marka gerekli'); requirePermission(brand,'finance.read');
        const search=String(url.searchParams.get('q')??'').trim().slice(0,100),pattern=`%${search}%`;
        const items=db.prepare(`SELECT p.*,i.number AS invoice_number,c.name AS customer_name FROM payments p
          LEFT JOIN invoices i ON i.id=p.invoice_id LEFT JOIN customers c ON c.id=i.customer_id
          WHERE p.brand=? AND (?='' OR COALESCE(p.reference,'') LIKE ? OR p.method LIKE ? OR COALESCE(i.number,'') LIKE ? OR COALESCE(c.name,'') LIKE ?)
          ORDER BY p.paid_at DESC LIMIT 100`).all(brand,search,pattern,pattern,pattern,pattern);
        return send(200,{items});
      }
      if(req.method==='GET'&&url.pathname==='/api/expenses') {
        const brand=url.searchParams.get('brand');if(!identifier(brand))fail(400,'Marka gerekli');requirePermission(brand,'finance.read');
        const items=db.prepare(`SELECT e.*,c.name AS supplier_name,u.name AS created_by_name FROM expenses e LEFT JOIN customers c ON c.id=e.supplier_id LEFT JOIN users u ON u.id=e.created_by WHERE e.brand=? ORDER BY e.expense_at DESC LIMIT 200`).all(brand);return send(200,{items});
      }
      if(req.method==='POST'&&url.pathname==='/api/expenses') {
        const {json:input}=await body(req);
        if(!identifier(input.brand)||!shortText(input.category,1,80)||!(input.supplierId===null||input.supplierId===undefined||input.supplierId===''||identifier(input.supplierId))||!optionalText(input.number,100)||!/^[A-Z]{3}$/.test(input.currency??'TRY')||!finiteNumber(input.amount)||input.amount<=0||!finiteNumber(input.taxAmount??0)||(input.taxAmount??0)<0||!optionalDate(input.expenseAt)||!optionalDate(input.dueAt)||!optionalText(input.note,500))fail(400,'Geçersiz gider');
        requirePermission(input.brand,'finance.write');if(input.supplierId&&!db.prepare('SELECT 1 FROM customers WHERE id=? AND brand=?').get(input.supplierId,input.brand))fail(404,'Tedarikçi bulunamadı');
        const id=randomUUID(),now=new Date().toISOString(),expenseAt=input.expenseAt?new Date(input.expenseAt).toISOString():now;transaction(db,()=>{db.prepare('INSERT INTO expenses(id,brand,category,supplier_id,number,currency,amount,tax_amount,status,expense_at,due_at,note,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id,input.brand,input.category.trim(),input.supplierId||null,input.number?.trim()||null,input.currency??'TRY',input.amount,input.taxAmount??0,'recorded',expenseAt,input.dueAt?new Date(input.dueAt).toISOString():null,input.note?.trim()||null,user.id,now,now);audit(db,user.id,input.brand,'expense.created',null,{id,category:input.category,amount:input.amount,currency:input.currency??'TRY'});});return send(201,{id,status:'recorded'});
      }
      if(req.method==='GET'&&url.pathname==='/api/reconciliation') {
        const brand=url.searchParams.get('brand');if(!identifier(brand))fail(400,'Marka gerekli');requirePermission(brand,'finance.read');
        const items=db.prepare('SELECT r.*,u.name AS reconciled_by_name FROM reconciliation_items r LEFT JOIN users u ON u.id=r.reconciled_by WHERE r.brand=? ORDER BY r.updated_at DESC LIMIT 200').all(brand);
        const openInvoices=db.prepare(`SELECT i.id,i.number,i.currency,i.total,COALESCE(SUM(CASE WHEN p.direction='incoming' AND p.status='completed' THEN p.amount ELSE 0 END),0) AS paid_total,c.name AS customer_name
          FROM invoices i LEFT JOIN payments p ON p.invoice_id=i.id LEFT JOIN customers c ON c.id=i.customer_id WHERE i.brand=? AND i.status NOT IN ('paid','cancelled') GROUP BY i.id ORDER BY i.due_at`).all(brand);
        return send(200,{items,openInvoices});
      }
      const reconciliationRoute=url.pathname.match(/^\/api\/reconciliation\/([a-f0-9-]+)\/resolve$/);
      if(req.method==='POST'&&reconciliationRoute) {
        const item=db.prepare('SELECT * FROM reconciliation_items WHERE id=?').get(reconciliationRoute[1]);if(!item)fail(404,'Mutabakat kaydı bulunamadı');requirePermission(item.brand,'finance.write');if(item.status==='matched')fail(409,'Kayıt zaten eşleşmiş');const now=new Date().toISOString();transaction(db,()=>{db.prepare("UPDATE reconciliation_items SET status='matched',reconciled_by=?,reconciled_at=?,updated_at=? WHERE id=?").run(user.id,now,now,item.id);audit(db,user.id,item.brand,'reconciliation.resolved',{id:item.id,status:item.status},{id:item.id,status:'matched'});});return send(200,{id:item.id,status:'matched'});
      }
      if(req.method==='GET'&&url.pathname==='/api/finance/summary') {
        const brand=url.searchParams.get('brand');if(!identifier(brand))fail(400,'Marka gerekli');if(!permitted(db,user,brand,'finance.read')&&!permitted(db,user,brand,'finance.summary'))fail(403,'Yetki yok');
        const incoming=Number(db.prepare("SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE brand=? AND direction='incoming' AND status='completed'").get(brand).total),outgoing=Number(db.prepare("SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE brand=? AND direction='outgoing' AND status='completed'").get(brand).total),expenses=Number(db.prepare("SELECT COALESCE(SUM(amount),0) AS total FROM expenses WHERE brand=? AND status='recorded'").get(brand).total),receivables=Number(db.prepare(`SELECT COALESCE(SUM(MAX(0,i.total-COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.invoice_id=i.id AND p.direction='incoming' AND p.status='completed'),0))),0) AS total FROM invoices i WHERE i.brand=? AND i.status NOT IN ('paid','cancelled')`).get(brand).total);
        return send(200,{brand,incoming,outgoing,expenses,receivables,cashNet:incoming-outgoing-expenses});
      }
      if(req.method==='GET'&&url.pathname==='/api/reports/sales') {
        const brand=url.searchParams.get('brand');if(!identifier(brand))fail(400,'Marka gerekli');requirePermission(brand,'orders.read');
        const summary=db.prepare(`SELECT COUNT(*) AS order_count,COALESCE(SUM(CASE WHEN o.status<>'cancelled' THEN o.grand_total ELSE 0 END),0) AS gross_total,COUNT(DISTINCT CASE WHEN o.customer_id IS NOT NULL THEN o.customer_id END) AS customer_count,COALESCE(AVG(CASE WHEN o.status<>'cancelled' THEN o.grand_total END),0) AS average_total FROM order_cache o JOIN accounts a ON a.id=o.account WHERE a.brand=?`).get(brand);
        const channels=db.prepare(`SELECT a.id AS account,a.platform,COUNT(*) AS order_count,COALESCE(SUM(CASE WHEN o.status<>'cancelled' THEN o.grand_total ELSE 0 END),0) AS gross_total,SUM(CASE WHEN o.status='cancelled' THEN 1 ELSE 0 END) AS cancelled_count FROM accounts a LEFT JOIN order_cache o ON o.account=a.id WHERE a.brand=? GROUP BY a.id,a.platform ORDER BY gross_total DESC`).all(brand);
        return send(200,{summary,channels});
      }
      if(req.method==='GET'&&url.pathname==='/api/reports/inventory') {
        const brand=url.searchParams.get('brand');if(!identifier(brand))fail(400,'Marka gerekli');requirePermission(brand,'inventory.read');
        const summary=db.prepare(`SELECT COUNT(DISTINCT product_id) AS product_count,COALESCE(SUM(on_hand),0) AS on_hand,COALESCE(SUM(reserved),0) AS reserved,COALESCE(SUM(on_hand-reserved),0) AS available,SUM(CASE WHEN verification_status<>'verified' THEN 1 ELSE 0 END) AS unverified_count FROM stock_positions WHERE brand=?`).get(brand);
        const attention=db.prepare(`SELECT p.sku,p.name,s.location,s.on_hand,s.reserved,(s.on_hand-s.reserved) AS available,s.verification_status FROM stock_positions s JOIN products p ON p.id=s.product_id WHERE s.brand=? AND (s.verification_status<>'verified' OR s.on_hand-s.reserved<=0) ORDER BY s.verification_status,(s.on_hand-s.reserved),p.name LIMIT 100`).all(brand);
        const production=db.prepare(`SELECT status,COUNT(*) AS count FROM production_jobs WHERE brand=? GROUP BY status`).all(brand);
        return send(200,{summary,attention,production});
      }
      if(req.method==='GET'&&url.pathname==='/api/external-operations') {
        const brand=url.searchParams.get('brand');if(!identifier(brand))fail(400,'Marka gerekli');requirePermission(brand,'settings.write');
        const status=String(url.searchParams.get('status')??'').trim(),allowed=['proposed','awaiting_confirmation','queued','executing','succeeded','failed','unknown','cancelled'];if(status&&!allowed.includes(status))fail(400,'Geçersiz dış işlem durumu');
        const items=db.prepare(`SELECT o.*,u.name AS confirmed_by_name,a.platform AS target_platform FROM external_operations o LEFT JOIN users u ON u.id=o.confirmed_by LEFT JOIN accounts a ON a.id=o.target_account WHERE o.brand=? AND (?='' OR o.status=?) ORDER BY o.updated_at DESC LIMIT 200`).all(brand,status,status).map(item=>({...item,summary:JSON.parse(item.summary_json)}));
        return send(200,{items});
      }
      if(req.method==='POST'&&url.pathname==='/api/external-operations') {
        const {json:input}=await body(req);const summaryJson=JSON.stringify(input.summary??{});
        if(!identifier(input.brand)||!shortText(input.kind,1,80)||!(input.targetAccount===undefined||input.targetAccount===null||input.targetAccount===''||identifier(input.targetAccount))||!shortText(input.idempotencyKey,8,200)||!input.summary||typeof input.summary!=='object'||Array.isArray(input.summary)||summaryJson.length>10000)fail(400,'Geçersiz dış işlem');
        requirePermission(input.brand,'settings.write');if(input.targetAccount&&!db.prepare('SELECT 1 FROM accounts WHERE id=? AND brand=?').get(input.targetAccount,input.brand))fail(404,'Hedef hesap bulunamadı');
        const previous=db.prepare('SELECT * FROM external_operations WHERE idempotency_key=?').get(input.idempotencyKey);if(previous){if(previous.brand!==input.brand||previous.kind!==input.kind.trim()||(previous.target_account??null)!==(input.targetAccount||null)||previous.summary_json!==summaryJson)fail(409,'İşlem anahtarı farklı içerikle kullanılmış');return send(200,{id:previous.id,status:previous.status,duplicate:true});}
        const id=randomUUID(),now=new Date().toISOString();transaction(db,()=>{db.prepare('INSERT INTO external_operations(id,brand,kind,target_account,idempotency_key,status,summary_json,confirmed_by,confirmed_at,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)').run(id,input.brand,input.kind.trim(),input.targetAccount||null,input.idempotencyKey,'awaiting_confirmation',summaryJson,null,null,now,now);db.prepare('INSERT INTO external_operation_history(id,operation_id,from_status,to_status,actor,detail_json,created_at) VALUES(?,?,?,?,?,?,?)').run(randomUUID(),id,null,'proposed',user.id,null,now);db.prepare('INSERT INTO external_operation_history(id,operation_id,from_status,to_status,actor,detail_json,created_at) VALUES(?,?,?,?,?,?,?)').run(randomUUID(),id,'proposed','awaiting_confirmation',user.id,null,now);audit(db,user.id,input.brand,'external_operation.proposed',null,{id,kind:input.kind,targetAccount:input.targetAccount||null,status:'awaiting_confirmation'});});return send(201,{id,status:'awaiting_confirmation'});
      }
      const externalOperationRoute=url.pathname.match(/^\/api\/external-operations\/([a-f0-9-]+)$/);
      if(req.method==='GET'&&externalOperationRoute) {
        const operation=db.prepare('SELECT * FROM external_operations WHERE id=?').get(externalOperationRoute[1]);if(!operation)fail(404,'Dış işlem bulunamadı');requirePermission(operation.brand,'settings.write');const history=db.prepare('SELECT h.*,u.name AS actor_name FROM external_operation_history h LEFT JOIN users u ON u.id=h.actor WHERE h.operation_id=? ORDER BY h.created_at').all(operation.id);return send(200,{operation:{...operation,summary:JSON.parse(operation.summary_json)},history});
      }
      const externalOperationAction=url.pathname.match(/^\/api\/external-operations\/([a-f0-9-]+)\/(confirm|cancel)$/);
      if(req.method==='POST'&&externalOperationAction) {
        const operation=db.prepare('SELECT * FROM external_operations WHERE id=?').get(externalOperationAction[1]);if(!operation)fail(404,'Dış işlem bulunamadı');requirePermission(operation.brand,'settings.write');const action=externalOperationAction[2],next=action==='confirm'?'queued':'cancelled';
        if(action==='confirm'&&operation.status!=='awaiting_confirmation')fail(409,'Yalnız onay bekleyen işlem kuyruğa alınabilir');if(action==='cancel'&&!['proposed','awaiting_confirmation','queued'].includes(operation.status))fail(409,'Bu işlem iptal edilemez');
        const now=new Date().toISOString();transaction(db,()=>{db.prepare('UPDATE external_operations SET status=?,confirmed_by=CASE WHEN ?=? THEN ? ELSE confirmed_by END,confirmed_at=CASE WHEN ?=? THEN ? ELSE confirmed_at END,updated_at=? WHERE id=?').run(next,action,'confirm',user.id,action,'confirm',now,now,operation.id);db.prepare('INSERT INTO external_operation_history(id,operation_id,from_status,to_status,actor,detail_json,created_at) VALUES(?,?,?,?,?,?,?)').run(randomUUID(),operation.id,operation.status,next,user.id,null,now);audit(db,user.id,operation.brand,`external_operation.${action}ed`,{id:operation.id,status:operation.status},{id:operation.id,status:next});});return send(200,{id:operation.id,status:next});
      }
      if (req.method === 'GET' && url.pathname === '/api/notifications') {
        const brand = url.searchParams.get('brand');
        if (!identifier(brand)) fail(400,'Marka gerekli');
        requirePermission(brand,'notifications.read');
        return send(200,{items:db.prepare('SELECT * FROM notifications WHERE brand=? AND (user_id IS NULL OR user_id=?) ORDER BY created_at DESC LIMIT 100').all(brand,user.id)});
      }
      if (req.method === 'GET' && url.pathname === '/api/preferences') {
        return send(200,{items:db.prepare('SELECT pref_key,value_json,updated_at FROM user_preferences WHERE user_id=? ORDER BY pref_key').all(user.id).map(item=>({...item,value:JSON.parse(item.value_json)}))});
      }
      if (req.method === 'PUT' && url.pathname === '/api/preferences') {
        requirePermission('*','preferences.write');
        const {json:input}=await body(req);
        if (!shortText(input.key,1,80) || !['hidden_modules','pinned_modules','start_module','display_density'].includes(input.key) || input.value === undefined || JSON.stringify(input.value).length > 10000) fail(400,'Geçersiz tercih');
        if(input.key==='hidden_modules'&&(!Array.isArray(input.value)||input.value.length>30||input.value.some(item=>!identifier(item))))fail(400,'Geçersiz görünüm tercihi');
        if(input.key==='display_density'&&!['comfortable','compact'].includes(input.value))fail(400,'Geçersiz yoğunluk tercihi');
        const now=new Date().toISOString();
        db.prepare('INSERT INTO user_preferences VALUES(?,?,?,?) ON CONFLICT(user_id,pref_key) DO UPDATE SET value_json=excluded.value_json,updated_at=excluded.updated_at').run(user.id,input.key,JSON.stringify(input.value),now);
        return send(200,{key:input.key,value:input.value});
      }
      if (req.method === 'POST' && url.pathname === '/api/customers') {
        const {json:input}=await body(req);
        if (!identifier(input.brand) || !shortText(input.name) || !['customer','dealer','supplier'].includes(input.kind ?? 'customer') || !optionalText(input.email,200) || !optionalText(input.phone,50) || !optionalText(input.notes,1000)) fail(400,'Geçersiz müşteri');
        requirePermission(input.brand,'customers.write');
        const now=new Date().toISOString(), id=randomUUID();
        transaction(db,()=>{db.prepare('INSERT INTO customers VALUES(?,?,?,?,?,?,?,?,?,?)').run(id,input.brand,input.name.trim(),input.kind??'customer',input.email?.trim()||null,input.phone?.trim()||null,'active',input.notes?.trim()||null,now,now);audit(db,user.id,input.brand,'customer.created',null,{id,name:input.name});});
        return send(201,{id});
      }
      const customerRoute=url.pathname.match(/^\/api\/customers\/([a-f0-9-]+)$/);
      if(req.method==='GET'&&customerRoute) {
        const customer=db.prepare('SELECT * FROM customers WHERE id=?').get(customerRoute[1]);if(!customer)fail(404,'Müşteri bulunamadı');requirePermission(customer.brand,'customers.read');
        return send(200,{customer,
          identities:db.prepare('SELECT * FROM customer_identities WHERE customer_id=? ORDER BY last_seen_at DESC').all(customer.id),
          notes:db.prepare('SELECT n.*,u.name AS created_by_name FROM customer_notes n LEFT JOIN users u ON u.id=n.created_by WHERE n.customer_id=? ORDER BY n.pinned DESC,n.created_at DESC').all(customer.id),
          interactions:db.prepare('SELECT i.*,u.name AS created_by_name FROM customer_interactions i LEFT JOIN users u ON u.id=i.created_by WHERE i.customer_id=? ORDER BY i.occurred_at DESC LIMIT 100').all(customer.id),
          orders:db.prepare(`SELECT o.id,o.external_id,o.order_number,o.status,o.grand_total,o.currency,o.placed_at,a.id AS account_id FROM order_cache o JOIN accounts a ON a.id=o.account
            WHERE a.brand=? AND (o.customer_id=? OR (? IS NOT NULL AND ?<>'' AND LOWER(o.customer_email)=LOWER(?))) ORDER BY o.placed_at DESC LIMIT 100`).all(customer.brand,customer.id,customer.email,customer.email,customer.email)
        });
      }
      const customerNoteRoute=url.pathname.match(/^\/api\/customers\/([a-f0-9-]+)\/notes$/);
      if(req.method==='POST'&&customerNoteRoute) {
        const {json:input}=await body(req),customer=db.prepare('SELECT * FROM customers WHERE id=?').get(customerNoteRoute[1]);if(!customer)fail(404,'Müşteri bulunamadı');requirePermission(customer.brand,'customers.write');
        if(!shortText(input.body,1,2000)||!(input.pinned===undefined||typeof input.pinned==='boolean'))fail(400,'Geçersiz müşteri notu');
        const id=randomUUID(),now=new Date().toISOString();transaction(db,()=>{db.prepare('INSERT INTO customer_notes(id,brand,customer_id,body,pinned,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)').run(id,customer.brand,customer.id,input.body.trim(),Number(Boolean(input.pinned)),user.id,now,now);audit(db,user.id,customer.brand,'customer.note_created',null,{id,customerId:customer.id,pinned:Boolean(input.pinned)});});return send(201,{id});
      }
      const customerInteractionRoute=url.pathname.match(/^\/api\/customers\/([a-f0-9-]+)\/interactions$/);
      if(req.method==='POST'&&customerInteractionRoute) {
        const {json:input}=await body(req),customer=db.prepare('SELECT * FROM customers WHERE id=?').get(customerInteractionRoute[1]);if(!customer)fail(404,'Müşteri bulunamadı');requirePermission(customer.brand,'customers.write');
        if(!['call','email','message','meeting','note'].includes(input.kind)||!['incoming','outgoing','internal'].includes(input.direction)||!optionalText(input.subject,200)||!shortText(input.summary,1,2000)||!optionalDate(input.occurredAt))fail(400,'Geçersiz müşteri görüşmesi');
        const id=randomUUID(),now=new Date().toISOString(),occurredAt=input.occurredAt?new Date(input.occurredAt).toISOString():now;transaction(db,()=>{db.prepare('INSERT INTO customer_interactions(id,brand,customer_id,kind,direction,subject,summary,occurred_at,created_by,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)').run(id,customer.brand,customer.id,input.kind,input.direction,input.subject?.trim()||null,input.summary.trim(),occurredAt,user.id,now);audit(db,user.id,customer.brand,'customer.interaction_created',null,{id,customerId:customer.id,kind:input.kind,direction:input.direction});});return send(201,{id});
      }
      if (req.method === 'POST' && url.pathname === '/api/products') {
        const {json:input}=await body(req);
        if (!identifier(input.brand) || !shortText(input.sku,1,80) || !shortText(input.name) || !shortText(input.unit??'adet',1,30)) fail(400,'Geçersiz ürün');
        requirePermission(input.brand,'products.write');
        const now=new Date().toISOString(), id=randomUUID(), positionId=randomUUID();
        transaction(db,()=>{db.prepare('INSERT INTO products VALUES(?,?,?,?,?,?,?,?)').run(id,input.brand,input.sku.trim(),input.name.trim(),input.unit??'adet','active',now,now);db.prepare('INSERT INTO stock_positions VALUES(?,?,?,?,?,?,?,?,?,?)').run(positionId,input.brand,id,'unassigned',1000,1000,0,'unverified',now,now);audit(db,user.id,input.brand,'product.created',null,{id,sku:input.sku,openingQuantity:1000,verification:'unverified'});});
        return send(201,{id,positionId,openingQuantity:1000,verificationStatus:'unverified'});
      }
      if (req.method === 'POST' && url.pathname === '/api/inventory/counts') {
        const {json:input}=await body(req);
        if (!identifier(input.brand) || !identifier(input.positionId) || !finiteNumber(input.count) || input.count < 0 || !optionalText(input.note,500)) fail(400,'Geçersiz sayım');
        requirePermission(input.brand,'inventory.write');
        const position=db.prepare('SELECT * FROM stock_positions WHERE id=? AND brand=?').get(input.positionId,input.brand);
        if (!position) fail(404,'Stok konumu bulunamadı');
        if (input.count < position.reserved) fail(409,'Sayım miktarı aktif rezervasyonun altında olamaz');
        const now=new Date().toISOString(), movementId=randomUUID();
        transaction(db,()=>{db.prepare("UPDATE stock_positions SET on_hand=?,verification_status='verified',updated_at=? WHERE id=?").run(input.count,now,position.id);db.prepare('INSERT INTO stock_movements VALUES(?,?,?,?,?,?,?,?,?,?)').run(movementId,input.brand,position.id,'count_adjustment',input.count-position.on_hand,position.on_hand,input.count,user.id,input.note??null,now);audit(db,user.id,input.brand,'inventory.count_approved',{positionId:position.id,onHand:position.on_hand,verificationStatus:position.verification_status},{positionId:position.id,onHand:input.count,verificationStatus:'verified'});});
        return send(201,{id:movementId,positionId:position.id,onHand:input.count,verificationStatus:'verified'});
      }
      if (req.method === 'POST' && url.pathname === '/api/quotes') {
        const {json:input}=await body(req);
        if (!identifier(input.brand) || !shortText(input.number,1,80) || !(input.customerId===null || input.customerId===undefined || identifier(input.customerId)) || !/^[A-Z]{3}$/.test(input.currency??'TRY') || !finiteNumber(input.total) || input.total < 0) fail(400,'Geçersiz teklif');
        requirePermission(input.brand,'quotes.write');
        if (input.customerId && !db.prepare('SELECT 1 FROM customers WHERE id=? AND brand=?').get(input.customerId,input.brand)) fail(400,'Müşteri bulunamadı');
        const now=new Date().toISOString(),id=randomUUID();
        transaction(db,()=>{db.prepare('INSERT INTO quotes VALUES(?,?,?,?,?,?,?,?,?,?)').run(id,input.brand,input.number,input.customerId??null,input.currency??'TRY',input.total,'draft',1,now,now);audit(db,user.id,input.brand,'quote.created',null,{id,number:input.number,total:input.total,currency:input.currency??'TRY'});});
        return send(201,{id});
      }
      if(req.method==='POST'&&url.pathname==='/api/product-mappings') {
        const {json:input}=await body(req);
        const fromLine=identifier(input.orderLineId),fromVariant=identifier(input.accountId)&&identifier(input.externalVariantId);
        if(!identifier(input.brand)||!identifier(input.productId)||(!fromLine&&!fromVariant))fail(400,'Geçersiz ürün eşlemesi');
        requirePermission(input.brand,'products.write');
        const product=db.prepare('SELECT id,sku,name FROM products WHERE id=? AND brand=? AND status=?').get(input.productId,input.brand,'active');
        if(!product)fail(404,'Yerel ürün bulunamadı');
        const line=fromLine?db.prepare(`SELECT l.*,o.account,a.brand FROM order_lines l JOIN order_cache o ON o.id=l.order_id JOIN accounts a ON a.id=o.account WHERE l.id=?`).get(input.orderLineId):null;
        if(fromLine&&(!line||line.brand!==input.brand))fail(404,'Sipariş kalemi bulunamadı');
        const variant=fromVariant?db.prepare(`SELECT cv.external_id,cv.account_id AS account,a.brand FROM channel_variants cv JOIN accounts a ON a.id=cv.account_id WHERE cv.account_id=? AND cv.external_id=?`).get(input.accountId,input.externalVariantId):null;
        if(fromVariant&&(!variant||variant.brand!==input.brand))fail(404,'Kanal varyantı bulunamadı');
        const account=line?.account??variant.account,kind=line?(line.external_variant_id?'variant':'product'):'variant',externalId=line?(line.external_variant_id||line.external_product_id):variant.external_id;
        if(!externalId)fail(409,'Kalemin dış ürün kimliği yok');
        const before=db.prepare('SELECT entity_id FROM mappings WHERE account=? AND kind=? AND external_id=?').get(account,kind,externalId)??null;
        const now=new Date().toISOString();
        transaction(db,()=>{
          db.prepare('INSERT INTO mappings(account,kind,external_id,entity_id) VALUES(?,?,?,?) ON CONFLICT(account,kind,external_id) DO UPDATE SET entity_id=excluded.entity_id').run(account,kind,externalId,product.id);
          if(kind==='variant')db.prepare("UPDATE order_lines SET product_id=?,mapping_status='mapped',updated_at=? WHERE external_variant_id=? AND order_id IN (SELECT id FROM order_cache WHERE account=?)").run(product.id,now,externalId,account);
          else db.prepare("UPDATE order_lines SET product_id=?,mapping_status='mapped',updated_at=? WHERE external_product_id=? AND order_id IN (SELECT id FROM order_cache WHERE account=?)").run(product.id,now,externalId,account);
          audit(db,user.id,input.brand,'product.mapping_updated',before,{account,kind,externalId,productId:product.id,sku:product.sku});
        });
        return send(200,{orderLineId:line?.id??null,productId:product.id,mappingStatus:'mapped'});
      }
      if (req.method === 'POST' && url.pathname === '/api/shipments') {
        const {json:input}=await body(req);
        if(!identifier(input.brand)||!(input.orderId===null||input.orderId===undefined||input.orderId===''||identifier(input.orderId))||!shortText(input.carrier,1,80)||!optionalText(input.trackingNumber,120)||!optionalText(input.serviceCode,60)||!optionalText(input.note,500))fail(400,'Geçersiz gönderi');
        requirePermission(input.brand,'shipping.write');
        if(input.orderId&&!db.prepare('SELECT 1 FROM order_cache o JOIN accounts a ON a.id=o.account WHERE o.id=? AND a.brand=?').get(input.orderId,input.brand))fail(400,'Sipariş bulunamadı');
        const id=randomUUID(),now=new Date().toISOString();
        transaction(db,()=>{db.prepare('INSERT INTO shipments(id,brand,order_id,carrier,tracking_number,status,note,shipped_at,delivered_at,created_at,updated_at,external_id,service_code,last_event_at,external_operation_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id,input.brand,input.orderId||null,input.carrier.trim(),input.trackingNumber?.trim()||null,'preparing',input.note?.trim()||null,null,null,now,now,null,input.serviceCode?.trim()||null,null,null);db.prepare('INSERT INTO shipment_history VALUES(?,?,?,?,?,?)').run(randomUUID(),id,'preparing',input.note?.trim()||null,user.id,now);audit(db,user.id,input.brand,'shipment.created',null,{id,orderId:input.orderId||null,carrier:input.carrier,trackingNumber:input.trackingNumber||null,status:'preparing'});});
        return send(201,{id,status:'preparing'});
      }
      if (req.method === 'POST' && url.pathname === '/api/invoices') {
        const {json:input}=await body(req);
        if(!identifier(input.brand)||!shortText(input.number,1,80)||!(input.orderId===null||input.orderId===undefined||input.orderId===''||identifier(input.orderId))||!(input.customerId===null||input.customerId===undefined||input.customerId===''||identifier(input.customerId))||!/^[A-Z]{3}$/.test(input.currency??'TRY')||!finiteNumber(input.total)||input.total<0||!optionalDate(input.dueAt)||!optionalText(input.note,500)||!['invoice','e_invoice','e_archive','credit_note'].includes(input.documentType??'invoice'))fail(400,'Geçersiz fatura');
        requirePermission(input.brand,'finance.write');
        if(input.orderId&&!db.prepare('SELECT 1 FROM order_cache o JOIN accounts a ON a.id=o.account WHERE o.id=? AND a.brand=?').get(input.orderId,input.brand))fail(400,'Sipariş bulunamadı');
        if(input.customerId&&!db.prepare('SELECT 1 FROM customers WHERE id=? AND brand=?').get(input.customerId,input.brand))fail(400,'Müşteri bulunamadı');
        const id=randomUUID(),now=new Date().toISOString();
        transaction(db,()=>{db.prepare('INSERT INTO invoices(id,brand,number,order_id,customer_id,currency,total,status,due_at,note,issued_at,paid_at,created_at,updated_at,provider,external_id,document_type) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id,input.brand,input.number.trim(),input.orderId||null,input.customerId||null,input.currency??'TRY',input.total,'draft',input.dueAt||null,input.note?.trim()||null,null,null,now,now,null,null,input.documentType??'invoice');audit(db,user.id,input.brand,'invoice.created',null,{id,number:input.number,total:input.total,currency:input.currency??'TRY',status:'draft'});});
        return send(201,{id,status:'draft'});
      }
      if (req.method === 'POST' && url.pathname === '/api/payments') {
        const {json:input}=await body(req);
        if(!identifier(input.brand)||!(input.invoiceId===null||input.invoiceId===undefined||input.invoiceId===''||identifier(input.invoiceId))||!['incoming','outgoing'].includes(input.direction??'incoming')||!/^[A-Z]{3}$/.test(input.currency??'TRY')||!finiteNumber(input.amount)||input.amount<=0||!shortText(input.method,1,60)||!optionalText(input.reference,120)||!optionalDate(input.paidAt)||!['manual','bank','channel','accounting'].includes(input.source??'manual')||!optionalText(input.externalId,160))fail(400,'Geçersiz ödeme');
        requirePermission(input.brand,'finance.write');
        const invoice=input.invoiceId?db.prepare('SELECT * FROM invoices WHERE id=? AND brand=?').get(input.invoiceId,input.brand):null;
        if(input.invoiceId&&!invoice)fail(400,'Fatura bulunamadı'); if(invoice?.status==='cancelled')fail(409,'İptal faturaya ödeme eklenemez');
        const id=randomUUID(),now=new Date().toISOString(),paidAt=input.paidAt?new Date(input.paidAt).toISOString():now;
        transaction(db,()=>{db.prepare('INSERT INTO payments(id,brand,invoice_id,direction,currency,amount,method,reference,status,paid_at,created_at,updated_at,source,external_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id,input.brand,input.invoiceId||null,input.direction??'incoming',input.currency??invoice?.currency??'TRY',input.amount,input.method.trim(),input.reference?.trim()||null,'completed',paidAt,now,now,input.source??'manual',input.externalId??null);if(invoice&&(input.direction??'incoming')==='incoming'){const paid=Number(db.prepare("SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE invoice_id=? AND direction='incoming' AND status='completed'").get(invoice.id).total);if(paid>=invoice.total&&invoice.status!=='paid')db.prepare("UPDATE invoices SET status='paid',paid_at=?,updated_at=? WHERE id=?").run(paidAt,now,invoice.id);}audit(db,user.id,input.brand,'payment.created',null,{id,invoiceId:input.invoiceId||null,direction:input.direction??'incoming',amount:input.amount,currency:input.currency??invoice?.currency??'TRY'});});
        return send(201,{id,status:'completed'});
      }
      if (req.method === 'POST' && url.pathname === '/api/production') {
        const {json:input}=await body(req);
        if (!identifier(input.brand) || !shortText(input.code,1,80) || !(input.productId===null || input.productId===undefined || identifier(input.productId)) || !finiteNumber(input.quantity) || input.quantity <= 0 || !optionalText(input.notes,1000) || !['low','normal','high','urgent'].includes(input.priority??'normal') || !optionalDate(input.dueAt)) fail(400,'Geçersiz üretim işi');
        requirePermission(input.brand,'production.write');
        if (input.productId && !db.prepare('SELECT 1 FROM products WHERE id=? AND brand=?').get(input.productId,input.brand)) fail(400,'Ürün bulunamadı');
        const now=new Date().toISOString(),id=randomUUID();
        transaction(db,()=>{db.prepare('INSERT INTO production_jobs(id,brand,code,product_id,order_id,quantity,status,assignee,notes,created_at,updated_at,priority,due_at,started_at,completed_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id,input.brand,input.code,input.productId??null,input.orderId??null,input.quantity,'planned',input.assignee??null,input.notes??null,now,now,input.priority??'normal',input.dueAt?new Date(input.dueAt).toISOString():null,null,null);db.prepare('INSERT INTO production_operations(id,production_job_id,sequence,name,status,assignee,planned_minutes,actual_minutes,started_at,completed_at,notes) VALUES(?,?,?,?,?,?,?,?,?,?,?)').run(randomUUID(),id,10,'Üretim','pending',input.assignee??null,null,null,null,null,null);audit(db,user.id,input.brand,'production.created',null,{id,code:input.code,quantity:input.quantity,priority:input.priority??'normal'});});
        return send(201,{id});
      }
      const productionRoute=url.pathname.match(/^\/api\/production\/([a-f0-9-]+)$/);
      if(req.method==='GET'&&productionRoute) {
        const job=db.prepare('SELECT j.*,p.name AS product_name,p.sku,u.name AS assignee_name FROM production_jobs j LEFT JOIN products p ON p.id=j.product_id LEFT JOIN users u ON u.id=j.assignee WHERE j.id=?').get(productionRoute[1]);
        if(!job)fail(404,'Üretim işi bulunamadı');requirePermission(job.brand,'production.read');
        const operations=db.prepare('SELECT o.*,u.name AS assignee_name FROM production_operations o LEFT JOIN users u ON u.id=o.assignee WHERE o.production_job_id=? ORDER BY o.sequence').all(job.id);
        return send(200,{job,operations});
      }
      if (req.method === 'PATCH' && productionRoute) {
        const {json:input}=await body(req); const job=db.prepare('SELECT * FROM production_jobs WHERE id=?').get(productionRoute[1]);
        if (!job) fail(404,'Üretim işi bulunamadı'); requirePermission(job.brand,'production.write');
        const transitions={planned:['in_progress','cancelled'],in_progress:['quality_check','cancelled'],quality_check:['completed','in_progress'],completed:[],cancelled:[]};
        if (!transitions[job.status]?.includes(input.status)) fail(409,'Geçersiz durum geçişi');
        const now=new Date().toISOString(); transaction(db,()=>{db.prepare('UPDATE production_jobs SET status=?,updated_at=?,started_at=CASE WHEN ?=? THEN COALESCE(started_at,?) ELSE started_at END,completed_at=CASE WHEN ?=? THEN ? ELSE completed_at END WHERE id=?').run(input.status,now,input.status,'in_progress',now,input.status,'completed',now,job.id);if(input.status==='in_progress')db.prepare("UPDATE production_operations SET status='in_progress',started_at=COALESCE(started_at,?) WHERE production_job_id=? AND status='pending' AND sequence=(SELECT MIN(sequence) FROM production_operations WHERE production_job_id=? AND status='pending')").run(now,job.id,job.id);if(input.status==='quality_check')db.prepare("UPDATE production_operations SET status='completed',completed_at=? WHERE production_job_id=? AND status='in_progress'").run(now,job.id);audit(db,user.id,job.brand,'production.status_changed',{id:job.id,status:job.status},{id:job.id,status:input.status});});
        return send(200,{id:job.id,status:input.status});
      }
      const shipmentRoute=url.pathname.match(/^\/api\/shipments\/([a-f0-9-]+)$/);
      if(req.method==='GET'&&shipmentRoute) {
        const shipment=db.prepare(`SELECT s.*,o.external_id AS external_order_id,o.order_number,a.id AS account_id FROM shipments s LEFT JOIN order_cache o ON o.id=s.order_id LEFT JOIN accounts a ON a.id=o.account WHERE s.id=?`).get(shipmentRoute[1]);
        if(!shipment)fail(404,'Gönderi bulunamadı');requirePermission(shipment.brand,'shipping.read');
        return send(200,{shipment,packages:db.prepare('SELECT * FROM shipment_packages WHERE shipment_id=? ORDER BY rowid').all(shipment.id),events:db.prepare('SELECT * FROM carrier_tracking_events WHERE shipment_id=? ORDER BY occurred_at DESC').all(shipment.id),history:db.prepare('SELECT * FROM shipment_history WHERE shipment_id=? ORDER BY created_at DESC').all(shipment.id)});
      }
      if(req.method==='PATCH'&&shipmentRoute) {
        const {json:input}=await body(req),shipment=db.prepare('SELECT * FROM shipments WHERE id=?').get(shipmentRoute[1]);
        if(!shipment)fail(404,'Gönderi bulunamadı');requirePermission(shipment.brand,'shipping.write');
        const transitions={preparing:['shipped','cancelled'],shipped:['in_transit','delivered','exception','returned'],in_transit:['delivered','exception','returned'],exception:['in_transit','returned','cancelled'],delivered:['returned'],returned:[],cancelled:[]};
        if(!transitions[shipment.status]?.includes(input.status))fail(409,'Geçersiz kargo durum geçişi'); if(!optionalText(input.note,500))fail(400,'Geçersiz not');
        const now=new Date().toISOString(),shippedAt=input.status==='shipped'?(shipment.shipped_at||now):shipment.shipped_at,deliveredAt=input.status==='delivered'?now:shipment.delivered_at;
        transaction(db,()=>{db.prepare('UPDATE shipments SET status=?,note=COALESCE(?,note),shipped_at=?,delivered_at=?,updated_at=? WHERE id=?').run(input.status,input.note?.trim()||null,shippedAt,deliveredAt,now,shipment.id);db.prepare('INSERT INTO shipment_history VALUES(?,?,?,?,?,?)').run(randomUUID(),shipment.id,input.status,input.note?.trim()||null,user.id,now);audit(db,user.id,shipment.brand,'shipment.status_changed',{id:shipment.id,status:shipment.status},{id:shipment.id,status:input.status});});
        return send(200,{id:shipment.id,status:input.status});
      }
      const trackingRoute=url.pathname.match(/^\/api\/shipments\/([a-f0-9-]+)\/tracking-events$/);
      if(req.method==='POST'&&trackingRoute) {
        const {json:input}=await body(req),shipment=db.prepare('SELECT * FROM shipments WHERE id=?').get(trackingRoute[1]);if(!shipment)fail(404,'Gönderi bulunamadı');requirePermission(shipment.brand,'shipping.write');
        if(!shipmentStatuses.includes(input.status)||!optionalText(input.description,500)||!optionalText(input.location,200)||!optionalDate(input.occurredAt)||!optionalText(input.externalEventId,160))fail(400,'Geçersiz takip olayı');
        const id=randomUUID(),now=new Date().toISOString(),occurredAt=input.occurredAt?new Date(input.occurredAt).toISOString():now;
        transaction(db,()=>{db.prepare('INSERT INTO carrier_tracking_events(id,shipment_id,external_event_id,status,description,location,occurred_at,received_at,raw_json) VALUES(?,?,?,?,?,?,?,?,?)').run(id,shipment.id,input.externalEventId||null,input.status,input.description?.trim()||null,input.location?.trim()||null,occurredAt,now,null);db.prepare('UPDATE shipments SET status=?,last_event_at=?,shipped_at=CASE WHEN ?=? THEN COALESCE(shipped_at,?) ELSE shipped_at END,delivered_at=CASE WHEN ?=? THEN ? ELSE delivered_at END,updated_at=? WHERE id=?').run(input.status,occurredAt,input.status,'shipped',occurredAt,input.status,'delivered',occurredAt,now,shipment.id);db.prepare('INSERT INTO shipment_history VALUES(?,?,?,?,?,?)').run(randomUUID(),shipment.id,input.status,input.description?.trim()||null,user.id,now);audit(db,user.id,shipment.brand,'shipment.tracking_event_received',{id:shipment.id,status:shipment.status},{id:shipment.id,status:input.status,eventId:id});});return send(201,{id,status:input.status});
      }
      const invoiceRoute=url.pathname.match(/^\/api\/invoices\/([a-f0-9-]+)$/);
      if(req.method==='PATCH'&&invoiceRoute) {
        const {json:input}=await body(req),invoice=db.prepare('SELECT * FROM invoices WHERE id=?').get(invoiceRoute[1]);
        if(!invoice)fail(404,'Fatura bulunamadı');requirePermission(invoice.brand,'finance.write');
        const transitions={draft:['issued','cancelled'],issued:['paid','cancelled'],paid:[],cancelled:[]};
        if(!transitions[invoice.status]?.includes(input.status))fail(409,'Geçersiz fatura durum geçişi');
        const now=new Date().toISOString(),issuedAt=input.status==='issued'?(invoice.issued_at||now):invoice.issued_at,paidAt=input.status==='paid'?(invoice.paid_at||now):invoice.paid_at;
        transaction(db,()=>{db.prepare('UPDATE invoices SET status=?,issued_at=?,paid_at=?,updated_at=? WHERE id=?').run(input.status,issuedAt,paidAt,now,invoice.id);audit(db,user.id,invoice.brand,'invoice.status_changed',{id:invoice.id,status:invoice.status},{id:invoice.id,status:input.status});});
        return send(200,{id:invoice.id,status:input.status});
      }
      if (req.method === 'GET' && ['/api/orders','/api/tasks','/api/audit'].includes(url.pathname)) {
        const brand = url.searchParams.get('brand');
        if (!identifier(brand)) fail(400, 'Marka gerekli');
        const resource = url.pathname.split('/').pop();
        requirePermission(brand, `${resource}.read`);
        const limit = Number(url.searchParams.get('limit') ?? 50), offset = Number(url.searchParams.get('offset') ?? 0);
        if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isSafeInteger(offset) || offset < 0) fail(400, 'Geçersiz sayfalama');
        const queries = {
          orders: `SELECT o.*, (o.expires_at <= ?) AS stale,
            (SELECT COUNT(*) FROM order_lines l WHERE l.order_id=o.id) AS line_count,
            (SELECT COUNT(*) FROM order_lines l WHERE l.order_id=o.id AND l.mapping_status!='mapped' AND TRIM(COALESCE(l.sku,''))!='') AS unmatched_count,
            (SELECT COUNT(*) FROM tasks t WHERE t.order_id=o.id AND t.status IN ('pending','in_progress','blocked')) AS open_task_count,
            (SELECT s.status FROM shipments s WHERE s.order_id=o.id ORDER BY s.updated_at DESC LIMIT 1) AS shipment_status,
            (SELECT i.status FROM invoices i WHERE i.order_id=o.id ORDER BY i.updated_at DESC LIMIT 1) AS invoice_status
            FROM order_cache o JOIN accounts a ON a.id=o.account WHERE a.brand=? ORDER BY o.rowid DESC LIMIT ? OFFSET ?`,
          tasks: 'SELECT t.*,o.external_id AS external_order_id,o.account,o.status AS order_status,u.name AS assignee_name FROM tasks t JOIN order_cache o ON o.id=t.order_id LEFT JOIN users u ON u.id=t.assignee WHERE t.brand=? ORDER BY t.rowid DESC LIMIT ? OFFSET ?',
          audit: 'SELECT * FROM audit WHERE brand=? ORDER BY rowid DESC LIMIT ? OFFSET ?'
        };
        const args = resource === 'orders' ? [new Date().toISOString(),brand,limit,offset] : [brand,limit,offset];
        return send(200, { items: db.prepare(queries[resource]).all(...args), limit, offset });
      }
      const orderDetailRoute=url.pathname.match(/^\/api\/orders\/([a-f0-9-]+)$/);
      if(req.method==='GET'&&orderDetailRoute) {
        const order=db.prepare('SELECT o.*,a.brand,a.platform FROM order_cache o JOIN accounts a ON a.id=o.account WHERE o.id=?').get(orderDetailRoute[1]);
        if(!order)fail(404,'Sipariş bulunamadı');
        requirePermission(order.brand,'orders.read');
        const can=permission=>permitted(db,user,order.brand,permission);
        return send(200,{order,
          lines:db.prepare('SELECT * FROM order_lines WHERE order_id=? ORDER BY rowid').all(order.id),
          tasks:can('tasks.read')?db.prepare('SELECT t.*,u.name AS assignee_name FROM tasks t LEFT JOIN users u ON u.id=t.assignee WHERE t.order_id=? ORDER BY t.rowid').all(order.id):[],
          history:db.prepare('SELECT * FROM order_history WHERE order_id=? ORDER BY created_at DESC').all(order.id),
          shipments:can('shipping.read')?db.prepare('SELECT * FROM shipments WHERE order_id=? ORDER BY updated_at DESC').all(order.id):[],
          invoices:can('finance.read')?db.prepare('SELECT * FROM invoices WHERE order_id=? ORDER BY updated_at DESC').all(order.id):[]
        });
      }
      if(req.method==='GET'&&url.pathname==='/api/returns') {
        const brand=url.searchParams.get('brand');if(!identifier(brand))fail(400,'Marka gerekli');requirePermission(brand,'orders.write');
        const items=db.prepare(`SELECT r.*,o.external_id,o.order_number,o.customer_name,a.id AS account_id
          FROM order_returns r JOIN order_cache o ON o.id=r.order_id JOIN accounts a ON a.id=o.account
          WHERE a.brand=? ORDER BY r.updated_at DESC LIMIT 200`).all(brand);
        return send(200,{items});
      }
      if(req.method==='POST'&&url.pathname==='/api/returns') {
        const {json:input}=await body(req);
        if(!identifier(input.brand)||!identifier(input.orderId)||!optionalText(input.reason,500)||!finiteNumber(input.amount??0)||(input.amount??0)<0||!/^[A-Z]{3}$/.test(input.currency??'TRY'))fail(400,'Geçersiz iade talebi');
        requirePermission(input.brand,'orders.write');
        const order=db.prepare('SELECT o.*,a.brand FROM order_cache o JOIN accounts a ON a.id=o.account WHERE o.id=?').get(input.orderId);
        if(!order||order.brand!==input.brand)fail(404,'Sipariş bulunamadı');if(order.status==='cancelled')fail(409,'İptal sipariş için iade açılamaz');
        const id=randomUUID(),now=new Date().toISOString();
        transaction(db,()=>{db.prepare('INSERT INTO order_returns(id,order_id,external_id,status,reason,amount,currency,source_updated_at,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)').run(id,order.id,null,'requested',input.reason?.trim()||null,input.amount??0,input.currency??order.currency,null,now,now);db.prepare("UPDATE order_cache SET return_status='requested',updated_at=? WHERE id=?").run(now,order.id);audit(db,user.id,input.brand,'return.requested',null,{id,orderId:order.id,amount:input.amount??0,currency:input.currency??order.currency});});
        return send(201,{id,status:'requested'});
      }
      const returnRoute=url.pathname.match(/^\/api\/returns\/([a-f0-9-]+)$/);
      if(req.method==='PATCH'&&returnRoute) {
        const {json:input}=await body(req),item=db.prepare('SELECT r.*,a.brand FROM order_returns r JOIN order_cache o ON o.id=r.order_id JOIN accounts a ON a.id=o.account WHERE r.id=?').get(returnRoute[1]);
        if(!item)fail(404,'İade bulunamadı');requirePermission(item.brand,'orders.write');
        const transitions={requested:['in_progress','cancelled'],in_progress:['returned','cancelled'],returned:[],cancelled:[]};if(!transitions[item.status]?.includes(input.status))fail(409,'Geçersiz iade durum geçişi');
        const now=new Date().toISOString();transaction(db,()=>{db.prepare('UPDATE order_returns SET status=?,updated_at=? WHERE id=?').run(input.status,now,item.id);const active=db.prepare("SELECT status FROM order_returns WHERE order_id=? AND id<>? AND status IN ('requested','in_progress') LIMIT 1").get(item.order_id,item.id);const orderReturnStatus=input.status==='returned'?'returned':active?.status??(input.status==='cancelled'?'none':input.status);db.prepare('UPDATE order_cache SET return_status=?,updated_at=? WHERE id=?').run(orderReturnStatus,now,item.order_id);audit(db,user.id,item.brand,'return.status_changed',{id:item.id,status:item.status},{id:item.id,status:input.status});});
        return send(200,{id:item.id,status:input.status});
      }
      if(req.method==='POST'&&url.pathname==='/api/refunds') {
        const {json:input}=await body(req);
        if(!identifier(input.brand)||!identifier(input.orderId)||!finiteNumber(input.amount)||input.amount<=0||!/^[A-Z]{3}$/.test(input.currency??'TRY')||!optionalDate(input.processedAt))fail(400,'Geçersiz geri ödeme');
        requirePermission(input.brand,'finance.write');
        const order=db.prepare('SELECT o.*,a.brand FROM order_cache o JOIN accounts a ON a.id=o.account WHERE o.id=?').get(input.orderId);
        if(!order||order.brand!==input.brand)fail(404,'Sipariş bulunamadı');
        const refunded=Number(db.prepare("SELECT COALESCE(SUM(amount),0) AS total FROM order_refunds WHERE order_id=? AND status='completed'").get(order.id).total);
        if(refunded+input.amount>order.grand_total&&order.grand_total>0)fail(409,'Geri ödeme sipariş toplamını aşamaz');
        const id=randomUUID(),now=new Date().toISOString(),processedAt=input.processedAt?new Date(input.processedAt).toISOString():now,nextStatus=order.grand_total>0&&refunded+input.amount>=order.grand_total?'refunded':'partially_refunded';
        transaction(db,()=>{db.prepare('INSERT INTO order_refunds(id,order_id,external_id,status,amount,currency,processed_at,created_at) VALUES(?,?,?,?,?,?,?,?)').run(id,order.id,null,'completed',input.amount,input.currency??order.currency,processedAt,now);db.prepare('UPDATE order_cache SET payment_status=?,updated_at=? WHERE id=?').run(nextStatus,now,order.id);audit(db,user.id,input.brand,'refund.created',null,{id,orderId:order.id,amount:input.amount,currency:input.currency??order.currency});});
        return send(201,{id,status:'completed',paymentStatus:nextStatus});
      }
      if(req.method==='GET'&&url.pathname==='/api/errors') {
        const brand=url.searchParams.get('brand'); if(!identifier(brand))fail(400,'Marka gerekli'); requirePermission(brand,'settings.write');
        const status=url.searchParams.get('status')??'open'; if(!['open','resolved','all'].includes(status))fail(400,'Geçersiz hata durumu');
        const items=status==='all'?db.prepare('SELECT * FROM integration_errors WHERE brand=? ORDER BY created_at DESC LIMIT 100').all(brand):db.prepare('SELECT * FROM integration_errors WHERE brand=? AND status=? ORDER BY created_at DESC LIMIT 100').all(brand,status);
        return send(200,{items});
      }
      if(req.method==='GET'&&url.pathname==='/api/system/status') {
        requirePermission('*','settings.write');
        const worker=db.prepare("SELECT * FROM service_heartbeats WHERE service='worker'").get();
        return send(200,{database:{engine:'sqlite',path:process.env.DATABASE_PATH??'data/core.sqlite',persistent:true},migrations:db.prepare('SELECT id,applied_at FROM schema_migrations ORDER BY id').all(),worker:worker?{...worker,details:JSON.parse(worker.details_json??'{}')}:null,inbox:db.prepare('SELECT status,COUNT(*) AS count FROM inbox_events GROUP BY status').all(),outbox:db.prepare('SELECT status,COUNT(*) AS count FROM outbox_events GROUP BY status').all()});
      }
      const inboxStatusRoute=url.pathname.match(/^\/api\/inbox\/([a-f0-9-]+)$/);
      if(req.method==='GET'&&inboxStatusRoute) {
        const item=db.prepare('SELECT i.id,i.status,i.processed_at,i.error_json,a.brand FROM inbox_events i JOIN accounts a ON a.id=i.account_id WHERE i.id=?').get(inboxStatusRoute[1]);
        if(!item)fail(404,'Kuyruk olayı bulunamadı');
        requirePermission(item.brand,'orders.read');
        return send(200,{id:item.id,status:item.status,processedAt:item.processed_at,error:item.error_json?JSON.parse(item.error_json):null});
      }
      const syncJobRoute=url.pathname.match(/^\/api\/sync-jobs\/([a-f0-9-]+)$/);
      if(req.method==='GET'&&syncJobRoute) {
        const item=db.prepare('SELECT j.*,a.brand FROM connector_sync_jobs j JOIN accounts a ON a.id=j.account_id WHERE j.id=?').get(syncJobRoute[1]);
        if(!item)fail(404,'Eşitleme işi bulunamadı');
        requirePermission(item.brand,'settings.write');
        return send(200,{id:item.id,account:item.account_id,status:item.status,result:item.result_json?JSON.parse(item.result_json):null,error:item.error_json?JSON.parse(item.error_json):null,createdAt:item.created_at,completedAt:item.completed_at});
      }
      const integrationSyncJobRoute=url.pathname.match(/^\/api\/integration-sync-jobs\/([a-f0-9-]+)$/);
      if(req.method==='GET'&&integrationSyncJobRoute) {
        const item=db.prepare('SELECT j.*,i.brand FROM integration_sync_jobs j JOIN integration_connections i ON i.id=j.connection_id WHERE j.id=?').get(integrationSyncJobRoute[1]);
        if(!item)fail(404,'Entegrasyon eşitleme işi bulunamadı');
        requirePermission(item.brand,'settings.write');
        return send(200,{id:item.id,connection:item.connection_id,status:item.status,result:item.result_json?JSON.parse(item.result_json):null,error:item.error_json?JSON.parse(item.error_json):null,createdAt:item.created_at,completedAt:item.completed_at});
      }
      if (req.method === 'GET' && url.pathname === '/api/admin/organization') {
        requirePermission('*','settings.write');
        return send(200,{
          companies:db.prepare('SELECT * FROM companies ORDER BY name').all(),
          brands:db.prepare('SELECT b.*,c.name AS company_name FROM brands b LEFT JOIN companies c ON c.id=b.company_id ORDER BY b.name').all(),
          sites:db.prepare('SELECT s.*,b.name AS brand_name FROM sites s JOIN brands b ON b.id=s.brand_id ORDER BY b.name,s.host').all()
        });
      }
      const notificationRoute=url.pathname.match(/^\/api\/notifications\/([a-f0-9-]+)\/read$/);
      if (req.method === 'POST' && notificationRoute) {
        const item=db.prepare('SELECT * FROM notifications WHERE id=? AND (user_id IS NULL OR user_id=?)').get(notificationRoute[1],user.id);
        if (!item) fail(404,'Bildirim bulunamadı'); requirePermission(item.brand,'notifications.read');
        const now=new Date().toISOString(); db.prepare('UPDATE notifications SET read_at=? WHERE id=?').run(now,item.id); return send(200,{id:item.id,readAt:now});
      }
      if (req.method === 'POST' && url.pathname === '/api/admin/users') {
        requirePermission('*', 'settings.write');
        const { json: input } = await body(req);
        if (!identifier(input.id) || typeof input.name !== 'string' || input.name.length < 1 || input.name.length > 100 || typeof input.token !== 'string' || input.token.length < 32 || input.token.length > 256 || !Array.isArray(input.grants) || input.grants.length > 100 || input.grants.some(g => !g || !(identifier(g.brand) || g.brand === '*') || !permissions.includes(g.permission))) fail(400, 'Geçersiz kullanıcı');
        transaction(db, () => {
          db.prepare('INSERT INTO users(id,name,token_hash) VALUES(?,?,?)').run(input.id,input.name,hash(input.token));
          for (const g of input.grants) db.prepare('INSERT INTO grants VALUES(?,?,?)').run(input.id,g.brand,g.permission);
          audit(db,user.id,'*','user.created',null,{id:input.id,grants:input.grants});
        });
        return send(201,{id:input.id});
      }
      const adminUserRoute = url.pathname.match(/^\/api\/admin\/users\/([a-zA-Z0-9_.:@/-]+)$/);
      if (req.method === 'PUT' && adminUserRoute) {
        const { json: input } = await body(req);
        if (!identifier(input.brand) || !Array.isArray(input.permissions) || input.permissions.length > permissions.length || input.permissions.some(permission => !permissions.includes(permission)) || new Set(input.permissions).size !== input.permissions.length) fail(400,'Geçersiz kullanıcı yetkisi');
        requirePermission(input.brand,'settings.write');
        if (adminUserRoute[1] === user.id) fail(409,'Kendi yetkilerinizi buradan değiştiremezsiniz');
        const target = db.prepare('SELECT id,name,active FROM users WHERE id=?').get(adminUserRoute[1]);
        if (!target) fail(404,'Kullanıcı bulunamadı');
        transaction(db, () => {
          const before = db.prepare('SELECT brand,permission FROM grants WHERE user_id=? AND brand=? ORDER BY permission').all(target.id,input.brand);
          db.prepare('DELETE FROM grants WHERE user_id=? AND brand=?').run(target.id,input.brand);
          for (const permission of input.permissions) db.prepare('INSERT INTO grants VALUES(?,?,?)').run(target.id,input.brand,permission);
          audit(db,user.id,input.brand,'user.permissions_updated',{id:target.id,permissions:before.map(item => item.permission)},{id:target.id,permissions:input.permissions});
        });
        return send(200,{id:target.id,permissions:input.permissions});
      }
      const adminUserStatusRoute = url.pathname.match(/^\/api\/admin\/users\/([a-zA-Z0-9_.:@/-]+)\/status$/);
      if (req.method === 'PATCH' && adminUserStatusRoute) {
        requirePermission('*','settings.write');
        const {json:input}=await body(req); if (typeof input.active !== 'boolean') fail(400,'Geçersiz kullanıcı durumu');
        if (adminUserStatusRoute[1]===user.id) fail(409,'Kendi hesabınızı devre dışı bırakamazsınız');
        const target=db.prepare('SELECT id,name,active FROM users WHERE id=?').get(adminUserStatusRoute[1]); if(!target) fail(404,'Kullanıcı bulunamadı');
        transaction(db,()=>{db.prepare('UPDATE users SET active=? WHERE id=?').run(Number(input.active),target.id);audit(db,user.id,'*','user.status_changed',target,{...target,active:Number(input.active)});});
        return send(200,{id:target.id,active:input.active});
      }
      if (req.method === 'GET' && ['/api/admin/accounts','/api/admin/integrations','/api/admin/rules','/api/admin/users'].includes(url.pathname)) {
        const brand = url.searchParams.get('brand');
        if (!identifier(brand)) fail(400,'Marka gerekli');
        requirePermission(brand,'settings.write');
        if (url.pathname.endsWith('/accounts')) return send(200,{items:db.prepare('SELECT a.id,a.brand,a.platform,a.status,a.connection_status,a.last_sync_at,c.shop_domain FROM accounts a LEFT JOIN account_connections c ON c.account_id=a.id WHERE a.brand=? ORDER BY a.id').all(brand)});
        if (url.pathname.endsWith('/integrations')) {
          const items=db.prepare(`SELECT i.id,i.brand,i.account_id,i.provider,i.kind,i.label,i.status,i.endpoint,i.external_account_id,i.capabilities_json,i.requirements_json,i.last_sync_at,i.last_error_at,
            (SELECT COUNT(*) FROM integration_sync_jobs j WHERE j.connection_id=i.id AND j.status IN ('pending','running')) AS active_jobs,
            (SELECT s.dataset FROM integration_snapshots s WHERE s.connection_id=i.id ORDER BY s.captured_at DESC LIMIT 1) AS latest_dataset,
            (SELECT s.payload_json FROM integration_snapshots s WHERE s.connection_id=i.id ORDER BY s.captured_at DESC LIMIT 1) AS latest_payload_json,
            (SELECT s.captured_at FROM integration_snapshots s WHERE s.connection_id=i.id ORDER BY s.captured_at DESC LIMIT 1) AS latest_captured_at
            FROM integration_connections i WHERE i.brand=? ORDER BY i.kind,i.label`).all(brand).map(item=>({
              ...item,
              capabilities:JSON.parse(item.capabilities_json),
              requirements:JSON.parse(item.requirements_json),
              latestSnapshot:item.latest_payload_json?{dataset:item.latest_dataset,payload:JSON.parse(item.latest_payload_json),capturedAt:item.latest_captured_at}:null,
              capabilities_json:undefined,
              requirements_json:undefined,
              latest_dataset:undefined,
              latest_payload_json:undefined,
              latest_captured_at:undefined
            }));
          return send(200,{items});
        }
        if (url.pathname.endsWith('/rules')) return send(200,{items:db.prepare('SELECT r.id,r.brand,r.kind,r.assignee,u.name AS assignee_name FROM rules r LEFT JOIN users u ON u.id=r.assignee WHERE r.brand=? ORDER BY r.kind').all(brand)});
        const users = db.prepare(`SELECT DISTINCT u.id,u.name,u.active FROM users u JOIN grants g ON g.user_id=u.id WHERE g.brand IN (?, '*') ORDER BY u.name`).all(brand);
        const listGrants = db.prepare('SELECT brand,permission FROM grants WHERE user_id=? AND brand IN (?,\'*\') ORDER BY brand,permission');
        return send(200,{items:users.map(item => ({...item,grants:listGrants.all(item.id,brand)}))});
      }
      const integrationSyncRoute=url.pathname.match(/^\/api\/admin\/integrations\/([a-zA-Z0-9_.:@-]+)\/sync$/);
      if(req.method==='POST'&&integrationSyncRoute) {
        const connection=db.prepare('SELECT * FROM integration_connections WHERE id=?').get(integrationSyncRoute[1]);
        if(!connection)fail(404,'Entegrasyon bulunamadı');
        requirePermission(connection.brand,'settings.write');
        if(!supportsGoogleConnection(connection.provider))fail(409,'Bu entegrasyon henüz eşitlemeyi desteklemiyor');
        const existing=db.prepare("SELECT id,status FROM integration_sync_jobs WHERE connection_id=? AND status IN ('pending','running') ORDER BY created_at DESC LIMIT 1").get(connection.id);
        if(existing)return send(202,{connection:connection.id,jobId:existing.id,status:existing.status});
        const id=randomUUID(),now=new Date().toISOString(),dataset=defaultGoogleDataset(connection.provider);
        transaction(db,()=>{
          db.prepare('INSERT INTO integration_sync_jobs(id,connection_id,dataset,mode,status,requested_by,created_at) VALUES(?,?,?,?,?,?,?)').run(id,connection.id,dataset,'incremental','pending',user.id,now);
          db.prepare("UPDATE integration_connections SET status='syncing',updated_at=? WHERE id=?").run(now,connection.id);
          audit(db,user.id,connection.brand,'integration.sync_requested',null,{connection:connection.id,dataset,jobId:id});
        });
        return send(202,{connection:connection.id,jobId:id,status:'pending'});
      }
      if (req.method === 'PUT' && ['/api/admin/accounts','/api/admin/rules'].includes(url.pathname)) {
        const { json: input } = await body(req);
        if (!identifier(input.brand) || !identifier(input.id)) fail(400, 'Geçersiz kimlik');
        requirePermission(input.brand,'settings.write');
        transaction(db, () => {
          if (url.pathname.endsWith('/accounts')) {
            if (!['demo','shopify','faprika'].includes(input.platform)) fail(400,'Geçersiz platform');
            const shopDomain=input.platform==='shopify'&&input.shopDomain?normalizeShopDomain(input.shopDomain):null;
            const before = db.prepare('SELECT * FROM accounts WHERE id=?').get(input.id);
            if (before && (before.brand !== input.brand || before.platform !== input.platform)) fail(409,'Hesap kapsamı değiştirilemez');
            db.prepare('INSERT OR IGNORE INTO accounts(id,brand,platform,status,connection_status) VALUES(?,?,?,?,?)').run(input.id,input.brand,input.platform,'ready',input.platform==='demo'?'connected':'not_configured');
            if(shopDomain) {
              const now=new Date().toISOString();
              db.prepare("INSERT INTO account_connections(account_id,shop_domain,settings_json,updated_at) VALUES(?,?,?,?) ON CONFLICT(account_id) DO UPDATE SET shop_domain=excluded.shop_domain,updated_at=excluded.updated_at").run(input.id,shopDomain,'{}',now);
              db.prepare("UPDATE accounts SET connection_status='awaiting_installation' WHERE id=? AND connection_status='not_configured'").run(input.id);
            }
            audit(db,user.id,input.brand,'account.configured',before ?? null,{id:input.id,brand:input.brand,platform:input.platform,shopDomain});
          } else {
            if (!kinds.includes(input.kind) || !(input.assignee === null || identifier(input.assignee))) fail(400,'Geçersiz görev kuralı');
            if (input.assignee !== null) {
              const target = db.prepare('SELECT id FROM users WHERE id=? AND active=1').get(input.assignee);
              if (!target || !permitted(db,target,input.brand,'tasks.read')) fail(400,'Atanan kullanıcı marka görevlerini görebilmeli');
            }
            const priorId = db.prepare('SELECT brand FROM rules WHERE id=?').get(input.id);
            if (priorId && priorId.brand !== input.brand) fail(403,'Yetki yok');
            const before = db.prepare('SELECT * FROM rules WHERE brand=? AND kind=?').get(input.brand,input.kind);
            db.prepare('INSERT INTO rules VALUES(?,?,?,?) ON CONFLICT(brand,kind) DO UPDATE SET assignee=excluded.assignee').run(input.id,input.brand,input.kind,input.assignee);
            audit(db,user.id,input.brand,'rule.updated',before ?? null,{kind:input.kind,assignee:input.assignee});
          }
        });
        return send(200,{ok:true});
      }
      if (req.method === 'POST' && url.pathname === '/api/admin/demo-orders') {
        const { json: input } = await body(req);
        if (!identifier(input.account) || !identifier(input.orderId) || (input.customerId !== undefined && input.customerId !== '' && !identifier(input.customerId)) || typeof input.needsProduction !== 'boolean' || typeof input.international !== 'boolean') fail(400,'Geçersiz demo siparişi');
        const account = db.prepare('SELECT * FROM accounts WHERE id=?').get(input.account);
        if (!account) fail(404,'Hesap bulunamadı');
        requirePermission(account.brand,'settings.write');
        if (account.platform !== 'demo') fail(409,'Yalnız demo hesabında örnek sipariş oluşturulabilir');
        if(db.prepare('SELECT 1 FROM demo_source_orders WHERE account_id=? AND external_id=?').get(input.account,input.orderId))fail(409,'Demo kaynak siparişi zaten var');
        const event={eventId:`demo:${input.account}:${input.orderId}:1`,eventType:'order.created',orderId:input.orderId,sourceVersion:1,customerId:input.customerId||null,needsProduction:input.needsProduction,international:input.international,lines:input.lines??[{externalProductId:'demo-product-source',sku:'DEMO-001',title:'Demo Ürün',quantity:1,unit:'adet'}]};
        const result=transaction(db,()=>{const now=new Date().toISOString();db.prepare('INSERT INTO demo_source_orders(account_id,external_id,source_version,status,payload_json,updated_at) VALUES(?,?,?,?,?,?)').run(input.account,input.orderId,1,'open',JSON.stringify(event),now);const queued=enqueueOrderEvent(db,input.account,event,'order.created');audit(db,user.id,account.brand,'demo_source.created',null,{account:input.account,orderId:input.orderId,sourceVersion:1});return queued;});
        return send(202,result);
      }
      const demoLifecycleRoute=url.pathname.match(/^\/api\/admin\/demo-orders\/([a-zA-Z0-9_.:@-]+)$/);
      if(req.method==='PATCH'&&demoLifecycleRoute) {
        const {json:input}=await body(req);
        if(!identifier(input.account)||!['order.updated','order.cancelled','order.restarted'].includes(input.eventType)||(input.deliver!==undefined&&typeof input.deliver!=='boolean'))fail(400,'Geçersiz demo sipariş işlemi');
        const account=db.prepare('SELECT * FROM accounts WHERE id=?').get(input.account); if(!account)fail(404,'Hesap bulunamadı'); requirePermission(account.brand,'settings.write'); if(account.platform!=='demo')fail(409,'Yalnız demo hesabı güncellenebilir');
        const source=db.prepare('SELECT * FROM demo_source_orders WHERE account_id=? AND external_id=?').get(input.account,demoLifecycleRoute[1]); if(!source)fail(404,'Demo kaynak siparişi bulunamadı');
        const previous=JSON.parse(source.payload_json),sourceVersion=source.source_version+1;
        const next={...previous,eventId:`demo:${input.account}:${source.external_id}:${sourceVersion}:${input.eventType}`,eventType:input.eventType,sourceVersion,needsProduction:input.needsProduction??previous.needsProduction,international:input.international??previous.international,customerId:input.customerId===undefined?previous.customerId:(input.customerId||null),lines:input.lines??previous.lines};
        const sourceStatus=input.eventType==='order.cancelled'?'cancelled':'open';
        const queued=transaction(db,()=>{const now=new Date().toISOString();db.prepare('UPDATE demo_source_orders SET source_version=?,status=?,payload_json=?,updated_at=? WHERE account_id=? AND external_id=?').run(sourceVersion,sourceStatus,JSON.stringify(next),now,input.account,source.external_id);const result=input.deliver===false?{duplicate:false,status:'not_delivered'}:enqueueOrderEvent(db,input.account,next,input.eventType);audit(db,user.id,account.brand,'demo_source.changed',{orderId:source.external_id,sourceVersion:source.source_version,status:source.status},{orderId:source.external_id,sourceVersion,status:sourceStatus,eventType:input.eventType,delivered:input.deliver!==false});return result;});
        return send(input.deliver===false?200:202,{...queued,sourceVersion,sourceStatus});
      }
      const reconcileRoute=url.pathname.match(/^\/api\/admin\/accounts\/([a-zA-Z0-9_.:@-]+)\/reconcile$/);
      if(req.method==='POST'&&reconcileRoute) {
        const account=db.prepare('SELECT * FROM accounts WHERE id=?').get(reconcileRoute[1]);if(!account)fail(404,'Hesap bulunamadı');requirePermission(account.brand,'settings.write');
        if(account.platform==='shopify') {
          if(!db.prepare('SELECT 1 FROM account_connections WHERE account_id=?').get(account.id))fail(409,'Shopify mağaza adresi yapılandırılmamış');
          const existing=db.prepare("SELECT id,status FROM connector_sync_jobs WHERE account_id=? AND status IN ('pending','running') ORDER BY created_at DESC LIMIT 1").get(account.id);
          if(existing)return send(202,{account:account.id,jobId:existing.id,status:existing.status});
          const id=randomUUID(),now=new Date().toISOString();
          db.prepare('INSERT INTO connector_sync_jobs(id,account_id,status,requested_by,created_at) VALUES(?,?,?,?,?)').run(id,account.id,'pending',user.id,now);
          db.prepare("UPDATE accounts SET connection_status='syncing' WHERE id=?").run(account.id);
          return send(202,{account:account.id,jobId:id,status:'pending'});
        }
        if(account.platform!=='demo')fail(409,'Bu bağlantı türü henüz eşitlemeyi desteklemiyor');
        const sources=db.prepare('SELECT * FROM demo_source_orders WHERE account_id=? ORDER BY updated_at').all(account.id),inboxIds=[];
        transaction(db,()=>{for(const source of sources){const cached=db.prepare('SELECT * FROM order_cache WHERE account=? AND external_id=?').get(account.id,source.external_id);if(cached&&cached.source_version>=source.source_version)continue;const snapshot=JSON.parse(source.payload_json);const eventType=source.status==='cancelled'?'order.cancelled':!cached?'order.created':cached.status==='cancelled'?'order.restarted':'order.updated';const event={...snapshot,eventId:`reconcile:${account.id}:${source.external_id}:${source.source_version}`,eventType,sourceVersion:source.source_version};const result=enqueueOrderEvent(db,account.id,event,eventType);if(!result.duplicate)inboxIds.push(result.inboxId);}const now=new Date().toISOString();db.prepare("UPDATE accounts SET connection_status='connected',last_sync_at=? WHERE id=?").run(now,account.id);audit(db,user.id,account.brand,'account.reconciled',null,{account:account.id,sourceCount:sources.length,queued:inboxIds.length});});
        return send(202,{account:account.id,sourceCount:sources.length,queued:inboxIds.length,inboxIds});
      }
      const taskRoute = url.pathname.match(/^\/api\/tasks\/([a-f0-9-]+)$/);
      if (req.method === 'PATCH' && taskRoute) {
        const { json: input } = await body(req);
        const task = db.prepare('SELECT * FROM tasks WHERE id=?').get(taskRoute[1]);
        if (!task) fail(404,'Görev bulunamadı');
        requirePermission(task.brand,'tasks.update');
        const transitions = { pending:['in_progress','blocked','cancelled'], in_progress:['done','blocked','cancelled'], blocked:['pending','in_progress','cancelled'], done:[], cancelled:[] };
        if (!transitions[task.status]?.includes(input.status)) fail(409,'Geçersiz durum geçişi');
        if(input.status==='blocked'&&!shortText(input.blockedReason,1,500))fail(400,'Engel nedeni gerekli');
        transaction(db, () => {
          db.prepare('UPDATE tasks SET status=?,cancel_reason=?,blocked_reason=?,updated_at=? WHERE id=?').run(input.status,input.status==='cancelled'?'manual':null,input.status==='blocked'?input.blockedReason.trim():null,new Date().toISOString(),task.id);
          audit(db,user.id,task.brand,'task.status_changed',{id:task.id,status:task.status},{id:task.id,status:input.status,blockedReason:input.status==='blocked'?input.blockedReason.trim():null});
        });
        return send(200,{id:task.id,status:input.status});
      }
      fail(404,'Uç nokta bulunamadı');
    } catch (error) {
      const conflict = /UNIQUE constraint failed/.test(error.message);
      send(error.status ?? (conflict ? 409 : 500), { error: error.status ? error.message : conflict ? 'Kayıt zaten mevcut' : 'İşlem tamamlanamadı' });
    }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const db = openStore(process.env.DATABASE_PATH ?? 'data/core.sqlite');
  const server = createApp(db, {
    ingestSecret: process.env.INGEST_SECRET,
    featurePin: process.env.FEATURE_PIN ?? '1122',
    passwordsDisabled: process.env.PASSWORDS_DISABLED === 'true',
    defaultUserId: process.env.DEFAULT_USER_ID ?? 'selman'
  });
  server.requestTimeout = 15000;
  server.listen(Number(process.env.PORT ?? 3100),process.env.HOST ?? '127.0.0.1', () => console.log('Orchestrator API hazır.'));
  const close = () => server.close(() => { db.close(); process.exit(0); });
  process.on('SIGINT',close); process.on('SIGTERM',close);
}
