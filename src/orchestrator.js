const { generateQueries } = require('./queryPlanner');
const { dedupe } = require('./deduper');
const { score } = require('./scorer');
const brave = require('./connectors/brave');
const serpapi = require('./connectors/serpapi');
const mojeek = require('./connectors/mojeek');
const wayback = require('./connectors/wayback');
const namechk = require('./connectors/namechk');

async function run(input, config = {}) {
  const { apiKeys = {}, mode = 'normal' } = config;
  const queries = generateQueries(input);
  const limited = mode === 'aggressive' ? queries : queries.slice(0, 3);

  let all = [];

  await Promise.all(
    limited.map(async (query) => {
      const tasks = [];
      if (apiKeys.brave) tasks.push(brave.search(query, apiKeys.brave));
      if (apiKeys.serpapi) tasks.push(serpapi.search(query, apiKeys.serpapi));
      if (apiKeys.mojeek) tasks.push(mojeek.search(query, apiKeys.mojeek));

      const batches = await Promise.all(tasks);
      batches.forEach((b) => all.push(...b));
    })
  );

  const [waybackResults, namechkResults] = await Promise.all([
    wayback.search(input),
    namechk.search(input.split(/\s+/)[0]),
  ]);

  all.push(...waybackResults, ...namechkResults);

  const unique = dedupe(all);
  return score(unique, input);
}

module.exports = { run };
