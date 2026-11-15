/** Damerau: 1 insert/delete/substitute/transpose. Short tokens stay exact. */
export function withinOne(a: string, b: string) {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  if (la === lb) {
    let diffs = 0;
    for (let i = 0; i < la; i++) {
      if (a[i] === b[i]) continue;
      if (i + 1 < la && a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2)) {
        return true;
      }
      diffs += 1;
      if (diffs > 1) return false;
    }
    return diffs <= 1;
  }
  const longer = la > lb ? a : b;
  const shorter = la > lb ? b : a;
  let i = 0;
  let j = 0;
  let skipped = 0;
  while (i < longer.length) {
    if (j < shorter.length && longer[i] === shorter[j]) {
      i += 1;
      j += 1;
      continue;
    }
    skipped += 1;
    if (skipped > 1) return false;
    i += 1;
  }
  return true;
}

export function fuzzyIncludes(hay: string, term: string) {
  if (!term) return true;
  if (hay.includes(term)) return true;
  if (term.length < 4) return false;
  return hay.split(/\s+/).some((token) => token.length >= 4 && withinOne(token, term));
}

export function closestTerm(query: string, candidates: string[], fold: (s: string) => string) {
  const q = fold(query.trim());
  if (q.length < 4) return null;
  let best: string | null = null;
  for (const c of candidates) {
    const f = fold(c);
    if (!f || f === q) continue;
    if (withinOne(f, q)) return c;
    if (!best && f.includes(q) && q.length >= 4) best = c;
  }
  return best;
}
