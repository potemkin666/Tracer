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
  fuzzyUsername: 0.9,
  geoHit: 0.7,
  officialHit: 0.6,
  bias: -2.0,
};

const INTENT_WEIGHT_OVERRIDES = {
  name: {
    titleExact: 3.5,
    snippetExact: 2.3,
    allTokensPresent: 1.9,
    officialHit: 0.9,
  },
  handle: {
    usernameExact: 3.4,
    urlUsername: 3.0,
    fuzzyUsername: 1.6,
    identitySource: 1.5,
    profileTag: 1.3,
    snippetExact: 1.1,
  },
  email: {
    snippetExact: 3.5,
    keywordProximity: 1.7,
    multiSource: 1.8,
    authorityHit: 1.0,
    titleExact: 1.0,
  },
  phone: {
    snippetExact: 3.6,
    keywordProximity: 1.8,
    multiSource: 1.7,
    titleExact: 0.8,
  },
  company: {
    titleExact: 3.4,
    snippetExact: 2.5,
    officialHit: 1.2,
    authorityHit: 1.0,
    allTokensPresent: 1.9,
  },
  image: {
    profileTag: 1.5,
    socialTag: 1.3,
    archiveSource: 1.1,
    titlePartial: 0.7,
    snippetPartial: 0.3,
  },
};

const BROKER_DIRECTORY_HOSTS = [
  /spokeo\.com/u, /whitepages\.com/u, /mylife\.com/u, /beenverified\.com/u,
  /peekyou\.com/u, /rocketreach\.co/u, /zoominfo\.com/u,
];
const PACKAGE_ECOSYSTEM_HOSTS = [
  /npmjs\.com/u, /pypi\.org/u, /rubygems\.org/u, /packagist\.org/u,
  /crates\.io/u, /hub\.docker\.com/u,
];

function hostnameMatches(hostname, expected) {
  return hostname === expected || hostname.endsWith(`.${expected}`);
}

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

export function buildIntentWeights(baseWeights = WEIGHTS, intent = 'name') {
  return {
    ...baseWeights,
    ...(INTENT_WEIGHT_OVERRIDES[intent] || {}),
  };
}

export function deriveSourceFamily(result = {}) {
  const hostname = safeHostname(result.url);
  const category = result.meta?.domainCategory || null;

  if (PACKAGE_ECOSYSTEM_HOSTS.some((pattern) => pattern.test(hostname))) return 'package-ecosystem';
  if (BROKER_DIRECTORY_HOSTS.some((pattern) => pattern.test(hostname))) return 'broker-directory';
  if (hostnameMatches(hostname, 'github.com') || hostnameMatches(hostname, 'gitlab.com') || hostnameMatches(hostname, 'codeberg.org')) return 'code-hosting';
  if (hostnameMatches(hostname, 'archive.org') || result.source === 'wayback' || result.source === 'timeslice') return 'archive';
  if (hostnameMatches(hostname, 'reddit.com') || hostnameMatches(hostname, 'ycombinator.com') || /forum|community/u.test(hostname)) return 'forum';
  if (category === 'social') return 'social';
  if (category === 'news') return 'media';
  if (category === 'academic') return 'academic';
  if (category === 'gov') return 'official';
  return hostname.split('.').slice(-2).join('.') || result.source || 'unknown';
}

export function applySourceFamilyCaps(results = [], {
  perFamilyCap = 3,
  overflowPenalty = 0.12,
} = {}) {
  const familyCounts = new Map();

  return results
    .map((result) => {
      const family = deriveSourceFamily(result);
      const seen = (familyCounts.get(family) || 0) + 1;
      familyCounts.set(family, seen);
      const overflow = Math.max(seen - perFamilyCap, 0);
      const penalty = Math.min(0.45, overflow * overflowPenalty);
      const confidence = Math.max(0, (result.confidence || 0) * (1 - penalty));
      return {
        ...result,
        confidence,
        score: Math.round(confidence * 100),
        meta: {
          ...(result.meta || {}),
          sourceFamily: family,
          familyRank: seen,
          familyPenalty: penalty,
        },
      };
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

export function estimateGeoAffinity(result = {}, operators = {}) {
  const targetRegion = operators.region || null;
  if (!targetRegion) return 0;
  return String(result.meta?.region || '').toLowerCase() === String(targetRegion).toLowerCase() ? 1 : 0;
}
