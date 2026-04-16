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

/**
 * Per-connector timeout in milliseconds.
 * Prevents a single slow connector from stalling the entire pipeline.
 */
const CONNECTOR_TIMEOUT_MS = 15_000;

/**
 * Maximum number of concurrent connector requests.
 * Prevents flooding upstream APIs and triggering rate limits.
 */
const DEFAULT_CONCURRENCY = 12;

/**
 * Run a function with a timeout. Resolves to the result or rejects
 * with a timeout error if the function takes longer than `ms`.
 * Uses Promise.race to ensure the timer is always cleaned up.
 */
function withTimeout(fn, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('connector timeout')), ms);
  });
  return Promise.race([fn(), timeout]).finally(() => clearTimeout(timer));
}

/**
 * Run an array of async task-factories with bounded concurrency.
 * Each factory is () => Promise<T>. Returns Promise<T[]> in order.
 *
 * @param {Array<() => Promise>} tasks
 * @param {number} concurrency
 * @returns {Promise<Array>}
 */
function poolAll(tasks, concurrency) {
  const results = new Array(tasks.length);
  let next = 0;

  function runNext() {
    if (next >= tasks.length) return Promise.resolve();
    const idx = next++;
    return tasks[idx]().then(
      (val) => { results[idx] = { status: 'fulfilled', value: val }; },
      (err) => { results[idx] = { status: 'rejected', reason: err }; },
    ).then(runNext);
  }

  const workers = Array.from(
    { length: Math.min(concurrency, tasks.length) },
    () => runNext(),
  );
  return Promise.all(workers).then(() => results);
}

/**
 * Run the Tracer pipeline.
 *
 * @param {string} input – search term (name / username / alias)
 * @param {object} config
 * @param {function} [config.onProgress] – optional callback invoked with
 *   { phase: string, connector?: string, resultsSoFar: number } after each
 *   connector completes. Allows callers to stream incremental progress.
 */
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
  } = config;

  const notify =
    typeof onProgress === 'function'
      ? onProgress
      : () => {};

  const aggressive = mode === 'aggressive';
  const queries = generateQueries(input);
  const limited = aggressive ? queries : queries.slice(0, 6);

  const activeConnectors = getActive(apiKeys, mode);

  // ── Connector stats (timing + errors) ──────────────────────────────────
  const connectorStats = [];

  // Build a flat list of tasks: one per (query, connector) pair.
  const tasks = [];
  for (const query of limited) {
    for (const c of activeConnectors) {
      tasks.push(() => {
        const start = Date.now();
        return withTimeout(() => c.search(query, apiKeys), CONNECTOR_TIMEOUT_MS)
          .then((batch) => {
            connectorStats.push({ id: c.id, ok: true, ms: Date.now() - start, count: batch.length });
            notify({ phase: 'connectors', connector: c.id, resultsSoFar: batch.length });
            return batch;
          })
          .catch((err) => {
            connectorStats.push({ id: c.id, ok: false, ms: Date.now() - start, error: err.message });
            notify({ phase: 'connectors', connector: c.id, error: err.message });
            return [];
          });
      });
    }
  }

  // Run with bounded concurrency
  const settled = await poolAll(tasks, concurrency);
  let all = settled.map(s => s.status === 'fulfilled' ? s.value : []).flat();

  notify({ phase: 'wayback', resultsSoFar: all.length });

  const [waybackResults, namechkResults] = await Promise.all([
    wayback.search(input),
    namechk.search(input.split(/\s+/)[0]),
  ]);

  all = all.concat(waybackResults, namechkResults);
  notify({ phase: 'namechk', resultsSoFar: all.length });

  // Time-slice: search historical eras via Wayback CDX
  if (timeSliceMode || aggressive) {
    const sliceResults = await timeSlice.search(input);
    all = all.concat(sliceResults);
    notify({ phase: 'timeSlice', resultsSoFar: all.length });
  }

  // Document edge scraping: PDFs, DOCs, PPTs via Wayback + filetype: operators
  if (documents || aggressive) {
    const docResults = await docSearch.search(input, apiKeys);
    all = all.concat(docResults);
    notify({ phase: 'docSearch', resultsSoFar: all.length });
  }

  const unique = dedupe(all);
  notify({ phase: 'dedupe', resultsSoFar: unique.length });

  // ── Enrichment: detect platforms, extract usernames, classify domains ──
  const enriched = enrich(unique, input);

  // Fossil hunting: find old captures of profile URLs already discovered
  let finalResults = enriched;
  if (fossils || aggressive) {
    const fossilResults = await fossilHunter.hunt(input, enriched);
    finalResults = dedupe([...enriched, ...fossilResults]);
    notify({ phase: 'fossils', resultsSoFar: finalResults.length });
  }

  const scored = score(finalResults, input);
  const avatarClusters = avatars || aggressive ? await avatarHunter.hunt(scored) : [];
  notify({ phase: 'done', resultsSoFar: scored.length });
  return { results: scored, avatarClusters, connectorStats };
}
