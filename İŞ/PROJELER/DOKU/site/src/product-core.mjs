export const imageCode = n => `G-${String(n).padStart(3, '0')}`;

// Kaynak kodları kalır; ürün grupları görsellerin gerçek tasarım ilişkisini belirler.
export function createProducts(catalog, grouping) {
  const sources = new Map(catalog.designs.map(d => [d.id, d]));
  const groups = grouping.products.filter(group => !group.hidden);
  const seen = new Set(), ids = new Set(), slugs = new Set();
  const products = groups.map(group => {
    const source = sources.get(group.sourceIds[0]);
    if (!source || !group.images.length || ids.has(group.id) || slugs.has(group.slug)) throw Error(`Geçersiz ürün grubu: ${group.id}`);
    ids.add(group.id); slugs.add(group.slug);
    const labels = group.images.map(n => {
      const original = catalog.designs.find(d => d.images.includes(n));
      if (!original || seen.has(n) || !group.sourceIds.includes(original.id)) throw Error(`Görsel grubu geçersiz: ${imageCode(n)}`);
      seen.add(n);
      return original.imageLabels?.[original.images.indexOf(n)] || imageCode(n);
    });
    const changed = group.name !== source.name || group.images.length !== source.images.length;
    return {...source, ...group, imageLabels:labels,
      description: source.applicationType === 'tam-duvar' ? `${group.name} tam duvar kaplama konsepti. Kaplama, renk ve ölçü mekânınıza göre uyarlanır.` : changed ? `${group.name} kompozisyonu. Renk ve ölçü mekânınıza göre uyarlanır.` : source.description,
      seoDescription: source.applicationType === 'tam-duvar' ? `${group.name} tam duvar kaplama konseptini inceleyin. Form, renk ve kaplama mekânınızın ölçüsüne göre belirlenir.` : changed ? `${group.name} duvar tasarımını ve ${group.images.length} konsept görünümünü inceleyin. Kaplama, renk ve ölçü mekânınıza göre uyarlanır.` : source.seoDescription};
  });
  for (const d of catalog.designs.filter(d => !d.hidden)) for (const n of d.images) if (!seen.has(n)) throw Error(`Ürün grubu eksik: ${imageCode(n)}`);
  return products;
}

export function imageProducts(catalog, grouping) {
  return new Map(createProducts(catalog, grouping).flatMap(d => d.images.map(n => [imageCode(n), d])));
}

export function legacyDestination(catalog, grouping, pathname, code) {
  const source = catalog.designs.find(d => pathname === `/tasarim/${d.slug}/`);
  if (!source) return null;
  const products = createProducts(catalog, grouping);
  const selected = source.images.find(n => imageCode(n) === code);
  const n = selected === undefined ? source.images[0] : selected;
  const product = products.find(d => d.images.includes(n));
  const target = product && `/tasarim/${product.slug}/`;
  return target !== pathname ? target : null;
}
