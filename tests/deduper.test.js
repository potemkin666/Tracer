const { dedupe } = require('../src/deduper');

describe('dedupe', () => {
  test('returns unique results by URL', () => {
    const input = [
      { url: 'https://a.com', title: 'A', source: 'brave' },
      { url: 'https://b.com', title: 'B', source: 'bing' },
      { url: 'https://a.com', title: 'A duplicate', source: 'google' },
    ];
    const result = dedupe(input);
    expect(result.length).toBe(2);
    expect(result.map((r) => r.url)).toEqual(['https://a.com', 'https://b.com']);
  });

  test('handles empty array', () => {
    expect(dedupe([])).toEqual([]);
  });

  test('preserves all fields of kept results', () => {
    const input = [{ url: 'https://x.com', title: 'X', snippet: 'hello', score: 5, source: 'brave' }];
    const result = dedupe(input);
    expect(result[0].url).toBe('https://x.com');
    expect(result[0].title).toBe('X');
    expect(result[0].snippet).toBe('hello');
    expect(result[0].score).toBe(5);
  });

  test('merges sources when same URL appears from multiple connectors', () => {
    const input = [
      { url: 'https://a.com', title: 'A', source: 'brave' },
      { url: 'https://a.com', title: 'A dup', source: 'bing' },
      { url: 'https://a.com', title: 'A again', source: 'google' },
    ];
    const result = dedupe(input);
    expect(result.length).toBe(1);
    expect(result[0].sources).toEqual(['brave', 'bing', 'google']);
  });

  test('does not add duplicate source names', () => {
    const input = [
      { url: 'https://a.com', title: 'A', source: 'brave' },
      { url: 'https://a.com', title: 'A dup', source: 'brave' },
    ];
    const result = dedupe(input);
    expect(result[0].sources).toEqual(['brave']);
  });

  test('fills in empty title and snippet from later results', () => {
    const input = [
      { url: 'https://a.com', title: '', snippet: '', source: 'brave' },
      { url: 'https://a.com', title: 'Real Title', snippet: 'A snippet', source: 'bing' },
    ];
    const result = dedupe(input);
    expect(result[0].title).toBe('Real Title');
    expect(result[0].snippet).toBe('A snippet');
  });

  test('does not overwrite existing title or snippet', () => {
    const input = [
      { url: 'https://a.com', title: 'First Title', snippet: 'First snippet', source: 'brave' },
      { url: 'https://a.com', title: 'Later Title', snippet: 'Later snippet', source: 'bing' },
    ];
    const result = dedupe(input);
    expect(result[0].title).toBe('First Title');
    expect(result[0].snippet).toBe('First snippet');
  });

  test('keeps best (lowest non-zero) rank', () => {
    const input = [
      { url: 'https://a.com', title: 'A', source: 'brave', rank: 5 },
      { url: 'https://a.com', title: 'A', source: 'bing', rank: 2 },
      { url: 'https://a.com', title: 'A', source: 'google', rank: 8 },
    ];
    const result = dedupe(input);
    expect(result[0].rank).toBe(2);
  });

  test('merges meta without overwriting existing keys', () => {
    const input = [
      { url: 'https://a.com', source: 'brave', meta: { tags: ['fossil'], author: 'Alice' } },
      { url: 'https://a.com', source: 'bing', meta: { tags: ['doc'], year: 2024 } },
    ];
    const result = dedupe(input);
    expect(result[0].meta).toEqual({ tags: ['fossil'], author: 'Alice', year: 2024 });
  });

  test('handles results with no meta gracefully', () => {
    const input = [
      { url: 'https://a.com', source: 'brave' },
      { url: 'https://a.com', source: 'bing', meta: { year: 2024 } },
    ];
    const result = dedupe(input);
    expect(result[0].meta).toEqual({ year: 2024 });
  });

  test('skips results without url', () => {
    const input = [
      { title: 'No URL', source: 'brave' },
      { url: 'https://a.com', title: 'Has URL', source: 'bing' },
    ];
    const result = dedupe(input);
    expect(result.length).toBe(1);
    expect(result[0].url).toBe('https://a.com');
  });
});
