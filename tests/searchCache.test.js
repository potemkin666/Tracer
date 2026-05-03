import { createResponseCache } from '../src/searchCache.js';

describe('response cache', () => {
  test('stores and expires search and snapshot entries', () => {
    let current = 1_000;
    const cache = createResponseCache({
      searchTtlMs: 50,
      snapshotTtlMs: 100,
      now: () => current,
    });

    const key = cache.buildSearchKey({ input: 'alice', mode: 'aggressive', fossils: true });
    cache.setSearch(key, { results: [1] });
    cache.setSnapshot('https://example.com', { archiveUrl: 'https://web.archive.org/web/example' });

    expect(cache.getSearch(key)).toEqual({ results: [1] });
    expect(cache.getSnapshot('https://example.com')).toEqual({ archiveUrl: 'https://web.archive.org/web/example' });

    current += 60;
    expect(cache.getSearch(key)).toBeNull();
    expect(cache.getSnapshot('https://example.com')).toEqual({ archiveUrl: 'https://web.archive.org/web/example' });

    current += 50;
    expect(cache.getSnapshot('https://example.com')).toBeNull();
  });
});
