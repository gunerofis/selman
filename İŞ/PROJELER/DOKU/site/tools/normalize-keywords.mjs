import fs from 'node:fs';
import {singleKeywords} from '../src/keyword-policy.mjs';

const file = new URL('../data/keywords.json', import.meta.url);
const seed = JSON.parse(fs.readFileSync(file, 'utf8'));
for (const section of ['products', 'productGroups']) {
  for (const [code, terms] of Object.entries(seed[section])) seed[section][code] = singleKeywords(terms);
}
for (const tags of Object.values(seed.images)) {
  for (const [field, terms] of Object.entries(tags)) tags[field] = singleKeywords(terms);
}
fs.writeFileSync(file, JSON.stringify(seed, null, 2) + '\n');
