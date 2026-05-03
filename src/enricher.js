import { classifyUrl } from './identity.js';
import { buildResultInsights } from './resultInsights.js';

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
 * @returns {object[]} cloned results with enriched meta
 */
export function enrich(results, input) {
  const inputLower = (input || '').toLowerCase();
  const slug = inputLower.replace(/\s+/g, '');

  return results.map((result) => {
    const metaSource = result.meta && typeof result.meta === 'object'
      ? result.meta
      : {};
    const meta = {
      ...metaSource,
      tags: Array.isArray(metaSource.tags) ? [...metaSource.tags] : [...(metaSource.tags || [])],
    };

    const { category, username } = classifyUrl(result.url);

    if (category) {
      meta.domainCategory = category;

      if (category === 'social' && !meta.tags.includes('social')) {
        meta.tags.push('social');
      }
      if (category === 'academic' && !meta.tags.includes('academic')) {
        meta.tags.push('academic');
      }
      if (category === 'gov' && !meta.tags.includes('gov')) {
        meta.tags.push('gov');
      }
    }

    if (username) {
      meta.username = username;
      // If username matches the search term, this is likely a profile page
      if (
        username.toLowerCase() === slug ||
        username.toLowerCase() === inputLower
      ) {
        if (!meta.tags.includes('profile')) {
          meta.tags.push('profile');
        }
      }
    }

    const insights = buildResultInsights({
      ...result,
      meta,
    }, input);
    meta.artifactTypes = insights.artifactTypes;
    meta.entities = insights.entities;
    meta.language = insights.language;
    meta.languageLabel = insights.languageLabel;
    meta.translationUrl = insights.translationUrl;
    meta.reliability = insights.reliability;
    meta.region = insights.region;
    if (insights.timeline) {
      meta.timeline = insights.timeline;
      meta.year = meta.year || insights.timeline.year;
    }

    return {
      ...result,
      meta,
    };
  });
}
