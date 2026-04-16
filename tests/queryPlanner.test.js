import { generateQueries } from '../src/queryPlanner.js';

describe('generateQueries', () => {
  const results = generateQueries('john smith');

  test('returns an array', () => {
    expect(Array.isArray(results)).toBe(true);
  });

  test('includes exact match with quotes', () => {
    expect(results).toContain('"john smith"');
  });

  test('includes site-specific query for linkedin', () => {
    expect(results.some((q) => q.includes('site:linkedin.com'))).toBe(true);
  });

  test('includes site-specific query for github', () => {
    expect(results.some((q) => q.includes('site:github.com'))).toBe(true);
  });

  test('includes username variant without spaces', () => {
    expect(results).toContain('johnsmith');
  });
});
