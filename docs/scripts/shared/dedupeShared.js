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
    createEntry = defaultCreateEntry,
    mergeEntry = defaultMergeEntry,
  } = {}
) {
  const map = new Map();

  for (const result of results) {
    if (!result.url) continue;

    if (!map.has(result.url)) {
      map.set(result.url, createEntry(result));
      continue;
    }

    mergeEntry(map.get(result.url), result);
  }

  return Array.from(map.values());
}
