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

async function run(input, config = {}) {
  const {
    apiKeys = {},
    mode = 'normal',
    fossils = false,
    avatars = false,
    timeSliceMode = false,
    documents = false,
  } = config;

  const aggressive = mode === 'aggressive';
  const queries = generateQueries(input);
  const limited = aggressive ? queries : queries.slice(0, 3);

  let all = [];

  const activeConnectors = getActive(apiKeys, mode);

  await Promise.all(
    limited.map(async (query) => {
      const batches = await Promise.all(
        activeConnectors.map((c) => c.search(query, apiKeys))
      );
      batches.forEach((b) => all.push(...b));
    })
  );

  const [waybackResults, namechkResults] = await Promise.all([
    wayback.search(input),
    namechk.search(input.split(/\s+/)[0]),
  ]);

  all.push(...waybackResults, ...namechkResults);

  // Time-slice: search historical eras via Wayback CDX
  if (timeSliceMode || aggressive) {
    const sliceResults = await timeSlice.search(input);
    all.push(...sliceResults);
  }

  // Document edge scraping: PDFs, DOCs, PPTs via Wayback + filetype: operators
  if (documents || aggressive) {
    const docResults = await docSearch.search(input, apiKeys);
    all.push(...docResults);
  }

  const unique = dedupe(all);

  // Fossil hunting: find old captures of profile URLs already discovered
  if (fossils || aggressive) {
    const fossilResults = await fossilHunter.hunt(input, unique);
    const withFossils = dedupe([...unique, ...fossilResults]);
    const scored = score(withFossils, input);
    const avatarClusters = avatars || aggressive ? await avatarHunter.hunt(scored) : [];
    return { results: scored, avatarClusters };
  }

  const scored = score(unique, input);
  const avatarClusters = avatars || aggressive ? await avatarHunter.hunt(scored) : [];
  return { results: scored, avatarClusters };
}

module.exports = { run };
