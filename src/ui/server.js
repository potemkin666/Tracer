import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { run } from '../orchestrator.js';
import { loadKeysFromEnv } from '../config.js';
import { buildGraph } from '../graphBuilder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load API keys once at startup from server-side environment variables.
// Client requests never supply keys — this prevents the server from being
// used as an open proxy to third-party APIs with arbitrary credentials.
const serverApiKeys = loadKeysFromEnv();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/search', async (req, res) => {
  const { input, mode, fossils, avatars, timeSliceMode, documents } = req.body || {};
  if (!input) return res.status(400).json({ error: 'input is required' });

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

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const server = app.listen(PORT, () => {
  console.log(`Tracer UI running at http://localhost:${PORT}`);
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
