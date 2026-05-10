/**
 * Shared constants and utilities for connectors.
 */

import { logger } from '../logger.js';

// Standard user-agent string used across connectors
export const DEFAULT_USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// Default HTTP timeout for connector requests (milliseconds)
export const DEFAULT_TIMEOUT = 10000;

/**
 * Convert a relative URL to an absolute URL using the provided base URL.
 * If the URL is already absolute, returns it unchanged.
 *
 * @param {string} url - The URL to convert (may be relative or absolute)
 * @param {string} baseUrl - The base URL to use for relative URLs
 * @returns {string} The absolute URL
 *
 * @example
 * makeAbsoluteUrl('/path', 'https://example.com') // => 'https://example.com/path'
 * makeAbsoluteUrl('https://other.com/path', 'https://example.com') // => 'https://other.com/path'
 */
export function makeAbsoluteUrl(url, baseUrl) {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Handle protocol-relative URLs
  if (url.startsWith('//')) {
    return 'https:' + url;
  }
  // Ensure baseUrl ends without trailing slash and url starts with slash
  const base = baseUrl.replace(/\/$/, '');
  const path = url.startsWith('/') ? url : '/' + url;
  return base + path;
}

/**
 * Log a connector error using the shared logger.
 *
 * @param {string} connectorId - The connector identifier (e.g., 'brave', 'hathitrust')
 * @param {Error|string} error - The error object or message
 */
export function logConnectorError(connectorId, error) {
  const message = error instanceof Error ? error.message : String(error);
  logger.error('connector-error', {
    connector: connectorId,
    error: message,
  });
}
