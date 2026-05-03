export function mergeUniqueValues(existing = [], incoming = []) {
  const merged = [...existing];
  for (const value of incoming) {
    if (value && !merged.includes(value)) {
      merged.push(value);
    }
  }
  return merged;
}

function defaultCreateEntry(result) {
  return { ...result };
}

function defaultMergeEntry(existing, result) {
  if (!existing.title && result.title) existing.title = result.title;
  if (!existing.snippet && result.snippet) existing.snippet = result.snippet;
  return existing;
}

export function dedupeResultsByUrl(
  results,
  {
    getKey = (result) => result.url,
    createEntry = defaultCreateEntry,
    mergeEntry = defaultMergeEntry,
  } = {}
) {
  const map = new Map();

  for (const result of results) {
    const key = getKey(result);
    if (!key) continue;

    if (!map.has(key)) {
      map.set(key, createEntry(result));
      continue;
    }

    mergeEntry(map.get(key), result);
  }

  return Array.from(map.values());
}
