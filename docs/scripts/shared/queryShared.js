export function buildQueryPlan(input) {
  const raw = String(input || '').trim();
  const lower = raw.toLowerCase();
  const tokens = lower.split(/\s+/).filter(Boolean);

  return {
    raw,
    lower,
    tokens,
    exact: tokens.length > 1 ? `"${raw}"` : raw,
    noSpaces: tokens.join(''),
    underscored: tokens.join('_'),
    hyphenated: tokens.join('-'),
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

export function queryVariants(plan, options = {}) {
  const {
    includeRaw = true,
    includeExact = false,
    includeSlug = false,
    includeUnderscored = false,
    includeHyphenated = false,
  } = options;

  return uniqueCaseInsensitive([
    includeRaw ? plan.raw : null,
    includeExact ? plan.exact : null,
    includeSlug ? plan.noSpaces : null,
    includeUnderscored ? plan.underscored : null,
    includeHyphenated ? plan.hyphenated : null,
  ]);
}

export function generateQueries(input) {
  const plan = buildQueryPlan(input);
  return uniqueCaseInsensitive([
    plan.exact,
    plan.raw,
    plan.noSpaces,
    plan.underscored,
    plan.hyphenated,
    `${plan.exact} site:linkedin.com`,
    `${plan.exact} site:twitter.com`,
    `${plan.exact} site:github.com`,
    `${plan.exact} site:reddit.com`,
    `${plan.exact} site:facebook.com`,
    `${plan.exact} site:web.archive.org`,
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
  };
}

export function isRelevantStandaloneResult(result, plan) {
  if (!plan.tokens.length) return false;
  const signals = getStandaloneMatchSignals(result, plan);
  if (plan.tokens.length === 1) {
    return signals.tokenHits > 0 || signals.noSpaces;
  }
  return signals.exact
    || signals.noSpaces
    || signals.underscored
    || signals.hyphenated
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
