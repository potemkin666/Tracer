import {
  buildRelatedQueries,
  buildResultInsights,
  buildTimeline,
  detectLanguage,
  inferReliability,
} from '../src/resultInsights.js';

describe('result insights', () => {
  test('extracts entities, language, reliability, and timeline metadata', () => {
    const insights = buildResultInsights({
      title: 'Alice Example joins Example Labs Inc',
      snippet: 'Contact alice@example.com on May 4, 2024 for the official launch.',
      url: 'https://example.edu/news/alice',
      meta: { domainCategory: 'academic' },
    }, 'alice example');

    expect(insights.entities.names).toContain('Alice Example');
    expect(insights.entities.emails).toContain('alice@example.com');
    expect(insights.entities.orgs).toContain('Example Labs Inc');
    expect(insights.reliability).toBe('official');
    expect(insights.timeline.year).toBe(2024);
    expect(insights.language).toBe('en');
  });

  test('detects common non-English snippets and translation links', () => {
    expect(detectLanguage('perfil oficial con noticias y cuenta')).toBe('es');
    const insights = buildResultInsights({
      title: 'perfil oficial',
      snippet: 'cuenta y noticias',
      url: 'https://example.com/es/perfil',
      meta: {},
    }, 'perfil');
    expect(insights.translationUrl).toContain('translate.google.com');
  });

  test('classifies forum and media reliability buckets', () => {
    expect(inferReliability({
      title: 'Discussion thread',
      snippet: 'community replies',
      url: 'https://reddit.com/user/example',
      meta: {},
    }, 'example')).toBe('forum');

    expect(inferReliability({
      title: 'Breaking update',
      snippet: 'Reuters report',
      url: 'https://reuters.com/world/example',
      meta: { domainCategory: 'news' },
    }, 'example')).toBe('media');
  });

  test('builds a descending timeline and smarter related queries', () => {
    const results = [
      {
        title: 'Alice Example profile',
        url: 'https://github.com/alice-example',
        source: 'github',
        meta: {
          username: 'alice-example',
          reliability: 'official',
          entities: { names: ['Alice Example'], emails: [], orgs: ['Example Labs Inc'] },
          timeline: { label: '2025-04-03', year: 2025, sortKey: '2025-04-03T00:00:00.000Z' },
        },
      },
      {
        title: 'Alice Example interview',
        url: 'https://example.org/story',
        source: 'media',
        meta: {
          reliability: 'media',
          timeline: { label: '2023', year: 2023, sortKey: '2023-01-01T00:00:00.000Z' },
          entities: { names: [], emails: [], orgs: [] },
        },
      },
    ];

    expect(buildTimeline(results).map((entry) => entry.year)).toEqual([2025, 2023]);
    expect(buildRelatedQueries('alice example', results)).toEqual(expect.arrayContaining([
      'intitle:"alice example"',
      'filetype:pdf "alice example"',
      'site:github.com "alice example"',
      '"alice-example" profile',
      '"Example Labs Inc" "alice example"',
    ]));
  });
});
