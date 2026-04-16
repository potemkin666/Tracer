import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { run } from '../orchestrator.js';
import { loadKeysFromEnv } from '../config.js';
import { buildGraph } from '../graphBuilder.js';
import { ALL_CONNECTORS, getActive } from '../connectors/registry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load API keys once at startup from server-side environment variables.
// Client requests never supply keys — this prevents the server from being
// used as an open proxy to third-party APIs with arbitrary credentials.
const serverApiKeys = loadKeysFromEnv();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allow the GitHub Pages frontend (and any local file:// or localhost origin)
// to reach this server.  Without this, browsers block cross-origin requests
// from potemkin666.github.io → localhost:3000.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Serve the full ocean-themed UI (docs/) as the local web interface, with
// the basic UI (public/) as a fallback if docs/ is missing.
const docsDir = path.resolve(__dirname, '../../docs');
const publicDir = path.join(__dirname, 'public');
app.use(express.static(docsDir));
app.use(express.static(publicDir));

app.post('/search', async (req, res) => {
  const { input, mode, fossils, avatars, timeSliceMode, documents } = req.body || {};
  if (!input) {
    return res.status(400).json({ error: 'input is required' });
  }

  try {
    const { results, avatarClusters } = await run(input, {
      mode,
      apiKeys: serverApiKeys,
      fossils,
      avatars,
      timeSliceMode,
      documents,
    });
    const graph = buildGraph(results, avatarClusters);
    res.json({ results, avatarClusters, graph });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── /engines ─────────────────────────────────────────────────────────────────
// Returns the total connector count and how many are active for "normal" mode.
// The GitHub Pages frontend calls this to display the engine count bar.
app.get('/engines', (req, res) => {
  const active = getActive(serverApiKeys, 'aggressive');
  res.json({ total: ALL_CONNECTORS.length, active: active.length });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const server = app.listen(PORT, () => {
  console.log(`Tracer server listening on port ${PORT}`);
  console.log(`  Local UI:  http://localhost:${PORT}`);
  console.log(`  Engines:   ${ALL_CONNECTORS.length} total`);
});

// Graceful shutdown: stop accepting new connections, let in-flight requests
// finish (up to 10 s), then exit.
function shutdown(signal) {
  console.log(`\n${signal} received — shutting down gracefully…`);
  server.close(() => {
    console.log('All connections closed.');
    process.exit(0);
  });

  // Force-exit if lingering connections don't drain in time.
  setTimeout(() => {
    console.error('Forcibly shutting down after timeout.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
