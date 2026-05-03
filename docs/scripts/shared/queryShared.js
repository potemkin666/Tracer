export function buildQueryPlan(input) {
  const raw = String(input || '').trim();
  const lower = raw.toLowerCase();
  const tokens = lower.split(/\s+/).filter(Boolean);
  // For emails, keep only the local part. Otherwise treat the input like a
  // potential handle and strip leading @ plus internal spaces for username variants.
  const localPart = (lower.includes('@') && !lower.startsWith('@'))
    ? lower.split('@')[0]
    : lower.replace(/^@+/u, '').replace(/\s+/gu, '');
  const reversed = tokens.length > 1 ? [...tokens].reverse().join(' ') : raw;

  return {
    raw,
    lower,
    tokens,
    exact: tokens.length > 1 ? `"${raw}"` : raw,
    noSpaces: tokens.join(''),
    underscored: tokens.join('_'),
    hyphenated: tokens.join('-'),
    dotted: tokens.join('.'),
    localPart,
    atHandle: localPart ? `@${localPart}` : '',
    reversed,
    reversedExact: tokens.length > 1 ? `"${reversed}"` : raw,
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

function stemToken(token) {
  if (token.length <= 3) return token;
  if (/ies$/u.test(token) && token.length > 4) return `${token.slice(0, -3)}y`;
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

function siteQuery(value, site) {
  return value ? `${value} site:${site}` : null;
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

export function generateQueries(input) {
  const plan = buildQueryPlan(input);
  const rewrites = rewriteQueryTerms(input);
  const isSingleToken = plan.tokens.length <= 1;

  if (isSingleToken) {
    return uniqueCaseInsensitive([
      plan.raw,
      plan.atHandle,
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
    ]);
  }

  return uniqueCaseInsensitive([
    plan.exact,
    plan.raw,
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
  ]);
}

export function getStandaloneMatchSignals(result, plan) {
  const title = (result.title || '').toLowerCase();
  const snippet = (result.snippet || '').toLowerCase();
  const url = (result.url || '').toLowerCase();
  const combined = `${title}|${snippet}|${url}`;
  const tokenHits = plan.tokens.filter((token) => combined.includes(token)).length;

  return {
    title,
    snippet,
    url,
    combined,
    tokenHits,
    exact: Boolean(plan.lower && combined.includes(plan.lower)),
    noSpaces: Boolean(plan.noSpaces && combined.includes(plan.noSpaces)),
    underscored: Boolean(plan.underscored && combined.includes(plan.underscored)),
    hyphenated: Boolean(plan.hyphenated && combined.includes(plan.hyphenated)),
    dotted: Boolean(plan.dotted && combined.includes(plan.dotted)),
    localPart: Boolean(plan.localPart && combined.includes(plan.localPart)),
    handle: Boolean(plan.atHandle && combined.includes(plan.atHandle)),
  };
}

export function isRelevantStandaloneResult(result, plan) {
  if (!plan.tokens.length) return false;
  const signals = getStandaloneMatchSignals(result, plan);
  if (plan.tokens.length === 1) {
    return signals.tokenHits > 0 || signals.noSpaces || signals.handle || signals.localPart;
  }
  return signals.exact
    || signals.noSpaces
    || signals.underscored
    || signals.hyphenated
    || signals.dotted
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
