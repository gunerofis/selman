const fs = require('fs');
const { spawnSync } = require('child_process');
const env = Object.assign({}, process.env, {
  SHOPIFY_CLI_AGENT_INFO: 'n:grok|v:none|p:xai|m:grok-4.6'
});
const root = 'C:/Users/DELL/Desktop/sumentakimi-com-tr/graphql';

let body = JSON.parse(fs.readFileSync(root + '/sss-live-body.json', 'utf8')).page.body;
body = body.split('Güner Ofis').join('Makro Ofis');
body = body.split('guner-ofis').join('makro-ofis');
body = body.split('Sümen Takımı TR').join('Sümen Takımı');
fs.writeFileSync(root + '/sss-update-vars.json', JSON.stringify({
  id: 'gid://shopify/Page/166814220580',
  body
}));
console.log('sss guner', (body.match(/Güner/g) || []).length, 'TR', (body.match(/Takımı TR/g) || []).length);

function run(args) {
  const r = spawnSync('shopify.cmd', args, { env: env, encoding: 'utf8', timeout: 120000, shell: true });
  const out = (r.stdout || '') + (r.stderr || '');
  if (r.status !== 0) {
    console.log('FAIL status', r.status, r.error);
    console.log(out.slice(-1200));
    process.exit(1);
  }
  return out;
}

run([
  'store', 'execute',
  '--store', 'b1zinb-wv.myshopify.com',
  '--query-file', root + '/mutation-page-update.graphql',
  '--variable-file', root + '/sss-update-vars.json',
  '--allow-mutations'
]);
console.log('sss page updated');

const nodes = JSON.parse(fs.readFileSync(root + '/vendors-p1.json', 'utf8')).products.nodes.filter(function (n) {
  return n.vendor && n.vendor.indexOf('Güner') !== -1;
});
console.log('to update', nodes.length);
for (let i = 0; i < nodes.length; i += 12) {
  const chunk = nodes.slice(i, i + 12);
  let q = 'mutation VendorBatch' + i + ' {\n';
  chunk.forEach(function (n, idx) {
    q += '  p' + idx + ': productUpdate(input: { id: "' + n.id + '", vendor: "Makro Ofis" }) { userErrors { message } }\n';
  });
  q += '}\n';
  const qf = root + '/mutation-vendor-batch.graphql';
  fs.writeFileSync(qf, q);
  const out = run([
    'store', 'execute',
    '--store', 'b1zinb-wv.myshopify.com',
    '--query-file', qf,
    '--allow-mutations'
  ]);
  const err = (out.match(/"message":/g) || []).length;
  console.log('batch', i, 'size', chunk.length, 'messages', err);
}
console.log('done');
