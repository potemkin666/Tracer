const { run } = require('./orchestrator');
const { exportJSON, exportHTML } = require('./exporter');
const fs = require('fs');

function parseArgs(argv) {
  const args = argv.slice(2);
  const result = { apiKeys: {} };

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
      case '--brave-key':
        result.apiKeys.brave = args[++i];
        break;
      case '--serpapi-key':
        result.apiKeys.serpapi = args[++i];
        break;
      case '--mojeek-key':
        result.apiKeys.mojeek = args[++i];
        break;
      case '--kagi-key':
        result.apiKeys.kagi = args[++i];
        break;
      case '--bing-key':
        result.apiKeys.bing = args[++i];
        break;
      case '--google-key':
        result.apiKeys.google = args[++i];
        break;
      case '--google-cx':
        result.apiKeys.googleCx = args[++i];
        break;
      case '--metager-key':
        result.apiKeys.metager = args[++i];
        break;
      case '--swisscows-key':
        result.apiKeys.swisscows = args[++i];
        break;
      case '--shodan-key':
        result.apiKeys.shodan = args[++i];
        break;
      case '--censys-id':
        result.apiKeys.censysId = args[++i];
        break;
      case '--censys-secret':
        result.apiKeys.censysSecret = args[++i];
        break;
      case '--hunter-key':
        result.apiKeys.hunter = args[++i];
        break;
      case '--intelx-key':
        result.apiKeys.intelx = args[++i];
        break;
      case '--publicwww-key':
        result.apiKeys.publicwww = args[++i];
        break;
      case '--listennotes-key':
        result.apiKeys.listennotes = args[++i];
        break;
      case '--yandex-key':
        result.apiKeys.yandex = args[++i];
        break;
      case '--naver-client-id':
        result.apiKeys.naverClientId = args[++i];
        break;
      case '--naver-client-secret':
        result.apiKeys.naverClientSecret = args[++i];
        break;
      case '--searxng-url':
        result.apiKeys.searxngUrl = args[++i];
        break;
      case '--wolframalpha-key':
        result.apiKeys.wolframalpha = args[++i];
        break;
      case '--netlas-key':
        result.apiKeys.netlas = args[++i];
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
        '  --brave-key KEY          Brave Search API key\n' +
        '  --serpapi-key KEY        SerpAPI key\n' +
        '  --mojeek-key KEY         Mojeek API key\n' +
        '  --kagi-key KEY           Kagi API key\n' +
        '  --bing-key KEY           Bing Search API key\n' +
        '  --google-key KEY         Google Custom Search key\n' +
        '  --google-cx CX           Google Custom Search CX\n' +
        '  --metager-key KEY        MetaGer API key\n' +
        '  --swisscows-key KEY      Swisscows API key\n' +
        '  --shodan-key KEY         Shodan API key\n' +
        '  --censys-id ID           Censys API ID\n' +
        '  --censys-secret SECRET   Censys API secret\n' +
        '  --hunter-key KEY         Hunter.io API key\n' +
        '  --intelx-key KEY         IntelX API key\n' +
        '  --publicwww-key KEY      PublicWWW API key\n' +
        '  --listennotes-key KEY    ListenNotes API key\n' +
        '  --yandex-key USER:KEY    Yandex XML user:key\n' +
        '  --naver-client-id ID     Naver client ID\n' +
        '  --naver-client-secret S  Naver client secret\n' +
        '  --searxng-url URL        SearXNG instance URL\n' +
        '  --wolframalpha-key KEY   Wolfram Alpha API key\n' +
        '  --netlas-key KEY         Netlas API key\n' +
        '  --output results.json    Save JSON output\n' +
        '  --html report.html       Save HTML report\n' +
        '  --fossils                Enable fossil hunting\n' +
        '  --avatars                Enable avatar clustering\n' +
        '  --time-slice             Enable time-slice search\n' +
        '  --documents              Enable document search'
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
