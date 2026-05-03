import { IDENTITY_SOURCES, WEIGHTS, scoreResults } from '../docs/scripts/shared/scoringShared.js';
export { WEIGHTS } from '../docs/scripts/shared/scoringShared.js';

/**
 * Extract numeric features from a single result.
 * All features are either 0/1 (binary) or a small positive number.
 */
export function extractFeatures(r, lowerInput, tokens, urlMap) {
  const title   = (r.title   || '').toLowerCase();
  const snippet = (r.snippet || '').toLowerCase();
  const url     = (r.url     || '').toLowerCase();
  const combined = `${title}|${snippet}|${url}`;
  const tags    = (r.meta && r.meta.tags) || [];
  const username = String(r.meta?.username || '').toLowerCase();
  const localPart = lowerInput.includes('@') && !lowerInput.startsWith('@')
    ? lowerInput.split('@')[0]
    : lowerInput.replace(/^@+/u, '');
  const usernameVariants = [
    localPart,
    lowerInput.replace(/\s+/g, ''),
    tokens.join('_'),
    tokens.join('-'),
    tokens.join('.'),
  ].filter(Boolean);

  return {
     titleExact:    title.includes(lowerInput) ? 1 : 0,
     snippetExact:  snippet.includes(lowerInput) ? 1 : 0,
     usernameExact: usernameVariants.includes(username) ? 1 : 0,
     urlUsername:   usernameVariants.some((variant) => url.includes(variant)) ? 1 : 0,
     multiSource:   (urlMap[r.url] || 0) > 1 ? 1 : 0,
     identitySource: IDENTITY_SOURCES.has(r.source) || tags.includes('social') || tags.includes('profile') ? 1 : 0,
     archiveSource: r.source === 'wayback' || /archive\.org/.test(url) ? 1 : 0,
     fossilTag:     tags.includes('fossil') ? 1 : 0,
     timesliceTag:  tags.includes('timeslice') ? 1 : 0,
     documentTag:   tags.includes('document') ? 1 : 0,
     socialTag:     tags.includes('social') ? 1 : 0,
     profileTag:    tags.includes('profile') ? 1 : 0,
     lowRank:       typeof r.rank === 'number' && r.rank >= 1 && r.rank <= 3 ? 1 : 0,
     allTokensPresent: tokens.length > 1 && tokens.every((t) => combined.includes(t)) ? 1 : 0,
     titlePartial:  tokens.some(t => title.includes(t)) ? 1 : 0,
     snippetPartial:tokens.some(t => snippet.includes(t)) ? 1 : 0,
     bias:          1,
  };
}

/**
 * Compute confidence score for a result using learned logistic-regression
 * weights. Returns a value in (0, 1) that can be interpreted as the
 * probability the result is a true match.
 */
export { computeConfidence } from '../docs/scripts/shared/scoringShared.js';

/**
 * Score and rank results by match confidence.
 *
 * Each result gets:
 *   - score:      rounded 0-100 integer for readability
 *   - confidence: raw (0, 1) probability from the classifier
 *
 * @param {object[]} results - normalised Tracer results
 * @param {string} originalInput - the user's original search term
 * @returns {object[]} results sorted by confidence descending
 */
export function score(results, originalInput) {
  const lowerInput = originalInput.toLowerCase();
  const tokens = lowerInput.split(/\s+/).filter(Boolean);
  const urlMap = {};

  results.forEach((r) => {
    if (r.url) urlMap[r.url] = (urlMap[r.url] || 0) + 1;
  });

  return scoreResults(
    results,
    (result) => extractFeatures(result, lowerInput, tokens, urlMap),
    WEIGHTS
  );
}
