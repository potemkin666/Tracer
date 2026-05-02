import { AsyncLocalStorage } from 'async_hooks';

const requestContextStorage = new AsyncLocalStorage();

export class RequestAbortedError extends Error {
  constructor(message = 'request aborted', reason) {
    super(message);
    this.name = 'RequestAbortedError';
    this.code = 'ABORT_ERR';
    this.reason = reason;
  }
}

function toAbortError(reason, fallbackMessage = 'request aborted') {
  if (reason instanceof RequestAbortedError) return reason;
  if (reason instanceof Error) {
    return new RequestAbortedError(reason.message || fallbackMessage, reason);
  }
  return new RequestAbortedError(fallbackMessage, reason);
}

export function createAbortError(message = 'request aborted') {
  return new RequestAbortedError(message);
}

export function runWithRequestContext(context, fn) {
  const parentContext = requestContextStorage.getStore() || {};
  return requestContextStorage.run({ ...parentContext, ...context }, fn);
}

export function getRequestContext() {
  return requestContextStorage.getStore() || {};
}

export function getRequestSignal() {
  return getRequestContext().signal;
}

export function throwIfAborted(signal = getRequestSignal()) {
  if (signal?.aborted) {
    throw toAbortError(signal.reason);
  }
}

export function combineSignals(...signals) {
  const activeSignals = signals.filter(Boolean);
  if (activeSignals.length === 0) return undefined;
  if (activeSignals.length === 1) return activeSignals[0];
  if (typeof globalThis.AbortSignal?.any === 'function') {
    return globalThis.AbortSignal.any(activeSignals);
  }

  const controller = new globalThis.AbortController();
  const abort = (signal) => {
    if (!controller.signal.aborted) {
      controller.abort(signal.reason);
    }
  };

  for (const signal of activeSignals) {
    if (signal.aborted) {
      abort(signal);
      break;
    }
    signal.addEventListener('abort', () => abort(signal), { once: true });
  }

  return controller.signal;
}

export function isAbortError(error) {
  return error?.code === 'ABORT_ERR'
    || error?.code === 'ERR_CANCELED'
    || error?.name === 'AbortError'
    || error?.name === 'CanceledError';
}

export function normaliseAbortError(error, signal, fallbackMessage = 'request aborted') {
  if (signal?.aborted) {
    return toAbortError(signal.reason, fallbackMessage);
  }
  if (isAbortError(error)) {
    return toAbortError(error, fallbackMessage);
  }
  return error;
}
