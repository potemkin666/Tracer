function createMemoryStorage() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
  };
}

export function createKeyStorage({
  storage = createMemoryStorage(),
  prefix = 'tracer_',
} = {}) {
  function keyFor(id) {
    return `${prefix}${id}`;
  }

  return {
    get(id) {
      try {
        return storage.getItem(keyFor(id)) || '';
      } catch {
        return '';
      }
    },

    set(id, value) {
      try {
        storage.setItem(keyFor(id), value);
      } catch {
        // ignore storage failures for session-only secrets
      }
    },

    remove(id) {
      try {
        storage.removeItem(keyFor(id));
      } catch {
        // ignore storage failures for session-only secrets
      }
    },
  };
}
