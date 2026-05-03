export const WEIGHTS = {
  titleExact: 3.2,
  snippetExact: 2.1,
  usernameExact: 2.4,
  urlUsername: 2.0,
  multiSource: 1.4,
  identitySource: 1.1,
  archiveSource: 0.9,
  fossilTag: 1.5,
  timesliceTag: 0.8,
  documentTag: 1.1,
  socialTag: 1.0,
  profileTag: 0.9,
  lowRank: 0.6,
  allTokensPresent: 1.6,
  titlePartial: 0.5,
  snippetPartial: 0.4,
  freshHit: 0.9,
  authorityHit: 0.8,
  keywordProximity: 1.2,
  bias: -2.0,
};

export const IDENTITY_SOURCES = new Set([
  'bluesky',
  'codeberg',
  'github',
  'gitlab',
  'google-scholar',
  'gravatar',
  'keybase',
  'lichess',
  'mastodon',
  'namechk',
  'orcid',
  'reddit-users',
  'social-profiles',
  'stackexchange-users',
  'whats-my-name',
  'wikidata',
]);

export function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

export function computeConfidence(features, weights = WEIGHTS) {
  let z = 0;
  for (const [feature, value] of Object.entries(features)) {
    z += (weights[feature] || 0) * value;
  }
  return sigmoid(z);
}

export function scoreResults(results, buildFeatures, weights = WEIGHTS) {
  return results
    .map((result) => {
      const features = buildFeatures(result);
      const confidence = computeConfidence(features, weights);
      return { ...result, score: Math.round(confidence * 100), confidence };
    })
    .sort((a, b) => b.confidence - a.confidence);
}

const AUTHORITY_DOMAINS = new Map([
  ['github.com', 1],
  ['gitlab.com', 0.9],
  ['codeberg.org', 0.85],
  ['linkedin.com', 0.95],
  ['reddit.com', 0.7],
  ['news.ycombinator.com', 0.8],
  ['scholar.google.com', 0.95],
  ['orcid.org', 0.9],
  ['arxiv.org', 0.9],
  ['wikipedia.org', 0.8],
]);

function safeHostname(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./u, '');
  } catch {
    return '';
  }
}

export function estimateDomainAuthority(result = {}) {
  const hostname = safeHostname(result.url);
  if (!hostname) return 0;
  if (AUTHORITY_DOMAINS.has(hostname)) return AUTHORITY_DOMAINS.get(hostname);
  if (hostname.endsWith('.gov') || hostname.endsWith('.gov.uk')) return 0.95;
  if (hostname.endsWith('.edu')) return 0.9;
  if (hostname.endsWith('.org')) return 0.6;
  return 0.3;
}

function extractYear(text) {
  const match = String(text || '').match(/\b(19|20)\d{2}\b/u);
  return match ? Number(match[0]) : null;
}

export function estimateFreshnessScore(result = {}, now = new Date()) {
  const currentYear = now.getUTCFullYear();
  const candidates = [
    result.meta?.publishedAt,
    result.meta?.updatedAt,
    result.meta?.year,
    result.snippet,
    result.title,
  ];

  for (const candidate of candidates) {
    const year = typeof candidate === 'number' ? candidate : extractYear(candidate);
    if (!year || year > currentYear + 1) continue;
    const age = currentYear - year;
    if (age <= 1) return 1;
    if (age <= 3) return 0.7;
    if (age <= 6) return 0.4;
    return 0.15;
  }

  return 0;
}

function tokenPositions(text, token) {
  const haystack = ` ${String(text || '').toLowerCase()} `;
  const positions = [];
  let index = haystack.indexOf(token);
  while (index !== -1) {
    positions.push(index);
    index = haystack.indexOf(token, index + token.length);
  }
  return positions;
}

export function estimateKeywordProximity(text, tokens = []) {
  const uniqueTokens = [...new Set(tokens.filter(Boolean).map((token) => token.toLowerCase()))];
  if (uniqueTokens.length <= 1) {
    return uniqueTokens.length === 1 && String(text || '').toLowerCase().includes(uniqueTokens[0]) ? 1 : 0;
  }

  const positions = uniqueTokens.map((token) => tokenPositions(text, token)).filter((hits) => hits.length);
  if (positions.length !== uniqueTokens.length) return 0;

  const first = Math.min(...positions.map((hits) => hits[0]));
  const last = Math.max(...positions.map((hits) => hits[0]));
  const span = Math.max(last - first, 1);
  return Math.max(0, 1 - Math.min(span / 120, 1));
}
