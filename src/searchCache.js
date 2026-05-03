function nowMs(now = Date.now) {
  return typeof now === 'function' ? now() : Date.now();
}

function touch(map, key, entry) {
  map.delete(key);
  map.set(key, entry);
}

function evictIfNeeded(map, maxEntries) {
  while (map.size > maxEntries) {
    const oldestKey = map.keys().next().value;
    map.delete(oldestKey);
  }
}

export function createResponseCache({
  searchTtlMs = 5 * 60_000,
  snapshotTtlMs = 30 * 60_000,
  maxSearchEntries = 100,
  maxSnapshotEntries = 200,
  now = Date.now,
} = {}) {
  const searchEntries = new Map();
  const snapshotEntries = new Map();

  function get(map, key) {
    const entry = map.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= nowMs(now)) {
      map.delete(key);
      return null;
    }
    touch(map, key, entry);
    return entry.value;
  }

  function set(map, key, value, ttlMs, maxEntries) {
    touch(map, key, {
      value,
      expiresAt: nowMs(now) + ttlMs,
    });
    evictIfNeeded(map, maxEntries);
    return value;
  }

  return {
    buildSearchKey(request = {}) {
      return JSON.stringify({
        input: request.input || '',
        mode: request.mode || 'normal',
        fossils: Boolean(request.fossils),
        avatars: Boolean(request.avatars),
        timeSliceMode: Boolean(request.timeSliceMode),
        documents: Boolean(request.documents),
      });
    },
    getSearch(key) {
      return get(searchEntries, key);
    },
    setSearch(key, value) {
      return set(searchEntries, key, value, searchTtlMs, maxSearchEntries);
    },
    getSnapshot(url) {
      return get(snapshotEntries, url);
    },
    setSnapshot(url, value) {
      return set(snapshotEntries, url, value, snapshotTtlMs, maxSnapshotEntries);
    },
    clear() {
      searchEntries.clear();
      snapshotEntries.clear();
    },
  };
}
