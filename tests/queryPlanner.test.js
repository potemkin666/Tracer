import { generateQueries, rewriteQueryTerms } from '../src/queryPlanner.js';

describe('generateQueries', () => {
  const results = generateQueries('john smith');

  test('returns an array', () => {
    expect(Array.isArray(results)).toBe(true);
  });

  test('includes exact match with quotes', () => {
    expect(results).toContain('"john smith"');
  });

  test('includes site-specific query for linkedin', () => {
    expect(results.some((q) => q.includes('site:linkedin.com/in'))).toBe(true);
  });

  test('includes site-specific query for github', () => {
    expect(results.some((q) => q.includes('site:github.com'))).toBe(true);
  });

  test('includes people-focused site queries for keybase and bluesky', () => {
    expect(results.some((q) => q.includes('site:keybase.io'))).toBe(true);
    expect(results.some((q) => q.includes('site:bsky.app/profile'))).toBe(true);
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

  test('includes username variant with dots', () => {
    expect(results).toContain('john.smith');
  });

  test('deduplicates case-insensitive variants for single-token input while adding direct profile sites', () => {
    const queries = generateQueries('Alice');
    expect(queries[0]).toBe('Alice');
    expect(queries).toContain('@alice');
    expect(queries).toContain('alice site:github.com');
    expect(queries).toContain('alice site:codeberg.org');
    expect(queries).toContain('alice site:news.ycombinator.com/user');
  });
});

describe('rewriteQueryTerms', () => {
  test('adds stemming and synonym variants', () => {
    expect(rewriteQueryTerms('profiles forum')).toEqual(expect.arrayContaining([
      'profiles forum',
      'profile forum',
      'profiles board',
      'profiles community',
    ]));
  });

  test('normalizes repeated letters for spelling-like corrections', () => {
    expect(rewriteQueryTerms('jooohn')).toContain('joohn');
  });

  test('keeps double letters intact when they are already normalized', () => {
    expect(rewriteQueryTerms('joohn')).toContain('joohn');
  });

  test('does not over-stem vowel-plus-ies words', () => {
    expect(rewriteQueryTerms('movies')).toContain('movie');
  });
});
