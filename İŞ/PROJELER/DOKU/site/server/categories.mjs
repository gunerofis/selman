// Eski kategori adresleri, aynı tek kelimeyle galeri aramasına gider.
import catalog from '../data/catalog.json' with {type:'json'};
import seed from '../data/keywords.json' with {type:'json'};
import grouping from '../data/product-groups.json' with {type:'json'};
import {buildCategories} from '../src/category-core.mjs';

export async function keywordRedirect(env, slug, requestUrl) {
  let overrides = {};
  if (env.DB) {
    try {
      const rows = await env.DB.prepare('SELECT image_code, tags_json FROM keyword_images').all();
      overrides = Object.fromEntries(rows.results.map(row => [row.image_code, JSON.parse(row.tags_json)]));
    } catch (error) {
      console.error('Keyword redirect lookup failed', error?.message);
    }
  }
  const keyword = buildCategories(catalog, seed, grouping, overrides).find(item => item.slug === slug)?.name;
  const target = new URL('/galeri/', requestUrl);
  if (keyword) target.searchParams.set('q', keyword);
  return Response.redirect(target, 301);
}
