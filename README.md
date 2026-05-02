# Tracer

**[🌊 Launch Tracer Web UI](https://potemkin666.github.io/Tracer/)** — search directly from your browser, no install needed.

A Node.js-based identity search tool that automates multi-source discovery for names, usernames, and aliases. It replaces manual workflows (Google dorks, multiple engines, archive checks) with a single orchestrated pipeline.

## Features

- Generates multiple query variants (site-specific, archive, username formats)
- Searches via Brave, SerpAPI, and Mojeek (API keys required)
- Always checks Wayback Machine and common social platforms (namechk)
- Deduplicates and scores results by relevance
- Exports to JSON and HTML report

## Install

```bash
npm install
```

## Usage

API keys are loaded from environment variables or a JSON config file.
**Never pass keys as CLI arguments** — they would be visible in `ps`,
`/proc`, and shell history.

```bash
# Set keys via environment
export TRACER_BRAVE_KEY=your_key
export TRACER_SERPAPI_KEY=your_key

node src/index.js "john smith" \
  --mode normal \
  --output results.json \
  --html report.html
```

Or use a config file:

```bash
node src/index.js "john smith" --config keys.json --output results.json
```

### Options

| Flag | Description |
|------|-------------|
| `--mode` | `normal` (3 queries) or `aggressive` (all queries) |
| `--config` | Path to JSON file with API keys |
| `--output` | Path to save JSON results |
| `--html` | Path to save HTML report |
| `--fossils` | Enable fossil hunting |
| `--avatars` | Enable avatar clustering |
| `--time-slice` | Enable time-slice search |
| `--documents` | Enable document search |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `TRACER_BRAVE_KEY` | Brave Search API key |
| `TRACER_SERPAPI_KEY` | SerpAPI key |
| `TRACER_MOJEEK_KEY` | Mojeek API key |
| `TRACER_KAGI_KEY` | Kagi API key |
| `TRACER_BING_KEY` | Bing Search API key |
| `TRACER_GOOGLE_KEY` | Google Custom Search key |
| `TRACER_GOOGLE_CX` | Google Custom Search CX |
| `TRACER_METAGER_KEY` | MetaGer API key |
| `TRACER_SWISSCOWS_KEY` | Swisscows API key |
| `TRACER_SHODAN_KEY` | Shodan API key |
| `TRACER_CENSYS_ID` | Censys API ID |
| `TRACER_CENSYS_SECRET` | Censys API secret |
| `TRACER_HUNTER_KEY` | Hunter.io API key |
| `TRACER_INTELX_KEY` | IntelX API key |
| `TRACER_PUBLICWWW_KEY` | PublicWWW API key |
| `TRACER_LISTENNOTES_KEY` | ListenNotes API key |
| `TRACER_YANDEX_KEY` | Yandex XML user:key |
| `TRACER_NAVER_CLIENT_ID` | Naver client ID |
| `TRACER_NAVER_CLIENT_SECRET` | Naver client secret |
| `TRACER_SEARXNG_URL` | SearXNG instance URL |
| `TRACER_WOLFRAMALPHA_KEY` | Wolfram Alpha API key |
| `TRACER_NETLAS_KEY` | Netlas API key |
| `TRACER_EXA_KEY` | Exa AI API key |
| `TRACER_PERPLEXITY_KEY` | Perplexity AI API key |
| `TRACER_TINEYE_KEY` | TinEye API key |

## Web UI

```bash
npm run serve
# Open http://localhost:3000
```

## Portable / external-drive use

- **Fastest no-install option:** double-click `index.html` after copying the repo to the drive. Tracer will open in **portable standalone mode** and run directly from the browser with the built-in open APIs.
- **Easiest full local-server option:** use the launcher in the repo root:
  - Windows: `Start Tracer.bat`
  - macOS: `Start Tracer.command`
- The launchers try to:
  1. use your local Node.js install if it exists,
  2. run `npm install` automatically the first time,
  3. start the local server,
  4. open `http://localhost:3000` in your browser,
  5. fall back to standalone browser mode if Node.js is missing.
- For the full local-server experience on a new machine, install **Node.js 18+** once. After that, people can just double-click the launcher from the external drive.

## Tests

```bash
npm test
```
