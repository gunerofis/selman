export const keywordFields = ['colors', 'forms', 'subjects', 'styles', 'tones', 'keywords'];
export const rejectedKeywords = new Set(['duvar kompozisyonu', 'konsept', 'renk', 'renk tonları']);

const normalized = term => String(term).normalize('NFC').trim().replace(/\s+/gu, ' ').toLocaleLowerCase('tr-TR');
export const isRejectedKeyword = term => rejectedKeywords.has(normalized(term));
export const allowedKeywords = terms => (Array.isArray(terms) ? terms : []).filter(term => typeof term === 'string' && !isRejectedKeyword(term));
const skip = new Set(['ve', 'ile', 'için', 'bir', 'iki', 'üç', 'çok', 'olan', 'alan', 'ilham', 'özel', 'ait', 'arası', 'arasında', 'üzerinde', 'içinde', 'duvar', 'duvara', 'tasarım', 'tasarımı', 'tasarımları', 'temalı', 'odası', 'kompozisyon', 'kompozisyonu']);
const replacements = new Map([['doğadan', 'doğa'], ['doğal', 'doğa'], ['doğayı', 'doğa'], ['doğası', 'doğa'], ['doğada', 'doğa']]);
export function singleKeywords(terms) {
  const result = new Map();
  for (const phrase of allowedKeywords(terms)) for (const part of phrase.normalize('NFC').split(/\s+/u)) {
    const word = replacements.get(normalized(part)) || part;
    const key = normalized(word);
    if (!key || skip.has(key) || isRejectedKeyword(key)) continue;
    if (!result.has(key)) result.set(key, word);
  }
  return [...result.values()];
}

export function effectiveTags(seedTags, savedTags) {
  return Object.fromEntries(keywordFields.map(field => {
    const saved = singleKeywords(savedTags?.[field]);
    return [field, saved.length ? saved : singleKeywords(seedTags?.[field])];
  }));
}
