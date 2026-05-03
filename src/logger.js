const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

function normaliseLevel(level) {
  return LEVELS[level] !== undefined ? level : 'info';
}

const configuredLevel = normaliseLevel(process.env.TRACER_LOG_LEVEL || 'info');

function shouldLog(level) {
  return LEVELS[level] <= LEVELS[configuredLevel];
}

function emit(level, message, meta = {}) {
  if (!shouldLog(level)) return;
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    message,
    ...meta,
  });
  const stream = level === 'error' ? process.stderr : process.stdout;
  stream.write(`${line}\n`);
}

export const logger = {
  error(message, meta) {
    emit('error', message, meta);
  },
  warn(message, meta) {
    emit('warn', message, meta);
  },
  info(message, meta) {
    emit('info', message, meta);
  },
  debug(message, meta) {
    emit('debug', message, meta);
  },
};
