import { jest } from '@jest/globals';
import { once } from 'events';
import { createApp } from '../src/ui/server.js';

async function withServer(app, run) {
  const server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address();

  try {
    return await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function readJson(response) {
  return response.json();
}

describe('ui server', () => {
  test('GET /health returns ok', async () => {
    await withServer(createApp(), async (baseUrl) => {
      const response = await globalThis.fetch(`${baseUrl}/health`);
      expect(response.status).toBe(200);
      await expect(readJson(response)).resolves.toEqual({ status: 'ok' });
    });
  });

  test('GET /engines reports total and active counts', async () => {
    const app = createApp({
      loadKeysImpl: () => ({ brave: 'key' }),
      allConnectors: [{ id: 'one' }, { id: 'two' }, { id: 'three' }],
      getActiveImpl: () => [{ id: 'one' }, { id: 'two' }],
    });

    await withServer(app, async (baseUrl) => {
      const response = await globalThis.fetch(`${baseUrl}/engines`);
      expect(response.status).toBe(200);
      await expect(readJson(response)).resolves.toEqual({ total: 3, active: 2 });
    });
  });

  test('POST /search returns results, graph, and connector stats', async () => {
    const runImpl = jest.fn(async () => ({
      results: [{ url: 'https://example.com', title: 'Example', source: 'demo' }],
      avatarClusters: [{ avatarHash: 'abc', urls: ['https://example.com'] }],
      connectorStats: [{ id: 'demo', ok: true, count: 1 }],
    }));
    const buildGraphImpl = jest.fn(() => ({ nodes: [{ id: 'https://example.com' }], edges: [] }));
    const app = createApp({ runImpl, buildGraphImpl });

    await withServer(app, async (baseUrl) => {
      const response = await globalThis.fetch(`${baseUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: 'alice', fossils: 'true' }),
      });
      expect(response.status).toBe(200);
      await expect(readJson(response)).resolves.toEqual({
        results: [{ url: 'https://example.com', title: 'Example', source: 'demo' }],
        avatarClusters: [{ avatarHash: 'abc', urls: ['https://example.com'] }],
        graph: { nodes: [{ id: 'https://example.com' }], edges: [] },
        connectorStats: [{ id: 'demo', ok: true, count: 1 }],
      });
      expect(runImpl).toHaveBeenCalledWith('alice', expect.objectContaining({ fossils: true }));
    });
  });

  test('POST /search sanitizes internal errors', async () => {
    const app = createApp({
      runImpl: async () => {
        throw new Error('sensitive stack detail');
      },
    });

    await withServer(app, async (baseUrl) => {
      const response = await globalThis.fetch(`${baseUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: 'alice' }),
      });
      expect(response.status).toBe(500);
      await expect(readJson(response)).resolves.toEqual({ error: 'internal server error' });
    });
  });

  test('GET /search/stream emits progress and done events', async () => {
    const app = createApp({
      runImpl: async (_input, options) => {
        options.onProgress({ phase: 'connectors', connector: 'demo', resultsSoFar: 2 });
        return {
          results: [{ url: 'https://example.com', title: 'Example', source: 'demo' }],
          avatarClusters: [],
          connectorStats: [{ id: 'demo', ok: true, count: 1 }],
        };
      },
      buildGraphImpl: () => ({ nodes: [], edges: [] }),
    });

    await withServer(app, async (baseUrl) => {
      const response = await globalThis.fetch(`${baseUrl}/search/stream?input=alice`);
      const text = await response.text();
      expect(response.status).toBe(200);
      expect(text).toContain('event: progress');
      expect(text).toContain('"connector":"demo"');
      expect(text).toContain('event: done');
      expect(text).toContain('"graph":{"nodes":[],"edges":[]}');
    });
  });

  test('GET /search/stream sanitizes internal errors', async () => {
    const app = createApp({
      runImpl: async () => {
        throw new Error('top secret failure');
      },
    });

    await withServer(app, async (baseUrl) => {
      const response = await globalThis.fetch(`${baseUrl}/search/stream?input=alice`);
      const text = await response.text();
      expect(response.status).toBe(200);
      expect(text).toContain('event: error');
      expect(text).toContain('internal server error');
      expect(text).not.toContain('top secret failure');
    });
  });

  test('rate limits repeated search requests', async () => {
    const app = createApp({
      runImpl: async () => ({ results: [], avatarClusters: [], connectorStats: [] }),
      rateLimiterOptions: { windowMs: 60_000, max: 1 },
    });

    await withServer(app, async (baseUrl) => {
      const first = await globalThis.fetch(`${baseUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: 'alice' }),
      });
      const second = await globalThis.fetch(`${baseUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: 'alice' }),
      });

      expect(first.status).toBe(200);
      expect(second.status).toBe(429);
      await expect(readJson(second)).resolves.toEqual({ error: 'rate limit exceeded' });
    });
  });
});
