const { dedupe } = require('../src/deduper');

describe('dedupe', () => {
  test('returns unique results by URL', () => {
    const input = [
      { url: 'https://a.com', title: 'A' },
      { url: 'https://b.com', title: 'B' },
      { url: 'https://a.com', title: 'A duplicate' },
    ];
    const result = dedupe(input);
    expect(result.length).toBe(2);
    expect(result.map((r) => r.url)).toEqual(['https://a.com', 'https://b.com']);
  });

  test('handles empty array', () => {
    expect(dedupe([])).toEqual([]);
  });

  test('preserves all fields of kept results', () => {
    const input = [{ url: 'https://x.com', title: 'X', snippet: 'hello', score: 5 }];
    const result = dedupe(input);
    expect(result[0]).toEqual(input[0]);
  });
});
