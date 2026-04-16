import { normalise } from '../src/normaliser.js';

describe('normalise', () => {
  test('returns object with all required fields', () => {
    const result = normalise('brave', 'john smith', { title: 'John Smith', url: 'https://example.com', snippet: 'About John', rank: 1 });
    expect(result).toHaveProperty('source');
    expect(result).toHaveProperty('query');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('url');
    expect(result).toHaveProperty('snippet');
    expect(result).toHaveProperty('rank');
  });

  test('uses provided source and query', () => {
    const result = normalise('serpapi', 'test query', {});
    expect(result.source).toBe('serpapi');
    expect(result.query).toBe('test query');
  });

  test('handles missing fields gracefully with defaults', () => {
    const result = normalise('brave', 'x', {});
    expect(result.title).toBe('');
    expect(result.url).toBe('');
    expect(result.snippet).toBe('');
    expect(result.rank).toBe(0);
  });
});
