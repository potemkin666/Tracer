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
import { GRAPH_LIMITS } from './runtimeConfig.js';

const EDGE_STRENGTH = {
  sameAvatar: 1,
  sharedEmail: 0.95,
  sharedUsername: 0.85,
  crossLinked: 0.65,
  sameDomain: 0.2,
};

const EDGE_LABELS = {
  sameAvatar: 'shared avatar',
  sharedEmail: 'shared email domain',
  sharedUsername: 'shared username',
  crossLinked: 'cross-linked pages',
  sameDomain: 'same domain',
};

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
 * Extract absolute URLs from a snippet for cross-link detection.
 *
 * Trailing punctuation is stripped so snippets like "https://x.test)." still
 * match known node URLs, and all results are lowercased for case-insensitive
 * lookup against the graph node map.
 *
 * @param {string} text
 * @returns {string[]}
 */
function extractUrls(text) {
  if (!text) return [];
  return (text.match(/https?:\/\/[^\s<>"')\]]+/gi) || [])
    .map((url) => url.replace(/[),.;:!?]+$/u, '').toLowerCase());
}

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function average(values = []) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildIdentityLabel(nodes = []) {
  const usernames = nodes.map((node) => node.username).filter(Boolean);
  if (usernames.length) return `Identity · ${usernames[0]}`;
  return `Identity · ${nodes[0]?.label || 'cluster'}`;
}

function explainIdentity(edgeTypes = new Set()) {
  const labels = [...edgeTypes].map((type) => EDGE_LABELS[type]).filter(Boolean);
  if (!labels.length) return 'Stitched from multiple corroborating pages.';
  if (labels.length === 1) return `Stitched via ${labels[0]}.`;
  return `Stitched via ${labels.slice(0, -1).join(', ')} and ${labels.at(-1)}.`;
}

function buildIdentitySubgraph(nodes, edges) {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const adjacency = new Map(nodes.map((node) => [node.id, new Set()]));
  const strongEdges = edges.filter((edge) => (
    nodeIds.has(edge.source)
    && nodeIds.has(edge.target)
    && EDGE_STRENGTH[edge.type] >= 0.65
  ));

  strongEdges.forEach((edge) => {
    adjacency.get(edge.source)?.add(edge.target);
    adjacency.get(edge.target)?.add(edge.source);
  });

  const visited = new Set();
  const identityNodes = [];
  const identityEdges = [];
  let identityIndex = 1;

  nodes.forEach((node) => {
    if (visited.has(node.id)) return;
    const stack = [node.id];
    const componentIds = [];
    visited.add(node.id);
    while (stack.length) {
      const current = stack.pop();
      componentIds.push(current);
      for (const neighbour of adjacency.get(current) || []) {
        if (visited.has(neighbour)) continue;
        visited.add(neighbour);
        stack.push(neighbour);
      }
    }

    if (componentIds.length < 2) return;
    const componentNodes = nodes.filter((candidate) => componentIds.includes(candidate.id));
    const componentEdges = strongEdges.filter((edge) => (
      componentIds.includes(edge.source) && componentIds.includes(edge.target)
    ));
    const edgeTypes = new Set(componentEdges.map((edge) => edge.type));
    const avgPageConfidence = average(componentNodes.map((candidate) => candidate.confidence || candidate.score / 100));
    const evidenceStrength = average(componentEdges.map((edge) => EDGE_STRENGTH[edge.type] || 0));
    const confidence = clamp((avgPageConfidence * 0.6) + (evidenceStrength * 0.4));
    const id = `identity:${identityIndex++}`;
    const explanation = explainIdentity(edgeTypes);

    identityNodes.push({
      id,
      kind: 'identity',
      label: buildIdentityLabel(componentNodes),
      score: Math.round(confidence * 100),
      confidence,
      pageCount: componentNodes.length,
      explanation,
    });

    componentNodes.forEach((member) => {
      identityEdges.push({
        source: id,
        target: member.id,
        type: 'identityMember',
        detail: explanation,
      });
    });
  });

  return {
    identityNodes,
    identityEdges,
  };
}

/**
 * Maximum number of nodes sharing a username before we skip edge creation.
 * Very common usernames (e.g. 'admin', 'test') would create too many
 * false-positive edges, so we cap the group size.
 */
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
      kind: 'page',
      label: r.title || r.url,
      source: r.source || '',
      score: r.score ?? 0,
      confidence: r.confidence ?? (r.score ?? 0) / 100,
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
    if (urls.length < 2 || urls.length > GRAPH_LIMITS.maxDomainGroup) continue;
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
    if (urls.length < 2 || urls.length > GRAPH_LIMITS.maxEmailDomainGroup) continue;
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
    if (matchNodes.length < 2 || matchNodes.length > GRAPH_LIMITS.maxUsernameGroup) continue;
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

  const { identityNodes, identityEdges } = buildIdentitySubgraph(nodes, edges);
  return {
    nodes: [...nodes, ...identityNodes],
    edges: [...edges, ...identityEdges],
  };
}
