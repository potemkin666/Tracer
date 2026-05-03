function nowMs(now = Date.now) {
  return typeof now === 'function' ? now() : Date.now();
}

export function createResponseCache({ searchTtlMs = 5 * 60_000, snapshotTtlMs = 30 * 60_000, now = Date.now } = {}) {
  const searchEntries = new Map();
  const snapshotEntries = new Map();

  function get(map, key) {
    const entry = map.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= nowMs(now)) {
      map.delete(key);
      return null;
    }
    return entry.value;
  }

  function set(map, key, value, ttlMs) {
    map.set(key, {
      value,
      expiresAt: nowMs(now) + ttlMs,
    });
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
      return set(searchEntries, key, value, searchTtlMs);
    },
    getSnapshot(url) {
      return get(snapshotEntries, url);
    },
    setSnapshot(url, value) {
      return set(snapshotEntries, url, value, snapshotTtlMs);
    },
    clear() {
      searchEntries.clear();
      snapshotEntries.clear();
    },
  };
}
