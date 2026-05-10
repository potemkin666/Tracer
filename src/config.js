/**
 * Shared configuration — API-key loading from environment variables
 * and proxy settings.
 *
 * Both the CLI entry point (index.js) and the web server (ui/server.js)
 * import from here so the env-var mapping is defined in exactly one place.
 *
 * KEY_DEFS is the canonical source for all API key definitions, used by:
 * - CLI help text generation (index.js)
 * - README documentation generation
 * - Browser UI key grid (docs/scripts/app.js via engineMetadata.js)
 * - Server configuration (engineMetadata.js)
 */

// Canonical list of all API key definitions
export const KEY_DEFS = [
  { id: 'brave', envVar: 'TRACER_BRAVE_KEY', label: 'BRAVE KEY', description: 'Brave Search API key' },
  { id: 'kagi', envVar: 'TRACER_KAGI_KEY', label: 'KAGI KEY', description: 'Kagi API key' },
  { id: 'bing', envVar: 'TRACER_BING_KEY', label: 'BING KEY', description: 'Bing Search API key' },
  { id: 'google', envVar: 'TRACER_GOOGLE_KEY', label: 'GOOGLE KEY', description: 'Google Custom Search key' },
  { id: 'googleCx', envVar: 'TRACER_GOOGLE_CX', label: 'GOOGLE CX', description: 'Google Custom Search CX' },
  { id: 'serpapi', envVar: 'TRACER_SERPAPI_KEY', label: 'SERPAPI KEY', description: 'SerpAPI key' },
  { id: 'mojeek', envVar: 'TRACER_MOJEEK_KEY', label: 'MOJEEK KEY', description: 'Mojeek API key' },
  { id: 'exa', envVar: 'TRACER_EXA_KEY', label: 'EXA KEY', description: 'Exa AI API key' },
  { id: 'perplexity', envVar: 'TRACER_PERPLEXITY_KEY', label: 'PERPLEXITY KEY', description: 'Perplexity AI API key' },
  { id: 'shodan', envVar: 'TRACER_SHODAN_KEY', label: 'SHODAN KEY', description: 'Shodan API key' },
  { id: 'censysId', envVar: 'TRACER_CENSYS_ID', label: 'CENSYS ID', description: 'Censys API ID' },
  { id: 'censysSecret', envVar: 'TRACER_CENSYS_SECRET', label: 'CENSYS SECRET', description: 'Censys API secret' },
  { id: 'hunter', envVar: 'TRACER_HUNTER_KEY', label: 'HUNTER KEY', description: 'Hunter.io API key' },
  { id: 'intelx', envVar: 'TRACER_INTELX_KEY', label: 'INTELX KEY', description: 'IntelX API key' },
  { id: 'publicwww', envVar: 'TRACER_PUBLICWWW_KEY', label: 'PUBLICWWW KEY', description: 'PublicWWW API key' },
  { id: 'tineye', envVar: 'TRACER_TINEYE_KEY', label: 'TINEYE KEY', description: 'TinEye API key' },
  { id: 'dehashed', envVar: 'TRACER_DEHASHED_KEY', label: 'DEHASHED email:key', description: 'DeHashed API key' },
  { id: 'hibp', envVar: 'TRACER_HIBP_KEY', label: 'HIBP API KEY', description: 'Have I Been Pwned API key' },
  { id: 'greynoise', envVar: 'TRACER_GREYNOISE_KEY', label: 'GREYNOISE KEY', description: 'GreyNoise API key' },
  { id: 'yandex', envVar: 'TRACER_YANDEX_KEY', label: 'YANDEX user:key', description: 'Yandex XML user:key' },
  { id: 'naverClientId', envVar: 'TRACER_NAVER_CLIENT_ID', label: 'NAVER CLIENT ID', description: 'Naver client ID' },
  { id: 'naverClientSecret', envVar: 'TRACER_NAVER_CLIENT_SECRET', label: 'NAVER SECRET', description: 'Naver client secret' },
  { id: 'metager', envVar: 'TRACER_METAGER_KEY', label: 'METAGER KEY', description: 'MetaGer API key' },
  { id: 'swisscows', envVar: 'TRACER_SWISSCOWS_KEY', label: 'SWISSCOWS KEY', description: 'Swisscows API key' },
  { id: 'listennotes', envVar: 'TRACER_LISTENNOTES_KEY', label: 'LISTENNOTES KEY', description: 'ListenNotes API key' },
  { id: 'searxngUrl', envVar: 'TRACER_SEARXNG_URL', label: 'SEARXNG INSTANCE URL', description: 'SearXNG instance URL' },
  { id: 'wolframalpha', envVar: 'TRACER_WOLFRAMALPHA_KEY', label: 'WOLFRAM ALPHA KEY', description: 'Wolfram Alpha API key' },
  { id: 'netlas', envVar: 'TRACER_NETLAS_KEY', label: 'NETLAS KEY', description: 'Netlas API key' },
];

// Map of environment variable names to apiKeys property names (generated from KEY_DEFS)
export const ENV_KEY_MAP = Object.fromEntries(
  KEY_DEFS.map(def => [def.envVar, def.id])
);

/**
 * Proxy-related environment variable names.
 *
 *   TRACER_PROXY_URL             – full proxy URL, e.g.
 *       socks5://127.0.0.1:9050   (Tor default)
 *       http://proxy:8080
 *   TRACER_TOR_CONTROL_PORT      – Tor control port for NEWNYM (default 9051)
 *   TRACER_TOR_CONTROL_PASSWORD  – plaintext password for AUTHENTICATE
 */
export const PROXY_ENV_VARS = [
  'TRACER_PROXY_URL',
  'TRACER_TOR_CONTROL_PORT',
  'TRACER_TOR_CONTROL_PASSWORD',
];

export function loadKeysFromEnv() {
  const keys = {};
  for (const [envVar, keyName] of Object.entries(ENV_KEY_MAP)) {
    if (process.env[envVar]) {
      keys[keyName] = process.env[envVar];
    }
  }
  return keys;
}

/**
 * Generate CLI help text for environment variables from KEY_DEFS.
 * This ensures the CLI help stays in sync with config.
 */
export function generateEnvVarHelp() {
  const maxEnvVarLength = Math.max(...KEY_DEFS.map(def => def.envVar.length));
  return KEY_DEFS
    .map(def => `  ${def.envVar.padEnd(maxEnvVarLength + 2)}${def.description}`)
    .join('\n');
}

/**
 * Generate a markdown table of environment variables for README.
 * This ensures the README stays in sync with config.
 */
export function generateEnvVarMarkdownTable() {
  return [
    '| Variable | Description |',
    '|----------|-------------|',
    ...KEY_DEFS.map(def => `| \`${def.envVar}\` | ${def.description} |`)
  ].join('\n');
}

