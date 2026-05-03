import { dedupeResultsByUrl, mergeUniqueValues } from '../docs/scripts/shared/dedupeShared.js';
import { normaliseUrlForDedupe } from './urlNormaliser.js';

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function cloneMetaValue(value) {
  if (Array.isArray(value)) {
    return value.map(cloneMetaValue);
  }
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, cloneMetaValue(entry)])
    );
  }
  return value;
}

function isEmptyMetaValue(value) {
  return value == null
    || value === ''
    || (Array.isArray(value) && value.length === 0)
    || (isPlainObject(value) && Object.keys(value).length === 0);
}

function chooseScalarMetaValue(existing, incoming) {
  if (typeof existing === 'string' && typeof incoming === 'string') {
    return incoming.trim().length >= existing.trim().length ? incoming : existing;
  }
  if (typeof existing === 'boolean' && typeof incoming === 'boolean') {
    return existing || incoming;
  }
  return incoming;
}

export function mergeMetaValues(existing, incoming) {
  if (isEmptyMetaValue(incoming)) return cloneMetaValue(existing);
  if (isEmptyMetaValue(existing)) return cloneMetaValue(incoming);

  if (Array.isArray(existing) && Array.isArray(incoming)) {
    return mergeUniqueValues(existing, incoming);
  }

  if (isPlainObject(existing) && isPlainObject(incoming)) {
    const merged = cloneMetaValue(existing);
    for (const [key, value] of Object.entries(incoming)) {
      merged[key] = key in merged
        ? mergeMetaValues(merged[key], value)
        : cloneMetaValue(value);
    }
    return merged;
  }

  return cloneMetaValue(chooseScalarMetaValue(existing, incoming));
}

export function dedupe(results) {
  return dedupeResultsByUrl(results, {
    getKey(result) {
      return normaliseUrlForDedupe(result.url);
    },
    createEntry(result) {
      return {
        ...result,
        sources: [result.source].filter(Boolean),
        meta: result.meta && typeof result.meta === 'object' ? cloneMetaValue(result.meta) : {},
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
        existing.meta = mergeMetaValues(existing.meta, result.meta);
      }
      return existing;
    },
  });
}
