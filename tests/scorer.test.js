import { score, extractFeatures, computeConfidence, WEIGHTS } from '../src/scorer.js';
import { buildQueryPlan } from '../src/queryPlanner.js';

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

  test('applies intent-specific ranking and source-family caps', () => {
    const scored = score([
      { title: 'alice handle', url: 'https://github.com/alice', snippet: '', source: 'github', meta: { username: 'alice' } },
      { title: 'alice handle mirror', url: 'https://gitlab.com/alice', snippet: '', source: 'gitlab', meta: { username: 'alice' } },
      { title: 'alice handle alt', url: 'https://codeberg.org/alice', snippet: '', source: 'codeberg', meta: { username: 'alice' } },
      { title: 'alice package', url: 'https://npmjs.com/package/alice', snippet: '', source: 'npm', meta: {} },
      { title: 'alice package clone', url: 'https://pypi.org/project/alice', snippet: '', source: 'pypi', meta: {} },
      { title: 'alice package mirror', url: 'https://rubygems.org/gems/alice', snippet: '', source: 'rubygems', meta: {} },
      { title: 'alice package extra', url: 'https://crates.io/crates/alice', snippet: '', source: 'crates', meta: {} },
    ], '@alice');

    expect(scored[0].meta.queryIntent).toBe('handle');
    expect(scored.find((result) => result.url === 'https://crates.io/crates/alice').meta.familyPenalty).toBeGreaterThan(0);
  });

  test('adds a why-survived explanation for weaker but useful results', () => {
    const scored = score([
      {
        title: 'archived alice trace',
        url: 'https://web.archive.org/web/20240101000000/https://example.com/alice',
        snippet: 'older capture',
        source: 'wayback',
        meta: {},
      },
    ], 'alice');

    expect(scored[0].meta.whySurvived).toContain('archive');
  });
});

describe('extractFeatures', () => {
  test('returns expected feature keys', () => {
    const r = { title: 'test', url: 'https://x.com', snippet: '', source: 'brave', meta: {} };
    const features = extractFeatures(r, buildQueryPlan('test'), {});
    expect(features).toHaveProperty('titleExact');
    expect(features).toHaveProperty('freshHit');
    expect(features).toHaveProperty('authorityHit');
    expect(features).toHaveProperty('keywordProximity');
    expect(features).toHaveProperty('fuzzyUsername');
    expect(features).toHaveProperty('geoHit');
    expect(features).toHaveProperty('bias', 1);
  });

  test('detects fossil and timeslice tags', () => {
    const r = { title: '', url: '', snippet: '', source: 'timeslice', meta: { tags: ['fossil', 'timeslice'] } };
    const features = extractFeatures(r, buildQueryPlan('query'), {});
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
    const features = extractFeatures(r, buildQueryPlan('brian kalbacher'), {});
    expect(features.urlUsername).toBe(1);
    expect(features.allTokensPresent).toBe(1);
  });

  test('boosts direct username matches from identity-oriented sources', () => {
    const features = extractFeatures({
      title: 'alice',
      url: 'https://github.com/alice',
      snippet: 'GitHub user',
      source: 'github',
      meta: { username: 'alice', tags: ['social', 'profile'] },
    }, buildQueryPlan('@alice'), {});
    expect(features.usernameExact).toBe(1);
    expect(features.identitySource).toBe(1);
  });

  test('captures freshness, authority, and keyword proximity signals', () => {
    const features = extractFeatures({
      title: 'Alice Example profile 2025',
      url: 'https://github.com/alice-example',
      snippet: 'Alice Example maintains this repository',
      source: 'github',
      meta: { username: 'alice-example', year: 2025, region: 'uk', reliability: 'official' },
    }, buildQueryPlan('alice example region:uk'), {});

    expect(features.freshHit).toBeGreaterThan(0);
    expect(features.authorityHit).toBeGreaterThan(0.5);
    expect(features.keywordProximity).toBeGreaterThan(0.5);
    expect(features.geoHit).toBe(1);
    expect(features.officialHit).toBe(1);
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
