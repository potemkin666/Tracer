import {
  combineSignals,
  createAbortError,
  isAbortError,
  normaliseAbortError,
  throwIfAborted,
} from '../src/requestContext.js';

describe('requestContext helpers', () => {
  test('combineSignals aborts when any source signal aborts', () => {
    const a = new globalThis.AbortController();
    const b = new globalThis.AbortController();
    const signal = combineSignals(a.signal, b.signal);

    a.abort(createAbortError('stopped'));

    expect(signal.aborted).toBe(true);
    expect(() => throwIfAborted(signal)).toThrow('stopped');
  });

  test('normaliseAbortError maps abort-like errors to request aborts', () => {
    const controller = new globalThis.AbortController();
    controller.abort(createAbortError('client disconnected'));

    const err = normaliseAbortError(new Error('canceled'), controller.signal);
    expect(isAbortError(err)).toBe(true);
    expect(err.message).toBe('client disconnected');
  });
});
