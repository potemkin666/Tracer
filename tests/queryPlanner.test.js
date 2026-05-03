import { buildQueryPlan, detectQueryIntent, generateQueries, generateScentVariants, isFuzzyHandleMatch, rewriteQueryTerms } from '../src/queryPlanner.js';

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

  test('adds artifact-first fossil queries for digital bloodhound searches', () => {
    const queries = generateQueries('favicon.ico');
    expect(queries).toEqual(expect.arrayContaining([
      '"favicon.ico" filetype:pdf',
      '"favicon.ico" "robots.txt"',
      '"favicon.ico" rss',
    ]));
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

  test('rewrites movies-style ies endings to their expected singular form', () => {
    expect(rewriteQueryTerms('movies')).toContain('movie');
  });
});

describe('buildQueryPlan operators', () => {
  test('extracts search operators from the free-text query', () => {
    const plan = buildQueryPlan('alice example site:github.com filetype:pdf lang:es region:uk intitle:"alice example"');
    expect(plan.raw).toBe('alice example');
    expect(plan.operators).toEqual({
      site: ['github.com'],
      filetype: ['pdf'],
      intitle: ['alice example'],
      inurl: [],
      lang: 'es',
      region: 'uk',
    });
  });
});

describe('isFuzzyHandleMatch', () => {
  test('matches close username variants', () => {
    expect(isFuzzyHandleMatch('alic3example', 'aliceexample')).toBe(true);
    expect(isFuzzyHandleMatch('bob', 'aliceexample')).toBe(false);
  });
});

describe('generateScentVariants', () => {
  test('builds mutation variants for handle-style bloodhound searches', () => {
    expect(generateScentVariants('@jose.example')).toEqual(expect.arrayContaining([
      '@jose.example',
      'jose.example',
      'j053.3x4mpl3',
      'js.xmpl',
    ]));
  });
});

describe('detectQueryIntent', () => {
  test('classifies core query intents', () => {
    expect(detectQueryIntent('alice@example.com')).toBe('email');
    expect(detectQueryIntent('+1 (555) 123-4567')).toBe('phone');
    expect(detectQueryIntent('@alice_example')).toBe('handle');
    expect(detectQueryIntent('Example Labs Inc')).toBe('company');
    expect(detectQueryIntent('avatar alice example')).toBe('image');
    expect(detectQueryIntent('favicon.ico')).toBe('artifact');
    expect(detectQueryIntent('Alice Example')).toBe('name');
  });

  test('stores the detected intent in the built query plan', () => {
    expect(buildQueryPlan('@alice').intent).toBe('handle');
  });
});
