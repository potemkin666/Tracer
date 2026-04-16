const path = require('path');
const express = require('express');
const { run } = require('../orchestrator');

// Map of environment variable names to apiKeys property names (mirrors index.js).
const ENV_KEY_MAP = {
  TRACER_BRAVE_KEY: 'brave',
  TRACER_SERPAPI_KEY: 'serpapi',
  TRACER_MOJEEK_KEY: 'mojeek',
  TRACER_KAGI_KEY: 'kagi',
  TRACER_BING_KEY: 'bing',
  TRACER_GOOGLE_KEY: 'google',
  TRACER_GOOGLE_CX: 'googleCx',
  TRACER_METAGER_KEY: 'metager',
  TRACER_SWISSCOWS_KEY: 'swisscows',
  TRACER_SHODAN_KEY: 'shodan',
  TRACER_CENSYS_ID: 'censysId',
  TRACER_CENSYS_SECRET: 'censysSecret',
  TRACER_HUNTER_KEY: 'hunter',
  TRACER_INTELX_KEY: 'intelx',
  TRACER_PUBLICWWW_KEY: 'publicwww',
  TRACER_LISTENNOTES_KEY: 'listennotes',
  TRACER_YANDEX_KEY: 'yandex',
  TRACER_NAVER_CLIENT_ID: 'naverClientId',
  TRACER_NAVER_CLIENT_SECRET: 'naverClientSecret',
  TRACER_SEARXNG_URL: 'searxngUrl',
  TRACER_WOLFRAMALPHA_KEY: 'wolframalpha',
  TRACER_NETLAS_KEY: 'netlas',
  TRACER_EXA_KEY: 'exa',
  TRACER_PERPLEXITY_KEY: 'perplexity',
  TRACER_TINEYE_KEY: 'tineye',
};

function loadKeysFromEnv() {
  const keys = {};
  for (const [envVar, keyName] of Object.entries(ENV_KEY_MAP)) {
    if (process.env[envVar]) {
      keys[keyName] = process.env[envVar];
    }
  }
  return keys;
}

// Load API keys once at startup from server-side environment variables.
// Client requests never supply keys — this prevents the server from being
// used as an open proxy to third-party APIs with arbitrary credentials.
const serverApiKeys = loadKeysFromEnv();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/search', async (req, res) => {
  const { input, mode, fossils, avatars, timeSliceMode, documents } = req.body || {};
  if (!input) return res.status(400).json({ error: 'input is required' });

  try {
    const { results, avatarClusters } = await run(input, {
      mode,
      apiKeys: serverApiKeys,
      fossils,
      avatars,
      timeSliceMode,
      documents,
    });
    res.json({ results, avatarClusters });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Tracer UI running at http://localhost:${PORT}`);
});

module.exports = app;
