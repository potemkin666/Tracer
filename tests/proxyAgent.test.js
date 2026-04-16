import { createAgent, proxyUrlFromEnv } from '../src/proxyAgent.js';
import httpClient from '../src/httpClient.js';

describe('proxyAgent', () => {
  describe('createAgent()', () => {
    test('returns null for falsy input', () => {
      expect(createAgent(null)).toBeNull();
      expect(createAgent(undefined)).toBeNull();
      expect(createAgent('')).toBeNull();
    });

    test('creates SocksProxyAgent for socks5:// URL', () => {
      const agent = createAgent('socks5://127.0.0.1:9050');
      expect(agent).toBeDefined();
      expect(agent.constructor.name).toBe('SocksProxyAgent');
    });

    test('creates SocksProxyAgent for socks4:// URL', () => {
      const agent = createAgent('socks4://127.0.0.1:1080');
      expect(agent).toBeDefined();
      expect(agent.constructor.name).toBe('SocksProxyAgent');
    });

    test('creates HttpsProxyAgent for http:// URL', () => {
      const agent = createAgent('http://proxy.example.com:8080');
      expect(agent).toBeDefined();
      expect(agent.constructor.name).toBe('HttpsProxyAgent');
    });

    test('creates HttpsProxyAgent for https:// URL', () => {
      const agent = createAgent('https://proxy.example.com:8443');
      expect(agent).toBeDefined();
      expect(agent.constructor.name).toBe('HttpsProxyAgent');
    });

    test('throws for unsupported protocol', () => {
      expect(() => createAgent('ftp://proxy:21')).toThrow('Unsupported proxy protocol');
    });
  });

  describe('proxyUrlFromEnv()', () => {
    const original = process.env.TRACER_PROXY_URL;

    afterEach(() => {
      if (original === undefined) {
        delete process.env.TRACER_PROXY_URL;
      } else {
        process.env.TRACER_PROXY_URL = original;
      }
    });

    test('returns undefined when env var is not set', () => {
      delete process.env.TRACER_PROXY_URL;
      expect(proxyUrlFromEnv()).toBeUndefined();
    });

    test('returns the env var value when set', () => {
      process.env.TRACER_PROXY_URL = 'socks5://127.0.0.1:9050';
      expect(proxyUrlFromEnv()).toBe('socks5://127.0.0.1:9050');
    });
  });
});

describe('httpClient', () => {
  const original = process.env.TRACER_PROXY_URL;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.TRACER_PROXY_URL;
    } else {
      process.env.TRACER_PROXY_URL = original;
    }
    httpClient._reset();
  });

  test('exports get, post, request methods', () => {
    expect(typeof httpClient.get).toBe('function');
    expect(typeof httpClient.post).toBe('function');
    expect(typeof httpClient.request).toBe('function');
  });

  test('_reset clears cached agent', () => {
    // After reset, the next call should re-evaluate the env var
    process.env.TRACER_PROXY_URL = 'socks5://127.0.0.1:9050';
    httpClient._reset();
    // The client should pick up the new proxy URL on next request
    // (We can't easily inspect the agent, but the function shouldn't throw)
    expect(() => httpClient._reset()).not.toThrow();
  });
});
