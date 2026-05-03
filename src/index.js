import fs from 'fs';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { run } from './orchestrator.js';
import { exportJSON, exportHTML } from './exporter.js';
import { loadKeysFromEnv } from './config.js';
import { normaliseSearchRequest } from './searchOptions.js';

export const USAGE_TEXT =
  'Usage: node src/index.js <input> [--mode normal|aggressive]\n' +
  '  -h, --help               Show help\n' +
  '  --config <path>          Load API keys from JSON file\n' +
  '  --output results.json    Save JSON output\n' +
  '  --html report.html       Save HTML report\n' +
  '  --fossils                Enable fossil hunting\n' +
  '  --avatars                Enable avatar clustering\n' +
  '  --time-slice             Enable time-slice search\n' +
  '  --documents              Enable document search\n' +
  '  --proxy <url>            Route requests through proxy\n' +
  '                           (socks5://host:port, http://host:port)\n' +
  '  --tor-rotate             Request a new Tor circuit before search\n' +
  '\n' +
  'API keys are loaded from environment variables (TRACER_BRAVE_KEY,\n' +
  'TRACER_SERPAPI_KEY, etc.) or from a JSON config file via --config.\n' +
  'Do NOT pass keys as command-line arguments — they are visible in\n' +
  'process listings, shell history, and /proc.\n' +
  '\n' +
  'Supported env vars:\n' +
  '  TRACER_BRAVE_KEY          Brave Search API key\n' +
  '  TRACER_SERPAPI_KEY        SerpAPI key\n' +
  '  TRACER_MOJEEK_KEY         Mojeek API key\n' +
  '  TRACER_KAGI_KEY           Kagi API key\n' +
  '  TRACER_BING_KEY           Bing Search API key\n' +
  '  TRACER_GOOGLE_KEY         Google Custom Search key\n' +
  '  TRACER_GOOGLE_CX          Google Custom Search CX\n' +
  '  TRACER_METAGER_KEY        MetaGer API key\n' +
  '  TRACER_SWISSCOWS_KEY      Swisscows API key\n' +
  '  TRACER_SHODAN_KEY         Shodan API key\n' +
  '  TRACER_CENSYS_ID          Censys API ID\n' +
  '  TRACER_CENSYS_SECRET      Censys API secret\n' +
  '  TRACER_HUNTER_KEY         Hunter.io API key\n' +
  '  TRACER_INTELX_KEY         IntelX API key\n' +
  '  TRACER_PUBLICWWW_KEY      PublicWWW API key\n' +
  '  TRACER_LISTENNOTES_KEY    ListenNotes API key\n' +
  '  TRACER_YANDEX_KEY         Yandex XML user:key\n' +
  '  TRACER_NAVER_CLIENT_ID    Naver client ID\n' +
  '  TRACER_NAVER_CLIENT_SECRET Naver client secret\n' +
  '  TRACER_SEARXNG_URL        SearXNG instance URL\n' +
  '  TRACER_WOLFRAMALPHA_KEY   Wolfram Alpha API key\n' +
  '  TRACER_NETLAS_KEY         Netlas API key\n' +
  '  TRACER_EXA_KEY            Exa AI API key\n' +
  '  TRACER_PERPLEXITY_KEY     Perplexity AI API key\n' +
  '  TRACER_TINEYE_KEY         TinEye API key\n' +
  '\n' +
  'Proxy env vars:\n' +
  '  TRACER_PROXY_URL          Proxy URL (overridden by --proxy)\n' +
  '  TRACER_TOR_CONTROL_PORT   Tor control port (default 9051)\n' +
  '  TRACER_TOR_CONTROL_PASSWORD  Tor control password';

export class CliUsageError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CliUsageError';
  }
}

function loadConfigFile(configPath) {
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    throw new CliUsageError(`Failed to load config: ${err.message}`);
  }
}

export function parseCliArgs(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv.slice(2),
      allowPositionals: true,
      strict: true,
      options: {
        help: { type: 'boolean', short: 'h' },
        config: { type: 'string' },
        mode: { type: 'string' },
        output: { type: 'string' },
        html: { type: 'string' },
        fossils: { type: 'boolean' },
        avatars: { type: 'boolean' },
        'time-slice': { type: 'boolean' },
        documents: { type: 'boolean' },
        proxy: { type: 'string' },
        'tor-rotate': { type: 'boolean' },
      },
    });
  } catch (err) {
    throw new CliUsageError(err.message);
  }

  const { values, positionals } = parsed;
  if (positionals.length > 1) {
    throw new CliUsageError('Only one search input may be provided.');
  }

  const apiKeys = loadKeysFromEnv();
  if (values.config) {
    Object.assign(apiKeys, loadConfigFile(values.config));
  }

  return {
    help: values.help ?? false,
    input: positionals[0],
    mode: values.mode,
    output: values.output,
    html: values.html,
    fossils: values.fossils ?? false,
    avatars: values.avatars ?? false,
    timeSliceMode: values['time-slice'] ?? false,
    documents: values.documents ?? false,
    proxy: values.proxy,
    torRotate: values['tor-rotate'] ?? false,
    apiKeys,
  };
}

function printUsage(stream = process.stdout) {
  stream.write(`${USAGE_TEXT}\n`);
}

export async function main(argv = process.argv) {
  let parsed;
  try {
    parsed = parseCliArgs(argv);
  } catch (err) {
    if (err instanceof CliUsageError) {
      console.error(err.message);
      printUsage(process.stderr);
      process.exit(1);
    }
    throw err;
  }

  if (parsed.help) {
    printUsage();
    return;
  }

  if (!parsed.input) {
    console.error('input is required');
    printUsage(process.stderr);
    process.exit(1);
  }

  const {
    input,
    mode,
    apiKeys,
    output,
    html,
    fossils,
    avatars,
    timeSliceMode,
    documents,
    proxy,
    torRotate,
  } = parsed;

  let searchRequest;
  try {
    searchRequest = normaliseSearchRequest({
      input,
      mode,
      fossils,
      avatars,
      timeSliceMode,
      documents,
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  if (proxy) {
    process.env.TRACER_PROXY_URL = proxy;
  }

  if (torRotate) {
    const { rotateTorCircuit } = await import('./proxyAgent.js');
    try {
      await rotateTorCircuit();
      console.log('Tor circuit rotated (NEWNYM).');
    } catch (err) {
      console.error(`Tor rotation failed: ${err.message}`);
    }
  }

  const proxyLabel = process.env.TRACER_PROXY_URL
    ? ` via ${process.env.TRACER_PROXY_URL}`
    : '';
  console.log(`Searching for: "${searchRequest.input}" (mode: ${searchRequest.mode})${proxyLabel}`);

  const { results, avatarClusters } = await run(searchRequest.input, {
    mode: searchRequest.mode,
    apiKeys,
    fossils: searchRequest.fossils,
    avatars: searchRequest.avatars,
    timeSliceMode: searchRequest.timeSliceMode,
    documents: searchRequest.documents,
  });

  console.log(`\nTotal results: ${results.length}`);
  console.log('\nTop 5 results:');
  results.slice(0, 5).forEach((r, i) => {
    const tags = (r.meta && r.meta.tags && r.meta.tags.length) ? ` [${r.meta.tags.join(',')}]` : '';
    console.log(`  ${i + 1}. [score:${r.score}${tags}] ${r.title || r.url} (${r.source})`);
  });

  if (avatarClusters && avatarClusters.length > 0) {
    console.log(`\nAvatar recurrences found: ${avatarClusters.length}`);
    avatarClusters.forEach((c, i) => {
      console.log(`  ${i + 1}. Hash ${c.avatarHash.slice(0, 8)}... reused across ${c.urls.length} results`);
    });
  }

  if (output) {
    exportJSON({ results, avatarClusters }, output);
    console.log(`\nJSON saved to: ${output}`);
  }

  if (html) {
    exportHTML(results, html, avatarClusters);
    console.log(`HTML saved to: ${html}`);
  }
}

function isDirectExecution(argv = process.argv) {
  if (!argv[1]) return false;
  return import.meta.url === pathToFileURL(argv[1]).href;
}

if (isDirectExecution()) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
