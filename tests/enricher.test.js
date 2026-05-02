import { classifyUrl, enrich } from '../src/enricher.js';

describe('classifyUrl', () => {
  test('detects Twitter/X as social with username', () => {
    const result = classifyUrl('https://twitter.com/jsmith');
    expect(result.category).toBe('social');
    expect(result.username).toBe('jsmith');
  });

  test('detects x.com as social', () => {
    const result = classifyUrl('https://x.com/john_doe');
    expect(result.category).toBe('social');
    expect(result.username).toBe('john_doe');
  });

  test('detects GitHub as tech with username', () => {
    const result = classifyUrl('https://github.com/octocat');
    expect(result.category).toBe('tech');
    expect(result.username).toBe('octocat');
  });

  test('detects LinkedIn as social with username', () => {
    const result = classifyUrl('https://linkedin.com/in/john-smith');
    expect(result.category).toBe('social');
    expect(result.username).toBe('john-smith');
  });

  test('detects .edu as academic', () => {
    const result = classifyUrl('https://www.stanford.edu/people/jsmith');
    expect(result.category).toBe('academic');
  });

  test('detects .gov as gov', () => {
    const result = classifyUrl('https://www.whitehouse.gov/about');
    expect(result.category).toBe('gov');
  });

  test('detects arxiv as academic', () => {
    const result = classifyUrl('https://arxiv.org/abs/2301.12345');
    expect(result.category).toBe('academic');
  });

  test('returns null for unknown domains', () => {
    const result = classifyUrl('https://random-site.xyz/page');
    expect(result.category).toBeNull();
    expect(result.username).toBeNull();
  });

  test('handles null/empty input', () => {
    expect(classifyUrl(null).category).toBeNull();
    expect(classifyUrl('').category).toBeNull();
  });

  test('detects Reddit with username', () => {
    const result = classifyUrl('https://reddit.com/user/testuser');
    expect(result.category).toBe('social');
    expect(result.username).toBe('testuser');
  });

  test('detects Instagram with username', () => {
    const result = classifyUrl('https://instagram.com/john.smith');
    expect(result.category).toBe('social');
    expect(result.username).toBe('john.smith');
  });

  test('detects Keybase with username', () => {
    const result = classifyUrl('https://keybase.io/testuser');
    expect(result.category).toBe('tech');
    expect(result.username).toBe('testuser');
  });
});

describe('enrich', () => {
  test('adds social tag to social-platform results', () => {
    const results = [
      { url: 'https://twitter.com/jsmith', title: 'J Smith', snippet: '', meta: {} },
    ];
    const enriched = enrich(results, 'jsmith');
    expect(enriched[0].meta.tags).toContain('social');
    expect(enriched[0].meta.domainCategory).toBe('social');
    expect(enriched[0].meta.username).toBe('jsmith');
  });

  test('adds profile tag when username matches search term', () => {
    const results = [
      { url: 'https://github.com/octocat', title: 'octocat', snippet: '', meta: {} },
    ];
    const enriched = enrich(results, 'octocat');
    expect(enriched[0].meta.tags).toContain('profile');
    expect(enriched[0].meta.username).toBe('octocat');
  });

  test('does not add profile tag when username does not match', () => {
    const results = [
      { url: 'https://github.com/octocat', title: 'octocat', snippet: '', meta: {} },
    ];
    const enriched = enrich(results, 'john smith');
    expect(enriched[0].meta.tags).not.toContain('profile');
  });

  test('adds academic tag for .edu domains', () => {
    const results = [
      { url: 'https://mit.edu/people/jsmith', title: 'J Smith', snippet: '', meta: {} },
    ];
    const enriched = enrich(results, 'jsmith');
    expect(enriched[0].meta.tags).toContain('academic');
  });

  test('preserves existing tags', () => {
    const results = [
      { url: 'https://twitter.com/jsmith', title: '', snippet: '', meta: { tags: ['fossil'] } },
    ];
    const enriched = enrich(results, 'jsmith');
    expect(enriched[0].meta.tags).toContain('fossil');
    expect(enriched[0].meta.tags).toContain('social');
  });

  test('handles results with no meta', () => {
    const results = [
      { url: 'https://example.com', title: 'Test', snippet: '' },
    ];
    const enriched = enrich(results, 'test');
    expect(enriched[0].meta).toBeDefined();
    expect(Array.isArray(enriched[0].meta.tags)).toBe(true);
  });

  test('handles empty results array', () => {
    expect(enrich([], 'test')).toEqual([]);
  });
});
