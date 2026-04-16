import { buildGraph } from '../src/graphBuilder.js';

describe('buildGraph', () => {
  // ── Helpers ────────────────────────────────────────────────────────────
  function result(overrides) {
    return {
      url: 'https://example.com',
      title: 'Example',
      snippet: '',
      source: 'test',
      score: 50,
      rank: 1,
      meta: {},
      ...overrides,
    };
  }

  // ── Node tests ─────────────────────────────────────────────────────────
  test('returns empty graph for empty input', () => {
    const { nodes, edges } = buildGraph([], []);
    expect(nodes).toEqual([]);
    expect(edges).toEqual([]);
  });

  test('creates one node per unique URL', () => {
    const results = [
      result({ url: 'https://a.com', title: 'A' }),
      result({ url: 'https://b.com', title: 'B' }),
      result({ url: 'https://a.com', title: 'A duplicate' }),
    ];
    const { nodes } = buildGraph(results);
    expect(nodes).toHaveLength(2);
    expect(nodes.map(n => n.id).sort()).toEqual(['https://a.com', 'https://b.com']);
  });

  test('skips results without a url', () => {
    const results = [result({ url: '' }), result({ url: 'https://a.com' })];
    const { nodes } = buildGraph(results);
    expect(nodes).toHaveLength(1);
  });

  test('nodes carry score, source, domain, and tags', () => {
    const r = result({
      url: 'https://github.com/user',
      title: 'User',
      source: 'brave',
      score: 73,
      meta: { tags: ['social', 'profile'] },
    });
    const { nodes } = buildGraph([r]);
    expect(nodes[0]).toMatchObject({
      id: 'https://github.com/user',
      score: 73,
      source: 'brave',
      domain: 'github.com',
      tags: ['social', 'profile'],
    });
  });

  // ── Edge: sameAvatar ───────────────────────────────────────────────────
  test('sameAvatar edges from avatarClusters', () => {
    const results = [
      result({ url: 'https://a.com' }),
      result({ url: 'https://b.com' }),
      result({ url: 'https://c.com' }),
    ];
    const clusters = [
      { avatarHash: 'abc12345def', urls: ['https://a.com', 'https://b.com'] },
    ];
    const { edges } = buildGraph(results, clusters);
    const avatarEdges = edges.filter(e => e.type === 'sameAvatar');
    expect(avatarEdges).toHaveLength(1);
    expect(avatarEdges[0]).toMatchObject({ type: 'sameAvatar', detail: 'abc12345' });
  });

  test('sameAvatar cluster with 3 URLs produces 3 edges', () => {
    const results = [
      result({ url: 'https://a.com' }),
      result({ url: 'https://b.com' }),
      result({ url: 'https://c.com' }),
    ];
    const clusters = [
      { avatarHash: 'abc12345def', urls: ['https://a.com', 'https://b.com', 'https://c.com'] },
    ];
    const { edges } = buildGraph(results, clusters);
    const avatarEdges = edges.filter(e => e.type === 'sameAvatar');
    expect(avatarEdges).toHaveLength(3);
  });

  test('sameAvatar ignores URLs not in the results', () => {
    const results = [result({ url: 'https://a.com' })];
    const clusters = [
      { avatarHash: 'abc12345def', urls: ['https://a.com', 'https://unknown.com'] },
    ];
    const { edges } = buildGraph(results, clusters);
    const avatarEdges = edges.filter(e => e.type === 'sameAvatar');
    expect(avatarEdges).toHaveLength(0);
  });

  // ── Edge: sameDomain ───────────────────────────────────────────────────
  test('sameDomain edges for results on the same domain', () => {
    const results = [
      result({ url: 'https://github.com/user1' }),
      result({ url: 'https://github.com/user2' }),
    ];
    const { edges } = buildGraph(results);
    const domainEdges = edges.filter(e => e.type === 'sameDomain');
    expect(domainEdges).toHaveLength(1);
    expect(domainEdges[0].detail).toBe('github.com');
  });

  test('no sameDomain edge for different domains', () => {
    const results = [
      result({ url: 'https://github.com/user1' }),
      result({ url: 'https://twitter.com/user1' }),
    ];
    const { edges } = buildGraph(results);
    const domainEdges = edges.filter(e => e.type === 'sameDomain');
    expect(domainEdges).toHaveLength(0);
  });

  // ── Edge: sharedEmail ──────────────────────────────────────────────────
  test('sharedEmail edges for results with same email domain in snippets', () => {
    const results = [
      result({ url: 'https://a.com', snippet: 'contact: john@corp.io' }),
      result({ url: 'https://b.com', title: 'jane@corp.io profile' }),
    ];
    const { edges } = buildGraph(results);
    const emailEdges = edges.filter(e => e.type === 'sharedEmail');
    expect(emailEdges).toHaveLength(1);
    expect(emailEdges[0].detail).toBe('corp.io');
  });

  test('no sharedEmail edge when email domains differ', () => {
    const results = [
      result({ url: 'https://a.com', snippet: 'john@alpha.io' }),
      result({ url: 'https://b.com', snippet: 'jane@beta.io' }),
    ];
    const { edges } = buildGraph(results);
    const emailEdges = edges.filter(e => e.type === 'sharedEmail');
    expect(emailEdges).toHaveLength(0);
  });

  // ── Edge: crossLinked ──────────────────────────────────────────────────
  test('crossLinked edge when one snippet mentions another result URL', () => {
    const results = [
      result({ url: 'https://a.com', snippet: 'Also see https://b.com for more' }),
      result({ url: 'https://b.com', snippet: 'Some content' }),
    ];
    const { edges } = buildGraph(results);
    const crossEdges = edges.filter(e => e.type === 'crossLinked');
    expect(crossEdges).toHaveLength(1);
  });

  test('no crossLinked edge when no URL mentions', () => {
    const results = [
      result({ url: 'https://a.com', snippet: 'Nothing here' }),
      result({ url: 'https://b.com', snippet: 'Nothing here either' }),
    ];
    const { edges } = buildGraph(results);
    const crossEdges = edges.filter(e => e.type === 'crossLinked');
    expect(crossEdges).toHaveLength(0);
  });

  // ── Edge: sharedUsername ────────────────────────────────────────────────
  test('sharedUsername edge when same username appears on different platforms', () => {
    const results = [
      result({ url: 'https://github.com/jsmith' }),
      result({ url: 'https://twitter.com/jsmith' }),
    ];
    const { edges } = buildGraph(results);
    const usernameEdges = edges.filter(e => e.type === 'sharedUsername');
    expect(usernameEdges).toHaveLength(1);
    expect(usernameEdges[0].detail).toBe('jsmith');
  });

  test('no sharedUsername edge when same domain (covered by sameDomain)', () => {
    const results = [
      result({ url: 'https://github.com/jsmith' }),
      result({ url: 'https://github.com/jsmith2' }),
    ];
    const { edges } = buildGraph(results);
    const usernameEdges = edges.filter(e => e.type === 'sharedUsername');
    expect(usernameEdges).toHaveLength(0);
  });

  test('no sharedUsername edge when usernames differ', () => {
    const results = [
      result({ url: 'https://github.com/alice' }),
      result({ url: 'https://twitter.com/bob' }),
    ];
    const { edges } = buildGraph(results);
    const usernameEdges = edges.filter(e => e.type === 'sharedUsername');
    expect(usernameEdges).toHaveLength(0);
  });

  test('sharedUsername from enricher meta.username fallback', () => {
    const results = [
      result({ url: 'https://github.com/jsmith', meta: { username: 'jsmith' } }),
      result({ url: 'https://example.com/profile', meta: { username: 'jsmith' } }),
    ];
    const { edges } = buildGraph(results);
    const usernameEdges = edges.filter(e => e.type === 'sharedUsername');
    expect(usernameEdges).toHaveLength(1);
  });

  // ── Dedup ──────────────────────────────────────────────────────────────
  test('does not create duplicate edges', () => {
    const results = [
      result({ url: 'https://github.com/a' }),
      result({ url: 'https://github.com/b' }),
    ];
    // buildGraph twice on same data should still produce 1 sameDomain edge
    const { edges } = buildGraph([...results, ...results]);
    const domainEdges = edges.filter(e => e.type === 'sameDomain');
    expect(domainEdges).toHaveLength(1);
  });

  // ── Integration ────────────────────────────────────────────────────────
  test('mixed edge types in a single graph', () => {
    const results = [
      result({ url: 'https://github.com/alice', snippet: 'alice@example.com' }),
      result({ url: 'https://github.com/bob', snippet: 'bob@example.com — see also https://github.com/alice' }),
      result({ url: 'https://twitter.com/alice', snippet: '' }),
    ];
    const clusters = [
      { avatarHash: 'deadbeef1234', urls: ['https://github.com/alice', 'https://twitter.com/alice'] },
    ];
    const { nodes, edges } = buildGraph(results, clusters);
    expect(nodes).toHaveLength(3);

    const types = edges.map(e => e.type);
    expect(types).toContain('sameAvatar');
    expect(types).toContain('sameDomain');
    expect(types).toContain('sharedEmail');
    expect(types).toContain('crossLinked');
    expect(types).toContain('sharedUsername');
  });
});
