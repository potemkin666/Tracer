/**
 * Proxy agent factory — creates Node.js http.Agent instances for
 * SOCKS5, SOCKS4, HTTP, and HTTPS proxies.
 *
 * Configuration is read from environment variables or passed directly:
 *   TRACER_PROXY_URL – full proxy URL, e.g.
 *       socks5://127.0.0.1:9050           (Tor default)
 *       socks5://user:pass@proxy:1080
 *       http://proxy:8080
 *       https://proxy:8443
 *
 * For Tor circuit rotation the module can send a NEWNYM signal to the
 * Tor control port (default 9051) if TRACER_TOR_CONTROL_PORT and
 * TRACER_TOR_CONTROL_PASSWORD are set.
 */

import net from 'net';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';

/**
 * Parse a proxy URL string and return the appropriate http.Agent.
 *
 * @param {string} proxyUrl – full proxy URL (socks5://, socks4://, http://, https://)
 * @returns {import('http').Agent | null}
 */
export function createAgent(proxyUrl) {
  if (!proxyUrl) {
    return null;
  }

  const lower = proxyUrl.toLowerCase();

  if (lower.startsWith('socks5://') || lower.startsWith('socks4://') || lower.startsWith('socks://')) {
    return new SocksProxyAgent(proxyUrl);
  }

  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    return new HttpsProxyAgent(proxyUrl);
  }

  throw new Error(`Unsupported proxy protocol in URL: ${proxyUrl}`);
}

/**
 * Read the proxy URL from environment variables.
 *
 * @returns {string|undefined}
 */
export function proxyUrlFromEnv() {
  return process.env.TRACER_PROXY_URL || undefined;
}

/**
 * Request a new Tor circuit (NEWNYM) via the Tor control protocol.
 *
 * Requires:
 *   TRACER_TOR_CONTROL_PORT – control port (default 9051)
 *   TRACER_TOR_CONTROL_PASSWORD – plaintext password for AUTHENTICATE
 *
 * @param {object} [opts]
 * @param {string} [opts.host]     – control host (default '127.0.0.1')
 * @param {number} [opts.port]     – control port (default from env or 9051)
 * @param {string} [opts.password] – control password (default from env)
 * @returns {Promise<void>}
 */
export function rotateTorCircuit(opts = {}) {
  const host = opts.host || '127.0.0.1';
  const port = opts.port || Number(process.env.TRACER_TOR_CONTROL_PORT) || 9051;
  const password = opts.password || process.env.TRACER_TOR_CONTROL_PASSWORD || '';

  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port }, () => {
      let buf = '';
      socket.on('data', (chunk) => {
        buf += chunk.toString();
        // Wait until we see the response to SIGNAL NEWNYM
        if (buf.includes('250 OK') && buf.includes('250 OK\r\n')) {
          socket.end();
          resolve();
        }
        if (buf.includes('515') || buf.includes('550')) {
          socket.end();
          reject(new Error(`Tor control error: ${buf.trim()}`));
        }
      });

      // Authenticate then request new identity
      socket.write(`AUTHENTICATE "${password}"\r\n`);
      socket.write('SIGNAL NEWNYM\r\n');
    });

    socket.on('error', (err) => {
      reject(new Error(`Tor control connection failed: ${err.message}`));
    });

    // Timeout the entire handshake
    socket.setTimeout(5000, () => {
      socket.destroy();
      reject(new Error('Tor control connection timed out'));
    });
  });
}
