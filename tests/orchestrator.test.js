import {
  createProgressTracker,
  pruneQueries,
  resolveConnectorRuntime,
} from '../src/orchestrator.js';
import { ORCHESTRATOR_DEFAULTS } from '../src/runtimeConfig.js';

describe('pruneQueries', () => {
  test('keeps all queries when connector count is low', () => {
    const queries = ['a', 'b', 'c', 'd', 'e'];
    expect(pruneQueries(queries, 2, 'normal')).toEqual(queries);
  });

  test('prunes low-priority queries when connector count is high', () => {
    const queries = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9'];
    expect(pruneQueries(queries, 100, 'normal')).toEqual(['q1', 'q2', 'q3', 'q4']);
  });

  test('keeps a broader aggressive-mode slice', () => {
    const queries = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9'];
    expect(pruneQueries(queries, 100, 'aggressive')).toEqual(['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8']);
  });
});

describe('createProgressTracker', () => {
  test('reports cumulative connector results instead of per-batch totals', () => {
    const events = [];
    const tracker = createProgressTracker((event) => events.push(event), [], null);

    tracker.recordSuccess('alpha', Date.now(), [{ url: 'https://a.com' }, { url: 'https://b.com' }]);
    tracker.recordSuccess('beta', Date.now(), [{ url: 'https://c.com' }]);
    tracker.recordFailure('gamma', Date.now(), new Error('boom'));

    expect(events).toEqual([
      { phase: 'connectors', connector: 'alpha', batchResults: 2, resultsSoFar: 2 },
      { phase: 'connectors', connector: 'beta', batchResults: 1, resultsSoFar: 3 },
      { phase: 'connectors', connector: 'gamma', error: 'boom', resultsSoFar: 3 },
    ]);
  });
});

describe('resolveConnectorRuntime', () => {
  test('applies defaults when metadata does not override runtime settings', () => {
    expect(resolveConnectorRuntime({})).toEqual({
      timeoutMs: ORCHESTRATOR_DEFAULTS.connectorTimeoutMs,
      retries: ORCHESTRATOR_DEFAULTS.connectorRetries,
    });
  });

  test('respects per-connector runtime overrides from metadata', () => {
    expect(resolveConnectorRuntime({
      runtime: { timeoutMs: 20_000, retries: 2 },
    })).toEqual({
      timeoutMs: 20_000,
      retries: 2,
    });
  });
});
