import { dedupeResultsByUrl, mergeUniqueValues } from '../docs/scripts/shared/dedupeShared.js';
import { normaliseUrlForDedupe } from './urlNormaliser.js';

export function dedupe(results) {
  return dedupeResultsByUrl(results, {
    getKey(result) {
      return normaliseUrlForDedupe(result.url);
    },
    createEntry(result) {
      return {
        ...result,
        sources: [result.source].filter(Boolean),
        meta: result.meta && typeof result.meta === 'object' ? { ...result.meta } : {},
      };
    },
    mergeEntry(existing, result) {
      existing.sources = mergeUniqueValues(existing.sources, [result.source].filter(Boolean));
      if (!existing.title && result.title) existing.title = result.title;
      if (!existing.snippet && result.snippet) existing.snippet = result.snippet;
      if (result.rank && (!existing.rank || result.rank < existing.rank)) {
        existing.rank = result.rank;
      }
      if (result.meta && typeof result.meta === 'object') {
        for (const [key, value] of Object.entries(result.meta)) {
          if (!(key in existing.meta)) {
            existing.meta[key] = value;
          }
        }
      }
      return existing;
    },
  });
}
