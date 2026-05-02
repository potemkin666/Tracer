import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { run } from '../orchestrator.js';
import { loadKeysFromEnv } from '../config.js';
import { buildGraph } from '../graphBuilder.js';
import { ALL_CONNECTORS, getActive } from '../connectors/registry.js';
import { createAbortError, isAbortError } from '../requestContext.js';
import { SearchValidationError, normaliseSearchRequest } from '../searchOptions.js';

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
  const controller = new AbortController();
  let closed = false;
  res.on('close', () => {
    closed = true;
    controller.abort(createAbortError('client disconnected'));
  });

  try {
    const searchRequest = normaliseSearchRequest(req.body || {});
    const { results, avatarClusters, connectorStats } = await run(searchRequest.input, {
      mode: searchRequest.mode,
      apiKeys: serverApiKeys,
      fossils: searchRequest.fossils,
      avatars: searchRequest.avatars,
      timeSliceMode: searchRequest.timeSliceMode,
      documents: searchRequest.documents,
      signal: controller.signal,
    });
    if (closed) return;
    const graph = buildGraph(results, avatarClusters);
    res.json({ results, avatarClusters, graph, connectorStats });
  } catch (err) {
    if (closed || isAbortError(err)) return;
    if (err instanceof SearchValidationError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// ── /search/stream — Server-Sent Events streaming endpoint ───────────────────
// Allows the UI to receive real-time progress as each connector completes,
// instead of waiting 30+ seconds for the full pipeline.
//
// Usage:  const es = new EventSource('/search/stream?input=john+smith&mode=normal');
//         es.addEventListener('progress', (e) => { ... });
//         es.addEventListener('done', (e) => { es.close(); ... });
app.get('/search/stream', async (req, res) => {
  let searchRequest;
  try {
    searchRequest = normaliseSearchRequest(req.query || {});
  } catch (err) {
    if (err instanceof SearchValidationError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    return res.status(400).json({ error: err.message });
  }

  // SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // Guard against writing to a closed connection (client navigates away, etc.)
  let closed = false;
  const controller = new AbortController();
  res.on('close', () => {
    closed = true;
    controller.abort(createAbortError('client disconnected'));
  });

  // Keep connection alive
  const keepAlive = setInterval(() => {
    if (!closed) res.write(': keepalive\n\n');
  }, 15000);

  function sendEvent(event, data) {
    if (!closed) res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }

  try {
    const { results, avatarClusters, connectorStats } = await run(searchRequest.input, {
      mode: searchRequest.mode,
      apiKeys: serverApiKeys,
      fossils: searchRequest.fossils,
      avatars: searchRequest.avatars,
      timeSliceMode: searchRequest.timeSliceMode,
      documents: searchRequest.documents,
      signal: controller.signal,
      onProgress: (info) => {
        sendEvent('progress', info);
      },
    });
    const graph = buildGraph(results, avatarClusters);
    sendEvent('done', { results, avatarClusters, graph, connectorStats });
  } catch (err) {
    if (isAbortError(err)) return;
    sendEvent('error', { error: err.message });
  } finally {
    clearInterval(keepAlive);
    res.end();
  }
});

// ── /engines ─────────────────────────────────────────────────────────────────
// Returns the total connector count and how many are active with current keys.
// Uses 'aggressive' mode to report the maximum engine count.
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
