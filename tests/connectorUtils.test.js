import {
  DEFAULT_USER_AGENT,
  DEFAULT_TIMEOUT,
  makeAbsoluteUrl,
  logConnectorError,
} from '../src/connectors/connectorUtils.js';

describe('connectorUtils', () => {
  describe('constants', () => {
    test('DEFAULT_USER_AGENT is defined', () => {
      expect(typeof DEFAULT_USER_AGENT).toBe('string');
      expect(DEFAULT_USER_AGENT).toContain('Mozilla');
    });

    test('DEFAULT_TIMEOUT is a reasonable number', () => {
      expect(typeof DEFAULT_TIMEOUT).toBe('number');
      expect(DEFAULT_TIMEOUT).toBe(10000);
    });
  });

  describe('makeAbsoluteUrl', () => {
    test('returns absolute URLs unchanged', () => {
      expect(makeAbsoluteUrl('https://example.com/path', 'https://base.com')).toBe('https://example.com/path');
      expect(makeAbsoluteUrl('http://example.com/path', 'https://base.com')).toBe('http://example.com/path');
    });

    test('converts relative URLs to absolute', () => {
      expect(makeAbsoluteUrl('/path', 'https://example.com')).toBe('https://example.com/path');
      expect(makeAbsoluteUrl('/path', 'https://example.com/')).toBe('https://example.com/path');
      expect(makeAbsoluteUrl('path', 'https://example.com')).toBe('https://example.com/path');
    });

    test('handles protocol-relative URLs', () => {
      expect(makeAbsoluteUrl('//example.com/path', 'https://base.com')).toBe('https://example.com/path');
    });

    test('returns empty string for empty input', () => {
      expect(makeAbsoluteUrl('', 'https://example.com')).toBe('');
      expect(makeAbsoluteUrl(null, 'https://example.com')).toBe(null);
      expect(makeAbsoluteUrl(undefined, 'https://example.com')).toBe(undefined);
    });
  });

  describe('logConnectorError', () => {
    test('logs Error objects', () => {
      // This test just verifies the function can be called without throwing
      const error = new Error('test error');
      expect(() => logConnectorError('test-connector', error)).not.toThrow();
    });

    test('logs string messages', () => {
      expect(() => logConnectorError('test-connector', 'test message')).not.toThrow();
    });
  });
});
