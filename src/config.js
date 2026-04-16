/**
 * Shared configuration — API-key loading from environment variables.
 *
 * Both the CLI entry point (index.js) and the web server (ui/server.js)
 * import from here so the env-var mapping is defined in exactly one place.
 */

// Map of environment variable names to apiKeys property names.
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

module.exports = { ENV_KEY_MAP, loadKeysFromEnv };
