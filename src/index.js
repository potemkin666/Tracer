const { run } = require('./orchestrator');
const { exportJSON, exportHTML } = require('./exporter');

function parseArgs(argv) {
  const args = argv.slice(2);
  const result = { apiKeys: {} };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
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
      case '--output':
        result.output = args[++i];
        break;
      case '--html':
        result.html = args[++i];
        break;
      default:
        if (!args[i].startsWith('--')) result.input = args[i];
    }
  }

  return result;
}

async function main() {
  const { input, mode, apiKeys, output, html } = parseArgs(process.argv);

  if (!input) {
    console.error('Usage: node src/index.js <input> [--mode normal|aggressive] [--brave-key KEY] [--serpapi-key KEY] [--mojeek-key KEY] [--output results.json] [--html report.html]');
    process.exit(1);
  }

  console.log(`Searching for: "${input}" (mode: ${mode || 'normal'})`);

  const results = await run(input, { mode, apiKeys });

  console.log(`\nTotal results: ${results.length}`);
  console.log('\nTop 5 results:');
  results.slice(0, 5).forEach((r, i) => {
    console.log(`  ${i + 1}. [${r.score}] ${r.title || r.url} (${r.source})`);
  });

  if (output) {
    exportJSON(results, output);
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
