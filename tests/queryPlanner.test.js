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

  test('includes username variant with underscores', () => {
    expect(results).toContain('john_smith');
  });

  test('includes username variant with hyphens', () => {
    expect(results).toContain('john-smith');
  });

  test('deduplicates case-insensitive variants for single-token input', () => {
    expect(generateQueries('Alice')).toEqual([
      'Alice',
      'Alice site:linkedin.com',
      'Alice site:twitter.com',
      'Alice site:github.com',
      'Alice site:reddit.com',
      'Alice site:facebook.com',
      'Alice site:web.archive.org',
    ]);
  });
});
