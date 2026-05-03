import {
  buildArtifactSearchProfile,
  buildCloneSludgeReport,
  buildConsensusFractureMap,
  buildContagionMap,
  buildRelatedQueries,
  buildResultInsights,
  buildSourceFamilyTree,
  buildTimeline,
  detectLanguage,
  findFirstBlood,
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

  test('builds artifact-first profile, contagion map, and clone sludge report', () => {
    const results = [
      {
        title: 'favicon.ico captured from old forum',
        snippet: 'May 1, 2021 archived favicon and robots.txt remnants',
        url: 'https://forum.example/favicon.ico',
        source: 'forum',
        meta: { reliability: 'forum', sourceFamily: 'forum', tags: ['fossil', 'document'] },
      },
      {
        title: 'favicon.ico captured from old forum',
        snippet: 'May 2, 2021 Telegram repost',
        url: 'https://t.me/example/123',
        source: 'telegram',
        meta: { reliability: 'unknown', sourceFamily: 'social' },
      },
      {
        title: 'favicon.ico captured from old forum',
        snippet: 'May 3, 2021 tabloid story',
        url: 'https://tabloid.example/story',
        source: 'tabloid',
        meta: { reliability: 'media', sourceFamily: 'media' },
      },
    ];

    const artifactProfile = buildArtifactSearchProfile('favicon.ico', results);
    expect(artifactProfile).toMatchObject({
      intent: 'artifact',
      fossilCount: 1,
      hiddenCount: 1,
    });
    expect(artifactProfile.dominantArtifacts).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'favicon' }),
    ]));

    expect(buildContagionMap(results)).toEqual(expect.arrayContaining([
      expect.objectContaining({ route: 'forum → telegram → media', echoCount: 2 }),
    ]));

    expect(buildCloneSludgeReport(results)).toMatchObject({
      cloneFamilies: 1,
      repeatedResults: 2,
      largestFamilies: [expect.objectContaining({ echoCount: 2 })],
    });
  });

  test('builds echo families, earliest origin, and consensus fracture signals', () => {
    const results = [
      {
        title: 'Wire claim spreads across outlets',
        snippet: 'May 1, 2021 report from the same claim',
        url: 'https://news-a.example/story',
        source: 'news-a',
        meta: { reliability: 'media', sourceFamily: 'media' },
      },
      {
        title: 'Wire claim spreads across outlets',
        snippet: 'May 3, 2021 mirrored version of the same claim',
        url: 'https://news-b.example/story',
        source: 'news-b',
        meta: { reliability: 'media', sourceFamily: 'media' },
      },
      {
        title: 'Wire claim spreads across outlets',
        snippet: 'May 4, 2021 forum repost',
        url: 'https://forum.example/thread',
        source: 'forum',
        meta: { reliability: 'forum', sourceFamily: 'forum' },
      },
      {
        title: 'Official correction lands later',
        snippet: 'May 7, 2021 ministry statement',
        url: 'https://gov.example/statement',
        source: 'gov',
        meta: { reliability: 'official', sourceFamily: 'official' },
      },
      {
        title: 'Official correction lands later',
        snippet: 'May 8, 2021 directory copy',
        url: 'https://mirror.example/copy',
        source: 'mirror',
        meta: { reliability: 'unknown', sourceFamily: 'broker-directory' },
      },
    ];

    const familyTree = buildSourceFamilyTree(results);
    expect(familyTree[0]).toMatchObject({
      size: 3,
      echoCount: 2,
      ancestor: {
        url: 'https://news-a.example/story',
        source: 'news-a',
      },
    });

    expect(findFirstBlood(results)).toMatchObject({
      url: 'https://news-a.example/story',
      dateLabel: 'May 1, 2021',
      echoCount: 2,
    });

    expect(buildResultInsights(results[0], 'Wire claim spreads across outlets').artifactTypes).toEqual([]);

    const consensus = buildConsensusFractureMap(results);
    expect(consensus.agreement).toEqual(expect.arrayContaining([
      expect.objectContaining({ size: 3, reliableCount: 2 }),
    ]));
    expect(consensus.divergence).toEqual(expect.arrayContaining([
      expect.objectContaining({ reliableCount: 1 }),
    ]));
    expect(consensus.amplification).toEqual(expect.arrayContaining([
      expect.objectContaining({ lowQualityCount: 1 }),
    ]));
  });
});
