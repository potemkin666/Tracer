import fs from 'fs/promises';
import fsSync from 'fs';
import os from 'os';
import path from 'path';

function defaultFilePath() {
  return process.env.TRACER_TELEMETRY_PATH
    || path.join(os.tmpdir(), 'tracer-telemetry.json');
}

function emptyState() {
  return {
    searches: 0,
    lastUpdatedAt: null,
    families: {},
    outcomes: { highConfidence: 0, weakOnly: 0, empty: 0 },
    feedback: { helpful: 0, falsePositive: 0 },
    connectors: {},
  };
}

function safeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

async function ensureParentDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function loadState(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...emptyState(),
      ...safeObject(parsed),
      outcomes: { ...emptyState().outcomes, ...safeObject(parsed?.outcomes) },
      feedback: { ...emptyState().feedback, ...safeObject(parsed?.feedback) },
      families: safeObject(parsed?.families),
      connectors: safeObject(parsed?.connectors),
    };
  } catch {
    return emptyState();
  }
}

function loadStateSync(filePath) {
  try {
    const raw = fsSync.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...emptyState(),
      ...safeObject(parsed),
      outcomes: { ...emptyState().outcomes, ...safeObject(parsed?.outcomes) },
      feedback: { ...emptyState().feedback, ...safeObject(parsed?.feedback) },
      families: safeObject(parsed?.families),
      connectors: safeObject(parsed?.connectors),
    };
  } catch {
    return emptyState();
  }
}

export function summariseTelemetry(state = emptyState()) {
  const topFamilies = Object.entries(safeObject(state.families))
    .sort(([, left], [, right]) => (right.wins || 0) - (left.wins || 0))
    .slice(0, 5)
    .map(([family, stats]) => ({
      family,
      wins: stats.wins || 0,
      falsePositives: stats.falsePositives || 0,
      helpful: stats.helpful || 0,
    }));

  const topConnectors = Object.entries(safeObject(state.connectors))
    .sort(([, left], [, right]) => (right.ok || 0) - (left.ok || 0))
    .slice(0, 5)
    .map(([id, stats]) => ({
      id,
      ok: stats.ok || 0,
      fail: stats.fail || 0,
      results: stats.results || 0,
    }));

  return {
    searches: state.searches || 0,
    lastUpdatedAt: state.lastUpdatedAt || null,
    outcomes: { ...emptyState().outcomes, ...safeObject(state.outcomes) },
    feedback: { ...emptyState().feedback, ...safeObject(state.feedback) },
    topFamilies,
    topConnectors,
  };
}

export function createTelemetryStore({
  filePath = defaultFilePath(),
  now = () => new Date().toISOString(),
  writeDebounceMs = parseInt(process.env.TRACER_TELEMETRY_WRITE_DEBOUNCE_MS, 10) || 5000,
} = {}) {
  let state = loadStateSync(filePath);
  let writeTimeout = null;
  let pendingWrite = false;

  // Async persist with debouncing to reduce I/O frequency
  async function persist() {
    if (writeTimeout) {
      clearTimeout(writeTimeout);
    }

    writeTimeout = setTimeout(async () => {
      if (pendingWrite) return;
      pendingWrite = true;
      
      try {
        await ensureParentDir(filePath);
        await fs.writeFile(filePath, JSON.stringify(state, null, 2));
      } catch (err) {
        // Log error but don't throw - telemetry failures shouldn't break the app
        console.error('Failed to persist telemetry:', err.message);
      } finally {
        pendingWrite = false;
        writeTimeout = null;
      }
    }, writeDebounceMs);
  }

  // Force immediate write (for graceful shutdown)
  async function flush() {
    if (writeTimeout) {
      clearTimeout(writeTimeout);
      writeTimeout = null;
    }
    if (pendingWrite) return;
    
    try {
      await ensureParentDir(filePath);
      await fs.writeFile(filePath, JSON.stringify(state, null, 2));
    } catch (err) {
      console.error('Failed to flush telemetry:', err.message);
    }
  }

  function recordSearch({ results = [], connectorStats = [] } = {}) {
    state.searches += 1;
    state.lastUpdatedAt = now();

    if (!results.length) {
      state.outcomes.empty += 1;
    } else if (results.some((result) => (result.score || 0) >= 70)) {
      state.outcomes.highConfidence += 1;
    } else {
      state.outcomes.weakOnly += 1;
    }

    const winningFamilies = new Set(
      results
        .slice(0, 5)
        .map((result) => result.meta?.sourceFamily)
        .filter(Boolean)
    );

    winningFamilies.forEach((family) => {
      state.families[family] = state.families[family] || { wins: 0, falsePositives: 0, helpful: 0 };
      state.families[family].wins += 1;
    });

    connectorStats.forEach((stat) => {
      if (!stat?.id) return;
      state.connectors[stat.id] = state.connectors[stat.id] || { ok: 0, fail: 0, results: 0 };
      if (stat.ok) {
        state.connectors[stat.id].ok += 1;
        state.connectors[stat.id].results += stat.count || 0;
      } else {
        state.connectors[stat.id].fail += 1;
      }
    });

    persist();
    return summariseTelemetry(state);
  }

  function recordFeedback({ family, verdict } = {}) {
    if (!family || (verdict !== 'helpful' && verdict !== 'falsePositive')) {
      return summariseTelemetry(state);
    }
    state.families[family] = state.families[family] || { wins: 0, falsePositives: 0, helpful: 0 };
    if (verdict === 'helpful') {
      state.feedback.helpful += 1;
      state.families[family].helpful += 1;
    } else {
      state.feedback.falsePositive += 1;
      state.families[family].falsePositives += 1;
    }
    state.lastUpdatedAt = now();
    persist();
    return summariseTelemetry(state);
  }

  return {
    recordSearch,
    recordFeedback,
    getSummary() {
      return summariseTelemetry(state);
    },
    flush,
  };
}
