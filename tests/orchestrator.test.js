import { pruneQueries } from '../src/orchestrator.js';

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
