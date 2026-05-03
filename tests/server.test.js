import { jest } from '@jest/globals';
import { once } from 'events';
import { createApp, parseAllowedOrigins } from '../src/ui/server.js';

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
  test('parseAllowedOrigins falls back to defaults and supports custom lists', () => {
    expect(parseAllowedOrigins()).toContain('https://potemkin666.github.io');
    expect(parseAllowedOrigins('https://a.test, https://b.test')).toEqual([
      'https://a.test',
      'https://b.test',
    ]);
  });

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
    const telemetry = {
      searches: 1,
      outcomes: { highConfidence: 1, weakOnly: 0, empty: 0 },
      feedback: { helpful: 0, falsePositive: 0 },
      topFamilies: [],
      topConnectors: [],
      lastUpdatedAt: '2026-05-03T10:00:00.000Z',
    };
    const runImpl = jest.fn(async () => ({
      results: [{ url: 'https://example.com', title: 'Example', source: 'demo' }],
      avatarClusters: [{ avatarHash: 'abc', urls: ['https://example.com'] }],
      connectorStats: [{ id: 'demo', ok: true, count: 1 }],
    }));
    const buildGraphImpl = jest.fn(() => ({ nodes: [{ id: 'https://example.com' }], edges: [] }));
    const telemetryStore = {
      recordSearch: jest.fn(() => telemetry),
      getSummary: jest.fn(() => telemetry),
      recordFeedback: jest.fn(() => telemetry),
    };
    const app = createApp({ runImpl, buildGraphImpl, telemetryStore });

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
        telemetry,
        searchNarrative: {
          headline: '1 result survived because multiple weak traces still lined up.',
          details: [
            'Most productive connectors: demo (1).',
            'No direct page inspection evidence surfaced.',
            'Archive expansion did not drive this result set.',
          ],
          status: 'ok',
        },
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
    const telemetryStore = {
      recordSearch: jest.fn(() => ({
        searches: 1,
        outcomes: { highConfidence: 1, weakOnly: 0, empty: 0 },
        feedback: { helpful: 0, falsePositive: 0 },
        topFamilies: [],
        topConnectors: [],
        lastUpdatedAt: '2026-05-03T10:00:00.000Z',
      })),
      getSummary: jest.fn(() => ({})),
      recordFeedback: jest.fn(() => ({})),
    };
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
      telemetryStore,
    });

    await withServer(app, async (baseUrl) => {
      const response = await globalThis.fetch(`${baseUrl}/search/stream?input=alice`);
      const text = await response.text();
      expect(response.status).toBe(200);
      expect(text).toContain('event: progress');
      expect(text).toContain('"connector":"demo"');
      expect(text).toContain('event: done');
      expect(text).toContain('"graph":{"nodes":[],"edges":[]}');
      expect(text).toContain('"searchNarrative"');
    });
  });

  test('GET /telemetry returns the current summary and feedback updates it', async () => {
    const telemetry = {
      searches: 2,
      outcomes: { highConfidence: 1, weakOnly: 1, empty: 0 },
      feedback: { helpful: 0, falsePositive: 0 },
      topFamilies: [{ family: 'social', wins: 1, falsePositives: 0, helpful: 0 }],
      topConnectors: [],
      lastUpdatedAt: '2026-05-03T10:00:00.000Z',
    };
    const updated = {
      ...telemetry,
      feedback: { helpful: 1, falsePositive: 0 },
      topFamilies: [{ family: 'social', wins: 1, falsePositives: 0, helpful: 1 }],
    };
    const telemetryStore = {
      recordSearch: jest.fn(() => telemetry),
      getSummary: jest.fn(() => telemetry),
      recordFeedback: jest.fn(() => updated),
    };
    const app = createApp({ telemetryStore });

    await withServer(app, async (baseUrl) => {
      const summary = await globalThis.fetch(`${baseUrl}/telemetry`);
      expect(summary.status).toBe(200);
      await expect(readJson(summary)).resolves.toEqual(telemetry);

      const feedback = await globalThis.fetch(`${baseUrl}/telemetry/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ family: 'social', verdict: 'helpful' }),
      });
      expect(feedback.status).toBe(200);
      await expect(readJson(feedback)).resolves.toEqual(updated);
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

  test('reflects allowed origins and blocks disallowed origins', async () => {
    const app = createApp({
      allowedOrigins: ['https://potemkin666.github.io'],
      runImpl: async () => ({ results: [], avatarClusters: [], connectorStats: [] }),
    });

    await withServer(app, async (baseUrl) => {
      const allowed = await globalThis.fetch(`${baseUrl}/health`, {
        headers: { Origin: 'https://potemkin666.github.io' },
      });
      const blocked = await globalThis.fetch(`${baseUrl}/health`, {
        headers: { Origin: 'https://evil.example' },
      });

      expect(allowed.headers.get('access-control-allow-origin')).toBe('https://potemkin666.github.io');
      expect(blocked.status).toBe(403);
      await expect(readJson(blocked)).resolves.toEqual({ error: 'origin not allowed' });
    });
  });

  test('caches repeated POST /search responses for the same request', async () => {
    const runImpl = jest.fn(async () => ({
      results: [{ url: 'https://example.com', title: 'Example', source: 'demo' }],
      avatarClusters: [],
      connectorStats: [],
    }));
    const app = createApp({ runImpl, buildGraphImpl: () => ({ nodes: [], edges: [] }) });

    await withServer(app, async (baseUrl) => {
      const payload = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: 'alice', mode: 'aggressive' }),
      };
      const first = await globalThis.fetch(`${baseUrl}/search`, payload);
      const second = await globalThis.fetch(`${baseUrl}/search`, payload);

      expect(first.status).toBe(200);
      expect(second.status).toBe(200);
      expect(runImpl).toHaveBeenCalledTimes(1);
    });
  });

  test('GET /snapshot returns archive metadata and /snapshot/view renders html', async () => {
    const snapshotLookupImpl = jest.fn(async (url) => ({
      url,
      archiveUrl: 'https://web.archive.org/web/20240101000000/https://example.com',
      archiveTimestamp: '20240101000000',
      pageStatus: 'dead',
    }));
    const app = createApp({ snapshotLookupImpl });

    await withServer(app, async (baseUrl) => {
      const snapshot = await globalThis.fetch(`${baseUrl}/snapshot?url=${encodeURIComponent('https://example.com')}`);
      expect(snapshot.status).toBe(200);
      await expect(readJson(snapshot)).resolves.toEqual({
        url: 'https://example.com',
        archiveUrl: 'https://web.archive.org/web/20240101000000/https://example.com',
        archiveTimestamp: '20240101000000',
        pageStatus: 'dead',
      });

      const view = await globalThis.fetch(`${baseUrl}/snapshot/view?url=${encodeURIComponent('https://example.com')}`);
      const html = await view.text();
      expect(view.status).toBe(200);
      expect(html).toContain('Snapshot viewer');
      expect(html).toContain('web.archive.org');
    });
  });
});
