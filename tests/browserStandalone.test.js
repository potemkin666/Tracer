import {
  buildQueryPlan,
  expandRelevantResults,
  isRelevantStandaloneResult,
  queryVariants,
} from '../docs/scripts/shared/queryShared.js';
import {
  dedupeStandalone,
  scoreStandalone,
  searchDirect,
} from '../docs/scripts/standalone/search.js';
import { buildResultsBrief } from '../docs/scripts/shared/resultBrief.js';

describe('standalone browser helpers', () => {
  test('query variants include username-style forms', () => {
    const plan = buildQueryPlan('John Smith');
    expect(queryVariants(plan, {
      includeExact: true,
      includeSlug: true,
      includeUnderscored: true,
      includeHyphenated: true,
      includeDotted: true,
      includeHandle: true,
      includeLocalPart: true,
    })).toEqual(['John Smith', '"John Smith"', 'johnsmith', 'john_smith', 'john-smith', 'john.smith', '@johnsmith']);
  });

  test('relevance filtering keeps strong multi-token matches', () => {
    const plan = buildQueryPlan('john smith');
    expect(isRelevantStandaloneResult({
      title: 'Profile of John',
      snippet: 'smith on example',
      url: 'https://example.com',
    }, plan)).toBe(true);
    expect(isRelevantStandaloneResult({
      title: 'Only John here',
      snippet: '',
      url: 'https://example.com',
    }, plan)).toBe(false);
  });

  test('expands standalone results by 10 percent when near matches exist', () => {
    const plan = buildQueryPlan('john smith');
    const relevant = Array.from({ length: 10 }, (_, index) => ({
      title: `john smith result ${index}`,
      snippet: 'profile',
      url: `https://example.com/${index}`,
    }));
    const spillover = [
      { title: 'john profile', snippet: '', url: 'https://example.com/near-1' },
      { title: 'smith profile', snippet: '', url: 'https://example.com/near-2' },
    ];

    const expanded = expandRelevantResults([...relevant, ...spillover], plan, 0.1);
    expect(expanded).toHaveLength(11);
  });

  test('scoreStandalone prefers username-style matches over partial hits', () => {
    const scored = scoreStandalone([
      {
        title: 'Partial mention',
        snippet: 'john only',
        url: 'https://example.com/about',
        source: 'demo',
      },
      {
        title: 'Account',
        snippet: '',
        url: 'https://example.com/john_smith',
        source: 'demo',
      },
    ], 'john smith');

    expect(scored[0].url).toBe('https://example.com/john_smith');
    expect(scored[0].score).toBeGreaterThan(scored[1].score);
  });

  test('scoreStandalone boosts identity-oriented sources for direct handles', () => {
    const scored = scoreStandalone([
      {
        title: '@alice',
        snippet: 'Bluesky account',
        url: 'https://bsky.app/profile/alice.test',
        source: 'bluesky',
      },
      {
        title: 'Alice mention',
        snippet: 'discussion thread',
        url: 'https://example.com/topic',
        source: 'demo',
      },
    ], '@alice');

    expect(scored[0].source).toBe('bluesky');
  });

  test('searchDirect merges sources, scores results, and surfaces spillover candidates', async () => {
    let summary = '';
    const results = await searchDirect('john smith', [
      {
        name: 'alpha',
        fn: async () => [
          { title: 'John Smith', snippet: '', url: 'https://example.com/profile', source: 'alpha', seenOn: ['alpha'] },
        ],
      },
      {
        name: 'beta',
        fn: async () => [
          { title: '', snippet: 'John Smith mirror', url: 'https://example.com/profile', source: 'beta', seenOn: ['beta'] },
        ],
      },
      {
        name: 'gamma',
        fn: async () => [
          { title: 'John', snippet: '', url: 'https://example.com/john', source: 'gamma', seenOn: ['gamma'] },
        ],
      },
    ], {
      initLiveProgress: () => {},
      updateLiveProgress: () => {},
      renderSourceStatus: () => {},
      showWarnings: () => {},
      showEngineSummary(value) {
        summary = value;
      },
      rateLimitWarnings: [],
      connected: false,
      extraRatio: 0.1,
    });

    expect(summary).toBe('STANDALONE · 3/3 sources responded');
    expect(results).toHaveLength(2);
    expect(results[0].seenOn).toEqual(['alpha', 'beta']);
    expect(results.some((result) => result.url === 'https://example.com/john')).toBe(true);
  });

  test('dedupeStandalone collapses normalized duplicate URLs', () => {
    const results = dedupeStandalone([
      {
        title: 'Primary',
        snippet: '',
        url: 'https://Example.com/profile/?utm_source=test#bio',
        source: 'alpha',
        seenOn: ['alpha'],
      },
      {
        title: '',
        snippet: 'Duplicate',
        url: 'https://example.com/profile',
        source: 'beta',
        seenOn: ['beta'],
      },
    ]);

    expect(results).toHaveLength(1);
    expect(results[0].seenOn).toEqual(['alpha', 'beta']);
  });

  test('buildResultsBrief summarizes deduplicated results for users', () => {
    expect(buildResultsBrief([
      {
        title: 'John Smith',
        url: 'https://example.com/john-smith',
        source: 'alpha',
        seenOn: ['alpha', 'beta'],
        score: 84,
      },
      {
        title: 'John Smith archive',
        url: 'https://archive.org/john-smith',
        source: 'archive',
        seenOn: ['archive'],
        score: 42,
      },
    ])).toContain('2 unique signals after deduplication.');
  });
});
