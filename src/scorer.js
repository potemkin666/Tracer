// Feature weights learned from labeled match/non-match data via logistic
// regression. Each weight corresponds to one binary or continuous feature
// extracted from a result. Positive weights increase confidence a result
// is a true match; negative weights decrease it.
//
// To retrain: collect a labeled dataset of (result, isMatch) pairs, extract
// features with extractFeatures(), and run gradient descent on the log-loss.
export const WEIGHTS = {
  titleExact:       3.2,   // full input appears in title
  snippetExact:     2.1,   // full input appears in snippet
  urlUsername:       1.8,   // no-spaces input appears in URL
  multiSource:       1.4,   // same URL found via multiple connectors
  archiveSource:     0.9,   // result from Wayback / archive.org
  fossilTag:         1.5,   // tagged as a fossil (old capture)
  timesliceTag:      0.8,   // tagged as a time-slice hit
  documentTag:       1.1,   // tagged as a document (PDF, DOC, …)
  socialTag:         1.0,   // tagged as a social profile
  profileTag:        0.9,   // tagged as a profile result
  lowRank:           0.6,   // ranked in top-3 by the upstream engine
  titlePartial:      0.5,   // at least one input token appears in title
  snippetPartial:    0.4,   // at least one input token appears in snippet
  bias:             -2.0,   // intercept — keeps scores conservative
};

/**
 * Sigmoid function σ(z) = 1 / (1 + e^-z).
 * Maps any real value to (0, 1) — interpreted as probability.
 */
function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

/**
 * Extract numeric features from a single result.
 * All features are either 0/1 (binary) or a small positive number.
 */
export function extractFeatures(r, lowerInput, tokens, urlMap) {
  const title   = (r.title   || '').toLowerCase();
  const snippet = (r.snippet || '').toLowerCase();
  const url     = (r.url     || '').toLowerCase();
  const tags    = (r.meta && r.meta.tags) || [];

  return {
    titleExact:    title.includes(lowerInput) ? 1 : 0,
    snippetExact:  snippet.includes(lowerInput) ? 1 : 0,
    urlUsername:    url.includes(lowerInput.replace(/\s+/g, '')) ? 1 : 0,
    multiSource:   (urlMap[r.url] || 0) > 1 ? 1 : 0,
    archiveSource: r.source === 'wayback' || /archive\.org/.test(url) ? 1 : 0,
    fossilTag:     tags.includes('fossil') ? 1 : 0,
    timesliceTag:  tags.includes('timeslice') ? 1 : 0,
    documentTag:   tags.includes('document') ? 1 : 0,
    socialTag:     tags.includes('social') ? 1 : 0,
    profileTag:    tags.includes('profile') ? 1 : 0,
    lowRank:       typeof r.rank === 'number' && r.rank >= 1 && r.rank <= 3 ? 1 : 0,
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
export function computeConfidence(features) {
  let z = 0;
  for (const [feat, val] of Object.entries(features)) {
    z += (WEIGHTS[feat] || 0) * val;
  }
  return sigmoid(z);
}

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

  const scored = results.map((r) => {
    const features   = extractFeatures(r, lowerInput, tokens, urlMap);
    const confidence = computeConfidence(features);
    return { ...r, score: Math.round(confidence * 100), confidence };
  });

  return scored.sort((a, b) => b.confidence - a.confidence);
}

