import { clusterResults } from '../src/resultClusters.js';

describe('clusterResults', () => {
  test('adds cluster metadata to similar profile pages', () => {
    const results = clusterResults([
      {
        title: 'Alice Example profile',
        url: 'https://github.com/alice-example',
        score: 95,
        meta: { username: 'alice-example' },
      },
      {
        title: 'Alice Example account',
        url: 'https://gitlab.com/alice-example',
        score: 88,
        meta: { username: 'alice-example' },
      },
      {
        title: 'Unrelated',
        url: 'https://example.com/unrelated',
        score: 30,
        meta: {},
      },
    ]);

    expect(results[0].meta.clusterId).toBeTruthy();
    expect(results[0].meta.clusterSize).toBe(2);
    expect(results[1].meta.clusterId).toBe(results[0].meta.clusterId);
    expect(results[2].meta.clusterId).toBeUndefined();
  });

  test('splits contradictory identities that share a loose cluster key', () => {
    const results = clusterResults([
      {
        title: 'Alice Example profile',
        url: 'https://example.com/profiles/alice-example',
        score: 95,
        meta: {
          entities: { emails: ['alice@corp.io'], orgs: ['Corp IO'], names: [] },
          region: 'uk',
        },
      },
      {
        title: 'Alice Example profile',
        url: 'https://mirror.example.net/profiles/alice-example',
        score: 88,
        meta: {
          entities: { emails: ['alice@corp.io'], orgs: ['Corp IO'], names: [] },
          region: 'uk',
        },
      },
      {
        title: 'Alice Example profile',
        url: 'https://directory.example.org/profiles/alice-example',
        score: 81,
        meta: {
          entities: { emails: ['alice@other.org'], orgs: ['Other Org'], names: [] },
          region: 'us',
        },
      },
    ]);

    expect(results[0].meta.clusterId).toBeTruthy();
    expect(results[1].meta.clusterId).toBe(results[0].meta.clusterId);
    expect(results[2].meta.clusterId).toBeUndefined();
  });
});
