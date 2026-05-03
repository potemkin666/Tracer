import {
  SearchValidationError,
  coerceBoolean,
  normaliseSearchRequest,
} from '../src/searchOptions.js';

describe('normaliseSearchRequest', () => {
  test('trims input and coerces booleans', () => {
    expect(normaliseSearchRequest({
      input: '  alice  ',
      mode: 'aggressive',
      fossils: 'true',
      avatars: true,
      timeSliceMode: 'false',
      documents: 'true',
    })).toEqual({
      input: 'alice',
      mode: 'aggressive',
      fossils: true,
      avatars: true,
      timeSliceMode: false,
      documents: true,
    });
  });

  test('falls back to normal mode for unsupported values', () => {
    expect(normaliseSearchRequest({ input: 'alice', mode: 'turbo' }).mode).toBe('normal');
  });

  test('rejects missing input', () => {
    expect(() => normaliseSearchRequest({ mode: 'normal' }))
      .toThrow(SearchValidationError);
  });

  test('rejects oversized input', () => {
    expect(() => normaliseSearchRequest({ input: 'a'.repeat(501) }))
      .toThrow('input too long');
  });

  test('defaults omitted booleans to false', () => {
    expect(normaliseSearchRequest({ input: 'alice' })).toEqual({
      input: 'alice',
      mode: 'normal',
      fossils: false,
      avatars: false,
      timeSliceMode: false,
      documents: false,
    });
  });

  test('rejects unexpected boolean values', () => {
    expect(() => normaliseSearchRequest({ input: 'alice', documents: 1 }))
      .toThrow('documents must be true or false');
  });
});

describe('coerceBoolean', () => {
  test('accepts nullish values as false', () => {
    expect(coerceBoolean(undefined, 'avatars')).toBe(false);
    expect(coerceBoolean(null, 'avatars')).toBe(false);
  });

  test('rejects non-boolean values', () => {
    expect(() => coerceBoolean('yes', 'avatars')).toThrow(SearchValidationError);
    expect(() => coerceBoolean(1, 'avatars')).toThrow('avatars must be true or false');
  });
});
