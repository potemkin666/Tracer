import fs from 'fs';
import os from 'os';
import path from 'path';
import { createTelemetryStore } from '../src/telemetryStore.js';

describe('telemetry store', () => {
  test('records search outcomes and feedback persistently', () => {
    const filePath = path.join(os.tmpdir(), `tracer-telemetry-${Date.now()}.json`);
    const store = createTelemetryStore({
      filePath,
      now: () => '2026-05-03T10:00:00.000Z',
    });

    const summary = store.recordSearch({
      results: [
        { score: 81, meta: { sourceFamily: 'social' } },
        { score: 63, meta: { sourceFamily: 'archive' } },
      ],
      connectorStats: [{ id: 'demo', ok: true, count: 2 }],
    });

    expect(summary.searches).toBe(1);
    expect(summary.outcomes.highConfidence).toBe(1);
    expect(summary.topFamilies.map((entry) => entry.family)).toEqual(expect.arrayContaining(['social', 'archive']));

    const updated = store.recordFeedback({ family: 'social', verdict: 'falsePositive' });
    expect(updated.feedback.falsePositive).toBe(1);

    const persisted = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    expect(persisted.searches).toBe(1);
    expect(persisted.feedback.falsePositive).toBe(1);
  });
});
