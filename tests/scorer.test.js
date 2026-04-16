const { score } = require('../src/scorer');

describe('score', () => {
  test('adds score property to each result', () => {
    const results = [{ title: 'test', url: 'https://x.com', snippet: '', source: 'brave' }];
    const scored = score(results, 'test');
    expect(scored[0]).toHaveProperty('score');
  });

  test('returns results sorted by score descending', () => {
    const results = [
      { title: 'nothing here', url: 'https://a.com', snippet: '', source: 'brave' },
      { title: 'john smith profile', url: 'https://b.com', snippet: 'john smith is great', source: 'brave' },
    ];
    const scored = score(results, 'john smith');
    expect(scored[0].score).toBeGreaterThanOrEqual(scored[1].score);
  });

  test('gives higher score for exact match in title', () => {
    const results = [
      { title: 'john smith', url: 'https://a.com', snippet: '', source: 'brave' },
      { title: 'unrelated', url: 'https://b.com', snippet: '', source: 'brave' },
    ];
    const scored = score(results, 'john smith');
    const match = scored.find((r) => r.url === 'https://a.com');
    const noMatch = scored.find((r) => r.url === 'https://b.com');
    expect(match.score).toBeGreaterThan(noMatch.score);
  });

  test('handles empty array', () => {
    expect(score([], 'john smith')).toEqual([]);
  });
});
