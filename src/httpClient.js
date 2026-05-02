/**
 * Proxy-aware HTTP client.
 *
 * Wraps axios so that every request automatically uses the proxy agent
 * when TRACER_PROXY_URL is set.  Connectors call `httpClient.get()`
 * (or `.post()`, `.request()`) exactly like they would call `axios.*`.
 *
 * Usage:
 *   import httpClient from '../httpClient.js';
 *   const res = await httpClient.get('https://example.com', { timeout: 5000 });
 */

import axios from 'axios';
import { createAgent, proxyUrlFromEnv } from './proxyAgent.js';
import { getRequestSignal } from './requestContext.js';

let _agent = null;
let _initialised = false;

/**
 * Lazily resolve the proxy agent once, then reuse it.
 */
function getAgent() {
  if (!_initialised) {
    const url = proxyUrlFromEnv();
    _agent = url ? createAgent(url) : null;
    _initialised = true;
  }
  return _agent;
}

/**
 * Inject the proxy agent into an axios config object if a proxy is configured.
 *
 * @param {object} [config]
 * @returns {object}
 */
function withProxy(config = {}) {
  const agent = getAgent();
  const signal = config.signal || getRequestSignal();
  const withSignal = signal ? { ...config, signal } : config;
  if (agent) {
    return {
      ...withSignal,
      httpAgent: agent,
      httpsAgent: agent,
      // Disable axios's own proxy handling — we use the agent instead
      proxy: false,
    };
  }
  return withSignal;
}

/**
 * A thin wrapper around axios that injects the proxy agent.
 * Exposes `.get()`, `.post()`, and `.request()` with the same signature.
 */
const httpClient = {
  get(url, config) {
    return axios.get(url, withProxy(config));
  },

  post(url, data, config) {
    return axios.post(url, data, withProxy(config));
  },

  request(config) {
    return axios.request(withProxy(config));
  },

  /**
   * Reset the cached agent — mainly useful for testing.
   */
  _reset() {
    _agent = null;
    _initialised = false;
  },
};

export default httpClient;
