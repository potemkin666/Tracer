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
});
