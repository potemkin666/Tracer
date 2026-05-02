import { score, extractFeatures, computeConfidence, WEIGHTS } from '../src/scorer.js';

describe('score', () => {
  test('adds score and confidence properties to each result', () => {
    const results = [{ title: 'test', url: 'https://x.com', snippet: '', source: 'brave' }];
    const scored = score(results, 'test');
    expect(scored[0]).toHaveProperty('score');
    expect(scored[0]).toHaveProperty('confidence');
    expect(typeof scored[0].score).toBe('number');
    expect(scored[0].confidence).toBeGreaterThan(0);
    expect(scored[0].confidence).toBeLessThan(1);
  });

  test('returns results sorted by confidence descending', () => {
    const results = [
      { title: 'nothing here', url: 'https://a.com', snippet: '', source: 'brave' },
      { title: 'john smith profile', url: 'https://b.com', snippet: 'john smith is great', source: 'brave' },
    ];
    const scored = score(results, 'john smith');
    expect(scored[0].confidence).toBeGreaterThanOrEqual(scored[1].confidence);
  });

  test('gives higher confidence for exact match in title', () => {
    const results = [
      { title: 'john smith', url: 'https://a.com', snippet: '', source: 'brave' },
      { title: 'unrelated', url: 'https://b.com', snippet: '', source: 'brave' },
    ];
    const scored = score(results, 'john smith');
    const match = scored.find((r) => r.url === 'https://a.com');
    const noMatch = scored.find((r) => r.url === 'https://b.com');
    expect(match.confidence).toBeGreaterThan(noMatch.confidence);
  });

  test('handles empty array', () => {
    expect(score([], 'john smith')).toEqual([]);
  });

  test('score is an integer between 0 and 100', () => {
    const results = [
      { title: 'john smith', url: 'https://a.com/johnsmith', snippet: 'john smith bio', source: 'brave', rank: 1 },
    ];
    const scored = score(results, 'john smith');
    expect(Number.isInteger(scored[0].score)).toBe(true);
    expect(scored[0].score).toBeGreaterThanOrEqual(0);
    expect(scored[0].score).toBeLessThanOrEqual(100);
  });
});

describe('extractFeatures', () => {
  test('returns expected feature keys', () => {
    const r = { title: 'test', url: 'https://x.com', snippet: '', source: 'brave', meta: {} };
    const features = extractFeatures(r, 'test', ['test'], {});
    expect(features).toHaveProperty('titleExact');
    expect(features).toHaveProperty('bias', 1);
  });

  test('detects fossil and timeslice tags', () => {
    const r = { title: '', url: '', snippet: '', source: 'timeslice', meta: { tags: ['fossil', 'timeslice'] } };
    const features = extractFeatures(r, 'query', ['query'], {});
    expect(features.fossilTag).toBe(1);
    expect(features.timesliceTag).toBe(1);
  });

  test('detects username-style url variants and full token coverage', () => {
    const r = {
      title: 'Brian profile',
      url: 'https://example.com/users/brian-kalbacher',
      snippet: 'Official profile for Brian Kalbacher',
      source: 'brave',
      meta: {},
    };
    const features = extractFeatures(r, 'brian kalbacher', ['brian', 'kalbacher'], {});
    expect(features.urlUsername).toBe(1);
    expect(features.allTokensPresent).toBe(1);
  });
});

describe('computeConfidence', () => {
  test('returns a value between 0 and 1', () => {
    const features = { titleExact: 1, bias: 1 };
    const conf = computeConfidence(features);
    expect(conf).toBeGreaterThan(0);
    expect(conf).toBeLessThan(1);
  });

  test('all-zero features produce low confidence', () => {
    const zeroFeatures = {};
    for (const key of Object.keys(WEIGHTS)) {
      zeroFeatures[key] = key === 'bias' ? 1 : 0;
    }
    const conf = computeConfidence(zeroFeatures);
    expect(conf).toBeLessThan(0.5);
  });

  test('full token coverage boosts confidence over a one-token partial match', () => {
    const partial = computeConfidence({
      titleExact: 0,
      snippetExact: 0,
      urlUsername: 0,
      multiSource: 0,
      archiveSource: 0,
      fossilTag: 0,
      timesliceTag: 0,
      documentTag: 0,
      socialTag: 0,
      profileTag: 0,
      lowRank: 0,
      allTokensPresent: 0,
      titlePartial: 1,
      snippetPartial: 0,
      bias: 1,
    });
    const strong = computeConfidence({
      titleExact: 0,
      snippetExact: 0,
      urlUsername: 1,
      multiSource: 0,
      archiveSource: 0,
      fossilTag: 0,
      timesliceTag: 0,
      documentTag: 0,
      socialTag: 0,
      profileTag: 0,
      lowRank: 0,
      allTokensPresent: 1,
      titlePartial: 1,
      snippetPartial: 1,
      bias: 1,
    });
    expect(strong).toBeGreaterThan(partial);
  });
});
