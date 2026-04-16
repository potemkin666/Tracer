const { run } = require('./orchestrator');
const { exportJSON, exportHTML } = require('./exporter');
const { loadKeysFromEnv } = require('./config');
const fs = require('fs');

function parseArgs(argv) {
  const args = argv.slice(2);
  const result = { apiKeys: {} };

  // Load API keys from environment variables first (safe default).
  Object.assign(result.apiKeys, loadKeysFromEnv());

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--config': {
        const configPath = args[++i];
        try {
          const loaded = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          Object.assign(result.apiKeys, loaded);
        } catch (e) {
          console.error(`Failed to load config: ${e.message}`);
        }
        break;
      }
      case '--mode':
        result.mode = args[++i];
        break;
      case '--output':
        result.output = args[++i];
        break;
      case '--html':
        result.html = args[++i];
        break;
      case '--fossils':
        result.fossils = true;
        break;
      case '--avatars':
        result.avatars = true;
        break;
      case '--time-slice':
        result.timeSliceMode = true;
        break;
      case '--documents':
        result.documents = true;
        break;
      default:
        if (!args[i].startsWith('--')) result.input = args[i];
    }
  }

  return result;
}

async function main() {
  const { input, mode, apiKeys, output, html, fossils, avatars, timeSliceMode, documents } =
    parseArgs(process.argv);

  if (!input) {
    console.error(
      'Usage: node src/index.js <input> [--mode normal|aggressive]\n' +
        '  --config <path>          Load API keys from JSON file\n' +
        '  --output results.json    Save JSON output\n' +
        '  --html report.html       Save HTML report\n' +
        '  --fossils                Enable fossil hunting\n' +
        '  --avatars                Enable avatar clustering\n' +
        '  --time-slice             Enable time-slice search\n' +
        '  --documents              Enable document search\n' +
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
        '  TRACER_TINEYE_KEY         TinEye API key'
    );
    process.exit(1);
  }

  console.log(`Searching for: "${input}" (mode: ${mode || 'normal'})`);

  const { results, avatarClusters } = await run(input, {
    mode,
    apiKeys,
    fossils,
    avatars,
    timeSliceMode,
    documents,
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
    exportHTML(results, html);
    console.log(`HTML saved to: ${html}`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
