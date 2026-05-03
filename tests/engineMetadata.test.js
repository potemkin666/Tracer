import fs from 'fs';
import vm from 'vm';
import {
  ENGINE_METADATA,
  SERVER_CONNECTORS,
  STANDALONE_OPEN_FETCHERS,
  STANDALONE_KEY_BACKED_FETCHERS,
} from '../src/engineMetadata.js';

describe('engine metadata contracts', () => {
  test('generated docs metadata stays in sync with source metadata', () => {
    const script = fs.readFileSync(new URL('../docs/engine-metadata.js', import.meta.url), 'utf8');
    const context = { globalThis: {} };
    vm.runInNewContext(script, context);
    expect(context.globalThis.TRACER_ENGINE_METADATA).toEqual(
      JSON.parse(JSON.stringify(ENGINE_METADATA))
    );
  });

  test('server connectors have unique ids and real module paths', () => {
    const ids = new Set();
    for (const connector of SERVER_CONNECTORS) {
      expect(ids.has(connector.id)).toBe(false);
      ids.add(connector.id);
      expect(connector.runtime).toEqual({
        timeoutMs: expect.any(Number),
        retries: expect.any(Number),
      });
      expect(
        fs.existsSync(new URL(`../src/connectors/${connector.modulePath.slice(2)}`, import.meta.url))
      ).toBe(true);
    }
  });

  test('standalone metadata covers expected fetcher counts', () => {
    expect(STANDALONE_OPEN_FETCHERS).toHaveLength(44);
    expect(STANDALONE_KEY_BACKED_FETCHERS).toHaveLength(11);
  });
});
