import { SearchValidationError, normaliseSearchRequest } from '../src/searchOptions.js';

describe('normaliseSearchRequest', () => {
  test('trims input and coerces booleans', () => {
    expect(normaliseSearchRequest({
      input: '  alice  ',
      mode: 'aggressive',
      fossils: 'true',
      avatars: true,
      timeSliceMode: 'false',
      documents: 1,
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
});
