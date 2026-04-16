import { generateQueries } from './queryPlanner.js';
import { dedupe } from './deduper.js';
import { score } from './scorer.js';
import { getActive } from './connectors/registry.js';
import * as wayback from './connectors/wayback.js';
import * as namechk from './connectors/namechk.js';
import * as timeSlice from './connectors/timeSlice.js';
import * as docSearch from './connectors/docSearch.js';
import * as fossilHunter from './fossilHunter.js';
import * as avatarHunter from './avatarHunter.js';

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
  } = config;

  const notify =
    typeof onProgress === 'function'
      ? onProgress
      : () => {};

  const aggressive = mode === 'aggressive';
  const queries = generateQueries(input);
  const limited = aggressive ? queries : queries.slice(0, 6);

  const activeConnectors = getActive(apiKeys, mode);

  // Collect results via return values — no shared mutable array.
  const connectorBatches = await Promise.all(
    limited.map(async (query) => {
      const batches = await Promise.all(
        activeConnectors.map(async (c) => {
          const batch = await c.search(query, apiKeys);
          notify({ phase: 'connectors', connector: c.id, resultsSoFar: batch.length });
          return batch;
        })
      );
      return batches.flat();
    })
  );
  let all = connectorBatches.flat();

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

  // Fossil hunting: find old captures of profile URLs already discovered
  if (fossils || aggressive) {
    const fossilResults = await fossilHunter.hunt(input, unique);
    const withFossils = dedupe([...unique, ...fossilResults]);
    notify({ phase: 'fossils', resultsSoFar: withFossils.length });
    const scored = score(withFossils, input);
    const avatarClusters = avatars || aggressive ? await avatarHunter.hunt(scored) : [];
    notify({ phase: 'done', resultsSoFar: scored.length });
    return { results: scored, avatarClusters };
  }

  const scored = score(unique, input);
  const avatarClusters = avatars || aggressive ? await avatarHunter.hunt(scored) : [];
  notify({ phase: 'done', resultsSoFar: scored.length });
  return { results: scored, avatarClusters };
}
