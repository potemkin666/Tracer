import { generateQueries } from './queryPlanner.js';
import { dedupe } from './deduper.js';
import { score } from './scorer.js';
import { enrich } from './enricher.js';
import { getActive } from './connectors/registry.js';
import * as wayback from './connectors/wayback.js';
import * as namechk from './connectors/namechk.js';
import * as timeSlice from './connectors/timeSlice.js';
import * as docSearch from './connectors/docSearch.js';
import * as fossilHunter from './fossilHunter.js';
import * as avatarHunter from './avatarHunter.js';
import {
  combineSignals,
  createAbortError,
  isAbortError,
  normaliseAbortError,
  runWithRequestContext,
  throwIfAborted,
} from './requestContext.js';

const CONNECTOR_TIMEOUT_MS = 15_000;
const DEFAULT_CONCURRENCY = 12;

function poolAll(tasks, concurrency, signal) {
  const results = new Array(tasks.length);
  let next = 0;

  function runNext() {
    if (signal?.aborted || next >= tasks.length) return Promise.resolve();
    const idx = next++;
    return tasks[idx]().then(
      (value) => { results[idx] = { status: 'fulfilled', value }; },
      (reason) => { results[idx] = { status: 'rejected', reason }; },
    ).then(runNext);
  }

  const workers = Array.from(
    { length: Math.min(concurrency, tasks.length) },
    () => runNext(),
  );
  return Promise.all(workers).then(() => results);
}

function createProgressTracker(notify, connectorStats, signal) {
  return {
    markPhase(phase, resultsSoFar) {
      throwIfAborted(signal);
      notify({ phase, resultsSoFar });
    },

    recordSuccess(connectorId, startedAt, batch) {
      throwIfAborted(signal);
      connectorStats.push({
        id: connectorId,
        ok: true,
        ms: Date.now() - startedAt,
        count: batch.length,
      });
      notify({ phase: 'connectors', connector: connectorId, resultsSoFar: batch.length });
      return batch;
    },

    recordFailure(connectorId, startedAt, err) {
      if (isAbortError(err)) {
        throw err;
      }
      connectorStats.push({
        id: connectorId,
        ok: false,
        ms: Date.now() - startedAt,
        error: err.message,
      });
      notify({ phase: 'connectors', connector: connectorId, error: err.message });
      return [];
    },
  };
}

async function runConnectorSearch(connector, query, apiKeys, requestSignal) {
  const timeoutController = new globalThis.AbortController();
  const timeoutError = createAbortError('connector timeout');
  const timer = setTimeout(() => timeoutController.abort(timeoutError), CONNECTOR_TIMEOUT_MS);
  const signal = combineSignals(requestSignal, timeoutController.signal);

  try {
    return await runWithRequestContext({ signal }, () => connector.search(query, apiKeys, { signal }));
  } catch (err) {
    if (timeoutController.signal.aborted) {
      throw new Error('connector timeout');
    }
    if (requestSignal?.aborted) {
      throw normaliseAbortError(err, requestSignal);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function run(input, config = {}) {
  const {
    apiKeys = {},
    mode = 'normal',
    fossils = false,
    avatars = false,
    timeSliceMode = false,
    documents = false,
    onProgress,
    concurrency = DEFAULT_CONCURRENCY,
    signal,
  } = config;

  return runWithRequestContext({ signal }, async () => {
    throwIfAborted(signal);

    const notify = typeof onProgress === 'function' ? onProgress : () => {};
    const trackerStats = [];
    const tracker = createProgressTracker(notify, trackerStats, signal);
    const aggressive = mode === 'aggressive';
    const queries = generateQueries(input);
    const limited = aggressive ? queries : queries.slice(0, 6);
    const activeConnectors = getActive(apiKeys, mode);

    const tasks = [];
    for (const query of limited) {
      for (const connector of activeConnectors) {
        tasks.push(() => {
          const startedAt = Date.now();
          return runConnectorSearch(connector, query, apiKeys, signal)
            .then((batch) => tracker.recordSuccess(connector.id, startedAt, batch))
            .catch((err) => tracker.recordFailure(connector.id, startedAt, err));
        });
      }
    }

    const settled = await poolAll(tasks, concurrency, signal);
    throwIfAborted(signal);

    let all = settled
      .map((entry) => (entry?.status === 'fulfilled' ? entry.value : []))
      .flat();

    tracker.markPhase('wayback', all.length);
    const [waybackResults, namechkResults] = await Promise.all([
      wayback.search(input, apiKeys, { signal }),
      namechk.search(input.split(/\s+/)[0], apiKeys, { signal }),
    ]);
    throwIfAborted(signal);

    all = all.concat(waybackResults, namechkResults);
    tracker.markPhase('namechk', all.length);

    if (timeSliceMode || aggressive) {
      const sliceResults = await timeSlice.search(input, apiKeys, { signal });
      throwIfAborted(signal);
      all = all.concat(sliceResults);
      tracker.markPhase('timeSlice', all.length);
    }

    if (documents || aggressive) {
      const docResults = await docSearch.search(input, apiKeys, { signal });
      throwIfAborted(signal);
      all = all.concat(docResults);
      tracker.markPhase('docSearch', all.length);
    }

    const unique = dedupe(all);
    tracker.markPhase('dedupe', unique.length);

    const enriched = enrich(unique, input);

    if (fossils || aggressive) {
      const fossilResults = await fossilHunter.hunt(input, enriched, { signal });
      throwIfAborted(signal);
      const withFossils = dedupe([...enriched, ...fossilResults]);
      tracker.markPhase('fossils', withFossils.length);
      const scored = score(withFossils, input);
      const avatarClusters = avatars || aggressive
        ? await avatarHunter.hunt(scored, { signal })
        : [];
      throwIfAborted(signal);
      tracker.markPhase('done', scored.length);
      return { results: scored, avatarClusters, connectorStats: trackerStats }; 
    }

    const scored = score(enriched, input);
    const avatarClusters = avatars || aggressive
      ? await avatarHunter.hunt(scored, { signal })
      : [];
    throwIfAborted(signal);
    tracker.markPhase('done', scored.length);
    return { results: scored, avatarClusters, connectorStats: trackerStats };
  });
}
