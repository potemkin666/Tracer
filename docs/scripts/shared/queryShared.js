const OPERATOR_PATTERN = /(?:^|\s)(site|filetype|intitle|inurl|lang|region):("[^"]+"|\S+)/giu;
const FUZZY_MATCH_TOLERANCE_RATIO = 6;
const ARTIFACT_KEYWORDS = /\b(pdf|screenshot|filename|favicon|favicon\.ico|css|class|commit|slug|deleted slug|rss|feed|metadata|exif|redirect|robots|robots\.txt|sitemap|sitemap\.xml|hash|sha1|sha256|md5|artifact|fossil)\b/iu;
const HASH_PATTERN = /\b[a-f0-9]{16,64}\b/iu;
const FILENAME_PATTERN = /\b[\w.-]+\.(pdf|docx?|pptx?|xlsx?|png|jpe?g|gif|webp|svg|css|js|xml|json|txt)\b/iu;
const CSS_CLASS_PATTERN = /^[.#]?[a-z0-9_-]{3,}$/iu;
const LEET_SWAPS = new Map([
  ['a', '4'],
  ['e', '3'],
  ['i', '1'],
  ['o', '0'],
  ['s', '5'],
  ['t', '7'],
]);
const ARTIFACT_FILETYPES = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'xml', 'json'];

function looksLikePhone(raw) {
  const digits = String(raw || '').replace(/\D+/gu, '');
  return digits.length >= 7 && digits.length <= 15;
}

export function detectQueryIntent(input) {
  const raw = String(input || '').trim();
  const lower = raw.toLowerCase();
  if (!raw) return 'name';
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(raw)) return 'email';
  if (looksLikePhone(raw)) return 'phone';
  if (/\b(image|avatar|logo|photo|picture)\b/iu.test(raw) || /\.(png|jpe?g|gif|webp)$/iu.test(raw)) return 'image';
  if (ARTIFACT_KEYWORDS.test(raw) || HASH_PATTERN.test(raw) || FILENAME_PATTERN.test(raw) || (CSS_CLASS_PATTERN.test(raw) && /[-_.]/u.test(raw))) return 'artifact';
  if (/\b(inc|llc|ltd|corp|corporation|company|group|studio|labs?|agency|foundation|institute|university|college)\b/iu.test(raw)) return 'company';
  if (/^@/u.test(raw) || (!/\s/u.test(raw) && /^[a-z0-9._-]{2,}$/iu.test(raw))) return 'handle';
  if (lower.includes('@') && !lower.startsWith('@')) return 'email';
  return 'name';
}

export function parseOperators(input) {
  const operators = {
    site: [],
    filetype: [],
    intitle: [],
    inurl: [],
    lang: null,
    region: null,
  };

  const original = String(input || '').trim();
  const stripped = original.replace(OPERATOR_PATTERN, (match, key, rawValue) => {
    const value = String(rawValue || '').replace(/^"|"$/gu, '');
    if (key === 'lang' || key === 'region') {
      operators[key] = value.toLowerCase();
    } else {
      operators[key].push(value);
    }
    return ' ';
  }).replace(/\s+/gu, ' ').trim();

  return {
    original,
    operators,
    stripped: stripped || original,
  };
}

export function buildQueryPlan(input) {
  const { original, operators, stripped } = parseOperators(input);
  const raw = stripped;
  const lower = raw.toLowerCase();
  const tokens = lower.split(/\s+/).filter(Boolean);
  const localPart = (lower.includes('@') && !lower.startsWith('@'))
    ? lower.split('@')[0]
    : lower.replace(/^@+/u, '').replace(/\s+/gu, '');
  const reversed = tokens.length > 1 ? [...tokens].reverse().join(' ') : raw;

  return {
    original,
    raw,
    lower,
    tokens,
    operators,
    exact: tokens.length > 1 ? `"${raw}"` : raw,
    noSpaces: tokens.join(''),
    underscored: tokens.join('_'),
    hyphenated: tokens.join('-'),
    dotted: tokens.join('.'),
    localPart,
    atHandle: localPart ? `@${localPart}` : '',
    reversed,
    reversedExact: tokens.length > 1 ? `"${reversed}"` : raw,
    intent: detectQueryIntent(original || raw),
  };
}

export function uniqueCaseInsensitive(values) {
  const seen = new Set();
  return values.filter((value) => {
    if (!value) return false;
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function stripDiacritics(value) {
  return value.normalize('NFKD').replace(/\p{Mark}+/gu, '');
}

function collapseRepeats(value) {
  return value.replace(/(.)\1{2,}/gu, '$1$1');
}

function toLeetspeak(value) {
  return String(value || '').toLowerCase().split('').map((char) => LEET_SWAPS.get(char) || char).join('');
}

function fromLeetspeak(value) {
  return String(value || '').toLowerCase()
    .replace(/4/gu, 'a')
    .replace(/3/gu, 'e')
    .replace(/[1!]/gu, 'i')
    .replace(/0/gu, 'o')
    .replace(/5/gu, 's')
    .replace(/7/gu, 't');
}

function stripVowels(value) {
  return String(value || '').replace(/[aeiou]/giu, '');
}

function stemToken(token) {
  if (token.length <= 3) return token;
  if (/ies$/u.test(token) && token.length > 4) {
    return token === 'movies' ? 'movie' : `${token.slice(0, -3)}y`;
  }
  if (/(sses|xes|zes|ches|shes)$/u.test(token) && token.length > 4) return token.slice(0, -2);
  if (/s$/u.test(token) && !/ss$/u.test(token) && token.length > 4) return token.slice(0, -1);
  if (/ing$/u.test(token) && token.length > 5) return token.slice(0, -3);
  if (/ed$/u.test(token) && token.length > 4) return token.slice(0, -2);
  return token;
}

const QUERY_SYNONYMS = new Map([
  ['profile', ['bio', 'account', 'user']],
  ['account', ['profile', 'handle', 'user']],
  ['forum', ['board', 'community', 'thread']],
  ['photo', ['image', 'avatar']],
  ['resume', ['cv']],
  ['company', ['organization', 'org']],
]);

function editDistance(left, right) {
  const a = String(left || '');
  const b = String(right || '');
  const matrix = Array.from({ length: a.length + 1 }, (_, row) => [row]);
  for (let col = 0; col <= b.length; col += 1) {
    matrix[0][col] = col;
  }
  for (let row = 1; row <= a.length; row += 1) {
    for (let col = 1; col <= b.length; col += 1) {
      const cost = a[row - 1] === b[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost,
      );
    }
  }
  return matrix[a.length][b.length];
}

export function isFuzzyHandleMatch(left, right) {
  const a = String(left || '').toLowerCase().replace(/[^a-z0-9]/gu, '');
  const b = String(right || '').toLowerCase().replace(/[^a-z0-9]/gu, '');
  if (!a || !b) return false;
  if (a === b) return true;
  const distance = editDistance(a, b);
  const maxDistance = Math.max(1, Math.floor(Math.max(a.length, b.length) / FUZZY_MATCH_TOLERANCE_RATIO));
  return distance <= maxDistance;
}

export function rewriteQueryTerms(input) {
  const plan = buildQueryPlan(input);
  const stemmedTokens = plan.tokens.map(stemToken);
  const stemmed = stemmedTokens.join(' ').trim();
  const deaccented = stripDiacritics(plan.raw);
  const repeatCollapsed = collapseRepeats(plan.raw);
  const synonymPhrases = [];

  plan.tokens.forEach((token, index) => {
    const synonyms = QUERY_SYNONYMS.get(token) || [];
    synonyms.forEach((synonym) => {
      const nextTokens = [...plan.tokens];
      nextTokens[index] = synonym;
      synonymPhrases.push(nextTokens.join(' '));
    });
  });

  return uniqueCaseInsensitive([
    plan.raw,
    deaccented !== plan.raw ? deaccented : null,
    repeatCollapsed !== plan.raw ? repeatCollapsed : null,
    stemmed && stemmed !== plan.lower ? stemmed : null,
    ...synonymPhrases,
  ]);
}

export function generateScentVariants(input) {
  const plan = typeof input === 'string' ? buildQueryPlan(input) : input;
  const stem = plan.localPart || plan.noSpaces || plan.raw;
  const mutationSeeds = [
    plan.raw,
    plan.exact,
    plan.noSpaces,
    plan.underscored,
    plan.hyphenated,
    plan.dotted,
    plan.localPart,
    stem,
    stem ? toLeetspeak(stem) : null,
    stem ? fromLeetspeak(stem) : null,
    stem ? collapseRepeats(stem) : null,
    stem ? stripVowels(stem) : null,
    stripDiacritics(plan.raw),
  ];

  return uniqueCaseInsensitive(mutationSeeds.filter((value) => value && value.length >= 2));
}

function siteQuery(value, site) {
  return value ? `${value} site:${site}` : null;
}

function applyOperators(query, operators = {}) {
  if (!query) return query;
  const suffix = [
    ...(operators.site || []).map((value) => `site:${value}`),
    ...(operators.filetype || []).map((value) => `filetype:${value}`),
    ...(operators.intitle || []).map((value) => `intitle:${value.includes(' ') ? `"${value}"` : value}`),
    ...(operators.inurl || []).map((value) => `inurl:${value}`),
    operators.lang ? `lang:${operators.lang}` : null,
    operators.region ? `region:${operators.region}` : null,
  ].filter(Boolean);
  return suffix.length ? `${query} ${suffix.join(' ')}` : query;
}

export function queryVariants(plan, options = {}) {
  const {
    includeRaw = true,
    includeExact = false,
    includeSlug = false,
    includeUnderscored = false,
    includeHyphenated = false,
    includeDotted = false,
    includeHandle = false,
    includeLocalPart = false,
  } = options;

  return uniqueCaseInsensitive([
    includeRaw ? plan.raw : null,
    includeExact ? plan.exact : null,
    includeSlug ? plan.noSpaces : null,
    includeUnderscored ? plan.underscored : null,
    includeHyphenated ? plan.hyphenated : null,
    includeDotted ? plan.dotted : null,
    includeHandle ? plan.atHandle : null,
    includeLocalPart ? plan.localPart : null,
  ]);
}

function buildFuzzyVariants(plan) {
  if (plan.tokens.length !== 1) return [];
  const base = plan.localPart || plan.noSpaces;
  if (!base || base.length < 4) return [];
  return uniqueCaseInsensitive([
    collapseRepeats(base),
    base.replace(/[._-]+/gu, ''),
    base.replace(/(.)\1/gu, '$1'),
  ].filter((value) => value && value !== base));
}

export function generateQueries(input) {
  const plan = buildQueryPlan(input);
  const rewrites = rewriteQueryTerms(input);
  const fuzzyVariants = buildFuzzyVariants(plan);
  const scentVariants = generateScentVariants(plan).filter((value) => value !== plan.raw && value !== plan.exact);
  const isSingleToken = plan.tokens.length <= 1;
  const artifactQueries = plan.intent === 'artifact'
    ? [
      ...ARTIFACT_FILETYPES.map((filetype) => `"${plan.raw}" filetype:${filetype}`),
      `"${plan.raw}" "favicon.ico"`,
      `"${plan.raw}" "robots.txt"`,
      `"${plan.raw}" "sitemap.xml"`,
      `"${plan.raw}" rss`,
      `"${plan.raw}" exif`,
      `"${plan.raw}" redirect`,
      `"${plan.raw}" "commit"`,
      siteQuery(plan.exact, 'web.archive.org'),
    ]
    : [];

  const queries = isSingleToken
    ? [
      plan.raw,
      plan.atHandle,
      ...fuzzyVariants,
      ...scentVariants,
      ...rewrites.map((value) => (value && value !== plan.raw ? `"${value}" profile` : null)),
      siteQuery(plan.localPart, 'github.com'),
      siteQuery(plan.localPart, 'reddit.com/user'),
      siteQuery(plan.localPart, 'gitlab.com'),
      siteQuery(plan.localPart, 'codeberg.org'),
      siteQuery(plan.localPart, 'keybase.io'),
      siteQuery(plan.localPart, 'bsky.app/profile'),
      siteQuery(plan.localPart, 'mastodon.social'),
      siteQuery(plan.localPart, 'instagram.com'),
      siteQuery(plan.localPart, 'tiktok.com'),
      siteQuery(plan.localPart, 'facebook.com'),
      siteQuery(plan.localPart, 'news.ycombinator.com/user'),
      siteQuery(plan.localPart, 'dev.to'),
      siteQuery(plan.localPart, 'web.archive.org'),
      ...artifactQueries,
    ]
    : [
      plan.exact,
      plan.raw,
      ...scentVariants.map((value) => value.includes(' ') ? `"${value}"` : value),
      ...rewrites.filter((value) => value !== plan.raw).map((value) => `"${value}"`),
      siteQuery(plan.exact, 'linkedin.com/in'),
      siteQuery(plan.exact, 'github.com'),
      siteQuery(plan.exact, 'reddit.com/user'),
      siteQuery(plan.exact, 'gitlab.com'),
      siteQuery(plan.exact, 'codeberg.org'),
      siteQuery(plan.exact, 'keybase.io'),
      siteQuery(plan.exact, 'bsky.app/profile'),
      siteQuery(plan.exact, 'mastodon.social'),
      siteQuery(plan.exact, 'news.ycombinator.com/user'),
      siteQuery(plan.exact, 'dev.to'),
      plan.noSpaces,
      plan.underscored,
      plan.hyphenated,
      plan.dotted,
      plan.reversedExact,
      siteQuery(plan.exact, 'facebook.com'),
      siteQuery(plan.exact, 'web.archive.org'),
      ...artifactQueries,
    ];

  return uniqueCaseInsensitive(queries.map((query) => applyOperators(query, plan.operators)));
}

export function getStandaloneMatchSignals(result, plan) {
  const title = (result.title || '').toLowerCase();
  const snippet = (result.snippet || '').toLowerCase();
  const url = (result.url || '').toLowerCase();
  const combined = `${title}|${snippet}|${url}`;
  const tokenHits = plan.tokens.filter((token) => combined.includes(token)).length;
  const username = String(result.meta?.username || '').toLowerCase();

  return {
    title,
    snippet,
    url,
    combined,
    tokenHits,
    username,
    exact: Boolean(plan.lower && combined.includes(plan.lower)),
    noSpaces: Boolean(plan.noSpaces && combined.includes(plan.noSpaces)),
    underscored: Boolean(plan.underscored && combined.includes(plan.underscored)),
    hyphenated: Boolean(plan.hyphenated && combined.includes(plan.hyphenated)),
    dotted: Boolean(plan.dotted && combined.includes(plan.dotted)),
    localPart: Boolean(plan.localPart && combined.includes(plan.localPart)),
    handle: Boolean(plan.atHandle && combined.includes(plan.atHandle)),
    fuzzyHandle: isFuzzyHandleMatch(username || url, plan.localPart || plan.noSpaces),
  };
}

export function isRelevantStandaloneResult(result, plan) {
  if (!plan.tokens.length) return false;
  const signals = getStandaloneMatchSignals(result, plan);
  if (plan.tokens.length === 1) {
    return signals.tokenHits > 0 || signals.noSpaces || signals.handle || signals.localPart || signals.fuzzyHandle;
  }
  return signals.exact
    || signals.noSpaces
    || signals.underscored
    || signals.hyphenated
    || signals.dotted
    || signals.fuzzyHandle
    || signals.tokenHits === plan.tokens.length;
}

function rankNearMatch(result, plan) {
  const signals = getStandaloneMatchSignals(result, plan);
  if (isRelevantStandaloneResult(result, plan)) {
    return Number.POSITIVE_INFINITY;
  }

  return (signals.noSpaces ? 6 : 0)
    + (signals.underscored ? 5 : 0)
    + (signals.hyphenated ? 4 : 0)
    + (signals.dotted ? 4 : 0)
    + (signals.handle ? 3 : 0)
    + (signals.fuzzyHandle ? 3 : 0)
    + (signals.exact ? 3 : 0)
    + signals.tokenHits
    + Math.max((result.score || 0) / 100, 0);
}

export function expandRelevantResults(results, plan, extraRatio = 0.1) {
  const relevant = [];
  const spillover = [];

  for (const result of results) {
    if (isRelevantStandaloneResult(result, plan)) {
      relevant.push(result);
      continue;
    }

    const rank = rankNearMatch(result, plan);
    if (rank > 0) {
      spillover.push({ result, rank });
    }
  }

  if (!relevant.length || !spillover.length || extraRatio <= 0) {
    return relevant;
  }

  const extraCount = Math.min(
    spillover.length,
    Math.max(1, Math.ceil(relevant.length * extraRatio))
  );

  spillover.sort((a, b) => b.rank - a.rank);
  return relevant.concat(spillover.slice(0, extraCount).map((entry) => entry.result));
}
