import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import express from 'express';
import { logger } from '../logger.js';
import { run } from '../orchestrator.js';
import { loadKeysFromEnv } from '../config.js';
import { buildGraph } from '../graphBuilder.js';
import { ALL_CONNECTORS, getActive } from '../connectors/registry.js';
import { createAbortError, isAbortError } from '../requestContext.js';
import { SearchValidationError, normaliseSearchRequest } from '../searchOptions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const INTERNAL_ERROR_MESSAGE = 'internal server error';
const RATE_LIMIT_WINDOW_MS = 60_000;
const SEARCH_RATE_LIMIT_MAX = 20;
const DEFAULT_ALLOWED_ORIGINS = [
  'https://potemkin666.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'null',
];

function logInternalError(context, err) {
  logger.error('server-error', {
    context,
    error: err.message,
  });
}

export function parseAllowedOrigins(value = process.env.TRACER_ALLOWED_ORIGINS) {
  if (typeof value !== 'string' || !value.trim()) {
    return [...DEFAULT_ALLOWED_ORIGINS];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function isOriginAllowed(origin, allowedOrigins) {
  if (!origin) return true;
  return allowedOrigins.includes(origin);
}

function createCorsMiddleware(allowedOrigins) {
  return (req, res, next) => {
    const origin = req.get('Origin');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Vary', 'Origin');

    if (!isOriginAllowed(origin, allowedOrigins)) {
      if (req.method === 'OPTIONS') {
        return res.status(403).json({ error: 'origin not allowed' });
      }
      return res.status(403).json({ error: 'origin not allowed' });
    }

    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    return next();
  };
}

function createRateLimiter({
  windowMs = RATE_LIMIT_WINDOW_MS,
  max = SEARCH_RATE_LIMIT_MAX,
} = {}) {
  const buckets = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket?.remoteAddress || 'unknown';
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    existing.count += 1;
    if (existing.count > max) {
      logger.warn('server-rate-limit-hit', { key, path: req.path });
      return res.status(429).json({ error: 'rate limit exceeded' });
    }

    return next();
  };
}

export function createApp({
  runImpl = run,
  buildGraphImpl = buildGraph,
  loadKeysImpl = loadKeysFromEnv,
  allConnectors = ALL_CONNECTORS,
  getActiveImpl = getActive,
  rateLimiterOptions,
  allowedOrigins = parseAllowedOrigins(),
} = {}) {
  const serverApiKeys = loadKeysImpl();
  const app = express();

  app.use(express.json());
  app.use(createCorsMiddleware(allowedOrigins));

  const docsDir = path.resolve(__dirname, '../../docs');
  const publicDir = path.join(__dirname, 'public');
  const searchRateLimiter = createRateLimiter(rateLimiterOptions);
  app.use(express.static(docsDir));
  app.use(express.static(publicDir));
  app.use(['/search', '/search/stream'], searchRateLimiter);

  app.post('/search', async (req, res) => {
    const controller = new globalThis.AbortController();
    let closed = false;
    res.on('close', () => {
      closed = true;
      controller.abort(createAbortError('client disconnected'));
    });

    try {
      const searchRequest = normaliseSearchRequest(req.body || {});
      const { results, avatarClusters, connectorStats } = await runImpl(searchRequest.input, {
        mode: searchRequest.mode,
        apiKeys: serverApiKeys,
        fossils: searchRequest.fossils,
        avatars: searchRequest.avatars,
        timeSliceMode: searchRequest.timeSliceMode,
        documents: searchRequest.documents,
        signal: controller.signal,
      });
      if (closed) return;
      const graph = buildGraphImpl(results, avatarClusters);
      res.json({ results, avatarClusters, graph, connectorStats });
    } catch (err) {
      if (closed || isAbortError(err)) return;
      if (err instanceof SearchValidationError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      logInternalError('search', err);
      res.status(500).json({ error: INTERNAL_ERROR_MESSAGE });
    }
  });

  app.get('/search/stream', async (req, res) => {
    let searchRequest;
    try {
      searchRequest = normaliseSearchRequest(req.query || {});
    } catch (err) {
      if (err instanceof SearchValidationError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      logInternalError('search-stream-parse', err);
      return res.status(400).json({ error: 'invalid request' });
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    let closed = false;
    const controller = new globalThis.AbortController();
    res.on('close', () => {
      closed = true;
      controller.abort(createAbortError('client disconnected'));
    });

    const keepAlive = setInterval(() => {
      if (!closed) res.write(': keepalive\n\n');
    }, 15000);

    function sendEvent(event, data) {
      if (!closed) res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    }

    try {
      const { results, avatarClusters, connectorStats } = await runImpl(searchRequest.input, {
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
      const graph = buildGraphImpl(results, avatarClusters);
      sendEvent('done', { results, avatarClusters, graph, connectorStats });
    } catch (err) {
      if (isAbortError(err)) return;
      logInternalError('search-stream', err);
      sendEvent('error', { error: INTERNAL_ERROR_MESSAGE });
    } finally {
      clearInterval(keepAlive);
      res.end();
    }
  });

  app.get('/engines', (req, res) => {
    const active = getActiveImpl(serverApiKeys, 'aggressive');
    res.json({ total: allConnectors.length, active: active.length });
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}

export function startServer(port = PORT, deps) {
  const app = createApp(deps);
  const server = app.listen(port, () => {
    logger.info('server-started', {
      port,
      localUi: `http://localhost:${port}`,
      engines: ALL_CONNECTORS.length,
    });
  });

  function shutdown(signal) {
    logger.info('server-shutdown-started', { signal });
    server.close(() => {
      logger.info('server-shutdown-complete');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('server-shutdown-timeout');
      process.exit(1);
    }, 10000).unref();
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  return server;
}

function isDirectExecution(argv = process.argv) {
  if (!argv[1]) return false;
  return import.meta.url === pathToFileURL(argv[1]).href;
}

const app = createApp();
export default app;

if (isDirectExecution()) {
  startServer();
}
