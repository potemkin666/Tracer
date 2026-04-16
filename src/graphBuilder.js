/**
 * Builds an identity graph linking results by shared attributes.
 *
 * Nodes are individual results (keyed by URL).
 * Edges represent relationships:
 *   - sameAvatar:  two results share the same avatar image hash
 *   - sameDomain:  two results share the same URL domain (e.g. both on github.com)
 *   - sharedEmail: two result snippets/titles mention the same email domain
 *   - crossLinked: one result's URL appears in another result's snippet (or vice-versa)
 *
 * @module graphBuilder
 */

/**
 * Extract the hostname from a URL string, or return null.
 */
function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * Pull email-like patterns out of a text string.
 * Returns an array of lowercase email addresses found.
 */
function extractEmails(text) {
  if (!text) return [];
  const re = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return (text.match(re) || []).map(e => e.toLowerCase());
}

/**
 * Extract the domain portion of an email address.
 */
function emailDomain(email) {
  const at = email.indexOf('@');
  return at >= 0 ? email.slice(at + 1) : email;
}

/**
 * Build the identity graph.
 *
 * @param {object[]} results - scored Tracer results (each has url, title, snippet, source, score, meta, …)
 * @param {object[]} avatarClusters - array of { avatarHash, urls } from avatarHunter
 * @returns {{ nodes: object[], edges: object[] }}
 */
export function buildGraph(results, avatarClusters = []) {
  // ── Nodes ────────────────────────────────────────────────────────────────
  const nodeMap = new Map();

  for (const r of results) {
    if (!r.url) continue;
    if (nodeMap.has(r.url)) continue;

    const domain = extractDomain(r.url);
    const emails = [
      ...extractEmails(r.title),
      ...extractEmails(r.snippet),
    ];

    nodeMap.set(r.url, {
      id: r.url,
      label: r.title || r.url,
      source: r.source || '',
      score: r.score ?? 0,
      domain,
      emails,
      tags: (r.meta && r.meta.tags) || [],
    });
  }

  const nodes = [...nodeMap.values()];

  // ── Edges ────────────────────────────────────────────────────────────────
  const edgeSet = new Set();   // "url1|url2|type" dedup key
  const edges = [];

  function addEdge(a, b, type, detail) {
    if (a === b) return;
    const key = [a, b].sort().join('|') + '|' + type;
    if (edgeSet.has(key)) return;
    edgeSet.add(key);
    edges.push({ source: a, target: b, type, detail: detail || '' });
  }

  // 1. sameAvatar — from avatarClusters
  for (const cluster of avatarClusters) {
    const urls = cluster.urls.filter(u => nodeMap.has(u));
    for (let i = 0; i < urls.length; i++) {
      for (let j = i + 1; j < urls.length; j++) {
        addEdge(urls[i], urls[j], 'sameAvatar', cluster.avatarHash.slice(0, 8));
      }
    }
  }

  // 2. sameDomain — results on the same domain
  const byDomain = new Map();
  for (const node of nodes) {
    if (!node.domain) continue;
    if (!byDomain.has(node.domain)) byDomain.set(node.domain, []);
    byDomain.get(node.domain).push(node.id);
  }
  for (const [domain, urls] of byDomain) {
    if (urls.length < 2 || urls.length > 20) continue;   // skip huge generic domains
    for (let i = 0; i < urls.length; i++) {
      for (let j = i + 1; j < urls.length; j++) {
        addEdge(urls[i], urls[j], 'sameDomain', domain);
      }
    }
  }

  // 3. sharedEmail — results that mention the same email domain in title/snippet
  const byEmailDomain = new Map();
  for (const node of nodes) {
    const domains = new Set(node.emails.map(emailDomain));
    for (const d of domains) {
      if (!byEmailDomain.has(d)) byEmailDomain.set(d, []);
      byEmailDomain.get(d).push(node.id);
    }
  }
  for (const [domain, urls] of byEmailDomain) {
    if (urls.length < 2 || urls.length > 20) continue;
    for (let i = 0; i < urls.length; i++) {
      for (let j = i + 1; j < urls.length; j++) {
        addEdge(urls[i], urls[j], 'sharedEmail', domain);
      }
    }
  }

  // 4. crossLinked — one result's URL appears in another result's snippet
  const allUrls = [...nodeMap.keys()];
  for (const r of results) {
    if (!r.url || !r.snippet) continue;
    const snippetLower = r.snippet.toLowerCase();
    for (const otherUrl of allUrls) {
      if (otherUrl === r.url) continue;
      if (snippetLower.includes(otherUrl.toLowerCase())) {
        addEdge(r.url, otherUrl, 'crossLinked', '');
      }
    }
  }

  return { nodes, edges };
}
