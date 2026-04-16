# Tracer

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

```bash
node src/index.js "john smith" \
  --mode normal \
  --brave-key YOUR_KEY \
  --serpapi-key YOUR_KEY \
  --mojeek-key YOUR_KEY \
  --output results.json \
  --html report.html
```

### Options

| Flag | Description |
|------|-------------|
| `--mode` | `normal` (3 queries) or `aggressive` (all queries) |
| `--brave-key` | Brave Search API key |
| `--serpapi-key` | SerpAPI key |
| `--mojeek-key` | Mojeek API key |
| `--output` | Path to save JSON results |
| `--html` | Path to save HTML report |

## Web UI

```bash
npm run serve
# Open http://localhost:3000
```

## Tests

```bash
npm test
```
