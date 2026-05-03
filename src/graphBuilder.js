/**
 * Builds an identity graph linking results by shared attributes.
 *
 * Nodes are individual results (keyed by URL).
 * Edges represent relationships:
 *   - sameAvatar:     two results share the same avatar image hash
 *   - sameDomain:     two results share the same URL domain (e.g. both on github.com)
 *   - sharedEmail:    two result snippets/titles mention the same email domain
 *   - sharedUsername: two results on different platforms share the same username
 *   - crossLinked:    one result's URL appears in another result's snippet (or vice-versa)
 *
 * @module graphBuilder
 */

import { extractDomain, extractUsernameFromUrl } from './identity.js';

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

function extractUrls(text) {
  if (!text) return [];
  return (text.match(/https?:\/\/[^\s<>"')\]]+/gi) || [])
    .map((url) => url.replace(/[),.;:!?]+$/u, '').toLowerCase());
}

/**
 * Maximum number of nodes sharing a username before we skip edge creation.
 * Very common usernames (e.g. 'admin', 'test') would create too many
 * false-positive edges, so we cap the group size.
 */
const MAX_USERNAME_GROUP = 30;

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
    const usernameInfo = extractUsernameFromUrl(r.url);
    // Also fall back to enricher-injected username from meta
    const metaUsername = (r.meta && r.meta.username) ? r.meta.username.toLowerCase() : null;

    nodeMap.set(r.url, {
      id: r.url,
      label: r.title || r.url,
      source: r.source || '',
      score: r.score ?? 0,
      domain,
      emails,
      username: (usernameInfo && usernameInfo.username) || metaUsername || null,
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

  // 4. sharedUsername — results on different domains share the same username
  const byUsername = new Map();
  for (const node of nodes) {
    if (!node.username) continue;
    if (!byUsername.has(node.username)) byUsername.set(node.username, []);
    byUsername.get(node.username).push(node);
  }
  for (const [username, matchNodes] of byUsername) {
    if (matchNodes.length < 2 || matchNodes.length > MAX_USERNAME_GROUP) continue;
    // Only link nodes on *different* domains (same-domain is already covered)
    for (let i = 0; i < matchNodes.length; i++) {
      for (let j = i + 1; j < matchNodes.length; j++) {
        if (matchNodes[i].domain !== matchNodes[j].domain) {
          addEdge(matchNodes[i].id, matchNodes[j].id, 'sharedUsername', username);
        }
      }
    }
  }

  // 5. crossLinked — one result's URL appears in another result's snippet
  const urlLookup = new Map(
    [...nodeMap.keys()].map((url) => [url.toLowerCase(), url])
  );
  for (const r of results) {
    if (!r.url || !r.snippet) continue;
    const linkedUrls = new Set(extractUrls(r.snippet));
    for (const linkedUrl of linkedUrls) {
      const targetUrl = urlLookup.get(linkedUrl);
      if (targetUrl && targetUrl !== r.url) {
        addEdge(r.url, targetUrl, 'crossLinked', '');
      }
    }
  }

  return { nodes, edges };
}
