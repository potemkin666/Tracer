import { generateQueries } from './queryPlanner.js';
import { dedupe } from './deduper.js';
import { score } from './scorer.js';
import { enrich } from './enricher.js';
import { getActive } from './connectors/registry.js';
import * as wayback from './connectors/wayback.js';
import * as namechk from './connectors/namechk.js';
import * as timeSlice from './connectors/timeSlice.js';
import * as docSearch from './connectors/docSearch.js';
import * as profileProbe from './profileProbe.js';
import * as fossilHunter from './fossilHunter.js';
import * as avatarHunter from './avatarHunter.js';
import { clusterResults } from './resultClusters.js';
import { ORCHESTRATOR_DEFAULTS } from './runtimeConfig.js';
import {
  combineSignals,
  createAbortError,
  isAbortError,
  normaliseAbortError,
  runWithRequestContext,
  throwIfAborted,
} from './requestContext.js';

export function pruneQueries(queries, connectorCount, mode = 'normal') {
  if (!queries.length || connectorCount <= 0) return queries;
  const maxTasks = mode === 'aggressive'
    ? ORCHESTRATOR_DEFAULTS.maxQueryTasks.aggressive
    : ORCHESTRATOR_DEFAULTS.maxQueryTasks.normal;
  const minQueries = mode === 'aggressive'
    ? ORCHESTRATOR_DEFAULTS.minimumQueries.aggressive
    : ORCHESTRATOR_DEFAULTS.minimumQueries.normal;
  const maxQueries = Math.max(minQueries, Math.ceil(maxTasks / connectorCount));
  return queries.slice(0, Math.min(queries.length, maxQueries));
}

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

export function createProgressTracker(notify, connectorStats, signal) {
  let cumulativeResults = 0;

  return {
    markPhase(phase, resultsSoFar = cumulativeResults) {
      throwIfAborted(signal);
      notify({ phase, resultsSoFar });
    },

    recordSuccess(connectorId, startedAt, batch) {
      throwIfAborted(signal);
      cumulativeResults += batch.length;
      connectorStats.push({
        id: connectorId,
        ok: true,
        ms: Date.now() - startedAt,
        count: batch.length,
      });
      notify({
        phase: 'connectors',
        connector: connectorId,
        batchResults: batch.length,
        resultsSoFar: cumulativeResults,
      });
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
      notify({
        phase: 'connectors',
        connector: connectorId,
        error: err.message,
        resultsSoFar: cumulativeResults,
      });
      return [];
    },
  };
}

export function resolveConnectorRuntime(connector = {}) {
  const runtime = connector.runtime || {};
  return {
    timeoutMs: runtime.timeoutMs ?? ORCHESTRATOR_DEFAULTS.connectorTimeoutMs,
    retries: runtime.retries ?? ORCHESTRATOR_DEFAULTS.connectorRetries,
  };
}

async function runConnectorAttempt(connector, query, apiKeys, requestSignal, timeoutMs) {
  const timeoutController = new globalThis.AbortController();
  const timeoutError = createAbortError('connector timeout');
  const timer = setTimeout(() => timeoutController.abort(timeoutError), timeoutMs);
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

async function runConnectorSearch(connector, query, apiKeys, requestSignal) {
  const { timeoutMs, retries } = resolveConnectorRuntime(connector);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await runConnectorAttempt(connector, query, apiKeys, requestSignal, timeoutMs);
    } catch (err) {
      if (isAbortError(err) || requestSignal?.aborted || attempt >= retries) {
        throw err;
      }
    }
  }

  return [];
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
    concurrency = ORCHESTRATOR_DEFAULTS.defaultConcurrency,
    signal,
  } = config;

  return runWithRequestContext({ signal }, async () => {
    throwIfAborted(signal);

    const notify = typeof onProgress === 'function' ? onProgress : () => {};
    const trackerStats = [];
    const tracker = createProgressTracker(notify, trackerStats, signal);
    const queries = generateQueries(input);
    const activeConnectors = getActive(apiKeys, mode);
    const aggressive = mode === 'aggressive';
    const limited = pruneQueries(queries, activeConnectors.length, mode);

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

    const profileResults = await profileProbe.search(input, apiKeys, { signal });
    throwIfAborted(signal);
    all = all.concat(profileResults);
    tracker.markPhase('profileProbe', all.length);

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
      const clustered = clusterResults(score(withFossils, input));
      const avatarClusters = avatars || aggressive
        ? await avatarHunter.hunt(clustered, { signal })
        : [];
      throwIfAborted(signal);
      tracker.markPhase('done', clustered.length);
      return { results: clustered, avatarClusters, connectorStats: trackerStats }; 
    }

    const clustered = clusterResults(score(enriched, input));
    const avatarClusters = avatars || aggressive
      ? await avatarHunter.hunt(clustered, { signal })
      : [];
    throwIfAborted(signal);
    tracker.markPhase('done', clustered.length);
    return { results: clustered, avatarClusters, connectorStats: trackerStats };
  });
}
