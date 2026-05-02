import { classifyUrl } from './identity.js';

export { classifyUrl } from './identity.js';

/**
 * Enrich an array of deduplicated results with platform metadata.
 *
 * Adds to each result's `meta`:
 *   - `domainCategory`: 'social' | 'tech' | 'academic' | 'gov' | 'news' | 'archive' | null
 *   - `username`: extracted username string or null
 *   - `tags`: appends 'social', 'profile', etc. when detected
 *
 * @param {object[]} results - deduplicated results
 * @param {string} input - original search term
 * @returns {object[]} results with enriched meta (mutated in place for speed)
 */
export function enrich(results, input) {
  const inputLower = (input || '').toLowerCase();
  const slug = inputLower.replace(/\s+/g, '');

  for (const r of results) {
    if (!r.meta || typeof r.meta !== 'object') r.meta = {};
    if (!Array.isArray(r.meta.tags)) r.meta.tags = [...(r.meta.tags || [])];

    const { category, username } = classifyUrl(r.url);

    if (category) {
      r.meta.domainCategory = category;

      if (category === 'social' && !r.meta.tags.includes('social')) {
        r.meta.tags.push('social');
      }
      if (category === 'academic' && !r.meta.tags.includes('academic')) {
        r.meta.tags.push('academic');
      }
      if (category === 'gov' && !r.meta.tags.includes('gov')) {
        r.meta.tags.push('gov');
      }
    }

    if (username) {
      r.meta.username = username;
      // If username matches the search term, this is likely a profile page
      if (
        username.toLowerCase() === slug ||
        username.toLowerCase() === inputLower
      ) {
        if (!r.meta.tags.includes('profile')) {
          r.meta.tags.push('profile');
        }
      }
    }
  }

  return results;
}
