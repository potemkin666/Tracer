/* global DOMException */

import {
  buildQueryPlan,
  expandRelevantResults,
  getStandaloneMatchSignals,
} from '../shared/queryShared.js';
import { dedupeResultsByUrl, mergeUniqueValues } from '../shared/dedupeShared.js';
import { scoreResults } from '../shared/scoringShared.js';

export function mergeVariantResults(results) {
  const map = new Map();

  for (const result of results) {
    const key = (result.url && result.url.toLowerCase())
      || `${result.source || ''}|${(result.title || '').toLowerCase()}`;

    if (!map.has(key)) {
      map.set(key, {
        ...result,
        seenOn: [...(result.seenOn || [result.source].filter(Boolean))],
      });
      continue;
    }

    const existing = map.get(key);
    existing.seenOn = mergeUniqueValues(existing.seenOn, result.seenOn || [result.source].filter(Boolean));
    if (!existing.title && result.title) existing.title = result.title;
    if ((result.snippet || '').length > (existing.snippet || '').length) existing.snippet = result.snippet;
    if ((result.score || 0) > (existing.score || 0)) existing.score = result.score;
  }

  return Array.from(map.values());
}

export async function searchVariants(terms, run) {
  const settled = await Promise.allSettled(
    terms.map((term) => run(term, encodeURIComponent(term)))
  );
  const merged = [];
  const errors = [];

  settled.forEach((entry) => {
    if (entry.status === 'fulfilled' && Array.isArray(entry.value)) {
      merged.push(...entry.value);
    } else if (entry.status === 'rejected') {
      errors.push(entry.reason);
    }
  });

  if (!merged.length && errors.length) {
    throw errors[0];
  }

  return mergeVariantResults(merged);
}

export function dedupeStandalone(results) {
  return dedupeResultsByUrl(results, {
    createEntry(result) {
      return {
        ...result,
        seenOn: [...(result.seenOn || [result.source || ''].filter(Boolean))],
      };
    },
    mergeEntry(existing, result) {
      existing.seenOn = mergeUniqueValues(existing.seenOn, result.seenOn || [result.source || ''].filter(Boolean));
      if (!existing.title && result.title) existing.title = result.title;
      if (!existing.snippet && result.snippet) existing.snippet = result.snippet;
      if ((result.score || 0) > (existing.score || 0)) existing.score = result.score;
      return existing;
    },
  });
}

export function scoreStandalone(results, originalInput) {
  const plan = buildQueryPlan(originalInput);
  const urlMap = {};
  results.forEach((result) => {
    if (result.url) urlMap[result.url] = (urlMap[result.url] || 0) + 1;
  });

  return scoreResults(results, (result) => {
    const signals = getStandaloneMatchSignals(result, plan);
    return {
      titleExact: signals.title.includes(plan.lower) ? 1 : 0,
      snippetExact: signals.snippet.includes(plan.lower) ? 1 : 0,
      urlUsername: signals.noSpaces || signals.underscored || signals.hyphenated ? 1 : 0,
      multiSource: (urlMap[result.url] || 0) > 1 ? 1 : 0,
      archiveSource: result.source === 'wayback' || /archive\.org/.test(signals.url) ? 1 : 0,
      allTokensPresent: plan.tokens.length > 1 && signals.tokenHits === plan.tokens.length ? 1 : 0,
      titlePartial: plan.tokens.some((token) => signals.title.includes(token)) ? 1 : 0,
      snippetPartial: plan.tokens.some((token) => signals.snippet.includes(token)) ? 1 : 0,
      bias: 1,
    };
  });
}

function classifyStandaloneError(err) {
  const message = (err && err.message) || 'unknown';
  const isRateLimited = Boolean(err && err._rateLimited) || message.includes('429');
  const isTimeout = Boolean(err && err.name === 'TimeoutError')
    || (err instanceof DOMException && err.name === 'AbortError')
    || message.includes('timeout');
  const isCors = (err instanceof TypeError && message.includes('fetch'))
    || message.includes('NetworkError');

  if (isRateLimited) return 'rate-limited';
  if (isTimeout) return 'timeout';
  if (isCors) return 'CORS';
  return message.slice(0, 30);
}

export async function searchDirect(query, namedFetchers, options = {}) {
  const {
    connected = false,
    initLiveProgress = () => {},
    updateLiveProgress = () => {},
    renderSourceStatus = () => {},
    showEngineSummary = () => {},
    showWarnings = () => {},
    rateLimitWarnings = [],
    extraRatio = 0.1,
  } = options;

  const plan = buildQueryPlan(query);
  const attempted = namedFetchers.length;
  const sourceStatus = [];
  const results = [];
  let responded = 0;

  initLiveProgress(namedFetchers.map((fetcher) => fetcher.name));

  const wrapped = namedFetchers.map((fetcher, index) =>
    fetcher.fn()
      .then(
        (value) => ({ index, status: 'fulfilled', value }),
        (reason) => ({ index, status: 'rejected', reason })
      )
      .then((entry) => {
        const progressStatus = entry.status === 'fulfilled' && Array.isArray(entry.value) && entry.value.length > 0
          ? 'ok'
          : entry.status === 'fulfilled'
            ? 'empty'
            : 'fail';
        updateLiveProgress(fetcher.name, progressStatus);
        return entry;
      })
  );

  const settled = await Promise.all(wrapped);
  settled.forEach((entry) => {
    const name = namedFetchers[entry.index].name;
    if (entry.status === 'fulfilled' && Array.isArray(entry.value)) {
      if (entry.value.length) {
        responded += 1;
        entry.value.forEach((result) => results.push(result));
        sourceStatus.push({ name, status: 'ok', count: entry.value.length });
      } else {
        sourceStatus.push({ name, status: 'empty' });
      }
      return;
    }

    sourceStatus.push({
      name,
      status: 'fail',
      reason: classifyStandaloneError(entry.reason),
    });
  });

  if (!connected) {
    showEngineSummary(`STANDALONE · ${responded}/${attempted} sources responded`);
  }

  renderSourceStatus(sourceStatus);
  if (rateLimitWarnings.length) {
    showWarnings(rateLimitWarnings.join(' | '));
  }

  const expanded = expandRelevantResults(results, plan, extraRatio);
  const deduped = dedupeStandalone(expanded);
  return scoreStandalone(deduped, query);
}
