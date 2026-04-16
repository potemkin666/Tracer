const { generateQueries } = require('./queryPlanner');
const { dedupe } = require('./deduper');
const { score } = require('./scorer');
const { getActive } = require('./connectors/registry');
const wayback = require('./connectors/wayback');
const namechk = require('./connectors/namechk');
const timeSlice = require('./connectors/timeSlice');
const docSearch = require('./connectors/docSearch');
const fossilHunter = require('./fossilHunter');
const avatarHunter = require('./avatarHunter');

/**
 * Run the Tracer pipeline.
 *
 * @param {string} input – search term (name / username / alias)
 * @param {object} config
 * @param {function} [config.onProgress] – optional callback invoked with
 *   { phase: string, connector?: string, resultsSoFar: number } after each
 *   connector completes. Allows callers to stream incremental progress.
 */
async function run(input, config = {}) {
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
  const limited = aggressive ? queries : queries.slice(0, 3);

  let all = [];

  const activeConnectors = getActive(apiKeys, mode);

  await Promise.all(
    limited.map(async (query) => {
      const batches = await Promise.all(
        activeConnectors.map(async (c) => {
          const batch = await c.search(query, apiKeys);
          all.push(...batch);
          notify({ phase: 'connectors', connector: c.id, resultsSoFar: all.length });
          return batch;
        })
      );
    })
  );

  notify({ phase: 'wayback', resultsSoFar: all.length });

  const [waybackResults, namechkResults] = await Promise.all([
    wayback.search(input),
    namechk.search(input.split(/\s+/)[0]),
  ]);

  all.push(...waybackResults, ...namechkResults);
  notify({ phase: 'namechk', resultsSoFar: all.length });

  // Time-slice: search historical eras via Wayback CDX
  if (timeSliceMode || aggressive) {
    const sliceResults = await timeSlice.search(input);
    all.push(...sliceResults);
    notify({ phase: 'timeSlice', resultsSoFar: all.length });
  }

  // Document edge scraping: PDFs, DOCs, PPTs via Wayback + filetype: operators
  if (documents || aggressive) {
    const docResults = await docSearch.search(input, apiKeys);
    all.push(...docResults);
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

module.exports = { run };
