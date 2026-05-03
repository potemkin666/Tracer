import { expandArchiveFirstResults } from '../src/archiveFallback.js';

describe('expandArchiveFirstResults', () => {
  test('creates archive-lane results for strong dead links', async () => {
    const expanded = await expandArchiveFirstResults([
      {
        title: 'Alice Example',
        url: 'https://example.com/alice',
        source: 'demo',
        rank: 1,
        score: 80,
        confidence: 0.8,
        meta: {
          pageStatus: 'dead',
          archiveUrl: 'https://web.archive.org/web/20210101000000/https://example.com/alice',
          tags: ['profile'],
        },
      },
    ], {
      fetchTimelineImpl: async () => ([
        { url: 'https://example.com/alice', timestamp: '20200102030405' },
        { url: 'https://example.com/alice', timestamp: '20180102030405' },
      ]),
    });

    expect(expanded).toHaveLength(2);
    expect(expanded[0].source).toBe('archive-first');
    expect(expanded[0].meta.tags).toContain('archive-lane');
    expect(expanded[0].meta.archiveSourceUrl).toBe('https://example.com/alice');
  });

  test('skips non-dead or weak results', async () => {
    const expanded = await expandArchiveFirstResults([
      {
        url: 'https://example.com/live',
        score: 80,
        meta: { pageStatus: 'live', archiveUrl: 'https://web.archive.org/example' },
      },
      {
        url: 'https://example.com/weak',
        score: 40,
        meta: { pageStatus: 'dead', archiveUrl: 'https://web.archive.org/example' },
      },
    ], {
      fetchTimelineImpl: async () => ([{ url: 'https://example.com', timestamp: '20200102030405' }]),
    });

    expect(expanded).toEqual([]);
  });
});
