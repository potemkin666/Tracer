export const MAX_INPUT_LENGTH = 500;
const ALLOWED_MODES = new Set(['normal', 'aggressive']);

export class SearchValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SearchValidationError';
    this.statusCode = 400;
  }
}

export function coerceBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return Boolean(value);
}

export function normaliseMode(mode) {
  return ALLOWED_MODES.has(mode) ? mode : 'normal';
}

export function normaliseInput(input) {
  if (typeof input !== 'string') {
    throw new SearchValidationError('input is required');
  }

  const value = input.trim();
  if (!value) {
    throw new SearchValidationError('input is required');
  }
  if (value.length > MAX_INPUT_LENGTH) {
    throw new SearchValidationError(`input too long (max ${MAX_INPUT_LENGTH} chars)`);
  }

  return value;
}

export function normaliseSearchRequest(payload = {}) {
  const {
    input,
    mode,
    fossils,
    avatars,
    timeSliceMode,
    documents,
  } = payload || {};

  return {
    input: normaliseInput(input),
    mode: normaliseMode(mode),
    fossils: coerceBoolean(fossils),
    avatars: coerceBoolean(avatars),
    timeSliceMode: coerceBoolean(timeSliceMode),
    documents: coerceBoolean(documents),
  };
}
