import { createKeyStorage } from '../docs/scripts/shared/keyStorage.js';

function createStubStorage() {
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

describe('createKeyStorage', () => {
  test('reads and writes values using the configured prefix', () => {
    const storage = createStubStorage();
    const keyStorage = createKeyStorage({ storage, prefix: 'secret_' });

    keyStorage.set('api', 'token');

    expect(storage.getItem('secret_api')).toBe('token');
    expect(keyStorage.get('api')).toBe('token');
  });

  test('returns empty strings and ignores storage failures', () => {
    const storage = {
      getItem() {
        throw new Error('blocked');
      },
      setItem() {
        throw new Error('blocked');
      },
      removeItem() {
        throw new Error('blocked');
      },
    };
    const keyStorage = createKeyStorage({ storage });

    expect(keyStorage.get('api')).toBe('');
    expect(() => keyStorage.set('api', 'token')).not.toThrow();
    expect(() => keyStorage.remove('api')).not.toThrow();
  });
});
