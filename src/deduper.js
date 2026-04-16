export function dedupe(results) {
  const map = new Map();

  for (const r of results) {
    if (!r.url) continue;

    if (!map.has(r.url)) {
      map.set(r.url, {
        ...r,
        sources: [r.source].filter(Boolean),
        meta: r.meta && typeof r.meta === 'object' ? { ...r.meta } : {},
      });
      continue;
    }

    const existing = map.get(r.url);

    // Accumulate distinct source names
    if (r.source && !existing.sources.includes(r.source)) {
      existing.sources.push(r.source);
    }

    // Prefer a non-empty title / snippet over an empty one
    if (!existing.title && r.title) existing.title = r.title;
    if (!existing.snippet && r.snippet) existing.snippet = r.snippet;

    // Keep the best (lowest non-zero) rank
    if (r.rank && (!existing.rank || r.rank < existing.rank)) {
      existing.rank = r.rank;
    }

    // Merge meta: later values fill in gaps but never overwrite existing keys
    if (r.meta && typeof r.meta === 'object') {
      for (const [key, value] of Object.entries(r.meta)) {
        if (!(key in existing.meta)) {
          existing.meta[key] = value;
        }
      }
    }
  }

  return Array.from(map.values());
}

